// API Connection Test
console.log("🚀 Testing API Connection to Railway Backend...");

const testApiConnection = async () => {
  const baseUrl = 'https://call.vocelio.ai';
  
  console.log("Testing endpoints:");
  
  // Test 1: Basic health check
  try {
    console.log("\n1. Health Check Endpoint:");
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log(`Status: ${healthResponse.status}`);
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log("✅ Health check passed:", data);
    } else {
      console.log("❌ Health check failed:", healthResponse.statusText);
    }
  } catch (error) {
    console.log("❌ Health check error:", error.message);
  }

  // Test 2: System status
  try {
    console.log("\n2. System Status Endpoint:");
    const statusResponse = await fetch(`${baseUrl}/api/system/status`);
    console.log(`Status: ${statusResponse.status}`);
    if (statusResponse.ok) {
      const data = await statusResponse.json();
      console.log("✅ System status:", data);
    } else {
      console.log("❌ System status failed:", statusResponse.statusText);
    }
  } catch (error) {
    console.log("❌ System status error:", error.message);
  }

  // Test 3: Contacts endpoint
  try {
    console.log("\n3. Contacts Endpoint:");
    const contactsResponse = await fetch(`${baseUrl}/api/contacts`);
    console.log(`Status: ${contactsResponse.status}`);
    if (contactsResponse.ok) {
      const data = await contactsResponse.json();
      console.log("✅ Contacts:", data);
    } else {
      console.log("❌ Contacts failed:", contactsResponse.statusText);
    }
  } catch (error) {
    console.log("❌ Contacts error:", error.message);
  }

  // Test 4: Analytics endpoint
  try {
    console.log("\n4. Analytics Endpoint:");
    const analyticsResponse = await fetch(`${baseUrl}/api/analytics/overview`);
    console.log(`Status: ${analyticsResponse.status}`);
    if (analyticsResponse.ok) {
      const data = await analyticsResponse.json();
      console.log("✅ Analytics:", data);
    } else {
      console.log("❌ Analytics failed:", analyticsResponse.statusText);
    }
  } catch (error) {
    console.log("❌ Analytics error:", error.message);
  }

  console.log("\n🏁 API Connection Test Complete");
};

testApiConnection();
