import React, { useState, useEffect } from 'react';
import { 
  Target, Plus, Zap, Download, Search, Filter, BarChart3, Play, Pause, Settings,
  TrendingUp, Phone, Clock, Calendar, Users, Globe, Brain, TestTube, Copy,
  ArrowUpRight, ArrowDownRight, Eye, Edit, MoreHorizontal, Radio, Sparkles,
  Crosshair, PhoneCall, MessageCircle, Headset, Gauge, Timer, Map,
  Crown, Rocket, Wand2, Flame, Star, Award, Trophy, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Share2, Link, ExternalLink,
  LineChart, PieChart, Activity, Layers, Network, Shield, Lock
} from 'lucide-react';

const SmartCampaignsDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [campaignSearchQuery, setCampaignSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_date');
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [createCampaignStep, setCreateCampaignStep] = useState(1);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [showPerformancePredictions, setShowPerformancePredictions] = useState(false);
  const [showABTestModal, setShowABTestModal] = useState(false);
  const [selectedCampaignForClone, setSelectedCampaignForClone] = useState(null);

  const handleStartCampaign = (campaignId) => {
    setCampaigns(prev => prev.map(camp => 
      camp.id === campaignId 
        ? { ...camp, status: 'active', lastUpdated: new Date().toLocaleTimeString() }
        : camp
    ));
    alert(`🚀 Campaign "${campaigns.find(c => c.id === campaignId)?.name}" started successfully!`);
  };

  const handlePauseCampaign = (campaignId) => {
    setCampaigns(prev => prev.map(camp => 
      camp.id === campaignId 
        ? { ...camp, status: 'paused', lastUpdated: new Date().toLocaleTimeString() }
        : camp
    ));
    alert(`⏸️ Campaign "${campaigns.find(c => c.id === campaignId)?.name}" paused.`);
  };

  const handleCloneCampaign = (campaignId) => {
    const originalCampaign = campaigns.find(c => c.id === campaignId);
    const clonedCampaign = {
      ...originalCampaign,
      id: `camp_${Date.now()}`,
      name: `${originalCampaign.name} (Copy)`,
      status: 'draft',
      callsMade: 0,
      revenue: 0,
      progress: 0
    };
    setCampaigns(prev => [clonedCampaign, ...prev]);
    alert(`📋 Campaign "${originalCampaign.name}" cloned successfully!`);
  };

  // Live metrics that update every 2 seconds
  const [liveMetrics, setLiveMetrics] = useState({
    activeCampaigns: 89,
    avgSuccessRate: 24.5,
    totalCallsToday: 47200,
    revenueThisMonth: 2400000,
    aiOptimizationScore: 94.7,
    globalReachCountries: 47,
    realTimeActiveAgents: 247
  });

  // Enhanced campaign data with advanced features
  const [campaigns, setCampaigns] = useState([
    {
      id: 'camp_001',
      name: 'Solar Lead Generation Pro Max',
      industry: 'Solar Energy',
      status: 'active',
      priority: 'high',
      agent: { name: 'Sarah Premium', id: 'agent_sarah_001' },
      location: 'California, USA',
      schedule: { start: '9:00 AM', end: '6:00 PM', timezone: 'PST' },
      successRate: 34.2,
      callsMade: 2847,
      progress: 74,
      revenue: 847293,
      tags: ['AI Optimized', 'Geo Targeted', 'High Value', 'A/B Testing'],
      created_at: '2024-01-15T10:00:00Z',
      liveCalls: 23,
      callsToday: 342,
      conversionsToday: 117,
      abTest: { isRunning: true, uplift: 15.3 },
      optimization: { aiScore: 94, suggestions: 3 },
      predictions: {
        expectedSuccessRate: 38.7,
        projectedRevenue: 950000,
        confidence: 94
      }
    },
    {
      id: 'camp_002',
      name: 'Insurance Warm Leads Blitz',
      industry: 'Insurance',
      status: 'running',
      priority: 'medium',
      agent: { name: 'Mike Confident', id: 'agent_mike_002' },
      location: 'Texas, USA',
      schedule: { start: '8:00 AM', end: '7:00 PM', timezone: 'CST' },
      successRate: 28.9,
      callsMade: 1523,
      progress: 52,
      revenue: 456892,
      tags: ['Warm Leads', 'Priority Medium', 'Insurance Pro'],
      created_at: '2024-01-12T14:30:00Z',
      liveCalls: 18,
      callsToday: 267,
      conversionsToday: 77,
      abTest: { isRunning: false },
      optimization: { aiScore: 87, suggestions: 1 },
      predictions: {
        expectedSuccessRate: 31.2,
        projectedRevenue: 520000,
        confidence: 89
      }
    },
    {
      id: 'camp_003',
      name: 'Healthcare Follow-ups Elite',
      industry: 'Healthcare',
      status: 'scheduled',
      priority: 'high',
      agent: { name: 'Lisa Professional', id: 'agent_lisa_003' },
      location: 'New York, USA',
      schedule: { start: '9:00 AM', end: '5:00 PM', timezone: 'EST' },
      successRate: 0,
      callsMade: 0,
      progress: 95,
      revenue: 0,
      tags: ['HIPAA Compliant', 'AI Callbacks', 'Healthcare Pro'],
      created_at: '2024-01-20T09:00:00Z',
      liveCalls: 0,
      callsToday: 0,
      conversionsToday: 0,
      abTest: { isRunning: false },
      optimization: { aiScore: 92, suggestions: 2 },
      predictions: {
        expectedSuccessRate: 42.1,
        projectedRevenue: 1200000,
        confidence: 96
      }
    },
    {
      id: 'camp_004',
      name: 'Real Estate Hot Prospects',
      industry: 'Real Estate',
      status: 'paused',
      priority: 'low',
      agent: { name: 'David Expert', id: 'agent_david_004' },
      location: 'Florida, USA',
      schedule: { start: '10:00 AM', end: '8:00 PM', timezone: 'EST' },
      successRate: 19.7,
      callsMade: 892,
      progress: 35,
      revenue: 234567,
      tags: ['Real Estate', 'Hot Prospects', 'Weekend Ready'],
      created_at: '2024-01-10T11:15:00Z',
      liveCalls: 0,
      callsToday: 0,
      conversionsToday: 0,
      abTest: { isRunning: false },
      optimization: { aiScore: 76, suggestions: 5 },
      predictions: {
        expectedSuccessRate: 25.4,
        projectedRevenue: 320000,
        confidence: 82
      }
    }
  ]);

  // Campaign templates for creation
  const campaignTemplates = [
    {
      id: 'solar_premium',
      name: 'Solar Energy Premium',
      icon: '☀️',
      description: 'High-converting solar lead generation with AI optimization',
      expectedSuccessRate: '35-45%',
      avgRevenue: '$800K-1.2M',
      features: ['AI Voice Optimization', 'Geographic Targeting', 'A/B Testing', 'TCPA Compliant']
    },
    {
      id: 'insurance_pro',
      name: 'Insurance Professional',
      icon: '🛡️',
      description: 'Warm insurance leads with empathetic AI agents',
      expectedSuccessRate: '28-38%',
      avgRevenue: '$500K-800K',
      features: ['Empathy Engine', 'Multi-State Compliance', 'Callback Optimization', 'CRM Integration']
    },
    {
      id: 'healthcare_elite',
      name: 'Healthcare Elite',
      icon: '🏥',
      description: 'HIPAA-compliant healthcare follow-ups and appointments',
      expectedSuccessRate: '40-50%',
      avgRevenue: '$1M-1.5M',
      features: ['HIPAA Compliance', 'Medical Terminology', 'Appointment Scheduling', 'Patient Care']
    },
    {
      id: 'realestate_luxury',
      name: 'Real Estate Luxury',
      icon: '🏠',
      description: 'High-end real estate prospects and luxury listings',
      expectedSuccessRate: '25-35%',
      avgRevenue: '$600K-1M',
      features: ['Luxury Market Focus', 'Property Analytics', 'Weekend Calling', 'Market Insights']
    }
  ];

  // Form data for campaign creation
  const [campaignFormData, setCampaignFormData] = useState({
    name: '',
    industry: '',
    agent: '',
    priority: 'medium',
    location: '',
    schedule: { start: '9:00 AM', end: '6:00 PM', timezone: 'EST' },
    settings: {}
  });

  // Live metrics update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        totalCallsToday: prev.totalCallsToday + Math.floor(Math.random() * 10),
        avgSuccessRate: Math.max(20, Math.min(30, prev.avgSuccessRate + (Math.random() - 0.5) * 0.2)),
        aiOptimizationScore: Math.max(90, Math.min(100, prev.aiOptimizationScore + (Math.random() - 0.5) * 0.1))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Filter and sort campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesFilter = campaignFilter === 'all' || campaign.status === campaignFilter;
    const matchesSearch = campaign.name.toLowerCase().includes(campaignSearchQuery.toLowerCase()) ||
                         campaign.industry.toLowerCase().includes(campaignSearchQuery.toLowerCase()) ||
                         campaign.agent.name.toLowerCase().includes(campaignSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case 'success_rate':
        return b.successRate - a.successRate;
      case 'revenue':
        return b.revenue - a.revenue;
      case 'calls_made':
        return b.callsMade - a.callsMade;
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  // Campaign selection handlers
  const handleCampaignSelect = (campaignId) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === sortedCampaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(sortedCampaigns.map(c => c.id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section with Live Global Metrics */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-purple-200/50'} 
        rounded-2xl border p-8 backdrop-blur-xl relative overflow-hidden`}>
        
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Target className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
                    🎯 Smart Campaigns Center
                  </h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                    AI-powered campaigns with {liveMetrics.avgSuccessRate.toFixed(1)}% average success rate • {liveMetrics.activeCampaigns} active campaigns
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-500 font-medium">Live Updates Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-500 font-medium">{liveMetrics.globalReachCountries} Countries</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-purple-500 font-medium">AI Score: {liveMetrics.aiOptimizationScore.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowCreateCampaign(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Create Campaign</span>
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-xl">
                <Zap className="w-5 h-5" />
                <span>Smart Blast</span>
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-xl">
                <Download className="w-5 h-5" />
                <span>Import Leads</span>
              </button>
            </div>
          </div>

          {/* Live Global Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-green-400 mb-2 animate-pulse">{liveMetrics.activeCampaigns}</div>
              <div className="text-sm font-medium text-green-300">Active Campaigns</div>
              <div className="text-xs text-green-400 mt-1">+12 this week</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-blue-400 mb-2">{liveMetrics.avgSuccessRate.toFixed(1)}%</div>
              <div className="text-sm font-medium text-blue-300">Avg Success Rate</div>
              <div className="text-xs text-green-400 mt-1">+3.2% this month</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-purple-400 mb-2">{(liveMetrics.totalCallsToday / 1000).toFixed(1)}K</div>
              <div className="text-sm font-medium text-purple-300">Total Calls Today</div>
              <div className="text-xs text-green-400 mt-1">Peak hours active</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-orange-400 mb-2">${(liveMetrics.revenueThisMonth / 1000000).toFixed(1)}M</div>
              <div className="text-sm font-medium text-orange-300">Revenue This Month</div>
              <div className="text-xs text-green-400 mt-1">142% of target</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters & Advanced Controls */}
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
        <div className="flex flex-col space-y-4">
          {/* Top Row - Filters and Advanced Actions */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setCampaignFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  campaignFilter === 'all' 
                    ? 'bg-blue-500/20 text-blue-500 border border-blue-500/20' 
                    : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                }`}
              >
                All Campaigns ({campaigns.length})
              </button>
              <button 
                onClick={() => setCampaignFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  campaignFilter === 'active' 
                    ? 'bg-green-500/20 text-green-500 border border-green-500/20' 
                    : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                }`}
              >
                Active ({campaigns.filter(c => c.status === 'active').length})
              </button>
              <button 
                onClick={() => setCampaignFilter('running')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  campaignFilter === 'running' 
                    ? 'bg-blue-500/20 text-blue-500 border border-blue-500/20' 
                    : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                }`}
              >
                Running ({campaigns.filter(c => c.status === 'running').length})
              </button>
              <button 
                onClick={() => setCampaignFilter('scheduled')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  campaignFilter === 'scheduled' 
                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' 
                    : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                }`}
              >
                Scheduled ({campaigns.filter(c => c.status === 'scheduled').length})
              </button>
              <button 
                onClick={() => setCampaignFilter('paused')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  campaignFilter === 'paused' 
                    ? 'bg-red-500/20 text-red-500 border border-red-500/20' 
                    : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                }`}
              >
                Paused ({campaigns.filter(c => c.status === 'paused').length})
              </button>
            </div>
            
            {/* Advanced AI-Powered Actions */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowPerformancePredictions(true)}
                className="px-4 py-2 bg-purple-500/10 text-purple-500 rounded-lg font-medium hover:bg-purple-500/20 transition-colors flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>AI Predictions</span>
              </button>
              <button 
                onClick={() => setShowABTestModal(true)}
                className="px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg font-medium hover:bg-orange-500/20 transition-colors flex items-center space-x-2"
              >
                <TestTube className="w-4 h-4" />
                <span>A/B Test</span>
              </button>
              <button className="px-4 py-2 bg-cyan-500/10 text-cyan-500 rounded-lg font-medium hover:bg-cyan-500/20 transition-colors flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Auto-Optimize</span>
              </button>
            </div>
            
            {/* Bulk Actions */}
            {selectedCampaigns.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{selectedCampaigns.length} selected</span>
                <button className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-sm hover:bg-green-500/20 transition-colors">
                  Start All
                </button>
                <button className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm hover:bg-yellow-500/20 transition-colors">
                  Pause All
                </button>
                <button className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-sm hover:bg-blue-500/20 transition-colors">
                  Clone Selected
                </button>
                <button className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-lg text-sm hover:bg-purple-500/20 transition-colors">
                  Export Data
                </button>
              </div>
            )}
          </div>

          {/* Bottom Row - Enhanced Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns, agents, industries..."
                  value={campaignSearchQuery}
                  onChange={(e) => setCampaignSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border w-full ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                      : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                />
              </div>
              <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-colors`}>
                <Filter className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                <option value="created_date">Created Date</option>
                <option value="success_rate">Success Rate</option>
                <option value="revenue">Revenue</option>
                <option value="calls_made">Calls Made</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedCampaigns.length === sortedCampaigns.length && sortedCampaigns.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="select-all" className="text-sm text-gray-500">Select All</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Campaign Grid with Advanced Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedCampaigns.map((campaign) => (
          <div key={campaign.id} className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
            backdrop-blur-sm rounded-xl border p-6 hover:shadow-lg transition-all duration-300 group relative`}>
            
            {/* A/B Test Indicator */}
            {campaign.abTest?.isRunning && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500/10 text-orange-500 text-xs rounded-full border border-orange-500/20">
                A/B Test: +{campaign.abTest.uplift}%
              </div>
            )}
            
            {/* AI Optimization Score */}
            {campaign.optimization?.aiScore > 90 && (
              <div className="absolute top-2 right-12 px-2 py-1 bg-purple-500/10 text-purple-500 text-xs rounded-full border border-purple-500/20">
                🤖 AI: {campaign.optimization.aiScore}%
              </div>
            )}
            
            {/* Selection Checkbox */}
            <div className="absolute top-4 right-4">
              <input
                type="checkbox"
                checked={selectedCampaigns.includes(campaign.id)}
                onChange={() => handleCampaignSelect(campaign.id)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500 focus:ring-2"
              />
            </div>
            
            <div className="flex items-start justify-between mb-4 pr-8 mt-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                  campaign.status === 'active' ? 'from-green-500 to-emerald-500' :
                  campaign.status === 'running' ? 'from-blue-500 to-cyan-500' :
                  campaign.status === 'scheduled' ? 'from-yellow-500 to-orange-500' :
                  'from-gray-500 to-gray-600'
                } flex items-center justify-center relative`}>
                  <Target className="w-6 h-6 text-white" />
                  {(campaign.status === 'active' || campaign.status === 'running') && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{campaign.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {campaign.industry} • {campaign.priority.charAt(0).toUpperCase() + campaign.priority.slice(1)} Priority
                  </p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                campaign.status === 'active' ? 'bg-green-500/10 text-green-500' :
                campaign.status === 'running' ? 'bg-blue-500/10 text-blue-500' :
                campaign.status === 'scheduled' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </div>
            </div>

            {/* AI Predictions Banner */}
            {campaign.predictions && (
              <div className="mb-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-500 flex items-center">
                    <Brain className="w-4 h-4 mr-1" />
                    AI Prediction
                  </span>
                  <span className="text-sm text-purple-500">{campaign.predictions.confidence}% confident</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-purple-500">{campaign.predictions.expectedSuccessRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Expected Rate</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">${(campaign.predictions.projectedRevenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Proj. Revenue</div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Metrics */}
            {campaign.status === 'active' || campaign.status === 'running' ? (
              <div className="mb-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-500 flex items-center">
                    <Radio className="w-4 h-4 mr-1 animate-pulse" />
                    Live Now
                  </span>
                  <span className="text-sm text-blue-500">{campaign.liveCalls} active calls</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-500">{campaign.callsToday}</div>
                    <div className="text-xs text-gray-500">Calls Today</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">{campaign.conversionsToday}</div>
                    <div className="text-xs text-gray-500">Conversions</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-500">
                      {campaign.callsToday > 0 ? ((campaign.conversionsToday / campaign.callsToday) * 100).toFixed(1) : '0.0'}%
                    </div>
                    <div className="text-xs text-gray-500">Rate Today</div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className={`text-2xl font-bold flex items-center ${
                  campaign.successRate > 30 ? 'text-green-500' :
                  campaign.successRate > 20 ? 'text-blue-500' :
                  campaign.successRate > 0 ? 'text-yellow-500' : 'text-gray-500'
                }`}>
                  {campaign.successRate > 0 ? `${campaign.successRate}%` : 'Starting'}
                  {campaign.abTest?.isRunning && (
                    <TrendingUp className="w-4 h-4 ml-1 text-orange-500" />
                  )}
                </p>
                <p className="text-sm text-gray-500">Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{campaign.callsMade.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Calls Made</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  {campaign.status === 'scheduled' ? 'Preparation' : 'Progress'}
                </span>
                <span className="text-sm font-medium">{campaign.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`bg-gradient-to-r ${
                  campaign.status === 'active' ? 'from-green-500 to-emerald-500' :
                  campaign.status === 'running' ? 'from-blue-500 to-cyan-500' :
                  campaign.status === 'scheduled' ? 'from-yellow-500 to-orange-500' :
                  'from-gray-500 to-gray-600'
                } h-2 rounded-full transition-all duration-300`} style={{width: `${campaign.progress}%`}}></div>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Agent:</span>
                <span className="font-medium">{campaign.agent.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Location:</span>
                <span className="font-medium">{campaign.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Schedule:</span>
                <span className="font-medium">{campaign.schedule.start} - {campaign.schedule.end} {campaign.schedule.timezone}</span>
              </div>
              {campaign.status === 'scheduled' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Starts:</span>
                  <span className="font-medium text-yellow-500">Tomorrow 9:00 AM</span>
                </div>
              )}
              {campaign.optimization?.suggestions > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">AI Suggestions:</span>
                  <span className="font-medium text-purple-500">{campaign.optimization.suggestions} available</span>
                </div>
              )}
            </div>

            {/* Enhanced Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {campaign.tags.map((tag, index) => (
                <span key={index} className={`px-2 py-1 text-xs rounded-full ${
                  tag.includes('High') || tag.includes('high') ? 'bg-red-500/10 text-red-500' :
                  tag.includes('AI') || tag.includes('ai') || tag.includes('Optimized') ? 'bg-purple-500/10 text-purple-500' :
                  tag.includes('Geo') || tag.includes('Targeted') ? 'bg-blue-500/10 text-blue-500' :
                  tag.includes('Compliance') || tag.includes('HIPAA') ? 'bg-cyan-500/10 text-cyan-500' :
                  'bg-gray-500/10 text-gray-500'
                }`}>
                  {tag}
                </span>
              ))}
              {campaign.abTest?.isRunning && (
                <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs rounded-full">
                  A/B Testing
                </span>
              )}
            </div>

            {/* Revenue & Enhanced Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-500">Revenue: </span>
                <span className="font-bold text-green-500">
                  {campaign.revenue > 0 ? `${campaign.revenue.toLocaleString()}` : 'Est. $1.2M'}
                </span>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors" title="View Analytics">
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {setSelectedCampaignForClone(campaign); setShowAdvancedModal(true);}}
                  className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 transition-colors" 
                  title="Clone Campaign"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {campaign.status === 'active' || campaign.status === 'running' ? (
                  <button 
                    onClick={() => handlePauseCampaign(campaign.id)}
                    className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-colors" 
                    title="Pause Campaign"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : campaign.status === 'paused' ? (
                  <button 
                    onClick={() => handleStartCampaign(campaign.id)}
                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors" 
                    title="Resume Campaign"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStartCampaign(campaign.id)}
                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors" 
                    title="Start Campaign"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors" title="Campaign Settings">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Campaign Card */}
        <div className={`${darkMode ? 'bg-gray-800/30 border-gray-700/50 border-dashed' : 'bg-white/30 border-gray-300/50 border-dashed'} 
          rounded-xl border-2 p-6 flex flex-col items-center justify-center min-h-[400px] hover:border-solid transition-all duration-300 group cursor-pointer`}
          onClick={() => setShowCreateCampaign(true)}>
          <div className="p-4 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all mb-4">
            <Plus className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Create New Campaign</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center mb-4`}>
            Launch a new AI-powered calling campaign with smart targeting
          </p>
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform group-hover:scale-105">
            Get Started
          </button>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <span>📊 Campaign Performance Analytics</span>
          </h3>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors">
              Real-time
            </button>
            <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
              Daily
            </button>
            <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
              Weekly
            </button>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-xl">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Campaign Analytics Dashboard</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Success rates trending up 15% • Peak performance 2-4 PM • AI optimization active
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Campaign Creation Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">🚀 Create New Campaign</h2>
                  <p className="text-sm text-gray-500 mt-1">Step {createCampaignStep} of 4</p>
                </div>
                <button 
                  onClick={() => {setShowCreateCampaign(false); setCreateCampaignStep(1);}}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  ×
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step < createCampaignStep ? 'bg-green-500 text-white' :
                        step === createCampaignStep ? 'bg-blue-500 text-white' :
                        'bg-gray-300 dark:bg-gray-600 text-gray-500'
                      }`}>
                        {step < createCampaignStep ? '✓' : step}
                      </div>
                      {step < 4 && (
                        <div className={`w-16 h-1 mx-2 rounded ${
                          step < createCampaignStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Template</span>
                  <span>Details</span>
                  <span>Targeting</span>
                  <span>Review</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Template Selection */}
              {createCampaignStep === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose a Campaign Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {campaignTemplates.map((template) => (
                      <div key={template.id} className={`p-6 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                        darkMode ? 'bg-gray-700/50 border-gray-600/50 hover:border-blue-500/50' : 'bg-gray-50 border-gray-200 hover:border-blue-500/50'
                      }`}>
                        <div className="flex items-start space-x-4">
                          <div className="text-4xl">{template.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2">{template.name}</h4>
                            <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                              <div className="p-2 rounded-lg bg-green-500/10">
                                <span className="text-gray-400">Success Rate:</span>
                                <div className="font-bold text-green-500">{template.expectedSuccessRate}</div>
                              </div>
                              <div className="p-2 rounded-lg bg-blue-500/10">
                                <span className="text-gray-400">Avg Revenue:</span>
                                <div className="font-bold text-blue-500">{template.avgRevenue}</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Features:</span>
                              <div className="flex flex-wrap gap-1">
                                {template.features.map((feature, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      💡 Pro Tip: Solar and Insurance templates have the highest success rates
                    </div>
                    <button 
                      onClick={() => setCreateCampaignStep(2)}
                      className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Campaign Configuration */}
              {createCampaignStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold">Configure Campaign</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Set up your campaign parameters and targeting</p>
                    </div>
                    <div className="text-sm text-blue-500 font-semibold">Step 2 of 4</div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50`}>
                      <h4 className="text-lg font-bold mb-4">Campaign Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Campaign Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Holiday Sales Outreach"
                            className={`w-full px-4 py-3 rounded-lg border ${
                              darkMode 
                                ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                                : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Description</label>
                          <textarea
                            rows="3"
                            placeholder="Brief description of your campaign goals..."
                            className={`w-full px-4 py-3 rounded-lg border ${
                              darkMode 
                                ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                                : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Campaign Type</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                              : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}>
                            <option>Sales Outreach</option>
                            <option>Lead Qualification</option>
                            <option>Customer Follow-up</option>
                            <option>Survey Collection</option>
                            <option>Appointment Setting</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Targeting Options */}
                    <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50`}>
                      <h4 className="text-lg font-bold mb-4">Targeting & Timing</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Target Audience</label>
                          <div className="space-y-2">
                            {['All Leads', 'New Leads', 'Warm Prospects', 'Previous Customers', 'Custom Segment'].map((option, index) => (
                              <label key={index} className="flex items-center space-x-3">
                                <input type="radio" name="audience" className="text-blue-500" />
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Call Schedule</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                              <input
                                type="time"
                                defaultValue="09:00"
                                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                  darkMode 
                                    ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">End Time</label>
                              <input
                                type="time"
                                defaultValue="17:00"
                                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                  darkMode 
                                    ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Days of Week</label>
                          <div className="flex flex-wrap gap-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                              <label key={index} className="flex items-center space-x-1">
                                <input type="checkbox" defaultChecked={index < 5} className="text-blue-500" />
                                <span className="text-sm">{day}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button 
                      onClick={() => setCreateCampaignStep(1)}
                      className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => setCreateCampaignStep(3)}
                      className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      Next: AI Agent Setup
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: AI Agent Configuration */}
              {createCampaignStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold">AI Agent Setup</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Configure your AI agent's behavior and scripts</p>
                    </div>
                    <div className="text-sm text-blue-500 font-semibold">Step 3 of 4</div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Agent Configuration */}
                    <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50`}>
                      <h4 className="text-lg font-bold mb-4">Agent Personality</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Voice Model</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                              : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}>
                            <option>Professional Sarah (Female)</option>
                            <option>Confident Marcus (Male)</option>
                            <option>Friendly Emma (Female)</option>
                            <option>Authoritative David (Male)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Conversation Style</label>
                          <div className="space-y-2">
                            {['Professional & Direct', 'Friendly & Conversational', 'Consultative & Helpful', 'Energetic & Persuasive'].map((style, index) => (
                              <label key={index} className="flex items-center space-x-3">
                                <input type="radio" name="style" className="text-blue-500" defaultChecked={index === 0} />
                                <span className="text-sm">{style}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Objection Handling</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                              : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                          }`}>
                            <option>Standard Responses</option>
                            <option>Aggressive Persistence</option>
                            <option>Gentle Persuasion</option>
                            <option>Educational Approach</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Script Configuration */}
                    <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50`}>
                      <h4 className="text-lg font-bold mb-4">Call Script</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Opening Script</label>
                          <textarea
                            rows="4"
                            placeholder="Hi [First Name], this is [Agent Name] calling from [Company]. I hope I'm catching you at a good time..."
                            className={`w-full px-4 py-3 rounded-lg border text-sm ${
                              darkMode 
                                ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                                : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Key Talking Points</label>
                          <div className="space-y-2">
                            {['Product Benefits', 'Pricing Information', 'Case Studies', 'Special Offers'].map((point, index) => (
                              <label key={index} className="flex items-center space-x-3">
                                <input type="checkbox" defaultChecked className="text-blue-500" />
                                <span className="text-sm">{point}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Call Goal</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                              : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                          }`}>
                            <option>Schedule Demo</option>
                            <option>Direct Sale</option>
                            <option>Qualify Lead</option>
                            <option>Gather Information</option>
                            <option>Set Appointment</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button 
                      onClick={() => setCreateCampaignStep(2)}
                      className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => setCreateCampaignStep(4)}
                      className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      Next: Review & Launch
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Launch */}
              {createCampaignStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold">Review & Launch</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Review your campaign settings and launch</p>
                    </div>
                    <div className="text-sm text-blue-500 font-semibold">Step 4 of 4</div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Campaign Summary */}
                    <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50`}>
                      <h4 className="text-lg font-bold mb-4">Campaign Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Campaign Name:</span>
                          <span className="text-sm font-medium">Holiday Sales Outreach</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Type:</span>
                          <span className="text-sm font-medium">Sales Outreach</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Target Audience:</span>
                          <span className="text-sm font-medium">Warm Prospects</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Expected Leads:</span>
                          <span className="text-sm font-medium text-blue-500">~2,500 contacts</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Estimated Duration:</span>
                          <span className="text-sm font-medium">5-7 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Agent Voice:</span>
                          <span className="text-sm font-medium">Professional Sarah</span>
                        </div>
                      </div>
                    </div>

                    {/* Launch Options */}
                    <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50`}>
                      <h4 className="text-lg font-bold mb-4">Launch Options</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Launch Schedule</label>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-3">
                              <input type="radio" name="launch" className="text-blue-500" defaultChecked />
                              <span className="text-sm">Start Immediately</span>
                            </label>
                            <label className="flex items-center space-x-3">
                              <input type="radio" name="launch" className="text-blue-500" />
                              <span className="text-sm">Schedule for Later</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Call Velocity</label>
                          <select className={`w-full px-4 py-3 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                              : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                          }`}>
                            <option>Conservative (50 calls/hour)</option>
                            <option>Standard (100 calls/hour)</option>
                            <option>Aggressive (200 calls/hour)</option>
                            <option>Maximum (500 calls/hour)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Budget Limit</label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              placeholder="1000"
                              className={`flex-1 px-4 py-3 rounded-lg border ${
                                darkMode 
                                  ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                                  : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                              }`}
                            />
                            <span className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">USD</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50/80 border-green-200/50'} rounded-xl border p-6`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-green-600 dark:text-green-400">Ready to Launch!</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">Your campaign is configured and ready to go</p>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                      Estimated results: 15-20% connection rate, 5-8% qualified leads, ROI: 300-500%
                    </p>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button 
                      onClick={() => setCreateCampaignStep(3)}
                      className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => {
                        setCreateCampaignStep(1);
                        setShowCreateCampaign(false);
                        // Here you would typically save the campaign and start it
                      }}
                      className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold transition-all transform hover:scale-105"
                    >
                      🚀 Launch Campaign
                    </button>
                  </div>
                </div>
              )}

              {/* Other steps fallback */}
              {createCampaignStep > 4 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Campaign Builder Coming Soon!</h3>
                  <p className="text-gray-500 mb-6">Advanced multi-step campaign creation with AI optimization</p>
                  <button 
                    onClick={() => setCreateCampaignStep(1)}
                    className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    Back to Templates
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCampaignsDashboard;