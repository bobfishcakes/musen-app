"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApiService = void 0;
const axios_1 = __importDefault(require("axios"));
const api_config_1 = require("./config/api.config");
class BaseApiService {
    constructor(baseURL) {
        this.api = axios_1.default.create({
            baseURL,
            headers: api_config_1.API_CONFIG.HEADERS
        });
        this.api.interceptors.response.use(response => response, error => {
            console.error('API Error:', error);
            return Promise.reject(error);
        });
    }
    get(endpoint, params) {
        return this.api.get(endpoint, { params });
    }
}
exports.BaseApiService = BaseApiService;
