import React, { useState, useEffect } from 'react'
import { View, Image, StyleSheet, SafeAreaView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ScoreBoard from '../components/ScoreBoard'
import { useActiveStream } from '@/hooks/useActiveStream'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { router } from 'expo-router'
import { syncService } from '@/api/sync/syncService'
import { GameClock, StoppageEvent } from '@/api/sync/syncTypes'
import { SyncTestPanel } from '@/components/sync/syncTestPanel'

const Header = () => {
  return (
    <ThemedView style={styles.header}>
      <View style={styles.webHeaderContent}>
        <View style={styles.headerLeft}>
          <Ionicons 
            name="arrow-back" 
            size={32} 
            color="#000" 
            style={styles.backButton}
            onPress={() => router.push('/')}
          />
          <Image 
            source={{
              uri: 'https://framerusercontent.com/images/Wsf9gwWc57UJnuivO96aVeTg.png',
            }}
            style={styles.webLogo}
          />
          <ThemedText 
            type="default" 
            style={styles.headerText}
          >
            musen
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  )
}

const GameClockPanel = ({ gameId }: { gameId: string }) => {
  const [clock, setClock] = useState<GameClock>();

  useEffect(() => {
    console.log('GameClockPanel mounted for game:', gameId);
    
    // Initialize clock with current game data
    syncService.updateGameClock(gameId, {
      gameId,
      period: 1,
      minutes: 12,
      seconds: 0,
      isRunning: false,
      lastUpdated: new Date()
    });
    
    syncService.startDebugPolling(gameId, (newClock, stoppage) => {
      console.log('Clock update received in GameClockPanel:', newClock);
      if (newClock) {
        setClock(newClock);
      }
    });

    return () => {
      console.log('GameClockPanel unmounting, stopping polling');
      syncService.stopDebugPolling(gameId);
    };
  }, [gameId]);

  return (
    <View style={styles.gameClockPanel}>
      <ThemedText style={styles.clockTitle}>Live Game Clock</ThemedText>
      <ThemedText style={styles.clockTime}>
        {clock ? (
          `${clock.period}Q ${clock.minutes}:${clock.seconds.toString().padStart(2, '0')}`
        ) : (
          'Waiting for updates...'
        )}
      </ThemedText>
      <ThemedText style={styles.clockStatus}>
        Status: {clock?.isRunning ? 'Running' : 'Stopped'}
      </ThemedText>
    </View>
  );
};

const Stream = () => {
  const { activeStream } = useActiveStream()
  const isWeb = Platform.OS === 'web'
  const [isLiked, setIsLiked] = React.useState(false)
  const [game, setGame] = useState(activeStream?.game)

  useEffect(() => {
    if (activeStream?.game?.radarGameId) {  // Add check for radarGameId
      console.log('Setting initial game state:', activeStream.game);
      setGame(activeStream.game);
      
      // Initialize sync service with game data using radarGameId
      syncService.updateGameClock(activeStream.game.radarGameId, {
        gameId: activeStream.game.radarGameId,
        period: activeStream.game.period || 1,
        minutes: activeStream.game.minutes || 0,
        seconds: activeStream.game.seconds || 0,
        isRunning: activeStream.game.isRunning || false,
        lastUpdated: new Date()
      });
    }
  }, []);
  
  useEffect(() => {
    if (activeStream?.game?.radarGameId && activeStream.game.id !== game?.id) {  // Add check for radarGameId
      console.log('Game updated in stream:', activeStream.game);
      setGame(activeStream.game);
      
      // Update sync service when game changes using radarGameId
      syncService.updateGameClock(activeStream.game.radarGameId, {
        gameId: activeStream.game.radarGameId,
        period: activeStream.game.period || 1,
        minutes: activeStream.game.minutes || 0,
        seconds: activeStream.game.seconds || 0,
        isRunning: activeStream.game.isRunning || false,
        lastUpdated: new Date()
      });
    }
  }, [activeStream]);

  if (!activeStream || !game) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {isWeb && <Header />}
      <View style={[styles.container, isWeb && styles.webContainer]}>
        <View style={[styles.contentWrapper, isWeb && styles.webContentWrapper]}>
          {/* ... other components ... */}

          <View style={[styles.scoreBoardWrapper, isWeb && styles.webScoreBoardWrapper]}>
            <ScoreBoard game={game}/>
          </View>

          {isWeb && game.radarGameId && (
            <View style={styles.clockContainer}>
              <GameClockPanel gameId={game.radarGameId} />
              <SyncTestPanel 
                gameId={game.radarGameId}
                initialClock={{
                  gameId: game.radarGameId,
                  period: game.period || 1,
                  minutes: game.minutes || 0,
                  seconds: game.seconds || 0,
                  isRunning: game.isRunning || false,
                  lastUpdated: new Date()
                }}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  webContainer: {
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
  },
  webContentWrapper: {
    maxWidth: 850,
    width: '100%',
  },
  header: {
    height: 80,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#486B52',
  },
  webHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    maxWidth: 850,
    width: '100%',
    marginHorizontal: 'auto',
    paddingLeft: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  webLogo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginLeft: 190,
  },
  headerText: {
    fontSize: 50,
    color: 'black',
  },
  streamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  webStreamHeader: {
    width: '100%',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    justifyContent: 'flex-start',
  },
  webProfile: {
    width: '100%',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  username: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    marginLeft: 'auto',
  },
  countText: {
    fontSize: 16,
    color: '#333333',
  },
  scoreBoardWrapper: {
    width: '100%',
  },
  webScoreBoardWrapper: {
    alignItems: 'center',
  },
  placeholderSection: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  webPlaceholderSection: {
    width: '100%',
  },
  placeholder: {
    height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  debugPanel: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212529',
  },
  debugSection: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  debugLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  debugTimestamp: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  gameClockPanel: {
    backgroundColor: '#FFFFFF', // Change to white background
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  clockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Change to black text
    marginBottom: 8,
  },
  clockTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#203024', // Change to dark color
    marginVertical: 8,
  },
  clockStatus: {
    fontSize: 14,
    color: '#203024', // Change to dark color
    opacity: 0.8,
  },
  clockHelper: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 8,
    textAlign: 'center',
  },
  clockContainer: {
    width: '100%',
    marginTop: 20,
    gap: 16,
  }
})

export default Stream