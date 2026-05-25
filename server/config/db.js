import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.set('bufferCommands', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
    }
};

export default connectDB;
