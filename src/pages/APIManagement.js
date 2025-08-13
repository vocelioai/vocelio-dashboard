import React, { useState } from 'react';
import { 
  Server, Key, Globe, Shield, Code, Database, Monitor,
  Plus, Search, Filter, Settings, Eye, EyeOff, Copy,
  CheckCircle, XCircle, AlertTriangle, Clock, MoreHorizontal,
  BarChart3, TrendingUp, Activity, Users, Zap, Target,
  FileText, Download, Upload, RefreshCw, Edit, Trash2,
  Lock, Unlock, Network, Cloud, HardDrive, Cpu
} from 'lucide-react';

const APIManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showApiKeys, setShowApiKeys] = useState(false);

  const [apis] = useState([
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
      usage: {
        requests: 45234,
        limit: 100000,
        percentage: 45.2
      },
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
      usage: {
        requests: 23567,
        limit: 50000,
        percentage: 47.1
      },
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
      usage: {
        requests: 8934,
        limit: 25000,
        percentage: 35.7
      },
      latency: 389,
      uptime: 99.9,
      lastUsed: '2025-08-13T08:45:00Z',
      description: 'Retrieve campaign performance metrics and insights',
      tags: ['analytics', 'campaigns', 'metrics', 'insights']
    }
  ]);

  const [stats] = useState({
    totalAPIs: 34,
    activeAPIs: 28,
    totalRequests: 234567,
    avgLatency: 267,
    avgUptime: 99.7
  });

  const categories = [
    { id: 'all', name: 'All APIs', count: stats.totalAPIs },
    { id: 'voice', name: 'Voice APIs', count: 12 },
    { id: 'crm', name: 'CRM APIs', count: 8 },
    { id: 'analytics', name: 'Analytics APIs', count: 6 },
    { id: 'integrations', name: 'Integrations', count: 5 },
    { id: 'webhooks', name: 'Webhooks', count: 3 }
  ];

  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    deprecated: { label: 'Deprecated', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
    inactive: { label: 'Inactive', color: 'bg-red-100 text-red-700', icon: XCircle }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Server className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Management</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🔧 API gateway • Rate limiting • Authentication • Documentation
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition-all">
                <Plus className="w-5 h-5" />
                <span>New API Key</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-6 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total APIs</p>
                  <p className="text-2xl font-bold">{stats.totalAPIs}</p>
                </div>
                <Server className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active</p>
                  <p className="text-2xl font-bold">{stats.activeAPIs}</p>
                </div>
                <Activity className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Requests</p>
                  <p className="text-2xl font-bold">{(stats.totalRequests / 1000).toFixed(0)}K</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Avg Latency</p>
                  <p className="text-2xl font-bold">{stats.avgLatency}ms</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Uptime</p>
                  <p className="text-2xl font-bold">{stats.avgUptime}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-teal-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-80 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-6">
              {apis.map((api) => (
                <div key={api.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Server className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{api.name}</h3>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                            {api.version}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{api.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[api.status].color}`}>
                        {statusConfig[api.status].label}
                      </span>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Usage</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${api.usage.percentage}%`}}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{api.usage.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Requests</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{api.usage.requests.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Latency</p>
                      <p className="text-xl font-bold text-blue-600">{api.latency}ms</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                      <p className="text-xl font-bold text-green-600">{api.uptime}%</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Endpoint: {api.endpoint}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {api.method} • {api.authentication} • {api.rateLimit}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          <BarChart3 className="w-4 h-4 text-purple-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          <Key className="w-4 h-4 text-orange-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIManagement;
