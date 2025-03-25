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
import { Header } from '@/components/Header';
import { sportRadarHTTPService } from '@/server/src/api/sportRadar/sportRadarHTTPService';
import { sportRadarLocalService } from '@/server/src/api/sportRadar/sportRadarLocalService';
import { sportRadarPushService } from '@/server/src/api/sportRadar/sportRadarPushService';
import { useSoccerGames } from '@/api/soccer/soccerHooks';
import { convertSoccerGame } from '@/api/soccer/soccerTypes';

const BACKEND_URL = 'http://localhost:3000';

const getLastWord = (str: string) => {
  return str.split(' ').pop() || str;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Add this line
  },
  section: {
    backgroundColor: 'rgba(0, 0, 0, 0.00)',
    marginBottom: 8,
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
    paddingTop: Platform.select({
      web: 60,
      ios: 65,
      default: 95,
    }),
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
    paddingLeft: Platform.OS === 'ios' ? 0 : 12,
    paddingRight: Platform.OS === 'ios' ? 0 : 12,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  showMoreButton: {
    backgroundColor: '#486B52',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'center',
  },
  showMoreText: {
    color: 'white',
    fontSize: 18,
  },
  webLogo: {
    width: 130, // Increased from 70
    height: 130, // Increased from 70
    resizeMode: 'contain',
  },
  
  headerText: {
    fontSize: 100, // Increased from 50
    color: 'black',
    fontWeight: '700', // Changed from '500' to '700' for bolder text
    lineHeight: 100, // Add this to control vertical spacing
  },
  
  logoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 32,
    marginTop: 16,
  },
    // Add to your existing styles:
  taglineText: {
    fontSize: 24,
    color: '#000',
    marginTop: 8, // Change from -10 to positive value
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center', // Add this
  },
  viewToggleButton: {
    position: 'absolute',
    right: 16, // Position on right side
    top: Platform.select({
      web: 12,
      ios: 12,
      default: 24,
    }),
    backgroundColor: '#486B52',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
    width: 40, // Fixed width for circular button
    height: 40, // Fixed height for circular button
  },

});

