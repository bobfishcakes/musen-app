import WebSocket from 'ws';

declare global {
  interface Window {
    WebSocket: typeof WebSocket;
  }
}

export type WebSocketType = WebSocket | globalThis.WebSocket;
export type WebSocketServer = WebSocket.Server;