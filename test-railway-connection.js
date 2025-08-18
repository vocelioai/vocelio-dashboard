// Test Railway API Connection
require('dotenv').config();

const RAILWAY_ENDPOINTS = {
  CALL_CENTER: process.env.REACT_APP_CALL_CENTER_API || 'https://call.vocelio.ai',
  VOICE_SERVICE: process.env.REACT_APP_VOICE_SERVICE_API || 'https://voice.vocelio.ai',
  API_GATEWAY: process.env.REACT_APP_API_GATEWAY || 'https://api.vocelio.ai'
};

async function testRailwayConnection() {
  console.log('🚀 Testing Railway API Connection...');
  console.log('Railway Endpoints:');
  console.log('- Call Center:', RAILWAY_ENDPOINTS.CALL_CENTER);
  console.log('- Voice Service:', RAILWAY_ENDPOINTS.VOICE_SERVICE);
  console.log('- API Gateway:', RAILWAY_ENDPOINTS.API_GATEWAY);
  console.log('');
  console.log('Testing endpoints:');
  console.log('');

  // Test Call Center API Health
  console.log('1. Call Center Health Check:');
  try {
    const response = await fetch(`${RAILWAY_ENDPOINTS.CALL_CENTER}/`);
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Call Center health check passed:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Call Center health check failed:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Call Center connection failed:', error.message);
  }

  console.log('');

  // Test Voice Service Health  
  console.log('2. Voice Service Health Check:');
  try {
    const response = await fetch(`${RAILWAY_ENDPOINTS.VOICE_SERVICE}/`);
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Voice Service health check passed:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Voice Service health check failed:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Voice Service connection failed:', error.message);
  }

  console.log('');

  // Test API Gateway Health
  console.log('3. API Gateway Health Check:');
  try {
    const response = await fetch(`${RAILWAY_ENDPOINTS.API_GATEWAY}/`);
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Gateway health check passed:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ API Gateway health check failed:', response.statusText);
    }
  } catch (error) {
    console.log('❌ API Gateway connection failed:', error.message);
  }

  console.log('');

  // Test Voice Token Generation
  console.log('4. Voice Token Generation Test:');
  try {
    const response = await fetch(`${RAILWAY_ENDPOINTS.CALL_CENTER}/api/v1/voice/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identity: 'test_user' })
    });
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Voice token generation passed:', data.success ? 'Token generated successfully' : 'Token generation failed');
    } else {
      const errorText = await response.text();
      console.log('❌ Voice token generation failed:', response.statusText, errorText);
    }
  } catch (error) {
    console.log('❌ Voice token generation failed:', error.message);
  }

  console.log('');
  console.log('🏁 Railway Connection Test Complete');
}

testRailwayConnection();
