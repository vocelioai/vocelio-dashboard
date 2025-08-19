// Test script to verify Twilio and Railway backend integration
import TwilioVoiceService from './src/services/TwilioVoiceService.js';
import CallCenterApiService from './src/services/CallCenterApiService.js';

async function testIntegration() {
  console.log('🧪 Testing Vocelio CallCenter Integration...\n');

  // Test 1: Environment Variables
  console.log('1️⃣ Testing Environment Variables:');
  console.log('✅ Twilio Account SID:', process.env.REACT_APP_TWILIO_ACCOUNT_SID ? '✓ Present' : '❌ Missing');
  console.log('✅ Twilio Auth Token:', process.env.REACT_APP_TWILIO_AUTH_TOKEN ? '✓ Present' : '❌ Missing');
  console.log('✅ Twilio Phone Number:', process.env.REACT_APP_TWILIO_PHONE_NUMBER || '❌ Missing');
  console.log('✅ API Gateway:', process.env.REACT_APP_API_GATEWAY || '❌ Missing');
  console.log('✅ Call Center API:', process.env.REACT_APP_CALL_CENTER_API || '❌ Missing');

  // Test 2: Backend API Health Check
  console.log('\n2️⃣ Testing Backend API Connection:');
  try {
    const apiService = new CallCenterApiService();
    const healthResponse = await apiService.apiRequest('/api/v1/system/health');
    
    if (healthResponse.success) {
      console.log('✅ Backend API: Connected and responding');
      console.log('📊 Health Status:', healthResponse.data.status || 'healthy');
    } else {
      console.log('⚠️  Backend API: Using mock data (API not available)');
    }
  } catch (error) {
    console.log('❌ Backend API Error:', error.message);
  }

  // Test 3: Twilio Service Initialization
  console.log('\n3️⃣ Testing Twilio Voice Service:');
  try {
    const twilioService = new TwilioVoiceService();
    console.log('✅ Twilio Service: Created successfully');
    console.log('🔧 Configuration Check:');
    console.log('  - Account SID: ' + (twilioService.config.accountSid ? '✓' : '❌'));
    console.log('  - Auth Token: ' + (twilioService.config.authToken ? '✓' : '❌'));
    console.log('  - Phone Number: ' + (twilioService.config.phoneNumber || '❌ Not configured'));
    console.log('  - API URL: ' + twilioService.config.apiUrl);
  } catch (error) {
    console.log('❌ Twilio Service Error:', error.message);
  }

  // Test 4: Analytics Endpoints
  console.log('\n4️⃣ Testing Analytics Endpoints:');
  try {
    const apiService = new CallCenterApiService();
    const analyticsResponse = await apiService.apiRequest('/api/v1/analytics');
    
    if (analyticsResponse.success) {
      console.log('✅ Analytics API: Connected');
      console.log('📈 Sample Data:', JSON.stringify(analyticsResponse.data, null, 2));
    } else {
      console.log('⚠️  Analytics API: Using mock data');
    }
  } catch (error) {
    console.log('❌ Analytics API Error:', error.message);
  }

  console.log('\n🎯 Integration Test Complete!');
  console.log('💡 If you see mock data, the system will work in development mode.');
  console.log('🚀 For production calls, ensure all Twilio credentials are correct.');
}

// Export for manual testing
export { testIntegration };

console.log('📞 CallCenter Integration Test Ready');
console.log('To run: import { testIntegration } from "./test-integration.js"; testIntegration();');
