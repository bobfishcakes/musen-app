// ListenerSyncControl.tsx

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { syncService } from '/Users/atharvsonawane/musen-app/api/sync/syncService';
import { GameClock, StoppageEvent } from '/Users/atharvsonawane/musen-app/api/sync/syncTypes';
import { StoppageTimer } from './StoppageTimer';

interface ListenerSyncControlProps {
  gameId: string;
  onClockUpdate?: (clock: GameClock) => void;
  onStoppageStart?: (event: StoppageEvent) => void;
  onStoppageEnd?: (event: StoppageEvent) => void;
}

export const ListenerSyncControl: React.FC<ListenerSyncControlProps> = ({
  gameId,
  onClockUpdate,
  onStoppageStart,
  onStoppageEnd
}) => {
  const [clock, setClock] = useState<GameClock>();
  const [activeStoppage, setActiveStoppage] = useState<StoppageEvent>();

  useEffect(() => {
    // Initial clock state
    const initialClock = syncService.getGameClock(gameId);
    if (initialClock) {
      setClock(initialClock);
      onClockUpdate?.(initialClock);
    }

    // Set up listeners for clock updates
    const clockInterval = setInterval(() => {
      const currentClock = syncService.getGameClock(gameId);
      if (currentClock) {
        setClock(currentClock);
        onClockUpdate?.(currentClock);
      }
    }, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, [gameId]);

  const handleStoppageStart = (type: StoppageEvent['type']) => {
    syncService.startStoppage(gameId, type);
    const newStoppage = {
      gameId,
      startTime: new Date(),
      type
    };
    setActiveStoppage(newStoppage);
    onStoppageStart?.(newStoppage);
  };

  const handleStoppageEnd = () => {
    const endedStoppage = syncService.endStoppage(gameId);
    if (endedStoppage) {
      setActiveStoppage(undefined);
      onStoppageEnd?.(endedStoppage);
    }
  };

  return (
    <View>
      {activeStoppage && (
        <StoppageTimer
          startTime={activeStoppage.startTime}
          onEnd={handleStoppageEnd}
        />
      )}
    </View>
  );
};