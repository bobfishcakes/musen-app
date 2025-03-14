"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BACKEND_CONFIG = void 0;
exports.BACKEND_CONFIG = {
    BASE_URL: process.env.BACKEND_URL || 'http://localhost:3000',
    ENDPOINTS: {
        GAMES: '/api/games',
        GAME_DETAILS: '/api/games/{gameId}', // or '/api/games/%s'
    }
};