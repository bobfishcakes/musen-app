const validateConfig = () => {
  if (!process.env.SPORTRADAR_API_KEY) {
    console.error('⚠️ SPORTRADAR_API_KEY environment variable is not set');
    return false;
  }
  console.log('✅ SportRadar API key found:', process.env.SPORTRADAR_API_KEY.substring(0, 4) + '...');
  return true;
};

export const SPORTRADAR_CONFIG = {
  BASE_URL: 'https://api.sportradar.com/nba/trial/v8/en',
  WS_URL: 'wss://api.sportradar.com/nba/trial/stream/en/clock',
  API_KEY: process.env.NEXT_PUBLIC_SPORTRADAR_API_KEY || process.env.SPORTRADAR_API_KEY,
  ENDPOINTS: {
    GAMES: '/games',
    GAME_SUMMARY: '/games/{gameId}/boxscore.json',
  },
  REQUEST_TIMEOUT: 10000,
  isValid: validateConfig()
};