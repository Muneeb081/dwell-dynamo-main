import mongoose, { Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    area: string;
    address: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    furnished: boolean;
    parking: boolean;
  };
  images: string[];
  type: 'house' | 'apartment' | 'commercial' | 'plot';
  status: 'sale' | 'rent';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new mongoose.Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  location: {
    city: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String, required: true }
  },
  features: {
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true, min: 0 },
    furnished: { type: Boolean, default: false },
    parking: { type: Boolean, default: false }
  },
  images: [{ type: String }],
  type: { 
    type: String, 
    enum: ['house', 'apartment', 'commercial', 'plot'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['sale', 'rent'],
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true
});

// Indexes for better query performance
propertySchema.index({ type: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ 'location.area': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ createdBy: 1 });

const PropertyModel = mongoose.model<IProperty>('Property', propertySchema);

export default PropertyModel; 