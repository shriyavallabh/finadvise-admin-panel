"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AgentStatusCard } from "@/components/custom/agent-status-card"
import { RealTimeChart } from "@/components/custom/real-time-chart"
import { LogViewer } from "@/components/custom/log-viewer"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/components/lib/utils"
import { Agent, AgentStatus, LogEntry } from "@/types"
import {
  Search,
  Filter,
  Plus,
  Settings,
  Play,
  Square,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from "lucide-react"

interface AgentManagementProps {
  className?: string
}

// Mock data
const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Content Generator',
    type: 'content_generator' as any,
    status: 'active' as any,
    description: 'Generates personalized financial advisory content using AI',
    version: '2.1.4',
    config: {
      environment: { NODE_ENV: 'production' },
      parameters: { maxTokens: 2000, temperature: 0.7 },
      retryPolicy: { maxRetries: 3, backoffStrategy: 'exponential', initialDelay: 1000, maxDelay: 10000 },
      resources: { maxCpu: 80, maxMemory: 1024, maxConcurrency: 10 }
    },
    metrics: {
      cpu: 45.2,
      memory: 68.1,
      requestsPerSecond: 23.4,
      errorRate: 0.1,
      avgResponseTime: 156,
      uptime: 86400,
      totalRequests: 15420,
      totalErrors: 12,
      lastUpdate: new Date()
    },
    dependencies: ['database', 'redis'],
    lastActivity: new Date(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'agent-2',
    name: 'Distribution Manager',
    type: 'distribution_manager' as any,
    status: 'processing' as any,
    description: 'Manages message distribution across WhatsApp and LinkedIn',
    version: '1.8.2',
    config: {
      environment: { NODE_ENV: 'production' },
      parameters: { batchSize: 100, rateLimitPerMinute: 1000 },
      retryPolicy: { maxRetries: 5, backoffStrategy: 'linear', initialDelay: 500, maxDelay: 5000 },
      resources: { maxCpu: 90, maxMemory: 2048, maxConcurrency: 20 }
    },
    metrics: {
      cpu: 72.8,
      memory: 54.3,
      requestsPerSecond: 45.7,
      errorRate: 0.3,
      avgResponseTime: 89,
      uptime: 72000,
      totalRequests: 28940,
      totalErrors: 87,
      lastUpdate: new Date()
    },
    dependencies: ['whatsapp-api', 'linkedin-api'],
    lastActivity: new Date(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'agent-3',
    name: 'Compliance Validator',
    type: 'compliance_validator' as any,
    status: 'idle' as any,
    description: 'Validates content for regulatory compliance',
    version: '3.0.1',
    config: {
      environment: { NODE_ENV: 'production' },
      parameters: { strictMode: true, regulationSet: 'FINRA' },
      retryPolicy: { maxRetries: 1, backoffStrategy: 'fixed', initialDelay: 2000, maxDelay: 2000 },
      resources: { maxCpu: 50, maxMemory: 512, maxConcurrency: 5 }
    },
    metrics: {
      cpu: 12.1,
      memory: 32.5,
      requestsPerSecond: 8.2,
      errorRate: 0.0,
      avgResponseTime: 234,
      uptime: 95000,
      totalRequests: 5640,
      totalErrors: 0,
      lastUpdate: new Date()
    },
    dependencies: ['regulation-db'],
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
]

const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    level: 'info',
    message: 'Content generation completed successfully',
    agent: 'Content Generator',
    timestamp: new Date(),
    metadata: { requestId: 'req-123', duration: '245ms' }
  },
  {
    id: 'log-2',
    level: 'warn',
    message: 'High memory usage detected',
    agent: 'Distribution Manager',
    timestamp: new Date(Date.now() - 60000),
    metadata: { memory: '85%', threshold: '80%' }
  },
  {
    id: 'log-3',
    level: 'error',
    message: 'Failed to connect to WhatsApp API',
    agent: 'Distribution Manager',
    timestamp: new Date(Date.now() - 120000),
    metadata: { error: 'Connection timeout', retries: 3 }
  }
]

