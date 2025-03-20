import { Router } from 'express';
import axios from 'axios';
import { SPORTRADAR_CONFIG } from '../api/sportRadar/sportRadarConfig';

const gamesRouter = Router();

gamesRouter.get('/details/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const apiKey = process.env.SPORTRADAR_API_KEY;

    if (!apiKey) {
      console.error('SportRadar API key is not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('Attempting API request with game ID:', gameId);
    
    const url = `${SPORTRADAR_CONFIG.BASE_URL}/games/${gameId}/boxscore.json`;
    console.log('Request URL:', url);

    const response = await axios.get(url, {
      params: {
        api_key: apiKey
      }
    });

    console.log('API Response status:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching game details:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        return res.status(403).json({ 
          error: 'Authentication failed with SportRadar API',
          details: 'Please check API key configuration'
        });
      }
      
      return res.status(error.response?.status || 500).json({
        error: 'API request failed',
        details: error.message
      });
    }
    
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

export { gamesRouter };