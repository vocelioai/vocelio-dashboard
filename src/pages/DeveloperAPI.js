import React, { useState } from 'react';
import { 
  Code, Book, Play, Copy, Download, ExternalLink, Key, Shield,
  Globe, Zap, Database, Webhook, Search, ChevronDown, ChevronRight, 
  CheckCircle, Terminal, Package, MessageSquare, BarChart3, 
  Target, Cpu, Phone, Eye, EyeOff, X, Activity, Clock
} from 'lucide-react';

const APIDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [expandedCategories, setExpandedCategories] = useState(['authentication']);

  // API Statistics
  const apiStats = {
    totalEndpoints: 247,
    activeIntegrations: 1892,
    requestsToday: 2847592,
    uptime: 99.99,
    avgResponseTime: 89,
    rateLimitPerHour: 10000
  };

  // API Categories
  const apiCategories = [
    {
      id: 'authentication',
      name: 'Authentication',
      icon: Key,
      description: 'API key management and authentication',
      endpoints: [
        { id: 'generate-key', method: 'POST', path: '/auth/api-keys', name: 'Generate API Key' },
        { id: 'validate-token', method: 'GET', path: '/auth/validate', name: 'Validate Token' }
      ]
    },
    {
      id: 'campaigns',
      name: 'Campaigns',
      icon: Target,
      description: 'Campaign management and automation',
      endpoints: [
        { id: 'create-campaign', method: 'POST', path: '/campaigns', name: 'Create Campaign' },
        { id: 'list-campaigns', method: 'GET', path: '/campaigns', name: 'List Campaigns' },
        { id: 'update-campaign', method: 'PUT', path: '/campaigns/{id}', name: 'Update Campaign' }
      ]
    },
    {
      id: 'calls',
      name: 'Calls',
      icon: Phone,
      description: 'Call management and operations',
      endpoints: [
        { id: 'start-call', method: 'POST', path: '/calls/start', name: 'Start Call' },
        { id: 'list-calls', method: 'GET', path: '/calls', name: 'List Calls' },
        { id: 'get-recording', method: 'GET', path: '/calls/{id}/recording', name: 'Get Recording' }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Performance metrics and reporting',
      endpoints: [
        { id: 'dashboard-metrics', method: 'GET', path: '/analytics/dashboard', name: 'Dashboard Metrics' },
        { id: 'export-report', method: 'POST', path: '/analytics/export', name: 'Export Report' }
      ]
    }
  ];

  const codeExamples = {
    curl: `curl -X POST "https://api.vocelio.ai/calls/start" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone_number": "+1234567890"}'`,
    
    javascript: `const vocelio = require('@vocelio/sdk');
const client = new vocelio.Client('YOUR_API_KEY');

const call = await client.calls.start({
  phoneNumber: '+1234567890',
  agentId: 'agent_456'
});`,
    
    python: `import vocelio
client = vocelio.Client('YOUR_API_KEY')

call = client.calls.start(
    phone_number='+1234567890',
    agent_id='agent_456'
)`
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-100 text-green-800 border-green-200',
      POST: 'bg-blue-100 text-blue-800 border-blue-200',
      PUT: 'bg-orange-100 text-orange-800 border-orange-200',
      DELETE: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[method] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Globe },
    { id: 'endpoints', name: 'API Reference', icon: Database },
    { id: 'examples', name: 'Code Examples', icon: Code },
    { id: 'webhooks', name: 'Webhooks', icon: Webhook }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const EndpointCard = ({ endpoint, onClick }) => (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onClick(endpoint)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getMethodColor(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <h4 className="font-medium">{endpoint.name}</h4>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 font-mono">{endpoint.path}</p>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Endpoints"
          value={apiStats.totalEndpoints}
          subtitle="Production ready"
          icon={Database}
          color="blue"
        />
        <StatCard
          title="Active Integrations"
          value={apiStats.activeIntegrations.toLocaleString()}
          subtitle="Global deployments"
          icon={Globe}
          color="green"
        />
        <StatCard
          title="Requests Today"
          value={`${(apiStats.requestsToday / 1000000).toFixed(1)}M`}
          subtitle="+23% from yesterday"
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="Uptime"
          value={`${apiStats.uptime}%`}
          subtitle="SLA guaranteed"
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Quick Start */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-green-600" />
            <span>Quick Start</span>
          </h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Generate API Key
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">1. Get Your API Key</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">API Key:</span>
                <button 
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-sm">
                  {apiKeyVisible ? 'voc_live_sk_1234567890abcdef...' : '••••••••••••••••••••••••••••••••'}
                </code>
                <button 
                  onClick={() => copyToClipboard('voc_live_sk_1234567890abcdef...')}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">2. Make Your First Call</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-green-600 overflow-x-auto">
{`curl -X POST "https://api.vocelio.ai/calls/start"
  -H "Authorization: Bearer YOUR_API_KEY"
  -d '{"phone_number": "+1234567890"}'`}
              </pre>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Book className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h5 className="font-medium text-blue-900">Documentation</h5>
            <p className="text-sm text-blue-700">Complete guides</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <h5 className="font-medium text-green-900">SDKs</h5>
            <p className="text-sm text-green-700">Official libraries</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <h5 className="font-medium text-purple-900">Support</h5>
            <p className="text-sm text-purple-700">24/7 help</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEndpoints = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search endpoints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* API Categories */}
      <div className="space-y-4">
        {apiCategories.map((category) => {
          const CategoryIcon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);
          const filteredEndpoints = category.endpoints.filter(endpoint =>
            endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            endpoint.path.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (searchQuery && filteredEndpoints.length === 0) return null;

          return (
            <div key={category.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedCategories(prev => 
                  prev.includes(category.id) 
                    ? prev.filter(id => id !== category.id)
                    : [...prev, category.id]
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CategoryIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-blue-600 font-medium">
                      {filteredEndpoints.length} endpoints
                    </span>
                    {isExpanded ? 
                      <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {filteredEndpoints.map(endpoint => (
                    <EndpointCard 
                      key={endpoint.id} 
                      endpoint={endpoint} 
                      onClick={setSelectedEndpoint}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCodeExamples = () => (
    <div className="space-y-6">
      {/* Language Selector */}
      <div className="flex space-x-2">
        {Object.entries(codeExamples).map(([key, example]) => (
          <button
            key={key}
            onClick={() => setSelectedLanguage(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedLanguage === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Code Example */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold">Example: Start a Call</h3>
          <button
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm">Copy</span>
          </button>
        </div>
        <div className="p-4">
          <pre className="text-sm text-gray-800 overflow-x-auto">
            <code>{codeExamples[selectedLanguage]}</code>
          </pre>
        </div>
      </div>

      {/* SDK Installation */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">SDK Installation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium mb-2">Node.js</h4>
            <code className="block p-3 bg-gray-50 rounded text-sm">npm install @vocelio/sdk</code>
          </div>
          <div>
            <h4 className="font-medium mb-2">Python</h4>
            <code className="block p-3 bg-gray-50 rounded text-sm">pip install vocelio</code>
          </div>
          <div>
            <h4 className="font-medium mb-2">PHP</h4>
            <code className="block p-3 bg-gray-50 rounded text-sm">composer require vocelio/sdk</code>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      {/* Webhook Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">99.9%</div>
          <div className="text-sm text-gray-600">Delivery Rate</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">45ms</div>
          <div className="text-sm text-gray-600">Avg Latency</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">23</div>
          <div className="text-sm text-gray-600">Event Types</div>
        </div>
      </div>

      {/* Webhook Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create Webhook</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Endpoint URL</label>
              <input 
                type="url" 
                placeholder="https://your-domain.com/webhook"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Events</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {['call.started', 'call.completed', 'call.failed', 'campaign.finished'].map((event, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{event}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
              Create Webhook
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Example Payload</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-800 overflow-x-auto">
{`{
  "event": "call.completed",
  "timestamp": "2024-11-28T10:30:00Z",
  "data": {
    "call_id": "call_789",
    "phone_number": "+1234567890",
    "duration": 45,
    "status": "completed"
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
            <p className="text-gray-600">Manage and explore Vocelio.ai API endpoints</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">API Status: Operational</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-6">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'endpoints' && renderEndpoints()}
        {activeTab === 'examples' && renderCodeExamples()}
        {activeTab === 'webhooks' && renderWebhooks()}
      </div>

      {/* Endpoint Modal */}
      {selectedEndpoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getMethodColor(selectedEndpoint.method)}`}>
                  {selectedEndpoint.method}
                </span>
                <h2 className="text-xl font-bold">{selectedEndpoint.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedEndpoint(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Endpoint</h3>
                  <code className="block p-3 bg-gray-50 rounded-lg">
                    {selectedEndpoint.method} {selectedEndpoint.path}
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">
                    {selectedEndpoint.description || 'API endpoint for ' + selectedEndpoint.name.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIDashboard;