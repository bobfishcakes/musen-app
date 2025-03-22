import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { sportRadarHTTPService } from '/Users/atharvsonawane/musen-app-push-feed/server/src/api/sportRadar/sportRadarHTTPService';

interface GameStatsPanelProps {
  gameId: string;
  homeTeam: {
    name: string;
    primaryColor: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    primaryColor: string;
    logo: string;
  };
}

interface StatLeader {
  full_name: string;
  value: number;
}

interface TeamStats {
  points: StatLeader;
  rebounds: StatLeader;
  assists: StatLeader;
}

export const GameStatsPanel = ({ gameId, homeTeam, awayTeam }: GameStatsPanelProps) => {
  const [stats, setStats] = useState<{home: TeamStats; away: TeamStats} | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await sportRadarHTTPService.getGameDetails(gameId);
        setStats({
          home: {
            points: {
              full_name: data.home.leaders.points.full_name,
              value: data.home.leaders.points.statistics.points
            },
            rebounds: {
              full_name: data.home.leaders.rebounds.full_name,
              value: data.home.leaders.rebounds.statistics.rebounds
            },
            assists: {
              full_name: data.home.leaders.assists.full_name,
              value: data.home.leaders.assists.statistics.assists
            }
          },
          away: {
            points: {
              full_name: data.away.leaders.points.full_name,
              value: data.away.leaders.points.statistics.points
            },
            rebounds: {
              full_name: data.away.leaders.rebounds.full_name,
              value: data.away.leaders.rebounds.statistics.rebounds
            },
            assists: {
              full_name: data.away.leaders.assists.full_name,
              value: data.away.leaders.assists.statistics.assists
            }
          }
        });
      } catch (error) {
        console.error('Error fetching game stats:', error);
      }
    };

    fetchStats();
  }, [gameId]);

  if (!stats) {
    return <ThemedText>Loading stats...</ThemedText>;
  }

  const StatRow = ({ label, home, away }: { label: string; home: StatLeader; away: StatLeader }) => (
    <View style={styles.statRow}>
      <View style={styles.teamStat}>
        <ThemedText style={styles.playerName}>{home.full_name}</ThemedText>
        <ThemedText style={styles.statValue}>{home.value}</ThemedText>
      </View>
      <View style={styles.statLabel}>
        <ThemedText style={styles.label}>{label}</ThemedText>
      </View>
      <View style={styles.teamStat}>
        <ThemedText style={styles.playerName}>{away.full_name}</ThemedText>
        <ThemedText style={styles.statValue}>{away.value}</ThemedText>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.teamHeader}>
          <Image source={{ uri: homeTeam.logo }} style={styles.teamLogo} />
          <ThemedText style={[styles.teamName, { color: homeTeam.primaryColor }]}>
            {homeTeam.name}
          </ThemedText>
        </View>
        <View style={styles.teamHeader}>
          <Image source={{ uri: awayTeam.logo }} style={styles.teamLogo} />
          <ThemedText style={[styles.teamName, { color: awayTeam.primaryColor }]}>
            {awayTeam.name}
          </ThemedText>
        </View>
      </View>

      <StatRow label="POINTS" home={stats.home.points} away={stats.away.points} />
      <StatRow label="REBOUNDS" home={stats.home.rebounds} away={stats.away.rebounds} />
      <StatRow label="ASSISTS" home={stats.home.assists} away={stats.away.assists} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 850,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  teamHeader: {
    alignItems: 'center',
    gap: 8,
  },
  teamLogo: {
    width: 48,
    height: 48,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  teamStat: {
    flex: 2,
    alignItems: 'center',
  },
  statLabel: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  playerName: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#203024',
  },
});