import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
    sendMessage,
    getMessages,
    getConversation,
    markAsRead,
    deleteMessage,
    getUnreadMessagesCount
} from '../controllers/messageController.js';

const router = express.Router();

// All routes are protected
router.use(verifyToken);

router.post('/m', sendMessage);
router.get('/', getMessages);
router.get('/unread-count/:userId', getUnreadMessagesCount);
router.get('/conversation/:userId', getConversation);
router.patch('/read', markAsRead);
router.delete('/:messageId', deleteMessage);

export default router; 