"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameMappingService = void 0;
const basketballService_1 = require("../basketball/basketballService");
const sportRadarService_1 = require("../sportradar/sportRadarService");
class GameMappingService {
    constructor() {
        this.mappings = new Map();
    }
    updateMappings(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get games from both APIs
                const basketballGames = yield basketballService_1.basketballService.getGames(date);
                const sportRadarGames = yield sportRadarService_1.sportRadarService.getGames(date);
                // Create mappings by matching team names
                basketballGames.forEach(bGame => {
                    const matchingSRGame = sportRadarGames.find(srGame => srGame.home.name === bGame.teams.home.name &&
                        srGame.away.name === bGame.teams.away.name);
                    if (matchingSRGame) {
                        const mapping = {
                            basketballApiId: bGame.id.toString(),
                            sportRadarId: matchingSRGame.id,
                            homeTeam: bGame.teams.home.name,
                            awayTeam: bGame.teams.away.name,
                            date
                        };
                        // Use composite key of home+away+date to handle same teams playing multiple times
                        const key = `${bGame.teams.home.name}-${bGame.teams.away.name}-${date}`;
                        this.mappings.set(key, mapping);
                    }
                });
            }
            catch (error) {
                console.error('Error updating game ID mappings:', error);
            }
        });
    }
    getSportRadarId(basketballApiId) {
        const mapping = Array.from(this.mappings.values())
            .find(m => m.basketballApiId === basketballApiId);
        return mapping === null || mapping === void 0 ? void 0 : mapping.sportRadarId;
    }
    getBasketballApiId(sportRadarId) {
        const mapping = Array.from(this.mappings.values())
            .find(m => m.sportRadarId === sportRadarId);
        return mapping === null || mapping === void 0 ? void 0 : mapping.basketballApiId;
    }
}
exports.gameMappingService = new GameMappingService();
