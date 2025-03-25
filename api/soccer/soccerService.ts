import { BaseApiService } from '../baseApiService';
import { API_CONFIG } from '../config/api.config';
import { SoccerApiResponse, SoccerGame } from '/Users/atharvsonawane/musen-app/api/soccer/soccerTypes';

class SoccerService extends BaseApiService {
    constructor() {
        super(API_CONFIG.SOCCER.BASE_URL, 'SOCCER');
  }

  async getGames(date: string): Promise<SoccerGame[]> {
    try {
      const currentDate = new Date();
      const centralTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
      const currentHour = centralTime.getHours();
  
      const targetDate = new Date(date);
      const otherDate = new Date(targetDate);
      
      if (currentHour < 19) {
        otherDate.setDate(targetDate.getDate() + 1);
      } else {
        otherDate.setDate(targetDate.getDate() - 1);
      }
  
      const dates = [
        targetDate.toISOString().split('T')[0],
        otherDate.toISOString().split('T')[0]
      ];
  
      const responses = await Promise.all(
        dates.map(date => 
          this.get<SoccerApiResponse<SoccerGame>>('/fixtures', { date })
        )
      );
  
      const allGames = responses.flatMap(response => response.data.response);
  
      const startOfDayCentral = new Date(targetDate);
      startOfDayCentral.setHours(0, 0, 0, 0);
      const endOfDayCentral = new Date(targetDate);
      endOfDayCentral.setHours(23, 59, 59, 999);
  
      return allGames
        .filter(game => {
          const gameDate = new Date(game.fixture.date);
          const gameDateCentral = new Date(gameDate.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
          return gameDateCentral >= startOfDayCentral && gameDateCentral <= endOfDayCentral;
        })
        .sort((a, b) => {
          const dateA = new Date(a.fixture.date);
          const dateB = new Date(b.fixture.date);
          return dateA.getTime() - dateB.getTime();
        });
  
    } catch (error) {
      console.error('Error fetching soccer games:', error);
      throw error;
    }
  }
}

export const soccerService = new SoccerService();