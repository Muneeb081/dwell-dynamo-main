import { request } from 'express';
import Property from '../models/Property.js';

// Create a new property
export const createProperty = async (req, res) => {
    
    try {
        const property = new Property({
            ...req.body,
            createdBy: req.user.userId
        });

       await property.save()
        res.status(201).json({
            message: 'Property created successfully',
            property
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating property', error: error.message });
    }
};

// Get all properties with optional filters
export const getProperties = async (req, res) => {
    try {
        const { type, status, city, minPrice, maxPrice } = req.query;
        const filter = {};

        if (type) filter.type = type;
        if (status) filter.status = status;
        if (city) filter['location.city'] = city;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const properties = await Property.find(filter)
            .populate('createdBy', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties', error: error.message });
    }
};

// Get a single property
export const getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('createdBy', 'name email phone');

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
            
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property', error: error.message });
    }
};
export const getUserProperties = async (req, res) => {
  try {
    
    // Fetch properties that belong to the user by their userId
    const properties = await Property.find({ 'createdBy': req.params.userId })
      .populate('createdBy', 'name email phone')  // Populating createdBy details
      

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: 'No properties found for this user' });
    }

    // Respond with the list of properties found
    res.json(properties);
  } catch (error) {
    // Handle errors and send appropriate response
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};

// Update a property
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user is the creator or an admin
        if (property.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this property' });
        }

        Object.assign(property, req.body); 
       
       const ress=  property.save();
console.log(ress)
        res.json({
            message: 'Property updated successfully',
            property
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating property', error: error.message });
    }
};
export const updatePropertyStatus = async (req, res) => {
  try {
    const { newStatus } = req.body;

    // Validate status
    if (!['sale', 'rent'].includes(newStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Find and update the status
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    // If not found
    if (!updatedProperty) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({
      success: true,
      message: 'Property status updated successfully',
      property: updatedProperty
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating property status', error: error.message });
  }
};


// Delete a property
export const deleteProperty = async (req, res) => {
    try {
       const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user is the creator or an admin
        if (property.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this property' });
        }
        await property.deleteOne();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property', error: error.message });
    }
};

