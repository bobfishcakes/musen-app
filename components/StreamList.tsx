import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Game, Stream } from '@/constants/Interfaces';
import ScoreBoard from './ScoreBoard';
import { Header } from './Header';

interface StreamerCardProps {
  stream: Stream;
  onPress: () => void;
}

const StreamerCard = ({ stream, onPress }: StreamerCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.leftContent}>
      <Image
        source={{ uri: 'https://framerusercontent.com/images/Wsf9gwWc57UJnuivO96aVeTg.png' }}
        style={styles.profilePic}
      />
      <View style={styles.textContent}>
        <ThemedText type="defaultSemiBold" style={styles.username}>
          {stream.streamer}
        </ThemedText>
        <ThemedText style={styles.tagline}>
          Professional sports enthusiast
        </ThemedText>
      </View>
    </View>
    <View style={styles.rightContent}>
      <Ionicons name="headset" size={24} color="#333" />
      <ThemedText style={styles.listenerCount}>
        {stream.listeners}
      </ThemedText>
    </View>
  </TouchableOpacity>
);

interface StreamListProps {
  game: Game;
  onStreamSelect: (stream: Stream | null) => void;
  onStartStream: () => void;
}

export const StreamList = ({ game, onStreamSelect, onStartStream }: StreamListProps) => {
  // Mock streams - replace with actual data later
  const mockStreams: Stream[] = [
    {
      id: '1',
      title: `${game.teams.away.name} vs ${game.teams.home.name}`,
      streamer: 'bobfishcakes',
      game: game,
      listeners: 42,
      isOwnStream: false
    },
    {
      id: '2',
      title: `${game.teams.away.name} vs ${game.teams.home.name}`,
      streamer: 'sportsguru',
      game: game,
      listeners: 28,
      isOwnStream: false
    }
  ];

  const handleStreamSelect = (stream: Stream) => {
    console.log('Stream selected:', stream.id); // Add logging for debugging
    onStreamSelect(stream);
  };

  return (
    <ThemedView style={styles.container}>
      <Header showBack />
      <View style={styles.scoreboardContainer}>
        <ScoreBoard game={game} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {mockStreams.map((stream) => (
            <StreamerCard
              key={stream.id}
              stream={stream}
              onPress={() => handleStreamSelect(stream)}
            />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.startStreamButton} onPress={onStartStream}>
        <ThemedText style={styles.startStreamText}>Start Your Own Stream</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scoreboardContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 100, // Add padding to account for button
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
  },
  textContent: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    color: '#333',
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listenerCount: {
    fontSize: 16,
    color: '#333',
    minWidth: 24,
    textAlign: 'right',
  },
  startStreamButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#64a675',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  startStreamText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});