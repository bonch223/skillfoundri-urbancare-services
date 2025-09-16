import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test data storage
const users: any[] = [];
const tasks: any[] = [];
const bids: any[] = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'UrbanCare Backend is running!',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock login
  if (email === 'client1@urbancare.com' && password === 'password123') {
    return res.json({
      success: true,
      data: {
        token: 'mock-jwt-token-client',
        user: {
          id: 1,
          email: 'client1@urbancare.com',
          name: 'Maria Santos',
          userType: 'individual',
          role: 'client'
        }
      }
    });
  }
  
  if (email === 'provider1@urbancare.com' && password === 'password123') {
    return res.json({
      success: true,
      data: {
        token: 'mock-jwt-token-provider',
        user: {
          id: 2,
          email: 'provider1@urbancare.com',
          name: 'Ana Reyes',
          userType: 'individual',
          role: 'provider'
        }
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
    id: users.length + 1,
    email,
    name,
    userType,
    role: 'client'
  };
  
  users.push(newUser);
  
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

  let user: any = null;
  if (token === 'mock-jwt-token-client') {
    user = {
      id: 1,
      email: 'client1@urbancare.com',
      name: 'Maria Santos',
      userType: 'individual',
      role: 'client',
    };
  } else if (token === 'mock-jwt-token-provider') {
    user = {
      id: 2,
      email: 'provider1@urbancare.com',
      name: 'Ana Reyes',
      userType: 'individual',
      role: 'provider',
    };
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
    data: tasks
  });
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    ...req.body,
    status: 'open',
    createdAt: new Date().toISOString(),
    clientId: 1 // Mock client ID
  };
  
  tasks.push(newTask);
  
  res.json({
    success: true,
    data: newTask
  });
});

// Bids endpoints
app.post('/api/bids', (req, res) => {
  const newBid = {
    id: `bid-${bids.length + 1}`,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
    providerId: 2 // Mock provider ID
  };
  
  bids.push(newBid);
  
  // Update task bids count if task exists
  const task = tasks.find(t => t.id?.toString() === newBid.taskId?.toString());
  if (task) {
    (task as any).bidsCount = ((task as any).bidsCount || 0) + 1;
  }
  
  res.json({
    success: true,
    data: newBid
  });
});

// Get bids for a task
app.get('/api/bids/task/:taskId', (req, res) => {
  const { taskId } = req.params;
  const taskBids = bids.filter(bid => bid.taskId?.toString() === taskId.toString());
  
  res.json({
    success: true,
    data: taskBids
  });
});

// Accept bid (preferred by frontend)
app.post('/api/tasks/:taskId/bids/:bidId/accept', (req, res) => {
  const { bidId } = req.params;
  const { message } = req.body || {};

  const bidIndex = bids.findIndex(bid => bid.id?.toString() === bidId.toString());
  if (bidIndex === -1) {
    return res.status(404).json({ success: false, error: { message: 'Bid not found' } });
  }

  bids[bidIndex].status = 'accepted';
  (bids[bidIndex] as any).responseMessage = message;
  (bids[bidIndex] as any).respondedAt = new Date().toISOString();

  // Update task status to in_progress
  const task = tasks.find(t => t.id?.toString() === (bids[bidIndex] as any).taskId?.toString());
  if (task) {
    (task as any).status = 'in_progress';
    (task as any).assignedProviderId = (bids[bidIndex] as any).providerId;
  }

  res.json({ success: true, data: { bidId } });
});

// Reject bid (preferred by frontend)
app.post('/api/tasks/:taskId/bids/:bidId/reject', (req, res) => {
  const { bidId } = req.params;
  const { message } = req.body || {};

  const bidIndex = bids.findIndex(bid => bid.id?.toString() === bidId.toString());
  if (bidIndex === -1) {
    return res.status(404).json({ success: false, error: { message: 'Bid not found' } });
  }

  bids[bidIndex].status = 'rejected';
  (bids[bidIndex] as any).responseMessage = message;
  (bids[bidIndex] as any).respondedAt = new Date().toISOString();

  res.json({ success: true, data: { bidId } });
});

// Generic respond to bid endpoint (fallback)
app.patch('/api/bids/:bidId/respond', (req, res) => {
  const { bidId } = req.params;
  const { action, message } = req.body || {};

  const bidIndex = bids.findIndex(bid => bid.id?.toString() === bidId.toString());
  if (bidIndex === -1) {
    return res.status(404).json({ success: false, error: { message: 'Bid not found' } });
  }

  bids[bidIndex].status = action === 'accept' ? 'accepted' : 'rejected';
  (bids[bidIndex] as any).responseMessage = message;
  (bids[bidIndex] as any).respondedAt = new Date().toISOString();

  // If accepted, update task status
  if (action === 'accept') {
    const task = tasks.find(t => t.id?.toString() === (bids[bidIndex] as any).taskId?.toString());
    if (task) {
      (task as any).status = 'in_progress';
      (task as any).assignedProviderId = (bids[bidIndex] as any).providerId;
    }
  }

  res.json({ success: true, data: { bidId, action } });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 UrbanCare Backend running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Network access: http://192.168.100.3:${PORT}/health`);
  console.log('✅ Ready for frontend connections!');
});

export default app;