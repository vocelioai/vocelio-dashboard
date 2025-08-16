// Vocelio.ai API Configuration
export const API_CONFIG = {
  // Core Services
  OVERVIEW: process.env.REACT_APP_OVERVIEW_API || 'https://overview.vocelio.ai',
  ANALYTICS: process.env.REACT_APP_ANALYTICS_API || 'https://analytics.vocelio.ai',
  TEAM_HUB: process.env.REACT_APP_TEAM_HUB_API || 'https://team.vocelio.ai',
  
  // Enterprise Services
  SSO_IDENTITY: process.env.REACT_APP_SSO_IDENTITY_API || 'https://identity.vocelio.ai',
  API_MANAGEMENT: process.env.REACT_APP_API_MANAGEMENT_API || 'https://apimanagement.vocelio.ai',
  ENTERPRISE_SECURITY: process.env.REACT_APP_ENTERPRISE_SECURITY_API || 'https://security.vocelio.ai',
  AUDIT_COMPLIANCE: process.env.REACT_APP_AUDIT_COMPLIANCE_API || 'https://compliance.vocelio.ai',
  
  // AI Services
  AI_AGENTS: process.env.REACT_APP_AGENTS_API || 'https://agents.vocelio.ai',
  AI_BRAIN: process.env.REACT_APP_AI_BRAIN_API || 'https://brain.vocelio.ai',
  VOICE_LAB: process.env.REACT_APP_VOICE_LAB_API || 'https://voicelab.vocelio.ai',
  SMART_CAMPAIGNS: process.env.REACT_APP_CAMPAIGNS_API || 'https://campaigns.vocelio.ai',
  
  // Communication Services
  CALL_CENTER: process.env.REACT_APP_CALL_CENTER_API || 'https://call.vocelio.ai',
  PHONE_NUMBERS: process.env.REACT_APP_PHONE_NUMBERS_API || 'https://numbers.vocelio.ai',
  NOTIFICATIONS: process.env.REACT_APP_NOTIFICATIONS_API || 'https://notifications.vocelio.ai',
  
  // Business Services
  BILLING: process.env.REACT_APP_BILLING_API || 'https://billing.vocelio.ai',
  LEAD_MANAGEMENT: process.env.REACT_APP_LEAD_MANAGEMENT_API || 'https://lead.vocelio.ai',
  SCHEDULING: process.env.REACT_APP_SCHEDULING_API || 'https://scheduling.vocelio.ai',
  
  // Integration Services
  INTEGRATIONS: process.env.REACT_APP_INTEGRATIONS_API || 'https://integrations.vocelio.ai',
  FLOW_BUILDER: process.env.REACT_APP_FLOW_BUILDER_API || 'https://flowbuilder.vocelio.ai',
  VOICE_MARKETPLACE: process.env.REACT_APP_VOICE_MARKETPLACE_API || 'https://voicemarketplace.vocelio.ai',
  
  // Additional Services
  DEVELOPER_API: process.env.REACT_APP_DEVELOPER_API || 'https://developer.vocelio.ai',
  WHITE_LABEL: process.env.REACT_APP_WHITE_LABEL_API || 'https://whitelabel.vocelio.ai',
  COMPLIANCE: process.env.REACT_APP_COMPLIANCE_API || 'https://compliance.vocelio.ai',
  SETTINGS: process.env.REACT_APP_SETTINGS_API || 'https://settings.vocelio.ai',
  
  // Main API Gateway
  API_GATEWAY: process.env.REACT_APP_API_GATEWAY || 'https://api-gateway.vocelio.ai',
  
  // Twilio Integration (existing)
  TWILIO_API: process.env.REACT_APP_RAILWAY_API_URL || 'https://api-gateway.vocelio.ai',
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
