import { connectDB } from '../lib/db.js';
import { logger } from '../lib/logger.js';

async function testConnection() {
  try {
    console.log('Starting database connection test...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    await connectDB();
    console.log('Database connection test successful');
    process.exit(0);
  } catch (error) {
    console.error('Database connection test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    process.exit(1);
  }
}

testConnection(); 