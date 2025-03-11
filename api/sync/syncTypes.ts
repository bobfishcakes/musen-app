export interface GameClock {
    gameId: string;
    period: number;
    minutes: number;
    seconds: number;
    isRunning: boolean;
    lastUpdated: Date;
  }
  
  export interface SyncOffset {
    gameId: string;
    offsetMs: number;
    lastUpdated: Date;  // Add this line
  }
  
  export interface StoppageEvent {
    gameId: string;
    startTime: Date;
    type: 'timeout' | 'review' | 'injury' | 'other';
    duration?: number;
  }
  
  export type SyncRole = 'commentator' | 'listener';