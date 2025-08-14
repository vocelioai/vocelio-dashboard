import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Mail, Zap, Target, Users, Calendar, 
  BarChart3, TrendingUp, Phone, Send, Edit, Play, 
  Pause, StopCircle, Settings, Filter, Download, 
  Upload, RefreshCw, Eye, MoreVertical, CheckCircle,
  AlertTriangle, Clock, Globe, Star, Heart, ThumbsUp,
  ArrowUpRight, ArrowDownRight, PieChart, Activity,
  Smartphone, AtSign, Brain, Workflow, Layers,
  Database, FileText, Share2, Copy, ExternalLink,
  Plus, Search, ChevronDown, ChevronRight, X,
  Mic2, Volume2, Headphones, Award, Crown, Sparkles,
  Save, Trash2, Archive, BookOpen, Image, Link2,
  Scissors, RotateCcw, Maximize, Minimize, Info,
  AlertCircle, UserCheck, UserX, DollarSign, Percent,
  Timer, MapPin, Palette, Code, TestTube, Beaker,
  FlaskConical, Rocket, Lightning, Flame, Gauge,
  Monitor, Server, Cloud, ShieldCheck, Lock,
  GitBranch, Package, Layers3, Network, Radio
} from 'lucide-react';

const UnifiedCampaignsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaignType, setSelectedCampaignType] = useState('smart');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  const [analytics] = useState({
    sms: { total_sent: 12847, total_delivered: 12234, total_clicks: 3456, total_responses: 1234, cost: 128.47, roi: 340 },
    email: { total_sent: 23456, total_delivered: 22890, total_clicks: 8901, total_opens: 18456, cost: 234.56, roi: 450 },
    smart: { total_sent: 8901, total_delivered: 8567, total_clicks: 2341, total_conversions: 567, cost: 89.01, roi: 680 }
  });

  // Enhanced sample campaign data
  const [sampleCampaigns] = useState([
    {
      id: 'smart_1',
      name: 'Q4 Product Launch - Multi-Channel Blast',
      type: 'smart',
      status: 'sending',
      created_at: '2024-08-10T10:00:00Z',
      scheduled_time: '2024-08-15T14:00:00Z',
      target_audience: ['leads', 'customers'],
      channels: ['sms', 'email'],
      metrics: { sent: 5678, delivered: 5234, clicks: 892, conversions: 178, cost: 56.78, revenue: 8945.60 },
      campaign_goal: 'product_launch',
      ai_optimized: true,
      tags: ['product', 'launch', 'q4'],
      priority: 'high'
    },
    {
      id: 'sms_1',
      name: 'Flash Sale Alert - Limited Time Offer',
      type: 'sms',
      status: 'completed',
      created_at: '2024-08-12T09:30:00Z',
      target_audience: ['customers'],
      metrics: { sent: 3456, delivered: 3234, clicks: 567, responses: 234, cost: 34.56, revenue: 4567.80 },
      ai_optimized: true,
      tags: ['sale', 'flash', 'discount'],
      priority: 'urgent'
    },
    {
      id: 'email_1', 
      name: 'Weekly AI Insights Newsletter',
      type: 'email',
      status: 'scheduled',
      created_at: '2024-08-13T08:00:00Z',
      scheduled_time: '2024-08-15T10:00:00Z',
      target_audience: ['subscribers'],
      metrics: { sent: 0, delivered: 0, clicks: 0, opens: 0, cost: 23.45, revenue: 0 },
      ai_optimized: true,
      tags: ['newsletter', 'ai', 'weekly'],
      priority: 'normal'
    }
  ]);

  useEffect(() => {
    setCampaigns(sampleCampaigns);
  }, [sampleCampaigns]);

  // Advanced filtering and search
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    const matchesType = filterType === 'all' || campaign.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const MetricCard = ({ icon: Icon, title, value, color, subtitle, trend, cost, roi }) => {
    const colorConfig = {
      blue: {
        gradient: 'from-blue-500/20 via-cyan-500/20 to-blue-500/20',
        iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        textColor: 'text-blue-400',
        valueColor: 'text-white',
        border: 'border-blue-500/30'
      },
      green: {
        gradient: 'from-green-500/20 via-emerald-500/20 to-green-500/20',
        iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
        textColor: 'text-green-400',
        valueColor: 'text-white',
        border: 'border-green-500/30'
      },
      purple: {
        gradient: 'from-purple-500/20 via-pink-500/20 to-purple-500/20',
        iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
        textColor: 'text-purple-400',
        valueColor: 'text-white',
        border: 'border-purple-500/30'
      },
      orange: {
        gradient: 'from-orange-500/20 via-red-500/20 to-orange-500/20',
        iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
        textColor: 'text-orange-400',
        valueColor: 'text-white',
        border: 'border-orange-500/30'
      }
    };

    const config = colorConfig[color] || colorConfig.blue;

    return (
      <div className={`group relative bg-gradient-to-br ${config.gradient} border ${config.border} rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 overflow-hidden`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full -ml-12 -mb-12 group-hover:scale-110 transition-transform duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 ${config.iconBg} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:rotate-3`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full font-bold text-sm ${
                trend > 0 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <h3 className={`text-sm font-semibold ${config.textColor} mb-2 uppercase tracking-wide`}>{title}</h3>
            <p className={`text-4xl font-black ${config.valueColor} mb-1 group-hover:scale-105 transition-transform duration-300`}>
              {value}
            </p>
            {subtitle && <p className="text-sm text-gray-300 font-medium">{subtitle}</p>}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            {cost && (
              <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg px-3 py-1">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 font-medium">{cost}</span>
              </div>
            )}
            {roi && (
              <div className="flex items-center space-x-1 bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-300 font-bold">{roi}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CampaignCard = ({ campaign, isSelected, onSelect }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300 p-6 hover:shadow-lg ${
      isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(campaign.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className={`p-2 rounded-lg ${
            campaign.type === 'smart' ? 'bg-purple-100 dark:bg-purple-900/30' :
            campaign.type === 'sms' ? 'bg-blue-100 dark:bg-blue-900/30' :
            'bg-green-100 dark:bg-green-900/30'
          }`}>
            {campaign.type === 'smart' ? <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" /> :
             campaign.type === 'sms' ? <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" /> :
             <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{campaign.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{campaign.type.toUpperCase()}</span>
              <span>•</span>
              <span>{campaign.target_audience.join(', ')}</span>
              {campaign.priority && (
                <>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    campaign.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    campaign.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {campaign.priority}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {campaign.ai_optimized && (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs">
              <Brain className="w-3 h-3" />
              <span>AI</span>
            </div>
          )}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            campaign.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            campaign.status === 'sending' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
            campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
          }`}>
            {campaign.status}
          </div>
        </div>
      </div>

      {/* Tags */}
      {campaign.tags && campaign.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {campaign.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Campaign Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{campaign.metrics.sent.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Sent</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{campaign.metrics.delivered.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Delivered</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{campaign.metrics.clicks.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Clicks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {campaign.metrics.conversions?.toLocaleString() || campaign.metrics.responses?.toLocaleString() || campaign.metrics.opens?.toLocaleString() || '0'}
          </p>
          <p className="text-xs text-gray-500">
            {campaign.type === 'smart' ? 'Conversions' : campaign.type === 'sms' ? 'Responses' : 'Opens'}
          </p>
        </div>
      </div>

      {/* ROI & Cost */}
      {campaign.metrics.cost !== undefined && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-500">Cost: </span>
              <span className="font-medium">${campaign.metrics.cost}</span>
            </div>
            {campaign.metrics.revenue > 0 && (
              <div className="text-sm">
                <span className="text-gray-500">Revenue: </span>
                <span className="font-medium text-green-600">${campaign.metrics.revenue}</span>
              </div>
            )}
          </div>
          {campaign.metrics.revenue > 0 && (
            <div className="text-sm font-medium text-green-600">
              ROI: {((campaign.metrics.revenue / campaign.metrics.cost - 1) * 100).toFixed(0)}%
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500">
          <div>Created: {new Date(campaign.created_at).toLocaleDateString()}</div>
          {campaign.scheduled_time && (
            <div>Scheduled: {new Date(campaign.scheduled_time).toLocaleDateString()}</div>
          )}
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors" title="View Details">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Edit Campaign">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" title="Play Campaign">
            <Play className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const FilterBar = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search campaigns, tags, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap items-center space-x-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="sending">Sending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="smart">Smart</option>
          </select>
          
          <button 
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Templates</span>
          </button>
        </div>
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
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg"></div>
                <span className="text-sm font-medium text-emerald-300">All Services Operational</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 leading-tight">
              🚀 Unified Campaigns
            </h1>
            <h2 className="text-xl font-semibold text-white/90 mb-2">
              Multi-Channel AI Platform
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
              SMS, Email & Smart Campaigns with 
              <span className="font-semibold text-blue-300"> AI optimization</span>, 
              <span className="font-semibold text-purple-300"> real-time analytics</span> and 
              <span className="font-semibold text-cyan-300"> automated workflows</span>
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">SMS Sent</p>
                  <p className="font-bold text-white">12.8K</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Mail className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Emails Sent</p>
                  <p className="font-bold text-white">23.4K</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg ROI</p>
                  <p className="font-bold text-white">490%</p>
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
                <span>Create Campaign</span>
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="relative bg-gradient-to-r from-gray-900/50 via-slate-900/50 to-gray-900/50 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-wrap gap-3">
          {[
            { 
              id: 'overview', 
              label: 'Overview', 
              icon: BarChart3,
              gradient: 'from-blue-500 to-cyan-500',
              hoverGradient: 'from-blue-600 to-cyan-600',
              bgColor: 'bg-blue-500/20',
              borderColor: 'border-blue-500/30'
            },
            { 
              id: 'sms', 
              label: 'SMS Campaigns', 
              icon: MessageSquare,
              gradient: 'from-green-500 to-emerald-500',
              hoverGradient: 'from-green-600 to-emerald-600',
              bgColor: 'bg-green-500/20',
              borderColor: 'border-green-500/30'
            },
            { 
              id: 'email', 
              label: 'Email Campaigns', 
              icon: Mail,
              gradient: 'from-purple-500 to-pink-500',
              hoverGradient: 'from-purple-600 to-pink-600',
              bgColor: 'bg-purple-500/20',
              borderColor: 'border-purple-500/30'
            },
            { 
              id: 'smart', 
              label: 'Smart Campaigns', 
              icon: Zap,
              gradient: 'from-orange-500 to-red-500',
              hoverGradient: 'from-orange-600 to-red-600',
              bgColor: 'bg-orange-500/20',
              borderColor: 'border-orange-500/30'
            },
            { 
              id: 'analytics', 
              label: 'Analytics', 
              icon: TrendingUp,
              gradient: 'from-indigo-500 to-purple-500',
              hoverGradient: 'from-indigo-600 to-purple-600',
              bgColor: 'bg-indigo-500/20',
              borderColor: 'border-indigo-500/30'
            },
            { 
              id: 'templates', 
              label: 'Templates', 
              icon: FileText,
              gradient: 'from-teal-500 to-cyan-500',
              hoverGradient: 'from-teal-600 to-cyan-600',
              bgColor: 'bg-teal-500/20',
              borderColor: 'border-teal-500/30'
            }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 hover:-translate-y-1 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl border ${tab.borderColor}`
                  : `${tab.bgColor} border ${tab.borderColor} text-white/80 hover:text-white hover:bg-gradient-to-r hover:${tab.hoverGradient} hover:shadow-xl`
              }`}
            >
              {activeTab === tab.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${tab.hoverGradient} rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300`}></div>
              )}
              <div className="relative flex items-center space-x-3">
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && <Sparkles className="w-4 h-4 animate-pulse" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Unified Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              icon={Send}
              title="Total Sent"
              value={(analytics.sms.total_sent + analytics.email.total_sent + analytics.smart.total_sent).toLocaleString()}
              color="blue"
              subtitle="All campaigns"
              trend={12.5}
              cost={(analytics.sms.cost + analytics.email.cost + analytics.smart.cost).toFixed(2)}
              roi={((analytics.sms.roi + analytics.email.roi + analytics.smart.roi) / 3).toFixed(0)}
            />
            <MetricCard
              icon={CheckCircle}
              title="Total Delivered"
              value={(analytics.sms.total_delivered + analytics.email.total_delivered + analytics.smart.total_delivered).toLocaleString()}
              color="green"
              subtitle="Success rate: 94.2%"
              trend={8.3}
            />
            <MetricCard
              icon={Target}
              title="Total Clicks"
              value={(analytics.sms.total_clicks + analytics.email.total_clicks + analytics.smart.total_clicks).toLocaleString()}
              color="purple"
              subtitle="Engagement rate: 28.1%"
              trend={15.7}
            />
            <MetricCard
              icon={TrendingUp}
              title="Conversions"
              value={(analytics.sms.total_responses + analytics.email.total_opens + analytics.smart.total_conversions).toLocaleString()}
              color="orange"
              subtitle="ROI: 340%"
              trend={22.4}
            />
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Campaigns</h3>
              <button className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors">
                <span>View All</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <div className="grid gap-6">
              {campaigns.slice(0, 3).map(campaign => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign}
                  isSelected={selectedCampaigns.includes(campaign.id)}
                  onSelect={(id) => {
                    setSelectedCampaigns(prev => 
                      prev.includes(id) 
                        ? prev.filter(cid => cid !== id)
                        : [...prev, id]
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sms' && (
        <div className="space-y-6">
          <FilterBar />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              icon={MessageSquare}
              title="SMS Sent"
              value={analytics.sms.total_sent.toLocaleString()}
              color="blue"
              subtitle="This month"
              trend={12.5}
              cost={analytics.sms.cost}
              roi={analytics.sms.roi}
            />
            <MetricCard
              icon={CheckCircle}
              title="Delivered"
              value={analytics.sms.total_delivered.toLocaleString()}
              color="green"
              subtitle="95.2% success rate"
              trend={8.3}
            />
            <MetricCard
              icon={Target}
              title="Clicks"
              value={analytics.sms.total_clicks.toLocaleString()}
              color="purple"
              subtitle="26.9% click rate"
              trend={15.7}
            />
            <MetricCard
              icon={MessageSquare}
              title="Responses"
              value={analytics.sms.total_responses.toLocaleString()}
              color="orange"
              subtitle="9.6% response rate"
              trend={22.4}
            />
          </div>

          <div className="grid gap-6">
            {filteredCampaigns.filter(c => c.type === 'sms').map(campaign => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign}
                isSelected={selectedCampaigns.includes(campaign.id)}
                onSelect={(id) => {
                  setSelectedCampaigns(prev => 
                    prev.includes(id) 
                      ? prev.filter(cid => cid !== id)
                      : [...prev, id]
                  );
                }}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-6">
          <FilterBar />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              icon={Mail}
              title="Emails Sent"
              value={analytics.email.total_sent.toLocaleString()}
              color="green"
              subtitle="This month"
              trend={18.2}
              cost={analytics.email.cost}
              roi={analytics.email.roi}
            />
            <MetricCard
              icon={CheckCircle}
              title="Delivered"
              value={analytics.email.total_delivered.toLocaleString()}
              color="blue"
              subtitle="97.6% delivery rate"
              trend={5.1}
            />
            <MetricCard
              icon={Eye}
              title="Opens"
              value={analytics.email.total_opens.toLocaleString()}
              color="purple"
              subtitle="78.7% open rate"
              trend={12.8}
            />
            <MetricCard
              icon={Target}
              title="Clicks"
              value={analytics.email.total_clicks.toLocaleString()}
              color="orange"
              subtitle="38.0% click rate"
              trend={25.3}
            />
          </div>

          <div className="grid gap-6">
            {filteredCampaigns.filter(c => c.type === 'email').map(campaign => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign}
                isSelected={selectedCampaigns.includes(campaign.id)}
                onSelect={(id) => {
                  setSelectedCampaigns(prev => 
                    prev.includes(id) 
                      ? prev.filter(cid => cid !== id)
                      : [...prev, id]
                  );
                }}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'smart' && (
        <div className="space-y-6">
          <FilterBar />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              icon={Zap}
              title="Smart Campaigns"
              value={analytics.smart.total_sent.toLocaleString()}
              color="purple"
              subtitle="Multi-channel sent"
              trend={35.7}
              cost={analytics.smart.cost}
              roi={analytics.smart.roi}
            />
            <MetricCard
              icon={CheckCircle}
              title="Delivered"
              value={analytics.smart.total_delivered.toLocaleString()}
              color="green"
              subtitle="96.3% success rate"
              trend={8.9}
            />
            <MetricCard
              icon={Target}
              title="Engagements"
              value={analytics.smart.total_clicks.toLocaleString()}
              color="blue"
              subtitle="Cross-channel clicks"
              trend={28.4}
            />
            <MetricCard
              icon={TrendingUp}
              title="Conversions"
              value={analytics.smart.total_conversions.toLocaleString()}
              color="orange"
              subtitle="6.4% conversion rate"
              trend={42.1}
            />
          </div>

          <div className="grid gap-6">
            {filteredCampaigns.filter(c => c.type === 'smart').map(campaign => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign}
                isSelected={selectedCampaigns.includes(campaign.id)}
                onSelect={(id) => {
                  setSelectedCampaigns(prev => 
                    prev.includes(id) 
                      ? prev.filter(cid => cid !== id)
                      : [...prev, id]
                  );
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-gray-900/95 border border-purple-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse rounded-3xl"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            {/* Header */}
            <div className="relative z-10 p-8 border-b border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Create New Campaign
                    </h2>
                    <p className="text-gray-300 mt-1">Launch your next multi-channel AI campaign</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="group relative p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                >
                  <X className="w-6 h-6 text-red-400 group-hover:text-red-300" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-8">
              {/* Campaign Type Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  <span>Choose Campaign Type</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    onClick={() => setSelectedCampaignType('sms')}
                    className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                      selectedCampaignType === 'sms' 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-2xl shadow-blue-500/25' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-blue-400 hover:bg-blue-500/10'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 rounded-2xl mb-4 ${
                        selectedCampaignType === 'sms' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg' 
                          : 'bg-blue-500/20 group-hover:bg-blue-500/30'
                      }`}>
                        <MessageSquare className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-white mb-2">SMS Campaign</h4>
                      <p className="text-sm text-gray-300">Send targeted SMS with AI optimization</p>
                      {selectedCampaignType === 'sms' && (
                        <div className="mt-3 flex items-center space-x-1 text-blue-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div 
                    onClick={() => setSelectedCampaignType('email')}
                    className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                      selectedCampaignType === 'email' 
                        ? 'border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-2xl shadow-green-500/25' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 rounded-2xl mb-4 ${
                        selectedCampaignType === 'email' 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg' 
                          : 'bg-green-500/20 group-hover:bg-green-500/30'
                      }`}>
                        <Mail className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-white mb-2">Email Campaign</h4>
                      <p className="text-sm text-gray-300">Create engaging emails with AI</p>
                      {selectedCampaignType === 'email' && (
                        <div className="mt-3 flex items-center space-x-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div 
                    onClick={() => setSelectedCampaignType('smart')}
                    className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                      selectedCampaignType === 'smart' 
                        ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-2xl shadow-purple-500/25' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-purple-400 hover:bg-purple-500/10'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 rounded-2xl mb-4 ${
                        selectedCampaignType === 'smart' 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg' 
                          : 'bg-purple-500/20 group-hover:bg-purple-500/30'
                      }`}>
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-white mb-2">Smart Campaign</h4>
                      <p className="text-sm text-gray-300">Multi-channel AI campaigns</p>
                      {selectedCampaignType === 'smart' && (
                        <div className="mt-3 flex items-center space-x-1 text-purple-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Configuration */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Settings className="w-6 h-6 text-cyan-400" />
                    <span>Campaign Configuration</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">Campaign Name</label>
                      <input 
                        type="text" 
                        className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all backdrop-blur-sm"
                        placeholder="Enter campaign name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">Campaign Goal</label>
                      <select className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all backdrop-blur-sm">
                        <option value="engagement">Engagement</option>
                        <option value="conversion">Conversion</option>
                        <option value="retention">Retention</option>
                        <option value="product_launch">Product Launch</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-4">Target Audience</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['leads', 'customers', 'subscribers', 'prospects'].map(audience => (
                      <label key={audience} className="group flex items-center space-x-3 p-4 bg-gray-800/50 border border-gray-600 rounded-xl hover:border-purple-500 transition-all cursor-pointer">
                        <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500" />
                        <span className="text-sm font-medium text-white capitalize group-hover:text-purple-300 transition-colors">{audience}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Schedule Campaign</label>
                    <input 
                      type="datetime-local" 
                      className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all backdrop-blur-sm"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl cursor-pointer hover:from-purple-500/30 hover:to-blue-500/30 transition-all">
                      <input type="checkbox" className="rounded bg-gray-700 border-purple-500 text-purple-500 focus:ring-purple-500" defaultChecked />
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span className="font-semibold text-white">Enable AI Optimization</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-12 pt-8 border-t border-purple-500/30">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-8 py-4 bg-gray-800/50 border border-gray-600 text-white rounded-xl hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white rounded-xl hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Create Campaign</span>
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

export default UnifiedCampaignsPage;
