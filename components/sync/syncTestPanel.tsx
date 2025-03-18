import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '/Users/atharvsonawane/musen-app/components/ThemedText';
import { ListenerSyncControl } from './ListenerSyncControl';
import { StoppageTimer } from './StoppageTimer';
import { GameClock, StoppageEvent } from '../../api/sync/syncTypes';

interface SyncTestPanelProps {
  gameId: string;
  initialClock: GameClock;
}

export const SyncTestPanel: React.FC<SyncTestPanelProps> = ({ gameId, initialClock }) => {
  const [gameClock, setGameClock] = useState<GameClock>(initialClock);
  const [stoppage, setStoppage] = useState<StoppageEvent>();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

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