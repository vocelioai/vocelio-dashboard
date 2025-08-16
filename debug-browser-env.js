// Quick browser environment debug script
// Run this in browser console to check environment variables

console.log('🔍 Debugging Twilio Environment Variables in Browser:');
console.log('REACT_APP_TWILIO_ACCOUNT_SID:', process.env.REACT_APP_TWILIO_ACCOUNT_SID);
console.log('REACT_APP_TWILIO_AUTH_TOKEN:', process.env.REACT_APP_TWILIO_AUTH_TOKEN);
console.log('REACT_APP_TWILIO_PHONE_NUMBER:', process.env.REACT_APP_TWILIO_PHONE_NUMBER);

// Check if credentials are available
const hasCredentials = !!(process.env.REACT_APP_TWILIO_ACCOUNT_SID && process.env.REACT_APP_TWILIO_AUTH_TOKEN);
console.log('✅ Has Twilio Credentials:', hasCredentials);

if (hasCredentials) {
  console.log('🎯 Should be using REAL Twilio data');
} else {
  console.log('⚠️ Missing credentials - will use MOCK data');
}
