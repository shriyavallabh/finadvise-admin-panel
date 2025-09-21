"use client"

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { Agent, AgentStatus, AgentMetrics, LogEntry } from '@/types'

interface AgentStore {
  // State
  agents: Agent[]
  selectedAgent: Agent | null
  agentLogs: Record<string, LogEntry[]>
  filters: {
    search: string
    status: AgentStatus | 'all'
    type: string | 'all'
  }
  isLoading: boolean
  error: string | null

  // Actions
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  removeAgent: (id: string) => void
  selectAgent: (agent: Agent | null) => void
  updateAgentMetrics: (id: string, metrics: AgentMetrics) => void
  updateAgentStatus: (id: string, status: AgentStatus) => void

  // Logs
  addAgentLog: (agentId: string, log: LogEntry) => void
  clearAgentLogs: (agentId: string) => void
  getAgentLogs: (agentId: string) => LogEntry[]

  // Filters
  setSearchFilter: (search: string) => void
  setStatusFilter: (status: AgentStatus | 'all') => void
  setTypeFilter: (type: string | 'all') => void
  clearFilters: () => void

  // Async actions
  startAgent: (id: string) => Promise<void>
  stopAgent: (id: string) => Promise<void>
  restartAgent: (id: string) => Promise<void>
  deployAgent: (config: any) => Promise<void>

  // Computed
  getFilteredAgents: () => Agent[]
  getAgentsByStatus: (status: AgentStatus) => Agent[]
  getAgentMetrics: () => {
    total: number
    active: number
    error: number
    avgCpu: number
    avgMemory: number
    totalRequests: number
  }
}

