'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Menu, Bell, Search, User, Settings,
  LogOut, ChevronDown, Sun, Moon, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, type: 'success', message: 'Campaign "Tax Savings 2024" launched successfully', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'High CPU usage on Content Generator agent', time: '15 min ago' },
    { id: 3, type: 'info', message: 'New advisor registered: John Smith', time: '1 hour ago' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="glass glass-header neon-border backdrop-blur-xl h-16 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37), 0 0 60px rgba(0, 255, 255, 0.15)'
      }}>
      <div className="flex items-center gap-4">
        {/* Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="glass-button p-2 rounded-lg"
        >
          <Menu className="w-5 h-5 text-white" />
        </motion.button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold text-gradient">FinAdvise AI</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <motion.div
          animate={{ width: searchFocused ? 400 : 300 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search agents, campaigns, templates..."
            className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-sm"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 w-full glass rounded-lg p-4"
            >
              <p className="text-white/50 text-sm">Start typing to search...</p>
            </motion.div>
          )}
        </motion.div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button p-2 rounded-lg"
        >
          <Sun className="w-5 h-5 text-white" />
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="glass-button p-2 rounded-lg relative"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate-pulse" />
          </motion.button>

          {notificationOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute top-full right-0 mt-2 w-80 glass rounded-lg overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="p-4 border-b border-white/5 cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full mt-2',
                          notif.type === 'success' && 'bg-green-400',
                          notif.type === 'warning' && 'bg-yellow-400',
                          notif.type === 'info' && 'bg-blue-400'
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-white/90">{notif.message}</p>
                        <p className="text-xs text-white/50 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-3 border-t border-white/10">
                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                  View all notifications
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 glass-button px-3 py-2 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-white">Admin</span>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </motion.button>

          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute top-full right-0 mt-2 w-56 glass rounded-lg overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <p className="font-semibold text-white">System Admin</p>
                <p className="text-sm text-white/50">admin@finadvise.ai</p>
              </div>
              <div className="p-2">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/90 text-sm transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/90 text-sm transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </motion.button>
                <div className="border-t border-white/10 mt-2 pt-2">
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 text-sm transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}