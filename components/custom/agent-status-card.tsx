"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/components/lib/utils"
import { Agent, AgentStatus } from "@/types"
import { Activity, Cpu, MemoryStick, Zap, Settings, Play, Square, RotateCcw } from "lucide-react"

interface AgentStatusCardProps {
  agent: Agent
  onStart?: (agentId: string) => void
  onStop?: (agentId: string) => void
  onRestart?: (agentId: string) => void
  onConfigure?: (agentId: string) => void
  className?: string
}

const statusConfig = {
  [AgentStatus.ACTIVE]: {
    color: "success",
    icon: Activity,
    label: "Active",
    bgColor: "bg-green-500/10 border-green-500/20"
  },
  [AgentStatus.IDLE]: {
    color: "secondary",
    icon: Zap,
    label: "Idle",
    bgColor: "bg-gray-500/10 border-gray-500/20"
  },
  [AgentStatus.PROCESSING]: {
    color: "info",
    icon: Activity,
    label: "Processing",
    bgColor: "bg-blue-500/10 border-blue-500/20"
  },
  [AgentStatus.ERROR]: {
    color: "destructive",
    icon: Activity,
    label: "Error",
    bgColor: "bg-red-500/10 border-red-500/20"
  },
  [AgentStatus.MAINTENANCE]: {
    color: "warning",
    icon: Settings,
    label: "Maintenance",
    bgColor: "bg-yellow-500/10 border-yellow-500/20"
  },
  [AgentStatus.STOPPED]: {
    color: "outline",
    icon: Square,
    label: "Stopped",
    bgColor: "bg-gray-500/10 border-gray-500/20"
  }
}

export function AgentStatusCard({
  agent,
  onStart,
  onStop,
  onRestart,
  onConfigure,
  className
}: AgentStatusCardProps) {
  const config = statusConfig[agent.status]
  const StatusIcon = config.icon

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / (24 * 60 * 60))
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((uptime % (60 * 60)) / 60)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getPerformanceColor = (value: number, type: 'cpu' | 'memory' | 'error') => {
    if (type === 'error') {
      if (value > 5) return 'text-red-500'
      if (value > 1) return 'text-yellow-500'
      return 'text-green-500'
    }

    if (value > 80) return 'text-red-500'
    if (value > 60) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
      config.bgColor,
      className
    )}>
      {/* Status indicator */}
      <div className="absolute top-2 right-2">
        <Badge variant={config.color as any} className="flex items-center gap-1">
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </Badge>
      </div>

      {/* Pulse animation for active status */}
      {agent.status === AgentStatus.ACTIVE && (
        <div className="absolute top-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {agent.name}
            </CardTitle>
            <CardDescription className="text-sm">
              {agent.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">CPU</span>
              </div>
              <span className={getPerformanceColor(agent.metrics.cpu, 'cpu')}>
                {agent.metrics.cpu.toFixed(1)}%
              </span>
            </div>
            <Progress value={agent.metrics.cpu} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <MemoryStick className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Memory</span>
              </div>
              <span className={getPerformanceColor(agent.metrics.memory, 'memory')}>
                {agent.metrics.memory.toFixed(1)}%
              </span>
            </div>
            <Progress value={agent.metrics.memory} className="h-2" />
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold">
              {agent.metrics.requestsPerSecond.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">RPS</div>
          </div>
          <div className="space-y-1">
            <div className={cn(
              "text-lg font-semibold",
              getPerformanceColor(agent.metrics.errorRate, 'error')
            )}>
              {agent.metrics.errorRate.toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground">Error Rate</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold">
              {formatUptime(agent.metrics.uptime)}
            </div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Avg Response Time:</span>
            <span>{agent.metrics.avgResponseTime}ms</span>
          </div>
          <div className="flex justify-between">
            <span>Total Requests:</span>
            <span>{agent.metrics.totalRequests.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Version:</span>
            <span>{agent.version}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        {agent.status === AgentStatus.STOPPED ? (
          <Button
            size="sm"
            variant="default"
            onClick={() => onStart?.(agent.id)}
            className="flex-1"
          >
            <Play className="w-3 h-3 mr-1" />
            Start
          </Button>
        ) : (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onStop?.(agent.id)}
            className="flex-1"
          >
            <Square className="w-3 h-3 mr-1" />
            Stop
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => onRestart?.(agent.id)}
          disabled={agent.status === AgentStatus.STOPPED}
        >
          <RotateCcw className="w-3 h-3" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onConfigure?.(agent.id)}
        >
          <Settings className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}