import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import { getBestMove, checkWinnerInfo, isBoardFull } from '../lib/minimax';
import { RefreshCw, User, Bot, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export default function GameController({ mode, roomData, playerName }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  const isMultiplayer = mode === 'friend';
  const mySymbol = isMultiplayer ? roomData.playerSymbol : 'X';
  const opponentName = isMultiplayer ? (roomData.opponentName || 'Opponent') : 'Computer';
  const isMyTurn = isMultiplayer ? (xIsNext ? 'X' : 'O') === mySymbol : xIsNext; // Computer is always O
  
  useEffect(() => {
    if (isMultiplayer && roomData?.socket) {
      const { socket } = roomData;
      
      socket.on('moveMade', (data) => {
        setBoard((prev) => {
          const newBoard = [...prev];
          newBoard[data.index] = data.playerSymbol;
          checkGameState(newBoard);
          return newBoard;
        });
        setXIsNext(data.xIsNext);
      });

      socket.on('resetGame', () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
        setWinnerInfo(null);
        setIsDraw(false);
      });

      socket.on('playerDisconnected', () => {
        setOpponentDisconnected(true);
      });

      return () => {
        socket.off('moveMade');
        socket.off('resetGame');
        socket.off('playerDisconnected');
      };
    }
  }, [isMultiplayer, roomData]);

  useEffect(() => {
    // Computer's turn
    if (!isMultiplayer && !xIsNext && !winnerInfo && !isDraw) {
      const timer = setTimeout(() => {
        const bestMove = getBestMove(board, 'O'); // AI is O
        if (bestMove !== -1) {
          handleCellClick(bestMove, 'O');
        }
      }, 600); // Add a small delay for realism
      return () => clearTimeout(timer);
    }
  }, [xIsNext, board, winnerInfo, isDraw, isMultiplayer]);

  const checkGameState = (currentBoard) => {
    const info = checkWinnerInfo(currentBoard);
    if (info) {
      setWinnerInfo(info);
    } else if (isBoardFull(currentBoard)) {
      setIsDraw(true);
    }
  };

  const handleCellClick = (index, forcedSymbol = null) => {
    if (board[index] || winnerInfo || isDraw || opponentDisconnected) return;
    
    // In multiplayer, block clicks if it's not our turn
    if (isMultiplayer && !forcedSymbol && !isMyTurn) return;
    
    // In single player, block clicks if it's computer's turn
    if (!isMultiplayer && !forcedSymbol && !xIsNext) return;

    const symbolToUse = forcedSymbol || mySymbol;
    
    if (isMultiplayer) {
      roomData.socket.emit('makeMove', {
        roomCode: roomData.roomCode,
        index,
        playerSymbol: symbolToUse
      });
      // Don't update local state here, let the socket event 'moveMade' handle it to stay in sync
    } else {
      const newBoard = [...board];
      newBoard[index] = symbolToUse;
      setBoard(newBoard);
      setXIsNext(!xIsNext);
      checkGameState(newBoard);
    }
  };

  const handlePlayAgain = () => {
    if (isMultiplayer) {
      roomData.socket.emit('playAgain', roomData.roomCode);
    } else {
      setBoard(Array(9).fill(null));
      setXIsNext(true);
      setWinnerInfo(null);
      setIsDraw(false);
    }
  };

  const currentPlayerSymbol = xIsNext ? 'X' : 'O';
  const getStatusMessage = () => {
    if (opponentDisconnected) return `${opponentName} Disconnected.`;
    if (winnerInfo) {
      if (isMultiplayer) return winnerInfo.winner === mySymbol ? "You Won! 🎉" : `${opponentName} Won 😢`;
      return winnerInfo.winner === 'X' ? "You Won! 🎉" : "Computer Won 😢";
    }
    if (isDraw) return "It's a Draw! 🤝";
    
    if (isMultiplayer) {
      return isMyTurn ? "Your Turn" : `${opponentName}'s Turn...`;
    } else {
      return xIsNext ? "Your Turn" : "Computer is thinking...";
    }
  };

  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      
      {/* Header Info */}
      <div className="flex justify-between items-center w-full mb-6">
        <div className="flex items-center space-x-2 text-indigo-400">
          <User size={20} />
          <span className="font-bold">{playerName} ({mySymbol})</span>
        </div>
        <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-sm font-medium text-slate-300">
          {isMultiplayer ? `Room: ${roomData.roomCode}` : 'vs Computer'}
        </div>
        <div className="flex items-center space-x-2 text-purple-400">
          {isMultiplayer ? <Users size={20} /> : <Bot size={20} />}
          <span className="font-bold">{opponentName} ({mySymbol === 'X' ? 'O' : 'X'})</span>
        </div>
      </div>

      {/* Status Message */}
      <div className={cn(
        "text-xl font-bold mb-8 transition-colors duration-300 text-center",
        winnerInfo || isDraw || opponentDisconnected ? "text-white scale-110" : "text-slate-400",
        winnerInfo && winnerInfo.winner === mySymbol && "text-green-400",
        winnerInfo && winnerInfo.winner !== mySymbol && "text-red-400"
      )}>
        {getStatusMessage()}
      </div>

      {/* Board */}
      <GameBoard 
        board={board} 
        onCellClick={(idx) => handleCellClick(idx)} 
        disabled={winnerInfo !== null || isDraw || opponentDisconnected || (!isMyTurn && isMultiplayer) || (!xIsNext && !isMultiplayer)}
        winningCells={winnerInfo?.line}
      />

      {/* Play Again Button */}
      {(winnerInfo || isDraw || opponentDisconnected) && (
        <button
          onClick={handlePlayAgain}
          disabled={opponentDisconnected}
          className="mt-8 flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all animate-pop shadow-lg shadow-indigo-900/20"
        >
          <RefreshCw size={20} className={opponentDisconnected ? "" : "animate-spin-slow"} style={{ animationDuration: '3s' }} />
          <span>{opponentDisconnected ? 'Game Over' : 'Play Again'}</span>
        </button>
      )}

    </div>
  );
}