export default function HomeScreen() {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  const isWeb = Platform.OS === 'web';
  
  // Group all useState declarations together at the top
  const [nflExpanded, setNflExpanded] = useState(false);
  const [nbaExpanded, setNbaExpanded] = useState(false);
  const [soccerExpanded, setSoccerExpanded] = useState(false);
  const [useSoccerFilter, setUseSoccerFilter] = useState(false); // toggle to major leagues by changing to true

  // Then use the hooks that depend on state
  const { games: basketballGames, loading: basketballLoading, error: basketballError } = useBasketballGames(formattedDate);
  const { games: soccerGames, loading: soccerLoading, error: soccerError } = useSoccerGames(formattedDate, useSoccerFilter);
  const { setActiveStream } = useActiveStream();

  // Rest of your component code...
  
  const nbaGames = basketballGames
    ?.filter(game => {
      if (game.league.name !== "NBA") return false;
      const liveStatuses = ["Q1", "Q2", "Q3", "Q4", "HT", "OT", "NS", "LIVE"];
      return liveStatuses.includes(game.status.short);
    })
    .map(convertBasketballGame) || [];

    const soccerGamesDisplay = soccerGames
    ?.map(game => {
      console.log('Converting game:', game);
      const converted = convertSoccerGame(game);
      console.log('Converted game:', converted);
      return converted;
    }) || [];
  
  console.log('Final soccer games:', soccerGamesDisplay);

    const handleGamePress = async (game: Game) => {
      try {
        console.log('=== Starting handleGamePress ===');
        console.log('Initial game object:', JSON.stringify(game, null, 2));
    
        // Check if it's an NFL game
        if (game.league.name === 'NFL' || game.league.alias === 'NFL') {
          // For NFL games, create stream without SportRadar integration
          const newStream: Stream = {
            id: `1`,
            title: `${getLastWord(game.teams.away.name)} vs ${getLastWord(game.teams.home.name)}`,
            streamer: 'bobfishcakes',
            game: {
              ...game,
              radarGameId: game.id, // Use game.id as fallback
              period: 1,
              minutes: 15,
              seconds: 0,
              isRunning: true
            },
            listeners: 1
          };
    
          console.log('Created new NFL stream object:', JSON.stringify(newStream, null, 2));
          setActiveStream(newStream);
          router.push('/stream');
          return;
        }
    
        // Original NBA game handling
        if (!game.date) {
          console.warn('Game press failed: No date available');
          throw new Error('Game date is undefined');
        }
    
        const gameDate = new Date(game.date).toISOString().split('T')[0];
        console.log('Formatted game date:', gameDate);
    
        const sportRadarGameId = await sportRadarLocalService.findGameByTeamsAndDate(
          game.teams.home.name,
          game.teams.away.name,
          gameDate
        );
    
        if (!sportRadarGameId) {
          console.warn('SportRadar game ID not found');
          return;
        }
    
        console.log('Found SportRadar game ID:', sportRadarGameId);
        
        sportRadarPushService.subscribeToGame(sportRadarGameId);
        console.log('Successfully subscribed to push feed');
    
        const gameDetails = await sportRadarHTTPService.getGameDetails(sportRadarGameId);
        console.log('Game details structure:', {
          clock: gameDetails.clock,
          period: gameDetails.quarter,
          status: gameDetails.status,
          scores: {
            home: gameDetails.home?.points,
            away: gameDetails.away?.points
          }
        });
    
        const newStream: Stream = {
          id: `1`,
          title: `${getLastWord(game.teams.away.name)} vs ${getLastWord(game.teams.home.name)}`,
          streamer: 'bobfishcakes',
          game: {
            ...game,
            radarGameId: sportRadarGameId,
            period: gameDetails.quarter || 1,
            minutes: parseInt((gameDetails.clock || "0:00").split(':')[0]) || 0,
            seconds: parseInt((gameDetails.clock || "0:00").split(':')[1]) || 0,
            isRunning: gameDetails.status === "inprogress"
          },
          listeners: 1
        };
    
        console.log('Created new stream object:', JSON.stringify(newStream, null, 2));
        setActiveStream(newStream);
        console.log('Active stream set successfully');
    
        router.push('/stream');
        console.log('=== Completed handleGamePress ===');
    
      } catch (error: any) {
        console.error('Error in handleGamePress:', error);
        console.error('Error stack:', error?.stack);
      }
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
        {/* Logo Section */}
        {isWeb && (
          <View style={styles.logoContent}>
            <Image 
              source={{
                uri: 'https://framerusercontent.com/images/Wsf9gwWc57UJnuivO96aVeTg.png',
              }}
              style={styles.webLogo}
            />
            <View style={styles.textContainer}>
              <ThemedText 
                type="default" 
                style={styles.headerText}
              >
                musen
              </ThemedText>
              <ThemedText 
                type="default" 
                style={styles.taglineText}
              >
                Tune into what really matters
              </ThemedText>
            </View>
          </View>
        )}
        
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
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.showMoreButton}
                    onPress={() => setNflExpanded(!nflExpanded)}
                  >
                    <ThemedText style={styles.showMoreText}>
                      {nflExpanded ? 'Show Less' : 'Show More'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
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
          {basketballLoading ? (
            <ActivityIndicator size="large" color="#50775B" />
          ) : basketballError ? (
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
    
{/* Soccer Section */}
<ThemedView style={styles.section}>
  {soccerLoading ? (
    <ActivityIndicator size="large" color="#50775B" />
  ) : soccerError ? (
    <ThemedText>Error loading soccer games</ThemedText>
  ) : (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Soccer</ThemedText>
      </View>
      
      {isWeb ? (
        <View style={styles.webGamesContainer}>
          {soccerGamesDisplay.length > 0 ? (
            soccerGamesDisplay.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPress={() => handleGamePress(game)}
              />
            ))
          ) : (
            <ThemedText style={{ textAlign: 'center', padding: 20 }}>
              No {useSoccerFilter ? 'major league ' : ''}games available
            </ThemedText>
          )}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
        >
          {soccerGamesDisplay.length > 0 ? (
            <FlatList
              contentContainerStyle={styles.gamesContainer}
              numColumns={Math.ceil(soccerGamesDisplay.length / 2)}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={soccerGamesDisplay}
              directionalLockEnabled={true}
              alwaysBounceVertical={false}
              renderItem={renderGameCard}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <ThemedText style={{ textAlign: 'center', padding: 20 }}>
              No {useSoccerFilter ? 'major league ' : ''}games available
            </ThemedText>
          )}
        </ScrollView>
      )}
    </>
  )}
</ThemedView>
        <View style={styles.dividerLine} />
      </ScrollView>
    );

    return (
      <View style={styles.container}>
        <Header />
        {renderContent()}
      </View>
    );
    
  }