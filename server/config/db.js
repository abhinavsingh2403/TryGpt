import mongoose from 'mongoose';

// Enable buffering so Mongoose doesn't throw immediate 'bufferCommands = false' errors
// if queries are executed during a reconnect phase.
mongoose.set('bufferCommands', true);

let cached = global.__mongooseConnection;
if (!cached) {
    cached = global.__mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    // If already connected, return immediately
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // In serverless environments, if a connection was established in a previous
    // invocation but has since timed out or disconnected, clear the cache.
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
        cached.promise = null;
        cached.conn = null;
    }

    // If a connection attempt is not in progress, start one
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
        };
        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((m) => {
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
