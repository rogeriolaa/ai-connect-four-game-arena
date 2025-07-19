import { BOARD_COLS, BOARD_ROWS } from "@/constants";
import { Board, CellState, PlayerType } from "@/types";

export const createEmptyBoard = (): Board => {
  return Array(BOARD_ROWS)
    .fill(null)
    .map(() => Array(BOARD_COLS).fill(CellState.Empty));
};

export const getValidMoves = (board: Board): number[] => {
  const validCols: number[] = [];
  for (let col = 0; col < BOARD_COLS; col++) {
    if (board[0][col] === CellState.Empty) {
      validCols.push(col);
    }
  }
  return validCols;
};

export const dropPiece = (
  board: Board,
  col: number,
  player: PlayerType
): { newBoard: Board; row: number } => {
  const newBoard = board.map((row) => [...row]);
  for (let r = BOARD_ROWS - 1; r >= 0; r--) {
    if (newBoard[r][col] === CellState.Empty) {
      newBoard[r][col] = player as unknown as CellState;
      return { newBoard, row: r };
    }
  }
  // This should not happen if getValidMoves is checked first, but as a fallback:
  throw new Error("Column is full");
};

export const isBoardFull = (board: Board): boolean => {
  return board[0].every((cell) => cell !== CellState.Empty);
};

export const checkWin = (
  board: Board,
  player: PlayerType,
  lastMove: { row: number; col: number }
): { winner: PlayerType; line: [number, number][] } | null => {
  const { row, col } = lastMove;

  const directions = [
    { x: 0, y: 1 }, // Horizontal
    { x: 1, y: 0 }, // Vertical
    { x: 1, y: 1 }, // Diagonal /
    { x: 1, y: -1 }, // Diagonal \
  ];

  for (const dir of directions) {
    const line: [number, number][] = [[row, col]];
    // Check in one direction
    for (let i = 1; i < 4; i++) {
      const r = row + i * dir.x;
      const c = col + i * dir.y;
      if (
        r >= 0 &&
        r < BOARD_ROWS &&
        c >= 0 &&
        c < BOARD_COLS &&
        board[r][c] === (player as unknown as CellState)
      ) {
        line.push([r, c]);
      } else {
        break;
      }
    }
    // Check in the opposite direction
    for (let i = 1; i < 4; i++) {
      const r = row - i * dir.x;
      const c = col - i * dir.y;
      if (
        r >= 0 &&
        r < BOARD_ROWS &&
        c >= 0 &&
        c < BOARD_COLS &&
        board[r][c] === (player as unknown as CellState)
      ) {
        line.push([r, c]);
      } else {
        break;
      }
    }

    if (line.length >= 4) {
      return { winner: player, line };
    }
  }

  return null;
};
