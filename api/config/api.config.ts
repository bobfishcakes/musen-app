// api.config.ts
export const API_CONFIG = {
  SPORTRADAR: {
    BASE_URL: 'https://api.sportradar.us/nba/production/v7/en',
    API_KEY: process.env.SPORTRADAR_API_KEY,
  },
  BASKETBALL: {
    BASE_URL: 'https://v1.basketball.api-sports.io',
    API_KEY: process.env.BASKETBALL_API_KEY || '6c3c11fe1af925ff889d220229ff3297',
  },
  SOCCER: {
    BASE_URL: 'https://v3.football.api-sports.io',
    API_KEY: process.env.SOCCER_API_KEY || '6c3c11fe1af925ff889d220229ff3297',
  },
  DEFAULT_TIMEZONE: 'America/New_York',
  HEADERS: {
    BASKETBALL: {
      'x-rapidapi-host': 'v1.basketball.api-sports.io',
      'x-rapidapi-key': process.env.BASKETBALL_API_KEY || '6c3c11fe1af925ff889d220229ff3297'
    },
    SOCCER: {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': process.env.SOCCER_API_KEY || '6c3c11fe1af925ff889d220229ff3297'
    }
  },
  SOCCER_LEAGUES: {
    PREMIER_LEAGUE: 39,
    LA_LIGA: 140,
    BUNDESLIGA: 78,
    SERIE_A: 135,
    LIGUE_1: 61,
    CHAMPIONS_LEAGUE: 2,
    WORLD_CUP_QUAL_EU: 32,
    WORLD_CUP_QUAL_SA: 34,
    WORLD_CUP_QUAL_AF: 29,
    WORLD_CUP_QUAL_AS: 30
  },
  GAME_STATUS: {
    NOT_STARTED: 'NS',
    FIRST_HALF: '1H',
    HALF_TIME: 'HT',
    SECOND_HALF: '2H',
    FINISHED: 'FT',
    POSTPONED: 'PST',
    CANCELLED: 'CANC'
  }
};