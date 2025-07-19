
import { useGame } from '@/contexts/GameContext';
import { PlayerType } from '@/types';
import React, { useEffect, useRef } from 'react';

const GameLog: React.FC = () => {
  const { log } = useGame();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const getPlayerColor = (playerId?: PlayerType) => {
    if (playerId === PlayerType.Player1) return 'text-red-400';
    if (playerId === PlayerType.Player2) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-[#1f1f1f] px-3 py-2 font-bold text-sm border-b border-[#333333]">
        Game Log
      </div>
      <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
        {log.map((entry, index) => (
          <div key={index} className="flex text-xs mb-1">
            <span className="text-gray-500 mr-2 shrink-0">{entry.timestamp.toLocaleTimeString()}</span>
            <p className={`${getPlayerColor(entry.player)} break-all`}>
              {entry.message}
            </p>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default GameLog;
