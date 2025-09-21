"use client"

import React, { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/components/lib/utils"
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  EdgeChange,
  NodeChange,
  ReactFlowProvider,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'

import {
  Play,
  Square,
  MessageSquare,
  GitBranch,
  Clock,
  Zap,
  Save,
  Download,
  Upload,
  Trash2,
  Plus
} from 'lucide-react'

// Custom Node Types
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  message: MessageNode,
  condition: ConditionNode,
  wait: WaitNode,
  action: ActionNode
}

interface WorkflowBuilderProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onSave?: (nodes: Node[], edges: Edge[]) => void
  onTest?: (nodes: Node[], edges: Edge[]) => void
  className?: string
  readOnly?: boolean
}

// Node Components
function StartNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-green-100 border-2 border-green-200">
      <div className="flex items-center">
        <Play className="w-4 h-4 mr-2 text-green-600" />
        <div className="ml-2">
          <div className="text-lg font-bold text-green-800">Start</div>
        </div>
      </div>
    </div>
  )
}

function EndNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-red-100 border-2 border-red-200">
      <div className="flex items-center">
        <Square className="w-4 h-4 mr-2 text-red-600" />
        <div className="ml-2">
          <div className="text-lg font-bold text-red-800">End</div>
        </div>
      </div>
    </div>
  )
}

function MessageNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-blue-100 border-2 border-blue-200 min-w-[200px]">
      <div className="flex items-center">
        <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
        <div className="ml-2">
          <div className="text-lg font-bold text-blue-800">Message</div>
          <div className="text-sm text-blue-600">{data.label || 'Send Message'}</div>
        </div>
      </div>
    </div>
  )
}

function ConditionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-yellow-100 border-2 border-yellow-200 min-w-[150px]">
      <div className="flex items-center">
        <GitBranch className="w-4 h-4 mr-2 text-yellow-600" />
        <div className="ml-2">
          <div className="text-lg font-bold text-yellow-800">Condition</div>
          <div className="text-sm text-yellow-600">{data.label || 'If/Then'}</div>
        </div>
      </div>
    </div>
  )
}

function WaitNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-purple-100 border-2 border-purple-200 min-w-[150px]">
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2 text-purple-600" />
        <div className="ml-2">
          <div className="text-lg font-bold text-purple-800">Wait</div>
          <div className="text-sm text-purple-600">{data.label || 'Delay Action'}</div>
        </div>
      </div>
    </div>
  )
}

function ActionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-orange-100 border-2 border-orange-200 min-w-[150px]">
      <div className="flex items-center">
        <Zap className="w-4 h-4 mr-2 text-orange-600" />
        <div className="ml-2">
          <div className="text-lg font-bold text-orange-800">Action</div>
          <div className="text-sm text-orange-600">{data.label || 'Execute Action'}</div>
        </div>
      </div>
    </div>
  )
}

export function WorkflowBuilder({
  initialNodes = [],
  initialEdges = [],
  onSave,
  onTest,
  className,
  readOnly = false
}: WorkflowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeType, setSelectedNodeType] = useState<string>('message')
  const [workflowName, setWorkflowName] = useState('New Workflow')
  const [isExecuting, setIsExecuting] = useState(false)

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowInstance || readOnly) return

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: Node = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, nodes.length, setNodes, readOnly]
  )

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, edges)
    }
  }

  const handleTest = async () => {
    if (onTest) {
      setIsExecuting(true)
      try {
        await onTest(nodes, edges)
      } finally {
        setIsExecuting(false)
      }
    }
  }

  const handleClear = () => {
    setNodes([])
    setEdges([])
  }

  const handleExport = () => {
    const workflow = {
      name: workflowName,
      nodes,
      edges,
      timestamp: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${workflowName.replace(/\s+/g, '_').toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const nodeTypeOptions = [
    { type: 'message', label: 'Message', icon: MessageSquare, color: 'blue' },
    { type: 'condition', label: 'Condition', icon: GitBranch, color: 'yellow' },
    { type: 'wait', label: 'Wait', icon: Clock, color: 'purple' },
    { type: 'action', label: 'Action', icon: Zap, color: 'orange' }
  ]

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none p-0 h-auto focus:ring-0"
              readOnly={readOnly}
            />
            <Badge variant="outline">
              {nodes.length} nodes, {edges.length} connections
            </Badge>
          </div>
          <CardDescription>
            Drag and drop nodes to build your workflow
          </CardDescription>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTest}
              disabled={isExecuting || nodes.length === 0}
            >
              <Play className="w-4 h-4 mr-1" />
              {isExecuting ? 'Testing...' : 'Test'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              disabled={nodes.length === 0}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={nodes.length === 0}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 gap-4 p-0">
        {/* Node Palette */}
        {!readOnly && (
          <div className="w-64 border-r p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Workflow Nodes</h3>
              <div className="space-y-2">
                {nodeTypeOptions.map(({ type, label, icon: Icon, color }) => (
                  <div
                    key={type}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border-2 border-dashed cursor-move",
                      `border-${color}-200 bg-${color}-50 hover:bg-${color}-100`
                    )}
                    onDragStart={(event) => onDragStart(event, type)}
                    draggable
                  >
                    <Icon className={`w-4 h-4 text-${color}-600`} />
                    <span className={`text-sm font-medium text-${color}-800`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Special Nodes</h3>
              <div className="space-y-2">
                <div
                  className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-green-200 bg-green-50 hover:bg-green-100 cursor-move"
                  onDragStart={(event) => onDragStart(event, 'start')}
                  draggable
                >
                  <Play className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Start</span>
                </div>
                <div
                  className="flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-red-200 bg-red-50 hover:bg-red-100 cursor-move"
                  onDragStart={(event) => onDragStart(event, 'end')}
                  draggable
                >
                  <Square className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">End</span>
                </div>
              </div>
            </div>

            {!readOnly && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="w-full"
                  disabled={nodes.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Workflow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <MiniMap />
            <Background />

            {isExecuting && (
              <Panel position="top-center">
                <Badge className="bg-blue-500 text-white animate-pulse">
                  Executing Workflow...
                </Badge>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  )
}

// Wrapper component to provide ReactFlow context
export function WorkflowBuilderProvider(props: WorkflowBuilderProps) {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder {...props} />
    </ReactFlowProvider>
  )
}