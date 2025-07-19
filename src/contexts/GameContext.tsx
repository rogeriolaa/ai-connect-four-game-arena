import { OPENROUTER_MODELS, PLAYER_1, PLAYER_2 } from '@/constants';
import { checkWin, createEmptyBoard, dropPiece, isBoardFull } from '@/game/connectFour';
import { saveGameResult } from '@/game/leaderboard';
import { getOpenRouterAIMove } from '@/services/openrouterService';
import { Board, GameState, LogEntry, Model, Player, PlayerSide, PlayerType } from '@/types';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface GameContextType {
  // Game State
  board: Board;
  gameState: GameState;
  currentPlayer: PlayerType;
  players: [Player, Player];
  winningCells: [number, number][];
  isTurnInProgress: boolean;
  log: LogEntry[];
  
  // API Key
  openRouterKey: string;
  setOpenRouterKey: (key: string) => void;
  
  // Actions
  handleStartGame: () => void;
  handleReset: () => void;
  handleModelChange: (playerSide: PlayerSide, model: Model) => void;
  handleColumnClick: (colIndex: number) => void;
  addToLog: (message: string, player?: PlayerType) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [players, setPlayers] = useState<[Player, Player]>([
    { 
      ...PLAYER_1,
      model: OPENROUTER_MODELS[0].value, 
      status: 'Idle',
      id: PlayerType.Player1,
      name: 'Player 1',
      piece: 'P1',
      color: 'bg-red-500'
    },
    { 
      ...PLAYER_2,
      model: OPENROUTER_MODELS[1].value, 
      status: 'Idle',
      id: PlayerType.Player2,
      name: 'Player 2',
      piece: 'P2',
      color: 'bg-yellow-400'
    },
  ]);
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>(PlayerType.Player1);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [openRouterKey, setOpenRouterKey] = useState<string>('');
  const [isTurnInProgress, setIsTurnInProgress] = useState(false);

  const addToLog = useCallback((message: string, player?: PlayerType) => {
    setLog(prevLog => [...prevLog, { message, player, timestamp: new Date() }]);
  }, []);

  const handleStartGame = useCallback(() => {
    if (players[0].model === players[1].model) {
      addToLog('Please select two different models to start the game.');
      return;
    }
    if (!openRouterKey) {
      addToLog('OpenRouter API Key is required to start the game.');
      return;
    }

    setBoard(createEmptyBoard());
    setGameState(GameState.Playing);
    setCurrentPlayer(PlayerType.Player1);
    setWinningCells([]);
    setLog([]);
    setIsTurnInProgress(false);
    addToLog('New game started!');
    setPlayers(prev => [
      { ...prev[0], status: 'Waiting' },
      { ...prev[1], status: 'Waiting' }
    ]);
  }, [players, openRouterKey, addToLog]);

  const handleReset = useCallback(() => {
    setBoard(createEmptyBoard());
    setGameState(GameState.Idle);
    setCurrentPlayer(PlayerType.Player1);
    setWinningCells([]);
    setLog([]);
    setIsTurnInProgress(false);
    setPlayers(prev => [
      { ...prev[0], status: 'Idle' },
      { ...prev[1], status: 'Idle' }
    ]);
  }, []);

  const handleModelChange = useCallback((playerSide: PlayerSide, model: Model) => {
    if (gameState !== GameState.Idle) return;
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers] as [Player, Player];
      if (playerSide === PlayerSide.Player1) {
        newPlayers[0] = { ...newPlayers[0], model };
      } else {
        newPlayers[1] = { ...newPlayers[1], model };
      }
      return newPlayers;
    });
  }, [gameState]);

  const handleColumnClick = useCallback((colIndex: number) => {
    if (gameState !== GameState.Playing || isTurnInProgress) return;
    
    const { newBoard, row } = dropPiece(board, colIndex, currentPlayer);
    if (!row) return; // Invalid move
    
    setBoard(newBoard);
    addToLog(`Player placed piece in column ${colIndex + 1}`, currentPlayer);

    const winResult = checkWin(newBoard, currentPlayer, { row, col: colIndex });
    if (winResult) {
      setWinningCells(winResult.line);
      setGameState(GameState.Winner);
      addToLog(`Player wins!`, currentPlayer);
    } else if (isBoardFull(newBoard)) {
      setGameState(GameState.Draw);
      addToLog('Game ended in a draw!');
    } else {
      setCurrentPlayer(currentPlayer === PlayerType.Player1 ? PlayerType.Player2 : PlayerType.Player1);
    }
  }, [gameState, isTurnInProgress, board, currentPlayer, addToLog]);

  const runGameTurn = useCallback(async () => {
    if (gameState !== GameState.Playing || isTurnInProgress) return;

    setIsTurnInProgress(true);
    const currentPlayerIndex = currentPlayer === PlayerType.Player1 ? 0 : 1;
    const currentPlayerObj = players[currentPlayerIndex];

    try {
      setPlayers(prev => {
        const newPlayers = [...prev] as [Player, Player];
        newPlayers[currentPlayerIndex] = { ...currentPlayerObj, status: 'Thinking' };
        return newPlayers;
      });

      const selectedMove = await getOpenRouterAIMove(
        currentPlayerObj.model,
        board,
        currentPlayerObj,
        openRouterKey,
        addToLog
      );

      const { newBoard, row } = dropPiece(board, selectedMove, currentPlayer);
      setBoard(newBoard);
      addToLog(`${currentPlayerObj.model} placed piece in column ${selectedMove + 1}`, currentPlayer);

      const winResult = checkWin(newBoard, currentPlayer, { row, col: selectedMove });
      if (winResult) {
        setWinningCells(winResult.line);
        setGameState(GameState.Winner);
        addToLog(`${currentPlayerObj.model} wins!`, currentPlayer);
        await saveGameResult(currentPlayerObj.model, 1);
      } else if (isBoardFull(newBoard)) {
        setGameState(GameState.Draw);
        addToLog('Game ended in a draw!');
      } else {
        setCurrentPlayer(currentPlayer === PlayerType.Player1 ? PlayerType.Player2 : PlayerType.Player1);
      }
    } catch (error: unknown) {
      console.error('Error during game turn:', error);
      let errorMessage = 'Unknown error occurred';
      if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as { message?: string }).message ?? errorMessage;
      }
      addToLog(`Error: ${errorMessage}`, currentPlayer);
      setGameState(GameState.Idle);
    } finally {
      setIsTurnInProgress(false);
      setPlayers(prev => {
        const newPlayers = [...prev] as [Player, Player];
        newPlayers[currentPlayerIndex] = { ...currentPlayerObj, status: 'Waiting' };
        return newPlayers;
      });
    }
  }, [gameState, isTurnInProgress, currentPlayer, players, board, openRouterKey, addToLog]);

  useEffect(() => {
    if (gameState === GameState.Playing && !isTurnInProgress) {
      runGameTurn();
    }
  }, [gameState, currentPlayer, isTurnInProgress, runGameTurn]);

  const value = useMemo(() => ({
    board,
    gameState,
    currentPlayer,
    players,
    winningCells,
    isTurnInProgress,
    log,
    openRouterKey,
    setOpenRouterKey,
    handleStartGame,
    handleReset,
    handleModelChange,
    handleColumnClick,
    addToLog,
  }), [
    board,
    gameState,
    currentPlayer,
    players,
    winningCells,
    isTurnInProgress,
    log,
    openRouterKey,
    handleStartGame,
    handleReset,
    handleModelChange,
    handleColumnClick,
    addToLog,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
