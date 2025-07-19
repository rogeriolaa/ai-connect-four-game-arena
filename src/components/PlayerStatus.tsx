
import { useGame } from '@/contexts/GameContext';
import { PlayerSide } from '@/types';
import React from 'react';

interface PlayerStatusProps {
  side: PlayerSide;
  isCurrent: boolean;
}

const PlayerStatus: React.FC<PlayerStatusProps> = ({ side, isCurrent }) => {
  const { players } = useGame();
  const player = players[side === PlayerSide.Player1 ? 0 : 1];

  return (
    <div className={`w-full max-w-[400px] h-12 lg:h-16 bg-[#1a1a1a] pixel-border p-2 rounded flex gap-2 lg:gap-4 items-center transition-transform ${
      isCurrent ? 'scale-[1.02]' : 'scale-100'}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${player.color} pixel-shadow-sm`} />
        <span className="text-xs lg:text-sm truncate">{player.model}</span>
      </div>
      <div className="bg-black/30 px-2 lg:px-3 py-1 rounded-sm min-w-[80px] lg:min-w-[100px] text-center">
        <p className={`text-xs lg:text-sm transition-colors ${isCurrent ? 'text-green-400' : 'text-gray-400'}`}>
          {player.status}
        </p>
      </div>
    </div>
  );
};

export default PlayerStatus;
