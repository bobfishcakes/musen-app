import { BaseApiService } from '../baseApiService';
import { API_CONFIG } from '../config/api.config';
import { BasketballApiResponse, BasketballGame } from './basketballTypes';

class BasketballService extends BaseApiService {
  constructor() {
    super(API_CONFIG.BASKETBALL.BASE_URL);
  }

  async getGames(date: string): Promise<BasketballGame[]> {
    try {
      // Get current time in Central Time
      const currentDate = new Date();
      const centralTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
      const currentHour = centralTime.getHours();
  
      // Determine which dates to query based on current time
      const targetDate = new Date(date);
      const otherDate = new Date(targetDate);
      
      if (currentHour < 19) { // Before 7 PM
        // Query today and tomorrow
        otherDate.setDate(targetDate.getDate() + 1);
      } else { // After 7 PM
        // Query today and yesterday
        otherDate.setDate(targetDate.getDate() - 1);
      }
  
      // Format dates for API calls
      const dates = [
        targetDate.toISOString().split('T')[0],
        otherDate.toISOString().split('T')[0]
      ];
  
      // Make parallel requests for both dates
      const responses = await Promise.all(
        dates.map(date => 
          this.get<BasketballApiResponse<BasketballGame>>('/games', { date })
        )
      );
  
      // Combine all games from both responses
      const allGames = responses.flatMap(response => response.data.response);
  
      // Create Central Time boundaries for the target date
      const startOfDayCentral = new Date(targetDate);
      startOfDayCentral.setHours(0, 0, 0, 0);
      const endOfDayCentral = new Date(targetDate);
      endOfDayCentral.setHours(23, 59, 59, 999);
  
      // Filter and sort games
      return allGames
        .filter(game => {
          const gameDate = new Date(game.date);
          const gameDateCentral = new Date(gameDate.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
          
          return (
            (gameDateCentral >= startOfDayCentral && gameDateCentral <= endOfDayCentral) &&
            (game.league.name === "NBA" || game.league.name === "NCAA")
          );
        })
        .sort((a, b) => {
          // Convert both game times to Date objects for comparison
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
  
    } catch (error) {
      console.error('Error fetching basketball games:', error);
      throw error;
    }
  }
}

export const basketballService = new BasketballService();