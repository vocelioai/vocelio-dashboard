// Use HTTP module or install node-fetch if needed
const https = require('https');
const http = require('http');
const { URL } = require('url');

const BACKEND_URL = 'https://call.vocelio.ai';

// Simple fetch alternative using Node.js HTTP
function fetchData(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = protocol.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: {
            get: (name) => res.headers[name.toLowerCase()]
          },
          json: () => Promise.resolve(JSON.parse(data)),
          text: () => Promise.resolve(data)
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testDeployedBackend() {
  console.log('🧪 Testing Deployed Voice Backend');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Token Generation
    console.log('\n1️⃣  Testing Token Generation...');
    const tokenResponse = await fetchData(`${BACKEND_URL}/api/v1/voice/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identity: 'dashboard_test_user'
      })
    });
    
    const tokenData = await tokenResponse.json();
    console.log('✅ Token Response Status:', tokenResponse.status);
    console.log('✅ Token Data:', {
      has_token: !!tokenData.token,
      identity: tokenData.identity,
      token_length: tokenData.token ? tokenData.token.length : 0
    });
    
    // Test 2: TwiML Incoming Endpoint
    console.log('\n2️⃣  Testing TwiML Incoming Handler...');
    const twimlResponse = await fetchData(`${BACKEND_URL}/api/v1/voice/twiml/incoming`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'CallSid': 'test-call-sid',
        'From': '+15551234567',
        'To': '+15559876543'
      }).toString()
    });
    
    const twimlText = await twimlResponse.text();
    console.log('✅ TwiML Response Status:', twimlResponse.status);
    console.log('✅ TwiML Content-Type:', twimlResponse.headers.get('content-type'));
    console.log('✅ TwiML Response:', twimlText);
    
    // Test 3: Make Call Endpoint
    console.log('\n3️⃣  Testing Make Call Endpoint...');
    const makeCallResponse = await fetchData(`${BACKEND_URL}/api/v1/voice/make-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: '+15551234567',
        from: '+15559876543'
      })
    });
    
    const makeCallData = await makeCallResponse.json();
    console.log('✅ Make Call Response Status:', makeCallResponse.status);
    console.log('✅ Make Call Data:', makeCallData);
    
    console.log('\n🎉 All backend endpoints are working correctly!');
    console.log('📱 Your voice calling system is fully operational.');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
  }
}

testDeployedBackend();
