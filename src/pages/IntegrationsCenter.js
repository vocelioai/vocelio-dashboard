import React, { useState, useEffect } from 'react';
import { 
  Network, Zap, Settings, CheckCircle, XCircle, AlertTriangle, Clock,
  ExternalLink, Plus, Search, Filter, Download, Upload, RefreshCw,
  Database, Cloud, Lock, Unlock, Key, Shield, Globe, Building,
  Users, DollarSign, Phone, Mail, MessageSquare, Calendar, FileText,
  BarChart3, PieChart, TrendingUp, Target, Award, Star, Crown,
  Webhook, Code, GitBranch, Layers, Monitor, Activity, Cpu,
  Play, Pause, Edit, Trash2, Copy, Share2, Eye, MoreHorizontal,
  Package, Store, Sparkles, Wand2, TestTube, Beaker, FlaskConical,
  Link, LinkIcon, Command, MousePointer, Boxes, Puzzle,
  ArrowUpRight, ArrowDownRight, Info, HelpCircle, CheckSquare
} from 'lucide-react';

const IntegrationsCenter = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [integrationStats, setIntegrationStats] = useState({
    totalIntegrations: 247,
    activeIntegrations: 89,
    pendingSetup: 12,
    dataSync: 2847392,
    webhooksDelivered: 98734,
    apiCalls: 5847291
  });

  const integrationCategories = [
    { id: 'all', label: 'All Integrations', count: 247 },
    { id: 'crm', label: 'CRM Systems', count: 45 },
    { id: 'communication', label: 'Communication', count: 32 },
    { id: 'analytics', label: 'Analytics', count: 28 },
    { id: 'automation', label: 'Automation', count: 41 },
    { id: 'data', label: 'Data & Storage', count: 23 },
    { id: 'productivity', label: 'Productivity', count: 35 },
    { id: 'enterprise', label: 'Enterprise', count: 43 }
  ];

  const popularIntegrations = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'crm',
      description: 'Sync leads, contacts, and call outcomes directly to Salesforce CRM',
      logo: '🏢',
      status: 'connected',
      setupTime: '5 minutes',
      rating: 4.9,
      installs: '847K+',
      features: ['Lead sync', 'Call logging', 'Opportunity tracking', 'Custom fields'],
      webhooks: 12,
      lastSync: '2m ago',
      dataPoints: 28947,
      tier: 'enterprise'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'crm',
      description: 'Complete CRM integration with contact management and deal tracking',
      logo: '🟠',
      status: 'connected',
      setupTime: '3 minutes',
      rating: 4.8,
      installs: '623K+',
      features: ['Contact sync', 'Deal pipeline', 'Email integration', 'Reporting'],
      webhooks: 8,
      lastSync: '1m ago',
      dataPoints: 19834,
      tier: 'professional'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      category: 'automation',
      description: 'Connect Vocelio to 5,000+ apps with automated workflows',
      logo: '⚡',
      status: 'connected',
      setupTime: '2 minutes',
      rating: 4.7,
      installs: '1.2M+',
      features: ['5000+ app connections', 'Custom triggers', 'Multi-step workflows', 'Real-time sync'],
      webhooks: 45,
      lastSync: '30s ago',
      dataPoints: 89234,
      tier: 'professional'
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'communication',
      description: 'Get real-time notifications and updates in your Slack channels',
      logo: '💬',
      status: 'connected',
      setupTime: '1 minute',
      rating: 4.9,
      installs: '945K+',
      features: ['Real-time alerts', 'Custom channels', 'Bot commands', 'File sharing'],
      webhooks: 6,
      lastSync: '15s ago',
      dataPoints: 5647,
      tier: 'starter'
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      category: 'data',
      description: 'Export call data and analytics directly to Google Sheets',
      logo: '📊',
      status: 'connected',
      setupTime: '2 minutes',
      rating: 4.6,
      installs: '534K+',
      features: ['Auto export', 'Real-time updates', 'Custom formatting', 'Scheduled reports'],
      webhooks: 3,
      lastSync: '5m ago',
      dataPoints: 12834,
      tier: 'starter'
    },
    {
      id: 'calendly',
      name: 'Calendly',
      category: 'productivity',
      description: 'Automatically schedule follow-up meetings based on call outcomes',
      logo: '📅',
      status: 'connected',
      setupTime: '3 minutes',
      rating: 4.8,
      installs: '287K+',
      features: ['Auto booking', 'Calendar sync', 'Custom rules', 'Time zones'],
      webhooks: 4,
      lastSync: '8m ago',
      dataPoints: 3947,
      tier: 'professional'
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      category: 'communication',
      description: 'Collaborate with your team and get call updates in Teams',
      logo: '🟦',
      status: 'available',
      setupTime: '4 minutes',
      rating: 4.5,
      installs: '456K+',
      features: ['Team notifications', 'File integration', 'Voice calls', 'Screen sharing'],
      webhooks: 0,
      lastSync: 'Never',
      dataPoints: 0,
      tier: 'enterprise'
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      category: 'crm',
      description: 'Sales pipeline management with automatic deal updates',
      logo: '🔵',
      status: 'available',
      setupTime: '5 minutes',
      rating: 4.7,
      installs: '198K+',
      features: ['Pipeline sync', 'Activity tracking', 'Deal stages', 'Revenue forecasting'],
      webhooks: 0,
      lastSync: 'Never',
      dataPoints: 0,
      tier: 'professional'
    }
  ];

  const enterpriseIntegrations = [
    {
      id: 'sap',
      name: 'SAP CRM',
      category: 'enterprise',
      description: 'Enterprise-grade CRM integration for large organizations',
      logo: '🏭',
      status: 'available',
      setupTime: '30 minutes',
      rating: 4.4,
      installs: '23K+',
      features: ['Enterprise sync', 'Custom workflows', 'Advanced security', 'Dedicated support'],
      tier: 'enterprise',
      price: 'Custom pricing'
    },
    {
      id: 'oracle',
      name: 'Oracle CX',
      category: 'enterprise',
      description: 'Complete customer experience platform integration',
      logo: '🔴',
      status: 'available',
      setupTime: '45 minutes',
      rating: 4.3,
      installs: '18K+',
      features: ['360° customer view', 'Advanced analytics', 'AI insights', 'Multi-channel'],
      tier: 'enterprise',
      price: 'Contact sales'
    }
  ];

  const webhookTemplates = [
    {
      id: 'call-completed',
      name: 'Call Completed',
      description: 'Triggered when a call ends with outcome data',
      events: ['call.completed', 'call.outcome.updated'],
      payload: { call_id: 'string', outcome: 'string', duration: 'number', sentiment: 'number' },
      usage: '89K+ webhooks/month'
    },
    {
      id: 'lead-qualified',
      name: 'Lead Qualified',
      description: 'Triggered when AI identifies a high-quality lead',
      events: ['lead.qualified', 'lead.scored'],
      payload: { lead_id: 'string', score: 'number', contact_info: 'object', qualification_reason: 'string' },
      usage: '45K+ webhooks/month'
    },
    {
      id: 'appointment-booked',
      name: 'Appointment Booked',
      description: 'Triggered when a prospect books a meeting',
      events: ['appointment.booked', 'calendar.updated'],
      payload: { appointment_id: 'string', prospect_info: 'object', datetime: 'string', meeting_type: 'string' },
      usage: '23K+ webhooks/month'
    }
  ];

  const filteredIntegrations = popularIntegrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend }) => {
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
            <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            {trend !== undefined && (
              <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                <span className="font-medium">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <p className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-1`}>
              {value}
            </p>
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const IntegrationCard = ({ integration, onConnect, onConfigure }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case 'connected':
          return { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', icon: CheckCircle };
        case 'available':
          return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', icon: Plus };
        case 'pending':
          return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', icon: Clock };
        case 'error':
          return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', icon: XCircle };
        default:
          return { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/20', icon: AlertTriangle };
      }
    };

    const statusConfig = getStatusConfig(integration.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
        backdrop-blur-sm rounded-xl border p-6 hover:shadow-lg transition-all duration-300 group h-full flex flex-col`}>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
              {integration.logo}
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <span>{integration.name}</span>
                {integration.tier === 'enterprise' && <Crown className="w-4 h-4 text-yellow-500" />}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                  {integration.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs text-gray-500">{integration.rating}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{integration.status}</span>
          </div>
        </div>

        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 flex-grow`}>
          {integration.description}
        </p>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {integration.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                {feature}
              </span>
            ))}
            {integration.features.length > 3 && (
              <span className="text-xs text-gray-500">+{integration.features.length - 3} more</span>
            )}
          </div>

          {integration.status === 'connected' && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Last Sync</p>
                <p className="font-medium">{integration.lastSync}</p>
              </div>
              <div>
                <p className="text-gray-500">Data Points</p>
                <p className="font-medium">{integration.dataPoints?.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{integration.installs} installs</span>
            <span>{integration.setupTime} setup</span>
          </div>

          <div className="flex space-x-2">
            {integration.status === 'connected' ? (
              <>
                <button 
                  onClick={() => onConfigure(integration)}
                  className="flex-1 p-3 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium"
                >
                  Configure
                </button>
                <button className="p-3 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
                  <Activity className="w-4 h-4" />
                </button>
                <button className="p-3 rounded-lg bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => onConnect(integration)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-lg font-semibold transition-all transform group-hover:scale-105 text-sm"
              >
                Connect Now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const WebhookCard = ({ webhook }) => (
    <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
      backdrop-blur-sm rounded-xl border p-6 hover:shadow-lg transition-all duration-300`}>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
            <Webhook className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{webhook.name}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{webhook.description}</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">{webhook.usage}</div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium mb-2">Events:</p>
          <div className="flex flex-wrap gap-2">
            {webhook.events.map((event, index) => (
              <span key={index} className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full font-mono">
                {event}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Sample Payload:</p>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100/50'} text-xs font-mono overflow-x-auto`}>
            <pre>{JSON.stringify(webhook.payload, null, 2)}</pre>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="flex-1 p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium">
            Test Webhook
          </button>
          <button className="flex-1 p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors text-sm font-medium">
            Copy URL
          </button>
          <button className="p-2 rounded-lg bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 transition-colors">
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const handleConnect = (integration) => {
    console.log('Connecting to:', integration.name);
    // Implementation for connecting integration
  };

  const handleConfigure = (integration) => {
    console.log('Configuring:', integration.name);
    // Implementation for configuring integration
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
      case 'popular':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard 
                key={integration.id} 
                integration={integration}
                onConnect={handleConnect}
                onConfigure={handleConfigure}
              />
            ))}
          </div>
        );

      case 'enterprise':
        return (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50' : 'bg-gradient-to-r from-yellow-50/80 to-orange-50/80 border-yellow-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl text-center`}>
              
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                👑 Enterprise Integrations
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto text-lg`}>
                Enterprise-grade integrations for large organizations with advanced security, 
                compliance, and dedicated support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {enterpriseIntegrations.map((integration) => (
                <IntegrationCard 
                  key={integration.id} 
                  integration={integration}
                  onConnect={handleConnect}
                  onConfigure={handleConfigure}
                />
              ))}
            </div>
          </div>
        );

      case 'webhooks':
        return (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-purple-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl`}>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold flex items-center space-x-3">
                    <Webhook className="w-8 h-8 text-purple-500" />
                    <span>🔗 Webhook Management</span>
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                    Real-time data delivery to your applications • {integrationStats.webhooksDelivered.toLocaleString()}+ delivered today
                  </p>
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
                  Create Webhook
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{integrationStats.webhooksDelivered.toLocaleString()}</div>
                  <div className="text-sm font-medium text-purple-300">Webhooks Delivered</div>
                  <div className="text-xs text-green-400 mt-1">99.97% success rate</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
                  <div className="text-3xl font-bold text-blue-400 mb-2">157</div>
                  <div className="text-sm font-medium text-blue-300">Active Endpoints</div>
                  <div className="text-xs text-green-400 mt-1">All operational</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
                  <div className="text-3xl font-bold text-green-400 mb-2">2.3s</div>
                  <div className="text-sm font-medium text-green-300">Avg Response Time</div>
                  <div className="text-xs text-green-400 mt-1">Lightning fast</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {webhookTemplates.map((webhook) => (
                <WebhookCard key={webhook.id} webhook={webhook} />
              ))}
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-700/50' : 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-blue-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl text-center`}>
              
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                🔧 Developer API Center
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto text-lg`}>
                Complete API documentation, SDKs, and developer resources for building custom integrations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <Code className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">REST API</h4>
                  <p className="text-sm text-gray-500">Complete REST API documentation</p>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <Package className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">SDKs</h4>
                  <p className="text-sm text-gray-500">Official SDKs for all platforms</p>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <FileText className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Documentation</h4>
                  <p className="text-sm text-gray-500">Comprehensive guides and examples</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
                  📚 View API Docs
                </button>
                <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
                  🔑 Get API Key
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
                  💻 Download SDKs
                </button>
              </div>
            </div>

            {/* API Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <MetricCard 
                icon={Code} 
                title="API Calls Today" 
                value={integrationStats.apiCalls.toLocaleString()}
                subtitle="Real-time API usage"
                color="blue"
                trend={15.7}
              />
              <MetricCard 
                icon={Activity} 
                title="Response Time" 
                value="89ms"
                subtitle="Average API latency"
                color="green"
                trend={-12.3}
              />
              <MetricCard 
                icon={Shield} 
                title="Success Rate" 
                value="99.97%"
                subtitle="API reliability"
                color="purple"
                trend={0.02}
              />
              <MetricCard 
                icon={Key} 
                title="Active Keys" 
                value="2,847"
                subtitle="Developer API keys"
                color="orange"
                trend={23.1}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard 
                key={integration.id} 
                integration={integration}
                onConnect={handleConnect}
                onConfigure={handleConfigure}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800/90 via-blue-800/90 to-gray-800/90' : 'bg-gradient-to-r from-blue-50/90 via-cyan-50/90 to-blue-50/90'} 
        rounded-3xl p-8 border ${darkMode ? 'border-blue-700/50' : 'border-blue-200/50'} relative overflow-hidden backdrop-blur-xl`}>
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
                🔗 INTEGRATIONS HUB
              </h1>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Connect Vocelio to {integrationStats.totalIntegrations}+ Business Applications
            </p>
            <p className="text-sm text-blue-500 font-medium">
              🌐 Enterprise Integration Platform • {integrationStats.activeIntegrations} Active Connections • 99.97% Uptime
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                {integrationStats.totalIntegrations}
              </div>
              <div className="text-sm font-medium text-blue-300">🔗 Total Integrations</div>
              <div className="text-xs text-green-400 mt-1">Growing weekly</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
              <div className="text-5xl font-bold text-green-400 mb-2">
                {integrationStats.activeIntegrations}
              </div>
              <div className="text-sm font-medium text-green-300">✅ Active Connections</div>
              <div className="text-xs text-green-400 mt-1">All operational</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
              <div className="text-5xl font-bold text-purple-400 mb-2">
                {(integrationStats.dataSync / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm font-medium text-purple-300">📊 Data Points Synced</div>
              <div className="text-xs text-green-400 mt-1">Real-time sync</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
              <div className="text-5xl font-bold text-orange-400 mb-2">
                {integrationStats.pendingSetup}
              </div>
              <div className="text-sm font-medium text-orange-300">⏳ Pending Setup</div>
              <div className="text-xs text-yellow-400 mt-1">Ready to configure</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
              <Network className="w-6 h-6" />
              <span>🚀 Browse Integrations</span>
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
              <Plus className="w-6 h-6" />
              <span>➕ Connect New App</span>
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
              <Code className="w-6 h-6" />
              <span>🔧 Developer API</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integration Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard 
          icon={Network} 
          title="Connected Apps" 
          value={integrationStats.activeIntegrations.toString()}
          subtitle="Active integrations"
          color="blue"
          trend={12.3}
        />
        <MetricCard 
          icon={Activity} 
          title="Data Sync Rate" 
          value="99.97%"
          subtitle="Real-time synchronization"
          color="green"
          trend={2.1}
        />
        <MetricCard 
          icon={Webhook} 
          title="Webhooks Sent" 
          value={`${(integrationStats.webhooksDelivered / 1000).toFixed(0)}K`}
          subtitle="Today's webhook delivery"
          color="purple"
          trend={15.7}
        />
        <MetricCard 
          icon={Shield} 
          title="Security Score" 
          value="A+"
          subtitle="Enterprise security rating"
          color="cyan"
          trend={0.5}
        />
      </div>

      {/* Navigation Tabs */}
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-2 backdrop-blur-sm`}>
        <nav className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'all', label: '🔗 All Integrations', count: integrationStats.totalIntegrations },
            { id: 'popular', label: '⭐ Popular', count: 89 },
            { id: 'enterprise', label: '👑 Enterprise', count: 43 },
            { id: 'webhooks', label: '🔗 Webhooks', count: 157 },
            { id: 'api', label: '🔧 API Center', count: null }
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                  : darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <span>{label}</span>
              {count && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      {(activeTab === 'all' || activeTab === 'popular') && (
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-3 pl-12 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                      : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                />
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-3 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              >
                {integrationCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
              
              <button className={`p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-all`}>
                <Filter className="w-5 h-5" />
              </button>
              
              <button className={`p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-all`}>
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderTabContent()}

      {/* Quick Connect Section */}
      {activeTab === 'all' && (
        <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200/50'} 
          rounded-2xl border p-8 backdrop-blur-xl`}>
          
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-3">
              <Zap className="w-8 h-8 text-green-500" />
              <span>⚡ Quick Connect</span>
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Get started instantly with our most popular integrations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Salesforce', 'HubSpot', 'Zapier', 'Slack', 'Google Sheets', 'Calendly'].map((name, index) => (
              <button 
                key={name}
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/50 hover:bg-gray-100/50'} 
                border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} transition-all transform hover:scale-105 text-center group`}
              >
                <div className="text-3xl mb-3">{['🏢', '🟠', '⚡', '💬', '📊', '📅'][index]}</div>
                <div className="font-semibold text-sm">{name}</div>
                <div className="text-xs text-gray-500 mt-1">1-click setup</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Integration Health Status */}
      <div className={`${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} 
        rounded-xl border p-4 backdrop-blur-sm`}>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">All Integrations: Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{integrationStats.dataSync.toLocaleString()} data points synced today</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm">99.97% uptime this month</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
              <CheckCircle className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsCenter;