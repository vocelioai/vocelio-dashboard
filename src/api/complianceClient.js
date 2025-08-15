// Compliance API Client
// Integrates with the comprehensive compliance backend service

class ComplianceClient {
  constructor(baseURL = 'http://localhost:8003') {
    this.baseURL = baseURL;
    this.apiBase = `${baseURL}/api/v1/enhanced`;
  }

  // Helper method for API calls
  async apiCall(endpoint, options = {}) {
    const url = `${this.apiBase}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard and Analytics
  async getComplianceDashboard() {
    return this.apiCall('/analytics/compliance-dashboard');
  }

  async getComplianceMetrics() {
    return this.apiCall('/analytics/metrics');
  }

  // Audit Event Management
  async getAuditEvents(filters = {}) {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.eventType) params.append('event_type', filters.eventType);
    if (filters.userId) params.append('user_id', filters.userId);
    if (filters.riskLevel) params.append('risk_level', filters.riskLevel);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    return this.apiCall(`/audit-events${queryString ? `?${queryString}` : ''}`);
  }

  async createAuditEvent(eventData) {
    return this.apiCall('/audit-events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getAuditEvent(eventId) {
    return this.apiCall(`/audit-events/${eventId}`);
  }

  // GDPR Management
  async getGDPRRequests(filters = {}) {
    const params = new URLSearchParams();
    if (filters.requestType) params.append('request_type', filters.requestType);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    return this.apiCall(`/gdpr-requests${queryString ? `?${queryString}` : ''}`);
  }

  async createGDPRRequest(requestData) {
    return this.apiCall('/gdpr-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async processDataExport(requestId) {
    return this.apiCall(`/gdpr-requests/${requestId}/export`, {
      method: 'POST',
    });
  }

  // Telecom Compliance
  async getTelecomRegulations(jurisdiction = null) {
    const params = jurisdiction ? `?jurisdiction=${jurisdiction}` : '';
    return this.apiCall(`/telecom/regulations${params}`);
  }

  async getRecordingConsentStatus(phoneNumber) {
    return this.apiCall(`/telecom/recording-consent/${phoneNumber}`);
  }

  // Compliance Rules & Assessments
  async getComplianceRules(framework = null) {
    const params = framework ? `?framework=${framework}` : '';
    return this.apiCall(`/compliance-rules${params}`);
  }

  async createComplianceRule(ruleData) {
    return this.apiCall('/compliance-rules', {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
  }

  async getComplianceAssessments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.framework) params.append('framework', filters.framework);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    return this.apiCall(`/compliance-assessments${queryString ? `?${queryString}` : ''}`);
  }

  async createComplianceAssessment(assessmentData) {
    return this.apiCall('/compliance-assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  }

  // Risk Management
  async getRiskAssessments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.riskLevel) params.append('risk_level', filters.riskLevel);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    return this.apiCall(`/risk-assessments${queryString ? `?${queryString}` : ''}`);
  }

  async createRiskAssessment(riskData) {
    return this.apiCall('/risk-assessments', {
      method: 'POST',
      body: JSON.stringify(riskData),
    });
  }

  async getIncidentReports(filters = {}) {
    const params = new URLSearchParams();
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    return this.apiCall(`/incident-reports${queryString ? `?${queryString}` : ''}`);
  }

  async createIncidentReport(incidentData) {
    return this.apiCall('/incident-reports', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  }

  // Reports & Documentation
  async getAuditReports(filters = {}) {
    const params = new URLSearchParams();
    if (filters.reportType) params.append('report_type', filters.reportType);
    if (filters.framework) params.append('framework', filters.framework);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    return this.apiCall(`/audit-reports${queryString ? `?${queryString}` : ''}`);
  }

  async generateAuditReport(reportRequest) {
    return this.apiCall('/audit-reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportRequest),
    });
  }

  // Health Check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Legacy Endpoints (for backward compatibility)
  async getLegacyAuditLogs(filters = {}) {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.eventType) params.append('event_type', filters.eventType);
    if (filters.userId) params.append('user_id', filters.userId);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    return this.apiCall(`/audit/logs${queryString ? `?${queryString}` : ''}`);
  }
}

// Export singleton instance
const complianceClient = new ComplianceClient();
export default complianceClient;

// Export the class for custom instances
export { ComplianceClient };
