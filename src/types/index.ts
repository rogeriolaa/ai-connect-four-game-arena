export enum PlayerType {
  Player1 = 1,
  Player2 = 2,
}

export enum CellState {
  Empty = 0,
  Player1 = PlayerType.Player1,
  Player2 = PlayerType.Player2,
}

export type Board = CellState[][];

export enum GameState {
  Idle = "IDLE",
  Playing = "PLAYING",
  Winner = "WINNER",
  Draw = "DRAW",
}

export type Model = string;

export interface Player {
  id: PlayerType;
  name: string;
  piece: string;
  color: string;
  model: Model;
  status: string;
}

export interface LogEntry {
  message: string;
  player?: PlayerType;
  timestamp: Date;
}

export enum PlayerSide {
  Player1 = "Player1",
  Player2 = "Player2",
}
