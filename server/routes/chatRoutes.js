import express from 'express';
import { getChats, createChat, updateChat, deleteChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getChats)
    .post(protect, createChat);

router.route('/:id')
    .put(protect, updateChat)
    .delete(protect, deleteChat);

export default router;
