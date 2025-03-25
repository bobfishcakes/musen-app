import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { sportRadarPushService } from '@/server/src/api/sportRadar/sportRadarPushService';

interface ClockState {
  period: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  lastUpdate: Date;
}

const GameClockPanel: React.FC<{ gameId: string }> = ({ gameId }) => {
  const [clockState, setClockState] = useState<ClockState>();

  useEffect(() => {
    console.log('GameClockPanel mounting for game:', gameId);
    
    const subscription = sportRadarPushService.clockUpdates$.subscribe(update => {
      if (update.gameId === gameId) {
        setClockState({
          period: update.period,
          minutes: update.clock.minutes,
          seconds: update.clock.seconds,
          isRunning: update.clock.isRunning,
          lastUpdate: new Date()
        });
      }
    });

    // Subscribe to push feed
    sportRadarPushService.subscribeToGame(gameId);

    return () => {
      subscription.unsubscribe();
      sportRadarPushService.unsubscribeFromGame(gameId);
    };
  }, [gameId]);

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.panel}>
      <ThemedText style={styles.title}>Live Game Clock</ThemedText>
      <ThemedText style={styles.clockDisplay}>
        {clockState ? 
          `Q${clockState.period} ${formatTime(clockState.minutes, clockState.seconds)}` : 
          "Waiting for updates..."}
      </ThemedText>
      <View style={styles.statusContainer}>
        <View 
          style={[
            styles.statusIndicator, 
            { backgroundColor: clockState?.isRunning ? '#4CAF50' : '#F44336' }
          ]} 
        />
        <ThemedText style={styles.status}>
          {clockState?.isRunning ? 'Clock Running' : 'Clock Stopped'}
        </ThemedText>
      </View>
      {clockState?.lastUpdate && (
        <ThemedText style={styles.lastUpdate}>
          Last update: {clockState.lastUpdate.toLocaleTimeString()}
        </ThemedText>
      )}
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
  }
});

export default GameClockPanel;