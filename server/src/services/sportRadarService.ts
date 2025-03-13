import axios, { AxiosInstance } from 'axios';
import { SPORTRADAR_CONFIG } from '/Users/atharvsonawane/musen-app-sync/server/src/config/sportRadarConfig';
import { SportRadarGame, SportRadarApiResponse } from '../api/sportRadar/sportRadarTypes';

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
      // Ensure date is in YYYY-MM-DD format
      const response = await this.client.get<SportRadarApiResponse<SportRadarGame[]>>(
        `/nba/trial/v7/en/games/${date}/schedule.json`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching games from SportRadar:', error);
      throw error;
    }
  }

  async getGameDetails(gameId: string) {
    try {
      console.log('Requesting game details for gameId:', gameId);
      const url = `/api/games/details/${gameId}`; // Updated URL format
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  }

  async getGameTimeline(gameId: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/nba/trial/v7/en/games/${gameId}/timeline.json`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching game timeline from SportRadar:', error);
      throw error;
    }
  }
}

export const sportRadarService = new SportRadarService();