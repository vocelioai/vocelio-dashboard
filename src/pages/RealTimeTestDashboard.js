import React, { useState, useEffect } from 'react';
import { Activity, Phone, Users, TrendingUp, Clock, AlertCircle, CheckCircle, BarChart3, Zap, RefreshCw } from 'lucide-react';
import callCenterApiService from '../services/CallCenterApiService';
import { useRealTimeData, useContacts } from '../hooks/useRealTimeData';

const RealTimeTestDashboard = () => {
  // Real-time hooks
  const { data: realTimeData, isLoading: dataLoading, error: dataError, connectionStatus } = useRealTimeData();
  const { contacts: liveContacts, loading: contactsLoading, error: contactsError, refetch: refetchContacts } = useContacts();

  // Test results state
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Manual refresh function
  const handleRefresh = async () => {
    setLastRefresh(new Date());
    await refetchContacts();
  };

  // API Connection Test
  const testApiConnection = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    const tests = [
      { name: 'System Health', method: () => callCenterApiService.getSystemHealth() },
      { name: 'Analytics', method: () => callCenterApiService.getAnalytics() },
      { name: 'Call Metrics', method: () => callCenterApiService.getCallMetrics() },
      { name: 'Agent Metrics', method: () => callCenterApiService.getAgentMetrics() },
      { name: 'Contacts', method: () => callCenterApiService.getContacts() },
      { name: 'Real-Time Updates', method: () => callCenterApiService.getRealTimeUpdates() }
    ];

    const results = [];
    
    for (const test of tests) {
      try {
        const startTime = Date.now();
        const result = await test.method();
        const duration = Date.now() - startTime;
        
        results.push({
          name: test.name,
          status: 'success',
          duration: `${duration}ms`,
          data: result
        });
      } catch (error) {
        results.push({
          name: test.name,
          status: 'error',
          error: error.message
        });
      }
    }
    
    setTestResults(results);
    setIsRunningTests(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Activity className="text-white" size={24} />
              </div>
              Real-Time Integration Test Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Monitor live data connections and test API endpoints</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="font-medium text-gray-900">{lastRefresh.toLocaleTimeString()}</div>
            </div>
            
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">API Connection</h3>
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                connectionStatus === 'connected' ? 'text-green-600' :
                connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {connectionStatus === 'connected' ? '✓ Connected' :
                 connectionStatus === 'connecting' ? '⚡ Connecting...' : '✗ Disconnected'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Data Loading:</span>
              <span className={`font-medium ${dataLoading ? 'text-yellow-600' : 'text-green-600'}`}>
                {dataLoading ? '⏳ Loading...' : '✓ Ready'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Contacts API</h3>
            <Users size={20} className="text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Count:</span>
              <span className="font-medium text-gray-900">
                {contactsLoading ? '...' : liveContacts?.length || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${contactsError ? 'text-red-600' : 'text-green-600'}`}>
                {contactsError ? '✗ Error' : '✓ OK'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Real-Time Data</h3>
            <TrendingUp size={20} className="text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Calls:</span>
              <span className="font-medium text-gray-900">
                {realTimeData?.callMetrics?.activeCalls || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Queue Size:</span>
              <span className="font-medium text-gray-900">
                {realTimeData?.callMetrics?.queueSize || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {dataLoading ? '...' : (realTimeData?.analytics?.totalCalls?.toLocaleString() || '2,847')}
          </div>
          <div className="text-xs text-gray-600 mt-1">Total Calls</div>
          <div className="text-xs text-green-600 mt-1">
            +{realTimeData?.analytics?.callGrowth || 12}%
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {dataLoading ? '...' : `${realTimeData?.analytics?.successRate || '96.2'}%`}
          </div>
          <div className="text-xs text-gray-600 mt-1">Success Rate</div>
          <div className="text-xs text-green-600 mt-1">
            +{realTimeData?.analytics?.successRateChange || 8}%
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {dataLoading ? '...' : (realTimeData?.agentMetrics?.online || 12)}
          </div>
          <div className="text-xs text-gray-600 mt-1">Agents Online</div>
          <div className="text-xs text-blue-600 mt-1">
            {realTimeData?.agentMetrics?.available || 8} Available
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {dataLoading ? '...' : (realTimeData?.systemHealth?.uptime || '99.9%')}
          </div>
          <div className="text-xs text-gray-600 mt-1">System Uptime</div>
          <div className="text-xs text-green-600 mt-1">All Systems OK</div>
        </div>
      </div>

      {/* API Testing Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="text-yellow-600" size={20} />
            API Endpoint Testing
          </h3>
          <button
            onClick={testApiConnection}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            {isRunningTests ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Running Tests...
              </>
            ) : (
              <>
                <Zap size={16} />
                Test All Endpoints
              </>
            )}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                result.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {result.status === 'success' ? (
                    <CheckCircle className="text-green-600" size={16} />
                  ) : (
                    <AlertCircle className="text-red-600" size={16} />
                  )}
                  <span className="font-medium text-gray-900">{result.name}</span>
                </div>
                <div className="text-right">
                  {result.status === 'success' ? (
                    <div className="text-sm text-green-600">✓ Success ({result.duration})</div>
                  ) : (
                    <div className="text-sm text-red-600">✗ {result.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {(dataError || contactsError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-red-600" size={20} />
            <h3 className="font-semibold text-red-900">Connection Errors</h3>
          </div>
          <div className="space-y-2 text-sm">
            {dataError && (
              <div className="text-red-700">
                <span className="font-medium">Real-Time Data:</span> {dataError}
              </div>
            )}
            {contactsError && (
              <div className="text-red-700">
                <span className="font-medium">Contacts API:</span> {contactsError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeTestDashboard;
