'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Copy, Edit, Trash2, Eye,
  FileText, Image, Video, Music, Code, Send,
  Star, Clock, CheckCircle, AlertCircle, MoreVertical
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface Template {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'code';
  category: string;
  status: 'draft' | 'active' | 'archived';
  usageCount: number;
  lastModified: Date;
  rating: number;
  preview: string;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Tax Savings Alert',
    type: 'text',
    category: 'Financial Advisory',
    status: 'active',
    usageCount: 1234,
    lastModified: new Date(),
    rating: 4.8,
    preview: 'Important tax saving opportunity for FY 2024-25...'
  },
  {
    id: '2',
    name: 'Investment Infographic',
    type: 'image',
    category: 'Education',
    status: 'active',
    usageCount: 892,
    lastModified: new Date(Date.now() - 86400000),
    rating: 4.6,
    preview: '/templates/investment-infographic.jpg'
  },
  {
    id: '3',
    name: 'Market Update Video',
    type: 'video',
    category: 'Market Insights',
    status: 'draft',
    usageCount: 456,
    lastModified: new Date(Date.now() - 172800000),
    rating: 4.9,
    preview: '/templates/market-update.mp4'
  },
  // Add more templates...
];

export default function ContentTemplatesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [templates] = useState(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeIcon = (type: Template['type']) => {
    switch (type) {
      case 'text': return <FileText className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Template['status']) => {
    switch (status) {
      case 'active': return 'bg-green-400/20 text-green-400';
      case 'draft': return 'bg-yellow-400/20 text-yellow-400';
      case 'archived': return 'bg-gray-400/20 text-gray-400';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesType = filterType === 'all' || template.type === filterType;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

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
                    Content Template Studio
                  </h1>
                  <p className="text-white/60">
                    Create, manage, and deploy content templates across all channels
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Template</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <div className="glass p-4 rounded-xl mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-lg"
                  />
                </div>

                {/* Type Filters */}
                <div className="flex gap-2">
                  {['all', 'text', 'image', 'video', 'audio', 'code'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterType === type
                          ? 'glass bg-gradient-to-r from-cyan-400/20 to-purple-400/20 text-white'
                          : 'glass-button text-white/60'
                      }`}
                    >
                      {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Additional Filters */}
                <button className="glass-button p-2 rounded-lg">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedTemplate(template)}
                    className="glass glass-hover glass-3d rounded-xl overflow-hidden cursor-pointer group"
                  >
                    {/* Template Preview */}
                    <div className="h-40 bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative overflow-hidden">
                      {template.type === 'image' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-16 h-16 text-white/30" />
                        </div>
                      ) : template.type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-16 h-16 text-white/30" />
                        </div>
                      ) : (
                        <div className="p-4 text-white/60 text-sm">
                          {template.preview}
                        </div>
                      )}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="glass-button p-2 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="glass-button p-2 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="glass-button p-2 rounded-lg"
                        >
                          <Copy className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="glass-badge p-1.5 rounded-lg">
                            {getTypeIcon(template.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">
                              {template.name}
                            </h3>
                            <p className="text-xs text-white/50">
                              {template.category}
                            </p>
                          </div>
                        </div>
                        <button className="glass-button p-1 rounded">
                          <MoreVertical className="w-4 h-4 text-white/60" />
                        </button>
                      </div>

                      {/* Status and Stats */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(template.status)}`}>
                            {template.status}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-white/70">{template.rating}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1 text-white/50">
                            <Send className="w-3 h-3" />
                            <span>{template.usageCount} uses</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/50">
                            <Clock className="w-3 h-3" />
                            <span>2h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add New Template Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="glass glass-hover rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer group"
              >
                <motion.div
                  animate={{ rotate: 90 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-4 group-hover:border-cyan-400 transition-colors"
                >
                  <Plus className="w-8 h-8 text-white/50 group-hover:text-cyan-400 transition-colors" />
                </motion.div>
                <p className="text-white/60 font-medium">Create New Template</p>
                <p className="text-white/40 text-sm">Start from scratch or AI assist</p>
              </motion.div>
            </div>

            {/* Template Preview Modal */}
            <AnimatePresence>
              {selectedTemplate && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                  onClick={() => setSelectedTemplate(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
                      <button
                        onClick={() => setSelectedTemplate(null)}
                        className="glass-button p-2 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Template details would go here */}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

const X = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);