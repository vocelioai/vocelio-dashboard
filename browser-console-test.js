// Browser Console Test Script - Copy and paste into browser console
console.log('=== Voice Service Browser Debug Test ===');

// Test 1: Check if Twilio SDK is available
console.log('\n1. Testing Twilio SDK availability...');
if (typeof Twilio !== 'undefined') {
    console.log('✅ Twilio SDK is loaded');
    console.log('Twilio.Device:', typeof Twilio.Device);
} else {
    console.log('❌ Twilio SDK not found');
    console.log('Available globals:', Object.keys(window).filter(k => k.includes('twilio') || k.includes('Twilio')));
}

// Test 2: Check voice service
console.log('\n2. Testing Voice Service...');
if (typeof window.voiceService !== 'undefined') {
    console.log('✅ Voice service is available');
    console.log('Voice service methods:', Object.keys(window.voiceService));
} else {
    console.log('❌ Voice service not found in window');
}

// Test 3: Backend connectivity test
console.log('\n3. Testing backend connectivity...');
fetch('https://call.vocelio.ai/api/v1/voice/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: 'test-user-' + Date.now() })
})
.then(response => {
    console.log('Backend response status:', response.status);
    console.log('Response headers:', response.headers);
    return response.json();
})
.then(data => {
    console.log('Backend response:', data);
    if (data.token) {
        console.log('✅ Token received from backend');
        console.log('Token length:', data.token.length);
        
        // Test 4: Try creating Twilio Device with token
        if (typeof Twilio !== 'undefined' && Twilio.Device) {
            console.log('\n4. Testing Twilio Device creation...');
            try {
                const device = new Twilio.Device(data.token);
                console.log('✅ Twilio Device created successfully');
                console.log('Device state:', device.state);
                
                device.on('ready', () => {
                    console.log('✅ Device is ready');
                });
                
                device.on('error', (error) => {
                    console.error('❌ Device error:', error);
                });
                
                device.on('offline', () => {
                    console.log('⚠️ Device went offline');
                });
                
            } catch (error) {
                console.error('❌ Failed to create Twilio Device:', error);
            }
        }
    } else {
        console.log('❌ No token in backend response');
    }
})
.catch(error => {
    console.error('❌ Backend request failed:', error);
});

// Test 5: Check browser capabilities
console.log('\n5. Checking browser capabilities...');
console.log('Browser supports WebRTC:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
console.log('Browser supports WebAudio:', !!(window.AudioContext || window.webkitAudioContext));
console.log('Current protocol:', window.location.protocol);
console.log('Current host:', window.location.host);
