import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// ✅ Allowed origins
const allowedOrigins = [
    "http://localhost:3000",
    "https://socket-chat-nine-tau.vercel.app",
    "https://socket-chat-w578.onrender.com",
];

// ✅ Clean CORS setup
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Production static serving
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}

// ✅ Start server
server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`);
});
