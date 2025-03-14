// /server/src/routes/games.ts
import { Router } from 'express';
import { sportRadarService } from '../services/sportRadarService';
import { gameMapperService } from '../services/gameMapperService';
import { SportRadarGame } from '../api/sportRadar/sportRadarTypes'; // Add this import

const gamesRouter = Router();

gamesRouter.get('/details/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    console.log('Fetching details for game:', gameId);
    
    const gameDetails: SportRadarGame = await sportRadarService.getGameDetails(gameId);
    
    // Transform the response to include the needed properties
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

// Add endpoint to trigger daily mapping updates
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

export { gamesRouter };