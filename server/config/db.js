import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

let cached = global.__mongooseConnection;
if (!cached) {
    cached = global.__mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    // If already connected, return immediately
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // If a connection attempt is in progress, wait for it
    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI).then((m) => {
            console.log(`MongoDB Connected: ${m.connection.host}`);
            return m;
        }).catch((error) => {
            console.error(`Error connecting to MongoDB: ${error.message}`);
            cached.promise = null; // Reset so next request retries
            throw error;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectDB;
