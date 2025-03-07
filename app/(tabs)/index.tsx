import { Image, StyleSheet, Platform, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { mockNflGames } from '../mockData';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import GameCard from '@/components/GameCard';
import MainScrollView from '@/components/MainScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useBasketballGames } from '/Users/atharvsonawane/musen-app/api/basketball/basketballHooks';
import { convertBasketballGame } from '/Users/atharvsonawane/musen-app/api/basketball/basketballTypes';
import { format, addDays } from 'date-fns';

export default function HomeScreen() {

  // Get current date in user's timezone
  const now = new Date();
  
  // Format date as YYYY-MM-DD
  const formattedDate = now.toISOString().split('T')[0];

  const { games: basketballGames, loading, error } = useBasketballGames(formattedDate);
  
  // Filter for NBA games with more permissive status checks
  const nbaGames = basketballGames
    ?.filter(game => {
      // First check if it's an NBA game
      if (game.league.name !== "NBA") return false;
      
      // Include games with these statuses
      const liveStatuses = ["Q1", "Q2", "Q3", "Q4", "HT", "OT", "NS", "LIVE"];
      return liveStatuses.includes(game.status.short);
    })
    .map(convertBasketballGame) || [];

  console.log(basketballGames)

  return (
    <MainScrollView
      headerBackgroundColor={{ light: '#3A5241', dark: '#3A5241' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#50775B"
          name="radio"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Live Now</ThemedText>
      </ThemedView>
      
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
    </MainScrollView>
  );
}

// Styles remain the same

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  logo: {
    height: 178,
    width: 290,
    bottom: 20,
    left: 50,
    position: 'absolute',
  },
  gamesContainer: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    gap: 8,
  },
});
