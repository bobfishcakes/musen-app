import { StyleSheet, Platform, ScrollView, FlatList, ActivityIndicator, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import ScoreBoard from '@/components/ScoreBoard';
import { mockNbaGames, mockNflGames } from '../mockData';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import GameCard from '@/components/GameCard';
import { useBasketballGames } from '@/api/basketball/basketballHooks';
import { convertBasketballGame } from '@/api/basketball/basketballTypes';
import { useActiveStream } from '@/hooks/useActiveStream';
import type { Game, Stream } from '@/constants/Interfaces';

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: Platform.select({
      web: 120,
      default: 20,
    }),
  },
  header: {
    height: Platform.OS === 'ios' ? 60 : 80,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#486B52',
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
    backgroundColor: 'rgba(0, 0, 0, 0.00)',
    marginBottom: 8, // Reduced from 16
    padding: 16,
    width: '100%',
  },
  dividerLine: {
    marginHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
  },
  scrollViewContent: {
    paddingTop: Platform.OS === 'ios' ? 65 : 95, // Reduced from 95 : 135
    paddingBottom: 75,
  },
  sectionTitle: {
    marginBottom: 15,
    marginLeft: 12,
    color: 'black',
  },
  scoreboardScrollViewContainer: {
    alignItems: 'center',
    width: '100%',
    paddingLeft: 8,
  },
  gamesContainer: {
    gap: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  webContainer: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: Platform.select({
      web: 850,
      default: undefined,
    }),
  },
  webGamesContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 12,
    marginRight: 12,
  },
  showMoreButton: {
    backgroundColor: '#486B52',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 12,
  },
  showMoreText: {
    color: 'white',
    fontSize: 18,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundSvg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  webHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingLeft: 625,
    gap: 16, // Add space between logo and text
  },
  webLogo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 50,
    color: 'black',
  },
});

const Header = () => {
  const isWeb = Platform.OS === 'web';
  
  return (
    <ThemedView style={styles.header}>
      {isWeb && (
        <View style={styles.webHeaderContent}>
          <Image 
            source={{
              uri: 'https://framerusercontent.com/images/Wsf9gwWc57UJnuivO96aVeTg.png',
            }}
            style={styles.webLogo}
          />
          <ThemedText 
            type="default" 
            style={styles.headerText}
          >
            musen
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
};

export default function HomeScreen() {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  const { games: basketballGames, loading, error } = useBasketballGames(formattedDate);
  const { setActiveStream } = useActiveStream();
  const isWeb = Platform.OS === 'web';
  const [nflExpanded, setNflExpanded] = useState(false);
  const [nbaExpanded, setNbaExpanded] = useState(false);
  
  const nbaGames = basketballGames
    ?.filter(game => {
      if (game.league.name !== "NBA") return false;
      const liveStatuses = ["Q1", "Q2", "Q3", "Q4", "HT", "OT", "NS", "LIVE"];
      return liveStatuses.includes(game.status.short);
    })
    .map(convertBasketballGame) || [];

  const handleGamePress = (game: Game) => {
    const getLastWord = (teamName: string) => {
      return teamName.split(' ').pop() || teamName;
    };

    const newStream: Stream = {
      id: `1`,
      title: `${getLastWord(game.teams.away.name)} vs ${getLastWord(game.teams.home.name)}`,
      streamer: 'bobfishcakes',
      game: game,
      listeners: 1
    };
    setActiveStream(newStream);
    router.push('/stream');
  };

  const renderGameCard = ({ item }: { item: Game }) => (
    <GameCard 
      key={item.id} 
      game={item} 
      onPress={() => handleGamePress(item)}
    />
  );

  const renderContent = () => (
    <ScrollView
      contentContainerStyle={[styles.scrollViewContent, isWeb && styles.webContainer]}
      showsVerticalScrollIndicator={false}
    >
      {/* Popular Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Popular</ThemedText>
        <ScrollView
          horizontal={!isWeb}
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.scoreboardScrollViewContainer}
        >
          <ScoreBoard game={mockNbaGames[0]} onPress={() => handleGamePress(mockNbaGames[0])} />
        </ScrollView>
      </ThemedView>
      <View style={styles.dividerLine} />

      {/* NFL Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>NFL</ThemedText>
        {isWeb ? (
          <>
            <View style={styles.webGamesContainer}>
              {mockNflGames
                .slice(0, nflExpanded ? undefined : 3)
                .map((game) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onPress={() => handleGamePress(game)}
                  />
                ))}
            </View>
            {mockNflGames.length > 3 && (
              <TouchableOpacity 
                style={styles.showMoreButton}
                onPress={() => setNflExpanded(!nflExpanded)}
              >
                <ThemedText style={styles.showMoreText}>
                  {nflExpanded ? 'Show Less' : 'Show More'}
                </ThemedText>
              </TouchableOpacity>
            )}
          </>
        ) : (
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
              renderItem={renderGameCard}
            />
          </ScrollView>
        )}
      </ThemedView>
      <View style={styles.dividerLine} />

      {/* NBA Section */}
      <ThemedView style={styles.section}>
        {loading ? (
          <ActivityIndicator size="large" color="#50775B" />
        ) : error ? (
          <ThemedText>Error loading NBA games</ThemedText>
        ) : (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>NBA</ThemedText>
            {isWeb ? (
              <>
                <View style={styles.webGamesContainer}>
                  {nbaGames
                    .slice(0, nbaExpanded ? undefined : 3)
                    .map((game) => (
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        onPress={() => handleGamePress(game)}
                      />
                    ))}
                </View>
                {nbaGames.length > 3 && (
                  <TouchableOpacity 
                    style={styles.showMoreButton}
                    onPress={() => setNbaExpanded(!nbaExpanded)}
                  >
                    <ThemedText style={styles.showMoreText}>
                      {nbaExpanded ? 'Show Less' : 'Show More'}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </>
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
                  renderItem={renderGameCard}
                />
              </ScrollView>
            )}
          </>
        )}
      </ThemedView>
      <View style={styles.dividerLine} />
    </ScrollView>
  );
  
  return (
    <ThemedView style={styles.container}>
      <Header />
      {renderContent()}
    </ThemedView>
  );
}