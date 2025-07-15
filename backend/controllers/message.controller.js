import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // await conversation.save();
        // await newMessage.save();

        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const { before, limit = 50 } = req.query;
        const senderId = req.user._id;

        // Find the conversation
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        });

        if (!conversation) return res.status(200).json([]);

        let messageQuery = { _id: { $in: conversation.messages } };

        if (before) {
            const beforeMsg = await Message.findById(before);
            if (beforeMsg) {
                messageQuery.createdAt = { $lt: beforeMsg.createdAt };
            }
        }

        // Fetch messages sorted by createdAt descending (latest first), then reverse to ascending
        const messages = await Message.find(messageQuery)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        res.status(200).json(messages.reverse());
    } catch (error) {
        console.error("Error in getMessages controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
