import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Game } from './interfaces';

interface GameCardProps {
  game: Game;
}

export const statusMap: { [key: string]: string } = {
    NS: "Not Started",
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
  const status = game.status? statusMap[game.status.short] : 'N/A';

  return (
    <View>
      <TouchableOpacity style={styles.card}>
        <View style={styles.gameContainer}>
          <View style={styles.teamContainer}>
            <View style={styles.teamColumn}>
              <Text 
                numberOfLines={1} 
                style={styles.innerText}
              >
                {game.teams.away.name}
              </Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.innerText}>at</Text>
              <Text style={styles.scoreText}>{`${awayScore}-${homeScore}`}</Text>
              <Text style={styles.statusText}>{`${status}`}</Text>
            </View>
            <View style={styles.teamColumn}>
              <Text 
                numberOfLines={1} 
                ellipsizeMode="tail" 
                style={styles.innerText}
              >
                {game.teams.home.name}
              </Text>
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
    backgroundColor: '#3e3e3e',
    borderRadius: 8,
    width: 400,
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
    color: 'white',
    fontSize: 14,
    marginHorizontal: 2,
    textAlign: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statusText: {
    color: '#BAE0C0',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default GameCard;