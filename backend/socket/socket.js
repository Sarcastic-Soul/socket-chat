import { Server } from "socket.io";
import http from "http";
import express from "express";
import Conversation from "../models/conversation.model.js";

const app = express();
const server = http.createServer(app);

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const allowedOrigins = [
    "https://socket-chat-nine-tau.vercel.app",
    "http://localhost:3000"
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    },
});

io.on("connection", async (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;

        // Join user to all their group chat rooms
        try {
            const userGroups = await Conversation.find({ isGroupChat: true, participants: userId });
            userGroups.forEach(group => {
                socket.join(group._id.toString());
            });
        } catch (error) {
            console.log("Error joining user to group rooms:", error.message);
        }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };