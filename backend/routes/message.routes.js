import express from "express";
import {
    getMessages,
    sendMessage,
    addReaction,
    markMessagesAsRead,
    generateMagicReply,
    editMessage,
    deleteMessage,
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { messageRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, messageRateLimiter, sendMessage);
router.post("/react/:messageId", protectRoute, addReaction);
router.post("/read/:id", protectRoute, markMessagesAsRead);
router.post(
    "/magic-reply",
    protectRoute,
    messageRateLimiter,
    generateMagicReply,
);


router.put("/edit/:messageId", protectRoute, messageRateLimiter, editMessage);
router.delete("/delete/:messageId", protectRoute, messageRateLimiter, deleteMessage);
export default router;
