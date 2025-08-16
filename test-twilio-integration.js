/**
 * Twilio Integration Test Script
 * Run this to verify your Twilio credentials and API access
 */

import twilioAPI from './src/lib/twilioAPI.js';

async function testTwilioIntegration() {
  console.log('🧪 Testing Twilio Integration...\n');
  
  // Test 1: Configuration Check
  console.log('1️⃣ Configuration Check:');
  const config = twilioAPI.getConfigurationStatus();
  console.log(`   Mode: ${config.mode}`);
  console.log(`   Has Credentials: ${config.hasCredentials}`);
  console.log(`   Account SID: ${config.accountSid}`);
  console.log('');
  
  // Test 2: Connection Test
  console.log('2️⃣ Connection Test:');
  try {
    const connectionTest = await twilioAPI.testConnection();
    console.log(`   Success: ${connectionTest.success}`);
    console.log(`   Mode: ${connectionTest.mode}`);
    console.log(`   Real Data: ${connectionTest.isReal}`);
    console.log(`   Message: ${connectionTest.message}`);
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
  }
  console.log('');
  
  // Test 3: Search Available Numbers
  console.log('3️⃣ Available Numbers Search:');
  try {
    const availableNumbers = await twilioAPI.searchAvailableNumbers('US', { 
      type: 'Local', 
      limit: 5 
    });
    
    if (availableNumbers.available_phone_numbers) {
      console.log(`   Found ${availableNumbers.available_phone_numbers.length} numbers:`);
      availableNumbers.available_phone_numbers.forEach((number, index) => {
        console.log(`   ${index + 1}. ${number.phone_number} - ${number.locality}, ${number.region} ($${number.price}/month)`);
      });
      console.log(`   Data Type: ${availableNumbers.mock ? 'Mock' : 'Real Twilio'}`);
    } else {
      console.log('   ❌ No numbers found');
    }
  } catch (error) {
    console.log(`   ❌ Search failed: ${error.message}`);
  }
  console.log('');
  
  // Test 4: Get Owned Numbers
  console.log('4️⃣ Owned Numbers:');
  try {
    const ownedNumbers = await twilioAPI.getOwnedNumbers();
    
    if (ownedNumbers.incoming_phone_numbers) {
      console.log(`   You own ${ownedNumbers.incoming_phone_numbers.length} numbers:`);
      ownedNumbers.incoming_phone_numbers.forEach((number, index) => {
        console.log(`   ${index + 1}. ${number.phone_number} - ${number.friendly_name} (${number.status})`);
      });
    } else {
      console.log('   No owned numbers found');
    }
  } catch (error) {
    console.log(`   ❌ Failed to get owned numbers: ${error.message}`);
  }
  console.log('');
  
  // Summary
  console.log('📋 Summary:');
  if (config.isConfigured) {
    console.log('✅ Twilio credentials configured');
    console.log('✅ Ready for real phone number operations');
    console.log('💡 Go to Phone Numbers page to search and purchase real numbers');
  } else {
    console.log('⚠️  Twilio credentials not fully configured');
    console.log('💡 Using demo mode - real numbers not available');
  }
}

// Run the test
testTwilioIntegration().catch(console.error);
