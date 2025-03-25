import { useState, useEffect } from 'react';
import { SoccerGame } from '@/api/soccer/soccerTypes';
import { soccerService } from '@/api/soccer/soccerService';
import { Platform } from 'react-native';

// Define league IDs for filtering
const ALLOWED_LEAGUE_IDS = {
  MLS: 253,                    // Major League Soccer
  NWSL: 254,                   // National Women's Soccer League
  EPL: 39,                     // English Premier League
  LIGA_MX: 262,               // Liga MX
  UEFA_CHAMPIONS: 2,           // UEFA Champions League
  USL_CHAMPIONSHIP: 255,       // USL Championship
  CONCACAF_CHAMPIONS: 17,      // CONCACAF Champions Cup
  CONCACAF_NATIONS: 1073,      // CONCACAF Nations League
  FIFA_WORLD_CUP: 1,          // FIFA World Cup
  FIFA_WOMENS_WORLD_CUP: 9,   // FIFA Women's World Cup
};

export function useSoccerGames(date: string, useFilter: boolean = true) {
  const [games, setGames] = useState<SoccerGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('=== Soccer Games Hook Initialized ===');
    console.log('Platform:', Platform.OS);
    console.log('Date received:', date);
    console.log('UseFilter setting:', useFilter);

    const fetchGames = async () => {
      try {
        console.log('Starting to fetch soccer games...');
        setLoading(true);

        console.log('Calling soccerService.getGames with date:', date);
        const data = await soccerService.getGames(date);
        console.log('Raw API response received:', data);
        console.log('API response length:', data?.length || 0);

        if (!data) {
          console.error('No data received from API');
          throw new Error('No data received from API');
        }

        if (useFilter) {
          console.log('Filtering games...');
          console.log('Allowed league IDs:', Object.values(ALLOWED_LEAGUE_IDS));
          
          const filteredGames = data.filter(game => {
            const leagueMatch = Object.values(ALLOWED_LEAGUE_IDS).includes(game.league.id);
            const worldCupMatch = game.league.name.toLowerCase().includes('world cup');
            const fifaMatch = game.league.name.toLowerCase().includes('fifa');
            
            console.log('Checking game:', {
              leagueId: game.league.id,
              leagueName: game.league.name,
              isAllowedLeague: leagueMatch,
              isWorldCup: worldCupMatch,
              isFifa: fifaMatch
            });

            return leagueMatch || worldCupMatch || fifaMatch;
          });

          console.log('Filtered games result:', filteredGames);
          console.log('Filtered games count:', filteredGames.length);
          setGames(filteredGames);
        } else {
          console.log('Using unfiltered games');
          console.log('Unfiltered games count:', data.length);
          setGames(data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error in fetchGames:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(err instanceof Error ? err : new Error('Failed to fetch games'));
      } finally {
        setLoading(false);
        console.log('Fetch operation completed. Loading state set to false');
      }
    };

    fetchGames();

    return () => {
      console.log('Soccer Games Hook cleanup');
    };
  }, [date, useFilter]);

  // Log state changes
  useEffect(() => {
    console.log('Games state updated:', {
      gamesCount: games.length,
      loadingState: loading,
      errorState: error ? error.message : null
    });
  }, [games, loading, error]);

  return { games, loading, error };
}