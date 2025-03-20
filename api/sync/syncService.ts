import { GameClock, StoppageEvent } from './syncTypes';
import { pushLogger } from '../../utils/logging/pushLogger';
import { Subject } from 'rxjs';

class SyncService {
  private activeSyncs: Map<string, GameClock>;
  private stoppages: Map<string, StoppageEvent>;
  private debugPollers: Map<string, NodeJS.Timeout>;
  public clockUpdates$ = new Subject<GameClock>();

  constructor() {
    this.activeSyncs = new Map();
    this.stoppages = new Map();
    this.debugPollers = new Map();
  }

  updateGameClock(gameId: string, clock: Partial<GameClock>): void {
    console.log('SyncService updating game clock:', gameId, clock);
    const existing = this.activeSyncs.get(gameId) || {
      gameId,
      period: 1,
      minutes: 12,
      seconds: 0,
      isRunning: false,
      lastUpdated: new Date()
    };
  
    const updatedClock = {
      ...existing,
      ...clock,
      lastUpdated: new Date()
    };
  
    console.log('Emitting updated clock:', updatedClock); // Add this line
    this.activeSyncs.set(gameId, updatedClock);
    this.clockUpdates$.next(updatedClock);
    pushLogger.updates('Clock updated in sync service:', updatedClock);
  }

  getGameClock(gameId: string): GameClock | undefined {
    return this.activeSyncs.get(gameId);
  }

  startDebugPolling(gameId: string, onUpdate: (clock: GameClock | undefined, stoppage: StoppageEvent | undefined) => void) {
    if (this.debugPollers.has(gameId)) {
      this.stopDebugPolling(gameId);
    }

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