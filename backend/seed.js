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
                profilePic: "https://ui-avatars.com/api/?name=Alice+Smith&background=random",
                isPublic: true,
            },
            {
                fullName: "Bob Johnson",
                username: "bob",
                password: hashedPassword,
                profilePic: "https://ui-avatars.com/api/?name=Bob+Johnson&background=random",
                isPublic: true,
            },
            {
                fullName: "Charlie Private",
                username: "charlie",
                password: hashedPassword,
                profilePic: "https://ui-avatars.com/api/?name=Charlie+Private&background=random",
                isPublic: false, // Private user
            },
            {
                fullName: "David Lee",
                username: "david",
                password: hashedPassword,
                profilePic: "https://ui-avatars.com/api/?name=David+Lee&background=random",
                isPublic: true,
            }
        ];

        const createdUsers = await User.insertMany(usersData);
        const [alice, bob, charlie, david] = createdUsers;

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
            message: encryptText("The new encryption feature works perfectly! 🔐"),
            status: "sent",
        });

        conv1.messages.push(msg1._id, msg2._id, msg3._id);
        await conv1.save();

        console.log("💬 Creating 1-on-1 conversation (Bob & Charlie)...");
        const conv2 = await Conversation.create({
            participants: [bob._id, charlie._id],
            isGroupChat: false,
        });

        const msg4 = await Message.create({
            senderId: bob._id,
            receiverId: conv2._id,
            message: encryptText("Hey Charlie, I know your profile is private but we have an existing chat!"),
            status: "sent",
        });

        conv2.messages.push(msg4._id);
        await conv2.save();

        console.log("👥 Creating Group Chat (Alice, Bob, David)...");
        const groupConv = await Conversation.create({
            participants: [alice._id, bob._id, david._id],
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
            status: "sent",
        });

        groupConv.messages.push(groupMsg1._id, groupMsg2._id);
        await groupConv.save();

        console.log("🎉 Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
