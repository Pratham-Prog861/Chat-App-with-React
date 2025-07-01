# Real-Time Chat Application
A modern, real-time chat application built with React and Socket.IO, featuring a sleek user interface and instant messaging capabilities.

## Features
- 🔐 User Authentication : Simple username-based login system with persistent sessions
- 👤 User Avatars : Automatic avatar generation using DiceBear API
- 💬 Real-time Messaging : Instant message delivery using Socket.IO
- 👥 Online Users List : See who's currently active in the chat
- 🎨 Modern UI : Clean and responsive design using Tailwind CSS
- 🔔 System Messages : Notifications for user join/leave events
- ⏰ Message Timestamps : Time display for each message
## Tech Stack

### Frontend
- React (v19)
- Tailwind CSS
- Socket.IO Client
- Lucide React (for icons)
- Date-fns (for time formatting)
- Vite (for development and building)

### Backend
- Node.js
- Express
- Socket.IO
- CORS
- Dotenv (for environment variables)

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm

### Installation
1. Clone the repository

2. Install Backend Dependencies

```bash
cd backend
npm install
```
3. Install Frontend Dependencies
```bash
cd frontend
npm install
```
### Running the Application
1. Start the Backend Server
```bash
cd backend
npm start
```
The server will start on http://localhost:3000

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:5173

## Project Structure
```bash
├── backend/                 # Backend server code
│   ├── index.js            # Main server file
│   └── package.json        # Backend dependencies
│
└── frontend/               # Frontend React application
    ├── src/
    │   ├── components/     # React components
    │   ├── App.jsx         # Main application component
    │   └── main.jsx        # Application entry point
    └── package.json        # Frontend dependencies

```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request