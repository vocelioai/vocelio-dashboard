/**
 * Flow Templates and Presets Manager
 * Provides predefined flow templates for common use cases
 */

export const FlowTemplates = {
  // Basic templates
  SIMPLE_GREETING: {
    id: 'simple_greeting',
    name: 'Simple Greeting',
    description: 'A basic greeting flow for incoming calls',
    category: 'basic',
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: 'Call Start', isStartNode: true }
      },
      {
        id: 'voice-1',
        type: 'voice',
        position: { x: 100, y: 200 },
        data: { 
          label: 'Welcome Message',
          text: 'Hello! Welcome to our service. How can I help you today?',
          voice: 'default',
          language: 'en-US'
        }
      },
      {
        id: 'input-1',
        type: 'input',
        position: { x: 100, y: 300 },
        data: {
          label: 'Get User Input',
          inputType: 'speech',
          prompt: 'Please speak your request',
          variable: 'user_request',
          timeout: 5000
        }
      },
      {
        id: 'voice-2',
        type: 'voice',
        position: { x: 100, y: 400 },
        data: {
          label: 'Thank You',
          text: 'Thank you for your request. We will process it shortly.',
          voice: 'default',
          language: 'en-US'
        }
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 100, y: 500 },
        data: { label: 'End Call' }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'voice-1' },
      { id: 'e2', source: 'voice-1', target: 'input-1' },
      { id: 'e3', source: 'input-1', target: 'voice-2' },
      { id: 'e4', source: 'voice-2', target: 'end-1' }
    ]
  },

  CUSTOMER_SUPPORT: {
    id: 'customer_support',
    name: 'Customer Support Flow',
    description: 'Interactive customer support with menu options',
    category: 'support',
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: 'Call Start', isStartNode: true }
      },
      {
        id: 'voice-welcome',
        type: 'voice',
        position: { x: 100, y: 200 },
        data: {
          label: 'Welcome Message',
          text: 'Welcome to customer support. Press 1 for billing, 2 for technical support, or 3 for general inquiries.',
          voice: 'default',
          language: 'en-US'
        }
      },
      {
        id: 'input-menu',
        type: 'input',
        position: { x: 100, y: 300 },
        data: {
          label: 'Menu Selection',
          inputType: 'dtmf',
          prompt: 'Please press a number',
          variable: 'menu_choice',
          validation: { type: 'options', values: ['1', '2', '3'] }
        }
      },
      {
        id: 'condition-menu',
        type: 'condition',
        position: { x: 100, y: 400 },
        data: {
          label: 'Route Call',
          condition: '$menu_choice == "1"',
          leftOperand: 'menu_choice',
          operator: '==',
          rightOperand: '1'
        }
      },
      {
        id: 'voice-billing',
        type: 'voice',
        position: { x: -100, y: 500 },
        data: {
          label: 'Billing Department',
          text: 'Connecting you to our billing department. Please hold.',
          voice: 'default'
        }
      },
      {
        id: 'voice-technical',
        type: 'voice',
        position: { x: 100, y: 500 },
        data: {
          label: 'Technical Support',
          text: 'Connecting you to technical support. Please hold.',
          voice: 'default'
        }
      },
      {
        id: 'voice-general',
        type: 'voice',
        position: { x: 300, y: 500 },
        data: {
          label: 'General Inquiries',
          text: 'Connecting you to our general inquiry team. Please hold.',
          voice: 'default'
        }
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 100, y: 600 },
        data: { label: 'End Call' }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'voice-welcome' },
      { id: 'e2', source: 'voice-welcome', target: 'input-menu' },
      { id: 'e3', source: 'input-menu', target: 'condition-menu' },
      { id: 'e4', source: 'condition-menu', target: 'voice-billing', label: 'billing' },
      { id: 'e5', source: 'condition-menu', target: 'voice-technical', label: 'technical' },
      { id: 'e6', source: 'condition-menu', target: 'voice-general', label: 'general' },
      { id: 'e7', source: 'voice-billing', target: 'end-1' },
      { id: 'e8', source: 'voice-technical', target: 'end-1' },
      { id: 'e9', source: 'voice-general', target: 'end-1' }
    ]
  },

  SURVEY_FLOW: {
    id: 'survey_flow',
    name: 'Customer Survey',
    description: 'Automated customer satisfaction survey',
    category: 'survey',
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: 'Survey Start', isStartNode: true }
      },
      {
        id: 'voice-intro',
        type: 'voice',
        position: { x: 100, y: 200 },
        data: {
          label: 'Survey Introduction',
          text: 'Thank you for choosing our service. We would like to get your feedback. This survey will take about 2 minutes.',
          voice: 'default'
        }
      },
      {
        id: 'voice-q1',
        type: 'voice',
        position: { x: 100, y: 300 },
        data: {
          label: 'Question 1',
          text: 'On a scale of 1 to 5, how satisfied are you with our service? Press the number on your keypad.',
          voice: 'default'
        }
      },
      {
        id: 'input-q1',
        type: 'input',
        position: { x: 100, y: 400 },
        data: {
          label: 'Satisfaction Rating',
          inputType: 'dtmf',
          variable: 'satisfaction',
          validation: { type: 'range', min: 1, max: 5 }
        }
      },
      {
        id: 'condition-followup',
        type: 'condition',
        position: { x: 100, y: 500 },
        data: {
          label: 'Check Rating',
          leftOperand: 'satisfaction',
          operator: '<',
          rightOperand: '4'
        }
      },
      {
        id: 'voice-followup',
        type: 'voice',
        position: { x: -100, y: 600 },
        data: {
          label: 'Follow-up Question',
          text: 'We are sorry to hear that. Could you please tell us what we can improve?',
          voice: 'default'
        }
      },
      {
        id: 'input-feedback',
        type: 'input',
        position: { x: -100, y: 700 },
        data: {
          label: 'Feedback',
          inputType: 'speech',
          variable: 'feedback',
          timeout: 30000
        }
      },
      {
        id: 'voice-thanks',
        type: 'voice',
        position: { x: 100, y: 800 },
        data: {
          label: 'Thank You',
          text: 'Thank you for your valuable feedback. Have a great day!',
          voice: 'default'
        }
      },
      {
        id: 'api-save',
        type: 'api',
        position: { x: 100, y: 900 },
        data: {
          label: 'Save Survey',
          url: '/api/survey/save',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            satisfaction: '$satisfaction',
            feedback: '$feedback',
            timestamp: '$timestamp'
          }
        }
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 100, y: 1000 },
        data: { label: 'End Survey' }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'voice-intro' },
      { id: 'e2', source: 'voice-intro', target: 'voice-q1' },
      { id: 'e3', source: 'voice-q1', target: 'input-q1' },
      { id: 'e4', source: 'input-q1', target: 'condition-followup' },
      { id: 'e5', source: 'condition-followup', target: 'voice-followup', label: 'low rating' },
      { id: 'e6', source: 'condition-followup', target: 'voice-thanks', label: 'good rating' },
      { id: 'e7', source: 'voice-followup', target: 'input-feedback' },
      { id: 'e8', source: 'input-feedback', target: 'voice-thanks' },
      { id: 'e9', source: 'voice-thanks', target: 'api-save' },
      { id: 'e10', source: 'api-save', target: 'end-1' }
    ]
  }
};

