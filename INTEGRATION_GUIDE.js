// =====================================================================================
// 🚀 VOCELIO API INTEGRATION GUIDE
// =====================================================================================
// Step-by-step guide to integrate your new unified API client with existing dashboard
// =====================================================================================

/*
📋 INTEGRATION CHECKLIST:

✅ 1. Install Required Dependencies
   npm install @supabase/supabase-js @tanstack/react-query axios

✅ 2. Environment Variables Added
   - All new API endpoints added to .env.local
   - Supabase configuration ready

✅ 3. New Unified API Client Created
   - Location: src/api/unifiedApiClient.js
   - Combines your existing config with new backend endpoints
   - Includes error handling, retries, and authentication

🔄 4. Update Your Components (NEXT STEPS):

   REPLACE OLD IMPORTS:
   // OLD
   import { apiClient } from '../api/apiClients.js';
   
   // NEW  
   import { agents, campaigns, calls, analytics } from '../api/unifiedApiClient.js';

   UPDATE COMPONENT USAGE:
   // OLD
   const response = await apiClient.get('/agents');
   
   // NEW
   const agentsData = await agents.list();

📊 5. Component Update Examples:

   // For AI Agents Page
   import { useAgents } from '../api/unifiedApiClient.js';
   
   const AIAgentsPage = () => {
     const { agents, loading, error, refetch } = useAgents();
     
     if (loading) return <div>Loading agents...</div>;
     if (error) return <div>Error: {error}</div>;
     
     return (
       <div>
         {agents.map(agent => (
           <AgentCard key={agent.id} agent={agent} />
         ))}
       </div>
     );
   };

   // For Campaign Management
   import { useCampaigns } from '../api/unifiedApiClient.js';
   
   const CampaignsPage = () => {
     const { campaigns, loading, refetch } = useCampaigns();
     
     const handleStartCampaign = async (campaignId) => {
       await campaigns.start(campaignId);
       refetch(); // Refresh the list
     };
   };

   // For Authentication
   import { useAuth } from '../api/unifiedApiClient.js';
   
   const LoginPage = () => {
     const { user, login, logout, loading } = useAuth();
     
     const handleLogin = async (email, password) => {
       await login({ email, password });
       // User will be automatically updated
     };
   };

🔄 6. Real-time Features
   
   // Add to your dashboard components
   import { useRealTimeMetrics } from '../api/unifiedApiClient.js';
   
   const Dashboard = () => {
     const { metrics, connected } = useRealTimeMetrics();
     
     return (
       <div>
         <div className={`status ${connected ? 'online' : 'offline'}`}>
           {connected ? 'Live' : 'Offline'}
         </div>
         {metrics && (
           <div>
             <p>Active Calls: {metrics.activeCalls}</p>
             <p>Total Agents: {metrics.totalAgents}</p>
           </div>
         )}
       </div>
     );
   };

🔐 7. Authentication Integration

   Your existing Supabase is already configured. The new API client will:
   - Automatically use Supabase JWT tokens
   - Handle token refresh
   - Include proper authorization headers

📈 8. Error Handling & Loading States

   All hooks include proper error handling:
   - loading: boolean
   - error: string | null  
   - data: the actual API response

🚀 9. Health Monitoring

   Use the health check function in your dashboard:
   
   import { checkAllServicesHealth } from '../api/unifiedApiClient.js';
   
   const HealthMonitor = () => {
     const [health, setHealth] = useState({});
     
     useEffect(() => {
       const checkHealth = async () => {
         const results = await checkAllServicesHealth();
         setHealth(results);
       };
       
       checkHealth();
       const interval = setInterval(checkHealth, 60000); // Every minute
       return () => clearInterval(interval);
     }, []);
   };

*/

// =====================================================================================
// 🔄 COMPONENT MIGRATION EXAMPLES
// =====================================================================================

// Example 1: Migrating AI Agents Component
export const migrateAIAgentsExample = `
// BEFORE - src/pages/AIAgents.js
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClients.js';

const AIAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await apiClient.get('/ai-agents/');
        setAgents(response);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, []);

  return (
    <div>
      {loading ? <div>Loading...</div> : (
        agents.map(agent => <AgentCard key={agent.id} agent={agent} />)
      )}
    </div>
  );
};

// AFTER - using new unified API client
import React from 'react';
import { useAgents } from '../api/unifiedApiClient.js';

const AIAgents = () => {
  const { agents, loading, error } = useAgents();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
    </div>
  );
};
`;

