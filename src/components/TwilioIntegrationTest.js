import React, { useState, useEffect } from 'react';
import twilioAPI from '../lib/twilioAPI.js';

const TwilioIntegrationTest = () => {
  const [testResults, setTestResults] = useState({
    configuration: null,
    connection: null,
    availableNumbers: null,
    ownedNumbers: null,
    loading: true
  });

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setTestResults(prev => ({ ...prev, loading: true }));
    
    try {
      // Test 1: Configuration
      const config = twilioAPI.getConfigurationStatus();
      console.log('Config Status:', config);
      
      // Test 2: Connection
      const connection = await twilioAPI.testConnection();
      console.log('Connection Test:', connection);
      
      // Test 3: Search Numbers
      const numbers = await twilioAPI.searchAvailableNumbers('US', { 
        type: 'Local', 
        limit: 5 
      });
      console.log('Available Numbers:', numbers);
      
      // Test 4: Owned Numbers  
      const owned = await twilioAPI.getOwnedNumbers();
      console.log('Owned Numbers:', owned);
      
      setTestResults({
        configuration: config,
        connection: connection,
        availableNumbers: numbers,
        ownedNumbers: owned,
        loading: false
      });
      
    } catch (error) {
      console.error('Test Error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message 
      }));
    }
  };

  const { configuration, connection, availableNumbers, ownedNumbers, loading, error } = testResults;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">🧪 Twilio Integration Test</h2>
          <p>Running tests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-800">❌ Test Failed</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={runTests}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">🧪 Twilio Integration Test Results</h2>
        
        <button 
          onClick={runTests}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Re-run Tests
        </button>

        {/* Configuration Test */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">1️⃣ Configuration</h3>
          <div className="space-y-2">
            <p><strong>Mode:</strong> <span className={configuration?.mode === 'real' ? 'text-green-600' : 'text-orange-600'}>{configuration?.mode}</span></p>
            <p><strong>Has Credentials:</strong> <span className={configuration?.hasCredentials ? 'text-green-600' : 'text-red-600'}>{configuration?.hasCredentials ? '✅ Yes' : '❌ No'}</span></p>
            <p><strong>Account SID:</strong> {configuration?.accountSid}</p>
            {configuration?.isConfigured && (
              <p className="text-green-600">✅ Fully configured for real Twilio operations</p>
            )}
          </div>
        </div>

        {/* Connection Test */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">2️⃣ Connection Test</h3>
          <div className="space-y-2">
            <p><strong>Success:</strong> <span className={connection?.success ? 'text-green-600' : 'text-red-600'}>{connection?.success ? '✅ Connected' : '❌ Failed'}</span></p>
            <p><strong>Mode:</strong> <span className={connection?.mode === 'real' ? 'text-green-600' : 'text-orange-600'}>{connection?.mode}</span></p>
            <p><strong>Real Data:</strong> <span className={connection?.isReal ? 'text-green-600' : 'text-orange-600'}>{connection?.isReal ? '✅ Yes' : '⚠️ Using mock data'}</span></p>
            <p><strong>Message:</strong> {connection?.message}</p>
          </div>
        </div>

        {/* Available Numbers */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">3️⃣ Available Numbers Search</h3>
          {availableNumbers?.available_phone_numbers ? (
            <div>
              <p className="mb-3"><strong>Found {availableNumbers.available_phone_numbers.length} numbers:</strong></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableNumbers.available_phone_numbers.slice(0, 6).map((number, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                    <p><strong>{number.phone_number}</strong></p>
                    <p>{number.locality}, {number.region}</p>
                    <p className="text-green-600">${number.price}/month</p>
                  </div>
                ))}
              </div>
              <p className="mt-3">
                <strong>Data Type:</strong> 
                <span className={!availableNumbers.mock ? 'text-green-600' : 'text-orange-600'}>
                  {!availableNumbers.mock ? ' ✅ Real Twilio Data' : ' ⚠️ Mock Data'}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-red-600">❌ No numbers found</p>
          )}
        </div>

        {/* Owned Numbers */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">4️⃣ Owned Numbers</h3>
          {ownedNumbers?.incoming_phone_numbers?.length > 0 ? (
            <div>
              <p className="mb-3"><strong>You own {ownedNumbers.incoming_phone_numbers.length} numbers:</strong></p>
              <div className="space-y-2">
                {ownedNumbers.incoming_phone_numbers.map((number, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded">
                    <p><strong>{number.phone_number}</strong> - {number.friendly_name}</p>
                    <p>Status: <span className={number.status === 'active' ? 'text-green-600' : 'text-orange-600'}>{number.status}</span></p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No owned numbers found</p>
          )}
        </div>

        {/* Summary */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📋 Summary</h3>
          {configuration?.isConfigured ? (
            <div className="space-y-1">
              <p className="text-green-600">✅ Twilio credentials configured and working</p>
              <p className="text-green-600">✅ Ready for real phone number operations</p>
              <p className="text-blue-600">💡 You can now search and purchase real numbers</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-orange-600">⚠️ Using demo mode with mock data</p>
              <p className="text-blue-600">💡 Configure Twilio credentials for live operations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwilioIntegrationTest;
