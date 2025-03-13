import axios, { AxiosInstance } from 'axios';
import { SportRadarGame, SportRadarApiResponse } from '../api/sportRadar/sportRadarTypes';

class SportRadarService {
  private client: AxiosInstance;

  constructor() {
    // Point to your backend server instead of SportRadar directly
    this.client = axios.create({
      baseURL: 'http://localhost:3000', // Replace with your backend server port
      timeout: 10000,
    });
  }

  async getGames(date: string): Promise<SportRadarGame[]> {
    try {
      const response = await this.client.get<SportRadarApiResponse<SportRadarGame[]>>(
        `/api/games/${date}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  async getGameDetails(gameId: string): Promise<SportRadarGame> {
    try {
      console.log('Requesting game details for gameId:', gameId);
      const response = await this.client.get(`/api/games/details/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  }

  async getGameTimeline(gameId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/games/${gameId}/timeline`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game timeline:', error);
      throw error;
    }
  }

  async findGameByTeamsAndDate(homeTeam: string, awayTeam: string, date: string): Promise<string | null> {
    try {
      // Get all games for that date
      const games = await this.getGames(date);
      
      // Find the game that matches both team names
      const game = games.find(game => 
        (game.home.name.includes(homeTeam) || game.home.market.includes(homeTeam)) &&
        (game.away.name.includes(awayTeam) || game.away.market.includes(awayTeam))
      );
  
      return game ? game.id : null;
    } catch (error) {
      console.error('Error finding game by teams and date:', error);
      throw error;
    }
  }
}

export const sportRadarService = new SportRadarService();