export const SPORTRADAR_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Update this to match your server
  ENDPOINTS: {
    GAMES: '/games',
    GAME_SUMMARY: '/games/details/{gameId}',
    GAME_TIMELINE: '/games/timeline/{gameId}'
  },
  REQUEST_TIMEOUT: 5000,
  API_KEY: process.env.SPORTRADAR_API_KEY || 'your-default-key'
};