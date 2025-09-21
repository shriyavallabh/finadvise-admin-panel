'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

export default function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, translateY: -5, rotateX: 5, rotateY: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="glass glass-hover glass-3d glow backdrop-blur-lg p-6 rounded-xl relative overflow-hidden group cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: trend === 'up'
              ? 'radial-gradient(circle, var(--accent-cyan), transparent)'
              : 'radial-gradient(circle, var(--accent-pink), transparent)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="glass-badge p-2 rounded-lg">
            {icon}
          </div>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: trend === 'up' ? 5 : -5 }}
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend === 'up'
                ? 'bg-green-400/20 text-green-400'
                : 'bg-red-400/20 text-red-400'
            )}
          >
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{change}</span>
          </motion.div>
        </div>

        {/* Value */}
        <div>
          <p className="text-white/60 text-sm mb-1">{title}</p>
          <motion.p
            className="text-3xl font-bold text-gradient"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.p>
        </div>

        {/* Sparkline (decorative) */}
        <div className="mt-4 h-12 relative overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
          >
            <motion.path
              d={trend === 'up'
                ? "M0,30 L20,25 L40,28 L60,15 L80,18 L100,10"
                : "M0,10 L20,15 L40,12 L60,25 L80,22 L100,30"}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-cyan)" />
                <stop offset="100%" stopColor="var(--accent-pink)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.1), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </motion.div>
  );
}