// Example 2: Migrating Campaign Component  
export const migrateCampaignsExample = `
// BEFORE - Manual API calls
const handleCreateCampaign = async (campaignData) => {
  try {
    setLoading(true);
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData)
    });
    const newCampaign = await response.json();
    setCampaigns(prev => [...prev, newCampaign]);
  } catch (error) {
    console.error('Failed to create campaign:', error);
  } finally {
    setLoading(false);
  }
};

// AFTER - using unified API client
import { campaigns } from '../api/unifiedApiClient.js';

const handleCreateCampaign = async (campaignData) => {
  try {
    setLoading(true);
    const newCampaign = await campaigns.create(campaignData);
    setCampaigns(prev => [...prev, newCampaign]);
  } catch (error) {
    console.error('Failed to create campaign:', error);
  } finally {
    setLoading(false);
  }
};
`;

// Example 3: Authentication Integration
export const migrateAuthExample = `
// BEFORE - Manual authentication
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

const login = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const { user, token } = await response.json();
    localStorage.setItem('token', token);
    setUser(user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// AFTER - using unified auth hook
import { useAuth } from '../api/unifiedApiClient.js';

const LoginPage = () => {
  const { user, login, loading } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      await login({ email, password });
      // User state automatically updated
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
};
`;

// =====================================================================================
// 📋 PRIORITY UPDATE LIST
// =====================================================================================

export const priorityUpdates = [
  {
    priority: 'HIGH',
    component: 'src/pages/AIAgents.js',
    action: 'Replace manual API calls with useAgents() hook',
    impact: 'Improved error handling and loading states'
  },
  {
    priority: 'HIGH', 
    component: 'src/pages/SmartCampaigns.js',
    action: 'Replace manual API calls with useCampaigns() hook',
    impact: 'Real-time campaign updates'
  },
  {
    priority: 'HIGH',
    component: 'src/App.js',
    action: 'Replace authentication with useAuth() hook',
    impact: 'Proper Supabase integration'
  },
  {
    priority: 'MEDIUM',
    component: 'src/pages/CallCenter-new.js',
    action: 'Add real-time metrics with useRealTimeMetrics()',
    impact: 'Live call center data'
  },
  {
    priority: 'MEDIUM',
    component: 'src/pages/AnalyticsPro.js',
    action: 'Use new analytics API functions',
    impact: 'Better analytics data handling'
  },
  {
    priority: 'LOW',
    component: 'src/components/ServiceHealthMonitor.js',
    action: 'Use checkAllServicesHealth() function',
    impact: 'More accurate health monitoring'
  }
];

// =====================================================================================
// 🚀 DEPLOYMENT READY CHECKLIST
// =====================================================================================

export const deploymentChecklist = `
✅ 1. Dependencies Installed
   npm install @supabase/supabase-js

✅ 2. Environment Variables Updated
   - All new API endpoints added to .env.local
   - Ready for Vercel deployment

✅ 3. Unified API Client Created
   - Handles authentication automatically
   - Includes retry logic and error handling
   - WebSocket support for real-time features

🔄 4. Component Updates (In Progress)
   - Update components to use new hooks
   - Replace manual API calls
   - Add proper error boundaries

🚀 5. Ready for Production
   - All Railway service URLs configured
   - Supabase authentication ready
   - Real-time features available
   - Health monitoring included

📊 6. Benefits of New Integration
   - Automatic JWT token handling
   - Built-in retry mechanisms
   - Real-time WebSocket connections
   - Consistent error handling
   - TypeScript-ready structure
   - Better loading states
`;

console.log('🚀 Vocelio API Integration Guide loaded!');
console.log('📋 Check the priorityUpdates array for next steps');
console.log('💡 Use the migration examples to update your components');

export default {
  migrateAIAgentsExample,
  migrateCampaignsExample, 
  migrateAuthExample,
  priorityUpdates,
  deploymentChecklist
};
