import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, Filter, Settings, Check, X, Archive, 
  AlertTriangle, Info, CheckCircle, XCircle, Clock, Star,
  Mail, Phone, MessageSquare, Calendar, Users, Activity,
  Zap, Target, Award, TrendingUp, Heart, Globe, Shield,
  Briefcase, CreditCard, Database, Server, FileText,
  MoreHorizontal, Eye, EyeOff, Volume2, VolumeX, Trash2,
  RefreshCw, Download, Share2, ChevronRight, ChevronDown,
  Smartphone, Monitor, Tablet, Watch, Headphones, Speaker
} from 'lucide-react';

const NotificationsCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showRead, setShowRead] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // list, compact, detailed

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
      relatedId: 'campaign_456',
      metadata: {
        campaignName: 'Q3 Outreach',
        budgetUsed: 85,
        remainingBudget: '$2,340'
      }
    },
    {
      id: 3,
      title: 'New Lead Qualified',
      message: 'High-value lead "TechCorp Solutions" has been automatically qualified based on engagement score.',
      category: 'leads',
      priority: 'high',
      type: 'info',
      timestamp: '2025-08-13T08:45:00Z',
      read: true,
      starred: false,
      source: 'Lead Scoring Engine',
      actionRequired: true,
      relatedId: 'lead_789',
      metadata: {
        leadName: 'TechCorp Solutions',
        score: 92,
        estimatedValue: '$45,000'
      }
    },
    {
      id: 4,
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance for voice synthesis engine on Aug 15, 2:00 AM - 4:00 AM EST. Minimal service impact expected.',
      category: 'system',
      priority: 'low',
      type: 'info',
      timestamp: '2025-08-12T16:20:00Z',
      read: true,
      starred: false,
      source: 'System Operations',
      actionRequired: false,
      relatedId: 'maintenance_001',
      metadata: {
        startTime: '2025-08-15T02:00:00Z',
        endTime: '2025-08-15T04:00:00Z',
        services: ['Voice Synthesis', 'Audio Processing']
      }
    },
    {
      id: 5,
      title: 'API Rate Limit Warning',
      message: 'Twilio API usage approaching rate limit (85% of daily quota). Consider upgrading plan or optimizing calls.',
      category: 'integrations',
      priority: 'medium',
      type: 'warning',
      timestamp: '2025-08-12T14:10:00Z',
      read: false,
      starred: true,
      source: 'API Monitor',
      actionRequired: true,
      relatedId: 'twilio_api',
      metadata: {
        service: 'Twilio',
        usage: 85,
        dailyLimit: 10000,
        currentUsage: 8500
      }
    },
    {
      id: 6,
      title: 'Voice Lab Training Complete',
      message: 'Custom voice "Professional Assistant" training completed successfully. Ready for deployment.',
      category: 'voice-lab',
      priority: 'low',
      type: 'success',
      timestamp: '2025-08-12T11:30:00Z',
      read: true,
      starred: false,
      source: 'Voice Lab',
      actionRequired: true,
      relatedId: 'voice_model_123',
      metadata: {
        voiceName: 'Professional Assistant',
        trainingTime: '4.5 hours',
        accuracy: 96.8
      }
    },
    {
      id: 7,
      title: 'Security Alert: Unusual Login',
      message: 'Unusual login detected from new location (IP: 192.168.1.100). If this was not you, please secure your account.',
      category: 'security',
      priority: 'high',
      type: 'error',
      timestamp: '2025-08-11T22:45:00Z',
      read: false,
      starred: true,
      source: 'Security Monitor',
      actionRequired: true,
      relatedId: 'security_alert_001',
      metadata: {
        ipAddress: '192.168.1.100',
        location: 'Unknown',
        device: 'Chrome on Windows'
      }
    },
    {
      id: 8,
      title: 'Monthly Usage Report Ready',
      message: 'Your August usage report is ready for download. Total voice minutes: 15,240. Cost savings: $2,340.',
      category: 'billing',
      priority: 'low',
      type: 'info',
      timestamp: '2025-08-11T08:00:00Z',
      read: true,
      starred: false,
      source: 'Billing System',
      actionRequired: false,
      relatedId: 'report_aug_2025',
      metadata: {
        voiceMinutes: 15240,
        costSavings: '$2,340',
        reportUrl: '/reports/august-2025'
      }
    }
  ]);

  const [stats] = useState({
    total: 156,
    unread: 23,
    high: 8,
    medium: 15,
    actionRequired: 12
  });

  const categories = [
    { id: 'all', name: 'All Notifications', icon: Bell, count: stats.total },
    { id: 'ai-agents', name: 'AI Agents', icon: Activity, count: 34 },
    { id: 'campaigns', name: 'Campaigns', icon: Target, count: 28 },
    { id: 'leads', name: 'Leads', icon: Users, count: 19 },
    { id: 'voice-lab', name: 'Voice Lab', icon: MessageSquare, count: 15 },
    { id: 'integrations', name: 'Integrations', icon: Globe, count: 22 },
    { id: 'billing', name: 'Billing', icon: CreditCard, count: 12 },
    { id: 'system', name: 'System', icon: Server, count: 18 },
    { id: 'security', name: 'Security', icon: Shield, count: 8 }
  ];

  const priorityConfig = {
    high: { label: 'High', color: 'bg-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-700 dark:text-red-400' },
    medium: { label: 'Medium', color: 'bg-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', textColor: 'text-yellow-700 dark:text-yellow-400' },
    low: { label: 'Low', color: 'bg-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-700 dark:text-green-400' }
  };

  const typeConfig = {
    success: { icon: CheckCircle, color: 'text-green-500' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500' },
    error: { icon: XCircle, color: 'text-red-500' },
    info: { icon: Info, color: 'text-blue-500' }
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
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAsUnread = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: false } : n
    ));
  };

  const toggleStar = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl relative">
                  <Bell className="w-8 h-8 text-white" />
                  {stats.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{stats.unread}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications Center</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🔔 Real-time alerts • Smart filtering • Action center
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-semibold">
                {stats.unread} Unread
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition-all">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-5 gap-6 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Unread</p>
                  <p className="text-2xl font-bold">{stats.unread}</p>
                </div>
                <Eye className="w-8 h-8 text-red-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">High Priority</p>
                  <p className="text-2xl font-bold">{stats.high}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Medium Priority</p>
                  <p className="text-2xl font-bold">{stats.medium}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Action Required</p>
                  <p className="text-2xl font-bold">{stats.actionRequired}</p>
                </div>
                <Zap className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <div className="w-80 space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search Notifications</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Priorities</option>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Read</span>
                  <button
                    onClick={() => setShowRead(!showRead)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showRead ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showRead ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
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
                          ? 'bg-blue-500 text-white'
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
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedCategory === 'all' ? 'All Notifications' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-500 dark:text-gray-400">
                  ({filteredNotifications.length})
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Archive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const TypeIcon = typeConfig[notification.type].icon;
                return (
                  <div
                    key={notification.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg ${
                      !notification.read ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-2 rounded-lg ${typeConfig[notification.type].color}`}>
                          <TypeIcon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                              {notification.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[notification.priority].bgColor} ${priorityConfig[notification.priority].textColor}`}>
                              {priorityConfig[notification.priority].label}
                            </span>
                            {notification.actionRequired && (
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                                Action Required
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                              <span>{notification.source}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(notification.timestamp)}</span>
                            </div>
                            
                            {notification.actionRequired && (
                              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all">
                                Take Action
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleStar(notification.id)}
                          className={`p-2 rounded-lg transition-all ${
                            notification.starred 
                              ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                              : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${notification.starred ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button
                          onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                        >
                          {notification.read ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        
                        <button className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
