import { Game, Teams, League, GameDate, Scores } from '../../constants/Interfaces';

// API Response interface
export interface BasketballApiResponse<T> {
  get: string;
  parameters: Record<string, any>;
  errors: string[];
  results: number;
  response: T[];
}

// League interface with logo
export interface BasketballLeague extends League {
  id: number;
  type: string;
  season: string;
  logo: string;
}

// Team interface with required logo
export interface BasketballTeam {
  id: number;
  name: string;
  logo: string;
}

// Teams container interface
export interface BasketballTeams {
  home: BasketballTeam;
  away: BasketballTeam;
}

// Score interface
export interface BasketballScore {
  quarter_1: number | null;
  quarter_2: number | null;
  quarter_3: number | null;
  quarter_4: number | null;
  over_time: number | null;
  total: number;
}

// Scores container interface
export interface BasketballScores {
  home: BasketballScore;
  away: BasketballScore;
}

// Status interface
export interface BasketballStatus {
  long: string;
  short: string;
  timer?: string;
}

// Main Basketball Game interface
export interface BasketballGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  status: BasketballStatus;
  league: BasketballLeague;
  teams: BasketballTeams;
  scores: BasketballScores;
}

// Helper type to convert BasketballGame to Game interface format
export type ConvertedBasketballGame = Game & {
  league: League & {
    logo: string;
  };
};

// Conversion function to maintain compatibility with existing components
export function convertBasketballGame(game: BasketballGame): ConvertedBasketballGame {
  return {
    id: game.id.toString(),
    teams: {
      home: {
        id: game.teams.home.id.toString(),
        name: game.teams.home.name,
        logo: game.teams.home.logo
      },
      away: {
        id: game.teams.away.id.toString(),
        name: game.teams.away.name,
        logo: game.teams.away.logo
      }
    },
    league: {
      name: game.league.name,
      alias: game.league.type,
      logo: game.league.logo
    },
    status: {
      long: game.status.long,
      short: game.status.short
    },
    scores: {
      home: {
        total: game.scores.home.total,
        quarter_1: game.scores.home.quarter_1 ?? undefined,
        quarter_2: game.scores.home.quarter_2 ?? undefined,
        quarter_3: game.scores.home.quarter_3 ?? undefined,
        quarter_4: game.scores.home.quarter_4 ?? undefined,
        overtime: game.scores.home.over_time ?? undefined
      },
      away: {
        total: game.scores.away.total,
        quarter_1: game.scores.away.quarter_1 ?? undefined,
        quarter_2: game.scores.away.quarter_2 ?? undefined,
        quarter_3: game.scores.away.quarter_3 ?? undefined,
        quarter_4: game.scores.away.quarter_4 ?? undefined,
        overtime: game.scores.away.over_time ?? undefined
      }
    },
    date: game.date
  };
}