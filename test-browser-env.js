// Browser Environment Variable Test
// Run this in the browser console to check if variables are loaded

console.log('🔍 Browser Environment Variable Test');
console.log('=======================================');
console.log('REACT_APP_TWILIO_ACCOUNT_SID:', process.env.REACT_APP_TWILIO_ACCOUNT_SID);
console.log('REACT_APP_TWILIO_AUTH_TOKEN:', process.env.REACT_APP_TWILIO_AUTH_TOKEN ? 'PRESENT' : 'MISSING');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('REACT_APP_AUTH_TOKEN:', process.env.REACT_APP_AUTH_TOKEN ? 'PRESENT' : 'MISSING');
console.log('');
console.log('All REACT_APP_TWILIO variables:');
Object.keys(process.env)
  .filter(key => key.startsWith('REACT_APP_TWILIO'))
  .forEach(key => {
    console.log(`${key}:`, key.includes('TOKEN') ? 'PRESENT' : process.env[key]);
  });
console.log('=======================================');
