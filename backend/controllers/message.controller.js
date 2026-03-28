import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { encryptText, decryptText } from "../utils/encryption.js";

export const sendMessage = async (req, res) => {
    try {
        const { message, mediaUrl, mediaType } = req.body;
        const { id: conversationIdOrUserId } = req.params;
        const senderId = req.user._id;

        let isNewConversation = false;
        let conversation = await Conversation.findById(conversationIdOrUserId);

        if (!conversation) {
            conversation = await Conversation.findOne({
                isGroupChat: false,
                participants: { $all: [senderId, conversationIdOrUserId] },
            });

            if (!conversation) {
                const receiver = await User.findById(conversationIdOrUserId);
                if (!receiver) {
                    return res.status(404).json({ error: "User not found" });
                }
                if (receiver.isPublic === false) {
                    return res
                        .status(403)
                        .json({ error: "You cannot message a private user." });
                }

                conversation = await Conversation.create({
                    participants: [senderId, conversationIdOrUserId],
                });
                isNewConversation = true;
            }
        }

        if (!conversation.participants.includes(senderId)) {
            return res.status(403).json({
                error: "You are not a participant in this conversation.",
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId: conversation._id,
            message: message ? encryptText(message) : "",
            mediaUrl: mediaUrl || null,
            mediaType: mediaType || "text",
        });

        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        const populatedMessage = await newMessage.populate(
            "senderId",
            "fullName profilePic username isPublic",
        );

        // Decrypt message before sending to sockets/frontend
        if (populatedMessage.message) {
            populatedMessage.message = decryptText(populatedMessage.message);
        }

        if (conversation.isGroupChat) {
            io.to(conversation._id.toString()).emit(
                "newMessage",
                populatedMessage,
            );
        } else {
            const receiverId = conversation.participants.find(
                (p) => p.toString() !== senderId.toString(),
            );
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", populatedMessage);
            }
        }

        if (isNewConversation) {
            const populatedConv = await conversation.populate(
                "participants",
                "fullName profilePic username isPublic",
            );
            return res.status(201).json({
                newMessage: populatedMessage,
                newConversation: populatedConv,
            });
        }

        res.status(201).json({ newMessage: populatedMessage });
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const { before, limit = 50 } = req.query;
        const senderId = req.user._id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation || !conversation.participants.includes(senderId)) {
            return res.status(404).json({
                error: "Conversation not found or you are not a member.",
            });
        }

        let messageQuery = { _id: { $in: conversation.messages } };

        if (before) {
            const beforeMsg = await Message.findById(before);
            if (beforeMsg) {
                messageQuery.createdAt = { $lt: beforeMsg.createdAt };
            }
        }

        const messages = await Message.find(messageQuery)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        // Decrypt all messages before sending to client
        const decryptedMessages = messages.map((msg) => ({
            ...msg,
            message: msg.message ? decryptText(msg.message) : "",
        }));

        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.error("Error in getMessages controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markMessagesAsRead = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
            return res.status(404).json({
                error: "Conversation not found or you are not a member.",
            });
        }

        await Message.updateMany(
            {
                receiverId: conversationId,
                senderId: { $ne: userId },
                status: { $ne: "read" },
            },
            {
                $set: { status: "read" },
            },
        );

        if (conversation.isGroupChat) {
            io.to(conversationId).emit("messagesRead", {
                conversationId,
                userId,
            });
        } else {
            const otherParticipantId = conversation.participants.find(
                (p) => p.toString() !== userId.toString(),
            );
            const senderSocketId = getReceiverSocketId(otherParticipantId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messagesRead", {
                    conversationId,
                    userId,
                });
            }
        }

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.error("Error in markMessagesAsRead controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { reaction } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        const existingReactionIndex = message.reactions.findIndex(
            (r) =>
                r.userId.toString() === userId.toString() &&
                r.reaction === reaction,
        );

        if (existingReactionIndex !== -1) {
            message.reactions.splice(existingReactionIndex, 1);
        } else {
            const existingAnyReactionIndex = message.reactions.findIndex(
                (r) => r.userId.toString() === userId.toString(),
            );
            if (existingAnyReactionIndex !== -1) {
                message.reactions.splice(existingAnyReactionIndex, 1);
            }
            message.reactions.push({ userId, reaction });
        }

        await message.save();

        const messageObj = message.toObject();
        if (messageObj.message) {
            messageObj.message = decryptText(messageObj.message);
        }

        const conversation = await Conversation.findOne({
            messages: messageId,
        });

        if (conversation) {
            const receiverId = conversation.participants.find(
                (p) => p.toString() !== userId.toString(),
            );
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("messageReaction", messageObj);
            }

            const senderSocketId = getReceiverSocketId(userId);
            if (senderSocketId && senderSocketId !== receiverSocketId) {
                io.to(senderSocketId).emit("messageReaction", messageObj);
            }
        }

        res.status(200).json(messageObj);
    } catch (error) {
        console.error("Error in addReaction controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
