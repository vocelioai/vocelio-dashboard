import React, { useState, useEffect } from 'react';
import { 
  Brain, Bot, Zap, Activity, TrendingUp, Play, Pause, Settings,
  Star, Heart, Award, Target, Users, MessageSquare, Phone, Video,
  BarChart3, PieChart, Clock, CheckCircle, AlertTriangle, X,
  Plus, Search, Filter, Download, Upload, Edit, Trash2, Copy,
  MoreHorizontal, RefreshCw, Share2, Eye, EyeOff, Volume2, VolumeX,
  Mic, Speaker, Headphones, Monitor, Smartphone, Globe, Shield,
  Database, Server, FileText, CreditCard, Building, MapPin,
  Calendar, Mail, Tag, Bookmark, ArrowRight, ChevronRight
} from 'lucide-react';

const AIAgentsEnhanced = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, analytics
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock AI agents data with enhanced features
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'Customer Support Pro',
      description: 'Advanced customer service AI with sentiment analysis and escalation protocols',
      category: 'customer-service',
      status: 'active',
      performance: {
        satisfaction: 98,
        responseTime: 1.2,
        resolutionRate: 94,
        callsHandled: 15847,
        avgCallDuration: '3m 45s'
      },
      features: {
        nlp: true,
        sentimentAnalysis: true,
        multilingual: true,
        voiceCloning: false,
        realTimeTranscription: true,
        emotionalIntelligence: true
      },
      voice: {
        model: 'Professional Female',
        language: 'English (US)',
        tone: 'Friendly, Professional',
        speed: 'Normal',
        customizations: ['Empathy Enhanced', 'Technical Vocabulary']
      },
      integrations: ['Salesforce', 'Zendesk', 'Slack', 'Twilio'],
      deployment: {
        environment: 'Production',
        instances: 12,
        uptime: 99.8,
        lastUpdate: '2025-08-10'
      },
      analytics: {
        totalInteractions: 45234,
        successfulResolutions: 42519,
        escalations: 1205,
        avgSentimentScore: 8.7
      },
      tags: ['customer-service', 'high-performance', 'multilingual'],
      created: '2025-06-15',
      lastActive: '2025-08-13T10:30:00Z'
    },
    {
      id: 2,
      name: 'Sales Assistant Elite',
      description: 'AI sales agent with advanced lead qualification and conversion optimization',
      category: 'sales',
      status: 'active',
      performance: {
        satisfaction: 89,
        responseTime: 0.8,
        resolutionRate: 87,
        callsHandled: 8932,
        avgCallDuration: '7m 12s'
      },
      features: {
        nlp: true,
        sentimentAnalysis: true,
        multilingual: false,
        voiceCloning: true,
        realTimeTranscription: true,
        emotionalIntelligence: true
      },
      voice: {
        model: 'Professional Male',
        language: 'English (US)',
        tone: 'Confident, Persuasive',
        speed: 'Slightly Fast',
        customizations: ['Sales Expertise', 'Industry Knowledge']
      },
      integrations: ['HubSpot', 'Pipedrive', 'Calendly', 'Zoom'],
      deployment: {
        environment: 'Production',
        instances: 8,
        uptime: 99.5,
        lastUpdate: '2025-08-08'
      },
      analytics: {
        totalInteractions: 23567,
        successfulResolutions: 20503,
        escalations: 2145,
        avgSentimentScore: 7.9
      },
      tags: ['sales', 'lead-generation', 'conversion'],
      created: '2025-07-01',
      lastActive: '2025-08-13T09:15:00Z'
    },
    {
      id: 3,
      name: 'Technical Support Specialist',
      description: 'Expert AI for complex technical troubleshooting and product guidance',
      category: 'technical',
      status: 'training',
      performance: {
        satisfaction: 92,
        responseTime: 2.1,
        resolutionRate: 88,
        callsHandled: 3421,
        avgCallDuration: '12m 34s'
      },
      features: {
        nlp: true,
        sentimentAnalysis: false,
        multilingual: false,
        voiceCloning: false,
        realTimeTranscription: true,
        emotionalIntelligence: false
      },
      voice: {
        model: 'Technical Expert',
        language: 'English (US)',
        tone: 'Clear, Analytical',
        speed: 'Slow',
        customizations: ['Technical Terminology', 'Step-by-step Guidance']
      },
      integrations: ['Jira', 'Confluence', 'ServiceNow'],
      deployment: {
        environment: 'Staging',
        instances: 2,
        uptime: 97.2,
        lastUpdate: '2025-08-12'
      },
      analytics: {
        totalInteractions: 8934,
        successfulResolutions: 7862,
        escalations: 743,
        avgSentimentScore: 8.1
      },
      tags: ['technical-support', 'troubleshooting', 'expert'],
      created: '2025-08-01',
      lastActive: '2025-08-12T16:45:00Z'
    },
    {
      id: 4,
      name: 'Appointment Scheduler',
      description: 'Intelligent scheduling assistant with calendar optimization and conflict resolution',
      category: 'scheduling',
      status: 'active',
      performance: {
        satisfaction: 96,
        responseTime: 0.5,
        resolutionRate: 99,
        callsHandled: 12456,
        avgCallDuration: '2m 18s'
      },
      features: {
        nlp: true,
        sentimentAnalysis: false,
        multilingual: true,
        voiceCloning: false,
        realTimeTranscription: true,
        emotionalIntelligence: false
      },
      voice: {
        model: 'Friendly Assistant',
        language: 'Multi-language',
        tone: 'Helpful, Efficient',
        speed: 'Normal',
        customizations: ['Calendar Expertise', 'Time Zone Awareness']
      },
      integrations: ['Google Calendar', 'Outlook', 'Calendly', 'Zoom'],
      deployment: {
        environment: 'Production',
        instances: 6,
        uptime: 99.9,
        lastUpdate: '2025-08-05'
      },
      analytics: {
        totalInteractions: 34567,
        successfulResolutions: 34222,
        escalations: 123,
        avgSentimentScore: 9.1
      },
      tags: ['scheduling', 'calendar', 'automation'],
      created: '2025-05-20',
      lastActive: '2025-08-13T11:22:00Z'
    }
  ]);

  const [stats] = useState({
    totalAgents: 47,
    activeAgents: 34,
    trainingAgents: 8,
    totalInteractions: 234567,
    avgSatisfaction: 93.5,
    totalUptime: 99.2
  });

  const categories = [
    { id: 'all', name: 'All Agents', icon: Brain, count: stats.totalAgents },
    { id: 'customer-service', name: 'Customer Service', icon: MessageSquare, count: 15 },
    { id: 'sales', name: 'Sales & Marketing', icon: Target, count: 12 },
    { id: 'technical', name: 'Technical Support', icon: Settings, count: 8 },
    { id: 'scheduling', name: 'Scheduling', icon: Calendar, count: 6 },
    { id: 'general', name: 'General Purpose', icon: Bot, count: 6 }
  ];

  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    training: { label: 'Training', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', icon: Pause },
    error: { label: 'Error', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPerformanceColor = (score) => {
    if (score >= 95) return 'text-green-600 dark:text-green-400';
    if (score >= 85) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Agents Enhanced</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🤖 Advanced AI workforce • Real-time analytics • Enterprise features
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/10 text-purple-500 px-4 py-2 rounded-lg font-semibold">
                {stats.activeAgents} Active
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Agent</span>
              </button>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-6 gap-6 mt-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Agents</p>
                  <p className="text-2xl font-bold">{stats.totalAgents}</p>
                </div>
                <Brain className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Now</p>
                  <p className="text-2xl font-bold">{stats.activeAgents}</p>
                </div>
                <Activity className="w-8 h-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Interactions</p>
                  <p className="text-2xl font-bold">{formatNumber(stats.totalInteractions)}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Avg Satisfaction</p>
                  <p className="text-2xl font-bold">{stats.avgSatisfaction}%</p>
                </div>
                <Star className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">System Uptime</p>
                  <p className="text-2xl font-bold">{stats.totalUptime}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-teal-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">In Training</p>
                  <p className="text-2xl font-bold">{stats.trainingAgents}</p>
                </div>
                <Clock className="w-8 h-8 text-indigo-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search Agents</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search AI agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Plus className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">Create New Agent</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Upload className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">Import Configuration</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">View Analytics</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Global Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedCategory === 'all' ? 'All AI Agents' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-500 dark:text-gray-400">
                  ({filteredAgents.length} agents)
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAgents.map((agent) => {
                const StatusIcon = statusConfig[agent.status].icon;
                return (
                  <div
                    key={agent.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group p-6"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{agent.category.replace('-', ' ')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[agent.status].color}`}>
                          {statusConfig[agent.status].label}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {agent.description}
                    </p>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</span>
                          <span className={`font-semibold ${getPerformanceColor(agent.performance.satisfaction)}`}>
                            {agent.performance.satisfaction}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Calls</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatNumber(agent.performance.callsHandled)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Response</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {agent.performance.responseTime}s
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Resolution</span>
                          <span className={`font-semibold ${getPerformanceColor(agent.performance.resolutionRate)}`}>
                            {agent.performance.resolutionRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.features.nlp && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-md">
                          NLP
                        </span>
                      )}
                      {agent.features.sentimentAnalysis && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-md">
                          Sentiment
                        </span>
                      )}
                      {agent.features.multilingual && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-md">
                          Multilingual
                        </span>
                      )}
                      {agent.features.voiceCloning && (
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs rounded-md">
                          Voice Clone
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                          <Play className="w-4 h-4 text-green-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                          <Settings className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                          <BarChart3 className="w-4 h-4 text-blue-500" />
                        </button>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No AI agents found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or create a new agent.
                </p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl transition-all"
                >
                  Create Your First Agent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentsEnhanced;
