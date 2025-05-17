import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Starting MongoDB data storage test...');
console.log('MONGODB_URI exists:', !!MONGODB_URI);

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Create a test schema
const TestSchema = new mongoose.Schema({
  name: String,
  value: Number,
  createdAt: { type: Date, default: Date.now }
});

const Test = mongoose.model('Test', TestSchema);

async function testDataStorage() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Create a test document
    const testDoc = new Test({
      name: 'Test Document',
      value: 42
    });

    console.log('Attempting to save test document...');
    await testDoc.save();
    console.log('Test document saved successfully!');

    // Verify the document was saved
    const savedDoc = await Test.findOne({ name: 'Test Document' });
    console.log('Retrieved document:', savedDoc);

    // Clean up - remove the test document
    await Test.deleteOne({ name: 'Test Document' });
    console.log('Test document cleaned up');

    await mongoose.connection.close();
    console.log('Connection closed successfully');
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testDataStorage(); 