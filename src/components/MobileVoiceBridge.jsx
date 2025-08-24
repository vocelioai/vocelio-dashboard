import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Phone, PhoneCall, PhoneOff, Smartphone, Headphones,
  Play, Pause, Settings, Users, Globe, Zap, CheckCircle,
  XCircle, AlertTriangle, Monitor, Wifi, Signal, Battery,
  Mic, Speaker, MessageSquare, ArrowRight, RefreshCw, Download
} from 'lucide-react';

// Mobile Voice Bridge - Connects mobile flows to voice services
const MobileVoiceBridge = ({ 
  mobileFlow, 
  voiceConfig = {}, 
  onConnectionStatusChange,
  onCallInitiated,
  onFlowComplete 
}) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [bridgeState, setBridgeState] = useState('idle');
  const [activeCall, setActiveCall] = useState(null);
  const [mobileDevices, setMobileDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [voiceQuality, setVoiceQuality] = useState(null);
  const [networkStatus, setNetworkStatus] = useState({ strength: 0, type: 'unknown' });
  const [callMetrics, setCallMetrics] = useState({
    duration: 0,
    latency: 0,
    packetLoss: 0,
    jitter: 0
  });
  const [logs, setLogs] = useState([]);

  const deviceRef = useRef(null);
  const metricsIntervalRef = useRef(null);
  const callStartTimeRef = useRef(null);

  const addLog = useCallback((message, type = 'info') => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date(),
      message,
      type
    };
    setLogs(prev => [...prev.slice(-49), logEntry]);
    console.log(`[MobileVoiceBridge] ${type.toUpperCase()}: ${message}`);
  }, []);

  // Initialize mobile device detection and bridge setup
  useEffect(() => {
    initializeMobileBridge();
    detectMobileDevices();
    
    return () => {
      cleanup();
    };
  }, []);

  // Monitor network status for mobile connection quality
  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        setNetworkStatus({
          strength: getSignalStrength(connection.effectiveType),
          type: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      }
    };

    updateNetworkStatus();
    const interval = setInterval(updateNetworkStatus, 5000);
    
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      clearInterval(interval);
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  const initializeMobileBridge = async () => {
    try {
      addLog('🚀 Initializing mobile-to-voice bridge...', 'info');
      setBridgeState('initializing');

      // Check if we're running on mobile device
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        addLog('📱 Mobile device detected', 'success');
      } else {
        addLog('🖥️ Desktop device detected - mobile simulation mode', 'info');
      }

      // Initialize Twilio Voice SDK for mobile
      const { Device } = await import('@twilio/voice-sdk');
      
      // Get mobile-optimized access token
      const tokenResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/voice/mobile-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          deviceType: 'mobile',
          capabilities: ['voice', 'incoming', 'outgoing']
        })
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token request failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      
      // Create device with mobile-optimized settings
      deviceRef.current = new Device(tokenData.token, {
        logLevel: 'error', // Reduced logging for mobile performance
        codecPreferences: ['opus', 'pcmu'], // Prefer opus for better mobile quality
        enableRingingState: true,
        enableImprovedSignalingErrorPrecision: true,
        maxAverageBitrate: 16000, // Optimize for mobile bandwidth
        maxCallSignalingTimeoutMs: 30000
      });

      setupDeviceEventHandlers();
      
      addLog('✅ Mobile bridge initialized successfully', 'success');
      setBridgeState('ready');
      setConnectionStatus('connected');
      
      if (onConnectionStatusChange) {
        onConnectionStatusChange({ status: 'connected', bridge: 'mobile' });
      }
    } catch (error) {
      addLog(`❌ Bridge initialization failed: ${error.message}`, 'error');
      setBridgeState('error');
      setConnectionStatus('error');
    }
  };

  const setupDeviceEventHandlers = () => {
    if (!deviceRef.current) return;

    deviceRef.current.on('ready', () => {
      addLog('📞 Voice device ready for mobile calls', 'success');
      setBridgeState('ready');
    });

    deviceRef.current.on('error', (error) => {
      addLog(`❌ Device error: ${error.message}`, 'error');
      setBridgeState('error');
    });

    deviceRef.current.on('incoming', (call) => {
      addLog('📞 Incoming call received on mobile bridge', 'info');
      setActiveCall({
        direction: 'incoming',
        from: call.parameters.From,
        to: call.parameters.To,
        call: call
      });
    });

    deviceRef.current.on('connect', (call) => {
      addLog('✅ Call connected through mobile bridge', 'success');
      callStartTimeRef.current = Date.now();
      startMetricsMonitoring(call);
      
      // Execute mobile flow through voice
      if (mobileFlow) {
        executeMobileFlowViaVoice(call);
      }
    });

    deviceRef.current.on('disconnect', () => {
      addLog('📴 Call disconnected', 'info');
      stopMetricsMonitoring();
      setActiveCall(null);
      
      if (onFlowComplete) {
        onFlowComplete({
          duration: callMetrics.duration,
          status: 'completed',
          metrics: callMetrics
        });
      }
    });
  };

  const detectMobileDevices = () => {
    const devices = [];
    
    // Simulate mobile device detection
    const userAgent = navigator.userAgent;
    
    if (/iPhone/.test(userAgent)) {
      devices.push({ id: 'iphone', name: 'iPhone', type: 'iOS', connected: true });
    } else if (/Android/.test(userAgent)) {
      devices.push({ id: 'android', name: 'Android Device', type: 'Android', connected: true });
    } else {
      // Desktop simulation
      devices.push(
        { id: 'sim-iphone', name: 'iPhone (Simulated)', type: 'iOS', connected: false },
        { id: 'sim-android', name: 'Android (Simulated)', type: 'Android', connected: false }
      );
    }
    
    setMobileDevices(devices);
    setSelectedDevice(devices.find(d => d.connected) || devices[0]);
    addLog(`📱 Detected ${devices.length} mobile device(s)`, 'info');
  };

  const executeMobileFlowViaVoice = async (call) => {
    if (!mobileFlow?.nodes?.length) {
      addLog('⚠️ No mobile flow configured for voice execution', 'warning');
      return;
    }

    addLog('🔄 Converting mobile flow to voice execution...', 'info');
    
    try {
      for (const node of mobileFlow.nodes) {
        await executeMobileNodeViaVoice(node, call);
        
        // Add delay between nodes for natural conversation flow
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      addLog('✅ Mobile flow execution via voice completed', 'success');
    } catch (error) {
      addLog(`❌ Mobile flow execution error: ${error.message}`, 'error');
    }
  };

  const executeMobileNodeViaVoice = async (node, call) => {
    addLog(`▶️ Executing mobile node via voice: ${node.type}`, 'info');
    
    switch (node.type) {
      case 'text':
        // Convert text display to voice message
        const twiml = `<Response><Say voice="${voiceConfig.voice || 'alice'}" language="${voiceConfig.language || 'en-US'}">${node.data?.text || 'Mobile text message'}</Say></Response>`;
        await sendTwiMLToCall(call, twiml);
        break;
        
      case 'button':
        // Convert button options to voice menu
        const options = node.data?.options || [];
        let menuTwiml = `<Response><Gather numDigits="1" timeout="10"><Say>Please select from the following options: `;
        
        options.forEach((option, index) => {
          menuTwiml += `Press ${index + 1} for ${option.text}. `;
        });
        
        menuTwiml += `</Say></Gather></Response>`;
        await sendTwiMLToCall(call, menuTwiml);
        break;
        
      case 'input':
        // Convert input field to voice input gathering
        const inputTwiml = `<Response><Gather input="speech" timeout="10" speechTimeout="auto"><Say>${node.data?.placeholder || 'Please provide your input'}</Say></Gather></Response>`;
        await sendTwiMLToCall(call, inputTwiml);
        break;
        
      case 'image':
        // Convert image to descriptive voice message
        const imageTwiml = `<Response><Say>Image content: ${node.data?.alt || node.data?.description || 'An image is displayed in the mobile app'}</Say></Response>`;
        await sendTwiMLToCall(call, imageTwiml);
        break;
        
      case 'list':
        // Convert list to voice enumeration
        const listItems = node.data?.items || [];
        let listTwiml = `<Response><Say>Here are the list items: `;
        
        listItems.forEach((item, index) => {
          listTwiml += `Item ${index + 1}: ${item.text || item}. `;
        });
        
        listTwiml += `</Say></Response>`;
        await sendTwiMLToCall(call, listTwiml);
        break;
        
      default:
        addLog(`⚠️ Unknown mobile node type for voice conversion: ${node.type}`, 'warning');
        const defaultTwiml = `<Response><Say>Mobile interaction: ${node.type}</Say></Response>`;
        await sendTwiMLToCall(call, defaultTwiml);
    }
  };

  const sendTwiMLToCall = async (call, twiml) => {
    try {
      // Send TwiML to modify the active call
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/voice/update-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callSid: call.parameters.CallSid,
          twiml: twiml
        })
      });
      
      if (!response.ok) {
        throw new Error(`TwiML update failed: ${response.status}`);
      }
      
      addLog('📨 TwiML sent to active call', 'success');
    } catch (error) {
      addLog(`❌ Failed to send TwiML: ${error.message}`, 'error');
    }
  };

  const startMobileCall = async (phoneNumber) => {
    if (!deviceRef.current || !phoneNumber) return;
    
    try {
      addLog(`📞 Initiating mobile call to ${phoneNumber}...`, 'info');
      setBridgeState('calling');
      
      const call = await deviceRef.current.connect({
        params: {
          To: phoneNumber,
          From: process.env.REACT_APP_TWILIO_PHONE_NUMBER,
          MobileFlow: mobileFlow ? JSON.stringify(mobileFlow) : undefined
        }
      });
      
      setActiveCall({
        direction: 'outgoing',
        to: phoneNumber,
        call: call
      });
      
      if (onCallInitiated) {
        onCallInitiated({ phoneNumber, call, bridge: 'mobile' });
      }
      
      addLog('📞 Mobile call initiated successfully', 'success');
    } catch (error) {
      addLog(`❌ Failed to start mobile call: ${error.message}`, 'error');
      setBridgeState('ready');
    }
  };

  const endCall = () => {
    if (activeCall?.call) {
      activeCall.call.disconnect();
      addLog('📴 Call ended by user', 'info');
    }
  };

  const startMetricsMonitoring = (call) => {
    metricsIntervalRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
        
        // Get call quality metrics if available
        const stats = call.getStats();
        
        setCallMetrics({
          duration,
          latency: stats?.rtt || 0,
          packetLoss: stats?.packetsLost || 0,
          jitter: stats?.jitter || 0
        });
      }
    }, 1000);
  };

  const stopMetricsMonitoring = () => {
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
  };

  const getSignalStrength = (effectiveType) => {
    switch (effectiveType) {
      case 'slow-2g': return 1;
      case '2g': return 2;
      case '3g': return 3;
      case '4g': return 4;
      case '5g': return 5;
      default: return 0;
    }
  };

  const cleanup = () => {
    stopMetricsMonitoring();
    if (deviceRef.current) {
      deviceRef.current.destroy();
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Smartphone className="w-6 h-6 text-blue-600" />
              <Phone className="w-3 h-3 text-blue-600 absolute -top-1 -right-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Mobile Voice Bridge</h3>
              <p className="text-sm text-gray-600">
                Connect mobile flows to voice services
              </p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 ${getConnectionStatusColor()}`}>
            {getConnectionStatusIcon()}
            <span className="text-sm font-medium capitalize">{connectionStatus}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Control Panel */}
          <div className="space-y-4">
            
            {/* Device Selection */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Mobile Device</span>
              </h4>
              
              {selectedDevice && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${selectedDevice.connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <div className="font-medium">{selectedDevice.name}</div>
                        <div className="text-sm text-gray-600">{selectedDevice.type}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedDevice.connected ? 'Connected' : 'Simulated'}
                    </div>
                  </div>
                  
                  {/* Network Status */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <Signal className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">Signal</div>
                      <div className="font-medium">{networkStatus.strength}/5</div>
                    </div>
                    <div className="text-center">
                      <Wifi className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">Network</div>
                      <div className="font-medium">{networkStatus.type}</div>
                    </div>
                    <div className="text-center">
                      <Battery className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">Quality</div>
                      <div className="font-medium">
                        {voiceQuality ? `${voiceQuality}/5` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Call Controls */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <PhoneCall className="w-4 h-4" />
                <span>Call Control</span>
              </h4>
              
              {!activeCall ? (
                <div className="space-y-3">
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        startMobileCall(e.target.value);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[type="tel"]');
                      if (input?.value) {
                        startMobileCall(input.value);
                      }
                    }}
                    disabled={bridgeState !== 'ready'}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Start Mobile Call</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {activeCall.direction === 'outgoing' ? 'Calling' : 'Incoming'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {activeCall.to || activeCall.from}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDuration(callMetrics.duration)}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={endCall}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Flow Preview */}
            {mobileFlow && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Monitor className="w-4 h-4" />
                  <span>Mobile Flow</span>
                </h4>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 mb-2">
                    Flow will be converted to voice interactions
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(mobileFlow.nodes || []).slice(0, 3).map((node, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                          {index + 1}
                        </div>
                        <span className="capitalize">{node.type}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">Voice</span>
                      </div>
                    ))}
                    {(mobileFlow.nodes || []).length > 3 && (
                      <div className="text-xs text-gray-500 ml-8">
                        ... and {mobileFlow.nodes.length - 3} more nodes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Monitoring Panel */}
          <div className="space-y-4">
            
            {/* Call Metrics */}
            {activeCall && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Headphones className="w-4 h-4" />
                  <span>Call Quality</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Duration</div>
                    <div className="font-medium">{formatDuration(callMetrics.duration)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Latency</div>
                    <div className="font-medium">{callMetrics.latency}ms</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Packet Loss</div>
                    <div className="font-medium">{callMetrics.packetLoss}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Jitter</div>
                    <div className="font-medium">{callMetrics.jitter}ms</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bridge Logs */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Bridge Logs</h4>
                <button
                  onClick={() => setLogs([])}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-1 text-sm font-mono">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className={`flex items-start space-x-2 ${
                      log.type === 'error' ? 'text-red-600' :
                      log.type === 'success' ? 'text-green-600' :
                      log.type === 'warning' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}
                  >
                    <span className="text-xs text-gray-400 mt-0.5">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                ))}
                
                {logs.length === 0 && (
                  <div className="text-gray-500 text-center py-4">
                    No activity yet. Bridge logs will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};

export default MobileVoiceBridge;
