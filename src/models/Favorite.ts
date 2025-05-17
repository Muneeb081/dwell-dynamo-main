import mongoose, { Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new mongoose.Schema<IFavorite>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property',
    required: true 
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

// Indexes for better query performance
favoriteSchema.index({ userId: 1 });
favoriteSchema.index({ propertyId: 1 });
favoriteSchema.index({ createdAt: -1 });

const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);

export default Favorite; 