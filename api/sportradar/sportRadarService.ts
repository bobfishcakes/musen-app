import axios, { AxiosInstance } from 'axios';
import { SPORTRADAR_CONFIG } from './sportRadarConfig';
import { SportRadarGame, SportRadarApiResponse } from './sportRadarTypes';

class SportRadarService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: SPORTRADAR_CONFIG.BASE_URL,
      timeout: SPORTRADAR_CONFIG.REQUEST_TIMEOUT,
      params: {
        api_key: SPORTRADAR_CONFIG.API_KEY,
      },
    });
  }

  async getGames(date: string): Promise<SportRadarGame[]> {
    try {
      const response = await this.client.get<SportRadarApiResponse<SportRadarGame[]>>(
        `${SPORTRADAR_CONFIG.ENDPOINTS.GAMES}/schedule/${date}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching games from SportRadar:', error);
      throw error;
    }
  }

  async getGameDetails(gameId: string): Promise<SportRadarGame> {
    try {
      const response = await this.client.get<SportRadarApiResponse<SportRadarGame>>(
        SPORTRADAR_CONFIG.ENDPOINTS.GAME_SUMMARY.replace('{gameId}', gameId)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching game details from SportRadar:', error);
      throw error;
    }
  }

  async getGameTimeline(gameId: string): Promise<any> {
    try {
      const response = await this.client.get(
        SPORTRADAR_CONFIG.ENDPOINTS.GAME_TIMELINE.replace('{gameId}', gameId)
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching game timeline from SportRadar:', error);
      throw error;
    }
  }
}

export const sportRadarService = new SportRadarService();