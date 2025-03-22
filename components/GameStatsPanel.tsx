import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import { sportRadarHTTPService } from '/Users/atharvsonawane/musen-app-push-feed/server/src/api/sportRadar/sportRadarHTTPService';

interface StatLeader {
  full_name: string;
  value: number;
}

interface TeamStats {
  points: StatLeader;
  rebounds: StatLeader;
  assists: StatLeader;
}

interface Team {
    name: string;
    colors?: string[];
    primaryColor?: string;
    secondaryColor?: string;
    tertiaryColor?: string;
  }

interface GameStatsPanelProps {
  gameId: string;
  game: {
    teams: {
      home: Team;
      away: Team;
    };
  };
}

export const GameStatsPanel = ({ gameId, game }: GameStatsPanelProps) => {
    const [stats, setStats] = useState<{home: TeamStats; away: TeamStats} | null>(null);
  
    useEffect(() => {
      const fetchStats = async () => {
        try {
          const data = await sportRadarHTTPService.getGameDetails(gameId);
          setStats({
            home: {
              points: {
                full_name: data.home.leaders.points?.[0]?.full_name || 'N/A',
                value: data.home.leaders.points?.[0]?.statistics?.points || 0
              },
              rebounds: {
                full_name: data.home.leaders.rebounds?.[0]?.full_name || 'N/A',
                value: data.home.leaders.rebounds?.[0]?.statistics?.rebounds || 0
              },
              assists: {
                full_name: data.home.leaders.assists?.[0]?.full_name || 'N/A',
                value: data.home.leaders.assists?.[0]?.statistics?.assists || 0
              }
            },
            away: {
              points: {
                full_name: data.away.leaders.points?.[0]?.full_name || 'N/A',
                value: data.away.leaders.points?.[0]?.statistics?.points || 0
              },
              rebounds: {
                full_name: data.away.leaders.rebounds?.[0]?.full_name || 'N/A',
                value: data.away.leaders.rebounds?.[0]?.statistics?.rebounds || 0
              },
              assists: {
                full_name: data.away.leaders.assists?.[0]?.full_name || 'N/A',
                value: data.away.leaders.assists?.[0]?.statistics?.assists || 0
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
        <View style={styles.statHalf}>
          <ThemedText type="defaultSemiBold" style={styles.playerName}>{home.full_name}</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>{home.value}</ThemedText>
        </View>
        <View style={styles.statLabel}>
          <ThemedText type="default" style={styles.label}>{label}</ThemedText>
        </View>
        <View style={styles.statHalf}>
          <ThemedText type="defaultSemiBold" style={styles.playerName}>{away.full_name}</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>{away.value}</ThemedText>
        </View>
      </View>
    );
  
    return (
        <View style={styles.container}>
          <View style={[styles.statsContainer, {
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }]}>
            <View style={[
              styles.backgroundHalf,
              { backgroundColor: game.teams.away.primaryColor || game.teams.away.colors?.[0] || '#000' }
            ]} />
            <View style={[
              styles.backgroundHalf,
              { backgroundColor: game.teams.home.primaryColor || game.teams.home.colors?.[0] || '#CCCCCC' }
            ]} />
            <View style={styles.contentContainer}>
              <StatRow label="POINTS" home={stats.home.points} away={stats.away.points} />
              <StatRow label="REBOUNDS" home={stats.home.rebounds} away={stats.away.rebounds} />
              <StatRow label="ASSISTS" home={stats.home.assists} away={stats.away.assists} />
            </View>
          </View>
        </View>
      );
  };
  
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      ...Platform.select({
        web: {
          maxWidth: 850,
        },
      }),
    },
    statsContainer: {
      position: 'relative',
      borderRadius: 8,
      overflow: 'hidden',
    },
    backgroundHalf: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '50%',
    },
    contentContainer: {
      width: '100%',
      padding: 16,
      zIndex: 1,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    statHalf: {
      flex: 2,
      alignItems: 'center',
    },
    statLabel: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
      paddingVertical: 4,
      borderRadius: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
      },
      playerName: {
        fontSize: 16,
        marginBottom: 4,
        color: '#000000',
      },
      statValue: {
        fontSize: 24,
        color: '#000000',
      },
  });