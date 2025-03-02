import { Image, StyleSheet, Platform, ScrollView, FlatList } from 'react-native';
import { mockNflGames, mockNbaGames } from '../mockData';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import GameCard from '@/components/GameCard';
import MainScrollView from '@/components/MainScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
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
        <ThemedText type="subtitle">Popular Streams</ThemedText>
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled={true}
        alwaysBounceVertical={false}
      >
        <FlatList
          contentContainerStyle={styles.gamesContainer}
          numColumns={Math.ceil(mockNbaGames.length / 2)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={mockNbaGames}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          renderItem={({ item }) => (
            <GameCard key={item.id} game={item} />
          )}
        />
      </ScrollView>
    </MainScrollView>
  );
}

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
