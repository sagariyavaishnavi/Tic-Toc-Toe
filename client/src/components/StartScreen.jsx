import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StartScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8 animate-pop">
      <div className="relative">
        <img src="/icon.svg" alt="Tic-Tac-Toe Icon" className="w-28 h-28 object-contain drop-shadow-[0_0_15px_rgba(250,204,21,0.3)] animate-pulse" style={{ animationDuration: '3s' }} />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Tic-Tac-Toe
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          REAL-TIME MULTIPLAYER
        </p>
      </div>

      <button
        onClick={onStart}
        className={cn(
          "w-full py-4 px-8 mt-8 rounded-2xl font-bold text-lg",
          "bg-white text-indigo-950 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]",
          "hover:scale-105 hover:bg-indigo-50 transition-all duration-300 active:scale-95"
        )}
      >
        Play Now
      </button>
    </div>
  );
}
