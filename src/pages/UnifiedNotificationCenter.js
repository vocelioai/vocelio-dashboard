import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, Filter, Settings, Check, X, Archive, 
  AlertTriangle, Info, CheckCircle, XCircle, Clock, Star,
  Mail, Phone, MessageSquare, Calendar, Users, Activity,
  Zap, Target, Award, TrendingUp, Heart, Globe, Shield,
  Briefcase, CreditCard, Database, Server, FileText,
  MoreHorizontal, Eye, EyeOff, Volume2, VolumeX, Trash2,
  RefreshCw, Download, Share2, ChevronRight, ChevronDown,
  Smartphone, Monitor, Tablet, Watch, Headphones, Speaker,
  Plus, Edit, Copy, Send, BarChart3, LineChart, Loader
} from 'lucide-react';

const UnifiedNotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showRead, setShowRead] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [isLoading, setIsLoading] = useState(false);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'AI Agent Performance Alert',
      message: 'Voice Agent "Customer Support Pro" has achieved 98% satisfaction rate - highest this month!',
      category: 'ai-agents',
      priority: 'high',
      type: 'success',
      timestamp: '2025-08-13T10:30:00Z',
      read: false,
      starred: true,
      source: 'AI Performance Monitor',
      actionRequired: false,
      relatedId: 'agent_123',
      metadata: {
        agentName: 'Customer Support Pro',
        satisfactionRate: 98,
        previousRate: 89
      }
    },
    {
      id: 2,
      title: 'Campaign Budget Alert',
      message: 'Voice campaign "Q3 Outreach" has used 85% of allocated budget. Consider adjusting spend limits.',
      category: 'campaigns',
      priority: 'medium',
      type: 'warning',
      timestamp: '2025-08-13T09:15:00Z',
      read: false,
      starred: false,
      source: 'Campaign Manager',
      actionRequired: true,
      relatedId: 'campaign_456'
    },
    {
      id: 3,
      title: 'New Lead Generated',
      message: 'High-quality lead captured from voice campaign. Score: 85/100. Ready for follow-up.',
      category: 'leads',
      priority: 'medium',
      type: 'info',
      timestamp: '2025-08-13T08:45:00Z',
      read: true,
      starred: false,
      source: 'Lead Generation Engine',
      actionRequired: true,
      relatedId: 'lead_789'
    }
  ]);

  // Mock templates data
  const [templates, setTemplates] = useState([
    { 
      id: 1,
      name: 'Welcome Email', 
      type: 'email', 
      status: 'active', 
      sent: 1247, 
      deliveryRate: 98.5,
      lastSent: '2025-08-13T09:30:00Z',
      description: 'Welcome new customers with personalized voice AI introductions'
    },
    { 
      id: 2,
      name: 'Call Summary SMS', 
      type: 'sms', 
      status: 'active', 
      sent: 856, 
      deliveryRate: 99.2,
      lastSent: '2025-08-13T10:15:00Z',
      description: 'Automated call summaries sent via SMS after voice interactions'
    },
    { 
      id: 3,
      name: 'Campaign Alert', 
      type: 'push', 
      status: 'draft', 
      sent: 0, 
      deliveryRate: 0,
      lastSent: null,
      description: 'Real-time campaign performance notifications'
    },
    { 
      id: 4,
      name: 'Lead Qualification', 
      type: 'email', 
      status: 'active', 
      sent: 432, 
      deliveryRate: 97.8,
      lastSent: '2025-08-13T08:20:00Z',
      description: 'Automated lead qualification follow-ups'
    }
  ]);

  // Mock analytics data
  const [analytics] = useState({
    totalSent: 2535,
    deliveryRate: 98.1,
    openRate: 45.2,
    clickRate: 12.8,
    activeTemplates: 3,
    totalTemplates: 4,
    channels: 6,
    avgResponseTime: '2.3s'
  });

  const [stats] = useState({
    total: 23,
    unread: 8,
    starred: 4,
    urgent: 2
  });

  const categories = [
    { id: 'all', name: 'All Categories', icon: Bell, count: 23 },
    { id: 'ai-agents', name: 'AI Agents', icon: Zap, count: 5 },
    { id: 'campaigns', name: 'Campaigns', icon: Target, count: 8 },
    { id: 'leads', name: 'Leads', icon: Users, count: 4 },
    { id: 'system', name: 'System', icon: Settings, count: 3 },
    { id: 'billing', name: 'Billing', icon: CreditCard, count: 3 }
  ];

  const priorityConfig = {
    high: { color: 'text-red-600 bg-red-50', label: 'High' },
    medium: { color: 'text-yellow-600 bg-yellow-50', label: 'Medium' },
    low: { color: 'text-green-600 bg-green-50', label: 'Low' }
  };

  const typeConfig = {
    success: { icon: CheckCircle, color: 'text-green-600' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600' },
    error: { icon: XCircle, color: 'text-red-600' },
    info: { icon: Info, color: 'text-blue-600' }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRead = showRead || !notification.read;
    
    return matchesCategory && matchesPriority && matchesSearch && matchesRead;
  });

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAsUnread = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: false } : notif
    ));
  };

  const toggleStar = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, starred: !notif.starred } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours < 1) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const tabs = [
    { id: 'inbox', name: 'Inbox', icon: Bell, count: stats.unread },
    { id: 'templates', name: 'Templates', icon: FileText, count: templates.length },
    { id: 'channels', name: 'Channels', icon: MessageSquare, count: analytics.channels },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const renderInboxTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Notifications</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Unread</p>
              <p className="text-3xl font-bold">{stats.unread}</p>
            </div>
            <Mail className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Starred</p>
              <p className="text-3xl font-bold">{stats.starred}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Urgent</p>
              <p className="text-3xl font-bold">{stats.urgent}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-6">
          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Priority</h3>
            <div className="space-y-2">
              {['all', 'high', 'medium', 'low'].map(priority => (
                <button
                  key={priority}
                  onClick={() => setSelectedPriority(priority)}
                  className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                    selectedPriority === priority
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {priority === 'all' ? 'All Priorities' : `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications ({filteredNotifications.length})
                  </h3>
                  <button
                    onClick={() => setShowRead(!showRead)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      showRead 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {showRead ? 'Hide Read' : 'Show Read'}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notification => {
                  const Icon = typeConfig[notification.type]?.icon || Info;
                  const iconColor = typeConfig[notification.type]?.color || 'text-gray-600';
                  
                  return (
                    <div key={notification.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={`font-medium text-gray-900 dark:text-white ${!notification.read ? 'font-semibold' : ''}`}>
                                  {notification.title}
                                </h4>
                                {notification.starred && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs ${priorityConfig[notification.priority]?.color}`}>
                                  {priorityConfig[notification.priority]?.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>{notification.source}</span>
                                <span>•</span>
                                <span>{formatTimestamp(notification.timestamp)}</span>
                                {notification.actionRequired && (
                                  <>
                                    <span>•</span>
                                    <span className="text-orange-600 font-medium">Action Required</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => toggleStar(notification.id)}
                                className="p-1 text-gray-400 hover:text-yellow-500 rounded"
                              >
                                <Star className={`w-4 h-4 ${notification.starred ? 'text-yellow-500 fill-current' : ''}`} />
                              </button>
                              <button
                                onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-500 rounded"
                              >
                                {notification.read ? <Mail className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 text-gray-400 hover:text-red-500 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      {/* Header with Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Templates</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage notification templates for automated messaging</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  template.type === 'email' ? 'bg-blue-100' :
                  template.type === 'sms' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  {template.type === 'email' ? <Mail className="w-5 h-5 text-blue-600" /> :
                   template.type === 'sms' ? <MessageSquare className="w-5 h-5 text-green-600" /> :
                   <Bell className="w-5 h-5 text-purple-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-sm rounded-md ${
                template.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {template.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Messages Sent</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{template.sent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Rate</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{template.deliveryRate}%</p>
              </div>
            </div>
            
            {template.lastSent && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Last sent: {formatTimestamp(template.lastSent)}
              </p>
            )}
            
            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </button>
              <button className="bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChannelsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Communication Channels</h2>
        <p className="text-gray-600 dark:text-gray-400">Configure and monitor your notification delivery channels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Email', icon: Mail, status: 'active', delivered: 1247, failed: 3, color: 'blue' },
          { name: 'SMS', icon: MessageSquare, status: 'active', delivered: 856, failed: 1, color: 'green' },
          { name: 'Push Notifications', icon: Bell, status: 'active', delivered: 2341, failed: 12, color: 'purple' },
          { name: 'Voice Calls', icon: Phone, status: 'active', delivered: 123, failed: 2, color: 'orange' },
          { name: 'In-App', icon: Monitor, status: 'active', delivered: 789, failed: 0, color: 'indigo' },
          { name: 'Webhook', icon: Globe, status: 'maintenance', delivered: 567, failed: 8, color: 'gray' }
        ].map(channel => (
          <div key={channel.name} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${channel.color}-100`}>
                  <channel.icon className={`w-6 h-6 text-${channel.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{channel.name}</h3>
              </div>
              <span className={`px-2 py-1 text-sm rounded-md ${
                channel.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {channel.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Delivered</span>
                <span className="font-medium text-gray-900 dark:text-white">{channel.delivered.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Failed</span>
                <span className="font-medium text-red-600">{channel.failed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Success Rate</span>
                <span className="font-medium text-green-600">
                  {((channel.delivered / (channel.delivered + channel.failed)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configure</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">Monitor performance and engagement metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Sent</p>
              <p className="text-3xl font-bold">{analytics.totalSent.toLocaleString()}</p>
            </div>
            <Send className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Delivery Rate</p>
              <p className="text-3xl font-bold">{analytics.deliveryRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Open Rate</p>
              <p className="text-3xl font-bold">{analytics.openRate}%</p>
            </div>
            <Eye className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Click Rate</p>
              <p className="text-3xl font-bold">{analytics.clickRate}%</p>
            </div>
            <Target className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Delivery Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Channel Performance</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Configure global notification preferences and rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Global Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Enable Notifications</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Turn on/off all notifications</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Sound Alerts</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Play sound for new notifications</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Email Digest</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive daily summary emails</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Priority Rules</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">High Priority Keywords</label>
              <input
                type="text"
                placeholder="urgent, critical, failure"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Auto-Archive After</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notification Center</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📬 Unified notifications • Templates • Analytics • Multi-channel delivery
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inbox' && renderInboxTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'channels' && renderChannelsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default UnifiedNotificationCenter;
