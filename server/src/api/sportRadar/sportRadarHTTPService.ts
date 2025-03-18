// server/src/api/sportRadar/sportRadarHTTPService.ts
import axios from 'axios';
import { GameDetailsResponse } from './sportRadarTypes';
import { SPORTRADAR_CONFIG } from './sportRadarConfig';

export class SportRadarHTTPService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3000', // Your backend server
      timeout: 30000
    });
  }
  
  async getGameDetails(gameId: string): Promise<GameDetailsResponse> {
    try {
      const response = await this.client.get(`/api/games/details/${gameId}`);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  }
}

export const sportRadarHTTPService = new SportRadarHTTPService();