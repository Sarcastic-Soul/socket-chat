import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserById, getConversations, getUsersForSidebar, updateUserProfilePic, getUsersForNewChat } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/new", protectRoute, getUsersForNewChat);
router.get("/conversations", protectRoute, getConversations);
router.put("/update-pic", protectRoute, updateUserProfilePic);
router.get("/:id", protectRoute, getUserById);

export default router;
