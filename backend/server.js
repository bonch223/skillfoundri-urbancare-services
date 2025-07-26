import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import serviceRoutes from './routes/services.js';
import userRoutes from './routes/users.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5174',
    'http://localhost:5173', // Vite default port
    'http://localhost:5174'  // Alternative port
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Optimize MongoDB connection for serverless
const connectDB = async () => {
  try {
    // Configure connection options for Vercel serverless - removed deprecated options
    const options = {
      serverSelectionTimeoutMS: 30000, // Increase timeout for serverless
      socketTimeoutMS: 45000,
      // Removed bufferCommands and bufferMaxEntries as they're deprecated
    };
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urbancare', options);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    console.log('📝 Server will run without database - some features may be limited');
    console.log('💡 To connect to MongoDB:');
    console.log('   1. Install MongoDB locally, or');
    console.log('   2. Use Docker: docker run --name urbancare-mongodb -d -p 27017:27017 mongo');
    console.log('   3. Or set up MongoDB Atlas cloud database');
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
