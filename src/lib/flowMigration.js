import { v4 as uuidv4 } from 'uuid';
import { validateNode, validateFlow } from './flowSchemas';

// Migration utility to convert legacy nodes to new schema
export const migrateLegacyFlow = (legacyNodes, legacyConnections = []) => {
  const migratedNodes = legacyNodes.map(legacyNode => {
    const nodeId = legacyNode.id || uuidv4();
    
    // Map legacy types to new types
    const typeMapping = {
      'Start': 'Start',
      'Introduce the services': 'Say',
      'User responded': 'Collect', 
      'New Node 16': 'Say',
      'End Call': 'End',
      'Introducing our technology': 'Say',
      'Default': 'Say',
      'Large Text': 'Say',
      'End Call': 'End'
    };
    
    const newType = typeMapping[legacyNode.type] || 'Say';
    
    // Create base node structure
    const baseNode = {
      id: nodeId,
      type: newType,
      position: legacyNode.position || { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: legacyNode.title || legacyNode.type || 'Untitled'
      }
    };
    
    // Add type-specific data
    switch (newType) {
      case 'Start':
        baseNode.data = {
          ...baseNode.data,
          description: legacyNode.content || 'Entry point for all conversations'
        };
        break;
        
      case 'Say':
        baseNode.data = {
          ...baseNode.data,
          text: legacyNode.content || legacyNode.prompt || 'Hello, this is Vocelio AI.',
          bargeIn: !legacyNode.blockInterruptions,
          voice: 'june',
          speed: 1.0
        };
        break;
        
      case 'Collect':
        baseNode.data = {
          ...baseNode.data,
          mode: 'speech',
          prompt: legacyNode.content || 'Please provide your response.',
          timeoutMs: 4000,
          retries: 2,
          interruptMs: 120,
          grammar: ['yes', 'no'] // default grammar
        };
        break;
        
      case 'End':
        baseNode.data = {
          ...baseNode.data,
          disposition: 'not_interested',
          message: legacyNode.content || 'Thank you for your time.'
        };
        break;
        
      default:
        baseNode.data = {
          ...baseNode.data,
          text: legacyNode.content || 'Default message'
        };
    }
    
    return baseNode;
  });
  
  // Create edges from legacy connections
  const migratedEdges = [];
  
  // Auto-generate sequential connections if no explicit connections provided
  if (legacyConnections.length === 0) {
    for (let i = 0; i < migratedNodes.length - 1; i++) {
      migratedEdges.push({
        id: `edge-${i}`,
        source: migratedNodes[i].id,
        target: migratedNodes[i + 1].id,
        animated: false
      });
    }
  } else {
    // Convert legacy connections to edges
    legacyConnections.forEach((connection, index) => {
      migratedEdges.push({
        id: `edge-${index}`,
        source: connection.source,
        target: connection.target,
        label: connection.condition || 'default'
      });
    });
  }
  
  // Create complete flow object
  const migratedFlow = {
    schema: 'vocelio.flow/v1',
    id: uuidv4(),
    name: 'Migrated Vocelio Flow',
    description: 'Auto-migrated from legacy flow builder',
    version: '1.0.0',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    nodes: migratedNodes,
    edges: migratedEdges,
    metadata: {
      author: 'Vocelio AI',
      tags: ['migrated', 'voice-ai'],
      category: 'sales',
      complexity: migratedNodes.length > 10 ? 'complex' : migratedNodes.length > 5 ? 'medium' : 'simple'
    }
  };
  
  return migratedFlow;
};

// Validation utility
export const validateMigratedFlow = (flow) => {
  const result = validateFlow(flow);
  if (result.error) {
    console.error('Flow validation failed:', result.error);
    return { isValid: false, errors: result.error };
  }
  return { isValid: true, flow: result };
};

// Export utility to convert flow to JSON
export const exportFlowToJSON = (flow, pretty = true) => {
  const validated = validateMigratedFlow(flow);
  if (!validated.isValid) {
    throw new Error('Cannot export invalid flow: ' + JSON.stringify(validated.errors));
  }
  
  return pretty 
    ? JSON.stringify(flow, null, 2)
    : JSON.stringify(flow);
};

// Import utility to load flow from JSON
export const importFlowFromJSON = (jsonString) => {
  try {
    const flow = JSON.parse(jsonString);
    const validated = validateMigratedFlow(flow);
    
    if (!validated.isValid) {
      throw new Error('Invalid flow format: ' + JSON.stringify(validated.errors));
    }
    
    return validated.flow;
  } catch (error) {
    throw new Error('Failed to parse flow JSON: ' + error.message);
  }
};

// Auto-layout utility using simple force-directed placement
export const autoLayoutNodes = (nodes, edges) => {
  const layoutNodes = [...nodes];
  const nodeMap = new Map(layoutNodes.map(n => [n.id, n]));
  
  // Start node at top center
  const startNode = layoutNodes.find(n => n.type === 'Start');
  if (startNode) {
    startNode.position = { x: 400, y: 50 };
  }
  
  // Simple hierarchical layout
  const levels = new Map();
  const visited = new Set();
  
  // BFS to assign levels
  const queue = startNode ? [startNode.id] : [layoutNodes[0]?.id];
  levels.set(queue[0], 0);
  
  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);
    const currentLevel = levels.get(currentId) || 0;
    
    // Find connected nodes
    edges
      .filter(e => e.source === currentId)
      .forEach(edge => {
        if (!levels.has(edge.target)) {
          levels.set(edge.target, currentLevel + 1);
          queue.push(edge.target);
        }
      });
  }
  
  // Position nodes by level
  const levelCounts = new Map();
  levels.forEach((level, nodeId) => {
    levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
  });
  
  const levelCounters = new Map();
  layoutNodes.forEach(node => {
    const level = levels.get(node.id) || 0;
    const countAtLevel = levelCounts.get(level) || 1;
    const indexAtLevel = levelCounters.get(level) || 0;
    
    levelCounters.set(level, indexAtLevel + 1);
    
    // Calculate position
    const x = countAtLevel === 1 
      ? 400 // Center single nodes
      : 200 + (indexAtLevel * (600 / (countAtLevel - 1))); // Distribute multiple nodes
    
    const y = 50 + (level * 200);
    
    node.position = { x, y };
  });
  
  return layoutNodes;
};

// Performance optimization: Create node lookup maps
export const createNodeLookups = (nodes) => {
  const nodeMap = new Map();
  const typeGroups = new Map();
  
  nodes.forEach(node => {
    nodeMap.set(node.id, node);
    
    if (!typeGroups.has(node.type)) {
      typeGroups.set(node.type, []);
    }
    typeGroups.get(node.type).push(node);
  });
  
  return { nodeMap, typeGroups };
};

export default {
  migrateLegacyFlow,
  validateMigratedFlow,
  exportFlowToJSON,
  importFlowFromJSON,
  autoLayoutNodes,
  createNodeLookups
};
