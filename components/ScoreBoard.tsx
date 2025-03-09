import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { statusMap } from './GameCard'
import { ThemedText } from './ThemedText'
import { LinearGradient } from 'expo-linear-gradient'
import { getTeamColor } from '../app/mockData'
import { Svg, SvgUri } from 'react-native-svg'

type GameType = {
  scores?: {
    home: { total: number }
    away: { total: number }
  }
  status: {
    short: string
  }
  teams: {
    home: { logo: string; name: string; primaryColor?: string }
    away: { logo: string; name: string; primaryColor?: string }
  }
}

interface ScoreBoardProps {
  game: GameType
  showControls?: boolean
}

const ScoreBoard = ({ game, showControls }: ScoreBoardProps) => {
  const homeColor = game.teams.home.primaryColor || getTeamColor(game.teams.home.name)
  const awayColor = game.teams.away.primaryColor || getTeamColor(game.teams.away.name)

  return (
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
</ThemedText>  <View style={styles.statusSection}>
    <ThemedText style={[styles.gameStatus, { color: '#324b39' }]} type="defaultSemiBold">
      {statusMap[game.status.short]}
    </ThemedText>
    {showControls && (
      <View style={styles.controls}>
        <Ionicons name="volume-mute" size={24} color="#203024" />
        <Ionicons name="bluetooth" size={24} color="#203024" />
      </View>
    )}
  </View>
  <ThemedText type="title" style={styles.score}>
  {game.scores?.home.total}
</ThemedText></View>
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
    paddingTop: 5, // Add this line to create more space at the top
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Changed from center to space-between
    gap: 22, // Increased from 12 to 32
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
  controls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  statusSection: {
    alignItems: 'center',
    minWidth: 100,
  },
})

export default ScoreBoard