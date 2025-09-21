"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/components/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Download, Maximize2, Pause, Play, RotateCcw } from "lucide-react"

interface DataPoint {
  timestamp: Date
  value: number
  label?: string
}

interface RealTimeChartProps {
  title: string
  description?: string
  data: DataPoint[]
  color?: string
  type?: 'line' | 'area'
  maxDataPoints?: number
  updateInterval?: number
  isRealTime?: boolean
  showControls?: boolean
  formatValue?: (value: number) => string
  formatTimestamp?: (timestamp: Date) => string
  className?: string
  height?: number
  onExport?: () => void
  onFullscreen?: () => void
}

export function RealTimeChart({
  title,
  description,
  data,
  color = "#3b82f6",
  type = "line",
  maxDataPoints = 50,
  updateInterval = 1000,
  isRealTime = true,
  showControls = true,
  formatValue = (value) => value.toString(),
  formatTimestamp = (timestamp) => timestamp.toLocaleTimeString(),
  className,
  height = 300,
  onExport,
  onFullscreen
}: RealTimeChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout>()

  // Convert data points to chart format
  useEffect(() => {
    const formattedData = data
      .slice(-maxDataPoints)
      .map((point, index) => ({
        time: formatTimestamp(point.timestamp),
        value: point.value,
        timestamp: point.timestamp.getTime(),
        label: point.label || formatValue(point.value)
      }))

    setChartData(formattedData)
  }, [data, maxDataPoints, formatValue, formatTimestamp])

  // Simulate real-time updates (if no real data stream)
  useEffect(() => {
    if (!isRealTime || isPaused) return

    intervalRef.current = setInterval(() => {
      // This would typically be replaced with actual WebSocket data
      setIsConnected(Math.random() > 0.1) // Simulate occasional disconnections
    }, updateInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRealTime, isPaused, updateInterval])

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setChartData([])
  }

  const handleExport = () => {
    if (onExport) {
      onExport()
    } else {
      // Default export functionality
      const csvData = chartData.map(point =>
        `${point.time},${point.value}`
      ).join('\n')

      const blob = new Blob([`Time,Value\n${csvData}`], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_data.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className="text-sm text-muted-foreground">
            {`Value: ${formatValue(payload[0].value)}`}
          </p>
        </div>
      )
    }
    return null
  }

  const ChartComponent = type === 'area' ? AreaChart : LineChart

  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {title}
            {isRealTime && (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected && !isPaused ? "bg-green-500 animate-pulse" : "bg-red-500"
                )} />
                <Badge variant={isConnected && !isPaused ? "success" : "destructive"} className="text-xs">
                  {isPaused ? "Paused" : isConnected ? "Live" : "Disconnected"}
                </Badge>
              </div>
            )}
          </CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            {isRealTime && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePauseResume}
                  className="h-8 w-8 p-0"
                >
                  {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="h-8 w-8 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
            {onFullscreen && (
              <Button
                size="sm"
                variant="outline"
                onClick={onFullscreen}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatValue}
              />
              <Tooltip content={customTooltip} />

              {type === 'area' ? (
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: color }}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: color }}
                />
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>

        {/* Chart Stats */}
        {chartData.length > 0 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex gap-4">
              <span>
                Latest: {formatValue(chartData[chartData.length - 1]?.value || 0)}
              </span>
              <span>
                Points: {chartData.length}/{maxDataPoints}
              </span>
            </div>
            {isRealTime && (
              <span>
                Update: {updateInterval / 1000}s
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}