import React from 'react';
import { View, StyleSheet, Platform, StyleProp, TextStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { TeamLeaders } from '../server/src/api/sportRadar/sportRadarTypes';

interface TeamLeadersPanelProps {
  homeTeamLeaders?: TeamLeaders;
  awayTeamLeaders?: TeamLeaders;
  homeTeamName: string;
  awayTeamName: string;
}

const LeaderRow = ({ label, homeStat, awayStat }: { 
    label: string;
    homeStat: { full_name: string; value: number };
    awayStat: { full_name: string; value: number };
  }) => (
    <View style={styles.leaderRow}>
      <View style={styles.teamStat}>
        <ThemedText style={styles.playerName as StyleProp<TextStyle>}>
          {homeStat.full_name}
        </ThemedText>
        <ThemedText style={styles.statValue as StyleProp<TextStyle>}>
          {homeStat.value}
        </ThemedText>
      </View>
      <ThemedText style={styles.statLabel as StyleProp<TextStyle>}>
        {label}
      </ThemedText>
      <View style={styles.teamStat}>
        <ThemedText style={styles.playerName as StyleProp<TextStyle>}>
          {awayStat.full_name}
        </ThemedText>
        <ThemedText style={styles.statValue as StyleProp<TextStyle>}>
          {awayStat.value}
        </ThemedText>
      </View>
    </View>
  );

export const TeamLeadersPanel = ({ 
  homeTeamLeaders, 
  awayTeamLeaders,
  homeTeamName,
  awayTeamName
}: TeamLeadersPanelProps) => {
  if (!homeTeamLeaders || !awayTeamLeaders) {
    return <ThemedText>Loading team leaders...</ThemedText>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.teamName}>{homeTeamName}</ThemedText>
        <ThemedText style={styles.teamName}>{awayTeamName}</ThemedText>
      </View>
      
      <LeaderRow 
        label="POINTS"
        homeStat={{
          full_name: homeTeamLeaders.points.full_name,
          value: homeTeamLeaders.points.statistics.points
        }}
        awayStat={{
          full_name: awayTeamLeaders.points.full_name,
          value: awayTeamLeaders.points.statistics.points
        }}
      />
      
      <LeaderRow 
        label="REBOUNDS"
        homeStat={{
          full_name: homeTeamLeaders.rebounds.full_name,
          value: homeTeamLeaders.rebounds.statistics.rebounds
        }}
        awayStat={{
          full_name: awayTeamLeaders.rebounds.full_name,
          value: awayTeamLeaders.rebounds.statistics.rebounds
        }}
      />
      
      <LeaderRow 
        label="ASSISTS"
        homeStat={{
          full_name: homeTeamLeaders.assists.full_name,
          value: homeTeamLeaders.assists.statistics.assists
        }}
        awayStat={{
          full_name: awayTeamLeaders.assists.full_name,
          value: awayTeamLeaders.assists.statistics.assists
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        ...(Platform.OS === 'web' ? {
            maxWidth: 800,
            marginLeft: 'auto',
            marginRight: 'auto',
        } : {}),
        },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#324b39',
  },
  leaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamStat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    flex: 0.5,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  playerName: {
    fontSize: 16,
    color: '#324b39',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#324b39',
    marginTop: 4,
  },
});