import React from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Game } from '../constants/Interfaces'
import { ThemedText } from './ThemedText'
import { LinearGradient } from 'expo-linear-gradient'
import { getTeamColor } from '/Users/atharvsonawane/musen-app-latest/app/mockData'

interface GameCardProps {
  game: Game
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

const GameCard = ({ game }: GameCardProps) => {
  const homeScore = game.scores?.home.total ?? '0';
  const awayScore = game.scores?.away.total ?? '0';
  
  const homeColor = game.teams.home.primaryColor || getTeamColor(game.teams.home.name);
  const awayColor = game.teams.away.primaryColor || getTeamColor(game.teams.away.name);
  
  const getContrastColor = (backgroundColor: string) => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const textColor = '#ffffff'; // Always white text for better contrast

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
      <TouchableOpacity>
        <View style={styles.card}>
          <LinearGradient
            colors={[awayColor, homeColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.gameContainer}>
            <View style={styles.teamContainer}>
              <View style={styles.teamColumn}>
                <Image
                  source={{ uri: game.teams.away.logo }}
                  style={styles.teamLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.centerColumn}>
              <ThemedText 
  type="subtitle" 
  style={[styles.scoreText, { color: '#000000' }]} // Changed to black
>
  {`${awayScore} - ${homeScore}`}
</ThemedText>
<ThemedText 
  type="defaultSemiBold" 
  style={[styles.statusText, { color: '#203024' }]} // Changed to green
>
  {getStatus()}
</ThemedText>
              </View>
              <View style={styles.teamColumn}>
                <Image
                  source={{ uri: game.teams.home.logo }}
                  style={styles.teamLogo}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 5,
  },
  card: {
    height: 120,
    width: 300,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
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
  scoreText: {
    textAlign: 'center',
  },
  statusText: {
    marginTop: 8,
  },
  teamLogo: {
    width: 60,
    height: 60,
  },
});

export default GameCard;