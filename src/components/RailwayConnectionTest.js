import React, { useState, useEffect } from 'react';
import { railwayAPI } from '../lib/railwayAPI';
import { CheckCircle, XCircle, Loader, AlertTriangle, ExternalLink } from 'lucide-react';

const RailwayConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [connectionData, setConnectionData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    
    try {
      // Test basic connection
      const connectionResult = await railwayAPI.testConnection();
      setConnectionData(connectionResult);
      
      if (connectionResult.success) {
        // Test dashboard data
        try {
          const overview = await railwayAPI.getDashboardOverview();
          setDashboardData(overview);
          setConnectionStatus('connected');
        } catch (error) {
          setConnectionStatus('partial');
        }
      } else {
        setConnectionStatus('failed');
      }
    } catch (error) {
      setConnectionStatus('failed');
      setConnectionData({ error: error.message });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testing Railway backend connection...';
      case 'connected':
        return 'Successfully connected to Railway backend!';
      case 'partial':
        return 'Basic connection works, but some data endpoints failed';
      case 'failed':
        return 'Failed to connect to Railway backend';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-50 border-green-200';
      case 'partial':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className={`rounded-lg border p-6 ${getStatusColor()}`}>
        <div className="flex items-center space-x-3 mb-4">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold">Railway Backend Connection</h3>
            <p className="text-sm text-gray-600">{getStatusMessage()}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Connection Details */}
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium mb-2">Connection Details</h4>
            <div className="text-sm space-y-1">
              <div><strong>API Gateway:</strong> {railwayAPI.baseURL}</div>
              <div><strong>API Version:</strong> {railwayAPI.apiVersion}</div>
              <div><strong>Auth Token:</strong> {railwayAPI.authToken ? '✓ Configured' : '✗ Missing'}</div>
            </div>
          </div>

          {/* Connection Status */}
          {connectionData && (
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Connection Test Results</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(connectionData, null, 2)}
              </pre>
            </div>
          )}

          {/* Dashboard Data */}
          {dashboardData && (
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Dashboard Data Sample</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(dashboardData, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Again
            </button>
            <a
              href={railwayAPI.baseURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <span>Open API Gateway</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RailwayConnectionTest;
