export interface Team {
  name: string
  id: string
  logo: string
  primaryColor?: string;
}

export interface Teams {
  home: Team
  away: Team
}

export interface League {
  name: string
  alias?: string
  logo?: string; // Add this line
}

export interface GameDate {
  date: string
  time: string
}

export interface GameClock {
  minutes: number;
  seconds: number;
  period: number;
  isRunning: boolean;
}

export interface Game {
  id: string
  teams: Teams
  league: League
  date?: string
  game?: {
    date: GameDate
  }
  status: {
    long: string;
    short: string;
  };
  scores?: Scores
  streamers?: number;
  listeners?: number;
  radarGameId: string; // Make this required
  clock?: GameClock;
  // Game clock properties
  period?: number;
  minutes?: number;
  seconds?: number;
  isRunning?: boolean;
  lastUpdated?: Date;
}

export interface Scores {
  home: Score
  away: Score
}

export interface Score {
  total: number
  quarter_1?: number
  quarter_2?: number
  quarter_3?: number
  quarter_4?: number
  overtime?: number
}

export interface Stream {
  id: string
  title: string
  streamer: string
  game: Game
  listeners: number
}

// Add these new interfaces for sync functionality
export interface GameClockUpdate {
  gameId: string;
  period: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  lastUpdated: Date;
}

export interface StoppageEvent {
  gameId: string;
  type: 'timeout' | 'injury' | 'other';
  timestamp: Date;
  duration?: number;
}