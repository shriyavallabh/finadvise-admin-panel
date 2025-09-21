"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/components/lib/utils"
import { LogEntry } from "@/types"
import { Search, Download, Trash2, Pause, Play, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { FixedSizeList as List } from 'react-window'

interface LogViewerProps {
  logs: LogEntry[]
  title?: string
  height?: number
  showSearch?: boolean
  showFilters?: boolean
  showControls?: boolean
  isRealTime?: boolean
  maxLines?: number
  onClear?: () => void
  onExport?: () => void
  className?: string
}

const levelColors = {
  error: 'text-red-500 bg-red-500/10',
  warn: 'text-yellow-500 bg-yellow-500/10',
  info: 'text-blue-500 bg-blue-500/10',
  debug: 'text-gray-500 bg-gray-500/10'
}

const levelBadgeColors = {
  error: 'destructive',
  warn: 'warning',
  info: 'info',
  debug: 'secondary'
}

export function LogViewer({
  logs,
  title = "System Logs",
  height = 400,
  showSearch = true,
  showFilters = true,
  showControls = true,
  isRealTime = true,
  maxLines = 1000,
  onClear,
  onExport,
  className
}: LogViewerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set(['error', 'warn', 'info', 'debug']))
  const [isPaused, setIsPaused] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

  const listRef = useRef<List>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter and search logs
  const filteredLogs = useMemo(() => {
    let filtered = logs
      .filter(log => selectedLevels.has(log.level))
      .slice(-maxLines)

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(term) ||
        log.agent?.toLowerCase().includes(term) ||
        log.id.toLowerCase().includes(term)
      )
    }

    return filtered.reverse() // Show newest first
  }, [logs, selectedLevels, searchTerm, maxLines])

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && !isPaused && listRef.current) {
      listRef.current.scrollToItem(0, 'start')
    }
  }, [filteredLogs, autoScroll, isPaused])

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    })
  }

  const handleLevelToggle = (level: string) => {
    const newLevels = new Set(selectedLevels)
    if (newLevels.has(level)) {
      newLevels.delete(level)
    } else {
      newLevels.add(level)
    }
    setSelectedLevels(newLevels)
  }

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const handleExport = () => {
    if (onExport) {
      onExport()
    } else {
      const logText = filteredLogs
        .reverse()
        .map(log => `[${formatTimestamp(log.timestamp)}] [${log.level.toUpperCase()}] ${log.agent ? `[${log.agent}] ` : ''}${log.message}`)
        .join('\n')

      const blob = new Blob([logText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `logs_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const LogItem = ({ index, style }: { index: number; style: any }) => {
    const log = filteredLogs[index]
    const isExpanded = expandedLogs.has(log.id)
    const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0

    return (
      <div style={style} className="px-4 py-1 border-b border-border/50 hover:bg-muted/30">
        <div className="flex items-start gap-2 text-sm font-mono">
          <span className="text-muted-foreground shrink-0 min-w-[80px]">
            {formatTimestamp(log.timestamp)}
          </span>

          <Badge
            variant={levelBadgeColors[log.level] as any}
            className="shrink-0 text-xs min-w-[50px] justify-center"
          >
            {log.level.toUpperCase()}
          </Badge>

          {log.agent && (
            <span className="text-muted-foreground shrink-0 min-w-[100px] truncate">
              [{log.agent}]
            </span>
          )}

          <div className="flex-1 min-w-0">
            <div className={cn(
              "break-words",
              levelColors[log.level]
            )}>
              {log.message}
            </div>

            {hasMetadata && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLogExpansion(log.id)}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show details
                  </>
                )}
              </Button>
            )}

            {isExpanded && hasMetadata && (
              <div className="mt-2 p-2 bg-muted/50 rounded-md border">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {title}
            {isRealTime && (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  !isPaused ? "bg-green-500 animate-pulse" : "bg-red-500"
                )} />
                <Badge variant={!isPaused ? "success" : "destructive"} className="text-xs">
                  {isPaused ? "Paused" : "Live"}
                </Badge>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            {filteredLogs.length} of {logs.length} log entries
          </CardDescription>
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            {isRealTime && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPaused(!isPaused)}
                className="h-8 w-8 p-0"
              >
                {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="h-8 w-8 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
            {onClear && (
              <Button
                size="sm"
                variant="outline"
                onClick={onClear}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-col space-y-4 flex-1">
        {/* Search and Filters */}
        <div className="space-y-3">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {showFilters && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Levels:</span>
              {Object.keys(levelColors).map(level => (
                <Button
                  key={level}
                  size="sm"
                  variant={selectedLevels.has(level) ? "default" : "outline"}
                  onClick={() => handleLevelToggle(level)}
                  className="h-7 text-xs"
                >
                  {level.toUpperCase()}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Log List */}
        <div
          ref={containerRef}
          className="flex-1 border rounded-md bg-background/50"
          style={{ height }}
        >
          {filteredLogs.length > 0 ? (
            <List
              ref={listRef}
              height={height}
              itemCount={filteredLogs.length}
              itemSize={60}
              overscanCount={10}
            >
              {LogItem}
            </List>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="text-sm">No logs match your criteria</div>
                {searchTerm && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="text-xs"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Auto-scroll toggle */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded"
            />
            Auto-scroll to new logs
          </label>
          <span>
            Max {maxLines} lines
          </span>
        </div>
      </CardContent>
    </Card>
  )
}