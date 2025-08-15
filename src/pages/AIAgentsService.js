import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bot, Brain, Zap, TrendingUp, BarChart3, Users, Settings, Plus, Search, Filter,
  Play, Pause, RotateCw, Eye, MessageSquare, Phone, Video, Star, Award, Target,
  Activity, Clock, CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Maximize2,
  Minimize2, Upload, Download, Share2, Copy, Edit, Trash2, MoreHorizontal,
  Mic, Headphones, Volume2, VolumeX, Globe, Shield, Database, Server, Cpu,
  Network, Layers, Gauge, Timer, Wand2, LineChart, User, UserCheck, UserX,
  Briefcase, MapPin, Calendar, Mail, Tag, Bookmark, ArrowRight, ChevronRight,
  FileText, CreditCard, Building, Home, Sun, Car, GraduationCap, ShoppingBag,
  Monitor, RefreshCw, ExternalLink, Info, HelpCircle, X
} from 'lucide-react';

// Import the AI agents API client
import { aiAgentsApi } from '../api/apiClients';

const AIAgentsService = () => {
  // Core state management
  const [darkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [agents, setAgents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedVoice, setSelectedVoice] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, analytics
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [optimizingAgent, setOptimizingAgent] = useState(null);
  const [conversationTest, setConversationTest] = useState(null);
  
  // Form state
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    industry: 'solar',
    voice_type: 'confident_mike'
  });

  // Backend-matched enums and data
  const industries = [
    { value: 'all', label: 'All Industries', icon: Globe },
    { value: 'solar', label: 'Solar Energy', icon: Sun },
    { value: 'insurance', label: 'Insurance', icon: Shield },
    { value: 'real_estate', label: 'Real Estate', icon: Home },
    { value: 'healthcare', label: 'Healthcare', icon: Activity },
    { value: 'financial', label: 'Financial', icon: CreditCard },
    { value: 'automotive', label: 'Automotive', icon: Car },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'retail', label: 'Retail', icon: ShoppingBag },
    { value: 'technology', label: 'Technology', icon: Monitor },
    { value: 'other', label: 'Other', icon: Building }
  ];

  const voiceTypes = [
    { value: 'confident_mike', label: 'Confident Mike', description: 'Assertive and persuasive' },
    { value: 'friendly_sarah', label: 'Friendly Sarah', description: 'Warm and approachable' },
    { value: 'professional_david', label: 'Professional David', description: 'Business-focused and credible' },
    { value: 'energetic_jessica', label: 'Energetic Jessica', description: 'Enthusiastic and motivating' },
    { value: 'calm_robert', label: 'Calm Robert', description: 'Soothing and trustworthy' },
    { value: 'persuasive_anna', label: 'Persuasive Anna', description: 'Compelling and influential' }
  ];

  const statusTypes = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
    { value: 'training', label: 'Training', color: 'blue' },
    { value: 'optimizing', label: 'Optimizing', color: 'orange' },
    { value: 'paused', label: 'Paused', color: 'yellow' }
  ];

  // API functions matching backend endpoints
  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedIndustry !== 'all') params.append('industry', selectedIndustry);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const response = await aiAgentsApi.request(`/agents?${params.toString()}`);
      setAgents(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to load agents:', error);
      setError('Failed to load agents');
      // Fallback to demo data
      setAgents(getDemoAgents());
    } finally {
      setLoading(false);
    }
  }, [selectedIndustry, selectedStatus]);

  const loadAnalytics = useCallback(async () => {
    try {
      const response = await aiAgentsApi.request('/analytics');
      setAnalytics(response);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Use inline demo data
      setAnalytics({
        total_agents: 247,
        active_agents: 245,
        top_performers: getDemoAgents().slice(0, 3),
        industry_breakdown: {
          solar: 45,
          insurance: 38,
          real_estate: 42,
          healthcare: 35,
          financial: 32,
          automotive: 28,
          education: 15,
          retail: 12
        },
        performance_trends: {
          calls_today: 15847,
          calls_growth: 12.5,
          revenue_today: 245680,
          revenue_growth: 18.2,
          success_rate: 94.2,
          success_growth: 3.1
        },
        optimization_opportunities: [
          {
            agent_id: '1',
            recommendation_type: 'voice_optimization',
            description: 'Switch to Persuasive Anna voice for 15% improvement',
            expected_improvement: 15.0,
            confidence: 0.92,
            estimated_revenue_impact: 450000
          }
        ]
      });
    }
  }, []);

  const loadAiInsights = useCallback(async () => {
    try {
      const response = await aiAgentsApi.request('/ai-insights');
      setAiInsights(response);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
      // Use inline demo data
      setAiInsights({
        enabled: true,
        model_status: 'operational',
        insights: [
          {
            type: 'performance',
            message: '🚀 Top performing agents are 23% more effective with Confident Mike voice',
            confidence: 0.94,
            impact: 'high'
          },
          {
            type: 'optimization',
            message: '💡 AI optimization could improve 34 agents by 18% average',
            confidence: 0.87,
            impact: 'medium'
          }
        ]
      });
    }
  }, []);

  const loadAiStatus = useCallback(async () => {
    try {
      const response = await aiAgentsApi.request('/ai-status');
      setAiStatus(response);
    } catch (error) {
      console.error('Failed to load AI status:', error);
      // Use inline demo data
      setAiStatus({
        ai_model: 'Claude Opus 4.1',
        status: 'operational',
        response_time: 1.2,
        accuracy: 97.3,
        optimization_queue: 5,
        active_optimizations: 2
      });
    }
  }, []);

  // Initialize data
  useEffect(() => {
    loadAgents();
    loadAnalytics();
    loadAiInsights();
    loadAiStatus();
  }, [loadAgents, loadAnalytics, loadAiInsights, loadAiStatus]);

  // Demo data fallback (matching backend structure)
  const getDemoAgents = () => [
    {
      id: '1',
      name: 'Solar Sales Elite',
      description: 'High-performance solar energy sales specialist with advanced AI optimization',
      industry: 'solar',
      voice_type: 'confident_mike',
      status: 'active',
      performance_score: 96.8,
      success_rate: 94.2,
      total_calls: 15847,
      revenue_generated: 3200000,
      last_active: new Date().toISOString(),
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Insurance Pro Agent',
      description: 'Expert insurance consultant with personalized approach and high conversion rates',
      industry: 'insurance',
      voice_type: 'professional_david',
      status: 'active',
      performance_score: 94.5,
      success_rate: 91.8,
      total_calls: 12543,
      revenue_generated: 2850000,
      last_active: new Date().toISOString(),
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Real Estate Specialist',
      description: 'Premium real estate advisor with market expertise and client relationship focus',
      industry: 'real_estate',
      voice_type: 'friendly_sarah',
      status: 'optimizing',
      performance_score: 92.1,
      success_rate: 89.4,
      total_calls: 9876,
      revenue_generated: 4100000,
      last_active: new Date().toISOString(),
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const getDemoAnalytics = () => ({
    total_agents: 247,
    active_agents: 245,
    top_performers: getDemoAgents().slice(0, 3),
    industry_breakdown: {
      solar: 45,
      insurance: 38,
      real_estate: 42,
      healthcare: 35,
      financial: 32,
      automotive: 28,
      education: 15,
      retail: 12
    },
    performance_trends: {
      calls_today: 15847,
      calls_growth: 12.5,
      revenue_today: 245680,
      revenue_growth: 18.2,
      success_rate: 94.2,
      success_growth: 3.1
    },
    optimization_opportunities: [
      {
        agent_id: '1',
        recommendation_type: 'voice_optimization',
        description: 'Switch to Persuasive Anna voice for 15% improvement',
        expected_improvement: 15.0,
        confidence: 0.92,
        estimated_revenue_impact: 450000
      }
    ]
  });

  const getDemoAiInsights = () => ({
    enabled: true,
    model_status: 'operational',
    insights: [
      {
        type: 'performance',
        message: '🚀 Top performing agents are 23% more effective with Confident Mike voice',
        confidence: 0.94,
        impact: 'high'
      },
      {
        type: 'optimization',
        message: '💡 AI optimization could improve 34 agents by 18% average',
        confidence: 0.87,
        impact: 'medium'
      }
    ]
  });

  const getDemoAiStatus = () => ({
    ai_model: 'Claude Opus 4.1',
    status: 'operational',
    response_time: 1.2,
    accuracy: 97.3,
    optimization_queue: 5,
    active_optimizations: 2
  });

  // Agent operations
  const createAgent = async () => {
    try {
      const response = await aiAgentsApi.request('/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgent)
      });
      
      setAgents(prev => [...(Array.isArray(prev) ? prev : []), response]);
      setShowCreateModal(false);
      setNewAgent({ name: '', description: '', industry: 'solar', voice_type: 'confident_mike' });
    } catch (error) {
      console.error('Failed to create agent:', error);
      setError('Failed to create agent');
    }
  };

  const optimizeAgent = async (agentId) => {
    try {
      setOptimizingAgent(agentId);
      await aiAgentsApi.request(`/agents/${agentId}/ai-optimize`, {
        method: 'POST'
      });
      
      // Reload agents to get updated data
      await loadAgents();
    } catch (error) {
      console.error('Failed to optimize agent:', error);
      setError('Failed to optimize agent');
    } finally {
      setOptimizingAgent(null);
    }
  };

  const testConversation = async (agentId, testScenario = "Hi, I'm interested in learning more about your services") => {
    try {
      const response = await aiAgentsApi.request(`/agents/${agentId}/ai-conversation-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_scenario: testScenario })
      });
      
      setConversationTest(response);
    } catch (error) {
      console.error('Failed to test conversation:', error);
      setError('Failed to test conversation');
    }
  };

  // Filtering and search
  const filteredAgents = (Array.isArray(agents) ? agents : []).filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || agent.industry === selectedIndustry;
    const matchesVoice = selectedVoice === 'all' || agent.voice_type === selectedVoice;
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    
    return matchesSearch && matchesIndustry && matchesVoice && matchesStatus;
  });

  // Helper functions
  const getIndustryIcon = (industry) => {
    const industryMap = {
      solar: Sun,
      insurance: Shield,
      real_estate: Home,
      healthcare: Activity,
      financial: CreditCard,
      automotive: Car,
      education: GraduationCap,
      retail: ShoppingBag,
      technology: Monitor,
      other: Building
    };
    return industryMap[industry] || Building;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      active: 'green',
      inactive: 'gray',
      training: 'blue',
      optimizing: 'orange',
      paused: 'yellow'
    };
    return colorMap[status] || 'gray';
  };

  const getPerformanceColor = (score) => {
    if (score >= 95) return 'green';
    if (score >= 90) return 'blue';
    if (score >= 80) return 'yellow';
    return 'red';
  };

  // Component: Metric Card
  const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend, onClick }) => {
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
      <div 
        className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} 
          backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 group cursor-pointer relative overflow-hidden`}
        onClick={onClick}
      >
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
                {trend !== undefined && (
                  <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    <span className="font-medium">{Math.abs(trend)}%</span>
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

  // Component: Agent Card
  const AgentCard = ({ agent }) => {
    const IndustryIcon = getIndustryIcon(agent.industry);
    const statusColor = getStatusColor(agent.status);
    const performanceColor = getPerformanceColor(agent.performance_score);

    return (
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
        backdrop-blur-sm rounded-xl border p-6 hover:shadow-lg transition-all duration-300 group`}>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
              performanceColor === 'green' ? 'from-green-500 to-emerald-500' :
              performanceColor === 'blue' ? 'from-blue-500 to-cyan-500' :
              performanceColor === 'yellow' ? 'from-yellow-500 to-orange-500' :
              'from-red-500 to-pink-500'
            } flex items-center justify-center`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{agent.name}</h3>
              <div className="flex items-center space-x-2">
                <IndustryIcon className="w-4 h-4 text-gray-500" />
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {industries.find(i => i.value === agent.industry)?.label || agent.industry}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColor === 'green' ? 'bg-green-500/10 text-green-500' :
            statusColor === 'blue' ? 'bg-blue-500/10 text-blue-500' :
            statusColor === 'orange' ? 'bg-orange-500/10 text-orange-500' :
            statusColor === 'yellow' ? 'bg-yellow-500/10 text-yellow-500' :
            'bg-gray-500/10 text-gray-500'
          }`}>
            {agent.status}
          </div>
        </div>

        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>
          {agent.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className={`text-2xl font-bold ${
              performanceColor === 'green' ? 'text-green-500' :
              performanceColor === 'blue' ? 'text-blue-500' :
              performanceColor === 'yellow' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {agent.performance_score?.toFixed(1) || '0.0'}%
            </p>
            <p className="text-sm text-gray-500">Performance Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-500">{agent.success_rate?.toFixed(1) || '0.0'}%</p>
            <p className="text-sm text-gray-500">Success Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-lg font-semibold text-cyan-500">{agent.total_calls?.toLocaleString() || '0'}</p>
            <p className="text-sm text-gray-500">Total Calls</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-emerald-500">
              ${(agent.revenue_generated || 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Revenue Generated</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-2">
            <Mic className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {voiceTypes.find(v => v.value === agent.voice_type)?.label || agent.voice_type}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => testConversation(agent.id)}
              className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
              title="Test Conversation"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => optimizeAgent(agent.id)}
              disabled={optimizingAgent === agent.id}
              className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors disabled:opacity-50"
              title="AI Optimize"
            >
              {optimizingAgent === agent.id ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setSelectedAgent(agent)}
              className="p-2 rounded-lg bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Component: Overview Tab
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50' : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-200/50'} 
        rounded-2xl border p-8 backdrop-blur-xl`}>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
              🤖 AI Agents Service
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Managing {analytics?.total_agents || 247} AI agents • {analytics?.active_agents || 245} active • 
              Performance: {analytics?.performance_trends?.success_rate?.toFixed(1) || '94.2'}%
            </p>
          </div>
          
          <div className="flex space-x-3">
            {aiStatus && (
              <div className={`px-4 py-2 rounded-xl ${
                aiStatus.status === 'operational' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              } border border-current/20`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    aiStatus.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                  } animate-pulse`}></div>
                  <span className="font-medium">{aiStatus.ai_model}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Agent</span>
            </button>
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights && aiInsights.insights && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-xl ${
                insight.impact === 'high' ? 'bg-green-500/10 border-green-500/20' :
                insight.impact === 'medium' ? 'bg-blue-500/10 border-blue-500/20' :
                'bg-yellow-500/10 border-yellow-500/20'
              } border`}>
                <p className="text-sm font-medium">{insight.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Confidence: {(insight.confidence * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={Bot}
            title="Total Agents"
            value={analytics.total_agents?.toLocaleString() || '247'}
            subtitle="AI-powered agents"
            color="blue"
            trend={5.2}
          />
          <MetricCard
            icon={Activity}
            title="Active Agents"
            value={analytics.active_agents?.toLocaleString() || '245'}
            subtitle="Currently operational"
            color="green"
            trend={2.1}
          />
          <MetricCard
            icon={Phone}
            title="Calls Today"
            value={analytics.performance_trends?.calls_today?.toLocaleString() || '15,847'}
            subtitle="Total calls processed"
            color="purple"
            trend={analytics.performance_trends?.calls_growth || 12.5}
          />
          <MetricCard
            icon={TrendingUp}
            title="Revenue Today"
            value={`$${(analytics.performance_trends?.revenue_today || 245680).toLocaleString()}`}
            subtitle="Generated revenue"
            color="orange"
            trend={analytics.performance_trends?.revenue_growth || 18.2}
          />
        </div>
      )}

      {/* Top Performers */}
      {analytics?.top_performers && (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Award className="w-6 h-6 text-yellow-500" />
            <span>Top Performing Agents</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.top_performers.slice(0, 3).map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {/* Industry Breakdown */}
      {analytics?.industry_breakdown && (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <span>Industry Distribution</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(analytics.industry_breakdown).map(([industry, count]) => {
              const industryData = industries.find(i => i.value === industry);
              const IndustryIcon = industryData?.icon || Building;
              
              return (
                <div key={industry} className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-4 text-center`}>
                  <IndustryIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-semibold text-lg">{count}</p>
                  <p className="text-sm text-gray-500 capitalize">{industryData?.label || industry}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Component: Agents Tab
  const AgentsTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm border border-gray-700/50`}>
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            {industries.map(industry => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>

          {/* Voice Filter */}
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="all">All Voices</option>
            {voiceTypes.map(voice => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            {statusTypes.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              List
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={loadAgents}
            className="p-2 rounded-lg bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 transition-colors"
            title="Refresh Agents"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Agents Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RotateCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500">Loading agents...</span>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-500">No agents found</p>
          <p className="text-gray-400">Try adjusting your filters or create a new agent</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
          'space-y-4'
        }>
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );

  // Main render
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'agents', label: 'Agents', icon: Bot },
            { id: 'analytics', label: 'Analytics', icon: LineChart },
            { id: 'optimization', label: 'AI Optimization', icon: Wand2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'agents' && <AgentsTab />}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <LineChart className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <p className="text-xl">Advanced Analytics Dashboard</p>
            <p className="text-gray-400">Comprehensive performance analytics and insights</p>
          </div>
        )}
        {activeTab === 'optimization' && (
          <div className="text-center py-12">
            <Wand2 className="w-16 h-16 mx-auto text-purple-500 mb-4" />
            <p className="text-xl">AI Optimization Center</p>
            <p className="text-gray-400">AI-powered agent optimization and recommendations</p>
          </div>
        )}

        {/* Create Agent Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-md mx-4`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create New Agent</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Agent Name</label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter agent name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newAgent.description}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter agent description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <select
                    value={newAgent.industry}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, industry: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    {industries.filter(i => i.value !== 'all').map(industry => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Voice Type</label>
                  <select
                    value={newAgent.voice_type}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, voice_type: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    {voiceTypes.map(voice => (
                      <option key={voice.value} value={voice.value}>
                        {voice.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createAgent}
                  disabled={!newAgent.name || !newAgent.description}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Agent
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 p-1 hover:bg-red-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Conversation Test Modal */}
        {conversationTest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-2xl mx-4`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Conversation Test Results</h2>
                <button
                  onClick={() => setConversationTest(null)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="font-medium text-blue-400 mb-2">Test Scenario:</p>
                  <p>{conversationTest.test_scenario}</p>
                </div>

                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="font-medium text-green-400 mb-2">AI Response:</p>
                  <p>{conversationTest.ai_response}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-500/10 rounded-lg">
                    <p className="font-medium mb-1">Response Time</p>
                    <p className="text-2xl font-bold text-cyan-500">{conversationTest.response_time}s</p>
                  </div>
                  <div className="p-4 bg-gray-500/10 rounded-lg">
                    <p className="font-medium mb-1">Quality Score</p>
                    <p className="text-2xl font-bold text-purple-500">{conversationTest.quality_score}/10</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setConversationTest(null)}
                className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgentsService;
