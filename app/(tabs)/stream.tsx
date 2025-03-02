import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockNbaGames } from '../mockData';
import ScoreBoard from '../../components/ScoreBoard';

const Stream = () => {
  const currentGame = mockNbaGames[0];
  const viewerCount = 12;
  const streamTitle = 'Mavs Money Enjoyers';
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{streamTitle}</Text>
          <View style={styles.viewerCount}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? "#FF4444" : "#333"}
              onPress={() => setIsLiked(!isLiked)}
            />
            <Ionicons name="headset" size={24} color="#333" />
            <Text style={styles.countText}>{viewerCount}</Text>
          </View>
        </View>

        <View style={styles.profile}>
          <Image 
            source={{ uri: 'https://framerusercontent.com/images/Wsf9gwWc57UJnuivO96aVeTg.png' }}
            style={styles.profilePic}
          />
          <Text style={styles.username}>bobfishcakes</Text>
        </View>

        <ScoreBoard game={currentGame} showControls={true}/>

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
  // Remove scoreboard-related styles and keep only the styles needed for Stream component
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
    backgroundColor: '#E0E0E0',
  },
  username: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
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
});

export default Stream;