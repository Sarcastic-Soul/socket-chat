import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserById, getUsersForSidebar } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getUserById);

export default router;
