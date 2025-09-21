'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, MoreVertical, Play, Pause, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Agent {
  id: number;
  name: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  cpu: number;
  memory: number;
  tasks: number;
}

interface AgentStatusCardProps {
  agent: Agent;
}

export default function AgentStatusCard({ agent }: AgentStatusCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    active: 'bg-green-400',
    idle: 'bg-yellow-400',
    processing: 'bg-blue-400',
    error: 'bg-red-400',
  };

  const statusGlow = {
    active: 'shadow-green-400/50',
    idle: 'shadow-yellow-400/50',
    processing: 'shadow-blue-400/50',
    error: 'shadow-red-400/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -8,
        scale: 1.05,
        rotateX: 10,
        rotateY: -10,
        transition: { type: "spring", stiffness: 300 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass glass-hover glass-3d glow p-4 rounded-xl relative overflow-hidden cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: `0 8px 32px rgba(31, 38, 135, 0.37), 0 0 60px ${statusGlow[agent.status]}`
      }}
    >
      {/* Background Gradient Animation */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        style={{
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-pink))',
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white mb-1 truncate">
            {agent.name}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full animate-pulse',
                statusColors[agent.status],
                `shadow-lg ${statusGlow[agent.status]}`
              )}
            />
            <span className="text-xs text-white/60 capitalize">{agent.status}</span>
          </div>
        </div>
        <button className="glass-button p-1.5 rounded-lg">
          <MoreVertical className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Metrics */}
      <div className="space-y-3 relative z-10">
        {/* CPU Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span className="text-xs text-white/70">CPU</span>
            </div>
            <span className="text-xs font-medium text-cyan-400">{agent.cpu}%</span>
          </div>
          <div className="glass-progress h-2">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${agent.cpu}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                background: `linear-gradient(90deg,
                  ${agent.cpu > 80 ? '#ef4444' : agent.cpu > 60 ? '#fbbf24' : '#00ffff'},
                  ${agent.cpu > 80 ? '#dc2626' : agent.cpu > 60 ? '#f59e0b' : '#06b6d4'})`,
              }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-white/70">Memory</span>
            </div>
            <span className="text-xs font-medium text-purple-400">{agent.memory}%</span>
          </div>
          <div className="glass-progress h-2">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${agent.memory}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
              style={{
                background: `linear-gradient(90deg,
                  ${agent.memory > 80 ? '#ef4444' : agent.memory > 60 ? '#fbbf24' : '#ff00ff'},
                  ${agent.memory > 80 ? '#dc2626' : agent.memory > 60 ? '#f59e0b' : '#a855f7'})`,
              }}
            />
          </div>
        </div>

        {/* Tasks Processed */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-white/50" />
            <span className="text-xs text-white/70">Tasks</span>
          </div>
          <span className="text-xs font-bold text-gradient">{agent.tasks}</span>
        </div>
      </div>

      {/* Action Buttons (Visible on Hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-2 left-2 right-2 flex gap-2"
          >
            <button className="flex-1 glass-button py-1 px-2 rounded-lg flex items-center justify-center gap-1">
              {agent.status === 'active' ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span className="text-xs">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span className="text-xs">Start</span>
                </>
              )}
            </button>
            <button className="glass-button p-1 rounded-lg">
              <RefreshCw className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Effect Shadow */}
      <div
        className="absolute inset-0 rounded-xl opacity-20 -z-10 blur-xl"
        style={{
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-pink))',
          transform: 'translateZ(-20px) scale(0.9)',
        }}
      />
    </motion.div>
  );
}

const AnimatePresence = ({ children }: { children: React.ReactNode }) => children;