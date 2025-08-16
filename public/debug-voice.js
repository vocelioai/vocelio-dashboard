// Debug script to test voice service initialization
console.log('🧪 Starting voice service debug test...');

// Test 1: Check if we can reach the Railway backend
const testBackend = async () => {
  console.log('🔄 Testing Railway backend connectivity...');
  try {
    const response = await fetch('https://call.vocelio.ai/api/v1/voice/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: 'debug_test' })
    });
    
    console.log('📡 Backend response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend response:', data);
      
      // Test 2: Try to create Twilio Device
      if (data.success && data.token) {
        console.log('🎯 Testing Twilio Device creation...');
        try {
          // Import Twilio Device
          const { Device } = await import('@twilio/voice-sdk');
          console.log('📦 Twilio SDK loaded successfully');
          
          const device = new Device(data.token, {
            logLevel: 'debug'
          });
          console.log('🎉 Twilio Device created successfully');
          
          device.on('ready', () => {
            console.log('✅ Device is ready!');
          });
          
          device.on('error', (error) => {
            console.error('❌ Device error:', error);
          });
          
          await device.register();
          console.log('📝 Device registration initiated');
          
        } catch (twilioError) {
          console.error('❌ Twilio Device error:', twilioError);
        }
      }
    } else {
      console.error('❌ Backend error:', response.status, await response.text());
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Test 3: Check environment
console.log('🔍 Environment check:');
console.log('- User Agent:', navigator.userAgent);
console.log('- Protocol:', location.protocol);
console.log('- Host:', location.host);
console.log('- HTTPS:', location.protocol === 'https:');

// Run the test
testBackend();

// Export for manual testing
window.debugVoiceService = testBackend;
