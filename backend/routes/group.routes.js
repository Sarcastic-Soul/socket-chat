import express from "express";
import {
    createGroup,
    updateGroupName,
    addParticipant,
    removeParticipant,
    makeAdmin,
    getGroupDetails,
    updateGroup,
    deleteGroup,
} from "../controllers/group.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.put("/:groupId/update", protectRoute, updateGroup);
router.delete("/:groupId/delete", protectRoute, deleteGroup)
router.get("/:groupId", protectRoute, getGroupDetails);
router.put("/:groupId/name", protectRoute, updateGroupName);
router.put("/:groupId/participants/add", protectRoute, addParticipant);
router.put("/:groupId/participants/remove", protectRoute, removeParticipant);
router.put("/:groupId/admins/add", protectRoute, makeAdmin);

export default router;
