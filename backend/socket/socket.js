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
    "http://localhost:3000",
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
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;

        // Join user to all their group chat rooms
        try {
            const userGroups = await Conversation.find({
                isGroupChat: true,
                participants: userId,
            });
            userGroups.forEach((group) => {
                socket.join(group._id.toString());
            });
        } catch (error) {
            console.error("Error joining user to group rooms:", error.message);
        }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // WebRTC Signaling for 1-on-1 Calls
    socket.on("callUser", (data) => {
        console.log(
            `📞 Socket: callUser from ${data.from} to ${data.userToCall}`,
        );
        const receiverSocketId = getReceiverSocketId(data.userToCall);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incomingCall", {
                signal: data.signalData,
                from: data.from,
                callerName: data.callerName,
                callerPic: data.callerPic,
            });
        } else {
            console.log(
                `❌ Socket: User ${data.userToCall} is offline, cannot call`,
            );
        }
    });

    socket.on("answerCall", (data) => {
        console.log(`📞 Socket: answerCall from ${socket.id} to ${data.to}`);
        const callerSocketId = getReceiverSocketId(data.to);
        if (callerSocketId) {
            io.to(callerSocketId).emit("callAccepted", data.signal);
        }
    });

    socket.on("endCall", (data) => {
        console.log(`📞 Socket: endCall for ${data.to}`);
        const receiverSocketId = getReceiverSocketId(data.to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("callEnded");
        }
    });

    socket.on("iceCandidate", (data) => {
        const receiverSocketId = getReceiverSocketId(data.to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("iceCandidate", data.candidate);
        }
    });

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
