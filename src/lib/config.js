// Vocelio.ai API Configuration
export const API_CONFIG = {
  // Core Services
  OVERVIEW: process.env.REACT_APP_OVERVIEW_API || 'https://overview-production.up.railway.app',
  ANALYTICS: process.env.REACT_APP_ANALYTICS_API || 'https://analytics-pro-production.up.railway.app',
  TEAM_HUB: process.env.REACT_APP_TEAM_HUB_API || 'https://team-hub-production.up.railway.app',
  
  // Enterprise Services
  SSO_IDENTITY: process.env.REACT_APP_SSO_IDENTITY_API || 'https://sso-identity-production.up.railway.app',
  API_MANAGEMENT: process.env.REACT_APP_API_MANAGEMENT_API || 'https://api-management-production.up.railway.app',
  ENTERPRISE_SECURITY: process.env.REACT_APP_ENTERPRISE_SECURITY_API || 'https://enterprise-security-production.up.railway.app',
  AUDIT_COMPLIANCE: process.env.REACT_APP_AUDIT_COMPLIANCE_API || 'https://audit-compliance-production.up.railway.app',
  
  // AI Services
  AI_AGENTS: process.env.REACT_APP_AGENTS_API || 'https://ai-agents-service-production.up.railway.app',
  AI_BRAIN: process.env.REACT_APP_AI_BRAIN_API || 'https://ai-brain-production.up.railway.app',
  VOICE_LAB: process.env.REACT_APP_VOICE_LAB_API || 'https://voice-lab-production.up.railway.app',
  SMART_CAMPAIGNS: process.env.REACT_APP_CAMPAIGNS_API || 'https://smart-campaigns-production.up.railway.app',
  
  // Communication Services
  CALL_CENTER: process.env.REACT_APP_CALL_CENTER_API || 'https://call-center-production.up.railway.app',
  PHONE_NUMBERS: process.env.REACT_APP_PHONE_NUMBERS_API || 'https://phone-numbers-production.up.railway.app',
  NOTIFICATIONS: process.env.REACT_APP_NOTIFICATIONS_API || 'https://notifications-production.up.railway.app',
  
  // Business Services
  BILLING: process.env.REACT_APP_BILLING_API || 'https://billing-pro-production.up.railway.app',
  LEAD_MANAGEMENT: process.env.REACT_APP_LEAD_MANAGEMENT_API || 'https://lead-management-production.up.railway.app',
  SCHEDULING: process.env.REACT_APP_SCHEDULING_API || 'https://scheduling-production.up.railway.app',
  
  // Integration Services
  INTEGRATIONS: process.env.REACT_APP_INTEGRATIONS_API || 'https://integrations-center-production.up.railway.app',
  FLOW_BUILDER: process.env.REACT_APP_FLOW_BUILDER_API || 'https://flow-builder-production.up.railway.app',
  VOICE_MARKETPLACE: process.env.REACT_APP_VOICE_MARKETPLACE_API || 'https://voice-marketplace-production.up.railway.app',
  
  // Additional Services
  DEVELOPER_API: process.env.REACT_APP_DEVELOPER_API || 'https://developer-api-production.up.railway.app',
  WHITE_LABEL: process.env.REACT_APP_WHITE_LABEL_API || 'https://white-label-dashboard-production.up.railway.app',
  COMPLIANCE: process.env.REACT_APP_COMPLIANCE_API || 'https://compliance-production.up.railway.app',
  SETTINGS: process.env.REACT_APP_SETTINGS_API || 'https://settings-page-production.up.railway.app',
  
  // Main API Gateway
  API_GATEWAY: process.env.REACT_APP_API_GATEWAY || 'https://api-gateway-production-588d.up.railway.app',
  
  // Twilio Integration (existing)
  TWILIO_API: process.env.REACT_APP_RAILWAY_API_URL || 'https://api-gateway-production-588d.up.railway.app',
}

export const API_SETTINGS = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  VERSION: 'v1',
}

// Service health check endpoints
export const HEALTH_ENDPOINTS = Object.keys(API_CONFIG).reduce((acc, key) => {
  if (key !== 'API_GATEWAY' && key !== 'TWILIO_API') {
    acc[key] = `${API_CONFIG[key]}/health`
  }
  return acc
}, {})
