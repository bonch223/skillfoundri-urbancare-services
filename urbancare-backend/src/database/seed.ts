import { Database } from './connection';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Sample data for development
const sampleUsers = [
  {
    email: 'client1@urbancare.com',
    password: 'password123',
    firstName: 'Maria',
    lastName: 'Santos',
    userType: 'individual',
    city: 'Tagum City',
    latitude: 7.4479,
    longitude: 125.8072
  },
  {
    email: 'client2@urbancare.com',
    password: 'password123',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    userType: 'small_business',
    city: 'Tagum City',
    latitude: 7.4523,
    longitude: 125.8134
  },
  {
    email: 'provider1@urbancare.com',
    password: 'password123',
    firstName: 'Ana',
    lastName: 'Reyes',
    userType: 'individual',
    city: 'Tagum City',
    latitude: 7.4451,
    longitude: 125.8095
  },
  {
    email: 'provider2@urbancare.com',
    password: 'password123',
    firstName: 'Carlos',
    lastName: 'Garcia',
    userType: 'individual',
    city: 'Tagum City',
    latitude: 7.4498,
    longitude: 125.8118
  }
];

const sampleTasks = [
  {
    title: 'Clean my 2-bedroom house',
    description: 'Need deep cleaning for kitchen, bathroom, and living areas. House has 2 bedrooms, pet-friendly cleaning products preferred.',
    category: 'cleaning',
    budget: 800,
    urgency: 'soon',
    locationAddress: 'Tagum City Center',
    latitude: 7.4479,
    longitude: 125.8072,
    skillsRequired: ['house_cleaning', 'deep_cleaning'],
    experienceLevel: 'any'
  },
  {
    title: 'Like and share Facebook posts for my restaurant',
    description: 'Need help boosting engagement on my restaurant\'s Facebook page. Looking for 50 likes and 10 shares across recent posts.',
    category: 'social_engagement',
    budget: 100,
    urgency: 'flexible',
    isRemote: true,
    skillsRequired: ['social_media', 'facebook'],
    experienceLevel: 'any'
  },
  {
    title: 'Fix leaking kitchen sink',
    description: 'Kitchen sink has been leaking under the counter. Need urgent repair before it damages the cabinet.',
    category: 'plumbing',
    budget: 500,
    urgency: 'urgent',
    locationAddress: 'New Tagum Village',
    latitude: 7.4523,
    longitude: 125.8134,
    skillsRequired: ['plumbing', 'sink_repair'],
    experienceLevel: 'intermediate'
  },
  {
    title: 'Small birthday party setup and catering',
    description: 'Need help organizing a birthday party for 20 people. Include setup, simple catering, and cleanup.',
    category: 'events',
    budget: 8000,
    urgency: 'soon',
    locationAddress: 'Tagum Residential Area',
    latitude: 7.4451,
    longitude: 125.8095,
    skillsRequired: ['event_planning', 'catering'],
    experienceLevel: 'any',
    teamSizeNeeded: 2
  }
];

const sampleProviderProfiles = [
  {
    bio: 'Experienced house cleaner with 5 years in residential cleaning. Specializes in deep cleaning and eco-friendly products.',
    yearsOfExperience: 5,
    hourlyRate: 150,
    skills: ['house_cleaning', 'deep_cleaning', 'eco_friendly'],
    serviceCategories: ['cleaning'],
    portfolioDescription: 'Professional cleaning services for homes and small offices.'
  },
  {
    bio: 'Social media enthusiast and content creator. Help small businesses grow their online presence through authentic engagement.',
    yearsOfExperience: 2,
    hourlyRate: 80,
    skills: ['social_media', 'facebook', 'instagram', 'content_creation'],
    serviceCategories: ['social_engagement'],
    portfolioDescription: 'Helping local businesses grow through genuine social media engagement.'
  },
  {
    bio: 'Licensed plumber with 8 years experience. Specializes in residential repairs and installations.',
    yearsOfExperience: 8,
    hourlyRate: 250,
    skills: ['plumbing', 'sink_repair', 'pipe_installation', 'leak_fixing'],
    serviceCategories: ['plumbing'],
    portfolioDescription: 'Reliable plumbing services for homes and small businesses in Tagum City.'
  },
  {
    bio: 'Event coordinator and caterer. Experienced in organizing intimate gatherings and celebrations.',
    yearsOfExperience: 4,
    hourlyRate: 200,
    skills: ['event_planning', 'catering', 'party_setup', 'coordination'],
    serviceCategories: ['events'],
    portfolioDescription: 'Creating memorable events for families and small businesses.'
  }
];

