import React, { useState, useEffect } from 'react'
import { View, Image, StyleSheet, SafeAreaView, Platform, Modal, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ScoreBoard from '../components/ScoreBoard'
import { useActiveStream } from '@/hooks/useActiveStream'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { router } from 'expo-router'
import { GameSyncControl } from '@/components/GameSyncControl'
import { GameTabs } from '@/components/gameTabs'
import { Header } from '@/components/Header';
import { useStreaming } from '@/contexts/StreamingContext'

const Stream = () => {
  const { activeStream } = useActiveStream()
  const { isStreaming } = useStreaming()
  const isWeb = Platform.OS === 'web'
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState('game time')
  const [showTimePrompt, setShowTimePrompt] = useState(false)
  const [gameStartTime, setGameStartTime] = useState('')
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
    // Format input as MM:SS
    let formatted = text.replace(/[^\d:]/g, '');
    if (formatted.length > 5) return;

    if (formatted.length === 2 && !formatted.includes(':') && gameStartTime.length < formatted.length) {
      formatted = formatted + ':';
    }
    
    setGameStartTime(formatted);
  };

  const handleTimeSubmit = () => {
    if (validateTimeFormat(gameStartTime)) {
      setIsTimeSet(true);
      setShowTimePrompt(false);
    } else {
      // You might want to show an error message here
      alert('Please enter a valid time in MM:SS format');
    }
  };

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
      {isWeb && <Header showBack />}
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
            <GameSyncControl 
              initialTime={isTimeSet ? gameStartTime : '00:00'} 
              isStreaming={isStreaming}
            />
          </View>
  
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="subtitle">Enter Current Game Time</ThemedText>
            <TextInput
              style={styles.timeInput}
              placeholder="MM:SS"
              value={gameStartTime}
              onChangeText={handleTimeChange}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleTimeSubmit}
            >
              <ThemedText style={styles.submitButtonText}>Start Stream</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
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
    marginTop: Platform.OS === 'web' ? 20 : 0, // Add top margin on web to account for header height
  },
  webContainer: {
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    marginTop: 20, // Add some margin to the content wrapper
  },
  webContentWrapper: {
    maxWidth: 850,
    width: '100%',
  },
  streamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Platform.OS === 'web' ? 16 : 0,
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderBottomColor: '#E0E0E0',
  },
  webStreamHeader: {
    width: '100%',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4, // Reduced from 8
    justifyContent: 'flex-start',
  },
  webProfile: {
    width: '100%',
    padding: 16, // Reduced padding if needed
  },
  profilePic: {
    width: Platform.OS === 'web' ? 56 : 40,
    height: Platform.OS === 'web' ? 56 : 40,
    borderRadius: Platform.OS === 'web' ? 28 : 20,
    backgroundColor: '#E0E0E0',
  },
  username: {
    marginLeft: Platform.OS === 'web' ? 16 : 12,
    fontSize: Platform.OS === 'web' ? 20 : 16,
    color: '#333',
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Platform.OS === 'web' ? 12 : 8,
    padding: Platform.OS === 'web' ? 12 : 8,
    marginLeft: 'auto',
    ...(Platform.OS === 'web' && {
      paddingRight: 16, // Add padding to align with card edges
    }),
  },
  countText: {
    fontSize: Platform.OS === 'web' ? 20 : 16,
    color: '#333333',
  },
  scoreBoardWrapper: {
    width: '100%',
  },
  webScoreBoardWrapper: {
    alignItems: 'center',
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
    ...(Platform.OS === 'web' && {
      paddingRight: 16, // Add padding to align with card edges
    }),
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
  tabsWrapper: {
    width: '100%',
    marginVertical: 8,
    marginTop: 20,
  },
  webTabsWrapper: {
    alignItems: 'center',
    maxWidth: 850,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, // Ensure it stays below other content when not visible
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    width: Platform.OS === 'web' ? 400 : '80%',
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#203024',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default Stream