import React, { useState, useEffect } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameStatus, setGameStatus] = useState("À vous de jouer (X)");

  // Check for winner
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  // AI move logic
  const getAIMove = (currentBoard: (string | null)[]) => {
    const boardNumbers = currentBoard.map(cell => cell === 'X' ? 1 : (cell === 'O' ? -1 : 0));

    // Check for winning move
    for (let i = 0; i < 9; i++) {
      if (boardNumbers[i] === 0) {
        const testBoard = [...boardNumbers];
        testBoard[i] = -1;
        if (calculateWinner(testBoard.map(n => n === 1 ? 'X' : (n === -1 ? 'O' : null)))) {
          return i;
        }
      }
    }

    // Block player's winning move
    for (let i = 0; i < 9; i++) {
      if (boardNumbers[i] === 0) {
        const testBoard = [...boardNumbers];
        testBoard[i] = 1;
        if (calculateWinner(testBoard.map(n => n === 1 ? 'X' : (n === -1 ? 'O' : null)))) {
          return i;
        }
      }
    }

    // Take center if available
    if (boardNumbers[4] === 0) return 4;

    // Take corners randomly
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => boardNumbers[index] === 0);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available side
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(index => boardNumbers[index] === 0);
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    return -1; // Should never happen
  };

  // Handle player move
  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setGameStatus("Vous avez gagné ! 🎉");
      return;
    }

    // Check for draw
    if (!newBoard.includes(null)) {
      setIsDraw(true);
      setGameStatus("Match nul ! 🤝");
      return;
    }

    setGameStatus("L'IA réfléchit...");
  };

  // Handle AI move
  useEffect(() => {
    if (!isXNext && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board);
        if (aiMove === -1) return;

        const newBoard = [...board];
        newBoard[aiMove] = 'O';
        setBoard(newBoard);
        setIsXNext(true);

        const newWinner = calculateWinner(newBoard);
        if (newWinner) {
          setWinner(newWinner);
          setGameStatus("L'IA a gagné ! 🤖");
          return;
        }

        // Check for draw
        if (!newBoard.includes(null)) {
          setIsDraw(true);
          setGameStatus("Match nul ! 🤝");
          return;
        }

        setGameStatus("À vous de jouer (X)");
      }, 800); // Delay to simulate AI thinking

      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner, isDraw]);

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsDraw(false);
    setGameStatus("À vous de jouer (X)");
  };

  // Render cell with animation
  const renderCell = (index: number) => {
    const isWinningCell = winner &&
      calculateWinner(board) === board[index] &&
      [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i =>
        board[i] === winner &&
        (i === index ||
          (board[0] === winner && board[1] === winner && board[2] === winner && [0,1,2].includes(index)) ||
          (board[3] === winner && board[4] === winner && board[5] === winner && [3,4,5].includes(index)) ||
          (board[6] === winner && board[7] === winner && board[8] === winner && [6,7,8].includes(index)) ||
          (board[0] === winner && board[3] === winner && board[6] === winner && [0,3,6].includes(index)) ||
          (board[1] === winner && board[4] === winner && board[7] === winner && [1,4,7].includes(index)) ||
          (board[2] === winner && board[5] === winner && board[8] === winner && [2,5,8].includes(index)) ||
          (board[0] === winner && board[4] === winner && board[8] === winner && [0,4,8].includes(index)) ||
          (board[2] === winner && board[4] === winner && board[6] === winner && [2,4,6].includes(index))
        )
      ).includes(index);

    return (
      <button
        key={index}
        className={`w-24 h-24 md:w-32 md:h-32 border-2 border-gray-300 flex items-center justify-center text-4xl md:text-5xl font-bold transition-all duration-300
          ${isWinningCell ? 'bg-green-200 scale-105' : 'hover:bg-gray-50'}
          ${index % 3 !== 2 ? 'border-r-2' : ''}
          ${index < 6 ? 'border-b-2' : ''}`}
        onClick={() => handleClick(index)}
        disabled={!!winner || !!isDraw || !isXNext}
        aria-label={`Cellule ${index}, ${board[index] || 'vide'}`}
      >
        {board[index] === 'X' && (
          <div className="text-blue-600 animate-pop-in">X</div>
        )}
        {board[index] === 'O' && (
          <div className="text-red-600 animate-pop-in">O</div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Tic Tac Toe</h1>
          <p className="text-indigo-200">Jouez contre l'IA</p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className={`text-xl font-semibold ${
              winner === 'X' ? 'text-blue-600' :
              winner === 'O' ? 'text-red-600' :
              isDraw ? 'text-yellow-600' : 'text-gray-700'
            }`}>
              {gameStatus}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-0 mx-auto w-fit bg-white rounded-lg overflow-hidden shadow-md">
            {Array(9).fill(null).map((_, index) => renderCell(index))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Recommencer
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Vous jouez les X - L'IA joue les O</p>
            <p className="mt-2">Stratégie IA : Bloque vos victoires et cherche à gagner</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