async function seedDatabase() {
  try {
    await Database.connect();
    logger.info('Starting database seeding...');

    // Clear existing data in development
    if (process.env.NODE_ENV === 'development') {
      logger.info('Clearing existing data...');
      await Database.query('TRUNCATE TABLE notifications, messages, reviews, payments, bids, tasks, provider_profiles, business_profiles, users RESTART IDENTITY CASCADE');
    }

    // Create sample users
    logger.info('Creating sample users...');
    const userIds: string[] = [];
    
    for (const userData of sampleUsers) {
      const passwordHash = await bcrypt.hash(userData.password, 12);
      
      const result = await Database.query(`
        INSERT INTO users (
          email, password_hash, first_name, last_name, user_type, 
          city, province, country, latitude, longitude, is_verified,
          email_verified_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
        RETURNING id
      `, [
        userData.email,
        passwordHash,
        userData.firstName,
        userData.lastName,
        userData.userType,
        userData.city,
        'Davao del Norte',
        'Philippines',
        userData.latitude,
        userData.longitude,
        true
      ]);
      
      userIds.push(result.rows[0].id);
      logger.info(`Created user: ${userData.email}`);
    }

    // Create provider profiles for the last two users
    logger.info('Creating provider profiles...');
    for (let i = 2; i < userIds.length; i++) {
      const providerData = sampleProviderProfiles[i - 2];
      
      await Database.query(`
        INSERT INTO provider_profiles (
          user_id, bio, years_of_experience, hourly_rate, skills,
          service_categories, portfolio_description, is_available,
          average_rating, total_reviews, total_jobs_completed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        userIds[i],
        providerData.bio,
        providerData.yearsOfExperience,
        providerData.hourlyRate,
        JSON.stringify(providerData.skills),
        JSON.stringify(providerData.serviceCategories),
        providerData.portfolioDescription,
        true,
        4.5 + Math.random() * 0.5, // Random rating 4.5-5.0
        Math.floor(Math.random() * 20) + 5, // 5-25 reviews
        Math.floor(Math.random() * 50) + 10 // 10-60 completed jobs
      ]);
      
      logger.info(`Created provider profile for user ${i + 1}`);
    }

    // Create business profile for small business user
    logger.info('Creating business profile...');
    await Database.query(`
      INSERT INTO business_profiles (
        user_id, business_name, business_type, business_description,
        business_address, business_phone, is_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      userIds[1], // Second user (small_business)
      'Juan\'s Local Restaurant',
      'Restaurant',
      'Family-owned Filipino restaurant serving authentic local dishes.',
      'Main Street, Tagum City',
      '+639123456789',
      true
    ]);

    // Create sample tasks
    logger.info('Creating sample tasks...');
    const taskIds: string[] = [];
    
    for (let i = 0; i < sampleTasks.length; i++) {
      const taskData = sampleTasks[i];
      const clientId = userIds[i % 2]; // Alternate between first two users as clients
      
      const result = await Database.query(`
        INSERT INTO tasks (
          client_id, title, description, category, budget, urgency,
          location_address, latitude, longitude, is_remote, skills_required,
          experience_level, team_size_needed, commission_rate
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `, [
        clientId,
        taskData.title,
        taskData.description,
        taskData.category,
        taskData.budget,
        taskData.urgency,
        taskData.locationAddress || null,
        taskData.latitude || null,
        taskData.longitude || null,
        taskData.isRemote || false,
        JSON.stringify(taskData.skillsRequired),
        taskData.experienceLevel,
        taskData.teamSizeNeeded || 1,
        userIds.indexOf(clientId) === 0 ? 5.0 : 10.0 // Individual vs business commission
      ]);
      
      taskIds.push(result.rows[0].id);
      logger.info(`Created task: ${taskData.title}`);
    }

    // Create sample bids
    logger.info('Creating sample bids...');
    for (let i = 0; i < taskIds.length; i++) {
      const taskId = taskIds[i];
      const taskData = sampleTasks[i];
      
      // Create 1-3 bids per task from different providers
      const numBids = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numBids; j++) {
        const providerId = userIds[2 + (j % 2)]; // Use provider users
        const bidAmount = taskData.budget * (0.8 + Math.random() * 0.4); // 80%-120% of budget
        
        await Database.query(`
          INSERT INTO bids (
            task_id, provider_id, bid_type, amount, message,
            estimated_completion_time, includes_materials
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          taskId,
          providerId,
          Math.random() > 0.3 ? 'custom_quote' : 'accept_budget',
          Math.round(bidAmount),
          `I'm interested in this ${taskData.category} task. I have experience and can complete it to your satisfaction.`,
          taskData.category === 'cleaning' ? '2-3 hours' : 
          taskData.category === 'social_engagement' ? '1 hour' :
          taskData.category === 'plumbing' ? '1-2 hours' : '4-6 hours',
          taskData.category === 'plumbing' || taskData.category === 'events'
        ]);
      }
      
      // Update task bids count
      await Database.query(
        'UPDATE tasks SET bids_count = $1 WHERE id = $2',
        [numBids, taskId]
      );
    }

    // Create some sample reviews
    logger.info('Creating sample reviews...');
    const reviewMessages = [
      'Excellent work! Very professional and thorough.',
      'Great communication and quality service. Highly recommended!',
      'Good job, completed on time as promised.',
      'Very satisfied with the work quality. Will hire again.',
      'Professional and friendly. Exceeded expectations!'
    ];

    for (let i = 0; i < Math.min(3, taskIds.length); i++) {
      const taskId = taskIds[i];
      const clientId = userIds[i % 2];
      const providerId = userIds[2 + (i % 2)];
      
      // Client reviews provider
      await Database.query(`
        INSERT INTO reviews (
          task_id, reviewer_id, reviewee_id, rating, comment, review_type,
          communication_rating, quality_rating, timeliness_rating, value_rating
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        taskId,
        clientId,
        providerId,
        Math.floor(Math.random() * 2) + 4, // 4-5 stars
        reviewMessages[Math.floor(Math.random() * reviewMessages.length)],
        'client_to_provider',
        Math.floor(Math.random() * 2) + 4,
        Math.floor(Math.random() * 2) + 4,
        Math.floor(Math.random() * 2) + 4,
        Math.floor(Math.random() * 2) + 4
      ]);

      // Provider reviews client
      await Database.query(`
        INSERT INTO reviews (
          task_id, reviewer_id, reviewee_id, rating, comment, review_type
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        taskId,
        providerId,
        clientId,
        Math.floor(Math.random() * 2) + 4, // 4-5 stars
        'Great client! Clear instructions and prompt payment.',
        'provider_to_client'
      ]);
    }

    // Create sample notifications
    logger.info('Creating sample notifications...');
    const notificationTypes = [
      { type: 'new_task', title: 'New Task Posted', message: 'A new task matching your skills has been posted.' },
      { type: 'bid_received', title: 'New Bid Received', message: 'You have received a new bid for your task.' },
      { type: 'bid_accepted', title: 'Bid Accepted', message: 'Your bid has been accepted! The client will contact you soon.' },
      { type: 'task_completed', title: 'Task Completed', message: 'A task has been marked as completed.' }
    ];

    for (const userId of userIds) {
      for (let i = 0; i < 3; i++) {
        const notification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        await Database.query(`
          INSERT INTO notifications (
            user_id, title, message, notification_type, is_read
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          userId,
          notification.title,
          notification.message,
          notification.type,
          Math.random() > 0.5 // Randomly mark some as read
        ]);
      }
    }

    logger.info('✅ Database seeding completed successfully!');
    
    // Print summary
    const summary = await Database.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users_count,
        (SELECT COUNT(*) FROM provider_profiles) as providers_count,
        (SELECT COUNT(*) FROM business_profiles) as businesses_count,
        (SELECT COUNT(*) FROM tasks) as tasks_count,
        (SELECT COUNT(*) FROM bids) as bids_count,
        (SELECT COUNT(*) FROM reviews) as reviews_count,
        (SELECT COUNT(*) FROM notifications) as notifications_count
    `);
    
    const counts = summary.rows[0];
    logger.info('📊 Seeded data summary:');
    logger.info(`  - Users: ${counts.users_count}`);
    logger.info(`  - Providers: ${counts.providers_count}`);
    logger.info(`  - Businesses: ${counts.businesses_count}`);
    logger.info(`  - Tasks: ${counts.tasks_count}`);
    logger.info(`  - Bids: ${counts.bids_count}`);
    logger.info(`  - Reviews: ${counts.reviews_count}`);
    logger.info(`  - Notifications: ${counts.notifications_count}`);

    logger.info('\n🔐 Test user credentials:');
    sampleUsers.forEach(user => {
      logger.info(`  - ${user.email} : password123 (${user.userType})`);
    });

  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await Database.disconnect();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('🎉 Database seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };

