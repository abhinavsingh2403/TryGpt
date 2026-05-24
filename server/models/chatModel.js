import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isImage: {
        type: Boolean,
        default: false,
    },
    inlineData: {
        mimeType: String,
        data: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const documentChunkSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    embedding: {
        type: [Number],
        required: true,
    }
});

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            default: 'New Chat',
        },
        messages: [messageSchema],
        documents: [documentChunkSchema],
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
