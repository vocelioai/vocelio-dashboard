import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Activity, Clock, Zap, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { railwayFlowAPI } from '../lib/railwayFlowAPI';

const ExecutionMonitor = ({ flowDefinition, onExecutionStart, onExecutionEnd }) => {
  const [executions, setExecutions] = useState([]);
  const [currentExecution, setCurrentExecution] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(false);

  // WebSocket event handlers
  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      console.log('✅ Railway Flow API connected');
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      console.log('❌ Railway Flow API disconnected');
    };

    const handleStatusUpdate = (data) => {
      if (data.execution_id === currentExecution?.execution_id) {
        setCurrentExecution(prev => ({
          ...prev,
          status: data.status,
          current_node_id: data.current_node_id,
          variables: data.variables
        }));
      }
    };

    const handleTrace = (data) => {
      if (data.execution_id === currentExecution?.execution_id) {
        setTraces(prev => [...prev, data.trace]);
      }
    };

    // Register event listeners
    railwayFlowAPI.on('connected', handleConnected);
    railwayFlowAPI.on('disconnected', handleDisconnected);
    railwayFlowAPI.on('status_update', handleStatusUpdate);
    railwayFlowAPI.on('trace', handleTrace);

    return () => {
      railwayFlowAPI.off('connected', handleConnected);
      railwayFlowAPI.off('disconnected', handleDisconnected);
      railwayFlowAPI.off('status_update', handleStatusUpdate);
      railwayFlowAPI.off('trace', handleTrace);
    };
  }, [currentExecution]);

  // Start flow execution
  const startExecution = useCallback(async () => {
    if (!flowDefinition) return;

    setLoading(true);
    try {
      const result = await railwayFlowAPI.startExecution(flowDefinition, {
        user_id: 'demo_user',
        timestamp: new Date().toISOString()
      });

      const executionDetails = await railwayFlowAPI.getExecution(result.execution_id);
      setCurrentExecution(executionDetails);
      setTraces([]);

      setExecutions(prev => [executionDetails, ...prev.slice(0, 4)]);
      
      if (onExecutionStart) {
        onExecutionStart(executionDetails);
      }
    } catch (error) {
      console.error('Failed to start execution:', error);
      alert('Failed to start execution: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [flowDefinition, onExecutionStart]);

  // Pause execution
  const pauseExecution = useCallback(async () => {
    if (!currentExecution) return;

    try {
      await railwayFlowAPI.pauseExecution(currentExecution.execution_id);
    } catch (error) {
      console.error('Failed to pause execution:', error);
    }
  }, [currentExecution]);

  // Resume execution
  const resumeExecution = useCallback(async () => {
    if (!currentExecution) return;

    try {
      await railwayFlowAPI.resumeExecution(currentExecution.execution_id);
    } catch (error) {
      console.error('Failed to resume execution:', error);
    }
  }, [currentExecution]);

  // Test connection
  const testConnection = useCallback(async () => {
    try {
      const result = await railwayFlowAPI.testConnection();
      if (result.success) {
        alert('✅ Railway backend connection successful!');
      } else {
        alert('❌ Connection failed: ' + result.error);
      }
    } catch (error) {
      alert('❌ Connection test failed: ' + error.message);
    }
  }, []);

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Format duration
  const formatDuration = (start, end) => {
    if (!start) return '';
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const duration = Math.round((endTime - startTime) / 1000);
    return `${duration}s`;
  };

  return (
    <div className="space-y-4">
      {/* Connection Status & Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Railway Flow Runtime</h3>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <button
            onClick={testConnection}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            Test Connection
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={startExecution}
            disabled={loading || !flowDefinition}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{loading ? 'Starting...' : 'Start Flow'}</span>
          </button>

          {currentExecution && currentExecution.status === 'running' && (
            <button
              onClick={pauseExecution}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}

          {currentExecution && currentExecution.status === 'paused' && (
            <button
              onClick={resumeExecution}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Resume</span>
            </button>
          )}
        </div>
      </div>

      {/* Current Execution Details */}
      {currentExecution && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Current Execution</h4>
            <div className="flex items-center space-x-2">
              {getStatusIcon(currentExecution.status)}
              <span className="text-sm font-medium capitalize">{currentExecution.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">ID:</span>
              <span className="ml-2 font-mono">{currentExecution.execution_id?.slice(-8)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Current Node:</span>
              <span className="ml-2">{currentExecution.current_node_id || 'None'}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Started:</span>
              <span className="ml-2">{new Date(currentExecution.created_at).toLocaleTimeString()}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Duration:</span>
              <span className="ml-2">{formatDuration(currentExecution.created_at, currentExecution.updated_at)}</span>
            </div>
          </div>

          {/* Variables */}
          {currentExecution.variables && Object.keys(currentExecution.variables).length > 0 && (
            <div className="mt-4">
              <h5 className="font-medium text-sm mb-2">Variables:</h5>
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 text-xs font-mono max-h-32 overflow-y-auto">
                {JSON.stringify(currentExecution.variables, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Execution Traces */}
      {traces.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-3">Execution Trace</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {traces.map((trace, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 text-sm p-2 bg-gray-50 dark:bg-gray-900 rounded"
              >
                <div className="text-gray-500 font-mono text-xs whitespace-nowrap">
                  {new Date(trace.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{trace.node_type}</span>
                    <span className="text-gray-600 dark:text-gray-400">•</span>
                    <span className="text-blue-600 dark:text-blue-400">{trace.action}</span>
                    {trace.duration_ms && (
                      <>
                        <span className="text-gray-600 dark:text-gray-400">•</span>
                        <span className="text-gray-500">{trace.duration_ms}ms</span>
                      </>
                    )}
                  </div>
                  {trace.error && (
                    <div className="text-red-600 dark:text-red-400 text-xs mt-1">
                      {trace.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Executions */}
      {executions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-3">Recent Executions</h4>
          <div className="space-y-2">
            {executions.slice(0, 5).map((execution) => (
              <div
                key={execution.execution_id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm"
              >
                <div className="flex items-center space-x-2">
                  {getStatusIcon(execution.status)}
                  <span className="font-mono">{execution.execution_id.slice(-8)}</span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{new Date(execution.created_at).toLocaleTimeString()}</span>
                  <span>{formatDuration(execution.created_at, execution.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionMonitor;
