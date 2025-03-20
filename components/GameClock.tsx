import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { sportRadarPushService } from '/Users/atharvsonawane/musen-app/server/src/api/sportRadar/sportRadarPushService';
import { syncService } from '@/api/sync/syncService';
import { GameClock } from '@/api/sync/syncTypes';

const GameClockPanel = ({ gameId }: { gameId: string }) => {
  const [clock, setClock] = useState<GameClock>();

  useEffect(() => {
    console.log('GameClockPanel mounting for game:', gameId);
    
    // Get initial clock state
    const initialClock = syncService.getGameClock(gameId);
    console.log('Initial clock state:', initialClock);
    if (initialClock) {
      setClock(initialClock);
    }

    // Subscribe to clock updates
    const subscription = syncService.clockUpdates$.subscribe(newClock => {
      console.log('GameClockPanel received update:', newClock);
      if (newClock.gameId === gameId) {
        console.log('Updating clock state for game:', gameId);
        setClock(newClock);
      }
    });

    return () => {
      console.log('GameClockPanel unmounting for game:', gameId);
      subscription.unsubscribe();
    };
  }, [gameId]);

  // Add render logging
  useEffect(() => {
    console.log('Clock state updated:', clock);
  }, [clock]);

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.panel}>
      <ThemedText style={styles.title}>Live Game Clock</ThemedText>
      <ThemedText style={styles.clockDisplay}>
        {clock ? 
          `Q${clock.period} ${formatTime(clock.minutes, clock.seconds)}` : 
          "Waiting for updates..."}
      </ThemedText>
      <ThemedText style={styles.status}>
        Status: {clock?.isRunning ? 'Running' : 'Stopped'}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  clockDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 8,
  },
  status: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  }
});

export default GameClockPanel;