export const useAgentStore = create<AgentStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      agents: [],
      selectedAgent: null,
      agentLogs: {},
      filters: {
        search: '',
        status: 'all',
        type: 'all'
      },
      isLoading: false,
      error: null,

      // Basic Actions
      setAgents: (agents) => set((state) => {
        state.agents = agents
        state.isLoading = false
        state.error = null
      }),

      addAgent: (agent) => set((state) => {
        state.agents.push(agent)
      }),

      updateAgent: (id, updates) => set((state) => {
        const index = state.agents.findIndex(a => a.id === id)
        if (index !== -1) {
          Object.assign(state.agents[index], updates, { updatedAt: new Date() })
        }
      }),

      removeAgent: (id) => set((state) => {
        state.agents = state.agents.filter(a => a.id !== id)
        if (state.selectedAgent?.id === id) {
          state.selectedAgent = null
        }
        delete state.agentLogs[id]
      }),

      selectAgent: (agent) => set((state) => {
        state.selectedAgent = agent
      }),

      updateAgentMetrics: (id, metrics) => set((state) => {
        const index = state.agents.findIndex(a => a.id === id)
        if (index !== -1) {
          state.agents[index].metrics = { ...metrics, lastUpdate: new Date() }
          state.agents[index].lastActivity = new Date()
        }
      }),

      updateAgentStatus: (id, status) => set((state) => {
        const index = state.agents.findIndex(a => a.id === id)
        if (index !== -1) {
          state.agents[index].status = status
          state.agents[index].lastActivity = new Date()
          state.agents[index].updatedAt = new Date()
        }
      }),

      // Log Management
      addAgentLog: (agentId, log) => set((state) => {
        if (!state.agentLogs[agentId]) {
          state.agentLogs[agentId] = []
        }
        state.agentLogs[agentId].unshift(log)
        // Keep only last 1000 logs per agent
        if (state.agentLogs[agentId].length > 1000) {
          state.agentLogs[agentId] = state.agentLogs[agentId].slice(0, 1000)
        }
      }),

      clearAgentLogs: (agentId) => set((state) => {
        state.agentLogs[agentId] = []
      }),

      getAgentLogs: (agentId) => {
        return get().agentLogs[agentId] || []
      },

      // Filter Actions
      setSearchFilter: (search) => set((state) => {
        state.filters.search = search
      }),

      setStatusFilter: (status) => set((state) => {
        state.filters.status = status
      }),

      setTypeFilter: (type) => set((state) => {
        state.filters.type = type
      }),

      clearFilters: () => set((state) => {
        state.filters = {
          search: '',
          status: 'all',
          type: 'all'
        }
      }),

      // Async Actions
      startAgent: async (id) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))

          set((state) => {
            const index = state.agents.findIndex(a => a.id === id)
            if (index !== -1) {
              state.agents[index].status = 'active' as AgentStatus
              state.agents[index].lastActivity = new Date()
              state.agents[index].updatedAt = new Date()
            }
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.error = `Failed to start agent: ${error}`
            state.isLoading = false
          })
        }
      },

      stopAgent: async (id) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))

          set((state) => {
            const index = state.agents.findIndex(a => a.id === id)
            if (index !== -1) {
              state.agents[index].status = 'stopped' as AgentStatus
              state.agents[index].metrics = {
                ...state.agents[index].metrics,
                cpu: 0,
                memory: 0,
                requestsPerSecond: 0
              }
              state.agents[index].lastActivity = new Date()
              state.agents[index].updatedAt = new Date()
            }
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.error = `Failed to stop agent: ${error}`
            state.isLoading = false
          })
        }
      },

      restartAgent: async (id) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          // Simulate restart process
          set((state) => {
            const index = state.agents.findIndex(a => a.id === id)
            if (index !== -1) {
              state.agents[index].status = 'processing' as AgentStatus
            }
          })

          await new Promise(resolve => setTimeout(resolve, 2000))

          set((state) => {
            const index = state.agents.findIndex(a => a.id === id)
            if (index !== -1) {
              state.agents[index].status = 'active' as AgentStatus
              state.agents[index].lastActivity = new Date()
              state.agents[index].updatedAt = new Date()
            }
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.error = `Failed to restart agent: ${error}`
            state.isLoading = false
          })
        }
      },

      deployAgent: async (config) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          // Simulate deployment
          await new Promise(resolve => setTimeout(resolve, 3000))

          const newAgent: Agent = {
            id: `agent-${Date.now()}`,
            name: config.name,
            type: config.type,
            status: 'active' as AgentStatus,
            description: config.description,
            version: '1.0.0',
            config: config,
            metrics: {
              cpu: 0,
              memory: 0,
              requestsPerSecond: 0,
              errorRate: 0,
              avgResponseTime: 0,
              uptime: 0,
              totalRequests: 0,
              totalErrors: 0,
              lastUpdate: new Date()
            },
            dependencies: config.dependencies || [],
            lastActivity: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }

          set((state) => {
            state.agents.push(newAgent)
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.error = `Failed to deploy agent: ${error}`
            state.isLoading = false
          })
        }
      },

      // Computed Properties
      getFilteredAgents: () => {
        const { agents, filters } = get()

        return agents.filter(agent => {
          const matchesSearch = filters.search === '' ||
            agent.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            agent.type.toLowerCase().includes(filters.search.toLowerCase()) ||
            agent.description.toLowerCase().includes(filters.search.toLowerCase())

          const matchesStatus = filters.status === 'all' || agent.status === filters.status

          const matchesType = filters.type === 'all' || agent.type === filters.type

          return matchesSearch && matchesStatus && matchesType
        })
      },

      getAgentsByStatus: (status) => {
        return get().agents.filter(agent => agent.status === status)
      },

      getAgentMetrics: () => {
        const { agents } = get()

        if (agents.length === 0) {
          return {
            total: 0,
            active: 0,
            error: 0,
            avgCpu: 0,
            avgMemory: 0,
            totalRequests: 0
          }
        }

        const active = agents.filter(a => a.status === 'active').length
        const error = agents.filter(a => a.status === 'error').length
        const totalCpu = agents.reduce((sum, a) => sum + a.metrics.cpu, 0)
        const totalMemory = agents.reduce((sum, a) => sum + a.metrics.memory, 0)
        const totalRequests = agents.reduce((sum, a) => sum + a.metrics.totalRequests, 0)

        return {
          total: agents.length,
          active,
          error,
          avgCpu: totalCpu / agents.length,
          avgMemory: totalMemory / agents.length,
          totalRequests
        }
      }
    })),
    {
      name: 'agent-store',
      partialize: (state) => ({
        agents: state.agents,
        agentLogs: state.agentLogs,
        filters: state.filters
      })
    }
  )
)