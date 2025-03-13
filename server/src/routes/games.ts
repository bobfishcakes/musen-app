import { Router } from 'express';
import { sportRadarService } from '../services/sportRadarService';

export const gamesRouter = Router();

// Route for game details
gamesRouter.get('/details/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    console.log('Fetching details for game:', gameId);
    
    const gameDetails = await sportRadarService.getGameDetails(gameId);
    res.json(gameDetails);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

// Route for games by date
gamesRouter.get('/:date', async (req, res) => {
  try {
    const games = await sportRadarService.getGames(req.params.date);
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});