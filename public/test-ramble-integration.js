// Test Ramble AI Provider Integration
console.log('🎙️ Testing Ramble AI Provider Integration...');

// Test environment variables
const rambleApiKey = process.env.REACT_APP_RAMBLE_API_KEY;
const rambleBaseUrl = process.env.REACT_APP_RAMBLE_BASE_URL;

console.log('📋 Environment Check:');
console.log(`- Ramble API Key: ${rambleApiKey ? '✅ Present' : '❌ Missing'}`);
console.log(`- Ramble Base URL: ${rambleBaseUrl || '❌ Missing'}`);

if (!rambleApiKey) {
  console.error('❌ RAMBLE API KEY NOT FOUND!');
  console.log('Please add REACT_APP_RAMBLE_API_KEY to your .env file');
}

// Test API connection
async function testRambleConnection() {
  try {
    console.log('🔌 Testing Ramble API Connection...');
    
    const response = await fetch(`${rambleBaseUrl}/voices`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${rambleApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ramble AI Connected Successfully!');
      console.log(`📊 Available voices: ${data.voices?.length || 0}`);
      return true;
    } else {
      console.error(`❌ Ramble API Error: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Ramble Connection Failed:', error.message);
    return false;
  }
}

// Test voice generation
async function testRambleVoiceGeneration() {
  try {
    console.log('🎵 Testing Ramble Voice Generation...');
    
    const response = await fetch(`${rambleBaseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${rambleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hello, this is a test of Ramble AI voice generation.',
        voice_id: 'default',
        model: 'ramble-v1',
        context: 'test'
      }),
    });

    if (response.ok) {
      console.log('✅ Ramble Voice Generation Working!');
      return true;
    } else {
      console.error(`❌ Voice Generation Error: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Voice Generation Failed:', error.message);
    return false;
  }
}

// Run tests when page loads
window.addEventListener('load', async () => {
  console.log('🚀 Starting Ramble AI Integration Tests...');
  
  if (rambleApiKey && rambleBaseUrl) {
    const connectionTest = await testRambleConnection();
    if (connectionTest) {
      await testRambleVoiceGeneration();
    }
  }
  
  console.log('🏁 Ramble AI Integration Tests Complete!');
});

// Export for manual testing
window.testRambleAI = {
  testConnection: testRambleConnection,
  testVoiceGeneration: testRambleVoiceGeneration
};

console.log('💡 Manual test available: window.testRambleAI.testConnection()');
