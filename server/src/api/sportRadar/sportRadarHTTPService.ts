// server/src/api/sportRadar/sportRadarHTTPService.ts
import axios from 'axios';
import { GameDetailsResponse } from './sportRadarTypes';
import { SPORTRADAR_CONFIG } from './sportRadarConfig';

export class SportRadarHTTPService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 30000  // Increase timeout to 30 seconds
    });
  }

  async getGameDetails(gameId: string): Promise<GameDetailsResponse> {
    try {
      console.log(`Fetching game details for ID: ${gameId}`);
      const response = await this.client.get(`/api/games/details/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  }
}

export const sportRadarHTTPService = new SportRadarHTTPService();