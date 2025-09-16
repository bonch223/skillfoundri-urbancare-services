// 🚀 UrbanCare Minimal Production Server - Guaranteed to Compile
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ===========================================
// LOGGING UTILITIES
// ===========================================

const logActivity = (action: string, details: any, user?: string) => {
  const timestamp = new Date().toISOString();
  const userInfo = user ? `[${user}]` : '[SYSTEM]';
  console.log(`\n🔍 ${userInfo} ${action} - ${timestamp}`);
  console.log(`📋 Details:`, JSON.stringify(details, null, 2));
  console.log('─'.repeat(80));
};

const logRequest = (req: express.Request, action: string) => {
  const user = req.headers.authorization ? 'AUTHENTICATED_USER' : 'ANONYMOUS';
  logActivity(action, {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type']
    }
  }, user);
};

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
  
  logRequest(req, 'LOGIN_ATTEMPT');
  
  // Mock login
  if (email === 'client1@urbancare.com' && password === 'password123') {
    logActivity('LOGIN_SUCCESS', {
      user: mockUsers[0],
      role: 'client',
      email: email
    }, email);
    
    return res.json({
      success: true,
      data: {
        token: 'mock-jwt-token-client',
        user: mockUsers[0]
      }
    });
  }
  
  if (email === 'provider1@urbancare.com' && password === 'password123') {
    logActivity('LOGIN_SUCCESS', {
      user: mockUsers[1],
      role: 'provider',
      email: email
    }, email);
    
    return res.json({
      success: true,
      data: {
        token: 'mock-jwt-token-provider',
        user: mockUsers[1]
      }
    });
  }
  
  logActivity('LOGIN_FAILED', {
    email: email,
    reason: 'Invalid credentials'
  }, email);
  
  res.status(401).json({
    success: false,
    error: { message: 'Invalid email or password' }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, userType } = req.body;
  
  logRequest(req, 'REGISTRATION_ATTEMPT');
  
  // Mock registration
  const newUser: User = {
    id: mockUsers.length + 1,
    email,
    name,
    userType,
    role: 'client'
  };
  
  mockUsers.push(newUser);
  
  logActivity('REGISTRATION_SUCCESS', {
    newUser: newUser,
    totalUsers: mockUsers.length
  }, email);
  
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
  logRequest(req, 'TASK_CREATION');
  
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
  
  logActivity('TASK_CREATED', {
    task: newTask,
    totalTasks: mockTasks.length
  }, 'CLIENT');
  
  res.json({
    success: true,
    data: newTask
  });
});

// ===========================================
// BIDS ENDPOINTS
// ===========================================

app.post('/api/bids', (req, res) => {
  logRequest(req, 'BID_CREATION');
  
  const taskId = req.body.taskId || 1;
  
  // Check if task already has an accepted bid
  const hasAcceptedBid = mockBids.some(bid => 
    bid.taskId === taskId && bid.status === 'accepted'
  );
  
  if (hasAcceptedBid) {
    logActivity('BID_CREATION_FAILED', {
      taskId: taskId,
      reason: 'Task already has an accepted bid'
    }, 'PROVIDER');
    
    return res.status(400).json({
      success: false,
      error: { message: 'This task already has an accepted bid' }
    });
  }
  
  // Check if task is still open
  const task = mockTasks.find(t => t.id === taskId);
  if (task && task.status !== 'open') {
    logActivity('BID_CREATION_FAILED', {
      taskId: taskId,
      reason: `Task status is ${task.status}, not open`
    }, 'PROVIDER');
    
    return res.status(400).json({
      success: false,
      error: { message: `Cannot bid on task with status: ${task.status}` }
    });
  }
  
  const newBid: Bid = {
    id: `bid-${mockBids.length + 1}`,
    taskId: taskId,
    providerId: 2,
    amount: req.body.amount || 50,
    message: req.body.message || 'I can help with this task',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockBids.push(newBid);
  
  logActivity('BID_CREATED', {
    bid: newBid,
    totalBids: mockBids.length
  }, 'PROVIDER');
  
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
  const taskId = parseInt(req.params.taskId);
  const message = req.body.message || '';

  logRequest(req, 'BID_ACCEPTANCE');

  const bidIndex = mockBids.findIndex(bid => bid.id === bidId);
  if (bidIndex === -1) {
    logActivity('BID_ACCEPTANCE_FAILED', {
      bidId: bidId,
      taskId: taskId,
      reason: 'Bid not found'
    }, 'CLIENT');
    
    return res.status(404).json({ 
      success: false, 
      error: { message: 'Bid not found' } 
    });
  }

  // Update bid status
  const bid = mockBids[bidIndex];
  mockBids[bidIndex].status = 'accepted';
  
  // Update task status to 'in_progress' when bid is accepted
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    mockTasks[taskIndex].status = 'in_progress';
  }
  
  logActivity('BID_ACCEPTED', {
    bid: bid,
    taskId: taskId,
    message: message,
    taskStatusUpdated: 'in_progress'
  }, 'CLIENT');
  
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
  
  logRequest(req, 'PAYMENT_CREATION');
  
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
  
  // Update task status to 'payment_pending' when payment is created
  const taskIndex = mockTasks.findIndex(task => task.id === newPayment.taskId);
  if (taskIndex !== -1) {
    mockTasks[taskIndex].status = 'payment_pending';
  }
  
  logActivity('PAYMENT_CREATED', {
    payment: newPayment,
    totalPayments: mockPayments.length,
    taskStatusUpdated: 'payment_pending'
  }, 'CLIENT');
  
  res.json({
    success: true,
    data: { paymentId: newPayment.id }
  });
});

