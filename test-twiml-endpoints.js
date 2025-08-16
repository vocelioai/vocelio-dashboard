// Test TwiML endpoints with realistic call parameters
const https = require('https');

const testTwiMLEndpoint = (url, body) => {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams(body).toString();
    
    const options = {
      hostname: 'call.vocelio.ai',
      path: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

async function testTwiMLEndpoints() {
  console.log('🧪 Testing TwiML Endpoints with Real Call Parameters');
  console.log('=' .repeat(60));

  // Test the exact endpoint that should match your Twilio Voice URL
  const testCases = [
    {
      name: 'TwiML Incoming Handler',
      url: '/api/v1/voice/twiml/incoming',
      body: {
        'AccountSid': 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'ApiVersion': '2010-04-01',
        'CallSid': 'CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'CallStatus': 'ringing',
        'Called': '+13073017993',
        'CalledCity': 'CASPER',
        'CalledCountry': 'US',
        'CalledState': 'WY',
        'CalledZip': '82601',
        'Caller': '+15551234567',
        'CallerCity': 'NEW YORK',
        'CallerCountry': 'US',
        'CallerState': 'NY',
        'CallerZip': '10001',
        'Direction': 'inbound',
        'From': '+15551234567',
        'FromCity': 'NEW YORK',
        'FromCountry': 'US',
        'FromState': 'NY',
        'FromZip': '10001',
        'To': '+13073017993',
        'ToCity': 'CASPER',
        'ToCountry': 'US',
        'ToState': 'WY',
        'ToZip': '82601'
      }
    },
    {
      name: 'Outbound Call TwiML',
      url: '/api/v1/twilio/voice',
      body: {
        'AccountSid': 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'ApiVersion': '2010-04-01',
        'CallSid': 'CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'CallStatus': 'in-progress',
        'Called': '+15551234567',
        'Caller': '+13073017993',
        'Direction': 'outbound-api',
        'From': '+13073017993',
        'To': '+15551234567'
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 Testing: ${testCase.name}`);
      console.log(`📍 URL: ${testCase.url}`);
      
      const result = await testTwiMLEndpoint(testCase.url, testCase.body);
      
      console.log(`✅ Status: ${result.status}`);
      console.log(`📋 Content-Type: ${result.headers['content-type']}`);
      console.log(`📄 Response: ${result.body.substring(0, 200)}${result.body.length > 200 ? '...' : ''}`);
      
      // Check if it's valid TwiML
      if (result.body.includes('<?xml') && result.body.includes('<Response>')) {
        console.log('✅ Valid TwiML Response');
      } else {
        console.log('❌ Invalid TwiML - may cause application error');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('- If both endpoints return valid TwiML, the issue is elsewhere');
  console.log('- If an endpoint returns 404/500, that\'s your "application error" source');
  console.log('- The client identity must match between token and TwiML dial');
}

testTwiMLEndpoints();
