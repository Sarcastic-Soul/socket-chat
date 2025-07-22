import Conversation from "../models/conversation.model.js";

export const getGroupDetails = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Conversation.findById(groupId).populate("participants", "fullName profilePic").populate("admins", "fullName");

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (!group.participants.some(p => p._id.equals(userId))) {
            return res.status(403).json({ error: "You are not a member of this group." });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error("Error in getGroupDetails: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createGroup = async (req, res) => {
    try {
        const { name, participants } = req.body;
        const userId = req.user._id;

        if (!name || !participants || participants.length < 1) {
            return res.status(400).json({ error: "Please provide a group name and at least one participant." });
        }

        const allParticipants = [...participants, userId];

        const newGroup = new Conversation({
            groupName: name,
            participants: allParticipants,
            isGroupChat: true,
            admins: [userId],
        });

        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        console.error("Error in createGroup: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { groupName, groupIcon } = req.body;
        const userId = req.user._id;

        const group = await Conversation.findById(groupId);

        if (!group) return res.status(404).json({ error: "Group not found" });
        if (!group.admins.includes(userId)) return res.status(403).json({ error: "Only admins can update the group." });

        if (groupName) group.groupName = groupName;
        if (groupIcon) group.groupIcon = groupIcon;

        await group.save();
        res.status(200).json(group);
    } catch (error) {
        console.error("Error in updateGroup: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Conversation.findById(groupId);

        if (!group) return res.status(404).json({ error: "Group not found" });
        if (!group.admins.includes(userId)) return res.status(403).json({ error: "Only admins can delete the group." });

        await Conversation.findByIdAndDelete(groupId);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        console.error("Error in deleteGroup: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateGroupName = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name } = req.body;
        const userId = req.user._id;

        const group = await Conversation.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (!group.admins.includes(userId)) {
            return res.status(403).json({ error: "Only admins can update the group name." });
        }

        group.groupName = name;
        await group.save();
        res.status(200).json(group);
    } catch (error) {
        console.error("Error in updateGroupName: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addParticipant = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userIdToAdd } = req.body;
        const userId = req.user._id;

        const group = await Conversation.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (!group.admins.includes(userId)) {
            return res.status(403).json({ error: "Only admins can add participants." });
        }

        if (group.participants.includes(userIdToAdd)) {
            return res.status(400).json({ error: "User is already in the group." });
        }

        group.participants.push(userIdToAdd);
        await group.save();
        res.status(200).json(group);
    } catch (error) {
        console.error("Error in addParticipant: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const removeParticipant = async (req, res) => {
	try {
		const { groupId } = req.params;
		const { userIdToRemove } = req.body;
		const userId = req.user._id;

		const group = await Conversation.findById(groupId);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		if (!group.admins.includes(userId)) {
			return res.status(403).json({ error: "Only admins can remove participants." });
		}

		group.participants = group.participants.filter(p => p.toString() !== userIdToRemove);

        group.admins = group.admins.filter(adminId => adminId.toString() !== userIdToRemove);

		await group.save();
		res.status(200).json(group);
	} catch (error) {
		console.error("Error in removeParticipant: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const makeAdmin = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userIdToMakeAdmin } = req.body;
        const userId = req.user._id;

        const group = await Conversation.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (!group.admins.includes(userId)) {
            return res.status(403).json({ error: "Only admins can make other users admins." });
        }

        if (group.admins.includes(userIdToMakeAdmin)) {
            return res.status(400).json({ error: "User is already an admin." });
        }

        group.admins.push(userIdToMakeAdmin);
        await group.save();
        res.status(200).json(group);
    } catch (error) {
        console.error("Error in makeAdmin: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
