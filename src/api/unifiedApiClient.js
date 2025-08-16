// =====================================================================================
// 🚀 VOCELIO UNIFIED API CLIENT - PRODUCTION
// =====================================================================================
// Complete API integration for Vocelio Dashboard with vocelio.ai production domains
// All services now point to live production infrastructure
// =====================================================================================

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 🔐 Supabase Configuration - PRODUCTION
export const SUPABASE_CONFIG = {
  URL: process.env.REACT_APP_SUPABASE_URL || "https://bhzhgivqqnwvndzjthqv.supabase.co",
  ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoemhnaXZxcW53dm5kemp0aHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODQ5MjgsImV4cCI6MjA3MDg2MDkyOH0.1JyoU3xQG7McYRIWzJfTfwv6oH7FCIZkLTLUnahLtKI"
};

// Initialize Supabase client
export const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);

// 🔧 Unified API Endpoints Configuration - VOCELIO.AI PRODUCTION
export const API_ENDPOINTS = {
  // Main API Gateway
  GATEWAY: process.env.REACT_APP_API_GATEWAY || "https://api.vocelio.ai",
  
  // Core Services
  AUTH: process.env.REACT_APP_AUTH_API || "https://auth.vocelio.ai",
  ORGANIZATIONS: process.env.REACT_APP_ORGANIZATIONS_API || "https://organizations.vocelio.ai",
  USERS: process.env.REACT_APP_USERS_API || "https://users.vocelio.ai",
  OVERVIEW: process.env.REACT_APP_OVERVIEW_API || 'https://overview.vocelio.ai',
  TEAM_HUB: process.env.REACT_APP_TEAM_HUB_API || 'https://team.vocelio.ai',

  // AI & Voice Services  
  AI_AGENTS: process.env.REACT_APP_AGENTS_API || "https://agents.vocelio.ai",
  AI_BRAIN: process.env.REACT_APP_AI_BRAIN_API || 'https://brain.vocelio.ai',
  VOICE_SERVICE: process.env.REACT_APP_VOICE_SERVICE_API || "https://voice.vocelio.ai",
  VOICE_LAB: process.env.REACT_APP_VOICE_LAB_API || 'https://voicelab.vocelio.ai',
  VOICE_MARKETPLACE: process.env.REACT_APP_VOICE_MARKETPLACE_API || "https://voicemarketplace.vocelio.ai",
  CONVERSATION_FLOW: process.env.REACT_APP_CONVERSATION_FLOW_API || "https://conversationflow.vocelio.ai",

  // Call Center & Communication
  CALL_SERVICE: process.env.REACT_APP_CALL_CENTER_API || "https://call.vocelio.ai",
  CAMPAIGNS: process.env.REACT_APP_CAMPAIGNS_API || "https://campaigns.vocelio.ai",
  PHONE_NUMBERS: process.env.REACT_APP_PHONE_NUMBERS_API || "https://numbers.vocelio.ai",
  CALL_RECORDINGS: process.env.REACT_APP_CALL_RECORDINGS_API || "https://callrecordings.vocelio.ai",
  NOTIFICATIONS: process.env.REACT_APP_NOTIFICATIONS_API || 'https://notifications.vocelio.ai',

  // Analytics & Reporting
  ANALYTICS: process.env.REACT_APP_ANALYTICS_API || "https://analytics.vocelio.ai",
  REPORTING: process.env.REACT_APP_REPORTING_API || "https://reporting.vocelio.ai",
  REAL_TIME_METRICS: process.env.REACT_APP_REAL_TIME_METRICS_API || "https://realtimemetrics.vocelio.ai",

  // Business Services
  BILLING: process.env.REACT_APP_BILLING_API || "https://billing.vocelio.ai",
  SUBSCRIPTIONS: process.env.REACT_APP_SUBSCRIPTIONS_API || "https://subscriptions.vocelio.ai",
  USAGE_TRACKING: process.env.REACT_APP_USAGE_TRACKING_API || "https://usagetracking.vocelio.ai",
  LEAD_MANAGEMENT: process.env.REACT_APP_LEAD_MANAGEMENT_API || "https://lead.vocelio.ai",
  SCHEDULING: process.env.REACT_APP_SCHEDULING_API || 'https://scheduling.vocelio.ai',

  // Enterprise Features
  KNOWLEDGE_BASE: process.env.REACT_APP_KNOWLEDGE_BASE_API || "https://knowledge.vocelio.ai",
  WEBHOOKS: process.env.REACT_APP_WEBHOOKS_API || "https://webhooks.vocelio.ai",
  SSO_IDENTITY: process.env.REACT_APP_SSO_IDENTITY_API || 'https://identity.vocelio.ai',
  ENTERPRISE_SECURITY: process.env.REACT_APP_ENTERPRISE_SECURITY_API || 'https://security.vocelio.ai',
  AUDIT_COMPLIANCE: process.env.REACT_APP_AUDIT_COMPLIANCE_API || 'https://compliance.vocelio.ai',

  // Integration Services
  INTEGRATIONS: process.env.REACT_APP_INTEGRATIONS_API || "https://integrations.vocelio.ai",
  FLOW_BUILDER: process.env.REACT_APP_FLOW_BUILDER_API || 'https://flowbuilder.vocelio.ai',
  DATA_WAREHOUSE: process.env.REACT_APP_DATA_WAREHOUSE_API || "https://data.vocelio.ai",

  // System Services
  HEALTH_CHECK: process.env.REACT_APP_HEALTH_CHECK_API || "https://healthcheck.vocelio.ai",
  AUDIT_LOGS: process.env.REACT_APP_AUDIT_LOGS_API || "https://auditlogs.vocelio.ai",
  
  // Additional Services
  DEVELOPER_API: process.env.REACT_APP_DEVELOPER_API || 'https://developer.vocelio.ai',
  WHITE_LABEL: process.env.REACT_APP_WHITE_LABEL_API || 'https://whitelabel.vocelio.ai',
  API_MANAGEMENT: process.env.REACT_APP_API_MANAGEMENT_API || 'https://apimanagement.vocelio.ai',
  SETTINGS: process.env.REACT_APP_SETTINGS_API || 'https://settings.vocelio.ai',
};

