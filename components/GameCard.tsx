import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { Game } from '../constants/Interfaces';

interface GameCardProps {
  game: Game;
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

  // Replace the simple status mapping with this function
  const getStatus = () => {
    if (!game.status) return 'N/A';

    // For games that haven't started
    if (game.status.short === 'NS') {
      // Make sure we have the time
      if (game.game?.date?.time) {
        // Convert 24-hour time to 12-hour time
        const [hours, minutes] = game.game.date.time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `Starts at ${hour12}:${minutes} ${ampm}`;
      }
      return 'Not Started';
    }

    // For all other statuses, use the statusMap
    return statusMap[game.status.short] || game.status.short;
  };

  return (
    <View>
      <TouchableOpacity style={styles.card}>
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
              <Text style={styles.scoreText}>{`${awayScore}-${homeScore}`}</Text>
              <Text style={styles.statusText}>{getStatus()}</Text>
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
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
    width: 300,
    marginHorizontal: 5,
  },
  gameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  centerColumn: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  innerText: {
    color: 'black',
    fontSize: 14,
    marginHorizontal: 2,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,  // Increase from current size
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusText: {
    color: '#50775B',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  teamLogo: {
    width: 50,
    height: 50,
  },
});

export default GameCard;