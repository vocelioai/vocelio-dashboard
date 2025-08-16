// React Environment Test for Vocelio Dashboard
const fs = require('fs');
const path = require('path');

console.log('🔬 REACT ENVIRONMENT TEST');
console.log('='.repeat(50));

// Check if we're in a React project
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('✅ React project detected');
  console.log(`📦 Project: ${packageJson.name}`);
  console.log(`🏷️  Version: ${packageJson.version}`);
  
  // Check React dependencies
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const reactVersion = deps.react;
  const reactDomVersion = deps['react-dom'];
  const reactScriptsVersion = deps['react-scripts'];
  
  console.log(`⚛️  React: ${reactVersion || 'Not found'}`);
  console.log(`🌐 React DOM: ${reactDomVersion || 'Not found'}`);
  console.log(`🔧 React Scripts: ${reactScriptsVersion || 'Not found'}`);
} else {
  console.log('❌ package.json not found - not a React project');
  process.exit(1);
}

console.log('\n🧪 TESTING ENVIRONMENT VARIABLE ACCESS');
console.log('-'.repeat(30));

// Simulate React environment variable loading
const envFiles = ['.env', '.env.local', '.env.production'];
let envVars = {};

envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        if (key && key.startsWith('REACT_APP_')) {
          envVars[key.trim()] = value;
        }
      }
    });
  }
});

// Test critical environment variables
const criticalVars = [
  'REACT_APP_API_URL',
  'REACT_APP_TWILIO_ACCOUNT_SID',
  'REACT_APP_TWILIO_AUTH_TOKEN'
];

console.log('🔑 Critical Environment Variables:');
criticalVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    const displayValue = varName.includes('TOKEN') ? 
      `${value.substring(0, 10)}...` : value;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
  }
});

console.log('\n🔗 API ENDPOINT CONNECTIVITY TEST');
console.log('-'.repeat(35));

// Test API endpoints
async function testApiEndpoint(name, url) {
  const https = require('https');
  const http = require('http');
  
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request({
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: '/health',
        method: 'GET',
        timeout: 5000
      }, (res) => {
        console.log(`  ✅ ${name}: ${res.statusCode} ${res.statusMessage}`);
        resolve(true);
      });
      
      req.on('error', (err) => {
        console.log(`  ❌ ${name}: ${err.message}`);
        resolve(false);
      });
      
      req.on('timeout', () => {
        console.log(`  ⏰ ${name}: Timeout`);
        resolve(false);
      });
      
      req.end();
    } catch (error) {
      console.log(`  ❌ ${name}: Invalid URL`);
      resolve(false);
    }
  });
}

// Test main API endpoints
async function runApiTests() {
  const endpoints = [
    ['Main API', envVars.REACT_APP_API_URL || 'https://api.vocelio.ai'],
    ['API Gateway', envVars.REACT_APP_API_GATEWAY || 'https://api.vocelio.ai'],
    ['Overview API', envVars.REACT_APP_OVERVIEW_API || 'https://overview.vocelio.ai']
  ];
  
  console.log('🌐 Testing API Endpoints:');
  
  for (const [name, url] of endpoints) {
    if (url) {
      await testApiEndpoint(name, url);
    } else {
      console.log(`  ❌ ${name}: URL not configured`);
    }
  }
}

console.log('\n📱 COMPONENT FILE CHECKS');
console.log('-'.repeat(25));

// Check critical component files
const componentFiles = [
  ['TwilioAPI', 'src/lib/twilioAPI.js'],
  ['Config', 'src/lib/config.js'],
  ['PhoneNumbers', 'src/pages/PhoneNumbers.js'],
  ['App Component', 'src/App.js'],
  ['Main Index', 'src/index.js']
];

componentFiles.forEach(([name, filePath]) => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`  ✅ ${name}: Found (${sizeKB}KB)`);
  } else {
    console.log(`  ❌ ${name}: Missing (${filePath})`);
  }
});

console.log('\n🎯 CONFIGURATION SUMMARY');
console.log('-'.repeat(25));

const totalVars = criticalVars.length;
const configuredVars = criticalVars.filter(v => envVars[v]).length;
const configScore = Math.round((configuredVars / totalVars) * 100);

console.log(`📊 Environment Variables: ${configuredVars}/${totalVars} (${configScore}%)`);
console.log(`🗂️  Total REACT_APP_ vars: ${Object.keys(envVars).length}`);

if (configScore === 100) {
  console.log('🎉 Perfect! All critical environment variables are configured');
} else if (configScore >= 75) {
  console.log('⚡ Good configuration, minor variables missing');
} else {
  console.log('⚠️  Configuration incomplete - check missing variables');
}

// Run API tests
runApiTests().then(() => {
  console.log('\n✅ React environment test completed!');
  console.log('\n💡 Next Steps:');
  console.log('1. Start development server: npm start');
  console.log('2. Open browser and check console for errors');
  console.log('3. Test Twilio phone number functionality');
  console.log('4. Verify API calls are working properly');
});
