'use client';

import GlassShowcase from '@/components/ui/GlassShowcase';
import { motion } from 'framer-motion';

export default function GlassDemoPage() {
  return (
    <div className="min-h-screen p-8">
      {/* Page Header with Neon Effect */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold mb-4 text-gradient neon-text">
          Stunning Glassmorphism UI
        </h1>
        <p className="text-xl text-white/70">
          Experience the beauty of glass effects with proper backdrop filters and 3D transforms
        </p>
      </motion.div>

      {/* Glass Showcase Component */}
      <GlassShowcase />

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="glass glass-hover p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-xl font-bold mb-2">Backdrop Filter</h3>
          <p className="text-white/70">
            Strong 20px blur with 180% saturation for that perfect frosted glass look
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, rotateY: -5 }}
          className="glass glass-hover p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div className="text-5xl mb-4">🌈</div>
          <h3 className="text-xl font-bold mb-2">Gradient Overlays</h3>
          <p className="text-white/70">
            Beautiful gradient backgrounds with animated color shifts and opacity
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, rotateX: 5 }}
          className="glass glass-hover p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(239, 68, 68, 0.1))',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div className="text-5xl mb-4">🎆</div>
          <h3 className="text-xl font-bold mb-2">Particle Effects</h3>
          <p className="text-white/70">
            Dynamic particle animations with WebGL for stunning visual depth
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{
            scale: 1.05,
            rotateX: -5,
            boxShadow: '0 20px 60px rgba(0, 255, 255, 0.4)'
          }}
          className="glass glow p-6 rounded-2xl"
        >
          <div className="text-5xl mb-4">💎</div>
          <h3 className="text-xl font-bold mb-2">3D Transforms</h3>
          <p className="text-white/70">
            Perspective-based 3D rotations with smooth spring animations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass neon-border p-6 rounded-2xl float-animation"
        >
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2">Neon Glows</h3>
          <p className="text-white/70">
            Eye-catching neon borders and glow effects with animated pulses
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          className="glass p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'pulse-glow 3s ease-in-out infinite'
          }}
        >
          <div className="text-5xl mb-4">🌟</div>
          <h3 className="text-xl font-bold mb-2">Floating Animation</h3>
          <p className="text-white/70">
            Smooth floating effects that bring elements to life
          </p>
        </motion.div>
      </div>

      {/* Interactive Demo Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-16 glass p-8 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px) saturate(200%)',
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-gradient">
          Interactive Elements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Form Controls</h3>
            <input
              type="text"
              placeholder="Enter your name..."
              className="glass-input w-full"
            />
            <input
              type="email"
              placeholder="Enter your email..."
              className="glass-input w-full"
            />
            <select className="glass-input w-full">
              <option>Choose an option</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Action Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <button className="glass-button px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                Primary Action
              </button>
              <button className="glass-button glow px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                Secondary
              </button>
              <button className="glass-button neon-border px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                Danger
              </button>
            </div>

            <div className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Progress</span>
                <span className="text-sm text-cyan-400">75%</span>
              </div>
              <div className="glass-progress h-3">
                <div className="glass-progress-bar h-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <div className="glass status-success px-4 py-2 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Success State
        </div>
        <div className="glass status-warning px-4 py-2 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          Warning State
        </div>
        <div className="glass status-error px-4 py-2 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          Error State
        </div>
      </motion.div>
    </div>
  );
}