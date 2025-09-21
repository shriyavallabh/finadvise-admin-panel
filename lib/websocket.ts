
import { io, Socket } from 'socket.io-client';
import { Agent, SystemLog, SystemAlert } from '@/types';

/**
 * WebSocket manager for real-time updates
 * Connects to your existing FinAdvise WebSocket server
 */
class WebSocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001';

    this.socket = io(wsUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    this.socket.on('reconnect', () => {
      console.log('🔄 WebSocket reconnected');
    });

    // Agent status updates
    this.socket.on('agent:status', (data: { agentId: string; status: string; metrics: any }) => {
      window.dispatchEvent(new CustomEvent('agent-status-update', { detail: data }));
    });

    // System logs
    this.socket.on('log:stream', (log: SystemLog) => {
      window.dispatchEvent(new CustomEvent('new-system-log', { detail: log }));
    });

    // System alerts
    this.socket.on('system:alert', (alert: SystemAlert) => {
      window.dispatchEvent(new CustomEvent('system-alert', { detail: alert }));
    });

    // Campaign updates
    this.socket.on('campaign:update', (data: any) => {
      window.dispatchEvent(new CustomEvent('campaign-update', { detail: data }));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsManager = new WebSocketManager();
export default wsManager;
