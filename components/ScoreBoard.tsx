import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { statusMap } from './GameCard'
import { ThemedText } from './ThemedText'
import { LinearGradient } from 'expo-linear-gradient'
import { getTeamColor } from '../app/mockData'
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
        colors={[homeColor, awayColor]} // Flipped colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.teamsContainer}>
        <View style={styles.teamSection}>
          <View style={styles.scoreContainer}>
            <ThemedText type="title" style={styles.score}>
              {game.scores?.home.total}
            </ThemedText>
          </View>
          <Image
            source={{ uri: game.teams.home.logo }}
            style={styles.teamLogo}
          />
          <ThemedText type="default" style={styles.teamName}>
            {game.teams.home.name}
          </ThemedText>
        </View>

        <View style={styles.centerSection}>
          <View style={styles.scoreStatusContainer}>
            <ThemedText type="defaultSemiBold" style={styles.gameStatus}>
              {statusMap[game.status.short]}
            </ThemedText>
          </View>
        </View>

        <View style={styles.teamSection}>
          <View style={styles.scoreContainer}>
            <ThemedText type="title" style={styles.score}>
              {game.scores?.away.total}
            </ThemedText>
          </View>
          <Image
            source={{ uri: game.teams.away.logo }}
            style={styles.teamLogo}
          />
          <ThemedText type="default" style={styles.teamName}>
            {game.teams.away.name}
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
    borderRadius: 11,
    padding: 14,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    overflow: 'hidden',
    width: Platform.OS === 'web' ? '100%' : '100%', // Changed from fixed 749px to 100%
    ...(Platform.OS === 'web' && {
      height: 280,
      position: 'relative'
    })
  },
  teamsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Platform.OS === 'web' ? 28 : 20, // Reduced from 40
    ...(Platform.OS === 'web' && {
      marginTop: 28 // Reduced from 40
    })
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
    gap: Platform.OS === 'web' ? 22 : 8, // Reduced from 32
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      position: 'absolute',
      top: 14, // Reduced from 20
      left: 0,
      right: 0
    })
  },
  scoreStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'web' ? -11 : 15, // Reduced from -15
  },
  scoreContainer: {
    height: Platform.OS === 'web' ? 28 : 70, // Reduced from 40
    justifyContent: 'center',
  },
  teamLogo: {
    width: Platform.select({
      web: 77, // Reduced from 110
      default: 60
    }),
    height: Platform.select({
      web: 77, // Reduced from 110
      default: 60
    }),
    resizeMode: 'contain',
    marginTop: Platform.OS == 'web' ? 32 : 0, // Reduced from 45
  },
  score: {
    color: '#000000',
  },
  teamName: {
    color: '#000000',
    textAlign: 'center',
  },
gameStatus: {
  color: '#324b39',
  textAlign: 'center',
  fontSize: 18, // Add this to match GameCard's default font size
},
  touchable: {
    width: '100%',
  },
})

export default ScoreBoard