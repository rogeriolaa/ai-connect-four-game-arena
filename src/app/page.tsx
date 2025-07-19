'use client';

import GameBoard from '@/components/GameBoard';
import GameControls from '@/components/GameControls';
import GameLog from '@/components/GameLog';
import Leaderboard from '@/components/Leaderboard';
import PlayerStatus from '@/components/PlayerStatus';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { GameState, PlayerSide, PlayerType } from '@/types';

function GameScreen() {
  const {
    gameState,
    currentPlayer,
    handleReset
  } = useGame();

  return (
    <main className="min-h-screen bg-[#111111] p-2">
      {gameState === GameState.Idle ? (
        // Model Selection Screen
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="hidden sm:block pixel-border bg-[#1a1a1a] p-2">
              <div className="grid grid-cols-4 gap-1 bg-[#111111] p-1">
                {Array(12).fill(null).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-[#1a1a1a] rounded-full">
                    <div className={`w-3 h-3 rounded-full ${
                      i === 1 ? 'bg-red-600' : 
                      i === 6 ? 'bg-yellow-400' :
                      i === 9 ? 'bg-red-600' :
                      i === 10 ? 'bg-yellow-400' : 
                      'bg-[#333333]'
                    } pixel-shadow-sm`} />
                  </div>
                ))}
              </div>
            </div>
            <h1 className="text-4xl text-center text-[#FFD700]">AI Connect Four Game Arena</h1>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <GameControls />
            <div className="lg:h-[calc(100vh-200px)]">
              <Leaderboard />
            </div>
          </div>
        </div>
      ) : (
        // Game Screen
        <div className="container mx-auto flex flex-col lg:flex-row gap-4 h-[calc(100vh-1rem)]">
          {/* Left half - Game Board */}
          <div className="flex-1 lg:w-1/2 flex flex-col min-w-0 justify-center">
            {/* Player Status and Board */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full lg:w-auto">
                <PlayerStatus 
                  side={PlayerSide.Player1}
                  isCurrent={currentPlayer === PlayerType.Player1}
                />
              </div>
              <div className="transform scale-90 lg:scale-100">
                <GameBoard />
              </div>
              <div className="w-full lg:w-auto">
                <PlayerStatus 
                  side={PlayerSide.Player2}
                  isCurrent={currentPlayer === PlayerType.Player2}
                />
              </div>
              
              {/* Reset Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleReset}
                  className="px-8 py-2 text-white bg-red-600 pixel-border rounded transform transition hover:brightness-110 active:scale-95"
                >
                  Reset Game
                </button>
              </div>
            </div>
          </div>

          {/* Right half - Game Log */}
          <div className="lg:w-1/2 h-[200px] lg:h-full">
            <div className="h-full bg-[#1a1a1a] pixel-border rounded overflow-hidden">
              <GameLog />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
}
