const mongoose = require('mongoose')
const dotenv = require('dotenv')
const mocha = require('mocha')

dotenv.config();

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/testdb';

mocha.before(async function() {
    this.timeout(10000); // Set timeout to 10 seconds

    try {
        await mongoose.connect(TEST_MONGODB_URI)
        console.log('Connected to MongoDB for testing');
    } catch (error) {
        console.error('Error connecting to test database:', error);
        process.exit(1);
    }
})

mocha.after(async function() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Test database cleaned and connection closed');
})

mocha.afterEach(async function() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
})

