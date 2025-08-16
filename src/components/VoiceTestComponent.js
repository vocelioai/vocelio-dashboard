import React, { useEffect, useState } from 'react';
import { Device } from '@twilio/voice-sdk';

const VoiceTestComponent = () => {
  const [status, setStatus] = useState('Initializing...');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const testVoiceInitialization = async () => {
      try {
        addLog('🚀 Starting voice initialization test...');
        
        // Test 1: Check if Twilio SDK imported correctly
        addLog('📦 Checking Twilio SDK import...');
        if (typeof Device === 'undefined') {
          throw new Error('Twilio Device class not found');
        }
        addLog('✅ Twilio SDK imported successfully');

        // Test 2: Get token from backend
        addLog('🔄 Getting token from backend...');
        const response = await fetch('https://call.vocelio.ai/api/v1/voice/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identity: 'test-user-' + Date.now() })
        });

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        if (!data.success || !data.token) {
          throw new Error('Invalid token response');
        }
        addLog('✅ Token received from backend');

        // Test 3: Create Device
        addLog('🎯 Creating Twilio Device...');
        const device = new Device(data.token, {
          logLevel: 'debug',
          codecPreferences: ['opus', 'pcmu']
        });
        addLog('✅ Device created successfully');

        // Test 4: Set up basic event listeners
        addLog('📝 Setting up event listeners...');
        device.on('ready', () => {
          addLog('🎉 Device is READY!');
          setStatus('✅ Voice service ready');
        });

        device.on('error', (error) => {
          addLog(`❌ Device error: ${error.message}`);
          setStatus(`❌ Error: ${error.message}`);
        });

        device.on('offline', () => {
          addLog('📴 Device went offline');
        });

        // Test 5: Register device
        addLog('📞 Registering device...');
        await device.register();
        addLog('✅ Device registered successfully');
        addLog(`📱 Device state after registration: ${device.state}`);

        setStatus('⏳ Waiting for device to be ready...');

        // Test 6: Wait for ready state with fallback
        const waitForReady = () => {
          return new Promise((resolve) => {
            const checkState = () => {
              addLog(`🔍 Checking device state: ${device.state}`);
              if (device.state === 'ready') {
                addLog('🎉 Device is READY!');
                setStatus('✅ Voice service ready');
                resolve();
              } else if (device.state === 'registered') {
                setTimeout(() => {
                  if (device.state === 'registered') {
                    addLog('✅ Device is registered and stable');
                    setStatus('✅ Voice service ready (registered)');
                    resolve();
                  }
                }, 3000);
              }
            };

            // Check immediately
            checkState();
            
            // Set up interval to keep checking
            const interval = setInterval(checkState, 1000);
            
            setTimeout(() => {
              clearInterval(interval);
              if (device.state !== 'ready') {
                addLog(`⚠️ Device state after 10s: ${device.state}`);
                setStatus(`⚠️ Device state: ${device.state}`);
              }
            }, 10000);
          });
        };

        await waitForReady();

      } catch (error) {
        addLog(`❌ Test failed: ${error.message}`);
        setStatus(`❌ Failed: ${error.message}`);
      }
    };

    testVoiceInitialization();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      width: '400px', 
      background: 'white', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h3>Voice Service Test</h3>
      <p><strong>Status:</strong> {status}</p>
      <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default VoiceTestComponent;
