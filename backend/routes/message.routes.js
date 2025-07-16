import express from "express";
import { getMessages, sendMessage,addReaction } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/react/:messageId", protectRoute, addReaction);

export default router;
