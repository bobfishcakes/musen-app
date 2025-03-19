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

const SyncDebugPanel = ({ gameId }: { gameId: string }) => {
  const [clock, setClock] = useState<GameClock>();
  const [stoppage, setStoppage] = useState<StoppageEvent>();

  useEffect(() => {
    syncService.startDebugPolling(gameId, (newClock, newStoppage) => {
      setClock(newClock);
      setStoppage(newStoppage);
    });

    return () => syncService.stopDebugPolling(gameId);
  }, [gameId]);

  return (
    <View style={styles.debugPanel}>
      <ThemedText style={styles.debugTitle}>Sync Debug Panel</ThemedText>
      
      <View style={styles.debugSection}>
        <ThemedText style={styles.debugLabel}>Game Clock:</ThemedText>
        <ThemedText>
          Period: {clock?.period || '-'} | 
          Time: {clock?.minutes || '--'}:{clock?.seconds.toString().padStart(2, '0') || '--'}
        </ThemedText>
        <ThemedText>Status: {clock?.isRunning ? 'Running' : 'Stopped'}</ThemedText>
        <ThemedText style={styles.debugTimestamp}>
          Last Update: {clock?.lastUpdated?.toLocaleTimeString() || '-'}
        </ThemedText>
      </View>

      <View style={styles.debugSection}>
        <ThemedText style={styles.debugLabel}>Stoppage Status:</ThemedText>
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

const GameClockPanel = ({ gameId }: { gameId: string }) => {
  const [clock, setClock] = useState<GameClock>();

  useEffect(() => {
    syncService.startDebugPolling(gameId, (newClock) => {
      setClock(newClock);
    });

    return () => syncService.stopDebugPolling(gameId);
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
      <ThemedText style={styles.clockHelper}>
        Use this clock to sync your stream with real-time game updates
      </ThemedText>
    </View>
  );
};

const Stream = () => {
  const { activeStream } = useActiveStream()
  const isWeb = Platform.OS === 'web'
  const [isLiked, setIsLiked] = React.useState(false)

  if (!activeStream) {
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
          <View style={[styles.streamHeader, isWeb && styles.webStreamHeader]}>
            <ThemedText type="subtitle" style={{ color: '#000000' }}>{activeStream.title}</ThemedText>
            <View style={styles.controls}>
              <Ionicons name="bluetooth" size={24} color="#203024" />
              <Ionicons name="volume-mute" size={24} color="#203024" />
            </View>
          </View>

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
                size={24}
                color={isLiked ? '#FF4444' : '#333'}
                onPress={() => setIsLiked(!isLiked)}
              />
              <Ionicons name="headset" size={24} color="#333" />
              <ThemedText style={styles.countText}>{activeStream.listeners}</ThemedText>
            </View>
          </View>

          <View style={[styles.scoreBoardWrapper, isWeb && styles.webScoreBoardWrapper]}>
            <ScoreBoard game={activeStream.game}/>
          </View>

          {isWeb && <GameClockPanel gameId={activeStream.game.id} />}

          {isWeb && (
  <SyncTestPanel 
    gameId={activeStream.game.id}
    initialClock={{
      gameId: activeStream.game.id,
      period: activeStream.game.period,
      minutes: activeStream.game.minutes,
      seconds: activeStream.game.seconds,
      isRunning: activeStream.game.isRunning,
      lastUpdated: new Date()
    }}
  />
)}

          <View style={[styles.placeholderSection, isWeb && styles.webPlaceholderSection]}>
            <View style={styles.placeholder} />
            <View style={styles.placeholder} />
            <View style={styles.placeholder} />
          </View>
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
    backgroundColor: '#203024',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  clockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  clockTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 8,
  },
  clockStatus: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  clockHelper: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 8,
    textAlign: 'center',
  },
})

export default Stream