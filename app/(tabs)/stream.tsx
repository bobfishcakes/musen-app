import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockNbaGames } from '../mockData';
import { statusMap } from '../../components/GameCard';

const Stream = () => {
  const currentGame = mockNbaGames[0];
  const viewerCount = 1234;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentGame.league.name}</Text>
          <View style={styles.viewerCount}>
            <Ionicons name="headset" size={24} color="#333" />
            <Text style={styles.countText}>{viewerCount}</Text>
          </View>
        </View>

        <View style={styles.profile}>
          <Image 
            source={{ uri: 'https://framerusercontent.com/images/Wsf9gwWc57UJnuivO96aVeTg.png' }}
            style={styles.profilePic}
          />
          <Text style={styles.username}>John Player</Text>
        </View>

        <View style={styles.scoreBoard}>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreRow}>
              <Text style={styles.score}>{currentGame.scores?.home.total}</Text>
              <View style={styles.statusSection}>
                <Text style={styles.gameStatus}>{statusMap[currentGame.status.short]}</Text>
                <View style={styles.controls}>
                  <Ionicons name="volume-mute" size={24} color="#333" />
                  <Ionicons name="bluetooth" size={24} color="#333" />
                </View>
              </View>
              <Text style={styles.score}>{currentGame.scores?.away.total}</Text>
            </View>
          </View>

          <View style={styles.teamsRow}>
            <View style={styles.teamContainer}>
              <Image 
                source={{ uri: currentGame.teams.home.logo }}
                style={styles.teamLogo}
              />
              <Text style={styles.teamName}>{currentGame.teams.home.name}</Text>
            </View>

            <View style={styles.teamContainer}>
              <Image 
                source={{ uri: currentGame.teams.away.logo }}
                style={styles.teamLogo}
              />
              <Text style={styles.teamName}>{currentGame.teams.away.name}</Text>
            </View>
          </View>
        </View>

        {/* Placeholder section */}
        <View style={styles.placeholderSection}>
          <View style={styles.placeholder} />
          <View style={styles.placeholder} />
          <View style={styles.placeholder} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  
  // New placeholder styles
  placeholderSection: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  placeholder: {
    height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 16,
  },
  
  // Make sure all existing styles are included here
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  countText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  scoreBoard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  score: {
    fontSize: 64,
    fontWeight: '800',
    color: '#333',
  },
  teamsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  teamContainer: {
    alignItems: 'center',
    width: '40%',
  },
  teamLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  teamName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  gameStatus: {
    fontSize: 14,
    color: '#FF4444',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0', // Fallback color while loading
  },
  username: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusContainer: {
    minWidth: 100,
    alignItems: 'center',
  },
  statusSection: {
    alignItems: 'center',
    minWidth: 100,
    gap: 12,
  }
});

export default Stream;