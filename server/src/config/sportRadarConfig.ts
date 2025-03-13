export const SPORTRADAR_CONFIG = {
    BASE_URL: process.env.SPORTRADAR_API_URL || 'https://api.sportradar.us/nba/production/v7/en',
    API_KEY: process.env.SPORTRADAR_API_KEY,
    ENDPOINTS: {
      GAMES: '/games',
      GAME_SUMMARY: '/games/{gameId}/summary',
    },
    REQUEST_TIMEOUT: 10000,
};