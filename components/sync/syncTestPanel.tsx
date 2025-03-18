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
        console.log('Fetching game details for gameId:', gameId);
        const gameDetails = await sportRadarHTTPService.getGameDetails(gameId);
        console.log('Raw API Response:', gameDetails);
    
        if (gameDetails && gameDetails.status) {
          // Log the raw clock string from API
          console.log('Raw clock string:', gameDetails.status.clock);
    
          // Parse and log clock components
          const [minutesStr, secondsStr] = (gameDetails.status.clock || "0:00").split(':');
          const minutes = parseInt(minutesStr) || 0;
          const seconds = parseInt(secondsStr) || 0;
          
          console.log('Parsed clock values:', {
            minutes,
            seconds,
            quarter: gameDetails.status.quarter,
            type: gameDetails.status.type
          });
    
          // Create and log the new clock object
          const newClock: GameClock = {
            gameId,
            period: gameDetails.status.quarter,
            minutes: minutes,
            seconds: seconds,
            isRunning: gameDetails.status.type === 'inprogress',
            lastUpdated: new Date()
          };
          
          console.log('Created GameClock object:', newClock);
    
          // Log before updating services
          console.log('Updating sync service with clock:', newClock);
          syncService.updateGameClock(gameId, newClock);
          
          // Log state updates
          console.log('Setting state variables:', {
            gameClock: newClock,
            lastUpdate: new Date()
          });
          
          setGameClock(newClock);
          setLastUpdate(new Date());
        } else {
          console.warn('Game details or status missing:', gameDetails);
        }
      } catch (error: unknown) {
        console.error('Error in pollGameData:', error);
        
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack
          });
        } else {
          console.error('Unknown error type:', error);
        }
      }
    };
  
    const interval = setInterval(pollGameData, 5000);
    pollGameData(); // Initial call
  
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