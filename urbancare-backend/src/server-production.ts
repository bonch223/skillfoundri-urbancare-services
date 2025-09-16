// 🚀 UrbanCare Production Server - Multi-Platform Backend
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { Database } from './config/database';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CORS_ORIGIN_MOBILE,
      process.env.CORS_ORIGIN_WEB,
      process.env.CORS_ORIGIN_ADMIN,
      ...(process.env.CORS_ORIGIN_LOCAL?.split(',') || [])
    ].filter(Boolean),
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
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: { message: 'Too many requests from this IP, please try again later.' }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration for all platforms
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN_MOBILE,
      process.env.CORS_ORIGIN_WEB,
      process.env.CORS_ORIGIN_ADMIN,
      ...(process.env.CORS_ORIGIN_LOCAL?.split(',') || [])
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));

// Compression and parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// HEALTH CHECK & MONITORING
// ===========================================

app.get('/health', async (req, res) => {
  try {
    const dbHealth = await Database.healthCheck();
    const dbStats = Database.getStats();
    
    res.json({
      status: 'OK',
      message: 'UrbanCare Multi-Platform Backend is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: dbHealth,
        stats: dbStats
      },
      platforms: {
        mobile: process.env.CORS_ORIGIN_MOBILE ? 'configured' : 'not configured',
        web: process.env.CORS_ORIGIN_WEB ? 'configured' : 'not configured',
        admin: process.env.CORS_ORIGIN_ADMIN ? 'configured' : 'not configured'
      },
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
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

// Import route handlers
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import bidRoutes from './routes/bids';
import userRoutes from './routes/users';
import paymentRoutes from './routes/payments';
import messageRoutes from './routes/messages';
import adminRoutes from './routes/admin';

// API versioning for different platforms
const API_VERSION = process.env.API_VERSION || 'v1';

// Mobile App API Routes
app.use(`/api/${API_VERSION}/mobile/auth`, authRoutes);
app.use(`/api/${API_VERSION}/mobile/tasks`, taskRoutes);
app.use(`/api/${API_VERSION}/mobile/bids`, bidRoutes);
app.use(`/api/${API_VERSION}/mobile/users`, userRoutes);
app.use(`/api/${API_VERSION}/mobile/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/mobile/messages`, messageRoutes);

// Web Portal API Routes
app.use(`/api/${API_VERSION}/web/auth`, authRoutes);
app.use(`/api/${API_VERSION}/web/tasks`, taskRoutes);
app.use(`/api/${API_VERSION}/web/bids`, bidRoutes);
app.use(`/api/${API_VERSION}/web/users`, userRoutes);
app.use(`/api/${API_VERSION}/web/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/web/messages`, messageRoutes);

// Admin Dashboard API Routes
app.use(`/api/${API_VERSION}/admin/auth`, authRoutes);
app.use(`/api/${API_VERSION}/admin/tasks`, taskRoutes);
app.use(`/api/${API_VERSION}/admin/bids`, bidRoutes);
app.use(`/api/${API_VERSION}/admin/users`, userRoutes);
app.use(`/api/${API_VERSION}/admin/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/admin/messages`, messageRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);

// Legacy API routes for backward compatibility
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);

// ===========================================
// SOCKET.IO FOR REAL-TIME FEATURES
// ===========================================

io.on('connection', (socket) => {
  logger.info(`🔌 Client connected: ${socket.id}`);
  
  // Join task-specific rooms for real-time updates
  socket.on('join-task', (taskId: string) => {
    socket.join(`task-${taskId}`);
    logger.info(`📋 Client ${socket.id} joined task room: ${taskId}`);
  });
  
  // Join conversation rooms for messaging
  socket.on('join-conversation', (conversationId: string) => {
    socket.join(`conversation-${conversationId}`);
    logger.info(`💬 Client ${socket.id} joined conversation: ${conversationId}`);
  });
  
  // Handle bid notifications
  socket.on('bid-notification', (data: any) => {
    socket.to(`task-${data.taskId}`).emit('new-bid', data);
  });
  
  // Handle task status updates
  socket.on('task-update', (data: any) => {
    socket.to(`task-${data.taskId}`).emit('task-status-changed', data);
  });
  
  socket.on('disconnect', () => {
    logger.info(`🔌 Client disconnected: ${socket.id}`);
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
        `/api/${API_VERSION}/mobile/*`,
        `/api/${API_VERSION}/web/*`,
        `/api/${API_VERSION}/admin/*`,
        '/health'
      ]
    }
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Global error handler:', {
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
    // Connect to database
    await Database.connect();
    
    // Start server
    server.listen(PORT, '0.0.0.0', () => {
      logger.info('🚀 UrbanCare Multi-Platform Backend Started!');
      logger.info(`📡 Server running on port ${PORT}`);
      logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📱 Mobile API: /api/${API_VERSION}/mobile/*`);
      logger.info(`🌍 Web API: /api/${API_VERSION}/web/*`);
      logger.info(`⚙️ Admin API: /api/${API_VERSION}/admin/*`);
      logger.info(`💬 WebSocket: Enabled for real-time features`);
      logger.info(`🔍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('🛑 SIGTERM received, shutting down gracefully');
  await Database.disconnect();
  server.close(() => {
    logger.info('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('🛑 SIGINT received, shutting down gracefully');
  await Database.disconnect();
  server.close(() => {
    logger.info('✅ Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export { app, server, io };
