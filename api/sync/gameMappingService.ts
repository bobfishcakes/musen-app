import { basketballService } from '../basketball/basketballService';
import { sportRadarService } from '../sportradar/sportRadarService';

interface GameIdMapping {
  basketballApiId: string;
  sportRadarId: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
}

class GameMappingService {
  private mappings: Map<string, GameIdMapping> = new Map();

  async updateMappings(date: string) {
    try {
      // Get games from both APIs
      const basketballGames = await basketballService.getGames(date);
      const sportRadarGames = await sportRadarService.getGames(date);

      // Create mappings by matching team names
      basketballGames.forEach(bGame => {
        const matchingSRGame = sportRadarGames.find(srGame => 
          srGame.home.name === bGame.teams.home.name && 
          srGame.away.name === bGame.teams.away.name
        );

        if (matchingSRGame) {
          const mapping: GameIdMapping = {
            basketballApiId: bGame.id.toString(),
            sportRadarId: matchingSRGame.id,
            homeTeam: bGame.teams.home.name,
            awayTeam: bGame.teams.away.name,
            date
          };
          
          // Use composite key of home+away+date to handle same teams playing multiple times
          const key = `${bGame.teams.home.name}-${bGame.teams.away.name}-${date}`;
          this.mappings.set(key, mapping);
        }
      });
    } catch (error) {
      console.error('Error updating game ID mappings:', error);
    }
  }

  getSportRadarId(basketballApiId: string): string | undefined {
    const mapping = Array.from(this.mappings.values())
      .find(m => m.basketballApiId === basketballApiId);
    return mapping?.sportRadarId;
  }

  getBasketballApiId(sportRadarId: string): string | undefined {
    const mapping = Array.from(this.mappings.values())
      .find(m => m.sportRadarId === sportRadarId);
    return mapping?.basketballApiId;
  }
}

export const gameMappingService = new GameMappingService();