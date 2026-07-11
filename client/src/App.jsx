import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import ModeSelection from './components/ModeSelection';
import RoomManager from './components/RoomManager';
import GameController from './components/GameController';

function App() {
  const [view, setView] = useState('start'); // start | mode | room | game
  const [gameMode, setGameMode] = useState(null); // 'computer' | 'friend'
  const [roomData, setRoomData] = useState(null); // { roomCode, socket, playerSymbol, opponentName }
  const [playerName, setPlayerName] = useState('Player');

  const handleStart = () => {
    setView('mode');
  };

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    if (mode === 'computer') {
      setView('game');
    } else {
      setView('room');
    }
  };

  const handleRoomReady = (data) => {
    setRoomData(data);
    setView('game');
  };

  const goBack = () => {
    if (view === 'mode') setView('start');
    if (view === 'room') setView('mode');
    if (view === 'game') {
      if (gameMode === 'computer') setView('mode');
      else setView('room');
      // In a real app we'd disconnect socket here if going back from game
      if (roomData?.socket) {
        roomData.socket.disconnect();
        setRoomData(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center p-4 text-slate-100 font-sans selection:bg-purple-500/30">

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {view !== 'start' && (
          <button
            onClick={goBack}
            className="mb-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
          </button>
        )}

        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
          {view === 'start' && <StartScreen onStart={handleStart} />}
          {view === 'mode' && <ModeSelection onSelect={handleModeSelect} />}
          {view === 'room' && <RoomManager onReady={handleRoomReady} playerName={playerName} setPlayerName={setPlayerName} />}
          {view === 'game' && <GameController mode={gameMode} roomData={roomData} playerName={playerName} />}
        </div>
      </div>

    </div>
  );
}

export default App;
