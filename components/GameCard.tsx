import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Game } from '../constants/Interfaces';
import { ThemedText } from './ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { getTeamColor } from '../app/mockData';

interface GameCardProps {
  game: Game;
  onPress?: () => void;
}

export const statusMap: { [key: string]: string } = {
  Q1: "1st Quarter",
  Q2: "2nd Quarter",
  Q3: "3rd Quarter",
  Q4: "4th Quarter",
  OT: "Overtime",
  BT: "Break",
  HT: "Halftime",
  FT: "Final",
  AOT: "After Over Time",
  POST: "Game Postponed",
  CANC: "Game Cancelled",
  SUSP: "Game Suspended",
  AWD: "Game Awarded",
  ABD: "Game Abandoned"
};

const GameCard = ({ game, onPress }: GameCardProps) => {
  const homeScore = game.scores?.home.total ?? '0';
  const awayScore = game.scores?.away.total ?? '0';
  const isWeb = Platform.OS === 'web';

  const homeColor = game.teams.home.primaryColor || getTeamColor(game.teams.home.name);
  const awayColor = game.teams.away.primaryColor || getTeamColor(game.teams.away.name);

  const getStatus = () => {
    if (!game.status) return 'N/A';

    if (game.status.short === 'NS') {
      if (game.game?.date?.time) {
        const [hours, minutes] = game.game.date.time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `Starts at ${hour12}:${minutes} ${ampm}`;
      }
      return 'Not Started';
    }

    return statusMap[game.status.short] || game.status.short;
  };

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <View style={[styles.card, isWeb && styles.webCard]}>
      {(homeColor && awayColor) ? (
        <LinearGradient
          colors={[homeColor, awayColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      <View style={[styles.gameContainer, isWeb && styles.webGameContainer]}>
            {isWeb ? (
              <>
<View style={styles.webTeamContainer}>
  <View style={styles.webStatusSection}>
    <ThemedText
      type="defaultSemiBold"
      style={[{ color: '#324b39' }]}
    >
      {getStatus()}
    </ThemedText>
  </View>
  
  <View style={styles.webMainContent}>
    <View style={styles.webTeamSection}>
      <Image
        source={{ uri: game.teams.home.logo }}
        style={styles.webTeamLogo}
        resizeMode="contain"
      />
      <ThemedText
        type="subtitle"
        style={[styles.webScore, { color: '#000000' }]}
      >
        {homeScore}
      </ThemedText>
    </View>

    <ThemedText
      type="subtitle"
      style={[{ color: '#000000', paddingHorizontal: 8 }]} // Added padding
    >
      -
    </ThemedText>

    <View style={styles.webTeamSection}>
      <ThemedText
        type="subtitle"
        style={[styles.webScore, { color: '#000000' }]}
      >
        {awayScore}
      </ThemedText>
      <Image
        source={{ uri: game.teams.away.logo }}
        style={styles.webTeamLogo}
        resizeMode="contain"
      />
    </View>
  </View>
</View>

                <View style={styles.webStreamInfo}>
                  <ThemedText type="defaultSemiBold" style={{ color: '#324b39' }}>
                    Stream Info
                  </ThemedText>
                </View>
              </>
            ) : (
              <View style={styles.teamContainer}>
                <View style={styles.teamColumn}>
                  <Image
                    source={{ uri: game.teams.home.logo }}
                    style={styles.teamLogo}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.centerColumn}>
                  <ThemedText
                    type="subtitle"
                    style={[styles.scoreText, { color: '#000000' }]}
                  >
                    {`${awayScore} - ${homeScore}`}
                  </ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[styles.statusText, { color: '#324b39' }]}
                  >
                    {getStatus()}
                  </ThemedText>
                </View>
                <View style={styles.teamColumn}>
                  <Image
                    source={{ uri: game.teams.away.logo }}
                    style={styles.teamLogo}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 5,
  },
  card: {
    height: 120,
    width: 300,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2', // This will show when gradient is not rendered
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  webCard: {
    height: 120, // Reduced from 152
    width: '100%',
  },
  gameContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  webGameContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  webTeamContainer: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed from space-between
    paddingRight: 24,
    gap: 0, // Add gap between status and main content
  },
  webMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 35, // Reduced from 50
  },
  webStatusSection: {
    width: 112, // Reduced from 160
    marginLeft: 21, // Reduced from 30
  },
  webTeamSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28, // Reduced from 69
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  centerColumn: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statusText: {
    marginTop: 8,
  },
  scoreText: {
    textAlign: 'center',
  },
  webScore: {
    textAlign: 'center',
    width: 60,
  },
  teamLogo: {
    width: 60,
    height: 60,
  },
  webTeamLogo: {
    width: 63, // Reduced from 90
    height: 63, // Reduced from 90
  },
  touchable: {
    width: '100%',
  },
  webStreamInfo: {
    flex: 0.2,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.1)',
    paddingLeft: 24,
  },
});

export default GameCard;