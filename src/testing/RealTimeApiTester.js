/**
 * Real-time API Testing Script
 * Tests the integration between the Call Center dashboard and Railway backend
 */

const callCenterApiService = require('../services/CallCenterApiService');

class RealTimeApiTester {
  constructor() {
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🚀 Starting Real-Time API Integration Tests...\n');

    const tests = [
      this.testSystemHealth,
      this.testAnalytics,
      this.testCallMetrics,
      this.testAgentMetrics,
      this.testContacts,
      this.testAiConfiguration,
      this.testRoutingRules,
      this.testTransferRules,
      this.testRealTimeUpdates
    ];

    for (const test of tests) {
      try {
        await test.call(this);
      } catch (error) {
        console.error(`❌ Test failed:`, error.message);
        this.testResults.push({ test: test.name, status: 'failed', error: error.message });
      }
    }

    this.printResults();
  }

  async testSystemHealth() {
    console.log('🔍 Testing System Health...');
    const health = await callCenterApiService.getSystemHealth();
    console.log('✅ System Health:', health);
    this.testResults.push({ test: 'System Health', status: 'passed', data: health });
  }

  async testAnalytics() {
    console.log('📊 Testing Analytics...');
    const analytics = await callCenterApiService.getAnalytics();
    console.log('✅ Analytics:', analytics);
    this.testResults.push({ test: 'Analytics', status: 'passed', data: analytics });
  }

  async testCallMetrics() {
    console.log('📞 Testing Call Metrics...');
    const metrics = await callCenterApiService.getCallMetrics();
    console.log('✅ Call Metrics:', metrics);
    this.testResults.push({ test: 'Call Metrics', status: 'passed', data: metrics });
  }

  async testAgentMetrics() {
    console.log('👥 Testing Agent Metrics...');
    const agents = await callCenterApiService.getAgentMetrics();
    console.log('✅ Agent Metrics:', agents);
    this.testResults.push({ test: 'Agent Metrics', status: 'passed', data: agents });
  }

  async testContacts() {
    console.log('📇 Testing Contacts...');
    const contacts = await callCenterApiService.getContacts();
    console.log('✅ Contacts:', contacts);

    // Test creating a new contact
    const newContact = {
      name: 'Test User',
      phone: '+1234567890',
      email: 'test@example.com',
      tags: ['api-test']
    };
    
    const created = await callCenterApiService.createContact(newContact);
    console.log('✅ Created Contact:', created);

    this.testResults.push({ test: 'Contacts', status: 'passed', data: { contacts, created } });
  }

  async testAiConfiguration() {
    console.log('🤖 Testing AI Configuration...');
    const config = await callCenterApiService.getAiConfiguration();
    console.log('✅ AI Config:', config);
    this.testResults.push({ test: 'AI Configuration', status: 'passed', data: config });
  }

  async testRoutingRules() {
    console.log('🔀 Testing Routing Rules...');
    const rules = await callCenterApiService.getRoutingRules();
    console.log('✅ Routing Rules:', rules);
    this.testResults.push({ test: 'Routing Rules', status: 'passed', data: rules });
  }

  async testTransferRules() {
    console.log('↗️ Testing Transfer Rules...');
    const rules = await callCenterApiService.getTransferRules();
    console.log('✅ Transfer Rules:', rules);
    this.testResults.push({ test: 'Transfer Rules', status: 'passed', data: rules });
  }

  async testRealTimeUpdates() {
    console.log('⚡ Testing Real-Time Updates...');
    const updates = await callCenterApiService.getRealTimeUpdates();
    console.log('✅ Real-Time Updates:', updates);
    this.testResults.push({ test: 'Real-Time Updates', status: 'passed', data: updates });
  }

  printResults() {
    console.log('\n📋 TEST RESULTS SUMMARY');
    console.log('========================');
    
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${this.testResults.length}`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.filter(r => r.status === 'failed').forEach(test => {
        console.log(`  - ${test.test}: ${test.error}`);
      });
    }
    
    console.log('\n🎉 API Integration Testing Complete!');
  }
}

// Browser-compatible version for testing in the dashboard
window.testRealTimeApi = async () => {
  const tester = new RealTimeApiTester();
  await tester.runAllTests();
};

// Node.js version for command line testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RealTimeApiTester;
  
  // Run tests if this file is executed directly
  if (require.main === module) {
    const tester = new RealTimeApiTester();
    tester.runAllTests().catch(console.error);
  }
}
