/**
 * Flow Analytics Dashboard Component
 * Comprehensive analytics and performance insights for voice flows
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Clock, Phone, Users, Target,
  GitBranch, CheckCircle, XCircle, AlertTriangle, Activity, Zap,
  Calendar, Filter, Download, RefreshCw, Eye, Settings, PieChart,
  LineChart, ArrowUpRight, ArrowDownRight, Percent, Hash, Timer
} from 'lucide-react';

const FlowAnalyticsDashboard = ({ flowId, timeRange = '7d', onFlowSelect }) => {
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [dateRange, setDateRange] = useState(timeRange);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    status: 'all',
    category: 'all',
    complexity: 'all'
  });

  // Simulated analytics data (in real app, this would come from API)
  const mockAnalyticsData = useMemo(() => ({
    overview: {
      totalFlows: 24,
      totalCalls: 12847,
      averageSuccessRate: 94.2,
      averageDuration: '4:32',
      trendsChange: {
        totalFlows: +12,
        totalCalls: +23,
        averageSuccessRate: +5.3,
        averageDuration: -8.2
      }
    },
    performance: {
      successRateByFlow: [
        { name: 'Sales Qualification', rate: 94.2, calls: 3420, category: 'sales' },
        { name: 'Customer Service', rate: 91.8, calls: 2890, category: 'support' },
        { name: 'Appointment Booking', rate: 96.5, calls: 2134, category: 'scheduling' },
        { name: 'Lead Generation', rate: 88.3, calls: 1876, category: 'sales' },
        { name: 'Survey Collection', rate: 92.7, calls: 1452, category: 'feedback' },
        { name: 'Technical Support', rate: 89.1, calls: 1075, category: 'support' }
      ],
      callVolumeData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [1240, 1890, 2340, 1980, 2650, 1420, 980]
      },
      averageDurationTrend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        values: [285, 272, 268, 272] // in seconds
      }
    },
    flowHealth: [
      { id: 'sales_qual', name: 'Sales Qualification', status: 'healthy', score: 98, issues: 0, lastCheck: '5 min ago' },
      { id: 'customer_service', name: 'Customer Service', status: 'warning', score: 85, issues: 2, lastCheck: '3 min ago' },
      { id: 'appointment', name: 'Appointment Booking', status: 'healthy', score: 96, issues: 0, lastCheck: '7 min ago' },
      { id: 'lead_gen', name: 'Lead Generation', status: 'critical', score: 72, issues: 4, lastCheck: '2 min ago' },
      { id: 'survey', name: 'Survey Collection', status: 'healthy', score: 91, issues: 1, lastCheck: '8 min ago' }
    ],
    nodeAnalytics: [
      { type: 'Start', count: 24, avgDuration: 5.2, successRate: 100 },
      { type: 'Say', count: 89, avgDuration: 12.8, successRate: 98.5 },
      { type: 'Collect', count: 67, avgDuration: 18.4, successRate: 92.1 },
      { type: 'Decision', count: 45, avgDuration: 2.1, successRate: 89.7 },
      { type: 'Transfer', count: 23, avgDuration: 45.6, successRate: 87.3 },
      { type: 'End', count: 24, avgDuration: 3.2, successRate: 100 }
    ],
    conversionFunnels: {
      salesQualification: [
        { stage: 'Call Started', count: 1000, rate: 100 },
        { stage: 'Greeting Completed', count: 980, rate: 98 },
        { stage: 'Needs Assessment', count: 920, rate: 92 },
        { stage: 'Budget Qualified', count: 780, rate: 78 },
        { stage: 'Interest Confirmed', count: 650, rate: 65 },
        { stage: 'Appointment Scheduled', count: 520, rate: 52 }
      ]
    },
    realTimeMetrics: {
      activeCalls: 47,
      callsPerHour: 156,
      currentSuccessRate: 93.8,
      avgWaitTime: 2.3,
      agentUtilization: 78.4
    },
    insights: [
      {
        type: 'success',
        title: 'High Performance Flows',
        description: 'Appointment Booking flow showing 96.5% success rate',
        action: 'View Details',
        priority: 'low'
      },
      {
        type: 'warning',
        title: 'Duration Increase',
        description: 'Customer Service flow duration increased by 15% this week',
        action: 'Optimize Flow',
        priority: 'medium'
      },
      {
        type: 'error',
        title: 'Critical Issue',
        description: 'Lead Generation flow has 4 validation errors',
        action: 'Fix Issues',
        priority: 'high'
      },
      {
        type: 'info',
        title: 'Usage Spike',
        description: '23% increase in total calls this week',
        action: 'Scale Resources',
        priority: 'medium'
      }
    ]
  }), []);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      setLoading(false);
    }, 1000);
  }, [mockAnalyticsData, dateRange]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'critical': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : 
               change < 0 ? <ArrowDownRight className="w-4 h-4 mr-1" /> : null}
              <span>{Math.abs(change)}% {change !== 0 ? (change > 0 ? 'increase' : 'decrease') : 'no change'}</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-500/10 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Flow Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights and performance metrics for your voice flows
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Date Range Selector */}
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'flows', label: 'Flow Health', icon: Activity },
          { id: 'nodes', label: 'Node Analytics', icon: GitBranch },
          { id: 'funnels', label: 'Conversion Funnels', icon: Target },
          { id: 'realtime', label: 'Real-time', icon: Zap }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedMetric(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              selectedMetric === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      {selectedMetric === 'overview' && analyticsData && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Flows"
              value={analyticsData.overview.totalFlows}
              change={analyticsData.overview.trendsChange.totalFlows}
              icon={GitBranch}
              color="blue"
            />
            <MetricCard
              title="Total Calls"
              value={analyticsData.overview.totalCalls.toLocaleString()}
              change={analyticsData.overview.trendsChange.totalCalls}
              icon={Phone}
              color="green"
            />
            <MetricCard
              title="Success Rate"
              value={`${analyticsData.overview.averageSuccessRate}%`}
              change={analyticsData.overview.trendsChange.averageSuccessRate}
              icon={CheckCircle}
              color="emerald"
            />
            <MetricCard
              title="Avg Duration"
              value={analyticsData.overview.averageDuration}
              change={analyticsData.overview.trendsChange.averageDuration}
              icon={Clock}
              color="purple"
            />
          </div>

          {/* Insights Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h2>
            <div className="space-y-4">
              {analyticsData.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'success' ? 'bg-green-100 dark:bg-green-900/50' :
                    insight.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                    insight.type === 'error' ? 'bg-red-100 dark:bg-red-900/50' :
                    'bg-blue-100 dark:bg-blue-900/50'
                  }`}>
                    {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                    {insight.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                    {insight.type === 'info' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{insight.description}</p>
                  </div>
                  <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
                    {insight.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedMetric === 'performance' && analyticsData && (
        <div className="space-y-6">
          {/* Performance by Flow */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance by Flow</h2>
            <div className="space-y-4">
              {analyticsData.performance.successRateByFlow.map((flow, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{flow.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{flow.calls.toLocaleString()} calls</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{flow.rate}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                    </div>
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${flow.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call Volume Chart Placeholder */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Call Volume Trends</h2>
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chart visualization would be integrated here</p>
                <p className="text-sm text-gray-400">Weekly call volume: {analyticsData.performance.callVolumeData.values.reduce((a, b) => a + b, 0).toLocaleString()} total calls</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMetric === 'flows' && analyticsData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Flow Health Status</h2>
          <div className="space-y-4">
            {analyticsData.flowHealth.map((flow) => (
              <div key={flow.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                   onClick={() => onFlowSelect && onFlowSelect(flow.id)}>
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    flow.status === 'healthy' ? 'bg-green-500' :
                    flow.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{flow.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last checked: {flow.lastCheck}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{flow.score}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Health Score</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${flow.issues === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {flow.issues}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Issues</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(flow.status)}`}>
                    {flow.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMetric === 'nodes' && analyticsData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Node Type Analytics</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Node Type</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Count</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Avg Duration</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.nodeAnalytics.map((node, index) => (
                  <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{node.type}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{node.count}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{node.avgDuration}s</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 dark:text-white">{node.successRate}%</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                          <div 
                            className="bg-green-500 h-1 rounded-full" 
                            style={{ width: `${node.successRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedMetric === 'funnels' && analyticsData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Conversion Funnel - Sales Qualification</h2>
          <div className="space-y-4">
            {analyticsData.conversionFunnels.salesQualification.map((stage, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{stage.stage}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 dark:text-gray-400">{stage.count.toLocaleString()}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stage.rate}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${stage.rate}%` }}
                  ></div>
                </div>
                {index < analyticsData.conversionFunnels.salesQualification.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2">
                    <ArrowDownRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMetric === 'realtime' && analyticsData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Active Calls"
              value={analyticsData.realTimeMetrics.activeCalls}
              icon={Phone}
              color="blue"
            />
            <MetricCard
              title="Calls/Hour"
              value={analyticsData.realTimeMetrics.callsPerHour}
              icon={Timer}
              color="green"
            />
            <MetricCard
              title="Live Success Rate"
              value={`${analyticsData.realTimeMetrics.currentSuccessRate}%`}
              icon={Target}
              color="purple"
            />
            <MetricCard
              title="Avg Wait Time"
              value={`${analyticsData.realTimeMetrics.avgWaitTime}s`}
              icon={Clock}
              color="orange"
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-time Activity</h2>
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Real-time activity feed would be shown here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowAnalyticsDashboard;
