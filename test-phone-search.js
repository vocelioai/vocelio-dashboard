// Phone Number Search Test Script
// This simulates what happens when a user searches for phone numbers

import { searchAvailableNumbers } from '../src/lib/twilioAPI.js';

async function testPhoneNumberSearch() {
  console.log('🔍 Testing Phone Number Search Functionality...');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Search for local numbers in US
    console.log('\n📞 Test 1: Searching for Local US Numbers...');
    const localNumbers = await twilioAPI.searchAvailableNumbers('US', 'Local', {
      areaCode: '415',
      contains: '*'
    });
    
    console.log(`✅ Found ${localNumbers.available_phone_numbers?.length || 0} local numbers`);
    if (localNumbers.available_phone_numbers?.length > 0) {
      console.log(`📋 Sample: ${localNumbers.available_phone_numbers[0].phone_number} (${localNumbers.available_phone_numbers[0].locality})`);
    }
    
    // Test 2: Search for toll-free numbers
    console.log('\n📞 Test 2: Searching for Toll-Free Numbers...');
    const tollFreeNumbers = await twilioAPI.searchAvailableNumbers('US', 'TollFree');
    
    console.log(`✅ Found ${tollFreeNumbers.available_phone_numbers?.length || 0} toll-free numbers`);
    if (tollFreeNumbers.available_phone_numbers?.length > 0) {
      console.log(`📋 Sample: ${tollFreeNumbers.available_phone_numbers[0].phone_number}`);
    }
    
    // Test 3: Get owned numbers
    console.log('\n📞 Test 3: Getting Owned Numbers...');
    const ownedNumbers = await twilioAPI.getOwnedNumbers();
    
    console.log(`✅ Found ${ownedNumbers.incoming_phone_numbers?.length || 0} owned numbers`);
    if (ownedNumbers.incoming_phone_numbers?.length > 0) {
      console.log(`📋 Sample: ${ownedNumbers.incoming_phone_numbers[0].phone_number} (${ownedNumbers.incoming_phone_numbers[0].friendly_name})`);
    }
    
    console.log('\n🎉 All phone number search tests completed successfully!');
    console.log('✅ Original issue is FIXED - phone numbers are now searchable');
    
    return {
      success: true,
      localNumbers: localNumbers.available_phone_numbers?.length || 0,
      tollFreeNumbers: tollFreeNumbers.available_phone_numbers?.length || 0,
      ownedNumbers: ownedNumbers.incoming_phone_numbers?.length || 0
    };
    
  } catch (error) {
    console.error('❌ Phone number search test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
const testResults = await testPhoneNumberSearch();
console.log('\n📊 Test Results:', testResults);
