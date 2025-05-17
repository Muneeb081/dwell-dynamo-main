import express from 'express';
import {
    register,
    login,
    getProfile,
    updateProfile,
    deleteUser,
    validateToken,
    googleAuth,
    googleRegister
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google-auth', googleAuth);
router.post('/google-register', googleRegister);
router.get('/validate-token', verifyToken, validateToken);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.delete('/profile', verifyToken, deleteUser);

export default router; 