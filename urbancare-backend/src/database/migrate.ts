// 🗄️ Database Migration Script for UrbanCare Production
import { Database } from '../config/database';
import { logger } from '../utils/logger';

const migrations = [
  {
    version: 1,
    name: 'create_users_table',
    up: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        
        -- Profile Information
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        profile_picture_url VARCHAR(500),
        date_of_birth DATE,
        gender VARCHAR(20),
        
        -- Location
        address TEXT,
        city VARCHAR(100) DEFAULT 'Tagum City',
        province VARCHAR(100) DEFAULT 'Davao del Norte',
        country VARCHAR(100) DEFAULT 'Philippines',
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        
        -- User Type & Verification
        user_type VARCHAR(20) NOT NULL DEFAULT 'individual',
        is_verified BOOLEAN DEFAULT FALSE,
        verification_documents JSONB,
        
        -- Account Status
        is_active BOOLEAN DEFAULT TRUE,
        is_suspended BOOLEAN DEFAULT FALSE,
        suspension_reason TEXT,
        
        -- Preferences
        preferred_language VARCHAR(10) DEFAULT 'en',
        notification_preferences JSONB DEFAULT '{"email": true, "sms": true, "push": true}',
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP,
        email_verified_at TIMESTAMP,
        phone_verified_at TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_users_location ON users(latitude, longitude);
      CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
      CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
    `
  },
  {
    version: 2,
    name: 'create_provider_profiles_table',
    up: `
      CREATE TABLE IF NOT EXISTS provider_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        -- Provider Information
        bio TEXT,
        years_of_experience INTEGER DEFAULT 0,
        hourly_rate DECIMAL(10, 2),
        
        -- Skills & Categories
        skills JSONB DEFAULT '[]',
        service_categories JSONB DEFAULT '[]',
        
        -- Portfolio
        portfolio_images JSONB DEFAULT '[]',
        portfolio_description TEXT,
        
        -- Availability
        is_available BOOLEAN DEFAULT TRUE,
        working_hours JSONB DEFAULT '{"monday": {"start": "08:00", "end": "18:00", "available": true}}',
        max_distance_km INTEGER DEFAULT 10,
        
        -- Performance Metrics
        total_jobs_completed INTEGER DEFAULT 0,
        average_rating DECIMAL(3, 2) DEFAULT 0.00,
        total_reviews INTEGER DEFAULT 0,
        response_time_minutes INTEGER DEFAULT 0,
        completion_rate DECIMAL(5, 2) DEFAULT 0.00,
        
        -- Financial
        total_earnings DECIMAL(12, 2) DEFAULT 0.00,
        pending_earnings DECIMAL(12, 2) DEFAULT 0.00,
        
        -- Verification
        is_verified BOOLEAN DEFAULT FALSE,
        verification_level VARCHAR(20) DEFAULT 'basic',
        background_check_status VARCHAR(20) DEFAULT 'pending',
        insurance_verified BOOLEAN DEFAULT FALSE,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_provider_profiles_user_id ON provider_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_provider_profiles_available ON provider_profiles(is_available);
      CREATE INDEX IF NOT EXISTS idx_provider_profiles_rating ON provider_profiles(average_rating);
    `
  },
  {
    version: 3,
    name: 'create_tasks_table',
    up: `
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        -- Task Details
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        task_type VARCHAR(20) DEFAULT 'physical',
        
        -- Budget & Pricing
        budget DECIMAL(10, 2) NOT NULL,
        budget_type VARCHAR(20) DEFAULT 'fixed',
        commission_rate DECIMAL(5, 2) DEFAULT 10.00,
        
        -- Location & Timing
        location_address TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        is_remote BOOLEAN DEFAULT FALSE,
        
        -- Scheduling
        preferred_start_date DATE,
        preferred_start_time TIME,
        estimated_duration_hours INTEGER,
        urgency VARCHAR(20) DEFAULT 'flexible',
        
        -- Requirements
        skills_required JSONB DEFAULT '[]',
        experience_level VARCHAR(20) DEFAULT 'any',
        team_size_needed INTEGER DEFAULT 1,
        special_requirements TEXT,
        
        -- Attachments
        attachment_urls JSONB DEFAULT '[]',
        
        -- Status Management
        status VARCHAR(20) DEFAULT 'open',
        assigned_provider_id UUID REFERENCES users(id),
        assigned_at TIMESTAMP,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        cancelled_at TIMESTAMP,
        cancellation_reason TEXT,
        
        -- Metrics
        views_count INTEGER DEFAULT 0,
        bids_count INTEGER DEFAULT 0,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days')
      );
      
      CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_location ON tasks(latitude, longitude);
      CREATE INDEX IF NOT EXISTS idx_tasks_budget ON tasks(budget);
      CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
      CREATE INDEX IF NOT EXISTS idx_tasks_urgency ON tasks(urgency);
    `
  },
  {
    version: 4,
    name: 'create_bids_table',
    up: `
      CREATE TABLE IF NOT EXISTS bids (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        -- Bid Details
        bid_type VARCHAR(20) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        message TEXT NOT NULL,
        estimated_completion_time VARCHAR(100),
        
        -- Additional Offerings
        includes_materials BOOLEAN DEFAULT FALSE,
        warranty_offered VARCHAR(100),
        additional_services JSONB DEFAULT '[]',
        
        -- Status
        status VARCHAR(20) DEFAULT 'pending',
        response_message TEXT,
        responded_at TIMESTAMP,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
      );
      
      CREATE UNIQUE INDEX IF NOT EXISTS idx_bids_unique_provider_task ON bids(task_id, provider_id);
      CREATE INDEX IF NOT EXISTS idx_bids_task_id ON bids(task_id);
      CREATE INDEX IF NOT EXISTS idx_bids_provider_id ON bids(provider_id);
      CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
      CREATE INDEX IF NOT EXISTS idx_bids_amount ON bids(amount);
    `
  },
  {
    version: 5,
    name: 'create_payments_table',
    up: `
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        -- Payment Details
        amount DECIMAL(10, 2) NOT NULL,
        commission_amount DECIMAL(10, 2) NOT NULL,
        provider_amount DECIMAL(10, 2) NOT NULL,
        
        -- Payment Method
        payment_method VARCHAR(50) NOT NULL,
        payment_reference VARCHAR(200),
        
        -- Status Flow
        status VARCHAR(20) DEFAULT 'pending',
        
        -- Escrow Management
        held_at TIMESTAMP,
        release_scheduled_at TIMESTAMP,
        released_at TIMESTAMP,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_payments_task_id ON payments(task_id);
      CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
      CREATE INDEX IF NOT EXISTS idx_payments_provider_id ON payments(provider_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `
  },
  {
    version: 6,
    name: 'create_messages_table',
    up: `
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        -- Message Content
        message_type VARCHAR(20) DEFAULT 'text',
        content TEXT NOT NULL,
        attachment_url VARCHAR(500),
        
        -- Status
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        is_system_message BOOLEAN DEFAULT FALSE,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_messages_task_id ON messages(task_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = FALSE;
    `
  },
  {
    version: 7,
    name: 'create_migrations_table',
    up: `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        version INTEGER UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
  }
];

async function runMigrations() {
  try {
    await Database.connect();
    
    // Create migrations table if it doesn't exist
    await Database.query(migrations[6].up);
    
    // Get executed migrations
    const result = await Database.query('SELECT version FROM migrations ORDER BY version');
    const executedVersions = result.rows.map((row: any) => row.version);
    
    logger.info(`📊 Found ${executedVersions.length} executed migrations`);
    
    // Run pending migrations
    for (const migration of migrations) {
      if (!executedVersions.includes(migration.version)) {
        logger.info(`🔄 Running migration ${migration.version}: ${migration.name}`);
        
        await Database.query(migration.up);
        await Database.query(
          'INSERT INTO migrations (version, name) VALUES ($1, $2)',
          [migration.version, migration.name]
        );
        
        logger.info(`✅ Migration ${migration.version} completed`);
      }
    }
    
    logger.info('🎉 All migrations completed successfully!');
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

export { runMigrations };