import React, { useState } from 'react';
import { 
  Webhook, Globe, Zap, Activity, Settings, Code, Database,
  Plus, Search, Filter, Play, Pause, Edit, Trash2, Copy,
  CheckCircle, XCircle, AlertTriangle, Clock, MoreHorizontal,
  ArrowRight, RefreshCw, Download, Upload, Share2, Eye,
  Monitor, Server, Cloud, Shield, Key, FileText, Tag,
  BarChart3, TrendingUp, Users, MessageSquare, Mail, Phone
} from 'lucide-react';

const WebhooksManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWebhook, setSelectedWebhook] = useState(null);

  const [webhooks] = useState([
    {
      id: 1,
      name: 'Lead Qualification Webhook',
      url: 'https://api.crm-system.com/webhooks/lead-qualified',
      event: 'lead.qualified',
      status: 'active',
      method: 'POST',
      lastTriggered: '2025-08-13T10:30:00Z',
      successRate: 98.5,
      totalRequests: 15847,
      avgResponseTime: 245,
      retryPolicy: 'exponential',
      timeout: 30,
      headers: {
        'Authorization': 'Bearer ***',
        'Content-Type': 'application/json'
      },
      description: 'Triggers when a lead is automatically qualified by AI agent',
      tags: ['crm', 'leads', 'automation']
    },
    {
      id: 2,
      name: 'Call Completion Notification',
      url: 'https://notifications.company.com/call-complete',
      event: 'call.completed',
      status: 'active',
      method: 'POST',
      lastTriggered: '2025-08-13T09:15:00Z',
      successRate: 99.2,
      totalRequests: 23456,
      avgResponseTime: 189,
      retryPolicy: 'linear',
      timeout: 15,
      headers: {
        'X-API-Key': '***',
        'Content-Type': 'application/json'
      },
      description: 'Sends notification when voice call is completed with summary',
      tags: ['notifications', 'calls', 'summary']
    },
    {
      id: 3,
      name: 'Campaign Performance Update',
      url: 'https://analytics.dashboard.com/webhook/campaign-metrics',
      event: 'campaign.metrics_updated',
      status: 'paused',
      method: 'PUT',
      lastTriggered: '2025-08-12T16:45:00Z',
      successRate: 94.7,
      totalRequests: 8934,
      avgResponseTime: 567,
      retryPolicy: 'exponential',
      timeout: 45,
      headers: {
        'Authorization': 'Bearer ***',
        'X-Source': 'vocelio-ai'
      },
      description: 'Updates external analytics dashboard with campaign performance',
      tags: ['analytics', 'campaigns', 'metrics']
    }
  ]);

  const [stats] = useState({
    totalWebhooks: 24,
    activeWebhooks: 18,
    totalRequests: 234567,
    avgSuccessRate: 97.8,
    avgResponseTime: 312
  });

  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700', icon: Pause },
    error: { label: 'Error', color: 'bg-red-100 text-red-700', icon: XCircle }
  };

  const events = [
    'lead.qualified', 'lead.created', 'call.started', 'call.completed',
    'campaign.started', 'campaign.completed', 'agent.response',
    'voice.training_complete', 'appointment.scheduled', 'payment.processed'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-xl">
                  <Webhook className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Webhooks Manager</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🔗 Event-driven automation • Real-time integrations • Smart retry policies
                  </p>
                </div>
              </div>
            </div>
            
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition-all">
              <Plus className="w-5 h-5" />
              <span>Create Webhook</span>
            </button>
          </div>

          <div className="grid grid-cols-5 gap-6 mt-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Webhooks</p>
                  <p className="text-2xl font-bold">{stats.totalWebhooks}</p>
                </div>
                <Webhook className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active</p>
                  <p className="text-2xl font-bold">{stats.activeWebhooks}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-200" />
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
                  <p className="text-orange-100 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.avgSuccessRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Avg Response</p>
                  <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
                </div>
                <Clock className="w-8 h-8 text-teal-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Webhook className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{webhook.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{webhook.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[webhook.status].color}`}>
                    {statusConfig[webhook.status].label}
                  </span>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-xl font-bold text-green-600">{webhook.successRate}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{webhook.totalRequests.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
                  <p className="text-xl font-bold text-blue-600">{webhook.avgResponseTime}ms</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Triggered</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(webhook.lastTriggered).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Endpoint: {webhook.url}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Event: {webhook.event} • Method: {webhook.method}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Play className="w-4 h-4 text-green-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Edit className="w-4 h-4 text-blue-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-purple-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebhooksManager;
