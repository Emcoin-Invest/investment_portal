// WebSocket Service for real-time functionality

type EventListener<T = unknown> = (data: T) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: Map<string, Set<EventListener<unknown>>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor(url?: string) {
    this.url = url || `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:3002'}`;
  }

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.url}?token=${token}`);

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          const { type, data } = JSON.parse(event.data);
          this.emit(type, data);
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[WebSocket] Disconnected');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  send<T = unknown>(type: string, data: T): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  subscribe<T = unknown>(event: string, listener: EventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as EventListener<unknown>);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener as EventListener<unknown>);
    };
  }

  private emit<T = unknown>(event: string, data: T): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`[WebSocket] Reconnecting in ${delay}ms...`);
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          this.connect(token).catch(() => {
            // Retry will happen automatically
          });
        }
      }, delay);
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();

// Real-time event types
export enum RealtimeEvents {
  // Portfolio events
  PORTFOLIO_UPDATED = 'portfolio:updated',
  POSITION_ADDED = 'position:added',
  POSITION_REMOVED = 'position:removed',

  // Price events
  PRICE_UPDATE = 'price:updated',
  MARKET_ALERT = 'market:alert',

  // Notification events
  NOTIFICATION_NEW = 'notification:new',
  NOTIFICATION_READ = 'notification:read',

  // Admin events
  USER_ACTIVITY = 'user:activity',
  SYSTEM_ALERT = 'system:alert',

  // Request events
  REQUEST_STATUS_CHANGED = 'request:status_changed',
  REQUEST_COMMENT_ADDED = 'request:comment_added',

  // Connection events
  CONNECTION_ESTABLISHED = 'connection:established',
  CONNECTION_CLOSED = 'connection:closed',
}

export default wsService;
