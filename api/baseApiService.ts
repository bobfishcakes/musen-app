import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from './config/api.config';

export class BaseApiService {
  protected api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: API_CONFIG.HEADERS
    });

    this.api.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  protected get<T>(endpoint: string, params?: Record<string, any>) {
    return this.api.get<T>(endpoint, { params });
  }
}