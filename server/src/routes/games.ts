// games.ts
import { Router } from 'express';
import { sportRadarHTTPService } from '../api/sportRadar/sportRadarHTTPService';
import { sportRadarLocalService } from '../api/sportRadar/sportRadarLocalService';

const gamesRouter = Router();

gamesRouter.get('/details/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    console.log('Requesting game details for gameId:', gameId);
    
    const gameDetails = await sportRadarHTTPService.getGameDetails(gameId);
    res.json(gameDetails);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

gamesRouter.get('/find/:date/:homeTeam/:awayTeam', async (req, res) => {
  try {
    const { date, homeTeam, awayTeam } = req.params;
    
    const gameId = await sportRadarLocalService.findGameByTeamsAndDate(homeTeam, awayTeam, date);

    if (!gameId) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({ gameId });
  } catch (error) {
    console.error('Error finding game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { gamesRouter };