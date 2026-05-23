import express from 'express';
import { generateResponse } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateResponse);

export default router;
