import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/user.model.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";
import { encryptText } from "./utils/encryption.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log("🌱 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("✅ Connected.");

        console.log("🗑️ Clearing existing data...");
        await User.deleteMany({});
        await Conversation.deleteMany({});
        await Message.deleteMany({});

        console.log("👥 Creating dummy users...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const usersData = [
            {
                fullName: "Alice Smith",
                username: "alice",
                password: hashedPassword,
                profilePic:
                    "https://ui-avatars.com/api/?name=Alice+Smith&background=random",
                isPublic: true,
            },
            {
                fullName: "Bob Johnson",
                username: "bob",
                password: hashedPassword,
                profilePic:
                    "https://ui-avatars.com/api/?name=Bob+Johnson&background=random",
                isPublic: true,
            },
            {
                fullName: "Charlie Private",
                username: "charlie",
                password: hashedPassword,
                profilePic:
                    "https://ui-avatars.com/api/?name=Charlie+Private&background=random",
                isPublic: false, // Private user
            },
            {
                fullName: "David Lee",
                username: "david",
                password: hashedPassword,
                profilePic:
                    "https://ui-avatars.com/api/?name=David+Lee&background=random",
                isPublic: true,
            },
            {
                fullName: "Emma Watson",
                username: "emma",
                password: hashedPassword,
                profilePic:
                    "https://ui-avatars.com/api/?name=Emma+Watson&background=random",
                isPublic: true,
            },
            {
                fullName: "Frank Castle",
                username: "frank",
                password: hashedPassword,
                profilePic:
                    "https://ui-avatars.com/api/?name=Frank+Castle&background=random",
                isPublic: true,
            },
        ];

        const createdUsers = await User.insertMany(usersData);
        const [alice, bob, charlie, david, emma, frank] = createdUsers;

        console.log("💬 Creating 1-on-1 conversation (Alice & Bob)...");
        const conv1 = await Conversation.create({
            participants: [alice._id, bob._id],
            isGroupChat: false,
        });

        const msg1 = await Message.create({
            senderId: alice._id,
            receiverId: conv1._id,
            message: encryptText("Hey Bob, how are you?"),
            status: "read",
        });

        const msg2 = await Message.create({
            senderId: bob._id,
            receiverId: conv1._id,
            message: encryptText("I'm doing great Alice! Testing the new app."),
            status: "read",
        });

        const msg3 = await Message.create({
            senderId: alice._id,
            receiverId: conv1._id,
            message: encryptText(
                "The new encryption feature works perfectly! 🔐",
            ),
            status: "read",
            reactions: [
                { userId: bob._id, reaction: "🔥" },
                { userId: alice._id, reaction: "❤️" },
            ],
        });

        const msg3b = await Message.create({
            senderId: bob._id,
            receiverId: conv1._id,
            message: encryptText("Have you tested the new video calling yet?"),
            status: "sent",
        });

        conv1.messages.push(msg1._id, msg2._id, msg3._id, msg3b._id);
        await conv1.save();

        console.log("💬 Creating 1-on-1 conversation (Bob & Charlie)...");
        const conv2 = await Conversation.create({
            participants: [bob._id, charlie._id],
            isGroupChat: false,
        });

        const msg4 = await Message.create({
            senderId: bob._id,
            receiverId: conv2._id,
            message: encryptText(
                "Hey Charlie, I know your profile is private but we have an existing chat!",
            ),
            status: "read",
        });

        const msg5 = await Message.create({
            senderId: charlie._id,
            receiverId: conv2._id,
            message: encryptText(
                "Yes, existing connections are preserved! Thanks for checking.",
            ),
            status: "read",
            reactions: [{ userId: bob._id, reaction: "👍" }],
        });

        conv2.messages.push(msg4._id, msg5._id);
        await conv2.save();

        console.log("💬 Creating 1-on-1 conversation (Emma & Frank)...");
        const conv3 = await Conversation.create({
            participants: [emma._id, frank._id],
            isGroupChat: false,
        });

        const msg6 = await Message.create({
            senderId: emma._id,
            receiverId: conv3._id,
            message: encryptText(
                "Hey Frank! Did you see the new dark mode theme?",
            ),
            status: "read",
        });

        const msg7 = await Message.create({
            senderId: frank._id,
            receiverId: conv3._id,
            message: encryptText(
                "Yes! It looks amazing. Way better than the old white theme.",
            ),
            status: "sent",
            reactions: [{ userId: emma._id, reaction: "😎" }],
        });

        conv3.messages.push(msg6._id, msg7._id);
        await conv3.save();

        console.log("👥 Creating Group Chat (Alice, Bob, David, Emma)...");
        const groupConv = await Conversation.create({
            participants: [alice._id, bob._id, david._id, emma._id],
            isGroupChat: true,
            groupName: "The Cool Group 😎",
            admins: [alice._id],
        });

        const groupMsg1 = await Message.create({
            senderId: alice._id,
            receiverId: groupConv._id,
            message: encryptText("Welcome to the group guys!"),
            status: "read",
        });

        const groupMsg2 = await Message.create({
            senderId: david._id,
            receiverId: groupConv._id,
            message: encryptText("Glad to be here!"),
            status: "read",
            reactions: [{ userId: alice._id, reaction: "🎉" }],
        });

        const groupMsg3 = await Message.create({
            senderId: emma._id,
            receiverId: groupConv._id,
            message: encryptText(
                "Hey everyone! We should test a group call sometime soon.",
            ),
            status: "sent",
            reactions: [
                { userId: bob._id, reaction: "💯" },
                { userId: david._id, reaction: "👍" },
            ],
        });

        groupConv.messages.push(groupMsg1._id, groupMsg2._id, groupMsg3._id);
        await groupConv.save();

        console.log("🎉 Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
