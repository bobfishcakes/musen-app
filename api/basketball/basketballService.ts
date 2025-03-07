import { BaseApiService } from '../baseApiService';
import { API_CONFIG } from '../config/api.config';
import { BasketballApiResponse, BasketballGame } from './basketballTypes';

class BasketballService extends BaseApiService {
  constructor() {
    super(API_CONFIG.BASKETBALL.BASE_URL);
  }

  async getGames(date: string): Promise<BasketballGame[]> {
    try {
      const response = await this.get<BasketballApiResponse<BasketballGame>>('/games', {
        date,
      });
      
      // Filter for NBA and NCAA games
      return response.data.response.filter(game => 
        game.league.name === "NBA" || game.league.name === "NCAA"
      );
    } catch (error) {
      console.error('Error fetching basketball games:', error);
      throw error;
    }
  }
}

export const basketballService = new BasketballService();