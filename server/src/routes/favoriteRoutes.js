import express from 'express';
import {
    addFavorite,
    removeFavorite,
    getFavorites,
    checkFavorite
} from '../controllers/favoriteController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(verifyToken);

router.post('/', addFavorite);
router.delete('/:propertyId', removeFavorite);
router.get('/', getFavorites);
router.get('/check/:propertyId', checkFavorite);

export default router; 