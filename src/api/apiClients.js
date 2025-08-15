// API Client for AI Agents Service
// This module provides a centralized API client for communicating with the FastAPI backend

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class APIClient {
  constructor(baseURL, servicePath = '') {
    this.baseURL = baseURL;
    this.servicePath = servicePath;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${this.servicePath}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Create specific API clients for different services
export const apiClient = new APIClient(API_BASE_URL);
export const aiAgentsApi = new APIClient(API_BASE_URL, '/ai-agents');
export const callCenterApi = new APIClient(API_BASE_URL, '/call-center');
export const analyticsApi = new APIClient(API_BASE_URL, '/analytics');
export const voiceLabApi = new APIClient(API_BASE_URL, '/voice-lab');
export const flowBuilderApi = new APIClient(API_BASE_URL, '/flow-builder');
export const integrationApi = new APIClient(API_BASE_URL, '/integrations');
export const billingApi = new APIClient(API_BASE_URL, '/billing');
export const teamApi = new APIClient(API_BASE_URL, '/team');
export const complianceApi = new APIClient(API_BASE_URL, '/compliance');
export const phoneNumbersApi = new APIClient(API_BASE_URL, '/phone-numbers');
export const voiceMarketplaceApi = new APIClient(API_BASE_URL, '/voice-marketplace');
export const settingsApi = new APIClient(API_BASE_URL, '/settings');
export const webhooksApi = new APIClient(API_BASE_URL, '/webhooks');
export const securityApi = new APIClient(API_BASE_URL, '/security');
export const ssoApi = new APIClient(API_BASE_URL, '/sso');
export const auditApi = new APIClient(API_BASE_URL, '/audit');
export const dataWarehouseApi = new APIClient(API_BASE_URL, '/data-warehouse');
export const automationApi = new APIClient(API_BASE_URL, '/automation');
export const knowledgeBaseApi = new APIClient(API_BASE_URL, '/knowledge-base');
export const leadManagementApi = new APIClient(API_BASE_URL, '/lead-management');
export const notificationApi = new APIClient(API_BASE_URL, '/notifications');
export const schedulingApi = new APIClient(API_BASE_URL, '/scheduling');

// Default export for backward compatibility
export default apiClient;

// Helper functions for common API patterns
export const apiHelpers = {
  // Handle paginated responses
  async getAllPages(apiClient, endpoint, params = {}) {
    let allData = [];
    let page = 1;
    const limit = params.limit || 100;
    
    while (true) {
      const response = await apiClient.get(endpoint, { 
        ...params, 
        page, 
        limit 
      });
      
      if (Array.isArray(response)) {
        allData = allData.concat(response);
        if (response.length < limit) break;
      } else if (response.items) {
        allData = allData.concat(response.items);
        if (!response.has_more || response.items.length < limit) break;
      } else {
        allData.push(response);
        break;
      }
      
      page++;
    }
    
    return allData;
  },

  // Upload file helper
  async uploadFile(apiClient, endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return apiClient.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let the browser set it
      },
    });
  },

  // Retry mechanism for failed requests
  async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        
        console.warn(`Request attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  },

  // WebSocket helper for real-time connections
  createWebSocketConnection(endpoint, onMessage, onError) {
    const wsUrl = API_BASE_URL.replace(/^http/, 'ws') + endpoint;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
        onError && onError(error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError && onError(error);
    };
    
    return ws;
  }
};