export const FlowCategories = {
  basic: { name: 'Basic Flows', icon: '📞', color: 'bg-blue-500' },
  support: { name: 'Customer Support', icon: '🎧', color: 'bg-green-500' },
  survey: { name: 'Surveys & Feedback', icon: '📊', color: 'bg-purple-500' }
};

export class FlowTemplateManager {
  constructor() {
    this.templates = { ...FlowTemplates };
    this.customTemplates = this.loadCustomTemplates();
  }

  getAllTemplates() {
    return { ...this.templates, ...this.customTemplates };
  }

  getTemplatesByCategory(category) {
    const allTemplates = this.getAllTemplates();
    return Object.values(allTemplates).filter(template => template.category === category);
  }

  getTemplate(templateId) {
    const allTemplates = this.getAllTemplates();
    return allTemplates[templateId];
  }

  saveCustomTemplate(template) {
    const templateId = template.id || `custom_${Date.now()}`;
    const customTemplate = {
      ...template,
      id: templateId,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    
    this.customTemplates[templateId] = customTemplate;
    this.saveCustomTemplates();
    
    return templateId;
  }

  loadCustomTemplates() {
    try {
      const saved = localStorage.getItem('vocelio_custom_flow_templates');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading custom templates:', error);
      return {};
    }
  }

  saveCustomTemplates() {
    try {
      localStorage.setItem('vocelio_custom_flow_templates', JSON.stringify(this.customTemplates));
    } catch (error) {
      console.error('Error saving custom templates:', error);
    }
  }

  instantiateTemplate(templateId, position = { x: 0, y: 0 }) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Generate unique IDs for nodes and edges
    const idMap = {};
    const newNodes = template.nodes.map((node, index) => {
      const newId = `${node.type}_${Date.now()}_${index}`;
      idMap[node.id] = newId;
      
      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + position.x,
          y: node.position.y + position.y
        }
      };
    });

    const newEdges = template.edges.map((edge, index) => ({
      ...edge,
      id: `edge_${Date.now()}_${index}`,
      source: idMap[edge.source],
      target: idMap[edge.target]
    }));

    return { nodes: newNodes, edges: newEdges };
  }
}

export default FlowTemplateManager;
