// =====================================================================================
// 🚀 VOCELIO FRONTEND INTEGRATION CONFIGURATION
// =====================================================================================
// Complete API endpoints and configuration for your Vercel dashboard
// Connect your frontend to the 25+ Railway microservices
// =====================================================================================

// 🔧 API Base URLs (Replace with your actual Railway service URLs)
export const API_ENDPOINTS = {
  // Core Services
  GATEWAY: "https://api-gateway-production.up.railway.app",
  AUTH: "https://auth-service-production.up.railway.app", 
  ORGANIZATIONS: "https://organizations-service-production.up.railway.app",
  USERS: "https://users-service-production.up.railway.app",

  // AI & Voice Services  
  AI_AGENTS: "https://ai-agents-production.up.railway.app",
  VOICE_SERVICE: "https://voice-service-production.up.railway.app",
  VOICE_MARKETPLACE: "https://voice-marketplace-production.up.railway.app",
  CONVERSATION_FLOW: "https://conversation-flow-production.up.railway.app",

  // Call Center & Communication
  CALL_SERVICE: "https://call-service-production.up.railway.app",
  CAMPAIGNS: "https://campaigns-service-production.up.railway.app", 
  PHONE_NUMBERS: "https://phone-numbers-production.up.railway.app",
  CALL_RECORDINGS: "https://call-recordings-production.up.railway.app",

  // Analytics & Reporting
  ANALYTICS: "https://analytics-service-production.up.railway.app",
  REPORTING: "https://reporting-service-production.up.railway.app",
  REAL_TIME_METRICS: "https://real-time-metrics-production.up.railway.app",

  // Business Services
  BILLING: "https://billing-service-production.up.railway.app", 
  SUBSCRIPTIONS: "https://subscriptions-production.up.railway.app",
  USAGE_TRACKING: "https://usage-tracking-production.up.railway.app",

  // Enterprise Features
  KNOWLEDGE_BASE: "https://knowledge-base-production.up.railway.app",
  LEAD_MANAGEMENT: "https://lead-management-production.up.railway.app",
  NOTIFICATIONS: "https://notifications-production.up.railway.app",
  SCHEDULING: "https://scheduling-production.up.railway.app",
  WEBHOOKS: "https://webhooks-production.up.railway.app",

  // Integrations & Data
  INTEGRATIONS: "https://integrations-production.up.railway.app",
  DATA_WAREHOUSE: "https://data-warehouse-production-f093.up.railway.app",

  // System Services
  HEALTH_CHECK: "https://health-check-production.up.railway.app",
  AUDIT_LOGS: "https://audit-logs-production.up.railway.app"
};

// 🔐 Supabase Configuration
export const SUPABASE_CONFIG = {
  URL: "https://bhzhgivqqnwvndzjthqv.supabase.co",
  ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoemhnaXZxcW53dm5kemp0aHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyODIzOTksImV4cCI6MjA0OTg1ODM5OX0.c_g7PG8qsEEsJmFXqLHvQrM7qN6z5FoO0RpKEzNlGao",
  SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoemhnaXZxcW53dm5kemp0aHF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDI4MjM5OSwiZXhwIjoyMDQ5ODU4Mzk5fQ.YfTGl35SyqEJqKCTHj1MQRoCT9F4uKc2hOQiWZkywc4"
};

// 🚀 API Client Configuration
export const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// =====================================================================================
// 📊 DASHBOARD API FUNCTIONS
// =====================================================================================

// Authentication
export const authAPI = {
  login: (credentials) => fetch(`${API_ENDPOINTS.AUTH}/login`, {
    method: 'POST',
    headers: API_CONFIG.headers,
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => fetch(`${API_ENDPOINTS.AUTH}/register`, {
    method: 'POST', 
    headers: API_CONFIG.headers,
    body: JSON.stringify(userData)
  }),

  getProfile: (token) => fetch(`${API_ENDPOINTS.AUTH}/profile`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  })
};

// Organizations
export const organizationsAPI = {
  list: (token) => fetch(`${API_ENDPOINTS.ORGANIZATIONS}/`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),
  
  create: (orgData, token) => fetch(`${API_ENDPOINTS.ORGANIZATIONS}/`, {
    method: 'POST',
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify(orgData)
  }),

  get: (orgId, token) => fetch(`${API_ENDPOINTS.ORGANIZATIONS}/${orgId}`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  })
};

// AI Agents 
export const agentsAPI = {
  list: (token) => fetch(`${API_ENDPOINTS.AI_AGENTS}/`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),

  create: (agentData, token) => fetch(`${API_ENDPOINTS.AI_AGENTS}/`, {
    method: 'POST',
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify(agentData)
  }),

  get: (agentId, token) => fetch(`${API_ENDPOINTS.AI_AGENTS}/${agentId}`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),

  update: (agentId, agentData, token) => fetch(`${API_ENDPOINTS.AI_AGENTS}/${agentId}`, {
    method: 'PUT',
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify(agentData)
  }),

  delete: (agentId, token) => fetch(`${API_ENDPOINTS.AI_AGENTS}/${agentId}`, {
    method: 'DELETE',
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  })
};

