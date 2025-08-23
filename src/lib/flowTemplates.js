import { v4 as uuidv4 } from 'uuid';
import { NODE_TEMPLATES } from './nodeTemplates';

// Flow Template Categories
export const FLOW_CATEGORIES = {
  CUSTOMER_SERVICE: 'customer_service',
  SALES: 'sales',
  APPOINTMENT_BOOKING: 'appointment_booking',
  LEAD_QUALIFICATION: 'lead_qualification',
  SUPPORT: 'support',
  SURVEY: 'survey',
  GENERAL: 'general'
};

// Flow Template Complexity Levels
export const COMPLEXITY_LEVELS = {
  SIMPLE: 'simple',      // 3-5 nodes
  MEDIUM: 'medium',      // 6-10 nodes  
  COMPLEX: 'complex'     // 11+ nodes
};

// Flow Template Status
export const FLOW_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
};

// Predefined Flow Templates
export const FLOW_TEMPLATES = {
  // CUSTOMER SERVICE FLOWS
  basic_customer_service: {
    id: 'basic_customer_service',
    name: 'Basic Customer Service',
    description: 'Standard customer service flow with greeting, issue identification, and resolution',
    category: FLOW_CATEGORIES.CUSTOMER_SERVICE,
    complexity: COMPLEXITY_LEVELS.SIMPLE,
    icon: '🎧',
    tags: ['customer service', 'support', 'basic'],
    estimatedDuration: '3-5 minutes',
    successRate: 85,
    nodes: [
      {
        id: 'start-1',
        type: 'Start',
        position: { x: 100, y: 100 },
        data: {
          label: 'Customer Service Start',
          ...NODE_TEMPLATES.welcome_greeting.template
        }
      },
      {
        id: 'collect-1',
        type: 'Collect',
        position: { x: 100, y: 250 },
        data: {
          label: 'Issue Identification',
          prompt: 'Could you please describe the issue you\'re experiencing today?',
          mode: 'speech',
          timeoutMs: 10000,
          maxRetries: 2
        }
      },
      {
        id: 'decision-1',
        type: 'Decision',
        position: { x: 100, y: 400 },
        data: {
          label: 'Route to Department',
          conditions: [
            { condition: 'technical', response: 'I\'ll transfer you to our technical support team.' },
            { condition: 'billing', response: 'Let me connect you with our billing department.' },
            { condition: 'general', response: 'I can help you with that right now.' }
          ]
        }
      },
      {
        id: 'end-1',
        type: 'End',
        position: { x: 100, y: 550 },
        data: {
          label: 'Service Complete',
          disposition: 'resolved'
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'collect-1' },
      { id: 'e2', source: 'collect-1', target: 'decision-1' },
      { id: 'e3', source: 'decision-1', target: 'end-1' }
    ],
    metadata: {
      author: 'Vocelio AI',
      version: '1.0.0',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      useCount: 0,
      rating: 4.5
    }
  },

  sales_qualification: {
    id: 'sales_qualification',
    name: 'Sales Lead Qualification',
    description: 'Comprehensive lead qualification flow with needs assessment and scoring',
    category: FLOW_CATEGORIES.SALES,
    complexity: COMPLEXITY_LEVELS.MEDIUM,
    icon: '💼',
    tags: ['sales', 'qualification', 'leads'],
    estimatedDuration: '5-8 minutes',
    successRate: 78,
    nodes: [
      {
        id: 'start-1',
        type: 'Start',
        position: { x: 100, y: 100 },
        data: {
          label: 'Sales Greeting',
          prompt: 'Hi! Thanks for your interest in our services. I\'d love to learn more about your needs to see how we can help.',
          temperature: 0.7
        }
      },
      {
        id: 'collect-1',
        type: 'Collect',
        position: { x: 100, y: 250 },
        data: {
          label: 'Company Size',
          prompt: 'Could you tell me how many employees your company has?',
          mode: 'speech',
          timeoutMs: 8000
        }
      },
      {
        id: 'collect-2',
        type: 'Collect',
        position: { x: 300, y: 250 },
        data: {
          label: 'Current Solution',
          prompt: 'What solution are you currently using for this challenge?',
          mode: 'speech',
          timeoutMs: 10000
        }
      },
      {
        id: 'collect-3',
        type: 'Collect',
        position: { x: 500, y: 250 },
        data: {
          label: 'Budget Range',
          prompt: 'What budget range are you working with for this project?',
          mode: 'speech',
          timeoutMs: 8000
        }
      },
      {
        id: 'decision-1',
        type: 'Decision',
        position: { x: 300, y: 400 },
        data: {
          label: 'Qualification Score',
          conditions: [
            { condition: 'high_score', response: 'You seem like a great fit! Let me schedule a demo for you.' },
            { condition: 'medium_score', response: 'I\'d like to learn more about your specific needs.' },
            { condition: 'low_score', response: 'Let me send you some information to review.' }
          ]
        }
      },
      {
        id: 'end-1',
        type: 'End',
        position: { x: 300, y: 550 },
        data: {
          label: 'Qualification Complete',
          disposition: 'qualified'
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'collect-1' },
      { id: 'e2', source: 'collect-1', target: 'collect-2' },
      { id: 'e3', source: 'collect-2', target: 'collect-3' },
      { id: 'e4', source: 'collect-3', target: 'decision-1' },
      { id: 'e5', source: 'decision-1', target: 'end-1' }
    ],
    metadata: {
      author: 'Vocelio AI',
      version: '1.0.0',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      useCount: 0,
      rating: 4.7
    }
  },

  appointment_booking: {
    id: 'appointment_booking',
    name: 'Appointment Booking System',
    description: 'Complete appointment booking flow with calendar integration and confirmation',
    category: FLOW_CATEGORIES.APPOINTMENT_BOOKING,
    complexity: COMPLEXITY_LEVELS.MEDIUM,
    icon: '📅',
    tags: ['appointments', 'calendar', 'booking'],
    estimatedDuration: '4-6 minutes',
    successRate: 92,
    nodes: [
      {
        id: 'start-1',
        type: 'Start',
        position: { x: 100, y: 100 },
        data: {
          label: 'Booking Greeting',
          prompt: 'Hello! I can help you schedule an appointment. What type of service are you looking for?',
          temperature: 0.5
        }
      },
      {
        id: 'collect-1',
        type: 'Collect',
        position: { x: 100, y: 250 },
        data: {
          label: 'Service Type',
          prompt: 'What service would you like to book?',
          mode: 'speech',
          timeoutMs: 8000
        }
      },
      {
        id: 'collect-2',
        type: 'Collect',
        position: { x: 100, y: 400 },
        data: {
          label: 'Preferred Date',
          prompt: 'What date works best for you?',
          mode: 'speech',
          timeoutMs: 8000
        }
      },
      {
        id: 'collect-3',
        type: 'Collect',
        position: { x: 100, y: 550 },
        data: {
          label: 'Contact Information',
          prompt: 'Could I get your name and phone number for the appointment?',
          mode: 'speech',
          timeoutMs: 10000
        }
      },
      {
        id: 'api-1',
        type: 'API',
        position: { x: 300, y: 550 },
        data: {
          label: 'Calendar Integration',
          endpoint: '/api/calendar/book',
          method: 'POST',
          timeout: 5000
        }
      },
      {
        id: 'say-1',
        type: 'Say',
        position: { x: 300, y: 700 },
        data: {
          label: 'Confirmation',
          text: 'Perfect! Your appointment has been scheduled. You\'ll receive a confirmation text shortly.'
        }
      },
      {
        id: 'end-1',
        type: 'End',
        position: { x: 300, y: 850 },
        data: {
          label: 'Booking Complete',
          disposition: 'appointment_booked'
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'collect-1' },
      { id: 'e2', source: 'collect-1', target: 'collect-2' },
      { id: 'e3', source: 'collect-2', target: 'collect-3' },
      { id: 'e4', source: 'collect-3', target: 'api-1' },
      { id: 'e5', source: 'api-1', target: 'say-1' },
      { id: 'e6', source: 'say-1', target: 'end-1' }
    ],
    metadata: {
      author: 'Vocelio AI',
      version: '1.0.0',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      useCount: 0,
      rating: 4.8
    }
  },

  customer_survey: {
    id: 'customer_survey',
    name: 'Customer Satisfaction Survey',
    description: 'Automated customer satisfaction survey with NPS scoring',
    category: FLOW_CATEGORIES.SURVEY,
    complexity: COMPLEXITY_LEVELS.SIMPLE,
    icon: '📊',
    tags: ['survey', 'feedback', 'nps'],
    estimatedDuration: '2-3 minutes',
    successRate: 89,
    nodes: [
      {
        id: 'start-1',
        type: 'Start',
        position: { x: 100, y: 100 },
        data: {
          label: 'Survey Introduction',
          prompt: 'Thank you for choosing our service! Could you spare a moment for a quick satisfaction survey?',
          temperature: 0.3
        }
      },
      {
        id: 'collect-1',
        type: 'Collect',
        position: { x: 100, y: 250 },
        data: {
          label: 'NPS Score',
          prompt: 'On a scale of 1 to 10, how likely are you to recommend us to a friend or colleague?',
          mode: 'speech',
          timeoutMs: 8000
        }
      },
      {
        id: 'collect-2',
        type: 'Collect',
        position: { x: 100, y: 400 },
        data: {
          label: 'Feedback',
          prompt: 'What could we do to improve your experience?',
          mode: 'speech',
          timeoutMs: 15000
        }
      },
      {
        id: 'say-1',
        type: 'Say',
        position: { x: 100, y: 550 },
        data: {
          label: 'Thank You',
          text: 'Thank you for your valuable feedback! We truly appreciate your time.'
        }
      },
      {
        id: 'end-1',
        type: 'End',
        position: { x: 100, y: 700 },
        data: {
          label: 'Survey Complete',
          disposition: 'survey_completed'
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'collect-1' },
      { id: 'e2', source: 'collect-1', target: 'collect-2' },
      { id: 'e3', source: 'collect-2', target: 'say-1' },
      { id: 'e4', source: 'say-1', target: 'end-1' }
    ],
    metadata: {
      author: 'Vocelio AI',
      version: '1.0.0',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      useCount: 0,
      rating: 4.4
    }
  },

  technical_support: {
    id: 'technical_support',
    name: 'Technical Support Troubleshooting',
    description: 'Structured technical support flow with diagnostics and escalation',
    category: FLOW_CATEGORIES.SUPPORT,
    complexity: COMPLEXITY_LEVELS.COMPLEX,
    icon: '🔧',
    tags: ['technical', 'support', 'troubleshooting'],
    estimatedDuration: '8-12 minutes',
    successRate: 73,
    nodes: [
      {
        id: 'start-1',
        type: 'Start',
        position: { x: 100, y: 100 },
        data: {
          label: 'Tech Support Greeting',
          prompt: 'Hi, I\'m here to help with your technical issue. Can you describe what problem you\'re experiencing?',
          temperature: 0.4
        }
      },
      {
        id: 'collect-1',
        type: 'Collect',
        position: { x: 100, y: 250 },
        data: {
          label: 'Problem Description',
          prompt: 'Please describe the technical issue in detail.',
          mode: 'speech',
          timeoutMs: 20000
        }
      },
      {
        id: 'decision-1',
        type: 'Decision',
        position: { x: 100, y: 400 },
        data: {
          label: 'Issue Classification',
          conditions: [
            { condition: 'hardware', response: 'This sounds like a hardware issue. Let\'s run some diagnostics.' },
            { condition: 'software', response: 'This appears to be a software problem. Let\'s troubleshoot.' },
            { condition: 'network', response: 'This seems network-related. Let\'s check your connection.' }
          ]
        }
      },
      {
        id: 'collect-2',
        type: 'Collect',
        position: { x: 300, y: 400 },
        data: {
          label: 'Diagnostic Steps',
          prompt: 'I\'m going to walk you through some diagnostic steps. Please let me know the result of each step.',
          mode: 'speech',
          timeoutMs: 30000
        }
      },
      {
        id: 'decision-2',
        type: 'Decision',
        position: { x: 300, y: 550 },
        data: {
          label: 'Resolution Check',
          conditions: [
            { condition: 'resolved', response: 'Great! The issue is resolved. Is there anything else I can help with?' },
            { condition: 'escalate', response: 'I\'ll transfer you to a specialist who can provide more advanced assistance.' }
          ]
        }
      },
      {
        id: 'handoff-1',
        type: 'Handoff',
        position: { x: 500, y: 550 },
        data: {
          label: 'Specialist Transfer',
          department: 'Level 2 Support',
          message: 'Transferring to specialist for advanced technical support.'
        }
      },
      {
        id: 'end-1',
        type: 'End',
        position: { x: 300, y: 700 },
        data: {
          label: 'Support Complete',
          disposition: 'resolved'
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'collect-1' },
      { id: 'e2', source: 'collect-1', target: 'decision-1' },
      { id: 'e3', source: 'decision-1', target: 'collect-2' },
      { id: 'e4', source: 'collect-2', target: 'decision-2' },
      { id: 'e5', source: 'decision-2', target: 'end-1' },
      { id: 'e6', source: 'decision-2', target: 'handoff-1' },
      { id: 'e7', source: 'handoff-1', target: 'end-1' }
    ],
    metadata: {
      author: 'Vocelio AI',
      version: '1.0.0',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      useCount: 0,
      rating: 4.6
    }
  }
};

// Utility functions
export const getFlowsByCategory = (category) => {
  if (category === 'all') {
    return Object.values(FLOW_TEMPLATES);
  }
  return Object.values(FLOW_TEMPLATES).filter(flow => flow.category === category);
};

export const searchFlowTemplates = (query) => {
  const searchLower = query.toLowerCase();
  return Object.values(FLOW_TEMPLATES).filter(flow =>
    flow.name.toLowerCase().includes(searchLower) ||
    flow.description.toLowerCase().includes(searchLower) ||
    flow.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

export const getFlowsByComplexity = (complexity) => {
  return Object.values(FLOW_TEMPLATES).filter(flow => flow.complexity === complexity);
};

export const getPopularFlows = (limit = 5) => {
  return Object.values(FLOW_TEMPLATES)
    .sort((a, b) => (b.metadata.useCount || 0) - (a.metadata.useCount || 0))
    .slice(0, limit);
};

export const getHighRatedFlows = (minRating = 4.0, limit = 5) => {
  return Object.values(FLOW_TEMPLATES)
    .filter(flow => (flow.metadata.rating || 0) >= minRating)
    .sort((a, b) => (b.metadata.rating || 0) - (a.metadata.rating || 0))
    .slice(0, limit);
};

// Create a flow from template
export const createFlowFromTemplate = (templateId, customizations = {}) => {
  const template = FLOW_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  // Deep clone the template
  const newFlow = {
    ...JSON.parse(JSON.stringify(template)),
    id: uuidv4(),
    name: customizations.name || `${template.name} - Copy`,
    ...customizations
  };

  // Generate new IDs for nodes and edges
  const nodeIdMap = {};
  
  newFlow.nodes = newFlow.nodes.map(node => {
    const newId = uuidv4();
    nodeIdMap[node.id] = newId;
    return {
      ...node,
      id: newId
    };
  });

  newFlow.edges = newFlow.edges.map(edge => ({
    ...edge,
    id: uuidv4(),
    source: nodeIdMap[edge.source],
    target: nodeIdMap[edge.target]
  }));

  // Update metadata
  newFlow.metadata = {
    ...newFlow.metadata,
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    originalTemplate: templateId,
    useCount: 0
  };

  return newFlow;
};

// Export/Import functions
export const exportFlowTemplate = (flow) => {
  const template = {
    ...flow,
    metadata: {
      ...flow.metadata,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0.0'
    }
  };
  
  return JSON.stringify(template, null, 2);
};

export const importFlowTemplate = (jsonString) => {
  try {
    const template = JSON.parse(jsonString);
    
    // Validate required fields
    const requiredFields = ['id', 'name', 'description', 'category', 'nodes', 'edges'];
    const missingFields = requiredFields.filter(field => !template[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Generate new ID to avoid conflicts
    template.id = uuidv4();
    template.metadata = {
      ...template.metadata,
      imported: true,
      importedAt: new Date().toISOString()
    };
    
    return template;
  } catch (error) {
    throw new Error(`Failed to import template: ${error.message}`);
  }
};

// Flow template analytics
export const getFlowTemplateAnalytics = () => {
  const templates = Object.values(FLOW_TEMPLATES);
  
  return {
    totalTemplates: templates.length,
    categoryCounts: Object.values(FLOW_CATEGORIES).reduce((acc, category) => {
      acc[category] = templates.filter(t => t.category === category).length;
      return acc;
    }, {}),
    complexityDistribution: Object.values(COMPLEXITY_LEVELS).reduce((acc, complexity) => {
      acc[complexity] = templates.filter(t => t.complexity === complexity).length;
      return acc;
    }, {}),
    averageRating: templates.reduce((sum, t) => sum + (t.metadata.rating || 0), 0) / templates.length,
    totalUseCount: templates.reduce((sum, t) => sum + (t.metadata.useCount || 0), 0),
    mostPopular: templates.reduce((max, t) => 
      (t.metadata.useCount || 0) > (max.metadata.useCount || 0) ? t : max, templates[0]
    ),
    highestRated: templates.reduce((max, t) => 
      (t.metadata.rating || 0) > (max.metadata.rating || 0) ? t : max, templates[0]
    )
  };
};
