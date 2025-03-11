export interface SportRadarTeam {
    id: string;
    name: string;
    alias: string;
    market: string;
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
  
  export interface SportRadarApiResponse<T> {
    status: string;
    data: T;
  }