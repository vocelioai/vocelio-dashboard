// Simple backend connectivity test
const https = require('https');

console.log('=== Testing Railway Backend Connectivity ===\n');

const postData = JSON.stringify({ identity: 'user-123' });

const options = {
  hostname: 'call.vocelio.ai',
  port: 443,
  path: '/api/v1/voice/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const json = JSON.parse(data);
      console.log('Token received:', json.token ? 'YES' : 'NO');
      if (json.token) {
        console.log('Token length:', json.token.length);
        console.log('Token starts with:', json.token.substring(0, 30) + '...');
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request failed:', error.message);
});

req.write(postData);
req.end();
