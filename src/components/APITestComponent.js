import React, { useState, useEffect } from 'react';
import { 
  checkAllServicesHealth, 
  useAuth, 
  agents, 
  campaigns,
  analytics 
} from '../api/unifiedApiClient.js';

const APITestComponent = () => {
  const [healthResults, setHealthResults] = useState({});
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // Test all service health
  const testServiceHealth = async () => {
    setLoading(true);
    try {
      const results = await checkAllServicesHealth();
      setHealthResults(results);
      console.log('🔍 Service Health Results:', results);
    } catch (error) {
      console.error('❌ Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test individual API calls
  const testAPIEndpoints = async () => {
    const results = {};
    
    try {
      // Test Agents API
      console.log('🤖 Testing Agents API...');
      const agentsData = await agents.list();
      results.agents = { success: true, count: agentsData?.length || 0 };
    } catch (error) {
      results.agents = { success: false, error: error.message };
    }

    try {
      // Test Campaigns API
      console.log('📢 Testing Campaigns API...');
      const campaignsData = await campaigns.list();
      results.campaigns = { success: true, count: campaignsData?.length || 0 };
    } catch (error) {
      results.campaigns = { success: false, error: error.message };
    }

    try {
      // Test Analytics API
      console.log('📊 Testing Analytics API...');
      const analyticsData = await analytics.getDashboard();
      results.analytics = { success: true, data: !!analyticsData };
    } catch (error) {
      results.analytics = { success: false, error: error.message };
    }

    setTestResults(results);
    console.log('🔍 API Test Results:', results);
  };

  useEffect(() => {
    // Auto-run health check on component mount
    testServiceHealth();
  }, []);

  const healthyServices = Object.values(healthResults).filter(Boolean).length;
  const totalServices = Object.keys(healthResults).length;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🚀 API Integration Test Dashboard</h2>
      
      {/* Authentication Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">🔐 Authentication Status</h3>
        {authLoading ? (
          <p>Loading authentication...</p>
        ) : (
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {user ? '✅ Authenticated' : '❌ Not Authenticated'}
            </span>
            {user && (
              <span className="text-sm text-gray-600">
                User: {user.email || user.id}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Service Health Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">🏥 Service Health Monitor</h3>
          <button
            onClick={testServiceHealth}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '🔄 Checking...' : '🔄 Refresh Health'}
          </button>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-2xl font-bold text-green-600">
            {healthyServices}/{totalServices}
          </div>
          <div className="text-sm text-gray-600">Services Online</div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            healthyServices === totalServices ? 'bg-green-100 text-green-800' : 
            healthyServices > totalServices * 0.5 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {healthyServices === totalServices ? 'All Systems Operational' :
             healthyServices > totalServices * 0.5 ? 'Some Services Down' :
             'Critical Issues'}
          </div>
        </div>

        {totalServices > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(healthResults).map(([service, isHealthy]) => (
              <div
                key={service}
                className={`p-2 rounded text-xs font-medium ${
                  isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {isHealthy ? '✅' : '❌'} {service}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Endpoint Tests */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">🧪 API Endpoint Tests</h3>
          <button
            onClick={testAPIEndpoints}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            🧪 Test API Calls
          </button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-3">
            {Object.entries(testResults).map(([api, result]) => (
              <div key={api} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? '✅' : '❌'} {api.toUpperCase()}
                  </span>
                  {result.success && result.count !== undefined && (
                    <span className="text-sm text-gray-600">
                      {result.count} items found
                    </span>
                  )}
                </div>
                {!result.success && (
                  <span className="text-xs text-red-600 max-w-xs truncate">
                    {result.error}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Integration Status */}
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">✅ Integration Checklist</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Unified API Client Created</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Environment Variables Updated</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Supabase Authentication Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Health Monitoring Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Error Handling & Retries</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">🔄</span>
            <span>Component Migration (Next Step)</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">🎯 Next Steps</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Deploy your Railway backend services to the configured URLs</li>
          <li>Update components to use the new unified API client</li>
          <li>Replace manual API calls with provided React hooks</li>
          <li>Test individual features with real backend data</li>
          <li>Deploy to Vercel with updated environment variables</li>
        </ol>
      </div>
    </div>
  );
};

export default APITestComponent;
