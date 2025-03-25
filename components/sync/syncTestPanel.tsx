import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { GameClock, StoppageEvent } from '@/api/sync/syncTypes';
import { syncService } from '@/api/sync/syncService';
import { sportRadarPushService } from '@/server/src/api/sportRadar/sportRadarPushService';

interface SyncTestPanelProps {
  gameId: string;
  initialClock: GameClock;
}

export const SyncTestPanel: React.FC<SyncTestPanelProps> = ({ gameId, initialClock }) => {
  const [gameClock, setGameClock] = useState<GameClock>(initialClock);
  const [stoppage, setStoppage] = useState<StoppageEvent | undefined>();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    console.log(`🏀 SyncTestPanel mounted for game ${gameId} with initial clock:`, initialClock);
    
    // Subscribe to game updates via SportRadar
    sportRadarPushService.subscribeToGame(gameId);

    const handleUpdate = (clock: GameClock) => {
      console.log(`⏰ Received update for game ${gameId}:`, { clock });
      
      if (clock) {
        setGameClock(clock);
        setLastUpdate(new Date());
      }
    };

    // Subscribe to clock updates from sync service
    const subscription = syncService.clockUpdates$.subscribe((clock) => {
      if (clock.gameId === gameId) {
        handleUpdate(clock);
      }
    });

    // Start polling for debug purposes
    syncService.startDebugPolling(gameId, handleUpdate);

    // Cleanup function
    return () => {
      console.log(`👋 SyncTestPanel unmounting for game ${gameId}`);
      sportRadarPushService.unsubscribeFromGame(gameId);
      syncService.stopDebugPolling(gameId);
      subscription.unsubscribe();
    };
  }, [gameId, initialClock]);

  return (
    <View style={styles.panel}>
      <View style={styles.section}>
        <ThemedText style={styles.title}>Live Game Clock</ThemedText>
        <ThemedText style={styles.clockDisplay}>
          Q{gameClock?.period || '-'} {' '}
          {gameClock?.minutes || '--'}:{(gameClock?.seconds || 0).toString().padStart(2, '0')}
        </ThemedText>
        
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusIndicator, 
              { backgroundColor: gameClock?.isRunning ? '#4CAF50' : '#F44336' }
            ]} 
          />
          <ThemedText style={styles.status}>
            {gameClock?.isRunning ? 'Clock Running' : 'Clock Stopped'}
          </ThemedText>
        </View>

        <ThemedText style={styles.lastUpdate}>
          Last Update: {lastUpdate.toLocaleTimeString()}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Stoppage Status</ThemedText>
        {stoppage ? (
          <>
            <ThemedText style={styles.stoppageText}>Type: {stoppage.type}</ThemedText>
            <ThemedText style={styles.stoppageText}>
              Started: {stoppage.startTime.toLocaleTimeString()}
            </ThemedText>
          </>
        ) : (
          <ThemedText style={styles.stoppageText}>No active stoppage</ThemedText>
        )}
      </View>
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
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  clockDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 8,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  status: {
    fontSize: 14,
    color: '#666666',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
  stoppageText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  }
});

export default SyncTestPanel;