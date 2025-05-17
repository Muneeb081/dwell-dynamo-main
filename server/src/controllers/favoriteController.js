import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';

// Add property to favorites
export const addFavorite = async (req, res) => {
    try {
        const { propertyId } = req.body;
        
        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            userId: req.user.userId,
            propertyId
        });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Property already in favorites' });
        }

        const favorite = new Favorite({
            userId: req.user.userId,
            propertyId
        });

        await favorite.save();
        res.status(201).json({
            message: 'Property added to favorites',
            favorite
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to favorites', error: error.message });
    }
};

// Remove property from favorites
export const removeFavorite = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const favorite = await Favorite.findOneAndDelete({
            userId: req.user.userId,
            propertyId
        });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.json({ message: 'Property removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from favorites', error: error.message });
    }
};

// Get user's favorites
export const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.userId })
            .populate({
                path: 'propertyId',
                populate: {
                    path: 'createdBy',
                    select: 'name email phone'
                }
            })
            .sort({ createdAt: -1 });

        res.json(favorites.map(fav => fav.propertyId));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error: error.message });
    }
};

// Check if property is favorited
export const checkFavorite = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const favorite = await Favorite.findOne({
            userId: req.user.userId,
            propertyId
        });

        res.json({ isFavorite: !!favorite });
    } catch (error) {
        res.status(500).json({ message: 'Error checking favorite', error: error.message });
    }
}; 