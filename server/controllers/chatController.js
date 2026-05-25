import Chat from '../models/chatModel.js';

// @desc    Get user chats
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new chat
// @route   POST /api/chats
// @access  Private
export const createChat = async (req, res) => {
    try {
        const { name } = req.body;
        const newChat = await Chat.create({
            userId: req.user._id,
            name: name || 'New Chat',
            messages: []
        });
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a chat (add messages or rename)
// @route   PUT /api/chats/:id
// @access  Private
export const updateChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Make sure the logged in user matches the chat user
        if (chat.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Sanitize the update body to prevent malicious mass-assignment
        const allowedUpdates = {};
        if (req.body.name !== undefined) allowedUpdates.name = req.body.name;
        if (req.body.messages !== undefined) allowedUpdates.messages = req.body.messages;
        allowedUpdates.updatedAt = new Date();

        const updatedChat = await Chat.findByIdAndUpdate(
            req.params.id,
            allowedUpdates,
            { returnDocument: 'after' }
        );

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a chat
// @route   DELETE /api/chats/:id
// @access  Private
export const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Make sure the logged in user matches the chat user
        if (chat.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await chat.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
