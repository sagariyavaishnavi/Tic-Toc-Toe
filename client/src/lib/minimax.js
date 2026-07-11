export const checkWinnerInfo = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
};

export const checkWinner = (board) => {
  const info = checkWinnerInfo(board);
  return info ? info.winner : null;
};

export const isBoardFull = (board) => {
  return board.every((cell) => cell !== null);
};

export const getBestMove = (board, player) => {
  const AI_PLAYER = 'O'; // Assuming AI plays as O
  const HUMAN_PLAYER = 'X';

  const minimax = (newBoard, depth, isMaximizing) => {
    const winner = checkWinner(newBoard);
    if (winner === AI_PLAYER) return 10 - depth;
    if (winner === HUMAN_PLAYER) return depth - 10;
    if (isBoardFull(newBoard)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = AI_PLAYER;
          const score = minimax(newBoard, depth + 1, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = HUMAN_PLAYER;
          const score = minimax(newBoard, depth + 1, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = AI_PLAYER;
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
};
