import { games } from '/Users/atharvsonawane/musen-app/api/sportradar/nbaSchedule.json';
import type { SportRadarGame, GameDetailsResponse } from './sportRadarTypes';

// Interface to match the JSON data structure
interface JsonGame {
  id: string;
  status: string;
  scheduled: string;
  home: {
    name: string;
    alias: string;
    id: string;
    sr_id: string;
    reference: string;
  };
  away: {
    name: string;
    alias: string;
    id: string;
    sr_id: string;
    reference: string;
  };
  venue: {
    id: string;
    name: string;
    capacity: number;
    city: string;
    state: string;
  };
}

class SportRadarService {
  async getGames(date: string): Promise<SportRadarGame[]> {
    try {
      return (games as JsonGame[])
        .filter(game => {
          const gameDate = new Date(game.scheduled).toISOString().split('T')[0];
          return gameDate === date;
        })
        .map(game => ({
          id: game.id,
          status: {
            clock: {
              minutes: 0,
              seconds: 0,
              tenths: 0
            },
            period: 0,
            type: game.status
          },
          scheduled: game.scheduled,
          home: {
            id: game.home.id,
            name: game.home.name,
            alias: game.home.alias,
            market: '' // Add default market if needed
          },
          away: {
            id: game.away.id,
            name: game.away.name,
            alias: game.away.alias,
            market: '' // Add default market if needed
          },
          venue: {
            id: game.venue.id,
            name: game.venue.name,
            capacity: game.venue.capacity,
            city: game.venue.city,
            state: game.venue.state
          }
        }));
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  async findGameByTeamsAndDate(homeTeam: string, awayTeam: string, date: string): Promise<string | null> {
    try {
      const games = await this.getGames(date);
      const game = games.find(g => {
        return (g.home.name.toLowerCase().includes(homeTeam.toLowerCase()) ||
               g.home.alias.toLowerCase().includes(homeTeam.toLowerCase())) &&
               (g.away.name.toLowerCase().includes(awayTeam.toLowerCase()) ||
                g.away.alias.toLowerCase().includes(awayTeam.toLowerCase()));
      });
      
      return game ? game.id : null;
    } catch (error) {
      console.error('Error finding game by teams and date:', error);
      throw error;
    }
  }

  async findGameByTeam(date: string, homeTeam: string): Promise<SportRadarGame | null> {
    try {
      const games = await this.getGames(date);
      const game = games.find(g => 
        g.home.name.toLowerCase().includes(homeTeam.toLowerCase()) ||
        g.home.alias.toLowerCase().includes(homeTeam.toLowerCase())
      );
      return game || null;
    } catch (error) {
      console.error('Error finding game by team:', error);
      throw error;
    }
  }

  async getGameDetails(gameId: string): Promise<GameDetailsResponse> {
    try {
      const game = (games as JsonGame[]).find(g => g.id === gameId);
      
      if (!game) {
        throw new Error('Game not found');
      }
  
      return {
        radarGameId: game.id,
        clock: {
          minutes: 0,
          seconds: 0,
          tenths: 0
        },
        period: 0,
        status: game.status
      };
    } catch (error) {
      console.error('Error getting game details:', error);
      throw error;
    }
  }
}

export const sportRadarHTTPService = new SportRadarService();