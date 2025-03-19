import React, { useEffect } from 'react';
import { sportRadarPushService } from '/Users/atharvsonawane/musen-app/server/src/api/sportRadar/sportRadarPushService';
import { useGameClock } from '/Users/atharvsonawane/musen-app/hooks/useGameClock';

const GameClockPanel = ({ gameId }: { gameId: string }) => {
  const { clockTime } = useGameClock(gameId);

  useEffect(() => {
    // Subscribe to game clock updates when component mounts
    sportRadarPushService.subscribeToGame(gameId);

    // Cleanup subscription when component unmounts
    return () => {
      sportRadarPushService.unsubscribeFromGame(gameId);
    };
  }, [gameId]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="text-white text-lg font-semibold mb-2">Live Game Clock</h3>
      <div className="text-2xl text-green-400 font-bold">
        {clockTime || "Waiting for updates..."}
      </div>
      <p className="text-gray-400 text-sm mt-2">
        Use this clock to sync your stream with real-time game updates
      </p>
    </div>
  );
};