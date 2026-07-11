const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for dev
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', (playerName) => {
    // Generate a random 6-character room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms[roomCode] = {
      players: [{ id: socket.id, name: playerName || 'Player 1' }],
      board: Array(9).fill(null),
      xIsNext: true
    };
    socket.join(roomCode);
    socket.emit('roomCreated', roomCode);
    console.log(`Room ${roomCode} created by ${socket.id}`);
  });

  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const room = rooms[roomCode];
    if (room) {
      if (room.players.length === 1) {
        room.players.push({ id: socket.id, name: playerName || 'Player 2' });
        socket.join(roomCode);
        socket.emit('roomJoined', roomCode);
        // Start game
        io.to(roomCode).emit('gameStart', {
          players: room.players
        });
        console.log(`${socket.id} joined room ${roomCode}`);
      } else {
        socket.emit('roomError', 'Room is full.');
      }
    } else {
      socket.emit('roomError', 'Room does not exist.');
    }
  });

  socket.on('makeMove', ({ roomCode, index, playerSymbol }) => {
    const room = rooms[roomCode];
    if (room) {
      // In a real app we'd validate if it's the correct player's turn
      room.board[index] = playerSymbol;
      room.xIsNext = !room.xIsNext;
      // Broadcast to all clients in the room including sender
      io.to(roomCode).emit('moveMade', {
        index,
        playerSymbol,
        xIsNext: room.xIsNext
      });
    }
  });

  socket.on('playAgain', (roomCode) => {
    const room = rooms[roomCode];
    if (room) {
      room.board = Array(9).fill(null);
      room.xIsNext = true;
      io.to(roomCode).emit('resetGame');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove player from any room they were in
    for (const [roomCode, room] of Object.entries(rooms)) {
      if (room.players.some(p => p.id === socket.id)) {
        room.players = room.players.filter(p => p.id !== socket.id);
        io.to(roomCode).emit('playerDisconnected');
        if (room.players.length === 0) {
          delete rooms[roomCode];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
