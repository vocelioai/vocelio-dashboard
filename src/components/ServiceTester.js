import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Clock, RefreshCw, 
  Activity, Database, Zap, Phone, Brain,
  BarChart3, Shield, Users, Globe
} from 'lucide-react';

const ServiceTester = ({ darkMode = false }) => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  // Service configuration with endpoints and test scenarios
  const services = {
    // Core Foundation
    apiGateway: {
      name: 'API Gateway',
      url: 'https://api.vocelio.ai',
      icon: Globe,
      tests: [
        { name: 'Health Check', endpoint: '/health', method: 'GET' },
        { name: 'Authentication', endpoint: '/auth/verify', method: 'POST' },
        { name: 'Rate Limiting', endpoint: '/rate-limit', method: 'GET' }
      ]
    },
    
    // AI Services
    aiAgents: {
      name: 'AI Agents Service',
      url: 'https://agents.vocelio.ai',
      icon: Brain,
      tests: [
        { name: 'List Agents', endpoint: '/api/v1/agents', method: 'GET' },
        { name: 'Agent Performance', endpoint: '/api/v1/agents/metrics', method: 'GET' },
        { name: 'Create Agent', endpoint: '/api/v1/agents', method: 'POST' }
      ]
    },

    voiceLab: {
      name: 'Voice Lab',
      url: 'https://voicelab.vocelio.ai',
      icon: Activity,
      tests: [
        { name: 'Voice Models', endpoint: '/api/v1/voices', method: 'GET' },
        { name: 'Synthesis Test', endpoint: '/api/v1/synthesize', method: 'POST' },
        { name: 'Voice Analytics', endpoint: '/api/v1/analytics', method: 'GET' }
      ]
    },

    smartCampaigns: {
      name: 'Smart Campaigns',
      url: 'https://campaigns.vocelio.ai',
      icon: Zap,
      tests: [
        { name: 'Campaign List', endpoint: '/api/v1/campaigns', method: 'GET' },
        { name: 'Performance Metrics', endpoint: '/api/v1/campaigns/metrics', method: 'GET' },
        { name: 'A/B Test Results', endpoint: '/api/v1/campaigns/ab-tests', method: 'GET' }
      ]
    },

    // Communication Services
    callCenter: {
      name: 'Call Center',
      url: 'https://call.vocelio.ai',
      icon: Phone,
      tests: [
        { name: 'Active Calls', endpoint: '/api/v1/calls/active', method: 'GET' },
        { name: 'Call History', endpoint: '/api/v1/calls/history', method: 'GET' },
        { name: 'Agent Status', endpoint: '/api/v1/agents/status', method: 'GET' }
      ]
    },

    phoneNumbers: {
      name: 'Phone Numbers',
      url: 'https://numbers.vocelio.ai',
      icon: Phone,
      tests: [
        { name: 'Available Numbers', endpoint: '/api/v1/numbers/available', method: 'GET' },
        { name: 'Owned Numbers', endpoint: '/api/v1/numbers/owned', method: 'GET' },
        { name: 'Number Analytics', endpoint: '/api/v1/numbers/analytics', method: 'GET' }
      ]
    },

    // Analytics & BI
    analytics: {
      name: 'Analytics',
      url: 'https://analytics.vocelio.ai',
      icon: BarChart3,
      tests: [
        { name: 'Dashboard Metrics', endpoint: '/api/v1/dashboard', method: 'GET' },
        { name: 'Real-time Stats', endpoint: '/api/v1/realtime', method: 'GET' },
        { name: 'Custom Reports', endpoint: '/api/v1/reports', method: 'GET' }
      ]
    },

    // Security & Compliance
    security: {
      name: 'Security Center',
      url: 'https://security.vocelio.ai',
      icon: Shield,
      tests: [
        { name: 'Security Status', endpoint: '/api/v1/status', method: 'GET' },
        { name: 'Audit Logs', endpoint: '/api/v1/audit', method: 'GET' },
        { name: 'Compliance Check', endpoint: '/api/v1/compliance', method: 'GET' }
      ]
    },

    // User Management
    users: {
      name: 'User Management',
      url: 'https://users.vocelio.ai',
      icon: Users,
      tests: [
        { name: 'User Profile', endpoint: '/api/v1/profile', method: 'GET' },
        { name: 'Team Members', endpoint: '/api/v1/team', method: 'GET' },
        { name: 'Permissions', endpoint: '/api/v1/permissions', method: 'GET' }
      ]
    }
  };

  // Execute a single test
  const runTest = async (serviceKey, test, serviceConfig) => {
    const testKey = `${serviceKey}_${test.name}`;
    
    setCurrentTest(testKey);
    setTestResults(prev => ({
      ...prev,
      [testKey]: { status: 'running', startTime: Date.now() }
    }));

    try {
      const url = `${serviceConfig.url}${test.endpoint}`;
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
          'X-API-Key': process.env.REACT_APP_VOCELIO_API_KEY || 'test-key'
        }
      };

      // Add test data for POST requests
      if (test.method === 'POST') {
        if (test.endpoint.includes('agents')) {
          options.body = JSON.stringify({
            name: 'Test Agent',
            type: 'voice',
            description: 'Test agent for service validation'
          });
        } else if (test.endpoint.includes('synthesize')) {
          options.body = JSON.stringify({
            text: 'Hello, this is a test voice synthesis.',
            voice: 'default'
          });
        } else if (test.endpoint.includes('auth')) {
          options.body = JSON.stringify({
            token: process.env.REACT_APP_AUTH_TOKEN
          });
        }
      }

      const startTime = Date.now();
      const response = await fetch(url, options);
      const responseTime = Date.now() - startTime;
      
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        data = { message: 'Non-JSON response', status: response.status };
      }

      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          status: response.ok ? 'success' : 'error',
          responseTime,
          statusCode: response.status,
          data: response.ok ? data : { error: data },
          endTime: Date.now()
        }
      }));

    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          status: 'error',
          error: error.message,
          responseTime: Date.now() - prev[testKey]?.startTime || 0,
          endTime: Date.now()
        }
      }));
    }
  };

  // Run all tests sequentially
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});

    for (const [serviceKey, serviceConfig] of Object.entries(services)) {
      for (const test of serviceConfig.tests) {
        await runTest(serviceKey, test, serviceConfig);
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsRunning(false);
    setCurrentTest(null);
  };

  // Get status icon for a test result
  const getStatusIcon = (result) => {
    if (!result) return <Clock className="w-4 h-4 text-gray-400" />;
    
    switch (result.status) {
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Generate summary statistics
  const getTestSummary = () => {
    const results = Object.values(testResults);
    const total = results.length;
    const passed = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'error').length;
    const running = results.filter(r => r.status === 'running').length;
    const avgResponseTime = results
      .filter(r => r.responseTime)
      .reduce((acc, r) => acc + r.responseTime, 0) / results.filter(r => r.responseTime).length || 0;

    return { total, passed, failed, running, avgResponseTime };
  };

  const summary = getTestSummary();

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Service Testing Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Test all Vocelio.ai services and populate dashboard with live data
            </p>
          </div>
          
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isRunning ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Activity className="w-5 h-5" />
            )}
            {isRunning ? 'Testing...' : 'Run All Tests'}
          </button>
        </div>

        {/* Summary Stats */}
        {Object.keys(testResults).length > 0 && (
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tests</div>
              <div className="text-2xl font-bold">{summary.total}</div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Passed</div>
              <div className="text-2xl font-bold text-green-500">{summary.passed}</div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
              <div className="text-2xl font-bold text-red-500">{summary.failed}</div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Running</div>
              <div className="text-2xl font-bold text-blue-500">{summary.running}</div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
              <div className="text-2xl font-bold">{Math.round(summary.avgResponseTime)}ms</div>
            </div>
          </div>
        )}

        {/* Service Test Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(services).map(([serviceKey, serviceConfig]) => {
            const ServiceIcon = serviceConfig.icon;
            
            return (
              <div 
                key={serviceKey}
                className={`p-6 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Service Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <ServiceIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{serviceConfig.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{serviceConfig.url}</p>
                  </div>
                </div>

                {/* Test Results */}
                <div className="space-y-3">
                  {serviceConfig.tests.map((test) => {
                    const testKey = `${serviceKey}_${test.name}`;
                    const result = testResults[testKey];
                    const isCurrentlyRunning = currentTest === testKey;
                    
                    return (
                      <div 
                        key={testKey}
                        className={`p-3 rounded-lg flex items-center justify-between ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        } ${isCurrentlyRunning ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result)}
                          <div>
                            <div className="font-medium">{test.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {test.method} {test.endpoint}
                            </div>
                          </div>
                        </div>
                        
                        {result && (
                          <div className="text-right">
                            {result.responseTime && (
                              <div className="text-sm font-medium">
                                {result.responseTime}ms
                              </div>
                            )}
                            {result.statusCode && (
                              <div className={`text-sm ${
                                result.statusCode < 400 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {result.statusCode}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Detailed Test Results</h2>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} overflow-x-auto`}>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceTester;
