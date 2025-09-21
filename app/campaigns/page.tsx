'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Calendar, Users, Target, TrendingUp,
  Play, Pause, Archive, Edit, Trash2,
  Clock, CheckCircle, AlertCircle, BarChart3,
  Send, MessageSquare, Mail, Share2, Filter
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  audience: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  channels: ('whatsapp' | 'email' | 'linkedin' | 'sms')[];
  budget: number;
  spent: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Tax Savings 2024',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-31'),
    audience: 5420,
    sentCount: 3256,
    openRate: 68.5,
    clickRate: 12.3,
    conversionRate: 3.8,
    channels: ['whatsapp', 'email'],
    budget: 10000,
    spent: 6234
  },
  {
    id: '2',
    name: 'Investment Education Series',
    status: 'scheduled',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-29'),
    audience: 8900,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    channels: ['linkedin', 'email'],
    budget: 15000,
    spent: 0
  },
  // Add more campaigns...
];

export default function CampaignsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [campaigns] = useState(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'scheduled': return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
      case 'paused': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'draft': return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
      case 'completed': return 'bg-purple-400/20 text-purple-400 border-purple-400/30';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'linkedin': return <Share2 className="w-4 h-4" />;
      case 'sms': return <Send className="w-4 h-4" />;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    filterStatus === 'all' || campaign.status === filterStatus
  );

  return (
    <div className="min-h-screen relative">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} mt-16`}>
          <div className="p-6">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gradient mb-2">
                    Campaign Builder
                  </h1>
                  <p className="text-white/60">
                    Create and manage multi-channel marketing campaigns
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400/20 to-purple-400/20"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Campaign</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-4 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">12</span>
                </div>
                <p className="text-sm text-white/60">Active Campaigns</p>
                <div className="mt-2 glass-progress h-2">
                  <div className="glass-progress-bar" style={{ width: '75%' }} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-4 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-white">45.2K</span>
                </div>
                <p className="text-sm text-white/60">Total Reach</p>
                <p className="text-xs text-green-400 mt-2">+12% from last month</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-4 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-pink-400" />
                  <span className="text-2xl font-bold text-white">68.5%</span>
                </div>
                <p className="text-sm text-white/60">Avg Open Rate</p>
                <p className="text-xs text-green-400 mt-2">Above industry avg</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-4 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">3.8%</span>
                </div>
                <p className="text-sm text-white/60">Conversion Rate</p>
                <p className="text-xs text-yellow-400 mt-2">Room to improve</p>
              </motion.div>
            </div>

            {/* Filters */}
            <div className="glass p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['all', 'active', 'scheduled', 'paused', 'draft', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filterStatus === status
                          ? 'glass bg-gradient-to-r from-cyan-400/20 to-purple-400/20 text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="glass-button p-2 rounded-lg">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="glass-button p-2 rounded-lg"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass glass-3d rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  {/* Campaign Header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                          <div className="flex gap-1">
                            {campaign.channels.map((channel) => (
                              <div key={channel} className="glass-badge p-1 rounded">
                                {getChannelIcon(channel)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="glass-button p-1.5 rounded-lg"
                      >
                        {campaign.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      <span>
                        {campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="p-4 space-y-3">
                    {/* Audience */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60">Audience</span>
                        <span className="text-sm font-medium text-white">
                          {campaign.sentCount.toLocaleString()} / {campaign.audience.toLocaleString()}
                        </span>
                      </div>
                      <div className="glass-progress h-2">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(campaign.sentCount / campaign.audience) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-cyan-400">{campaign.openRate}%</p>
                        <p className="text-xs text-white/50">Open</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-400">{campaign.clickRate}%</p>
                        <p className="text-xs text-white/50">Click</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-400">{campaign.conversionRate}%</p>
                        <p className="text-xs text-white/50">Conv</p>
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60">Budget Used</span>
                        <span className="text-sm font-medium text-white">
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="glass-progress h-2">
                        <motion.div
                          className={`h-full rounded-full ${
                            (campaign.spent / campaign.budget) > 0.8
                              ? 'bg-gradient-to-r from-red-400 to-orange-400'
                              : 'bg-gradient-to-r from-green-400 to-emerald-400'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-white/10 flex gap-2">
                    <button className="flex-1 glass-button py-1.5 rounded-lg text-sm">
                      View Details
                    </button>
                    <button className="glass-button p-1.5 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="glass-button p-1.5 rounded-lg">
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Create New Campaign Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: filteredCampaigns.length * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass glass-hover rounded-xl flex flex-col items-center justify-center min-h-[400px] cursor-pointer group"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-4 group-hover:border-cyan-400 transition-colors"
                >
                  <Plus className="w-10 h-10 text-white/50 group-hover:text-cyan-400 transition-colors" />
                </motion.div>
                <p className="text-white/60 font-medium text-lg">Create New Campaign</p>
                <p className="text-white/40 text-sm mt-2">AI-powered campaign builder</p>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}