// 🚀 API Client Configuration
export const API_CONFIG = {
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// =====================================================================================
// 🔧 UNIFIED API CLIENT CLASS
// =====================================================================================

class UnifiedAPIClient {
  constructor(baseURL, servicePath = '') {
    this.baseURL = baseURL;
    this.servicePath = servicePath;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${this.servicePath}${endpoint}`;
    
    // Get token from localStorage or Supabase session
    const token = this.getAuthToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      timeout: API_CONFIG.timeout,
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    let lastError;
    
    // Retry logic
    for (let attempt = 0; attempt <= API_CONFIG.retries; attempt++) {
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
        lastError = error;
        if (attempt === API_CONFIG.retries) {
          console.error(`API request failed for ${endpoint} after ${API_CONFIG.retries + 1} attempts:`, error);
          throw error;
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    throw lastError;
  }

  getAuthToken() {
    // Try Supabase session first
    const { data: { session } } = supabase.auth.getSession();
    if (session?.access_token) {
      return session.access_token;
    }
    
    // Fallback to localStorage
    return localStorage.getItem('token');
  }

  // HTTP Methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // WebSocket helper for real-time connections
  createWebSocketConnection(endpoint, onMessage, onError) {
    const wsUrl = `${this.baseURL.replace('https:', 'wss:')}${this.servicePath}${endpoint}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
    
    return ws;
  }
}

// =====================================================================================
// 📊 API SERVICE INSTANCES
// =====================================================================================

// Core Services
export const authAPI = new UnifiedAPIClient(API_ENDPOINTS.AUTH);
export const organizationsAPI = new UnifiedAPIClient(API_ENDPOINTS.ORGANIZATIONS);
export const usersAPI = new UnifiedAPIClient(API_ENDPOINTS.USERS);
export const overviewAPI = new UnifiedAPIClient(API_ENDPOINTS.OVERVIEW);
export const teamHubAPI = new UnifiedAPIClient(API_ENDPOINTS.TEAM_HUB);

// AI Services
export const agentsAPI = new UnifiedAPIClient(API_ENDPOINTS.AI_AGENTS);
export const aiBrainAPI = new UnifiedAPIClient(API_ENDPOINTS.AI_BRAIN);
export const voiceServiceAPI = new UnifiedAPIClient(API_ENDPOINTS.VOICE_SERVICE);
export const voiceLabAPI = new UnifiedAPIClient(API_ENDPOINTS.VOICE_LAB);
export const voiceMarketplaceAPI = new UnifiedAPIClient(API_ENDPOINTS.VOICE_MARKETPLACE);

// Communication Services
export const callServiceAPI = new UnifiedAPIClient(API_ENDPOINTS.CALL_SERVICE);
export const campaignsAPI = new UnifiedAPIClient(API_ENDPOINTS.CAMPAIGNS);
export const phoneNumbersAPI = new UnifiedAPIClient(API_ENDPOINTS.PHONE_NUMBERS);
export const notificationsAPI = new UnifiedAPIClient(API_ENDPOINTS.NOTIFICATIONS);

// Analytics Services
export const analyticsAPI = new UnifiedAPIClient(API_ENDPOINTS.ANALYTICS);
export const reportingAPI = new UnifiedAPIClient(API_ENDPOINTS.REPORTING);
export const realTimeMetricsAPI = new UnifiedAPIClient(API_ENDPOINTS.REAL_TIME_METRICS);

// Business Services
export const billingAPI = new UnifiedAPIClient(API_ENDPOINTS.BILLING);
export const leadManagementAPI = new UnifiedAPIClient(API_ENDPOINTS.LEAD_MANAGEMENT);
export const schedulingAPI = new UnifiedAPIClient(API_ENDPOINTS.SCHEDULING);

// Integration Services
export const integrationsAPI = new UnifiedAPIClient(API_ENDPOINTS.INTEGRATIONS);
export const flowBuilderAPI = new UnifiedAPIClient(API_ENDPOINTS.FLOW_BUILDER);
export const webhooksAPI = new UnifiedAPIClient(API_ENDPOINTS.WEBHOOKS);

// =====================================================================================
// 🎯 SPECIFIC API FUNCTIONS
// =====================================================================================

// Authentication Functions
export const auth = {
  async login(credentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  },

  async register(userData) {
    const { data, error } = await supabase.auth.signUp(userData);
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

// Organizations Functions
export const organizations = {
  async list() {
    return organizationsAPI.get('/');
  },

  async create(orgData) {
    return organizationsAPI.post('/', orgData);
  },

  async get(orgId) {
    return organizationsAPI.get(`/${orgId}`);
  },

  async update(orgId, orgData) {
    return organizationsAPI.put(`/${orgId}`, orgData);
  },

  async delete(orgId) {
    return organizationsAPI.delete(`/${orgId}`);
  }
};

// AI Agents Functions
export const agents = {
  async list() {
    return agentsAPI.get('/');
  },

  async create(agentData) {
    return agentsAPI.post('/', agentData);
  },

  async get(agentId) {
    return agentsAPI.get(`/${agentId}`);
  },

  async update(agentId, agentData) {
    return agentsAPI.put(`/${agentId}`, agentData);
  },

  async delete(agentId) {
    return agentsAPI.delete(`/${agentId}`);
  }
};

// Campaigns Functions
export const campaigns = {
  async list() {
    return campaignsAPI.get('/');
  },

  async create(campaignData) {
    return campaignsAPI.post('/', campaignData);
  },

  async get(campaignId) {
    return campaignsAPI.get(`/${campaignId}`);
  },

  async start(campaignId) {
    return campaignsAPI.post(`/${campaignId}/start`);
  },

  async stop(campaignId) {
    return campaignsAPI.post(`/${campaignId}/stop`);
  }
};

// Calls Functions
export const calls = {
  async list(params = {}) {
    return callServiceAPI.get('/', params);
  },

  async get(callId) {
    return callServiceAPI.get(`/${callId}`);
  },

  async makeCall(callData) {
    return callServiceAPI.post('/make-call', callData);
  }
};

// Analytics Functions
export const analytics = {
  async getDashboard(params = {}) {
    return analyticsAPI.get('/dashboard', params);
  },

  async getCallMetrics(params = {}) {
    return analyticsAPI.get('/call-metrics', params);
  },

  async getAgentMetrics(params = {}) {
    return analyticsAPI.get('/agent-metrics', params);
  }
};

// Real-time Functions
export const realTime = {
  async getCurrentMetrics() {
    return realTimeMetricsAPI.get('/current');
  },

  connectWebSocket() {
    return realTimeMetricsAPI.createWebSocketConnection('/ws');
  }
};

// Voice Functions
export const voices = {
  async list() {
    return voiceMarketplaceAPI.get('/');
  },

  async preview(voiceId, text) {
    return voiceServiceAPI.post('/preview', { voice_id: voiceId, text });
  }
};

// Leads Functions
export const leads = {
  async list(params = {}) {
    return leadManagementAPI.get('/', params);
  },

  async create(leadData) {
    return leadManagementAPI.post('/', leadData);
  },

  async get(leadId) {
    return leadManagementAPI.get(`/${leadId}`);
  }
};

// Billing Functions
export const billing = {
  async getSubscription() {
    return billingAPI.get('/subscription/current');
  },

  async getUsage(params = {}) {
    return billingAPI.get('/usage', params);
  },

  async getInvoices() {
    return billingAPI.get('/invoices');
  }
};

// =====================================================================================
// 🔥 REACT HOOKS FOR DASHBOARD INTEGRATION
// =====================================================================================

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { 
    user, 
    loading,
    login: auth.login,
    register: auth.register,
    logout: auth.logout
  };
};

export const useAgents = () => {
  const [agentsList, setAgentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agents.list();
      setAgentsList(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return { 
    agents: agentsList, 
    loading, 
    error, 
    refetch: fetchAgents 
  };
};

export const useCampaigns = () => {
  const [campaignsList, setCampaignsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaigns.list();
      setCampaignsList(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return { 
    campaigns: campaignsList, 
    loading, 
    error, 
    refetch: fetchCampaigns 
  };
};

export const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = realTime.connectWebSocket();
    
    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to real-time metrics');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
    };
    
    ws.onclose = () => {
      setConnected(false);
      console.log('Disconnected from real-time metrics');
    };

    return () => {
      ws.close();
    };
  }, []);

  return { metrics, connected };
};

// Health Check Function
export const checkAllServicesHealth = async () => {
  const services = Object.keys(API_ENDPOINTS);
  const results = {};
  
  await Promise.allSettled(
    services.map(async (service) => {
      try {
        const response = await fetch(`${API_ENDPOINTS[service]}/health`);
        results[service] = response.ok;
      } catch (error) {
        results[service] = false;
      }
    })
  );
  
  return results;
};

// Export everything
export default {
  API_ENDPOINTS,
  SUPABASE_CONFIG,
  supabase,
  auth,
  organizations,
  agents,
  campaigns,
  calls,
  analytics,
  realTime,
  voices,
  leads,
  billing,
  useAuth,
  useAgents,
  useCampaigns,
  useRealTimeMetrics,
  checkAllServicesHealth
};
