import { GameClock, SyncOffset, StoppageEvent } from './syncTypes';

class SyncService {
  private activeSyncs: Map<string, GameClock>;
  private stoppages: Map<string, StoppageEvent>;

  constructor() {
    this.activeSyncs = new Map();
    this.stoppages = new Map();
  }

  updateGameClock(gameId: string, clock: Partial<GameClock>): void {
    const existing = this.activeSyncs.get(gameId) || {
      gameId,
      period: 1,
      minutes: 12,
      seconds: 0,
      isRunning: false,
      lastUpdated: new Date()
    };

    this.activeSyncs.set(gameId, {
      ...existing,
      ...clock,
      lastUpdated: new Date()
    });
  }

  getGameClock(gameId: string): GameClock | undefined {
    return this.activeSyncs.get(gameId);
  }

  startStoppage(gameId: string, type: StoppageEvent['type']): void {
    this.stoppages.set(gameId, {
      gameId,
      startTime: new Date(),
      type
    });
  }

  endStoppage(gameId: string): StoppageEvent | undefined {
    const stoppage = this.stoppages.get(gameId);
    if (stoppage) {
      this.stoppages.delete(gameId);
    }
    return stoppage;
  }
}

export const syncService = new SyncService();