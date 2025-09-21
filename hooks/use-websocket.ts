"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { WebSocketMessage, AgentStatusUpdate, LogEntry, SystemAlert } from '@/types'

interface UseWebSocketOptions {
  url?: string
  autoConnect?: boolean
  reconnectAttempts?: number
  reconnectDelay?: number
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
}

interface WebSocketState {
  socket: Socket | null
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
  reconnectAttempts: number
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001',
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
    onConnect,
    onDisconnect,
    onError
  } = options

  const [state, setState] = useState<WebSocketState>({
    socket: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0
  })

  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const maxReconnectAttempts = useRef(reconnectAttempts)

  const connect = useCallback(() => {
    if (state.socket?.connected) return

    setState(prev => ({ ...prev, isConnecting: true, error: null }))

    const newSocket = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: false // We'll handle reconnection manually
    })

    newSocket.on('connect', () => {
      setState(prev => ({
        ...prev,
        socket: newSocket,
        isConnected: true,
        isConnecting: false,
        reconnectAttempts: 0
      }))
      onConnect?.()
      console.log('WebSocket connected')
    })

    newSocket.on('disconnect', (reason) => {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false
      }))
      onDisconnect?.()
      console.log('WebSocket disconnected:', reason)

      // Attempt to reconnect if not manually disconnected
      if (reason !== 'io client disconnect' && state.reconnectAttempts < maxReconnectAttempts.current) {
        setState(prev => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }))

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`Attempting to reconnect... (${state.reconnectAttempts + 1}/${maxReconnectAttempts.current})`)
          connect()
        }, reconnectDelay)
      }
    })

    newSocket.on('connect_error', (error) => {
      const wsError = new Error(`WebSocket connection error: ${error.message}`)
      setState(prev => ({
        ...prev,
        error: wsError,
        isConnecting: false
      }))
      onError?.(wsError)
      console.error('WebSocket connection error:', error)
    })

    setState(prev => ({ ...prev, socket: newSocket }))
  }, [url, state.socket, state.reconnectAttempts, reconnectDelay, onConnect, onDisconnect, onError])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (state.socket) {
      state.socket.disconnect()
      setState(prev => ({
        ...prev,
        socket: null,
        isConnected: false,
        isConnecting: false,
        reconnectAttempts: 0
      }))
    }
  }, [state.socket])

  const emit = useCallback((event: string, data: any) => {
    if (state.socket?.connected) {
      state.socket.emit(event, data)
    } else {
      console.warn('Cannot emit event: WebSocket not connected')
    }
  }, [state.socket])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (state.socket) {
        state.socket.disconnect()
      }
    }
  }, [])

  return {
    socket: state.socket,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
    reconnectAttempts: state.reconnectAttempts,
    connect,
    disconnect,
    emit
  }
}

// Specialized hooks for different data types
export function useAgentStatusUpdates() {
  const [agentUpdates, setAgentUpdates] = useState<AgentStatusUpdate[]>([])
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!socket) return

    const handleAgentUpdate = (update: AgentStatusUpdate) => {
      setAgentUpdates(prev => {
        // Keep only the latest update for each agent
        const filtered = prev.filter(u => u.agentId !== update.agentId)
        return [...filtered, update].slice(-100) // Keep last 100 updates
      })
    }

    socket.on('agent:status', handleAgentUpdate)
    socket.on('agent:metrics', handleAgentUpdate)

    return () => {
      socket.off('agent:status', handleAgentUpdate)
      socket.off('agent:metrics', handleAgentUpdate)
    }
  }, [socket])

  return { agentUpdates, isConnected }
}

export function useSystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!socket) return

    const handleLogEntry = (log: LogEntry) => {
      setLogs(prev => [log, ...prev].slice(0, 1000)) // Keep last 1000 logs
    }

    socket.on('log:stream', handleLogEntry)

    return () => {
      socket.off('log:stream', handleLogEntry)
    }
  }, [socket])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return { logs, clearLogs, isConnected }
}

export function useSystemAlerts() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!socket) return

    const handleAlert = (alert: SystemAlert) => {
      setAlerts(prev => {
        // Avoid duplicate alerts
        const exists = prev.some(a => a.id === alert.id)
        if (exists) return prev

        return [alert, ...prev].slice(0, 50) // Keep last 50 alerts
      })
    }

    socket.on('system:alert', handleAlert)

    return () => {
      socket.off('system:alert', handleAlert)
    }
  }, [socket])

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }, [])

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }, [])

  return {
    alerts,
    acknowledgeAlert,
    dismissAlert,
    isConnected,
    unreadCount: alerts.filter(a => !a.acknowledged).length
  }
}

export function useRealTimeMetrics<T = any>(metricName: string) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!socket) return

    const handleMetricUpdate = (update: { metric: string; data: T; timestamp: Date }) => {
      if (update.metric === metricName) {
        setData(prev => {
          const newData = [...prev, update.data].slice(-100) // Keep last 100 points
          return newData
        })
        setIsLoading(false)
      }
    }

    socket.on('metrics:update', handleMetricUpdate)

    // Request initial data
    socket.emit('metrics:subscribe', { metric: metricName })

    return () => {
      socket.off('metrics:update', handleMetricUpdate)
      socket.emit('metrics:unsubscribe', { metric: metricName })
    }
  }, [socket, metricName])

  return { data, isLoading, isConnected }
}

// Hook for real-time campaign updates
export function useCampaignUpdates() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!socket) return

    const handleCampaignUpdate = (update: any) => {
      setCampaigns(prev => {
        const index = prev.findIndex(c => c.id === update.campaignId)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = { ...updated[index], ...update.data }
          return updated
        }
        return prev
      })
    }

    socket.on('campaign:update', handleCampaignUpdate)
    socket.on('campaign:status', handleCampaignUpdate)

    return () => {
      socket.off('campaign:update', handleCampaignUpdate)
      socket.off('campaign:status', handleCampaignUpdate)
    }
  }, [socket])

  return { campaigns, isConnected }
}

// Hook for real-time notification updates
export function useNotificationUpdates() {
  const [notifications, setNotifications] = useState<any[]>([])
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!socket) return

    const handleNotification = (notification: any) => {
      setNotifications(prev => [notification, ...prev].slice(0, 20)) // Keep last 20 notifications
    }

    socket.on('notification:new', handleNotification)

    return () => {
      socket.off('notification:new', handleNotification)
    }
  }, [socket])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }, [])

  return {
    notifications,
    markAsRead,
    isConnected,
    unreadCount: notifications.filter(n => !n.read).length
  }
}