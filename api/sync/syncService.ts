// api/sync/syncService.ts
import { GameClock, SyncOffset, StoppageEvent } from './syncTypes';

class SyncService {
  private activeSyncs: Map<string, GameClock>;
  private stoppages: Map<string, StoppageEvent>;
  private debugPollers: Map<string, NodeJS.Timeout>;

  constructor() {
    this.activeSyncs = new Map();
    this.stoppages = new Map();
    this.debugPollers = new Map();
  }

// syncService.ts
updateGameClock(gameId: string, clock: Partial<GameClock>): void {
  const existing = this.activeSyncs.get(gameId) || {
    gameId,
    period: 1,
    minutes: 12,
    seconds: 0,
    isRunning: false,
    lastUpdated: new Date()
  };

  console.log("Existing clock in syncService:", existing);
  
  const updatedClock = {
    ...existing,
    ...clock,
    lastUpdated: new Date()
  };
  
  console.log("Updated clock in syncService:", updatedClock);
  
  this.activeSyncs.set(gameId, updatedClock);
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

  // Debug methods for web
  startDebugPolling(gameId: string, onUpdate: (clock: GameClock | undefined, stoppage: StoppageEvent | undefined) => void) {
    if (this.debugPollers.has(gameId)) return;

    const poller = setInterval(() => {
      const clock = this.getGameClock(gameId);
      const stoppage = this.stoppages.get(gameId);
      onUpdate(clock, stoppage);
    }, 1000);

    this.debugPollers.set(gameId, poller);
  }

  stopDebugPolling(gameId: string) {
    const poller = this.debugPollers.get(gameId);
    if (poller) {
      clearInterval(poller);
      this.debugPollers.delete(gameId);
    }
  }
}

export const syncService = new SyncService();