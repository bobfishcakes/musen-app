import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { GameClock, StoppageEvent } from '@/api/sync/syncTypes';
import { syncService } from '@/api/sync/syncService';

interface SyncTestPanelProps {
  gameId: string;
  initialClock: GameClock;
}

export const SyncTestPanel: React.FC<SyncTestPanelProps> = ({ gameId, initialClock }) => {
  const [gameClock, setGameClock] = useState<GameClock>(initialClock);
  const [stoppage, setStoppage] = useState<StoppageEvent | undefined>();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    console.log(`SyncTestPanel mounted for game ${gameId} with initial clock:`, initialClock);
    
    const handleUpdate = (clock: GameClock) => {
      console.log(`Received update for game ${gameId}:`, { clock });
      
      if (clock) {
        setGameClock(clock);
        setLastUpdate(new Date());
      }
    };

    // Subscribe to clock updates
    const subscription = syncService.clockUpdates$.subscribe((clock) => {
      if (clock.gameId === gameId) {
        handleUpdate(clock);
      }
    });

    // Start polling
    syncService.startDebugPolling(gameId, handleUpdate);

    // Cleanup function
    return () => {
      console.log(`SyncTestPanel unmounting for game ${gameId}`);
      syncService.stopDebugPolling(gameId);
      subscription.unsubscribe();
    };
  }, [gameId, initialClock]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Game Clock</ThemedText>
        <ThemedText>
          Period: {gameClock?.period || '-'} | 
          Time: {gameClock?.minutes || '--'}:{(gameClock?.seconds || 0).toString().padStart(2, '0')}
        </ThemedText>
        <ThemedText>
          Status: {gameClock?.isRunning ? 'Running' : 'Stopped'}
        </ThemedText>
        <ThemedText style={styles.updateTime}>
          Last Update: {lastUpdate.toLocaleTimeString()}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Stoppage Status</ThemedText>
        {stoppage ? (
          <>
            <ThemedText>Type: {stoppage.type}</ThemedText>
            <ThemedText>Started: {stoppage.startTime.toLocaleTimeString()}</ThemedText>
          </>
        ) : (
          <ThemedText>No active stoppage</ThemedText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  updateTime: {
    fontSize: 12,
    marginTop: 5,
    opacity: 1,
  },
});