import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
    getUserByUsername,
    getConversations,
    getUsersForSidebar,
    updateUserProfilePic,
    getUsersForNewChat,
    updatePrivacy,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/new", protectRoute, getUsersForNewChat);
router.get("/conversations", protectRoute, getConversations);
router.put("/update-pic", protectRoute, updateUserProfilePic);
router.put("/privacy", protectRoute, updatePrivacy);
router.get("/:username", protectRoute, getUserByUsername);

export default router;
