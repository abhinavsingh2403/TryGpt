import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err);
});

// Load environment variables from .env file (only locally, not on Vercel)
if (!process.env.VERCEL) {
    try {
        const dotenv = await import('dotenv');
        dotenv.config({ override: false });
    } catch (e) {
        // dotenv not available, that's fine on Vercel
    }
}

// Initialize Express
const app = express();

// Connect to Database
if (process.env.NODE_ENV !== 'test' && process.env.MONGODB_URI) {
    connectDB().catch((err) => {
        console.error('Failed to connect to MongoDB on startup:', err);
    });
} else {
    if (process.env.NODE_ENV !== 'test') {
        console.warn('[WARNING] MONGODB_URI not found. Skipping DB connection.');
    }
}

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Setup Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/ai', aiRoutes);

// PDF routes loaded dynamically because pdf-parse crashes Vercel on import
try {
    const pdfModule = await import('./routes/pdfRoutes.js');
    app.use('/api/pdf', pdfModule.default);
} catch (e) {
    console.error('PDF routes failed to load (non-fatal):', e.message);
    app.use('/api/pdf', (req, res) => {
        res.status(503).json({ message: 'PDF processing is temporarily unavailable.' });
    });
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running!', vercel: !!process.env.VERCEL });
});

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api/')) {
            return res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
        }
        next();
    });
} else {
    app.get('/', (req, res) => {
        res.json({ message: 'TryGPT API is running in development mode' });
    });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

export default app;
