// Vocelio API Client for Railway Backend Integration
class VocelioAPIClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api-gateway-production-588d.up.railway.app';
    this.apiVersion = process.env.REACT_APP_API_VERSION || 'v1';
    this.authToken = process.env.REACT_APP_AUTH_TOKEN || 'test-token';
    this.overviewService = process.env.REACT_APP_OVERVIEW_SERVICE || 'overview';
    this.agentStoreService = process.env.REACT_APP_AGENT_STORE_SERVICE || 'agent-store';
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Return mock data for development when backend is unavailable
      if (error.message.includes('fetch')) {
        return this.getMockData(endpoint);
      }
      
      throw error;
    }
  }

  // Mock data fallback for development
  getMockData(endpoint) {
    if (endpoint.includes('overview')) {
      return {
        success: true,
        data: {
          total_calls: 47283,
          active_agents: 247,
          success_rate: 23.4,
          revenue_today: 2847592,
          services_health: 'operational',
          recent_activity: []
        }
      };
    }
    
    if (endpoint.includes('agent-store')) {
      return {
        success: true,
        data: {
          featured_agents: [],
          categories: [],
          trending_agents: []
        }
      };
    }
    
    return { success: true, data: {} };
  }

  // Dashboard Overview Methods
  async getDashboardOverview() {
    return this.request(`/api/${this.overviewService}/${this.apiVersion}/integration/overview`);
  }

  async getDashboardAnalytics() {
    return this.request(`/api/${this.overviewService}/${this.apiVersion}/integration/analytics`);
  }

  async getServiceHealth() {
    return this.request(`/api/${this.overviewService}/${this.apiVersion}/integration/services/health`);
  }

  async getRecentActivity() {
    return this.request(`/api/${this.overviewService}/${this.apiVersion}/integration/recent-activity`);
  }

  async getNotifications() {
    return this.request(`/api/${this.overviewService}/${this.apiVersion}/integration/notifications`);
  }

  async getKPIs() {
    return this.request(`/api/${this.overviewService}/${this.apiVersion}/integration/kpis`);
  }

  // Agent Store Methods
  async getFeaturedAgents() {
    return this.request(`/api/${this.agentStoreService}/${this.apiVersion}/dashboard/featured`);
  }

  async getAgentCategories() {
    return this.request(`/api/${this.agentStoreService}/${this.apiVersion}/dashboard/categories`);
  }

  async getMarketplaceAnalytics() {
    return this.request(`/api/${this.agentStoreService}/${this.apiVersion}/dashboard/analytics`);
  }

  async getTrendingAgents() {
    return this.request(`/api/${this.agentStoreService}/${this.apiVersion}/dashboard/marketplace/trending`);
  }

  // Test connection method
  async testConnection() {
    try {
      const response = await fetch(this.baseURL);
      return {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Railway backend connected successfully!' : 'Connection failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to connect to Railway backend'
      };
    }
  }

  // Call specific methods for flow builder
  async testCall(phoneNumber, flowNodes) {
    return this.request(`/api/test-call`, {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        flow_nodes: flowNodes
      })
    });
  }

  async saveFlow(flowData) {
    return this.request(`/api/save-flow`, {
      method: 'POST',
      body: JSON.stringify(flowData)
    });
  }
}

// Export singleton instance
export const railwayAPI = new VocelioAPIClient();
export default railwayAPI;
