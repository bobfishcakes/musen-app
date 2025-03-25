import { useState, useEffect } from 'react';
import { SoccerGame } from '@/api/soccer/soccerTypes';
import { soccerService } from '@/api/soccer/soccerService';

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
    const fetchGames = async () => {
      console.log('Fetching soccer games for date:', date);
      try {
        setLoading(true);
        const data = await soccerService.getGames(date);
        console.log('Soccer API response:', data);
        
        if (useFilter) {
          // Filter games by allowed leagues
          const filteredGames = data.filter(game => 
            Object.values(ALLOWED_LEAGUE_IDS).includes(game.league.id) ||
            // Additional check for World Cup related events
            game.league.name.toLowerCase().includes('world cup') ||
            game.league.name.toLowerCase().includes('fifa')
          );
          console.log('Filtered games:', filteredGames);
          setGames(filteredGames);
        } else {
          // Use all games without filtering
          console.log('Using unfiltered games:', data);
          setGames(data);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch games'));
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [date, useFilter]);

  return { games, loading, error };
}