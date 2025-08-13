import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Phone, DollarSign, Calendar, TrendingUp, Users, MapPin, Clock, Target,
  Settings, Bell, Activity, BarChart3, Zap, Globe, Heart, Star,
  PlayCircle, PauseCircle, AlertTriangle, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, Eye, Edit, Play, Pause, MoreHorizontal,
  Mic, MessageSquare, Mail, Smartphone, Home, Building, PieChart,
  FileText, HelpCircle, LogOut, User, Menu, X, Filter, Download,
  Upload, Search, Headphones, Shield, Cpu, Database, GitBranch,
  Layers, Network, Radio, Wifi, Monitor, Tablet, Laptop, Server,
  Cloud, Lock, Unlock, Key, AlertCircle, Info, Award, Trophy,
  Flame, ThumbsUp, ThumbsDown, Volume2, VolumeX, Maximize2,
  Minimize2, RotateCcw, Share2, Link, Copy, ExternalLink,
  RefreshCw, Plus, Store, Workflow, Bot, Mic2, Palette,
  CreditCard, LineChart, TrendingDown, Crosshair, PhoneCall,
  MessageCircle, Headset, Gauge, Sparkles, Timer, Map,
  FileCode, Boxes, Webhook, Shuffle, UserPlus, Crown,
  Rocket, Brain, Wand2, MousePointer, Layers3,
  Command, Code, Wrench, TestTube, Beaker, FlaskConical,
  ShoppingCart, Volume1
} from 'lucide-react';

// Import your page components
import SmartCampaignsDashboard from './pages/SmartCampaigns';
import LiveCallCenter from './pages/CallCenter';
import VoiceLabPage from './pages/VoiceLab';
import FlowBuilderPage from './pages/FlowBuilder';
import AnalyticsProPage from './pages/AnalyticsPro';
import AIBrainCenter from './pages/AIBrain';
import ServiceHealthMonitor from './components/ServiceHealthMonitor';
import IntegrationsCenter from './pages/IntegrationsCenter';
import AgentStore from './pages/AgentStore';
import BillingProCenter from './pages/BillingPro';
import TeamHubDashboard from './pages/TeamHub';
import ComplianceDashboard from './pages/Compliance';
import WhiteLabelDashboard from './pages/WhiteLabelDashboard';
import TwilioNumberPurchase from './pages/PhoneNumbers';
import VocelioSettingsDashboard from './pages/SettingsPage';
import VocelioVoiceMarketplace from './pages/VoiceMarketplace';
import APIDashboard from './pages/DeveloperAPI';

