# Real-Time Multiplayer Tic-Tac-Toe

A stunning, real-time multiplayer Tic-Tac-Toe game built with modern web technologies. Challenge the unbeatable computer AI or play against friends online in private rooms!

## ✨ Features

- **Real-Time Multiplayer**: Instantly create a 6-digit room code and share it with a friend to play together in real-time.
- **Smart AI Opponent**: Play locally against the computer. The computer is powered by the unbeatable **Minimax algorithm**.
- **Custom Player Names**: Set your display name so your friends know who is crushing them.
- **Premium UI & Aesthetics**: Built with an immersive dark theme, glassmorphism components, sleek gradients, and subtle CSS animations to provide a top-tier user experience.
- **Responsive Design**: Play on your phone, tablet, or desktop.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Lucide React (Icons)
- **Backend**: Node.js, Express
- **Real-Time Communication**: Socket.IO

## 🚀 Getting Started

To run this project locally, you will need two terminal windows open—one for the backend server and one for the frontend client.

### 1. Start the Backend Server

```bash
cd server
npm install
npm run dev
```
*The server will run on `http://localhost:PORT_NUMBER` using `node --watch`.*

### 2. Start the Frontend Client

In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*The Vite development server will start and provide a local URL (e.g., `http://localhost:PORT_NUMBER`).*

## 🎮 How to Play

1. Enter your custom name on the **Start Screen** (or leave it as Player).
2. Choose your mode:
   - **Play Computer**: Jump right into a match against the AI.
   - **Play Friend**: Click "Create Room" to generate a 6-digit code. Send this code to your friend, and they can click "Join Room" to enter your game.
3. The first player to align 3 of their symbols (X or O) vertically, horizontally, or diagonally wins!

## 📝 License

This project is completely open source. Feel free to fork, modify, and build upon it!
