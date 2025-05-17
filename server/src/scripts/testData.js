import mongoose from 'mongoose';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Favorite from '../models/Favorite.js';
import Message from '../models/Message.js';
import dotenv from 'dotenv';

dotenv.config();

const testUsers = [
    {
        name: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'user'
    },
    {
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123',
        phone: '0987654321',
        role: 'user'
    }
];

const testProperties = [
    {
        title: 'Modern Apartment',
        description: 'Beautiful modern apartment in the city center',
        price: 1500,
        location: {
            city: 'New York',
            area: 'Manhattan',
            address: '123 Main St'
        },
        features: {
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            furnished: true,
            parking: true
        },
        type: 'apartment',
        status: 'rent',
        images: ['image1.jpg', 'image2.jpg']
    },
    {
        title: 'Cozy House',
        description: 'Lovely house in a quiet neighborhood',
        price: 2500,
        location: {
            city: 'Los Angeles',
            area: 'Hollywood',
            address: '456 Oak Ave'
        },
        features: {
            bedrooms: 3,
            bathrooms: 2,
            area: 2000,
            furnished: true,
            parking: true
        },
        type: 'house',
        status: 'sale',
        images: ['image3.jpg', 'image4.jpg']
    }
];

const createTestData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Property.deleteMany({});
        await Favorite.deleteMany({});
        await Message.deleteMany({});
        console.log('Cleared existing data');

        // Create test users
        const users = await User.create(testUsers);
        console.log('Created test users:', users);

        // Create test properties
        const properties = await Property.create(
            testProperties.map(property => ({
                ...property,
                createdBy: users[0]._id
            }))
        );
        console.log('Created test properties:', properties);

        // Create test favorites
        const favorites = await Favorite.create([
            {
                userId: users[0]._id,
                propertyId: properties[0]._id
            },
            {
                userId: users[1]._id,
                propertyId: properties[1]._id
            }
        ]);
        console.log('Created test favorites:', favorites);

        // Create test messages
        const messages = await Message.create([
            {
                senderId: users[0]._id,
                receiverId: users[1]._id,
                propertyId: properties[0]._id,
                content: 'Hello, I am interested in this property'
            },
            {
                senderId: users[1]._id,
                receiverId: users[0]._id,
                propertyId: properties[0]._id,
                content: 'Great! When would you like to visit?'
            }
        ]);
        console.log('Created test messages:', messages);

        console.log('Test data created successfully!');
    } catch (error) {
        console.error('Error creating test data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

createTestData(); 