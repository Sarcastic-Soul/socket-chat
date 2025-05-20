
# React + Express Socket.io Chat App 🚀💬

A real-time chat application built with React (frontend) and Express.js (backend) using Socket.io for live communication.

## Features ✨

- User login with email and password authentication 🔐  
- Real-time chat with multiple users 👥  
- State management with Zustand ⚡  
- UI styled with elegant glassmorphism effect 🪟  
- Message caching to minimize redundant API calls 📦  
- MongoDB used as the database 🍃  

## Tech Stack 🛠️

- Frontend: React, Zustand, Socket.io-client  
- Backend: Express.js, Socket.io, MongoDB, JWT authentication  

## Getting Started 🏁

### Prerequisites 📋

- Node.js installed  
- MongoDB database ready  

### Installation 💻

1. Clone the repository

2. Install dependencies in both frontend and backend folders:

```bash
cd frontend
npm install

cd ../backend
npm install
```

3. Create a `.env` file in the backend folder with the following variables:

```
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Running Locally ▶️

- Start the backend server (runs on port 5000):

```bash
cd backend
npm start
```

- Start the frontend (runs on port 3000):

```bash
cd frontend
npm start
```

## Usage 🎉

- Register or login with your email and password  
- Start chatting with others in real-time  
- Messages are cached locally to reduce API calls and improve performance  
- Enjoy a smooth and modern glassmorphism UI 🪟  

---

Feel free to contribute or report issues.  
Happy chatting! 🚀
