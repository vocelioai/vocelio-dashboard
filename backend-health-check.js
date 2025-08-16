// Backend Health Check for Vocelio Dashboard
const https = require('https');
const http = require('http');

// Environment variables from your .env file
const API_CONFIG = {
  MAIN_API: 'https://api.vocelio.ai',
  OVERVIEW: 'https://overview.vocelio.ai',
  ANALYTICS: 'https://analytics.vocelio.ai',
  TEAM_HUB: 'https://team.vocelio.ai',
  SSO_IDENTITY: 'https://identity.vocelio.ai',
  API_MANAGEMENT: 'https://apimanagement.vocelio.ai',
  ENTERPRISE_SECURITY: 'https://security.vocelio.ai',
  AUDIT_COMPLIANCE: 'https://compliance.vocelio.ai',
  AI_AGENTS: 'https://ai-agents-service.vocelio.ai',
  AI_BRAIN: 'https://ai-brain.vocelio.ai',
  VOICE_LAB: 'https://voice-lab.vocelio.ai',
  SMART_CAMPAIGNS: 'https://smart-campaigns.vocelio.ai',
  CALL_CENTER: 'https://call-center.vocelio.ai',
  PHONE_NUMBERS: 'https://phone-numbers.vocelio.ai',
  NOTIFICATIONS: 'https://notifications.vocelio.ai'
};

// Test endpoints for each service
const TEST_ENDPOINTS = [
  '/health',
  '/api/health',
  '/api/v1/health',
  '/ping',
  '/status',
  '/'
];

async function testEndpoint(baseUrl, endpoint, timeout = 5000) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${endpoint}`;
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const startTime = Date.now();
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: timeout,
      headers: {
        'User-Agent': 'Vocelio-Health-Check/1.0'
      }
    };
    
    const req = client.request(options, (res) => {
      const responseTime = Date.now() - startTime;
      
      // Consume response data to free up memory
      res.on('data', () => {});
      res.on('end', () => {
        resolve({
          url: url,
          status: res.statusCode,
          statusText: res.statusMessage || 'OK',
          responseTime: `${responseTime}ms`,
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
        statusText: `Request timeout after ${timeout}ms`,
        success: false,
        error: 'TIMEOUT'
      });
    });
    
    req.end();
  });
}

async function checkServiceHealth(serviceName, baseUrl) {
  console.log(`\n🔍 Testing ${serviceName} (${baseUrl}):`);
  
  const results = [];
  for (const endpoint of TEST_ENDPOINTS) {
    const result = await testEndpoint(baseUrl, endpoint);
    results.push(result);
    
    const statusEmoji = result.success ? '✅' : '❌';
    console.log(`  ${statusEmoji} ${endpoint}: ${result.status} - ${result.statusText}`);
    
    // If we find a working endpoint, we can skip the others for this service
    if (result.success) break;
  }
  
  return results;
}

async function runHealthCheck() {
  console.log('🚀 Starting Vocelio Backend Health Check...\n');
  
  const healthReport = {};
  
  for (const [serviceName, baseUrl] of Object.entries(API_CONFIG)) {
    try {
      const serviceResults = await checkServiceHealth(serviceName, baseUrl);
      healthReport[serviceName] = {
        baseUrl,
        results: serviceResults,
        isHealthy: serviceResults.some(r => r.success)
      };
    } catch (error) {
      console.error(`❌ Failed to test ${serviceName}:`, error.message);
      healthReport[serviceName] = {
        baseUrl,
        results: [],
        isHealthy: false,
        error: error.message
      };
    }
  }
  
  // Summary Report
  console.log('\n📊 HEALTH CHECK SUMMARY:');
  console.log('=' .repeat(50));
  
  let healthyServices = 0;
  let totalServices = Object.keys(healthReport).length;
  
  for (const [serviceName, report] of Object.entries(healthReport)) {
    const statusEmoji = report.isHealthy ? '✅' : '❌';
    console.log(`${statusEmoji} ${serviceName.padEnd(20)} - ${report.baseUrl}`);
    
    if (report.isHealthy) healthyServices++;
  }
  
  console.log('=' .repeat(50));
  console.log(`📈 Services Online: ${healthyServices}/${totalServices} (${Math.round(healthyServices/totalServices*100)}%)`);
  
  if (healthyServices === 0) {
    console.log('\n⚠️  WARNING: No backend services are responding!');
    console.log('This could indicate:');
    console.log('- Services are down for maintenance');
    console.log('- Network connectivity issues');
    console.log('- Incorrect URLs in environment variables');
    console.log('- CORS or authentication restrictions');
  }
  
  return healthReport;
}

// Run the health check
if (require.main === module) {
  runHealthCheck()
    .then(report => {
      console.log('\n✅ Health check completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Health check failed:', error);
      process.exit(1);
    });
}

module.exports = { runHealthCheck, testEndpoint, checkServiceHealth };
