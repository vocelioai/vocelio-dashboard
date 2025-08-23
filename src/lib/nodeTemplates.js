import { v4 as uuidv4 } from 'uuid';

// Node Template Categories
export const TEMPLATE_CATEGORIES = {
  GREETING: 'greeting',
  INFORMATION: 'information', 
  DECISION: 'decision',
  DATA_COLLECTION: 'data_collection',
  VOICE_ACTIONS: 'voice_actions',
  INTEGRATION: 'integration',
  WORKFLOW: 'workflow'
};

// Predefined Node Templates
export const NODE_TEMPLATES = {
  // GREETING TEMPLATES
  welcome_greeting: {
    id: 'welcome_greeting',
    category: TEMPLATE_CATEGORIES.GREETING,
    name: 'Welcome Greeting',
    description: 'Standard welcome message for new callers',
    icon: '👋',
    template: {
      type: 'Large Text',
      staticText: true,
      prompt: 'Hello! Welcome to our service. How can I help you today?',
      plainText: 'Hello! Welcome to our service. How can I help you today?',
      loopCondition: 'Wait for user response and proceed to next node',
      temperature: 0.3,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  business_hours_greeting: {
    id: 'business_hours_greeting',
    category: TEMPLATE_CATEGORIES.GREETING,
    name: 'Business Hours Greeting',
    description: 'Greeting with business hours information',
    icon: '🕐',
    template: {
      type: 'Large Text',
      staticText: true,
      prompt: 'Thank you for calling! Our business hours are Monday through Friday, 9 AM to 5 PM. How may I assist you?',
      plainText: 'Thank you for calling! Our business hours are Monday through Friday, 9 AM to 5 PM. How may I assist you?',
      loopCondition: 'Wait for user response',
      temperature: 0.3,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  // INFORMATION TEMPLATES
  company_info: {
    id: 'company_info',
    category: TEMPLATE_CATEGORIES.INFORMATION,
    name: 'Company Information',
    description: 'Provide company details and services',
    icon: '🏢',
    template: {
      type: 'Large Text',
      staticText: false,
      prompt: 'Provide comprehensive information about our company, including our main services, location, and key contact details. Be informative and professional.',
      plainText: '',
      loopCondition: 'After providing information, ask if they need anything else',
      temperature: 0.4,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: true,
      disableRecording: false
    }
  },

  service_overview: {
    id: 'service_overview',
    category: TEMPLATE_CATEGORIES.INFORMATION,
    name: 'Service Overview',
    description: 'Explain available services and offerings',
    icon: '🛍️',
    template: {
      type: 'Large Text',
      staticText: false,
      prompt: 'Explain our available services in detail. Highlight key benefits and help the caller understand which service might be best for their needs.',
      plainText: '',
      loopCondition: 'Ask which service they are interested in learning more about',
      temperature: 0.5,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  // DECISION TEMPLATES
  yes_no_decision: {
    id: 'yes_no_decision',
    category: TEMPLATE_CATEGORIES.DECISION,
    name: 'Yes/No Decision',
    description: 'Simple yes or no decision point',
    icon: '❓',
    template: {
      type: 'Decision',
      staticText: false,
      prompt: 'Ask a yes or no question and wait for the user\'s response. Be clear about the options available.',
      plainText: '',
      loopCondition: 'Listen for yes, no, or similar responses. Route accordingly.',
      temperature: 0.3,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  service_selection: {
    id: 'service_selection',
    category: TEMPLATE_CATEGORIES.DECISION,
    name: 'Service Selection',
    description: 'Let caller choose from multiple services',
    icon: '🎯',
    template: {
      type: 'Decision',
      staticText: false,
      prompt: 'Present multiple service options clearly and ask the caller to choose which one they need. Provide brief descriptions of each option.',
      plainText: '',
      loopCondition: 'Wait for service selection and route to appropriate service handler',
      temperature: 0.4,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  // DATA COLLECTION TEMPLATES
  contact_info: {
    id: 'contact_info',
    category: TEMPLATE_CATEGORIES.DATA_COLLECTION,
    name: 'Contact Information',
    description: 'Collect caller\'s contact details',
    icon: '📞',
    template: {
      type: 'Collect Info',
      staticText: false,
      prompt: 'Collect the caller\'s contact information including name, phone number, and email address. Be polite and explain why you need this information.',
      plainText: '',
      loopCondition: 'Ensure all required contact fields are collected before proceeding',
      temperature: 0.3,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  appointment_details: {
    id: 'appointment_details',
    category: TEMPLATE_CATEGORIES.DATA_COLLECTION,
    name: 'Appointment Details',
    description: 'Gather appointment scheduling information',
    icon: '📅',
    template: {
      type: 'Collect Info',
      staticText: false,
      prompt: 'Collect appointment preferences including preferred date, time, service type, and any special requirements. Check availability and confirm details.',
      plainText: '',
      loopCondition: 'Collect all appointment details and verify availability',
      temperature: 0.4,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  customer_feedback: {
    id: 'customer_feedback',
    category: TEMPLATE_CATEGORIES.DATA_COLLECTION,
    name: 'Customer Feedback',
    description: 'Collect customer satisfaction feedback',
    icon: '⭐',
    template: {
      type: 'Collect Info',
      staticText: false,
      prompt: 'Ask for customer feedback about their experience. Be encouraging and ask specific questions about service quality, satisfaction level, and suggestions for improvement.',
      plainText: '',
      loopCondition: 'Collect feedback rating and any additional comments',
      temperature: 0.5,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  // VOICE ACTION TEMPLATES
  hold_music: {
    id: 'hold_music',
    category: TEMPLATE_CATEGORIES.VOICE_ACTIONS,
    name: 'Hold with Music',
    description: 'Put caller on hold with background music',
    icon: '🎵',
    template: {
      type: 'Small Text',
      staticText: true,
      prompt: 'Please hold while I connect you with the right person. I\'ll play some music while you wait.',
      plainText: 'Please hold while I connect you with the right person. I\'ll play some music while you wait.',
      loopCondition: 'Play hold music until transfer is complete',
      temperature: 0.2,
      globalNode: false,
      skipResponse: true,
      blockInterruptions: true,
      disableRecording: true
    }
  },

  transfer_notification: {
    id: 'transfer_notification',
    category: TEMPLATE_CATEGORIES.VOICE_ACTIONS,
    name: 'Transfer Notification',
    description: 'Notify caller about call transfer',
    icon: '📞',
    template: {
      type: 'Small Text',
      staticText: true,
      prompt: 'I\'m now transferring you to the appropriate department. Please stay on the line.',
      plainText: 'I\'m now transferring you to the appropriate department. Please stay on the line.',
      loopCondition: 'Execute transfer after message',
      temperature: 0.2,
      globalNode: false,
      skipResponse: true,
      blockInterruptions: true,
      disableRecording: false
    }
  },

  // INTEGRATION TEMPLATES
  crm_lookup: {
    id: 'crm_lookup',
    category: TEMPLATE_CATEGORIES.INTEGRATION,
    name: 'CRM Customer Lookup',
    description: 'Look up customer information in CRM system',
    icon: '🔍',
    template: {
      type: 'Collect Info',
      staticText: false,
      prompt: 'I\'ll look up your information in our system. Can you please provide your phone number or email address?',
      plainText: '',
      loopCondition: 'Use provided information to query CRM and retrieve customer data',
      temperature: 0.3,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  api_integration: {
    id: 'api_integration',
    category: TEMPLATE_CATEGORIES.INTEGRATION,
    name: 'API Data Fetch',
    description: 'Fetch data from external API',
    icon: '🔌',
    template: {
      type: 'Small Text',
      staticText: false,
      prompt: 'Let me check our system for the latest information. This will just take a moment.',
      plainText: '',
      loopCondition: 'Execute API call and process response data',
      temperature: 0.2,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: true,
      disableRecording: false
    }
  },

  // WORKFLOW TEMPLATES
  escalation_handler: {
    id: 'escalation_handler',
    category: TEMPLATE_CATEGORIES.WORKFLOW,
    name: 'Escalation Handler',
    description: 'Handle escalated customer issues',
    icon: '🆘',
    template: {
      type: 'Decision',
      staticText: false,
      prompt: 'I understand you\'re experiencing difficulties. Let me help resolve this issue for you. Can you please describe the problem in detail?',
      plainText: '',
      loopCondition: 'Assess issue complexity and either resolve or escalate to human agent',
      temperature: 0.6,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  callback_scheduler: {
    id: 'callback_scheduler',
    category: TEMPLATE_CATEGORIES.WORKFLOW,
    name: 'Callback Scheduler',
    description: 'Schedule a callback for the customer',
    icon: '📞',
    template: {
      type: 'Collect Info',
      staticText: false,
      prompt: 'I can schedule a callback for you. What would be the best time to reach you? Please provide your preferred date, time, and phone number.',
      plainText: '',
      loopCondition: 'Collect callback preferences and schedule in system',
      temperature: 0.4,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  },

  closing_summary: {
    id: 'closing_summary',
    category: TEMPLATE_CATEGORIES.WORKFLOW,
    name: 'Call Closing Summary',
    description: 'Summarize call and next steps',
    icon: '📋',
    template: {
      type: 'Large Text',
      staticText: false,
      prompt: 'Let me summarize what we\'ve discussed today and confirm the next steps. Provide a clear summary and ask if there\'s anything else they need.',
      plainText: '',
      loopCondition: 'Provide summary, confirm understanding, and close call professionally',
      temperature: 0.4,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    }
  }
};

// Helper functions
export const getTemplatesByCategory = (category) => {
  return Object.values(NODE_TEMPLATES).filter(template => template.category === category);
};

export const getAllCategories = () => {
  return Object.values(TEMPLATE_CATEGORIES);
};

export const getTemplateById = (id) => {
  return NODE_TEMPLATES[id];
};

export const createNodeFromTemplate = (templateId, position = { x: 0, y: 0 }) => {
  const template = getTemplateById(templateId);
  if (!template) return null;

  const nodeId = `node_${uuidv4()}`;
  
  return {
    id: nodeId,
    type: 'custom',
    position,
    data: {
      label: template.name,
      content: template.template.prompt,
      plainText: template.template.plainText,
      loopCondition: template.template.loopCondition,
      temperature: template.template.temperature,
      staticText: template.template.staticText,
      globalNode: template.template.globalNode,
      skipResponse: template.template.skipResponse,
      blockInterruptions: template.template.blockInterruptions,
      disableRecording: template.template.disableRecording,
      nodeType: template.template.type,
      templateId: templateId,
      icon: template.icon
    },
    draggable: true,
    selectable: true
  };
};

export const searchTemplates = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(NODE_TEMPLATES).filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery)
  );
};
