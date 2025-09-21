'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Calendar, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Generate mock data
const generateData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      requests: Math.floor(Math.random() * 500) + 200,
      responses: Math.floor(Math.random() * 480) + 190,
      errors: Math.floor(Math.random() * 20) + 5,
    });
  }
  return data;
};

export default function PerformanceChart() {
  const [data, setData] = useState(generateData());
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg">
          <p className="text-white/80 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-white/60">{entry.name}:</span>
              <span className="text-xs text-white font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-chart rounded-xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">System Performance</h2>
          <p className="text-sm text-white/60">Real-time request and response metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="glass rounded-lg p-1 flex">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-all',
                  timeRange === range
                    ? 'bg-gradient-to-r from-cyan-400/20 to-purple-400/20 text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {range}
              </button>
            ))}
          </div>
          {/* Chart Type Toggle */}
          <button
            onClick={() => setChartType(chartType === 'line' ? 'area' : 'line')}
            className="glass-button p-2 rounded-lg"
          >
            <Activity className="w-4 h-4" />
          </button>
          {/* Download Button */}
          <button className="glass-button p-2 rounded-lg">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff00ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                }}
                iconType="rect"
                formatter={(value) => (
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                    {value}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#00ffff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRequests)"
              />
              <Area
                type="monotone"
                dataKey="responses"
                stroke="#ff00ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorResponses)"
              />
              <Area
                type="monotone"
                dataKey="errors"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorErrors)"
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                }}
                iconType="line"
                formatter={(value) => (
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                    {value}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#00ffff"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="responses"
                stroke="#ff00ff"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-white/50 mb-1">Avg Response Time</p>
          <p className="text-lg font-semibold text-cyan-400">124ms</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/50 mb-1">Success Rate</p>
          <p className="text-lg font-semibold text-green-400">99.8%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/50 mb-1">Total Requests</p>
          <p className="text-lg font-semibold text-purple-400">8.2M</p>
        </div>
      </div>
    </motion.div>
  );
}

const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};