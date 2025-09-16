# UrbanCare Services - Database Schema Design

## 🗄️ Database Overview

This document outlines the database schema design for the UrbanCare Services marketplace platform. The schema is designed to support user authentication, service management, booking system, and future marketplace features.

### **Technology Recommendations:**
- **Database:** PostgreSQL 14+ (recommended for ACID compliance and JSON support)
- **Alternative:** MySQL 8.0+ or SQLite (for development)
- **ORM:** Prisma, Sequelize (Node.js) or Django ORM (Python)

---

## 📋 Schema Design

### **1. Users Table - Core Authentication**

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_type ENUM('customer', 'provider', 'admin') NOT NULL DEFAULT 'customer',
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    address TEXT,
    location_city VARCHAR(100) DEFAULT 'Tagum City',
    location_coordinates POINT, -- For GPS coordinates
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_location ON users(location_city);
```

### **2. User Sessions - JWT Management**

```sql
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSON, -- Browser, OS, device type
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash);
```

### **3. Password Reset Tokens**

```sql
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_reset_tokens_token ON password_reset_tokens(token);
```

---

## 🛠️ Phase 2B: Service Management

### **4. Service Categories**

```sql
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(100), -- Lucide icon name
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initial data
INSERT INTO service_categories (name, slug, description, icon_name, display_order) VALUES
('Home Cleaning', 'home-cleaning', 'Professional cleaning and disinfection services', 'home', 1),
('Plumbing & Electrical', 'plumbing-electrical', 'Repairs and maintenance for home utilities', 'wrench', 2),
('Handyman Services', 'handyman', 'General repairs and maintenance tasks', 'hammer', 3),
('Laundry Care', 'laundry', 'Pickup, wash, and delivery services', 'shirt', 4);
```

### **5. Services Offered**

```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES service_categories(id),
    provider_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price_type ENUM('fixed', 'hourly', 'quote') NOT NULL,
    base_price DECIMAL(10,2),
    price_unit VARCHAR(50), -- 'per hour', 'per room', 'per job'
    duration_estimate INTEGER, -- in minutes
    availability JSON, -- Available days/hours
    service_area VARCHAR(255) DEFAULT 'Tagum City',
    requirements TEXT, -- Special requirements or tools needed
    images JSON, -- Array of image URLs
    tags JSON, -- Array of service tags
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_active ON services(is_active);
```

---

## 📅 Phase 2C: Booking System

### **6. Service Bookings**

```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    provider_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    
    -- Booking Details
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    estimated_duration INTEGER, -- in minutes
    service_address TEXT NOT NULL,
    special_instructions TEXT,
    
    -- Pricing
    quoted_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    service_fee DECIMAL(10,2), -- Platform fee
    
    -- Status Management
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed') DEFAULT 'pending',
    cancellation_reason TEXT,
    
    -- Timestamps
    confirmed_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
```

### **7. Booking Messages**

```sql
CREATE TABLE booking_messages (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type ENUM('text', 'image', 'system') DEFAULT 'text',
    attachments JSON, -- Array of file URLs
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_booking ON booking_messages(booking_id);
CREATE INDEX idx_messages_sender ON booking_messages(sender_id);
```

---

## ⭐ Phase 3: Reviews & Ratings

### **8. Reviews**

```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reviewed_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Provider being reviewed
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    images JSON, -- Array of image URLs
    is_verified BOOLEAN DEFAULT FALSE, -- Verified booking completion
    response TEXT, -- Provider response
    response_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

## 💳 Phase 4: Payments

### **9. Payment Methods**

```sql
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type ENUM('gcash', 'paymaya', 'bank_transfer', 'cash') NOT NULL,
    provider_name VARCHAR(100), -- 'GCash', 'PayMaya', etc.
    account_details JSON, -- Encrypted payment info
    is_default BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **10. Transactions**

```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    payer_id INTEGER REFERENCES users(id),
    payee_id INTEGER REFERENCES users(id),
    payment_method_id INTEGER REFERENCES payment_methods(id),
    
    amount DECIMAL(10,2) NOT NULL,
    service_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    
    transaction_type ENUM('payment', 'refund', 'fee') NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    
    external_transaction_id VARCHAR(255), -- From payment gateway
    payment_gateway VARCHAR(100),
    gateway_response JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_booking ON transactions(booking_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

---

## 🔧 Phase 5: Provider Management

### **11. Provider Profiles**

```sql
CREATE TABLE provider_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    business_type ENUM('individual', 'company') DEFAULT 'individual',
    license_number VARCHAR(100),
    license_expiry DATE,
    experience_years INTEGER,
    service_radius INTEGER DEFAULT 20, -- km from base location
    bio TEXT,
    skills JSON, -- Array of skills/specializations
    certifications JSON, -- Array of certifications
    portfolio_images JSON, -- Array of work sample URLs
    availability_schedule JSON, -- Weekly schedule
    base_service_fee DECIMAL(10,2),
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    verification_documents JSON, -- Array of document URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_provider_profiles_user ON provider_profiles(user_id);
CREATE INDEX idx_provider_profiles_verified ON provider_profiles(is_verified);
```

---

## 📊 Phase 6: Analytics & Reporting

### **12. Platform Analytics**

```sql
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL, -- 'page_view', 'booking_created', 'search'
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    event_data JSON, -- Flexible event properties
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_date ON analytics_events(created_at);
```

---

## 🚀 Implementation Strategy

### **Phase 1: Authentication (Current)**
- ✅ `users` table
- ✅ `user_sessions` table
- ✅ `password_reset_tokens` table

### **Phase 2: Basic Services**
- `service_categories` table
- `services` table

### **Phase 3: Booking System**
- `bookings` table
- `booking_messages` table

### **Phase 4: Reviews & Quality**
- `reviews` table

### **Phase 5: Payments**
- `payment_methods` table
- `transactions` table

### **Phase 6: Advanced Features**
- `provider_profiles` table
- `analytics_events` table

---

## 🔒 Security Considerations

### **Data Protection**
- All passwords stored as bcrypt hashes (cost factor 12+)
- Sensitive data encrypted at rest
- PII data properly indexed but protected
- Regular database backups with encryption

### **API Security**
- JWT tokens with short expiration (15-30 minutes)
- Refresh token rotation
- Rate limiting on authentication endpoints
- Input validation and sanitization

### **Privacy Compliance**
- GDPR-ready with user data export/deletion
- Audit logs for data access
- Consent management for data processing

---

## 📈 Performance Optimization

### **Database Indexing**
- Primary keys with auto-increment
- Composite indexes for common query patterns
- Partial indexes for filtered queries

### **Caching Strategy**
- Redis for session management
- Application-level caching for static data
- Query result caching for expensive operations

### **Scaling Preparation**
- Database connection pooling
- Read replicas for analytics queries
- Horizontal sharding considerations

---

## 🛠️ Development Setup

### **Local Development**
```bash
# PostgreSQL with Docker
docker run --name urbancare-db \
  -e POSTGRES_DB=urbancare_dev \
  -e POSTGRES_USER=urbancare \
  -e POSTGRES_PASSWORD=dev_password \
  -p 5432:5432 \
  -d postgres:14

# Run migrations
npm run migrate:up

# Seed initial data
npm run seed:dev
```

### **Environment Variables**
```env
DATABASE_URL=postgresql://urbancare:dev_password@localhost:5432/urbancare_dev
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=30m
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

---

## 📝 Migration Scripts

Ready-to-use migration scripts will be provided for:
- Initial schema creation
- Data seeding for development
- Production-safe migrations
- Rollback procedures

This schema design provides a solid foundation for the UrbanCare Services marketplace while maintaining flexibility for future enhancements and scalability.

---

*Last Updated: January 26, 2025*  
*Version: 1.0.0*  
*Status: Ready for Implementation*
