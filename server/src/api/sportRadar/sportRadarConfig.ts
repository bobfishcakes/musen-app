export const SPORTRADAR_CONFIG = {
  BASE_URL: 'https://api.sportradar.com/nba/trial/v8/en',
  API_KEY: process.env.SPORTRADAR_API_KEY,
  ENDPOINTS: {
      GAMES: '/games',
      GAME_SUMMARY: '/games/{gameId}/boxscore.json', // Update this to match the correct endpoint
  },
  REQUEST_TIMEOUT: 10000,
};