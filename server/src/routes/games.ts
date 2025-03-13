import { Router } from 'express';
import { sportRadarService } from '/Users/atharvsonawane/musen-app/api/sportradar/sportRadarService';

export const gamesRouter = Router();

gamesRouter.get('/:date', async (req, res) => {
  try {
    const games = await sportRadarService.getGames(req.params.date);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

gamesRouter.get('/details/:gameId', async (req, res) => {
  try {
    const game = await sportRadarService.getGameDetails(req.params.gameId);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});