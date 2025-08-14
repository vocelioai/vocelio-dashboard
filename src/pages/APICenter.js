import React, { useState } from 'react';
import { 
  Server, Key, Globe, Shield, Code, Database, Monitor, Book, Play, Copy, Download, 
  ExternalLink, Search, ChevronDown, ChevronRight, CheckCircle, Terminal, Package, 
  MessageSquare, BarChart3, Target, Cpu, Phone, Eye, EyeOff, X, Activity, Clock,
  Plus, Filter, Settings, AlertTriangle, MoreHorizontal, TrendingUp, Users, Zap,
  FileText, Upload, RefreshCw, Edit, Trash2, Lock, Unlock, Network, Cloud, HardDrive
} from 'lucide-react';

const APICenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [expandedCategories, setExpandedCategories] = useState(['authentication']);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Comprehensive API Statistics
  const apiStats = {
    totalEndpoints: 247,
    activeIntegrations: 1892,
    requestsToday: 2847592,
    uptime: 99.99,
    avgResponseTime: 89,
    rateLimitPerHour: 10000,
    totalAPIs: 34,
    activeAPIs: 28,
    avgLatency: 267
  };

  // API Categories with management data
  const apiCategories = [
    {
      id: 'authentication',
      name: 'Authentication',
      icon: Key,
      description: 'API key management and authentication',
      count: 4,
      endpoints: [
        { 
          id: 'generate-key', 
          method: 'POST', 
          path: '/auth/api-keys', 
          name: 'Generate API Key',
          status: 'active',
          usage: { requests: 12456, limit: 50000, percentage: 24.9 },
          latency: 125
        },
        { 
          id: 'validate-token', 
          method: 'GET', 
          path: '/auth/validate', 
          name: 'Validate Token',
          status: 'active',
          usage: { requests: 89234, limit: 200000, percentage: 44.6 },
          latency: 67
        },
        { 
          id: 'refresh-token', 
          method: 'POST', 
          path: '/auth/refresh', 
          name: 'Refresh Token',
          status: 'active',
          usage: { requests: 5678, limit: 25000, percentage: 22.7 },
          latency: 89
        }
      ]
    },
    {
      id: 'voice',
      name: 'Voice APIs',
      icon: Phone,
      description: 'Voice synthesis, recognition, and processing',
      count: 12,
      endpoints: [
        { 
          id: 'voice-synthesize', 
          method: 'POST', 
          path: '/voice/synthesize', 
          name: 'Voice Synthesis',
          status: 'active',
          usage: { requests: 45234, limit: 100000, percentage: 45.2 },
          latency: 245
        },
        { 
          id: 'voice-clone', 
          method: 'POST', 
          path: '/voice/clone', 
          name: 'Voice Cloning',
          status: 'active',
          usage: { requests: 12890, limit: 50000, percentage: 25.8 },
          latency: 1256
        }
      ]
    },
    {
      id: 'campaigns',
      name: 'Campaigns',
      icon: Target,
      description: 'Campaign management and automation',
      count: 8,
      endpoints: [
        { 
          id: 'create-campaign', 
          method: 'POST', 
          path: '/campaigns', 
          name: 'Create Campaign',
          status: 'active',
          usage: { requests: 3456, limit: 10000, percentage: 34.6 },
          latency: 189
        },
        { 
          id: 'list-campaigns', 
          method: 'GET', 
          path: '/campaigns', 
          name: 'List Campaigns',
          status: 'active',
          usage: { requests: 15678, limit: 50000, percentage: 31.4 },
          latency: 145
        }
      ]
    },
    {
      id: 'calls',
      name: 'Calls',
      icon: Phone,
      description: 'Call management and operations',
      count: 6,
      endpoints: [
        { 
          id: 'start-call', 
          method: 'POST', 
          path: '/calls/start', 
          name: 'Start Call',
          status: 'active',
          usage: { requests: 23456, limit: 75000, percentage: 31.3 },
          latency: 234
        },
        { 
          id: 'list-calls', 
          method: 'GET', 
          path: '/calls', 
          name: 'List Calls',
          status: 'active',
          usage: { requests: 45678, limit: 100000, percentage: 45.7 },
          latency: 167
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Performance metrics and reporting',
      count: 6,
      endpoints: [
        { 
          id: 'dashboard-metrics', 
          method: 'GET', 
          path: '/analytics/dashboard', 
          name: 'Dashboard Metrics',
          status: 'active',
          usage: { requests: 8934, limit: 25000, percentage: 35.7 },
          latency: 389
        },
        { 
          id: 'export-report', 
          method: 'POST', 
          path: '/analytics/export', 
          name: 'Export Report',
          status: 'active',
          usage: { requests: 2345, limit: 5000, percentage: 46.9 },
          latency: 1234
        }
      ]
    }
  ];

  // Code examples for different languages
  const codeExamples = {
    curl: `curl -X POST "https://api.vocelio.ai/calls/start" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone_number": "+1234567890", "agent_id": "agent_456"}'`,
    
    javascript: `const vocelio = require('@vocelio/sdk');
const client = new vocelio.Client('YOUR_API_KEY');

const call = await client.calls.start({
  phoneNumber: '+1234567890',
  agentId: 'agent_456'
});

console.log('Call started:', call.id);`,
    
    python: `import vocelio

client = vocelio.Client('YOUR_API_KEY')

call = client.calls.start(
    phone_number='+1234567890',
    agent_id='agent_456'
)

print(f'Call started: {call.id}')`
  };

  // Mock API management data
  const managedAPIs = [
    {
      id: 1,
      name: 'Voice Synthesis API',
      version: 'v2.1',
      category: 'voice',
      status: 'active',
      endpoint: 'https://api.vocelio.ai/v2/voice/synthesize',
      method: 'POST',
      authentication: 'Bearer Token',
      rateLimit: '1000/hour',
      usage: { requests: 45234, limit: 100000, percentage: 45.2 },
      latency: 245,
      uptime: 99.8,
      lastUsed: '2025-08-13T10:30:00Z',
      description: 'Convert text to natural-sounding speech with AI voices',
      tags: ['voice', 'synthesis', 'ai', 'text-to-speech']
    },
    {
      id: 2,
      name: 'Lead Management API',
      version: 'v1.5',
      category: 'crm',
      status: 'active',
      endpoint: 'https://api.vocelio.ai/v1/leads',
      method: 'GET, POST, PUT, DELETE',
      authentication: 'API Key',
      rateLimit: '5000/hour',
      usage: { requests: 23567, limit: 50000, percentage: 47.1 },
      latency: 156,
      uptime: 99.5,
      lastUsed: '2025-08-13T09:15:00Z',
      description: 'Manage leads, scoring, and qualification workflows',
      tags: ['leads', 'crm', 'management', 'scoring']
    },
    {
      id: 3,
      name: 'Campaign Analytics API',
      version: 'v1.2',
      category: 'analytics',
      status: 'active',
      endpoint: 'https://api.vocelio.ai/v1/campaigns/analytics',
      method: 'GET',
      authentication: 'OAuth 2.0',
      rateLimit: '2000/hour',
      usage: { requests: 8934, limit: 25000, percentage: 35.7 },
      latency: 389,
      uptime: 99.9,
      lastUsed: '2025-08-13T08:45:00Z',
      description: 'Retrieve campaign performance metrics and insights',
      tags: ['analytics', 'campaigns', 'metrics', 'insights']
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Globe },
    { id: 'documentation', name: 'API Docs', icon: Book },
    { id: 'management', name: 'Management', icon: Settings },
    { id: 'monitoring', name: 'Monitoring', icon: Monitor },
    { id: 'keys', name: 'API Keys', icon: Key }
  ];

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-100 text-green-800 border-green-200',
      POST: 'bg-blue-100 text-blue-800 border-blue-200',
      PUT: 'bg-orange-100 text-orange-800 border-orange-200',
      DELETE: 'bg-red-100 text-red-800 border-red-200',
      PATCH: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[method] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      deprecated: 'bg-yellow-100 text-yellow-700',
      maintenance: 'bg-orange-100 text-orange-700',
      inactive: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Filter APIs based on search and category
  const filteredAPIs = managedAPIs.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Endpoints</p>
              <p className="text-3xl font-bold">{apiStats.totalEndpoints}</p>
            </div>
            <Database className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Integrations</p>
              <p className="text-3xl font-bold">{apiStats.activeIntegrations.toLocaleString()}</p>
            </div>
            <Zap className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Requests Today</p>
              <p className="text-3xl font-bold">{(apiStats.requestsToday / 1000000).toFixed(1)}M</p>
            </div>
            <Activity className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Uptime</p>
              <p className="text-3xl font-bold">{apiStats.uptime}%</p>
            </div>
            <Shield className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Key className="w-6 h-6 text-blue-500 mb-2" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Generate API Key</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Create new authentication credentials</div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Book className="w-6 h-6 text-green-500 mb-2" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">View Documentation</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Browse API reference and guides</div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Play className="w-6 h-6 text-purple-500 mb-2" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Test API</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Try endpoints in API playground</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent API Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New API key generated', endpoint: 'Voice Synthesis API', time: '5 minutes ago', status: 'success' },
            { action: 'Rate limit exceeded', endpoint: 'Lead Management API', time: '12 minutes ago', status: 'warning' },
            { action: 'Successful integration', endpoint: 'Campaign Analytics API', time: '1 hour ago', status: 'success' },
            { action: 'API key revoked', endpoint: 'Webhook API', time: '2 hours ago', status: 'error' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{activity.action}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{activity.endpoint}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="curl">cURL</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>

        {/* Code Example */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Example: Start a Call</h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{codeExamples[selectedLanguage]}</code>
          </pre>
        </div>
      </div>

      {/* API Categories */}
      <div className="space-y-4">
        {apiCategories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                if (expandedCategories.includes(category.id)) {
                  setExpandedCategories(expandedCategories.filter(id => id !== category.id));
                } else {
                  setExpandedCategories([...expandedCategories, category.id]);
                }
              }}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <category.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
                </div>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-sm">
                  {category.count} endpoints
                </span>
              </div>
              {expandedCategories.includes(category.id) ? 
                <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                <ChevronRight className="w-5 h-5 text-gray-400" />
              }
            </button>
            
            {expandedCategories.includes(category.id) && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                {category.endpoints.map((endpoint) => (
                  <div key={endpoint.id} className="p-6 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{endpoint.name}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(endpoint.status)}`}>
                          {endpoint.status}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <code className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                    
                    {endpoint.usage && (
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Usage: </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {endpoint.usage.requests.toLocaleString()} / {endpoint.usage.limit.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Latency: </span>
                          <span className="font-medium text-gray-900 dark:text-white">{endpoint.latency}ms</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getUsageColor(endpoint.usage.percentage)}`}
                              style={{ width: `${endpoint.usage.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {endpoint.usage.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderManagement = () => (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Management</h3>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add API</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="voice">Voice APIs</option>
            <option value="crm">CRM APIs</option>
            <option value="analytics">Analytics APIs</option>
          </select>
        </div>
      </div>

      {/* API List */}
      <div className="space-y-4">
        {filteredAPIs.map((api) => (
          <div key={api.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{api.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{api.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(api.status)}`}>
                  {api.status}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{api.version}</span>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Method: </span>
                <span className="font-medium text-gray-900 dark:text-white">{api.method}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Auth: </span>
                <span className="font-medium text-gray-900 dark:text-white">{api.authentication}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Rate Limit: </span>
                <span className="font-medium text-gray-900 dark:text-white">{api.rateLimit}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Latency: </span>
                <span className="font-medium text-gray-900 dark:text-white">{api.latency}ms</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Usage</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {api.usage.requests.toLocaleString()} / {api.usage.limit.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageColor(api.usage.percentage)}`}
                    style={{ width: `${api.usage.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {api.usage.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {api.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Response Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{apiStats.avgResponseTime}ms</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">99.8%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Error Rate</p>
              <p className="text-2xl font-bold text-red-600">0.2%</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Active APIs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{apiStats.activeAPIs}</p>
            </div>
            <Server className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts and Logs would go here */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Performance Overview</h3>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Performance charts will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPIKeys = () => (
    <div className="space-y-6">
      {/* API Key Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Keys</h3>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Generate New Key</span>
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Production Key', key: 'voc_live_***********************', created: '2025-08-01', lastUsed: '2025-08-13', status: 'active' },
            { name: 'Development Key', key: 'voc_test_***********************', created: '2025-07-15', lastUsed: '2025-08-12', status: 'active' },
            { name: 'Staging Key', key: 'voc_stag_***********************', created: '2025-06-20', lastUsed: '2025-08-10', status: 'inactive' }
          ].map((keyData, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Key className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{keyData.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{keyData.key}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(keyData.status)}`}>
                    {keyData.status}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div>Created: {keyData.created}</div>
                <div>Last used: {keyData.lastUsed}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'documentation': return renderDocumentation();
      case 'management': return renderManagement();
      case 'monitoring': return renderMonitoring();
      case 'keys': return renderAPIKeys();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Server className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Center</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">🚀 Complete API management • Documentation • Monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                API Playground
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default APICenter;
