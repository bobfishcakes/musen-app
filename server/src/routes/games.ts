import { Router } from 'express';
import { sportRadarService } from '../services/sportRadarService';
import { gameMapperService } from '../services/gameMapperService';
import { SportRadarGame } from '../api/sportRadar/sportRadarTypes';
import { gameMappingService } from '/Users/atharvsonawane/musen-app-sync/api/sync/gameMappingService'; // Add this import

const gamesRouter = Router();

gamesRouter.get('/details/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    console.log('Fetching details for game:', gameId);
    
    const gameDetails: SportRadarGame = await sportRadarService.getGameDetails(gameId);
    
    const response = {
      radarGameId: gameDetails.id,
      clock: gameDetails.status.clock,
      period: gameDetails.status.period,
      status: gameDetails.status.type
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

gamesRouter.post('/update-mappings', async (req, res) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    await gameMapperService.updateDailyMappings(date);
    res.json({ message: 'Mappings updated successfully' });
  } catch (error) {
    console.error('Error updating mappings:', error);
    res.status(500).json({ error: 'Failed to update mappings' });
  }
});

// Add the missing endpoint
gamesRouter.get('/find/:date/:homeTeam/:awayTeam', async (req, res) => {
  try {
    const { date, homeTeam, awayTeam } = req.params;
    
    // Update mappings for the given date
    await gameMappingService.updateMappings(date.split('T')[0]);

    // Find the matching game mapping
    const mappings = Array.from(gameMappingService.getMappings().values());
    const mapping = mappings.find(m => 
      m.homeTeam === homeTeam && 
      m.awayTeam === awayTeam && 
      m.date === date.split('T')[0]
    );

    if (!mapping) {
      return res.status(404).json({ error: 'Game mapping not found' });
    }

    res.json({ gameId: mapping.sportRadarId });
  } catch (error) {
    console.error('Error finding game mapping:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { gamesRouter };