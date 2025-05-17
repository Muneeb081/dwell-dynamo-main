import Message from '../models/Message.js';
import User from '../models/User.js';

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, propertyId, content } = req.body;

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        const message = new Message({
            senderId: req.user.userId,
            receiverId,
            propertyId,
            content
        });

        await message.save();
        res.status(201).json({
            message: 'Message sent successfully',
            content: message
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

// Get user's messages
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user.userId },
                { receiverId: req.user.userId }
            ]
        })
        .populate('senderId', 'name email image')
        .populate('receiverId', 'name email image')
        .populate('propertyId', 'title price images')
        .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

// Get conversation between two users
export const getConversation = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: req.user.userId, receiverId: userId },
                { senderId: userId, receiverId: req.user.userId }
            ]
        })
        .populate('senderId', 'name email image')
        .populate('receiverId', 'name email image')
        .populate('propertyId', 'title price images')
        .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversation', error: error.message });
    }
};
// controllers/messageController.ts

export const getUnreadMessagesCount = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

      const count = await Message.countDocuments({
    receiverId: userId,
    read: false
  });
  await Message.countDocuments({
    receiverId: userId,
    read: false
  })
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread messages count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
    try {

        const { senderId, receiverId } = req.body;
        const userId = req.user.userId;


        if (receiverId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update all unread messages from senderId to receiverId
        const result = await Message.updateMany(
            {
                senderId,
                receiverId,
                read: false,
            },
            { $set: { read: true } }
        );

        return res.status(200).json({
            message: 'Messages marked as read',
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if user is the sender or receiver
        if (message.senderId.toString() !== req.user.userId && 
            message.receiverId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }

        await message.remove();
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
}; 