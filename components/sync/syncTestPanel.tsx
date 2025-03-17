// components/sync/SyncTestPanel.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '/Users/atharvsonawane/musen-app/components/ThemedText';
import { ListenerSyncControl } from './ListenerSyncControl';
import { StoppageTimer } from './StoppageTimer';
import { GameClock, StoppageEvent } from '../../api/sync/syncTypes';
import { sportRadarLocalService } from '../../api/sportradar/sportRadarLocalService';
import { syncService } from '../../api/sync/syncService';

interface SyncTestPanelProps {
  gameId: string;
}

export const SyncTestPanel: React.FC<SyncTestPanelProps> = ({ gameId }) => {
  const [gameClock, setGameClock] = useState<GameClock>();
  const [stoppage, setStoppage] = useState<StoppageEvent>();
  const [lastUpdate, setLastUpdate] = useState<Date>();

  // Poll SportRadar for updates
  useEffect(() => {
    const pollGameData = async () => {
      try {
        const gameDetails = await sportRadarLocalService.getGameDetails(gameId);
        
        // Update game clock based on SportRadar data
        if (gameDetails) {
          syncService.updateGameClock(gameId, {
            period: gameDetails.status.period,
            minutes: gameDetails.status.clock?.minutes || 0,
            seconds: gameDetails.status.clock?.seconds || 0,
            isRunning: gameDetails.status.type === 'inprogress'
          });
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Error polling game data:', error);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(pollGameData, 5000);
    pollGameData(); // Initial poll

    return () => clearInterval(interval);
  }, [gameId]);

  return (
    <View style={styles.container}>
      {/* Game Clock Display */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Game Clock</ThemedText>
        <ThemedText>
          Period: {gameClock?.period || '-'} | 
          Time: {gameClock?.minutes || '--'}:{gameClock?.seconds.toString().padStart(2, '0') || '--'}
        </ThemedText>
        <ThemedText>
          Status: {gameClock?.isRunning ? 'Running' : 'Stopped'}
        </ThemedText>
        {lastUpdate && (
          <ThemedText style={styles.updateTime}>
            Last Update: {lastUpdate.toLocaleTimeString()}
          </ThemedText>
        )}
      </View>

      {/* Stoppage Display */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Stoppage</ThemedText>
        {stoppage ? (
          <StoppageTimer 
            startTime={stoppage.startTime}
            onEnd={() => setStoppage(undefined)}
          />
        ) : (
          <ThemedText>No active stoppage</ThemedText>
        )}
      </View>

      {/* Sync Control */}
      <ListenerSyncControl
        gameId={gameId}
        onClockUpdate={setGameClock}
        onStoppageStart={setStoppage}
        onStoppageEnd={() => setStoppage(undefined)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  updateTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});