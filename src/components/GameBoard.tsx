
import { useGame } from '@/contexts/GameContext';
import { CellState } from '@/types';
import React from 'react';

const GameBoard: React.FC = () => {
  const { board, handleColumnClick, winningCells } = useGame();
  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };
    
  return (
    <div className="bg-[#1a1a1a] p-2 lg:p-4 pixel-border rounded">
      <div className="grid grid-cols-7 gap-[2px] bg-[#111111] p-1 lg:p-2 rounded">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-10 h-10 lg:w-14 lg:h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center cursor-pointer relative ${
                cell === CellState.Empty ? 'cell-empty' : ''
              }`}
              onClick={() => handleColumnClick(colIndex)}
            >
              <div
                className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full cell-piece ${
                  cell === CellState.Empty ? 'bg-[#333333]' : ''
                } ${cell === CellState.Player1 ? 'bg-red-600 pixel-shadow-sm' : ''} ${
                  cell === CellState.Player2 ? 'bg-yellow-400 pixel-shadow-sm' : ''
                } ${isWinningCell(rowIndex, colIndex) ? 'winning-cell' : ''}`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
