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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sportRadarService = void 0;
const axios_1 = __importDefault(require("axios"));
const backend_config_1 = require("../config/backend.config");
class SportRadarService {
    constructor() {
        this.client = axios_1.default.create({
            baseURL: backend_config_1.BACKEND_CONFIG.BASE_URL
        });
    }
    getGames(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.get(`${backend_config_1.BACKEND_CONFIG.ENDPOINTS.GAMES}/${date}`);
                return response.data;
            }
            catch (error) {
                console.error('Error fetching games:', error);
                throw error;
            }
        });
    }
    findGameByTeam(date, homeTeam) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const games = yield this.getGames(date);
                const game = games.find(g => g.home.name.toLowerCase().includes(homeTeam.toLowerCase()) ||
                    g.home.alias.toLowerCase().includes(homeTeam.toLowerCase()));
                return game || null;
            }
            catch (error) {
                console.error('Error finding game by team:', error);
                throw error;
            }
        });
    }
    getGameDetails(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.get(`${backend_config_1.BACKEND_CONFIG.ENDPOINTS.GAME_DETAILS}/${gameId}`);
                return response.data;
            }
            catch (error) {
                console.error('Error fetching game details:', error);
                throw error;
            }
        });
    }

}
exports.sportRadarService = new SportRadarService();
