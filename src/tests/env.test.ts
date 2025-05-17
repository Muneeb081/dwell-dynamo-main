import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Environment Variables Test');
console.log('-------------------------');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
} 