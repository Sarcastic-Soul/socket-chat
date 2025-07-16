import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            default: ""
        },
        mediaUrl: {
            type: String,
            default: null,
        },
        mediaType: {
            type: String,
            enum: ["text", "image", "video", "audio", "file"],
            default: "text",
        },
        reactions: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                reaction: {
                    type: String, // e.g., "👍", "❤️", "😂"
                    required: true,
                },
                _id: false // Prevents Mongoose from creating a default _id for subdocuments
            },
        ],
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
