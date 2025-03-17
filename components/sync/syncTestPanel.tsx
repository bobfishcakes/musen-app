// SyncTestPanel.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '/Users/atharvsonawane/musen-app/components/ThemedText';
import { ListenerSyncControl } from './ListenerSyncControl';
import { StoppageTimer } from './StoppageTimer';
import { GameClock, StoppageEvent } from '../../api/sync/syncTypes';
import { sportRadarHTTPService } from '/Users/atharvsonawane/musen-app/server/src/api/sportRadar/sportRadarHTTPService';
import { syncService } from '../../api/sync/syncService';

interface SyncTestPanelProps {
  gameId: string;
}

export const SyncTestPanel: React.FC<SyncTestPanelProps> = ({ gameId }) => {
  const [gameClock, setGameClock] = useState<GameClock>();
  const [stoppage, setStoppage] = useState<StoppageEvent>();
  const [lastUpdate, setLastUpdate] = useState<Date>();

  useEffect(() => {
    const pollGameData = async () => {
      try {
        const gameDetails = await sportRadarHTTPService.getGameDetails(gameId);
        
        if (gameDetails) {
          // Create properly typed GameClock object using the GameDetailsResponse
          const newClock: GameClock = {
            gameId,
            period: gameDetails.period,
            minutes: gameDetails.clock?.minutes || 0,
            seconds: gameDetails.clock?.seconds || 0,
            isRunning: gameDetails.status === 'inprogress',
            lastUpdated: new Date()
          };

          syncService.updateGameClock(gameId, newClock);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Error polling game data:', error);
      }
    };

    const interval = setInterval(pollGameData, 5000);
    pollGameData();

    return () => clearInterval(interval);
  }, [gameId]);

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
        {lastUpdate && (
          <ThemedText style={styles.updateTime}>
            Last Update: {lastUpdate.toLocaleTimeString()}
          </ThemedText>
        )}
      </View>

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