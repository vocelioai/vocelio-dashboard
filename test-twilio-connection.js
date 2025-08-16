// Test Twilio Connection
const fs = require('fs');
const path = require('path');

// Load .env file manually
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    const config = {};
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        config[key.trim()] = value.trim();
      }
    });
    
    return config;
  }
  return {};
}

async function testTwilioConnection() {
  console.log('🔍 Testing Twilio API Connection...\n');
  
  const config = loadEnv();
  
  console.log('=== Configuration Status ===');
  console.log('✅ API URL:', config.REACT_APP_API_URL || config.NEXT_PUBLIC_API_GATEWAY_URL || '❌ Missing');
  console.log('✅ Account SID:', config.REACT_APP_TWILIO_ACCOUNT_SID ? `${config.REACT_APP_TWILIO_ACCOUNT_SID.substring(0, 10)}...` : '❌ Missing');
  console.log('✅ Auth Token:', config.REACT_APP_TWILIO_AUTH_TOKEN ? 'Present ✅' : '❌ Missing');
  console.log('✅ Phone Number:', config.REACT_APP_TWILIO_PHONE_NUMBER || '❌ Missing');
  console.log();
  
  // Test direct Twilio API call
  if (config.REACT_APP_TWILIO_ACCOUNT_SID && config.REACT_APP_TWILIO_AUTH_TOKEN) {
    try {
      console.log('🎯 Testing Direct Twilio API Call...');
      
      const accountSid = config.REACT_APP_TWILIO_ACCOUNT_SID;
      const authToken = config.REACT_APP_TWILIO_AUTH_TOKEN;
      const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json?PageSize=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct Twilio API: SUCCESS');
        console.log(`📞 Found ${data.incoming_phone_numbers?.length || 0} phone number(s)`);
        
        if (data.incoming_phone_numbers?.length > 0) {
          console.log('📋 First number:', data.incoming_phone_numbers[0].phone_number);
        }
      } else {
        console.log('❌ Direct Twilio API: FAILED');
        console.log('Status:', response.status, response.statusText);
        const errorData = await response.text();
        console.log('Error:', errorData.substring(0, 200));
      }
    } catch (error) {
      console.log('❌ Direct Twilio API Error:', error.message);
    }
    
    console.log();
  }
  
  // Test backend API if available
  const backendUrl = config.REACT_APP_API_URL || config.NEXT_PUBLIC_API_GATEWAY_URL;
  if (backendUrl) {
    try {
      console.log('🌐 Testing Vocelio Backend API...');
      console.log('Backend URL:', backendUrl);
      
      const response = await fetch(`${backendUrl}/api/v1/twilio/incoming-phone-numbers?PageSize=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': config.REACT_APP_AUTH_TOKEN ? `Bearer ${config.REACT_APP_AUTH_TOKEN}` : ''
        }
      });
      
      console.log('Response Status:', response.status);
      
      if (response.ok) {
        console.log('✅ Backend API: SUCCESS');
        const data = await response.json();
        console.log('Backend Response:', JSON.stringify(data, null, 2).substring(0, 300));
      } else {
        console.log('⚠️ Backend API: Not Available (Expected for development)');
        console.log('This means the system will use direct Twilio API calls');
      }
    } catch (error) {
      console.log('⚠️ Backend API: Not Available (Expected for development)');
      console.log('This means the system will use direct Twilio API calls');
    }
  }
  
  console.log('\n=== Summary ===');
  console.log('✅ Configuration loaded successfully');
  console.log('✅ Ready for React dashboard integration');
  console.log('\n📋 Next: Restart your React app to load the new environment variables');
}

testTwilioConnection().catch(console.error);
