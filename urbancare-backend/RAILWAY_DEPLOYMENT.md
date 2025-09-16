# 🚀 UrbanCare Railway Deployment Guide

## 📋 Overview

This guide will help you deploy the UrbanCare backend to Railway, providing a production database and server that serves all platforms:
- **Mobile App** (React Native)
- **Web Portal** (User-facing website)
- **Admin Dashboard** (Administrative interface)

## 🛠️ Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your UrbanCare project should be on GitHub
3. **Environment Variables**: Prepare your production secrets

## 🚀 Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your UrbanCare repository
5. Select the `urbancare-backend` folder as the root directory

## 🗄️ Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a PostgreSQL database
4. Note the connection details (they'll be in environment variables)

## ⚙️ Step 3: Configure Environment Variables

In your Railway project settings, add these environment variables:

### 🔐 Required Variables

```bash
# Database (automatically provided by Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:password@host:port/database

# JWT & Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Origins (update with your actual domains)
CORS_ORIGIN_MOBILE=https://your-mobile-app.com
CORS_ORIGIN_WEB=https://your-web-portal.com
CORS_ORIGIN_ADMIN=https://your-admin-dashboard.com
CORS_ORIGIN_LOCAL=http://localhost:3000,http://localhost:3001,http://localhost:8081

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@urbancare.com

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Optional: Error tracking
SENTRY_DSN=your_sentry_dsn
```

### 🔧 Platform-Specific Variables

```bash
# API Versioning
API_VERSION=v1

# Mobile App
MOBILE_API_VERSION=v1
MOBILE_MIN_VERSION=1.0.0

# Web Portal
WEB_API_VERSION=v1
WEB_SESSION_SECRET=your_web_session_secret

# Admin Dashboard
ADMIN_API_VERSION=v1
ADMIN_SECRET_KEY=your_admin_secret_key
```

## 🚀 Step 4: Deploy

1. Railway will automatically detect your `package.json` and start building
2. The deployment will run these commands:
   - `npm install`
   - `npm run build`
   - `npm run migrate` (database setup)
   - `npm start` (start production server)

3. Wait for deployment to complete (usually 2-3 minutes)

## 🔍 Step 5: Verify Deployment

1. **Health Check**: Visit `https://your-app.railway.app/health`
2. **API Endpoints**: Test your API endpoints
3. **Database**: Verify database connection and tables

### Expected Health Check Response

```json
{
  "status": "OK",
  "message": "UrbanCare Multi-Platform Backend is running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "database": {
    "connected": true,
    "stats": {
      "totalCount": 5,
      "idleCount": 4,
      "waitingCount": 0,
      "isConnected": true
    }
  },
  "platforms": {
    "mobile": "configured",
    "web": "configured",
    "admin": "configured"
  },
  "version": "1.0.0"
}
```

## 📱 Step 6: Update Frontend Applications

### Mobile App Configuration

Update your mobile app's API configuration:

```typescript
// src/config/api.ts
export const API_BASE_URL = 'https://your-backend.railway.app';
export const API_VERSION = 'v1';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/${API_VERSION}/mobile/auth`,
  TASKS: `${API_BASE_URL}/api/${API_VERSION}/mobile/tasks`,
  BIDS: `${API_BASE_URL}/api/${API_VERSION}/mobile/bids`,
  USERS: `${API_BASE_URL}/api/${API_VERSION}/mobile/users`,
  PAYMENTS: `${API_BASE_URL}/api/${API_VERSION}/mobile/payments`,
  MESSAGES: `${API_BASE_URL}/api/${API_VERSION}/mobile/messages`,
};
```

### Web Portal Configuration

Update your web portal's API configuration:

```javascript
// src/config/api.js
export const API_BASE_URL = 'https://your-backend.railway.app';
export const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/${API_VERSION}/web/auth`,
  TASKS: `${API_BASE_URL}/api/${API_VERSION}/web/tasks`,
  BIDS: `${API_BASE_URL}/api/${API_VERSION}/web/bids`,
  USERS: `${API_BASE_URL}/api/${API_VERSION}/web/users`,
  PAYMENTS: `${API_BASE_URL}/api/${API_VERSION}/web/payments`,
  MESSAGES: `${API_BASE_URL}/api/${API_VERSION}/web/messages`,
};
```

### Admin Dashboard Configuration

Update your admin dashboard's API configuration:

```javascript
// src/config/api.js
export const API_BASE_URL = 'https://your-backend.railway.app';
export const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/${API_VERSION}/admin/auth`,
  TASKS: `${API_BASE_URL}/api/${API_VERSION}/admin/tasks`,
  BIDS: `${API_BASE_URL}/api/${API_VERSION}/admin/bids`,
  USERS: `${API_BASE_URL}/api/${API_VERSION}/admin/users`,
  PAYMENTS: `${API_BASE_URL}/api/${API_VERSION}/admin/payments`,
  MESSAGES: `${API_BASE_URL}/api/${API_VERSION}/admin/messages`,
  ADMIN: `${API_BASE_URL}/api/${API_VERSION}/admin`,
};
```

## 🔄 Step 7: Database Management

### Running Migrations

If you need to run additional migrations:

```bash
# Connect to Railway CLI
railway login
railway link

# Run migrations
railway run npm run migrate
```

### Database Access

1. In Railway dashboard, go to your PostgreSQL service
2. Click **"Query"** to access the database directly
3. Or use the connection string to connect with your preferred database client

## 📊 Step 8: Monitoring & Logs

### View Logs

1. In Railway dashboard, go to your service
2. Click **"Deployments"** tab
3. Click on a deployment to view logs

### Monitor Performance

1. Railway provides built-in metrics
2. Set up external monitoring (Sentry, DataDog, etc.)
3. Monitor database performance through Railway dashboard

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` environment variable
   - Verify PostgreSQL service is running

2. **CORS Errors**
   - Update `CORS_ORIGIN_*` environment variables
   - Ensure frontend URLs are correct

3. **Build Failures**
   - Check TypeScript compilation errors
   - Verify all dependencies are in `package.json`

4. **Migration Failures**
   - Check database permissions
   - Verify migration scripts are correct

### Debug Commands

```bash
# Check environment variables
railway variables

# View logs
railway logs

# Connect to database
railway connect postgres

# Run commands in Railway environment
railway run npm run migrate
```

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Health check endpoint responding
- [ ] All API endpoints tested
- [ ] CORS configured for all platforms
- [ ] SSL certificate active (automatic with Railway)
- [ ] Error tracking configured (Sentry)
- [ ] Monitoring set up
- [ ] Backup strategy in place

## 📞 Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **UrbanCare Issues**: Create an issue in your GitHub repository

---

🎉 **Congratulations!** Your UrbanCare backend is now running in production on Railway, serving all your platforms with a robust PostgreSQL database!
