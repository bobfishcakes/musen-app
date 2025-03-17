import nbaSchedule from '/Users/atharvsonawane/musen-app/api/sportradar/nbaSchedule.json';
import { SportRadarGame } from './sportRadarTypes';

// Define interface matching the JSON structure
interface JsonGame {
  id: string;
  status: string;
  scheduled: string;
  home: {
    name: string;
    alias: string;
  };
  away: {
    name: string;
    alias: string;
  };
}

interface NBASchedule {
  games: JsonGame[];
}

export class SportRadarLocalService {
  async findGameByTeamsAndDate(homeTeam: string, awayTeam: string, date: string): Promise<string | null> {
    try {
      // Cast the imported JSON to match our interface
      const schedule = nbaSchedule as NBASchedule;
      
      // Filter games for the specified date
      const gamesOnDate = schedule.games.filter(game => 
        game.scheduled.startsWith(date)
      );

      // Find game matching both teams
      const game = gamesOnDate.find(game => {
        const homeMatch = game.home.name.toLowerCase().includes(homeTeam.toLowerCase()) ||
                         game.home.alias.toLowerCase().includes(homeTeam.toLowerCase());
        const awayMatch = game.away.name.toLowerCase().includes(awayTeam.toLowerCase()) ||
                         game.away.alias.toLowerCase().includes(awayTeam.toLowerCase());
        return homeMatch && awayMatch;
      });

      return game ? game.id : null;
    } catch (error) {
      console.error('Error finding game:', error);
      throw error;
    }
  }
}

export const sportRadarLocalService = new SportRadarLocalService();