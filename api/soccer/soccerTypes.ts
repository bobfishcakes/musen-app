import { Game, Teams, League } from '../../constants/Interfaces';

export interface SoccerApiResponse<T> {
  get: string;
  parameters: Record<string, any>;
  errors: string[];
  results: number;
  response: T[];
}

export interface SoccerLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  season: number;
  round: string;
}

export interface SoccerTeam {
  id: number;
  name: string;
  logo: string;
}

export interface SoccerTeams {
  home: SoccerTeam;
  away: SoccerTeam;
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}

export interface Fixture {
  id: number;
  date: string;
  timezone: string;
  venue: {
    id: number;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };
}

export interface SoccerGame {
  fixture: Fixture;
  league: SoccerLeague;
  teams: SoccerTeams;
  goals: Goals;
  score: Score;
}

export function convertSoccerGame(game: SoccerGame): Game {
    return {
      id: game.fixture.id.toString(),
      radarGameId: game.fixture.id.toString(),
      teams: {
        home: {
          id: game.teams.home.id.toString(),
          name: game.teams.home.name,
          logo: game.teams.home.logo,
          primaryColor: '#000000'
        },
        away: {
          id: game.teams.away.id.toString(),
          name: game.teams.away.name,
          logo: game.teams.away.logo,
          primaryColor: '#000000'
        }
      },
      league: {
        name: game.league.name,
        alias: game.league.name,
        logo: game.league.logo
      },
      status: {
        long: game.fixture.status.long,
        short: game.fixture.status.short
      },
      scores: {
        home: {
          total: game.goals.home || 0
        },
        away: {
          total: game.goals.away || 0
        }
      },
      date: game.fixture.date
    };
  }