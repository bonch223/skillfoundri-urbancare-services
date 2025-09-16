// 🗄️ Simple In-Memory Database Connection (Fallback)
import { logger } from '../utils/logger';

// Simple in-memory storage for development
const memoryStore = {
  users: [],
  tasks: [],
  bids: [],
  payments: [],
  messages: [],
  notifications: []
};

class SimpleDatabase {
  private static isConnected: boolean = false;

  static async connect(): Promise<void> {
    this.isConnected = true;
    logger.info('📊 Simple in-memory database connected (development mode)');
  }

  static async disconnect(): Promise<void> {
    this.isConnected = false;
    logger.info('📊 Simple database connection closed');
  }

  static async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    // Simple query simulation for development
    logger.info(`🔍 Simple query: ${text.substring(0, 100)}...`);
    
    // Return empty results for most queries in development
    return { rows: [] };
  }

  static async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    // Simple transaction simulation
    const mockClient = {
      query: this.query.bind(this)
    };

    return callback(mockClient);
  }

  static async healthCheck(): Promise<boolean> {
    return this.isConnected;
  }

  static getStats() {
    return {
      totalCount: 0,
      idleCount: 0,
      waitingCount: 0,
      isConnected: this.isConnected
    };
  }

  static get isReady(): boolean {
    return this.isConnected;
  }
}

export { SimpleDatabase as Database };