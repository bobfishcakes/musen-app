import React, { useState, useEffect } from 'react'
import { View, Image, StyleSheet, SafeAreaView, Platform, Modal, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ScoreBoard from '../components/ScoreBoard'
import { useActiveStream } from '@/hooks/useActiveStream'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { router } from 'expo-router'
import { syncService } from '@/api/sync/syncService'
import { GameClock, StoppageEvent } from '@/api/sync/syncTypes'
import { SyncTestPanel } from '@/components/sync/syncTestPanel'
import { GameSyncControl } from '@/components/GameSyncControl'
import { GameTabs } from '@/components/gameTabs'
import { Header } from '@/components/Header';
import { useStreaming } from '/Users/atharvsonawane/musen-app-push-feed/contexts/streamingContext'
import { GameStatsPanel } from '@/components/GameStatsPanel'
import { getNBATeamColor } from '@/api/basketball/basketballTypes'

  const TimerInput = ({ value, onChange }: { value: string, onChange: (text: string) => void }) => {
    const [minutes, seconds] = value.split(':');

    const handleMinuteChange = (text: string) => {
      const mins = text.replace(/[^\d]/g, '');
      if (mins.length <= 2) {
        const newMinutes = mins.length === 0 ? '00' : mins;
        onChange(`${newMinutes}:${seconds || '00'}`);
      }
    };

    const handleSecondChange = (text: string) => {
      const secs = text.replace(/[^\d]/g, '');
      if (secs.length <= 2) {
        const newSeconds = secs.length === 0 ? '00' : secs;
        onChange(`${minutes || '00'}:${newSeconds}`);
      }
    };

    return (
      <View style={styles.timerInput}>
        <TextInput
          style={styles.timerDigit}
          value={minutes || '00'}
          onChangeText={handleMinuteChange}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus={true}
        />
        <ThemedText style={styles.timerSeparator}>:</ThemedText>
        <TextInput
          style={styles.timerDigit}
          value={seconds || '00'}
          onChangeText={handleSecondChange}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus={true}
        />
      </View>
    );
  };

  const handleBack = () => {
    router.back();
  };


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
    
    // Use properly typed callback
    syncService.startDebugPolling(gameId, (updatedClock: GameClock) => {
      console.log('Clock update received in GameClockPanel:', updatedClock);
      setClock(updatedClock);
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
  const { isStreaming } = useStreaming()
  const [activeTab, setActiveTab] = useState('game time')
  const [showTimePrompt, setShowTimePrompt] = useState(false)
  const [gameStartTime, setGameStartTime] = useState('00:00')
  const [isTimeSet, setIsTimeSet] = useState(false)

  useEffect(() => {
    // Show prompt only when component mounts, time hasn't been set, AND user is streaming
    if (activeStream && !isTimeSet && isStreaming) {
      setShowTimePrompt(true)
    }
  }, [activeStream, isTimeSet, isStreaming])

  const validateTimeFormat = (time: string) => {
    // Accept format MM:SS
    const timeRegex = /^([0-5]?[0-9]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };

  const handleTimeChange = (text: string) => {
    // Remove non-digit and non-colon characters
    let formatted = text.replace(/[^\d:]/g, '');
    
    // Don't allow more than 5 characters (MM:SS format)
    if (formatted.length > 5) return;
  
    // Add colon after 2 digits if not present
    if (formatted.length === 2 && !formatted.includes(':')) {
      formatted += ':';
    }
  
    // Validate minutes and seconds
    const parts = formatted.split(':');
    if (parts[0] && parseInt(parts[0]) > 59) {
      parts[0] = '59';
      formatted = parts.join(':');
    }
    if (parts[1] && parseInt(parts[1]) > 59) {
      parts[1] = '59';
      formatted = parts.join(':');
    }
  
    setGameStartTime(formatted);
  };

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
      {isWeb && <Header showBack isStreamPage/>}
      {Platform.OS === 'ios' && (
        <View style={styles.pullDownIndicator} />
      )}
      <View style={[styles.container, isWeb && styles.webContainer]}>
        <View style={[styles.contentWrapper, isWeb && styles.webContentWrapper]}>
          <View style={[styles.streamHeader, isWeb && styles.webStreamHeader]}>
            <ThemedText type="subtitle" style={{ color: '#000000' }}>{activeStream.title}</ThemedText>
            <View style={styles.controls}>
              <Ionicons name="bluetooth" size={24} color="#203024" />
              <Ionicons name="volume-mute" size={24} color="#203024" />
            </View>
          </View>
          
          {/* Separator added here */}
          {isWeb && (
            <View style={styles.separator} />
          )}
  
          <View style={[styles.profile, isWeb && styles.webProfile]}>
            <Image
              source={{
                uri: 'https://framerusercontent.com/images/Wsf9gwWc57UJnuivO96aVeTg.png',
              }}
              style={styles.profilePic}
            />
            <ThemedText type="defaultSemiBold" style={styles.username}>bobfishcakes</ThemedText>
            
            <View style={styles.viewerCount}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={Platform.OS === 'web' ? 32 : 24}
                color={isLiked ? '#FF4444' : '#333'}
                onPress={() => setIsLiked(!isLiked)}
              />
              <Ionicons 
                name="headset" 
                size={Platform.OS === 'web' ? 32 : 24}
                color="#333" 
              />
              <ThemedText style={styles.countText}>{activeStream.listeners}</ThemedText>
            </View>
          </View>
  
          <View style={[styles.scoreBoardWrapper, isWeb && styles.webScoreBoardWrapper]}>
            <ScoreBoard game={activeStream.game}/>
          </View>
  
          <View style={[styles.tabsWrapper, isWeb && styles.webTabsWrapper]}>
            <GameTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </View>
  
          <View style={[styles.gameSyncWrapper, isWeb && styles.webGameSyncWrapper]}>
  {activeTab === 'game time' ? (
    <GameSyncControl 
      initialTime={isTimeSet ? gameStartTime : '00:00'} 
      isStreaming={isStreaming}
    />
  ) : activeTab === 'stats' ? (
<GameStatsPanel 
  gameId={game.radarGameId} 
  game={{
    teams: {
      home: {
        ...game.teams.home,
        colors: [
          game.teams.home.primaryColor || '#CCCCCC',
          game.teams.home.primaryColor || '#CCCCCC',
          game.teams.home.primaryColor || '#CCCCCC'
        ]
      },
      away: {
        ...game.teams.away,
        colors: [
          game.teams.away.primaryColor || '#CCCCCC',
          game.teams.away.primaryColor || '#CCCCCC',
          game.teams.away.primaryColor || '#CCCCCC'
        ]
      }
    },
    league: {
      name: game.league?.name || 'NFL',  // Use the league from game object or default to 'NFL'
      alias: game.league?.alias || 'NFL'  // Use the league alias from game object or default to 'NFL'
    }
  }}
/>
  ) : null}
</View>

          {/* Add Game Clock and Sync Test Panel here */}
          {game.radarGameId && ( // Remove the isWeb check
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
  
          <View style={[styles.placeholderSection, isWeb && styles.webPlaceholderSection]}>
            <View style={styles.placeholder} />
            <View style={styles.placeholder} />
            <View style={styles.placeholder} />
          </View>
        </View>
      </View>

      <Modal
        visible={showTimePrompt && isStreaming}
        transparent={true}
        animationType="fade"
      >
        {/* Modal content */}
      </Modal>
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
    marginTop: 60, // Add this line to push content below header
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
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 0,
  },
  tabsWrapper: {
    width: '100%',
    marginVertical: 8,
    marginTop: 20,
  },
  webTabsWrapper: {
    alignItems: 'center',
    maxWidth: 850,
  },
  gameSyncWrapper: {
    width: '100%',
    marginTop: 0,
    marginBottom: 20,
  },
  webGameSyncWrapper: {
    alignItems: 'center',
    width: '100%', // Ensure full width
    maxWidth: 850, // Match the content wrapper width instead of 749
  },
  pullDownIndicator: {
    width: 36,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  timerInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16, // Reduced to accommodate warning message below
    gap: 8,
  },
  timerDigit: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    width: 60,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  timerSeparator: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
})

export default Stream