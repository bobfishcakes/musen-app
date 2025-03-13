import axios from 'axios';
import { BACKEND_CONFIG } from '../config/backend.config';
import type { SportRadarGame } from './sportRadarTypes';

class SportRadarService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: BACKEND_CONFIG.BASE_URL
    });
  }

  async getGames(date: string): Promise<SportRadarGame[]> {
    try {
      const response = await this.client.get(`${BACKEND_CONFIG.ENDPOINTS.GAMES}/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
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

  async getGameDetails(gameId: string): Promise<SportRadarGame> {
    try {
      const response = await this.client.get(`${BACKEND_CONFIG.ENDPOINTS.GAME_DETAILS}/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  }
}

export const sportRadarService = new SportRadarService();