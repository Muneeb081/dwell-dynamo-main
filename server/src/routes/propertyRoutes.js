import express from 'express';
import {
    createProperty,
    getProperties,
    getProperty,
    updateProperty,
    deleteProperty,
    getUserProperties,
    updatePropertyStatus
} from '../controllers/propertyController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getProperty);

// Protected routes
router.get('/user/:userId', verifyToken, getUserProperties);
router.post('/', verifyToken, createProperty);
router.put('/:id', verifyToken, updateProperty);
router.put('/:id/status',verifyToken,updatePropertyStatus)
router.delete('/:id', verifyToken, deleteProperty);

export default router; 