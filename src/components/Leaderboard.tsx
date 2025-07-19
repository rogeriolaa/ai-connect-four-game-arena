
'use client';

import React, { useEffect, useState } from 'react';
import TrophyIcon from './icons/TrophyIcon';

interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  createdAt: string;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Show top 10

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-400'; // Gold
    if (rank === 1) return 'text-gray-300'; // Silver
    if (rank === 2) return 'text-yellow-600'; // Bronze
    return 'text-gray-400';
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] pixel-border rounded overflow-hidden">
      {/* Fancy Title Header */}
      <div className="bg-[#1f1f1f] px-4 py-3 border-b border-[#333333] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-yellow-400" />
          <h2 className="font-bold text-sm">Leaderboard</h2>
        </div>
        <div className="px-2 py-1 text-xs bg-[#111111] rounded-full font-mono text-yellow-400">
          Top 10
        </div>
      </div>

      <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
        {sortedLeaderboard.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <TrophyIcon className="w-6 h-6 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Play a game to see the ranks!</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {sortedLeaderboard.map((entry, index) => (
              <li
                key={entry.id}
                className="flex items-center justify-between text-xs leaderboard-item bg-[#222222] px-3 py-2 rounded"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`w-5 text-center font-bold ${getRankColor(index)}`}>
                    #{index + 1}
                  </span>
                  <p className="truncate font-mono" title={entry.playerName}>
                    {entry.playerName}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[#1a1a1a] px-2 py-1 rounded-full">
                  <TrophyIcon className={`w-3 h-3 ${getRankColor(index)}`} />
                  <span className="font-bold">{entry.score}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
