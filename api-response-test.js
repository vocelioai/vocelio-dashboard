// Detailed API Response Test for Vocelio Dashboard
const https = require('https');
const http = require('http');

// Test specific API endpoints with detailed response inspection
async function testAPIEndpoint(url, headers = {}) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Vocelio-API-Test/1.0',
        'Accept': 'application/json',
        ...headers
      }
    };
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        let parsedData = null;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          // Keep raw data if not JSON
          parsedData = data.substring(0, 500); // Limit output
        }
        
        resolve({
          url: url,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          data: parsedData,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url: url,
        status: 'ERROR',
        statusText: error.message,
        success: false,
        error: error.code || error.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: url,
        status: 'TIMEOUT',
        statusText: 'Request timeout',
        success: false,
        error: 'TIMEOUT'
      });
    });
    
    req.end();
  });
}

async function runDetailedAPITest() {
  console.log('🧪 Running Detailed API Response Tests...\n');
  
  const testEndpoints = [
    'https://api.vocelio.ai/health',
    'https://api.vocelio.ai/api/v1/health',
    'https://api.vocelio.ai/api/v1/status',
    'https://overview.vocelio.ai/health',
    'https://overview.vocelio.ai/api/v1/overview',
    'https://analytics.vocelio.ai/health',
    'https://analytics.vocelio.ai/api/v1/analytics',
    'https://compliance.vocelio.ai/health',
    'https://compliance.vocelio.ai/api/v1/compliance'
  ];
  
  for (const endpoint of testEndpoints) {
    console.log(`\n🔍 Testing: ${endpoint}`);
    console.log('-'.repeat(60));
    
    const result = await testAPIEndpoint(endpoint);
    
    if (result.success) {
      console.log(`✅ Status: ${result.status} ${result.statusText}`);
      console.log(`📊 Response Headers:`, Object.keys(result.headers).slice(0, 5));
      
      if (result.data) {
        console.log(`📦 Response Data:`, 
          typeof result.data === 'object' ? 
            JSON.stringify(result.data, null, 2).substring(0, 300) + '...' :
            result.data.substring(0, 200) + '...'
        );
      }
    } else {
      console.log(`❌ Failed: ${result.status} - ${result.statusText}`);
      if (result.error) {
        console.log(`🚨 Error: ${result.error}`);
      }
    }
  }
  
  console.log('\n🏁 API Response Testing Completed!');
}

// Run the detailed test
runDetailedAPITest().catch(console.error);
