// Call Center API Service - Connect to Railway Backend
class CallCenterApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'https://call.vocelio.ai';
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://call.vocelio.ai';
  }

  // Helper method for making API requests
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Response:`, data);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ API Error:`, error);
      return { success: false, error: error.message };
    }
  }

  // Analytics and Metrics
  async getCallMetrics(dateRange = '7') {
    return await this.apiRequest(`/api/v1/analytics/calls?range=${dateRange}`);
  }

  async getAgentPerformance(dateRange = '7') {
    return await this.apiRequest(`/api/v1/analytics/agents?range=${dateRange}`);
  }

  async getCallTypeDistribution(dateRange = '7') {
    return await this.apiRequest(`/api/v1/analytics/call-types?range=${dateRange}`);
  }

  async getRealtimeMetrics() {
    return await this.apiRequest('/api/v1/analytics/realtime');
  }

  // Call Management
  async getActiveCalls() {
    return await this.apiRequest('/api/v1/calls/active');
  }

  async getCallHistory(limit = 50, offset = 0) {
    return await this.apiRequest(`/api/v1/calls/history?limit=${limit}&offset=${offset}`);
  }

  async getCallDetails(callId) {
    return await this.apiRequest(`/api/v1/calls/${callId}`);
  }

  async updateCallStatus(callId, status, metadata = {}) {
    return await this.apiRequest(`/api/v1/calls/${callId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, metadata })
    });
  }

  // Contact Management
  async getContacts(search = '', filter = 'all', limit = 100) {
    const params = new URLSearchParams({
      search,
      filter,
      limit: limit.toString()
    });
    return await this.apiRequest(`/api/v1/contacts?${params}`);
  }

  async createContact(contactData) {
    return await this.apiRequest('/api/v1/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }

  async updateContact(contactId, contactData) {
    return await this.apiRequest(`/api/v1/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(contactData)
    });
  }

  async deleteContact(contactId) {
    return await this.apiRequest(`/api/v1/contacts/${contactId}`, {
      method: 'DELETE'
    });
  }

  // AI Configuration
  async savePromptConfiguration(config) {
    return await this.apiRequest('/api/v1/ai/prompts', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async getPromptConfiguration() {
    return await this.apiRequest('/api/v1/ai/prompts');
  }

  async testAiResponse(prompt, context = {}) {
    return await this.apiRequest('/api/v1/ai/test', {
      method: 'POST',
      body: JSON.stringify({ prompt, context })
    });
  }

  // Routing Configuration
  async saveRoutingRules(rules) {
    return await this.apiRequest('/api/v1/routing/rules', {
      method: 'POST',
      body: JSON.stringify(rules)
    });
  }

  async getRoutingRules() {
    return await this.apiRequest('/api/v1/routing/rules');
  }

  async testRoutingLogic(callData) {
    return await this.apiRequest('/api/v1/routing/test', {
      method: 'POST',
      body: JSON.stringify(callData)
    });
  }

  // Transfer Rules
  async saveTransferRules(rules) {
    return await this.apiRequest('/api/v1/transfer/rules', {
      method: 'POST',
      body: JSON.stringify(rules)
    });
  }

  async getTransferRules() {
    return await this.apiRequest('/api/v1/transfer/rules');
  }

  async getTransferMetrics(dateRange = '7') {
    return await this.apiRequest(`/api/v1/transfer/metrics?range=${dateRange}`);
  }

  // Department Management
  async getDepartments() {
    return await this.apiRequest('/api/v1/departments');
  }

  async updateDepartmentAvailability(departmentId, availability) {
    return await this.apiRequest(`/api/v1/departments/${departmentId}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ availability })
    });
  }

  // Real-time Updates (WebSocket-like polling)
  async subscribeToUpdates(callback, interval = 5000) {
    const updateLoop = async () => {
      try {
        const [metrics, activeCalls, inboundQueue] = await Promise.all([
          this.getRealtimeMetrics(),
          this.getActiveCalls(),
          this.getInboundQueue()
        ]);

        if (callback && typeof callback === 'function') {
          callback({
            metrics: metrics.success ? metrics.data : null,
            activeCalls: activeCalls.success ? activeCalls.data : [],
            inboundQueue: inboundQueue.success ? inboundQueue.data : []
          });
        }
      } catch (error) {
        console.error('Real-time update error:', error);
      }
    };

    // Initial update
    await updateLoop();
    
    // Set up polling
    const intervalId = setInterval(updateLoop, interval);
    
    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  // Inbound Queue Management
  async getInboundQueue() {
    return await this.apiRequest('/api/v1/calls/queue');
  }

  async acceptInboundCall(callId) {
    return await this.apiRequest(`/api/v1/calls/queue/${callId}/accept`, {
      method: 'POST'
    });
  }

  async rejectInboundCall(callId, reason = 'busy') {
    return await this.apiRequest(`/api/v1/calls/queue/${callId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  // Recording Management
  async getRecordings(callId = null, limit = 50) {
    const params = callId ? `?callId=${callId}&limit=${limit}` : `?limit=${limit}`;
    return await this.apiRequest(`/api/v1/recordings${params}`);
  }

  async getRecordingUrl(recordingId) {
    return await this.apiRequest(`/api/v1/recordings/${recordingId}/url`);
  }

  async deleteRecording(recordingId) {
    return await this.apiRequest(`/api/v1/recordings/${recordingId}`, {
      method: 'DELETE'
    });
  }

  // Health Check
  async healthCheck() {
    return await this.apiRequest('/health');
  }

  // Export functionality
  async exportCallReport(dateRange, format = 'json') {
    return await this.apiRequest(`/api/v1/export/calls?range=${dateRange}&format=${format}`);
  }

  async exportContactList(format = 'csv') {
    return await this.apiRequest(`/api/v1/export/contacts?format=${format}`);
  }
}

// Create singleton instance
const callCenterApiService = new CallCenterApiService();

export default callCenterApiService;
