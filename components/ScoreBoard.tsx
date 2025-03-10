import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { statusMap } from './GameCard'
import { ThemedText } from './ThemedText'
import { LinearGradient } from 'expo-linear-gradient'
import { getTeamColor } from '../app/mockData'
import { Svg, SvgUri } from 'react-native-svg'
import { Game } from '../constants/Interfaces'

interface ScoreBoardProps {
  game: Game
  onPress?: () => void
}

const ScoreBoard = ({ game, onPress }: ScoreBoardProps) => {
  const homeColor = game.teams.home.primaryColor || getTeamColor(game.teams.home.name)
  const awayColor = game.teams.away.primaryColor || getTeamColor(game.teams.away.name)

  const Content = (
    <View style={styles.scoreBoard}>
      <LinearGradient
        colors={[awayColor, homeColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.scoreContainer}>
        <View style={styles.scoreRow}>
          <ThemedText type="title" style={styles.score}>
            {game.scores?.away.total}
          </ThemedText>
          <View style={styles.statusSection}>
            <ThemedText style={[styles.gameStatus, { color: '#324b39' }]} type="defaultSemiBold">
              {statusMap[game.status.short]}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.score}>
            {game.scores?.home.total}
          </ThemedText>
        </View>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: game.teams.away.logo }}
            style={styles.teamLogo}
          />
          <ThemedText type="default" style={styles.teamName}>
            {game.teams.away.name}
          </ThemedText>
        </View>

        <View style={styles.teamContainer}>
          <Image
            source={{ uri: game.teams.home.logo }}
            style={styles.teamLogo}
          />
          <ThemedText type="default" style={styles.teamName}>
            {game.teams.home.name}
          </ThemedText>
        </View>
      </View>
    </View>
  )

  return onPress ? (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      {Content}
    </TouchableOpacity>
  ) : Content
}

const styles = StyleSheet.create({
  scoreBoard: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingTop: 5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 22,
  },

  score: {
    fontSize: 64,
    fontWeight: '800',
    color: '#000000',
  },
  teamsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 0,
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
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  gameStatus: {
    fontSize: 16,
    textAlign: 'center',
  },
  statusSection: {
    alignItems: 'center',
    minWidth: 100,
  },
  touchable: {
    width: '100%',
  },
})

export default ScoreBoard