export function AgentManagement({ className }: AgentManagementProps) {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)

  // Filter agents based on search and status
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [agents, searchTerm, statusFilter])

  // Generate mock performance data
  const generatePerformanceData = (agent: Agent) => {
    return Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (30 - i) * 60000),
      value: Math.random() * 20 + agent.metrics.cpu - 10
    }))
  }

  const handleAgentAction = async (agentId: string, action: 'start' | 'stop' | 'restart' | 'configure' | 'delete') => {
    console.log(`${action} agent ${agentId}`)

    if (action === 'configure') {
      const agent = agents.find(a => a.id === agentId)
      if (agent) {
        setSelectedAgent(agent)
        setIsConfigDialogOpen(true)
      }
      return
    }

    if (action === 'delete') {
      setAgents(prev => prev.filter(a => a.id !== agentId))
      return
    }

    // Update agent status
    setAgents(prev => prev.map(agent => {
      if (agent.id !== agentId) return agent

      let newStatus: AgentStatus
      switch (action) {
        case 'start':
          newStatus = 'active' as AgentStatus
          break
        case 'stop':
          newStatus = 'stopped' as AgentStatus
          break
        case 'restart':
          newStatus = 'processing' as AgentStatus
          // Simulate restart delay
          setTimeout(() => {
            setAgents(prev => prev.map(a =>
              a.id === agentId ? { ...a, status: 'active' as AgentStatus } : a
            ))
          }, 2000)
          break
        default:
          newStatus = agent.status
      }

      return {
        ...agent,
        status: newStatus,
        lastActivity: new Date(),
        updatedAt: new Date()
      }
    }))
  }

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing': return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'idle': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const statusCounts = {
    all: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    processing: agents.filter(a => a.status === 'processing').length,
    idle: agents.filter(a => a.status === 'idle').length,
    error: agents.filter(a => a.status === 'error').length,
    stopped: agents.filter(a => a.status === 'stopped').length
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
          <p className="text-muted-foreground">
            Monitor and control your AI agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Import Config
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export Config
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Deploy Agent
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="active">Active ({statusCounts.active})</option>
                <option value="processing">Processing ({statusCounts.processing})</option>
                <option value="idle">Idle ({statusCounts.idle})</option>
                <option value="error">Error ({statusCounts.error})</option>
                <option value="stopped">Stopped ({statusCounts.stopped})</option>
              </select>
            </div>

            <div className="flex items-center border rounded-md p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="h-6 px-2"
              >
                Grid
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                onClick={() => setViewMode('table')}
                className="h-6 px-2"
              >
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent List */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map(agent => (
            <AgentStatusCard
              key={agent.id}
              agent={agent}
              onStart={(id) => handleAgentAction(id, 'start')}
              onStop={(id) => handleAgentAction(id, 'stop')}
              onRestart={(id) => handleAgentAction(id, 'restart')}
              onConfigure={(id) => handleAgentAction(id, 'configure')}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Agent Details</CardTitle>
            <CardDescription>
              Detailed view of all agents and their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead>RPS</TableHead>
                  <TableHead>Error Rate</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map(agent => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {agent.type.replace('_', ' ')} v{agent.version}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        <Badge variant={
                          agent.status === 'active' ? 'success' :
                          agent.status === 'error' ? 'destructive' :
                          'secondary'
                        }>
                          {agent.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{agent.metrics.cpu.toFixed(1)}%</TableCell>
                    <TableCell>{agent.metrics.memory.toFixed(1)}%</TableCell>
                    <TableCell>{agent.metrics.requestsPerSecond.toFixed(1)}</TableCell>
                    <TableCell>{agent.metrics.errorRate.toFixed(2)}%</TableCell>
                    <TableCell>
                      {Math.floor(agent.metrics.uptime / 3600)}h {Math.floor((agent.metrics.uptime % 3600) / 60)}m
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {agent.status === 'stopped' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAgentAction(agent.id, 'start')}
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAgentAction(agent.id, 'stop')}
                          >
                            <Square className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAgentAction(agent.id, 'restart')}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAgentAction(agent.id, 'configure')}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Detailed View */}
      {selectedAgent && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance Charts */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedAgent.name} Performance</CardTitle>
              <CardDescription>
                Real-time performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="cpu">
                <TabsList>
                  <TabsTrigger value="cpu">CPU Usage</TabsTrigger>
                  <TabsTrigger value="memory">Memory</TabsTrigger>
                  <TabsTrigger value="throughput">Throughput</TabsTrigger>
                </TabsList>

                <TabsContent value="cpu">
                  <RealTimeChart
                    title="CPU Usage"
                    data={generatePerformanceData(selectedAgent)}
                    color="#3b82f6"
                    height={250}
                    formatValue={(value) => `${value.toFixed(1)}%`}
                  />
                </TabsContent>

                <TabsContent value="memory">
                  <RealTimeChart
                    title="Memory Usage"
                    data={generatePerformanceData(selectedAgent)}
                    color="#10b981"
                    height={250}
                    formatValue={(value) => `${value.toFixed(1)}%`}
                  />
                </TabsContent>

                <TabsContent value="throughput">
                  <RealTimeChart
                    title="Request Throughput"
                    data={generatePerformanceData(selectedAgent)}
                    color="#f59e0b"
                    height={250}
                    formatValue={(value) => `${value.toFixed(1)} RPS`}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Logs */}
          <LogViewer
            logs={logs.filter(log => log.agent === selectedAgent.name)}
            title={`${selectedAgent.name} Logs`}
            height={400}
          />
        </div>
      )}

      {/* Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure {selectedAgent?.name}</DialogTitle>
            <DialogDescription>
              Modify agent configuration parameters
            </DialogDescription>
          </DialogHeader>

          {selectedAgent && (
            <div className="space-y-4">
              <Tabs defaultValue="parameters">
                <TabsList>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="retry">Retry Policy</TabsTrigger>
                </TabsList>

                <TabsContent value="parameters" className="space-y-3">
                  {Object.entries(selectedAgent.config.parameters || {}).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-2">
                      <label className="text-sm font-medium">{key}</label>
                      <Input
                        value={String(value)}
                        onChange={(e) => {
                          // Update configuration logic
                        }}
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="resources" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm font-medium">Max CPU (%)</label>
                    <Input
                      type="number"
                      value={selectedAgent.config.resources.maxCpu}
                      max={100}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm font-medium">Max Memory (MB)</label>
                    <Input
                      type="number"
                      value={selectedAgent.config.resources.maxMemory}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm font-medium">Max Concurrency</label>
                    <Input
                      type="number"
                      value={selectedAgent.config.resources.maxConcurrency}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="retry" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm font-medium">Max Retries</label>
                    <Input
                      type="number"
                      value={selectedAgent.config.retryPolicy.maxRetries}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm font-medium">Strategy</label>
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option value="exponential">Exponential</option>
                      <option value="linear">Linear</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsConfigDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}