import express from "express";
import {
    getMessages,
    sendMessage,
    addReaction,
    markMessagesAsRead,
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { messageRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, messageRateLimiter, sendMessage);
router.post("/react/:messageId", protectRoute, addReaction);
router.post("/read/:id", protectRoute, markMessagesAsRead);

export default router;
