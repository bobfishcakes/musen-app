import { BaseApiService } from '../baseApiService';
import { API_CONFIG } from '../config/api.config';
import { BasketballApiResponse, BasketballGame } from './basketballTypes';
import { Platform } from 'react-native';

class BasketballService extends BaseApiService {
  constructor() {
    super(API_CONFIG.BASKETBALL.BASE_URL, 'BASKETBALL');
  }

  private validateAndFormatDate(dateStr: string): string {
    try {
      // Parse the input date string
      const parts = dateStr.split('-');
      if (parts.length !== 3) {
        throw new Error('Invalid date format');
      }

      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      // Basic date validation
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('Invalid date components');
      }

      // Format with padding
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } catch (error) {
      console.error('Date validation error:', error);
      throw new Error('Invalid date format');
    }
  }

  async getGames(date: string): Promise<BasketballGame[]> {
    console.log('=== BasketballService.getGames Start ===');
    console.log('Platform:', Platform.OS);
    console.log('Input date:', date);

    try {
      // Validate and format the input date
      const formattedDate = this.validateAndFormatDate(date);
      console.log('Formatted date:', formattedDate);

      const now = new Date();
      const currentDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
      const currentHour = currentDate.getHours();

      console.log('Current time (Central):', {
        date: currentDate.toLocaleString(),
        hour: currentHour
      });

      // Calculate the dates for API requests
      const [year, month, day] = formattedDate.split('-').map(Number);
      const baseDate = new Date(year, month - 1, day);
      const otherDate = new Date(year, month - 1, day);

      if (currentHour < 19) {
        otherDate.setDate(baseDate.getDate() + 1);
      } else {
        otherDate.setDate(baseDate.getDate() - 1);
      }

      // Format dates for API
      const dates = [
        formattedDate,
        `${otherDate.getFullYear()}-${String(otherDate.getMonth() + 1).padStart(2, '0')}-${String(otherDate.getDate()).padStart(2, '0')}`
      ];

      console.log('API request dates:', dates);

      // Make parallel requests for both dates
      const responses = await Promise.all(
        dates.map(async (dateStr) => {
          console.log(`Making request for date: ${dateStr}`);
          try {
            const response = await this.get<BasketballApiResponse<BasketballGame>>('/games', { date: dateStr });
            console.log(`Response for ${dateStr}:`, {
              status: 'success',
              gamesCount: response.data.response?.length || 0
            });
            return response;
          } catch (error) {
            console.error(`Error fetching ${dateStr}:`, error);
            return { data: { response: [] } };
          }
        })
      );

      const allGames = responses.flatMap(response => response.data.response || []);
      console.log('Total games fetched:', allGames.length);

      // Filter games for the target date and leagues
      const startTime = new Date(year, month - 1, day, 0, 0, 0);
      const endTime = new Date(year, month - 1, day, 23, 59, 59);

      const filteredGames = allGames.filter(game => {
        const gameTime = new Date(game.date);
        return (
          gameTime >= startTime && 
          gameTime <= endTime &&
          (game.league.name === "NBA" || game.league.name === "NCAA")
        );
      });

      console.log('Games after filtering:', filteredGames.length);

      const sortedGames = filteredGames.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      console.log('=== BasketballService.getGames End ===');
      return sortedGames;

    } catch (error) {
      console.error('Error in BasketballService.getGames:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return [];
    }
  }
}

export const basketballService = new BasketballService();