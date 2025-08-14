import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Activity, Users, Phone,
  Clock, Target, DollarSign, Zap, Brain, Globe, Calendar,
  Filter, Download, RefreshCw, Eye, Settings, Share2,
  ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle,
  Mic2, PhoneCall, UserCheck, UserX, Timer, Award,
  PieChart, LineChart, AreaChart, Gauge, MapPin, Star,
  ThumbsUp, ThumbsDown, MessageSquare, Volume2, Headphones,
  ChevronDown, ChevronUp, ExternalLink, Info, HelpCircle,
  Sparkles, Crown, Shield, Database, Cpu, Network,
  PlayCircle, PauseCircle, FastForward, SkipForward
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, AreaChart as RechartsAreaChart, Area,
  BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AnalyticsProPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [isRealTime, setIsRealTime] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    agent: '',
    campaign: '',
    callStatus: '',
    callQuality: '',
    duration: '',
    leadSource: '',
    priority: ''
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      agent: '',
      campaign: '',
      callStatus: '',
      callQuality: '',
      duration: '',
      leadSource: '',
      priority: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  const [liveMetrics, setLiveMetrics] = useState({
    activeCalls: 1247,
    totalCalls: 45892,
    successRate: 73.2,
    avgDuration: 142,
    revenue: 234567,
    agents: 89,
    satisfaction: 4.6,
    conversionRate: 23.8
  });

  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLiveMetrics(prev => ({
          ...prev,
          activeCalls: Math.max(0, prev.activeCalls + Math.floor(Math.random() * 10) - 5),
          totalCalls: prev.totalCalls + Math.floor(Math.random() * 3),
          successRate: Math.max(50, Math.min(90, prev.successRate + (Math.random() - 0.5) * 0.5)),
          avgDuration: Math.max(60, Math.min(300, prev.avgDuration + (Math.random() - 0.5) * 5)),
          revenue: prev.revenue + Math.floor(Math.random() * 1000)
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  const MetricCard = ({ icon: Icon, title, value, change, color, subtitle, trend }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' : 
            color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
            color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
            color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
            color === 'cyan' ? 'bg-cyan-100 dark:bg-cyan-900/30' :
            color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
            color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
            'bg-blue-100 dark:bg-blue-900/30'} group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 
              color === 'green' ? 'text-green-600 dark:text-green-400' :
              color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
              color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
              color === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' :
              color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
              color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
              color === 'red' ? 'text-red-600 dark:text-red-400' :
              'text-blue-600 dark:text-blue-400'}`} />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
          <p className={`text-3xl font-bold ${color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 
            color === 'green' ? 'text-green-600 dark:text-green-400' :
            color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
            color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
            color === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' :
            color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
            color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
            color === 'red' ? 'text-red-600 dark:text-red-400' :
            'text-blue-600 dark:text-blue-400'}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {change && (
          <div className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change > 0 ? '+' : ''}{change}% vs last period
          </div>
        )}
      </div>
    );
  };

  // Sample data for charts
  const chartData = {
    callVolume: [
      { time: '00:00', calls: 120, successful: 85, failed: 35 },
      { time: '04:00', calls: 98, successful: 70, failed: 28 },
      { time: '08:00', calls: 245, successful: 180, failed: 65 },
      { time: '12:00', calls: 389, successful: 285, failed: 104 },
      { time: '16:00', calls: 425, successful: 310, failed: 115 },
      { time: '20:00', calls: 298, successful: 215, failed: 83 },
    ],
    callResults: [
      { name: 'Successful', value: 1247, color: '#10b981' },
      { name: 'Failed', value: 453, color: '#ef4444' },
      { name: 'Pending', value: 289, color: '#f59e0b' }
    ],
    performance: [
      { date: 'Mon', successRate: 72, avgDuration: 145, satisfaction: 4.2 },
      { date: 'Tue', successRate: 75, avgDuration: 138, satisfaction: 4.4 },
      { date: 'Wed', successRate: 73, avgDuration: 142, satisfaction: 4.3 },
      { date: 'Thu', successRate: 78, avgDuration: 135, satisfaction: 4.6 },
      { date: 'Fri', successRate: 76, avgDuration: 140, satisfaction: 4.5 },
      { date: 'Sat', successRate: 74, avgDuration: 144, satisfaction: 4.3 },
      { date: 'Sun', successRate: 71, avgDuration: 148, satisfaction: 4.1 }
    ]
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  const RealChart = ({ title, type = 'line', height = 'h-64', data, dataKey, color = '#3b82f6' }) => {
    if (type === 'area') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
          <div className={height}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart data={chartData.callVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="calls" stroke={color} fill={color} fillOpacity={0.3} />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (type === 'pie') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
          <div className={height}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.callResults}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.callResults.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (type === 'bar') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
          <div className={height}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData.performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="successRate" fill={color} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // Default line chart
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
        <div className={height}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData.performance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="successRate" stroke={color} strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const ChartPlaceholder = ({ title, type = 'line', height = 'h-64' }) => (
    <div className={`${height} bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center`}>
      <div className="text-center">
        {type === 'line' && <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
        {type === 'bar' && <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
        {type === 'pie' && <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
        {type === 'area' && <AreaChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xs text-gray-400">Interactive chart visualization</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-2xl p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
              📊 Analytics Pro - Advanced Intelligence Dashboard
            </h1>
            <p className="text-gray-400">
              Real-time insights, AI-powered analytics, and performance optimization
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-white">{isRealTime ? 'Live' : 'Paused'}</span>
            </div>
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                isRealTime 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              {isRealTime ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              <span>{isRealTime ? 'Pause' : 'Resume'}</span>
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2">
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'agents', label: 'Agent Analytics', icon: Users },
            { id: 'campaigns', label: 'Campaign Analytics', icon: Target },
            { id: 'voice', label: 'Voice Analytics', icon: Mic2 },
            { id: 'ai-insights', label: 'AI Insights', icon: Brain },
            { id: 'real-time', label: 'Real-time Monitor', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-500" />
            <span>Advanced Filters</span>
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all font-medium relative ${
              showFilters
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {hasActiveFilters && (
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Agent Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agent
                </label>
                <select 
                  value={filters.agent}
                  onChange={(e) => updateFilter('agent', e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Agents</option>
                  <option value="john">John Smith</option>
                  <option value="sarah">Sarah Johnson</option>
                  <option value="mike">Mike Wilson</option>
                  <option value="emma">Emma Davis</option>
                </select>
              </div>

              {/* Campaign Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign
                </label>
                <select 
                  value={filters.campaign}
                  onChange={(e) => updateFilter('campaign', e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Campaigns</option>
                  <option value="summer">Summer Promotion</option>
                  <option value="onboarding">New Customer Onboarding</option>
                  <option value="retention">Customer Retention</option>
                  <option value="upsell">Upsell Campaign</option>
                </select>
              </div>

              {/* Call Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Call Status
                </label>
                <select 
                  value={filters.callStatus}
                  onChange={(e) => updateFilter('callStatus', e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="answered">Answered</option>
                  <option value="voicemail">Voicemail</option>
                  <option value="busy">Busy</option>
                  <option value="no-answer">No Answer</option>
                </select>
              </div>

              {/* Call Quality Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Call Quality
                </label>
                <select 
                  value={filters.callQuality}
                  onChange={(e) => updateFilter('callQuality', e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Quality Levels</option>
                  <option value="excellent">Excellent (9-10)</option>
                  <option value="good">Good (7-8)</option>
                  <option value="average">Average (5-6)</option>
                  <option value="poor">Poor (1-4)</option>
                </select>
              </div>
            </div>

            {/* Second Row of Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Call Duration
                </label>
                <select 
                  value={filters.duration}
                  onChange={(e) => updateFilter('duration', e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Durations</option>
                  <option value="short">Short (0-2 min)</option>
                  <option value="medium">Medium (2-5 min)</option>
                  <option value="long">Long (5+ min)</option>
                </select>
              </div>

              {/* Lead Source Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lead Source
                </label>
                <select 
                  value={filters.leadSource}
                  onChange={(e) => updateFilter('leadSource', e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sources</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social Media</option>
                  <option value="email">Email Campaign</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select 
                  value={filters.priority}
                  onChange={(e) => updateFilter('priority', e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              <div className="flex items-end">
                <button 
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className={`w-full px-4 py-2 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                    hasActiveFilters
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Live Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              icon={PhoneCall}
              title="Active Calls"
              value={liveMetrics.activeCalls.toLocaleString()}
              color="green"
              subtitle="Real-time active sessions"
              trend={isRealTime ? 2.3 : null}
            />
            <MetricCard
              icon={Target}
              title="Success Rate"
              value={`${liveMetrics.successRate.toFixed(1)}%`}
              color="blue"
              subtitle="Conversion performance"
              change={5.2}
            />
            <MetricCard
              icon={Clock}
              title="Avg Duration"
              value={`${Math.floor(liveMetrics.avgDuration / 60)}:${(liveMetrics.avgDuration % 60).toString().padStart(2, '0')}`}
              color="purple"
              subtitle="Call duration (min:sec)"
              change={-3.1}
            />
            <MetricCard
              icon={DollarSign}
              title="Revenue Today"
              value={`$${(liveMetrics.revenue / 1000).toFixed(0)}K`}
              color="emerald"
              subtitle="Generated revenue"
              change={12.8}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              icon={Users}
              title="Active Agents"
              value={liveMetrics.agents}
              color="cyan"
              subtitle="Currently online"
            />
            <MetricCard
              icon={Star}
              title="Satisfaction"
              value={liveMetrics.satisfaction.toFixed(1)}
              color="yellow"
              subtitle="Customer rating (1-5)"
              change={0.3}
            />
            <MetricCard
              icon={Zap}
              title="Conversion Rate"
              value={`${liveMetrics.conversionRate.toFixed(1)}%`}
              color="orange"
              subtitle="Lead to appointment"
              change={2.7}
            />
            <MetricCard
              icon={Globe}
              title="Total Calls"
              value={liveMetrics.totalCalls.toLocaleString()}
              color="blue"
              subtitle="All-time total"
            />
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>Call Volume Trends</span>
              </h3>
              <RealChart title="Call volume over time with trend analysis" type="area" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                <span>Call Outcomes Distribution</span>
              </h3>
              <RealChart title="Success, failed, and pending call breakdown" type="pie" />
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Performance Highlights</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-bold">Top Performer</h4>
                <p className="text-lg font-bold text-green-600">Emma Thompson</p>
                <p className="text-sm text-gray-500">94% success rate</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-bold">Best Campaign</h4>
                <p className="text-lg font-bold text-blue-600">Financial Services</p>
                <p className="text-sm text-gray-500">91% conversion rate</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-bold">Growth Leader</h4>
                <p className="text-lg font-bold text-purple-600">Solar Lead Gen</p>
                <p className="text-sm text-gray-500">+23% this month</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              icon={BarChart3}
              title="Overall Performance"
              value="87.3%"
              color="blue"
              subtitle="Weighted average score"
              change={3.2}
            />
            <MetricCard
              icon={Timer}
              title="Response Time"
              value="1.8s"
              color="green"
              subtitle="Average AI response"
              change={-12.5}
            />
            <MetricCard
              icon={CheckCircle}
              title="Quality Score"
              value="94.1%"
              color="purple"
              subtitle="Call quality rating"
              change={1.7}
            />
            <MetricCard
              icon={ThumbsUp}
              title="Customer Satisfaction"
              value="4.7/5"
              color="yellow"
              subtitle="Post-call feedback"
              change={0.2}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4">Performance Trends</h3>
              <RealChart title="Performance metrics over time" type="line" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4">Performance by Hour</h3>
              <RealChart title="Hourly performance breakdown" type="bar" />
            </div>
          </div>
        </div>
      )}

      {/* Other tabs can be added here */}
      {activeTab !== 'overview' && activeTab !== 'performance' && (
        <div className="space-y-6">
          {/* Real-time metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total {activeTab.replace('-', ' ')}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {activeTab === 'calls' ? '15,847' : activeTab === 'campaigns' ? '234' : activeTab === 'leads' ? '8,924' : '1,247'}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium">+12.5%</span>
                <span className="text-gray-500 text-sm ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {activeTab === 'calls' ? '68.5%' : activeTab === 'campaigns' ? '74.2%' : activeTab === 'leads' ? '45.8%' : '82.1%'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium">+5.2%</span>
                <span className="text-gray-500 text-sm ml-2">vs last week</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {activeTab === 'calls' ? '4:32' : activeTab === 'campaigns' ? '12.5d' : activeTab === 'leads' ? '2.8h' : '8.7min'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-red-500 text-sm font-medium">-2.1%</span>
                <span className="text-gray-500 text-sm ml-2">vs last week</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue Impact</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {activeTab === 'calls' ? '$45.2K' : activeTab === 'campaigns' ? '$125.8K' : activeTab === 'leads' ? '$89.4K' : '$34.1K'}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium">+18.7%</span>
                <span className="text-gray-500 text-sm ml-2">vs last month</span>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} Performance Trends
            </h3>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive {activeTab} performance chart</p>
                <p className="text-sm text-gray-400 mt-1">Showing trends over the last 30 days</p>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Top Performing {activeTab.replace('-', ' ')}
              </h4>
              <div className="space-y-3">
                {['Campaign Alpha', 'Lead Source Beta', 'Agent Performance', 'Customer Segment'].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium">{item}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500 font-semibold">{85 + index * 3}%</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Areas for Improvement
              </h4>
              <div className="space-y-3">
                {['Response Time', 'Follow-up Rate', 'Conversion Quality', 'Customer Satisfaction'].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="font-medium">{item}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-red-500 font-semibold">{45 + index * 5}%</span>
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-semibold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Recommended Actions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Optimize Peak Hours</h5>
                <p className="text-sm text-blue-600 dark:text-blue-400">Schedule more calls during 2-4 PM for 23% higher success rate</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-medium text-green-700 dark:text-green-300 mb-2">Improve Scripts</h5>
                <p className="text-sm text-green-600 dark:text-green-400">Update opening lines to increase engagement by 15%</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h5 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Agent Training</h5>
                <p className="text-sm text-purple-600 dark:text-purple-400">Focus on objection handling for top 3 agents</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsProPage;