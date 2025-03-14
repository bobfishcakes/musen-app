export const BACKEND_CONFIG = {
  SPORTRADAR: {
    BASE_URL: 'http://api.sportradar.us',
    API_KEY: process.env.SPORTRADAR_API_KEY,
    ENDPOINTS: {
      GAME_SUMMARY: '/nba/trial/v7/en/games/{gameId}/summary.json',
      DAILY_SCHEDULE: '/nba/trial/v7/en/games/{date}/schedule.json'
    }
  }
};