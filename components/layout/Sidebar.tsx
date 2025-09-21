'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Brain, MessageSquare,
  Image, BarChart3, Settings, FileText, Calendar,
  Zap, Shield, Globe, ChevronRight, ChevronDown,
  Activity, Package, Palette, Code, Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/',
    badge: 'Live'
  },
  {
    id: 'agents',
    label: 'AI Agents',
    icon: <Brain className="w-5 h-5" />,
    href: '/agents',
    children: [
      { id: 'agent-monitor', label: 'Agent Monitor', icon: <Activity className="w-4 h-4" />, href: '/agents/monitor' },
      { id: 'agent-config', label: 'Configuration', icon: <Settings className="w-4 h-4" />, href: '/agents/config' },
      { id: 'agent-logs', label: 'Logs', icon: <FileText className="w-4 h-4" />, href: '/agents/logs' },
    ]
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    icon: <Calendar className="w-5 h-5" />,
    href: '/campaigns',
    badge: '12'
  },
  {
    id: 'content',
    label: 'Content Studio',
    icon: <Palette className="w-5 h-5" />,
    href: '/content',
    children: [
      { id: 'templates', label: 'Templates', icon: <FileText className="w-4 h-4" />, href: '/content/templates' },
      { id: 'generator', label: 'Generator', icon: <Zap className="w-4 h-4" />, href: '/content/generator' },
      { id: 'library', label: 'Library', icon: <Package className="w-4 h-4" />, href: '/content/library' },
    ]
  },
  {
    id: 'distribution',
    label: 'Distribution',
    icon: <Globe className="w-5 h-5" />,
    href: '/distribution',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/analytics',
  },
  {
    id: 'advisors',
    label: 'Advisors',
    icon: <Users className="w-5 h-5" />,
    href: '/advisors',
    badge: '847'
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: <Shield className="w-5 h-5" />,
    href: '/compliance',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings',
    children: [
      { id: 'api', label: 'API Keys', icon: <Code className="w-4 h-4" />, href: '/settings/api' },
      { id: 'database', label: 'Database', icon: <Database className="w-4 h-4" />, href: '/settings/database' },
      { id: 'system', label: 'System', icon: <Settings className="w-4 h-4" />, href: '/settings/system' },
    ]
  },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['agents', 'content']);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-30"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '8px 0 32px rgba(31, 38, 135, 0.37), 0 0 60px rgba(139, 92, 246, 0.15)'
          }}
        >
          <div className="p-4 h-full overflow-y-auto">
            {/* Quick Stats */}
            <div className="glass p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 uppercase tracking-wider">System Status</span>
                <span className="glass-badge">Online</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70">CPU</span>
                  <span className="text-xs text-cyan-400">62%</span>
                </div>
                <div className="glass-progress">
                  <div className="glass-progress-bar" style={{ width: '62%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70">Memory</span>
                  <span className="text-xs text-purple-400">78%</span>
                </div>
                <div className="glass-progress">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                    style={{ width: '78%' }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="relative"
                  >
                    {item.children ? (
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-white/80 hover:text-white transition-all',
                          isActive(item.href) && 'glass text-white'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="text-sm font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="glass-badge text-xs">{item.badge}</span>
                          )}
                        </div>
                        <motion.div
                          animate={{ rotate: expandedItems.includes(item.id) ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-white/80 hover:text-white transition-all',
                          isActive(item.href) && 'glass text-white'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="glass-badge text-xs">{item.badge}</span>
                        )}
                      </Link>
                    )}
                  </motion.div>

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.children && expandedItems.includes(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/60 hover:text-white text-sm transition-all',
                              isActive(child.href) && 'text-cyan-400'
                            )}
                          >
                            {child.icon}
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass p-3 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-white/70">WebSocket Connected</span>
                </div>
                <p className="text-xs text-white/50">
                  Last sync: 2 seconds ago
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}