// Campaigns
export const campaignsAPI = {
  list: (token) => fetch(`${API_ENDPOINTS.CAMPAIGNS}/`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),

  create: (campaignData, token) => fetch(`${API_ENDPOINTS.CAMPAIGNS}/`, {
    method: 'POST',
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify(campaignData)
  }),

  get: (campaignId, token) => fetch(`${API_ENDPOINTS.CAMPAIGNS}/${campaignId}`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),

  start: (campaignId, token) => fetch(`${API_ENDPOINTS.CAMPAIGNS}/${campaignId}/start`, {
    method: 'POST',
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),

  stop: (campaignId, token) => fetch(`${API_ENDPOINTS.CAMPAIGNS}/${campaignId}/stop`, {
    method: 'POST', 
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  })
};

// Calls
export const callsAPI = {
  list: (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_ENDPOINTS.CALL_SERVICE}/?${queryString}`, {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
    });
  },

  get: (callId, token) => fetch(`${API_ENDPOINTS.CALL_SERVICE}/${callId}`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),

  makeCall: (callData, token) => fetch(`${API_ENDPOINTS.CALL_SERVICE}/make-call`, {
    method: 'POST',
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify(callData)
  })
};

// Analytics
export const analyticsAPI = {
  getDashboard: (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_ENDPOINTS.ANALYTICS}/dashboard?${queryString}`, {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
    });
  },

  getCallMetrics: (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_ENDPOINTS.ANALYTICS}/call-metrics?${queryString}`, {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
    });
  },

  getAgentMetrics: (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString(); 
    return fetch(`${API_ENDPOINTS.ANALYTICS}/agent-metrics?${queryString}`, {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
    });
  }
};

// Real-time Metrics
export const realTimeAPI = {
  getCurrentMetrics: (token) => fetch(`${API_ENDPOINTS.REAL_TIME_METRICS}/current`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),

  // WebSocket connection for real-time updates
  connectWebSocket: (token) => {
    return new WebSocket(`${API_ENDPOINTS.REAL_TIME_METRICS.replace('https:', 'wss:')}/ws?token=${token}`);
  }
};

// Voice Marketplace
export const voicesAPI = {
  list: (token) => fetch(`${API_ENDPOINTS.VOICE_MARKETPLACE}/`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),

  preview: (voiceId, text, token) => fetch(`${API_ENDPOINTS.VOICE_SERVICE}/preview`, {
    method: 'POST',
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ voice_id: voiceId, text })
  })
};

// Leads & CRM
export const leadsAPI = {
  list: (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_ENDPOINTS.LEAD_MANAGEMENT}/?${queryString}`, {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
    });
  },

  create: (leadData, token) => fetch(`${API_ENDPOINTS.LEAD_MANAGEMENT}/`, {
    method: 'POST',
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify(leadData)
  }),

  get: (leadId, token) => fetch(`${API_ENDPOINTS.LEAD_MANAGEMENT}/${leadId}`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  })
};

// Billing & Subscriptions
export const billingAPI = {
  getSubscription: (token) => fetch(`${API_ENDPOINTS.SUBSCRIPTIONS}/current`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  }),

  getUsage: (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_ENDPOINTS.USAGE_TRACKING}/?${queryString}`, {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
    });
  },

  getInvoices: (token) => fetch(`${API_ENDPOINTS.BILLING}/invoices`, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` }
  })
};

// =====================================================================================
// 🔥 REACT HOOKS FOR YOUR DASHBOARD  
// =====================================================================================

// Example React hooks you can use in your Vercel dashboard
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, login, logout, loading };
};

export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const response = await agentsAPI.list(token);
    const data = await response.json();
    setAgents(data);
    setLoading(false);
  };

  return { agents, fetchAgents, loading };
};

// =====================================================================================
// 🎯 INTEGRATION CHECKLIST FOR YOUR VERCEL DASHBOARD
// =====================================================================================

/*
📋 FRONTEND INTEGRATION CHECKLIST:

1. ✅ Update Environment Variables in Vercel:
   - NEXT_PUBLIC_SUPABASE_URL=https://bhzhgivqqnwvndzjthqv.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - NEXT_PUBLIC_API_GATEWAY=https://api-gateway-production.up.railway.app

2. ✅ Install Required Packages:
   npm install @supabase/supabase-js
   npm install @tanstack/react-query
   npm install axios

3. ✅ Update API calls to use Railway endpoints
   - Replace localhost URLs with Railway production URLs
   - Update authentication to use Supabase Auth

4. ✅ Test Core Features:
   - User authentication (login/register)
   - Organization dashboard
   - AI agent management  
   - Campaign creation
   - Real-time metrics

5. ✅ Add Error Handling:
   - API error boundaries
   - Loading states
   - Retry mechanisms

6. ✅ Performance Optimization:
   - React Query for caching
   - Lazy loading components
   - Image optimization

7. ✅ Security:
   - Validate JWT tokens
   - Implement RLS policies
   - Secure API calls
*/

export default {
  API_ENDPOINTS,
  SUPABASE_CONFIG,
  authAPI,
  organizationsAPI, 
  agentsAPI,
  campaignsAPI,
  callsAPI,
  analyticsAPI,
  realTimeAPI,
  voicesAPI,
  leadsAPI,
  billingAPI
};
