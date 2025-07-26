import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, phone, address } = req.body;
    const userId = req.user._id;

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
      updateData.email = email.toLowerCase();
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Profile updated successfully',
      user: userData
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   GET /api/users/providers
// @desc    Get all providers
// @access  Public
router.get('/providers', async (req, res) => {
  try {
    const providers = await User.find({ 
      userType: 'provider',
      isActive: true 
    }).select('-password');

    const providersData = providers.map(provider => ({
      id: provider._id,
      name: provider.name,
      email: provider.email,
      userType: provider.userType,
      avatar: provider.avatar,
      createdAt: provider.createdAt
    }));

    res.json({ providers: providersData });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ message: 'Server error retrieving providers' });
  }
});

export default router;
