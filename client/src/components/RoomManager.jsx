import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Loader2, User } from 'lucide-react';
import { cn } from '../lib/utils';

// Connect to backend (use environment variable in production, fallback to localhost in dev)
const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

export default function RoomManager({ onReady, playerName, setPlayerName }) {
  const [view, setView] = useState('choose'); // choose | create | join
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // We do NOT disconnect the socket on unmount here, 
    // because we need to pass this live socket to the GameController!
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('roomCreated', (code) => {
      setRoomCode(code);
      setStatus('Waiting for opponent to join...');
      setLoading(false);
    });

    socket.on('roomJoined', (code) => {
      setStatus('Joined! Waiting for game to start...');
    });

    socket.on('roomError', (msg) => {
      setStatus(`Error: ${msg}`);
      setLoading(false);
    });

    socket.on('gameStart', (data) => {
      // Player 1 (creator) is X, Player 2 is O
      const mySymbol = data.players[0].id === socket.id ? 'X' : 'O';
      const opponent = data.players.find(p => p.id !== socket.id);
      const opponentName = opponent ? opponent.name : 'Opponent';
      onReady({ socket, roomCode: roomCode || inputCode, playerSymbol: mySymbol, opponentName });
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('roomError');
      socket.off('gameStart');
    };
  }, [socket, roomCode, inputCode, onReady]);

  const handleCreate = () => {
    setLoading(true);
    setView('create');
    socket.emit('createRoom', playerName);
  };

  const handleJoin = () => {
    if (!inputCode) return;
    setLoading(true);
    socket.emit('joinRoom', { roomCode: inputCode.toUpperCase(), playerName });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4 animate-pop w-full">
      
      {view === 'choose' && (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Multiplayer</h2>
            <p className="text-slate-400 text-sm">Create a new room or join one</p>
          </div>
          
          <div className="w-full relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName === 'Player' ? '' : playerName}
              onChange={(e) => setPlayerName(e.target.value || 'Player')}
              maxLength={15}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <button 
              onClick={handleCreate}
              className="w-full py-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-900/20"
            >
              Create Room
            </button>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">OR</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>
            <button 
              onClick={() => setView('join')}
              className="w-full py-4 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-colors"
            >
              Join Room
            </button>
          </div>
        </>
      )}

      {view === 'create' && (
        <div className="text-center space-y-6 w-full">
          <h2 className="text-xl font-bold text-white">Room Created</h2>
          
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm mb-2">Share this code with your friend:</p>
            {loading ? (
              <div className="flex justify-center py-2"><Loader2 className="animate-spin text-indigo-500" /></div>
            ) : (
              <div className="text-4xl font-mono font-black text-white tracking-[0.3em]">{roomCode}</div>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-indigo-400">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm font-medium">{status}</span>
          </div>
        </div>
      )}

      {view === 'join' && (
        <div className="text-center space-y-6 w-full">
          <h2 className="text-xl font-bold text-white">Join Room</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="ENTER 6-DIGIT CODE"
              maxLength={6}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-center text-2xl font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase tracking-widest"
            />
            <button 
              onClick={handleJoin}
              disabled={loading || inputCode.length < 2}
              className="w-full py-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white transition-colors flex justify-center items-center h-[56px]"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Join Game'}
            </button>
          </div>
          {status && <p className="text-red-400 text-sm font-medium">{status}</p>}
        </div>
      )}

    </div>
  );
}
