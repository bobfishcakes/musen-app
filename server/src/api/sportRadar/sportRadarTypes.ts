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

export interface GameDetailsResponse {
  id: string;
  status: string;        // "inprogress", "complete", etc.
  clock: string;         // API returns clock as string like "11:16"
  clock_decimal?: string;
  quarter: number;       // API uses quarter instead of period
  scheduled: string;
  home: SportRadarTeam;
  away: SportRadarTeam;
  venue: SportRadarVenue;
  coverage: string;
  attendance?: number;
  sr_id?: string;
  reference?: string;
  time_zones?: {
    away: string;
    home: string;
    venue: string;
  };
}

export interface SportRadarApiResponse<T> {
  status: string;
  data: T;
}