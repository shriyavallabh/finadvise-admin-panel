'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Star, Heart, Diamond } from 'lucide-react';

export default function GlassShowcase() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold text-gradient neon-text mb-8">
        Glassmorphism Showcase
      </h2>

      {/* Basic Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-xl"
      >
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Basic Glass Effect
        </h3>
        <p className="text-white/70">
          This card demonstrates the basic glassmorphism effect with blur and transparency.
        </p>
      </motion.div>

      {/* Glass with Hover Effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02, translateY: -4 }}
        className="glass glass-hover p-6 rounded-xl cursor-pointer"
      >
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Hover Glass Effect
        </h3>
        <p className="text-white/70">
          Hover over this card to see the enhanced glass effect with scale and glow.
        </p>
      </motion.div>

      {/* 3D Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{
          rotateX: -10,
          rotateY: 10,
          scale: 1.05,
        }}
        className="glass glass-3d p-6 rounded-xl cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-400" />
          3D Transform Glass
        </h3>
        <p className="text-white/70">
          This card has 3D transform effects on hover with perspective depth.
        </p>
      </motion.div>

      {/* Neon Glow Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass glow neon-border p-6 rounded-xl"
      >
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          Neon Glow Effect
        </h3>
        <p className="text-white/70">
          This card features neon glow effects and animated borders.
        </p>
      </motion.div>

      {/* Floating Animation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass float-animation p-6 rounded-xl"
      >
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Diamond className="w-5 h-5 text-cyan-400" />
          Floating Animation
        </h3>
        <p className="text-white/70">
          This card has a continuous floating animation effect.
        </p>
      </motion.div>

      {/* Glass Button Examples */}
      <div className="flex flex-wrap gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button px-6 py-3 rounded-lg font-semibold"
        >
          Glass Button
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button glow px-6 py-3 rounded-lg font-semibold"
        >
          Glowing Button
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button neon-border px-6 py-3 rounded-lg font-semibold"
        >
          Neon Border
        </motion.button>
      </div>

      {/* Glass Input */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Glass input field..."
          className="glass-input w-full"
        />

        <textarea
          placeholder="Glass textarea with multiple lines..."
          className="glass-input w-full h-24 resize-none"
        />
      </div>

      {/* Glass Badge Examples */}
      <div className="flex flex-wrap gap-4">
        <span className="glass-badge">Live</span>
        <span className="glass-badge bg-gradient-to-r from-green-400/30 to-emerald-400/30">
          Active
        </span>
        <span className="glass-badge bg-gradient-to-r from-red-400/30 to-pink-400/30">
          Error
        </span>
      </div>
    </div>
  );
}