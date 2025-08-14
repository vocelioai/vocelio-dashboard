import React, { useState, useEffect } from 'react';
import { 
  Bot, Brain, Store, BarChart3, Users, Zap, Settings, 
  Plus, Search, Eye, Edit, Play,
  Star, Download, ShoppingCart, TrendingUp,
  CheckCircle, Clock, Globe, 
  Mic, Phone, ArrowUpRight,
  ArrowDownRight, Activity, DollarSign,
  Crown, Sparkles, Heart, Copy,
  Upload, FileText,
  Network, Shield,
  Monitor, Headphones, Volume2,
  X, Hash, RefreshCw, Lock, Database
} from 'lucide-react';

const AIAgentPlatform = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [agents, setAgents] = useState([]);
  const [marketplaceAgents, setMarketplaceAgents] = useState([]);
  
  // Platform analytics state
  const [platformMetrics] = useState({
    total_agents: 1247,
    active_agents: 892,
    total_calls: 45328,
    successful_calls: 42156,
    total_users: 2156,
    active_users: 1834,
    total_revenue: 125847.50,
    growth_rate: 12.5,
    avg_performance: 94.2,
    agent_utilization: 76.8
  });

  // Demo agents data
  const [demoAgents] = useState([
    {
      id: '1',
      name: 'Sales Pro Elite',
      description: 'High-performance sales agent with advanced persuasion techniques',
      category: 'sales',
      status: 'active',
      performance_score: 96.2,
      success_rate: 94.1,
      total_calls: 12543,
      revenue_generated: 3200000,
      voice_type: 'Persuasive Anna',
      created_at: '2024-07-15',
      is_deployed: true,
      deployment_platforms: ['Twilio', 'VoIP'],
      tags: ['sales', 'persuasion', 'b2b']
    },
    {
      id: '2',
      name: 'Healthcare Navigator',
      description: 'HIPAA-compliant healthcare services coordinator',
      category: 'healthcare',
      status: 'active',
      performance_score: 93.7,
      success_rate: 91.5,
      total_calls: 8234,
      revenue_generated: 1950000,
      voice_type: 'Calm Robert',
      created_at: '2024-07-20',
      is_deployed: true,
      deployment_platforms: ['Twilio'],
      tags: ['healthcare', 'hipaa', 'appointments']
    },
    {
      id: '3',
      name: 'Financial Advisor Pro',
      description: 'Expert financial planning and investment advisor',
      category: 'finance',
      status: 'active',
      performance_score: 94.8,
      success_rate: 89.3,
      total_calls: 9876,
      revenue_generated: 4100000,
      voice_type: 'Authoritative David',
      created_at: '2024-07-25',
      is_deployed: true,
      deployment_platforms: ['Twilio', 'VoIP', 'SIP'],
      tags: ['finance', 'investment', 'advisory']
    },
    {
      id: '4',
      name: 'Real Estate Expert',
      description: 'Experienced property sales and investment specialist',
      category: 'real_estate',
      status: 'training',
      performance_score: 91.5,
      success_rate: 87.2,
      total_calls: 7654,
      revenue_generated: 2800000,
      voice_type: 'Friendly Sarah',
      created_at: '2024-08-01',
      is_deployed: false,
      deployment_platforms: [],
      tags: ['real-estate', 'property', 'sales']
    },
    {
      id: '5',
      name: 'Tech Support Specialist',
      description: 'Advanced technical support and troubleshooting agent',
      category: 'technology',
      status: 'active',
      performance_score: 88.9,
      success_rate: 85.7,
      total_calls: 15432,
      revenue_generated: 1200000,
      voice_type: 'Professional Michael',
      created_at: '2024-08-05',
      is_deployed: true,
      deployment_platforms: ['Twilio'],
      tags: ['tech-support', 'troubleshooting', 'it']
    }
  ]);

  // Demo marketplace agents
  const [demoMarketplaceAgents] = useState([
    {
      id: 'mp1',
      name: 'Sales Conversion Master',
      description: 'High-converting sales agent with advanced persuasion techniques and objection handling',
      category: 'sales',
      price: 299.99,
      rating: 4.9,
      downloads: 1247,
      is_featured: true,
      vendor: 'Vocelio Pro Solutions',
      capabilities: ['Lead Qualification', 'Objection Handling', 'Conversion Optimization'],
      trial_days: 7,
      demo_available: true
    },
    {
      id: 'mp2',
      name: 'Healthcare Navigator Pro',
      description: 'HIPAA-compliant healthcare agent for patient coordination and appointment scheduling',
      category: 'healthcare',
      price: 449.99,
      rating: 4.8,
      downloads: 892,
      is_featured: true,
      vendor: 'MedTech AI Solutions',
      capabilities: ['HIPAA Compliance', 'Appointment Scheduling', 'Patient Coordination'],
      trial_days: 14,
      demo_available: true
    },
    {
      id: 'mp3',
      name: 'Financial Advisor Elite',
      description: 'Expert financial planning agent with investment advice and risk assessment',
      category: 'finance',
      price: 599.99,
      rating: 4.7,
      downloads: 654,
      is_featured: true,
      vendor: 'FinanceAI Corp',
      capabilities: ['Investment Analysis', 'Risk Assessment', 'Retirement Planning'],
      trial_days: 10,
      demo_available: true
    },
    {
      id: 'mp4',
      name: 'Customer Support Specialist',
      description: 'Multi-language customer support agent with ticket resolution capabilities',
      category: 'customer_service',
      price: 199.99,
      rating: 4.6,
      downloads: 1543,
      is_featured: false,
      vendor: 'ServicePro AI',
      capabilities: ['Multi-language Support', 'Ticket Resolution', 'Escalation Management'],
      trial_days: 7,
      demo_available: true
    }
  ]);

  useEffect(() => {
    setAgents(demoAgents);
    setMarketplaceAgents(demoMarketplaceAgents);
  }, [demoAgents, demoMarketplaceAgents]);

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || agent.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="group relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-500 backdrop-blur-xl hover:scale-105 hover:-translate-y-2 overflow-hidden">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
        color === 'blue' ? 'from-blue-500 to-cyan-500' :
        color === 'green' ? 'from-emerald-500 to-green-500' :
        color === 'purple' ? 'from-purple-500 to-pink-500' :
        color === 'orange' ? 'from-orange-500 to-red-500' :
        'from-blue-500 to-cyan-500'
      }`}></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-1000"></div>
      
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
          color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
          color === 'green' ? 'bg-gradient-to-br from-emerald-500 to-green-500' :
          color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
          color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
          'bg-gradient-to-br from-blue-500 to-cyan-500'
        }`}>
          <Icon className="w-7 h-7 text-white drop-shadow-lg" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full font-bold text-sm shadow-lg ${
            trend > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {trend > 0 ? <ArrowUpRight className="w-4 h-4 animate-bounce" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className={`text-4xl font-black mb-2 group-hover:scale-110 transition-transform duration-300 ${
          color === 'blue' ? 'text-blue-400' :
          color === 'green' ? 'text-emerald-400' :
          color === 'purple' ? 'text-purple-400' :
          color === 'orange' ? 'text-orange-400' :
          'text-blue-400'
        }`}>{value}</p>
        <p className="text-lg font-bold text-white mb-1">{title}</p>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );

  const AgentCard = ({ agent }) => (
    <div className="group relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-500 backdrop-blur-xl overflow-hidden hover:scale-105 hover:-translate-y-2">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
            agent.category === 'sales' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
            agent.category === 'healthcare' ? 'bg-gradient-to-br from-emerald-500 to-green-500' :
            agent.category === 'finance' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
            agent.category === 'real_estate' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
            'bg-gradient-to-br from-gray-500 to-slate-500'
          }`}>
            <Bot className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-white group-hover:text-blue-300 transition-colors duration-300">{agent.name}</h3>
            <p className="text-sm text-gray-400 flex items-center space-x-2">
              <Mic className="w-4 h-4" />
              <span>{agent.voice_type}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {agent.is_deployed && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-2 rounded-full text-xs font-medium shadow-lg">
              <CheckCircle className="w-3 h-3 animate-pulse" />
              <span>Deployed</span>
            </div>
          )}
          <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg border ${
            agent.status === 'active' ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400' :
            agent.status === 'training' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400' :
            'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400'
          }`}>
            {agent.status}
          </div>
        </div>
      </div>

      <p className="relative z-10 text-gray-300 mb-6 text-sm leading-relaxed">{agent.description}</p>

      {/* Enhanced Performance Metrics */}
      <div className="relative z-10 grid grid-cols-3 gap-4 mb-6">
        <div className="text-center bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 group-hover:bg-blue-500/20 transition-colors duration-300">
          <p className="text-3xl font-black text-blue-400 mb-1">{agent.performance_score}%</p>
          <p className="text-xs text-gray-400 font-medium">Performance</p>
        </div>
        <div className="text-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 group-hover:bg-emerald-500/20 transition-colors duration-300">
          <p className="text-3xl font-black text-emerald-400 mb-1">{agent.success_rate}%</p>
          <p className="text-xs text-gray-400 font-medium">Success Rate</p>
        </div>
        <div className="text-center bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 group-hover:bg-purple-500/20 transition-colors duration-300">
          <p className="text-3xl font-black text-purple-400 mb-1">{agent.total_calls.toLocaleString()}</p>
          <p className="text-xs text-gray-400 font-medium">Total Calls</p>
        </div>
      </div>

      {/* Enhanced Revenue Section */}
      <div className="relative z-10 flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <span className="text-sm text-gray-400">Revenue Generated</span>
            <p className="font-black text-xl text-green-400">${agent.revenue_generated.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Tags */}
      {agent.tags && agent.tags.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-2 mb-4">
          {agent.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 text-gray-300 rounded-full text-xs font-medium backdrop-blur-sm">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Enhanced Deployment Platforms */}
      {agent.deployment_platforms && agent.deployment_platforms.length > 0 && (
        <div className="relative z-10 flex items-center space-x-2 mb-6">
          <span className="text-sm text-gray-400 font-medium">Deployed on:</span>
          {agent.deployment_platforms.map(platform => (
            <span key={platform} className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 rounded-full text-xs font-medium shadow-lg">
              {platform}
            </span>
          ))}
        </div>
      )}

      {/* Enhanced Action Buttons */}
      <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10">
        <div className="text-sm text-gray-400">
          Created: {new Date(agent.created_at).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <button className="group/btn p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 transform hover:scale-110" title="View Analytics">
            <BarChart3 className="w-5 h-5 group-hover/btn:animate-pulse" />
          </button>
          <button className="group/btn p-3 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-500/30 text-gray-400 hover:from-gray-500/30 hover:to-slate-500/30 transition-all duration-300 transform hover:scale-110" title="Edit Agent">
            <Edit className="w-5 h-5 group-hover/btn:animate-pulse" />
          </button>
          <button className="group/btn p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400 hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-300 transform hover:scale-110" title="Deploy">
            <Play className="w-5 h-5 group-hover/btn:animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );

  const MarketplaceCard = ({ agent }) => (
    <div className="group relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-500 backdrop-blur-xl overflow-hidden hover:scale-105 hover:-translate-y-2">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 text-white shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Store className="w-7 h-7 drop-shadow-lg" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors duration-300">{agent.name}</h3>
            <p className="text-sm text-gray-400 flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>by {agent.vendor}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {agent.is_featured && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 text-yellow-400 px-3 py-2 rounded-full text-xs font-bold shadow-lg animate-pulse">
              <Crown className="w-3 h-3" />
              <span>Featured</span>
            </div>
          )}
          <div className="text-right">
            <p className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">${agent.price}</p>
            <p className="text-xs text-gray-400 font-medium">one-time</p>
          </div>
        </div>
      </div>

      <p className="relative z-10 text-gray-300 mb-6 text-sm leading-relaxed">{agent.description}</p>

      {/* Enhanced Rating and Downloads */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.floor(agent.rating) ? 'text-yellow-400 fill-current animate-pulse' : 'text-gray-600'}`} />
            ))}
          </div>
          <span className="text-lg font-bold text-white">{agent.rating}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <Download className="w-4 h-4" />
          <span className="font-medium">{agent.downloads.toLocaleString()} downloads</span>
        </div>
      </div>

      {/* Enhanced Capabilities */}
      <div className="relative z-10 mb-6">
        <h4 className="text-sm font-bold mb-3 text-white">Key Capabilities:</h4>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((capability, index) => (
            <span key={capability} className={`px-3 py-2 rounded-full text-xs font-medium shadow-lg ${
              index % 3 === 0 ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400' :
              index % 3 === 1 ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400' :
              'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400'
            }`}>
              {capability}
            </span>
          ))}
        </div>
      </div>

      {/* Enhanced Trial and Demo Info */}
      <div className="relative z-10 flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <span className="text-sm text-gray-400">Free Trial</span>
            <p className="font-bold text-white">{agent.trial_days} days</p>
          </div>
        </div>
        {agent.demo_available && (
          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 px-3 py-2 rounded-full text-sm font-medium">
            <Play className="w-3 h-3 animate-pulse" />
            <span>Demo Available</span>
          </div>
        )}
      </div>

      {/* Enhanced Action Buttons */}
      <div className="relative z-10 flex space-x-3">
        <button className="flex-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2 font-bold shadow-2xl transform hover:scale-105 group/btn">
          <ShoppingCart className="w-5 h-5 group-hover/btn:animate-bounce" />
          <span>Purchase</span>
        </button>
        <button className="p-3 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 group/btn">
          <Eye className="w-5 h-5 text-gray-400 group-hover/btn:text-white group-hover/btn:animate-pulse" />
        </button>
        {agent.demo_available && (
          <button className="p-3 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/10 transition-all duration-300 transform hover:scale-110 group/btn">
            <Play className="w-5 h-5 group-hover/btn:animate-pulse" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-indigo-900/40 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-bounce"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg"></div>
                <span className="text-sm font-medium text-emerald-300">Platform Operational</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 leading-tight">
              🚀 AI Agent Platform
            </h1>
            <h2 className="text-xl font-semibold text-white/90 mb-2">
              Unified Management & Marketplace
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
              Create, manage, deploy and purchase AI voice agents. Enterprise-grade platform with 
              <span className="font-semibold text-blue-300"> 200+ pre-built agents</span> across 
              <span className="font-semibold text-purple-300"> 8 industries</span>.
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="font-bold text-white">1,834</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Success Rate</p>
                  <p className="font-bold text-white">94.2%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Revenue</p>
                  <p className="font-bold text-white">$125K</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="group relative bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center space-x-3 font-semibold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Plus className="w-5 h-5" />
                <span>Create Agent</span>
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="relative bg-white/5 dark:bg-gray-800/50 rounded-2xl border border-white/10 dark:border-gray-700/50 p-2 backdrop-blur-xl shadow-xl">
        <div className="flex space-x-2 relative">
          {[
            { id: 'overview', label: 'Platform Overview', icon: BarChart3, gradient: 'from-blue-500 to-cyan-500' },
            { id: 'my-agents', label: 'My Agents', icon: Bot, gradient: 'from-purple-500 to-pink-500' },
            { id: 'marketplace', label: 'Agent Marketplace', icon: Store, gradient: 'from-emerald-500 to-green-500' },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp, gradient: 'from-orange-500 to-red-500' },
            { id: 'deployments', label: 'Deployments', icon: Zap, gradient: 'from-violet-500 to-purple-500' },
            { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-gray-500 to-slate-500' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center space-x-2 px-6 py-4 rounded-xl transition-all duration-300 font-medium overflow-hidden group ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl transform scale-105`
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {activeTab === tab.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-75 blur-sm`}></div>
              )}
              <div className="relative flex items-center space-x-2">
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse ml-1"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Platform Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              icon={Bot}
              title="Total Agents"
              value={platformMetrics.total_agents.toLocaleString()}
              subtitle={`${platformMetrics.active_agents} active`}
              color="blue"
              trend={12.5}
            />
            <MetricCard
              icon={Phone}
              title="Total Calls"
              value={platformMetrics.total_calls.toLocaleString()}
              subtitle={`${((platformMetrics.successful_calls / platformMetrics.total_calls) * 100).toFixed(1)}% success rate`}
              color="green"
              trend={8.3}
            />
            <MetricCard
              icon={Users}
              title="Active Users"
              value={platformMetrics.active_users.toLocaleString()}
              subtitle={`${platformMetrics.total_users} total users`}
              color="purple"
              trend={15.7}
            />
            <MetricCard
              icon={DollarSign}
              title="Revenue Generated"
              value={`$${platformMetrics.total_revenue.toLocaleString()}`}
              subtitle={`${platformMetrics.growth_rate}% growth`}
              color="orange"
              trend={22.4}
            />
          </div>

          {/* Enhanced Platform Capabilities */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-white/20 dark:border-gray-700/50 p-8 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8 text-white flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span>Platform Capabilities</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Bot, title: 'AI Agent Management', desc: 'Create, update, and deploy custom AI voice agents', gradient: 'from-blue-500 to-cyan-500' },
                  { icon: BarChart3, title: 'Performance Analytics', desc: 'Comprehensive tracking and insights', gradient: 'from-emerald-500 to-green-500' },
                  { icon: Store, title: 'Agent Marketplace', desc: 'Buy, sell, and download pre-built agents', gradient: 'from-purple-500 to-pink-500' },
                  { icon: Zap, title: 'Multi-Platform Deploy', desc: 'Deploy to Twilio, VoIP, and other platforms', gradient: 'from-orange-500 to-red-500' },
                  { icon: Shield, title: 'Enterprise Security', desc: 'HIPAA compliance and enterprise controls', gradient: 'from-violet-500 to-purple-500' },
                  { icon: Brain, title: 'AI Optimization', desc: 'AI-powered performance recommendations', gradient: 'from-pink-500 to-rose-500' }
                ].map((capability, index) => (
                  <div key={capability.title} className="group relative p-6 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 hover:from-white/10 hover:to-white/5 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    <div className="relative z-10 flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${capability.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <capability.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">{capability.title}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">{capability.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Recent Activity */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-white/20 dark:border-gray-700/50 p-8 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 animate-pulse"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8 text-white flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span>Recent Platform Activity</span>
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Bot, text: 'New agent "Customer Service Pro" created', time: '2 hours ago', type: 'create', gradient: 'from-emerald-500 to-green-500' },
                  { icon: Store, text: 'Agent "Sales Master" purchased from marketplace', time: '4 hours ago', type: 'purchase', gradient: 'from-purple-500 to-pink-500' },
                  { icon: Zap, text: 'Agent "Healthcare Navigator" deployed to Twilio', time: '6 hours ago', type: 'deploy', gradient: 'from-blue-500 to-cyan-500' },
                  { icon: BarChart3, text: 'Weekly analytics report generated', time: '1 day ago', type: 'analytics', gradient: 'from-orange-500 to-red-500' },
                  { icon: Upload, text: 'Agent "Financial Advisor" updated with new features', time: '2 days ago', type: 'update', gradient: 'from-violet-500 to-purple-500' }
                ].map((activity, index) => (
                  <div key={index} className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-white/5 to-white/2 border border-white/10 rounded-xl hover:from-white/10 hover:to-white/5 transition-all duration-300 hover:scale-102">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <activity.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">{activity.text}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'my-agents' && (
        <div className="space-y-6">
          {/* Enhanced Filters */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse"></div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search agents by name, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div className="flex flex-wrap items-center space-x-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-6 py-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  <option value="sales">Sales</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="technology">Technology</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-6 py-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="training">Training</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="space-y-8">
          {/* Enhanced Marketplace Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-emerald-900/60 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-bounce"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-emerald-500 rounded-2xl shadow-2xl">
                    <Store className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                      🛍️ Agent Marketplace
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Discover and purchase 200+ professional AI agents from our curated marketplace
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg"></div>
                    <span className="text-sm font-medium text-emerald-300">Live Marketplace</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Category Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {[
                  { category: 'Sales & Marketing', count: 45, icon: TrendingUp, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20' },
                  { category: 'Customer Service', count: 38, icon: Headphones, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20' },
                  { category: 'Healthcare', count: 28, icon: Heart, color: 'from-red-500 to-pink-500', bg: 'bg-red-500/20' },
                  { category: 'Finance & Insurance', count: 32, icon: DollarSign, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/20' }
                ].map(cat => (
                  <div key={cat.category} className={`group relative ${cat.bg} border border-white/20 rounded-2xl p-6 text-center backdrop-blur-sm hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className={`p-3 bg-gradient-to-br ${cat.color} rounded-xl mb-4 mx-auto w-fit shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <cat.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-3xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">{cat.count}</p>
                      <p className="text-sm text-gray-300 font-medium leading-tight">{cat.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="bg-gradient-to-r from-gray-900/80 via-slate-900/80 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search agents by name, category, or capability..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  className="px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="sales">Sales & Marketing</option>
                  <option value="support">Customer Service</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                </select>
                <select 
                  className="px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Featured Agents */}
          <div className="relative bg-gradient-to-br from-gray-900/80 via-slate-900/80 to-gray-900/80 border border-yellow-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5 animate-pulse rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                    <Crown className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      ⭐ Featured Agents
                    </h3>
                    <p className="text-gray-300">Hand-picked premium agents by our experts</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105">
                  View All Featured
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {marketplaceAgents.filter(agent => agent.is_featured).map(agent => (
                  <MarketplaceCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced All Marketplace Agents */}
          <div className="bg-gradient-to-br from-gray-900/80 via-slate-900/80 to-gray-900/80 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">All Marketplace Agents</h3>
                  <p className="text-gray-300">Browse our complete collection of professional AI agents</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">{marketplaceAgents.length} agents available</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {marketplaceAgents.filter(agent => 
                (searchTerm === '' || agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 agent.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (filterCategory === 'all' || agent.category === filterCategory)
              ).map(agent => (
                <MarketplaceCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Settings Section */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          {/* Settings Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/60 via-slate-900/60 to-gray-900/60 border border-gray-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 via-slate-500/10 to-gray-500/10 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-gray-500 to-slate-500 rounded-2xl shadow-2xl">
                  <Settings className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-gray-400 via-slate-400 to-gray-400 bg-clip-text text-transparent mb-2">
                    ⚙️ Platform Settings
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Configure your AI Agent Platform preferences and system settings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Account & Profile Settings */}
            <div className="bg-gradient-to-br from-blue-900/60 via-indigo-900/60 to-blue-900/60 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Account & Profile</h3>
                  <p className="text-blue-300">Manage your account information and preferences</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-300 mb-3">Display Name</label>
                  <input 
                    type="text" 
                    defaultValue="John Doe"
                    className="w-full p-4 bg-blue-800/30 border border-blue-500/30 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-300 mb-3">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="john@company.com"
                    className="w-full p-4 bg-blue-800/30 border border-blue-500/30 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-300 mb-3">Organization</label>
                  <input 
                    type="text" 
                    defaultValue="Vocelio AI"
                    className="w-full p-4 bg-blue-800/30 border border-blue-500/30 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
                  />
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105">
                  Update Profile
                </button>
              </div>
            </div>

            {/* System Preferences */}
            <div className="bg-gradient-to-br from-purple-900/60 via-pink-900/60 to-purple-900/60 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <Monitor className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">System Preferences</h3>
                  <p className="text-purple-300">Customize your platform experience</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-3">Theme Preference</label>
                  <select className="w-full p-4 bg-purple-800/30 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all backdrop-blur-sm">
                    <option value="dark">Dark Mode</option>
                    <option value="light">Light Mode</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-3">Language</label>
                  <select className="w-full p-4 bg-purple-800/30 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all backdrop-blur-sm">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-3">Timezone</label>
                  <select className="w-full p-4 bg-purple-800/30 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all backdrop-blur-sm">
                    <option value="pst">Pacific Standard Time</option>
                    <option value="est">Eastern Standard Time</option>
                    <option value="utc">UTC</option>
                    <option value="cet">Central European Time</option>
                  </select>
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105">
                  Save Preferences
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-gradient-to-br from-red-900/60 via-orange-900/60 to-red-900/60 border border-red-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Security & Privacy</h3>
                  <p className="text-red-300">Manage security settings and permissions</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-red-800/30 border border-red-500/30 rounded-xl cursor-pointer hover:bg-red-800/40 transition-all">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-red-400" />
                      <div>
                        <span className="font-semibold text-white">Two-Factor Authentication</span>
                        <p className="text-sm text-red-300">Add extra security to your account</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded bg-red-700 border-red-500 text-red-500 focus:ring-red-500" defaultChecked />
                  </label>
                  
                  <label className="flex items-center justify-between p-4 bg-red-800/30 border border-red-500/30 rounded-xl cursor-pointer hover:bg-red-800/40 transition-all">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-red-400" />
                      <div>
                        <span className="font-semibold text-white">Activity Monitoring</span>
                        <p className="text-sm text-red-300">Track account activity and logins</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded bg-red-700 border-red-500 text-red-500 focus:ring-red-500" defaultChecked />
                  </label>
                  
                  <label className="flex items-center justify-between p-4 bg-red-800/30 border border-red-500/30 rounded-xl cursor-pointer hover:bg-red-800/40 transition-all">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-red-400" />
                      <div>
                        <span className="font-semibold text-white">Data Encryption</span>
                        <p className="text-sm text-red-300">Encrypt all stored data</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded bg-red-700 border-red-500 text-red-500 focus:ring-red-500" defaultChecked />
                  </label>
                </div>
                
                <button className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105">
                  Update Security Settings
                </button>
              </div>
            </div>

            {/* API & Integration Settings */}
            <div className="bg-gradient-to-br from-green-900/60 via-emerald-900/60 to-green-900/60 border border-green-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <Network className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">API & Integrations</h3>
                  <p className="text-green-300">Configure API access and third-party integrations</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-green-300">API Key</label>
                    <button className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="text" 
                      defaultValue="voc_sk_********************************"
                      className="flex-1 p-4 bg-green-800/30 border border-green-500/30 rounded-xl text-white font-mono focus:ring-2 focus:ring-green-500 transition-all backdrop-blur-sm"
                      readOnly
                    />
                    <button className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 hover:bg-green-500/30 transition-all">
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-green-300 mb-3">Rate Limits</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-300 mb-2">Requests per minute</p>
                      <input 
                        type="number" 
                        defaultValue="1000"
                        className="w-full p-3 bg-green-800/30 border border-green-500/30 rounded-xl text-white focus:ring-2 focus:ring-green-500 transition-all backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-green-300 mb-2">Daily limit</p>
                      <input 
                        type="number" 
                        defaultValue="100000"
                        className="w-full p-3 bg-green-800/30 border border-green-500/30 rounded-xl text-white focus:ring-2 focus:ring-green-500 transition-all backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <button className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105">
                  Update API Settings
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/60 via-blue-900/60 to-indigo-900/60 border border-indigo-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl shadow-lg">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Notification Preferences</h3>
                  <p className="text-indigo-300">Control how and when you receive notifications</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Agent Performance Alerts', desc: 'Get notified when agent performance changes', icon: TrendingUp, enabled: true },
                  { title: 'System Maintenance', desc: 'Receive updates about system maintenance', icon: Settings, enabled: true },
                  { title: 'New Marketplace Agents', desc: 'Discover new agents in the marketplace', icon: Store, enabled: false },
                  { title: 'API Usage Alerts', desc: 'Monitor your API usage and limits', icon: Network, enabled: true },
                  { title: 'Security Notifications', desc: 'Important security-related updates', icon: Shield, enabled: true },
                  { title: 'Weekly Reports', desc: 'Receive weekly platform usage reports', icon: BarChart3, enabled: false }
                ].map((notification, index) => (
                  <label key={index} className="flex flex-col p-6 bg-indigo-800/30 border border-indigo-500/30 rounded-xl cursor-pointer hover:bg-indigo-800/40 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <notification.icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                      <input 
                        type="checkbox" 
                        className="rounded bg-indigo-700 border-indigo-500 text-indigo-500 focus:ring-indigo-500" 
                        defaultChecked={notification.enabled}
                      />
                    </div>
                    <h4 className="font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors">{notification.title}</h4>
                    <p className="text-sm text-indigo-300 leading-relaxed">{notification.desc}</p>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105">
                  Save Notification Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
            {/* Enhanced Header */}
            <div className="relative p-8 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Create New AI Agent
                    </h2>
                    <p className="text-gray-400 mt-1">Build your custom AI voice agent with advanced capabilities</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="group relative p-3 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-400 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-110"
                  title="Close"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>
            
            {/* Enhanced Form */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold mb-3 text-white flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-400" />
                      <span>Agent Name</span>
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Enter agent name (e.g., Sales Pro Elite)"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-3 text-white flex items-center space-x-2">
                      <Store className="w-4 h-4 text-purple-400" />
                      <span>Category</span>
                    </label>
                    <select className="w-full p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                      <option value="sales" className="bg-gray-800 text-white">Sales & Marketing</option>
                      <option value="healthcare" className="bg-gray-800 text-white">Healthcare</option>
                      <option value="finance" className="bg-gray-800 text-white">Finance & Insurance</option>
                      <option value="real_estate" className="bg-gray-800 text-white">Real Estate</option>
                      <option value="technology" className="bg-gray-800 text-white">Technology & Support</option>
                      <option value="customer_service" className="bg-gray-800 text-white">Customer Service</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold mb-3 text-white flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-green-400" />
                    <span>Description</span>
                  </label>
                  <textarea 
                    rows={3}
                    className="w-full p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                    placeholder="Describe what your agent does (e.g., High-performance sales agent with advanced persuasion techniques)"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold mb-3 text-white flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span>System Prompt</span>
                  </label>
                  <textarea 
                    rows={6}
                    className="w-full p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                    placeholder="Enter the system prompt that defines your agent's behavior and personality..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold mb-3 text-white flex items-center space-x-2">
                      <Mic className="w-4 h-4 text-orange-400" />
                      <span>Voice Type</span>
                    </label>
                    <select className="w-full p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                      <option value="nova" className="bg-gray-800 text-white">Nova (Neutral & Balanced)</option>
                      <option value="alloy" className="bg-gray-800 text-white">Alloy (Professional & Clear)</option>
                      <option value="echo" className="bg-gray-800 text-white">Echo (Friendly & Warm)</option>
                      <option value="fable" className="bg-gray-800 text-white">Fable (Calm & Soothing)</option>
                      <option value="onyx" className="bg-gray-800 text-white">Onyx (Authoritative & Deep)</option>
                      <option value="shimmer" className="bg-gray-800 text-white">Shimmer (Enthusiastic & Bright)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-3 text-white flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-pink-400" />
                      <span>Language</span>
                    </label>
                    <select className="w-full p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                      <option value="en-US" className="bg-gray-800 text-white">English (United States)</option>
                      <option value="en-GB" className="bg-gray-800 text-white">English (United Kingdom)</option>
                      <option value="es-ES" className="bg-gray-800 text-white">Spanish (Spain)</option>
                      <option value="fr-FR" className="bg-gray-800 text-white">French (France)</option>
                      <option value="de-DE" className="bg-gray-800 text-white">German (Germany)</option>
                      <option value="it-IT" className="bg-gray-800 text-white">Italian (Italy)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold mb-3 text-white flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-violet-400" />
                    <span>Tags</span>
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-4 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Enter tags separated by commas (e.g., sales, b2b, lead-generation, persuasion)"
                  />
                </div>

                {/* Advanced Settings */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <span>Advanced Settings</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold mb-3 text-white block">Deployment Platforms</label>
                      <div className="space-y-2">
                        {['Twilio', 'VoIP', 'SIP', 'WebRTC'].map(platform => (
                          <label key={platform} className="flex items-center space-x-3 text-gray-300">
                            <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500" />
                            <span>{platform}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold mb-3 text-white block">Features</label>
                      <div className="space-y-2">
                        {['HIPAA Compliant', 'Real-time Analytics', 'Call Recording', 'Lead Qualification'].map(feature => (
                          <label key={feature} className="flex items-center space-x-3 text-gray-300">
                            <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500" />
                            <span>{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-white/10">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-8 py-4 border border-white/20 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white rounded-xl hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center space-x-3 font-bold shadow-2xl transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    <Bot className="w-5 h-5 group-hover:animate-pulse" />
                    <span>Create Agent</span>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgentPlatform;
