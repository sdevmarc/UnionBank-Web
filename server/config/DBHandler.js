const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/unionbank')
        console.log('Connected to the database!')
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

module.exports = connectDb;