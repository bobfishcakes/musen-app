// games.ts
import { Router } from 'express';
import { sportRadarService } from '../services/sportRadarService';
import type { SportRadarGame, GameDetailsResponse } from '../api/sportRadar/sportRadarTypes';

const gamesRouter = Router();

// Add route for getting games by date
gamesRouter.get('/:date', async (req, res) => {
  try {
    const date = req.params.date;
    const games = await sportRadarService.getGames(date);
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

gamesRouter.get('/details/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    console.log('Requesting game details for gameId:', gameId);
    
    const gameDetails = await sportRadarService.getGameDetails(gameId);
    res.json(gameDetails);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

gamesRouter.get('/find/:date/:homeTeam/:awayTeam', async (req, res) => {
  try {
    const { date, homeTeam, awayTeam } = req.params;
    
    const gameId = await sportRadarService.findGameByTeamsAndDate(homeTeam, awayTeam, date);

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