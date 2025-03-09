import { StyleSheet, Platform, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import ScoreBoard from '@/components/ScoreBoard';
import { mockNflGames } from '../mockData';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import GameCard from '@/components/GameCard';
import { useBasketballGames } from '@/api/basketball/basketballHooks';
import { convertBasketballGame } from '@/api/basketball/basketballTypes';

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 60 : 50,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#324b39',
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  section: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    marginBottom: 16,
    padding: 16,
    width: '100%',
  },

  scrollViewContent: {
    paddingTop: Platform.OS === 'ios' ? 75 : 60, // Padding to show more background
  },
  
  // Add these new styles
  sectionTitle: {
    marginBottom: 10, // More space between title and content
    marginLeft: 12, // Align with cards
  },
  
  scoreboardScrollViewContainer: {
    alignItems: 'center',
    width: '100%',
    paddingLeft: 8, // Match the title alignment
  },
  
  gamesContainer: {
    gap: 8,
    paddingLeft: 8, // Match the title alignment
  },
});

const Header = () => {
  return (
    <ThemedView style={styles.header} />
  );
};

export default function HomeScreen() {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  const { games: basketballGames, loading, error } = useBasketballGames(formattedDate);
  
  const nbaGames = basketballGames
    ?.filter(game => {
      if (game.league.name !== "NBA") return false;
      const liveStatuses = ["Q1", "Q2", "Q3", "Q4", "HT", "OT", "NS", "LIVE"];
      return liveStatuses.includes(game.status.short);
    })
    .map(convertBasketballGame) || [];

    return (
      <ThemedView style={styles.container}>
        <Header />
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Popular Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Popular</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              directionalLockEnabled={true}
              alwaysBounceVertical={false}
              contentContainerStyle={styles.scoreboardScrollViewContainer}
            >
              <ScoreBoard game={mockNflGames[2]} showControls={false}/>
            </ScrollView>
          </ThemedView>
    
          {/* NFL Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>NFL</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              directionalLockEnabled={true}
              alwaysBounceVertical={false}
            >
              <FlatList
                contentContainerStyle={styles.gamesContainer}
                numColumns={Math.ceil(mockNflGames.length / 2)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={mockNflGames}
                directionalLockEnabled={true}
                alwaysBounceVertical={false}
                renderItem={({ item }) => (
                  <GameCard key={item.id} game={item} />
                )}
              />
            </ScrollView>
          </ThemedView>
    
          {/* NBA Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>NBA</ThemedText>
            {loading ? (
              <ActivityIndicator size="large" color="#50775B" />
            ) : error ? (
              <ThemedText>Error loading NBA games</ThemedText>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                directionalLockEnabled={true}
                alwaysBounceVertical={false}
              >
                <FlatList
                  contentContainerStyle={styles.gamesContainer}
                  numColumns={Math.ceil(nbaGames.length / 2)}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={nbaGames}
                  directionalLockEnabled={true}
                  alwaysBounceVertical={false}
                  renderItem={({ item }) => (
                    <GameCard key={item.id} game={item} />
                  )}
                />
              </ScrollView>
            )}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    );
  }