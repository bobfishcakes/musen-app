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
    height: Platform.OS === 'ios' ? 60 : 50, // Increased from 47/40 to 60/50
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#486B52', // Changed from #1C1C1E to #486B52
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
    marginTop: 24,
  },
  scoreboardScrollViewContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
  },
  gamesContainer: {
    paddingVertical: 10,
    gap: 8,
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
        contentContainerStyle={{ 
          padding: 16, 
          paddingTop: Platform.OS === 'ios' ? 47 : 40 
        }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Popular</ThemedText>
        </ThemedView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.scoreboardScrollViewContainer}
        >
          <ScoreBoard game={mockNflGames[0]} showControls={false}/>
        </ScrollView>
        
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">NFL</ThemedText>
        </ThemedView>

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

        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">NBA</ThemedText>
        </ThemedView>

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
      </ScrollView>
    </ThemedView>
  );
}