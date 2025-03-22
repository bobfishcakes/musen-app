export interface SportRadarTeam {
  id: string;
  name: string;
  alias: string;
  market: string;
  points?: number;
  bonus?: boolean;
  remaining_timeouts?: number;
  reference?: string;
  sr_id?: string;
}

export interface SportRadarVenue {
  id: string;
  name: string;
  capacity: number;
  city: string;
  state: string;
}

export interface SportRadarGameClock {
  minutes: number;
  seconds: number;
  tenths: number;
}

export interface SportRadarGameStatus {
  clock: SportRadarGameClock;
  period: number;
  type: string;
}

export interface SportRadarGame {
  id: string;
  status: SportRadarGameStatus;
  scheduled: string;
  home: SportRadarTeam;
  away: SportRadarTeam;
  venue: SportRadarVenue;
}

export interface PlayerStats {
  id: string;
  full_name: string;
  jersey_number: string;
  position: string;
  primary_position: string;
  statistics: {
    points: number;
    rebounds: number;
    assists: number;
    minutes: string;
  };
}

export interface TeamLeaders {
  points: PlayerStats;
  rebounds: PlayerStats;
  assists: PlayerStats;
}

export interface GameDetailsResponse {
  id: string;
  status: string;
  coverage: string;
  scheduled: string;
  clock: string;
  quarter: number;
  home: {
    name: string;
    alias: string;
    points: number;
    leaders: TeamLeaders;
  };
  away: {
    name: string;
    alias: string;
    points: number;
    leaders: TeamLeaders;
  };
}

export interface SportRadarApiResponse<T> {
  status: string;
  data: T;
}