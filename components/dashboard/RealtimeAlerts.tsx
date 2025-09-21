'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, CheckCircle, AlertTriangle, XCircle,
  Bell, X, ExternalLink, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'success',
    title: 'Campaign Launched',
    message: 'Tax Savings 2024 campaign is now live',
    time: new Date(Date.now() - 2 * 60000),
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'High CPU Usage',
    message: 'Content Generator agent at 92% CPU',
    time: new Date(Date.now() - 15 * 60000),
    read: false,
  },
  {
    id: '3',
    type: 'error',
    title: 'API Rate Limit',
    message: 'WhatsApp API rate limit approaching',
    time: new Date(Date.now() - 30 * 60000),
    read: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'New Integration',
    message: 'LinkedIn API successfully connected',
    time: new Date(Date.now() - 45 * 60000),
    read: true,
  },
];

export default function RealtimeAlerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredAlerts = filter === 'unread'
    ? alerts.filter(a => !a.read)
    : alerts;

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'info':
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  useEffect(() => {
    // Simulate new alerts
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: (['success', 'warning', 'error', 'info'] as const)[Math.floor(Math.random() * 4)],
        title: 'New Alert',
        message: 'This is a simulated real-time alert',
        time: new Date(),
        read: false,
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 10));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-xl h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h3 className="font-semibold text-white">Live Alerts</h3>
            {alerts.filter(a => !a.read).length > 0 && (
              <span className="glass-badge text-xs">
                {alerts.filter(a => !a.read).length}
              </span>
            )}
          </div>
          <button className="text-xs text-cyan-400 hover:text-cyan-300">
            View All
          </button>
        </div>
        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 glass rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all',
              filter === 'all'
                ? 'bg-gradient-to-r from-cyan-400/20 to-purple-400/20 text-white'
                : 'text-white/60 hover:text-white'
            )}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all',
              filter === 'unread'
                ? 'bg-gradient-to-r from-cyan-400/20 to-purple-400/20 text-white'
                : 'text-white/60 hover:text-white'
            )}
          >
            Unread ({alerts.filter(a => !a.read).length})
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ x: 4 }}
              className={cn(
                'glass p-3 rounded-lg cursor-pointer group transition-all',
                !alert.read && 'border-l-2',
                alert.type === 'success' && 'border-l-green-400',
                alert.type === 'warning' && 'border-l-yellow-400',
                alert.type === 'error' && 'border-l-red-400',
                alert.type === 'info' && 'border-l-blue-400'
              )}
              onClick={() => markAsRead(alert.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={cn(
                        'text-sm font-medium text-white mb-0.5',
                        alert.read && 'text-white/70'
                      )}>
                        {alert.title}
                      </p>
                      <p className="text-xs text-white/50 line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white/50 hover:text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-white/30" />
                    <span className="text-xs text-white/30">
                      {getTimeAgo(alert.time)}
                    </span>
                    {!alert.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/40">No alerts to display</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}