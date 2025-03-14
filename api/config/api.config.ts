export const API_CONFIG = {
    BASKETBALL: {
      BASE_URL: 'https://v1.basketball.api-sports.io',
      API_KEY: process.env.BASKETBALL_API_KEY || '3ea556ba1dc3f47f14c037266eb4709d',
    },
    DEFAULT_TIMEZONE: 'America/New_York',
    HEADERS: {
      'x-rapidapi-host': 'v1.basketball.api-sports.io',
      'x-rapidapi-key': process.env.BASKETBALL_API_KEY || '3ea556ba1dc3f47f14c037266eb4709d'
    }
  };