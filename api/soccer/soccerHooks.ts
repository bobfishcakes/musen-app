import { useState, useEffect } from 'react';
import { SoccerGame } from '/Users/atharvsonawane/musen-app/api/soccer/soccerTypes';
import { soccerService } from '/Users/atharvsonawane/musen-app/api/soccer/soccerService';

export function useSoccerGames(date: string) {
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
        
        // Filter games by major leagues/competitions
        const majorLeagueGames = data.filter(game => 
          game.league.id === 39 || // Premier League
          game.league.id === 140 || // La Liga
          game.league.id === 78 || // Bundesliga
          game.league.id === 135 || // Serie A
          // World Cup Qualifiers
          game.league.id === 30 || // Asia
          game.league.id === 29 || // Africa
          game.league.id === 32 || // Europe
          game.league.id === 34    // South America
        );
        
        setGames(majorLeagueGames);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch games'));
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [date]);

  return { games, loading, error };
}