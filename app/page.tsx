'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Users, DollarSign, TrendingUp,
} from 'lucide-react';
import AgentStatusCard from '@/components/dashboard/AgentStatusCard';
import MetricCard from '@/components/dashboard/MetricCard';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import RealtimeAlerts from '@/components/dashboard/RealtimeAlerts';
import SystemHealth from '@/components/dashboard/SystemHealth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

// Mock data for agents
const agents = [
  { id: 1, name: 'Content Generator', status: 'active' as const, cpu: 45, memory: 62, tasks: 127 },
  { id: 2, name: 'Market Intelligence', status: 'active' as const, cpu: 78, memory: 85, tasks: 89 },
  { id: 3, name: 'Compliance Validator', status: 'idle' as const, cpu: 12, memory: 34, tasks: 45 },
  { id: 4, name: 'Quality Scorer', status: 'active' as const, cpu: 92, memory: 88, tasks: 234 },
  { id: 5, name: 'Distribution Controller', status: 'active' as const, cpu: 67, memory: 71, tasks: 178 },
  { id: 6, name: 'WhatsApp Creator', status: 'processing' as const, cpu: 89, memory: 93, tasks: 342 },
  { id: 7, name: 'LinkedIn Generator', status: 'active' as const, cpu: 56, memory: 49, tasks: 98 },
  { id: 8, name: 'Image Designer', status: 'idle' as const, cpu: 23, memory: 41, tasks: 67 },
  { id: 9, name: 'Fatigue Checker', status: 'active' as const, cpu: 34, memory: 38, tasks: 112 },
  { id: 10, name: 'Advisor Manager', status: 'active' as const, cpu: 61, memory: 55, tasks: 156 },
  { id: 11, name: 'Campaign Scheduler', status: 'processing' as const, cpu: 84, memory: 79, tasks: 203 },
  { id: 12, name: 'Analytics Tracker', status: 'active' as const, cpu: 72, memory: 68, tasks: 189 },
  { id: 13, name: 'Content Orchestrator', status: 'active' as const, cpu: 58, memory: 52, tasks: 145 },
  { id: 14, name: 'State Manager', status: 'idle' as const, cpu: 15, memory: 28, tasks: 34 },
  { id: 15, name: 'Communication Bus', status: 'active' as const, cpu: 43, memory: 46, tasks: 278 },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metrics] = useState({
    totalRevenue: 248956,
    activeUsers: 12847,
    conversionRate: 3.24,
    growthRate: 12.5,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen relative">
      {/* Extra background effects layer */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      </div>

      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} mt-16 relative`}>
          <div className="p-6 space-y-6">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-gradient mb-2">
                FinAdvise AI Dashboard
              </h1>
              <p className="text-white/60">
                Real-time monitoring and control center for multi-agent AI system
              </p>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div variants={itemVariants}>
                <MetricCard
                  title="Total Revenue"
                  value={`$${metrics.totalRevenue.toLocaleString()}`}
                  change="+12.5%"
                  trend="up"
                  icon={<DollarSign className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <MetricCard
                  title="Active Users"
                  value={metrics.activeUsers.toLocaleString()}
                  change="+8.2%"
                  trend="up"
                  icon={<Users className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <MetricCard
                  title="Conversion Rate"
                  value={`${metrics.conversionRate}%`}
                  change="-2.1%"
                  trend="down"
                  icon={<Activity className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <MetricCard
                  title="Growth Rate"
                  value={`${metrics.growthRate}%`}
                  change="+5.3%"
                  trend="up"
                  icon={<TrendingUp className="w-5 h-5" />}
                />
              </motion.div>
            </motion.div>

            {/* System Health and Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <SystemHealth />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <RealtimeAlerts />
              </motion.div>
            </div>

            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PerformanceChart />
            </motion.div>

            {/* Agent Status Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Agent Status Monitor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <AgentStatusCard agent={agent} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}