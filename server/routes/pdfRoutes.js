import express from 'express';
import multer from 'multer';
import { extractPdfText } from '../controllers/pdfController.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// @route   POST /api/pdf/extract
// @desc    Extract text from uploaded PDF
// @access  Public (or protected if needed, but since it doesn't touch DB, public is fine for now)
router.post('/extract', upload.single('pdf'), extractPdfText);

export default router;
