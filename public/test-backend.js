// Simple test to verify Railway backend connectivity
const testRailwayBackend = async () => {
  const railwayBackendUrl = 'https://call.vocelio.ai';
  
  console.log('🧪 Testing Railway backend connectivity...');
  console.log('🌐 Backend URL:', railwayBackendUrl);
  
  try {
    const response = await fetch(`${railwayBackendUrl}/api/v1/voice/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identity: 'test_user'
      })
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend response:', data);
      console.log('🎯 Token received:', data.token ? 'YES' : 'NO');
      console.log('🎯 Token format check:', data.token && data.token.split('.').length === 3 ? 'Valid JWT' : 'Invalid');
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Backend error:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
};

// Export the test function for use in browser console
window.testRailwayBackend = testRailwayBackend;

// Auto-run test when script loads
testRailwayBackend();
