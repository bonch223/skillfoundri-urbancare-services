// 🗄️ PostgreSQL Database Connection
import { Pool, PoolClient } from 'pg';
import { logger } from '@/utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'urbancare_dev',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

class DatabaseConnection {
  private static pool: Pool;
  private static isConnected: boolean = false;

  static async connect(): Promise<void> {
    try {
      if (!this.pool) {
        this.pool = new Pool(dbConfig);
        
        // Test the connection
        const client = await this.pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        
        this.isConnected = true;
        logger.info('📊 PostgreSQL database connected successfully');
        logger.info(`🏠 Connected to: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`);
      }
    } catch (error) {
      this.isConnected = false;
      logger.error('❌ Database connection failed:', error);
      
      // Fallback to simple connection for development
      logger.warn('🔄 Falling back to simple in-memory database...');
      const { Database: SimpleDatabase } = await import('./simple-connection');
      return SimpleDatabase.connect();
    }
  }

  static async disconnect(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.end();
        this.isConnected = false;
        logger.info('📊 Database connection closed');
      }
    } catch (error) {
      logger.error('❌ Error closing database connection:', error);
    }
  }

  static async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
    if (!this.isConnected || !this.pool) {
      // Fallback to simple database
      const { Database: SimpleDatabase } = await import('./simple-connection');
      return SimpleDatabase.query(text, params);
    }

    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (duration > 1000) {
        logger.warn(`🐌 Slow query (${duration}ms): ${text.substring(0, 100)}...`);
      }
      
      return result;
    } catch (error) {
      logger.error('❌ Database query error:', {
        query: text.substring(0, 200),
        params: params?.slice(0, 5),
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  static async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!this.isConnected || !this.pool) {
      // Fallback to simple database
      const { Database: SimpleDatabase } = await import('./simple-connection');
      return SimpleDatabase.transaction(callback);
    }

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      if (!this.pool) return false;
      
      const result = await this.pool.query('SELECT 1 as health');
      return result.rows.length > 0;
    } catch (error) {
      logger.error('❌ Database health check failed:', error);
      return false;
    }
  }

  static getStats() {
    if (!this.pool) {
      return {
        totalCount: 0,
        idleCount: 0,
        waitingCount: 0,
        isConnected: false
      };
    }

    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
      isConnected: this.isConnected
    };
  }

  static get isReady(): boolean {
    return this.isConnected && !!this.pool;
  }
}

export { DatabaseConnection as Database };