const VocelioUltimateDashboard = () => {
  const [activeTab, setActiveTab] = useState('flow-builder');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: '🎉 High-value prospect detected: $50k potential deal', time: '2m ago', unread: true },
    { id: 2, type: 'warning', message: '⚠️ Campaign #3 success rate dropped 15%', time: '5m ago', unread: true },
    { id: 3, type: 'info', message: '🔗 New integration available: Salesforce Enhanced', time: '10m ago', unread: false },
    { id: 4, type: 'success', message: '🚀 AI optimization boosted performance by 23%', time: '15m ago', unread: true },
    { id: 5, type: 'info', message: '📊 Monthly report ready for download', time: '1h ago', unread: false }
  ]);
  
  const [liveMetrics, setLiveMetrics] = useState({
    activeCalls: 47283,
    revenueToday: 2847592,
    successRate: 23.4,
    bookedToday: 12847,
    totalClients: 98547,
    monthlyCallVolume: 87234567,
    aiOptimizationScore: 94.7,
    systemUptime: 99.99
  });

  useEffect(() => {
    let interval;
    if (activeTab === 'overview') {
      interval = setInterval(() => {
        setLiveMetrics(prev => ({
          ...prev,
          activeCalls: Math.max(1000, prev.activeCalls + Math.floor(Math.random() * 100) - 50),
          revenueToday: prev.revenueToday + Math.floor(Math.random() * 1000),
          successRate: Math.max(15, Math.min(35, prev.successRate + (Math.random() - 0.5) * 0.5)),
          bookedToday: prev.bookedToday + Math.floor(Math.random() * 3),
          aiOptimizationScore: Math.max(85, Math.min(100, prev.aiOptimizationScore + (Math.random() - 0.5) * 0.2))
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  const sidebarItems = [
    { id: 'overview', label: 'Command Center', icon: Command, badge: 'LIVE' },
    { id: 'agents', label: 'AI Agents', icon: Bot, badge: '247' },
    { id: 'smart-campaigns', label: 'Smart Campaigns', icon: Target, badge: '89' },
    { id: 'call-center', label: 'Call Center', icon: PhoneCall, badge: liveMetrics.activeCalls > 1000 ? `${Math.floor(liveMetrics.activeCalls/1000)}k` : liveMetrics.activeCalls },
    { id: 'phone-numbers', label: 'Phone Numbers', icon: Phone, badge: 'NEW' },
    { id: 'voice-marketplace', label: 'Voice Marketplace', icon: ShoppingCart, badge: 'HOT' },
    { id: 'voice-lab', label: 'Voice Lab', icon: Mic2, badge: 'AI' },
    { id: 'flow-builder', label: 'Flow Builder', icon: Workflow, badge: 'AI' },
    { id: 'analytics-pro', label: 'Analytics Pro', icon: BarChart3, badge: null },
    { id: 'ai-brain', label: 'AI Brain', icon: Brain, badge: '94%' },
    { id: 'integrations', label: 'Integrations', icon: Network, badge: '15' },
    { id: 'agent-store', label: 'Agent Store', icon: Store, badge: 'HOT' },
    { id: 'billing-pro', label: 'Billing Pro', icon: CreditCard, badge: null },
    { id: 'team-hub', label: 'Team Hub', icon: Users, badge: null },
    { id: 'compliance', label: 'Compliance', icon: Shield, badge: '100%' },
    { id: 'white-label', label: 'White Label', icon: Palette, badge: 'ENTERPRISE' },
    { id: 'developer-api', label: 'Developer API', icon: Code, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  const aiAgents = [
    {
      id: 'agent_001', name: 'Professional Sarah', industry: 'Real Estate', 
      voice: 'Premium Female', language: 'EN-US', performance: 94.2,
      totalCalls: 23847, successRate: 34.5, revenue: 892340,
      personality: ['Professional', 'Empathetic', 'Goal-Oriented'],
      optimization: 'Active', lastOptimized: '2h ago', status: 'active'
    },
    {
      id: 'agent_002', name: 'Solar Expert Mike', industry: 'Solar Energy',
      voice: 'Confident Male', language: 'EN-US', performance: 97.1,
      totalCalls: 18923, successRate: 42.1, revenue: 1234567,
      personality: ['Confident', 'Technical', 'Persuasive'],
      optimization: 'Active', lastOptimized: '30m ago', status: 'active'
    },
    {
      id: 'agent_003', name: 'Insurance Pro Lisa', industry: 'Insurance',
      voice: 'Caring Female', language: 'EN-US', performance: 89.7,
      totalCalls: 15632, successRate: 29.8, revenue: 456789,
      personality: ['Caring', 'Detailed', 'Trustworthy'],
      optimization: 'Pending', lastOptimized: '1d ago', status: 'optimization'
    }
  ];

  const MetricCard = ({ icon: Icon, title, value, change, color, subtitle }) => {
    const getColorClasses = (colorName) => {
      const colorMap = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500' },
        green: { bg: 'bg-green-500/10', text: 'text-green-500', gradient: 'from-green-500 to-emerald-500' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', gradient: 'from-purple-500 to-pink-500' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', gradient: 'from-orange-500 to-red-500' },
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', gradient: 'from-cyan-500 to-blue-500' }
      };
      return colorMap[colorName] || colorMap.blue;
    };

    const colors = getColorClasses(color);

    return (
      <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} 
        backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 group cursor-pointer relative overflow-hidden`}>
        
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</p>
                  {subtitle && (
                    <p className="text-xs text-gray-500">{subtitle}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <p className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-1`}>
                  {value}
                </p>
                {change !== undefined && (
                  <div className={`flex items-center text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    <span className="font-medium">{Math.abs(change)}%</span>
                    <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>vs last week</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AgentCard = ({ agent }) => (
    <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
      backdrop-blur-sm rounded-xl border p-6 hover:shadow-lg transition-all duration-300 group`}>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
            agent.performance >= 95 ? 'from-green-500 to-emerald-500' :
            agent.performance >= 90 ? 'from-blue-500 to-cyan-500' :
            'from-yellow-500 to-orange-500'
          } flex items-center justify-center`}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{agent.industry}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          agent.status === 'active' ? 'bg-green-500/10 text-green-500' :
          agent.status === 'optimization' ? 'bg-yellow-500/10 text-yellow-500' :
          'bg-gray-500/10 text-gray-500'
        }`}>
          {agent.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className={`text-2xl font-bold ${agent.performance >= 95 ? 'text-green-500' : agent.performance >= 90 ? 'text-blue-500' : 'text-yellow-500'}`}>
            {agent.performance}%
          </p>
          <p className="text-sm text-gray-500">AI Performance</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-500">{agent.successRate}%</p>
          <p className="text-sm text-gray-500">Success Rate</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {agent.personality.map((trait, index) => (
          <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
            {trait}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {agent.totalCalls.toLocaleString()} calls • ${agent.revenue.toLocaleString()} revenue
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
            <Play className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors">
            <Wand2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800/90 via-gray-700/90 to-gray-800/90' : 'bg-gradient-to-r from-blue-50/90 via-cyan-50/90 to-blue-50/90'} 
              rounded-3xl p-8 border ${darkMode ? 'border-gray-700/50' : 'border-blue-200/50'} relative overflow-hidden backdrop-blur-xl`}>
              
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
                      GLOBAL COMMAND CENTER
                    </h1>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Managing {liveMetrics.totalClients.toLocaleString()}+ Enterprise Clients Worldwide
                  </p>
                  <p className="text-sm text-green-500 font-medium">
                    🌍 Real-time Global AI Call Center • 99.99% Uptime • Updated Every 2 Seconds
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
                    <div className="text-5xl font-bold text-blue-400 mb-2 animate-pulse">
                      {(liveMetrics.activeCalls / 1000).toFixed(1)}K
                    </div>
                    <div className="text-sm font-medium text-blue-300">📞 Live Calls</div>
                    <div className="text-xs text-green-400 mt-1">+2.3K/min</div>
                  </div>
                  
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
                    <div className="text-5xl font-bold text-green-400 mb-2">
                      ${(liveMetrics.revenueToday / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm font-medium text-green-300">💰 Daily Revenue</div>
                    <div className="text-xs text-green-400 mt-1">+$847K from target</div>
                  </div>
                  
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
                    <div className="text-5xl font-bold text-purple-400 mb-2">
                      {liveMetrics.successRate.toFixed(1)}%
                    </div>
                    <div className="text-sm font-medium text-purple-300">✅ Global Success</div>
                    <div className="text-xs text-green-400 mt-1">AI Optimized</div>
                  </div>
                  
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
                    <div className="text-5xl font-bold text-orange-400 mb-2">
                      {(liveMetrics.monthlyCallVolume / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm font-medium text-orange-300">📊 Monthly Calls</div>
                    <div className="text-xs text-green-400 mt-1">On track for 100M</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
                    <Rocket className="w-6 h-6" />
                    <span>🚀 Launch Global Campaign</span>
                  </button>
                  <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
                    <Zap className="w-6 h-6" />
                    <span>⚡ AI Smart Blast</span>
                  </button>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
                    <Brain className="w-6 h-6" />
                    <span>🧠 AI Brain Center</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <MetricCard 
                icon={Phone} 
                title="Total Active Clients" 
                value={liveMetrics.totalClients.toLocaleString()} 
                change={12.3} 
                color="blue"
                subtitle="Enterprise scale operations"
              />
              <MetricCard 
                icon={DollarSign} 
                title="Monthly Revenue" 
                value={`$${(liveMetrics.revenueToday * 30 / 1000000).toFixed(1)}M`} 
                change={23.7} 
                color="green"
                subtitle="Projected monthly recurring"
              />
              <MetricCard 
                icon={Cpu} 
                title="AI Optimization Score" 
                value={liveMetrics.aiOptimizationScore.toFixed(1)} 
                change={5.4} 
                color="purple"
                subtitle="Machine learning performance"
              />
              <MetricCard 
                icon={Globe} 
                title="System Uptime" 
                value={`${liveMetrics.systemUptime}%`} 
                change={0.01} 
                color="cyan"
                subtitle="Enterprise SLA guarantee"
              />
            </div>

            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-purple-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl`}>
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold flex items-center space-x-3">
                  <Brain className="w-8 h-8 text-purple-500" />
                  <span>🤖 Enterprise AI Intelligence Center</span>
                  <div className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full">LIVE</div>
                </h3>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
                  View All 247 Insights
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} backdrop-blur-sm`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-bold bg-green-500/10 text-green-500">
                      97% Confidence
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">🚀 Ultra Performance Boost</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    Switch 89% of Solar campaigns to "Confident Mike" voice for immediate 34% success boost
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-500">+$2.3M revenue impact</span>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105">
                      Auto-Apply
                    </button>
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} backdrop-blur-sm`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-bold bg-blue-500/10 text-blue-500">
                      94% Confidence
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">⏰ Global Timing Optimization</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    Peak performance window detected: 2:00-4:00 PM EST across all time zones
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-500">+67% answer rate</span>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105">
                      Schedule Now
                    </button>
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} backdrop-blur-sm`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
                      <Star className="w-6 h-6" />
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-bold bg-orange-500/10 text-orange-500">
                      91% Confidence
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">🎯 High-Value Prospect Alert</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    2,847 ultra-high-value prospects detected with 95%+ booking probability
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-500">$47M potential value</span>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105">
                      Priority Call
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Health Monitor */}
            <ServiceHealthMonitor />
          </div>
        );

      case 'agents':
        return (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50' : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl`}>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                    🤖 AI Agents Command Center
                  </h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Managing 247 AI agents across 89 industries • 94.7% average performance
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Create AI Agent</span>
                  </button>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2">
                    <Wand2 className="w-5 h-5" />
                    <span>AI Optimization</span>
                  </button>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2">
                    <TestTube className="w-5 h-5" />
                    <span>A/B Test</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
                  <div className="text-4xl font-bold text-blue-400 mb-2">247</div>
                  <div className="text-sm font-medium text-blue-300">Active AI Agents</div>
                  <div className="text-xs text-green-400 mt-1">+23 this week</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
                  <div className="text-4xl font-bold text-green-400 mb-2">94.7%</div>
                  <div className="text-sm font-medium text-green-300">Avg Performance</div>
                  <div className="text-xs text-green-400 mt-1">+5.2% this month</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
                  <div className="text-4xl font-bold text-purple-400 mb-2">89</div>
                  <div className="text-sm font-medium text-purple-300">Industries Covered</div>
                  <div className="text-xs text-green-400 mt-1">Complete coverage</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
                  <div className="text-4xl font-bold text-orange-400 mb-2">$47M</div>
                  <div className="text-sm font-medium text-orange-300">Total Revenue</div>
                  <div className="text-xs text-green-400 mt-1">This month</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {aiAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
              
              <div className={`${darkMode ? 'bg-gray-800/30 border-gray-700/50 border-dashed' : 'bg-white/30 border-gray-300/50 border-dashed'} 
                rounded-xl border-2 p-6 flex flex-col items-center justify-center min-h-[300px] hover:border-solid transition-all duration-300 group cursor-pointer`}>
                <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all mb-4">
                  <Plus className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Create New AI Agent</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center mb-4`}>
                  Build a custom AI agent with our advanced AI builder
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform group-hover:scale-105">
                  Start Building
                </button>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                  <span>📊 Advanced Agent Analytics</span>
                </h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors">
                    Performance
                  </button>
                  <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
                    Revenue
                  </button>
                  <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
                    Optimization
                  </button>
                </div>
              </div>
              
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Interactive charts, performance trends, and AI optimization insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      // Add cases for all your page components
      case 'smart-campaigns':
        return <SmartCampaignsDashboard />;
      
      case 'call-center':
        return <LiveCallCenter />;
      
      case 'phone-numbers':
        return <TwilioNumberPurchase />;
      
      case 'voice-marketplace':
        return <VocelioVoiceMarketplace />;
      
      case 'voice-lab':
        return <VoiceLabPage />;
      
      case 'flow-builder':
        return <FlowBuilderPage />;
      
      case 'analytics-pro':
        return <AnalyticsProPage />;
      
      case 'ai-brain':
        return <AIBrainCenter />;
      
      case 'integrations':
        return <IntegrationsCenter />;
      
      case 'agent-store':
        return <AgentStore />;
      
      case 'billing-pro':
        return <BillingProCenter />;
      
      case 'team-hub':
        return <TeamHubDashboard />;
      
      case 'compliance':
        return <ComplianceDashboard />;
      
      case 'white-label':
        return (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <Palette className="w-12 h-12" />
                  <div>
                    <h1 className="text-3xl font-bold">White Label Solutions</h1>
                    <p className="text-purple-100">Enterprise-grade customization platform</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  ← Back to Dashboard
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Crown className="w-8 h-8 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Partner Management</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Manage reseller partners, custom branding, and revenue sharing models.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✅ Custom domains, branding, and white-label solutions available in Enterprise tier
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Zap className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">API Integration</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Full API access for custom integrations and white-label implementations.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      🔧 RESTful API with webhooks, SSO, and custom authentication
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2">🚀 Coming Soon</h3>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Full White Label Dashboard with brand customization, partner analytics, 
                  revenue management, and enterprise controls will be available in the next release.
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                    Request Demo
                  </button>
                  <button className="px-4 py-2 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/30">
                    Contact Enterprise Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'developer-api':
        return <APIDashboard />;
      
      case 'settings':
        return <VocelioSettingsDashboard />;

      default:
        return (
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-8 text-center backdrop-blur-sm`}>
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">
              🚀 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} Center
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto text-lg`}>
              This advanced enterprise feature is being built with cutting-edge AI technology. 
              Our team is crafting something extraordinary that will revolutionize your workflow.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Enterprise Ready</h4>
                <p className="text-sm text-gray-500">Built for 100,000+ clients scale</p>
              </div>
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                <Zap className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold mb-2">AI Powered</h4>
                <p className="text-sm text-gray-500">Advanced machine learning</p>
              </div>
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Enterprise Security</h4>
                <p className="text-sm text-gray-500">Bank-level protection</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
              🎯 Coming Very Soon
            </button>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex relative`}>
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <div className={`${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } ${darkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50'} 
      border-r backdrop-blur-xl transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-50 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl p-1">
              <img 
                src="/logo192.png" 
                alt="Vocelio.ai Logo" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
                  Vocelio.ai
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                  🌍 World's #1 AI Call Center
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`mt-4 p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} 
            transition-all w-full lg:flex items-center justify-center hidden group`}
          >
            {sidebarCollapsed ? 
              <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" /> : 
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            }
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {sidebarItems.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 group relative ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white shadow-2xl transform scale-105'
                    : darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                <Icon className={`w-6 h-6 ${activeTab === id ? 'text-white' : ''} transition-all group-hover:scale-110`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="font-semibold transition-all flex-1 text-left">{label}</span>
                    {badge && (
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        activeTab === id 
                          ? 'bg-white/20 text-white' 
                          : badge === 'LIVE' || badge === 'HOT' || badge === 'NEW'
                            ? 'bg-red-500/10 text-red-500'
                            : badge === 'AI' || badge === 'ENTERPRISE'
                              ? 'bg-purple-500/10 text-purple-500'
                              : 'bg-blue-500/10 text-blue-500'
                        }`}>
                        {badge}
                      </div>
                    )}
                  </>
                )}
                {activeTab === id && (
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700/50 space-y-4">
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100/30'} border border-green-500/20`}>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              {!sidebarCollapsed && (
                <div>
                  <p className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Global System Health
                  </p>
                  <p className="text-xs text-green-500 font-medium">
                    99.99% Uptime • All Systems Operational
                  </p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-100/30 hover:bg-gray-100/50'} 
            transition-all flex items-center justify-center space-x-3 group`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {darkMode ? '🌞' : '🌙'}
            </span>
            {!sidebarCollapsed && (
              <span className="font-semibold">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>

          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100/30'} border border-purple-500/20`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <p className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Enterprise Admin
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Global Control Access
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs text-green-500 font-medium">Online</span>
                  </div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button className="mt-4 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-semibold">
                <LogOut className="w-5 h-5" />
                <span>Secure Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} transition-all duration-300`}>
        <header className={`${darkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50'} 
          border-b px-6 py-4 sticky top-0 z-30 backdrop-blur-xl`}>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-all`}
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl lg:text-3xl font-bold capitalize flex items-center space-x-3">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {activeTab.replace('-', ' ').replace('_', ' ')}
                  </span>
                  {activeTab === 'overview' && <Flame className="w-8 h-8 text-orange-500 animate-pulse" />}
                  {activeTab === 'call-center' && <Radio className="w-8 h-8 text-red-500 animate-pulse" />}
                </h2>
                
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-500 font-medium">Live Updates Active</span>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>•</span>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Global search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-64 px-4 py-2 pl-10 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                      : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <button className={`p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} 
                transition-all relative group`}>
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications.filter(n => n.unread).length}
                </div>
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4">
                  <h4 className="font-bold mb-3">🔔 Live Notifications</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className={`p-3 rounded-lg ${
                        notification.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
                        notification.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                        'bg-blue-500/10 border border-blue-500/20'
                      }`}>
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
              
              <button className={`p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-all`}>
                <Settings className="w-6 h-6" />
              </button>
              
              <button className={`p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-all`}>
                <HelpCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-6 py-8">
          {renderMainContent()}
        </main>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 flex flex-col items-center space-y-4`}>
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="font-semibold">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocelioUltimateDashboard;