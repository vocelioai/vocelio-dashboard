import React, { useState, useEffect } from 'react';
import {
  Phone, PhoneCall, Headphones, Smartphone, Monitor,
  Settings, Activity, BarChart3, TestTube, Play,
  Users, Globe, Zap, CheckCircle, AlertTriangle,
  TrendingUp, Clock, Mic, Speaker, RefreshCw
} from 'lucide-react';

// Import enhanced components
import EnhancedTwilioTester from './EnhancedTwilioTester';
import VoiceFlowPreview from './VoiceFlowPreview';
import MobileVoiceBridge from './MobileVoiceBridge';
import enhancedVoiceService from '../services/enhancedVoiceService';

const VoiceIntegrationDashboard = ({ flows = [], mobileFlows = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [voiceServiceStatus, setVoiceServiceStatus] = useState('disconnected');
  const [serviceMetrics, setServiceMetrics] = useState(null);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedMobileFlow, setSelectedMobileFlow] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Initialize voice service and set up monitoring
  useEffect(() => {
    initializeVoiceIntegration();
    
    const metricsInterval = setInterval(updateMetrics, 5000);
    return () => clearInterval(metricsInterval);
  }, []);

  const initializeVoiceIntegration = async () => {
    try {
      setIsInitializing(true);
      
      // Set up event listeners
      enhancedVoiceService.on('ready', () => {
        setVoiceServiceStatus('connected');
        updateMetrics();
      });
      
      enhancedVoiceService.on('error', () => {
        setVoiceServiceStatus('error');
      });
      
      enhancedVoiceService.on('disconnect', () => {
        setVoiceServiceStatus('disconnected');
      });
      
      // Initialize service
      const initialized = await enhancedVoiceService.initialize();
      
      if (initialized) {
        setVoiceServiceStatus('connected');
      } else {
        setVoiceServiceStatus('error');
      }
    } catch (error) {
      console.error('Voice integration initialization error:', error);
      setVoiceServiceStatus('error');
    } finally {
      setIsInitializing(false);
    }
  };

  const updateMetrics = () => {
    const metrics = enhancedVoiceService.getMetrics();
    setServiceMetrics(metrics);
  };

  const handleTestComplete = (results) => {
    setTestResults(results);
  };

  const handleFlowSelect = (flow) => {
    setSelectedFlow(flow);
    setActiveTab('flow-preview');
  };

  const handleMobileFlowSelect = (flow) => {
    setSelectedMobileFlow(flow);
    setActiveTab('mobile-bridge');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'testing', name: 'Integration Testing', icon: TestTube },
    { id: 'flow-preview', name: 'Voice Flow Preview', icon: Play },
    { id: 'mobile-bridge', name: 'Mobile Bridge', icon: Smartphone },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Headphones className="w-8 h-8 text-blue-600" />
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                voiceServiceStatus === 'connected' ? 'bg-green-500' :
                voiceServiceStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Voice Integration Dashboard</h1>
              <p className="text-gray-600">
                Enhanced Twilio integration with flow execution and mobile bridge
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${getStatusColor(voiceServiceStatus)}`}>
              {getStatusIcon(voiceServiceStatus)}
              <span className="font-medium capitalize">
                {isInitializing ? 'Initializing...' : voiceServiceStatus}
              </span>
            </div>
            
            <button
              onClick={initializeVoiceIntegration}
              disabled={isInitializing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Service Metrics Bar */}
        {serviceMetrics && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Calls</span>
              </div>
              <div className="text-xl font-bold text-blue-600">{serviceMetrics.calls.total}</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Success Rate</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                {serviceMetrics.calls.total > 0 
                  ? Math.round((serviceMetrics.calls.successful / serviceMetrics.calls.total) * 100)
                  : 0}%
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Flows Executed</span>
              </div>
              <div className="text-xl font-bold text-purple-600">{serviceMetrics.flows.executed}</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Smartphone className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Mobile Bridges</span>
              </div>
              <div className="text-xl font-bold text-orange-600">{serviceMetrics.mobile.bridged}</div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Voice Flows</p>
                    <p className="text-2xl font-bold text-blue-900">{flows.length}</p>
                  </div>
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-blue-700 mt-2">Ready for voice execution</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Mobile Flows</p>
                    <p className="text-2xl font-bold text-green-900">{mobileFlows.length}</p>
                  </div>
                  <Smartphone className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-green-700 mt-2">Available for voice bridge</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Integration Status</p>
                    <p className="text-lg font-bold text-purple-900 capitalize">{voiceServiceStatus}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-sm text-purple-700 mt-2">Enhanced Twilio integration</p>
              </div>
            </div>

            {/* Available Flows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Voice Flows */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Headphones className="w-5 h-5 text-blue-600" />
                  <span>Voice Flows</span>
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {flows.length > 0 ? flows.map((flow, index) => (
                    <div
                      key={index}
                      onClick={() => handleFlowSelect(flow)}
                      className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{flow.name || `Flow ${index + 1}`}</h4>
                          <p className="text-sm text-gray-600">
                            {flow.nodes?.length || 0} nodes • {flow.edges?.length || 0} connections
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFlowSelect(flow);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                            title="Preview Flow"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Headphones className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No voice flows available</p>
                      <p className="text-sm">Create flows with voice nodes to get started</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Flows */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-green-600" />
                  <span>Mobile Flows</span>
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {mobileFlows.length > 0 ? mobileFlows.map((flow, index) => (
                    <div
                      key={index}
                      onClick={() => handleMobileFlowSelect(flow)}
                      className="p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{flow.name || `Mobile Flow ${index + 1}`}</h4>
                          <p className="text-sm text-gray-600">
                            {flow.nodes?.length || 0} components • Mobile UI
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMobileFlowSelect(flow);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                            title="Bridge to Voice"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Smartphone className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No mobile flows available</p>
                      <p className="text-sm">Import mobile flows to bridge to voice</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Testing Tab */}
        {activeTab === 'testing' && (
          <EnhancedTwilioTester onTestComplete={handleTestComplete} />
        )}

        {/* Voice Flow Preview Tab */}
        {activeTab === 'flow-preview' && (
          <div className="space-y-4">
            {selectedFlow ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Voice Flow Preview</h3>
                  <select
                    value={flows.findIndex(f => f === selectedFlow)}
                    onChange={(e) => setSelectedFlow(flows[parseInt(e.target.value)])}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {flows.map((flow, index) => (
                      <option key={index} value={index}>
                        {flow.name || `Flow ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                <VoiceFlowPreview flow={selectedFlow} isPreviewMode={true} />
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Flow Selected</h3>
                <p>Select a voice flow from the Overview tab to preview it here.</p>
              </div>
            )}
          </div>
        )}

        {/* Mobile Bridge Tab */}
        {activeTab === 'mobile-bridge' && (
          <div className="space-y-4">
            {selectedMobileFlow ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Mobile to Voice Bridge</h3>
                  <select
                    value={mobileFlows.findIndex(f => f === selectedMobileFlow)}
                    onChange={(e) => setSelectedMobileFlow(mobileFlows[parseInt(e.target.value)])}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {mobileFlows.map((flow, index) => (
                      <option key={index} value={index}>
                        {flow.name || `Mobile Flow ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                <MobileVoiceBridge 
                  mobileFlow={selectedMobileFlow} 
                  voiceConfig={{ voice: 'alice', language: 'en-US' }}
                />
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Mobile Flow Selected</h3>
                <p>Select a mobile flow from the Overview tab to bridge it to voice.</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Voice
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="alice">Alice (Female)</option>
                    <option value="bob">Bob (Male)</option>
                    <option value="charlie">Charlie (Male)</option>
                    <option value="diana">Diana (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Mobile Bridge Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Auto-bridge mobile flows</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Enhanced audio quality</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Real-time metrics</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceIntegrationDashboard;
