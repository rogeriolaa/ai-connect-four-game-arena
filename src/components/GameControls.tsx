import { ALL_MODELS, CUSTOM_MODEL_ID } from '@/constants';
import { useGame } from '@/contexts/GameContext';
import { GameState, Model, PlayerSide } from '@/types';
import React, { useState } from 'react';

const GameControls: React.FC = () => {
  const { 
    gameState, 
    handleStartGame, 
    handleReset, 
    players, 
    handleModelChange,
    openRouterKey,
    setOpenRouterKey 
  } = useGame();

  const isGameIdle = gameState === GameState.Idle;
  const [showKey, setShowKey] = useState(false);
  const areModelsSame = players[0].model === players[1].model;

  return (
    <div className="flex flex-col gap-4 bg-[#1a202c] pixel-border rounded-lg p-6">
      <div className="grid grid-cols-2 gap-4">
        {players.map((player, index) => {
            const playerSide = index === 0 ? PlayerSide.Player1 : PlayerSide.Player2;
            const modelIsPredefined = ALL_MODELS.some(m => m.value === player.model);
            const showCustomInput = !modelIsPredefined || player.model === CUSTOM_MODEL_ID;

            return (
              <div key={player.id} className="space-y-2">
                <label htmlFor={`player${player.id}-model`} className="block text-sm text-gray-400">
                  Player {index + 1} Model
                </label>
                <select
                  id={`player${player.id}-model`}
                  value={modelIsPredefined ? player.model : CUSTOM_MODEL_ID}
                  onChange={(e) => handleModelChange(playerSide, e.target.value as Model)}
                  disabled={!isGameIdle}
                  className="w-full bg-black/30 text-white border-2 border-black p-2 rounded-lg pixel-shadow-sm focus:outline-none disabled:opacity-50 text-sm"
                >
                  {ALL_MODELS.map(m => (
                    <option key={m.value} value={m.value}>{m.name}</option>
                  ))}
                </select>

                {showCustomInput && (
                    <div className="mt-2">
                        <input
                            id={`player${player.id}-custom-model`}
                            type="text"
                            value={player.model === CUSTOM_MODEL_ID ? '' : player.model}
                            onChange={(e) => handleModelChange(playerSide, e.target.value)}
                            disabled={!isGameIdle}
                            placeholder="e.g. anthropic/claude-3-opus"
                            className="w-full bg-black/30 text-white border-2 border-black p-2 rounded-lg pixel-shadow-sm focus:outline-none disabled:opacity-50 text-sm"
                            aria-label={`${player.name} Custom Model Name`}
                        />
                    </div>
                )}
              </div>
            );
        })}
      </div>
      
      <div className="mt-4 space-y-2">
        <label htmlFor="openrouter-key" className="block text-sm text-yellow-400">
          OpenRouter API Key
        </label>
        <div className="relative">
            <input
              id="openrouter-key"
              type={showKey ? "text" : "password"}
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              disabled={!isGameIdle}
              placeholder="Required to start the game"
              className="w-full bg-black/30 text-white border-2 border-black p-2 rounded-lg pixel-shadow-sm focus:outline-none disabled:opacity-50 text-sm"
              aria-label="OpenRouter API Key"
            />
            <button 
              type="button"
              onClick={() => setShowKey(!showKey)} 
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              }
            </button>
        </div>
      </div>

      {areModelsSame && isGameIdle && (
        <p className="text-center text-yellow-400 text-sm mt-4">
            Models must be different to start.
        </p>
      )}

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleStartGame}
          disabled={!isGameIdle || !openRouterKey || areModelsSame}
          className="w-full py-2 text-lg text-white bg-green-600 pixel-border rounded-lg transform transition hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameControls;