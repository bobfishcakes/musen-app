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
exports.basketballService = void 0;
const baseApiService_1 = require("../baseApiService");
const api_config_1 = require("../config/api.config");
class BasketballService extends baseApiService_1.BaseApiService {
    constructor() {
        super(api_config_1.API_CONFIG.BASKETBALL.BASE_URL);
    }
    getGames(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.get('/games', {
                    date,
                });
                // Filter for NBA and NCAA games
                return response.data.response.filter(game => game.league.name === "NBA" || game.league.name === "NCAA");
            }
            catch (error) {
                console.error('Error fetching basketball games:', error);
                throw error;
            }
        });
    }
}
exports.basketballService = new BasketballService();
