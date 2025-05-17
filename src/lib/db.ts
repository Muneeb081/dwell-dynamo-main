import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from './logger';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://asifrofficial9:asiflaghari@cluster.rmmxl.mongodb.net/?retryWrites=true&w=majority&appName=cluster";

console.log('Environment check:');
console.log('MONGODB_URI exists:', !!MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

export async function connectDB() {
  try {
    // Log the connection attempt
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    
    // Log successful connection details
    console.log('MongoDB connection successful');
    console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
    console.log(`Connected to host: ${mongoose.connection.host}`);
    console.log(`Connected to port: ${mongoose.connection.port}`);
    
    // Enable mongoose debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}

// Handle connection errors
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Handle disconnection
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
}); 