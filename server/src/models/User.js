import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  phone: { type: String },
  image: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  searchHistory: [{
    query: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  googleId: { type: String, sparse: true },
  isGoogleUser: { type: Boolean, default: false }
}, {
  timestamps: true
});



// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!this.password) {
      console.log('No password stored for user:', this.email);
      return false;
    }
    
    if (!candidatePassword) {
      console.log('No candidate password provided for user:', this.email);
      return false;
    }

    console.log('Comparing passwords for user:', this.email);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User; 