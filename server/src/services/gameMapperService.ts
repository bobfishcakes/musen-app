// /server/src/services/gameMapperService.ts
import { sportRadarService } from './sportRadarService';
import { basketballService } from '/Users/atharvsonawane/musen-app-sync/api/basketball/basketballService';
import { redisClient } from '/Users/atharvsonawane/musen-app-sync/redis/redisClient';

class GameMapperService {
  private standardizeTeamName(name: string): string {
    return name.toLowerCase()
      .replace('los angeles', 'la')
      .replace(/\s+/g, '');
  }

  async updateDailyMappings(date: string): Promise<void> {
    try {
      const sportApiGames = await basketballService.getGames(date);
      const sportRadarGames = await sportRadarService.getGames(date);
  
      for (const sportGame of sportApiGames) {
        const sportHomeTeam = this.standardizeTeamName(sportGame.teams.home.name);
        const sportAwayTeam = this.standardizeTeamName(sportGame.teams.away.name);
  
        const matchingRadarGame = sportRadarGames.find(radarGame => {
          const radarHomeTeam = this.standardizeTeamName(radarGame.home.name);
          const radarAwayTeam = this.standardizeTeamName(radarGame.away.name);
          return radarHomeTeam === sportHomeTeam && radarAwayTeam === sportAwayTeam;
        });
  
        if (matchingRadarGame) {
          // Convert the IDs to strings before passing them to setGameIdMapping
          await redisClient.setGameIdMapping(
            String(sportGame.id), 
            String(matchingRadarGame.id), 
            date
          );
        }
      }
    } catch (error) {
      console.error('Error updating game mappings:', error);
      throw error;
    }
  }

  async getRadarGameId(sportApiGameId: string, date: string): Promise<string | null> {
    try {
      return await redisClient.getGameIdMapping(sportApiGameId, date);
    } catch (error) {
      console.error('Error getting radar game ID:', error);
      return null;
    }
  }
}

export const gameMapperService = new GameMapperService();