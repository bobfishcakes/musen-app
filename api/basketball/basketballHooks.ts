import { useState, useEffect } from 'react';
import { BasketballGame } from './basketballTypes';
import { basketballService } from './basketballService';

export function useBasketballGames(date: string) {
  const [games, setGames] = useState<BasketballGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await basketballService.getGames(date);
        
        // Separate NBA and NCAA games
        const nbaGames = data.filter(game => game.league.name === "NBA");
        const ncaaGames = data.filter(game => game.league.name === "NCAA");
        
        setGames(data);
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