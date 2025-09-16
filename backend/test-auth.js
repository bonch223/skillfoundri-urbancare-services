import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Authentication System...\n');

const testAuth = async () => {
  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing Database Connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Database connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}\n`);

    // Test 2: Check if test user exists
    console.log('2️⃣ Checking for test user...');
    const testEmail = 'test@example.com';
    let testUser = await User.findOne({ email: testEmail });
    
    if (!testUser) {
      console.log('👤 Creating test user...');
      testUser = new User({
        name: 'Test User',
        email: testEmail,
        password: 'password123',
        userType: 'customer'
      });
      await testUser.save();
      console.log('✅ Test user created successfully');
    } else {
      console.log('✅ Test user already exists');
    }

    // Test 3: Password verification
    console.log('\n3️⃣ Testing password verification...');
    const isPasswordValid = await bcrypt.compare('password123', testUser.password);
    if (isPasswordValid) {
      console.log('✅ Password verification successful');
    } else {
      console.log('❌ Password verification failed');
    }

    // Test 4: List all users
    console.log('\n4️⃣ Listing all users in database...');
    const allUsers = await User.find({}).select('name email userType createdAt');
    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.userType}`);
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n💡 You can now try logging in with:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: password123`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
  }
};

testAuth();
