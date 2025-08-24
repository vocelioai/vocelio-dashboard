import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Square, RotateCcw, FastForward, 
  Activity, Clock, CheckCircle, XCircle, AlertTriangle,
  Settings, Eye, Bug, FileText, Zap, TestTube
} from 'lucide-react';
import FlowExecutionEngine from '../lib/flowExecution';
import FlowTemplateManager from '../lib/flowTemplateManager';

const FlowExecutionPanel = ({ nodes, edges, isOpen, onClose, onExecutionResult }) => {
  const [executionEngine] = useState(() => new FlowExecutionEngine());
  const [templateManager] = useState(() => new FlowTemplateManager());
  const [executionState, setExecutionState] = useState(null);
  const [executionLog, setExecutionLog] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [currentTestCase, setCurrentTestCase] = useState('');
  const [executionSpeed, setExecutionSpeed] = useState(1);
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedTab, setSelectedTab] = useState('execution');
  const [variables, setVariables] = useState({});

  useEffect(() => {
    // Setup execution engine event listeners
    const handleLog = (logEntry) => {
      setExecutionLog(prev => [...prev, logEntry]);
    };

    const handleNodeExecutionStarted = ({ nodeId, node }) => {
      setExecutionState(prev => ({
        ...prev,
        currentNode: node,
        status: 'running'
      }));
    };

    const handleNodeExecutionCompleted = ({ nodeId, node, result }) => {
      // Update variables if the node produced any
      if (result.variable && result.value) {
        setVariables(prev => ({
          ...prev,
          [result.variable]: result.value
        }));
      }
    };

    const handleExecutionCompleted = (result) => {
      setExecutionState(prev => ({
        ...prev,
        status: result.status,
        completed: true
      }));
      
      if (onExecutionResult) {
        onExecutionResult(result);
      }
    };

    executionEngine.on('log', handleLog);
    executionEngine.on('nodeExecutionStarted', handleNodeExecutionStarted);
    executionEngine.on('nodeExecutionCompleted', handleNodeExecutionCompleted);
    executionEngine.on('executionCompleted', handleExecutionCompleted);

    return () => {
      executionEngine.listeners.clear();
    };
  }, [executionEngine, onExecutionResult]);

  // Validate flow on nodes/edges change
  useEffect(() => {
    if (nodes.length > 0) {
      const validation = executionEngine.validateFlow(nodes, edges);
      setValidationResults(validation);
    }
  }, [nodes, edges, executionEngine]);

  const handleExecuteFlow = async () => {
    try {
      setExecutionLog([]);
      setExecutionState({
        status: 'running',
        startTime: new Date(),
        currentNode: null,
        completed: false
      });

      const result = await executionEngine.executeFlow(nodes, edges, variables);
      console.log('Flow execution completed:', result);
      
    } catch (error) {
      console.error('Flow execution failed:', error);
      setExecutionState(prev => ({
        ...prev,
        status: 'error',
        error: error.message,
        completed: true
      }));
    }
  };

  const handlePauseFlow = () => {
    executionEngine.pause();
    setExecutionState(prev => ({ ...prev, status: 'paused' }));
  };

  const handleResumeFlow = () => {
    executionEngine.resume();
    setExecutionState(prev => ({ ...prev, status: 'running' }));
  };

  const handleStopFlow = () => {
    executionEngine.stop();
    setExecutionState(prev => ({ ...prev, status: 'stopped', completed: true }));
  };

  const handleResetFlow = () => {
    setExecutionState(null);
    setExecutionLog([]);
    setVariables({});
  };

  const handleRunTests = async () => {
    const testResults = await executionEngine.testFlow(nodes, edges, testCases);
    console.log('Test results:', testResults);
    setExecutionLog(prev => [
      ...prev,
      {
        level: 'info',
        message: `Test run completed: ${testResults.filter(r => r.passed).length}/${testResults.length} passed`,
        timestamp: new Date().toISOString(),
        data: testResults
      }
    ]);
  };

  const addTestCase = () => {
    if (currentTestCase.trim()) {
      try {
        const testCase = JSON.parse(currentTestCase);
        setTestCases(prev => [...prev, testCase]);
        setCurrentTestCase('');
      } catch (error) {
        alert('Invalid JSON format for test case');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-blue-600';
      case 'paused': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'stopped': return 'text-gray-600';
      default: return 'text-gray-400';
    }
  };

  const getValidationIcon = (type) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <TestTube className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Flow Execution & Testing</h2>
            {executionState && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(executionState.status)} bg-opacity-10`}>
                <Activity className="w-4 h-4" />
                <span className="capitalize">{executionState.status}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'execution', label: 'Execution', icon: Play },
            { id: 'validation', label: 'Validation', icon: CheckCircle },
            { id: 'testing', label: 'Testing', icon: TestTube },
            { id: 'variables', label: 'Variables', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium ${
                selectedTab === id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            
            {/* Execution Tab */}
            {selectedTab === 'execution' && (
              <div className="flex-1 flex flex-col p-4">
                
                {/* Controls */}
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    onClick={handleExecuteFlow}
                    disabled={!validationResults?.isValid || executionState?.status === 'running'}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" />
                    <span>Execute Flow</span>
                  </button>

                  {executionState?.status === 'running' && (
                    <button
                      onClick={handlePauseFlow}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </button>
                  )}

                  {executionState?.status === 'paused' && (
                    <button
                      onClick={handleResumeFlow}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Play className="w-4 h-4" />
                      <span>Resume</span>
                    </button>
                  )}

                  {(executionState?.status === 'running' || executionState?.status === 'paused') && (
                    <button
                      onClick={handleStopFlow}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Square className="w-4 h-4" />
                      <span>Stop</span>
                    </button>
                  )}

                  {executionState && (
                    <button
                      onClick={handleResetFlow}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  )}

                  <div className="flex-1" />

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Speed:</span>
                    <select
                      value={executionSpeed}
                      onChange={(e) => setExecutionSpeed(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1x</option>
                      <option value={2}>2x</option>
                      <option value={5}>5x</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setAutoScroll(!autoScroll)}
                    className={`p-2 rounded-lg ${autoScroll ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Execution Log */}
                <div className="flex-1 bg-gray-900 rounded-lg p-4 text-white font-mono text-sm overflow-auto">
                  <div className="space-y-1">
                    {executionLog.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-gray-400 text-xs">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`text-xs uppercase ${
                          log.level === 'error' ? 'text-red-400' :
                          log.level === 'warning' ? 'text-yellow-400' :
                          log.level === 'success' ? 'text-green-400' :
                          'text-blue-400'
                        }`}>
                          {log.level}
                        </span>
                        <span className="flex-1">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Validation Tab */}
            {selectedTab === 'validation' && (
              <div className="flex-1 p-4 overflow-auto">
                {validationResults ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {validationResults.isValid ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <h3 className="text-lg font-medium">
                        Flow {validationResults.isValid ? 'Valid' : 'Invalid'}
                      </h3>
                    </div>

                    {validationResults.errors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-medium text-red-800 mb-2">Errors</h4>
                        <div className="space-y-2">
                          {validationResults.errors.map((error, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              {getValidationIcon('error')}
                              <span className="text-sm text-red-700">{error.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {validationResults.warnings.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-800 mb-2">Warnings</h4>
                        <div className="space-y-2">
                          {validationResults.warnings.map((warning, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              {getValidationIcon('warning')}
                              <span className="text-sm text-yellow-700">{warning.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {validationResults.errors.length === 0 && validationResults.warnings.length === 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-green-700">No issues found. Flow is ready for execution.</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bug className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No validation results available</p>
                  </div>
                )}
              </div>
            )}

            {/* Testing Tab */}
            {selectedTab === 'testing' && (
              <div className="flex-1 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Test Cases</h3>
                  <button
                    onClick={handleRunTests}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <TestTube className="w-4 h-4" />
                    <span>Run Tests</span>
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Test Case (JSON format)
                  </label>
                  <textarea
                    value={currentTestCase}
                    onChange={(e) => setCurrentTestCase(e.target.value)}
                    placeholder='{"variables": {"input": "test"}, "expectedResult": {"status": "completed"}}'
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none"
                  />
                  <button
                    onClick={addTestCase}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Test Case
                  </button>
                </div>

                <div className="space-y-2">
                  {testCases.map((testCase, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Test Case {index + 1}</span>
                        <button
                          onClick={() => setTestCases(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                        {JSON.stringify(testCase, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variables Tab */}
            {selectedTab === 'variables' && (
              <div className="flex-1 p-4 space-y-4">
                <h3 className="text-lg font-medium">Flow Variables</h3>
                
                <div className="space-y-3">
                  {Object.entries(variables).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <span className="font-mono text-sm text-blue-600">${key}</span>
                      <span className="flex-1 font-mono text-sm">{JSON.stringify(value)}</span>
                      <button
                        onClick={() => setVariables(prev => {
                          const newVars = { ...prev };
                          delete newVars[key];
                          return newVars;
                        })}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Add Variable</h4>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Variable name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const key = e.target.value;
                          const value = e.target.nextSibling.value;
                          if (key && value) {
                            setVariables(prev => ({ ...prev, [key]: value }));
                            e.target.value = '';
                            e.target.nextSibling.value = '';
                          }
                        }
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Variable value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const key = e.target.previousSibling.value;
                          const value = e.target.value;
                          if (key && value) {
                            setVariables(prev => ({ ...prev, [key]: value }));
                            e.target.value = '';
                            e.target.previousSibling.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Press Enter to add variable</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowExecutionPanel;
