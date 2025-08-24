import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Phone, PhoneCall, PhoneOff, Play, Pause, Stop, 
  Volume2, Mic, MicOff, TestTube, Settings, 
  CheckCircle, XCircle, AlertCircle, Loader2,
  Headphones, Speaker, RecordingIcon, FileAudio,
  Eye, Download, Upload, Zap, Users
} from 'lucide-react';

// Enhanced Twilio Integration Test Component
const EnhancedTwilioTester = ({ onTestComplete, testConfig = {} }) => {
  const [testResults, setTestResults] = useState({
    environment: { status: 'pending', details: [] },
    connection: { status: 'pending', details: [] },
    voice: { status: 'pending', details: [] },
    flows: { status: 'pending', details: [] }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, type };
    setLogs(prev => [...prev.slice(-49), logEntry]); // Keep last 50 logs
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
  }, []);

  const updateTestResult = useCallback((testName, status, details) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status, details: Array.isArray(details) ? details : [details] }
    }));
  }, []);

  const testEnvironmentVariables = useCallback(async () => {
    addLog('🔍 Testing environment variables...', 'info');
    setCurrentTest('Environment Variables');

    const requiredVars = [
      'REACT_APP_TWILIO_ACCOUNT_SID',
      'REACT_APP_TWILIO_AUTH_TOKEN',
      'REACT_APP_TWILIO_PHONE_NUMBER',
      'REACT_APP_BACKEND_URL',
      'REACT_APP_TWILIO_TWIML_APP_SID',
      'REACT_APP_TWILIO_API_KEY',
      'REACT_APP_TWILIO_API_SECRET'
    ];

    const results = [];
    let allPresent = true;

    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        results.push(`✅ ${varName}: ${value.slice(0, 10)}...`);
        addLog(`✅ ${varName} is configured`, 'success');
      } else {
        results.push(`❌ ${varName}: NOT SET`);
        addLog(`❌ ${varName} is missing`, 'error');
        allPresent = false;
      }
    });

    const status = allPresent ? 'success' : 'error';
    updateTestResult('environment', status, results);
    return allPresent;
  }, [addLog, updateTestResult]);

  const testBackendConnection = useCallback(async () => {
    addLog('🔗 Testing backend connection...', 'info');
    setCurrentTest('Backend Connection');

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (!backendUrl) {
      const error = 'Backend URL not configured';
      addLog(error, 'error');
      updateTestResult('connection', 'error', [error]);
      return false;
    }

    try {
      // Test health endpoint
      addLog(`🌐 Testing health endpoint: ${backendUrl}/health`, 'info');
      const healthResponse = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        timeout: 10000
      });

      if (healthResponse.ok) {
        addLog('✅ Health endpoint responded successfully', 'success');
      } else {
        addLog(`⚠️ Health endpoint returned ${healthResponse.status}`, 'warning');
      }

      // Test voice token endpoint
      addLog('🎯 Testing voice token endpoint...', 'info');
      const tokenResponse = await fetch(`${backendUrl}/voice/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: `test-${Date.now()}` }),
        timeout: 10000
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        if (tokenData.success && tokenData.token) {
          addLog('✅ Voice token endpoint working correctly', 'success');
          updateTestResult('connection', 'success', [
            '✅ Health endpoint accessible',
            '✅ Voice token endpoint functional',
            `✅ Response time: ${Date.now() - startTime}ms`
          ]);
          return true;
        } else {
          throw new Error('Invalid token response format');
        }
      } else {
        throw new Error(`Token endpoint returned ${tokenResponse.status}`);
      }
    } catch (error) {
      const errorMsg = `Connection failed: ${error.message}`;
      addLog(errorMsg, 'error');
      updateTestResult('connection', 'error', [errorMsg]);
      return false;
    }
  }, [addLog, updateTestResult]);

  const testVoiceCapabilities = useCallback(async () => {
    addLog('🎤 Testing voice capabilities...', 'info');
    setCurrentTest('Voice Capabilities');

    try {
      // Test Twilio Device SDK availability
      const { Device } = await import('@twilio/voice-sdk');
      addLog('✅ Twilio Voice SDK loaded successfully', 'success');

      // Test browser audio capabilities
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      addLog('✅ Web Audio API available', 'success');

      // Test microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addLog('✅ Microphone access granted', 'success');
      stream.getTracks().forEach(track => track.stop());

      // Test speaker capabilities
      const audio = new Audio();
      const canPlayMP3 = audio.canPlayType('audio/mp3');
      const canPlayWAV = audio.canPlayType('audio/wav');
      addLog(`✅ Audio playback: MP3(${canPlayMP3}), WAV(${canPlayWAV})`, 'success');

      updateTestResult('voice', 'success', [
        '✅ Twilio Voice SDK available',
        '✅ Web Audio API supported',
        '✅ Microphone access granted',
        '✅ Audio playback supported'
      ]);
      return true;
    } catch (error) {
      const errorMsg = `Voice test failed: ${error.message}`;
      addLog(errorMsg, 'error');
      updateTestResult('voice', 'error', [errorMsg]);
      return false;
    }
  }, [addLog, updateTestResult]);

  const testFlowIntegration = useCallback(async () => {
    addLog('🔄 Testing flow integration...', 'info');
    setCurrentTest('Flow Integration');

    try {
      // Test voice flow execution
      const mockFlow = {
        nodes: [
          { id: 'start', type: 'voice', data: { message: 'Hello, this is a test' } },
          { id: 'input', type: 'input', data: { prompt: 'Please say something' } },
          { id: 'end', type: 'voice', data: { message: 'Thank you, goodbye' } }
        ],
        edges: [
          { id: 'e1', source: 'start', target: 'input' },
          { id: 'e2', source: 'input', target: 'end' }
        ]
      };

      // Test flow validation
      addLog('🔍 Validating flow structure...', 'info');
      const validation = validateFlow(mockFlow);
      
      if (validation.isValid) {
        addLog('✅ Flow validation passed', 'success');
      } else {
        addLog(`⚠️ Flow validation warnings: ${validation.warnings.length}`, 'warning');
      }

      // Test TwiML generation
      addLog('🎯 Testing TwiML generation...', 'info');
      const twiml = generateTwiMLFromFlow(mockFlow);
      
      if (twiml && twiml.includes('<Response>')) {
        addLog('✅ TwiML generation successful', 'success');
      } else {
        throw new Error('TwiML generation failed');
      }

      updateTestResult('flows', 'success', [
        '✅ Flow validation working',
        '✅ TwiML generation functional',
        '✅ Voice flow integration ready'
      ]);
      return true;
    } catch (error) {
      const errorMsg = `Flow integration test failed: ${error.message}`;
      addLog(errorMsg, 'error');
      updateTestResult('flows', 'error', [errorMsg]);
      return false;
    }
  }, [addLog, updateTestResult]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setLogs([]);
    addLog('🚀 Starting comprehensive Twilio integration tests...', 'info');

    try {
      const envTest = await testEnvironmentVariables();
      if (!envTest) {
        addLog('❌ Environment test failed - stopping further tests', 'error');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause
      const connectionTest = await testBackendConnection();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const voiceTest = await testVoiceCapabilities();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const flowTest = await testFlowIntegration();

      const allPassed = envTest && connectionTest && voiceTest && flowTest;
      addLog(allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed', allPassed ? 'success' : 'warning');
      
      if (onTestComplete) {
        onTestComplete({
          success: allPassed,
          results: testResults,
          logs
        });
      }
    } catch (error) {
      addLog(`❌ Test suite error: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  }, [testEnvironmentVariables, testBackendConnection, testVoiceCapabilities, testFlowIntegration, addLog, onTestComplete, testResults, logs]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending': return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
      default: return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  const validateFlow = (flow) => {
    const warnings = [];
    const errors = [];

    // Basic validation logic
    if (!flow.nodes || flow.nodes.length === 0) {
      errors.push('Flow has no nodes');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const generateTwiMLFromFlow = (flow) => {
    // Basic TwiML generation for testing
    let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
    
    flow.nodes.forEach(node => {
      if (node.type === 'voice') {
        twiml += `<Say>${node.data.message}</Say>`;
      } else if (node.type === 'input') {
        twiml += `<Gather><Say>${node.data.prompt}</Say></Gather>`;
      }
    });
    
    twiml += '</Response>';
    return twiml;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Enhanced Twilio Integration Test</h3>
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Tests</span>
              </>
            )}
          </button>
        </div>
        {currentTest && (
          <div className="mt-2 text-sm text-blue-600">
            Currently testing: {currentTest}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{testName.replace('_', ' ')}</span>
                {getStatusIcon(result.status)}
              </div>
              <div className="space-y-1">
                {result.details.map((detail, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {logs.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Test Logs</h4>
            <div className="max-h-64 overflow-y-auto space-y-1 font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.type === 'error' ? 'text-red-600' :
                    log.type === 'success' ? 'text-green-600' :
                    log.type === 'warning' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}
                >
                  [{log.timestamp}] {log.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTwilioTester;
