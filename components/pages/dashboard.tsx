"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentStatusCard } from "@/components/custom/agent-status-card"
import { RealTimeChart } from "@/components/custom/real-time-chart"
import { cn } from "@/components/lib/utils"
import { Agent, OverviewMetrics, SystemAlert } from "@/types"
import {
  Activity,
  Users,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Settings,
  RefreshCw,
  Plus
} from "lucide-react"

interface DashboardProps {
  className?: string
}

// Mock data - replace with real API calls
const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Content Generator',
    type: 'content_generator' as any,
    status: 'active' as any,
    description: 'Generates personalized content',
    version: '2.1.4',
    config: {} as any,
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
    dependencies: [],
    lastActivity: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'agent-2',
    name: 'Distribution Manager',
    type: 'distribution_manager' as any,
    status: 'processing' as any,
    description: 'Manages message distribution',
    version: '1.8.2',
    config: {} as any,
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
    dependencies: [],
    lastActivity: new Date(),
    updatedAt: new Date(),
    createdAt: new Date()
  },
  {
    id: 'agent-3',
    name: 'Compliance Validator',
    type: 'compliance_validator' as any,
    status: 'idle' as any,
    description: 'Validates content compliance',
    version: '3.0.1',
    config: {} as any,
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
    dependencies: [],
    lastActivity: new Date(),
    updatedAt: new Date(),
    createdAt: new Date()
  },
  {
    id: 'agent-4',
    name: 'Analytics Processor',
    type: 'analytics_processor' as any,
    status: 'error' as any,
    description: 'Processes analytics data',
    version: '1.5.3',
    config: {} as any,
    metrics: {
      cpu: 0,
      memory: 0,
      requestsPerSecond: 0,
      errorRate: 100,
      avgResponseTime: 0,
      uptime: 0,
      totalRequests: 12340,
      totalErrors: 1234,
      lastUpdate: new Date()
    },
    dependencies: [],
    lastActivity: new Date(),
    updatedAt: new Date(),
    createdAt: new Date()
  }
]

const mockOverviewMetrics: OverviewMetrics = {
  totalMessages: 45789,
  activeAgents: 3,
  activeCampaigns: 12,
  totalAdvisors: 234,
  deliveryRate: 97.8,
  engagementRate: 23.4,
  systemHealth: 92,
  period: {
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date()
  }
}

const mockAlerts: SystemAlert[] = [
  {
    id: 'alert-1',
    type: 'error',
    title: 'Agent Failure',
    message: 'Analytics Processor has crashed and needs attention',
    severity: 'critical',
    source: 'agent-4',
    timestamp: new Date(),
    acknowledged: false
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'High Memory Usage',
    message: 'Distribution Manager memory usage is above 80%',
    severity: 'medium',
    source: 'agent-2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    acknowledged: false
  }
]

export function Dashboard({ className }: DashboardProps) {
  const [overview, setOverview] = useState<OverviewMetrics>(mockOverviewMetrics)
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockAlerts)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')

  // Generate mock chart data
  const generateChartData = (points: number) => {
    return Array.from({ length: points }, (_, i) => ({
      timestamp: new Date(Date.now() - (points - i) * 60000),
      value: Math.random() * 100 + Math.sin(i / 10) * 20 + 50
    }))
  }

  const [chartData, setChartData] = useState({
    messages: generateChartData(50),
    performance: generateChartData(50),
    errors: generateChartData(50)
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleAgentAction = (agentId: string, action: 'start' | 'stop' | 'restart' | 'configure') => {
    console.log(`${action} agent ${agentId}`)
    // Implement agent control logic
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const getSystemHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-500'
    if (health >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const activeAgentsCount = agents.filter(agent => agent.status === 'active').length
  const criticalAlerts = alerts.filter(alert => !alert.acknowledged && alert.severity === 'critical').length

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and control your FinAdvise AI system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-1", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Alerts ({criticalAlerts})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts
                .filter(alert => !alert.acknowledged && alert.severity === 'critical')
                .map(alert => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 bg-white rounded-md border"
                  >
                    <div>
                      <div className="font-medium text-red-800">{alert.title}</div>
                      <div className="text-sm text-red-600">{alert.message}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getSystemHealthColor(overview.systemHealth))}>
              {overview.systemHealth}%
            </div>
            <p className="text-xs text-muted-foreground">
              {activeAgentsCount} of {agents.length} agents active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {overview.deliveryRate}% delivery rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {overview.engagementRate}% engagement rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Advisors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalAdvisors}</div>
            <p className="text-xs text-muted-foreground">
              +12 new this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Agent Grid */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
              <CardDescription>
                Real-time monitoring of all AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {agents.map(agent => (
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
            </CardContent>
          </Card>

          {/* Performance Charts */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>
                Real-time system metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <TabsList>
                  <TabsTrigger value="1h">1 Hour</TabsTrigger>
                  <TabsTrigger value="24h">24 Hours</TabsTrigger>
                  <TabsTrigger value="7d">7 Days</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTimeRange} className="space-y-4">
                  <div className="grid gap-4">
                    <RealTimeChart
                      title="Message Throughput"
                      description="Messages processed per minute"
                      data={chartData.messages}
                      color="#3b82f6"
                      type="area"
                      height={200}
                      formatValue={(value) => `${value.toFixed(0)} msg/min`}
                    />

                    <RealTimeChart
                      title="System Performance"
                      description="Overall system performance score"
                      data={chartData.performance}
                      color="#10b981"
                      height={200}
                      formatValue={(value) => `${value.toFixed(1)}%`}
                    />

                    <RealTimeChart
                      title="Error Rate"
                      description="System-wide error rate"
                      data={chartData.errors}
                      color="#ef4444"
                      height={200}
                      formatValue={(value) => `${value.toFixed(2)}%`}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">API Services</span>
                </div>
                <Badge variant="success">Operational</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Database</span>
                </div>
                <Badge variant="success">Operational</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Cache</span>
                </div>
                <Badge variant="warning">Degraded</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">WebSocket</span>
                </div>
                <Badge variant="info">Connected</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="space-y-1">
                    <p className="text-sm">Campaign "Daily Updates" launched</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="space-y-1">
                    <p className="text-sm">New template approved</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="space-y-1">
                    <p className="text-sm">Analytics Agent error resolved</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="space-y-1">
                    <p className="text-sm">System maintenance scheduled</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Template
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Add Advisor
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}