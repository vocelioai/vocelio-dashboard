// Test Twilio API Integration specifically
const https = require('https');

async function testTwilioEndpoints() {
  console.log('📞 Testing Twilio API Integration...\n');
  
  // Test main API gateway for Twilio endpoints
  const twilioEndpoints = [
    'https://api.vocelio.ai/api/v1/twilio/health',
    'https://api.vocelio.ai/twilio/health',
    'https://api.vocelio.ai/api/twilio/phone-numbers',
    'https://api.vocelio.ai/twilio/phone-numbers'
  ];
  
  for (const endpoint of twilioEndpoints) {
    console.log(`🔍 Testing: ${endpoint}`);
    
    try {
      const result = await testEndpoint(endpoint);
      
      if (result.success) {
        console.log(`✅ ${result.status} - ${result.statusText}`);
      } else {
        console.log(`❌ ${result.status} - ${result.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

function testEndpoint(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 5000,
      headers: {
        'User-Agent': 'Vocelio-Twilio-Test/1.0',
        'Accept': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          success: res.statusCode >= 200 && res.statusCode < 400,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        status: 'ERROR',
        statusText: error.message,
        success: false,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        statusText: 'Request timeout',
        success: false
      });
    });
    
    req.end();
  });
}

testTwilioEndpoints();
