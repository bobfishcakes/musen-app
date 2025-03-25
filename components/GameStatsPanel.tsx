import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import { sportRadarHTTPService } from '@/server/src/api/sportRadar/sportRadarHTTPService';
import { mockNFLStats } from '@/app/mockData';

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
}

interface GameStatsPanelProps {
  gameId: string;
  game: {
    teams: {
      home: Team;
      away: Team;
    };
    league: {
      name: string;
      alias: string;
    };
  };
  outerRowOpacity?: number;
  middleRowOpacity?: number;
}

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
  rowWrapper: {
    width: '100%',
    position: 'relative',
  },
  rowBackground: {
    position: 'absolute',
    left: -16,
    right: -16,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    minHeight: 60,
  },
  topRowStyle: {
    paddingBottom: 8,
  },
  middleRowStyle: {
    paddingVertical: 12,
  },
  bottomRowStyle: {
    paddingTop: 8,
  },
  statHalf: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  statLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, .3)',
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 8,
    minHeight: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
  },
  playerName: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  statValue: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 28,
  },
});

export const GameStatsPanel = ({
  gameId,
  game,
  outerRowOpacity = 0.0,
  middleRowOpacity = 0.35,
}: GameStatsPanelProps) => {
  const [stats, setStats] = useState<{home: TeamStats; away: TeamStats} | null>(null);

  const formatStatLabel = (label: string, league: string) => {
    if (league === 'NFL') {
      switch (label) {
        case 'POINTS': return 'POINTS LEADER';
        case 'REBOUNDS': return 'RUSH YDS LEADER';
        case 'ASSISTS': return 'PASS YDS LEADER';
        default: return `${label} LEADER`;
      }
    }
    return `${label} LEADER`;
  };

  const StatRow: React.FC<{
    label: string;
    home: StatLeader;
    away: StatLeader;
    league: string;
    isMiddleRow?: boolean;
    isLastRow?: boolean;
    isFirstRow?: boolean;
    opacity: number;
  }> = ({
    label,
    home,
    away,
    league,
    isMiddleRow = false,
    isLastRow = false,
    isFirstRow = false,
    opacity,
  }) => (
    <View style={styles.rowWrapper}>
      <View style={[styles.rowBackground, { opacity }]} />
      <View style={[
        styles.statRow,
        isFirstRow && styles.topRowStyle,
        isMiddleRow && styles.middleRowStyle,
        isLastRow && styles.bottomRowStyle,
      ]}>
        <View style={styles.statHalf}>
          <ThemedText type="default" style={styles.playerName}>
            {home.full_name}
          </ThemedText>
          <ThemedText type="default" style={styles.statValue}>
            {home.value}
          </ThemedText>
        </View>
        <View style={styles.statLabel}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            {formatStatLabel(label, league)}
          </ThemedText>
        </View>
        <View style={styles.statHalf}>
          <ThemedText type="default" style={styles.playerName}>
            {away.full_name}
          </ThemedText>
          <ThemedText type="default" style={styles.statValue}>
            {away.value}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!game?.league) {
          console.error('Game or league object is undefined');
          return;
        }

        if (game.league.name === 'NFL') {
          const mockData = mockNFLStats[gameId];
          if (mockData) {
            setStats({
              home: {
                points: {
                  full_name: mockData.home.leaders.points[0].full_name,
                  value: mockData.home.leaders.points[0].statistics.points
                },
                rebounds: {
                  full_name: mockData.home.leaders.rebounds[0].full_name,
                  value: mockData.home.leaders.rebounds[0].statistics.rebounds
                },
                assists: {
                  full_name: mockData.home.leaders.assists[0].full_name,
                  value: mockData.home.leaders.assists[0].statistics.assists
                }
              },
              away: {
                points: {
                  full_name: mockData.away.leaders.points[0].full_name,
                  value: mockData.away.leaders.points[0].statistics.points
                },
                rebounds: {
                  full_name: mockData.away.leaders.rebounds[0].full_name,
                  value: mockData.away.leaders.rebounds[0].statistics.rebounds
                },
                assists: {
                  full_name: mockData.away.leaders.assists[0].full_name,
                  value: mockData.away.leaders.assists[0].statistics.assists
                }
              }
            });
          }
        } else {
          const data = await sportRadarHTTPService.getGameDetails(gameId);
          setStats({
            home: {
              points: {
                full_name: data.home?.leaders?.points?.[0]?.full_name || 'N/A',
                value: data.home?.leaders?.points?.[0]?.statistics?.points || 0
              },
              rebounds: {
                full_name: data.home?.leaders?.rebounds?.[0]?.full_name || 'N/A',
                value: data.home?.leaders?.rebounds?.[0]?.statistics?.rebounds || 0
              },
              assists: {
                full_name: data.home?.leaders?.assists?.[0]?.full_name || 'N/A',
                value: data.home?.leaders?.assists?.[0]?.statistics?.assists || 0
              }
            },
            away: {
              points: {
                full_name: data.away?.leaders?.points?.[0]?.full_name || 'N/A',
                value: data.away?.leaders?.points?.[0]?.statistics?.points || 0
              },
              rebounds: {
                full_name: data.away?.leaders?.rebounds?.[0]?.full_name || 'N/A',
                value: data.away?.leaders?.rebounds?.[0]?.statistics?.rebounds || 0
              },
              assists: {
                full_name: data.away?.leaders?.assists?.[0]?.full_name || 'N/A',
                value: data.away?.leaders?.assists?.[0]?.statistics?.assists || 0
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching game stats:', error);
      }
    };

    if (gameId && game?.league) {
      fetchStats();
    }
  
    // Set up polling every 30 seconds
    const statsInterval = setInterval(() => {
      if (gameId && game?.league) {
        fetchStats();
      }
    }, 30000);  // 30 seconds
  
    return () => clearInterval(statsInterval);
  }, [gameId, game]);

  if (!stats) {
    return <ThemedText type="default">Loading stats...</ThemedText>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.statsContainer, { flexDirection: 'row' }]}>
        <View style={[
          styles.backgroundHalf,
          {
            left: 0,
            backgroundColor: game.teams.home.primaryColor || game.teams.home.colors?.[0] || '#CCCCCC',
            opacity: 0.3
          }
        ]} />
        <View style={[
          styles.backgroundHalf,
          {
            right: 0,
            backgroundColor: game.teams.away.primaryColor || game.teams.away.colors?.[0] || '#000000',
            opacity: 0.3
          }
        ]} />
        <View style={styles.contentContainer}>
          <StatRow
            label="POINTS"
            home={stats.home.points}
            away={stats.away.points}
            league={game.league.name}
            isFirstRow={true}
            opacity={outerRowOpacity}
          />
          <StatRow
            label="REBOUNDS"
            home={stats.home.rebounds}
            away={stats.away.rebounds}
            league={game.league.name}
            isMiddleRow={true}
            opacity={middleRowOpacity}
          />
          <StatRow
            label="ASSISTS"
            home={stats.home.assists}
            away={stats.away.assists}
            league={game.league.name}
            isLastRow={true}
            opacity={outerRowOpacity}
          />
        </View>
      </View>
    </View>
  );
};