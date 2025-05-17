import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Starting MongoDB connection test...');
console.log('MONGODB_URI exists:', !!MONGODB_URI);

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

try {
  console.log('Attempting to connect to MongoDB...');
  
  await mongoose.connect(MONGODB_URI);
  
  console.log('MongoDB connection successful!');
  console.log('Connected to database:', mongoose.connection.db.databaseName);
  console.log('Connected to host:', mongoose.connection.host);
  
  await mongoose.connection.close();
  console.log('Connection closed successfully');
  process.exit(0);
  
} catch (error) {
  console.error('MongoDB connection error:', error);
  process.exit(1);
} 