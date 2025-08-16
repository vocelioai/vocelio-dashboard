// Frontend Configuration Checker for Vocelio Dashboard
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function colorLog(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

class ConfigChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.recommendations = [];
  }

  checkEnvironmentVariables() {
    colorLog('blue', '\n🔍 CHECKING ENVIRONMENT VARIABLES');
    console.log('='.repeat(50));

    const envFiles = ['.env', '.env.local', '.env.production'];
    const requiredEnvVars = [
      'REACT_APP_API_URL',
      'REACT_APP_API_GATEWAY',
      'REACT_APP_AUTH_TOKEN',
      'REACT_APP_TWILIO_ACCOUNT_SID',
      'REACT_APP_TWILIO_AUTH_TOKEN',
      'REACT_APP_SUPABASE_URL',
      'REACT_APP_SUPABASE_ANON_KEY'
    ];

    let envContent = {};
    
    envFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        colorLog('green', `✅ Found ${file}`);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach(line => {
          if (line.includes('=') && !line.startsWith('#')) {
            const [key, value] = line.split('=');
            if (key && value) {
              envContent[key.trim()] = value.trim();
            }
          }
        });
      } else {
        colorLog('yellow', `⚠️  ${file} not found`);
      }
    });

    // Check required environment variables
    colorLog('cyan', '\n📋 Required Environment Variables:');
    requiredEnvVars.forEach(varName => {
      if (envContent[varName]) {
        const value = envContent[varName];
        const displayValue = varName.includes('TOKEN') || varName.includes('KEY') ? 
          `${value.substring(0, 10)}...` : value;
        colorLog('green', `  ✅ ${varName}: ${displayValue}`);
      } else {
        colorLog('red', `  ❌ ${varName}: MISSING`);
        this.issues.push(`Missing required environment variable: ${varName}`);
      }
    });

    // Check API URLs consistency
    colorLog('cyan', '\n🔗 API URL Configuration:');
    const apiUrls = Object.keys(envContent).filter(key => key.includes('API')).slice(0, 10);
    apiUrls.forEach(key => {
      const url = envContent[key];
      if (url && url.startsWith('https://')) {
        colorLog('green', `  ✅ ${key}: ${url}`);
      } else if (url) {
        colorLog('yellow', `  ⚠️  ${key}: ${url} (not HTTPS)`);
        this.warnings.push(`${key} is not using HTTPS`);
      }
    });

    return envContent;
  }

  checkTwilioConfiguration(envVars) {
    colorLog('blue', '\n📞 CHECKING TWILIO CONFIGURATION');
    console.log('='.repeat(50));

    const twilioVars = {
      accountSid: envVars['REACT_APP_TWILIO_ACCOUNT_SID'],
      authToken: envVars['REACT_APP_TWILIO_AUTH_TOKEN'],
      phoneNumber: envVars['REACT_APP_TWILIO_PHONE_NUMBER'],
      voiceWebhook: envVars['REACT_APP_TWILIO_VOICE_WEBHOOK'],
      smsWebhook: envVars['REACT_APP_TWILIO_SMS_WEBHOOK']
    };

    // Validate Twilio Account SID format
    if (twilioVars.accountSid) {
      if (twilioVars.accountSid.startsWith('AC') && twilioVars.accountSid.length === 34) {
        colorLog('green', `✅ Account SID format: Valid (${twilioVars.accountSid.substring(0, 10)}...)`);
      } else {
        colorLog('red', `❌ Account SID format: Invalid`);
        this.issues.push('Twilio Account SID format is invalid');
      }
    }

    // Validate Auth Token format
    if (twilioVars.authToken) {
      if (twilioVars.authToken.length === 32) {
        colorLog('green', `✅ Auth Token format: Valid (${twilioVars.authToken.substring(0, 10)}...)`);
      } else {
        colorLog('red', `❌ Auth Token format: Invalid length (${twilioVars.authToken.length})`);
        this.issues.push('Twilio Auth Token format is invalid');
      }
    }

    // Validate phone number format
    if (twilioVars.phoneNumber) {
      if (twilioVars.phoneNumber.startsWith('+') && twilioVars.phoneNumber.length >= 10) {
        colorLog('green', `✅ Phone Number: ${twilioVars.phoneNumber}`);
      } else {
        colorLog('red', `❌ Phone Number format: Invalid`);
        this.issues.push('Twilio phone number format is invalid');
      }
    }

    // Check webhook URLs
    ['voiceWebhook', 'smsWebhook'].forEach(key => {
      const webhook = twilioVars[key];
      if (webhook) {
        if (webhook.startsWith('https://') && webhook.includes('/api/v1/twilio/')) {
          colorLog('green', `✅ ${key}: ${webhook}`);
        } else {
          colorLog('yellow', `⚠️  ${key}: ${webhook} (check endpoint)`);
          this.warnings.push(`${key} may not be properly configured`);
        }
      }
    });
  }

  checkApiConfiguration() {
    colorLog('blue', '\n🌐 CHECKING API CONFIGURATION');
    console.log('='.repeat(50));

    const configPath = path.join(process.cwd(), 'src', 'lib', 'config.js');
    
    if (!fs.existsSync(configPath)) {
      colorLog('red', '❌ config.js not found in src/lib/');
      this.issues.push('Missing API configuration file');
      return;
    }

    colorLog('green', '✅ Found API configuration file');
    
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check for required exports
    if (configContent.includes('export const API_CONFIG')) {
      colorLog('green', '✅ API_CONFIG export found');
    } else {
      colorLog('red', '❌ API_CONFIG export not found');
      this.issues.push('API_CONFIG export missing in config.js');
    }

    if (configContent.includes('export const API_SETTINGS')) {
      colorLog('green', '✅ API_SETTINGS export found');
    } else {
      colorLog('yellow', '⚠️  API_SETTINGS export not found');
      this.warnings.push('API_SETTINGS export missing in config.js');
    }

    // Check service configurations
    const services = [
      'OVERVIEW', 'ANALYTICS', 'TEAM_HUB', 'AI_AGENTS', 
      'CALL_CENTER', 'PHONE_NUMBERS', 'API_GATEWAY'
    ];

    colorLog('cyan', '\n📋 Service Configurations:');
    services.forEach(service => {
      if (configContent.includes(service)) {
        colorLog('green', `  ✅ ${service}: Configured`);
      } else {
        colorLog('red', `  ❌ ${service}: Missing`);
        this.issues.push(`Service ${service} not configured in API_CONFIG`);
      }
    });
  }

  checkTwilioApiFile() {
    colorLog('blue', '\n🔧 CHECKING TWILIOAPI.JS');
    console.log('='.repeat(50));

    const twilioApiPath = path.join(process.cwd(), 'src', 'lib', 'twilioAPI.js');
    
    if (!fs.existsSync(twilioApiPath)) {
      colorLog('red', '❌ twilioAPI.js not found in src/lib/');
      this.issues.push('Missing twilioAPI.js file');
      return;
    }

    colorLog('green', '✅ Found twilioAPI.js file');
    
    const twilioContent = fs.readFileSync(twilioApiPath, 'utf8');
    
    // Check for required methods
    const requiredMethods = [
      'request', 'getOwnedNumbers', 'searchNumbers', 
      'purchaseNumber', 'deleteNumber', 'testConnection',
      'formatPhoneNumber'
    ];

    colorLog('cyan', '\n🔍 Required Methods:');
    requiredMethods.forEach(method => {
      if (twilioContent.includes(method)) {
        colorLog('green', `  ✅ ${method}(): Found`);
      } else {
        colorLog('red', `  ❌ ${method}(): Missing`);
        this.issues.push(`Method ${method}() missing in twilioAPI.js`);
      }
    });

    // Check for proper error handling
    if (twilioContent.includes('try') && twilioContent.includes('catch')) {
      colorLog('green', '✅ Error handling: Present');
    } else {
      colorLog('yellow', '⚠️  Error handling: Limited');
      this.warnings.push('Limited error handling in twilioAPI.js');
    }

    // Check for environment variable usage
    if (twilioContent.includes('process.env.REACT_APP_TWILIO')) {
      colorLog('green', '✅ Environment variables: Used properly');
    } else {
      colorLog('red', '❌ Environment variables: Not properly accessed');
      this.issues.push('Environment variables not properly accessed in twilioAPI.js');
    }
  }

  checkPhoneNumbersComponent() {
    colorLog('blue', '\n📱 CHECKING PHONENUMBERS COMPONENT');
    console.log('='.repeat(50));

    const phoneNumbersPath = path.join(process.cwd(), 'src', 'pages', 'PhoneNumbers.js');
    
    if (!fs.existsSync(phoneNumbersPath)) {
      colorLog('red', '❌ PhoneNumbers.js not found in src/pages/');
      this.issues.push('Missing PhoneNumbers.js component');
      return;
    }

    colorLog('green', '✅ Found PhoneNumbers.js component');
    
    const phoneContent = fs.readFileSync(phoneNumbersPath, 'utf8');
    
    // Check imports
    const requiredImports = [
      'twilioAPI', 'useState', 'useEffect', 'TwilioDebugger'
    ];

    colorLog('cyan', '\n📦 Required Imports:');
    requiredImports.forEach(importName => {
      if (phoneContent.includes(importName)) {
        colorLog('green', `  ✅ ${importName}: Imported`);
      } else {
        colorLog('red', `  ❌ ${importName}: Missing`);
        this.issues.push(`Import ${importName} missing in PhoneNumbers.js`);
      }
    });

    // Check component structure
    if (phoneContent.includes('const TwilioNumberPurchase')) {
      colorLog('green', '✅ Main component: TwilioNumberPurchase found');
    } else {
      colorLog('red', '❌ Main component: Not found');
      this.issues.push('Main component TwilioNumberPurchase not found');
    }

    // Check state management
    const stateVariables = [
      'activeTab', 'selectedCountry', 'selectedType', 'availableNumbers',
      'myNumbers', 'isLoading', 'twilioStatus'
    ];

    colorLog('cyan', '\n🔄 State Management:');
    let stateCount = 0;
    stateVariables.forEach(state => {
      if (phoneContent.includes(state)) {
        colorLog('green', `  ✅ ${state}: Used`);
        stateCount++;
      }
    });

    if (stateCount >= 5) {
      colorLog('green', '✅ State management: Comprehensive');
    } else {
      colorLog('yellow', '⚠️  State management: Basic');
      this.warnings.push('Limited state management in PhoneNumbers component');
    }
  }

  generateReport() {
    colorLog('blue', '\n📊 CONFIGURATION ANALYSIS REPORT');
    console.log('='.repeat(60));

    const totalIssues = this.issues.length;
    const totalWarnings = this.warnings.length;
    
    if (totalIssues === 0 && totalWarnings === 0) {
      colorLog('green', '\n🎉 EXCELLENT! Your frontend configuration looks perfect!');
      colorLog('green', '✅ All components and configurations are properly set up');
    } else {
      // Summary
      colorLog('cyan', `\n📈 SUMMARY:`);
      console.log(`   🔴 Critical Issues: ${totalIssues}`);
      console.log(`   🟡 Warnings: ${totalWarnings}`);
      
      // Critical Issues
      if (this.issues.length > 0) {
        colorLog('red', '\n🔴 CRITICAL ISSUES TO FIX:');
        this.issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue}`);
        });
      }

      // Warnings
      if (this.warnings.length > 0) {
        colorLog('yellow', '\n🟡 WARNINGS & RECOMMENDATIONS:');
        this.warnings.forEach((warning, index) => {
          console.log(`   ${index + 1}. ${warning}`);
        });
      }

      // Configuration Health Score
      const totalChecks = 25; // Approximate number of checks
      const healthScore = Math.max(0, Math.round(((totalChecks - totalIssues - (totalWarnings * 0.5)) / totalChecks) * 100));
      
      colorLog('cyan', `\n🏥 CONFIGURATION HEALTH SCORE: ${healthScore}%`);
      
      if (healthScore >= 90) {
        colorLog('green', '🌟 Excellent configuration!');
      } else if (healthScore >= 75) {
        colorLog('yellow', '⚡ Good configuration with minor issues');
      } else if (healthScore >= 50) {
        colorLog('yellow', '⚠️  Configuration needs attention');
      } else {
        colorLog('red', '🚨 Configuration requires immediate fixes');
      }
    }

    // Recommendations
    colorLog('blue', '\n💡 NEXT STEPS:');
    if (totalIssues > 0) {
      console.log('1. Fix all critical issues listed above');
      console.log('2. Test Twilio API connection after fixes');
      console.log('3. Verify environment variables are loaded correctly');
    }
    console.log('4. Run the application and check browser console for errors');
    console.log('5. Test phone number search and purchase functionality');
    
    console.log('\n' + '='.repeat(60));
    colorLog('green', '✅ Frontend configuration check completed!');
  }

  runFullCheck() {
    colorLog('bold', '🚀 VOCELIO DASHBOARD - FRONTEND CONFIGURATION CHECKER');
    colorLog('bold', '📅 Date: ' + new Date().toLocaleString());
    
    const envVars = this.checkEnvironmentVariables();
    this.checkTwilioConfiguration(envVars);
    this.checkApiConfiguration();
    this.checkTwilioApiFile();
    this.checkPhoneNumbersComponent();
    this.generateReport();
  }
}

// Run the configuration check
const checker = new ConfigChecker();
checker.runFullCheck();
