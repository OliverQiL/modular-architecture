import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || process.env.MONGODB_URI;

// connect to test database
before(async function () {
    this.timeout(10000); // Set timeout to 10 seconds
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for testing');
    } catch (error) {
        console.error('Error connecting to MongoDB for testing:', error);
        process.exit(1);
    }
})

// close the connection after all tests
after(async function () {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('MongoDB connection closed after tests');
})
