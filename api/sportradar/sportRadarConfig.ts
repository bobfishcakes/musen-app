export const SPORTRADAR_CONFIG = {
    BASE_URL: process.env.SPORTRADAR_API_URL || 'https://api.sportradar.us/nba/production/v7/en',
    API_KEY: process.env.SPORTRADAR_API_KEY,
    ENDPOINTS: {
      GAMES: '/games',
      GAME_BOXSCORE: '/games/{gameId}/boxscore',
      GAME_SUMMARY: '/games/{gameId}/summary',
      GAME_TIMELINE: '/games/{gameId}/timeline',
    },
    REQUEST_TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  };