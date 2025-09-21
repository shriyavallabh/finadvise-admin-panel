"use client"

import React from 'react'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { SystemAlert, LogEntry, OverviewMetrics, SystemConfig } from '@/types'

interface SystemState {
  // System Status
  isOnline: boolean
  systemHealth: number
  lastHeartbeat: Date | null

  // Alerts & Notifications
  alerts: SystemAlert[]
  logs: LogEntry[]

  // Metrics
  overview: OverviewMetrics | null
  performanceHistory: Array<{
    timestamp: Date
    cpu: number
    memory: number
    requests: number
  }>

  // Configuration
  config: SystemConfig | null
  features: {
    realTimeUpdates: boolean
    debugMode: boolean
    maintenanceMode: boolean
  }

  // UI State
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  notifications: {
    desktop: boolean
    sound: boolean
    email: boolean
  }
}

interface SystemActions {
  // System Status
  setSystemHealth: (health: number) => void
  updateHeartbeat: () => void
  setOnlineStatus: (online: boolean) => void

  // Alerts
  addAlert: (alert: SystemAlert) => void
  acknowledgeAlert: (alertId: string) => void
  dismissAlert: (alertId: string) => void
  clearAllAlerts: () => void

  // Logs
  addLog: (log: LogEntry) => void
  clearLogs: () => void
  getLogsByLevel: (level: string) => LogEntry[]

  // Metrics
  updateOverview: (metrics: OverviewMetrics) => void
  addPerformancePoint: (point: { cpu: number; memory: number; requests: number }) => void

  // Configuration
  updateConfig: (config: Partial<SystemConfig>) => void
  toggleFeature: (feature: keyof SystemState['features']) => void

  // UI
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setSidebarCollapsed: (collapsed: boolean) => void
  updateNotificationSettings: (settings: Partial<SystemState['notifications']>) => void

  // Computed
  getUnreadAlertsCount: () => number
  getCriticalAlertsCount: () => number
  getSystemStatus: () => 'healthy' | 'warning' | 'critical' | 'offline'
}

type SystemStore = SystemState & SystemActions

export const useSystemStore = create<SystemStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      isOnline: false,
      systemHealth: 0,
      lastHeartbeat: null,
      alerts: [],
      logs: [],
      overview: null,
      performanceHistory: [],
      config: null,
      features: {
        realTimeUpdates: true,
        debugMode: false,
        maintenanceMode: false
      },
      theme: 'system',
      sidebarCollapsed: false,
      notifications: {
        desktop: true,
        sound: true,
        email: false
      },

      // System Status Actions
      setSystemHealth: (health) => set((state) => {
        state.systemHealth = health
      }),

      updateHeartbeat: () => set((state) => {
        state.lastHeartbeat = new Date()
        state.isOnline = true
      }),

      setOnlineStatus: (online) => set((state) => {
        state.isOnline = online
        if (!online) {
          state.systemHealth = 0
        }
      }),

      // Alert Actions
      addAlert: (alert) => set((state) => {
        // Avoid duplicate alerts
        const exists = state.alerts.some(a => a.id === alert.id)
        if (!exists) {
          state.alerts.unshift(alert)
          // Keep only last 100 alerts
          if (state.alerts.length > 100) {
            state.alerts = state.alerts.slice(0, 100)
          }
        }
      }),

      acknowledgeAlert: (alertId) => set((state) => {
        const alert = state.alerts.find(a => a.id === alertId)
        if (alert) {
          alert.acknowledged = true
        }
      }),

      dismissAlert: (alertId) => set((state) => {
        state.alerts = state.alerts.filter(a => a.id !== alertId)
      }),

      clearAllAlerts: () => set((state) => {
        state.alerts = []
      }),

      // Log Actions
      addLog: (log) => set((state) => {
        state.logs.unshift(log)
        // Keep only last 1000 logs
        if (state.logs.length > 1000) {
          state.logs = state.logs.slice(0, 1000)
        }
      }),

      clearLogs: () => set((state) => {
        state.logs = []
      }),

      getLogsByLevel: (level) => {
        return get().logs.filter(log => log.level === level)
      },

      // Metrics Actions
      updateOverview: (metrics) => set((state) => {
        state.overview = metrics
      }),

      addPerformancePoint: (point) => set((state) => {
        state.performanceHistory.unshift({
          timestamp: new Date(),
          ...point
        })
        // Keep only last 100 points
        if (state.performanceHistory.length > 100) {
          state.performanceHistory = state.performanceHistory.slice(0, 100)
        }
      }),

      // Configuration Actions
      updateConfig: (config) => set((state) => {
        state.config = { ...state.config, ...config } as SystemConfig
      }),

      toggleFeature: (feature) => set((state) => {
        state.features[feature] = !state.features[feature]
      }),

      // UI Actions
      setTheme: (theme) => set((state) => {
        state.theme = theme
      }),

      setSidebarCollapsed: (collapsed) => set((state) => {
        state.sidebarCollapsed = collapsed
      }),

      updateNotificationSettings: (settings) => set((state) => {
        state.notifications = { ...state.notifications, ...settings }
      }),

      // Computed Properties
      getUnreadAlertsCount: () => {
        return get().alerts.filter(alert => !alert.acknowledged).length
      },

      getCriticalAlertsCount: () => {
        return get().alerts.filter(
          alert => !alert.acknowledged && alert.severity === 'critical'
        ).length
      },

      getSystemStatus: () => {
        const { isOnline, systemHealth, alerts } = get()

        if (!isOnline) return 'offline'

        const criticalAlerts = alerts.filter(
          a => !a.acknowledged && a.severity === 'critical'
        ).length

        if (criticalAlerts > 0 || systemHealth < 50) return 'critical'
        if (systemHealth < 80) return 'warning'
        return 'healthy'
      }
    })),
    {
      name: 'system-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        notifications: state.notifications,
        features: state.features
      })
    }
  )
)

// Hook for real-time system monitoring
export function useSystemMonitoring() {
  const store = useSystemStore()

  // Simulate system heartbeat
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Simulate system health calculation
      const health = Math.max(0, Math.min(100,
        90 + (Math.random() - 0.5) * 20
      ))

      store.setSystemHealth(health)
      store.updateHeartbeat()

      // Simulate performance data
      store.addPerformancePoint({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        requests: Math.random() * 1000
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [store])

  return {
    systemHealth: store.systemHealth,
    isOnline: store.isOnline,
    lastHeartbeat: store.lastHeartbeat,
    systemStatus: store.getSystemStatus(),
    unreadAlertsCount: store.getUnreadAlertsCount(),
    criticalAlertsCount: store.getCriticalAlertsCount()
  }
}