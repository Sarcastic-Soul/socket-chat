# React + Express Socket.io Chat App 🚀💬

A real-time chat application built with React (frontend) and Express.js (backend) using Socket.io for live communication.

## 🌐 Live Demo

🔗 Deployment: [https://socket-chat-nine-tau.vercel.app/](https://socket-chat-nine-tau.vercel.app/)   
🧪 Test Credentials (or run the seed script):
- Username: alice
- Password: password123

## 🏗️ Architecture

- Frontend (React + Vite) communicates with backend via REST + Socket.io
- Real-time events handled using WebSockets (Socket.io)
- Media uploads handled via Cloudinary
- Messages stored in MongoDB with AES-256 encryption
- Local caching via IndexedDB (idb) using stale-while-revalidate strategy
- WebRTC used for peer-to-peer video calling (signaling via Socket.io)

## ⚡ Engineering Highlights

- Implemented stale-while-revalidate caching using IndexedDB for instant chat loading
- Designed real-time message lifecycle (sent → read) using Socket.io events
- Built peer-to-peer video calling using WebRTC with custom signaling server
- Secured messages using AES-256 encryption at rest
- Implemented rate limiting and abuse protection using express-rate-limit and Helmet

## 📸 Screenshots

### 🏠 Home Screen & Landing
![Home](./screenshots/home-ss.png)

### 💬 Chat Interface
![Chat](./screenshots/conversation-ss.png)

### 📹 Video Calling
![Video](./screenshots/video-call.png)

## Features ✨

- User login/signup with unique username and password authentication 🔐
- Real-time chat with multiple users 👥
- Emojis and reaction support for messages 😂👍
- High-quality 1-on-1 Video Calling using WebRTC 📹📞
- Read Receipts (Sent / Read ticks) & Unread Message Indicators ✔️✔️
- Media support in chat (Drag & Drop images and videos with progress bars) 🖼️📹
- Server-Side Encryption at Rest (AES-256) to protect database message history 🛡️
- Rate Limiting and Abuse Protection against spam attacks 🚦
- WhatsApp-style Stale-While-Revalidate caching for instant offline loads ⚡

- **Magic Reply (AI):** AI-powered smart replies using Google Gemini API with customizable tones ✨
- Edit Sent Messages to fix typos with a real-time `(edited)` indicator ✏️
- "Delete for Everyone" to remove messages from active conversations 🗑️
- Native app-like experience on mobile devices with smooth layout transitions 📱
- Customizable profile icons and Privacy Controls (Public/Private profiles) 👤
- Create and manage groups (add/remove members, admin roles, group icons)
- State management with Zustand 🧠
- Modern and responsive UI built with **Mantine UI** 🎨
- Dark/Light mode toggle and customizable primary themes 🌗
- Resizable split-pane sidebar for a tailored chat experience 📏
- MongoDB used as the database 🍃

## Tech Stack 🛠️

- **Frontend:** React, Mantine UI (@mantine/core, @mantine/notifications), Zustand, Socket.io-client, emoji-picker-react, idb, react-icons, react-router-dom
- **Backend:** Express.js, Socket.io, MongoDB, @google/generative-ai (Gemini), JWT authentication, bcryptjs, cloudinary, cookie-parser, dotenv, jsonwebtoken, mongoose, express-rate-limit, helmet

## 📂 Project Structure

```text
mern-chat-app/
├── backend/            # Express.js + Socket.io Server
│   ├── controllers/    # Route logic (Auth, Messages, Users, Groups)
│   ├── db/             # MongoDB connection setup
│   ├── middleware/     # Protected routes & Rate Limiter
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Endpoint definitions
│   ├── socket/         # WebRTC Signaling & Socket.io events
│   ├── utils/          # Encryption, Cloudinary & JWT helpers
│   └── server.js       # Main server entry point
└── frontend/           # React + Vite Client
    ├── public/         # Static assets
    └── src/
        ├── components/ # Reusable UI components (Mantine)
        ├── context/    # React Context (Auth, Call, Socket)
        ├── hooks/      # Custom API hooks (SWR logic)
        ├── pages/      # App Views (Home, Landing, Login, Profile)
        ├── utils/      # IndexedDB cache manager
        ├── zustand/    # Global state management
        ├── App.jsx     # Main Router + Global Modals
        └── main.jsx    # React DOM root + Theme Providers
```

## Getting Started 🏁

### Prerequisites 📋

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
- MongoDB database ready

### Installation 💻

1. Clone the repository

2. Install dependencies in both frontend and backend folders using Bun:

```bash
cd frontend
bun install

cd ../backend
bun install
```

3. Create a `.env` file in the backend folder with the following variables:

```env
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ENCRYPTION_KEY=your_super_secret_32_character_key
GEMINI_API_KEY=your_gemini_api_key_here
```

### Seeding the Database 🌱

You can quickly populate your database with dummy users, conversations, groups, and messages to test the application by running:

```bash
cd backend
bun run seed
```

### Running Locally ▶️

1. Start the backend server (runs on port 5000):

```bash
cd backend
bun run dev
```

2. Start the frontend (runs on port 3000):

```bash
cd frontend
bun run dev
```

## Usage 🎉

- Register or login with your unique username and password
- Start chatting with any person signed up on this platform in real-time
- Express yourself with emojis and reactions
- See when your messages are delivered and read with double-tick receipts ✔️✔️
- Start a peer-to-peer Video Call with anyone in a 1-on-1 conversation 📹
- Drag and drop images and videos directly into chats with live upload progress 📤
- Toggle your profile privacy to hide from public searches
- Create and manage chat groups with various functionalities
- Messages load instantly using advanced offline caching, syncing automatically in the background
- Personalize your UI experience with Light/Dark mode and custom theme colors 🎨
- All messages are AES-256 encrypted at rest inside the database for maximum privacy 🔐
- Instantly generate AI-powered context-aware responses using the Magic Reply button ✨
- Quickly find specific past messages using the in-chat search bar 🔍
- Seamlessly transition between mobile and desktop layouts for chatting on the go 📱
- Record and send quick voice messages by clicking the microphone icon 🎤
- Hover over any message and click the reply icon to send a quoted response 💬
- See exactly who is typing in real-time with smooth animated indicators ✍️

Feel free to contribute or report issues.  
**Happy chatting! 🚀**
