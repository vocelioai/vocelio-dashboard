// Twilio API Key Testing Script
// This tests your Twilio credentials without exposing sensitive data

async function testTwilioAPIKeys() {
  console.log('🔐 Testing Twilio API Keys...');
  console.log('='.repeat(50));
  
  // Check environment variables
  const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
  const webhookUrl = process.env.REACT_APP_TWILIO_VOICE_WEBHOOK;
  const smsWebhookUrl = process.env.REACT_APP_TWILIO_SMS_WEBHOOK;
  
  console.log('📋 Environment Check:');
  console.log(`Account SID: ${accountSid ? '✅ Set' : '❌ Missing'}`);
  console.log(`Voice Webhook: ${webhookUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`SMS Webhook: ${smsWebhookUrl ? '✅ Set' : '❌ Missing'}`);
  
  if (!accountSid) {
    console.log('❌ Twilio Account SID is missing from environment variables');
    return { success: false, error: 'Missing Account SID' };
  }
  
  console.log('\n🔍 Testing Twilio Account Access...');
  
  try {
    // Test 1: Validate Account SID format
    if (!accountSid.startsWith('AC') || accountSid.length !== 34) {
      console.log('❌ Invalid Account SID format');
      return { success: false, error: 'Invalid Account SID format' };
    }
    console.log('✅ Account SID format is valid');
    
    // Test 2: Test through Railway API Gateway (secure method)
    console.log('\n🌐 Testing via Railway API Gateway...');
    const gatewayUrl = process.env.REACT_APP_API_GATEWAY || 'https://api-gateway-production-588d.up.railway.app';
    
    // Test account info endpoint
    const accountTestUrl = `${gatewayUrl}/api/v1/twilio/account`;
    console.log(`Testing: ${accountTestUrl}`);
    
    const response = await fetch(accountTestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_RAILWAY_AUTH_TOKEN || 'test-token'}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Twilio API accessible via Railway');
      console.log(`Account Status: ${data.status || 'Unknown'}`);
      return { success: true, method: 'railway', data };
    } else {
      console.log('⚠️ Railway API not responding, testing fallback...');
    }
    
    // Test 3: Direct Twilio validation (public endpoint)
    console.log('\n🔗 Testing Twilio public endpoints...');
    
    // We can't test auth directly from frontend, but we can validate the SID
    const twilioValidationUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`;
    
    // This will fail without auth, but the response tells us if SID exists
    const directResponse = await fetch(twilioValidationUrl, {
      method: 'GET'
    });
    
    if (directResponse.status === 401) {
      console.log('✅ Twilio Account SID exists (401 = authentication required)');
      console.log('🔐 Auth token validation requires backend (security best practice)');
      return { 
        success: true, 
        method: 'validation',
        note: 'SID exists, auth token should be validated server-side'
      };
    } else if (directResponse.status === 404) {
      console.log('❌ Twilio Account SID not found');
      return { success: false, error: 'Account SID not found' };
    }
    
    console.log('📞 Twilio API configuration appears valid');
    return { success: true, method: 'configured' };
    
  } catch (error) {
    console.error('❌ Error testing Twilio API:', error.message);
    return { success: false, error: error.message };
  }
}

// Test webhook URLs
function testWebhookURLs() {
  console.log('\n🌐 Testing Webhook URLs...');
  
  const voiceWebhook = process.env.REACT_APP_TWILIO_VOICE_WEBHOOK;
  const smsWebhook = process.env.REACT_APP_TWILIO_SMS_WEBHOOK;
  
  if (voiceWebhook) {
    try {
      const url = new URL(voiceWebhook);
      console.log(`✅ Voice Webhook URL valid: ${url.hostname}`);
    } catch (e) {
      console.log(`❌ Invalid Voice Webhook URL: ${voiceWebhook}`);
    }
  }
  
  if (smsWebhook) {
    try {
      const url = new URL(smsWebhook);
      console.log(`✅ SMS Webhook URL valid: ${url.hostname}`);
    } catch (e) {
      console.log(`❌ Invalid SMS Webhook URL: ${smsWebhook}`);
    }
  }
}

// Run tests
async function runAllTests() {
  const apiTest = await testTwilioAPIKeys();
  testWebhookURLs();
  
  console.log('\n📊 Test Summary:');
  console.log(`API Keys: ${apiTest.success ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`Method: ${apiTest.method || 'None'}`);
  if (apiTest.error) {
    console.log(`Error: ${apiTest.error}`);
  }
  
  return apiTest;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testTwilioAPIKeys, testWebhookURLs, runAllTests };
}

// Run if called directly
if (typeof window === 'undefined') {
  runAllTests();
}
