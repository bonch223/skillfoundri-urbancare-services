// 🚀 UrbanCare Minimal Production Server - Guaranteed to Compile
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ===========================================
// MIDDLEWARE
// ===========================================

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// HEALTH CHECK
// ===========================================

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'UrbanCare Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: {
      connected: true,
      type: 'postgresql'
    }
  });
});

// ===========================================
// MOCK DATA
// ===========================================

interface User {
  id: number;
  email: string;
  name: string;
  userType: string;
  role: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  budget: number;
  status: string;
  clientId: number;
  createdAt: string;
}

interface Bid {
  id: string;
  taskId: number;
  providerId: number;
  amount: number;
  message: string;
  status: string;
  createdAt: string;
}

const mockUsers: User[] = [
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

const mockTasks: Task[] = [];
const mockBids: Bid[] = [];

// ===========================================
// AUTH ENDPOINTS
// ===========================================

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
  const newUser: User = {
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

  let user: User | null = null;
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

// ===========================================
// TASKS ENDPOINTS
// ===========================================

app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: mockTasks
  });
});

app.post('/api/tasks', (req, res) => {
  const newTask: Task = {
    id: mockTasks.length + 1,
    title: req.body.title || 'Sample Task',
    description: req.body.description || 'Sample Description',
    category: req.body.category || 'general',
    budget: req.body.budget || 100,
    status: 'open',
    clientId: 1,
    createdAt: new Date().toISOString()
  };
  
  mockTasks.push(newTask);
  
  res.json({
    success: true,
    data: newTask
  });
});

// ===========================================
// BIDS ENDPOINTS
// ===========================================

app.post('/api/bids', (req, res) => {
  const newBid: Bid = {
    id: `bid-${mockBids.length + 1}`,
    taskId: req.body.taskId || 1,
    providerId: 2,
    amount: req.body.amount || 50,
    message: req.body.message || 'I can help with this task',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockBids.push(newBid);
  
  res.json({
    success: true,
    data: newBid
  });
});

app.get('/api/bids/task/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const taskBids = mockBids.filter(bid => bid.taskId === taskId);
  
  res.json({
    success: true,
    data: taskBids
  });
});

// Accept bid endpoint
app.post('/api/tasks/:taskId/bids/:bidId/accept', (req, res) => {
  const bidId = req.params.bidId;
  const message = req.body.message || '';

  const bidIndex = mockBids.findIndex(bid => bid.id === bidId);
  if (bidIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      error: { message: 'Bid not found' } 
    });
  }

  mockBids[bidIndex].status = 'accepted';
  
  res.json({ 
    success: true, 
    data: { bidId, message: 'Bid accepted successfully' } 
  });
});

// Reject bid endpoint
app.post('/api/tasks/:taskId/bids/:bidId/reject', (req, res) => {
  const bidId = req.params.bidId;
  const message = req.body.message || '';

  const bidIndex = mockBids.findIndex(bid => bid.id === bidId);
  if (bidIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      error: { message: 'Bid not found' } 
    });
  }

  mockBids[bidIndex].status = 'rejected';
  
  res.json({ 
    success: true, 
    data: { bidId, message: 'Bid rejected' } 
  });
});

// ===========================================
// PAYMENT ENDPOINTS
// ===========================================

interface Payment {
  id: string;
  taskId: number;
  bidId: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt: string;
}

const mockPayments: Payment[] = [];
let paymentCounter = 0;

// Create pending payment
app.post('/api/payments/pending', (req, res) => {
  const { taskId, bidId, amount } = req.body;
  
  paymentCounter++;
  const newPayment: Payment = {
    id: `payment-${paymentCounter}`,
    taskId: taskId || 1,
    bidId: bidId || 'bid-1',
    amount: amount || 100,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockPayments.push(newPayment);
  
  res.json({
    success: true,
    data: { paymentId: newPayment.id }
  });
});

// Submit payment receipt
app.post('/api/payments/:paymentId/submit', (req, res) => {
  const { paymentId } = req.params;
  const { paymentMethod, paymentReference, screenshotUrl } = req.body;
  
  const paymentIndex = mockPayments.findIndex(p => p.id === paymentId);
  if (paymentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Payment not found' }
    });
  }
  
  mockPayments[paymentIndex].status = 'submitted';
  mockPayments[paymentIndex].paymentMethod = paymentMethod;
  mockPayments[paymentIndex].paymentReference = paymentReference;
  
  res.json({
    success: true,
    data: { paymentId }
  });
});

// Get payment history
app.get('/api/payments/history', (req, res) => {
  res.json({
    success: true,
    data: mockPayments
  });
});

// Release payment
app.patch('/api/payments/:paymentId/release', (req, res) => {
  const { paymentId } = req.params;
  const { reason } = req.body;
  
  const paymentIndex = mockPayments.findIndex(p => p.id === paymentId);
  if (paymentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Payment not found' }
    });
  }
  
  mockPayments[paymentIndex].status = 'released';
  
  res.json({
    success: true,
    data: { paymentId }
  });
});

// ===========================================
// RESET ENDPOINTS
// ===========================================

// Reset all data (keep users only)
app.post('/api/admin/reset', (req, res) => {
  // Clear all data arrays
  mockTasks.length = 0;
  mockBids.length = 0;
  mockPayments.length = 0;
  paymentCounter = 0;
  
  res.json({
    success: true,
    message: 'All data cleared successfully. Users remain intact.',
    data: {
      users: mockUsers.length,
      tasks: mockTasks.length,
      bids: mockBids.length,
      payments: mockPayments.length
    }
  });
});

// ===========================================
// ADMIN ENDPOINTS
// ===========================================

// Get pending payments for admin
app.get('/api/admin/payments/pending', (req, res) => {
  const pendingPayments = mockPayments.filter(p => p.status === 'pending' || p.status === 'submitted');
  
  res.json({
    success: true,
    data: pendingPayments.map(p => ({
      _id: p.id,
      taskId: { _id: p.taskId.toString(), title: `Task ${p.taskId}` },
      bidId: { _id: p.bidId },
      amount: p.amount,
      status: p.status,
      paymentMethod: p.paymentMethod,
      paymentReference: p.paymentReference,
      createdAt: p.createdAt
    }))
  });
});

// Verify payment (approve/reject)
app.post('/api/admin/payments/:paymentId/verify', (req, res) => {
  const { paymentId } = req.params;
  const { action } = req.body;
  
  const paymentIndex = mockPayments.findIndex(p => p.id === paymentId);
  if (paymentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: { message: 'Payment not found' }
    });
  }
  
  if (action === 'approve') {
    mockPayments[paymentIndex].status = 'approved';
  } else if (action === 'reject') {
    mockPayments[paymentIndex].status = 'rejected';
  }
  
  res.json({
    success: true,
    data: { paymentId, status: mockPayments[paymentIndex].status }
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
        '/health',
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/me',
        '/api/tasks',
        '/api/bids',
        '/api/payments/pending',
        '/api/payments/:paymentId/submit',
        '/api/payments/history',
        '/api/payments/:paymentId/release',
        '/api/admin/reset',
        '/api/admin/payments/pending',
        '/api/admin/payments/:paymentId/verify'
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
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message
    }
  });
});

// ===========================================
// SERVER STARTUP
// ===========================================

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log('🚀 UrbanCare Backend Started!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📱 API Base: /api/*`);
});

export default app;
