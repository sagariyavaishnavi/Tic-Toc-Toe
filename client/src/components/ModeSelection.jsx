import React from 'react';
import { Bot, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ModeSelection({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4 animate-pop">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Game Mode</h2>
        <p className="text-slate-400 text-sm">How would you like to play?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full">
        <button
          onClick={() => onSelect('computer')}
          className={cn(
            "flex items-center p-5 rounded-2xl border border-slate-700/50 bg-slate-800/30",
            "hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 group"
          )}
        >
          <div className="bg-slate-800 p-3 rounded-xl mr-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <Bot size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white text-lg">Play Computer</h3>
            <p className="text-slate-400 text-sm">Challenge the unbeatable AI</p>
          </div>
        </button>

        <button
          onClick={() => onSelect('friend')}
          className={cn(
            "flex items-center p-5 rounded-2xl border border-slate-700/50 bg-slate-800/30",
            "hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group"
          )}
        >
          <div className="bg-slate-800 p-3 rounded-xl mr-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <Users size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white text-lg">Play Friend</h3>
            <p className="text-slate-400 text-sm">Real-time online multiplayer</p>
          </div>
        </button>
      </div>
    </div>
  );
}
