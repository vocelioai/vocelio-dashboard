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

      {/* Time Range & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw className="w-4 h-4" />
            <span>Updated {isRealTime ? 'now' : '5 minutes ago'}</span>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} Analytics
          </h3>
          <p className="text-gray-500 mb-6">
            Advanced analytics for {activeTab.replace('-', ' ')} coming soon...
          </p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all">
            🚀 Coming Very Soon
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalyticsProPage;