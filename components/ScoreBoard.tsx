import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { statusMap } from './GameCard';

type GameType = {
  scores?: {
    home: { total: number };
    away: { total: number };
  };
  status: {
    short: string;
  };
  teams: {
    home: { logo: string; name: string };
    away: { logo: string; name: string };
  };
};

interface ScoreBoardProps {
  game: GameType;
}

const ScoreBoard = ({ game }: ScoreBoardProps) => {
  return (
    <View style={styles.scoreBoard}>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{game.scores?.home.total}</Text>
          <View style={styles.statusSection}>
            <Text style={styles.gameStatus}>{statusMap[game.status.short]}</Text>
            <View style={styles.controls}>
              <Ionicons name="volume-mute" size={24} color="#333" />
              <Ionicons name="bluetooth" size={24} color="#333" />
            </View>
          </View>
          <Text style={styles.score}>{game.scores?.away.total}</Text>
        </View>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamContainer}>
          <Image 
            source={{ uri: game.teams.home.logo }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{game.teams.home.name}</Text>
        </View>

        <View style={styles.teamContainer}>
          <Image 
            source={{ uri: game.teams.away.logo }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{game.teams.away.name}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreBoard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
    gap: 12,
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
    marginTop: 20,
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
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  statusSection: {
    alignItems: 'center',
    minWidth: 100,
  }
});

export default ScoreBoard;