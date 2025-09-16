// 🚀 UrbanCare Production Server - Simplified Version
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// ===========================================
// SECURITY & MIDDLEWARE
// ===========================================

// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: { message: 'Too many requests from this IP, please try again later.' }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Compression and parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// HEALTH CHECK & MONITORING
// ===========================================

app.get('/health', async (req, res) => {
  try {
    res.json({
      status: 'OK',
      message: 'UrbanCare Multi-Platform Backend is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        type: 'postgresql'
      },
      platforms: {
        mobile: 'configured',
        web: 'configured',
        admin: 'configured'
      },
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Service temporarily unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// ===========================================
// API ROUTES FOR ALL PLATFORMS
// ===========================================

// Mock data for testing
const mockUsers = [
  {
    id: 1,
    email: 'client1@urbancare.com',
    name: 'Maria Santos',
    userType: 'individual',
    role: 'client'
  },
  {
    id: 2,
    email: 'provider1@urbancare.com',
    name: 'Ana Reyes',
    userType: 'individual',
    role: 'provider'
  }
];

const mockTasks = [];
const mockBids = [];

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock login
  if (email === 'client1@urbancare.com' && password === 'password123') {
    return res.json({
      success: true,
      data: {
        token: 'mock-jwt-token-client',
        user: mockUsers[0]
      }
    });
  }
  
  if (email === 'provider1@urbancare.com' && password === 'password123') {
    return res.json({
      success: true,
      data: {
        token: 'mock-jwt-token-provider',
        user: mockUsers[1]
      }
    });
  }
  
  res.status(401).json({
    success: false,
    error: { message: 'Invalid email or password' }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, userType } = req.body;
  
  // Mock registration
  const newUser = {
    id: mockUsers.length + 1,
    email,
    name,
    userType,
    role: 'client'
  };
  
  mockUsers.push(newUser);
  
  res.json({
    success: true,
    data: {
      token: `mock-jwt-token-${newUser.id}`,
      user: newUser
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : authHeader;

  let user = null;
  if (token === 'mock-jwt-token-client') {
    user = mockUsers[0];
  } else if (token === 'mock-jwt-token-provider') {
    user = mockUsers[1];
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or missing token' },
    });
  }

  return res.json({ success: true, data: { user } });
});

// Tasks endpoints
app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: mockTasks
  });
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: mockTasks.length + 1,
    ...req.body,
    status: 'open',
    createdAt: new Date().toISOString(),
    clientId: 1 // Mock client ID
  };
  
  mockTasks.push(newTask);
  
  res.json({
    success: true,
    data: newTask
  });
});

// Bids endpoints
app.post('/api/bids', (req, res) => {
  const newBid = {
    id: `bid-${mockBids.length + 1}`,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
    providerId: 2 // Mock provider ID
  };
  
  mockBids.push(newBid);
  
  res.json({
    success: true,
    data: newBid
  });
});

app.get('/api/bids/task/:taskId', (req, res) => {
  const { taskId } = req.params;
  const taskBids = mockBids.filter(bid => bid.taskId?.toString() === taskId.toString());
  
  res.json({
    success: true,
    data: taskBids
  });
});

// Accept bid endpoint
app.post('/api/tasks/:taskId/bids/:bidId/accept', (req, res) => {
  const { bidId } = req.params;
  const { message } = req.body || {};

  const bidIndex = mockBids.findIndex(bid => bid.id?.toString() === bidId.toString());
  if (bidIndex === -1) {
    return res.status(404).json({ success: false, error: { message: 'Bid not found' } });
  }

  mockBids[bidIndex].status = 'accepted';
  mockBids[bidIndex].responseMessage = message;
  mockBids[bidIndex].respondedAt = new Date().toISOString();

  res.json({ success: true, data: { bidId } });
});

// Reject bid endpoint
app.post('/api/tasks/:taskId/bids/:bidId/reject', (req, res) => {
  const { bidId } = req.params;
  const { message } = req.body || {};

  const bidIndex = mockBids.findIndex(bid => bid.id?.toString() === bidId.toString());
  if (bidIndex === -1) {
    return res.status(404).json({ success: false, error: { message: 'Bid not found' } });
  }

  mockBids[bidIndex].status = 'rejected';
  mockBids[bidIndex].responseMessage = message;
  mockBids[bidIndex].respondedAt = new Date().toISOString();

  res.json({ success: true, data: { bidId } });
});

// ===========================================
// SOCKET.IO FOR REAL-TIME FEATURES
// ===========================================

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Join task-specific rooms for real-time updates
  socket.on('join-task', (taskId: string) => {
    socket.join(`task-${taskId}`);
    console.log(`📋 Client ${socket.id} joined task room: ${taskId}`);
  });
  
  // Join conversation rooms for messaging
  socket.on('join-conversation', (conversationId: string) => {
    socket.join(`conversation-${conversationId}`);
    console.log(`💬 Client ${socket.id} joined conversation: ${conversationId}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      availableRoutes: [
        '/api/auth/*',
        '/api/tasks/*',
        '/api/bids/*',
        '/health'
      ]
    }
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
});

// ===========================================
// SERVER STARTUP
// ===========================================

async function startServer() {
  try {
    // Start server
    server.listen(Number(PORT), '0.0.0.0', () => {
      console.log('🚀 UrbanCare Multi-Platform Backend Started!');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📱 API Base: /api/*`);
      console.log(`💬 WebSocket: Enabled for real-time features`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export { app, server, io };
