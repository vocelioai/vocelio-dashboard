import React, { useState, useEffect, useCallback } from 'react';
import { 
  Target, Plus, Zap, Download, Search, Filter, BarChart3, Play, Pause, Settings,
  TrendingUp, Phone, Clock, Calendar, Users, Globe, Brain, TestTube, Copy,
  ArrowUpRight, ArrowDownRight, Eye, Edit, MoreHorizontal, Radio, Sparkles,
  Crosshair, PhoneCall, MessageCircle, Headset, Gauge, Timer, Map,
  Crown, Rocket, Wand2, Flame, Star, Award, Trophy, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Share2, Link, ExternalLink, FileText,
  LineChart, PieChart, Activity, Layers, Network, Shield, Lock, Upload,
  Archive, Trash2, ChevronDown, ChevronRight, Bell, Info, Cpu, Database,
  Workflow, Mail, Send, Mic
} from 'lucide-react';
import smartCampaignsClient from '../api/smartCampaignsClient';

const EnhancedSmartCampaignsDashboard = ({ darkMode = true }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showABTestModal, setShowABTestModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Real-time data from enhanced smart campaigns backend
  const [dashboardData, setDashboardData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignTemplates, setCampaignTemplates] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [industryTypes, setIndustryTypes] = useState([]);
  const [campaignTypes, setCampaignTypes] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showSequenceModal, setShowSequenceModal] = useState(false);

  // Alert system
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'success',
      severity: 'info',
      title: 'AI Optimization Complete',
      message: 'Campaign "Solar Lead Generation Pro" optimized with 15.3% performance uplift',
      timestamp: new Date().toISOString(),
      status: 'active',
      category: 'ai-optimization'
    },
    {
      id: 2,
      type: 'info',
      severity: 'low',
      title: 'A/B Test Results Ready',
      message: 'A/B test for "Insurance Warm Leads" shows 12% conversion improvement',
      timestamp: new Date().toISOString(),
      status: 'active',
      category: 'ab-testing'
    }
  ]);

  // Fetch dashboard data from enhanced smart campaigns backend
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check backend health
      const isHealthy = await smartCampaignsClient.healthCheck();
      setConnected(isHealthy);
      
      if (isHealthy) {
        // Fetch campaigns with pagination and filters
        const campaignsResponse = await smartCampaignsClient.getCampaigns({
          page: 1,
          per_page: 50,
          sort_by: sortBy,
          sort_order: sortOrder,
          ...(filterType !== 'all' && { status: [filterType] })
        });
        
        setCampaigns(campaignsResponse.data?.campaigns || []);
        
        // Fetch analytics overview
        const analyticsResponse = await smartCampaignsClient.getAnalyticsOverview();
        setAnalyticsData(analyticsResponse.data);
        
        // Fetch campaign templates
        const templatesResponse = await smartCampaignsClient.getCampaignTemplates();
        setCampaignTemplates(templatesResponse.data || []);
        
        // Fetch industry and campaign types
        const [industriesResponse, typesResponse] = await Promise.all([
          smartCampaignsClient.getIndustries(),
          smartCampaignsClient.getCampaignTypes()
        ]);
        
        setIndustryTypes(industriesResponse.data || []);
        setCampaignTypes(typesResponse.data || []);
        
        setLastUpdated(new Date());
      } else {
        // Use mock data if backend is not available
        const mockData = smartCampaignsClient.getMockAnalyticsOverview();
        setAnalyticsData(mockData.data);
        
        // Set mock multi-channel campaigns
        const mockCampaigns = smartCampaignsClient.getMockMultiChannelCampaigns();
        setCampaigns(mockCampaigns.data.campaigns);
        
        // Set mock templates
        const mockTemplates = smartCampaignsClient.getMockCampaignTemplates();
        setCampaignTemplates(mockTemplates.data);
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setConnected(false);
      
      // Use mock data on error
      const mockData = smartCampaignsClient.getMockAnalyticsOverview();
      setAnalyticsData(mockData.data);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, filterType]);

  // Auto-refresh functionality
  useEffect(() => {
    fetchDashboardData();

    let interval;
    if (autoRefresh && connected) {
      interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchDashboardData, autoRefresh, connected]);

  // Multi-channel campaign creation modal
  const openChannelModal = () => {
    setShowChannelModal(true);
  };

  const createMultiChannelCampaign = (channelData) => {
    console.log('Creating multi-channel campaign:', channelData);
    // Here we would call the API to create the campaign
    setShowChannelModal(false);
  };

  // Campaign sequencing modal
  const openSequenceModal = () => {
    setShowSequenceModal(true);
  };

  // Campaign action handlers
  const handleStartCampaign = async (campaignId) => {
    try {
      await smartCampaignsClient.updateCampaign(campaignId, { status: 'active' });
      await fetchDashboardData(); // Refresh data
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        severity: 'info',
        title: 'Campaign Started',
        message: `Campaign successfully started`,
        timestamp: new Date().toISOString(),
        status: 'active',
        category: 'campaign-management'
      }]);
    } catch (error) {
      console.error('Failed to start campaign:', error);
    }
  };

  const handlePauseCampaign = async (campaignId) => {
    try {
      await smartCampaignsClient.updateCampaign(campaignId, { status: 'paused' });
      await fetchDashboardData(); // Refresh data
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'info',
        severity: 'low',
        title: 'Campaign Paused',
        message: `Campaign paused successfully`,
        timestamp: new Date().toISOString(),
        status: 'active',
        category: 'campaign-management'
      }]);
    } catch (error) {
      console.error('Failed to pause campaign:', error);
    }
  };

  const handleOptimizeCampaign = async (campaignId) => {
    try {
      const result = await smartCampaignsClient.optimizeCampaign(campaignId);
      await fetchDashboardData(); // Refresh data
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        severity: 'high',
        title: 'AI Optimization Started',
        message: `AI optimization initiated for campaign`,
        timestamp: new Date().toISOString(),
        status: 'active',
        category: 'ai-optimization'
      }]);
    } catch (error) {
      console.error('Failed to optimize campaign:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedCampaigns.length === 0) return;

    try {
      let result;
      switch (action) {
        case 'start':
          result = await smartCampaignsClient.batchStartCampaigns(selectedCampaigns);
          break;
        case 'pause':
          result = await smartCampaignsClient.batchPauseCampaigns(selectedCampaigns);
          break;
        case 'delete':
          result = await smartCampaignsClient.batchDeleteCampaigns(selectedCampaigns);
          break;
        default:
          return;
      }

      await fetchDashboardData(); // Refresh data
      setSelectedCampaigns([]);
      setShowBulkActions(false);
      
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        severity: 'info',
        title: 'Bulk Action Complete',
        message: `${action} action completed for ${selectedCampaigns.length} campaigns`,
        timestamp: new Date().toISOString(),
        status: 'active',
        category: 'bulk-operations'
      }]);
    } catch (error) {
      console.error(`Failed to ${action} campaigns:`, error);
    }
  };

  // Loading state
  if (loading && !analyticsData) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-500">Loading Enhanced Smart Campaigns Dashboard...</p>
            {!connected && (
              <p className="text-yellow-500 text-sm mt-2">
                Backend connection unavailable - using mock data
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.industry?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || campaign.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold">Enhanced Smart Campaigns</h1>
                <p className="text-sm text-gray-500">
                  AI-powered campaign management with real-time optimization
                </p>
              </div>
            </div>
            {connected ? (
              <div className="flex items-center space-x-2 text-green-500">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected to Backend</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-500">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Mock Data Mode</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                autoRefresh 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowCreateCampaign(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6`}>
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'campaigns', label: 'Campaigns', icon: Target },
            { id: 'sms', label: 'SMS Campaigns', icon: MessageCircle },
            { id: 'email', label: 'Email Campaigns', icon: Mail },
            { id: 'voice', label: 'Voice Campaigns', icon: Mic },
            { id: 'templates', label: 'Templates', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: LineChart },
            { id: 'ai-optimization', label: 'AI Optimization', icon: Brain },
            { id: 'ab-testing', label: 'A/B Testing', icon: TestTube }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                    <p className="text-3xl font-bold text-blue-500">
                      {analyticsData?.total_campaigns || 89}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                    <p className="text-3xl font-bold text-green-500">
                      {analyticsData?.active_campaigns || 67}
                    </p>
                  </div>
                  <Play className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Calls Today</p>
                    <p className="text-3xl font-bold text-purple-500">
                      {analyticsData?.total_calls_today?.toLocaleString() || '47,200'}
                    </p>
                  </div>
                  <Phone className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">AI Optimization Score</p>
                    <p className="text-3xl font-bold text-orange-500">
                      {analyticsData?.ai_optimization_score || 94.7}%
                    </p>
                  </div>
                  <Brain className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Multi-Channel Analytics */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Network className="w-5 h-5 text-blue-500" />
                <span>Multi-Channel Performance</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Voice Analytics */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-blue-500" />
                    <h4 className="font-medium">Voice Campaigns</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Answer Rate</span>
                      <span className="text-sm font-medium">60.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Avg Duration</span>
                      <span className="text-sm font-medium">5.03 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Conversion Rate</span>
                      <span className="text-sm font-medium text-green-500">12.3%</span>
                    </div>
                  </div>
                </div>

                {/* SMS Analytics */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <h4 className="font-medium">SMS Campaigns</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Delivery Rate</span>
                      <span className="text-sm font-medium">97.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Click Rate</span>
                      <span className="text-sm font-medium">12.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Conversion Rate</span>
                      <span className="text-sm font-medium text-green-500">8.5%</span>
                    </div>
                  </div>
                </div>

                {/* Email Analytics */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <h4 className="font-medium">Email Campaigns</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Open Rate</span>
                      <span className="text-sm font-medium">45.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Click Rate</span>
                      <span className="text-sm font-medium">15.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Conversion Rate</span>
                      <span className="text-sm font-medium text-green-500">6.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-4">Campaigns by Industry</h3>
                <div className="space-y-3">
                  {Object.entries(analyticsData?.campaigns_by_industry || {}).map(([industry, count]) => (
                    <div key={industry} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{industry.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(count / (analyticsData?.total_campaigns || 89)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-4">Campaign Status Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(analyticsData?.campaigns_by_status || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'active' ? 'bg-green-500' :
                          status === 'paused' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-sm capitalize">{status}</span>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'campaigns' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-4 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="created_at">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="conversion_rate">Sort by Performance</option>
                  <option value="revenue_generated">Sort by Revenue</option>
                </select>
              </div>

              <div className="flex space-x-2">
                {selectedCampaigns.length > 0 && (
                  <button
                    onClick={() => setShowBulkActions(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Bulk Actions ({selectedCampaigns.length})</span>
                  </button>
                )}
                
                <button
                  onClick={openChannelModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Multi-Channel</span>
                </button>

                <button
                  onClick={openSequenceModal}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Workflow className="w-4 h-4" />
                  <span>Sequences</span>
                </button>
                
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Templates</span>
                </button>
              </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                >
                  {/* Campaign Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedCampaigns.includes(campaign.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCampaigns(prev => [...prev, campaign.id]);
                            } else {
                              setSelectedCampaigns(prev => prev.filter(id => id !== campaign.id));
                            }
                          }}
                          className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <h3 className="font-semibold text-lg truncate">{campaign.name}</h3>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {campaign.status}
                        </span>
                        
                        {campaign.is_ai_optimized && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            <Brain className="w-3 h-3 mr-1" />
                            AI Optimized
                          </span>
                        )}
                        
                        {campaign.ab_test?.is_running && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <TestTube className="w-3 h-3 mr-1" />
                            A/B Testing
                          </span>
                        )}
                      </div>

                      {/* Multi-Channel Indicators */}
                      {campaign.channels && (
                        <div className="flex items-center space-x-1 mb-2">
                          <span className="text-xs text-gray-500 mr-2">Channels:</span>
                          {campaign.channels.includes('voice') && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                              <Mic className="w-3 h-3 text-blue-500" />
                              <span className="text-blue-700 dark:text-blue-300">Voice</span>
                            </div>
                          )}
                          {campaign.channels.includes('sms') && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                              <MessageCircle className="w-3 h-3 text-green-500" />
                              <span className="text-green-700 dark:text-green-300">SMS</span>
                            </div>
                          )}
                          {campaign.channels.includes('email') && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                              <Mail className="w-3 h-3 text-purple-500" />
                              <span className="text-purple-700 dark:text-purple-300">Email</span>
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-sm text-gray-500 capitalize mb-2">
                        {campaign.industry?.replace('_', ' ')} • {campaign.campaign_type?.replace('_', ' ')}
                      </p>
                    </div>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOptimizeCampaign(campaign.id)}
                        className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                        title="AI Optimize"
                      >
                        <Brain className="w-4 h-4" />
                      </button>
                      
                      <button className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Conversion Rate</span>
                      <span className="font-medium">{campaign.conversion_rate}%</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Calls</span>
                      <span className="font-medium">{campaign.total_calls?.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Revenue</span>
                      <span className="font-medium text-green-500">
                        ${campaign.revenue_generated?.toLocaleString()}
                      </span>
                    </div>

                    {campaign.performance_metrics && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Live Calls</span>
                        <span className="font-medium text-blue-500">
                          {campaign.performance_metrics.live_calls}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* AI Optimization Score */}
                  {campaign.optimization && (
                    <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          AI Score
                        </span>
                        <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                          {campaign.optimization.ai_score}%
                        </span>
                      </div>
                      <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${campaign.optimization.ai_score}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* A/B Test Results */}
                  {campaign.ab_test?.is_running && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          A/B Test Uplift
                        </span>
                        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                          +{campaign.ab_test.uplift}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {campaign.status === 'active' ? (
                      <button
                        onClick={() => handlePauseCampaign(campaign.id)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm"
                      >
                        <Pause className="w-4 h-4" />
                        <span>Pause</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartCampaign(campaign.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                      </button>
                    )}
                    
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No campaigns found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Campaign Templates</h2>
              <span className="text-sm text-gray-500">
                {campaignTemplates.length || '89+'} templates available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Template cards would go here */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                <div className="flex items-center space-x-3 mb-4">
                  <Rocket className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Solar Lead Generation</h3>
                    <p className="text-sm text-gray-500">Solar Energy Industry</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Pre-configured campaign for solar lead generation with optimized scripts and targeting.
                </p>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Advanced Analytics</h2>
            
            {/* Performance trends would go here */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
              <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                <p>Advanced analytics charts will be implemented here</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'ai-optimization' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">AI Optimization Center</h2>
            
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI-Powered Campaign Optimization</h3>
                <p className="text-gray-500 mb-4">
                  Our AI continuously optimizes your campaigns for better performance
                </p>
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {analyticsData?.ai_optimization_score || 94.7}%
                </div>
                <p className="text-sm text-gray-500">Overall Optimization Score</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'ab-testing' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">A/B Testing Laboratory</h2>
            
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
              <div className="text-center py-8">
                <TestTube className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Statistical A/B Testing</h3>
                <p className="text-gray-500 mb-4">
                  Run controlled experiments to optimize campaign performance
                </p>
                <button
                  onClick={() => setShowABTestModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Create New A/B Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SMS Campaigns Section */}
        {activeSection === 'sms' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <MessageCircle className="w-6 h-6 text-green-500" />
                <span>SMS Campaigns</span>
              </h2>
              <button
                onClick={openChannelModal}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create SMS Campaign</span>
              </button>
            </div>

            {/* SMS Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">SMS Sent</p>
                    <p className="text-3xl font-bold text-green-500">12,847</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivered</p>
                    <p className="text-3xl font-bold text-blue-500">12,234</p>
                    <p className="text-sm text-gray-500">97.2% rate</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Click Rate</p>
                    <p className="text-3xl font-bold text-purple-500">12.8%</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Responses</p>
                    <p className="text-3xl font-bold text-orange-500">1,234</p>
                  </div>
                  <Send className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* SMS Campaigns List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {campaigns.filter(c => c.channels?.includes('sms')).map(campaign => (
                <div key={campaign.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">SMS Campaign</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`text-sm font-medium ${campaign.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Delivery Rate</span>
                      <span className="text-sm font-medium">97.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Response Rate</span>
                      <span className="text-sm font-medium text-green-500">9.6%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email Campaigns Section */}
        {activeSection === 'email' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Mail className="w-6 h-6 text-purple-500" />
                <span>Email Campaigns</span>
              </h2>
              <button
                onClick={openChannelModal}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Email Campaign</span>
              </button>
            </div>

            {/* Email Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Emails Sent</p>
                    <p className="text-3xl font-bold text-purple-500">23,456</p>
                  </div>
                  <Mail className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Open Rate</p>
                    <p className="text-3xl font-bold text-blue-500">45.7%</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Click Rate</p>
                    <p className="text-3xl font-bold text-green-500">15.2%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Conversions</p>
                    <p className="text-3xl font-bold text-orange-500">1,892</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Email Campaigns List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {campaigns.filter(c => c.channels?.includes('email')).map(campaign => (
                <div key={campaign.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="w-8 h-8 text-purple-500" />
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">Email Campaign</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`text-sm font-medium ${campaign.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Open Rate</span>
                      <span className="text-sm font-medium">45.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Click Rate</span>
                      <span className="text-sm font-medium text-green-500">15.2%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice Campaigns Section */}
        {activeSection === 'voice' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Mic className="w-6 h-6 text-blue-500" />
                <span>Voice Campaigns</span>
              </h2>
              <button
                onClick={openChannelModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Voice Campaign</span>
              </button>
            </div>

            {/* Voice Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Calls Made</p>
                    <p className="text-3xl font-bold text-blue-500">8,901</p>
                  </div>
                  <Phone className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Answer Rate</p>
                    <p className="text-3xl font-bold text-green-500">60.5%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg Duration</p>
                    <p className="text-3xl font-bold text-purple-500">5.03</p>
                    <p className="text-sm text-gray-500">minutes</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Conversions</p>
                    <p className="text-3xl font-bold text-orange-500">1,096</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Voice Campaigns List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {campaigns.filter(c => c.channels?.includes('voice')).map(campaign => (
                <div key={campaign.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Mic className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">Voice Campaign</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`text-sm font-medium ${campaign.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Answer Rate</span>
                      <span className="text-sm font-medium">60.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Conversion Rate</span>
                      <span className="text-sm font-medium text-green-500">12.3%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with last updated info */}
      {lastUpdated && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-6 py-3`}>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Enhanced Smart Campaigns Dashboard</span>
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      {/* Multi-Channel Campaign Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Create Multi-Channel Campaign</h3>
              <button
                onClick={() => setShowChannelModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Campaign Details */}
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Name</label>
                <input
                  type="text"
                  placeholder="Enter campaign name..."
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              {/* Channel Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Select Channels</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer`}>
                    <div className="flex items-center space-x-3">
                      <Mic className="w-6 h-6 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Voice Calls</h4>
                        <p className="text-sm text-gray-500">Direct phone calls</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="flex justify-between">
                        <span>Answer Rate:</span>
                        <span className="font-medium">60.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion:</span>
                        <span className="font-medium text-green-500">12.3%</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 border-2 border-gray-300 hover:border-green-500 rounded-lg cursor-pointer transition-colors`}>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <h4 className="font-medium">SMS</h4>
                        <p className="text-sm text-gray-500">Text messaging</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="flex justify-between">
                        <span>Delivery Rate:</span>
                        <span className="font-medium">97.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion:</span>
                        <span className="font-medium text-green-500">8.5%</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 border-2 border-gray-300 hover:border-purple-500 rounded-lg cursor-pointer transition-colors`}>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-6 h-6 text-purple-500" />
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-sm text-gray-500">Email campaigns</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="flex justify-between">
                        <span>Open Rate:</span>
                        <span className="font-medium">45.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion:</span>
                        <span className="font-medium text-green-500">6.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Sequence */}
              <div>
                <label className="block text-sm font-medium mb-3">Campaign Sequence</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <Mic className="w-5 h-5 text-blue-500" />
                    <span>Initial Voice Call</span>
                    <div className="ml-auto">
                      <span className="text-sm text-gray-500">Immediate</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-60">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <span>Follow-up SMS (if no answer)</span>
                    <div className="ml-auto">
                      <span className="text-sm text-gray-500">After 2 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-60">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <Mail className="w-5 h-5 text-purple-500" />
                    <span>Email Follow-up</span>
                    <div className="ml-auto">
                      <span className="text-sm text-gray-500">After 1 day</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowChannelModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createMultiChannelCampaign({ channels: ['voice'], sequence: true })}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Sequence Modal */}
      {showSequenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Campaign Sequence Builder</h3>
              <button
                onClick={() => setShowSequenceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Active Sequences */}
              <div>
                <h4 className="font-medium mb-3">Active Multi-Channel Sequences</h4>
                <div className="space-y-3">
                  <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Solar Lead Generation Sequence</h5>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4 text-blue-500" />
                        <span>Voice → </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span>SMS → </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span>Email</span>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Conversion Rate: <span className="text-green-500 font-medium">18.5%</span> | 
                      Active Contacts: <span className="font-medium">2,847</span>
                    </div>
                  </div>

                  <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Insurance Follow-up Sequence</h5>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Running</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span>Email → </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4 text-blue-500" />
                        <span>Voice → </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span>SMS</span>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Conversion Rate: <span className="text-green-500 font-medium">14.2%</span> | 
                      Active Contacts: <span className="font-medium">1,523</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowSequenceModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={openChannelModal}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Create New Sequence
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSmartCampaignsDashboard;
