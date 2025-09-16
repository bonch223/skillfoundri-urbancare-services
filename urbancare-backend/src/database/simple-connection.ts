// 📦 Simple Database Connection - In-Memory for Development
import { logger } from '@/utils/logger';

// Simple in-memory database simulation for development
class SimpleDatabase {
  private static data: Record<string, any[]> = {
    users: [
      {
        id: '1',
        email: 'client1@urbancare.com',
        password_hash: '$2a$12$LQv3c1yqBwEHV/lKK4m.Ce6JXj3s7Wz2HKGXcF1h3t5.GQcj6l9A2', // password123
        first_name: 'Maria',
        last_name: 'Santos',
        user_type: 'individual',
        city: 'Tagum City',
        is_verified: true,
        is_active: true,
        is_suspended: false,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        email: 'provider1@urbancare.com',
        password_hash: '$2a$12$LQv3c1yqBwEHV/lKK4m.Ce6JXj3s7Wz2HKGXcF1h3t5.GQcj6l9A2', // password123
        first_name: 'Ana',
        last_name: 'Reyes',
        user_type: 'individual',
        city: 'Tagum City',
        is_verified: true,
        is_active: true,
        is_suspended: false,
        created_at: new Date().toISOString()
      }
    ],
    tasks: [
      {
        id: '1',
        client_id: '1',
        title: 'Clean my 2-bedroom house',
        description: 'Need deep cleaning for kitchen, bathroom, and living areas.',
        category: 'cleaning',
        budget: 800,
        urgency: 'soon',
        status: 'open',
        location_address: 'Tagum City Center',
        latitude: 7.4479,
        longitude: 125.8072,
        bids_count: 0,
        views_count: 0,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    bids: [],
    reviews: [],
    messages: [],
    notifications: [],
    payments: []
  };

  static async connect(): Promise<void> {
    logger.info('Using in-memory database for development');
  }

  static async disconnect(): Promise<void> {
    logger.info('Disconnecting from in-memory database');
  }

  static async query(text: string, params?: any[]): Promise<any> {
    logger.info(`Simulated query: ${text}`);
    
    // Simple query simulation
    if (text.includes('SELECT') && text.includes('FROM users') && text.includes('WHERE email')) {
      const email = params?.[0];
      const user = this.data.users.find(u => u.email === email);
      return { rows: user ? [user] : [] };
    }
    
    if (text.includes('SELECT') && text.includes('FROM users') && text.includes('WHERE id')) {
      const id = params?.[0];
      const user = this.data.users.find(u => u.id === id);
      return { rows: user ? [user] : [] };
    }
    
    if (text.includes('INSERT INTO users')) {
      const newUser = {
        id: String(this.data.users.length + 1),
        email: params?.[0],
        password_hash: params?.[1],
        first_name: params?.[2],
        last_name: params?.[3],
        user_type: params?.[4],
        phone: params?.[5],
        city: params?.[6] || 'Tagum City',
        province: 'Davao del Norte',
        country: 'Philippines',
        is_verified: false,
        is_active: true,
        is_suspended: false,
        created_at: new Date().toISOString()
      };
      this.data.users.push(newUser);
      return { rows: [newUser] };
    }
    
    if (text.includes('SELECT') && text.includes('FROM tasks')) {
      return { rows: this.data.tasks };
    }
    
    if (text.includes('INSERT INTO tasks')) {
      const newTask = {
        id: String(this.data.tasks.length + 1),
        client_id: params?.[0],
        title: params?.[1],
        description: params?.[2],
        category: params?.[3],
        budget: params?.[4],
        commission_rate: params?.[5],
        urgency: params?.[6],
        is_remote: params?.[7],
        location_address: params?.[8],
        latitude: params?.[9],
        longitude: params?.[10],
        status: 'open',
        bids_count: 0,
        views_count: 0,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      this.data.tasks.push(newTask);
      return { rows: [newTask] };
    }
    
    if (text.includes('INSERT INTO bids')) {
      const newBid = {
        id: String(this.data.bids.length + 1),
        task_id: params?.[0],
        provider_id: params?.[1],
        bid_type: params?.[2],
        amount: params?.[3],
        message: params?.[4],
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      this.data.bids.push(newBid);
      
      // Update task bids count
      const task = this.data.tasks.find(t => t.id === params?.[0]);
      if (task) task.bids_count++;
      
      return { rows: [newBid] };
    }
    
    // Default response
    return { rows: [] };
  }

  static async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    return await callback(this);
  }

  static async healthCheck(): Promise<boolean> {
    return true;
  }

  static getStats() {
    return {
      totalCount: 1,
      idleCount: 0,
      waitingCount: 0,
      isConnected: true
    };
  }
}

export { SimpleDatabase as Database };

