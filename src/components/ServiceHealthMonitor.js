import React, { useState, useEffect } from 'react';
import { 
  Shield, Server, Zap, Activity, AlertCircle, CheckCircle, Clock,
  Wifi, WifiOff, Loader, RefreshCw, BarChart3, TrendingUp
} from 'lucide-react';
import { checkAllServicesHealth } from '../lib/apiClient';

const ServiceHealthMonitor = () => {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const health = await checkAllServicesHealth();
      setHealthData(health);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(checkHealth, 60000); // Check every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'unhealthy': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getOverallHealthColor = (percentage) => {
    if (percentage >= 0.8) return 'text-green-600';
    if (percentage >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Service Health Monitor</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time status of all 25 Railway services
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </button>
          
          <button
            onClick={checkHealth}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overall Health Stats */}
      {healthData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Server className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{healthData.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Services</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{healthData.healthy}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Healthy</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{healthData.unhealthy}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unhealthy</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className={`w-6 h-6 ${getOverallHealthColor(healthData.overallHealth)}`} />
              <div>
                <p className={`text-2xl font-bold ${getOverallHealthColor(healthData.overallHealth)}`}>
                  {(healthData.overallHealth * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Health</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Status Grid */}
      {healthData && (
        <div>
          <h4 className="font-semibold mb-4 flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Service Status</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {healthData.services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {service.status === 'healthy' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : service.status === 'unhealthy' ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm font-medium">{service.service}</span>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {!healthData && isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600 dark:text-gray-400">Checking service health...</p>
          </div>
        </div>
      )}

      {/* Last Update */}
      {lastUpdate && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceHealthMonitor;
