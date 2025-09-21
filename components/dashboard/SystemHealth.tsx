'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, HardDrive, Wifi, Database, Server, Shield,
  Activity, Zap, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemMetric {
  name: string;
  icon: React.ReactNode;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
}

export default function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      name: 'CPU Usage',
      icon: <Cpu className="w-4 h-4" />,
      value: 62,
      unit: '%',
      status: 'healthy',
      description: 'Processing capacity'
    },
    {
      name: 'Memory',
      icon: <HardDrive className="w-4 h-4" />,
      value: 78,
      unit: '%',
      status: 'warning',
      description: 'RAM utilization'
    },
    {
      name: 'Network',
      icon: <Wifi className="w-4 h-4" />,
      value: 124,
      unit: 'ms',
      status: 'healthy',
      description: 'Response latency'
    },
    {
      name: 'Database',
      icon: <Database className="w-4 h-4" />,
      value: 89,
      unit: '%',
      status: 'critical',
      description: 'Storage capacity'
    },
    {
      name: 'API Calls',
      icon: <Zap className="w-4 h-4" />,
      value: 2847,
      unit: '/min',
      status: 'healthy',
      description: 'Request throughput'
    },
    {
      name: 'Security',
      icon: <Shield className="w-4 h-4" />,
      value: 100,
      unit: '%',
      status: 'healthy',
      description: 'Threat protection'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.unit === '%'
          ? Math.min(100, Math.max(0, metric.value + (Math.random() - 0.5) * 10))
          : metric.unit === 'ms'
          ? Math.max(50, metric.value + (Math.random() - 0.5) * 20)
          : Math.max(100, metric.value + (Math.random() - 0.5) * 200)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 border-green-400/20 bg-green-400/10';
      case 'warning':
        return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
      case 'critical':
        return 'text-red-400 border-red-400/20 bg-red-400/10';
    }
  };

  const getProgressColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'from-green-400 to-emerald-400';
      case 'warning':
        return 'from-yellow-400 to-orange-400';
      case 'critical':
        return 'from-red-400 to-rose-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">System Health</h2>
          <p className="text-sm text-white/60">Real-time infrastructure monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/60">Live</span>
          </span>
          <button className="glass-button p-2 rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <div className="glass p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all">
              {/* Icon and Name */}
              <div className="flex items-center gap-2 mb-3">
                <div className={cn(
                  'p-1.5 rounded-lg border',
                  getStatusColor(metric.status)
                )}>
                  {metric.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/70">{metric.name}</p>
                  <p className="text-xs text-white/40">{metric.description}</p>
                </div>
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-1 mb-2">
                <motion.span
                  key={metric.value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-white"
                >
                  {metric.unit === '%' || metric.unit === 'ms'
                    ? Math.round(metric.value)
                    : metric.value.toLocaleString()}
                </motion.span>
                <span className="text-sm text-white/50">{metric.unit}</span>
              </div>

              {/* Progress Bar */}
              {metric.unit === '%' && (
                <div className="glass-progress h-1.5">
                  <motion.div
                    className={cn('h-full rounded-full bg-gradient-to-r', getProgressColor(metric.status))}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              )}

              {/* Hover Tooltip */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded text-xs text-white pointer-events-none z-10"
              >
                {metric.status === 'critical' && 'Needs attention'}
                {metric.status === 'warning' && 'Monitor closely'}
                {metric.status === 'healthy' && 'Operating normally'}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Status */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-white/60" />
            <div>
              <p className="text-sm font-medium text-white">Overall System Status</p>
              <p className="text-xs text-white/50">Last checked: Just now</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="glass-badge bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-400">
              Operational
            </span>
            <span className="text-xs text-white/50">99.98% uptime</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}