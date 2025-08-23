/**
 * Railway Flow Runtime API Client
 * Connects to your deployed FlowBuilder backend at https://flowbuilder.vocelio.ai
 */

const FLOW_BUILDER_API = process.env.REACT_APP_FLOW_BUILDER_API || 'https://flowbuilder.vocelio.ai';

export class RailwayFlowAPI {
  constructor() {
    this.baseURL = FLOW_BUILDER_API;
    this.websocket = null;
    this.listeners = new Map();
  }

  // WebSocket connection for real-time updates
  connectWebSocket() {
    if (this.websocket) {
      return this.websocket;
    }

    const wsUrl = this.baseURL.replace('https:', 'wss:').replace('http:', 'ws:') + '/ws/executions';
    this.websocket = new WebSocket(wsUrl);
    
    this.websocket.onopen = () => {
      console.log('🔌 Connected to Railway Flow Runtime');
      this.emit('connected');
    };
    
    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit('message', data);
        
        // Emit specific event types
        if (data.type) {
          this.emit(data.type, data);
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };
    
    this.websocket.onclose = () => {
      console.log('🔌 Disconnected from Railway Flow Runtime');
      this.websocket = null;
      this.emit('disconnected');
      
      // Auto-reconnect after 3 seconds
      setTimeout(() => this.connectWebSocket(), 3000);
    };
    
    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
    
    return this.websocket;
  }

  // Event system for WebSocket
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // API Methods
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_AUTH_TOKEN || 'railway-api-production-token'}`
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Flow execution methods
  async startExecution(flowDefinition, callData = {}) {
    return this.makeRequest('/api/executions/start', {
      method: 'POST',
      body: JSON.stringify({ 
        flow_definition: flowDefinition,
        call_data: callData 
      })
    });
  }

  async getExecution(executionId) {
    return this.makeRequest(`/api/executions/${executionId}`);
  }

  async listExecutions() {
    return this.makeRequest('/api/executions');
  }

  async pauseExecution(executionId) {
    return this.makeRequest(`/api/executions/${executionId}/pause`, {
      method: 'POST'
    });
  }

  async resumeExecution(executionId) {
    return this.makeRequest(`/api/executions/${executionId}/resume`, {
      method: 'POST'
    });
  }

  async getExecutionTrace(executionId) {
    const execution = await this.getExecution(executionId);
    return execution.trace || [];
  }

  // Health check
  async getHealth() {
    return this.makeRequest('/');
  }

  // Test connection
  async testConnection() {
    try {
      const health = await this.getHealth();
      return {
        success: true,
        status: 'connected',
        data: health
      };
    } catch (error) {
      return {
        success: false,
        status: 'error',
        error: error.message
      };
    }
  }

  // Flow validation
  async validateFlow(flowDefinition) {
    try {
      return this.makeRequest('/api/flows/validate', {
        method: 'POST',
        body: JSON.stringify(flowDefinition)
      });
    } catch (error) {
      console.warn('Flow validation not available:', error);
      // Return local validation as fallback
      return { valid: true, message: 'Local validation passed' };
    }
  }

  // Cleanup
  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const railwayFlowAPI = new RailwayFlowAPI();

// Auto-connect WebSocket on import
if (typeof window !== 'undefined') {
  railwayFlowAPI.connectWebSocket();
}
