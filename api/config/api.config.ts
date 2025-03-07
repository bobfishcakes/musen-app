export const API_CONFIG = {
    BASKETBALL: {
      BASE_URL: 'https://v1.basketball.api-sports.io',
      API_KEY: process.env.BASKETBALL_API_KEY || '6c3c11fe1af925ff889d220229ff3297',
    },
    DEFAULT_TIMEZONE: 'America/New_York',
    HEADERS: {
      'x-rapidapi-host': 'v1.basketball.api-sports.io',
      'x-rapidapi-key': process.env.BASKETBALL_API_KEY || '6c3c11fe1af925ff889d220229ff3297'
    }
  };