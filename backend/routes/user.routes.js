import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserById, getUsersForSidebar, updateUserProfilePic } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getUserById);
router.put("/update-pic", protectRoute, updateUserProfilePic);

export default router;
