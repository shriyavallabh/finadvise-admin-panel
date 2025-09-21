#!/usr/bin/env node

/**
 * FinAdvise Admin Panel - Live Demo Server
 * Demonstrates the masterpiece with real-time simulated data
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Simulated agent data for your FinAdvise system
const agents = [
  {
    id: 'agent-1',
    name: 'Content Generator',
    type: 'content_generator',
    status: 'active',
    version: '2.1.4',
    description: 'Generates personalized financial content',
    metrics: {
      cpu: 45.2,
      memory: 68.1,
      requestsPerSecond: 23.4,
      errorRate: 0.1,
      avgResponseTime: 156,
      uptime: 86400,
      totalRequests: 15420,
      totalErrors: 12,
      lastUpdate: new Date()
    }
  },
  {
    id: 'agent-2',
    name: 'Distribution Controller',
    type: 'distribution_controller',
    status: 'active',
    version: '3.0.2',
    description: 'Manages message distribution to advisors',
    metrics: {
      cpu: 72.8,
      memory: 54.3,
      requestsPerSecond: 45.7,
      errorRate: 0.3,
      avgResponseTime: 89,
      uptime: 72000,
      totalRequests: 28940,
      totalErrors: 87,
      lastUpdate: new Date()
    }
  },
  {
    id: 'agent-3',
    name: 'Compliance Validator',
    type: 'compliance_validator',
    status: 'idle',
    version: '1.8.1',
    description: 'Validates content for SEBI compliance',
    metrics: {
      cpu: 12.1,
      memory: 32.5,
      requestsPerSecond: 8.2,
      errorRate: 0.0,
      avgResponseTime: 234,
      uptime: 95000,
      totalRequests: 5640,
      totalErrors: 0,
      lastUpdate: new Date()
    }
  },
  {
    id: 'agent-4',
    name: 'WhatsApp Message Creator',
    type: 'whatsapp_message_creator',
    status: 'processing',
    version: '2.5.0',
    description: 'Creates engaging WhatsApp messages',
    metrics: {
      cpu: 89.3,
      memory: 76.8,
      requestsPerSecond: 156.3,
      errorRate: 1.2,
      avgResponseTime: 67,
      uptime: 45600,
      totalRequests: 89234,
      totalErrors: 1071,
      lastUpdate: new Date()
    }
  },
  {
    id: 'agent-5',
    name: 'LinkedIn Post Generator',
    type: 'linkedin_post_generator',
    status: 'active',
    version: '1.9.3',
    description: 'Generates professional LinkedIn content',
    metrics: {
      cpu: 34.7,
      memory: 45.2,
      requestsPerSecond: 12.8,
      errorRate: 0.5,
      avgResponseTime: 298,
      uptime: 67800,
      totalRequests: 12456,
      totalErrors: 62,
      lastUpdate: new Date()
    }
  },
  {
    id: 'agent-6',
    name: 'Market Intelligence',
    type: 'market_intelligence',
    status: 'active',
    version: '4.1.0',
    description: 'Gathers real-time market insights',
    metrics: {
      cpu: 67.4,
      memory: 82.1,
      requestsPerSecond: 34.2,
      errorRate: 0.8,
      avgResponseTime: 1234,
      uptime: 123400,
      totalRequests: 45678,
      totalErrors: 365,
      lastUpdate: new Date()
    }
  },
  {
    id: 'agent-7',
    name: 'Gemini Image Generator',
    type: 'gemini_image_generator',
    status: 'processing',
    version: '1.2.1',
    description: 'Generates stunning visual content with AI',
    metrics: {
      cpu: 95.2,
      memory: 91.7,
      requestsPerSecond: 5.7,
      errorRate: 2.1,
      avgResponseTime: 3456,
      uptime: 34560,
      totalRequests: 3456,
      totalErrors: 72,
      lastUpdate: new Date()
    }
  },
  {
    id: 'agent-8',
    name: 'Brand Customizer',
    type: 'brand_customizer',
    status: 'idle',
    version: '2.0.4',
    description: 'Applies advisor branding to content',
    metrics: {
      cpu: 8.3,
      memory: 24.1,
      requestsPerSecond: 2.1,
      errorRate: 0.0,
      avgResponseTime: 89,
      uptime: 89000,
      totalRequests: 7890,
      totalErrors: 0,
      lastUpdate: new Date()
    }
  },
  {
    id: 'agent-9',
    name: 'Analytics Tracker',
    type: 'analytics_tracker',
    status: 'error',
    version: '1.5.2',
    description: 'Tracks content performance metrics',
    metrics: {
      cpu: 0,
      memory: 0,
      requestsPerSecond: 0,
      errorRate: 100,
      avgResponseTime: 0,
      uptime: 0,
      totalRequests: 23456,
      totalErrors: 2345,
      lastUpdate: new Date()
    }
  },
  {
    id: 'agent-10',
    name: 'Quality Scorer',
    type: 'quality_scorer',
    status: 'active',
    version: '3.2.1',
    description: 'Evaluates content quality scores',
    metrics: {
      cpu: 56.8,
      memory: 43.2,
      requestsPerSecond: 28.9,
      errorRate: 0.3,
      avgResponseTime: 145,
      uptime: 98700,
      totalRequests: 67890,
      totalErrors: 203,
      lastUpdate: new Date()
    }
  }
];

console.log(`
🎭 FINADVISE ADMIN PANEL - LIVE DEMO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Starting Demo Server...
   API Server: http://localhost:3001
   Admin Panel: http://localhost:3000 (start with npm run dev)

🤖 Simulating ${agents.length} AI Agents:
${agents.map(a => `   • ${a.name} (${a.status})`).join('\n')}

📊 Real-time Features:
   • Agent Status Updates every 2s
   • Performance Metrics streaming
   • System Logs every 5s
   • Campaign Events every 10s
   • Alert Notifications every 15s

🎯 Demo showcases:
   • Live dashboard updates
   • Real-time agent monitoring
   • Interactive charts
   • WebSocket connectivity
   • Alert management

Press Ctrl+C to stop demo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// API Routes
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Agents API
app.get('/api/agents', (req, res) => {
  res.json(agents);
});

app.get('/api/agents/:id/status', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json({ status: agent.status, metrics: agent.metrics });
});

app.post('/api/agents/:id/start', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  agent.status = 'active';
  agent.metrics.cpu = Math.random() * 60 + 20;
  agent.metrics.memory = Math.random() * 50 + 30;
  agent.metrics.requestsPerSecond = Math.random() * 20 + 5;
  agent.metrics.errorRate = Math.random() * 2;

  console.log(`🚀 Started agent: ${agent.name}`);

  // Broadcast status change
  io.emit('agent:status', {
    agentId: agent.id,
    status: agent.status,
    metrics: agent.metrics
  });

  res.json({ success: true, status: agent.status });
});

app.post('/api/agents/:id/stop', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  agent.status = 'stopped';
  agent.metrics = {
    ...agent.metrics,
    cpu: 0,
    memory: 0,
    requestsPerSecond: 0,
    errorRate: 0
  };

  console.log(`⏹️  Stopped agent: ${agent.name}`);

  // Broadcast status change
  io.emit('agent:status', {
    agentId: agent.id,
    status: agent.status,
    metrics: agent.metrics
  });

  res.json({ success: true, status: agent.status });
});

app.post('/api/agents/:id/restart', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  // Simulate restart process
  agent.status = 'processing';
  console.log(`🔄 Restarting agent: ${agent.name}`);

  // Broadcast restart
  io.emit('agent:status', {
    agentId: agent.id,
    status: agent.status,
    metrics: agent.metrics
  });

  // Complete restart after 3 seconds
  setTimeout(() => {
    agent.status = 'active';
    agent.metrics.uptime = 0; // Reset uptime

    io.emit('agent:status', {
      agentId: agent.id,
      status: agent.status,
      metrics: agent.metrics
    });

    console.log(`✅ Restarted agent: ${agent.name}`);
  }, 3000);

  res.json({ success: true, status: 'restarting' });
});

// Analytics API
app.get('/api/analytics/overview', (req, res) => {
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalMessages = Math.floor(Math.random() * 50000) + 40000;
  const systemHealth = agents.filter(a => a.status !== 'error').length / agents.length * 100;

  res.json({
    totalMessages,
    activeAgents,
    activeCampaigns: 12,
    totalAdvisors: 234,
    deliveryRate: Math.random() * 5 + 95, // 95-100%
    engagementRate: Math.random() * 10 + 20, // 20-30%
    systemHealth: Math.floor(systemHealth),
    period: {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000),
      end: new Date()
    }
  });
});

app.get('/api/analytics/realtime/:metric', (req, res) => {
  const { metric } = req.params;

  // Generate real-time data points
  const data = Array.from({ length: 50 }, (_, i) => ({
    timestamp: new Date(Date.now() - (50 - i) * 60000),
    value: Math.random() * 100 + Math.sin(i / 10) * 20 + 50
  }));

  res.json(data);
});

// System logs API
app.get('/api/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const logs = [];

  for (let i = 0; i < limit; i++) {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    logs.push({
      id: `log-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - i * 60000),
      level: ['info', 'warn', 'error'][Math.floor(Math.random() * 3)],
      source: agent.name,
      message: [
        'Processing campaign request successfully',
        'WhatsApp message delivered to advisor',
        'Template validation completed',
        'Content generation finished',
        'Advisor data synchronized from Google Sheets',
        'Performance metrics updated',
        'Compliance check passed',
        'Brand customization applied',
        'Image generation completed',
        'Quality score calculated'
      ][Math.floor(Math.random() * 10)]
    });
  }

  res.json(logs.reverse()); // Most recent first
});

// Campaigns API
app.get('/api/campaigns', (req, res) => {
  res.json([
    {
      id: 'camp-1',
      name: 'Daily Market Updates',
      status: 'active',
      advisors: 234,
      messages: 12450,
      engagement: 23.4
    },
    {
      id: 'camp-2',
      name: 'Investment Insights',
      status: 'scheduled',
      advisors: 180,
      messages: 0,
      engagement: 0
    }
  ]);
});

// Advisors API
app.get('/api/advisors', (req, res) => {
  res.json([
    {
      id: 'adv-1',
      name: 'Shriya Vallabh',
      phone: '+91-9876543210',
      segment: 'Premium',
      engagement: 45.2,
      lastActive: new Date()
    },
    {
      id: 'adv-2',
      name: 'Avalok Sharma',
      phone: '+91-9876543211',
      segment: 'Standard',
      engagement: 67.8,
      lastActive: new Date()
    }
  ]);
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send initial agent data
  socket.emit('agents:initial', agents);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Simulate real-time updates
setInterval(() => {
  // Update agent metrics for active/processing agents
  agents.forEach(agent => {
    if (agent.status === 'active' || agent.status === 'processing') {
      agent.metrics.cpu = Math.max(0, Math.min(100,
        agent.metrics.cpu + (Math.random() - 0.5) * 10
      ));
      agent.metrics.memory = Math.max(0, Math.min(100,
        agent.metrics.memory + (Math.random() - 0.5) * 8
      ));
      agent.metrics.requestsPerSecond = Math.max(0,
        agent.metrics.requestsPerSecond + (Math.random() - 0.5) * 5
      );
      agent.metrics.uptime += 2; // Increment uptime

      // Broadcast updates
      io.emit('agent:status', {
        agentId: agent.id,
        status: agent.status,
        metrics: agent.metrics
      });
    }
  });
}, 2000);

// Simulate system logs
setInterval(() => {
  const agent = agents[Math.floor(Math.random() * agents.length)];
  const messages = [
    'Processing new campaign workflow',
    'WhatsApp template approved by compliance',
    'Content quality check passed',
    'Performance threshold optimized',
    'Advisor engagement tracked successfully',
    'Real-time sync completed with Google Sheets',
    'Brand customization applied to template',
    'Market intelligence data updated',
    'Content distribution completed',
    'Analytics metrics calculated'
  ];

  const log = {
    id: `log-${Date.now()}`,
    timestamp: new Date(),
    level: ['info', 'warn'][Math.floor(Math.random() * 2)],
    source: agent.name,
    message: messages[Math.floor(Math.random() * messages.length)]
  };

  io.emit('log:stream', log);
  console.log(`📝 [${log.level.toUpperCase()}] ${log.source}: ${log.message}`);
}, 5000);

// Simulate system alerts
setInterval(() => {
  if (Math.random() > 0.7) { // 30% chance of alert
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const alertTypes = [
      { type: 'warning', severity: 'medium', title: 'High Resource Usage Detected' },
      { type: 'info', severity: 'low', title: 'Performance Optimization Available' },
      { type: 'error', severity: 'high', title: 'Agent Communication Error' },
      { type: 'warning', severity: 'medium', title: 'Memory Usage Above Threshold' },
      { type: 'info', severity: 'low', title: 'Scheduled Maintenance Reminder' }
    ];

    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const alert = {
      id: `alert-${Date.now()}`,
      ...alertType,
      message: `${agent.name} requires attention - ${alertType.title.toLowerCase()}`,
      source: agent.id,
      timestamp: new Date(),
      acknowledged: false
    };

    io.emit('system:alert', alert);
    console.log(`🚨 ${alertType.severity.toUpperCase()} ALERT: ${alert.title} - ${alert.message}`);
  }
}, 15000);

// Simulate campaign events
setInterval(() => {
  const events = [
    'Campaign "Daily Market Updates" launched successfully',
    'Template "Investment Insights" approved by compliance team',
    'Advisor segmentation analysis completed',
    'WhatsApp bulk delivery completed (234 messages)',
    'Performance report generated for last 24 hours',
    'New advisor onboarded via Google Sheets',
    'Content quality score improved by 15%',
    'Brand customization applied to 12 templates',
    'Real-time analytics dashboard updated',
    'Campaign engagement rate exceeded target'
  ];

  const event = events[Math.floor(Math.random() * events.length)];

  io.emit('campaign:update', {
    id: `event-${Date.now()}`,
    type: 'campaign_update',
    message: event,
    timestamp: new Date()
  });

  console.log(`📢 Campaign Event: ${event}`);
}, 10000);

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`
✅ Demo API Server running on http://localhost:${PORT}

🎮 DEMO IS LIVE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Next Steps:
1. Open a new terminal
2. cd admin-panel
3. npm run dev
4. Open http://localhost:3000

📊 Real-time Data Streaming:
   • Agent metrics update every 2 seconds
   • System logs stream every 5 seconds
   • Alerts trigger every 15 seconds
   • Campaign events every 10 seconds

🎯 Test Features:
   • Start/Stop agents via admin panel
   • Monitor real-time performance charts
   • View live system logs
   • Acknowledge system alerts
   • Watch WebSocket connectivity indicator

🚀 Your masterpiece is ready to showcase!
   The admin panel will show real-time updates from your ${agents.length} agents.
`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down demo server...');
  server.close(() => {
    console.log('✅ Demo server stopped');
    process.exit(0);
  });
});