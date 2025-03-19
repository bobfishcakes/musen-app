import { useState, useEffect } from 'react';
import { syncService } from '/Users/atharvsonawane/musen-app/api/sync/syncService';
import { GameClock } from '/Users/atharvsonawane/musen-app/api/sync/syncTypes'; 

export const useGameClock = (gameId: string) => {
  const [clock, setClock] = useState<GameClock | undefined>();

  useEffect(() => {
    // Use the existing startDebugPolling method
    syncService.startDebugPolling(gameId, (newClock) => {
      setClock(newClock);
    });

    // Cleanup with stopDebugPolling
    return () => {
      syncService.stopDebugPolling(gameId);
    };
  }, [gameId]);

  // Format the clock time as a string
  const clockTime = clock 
    ? `${clock.period}Q ${clock.minutes}:${clock.seconds.toString().padStart(2, '0')}`
    : "";

  return { clockTime, clock };
};