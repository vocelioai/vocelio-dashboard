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
  ShoppingCart, Volume1, ChevronDown, ChevronRight
} from 'lucide-react';

// Import your page components
import SmartCampaignsDashboard from './pages/SmartCampaigns';
import EnhancedSmartCampaignsDashboard from './pages/EnhancedSmartCampaigns';
import LiveCallCenter from './pages/CallCenter-new';
import VoiceLabPage from './pages/VoiceLab';
import FlowBuilderPage from './pages/FlowBuilder';
import AnalyticsProPage from './pages/AnalyticsPro';
import AIBrainCenter from './pages/AIBrain';
import ServiceHealthMonitor from './components/ServiceHealthMonitor';
import IntegrationsCenter from './pages/IntegrationsCenter';
import AgentStore from './pages/AgentStore';
import BillingProCenter from './pages/BillingPro';
import TeamHubDashboard from './pages/TeamHub';
import EnhancedComplianceDashboard from './pages/EnhancedCompliance';
import WhiteLabelDashboard from './pages/WhiteLabelDashboard';
import TwilioNumberPurchase from './pages/PhoneNumbers';
import VocelioSettingsDashboard from './pages/SettingsPage';
import VocelioVoiceMarketplace from './pages/VoiceMarketplace';
import APICenter from './pages/APICenter';

// Import new missing service pages
import KnowledgeBase from './pages/KnowledgeBase';
import LeadManagement from './pages/LeadManagement';
import UnifiedNotificationCenter from './pages/UnifiedNotificationCenter';
import SchedulingCenter from './pages/SchedulingCenter';
import AIAgentsService from './pages/AIAgentsService';
import WebhooksManager from './pages/WebhooksManager';
import ServiceTestingPage from './pages/ServiceTestingPage';

// Import new API test component
import APITestComponent from './components/APITestComponent';
import EnterpriseSecurityCenter from './pages/EnterpriseSecurityCenter';

// Import Enhanced Overview API Client
import enhancedOverviewApi from './api/enhancedOverviewClient';
import SSOIdentityManager from './pages/SSOIdentityManager';
import AuditCompliance from './pages/AuditCompliance';
import DataWarehouse from './pages/DataWarehouse';
import EnterprisePortal from './pages/EnterprisePortal';
import BusinessIntelligence from './pages/BusinessIntelligence';
import AutomationEngine from './pages/AutomationEngine';

const VocelioUltimateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
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
    totalClients: 132847,
    callsToday: 298643,
    successRate: 95.7,
    aiOptimizationScore: 97.2,
    monthlyCallVolume: 89500000,
    agentsOnline: 247,
    campaignsActive: 89
  });

  // Enhanced Overview State
  const [enhancedData, setEnhancedData] = useState({
    overview: null,
    liveMetrics: null,
    aiInsights: [],
    systemHealth: null,
    revenueMetrics: null,
    globalStats: null,
    cacheStatus: null
  });
  const [backendConnected, setBackendConnected] = useState(false);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Organization ID (you can make this dynamic based on user)
  const organizationId = 'default-org-123';

  // Initialize Enhanced Overview Service
  const initializeEnhancedOverview = async () => {
    try {
      console.log('🚀 Initializing Enhanced Overview Service...');
      
      // Check backend health
      const isHealthy = await enhancedOverviewApi.healthCheck();
      setBackendConnected(isHealthy);
      
      if (isHealthy) {
        console.log('✅ Enhanced backend is healthy');
        
        // Load initial data
        await loadEnhancedData();
        
        // Connect WebSocket for real-time updates
        connectWebSocket();
      } else {
        console.log('⚠️ Enhanced backend unavailable, using fallback data');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Enhanced Overview:', error);
      setBackendConnected(false);
    }
  };

  const loadEnhancedData = async () => {
    try {
      console.log('📊 Loading enhanced dashboard data...');
      
      const [
        overview,
        liveMetrics,
        aiInsights,
        systemHealth,
        revenueMetrics,
        globalStats,
        cacheStatus
      ] = await Promise.allSettled([
        enhancedOverviewApi.getDashboardOverview(organizationId),
        enhancedOverviewApi.getLiveMetrics(organizationId),
        enhancedOverviewApi.getAIInsights(organizationId, 5),
        enhancedOverviewApi.getSystemHealth(),
        enhancedOverviewApi.getRevenueMetrics(organizationId),
        enhancedOverviewApi.getGlobalStats(),
        enhancedOverviewApi.getCacheStatus()
      ]);

      // Update enhanced data state
      setEnhancedData({
        overview: overview.status === 'fulfilled' ? overview.value : null,
        liveMetrics: liveMetrics.status === 'fulfilled' ? liveMetrics.value : null,
        aiInsights: aiInsights.status === 'fulfilled' ? aiInsights.value : [],
        systemHealth: systemHealth.status === 'fulfilled' ? systemHealth.value : null,
        revenueMetrics: revenueMetrics.status === 'fulfilled' ? revenueMetrics.value : null,
        globalStats: globalStats.status === 'fulfilled' ? globalStats.value : null,
        cacheStatus: cacheStatus.status === 'fulfilled' ? cacheStatus.value : null
      });

      // Update legacy metrics for backward compatibility
      if (liveMetrics.status === 'fulfilled' && liveMetrics.value) {
        const enhanced = liveMetrics.value;
        setLiveMetrics(prev => ({
          ...prev,
          totalClients: enhanced.total_clients || prev.totalClients,
          activeCalls: enhanced.active_calls || prev.activeCalls,
          callsToday: enhanced.calls_today || prev.callsToday,
          revenueToday: enhanced.revenue_today || prev.revenueToday,
          successRate: enhanced.success_rate || prev.successRate,
          aiOptimizationScore: enhanced.ai_optimization_score || prev.aiOptimizationScore,
          monthlyCallVolume: enhanced.monthly_call_volume || prev.monthlyCallVolume,
          agentsOnline: enhanced.agents_active || prev.agentsOnline,
          campaignsActive: enhanced.campaigns_running || prev.campaignsActive
        }));
      }

      setLastUpdate(new Date());
      console.log('✅ Enhanced dashboard data loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load enhanced data:', error);
    }
  };

  const connectWebSocket = () => {
    try {
      enhancedOverviewApi.connectWebSocket(organizationId, {
        onOpen: (event) => {
          setWebsocketConnected(true);
          console.log('🔌 Enhanced WebSocket connected');
        },
        onClose: (event) => {
          setWebsocketConnected(false);
          console.log('🔌 Enhanced WebSocket disconnected');
        },
        onError: (error) => {
          console.error('🔌 Enhanced WebSocket error:', error);
          setWebsocketConnected(false);
        },
        onInitialData: (data) => {
          console.log('📊 Initial enhanced data received');
          if (data.live_metrics) {
            updateMetricsFromEnhanced(data.live_metrics);
          }
        },
        onLiveUpdate: (metrics) => {
          console.log('📡 Live metrics update received');
          updateMetricsFromEnhanced(metrics);
          setLastUpdate(new Date());
        },
        onAIInsight: (insight) => {
          console.log('🧠 New AI insight received:', insight.title);
          setEnhancedData(prev => ({
            ...prev,
            aiInsights: [insight, ...prev.aiInsights.slice(0, 4)] // Keep latest 5
          }));
          
          // Show notification for high-priority insights
          if (insight.priority === 'high' || insight.priority === 'critical') {
            setNotifications(prev => [{
              id: Date.now(),
              type: insight.insight_type === 'alert' ? 'warning' : 'info',
              message: `🧠 ${insight.title}`,
              time: 'now',
              unread: true
            }, ...prev.slice(0, 4)]);
          }
        },
        onAlert: (alert) => {
          console.log('🚨 System alert received:', alert.title);
          setNotifications(prev => [{
            id: Date.now(),
            type: alert.severity === 'critical' ? 'error' : alert.severity === 'warning' ? 'warning' : 'info',
            message: `🚨 ${alert.title}`,
            time: 'now',
            unread: true
          }, ...prev.slice(0, 4)]);
        }
      });
    } catch (error) {
      console.error('❌ Failed to connect WebSocket:', error);
    }
  };

  const updateMetricsFromEnhanced = (enhancedMetrics) => {
    setLiveMetrics(prev => ({
      ...prev,
      totalClients: enhancedMetrics.total_clients || prev.totalClients,
      activeCalls: enhancedMetrics.active_calls || prev.activeCalls,
      callsToday: enhancedMetrics.calls_today || prev.callsToday,
      revenueToday: enhancedMetrics.revenue_today || prev.revenueToday,
      successRate: enhancedMetrics.success_rate || prev.successRate,
      aiOptimizationScore: enhancedMetrics.ai_optimization_score || prev.aiOptimizationScore,
      monthlyCallVolume: enhancedMetrics.monthly_call_volume || prev.monthlyCallVolume,
      agentsOnline: enhancedMetrics.agents_active || prev.agentsOnline,
      campaignsActive: enhancedMetrics.campaigns_running || prev.campaignsActive
    }));
  };

  useEffect(() => {
    // Initialize Enhanced Overview Service
    initializeEnhancedOverview();
    
    // Cleanup on unmount
    return () => {
      enhancedOverviewApi.disconnect();
    };
  }, []);

  useEffect(() => {
    // Backup interval for enhanced metrics (if WebSocket fails)
    let interval;
    if (activeTab === 'overview' && backendConnected && !websocketConnected) {
      console.log('🔄 Starting backup metrics refresh (WebSocket not connected)');
      interval = setInterval(() => {
        loadEnhancedData();
      }, 10000); // Refresh every 10 seconds as backup
    }
    return () => clearInterval(interval);
  }, [activeTab, backendConnected, websocketConnected]);

  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Reorganized hierarchical navigation structure
  const sidebarMenus = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Command,
      type: 'single',
      badge: 'LIVE',
      route: 'overview'
    },
    {
      id: 'ai-services',
      label: 'AI Services',
      icon: Brain,
      type: 'group',
      badge: 'AI',
      children: [
        { id: 'agents-enhanced', label: 'AI Agents Service', icon: Wand2, badge: 'NEW' },
        { id: 'ai-brain', label: 'AI Brain', icon: Brain, badge: '94%' },
        { id: 'voice-lab', label: 'Voice Lab', icon: Mic2, badge: 'AI' },
        { id: 'flow-builder', label: 'Flow Builder', icon: Workflow, badge: 'AI' }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: PhoneCall,
      type: 'group',
      badge: null,
      children: [
        { id: 'call-center', label: 'Call Center', icon: PhoneCall, badge: liveMetrics.activeCalls > 1000 ? `${Math.floor(liveMetrics.activeCalls/1000)}k` : liveMetrics.activeCalls },
        { id: 'enhanced-smart-campaigns', label: 'Smart Campaigns', icon: Target, badge: 'ENHANCED' },
        { id: 'phone-numbers', label: 'Phone Numbers', icon: Phone, badge: 'NEW' },
        { id: 'voice-marketplace', label: 'Voice Marketplace', icon: ShoppingCart, badge: 'HOT' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics & Insights',
      icon: BarChart3,
      type: 'group',
      badge: null,
      children: [
        { id: 'analytics-pro', label: 'Analytics Pro', icon: BarChart3, badge: null },
        { id: 'business-intelligence', label: 'Business Intelligence', icon: TrendingUp, badge: 'NEW' },
        { id: 'data-warehouse', label: 'Data Warehouse', icon: Database, badge: 'NEW' }
      ]
    },
    {
      id: 'customer-management',
      label: 'Customer Management',
      icon: Users,
      type: 'group',
      badge: null,
      children: [
        { id: 'lead-management', label: 'Lead Management', icon: Users, badge: 'NEW' },
        { id: 'team-hub', label: 'Team Hub', icon: Users, badge: null },
        { id: 'scheduling-center', label: 'Scheduling Center', icon: Calendar, badge: 'NEW' },
        { id: 'knowledge-base', label: 'Knowledge Base', icon: FileText, badge: 'NEW' }
      ]
    },
    {
      id: 'integrations-automation',
      label: 'Integrations & Automation',
      icon: Network,
      type: 'group',
      badge: null,
      children: [
        { id: 'integrations', label: 'Integrations', icon: Network, badge: '15' },
        { id: 'automation-engine', label: 'Automation Engine', icon: Zap, badge: 'NEW' },
        { id: 'webhooks-manager', label: 'Webhooks Manager', icon: Webhook, badge: 'NEW' },
        { id: 'api-center', label: 'API Center', icon: Server, badge: 'UNIFIED' }
      ]
    },
    {
      id: 'enterprise',
      label: 'Enterprise',
      icon: Building,
      type: 'group',
      badge: 'ENTERPRISE',
      children: [
        { id: 'enterprise-security', label: 'Security Center', icon: Shield, badge: 'NEW' },
        { id: 'sso-identity', label: 'Identity Manager', icon: Key, badge: 'NEW' },
        { id: 'audit-compliance', label: 'Audit & Compliance', icon: FileText, badge: 'NEW' },
        { id: 'enhanced-compliance', label: 'Enhanced Compliance', icon: Shield, badge: 'LIVE' },
        { id: 'enterprise-portal', label: 'Enterprise Portal', icon: Building, badge: 'NEW' }
      ]
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Store,
      type: 'group',
      badge: 'HOT',
      children: [
        { id: 'agent-store', label: 'Agent Store', icon: Store, badge: 'HOT' },
        { id: 'white-label', label: 'White Label', icon: Palette, badge: 'ENTERPRISE' }
      ]
    },
    {
      id: 'system',
      label: 'System & Settings',
      icon: Settings,
      type: 'group',
      badge: null,
      children: [
        { id: 'service-testing', label: 'Service Testing', icon: TestTube, badge: 'NEW' },
        { id: 'notifications-center', label: 'Notification Center', icon: Bell, badge: 'UNIFIED' },
        { id: 'billing-pro', label: 'Billing Pro', icon: CreditCard, badge: null },
        { id: 'developer-api', label: 'Developer API', icon: Code, badge: null },
        { id: 'settings', label: 'Settings', icon: Settings, badge: null }
      ]
    }
  ];

  // Legacy flat structure for backward compatibility
  const sidebarItems = [
    { id: 'overview', label: 'Command Center', icon: Command, badge: 'LIVE' },
    { id: 'service-testing', label: 'Service Testing', icon: TestTube, badge: 'NEW' },
    { id: 'agents-enhanced', label: 'AI Agents Service', icon: Wand2, badge: 'NEW' },
    { id: 'enhanced-smart-campaigns', label: 'Smart Campaigns', icon: Target, badge: 'ENHANCED' },
    { id: 'call-center', label: 'Call Center', icon: PhoneCall, badge: liveMetrics.activeCalls > 1000 ? `${Math.floor(liveMetrics.activeCalls/1000)}k` : liveMetrics.activeCalls },
    { id: 'phone-numbers', label: 'Phone Numbers', icon: Phone, badge: 'NEW' },
    { id: 'voice-marketplace', label: 'Voice Marketplace', icon: ShoppingCart, badge: 'HOT' },
    { id: 'voice-lab', label: 'Voice Lab', icon: Mic2, badge: 'AI' },
    { id: 'flow-builder', label: 'Flow Builder', icon: Workflow, badge: 'AI' },
    { id: 'analytics-pro', label: 'Analytics Pro', icon: BarChart3, badge: null },
    { id: 'ai-brain', label: 'AI Brain', icon: Brain, badge: '94%' },
    
    // New Priority 1 Services (Core Missing)
    { id: 'knowledge-base', label: 'Knowledge Base', icon: FileText, badge: 'NEW' },
    { id: 'lead-management', label: 'Lead Management', icon: Users, badge: 'NEW' },
    { id: 'notifications-center', label: 'Notification Center', icon: Bell, badge: 'UNIFIED' },
    { id: 'scheduling-center', label: 'Scheduling Center', icon: Calendar, badge: 'NEW' },
    
    // Enhanced Services
    { id: 'webhooks-manager', label: 'Webhooks Manager', icon: Webhook, badge: 'NEW' },
    { id: 'api-center', label: 'API Center', icon: Server, badge: 'UNIFIED' },
    
    // Enterprise Features
    { id: 'enterprise-security', label: 'Security Center', icon: Shield, badge: 'NEW' },
    { id: 'sso-identity', label: 'Identity Manager', icon: Key, badge: 'NEW' },
    { id: 'audit-compliance', label: 'Audit & Compliance', icon: FileText, badge: 'NEW' },
    
    // Additional Services
    { id: 'data-warehouse', label: 'Data Warehouse', icon: Database, badge: 'NEW' },
    { id: 'enterprise-portal', label: 'Enterprise Portal', icon: Building, badge: 'NEW' },
    { id: 'business-intelligence', label: 'Business Intelligence', icon: TrendingUp, badge: 'NEW' },
    { id: 'automation-engine', label: 'Automation Engine', icon: Zap, badge: 'NEW' },
    
    // Existing Services
    { id: 'integrations', label: 'Integrations', icon: Network, badge: '15' },
    { id: 'agent-store', label: 'Agent Store', icon: Store, badge: 'HOT' },
    { id: 'billing-pro', label: 'Billing Pro', icon: CreditCard, badge: null },
    { id: 'team-hub', label: 'Team Hub', icon: Users, badge: null },
    { id: 'enhanced-compliance', label: 'Enhanced Compliance', icon: Shield, badge: 'LIVE' },
    { id: 'white-label', label: 'White Label', icon: Palette, badge: 'ENTERPRISE' },
    { id: 'developer-api', label: 'Developer API', icon: Code, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
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

            {/* Enhanced AI Insights from Backend */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-cyan-700/50' : 'bg-gradient-to-r from-cyan-50/80 to-purple-50/80 border-cyan-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl`}>
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold flex items-center space-x-3">
                  <Brain className="w-8 h-8 text-cyan-500" />
                  <span>🧠 Live AI Insights</span>
                  <div className="px-3 py-1 bg-cyan-500/10 text-cyan-500 text-sm rounded-full flex items-center space-x-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span>ENHANCED</span>
                  </div>
                  {backendConnected ? (
                    <div className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>CONNECTED</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-orange-500/10 text-orange-500 text-sm rounded-full flex items-center space-x-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span>BACKEND OFFLINE</span>
                    </div>
                  )}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Last Updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                  </span>
                  <button 
                    onClick={loadEnhancedData}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {backendConnected && enhancedData.aiInsights && enhancedData.aiInsights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {enhancedData.aiInsights.slice(0, 6).map((insight, index) => (
                    <div key={insight.id || index} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} backdrop-blur-sm transform transition-all hover:scale-105`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${
                          insight.insight_type === 'optimization' ? 'bg-green-500/10 text-green-500' :
                          insight.insight_type === 'alert' ? 'bg-red-500/10 text-red-500' :
                          insight.insight_type === 'performance' ? 'bg-blue-500/10 text-blue-500' :
                          insight.insight_type === 'revenue' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-purple-500/10 text-purple-500'
                        }`}>
                          {insight.insight_type === 'optimization' && <TrendingUp className="w-6 h-6" />}
                          {insight.insight_type === 'alert' && <AlertTriangle className="w-6 h-6" />}
                          {insight.insight_type === 'performance' && <Target className="w-6 h-6" />}
                          {insight.insight_type === 'revenue' && <DollarSign className="w-6 h-6" />}
                          {insight.insight_type === 'prediction' && <Brain className="w-6 h-6" />}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                          insight.priority === 'critical' ? 'bg-red-500/10 text-red-500' :
                          insight.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                          insight.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {insight.confidence_score}% Confidence
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-2">{insight.title}</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                        {insight.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        {insight.metrics && Object.entries(insight.metrics).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>
                              {key.replace('_', ' ')}:
                            </span>
                            <span className="font-semibold text-cyan-500">{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        {insight.impact_value && (
                          <span className="text-lg font-bold text-green-500">
                            {insight.impact_value}
                          </span>
                        )}
                        {insight.action_required && (
                          <button className={`px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105 ${
                            insight.priority === 'critical' ? 'bg-red-500 hover:bg-red-600 text-white' :
                            insight.priority === 'high' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                            'bg-cyan-500 hover:bg-cyan-600 text-white'
                          }`}>
                            {insight.action_required}
                          </button>
                        )}
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Generated: {new Date(insight.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  {!backendConnected ? (
                    <>
                      <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Enhanced Backend Disconnected
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-4`}>
                        Connect to enhanced backend to see real-time AI insights
                      </p>
                      <button 
                        onClick={initializeEnhancedOverview}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                      >
                        🔄 Retry Connection
                      </button>
                    </>
                  ) : (
                    <>
                      <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No AI insights available yet
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        AI insights are generated every 5 minutes
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* System Health & Status */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50/80 to-blue-50/80 border-green-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl`}>
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-green-500" />
                  <span>🛡️ Enhanced System Health</span>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    backendConnected && enhancedData.systemHealth && enhancedData.systemHealth.overall_status === 'healthy' ? 'bg-green-500/10 text-green-500' :
                    backendConnected && enhancedData.systemHealth && enhancedData.systemHealth.overall_status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                    backendConnected && enhancedData.systemHealth ? 'bg-red-500/10 text-red-500' :
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    {backendConnected && enhancedData.systemHealth ? 
                      enhancedData.systemHealth.overall_status.toUpperCase() : 
                      'BACKEND OFFLINE'
                    }
                  </div>
                </h3>
                <div className="text-sm text-gray-500">
                  Uptime: {backendConnected && enhancedData.systemHealth ? 
                    `${enhancedData.systemHealth.uptime_percentage}%` : 
                    '99.9% (Legacy)'
                  }
                </div>
              </div>

              {backendConnected && enhancedData.systemHealth ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(enhancedData.systemHealth.services || {}).map(([service, status]) => (
                      <div key={service} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} text-center`}>
                        <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                          status === 'healthy' ? 'bg-green-500' :
                          status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <div className="text-sm font-medium capitalize">{service.replace('_', ' ')}</div>
                        <div className={`text-xs mt-1 ${
                          status === 'healthy' ? 'text-green-500' :
                          status === 'warning' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {status}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                      <div className="text-sm text-gray-500 mb-1">CPU Usage</div>
                      <div className="text-2xl font-bold text-blue-500">{enhancedData.systemHealth.cpu_usage}%</div>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                      <div className="text-sm text-gray-500 mb-1">Memory Usage</div>
                      <div className="text-2xl font-bold text-purple-500">{enhancedData.systemHealth.memory_usage}%</div>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                      <div className="text-sm text-gray-500 mb-1">Response Time</div>
                      <div className="text-2xl font-bold text-green-500">{enhancedData.systemHealth.response_time_ms}ms</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Enhanced System Health Unavailable
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-4`}>
                    Connect to enhanced backend for detailed system monitoring
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {['Frontend', 'Dashboard', 'UI Services', 'Local Cache'].map((service) => (
                      <div key={service} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} text-center`}>
                        <div className="w-4 h-4 rounded-full mx-auto mb-2 bg-green-500"></div>
                        <div className="text-sm font-medium">{service}</div>
                        <div className="text-xs mt-1 text-green-500">healthy</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Service Health Monitor */}
            <ServiceHealthMonitor />
          </div>
        );

      // Add cases for all your page components
      case 'enhanced-smart-campaigns':
        return <EnhancedSmartCampaignsDashboard />;
      
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
      
      case 'enhanced-compliance':
        return <EnhancedComplianceDashboard />;
      
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
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-400">🎨 White Label Portal</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                  Full brand customization, partner management, revenue analytics, 
                  and enterprise controls are now available.
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Partners</p>
                    <p className="font-bold text-yellow-700 dark:text-yellow-300">23</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
                    <p className="font-bold text-yellow-700 dark:text-yellow-300">$125K</p>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
                    <p className="font-bold text-yellow-700 dark:text-yellow-300">18</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('white-label')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Manage Partners
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'api-center':
      case 'developer-api':
      case 'api-management':
        return <APICenter />;
      
      case 'settings':
        return <VocelioSettingsDashboard />;
      
      case 'service-testing':
        return <ServiceTestingPage darkMode={darkMode} />;

      // New Priority 1 Services (Core Missing)
      case 'knowledge-base':
        return <KnowledgeBase />;
      
      case 'lead-management':
        return <LeadManagement />;
      
      case 'notifications-center':
      case 'notification-service':
        return <UnifiedNotificationCenter />;
      
      case 'scheduling-center':
        return <SchedulingCenter />;
      
      case 'agents-enhanced':
        return <AIAgentsService />;
      
      // Enhanced Services
      case 'webhooks-manager':
        return <WebhooksManager />;
      
      // Enterprise Features
      case 'enterprise-security':
        return <EnterpriseSecurityCenter />;
      
      case 'sso-identity':
        return <SSOIdentityManager />;
      
      case 'audit-compliance':
        return <AuditCompliance />;
      
      // Additional Services
      case 'data-warehouse':
        return <DataWarehouse />;
      
      case 'enterprise-portal':
        return <EnterprisePortal />;

      // API Integration Testing
      case 'api-test':
        return <APITestComponent />;
      
      case 'business-intelligence':
        return <BusinessIntelligence />;
      
      case 'automation-engine':
        return <AutomationEngine />;

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
            {sidebarMenus.map((menu) => {
              if (menu.type === 'single') {
                // Single menu item (like Dashboard)
                const id = menu.route || menu.id;
                return (
                  <button
                    key={menu.id}
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
                    <menu.icon className={`w-6 h-6 ${activeTab === id ? 'text-white' : ''} transition-all group-hover:scale-110`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="font-semibold transition-all flex-1 text-left">{menu.label}</span>
                        {menu.badge && (
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            activeTab === id 
                              ? 'bg-white/20 text-white' 
                              : menu.badge === 'LIVE' || menu.badge === 'HOT' || menu.badge === 'NEW'
                                ? 'bg-red-500/10 text-red-500'
                                : menu.badge === 'AI' || menu.badge === 'ENTERPRISE'
                                  ? 'bg-purple-500/10 text-purple-500'
                                  : 'bg-blue-500/10 text-blue-500'
                            }`}>
                            {menu.badge}
                          </div>
                        )}
                      </>
                    )}
                    {activeTab === id && (
                      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              } else {
                // Group menu with children
                const isExpanded = expandedMenus[menu.id];
                const hasActiveChild = menu.children.some(child => activeTab === child.id);
                
                return (
                  <div key={menu.id} className="space-y-1">
                    {/* Group Header */}
                    <button
                      onClick={() => toggleMenu(menu.id)}
                      className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                        hasActiveChild
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : darkMode 
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                    >
                      <menu.icon className={`w-5 h-5 ${hasActiveChild ? 'text-blue-500' : ''} transition-all group-hover:scale-110`} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="font-medium transition-all flex-1 text-left text-sm">{menu.label}</span>
                          <div className="flex items-center space-x-2">
                            {menu.badge && (
                              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                hasActiveChild
                                  ? 'bg-blue-500/20 text-blue-500' 
                                  : menu.badge === 'LIVE' || menu.badge === 'HOT' || menu.badge === 'NEW'
                                    ? 'bg-red-500/10 text-red-500'
                                    : menu.badge === 'AI' || menu.badge === 'ENTERPRISE'
                                      ? 'bg-purple-500/10 text-purple-500'
                                      : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                {menu.badge}
                              </div>
                            )}
                            {isExpanded ? 
                              <ChevronDown className="w-4 h-4 transition-transform" /> : 
                              <ChevronRight className="w-4 h-4 transition-transform" />
                            }
                          </div>
                        </>
                      )}
                    </button>
                    
                    {/* Sub-menu items */}
                    {!sidebarCollapsed && isExpanded && (
                      <div className="ml-6 space-y-1 border-l-2 border-gray-700/30 pl-4">
                        {menu.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => {
                              setActiveTab(child.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 group text-sm ${
                              activeTab === child.id
                                ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white shadow-lg'
                                : darkMode 
                                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/30' 
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/30'
                            }`}
                          >
                            <child.icon className={`w-4 h-4 ${activeTab === child.id ? 'text-white' : ''} transition-all group-hover:scale-110`} />
                            <span className="font-medium transition-all flex-1 text-left">{child.label}</span>
                            {child.badge && (
                              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                activeTab === child.id 
                                  ? 'bg-white/20 text-white' 
                                  : child.badge === 'LIVE' || child.badge === 'HOT' || child.badge === 'NEW'
                                    ? 'bg-red-500/10 text-red-500'
                                    : child.badge === 'AI' || child.badge === 'ENTERPRISE'
                                      ? 'bg-purple-500/10 text-purple-500'
                                      : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                {child.badge}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </nav>

        <div className="p-2 border-t border-gray-700/50 space-y-2">
          {/* Compact System Health & Profile Section */}
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/20' : 'bg-gray-100/20'} border border-green-500/10`}>
            <div className="flex items-center justify-between">
              {/* System Health Indicator - Compact */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {!sidebarCollapsed && (
                  <span className="text-xs text-green-500 font-medium">99.99%</span>
                )}
              </div>
              
              {/* Dark Mode Toggle - Compact */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-600/50' : 'hover:bg-gray-200/50'} 
                transition-all group`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {darkMode ? '🌞' : '🌙'}
                </span>
              </button>
            </div>
          </div>

          {/* Minimized Profile Section */}
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/20' : 'bg-gray-100/20'} border border-purple-500/10`}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Admin
                  </p>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-green-500">Online</span>
                  </div>
                </div>
              )}
              {!sidebarCollapsed && (
                <button 
                  className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md transition-all"
                  title="Secure Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
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