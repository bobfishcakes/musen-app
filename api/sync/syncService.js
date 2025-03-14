"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncService = void 0;
class SyncService {
    constructor() {
        this.activeSyncs = new Map();
        this.stoppages = new Map();
        this.debugPollers = new Map();
    }
    updateGameClock(gameId, clock) {
        const existing = this.activeSyncs.get(gameId) || {
            gameId,
            period: 1,
            minutes: 12,
            seconds: 0,
            isRunning: false,
            lastUpdated: new Date()
        };
        this.activeSyncs.set(gameId, Object.assign(Object.assign(Object.assign({}, existing), clock), { lastUpdated: new Date() }));
    }
    getGameClock(gameId) {
        return this.activeSyncs.get(gameId);
    }
    startStoppage(gameId, type) {
        this.stoppages.set(gameId, {
            gameId,
            startTime: new Date(),
            type
        });
    }
    endStoppage(gameId) {
        const stoppage = this.stoppages.get(gameId);
        if (stoppage) {
            this.stoppages.delete(gameId);
        }
        return stoppage;
    }
    // Debug methods for web
    startDebugPolling(gameId, onUpdate) {
        if (this.debugPollers.has(gameId))
            return;
        const poller = setInterval(() => {
            const clock = this.getGameClock(gameId);
            const stoppage = this.stoppages.get(gameId);
            onUpdate(clock, stoppage);
        }, 1000);
        this.debugPollers.set(gameId, poller);
    }
    stopDebugPolling(gameId) {
        const poller = this.debugPollers.get(gameId);
        if (poller) {
            clearInterval(poller);
            this.debugPollers.delete(gameId);
        }
    }
}
exports.syncService = new SyncService();
