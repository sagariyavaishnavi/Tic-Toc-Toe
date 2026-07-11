import React from 'react';
import { cn } from '../lib/utils';

export default function GameBoard({ board, onCellClick, disabled, winningCells }) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 p-3 bg-slate-800 rounded-2xl shadow-inner w-full aspect-square max-w-[300px] mx-auto">
      {board.map((cell, idx) => {
        const isWinningCell = winningCells?.includes(idx);
        
        return (
          <button
            key={idx}
            onClick={() => onCellClick(idx)}
            disabled={disabled || cell !== null}
            className={cn(
              "w-full h-full rounded-xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all duration-300",
              !cell && !disabled ? "hover:bg-slate-700/50 cursor-pointer active:scale-95" : "cursor-default",
              cell === 'X' ? "text-indigo-400" : "text-purple-400",
              isWinningCell ? "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105" : "bg-slate-900/80 shadow-sm"
            )}
          >
            <span className={cn(
              cell ? "animate-pop" : "opacity-0 scale-50",
              isWinningCell && "animate-pulse"
            )}>
              {cell}
            </span>
          </button>
        );
      })}
    </div>
  );
}
