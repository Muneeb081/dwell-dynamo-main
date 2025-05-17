import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const register = async (req, res) => {
    try {
        const { name, email, password, role, googleId, image } = req.body;
        console.log('Registration attempt for email:', email);
        const salt = await bcrypt.genSalt(5);
        // Check if user already exists
        const existingUser = await User.findOne({ email });
         
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }
 
        // Create new user
       const hashpass =await bcrypt.hash(password, salt)
       console.log(hashpass.toString())
        const user = new User({
            name,
            email,
            password: password ?  hashpass : undefined,
            role: role || 'user',
            googleId,
            image,
            isGoogleUser: !!googleId
        });

        console.log('Saving new user with details:', {
            email: user.email,
            hasPassword: !!user.password,
            isGoogleUser: user.isGoogleUser
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('User registered successfully:', email);
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                phone: user.phone,
                favorites: user.favorites,
                searchHistory: user.searchHistory
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate request body
        if (!email || !password) {
            console.log('Missing credentials:', { email: !!email, password: !!password });
            return res.status(400).json({ 
                message: 'Email and password are required',
                details: { email: !!email, password: !!password }
            });
        }

        console.log('Login attempt started for email:', email);
        
        // Find user by email
        const user = await User.findOne({ email });
        console.log('User found in database:', user ? 'Yes' : 'No');
        
        if (!user) {
            console.log('Login failed: User not found for email:', email);
            return res.status(400).json({ 
                message: 'User not found',
                details: 'No user exists with this email address'
            });
        }

        // Check if user has a password (not a Google user)
        if (!user.password) {
            console.log('Login failed: User has no password (Google user)');
            return res.status(400).json({ 
                message: 'Google sign-in required',
                details: 'This account was created using Google sign-in'
            });
        }

        // Compare passwords
        console.log('Starting password comparison...');
        const isMatch = await bcrypt.compare(password,user.password);
        console.log( await bcrypt.hash(password,10),user.password);
        console.log('Password comparison complete. Result:', isMatch);

        if (!isMatch) {
            console.log('Login failed: Password mismatch for user:', email);
            return res.status(400).json({ 
                message: 'Invalid password',
                details: 'The password you entered is incorrect'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Login successful for user:', email);
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image || '',
                phone: user.phone || '',
                favorites: user.favorites || [],
                searchHistory: user.searchHistory || []
            }
        });
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            message: 'Error logging in', 
            error: error.message,
            details: 'An unexpected error occurred during login'
        });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// Validate token
export const validateToken = async (req, res) => {
    try {
        // If we reach here, the token is valid (verified by middleware)
        res.status(200).json({ valid: true });
    } catch (error) {
        res.status(500).json({ message: 'Error validating token', error: error.message });
    }
};

// Google authentication
export const googleAuth = async (req, res) => {
    try {
        const { googleId, email, name, image, role } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                name,
                email,
                googleId,
                image,
                role: role || 'user',
                isGoogleUser: true
            });
            await user.save();
        } else if (!user.googleId) {
            // Update existing user with Google ID if they registered manually
            user.googleId = googleId;
            user.isGoogleUser = true;
            if (!user.image) user.image = image;
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Google authentication successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image || '',
                phone: user.phone || '',
                favorites: user.favorites || [],
                searchHistory: user.searchHistory || []
            }
        });
    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(500).json({ message: 'Error during Google authentication', error: error.message });
    }
};

// Google registration
export const googleRegister = async (req, res) => {
    try {
        const { googleId, email, name, image, role } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please login instead.' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            googleId,
            image,
            role: role || 'user',
            isGoogleUser: true
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Google registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image || '',
                phone: user.phone || '',
                favorites: user.favorites || [],
                searchHistory: user.searchHistory || []
            }
        });
    } catch (error) {
        console.error('Google registration error:', error);
        res.status(500).json({ message: 'Error during Google registration', error: error.message });
    }
}; 