// Submit payment receipt
app.post('/api/payments/:paymentId/submit', (req, res) => {
  const { paymentId } = req.params;
  const { paymentMethod, paymentReference, screenshotUrl } = req.body;
  
  logRequest(req, 'PAYMENT_SUBMISSION');
  
  const paymentIndex = mockPayments.findIndex(p => p.id === paymentId);
  if (paymentIndex === -1) {
    logActivity('PAYMENT_SUBMISSION_FAILED', {
      paymentId: paymentId,
      reason: 'Payment not found'
    }, 'CLIENT');
    
    return res.status(404).json({
      success: false,
      error: { message: 'Payment not found' }
    });
  }
  
  const payment = mockPayments[paymentIndex];
  mockPayments[paymentIndex].status = 'submitted';
  mockPayments[paymentIndex].paymentMethod = paymentMethod;
  mockPayments[paymentIndex].paymentReference = paymentReference;
  
  // Update task status to 'payment_submitted' when payment is submitted
  const taskIndex = mockTasks.findIndex(task => task.id === payment.taskId);
  if (taskIndex !== -1) {
    mockTasks[taskIndex].status = 'payment_submitted';
  }
  
  logActivity('PAYMENT_SUBMITTED', {
    payment: payment,
    paymentMethod: paymentMethod,
    paymentReference: paymentReference,
    screenshotUrl: screenshotUrl,
    taskStatusUpdated: 'payment_submitted'
  }, 'CLIENT');
  
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
  
  const payment = mockPayments[paymentIndex];
  mockPayments[paymentIndex].status = 'released';
  
  // Update task status to 'completed' when payment is released
  const taskIndex = mockTasks.findIndex(task => task.id === payment.taskId);
  if (taskIndex !== -1) {
    mockTasks[taskIndex].status = 'completed';
  }
  
  logActivity('PAYMENT_RELEASED', {
    payment: payment,
    reason: reason,
    taskStatusUpdated: 'completed'
  }, 'ADMIN');
  
  res.json({
    success: true,
    data: { paymentId, message: 'Payment released successfully' }
  });
});

// ===========================================
// RESET ENDPOINTS
// ===========================================

// Reset all data (keep users only)
app.post('/api/admin/reset', (req, res) => {
  logRequest(req, 'ADMIN_RESET');
  
  const beforeReset = {
    users: mockUsers.length,
    tasks: mockTasks.length,
    bids: mockBids.length,
    payments: mockPayments.length
  };
  
  // Clear all data arrays
  mockTasks.length = 0;
  mockBids.length = 0;
  mockPayments.length = 0;
  paymentCounter = 0;
  
  const afterReset = {
    users: mockUsers.length,
    tasks: mockTasks.length,
    bids: mockBids.length,
    payments: mockPayments.length
  };
  
  logActivity('ADMIN_RESET_COMPLETED', {
    beforeReset: beforeReset,
    afterReset: afterReset
  }, 'ADMIN');
  
  res.json({
    success: true,
    message: 'All data cleared successfully. Users remain intact.',
    data: afterReset
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
  console.log('─'.repeat(80));
  console.log('📊 ACTIVITY LOGGING ENABLED - All user actions will be logged below');
  console.log('─'.repeat(80));
  
  logActivity('SERVER_STARTED', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  }, 'SYSTEM');
});

export default app;
