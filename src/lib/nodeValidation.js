import { z } from 'zod';

// Validation schemas for different node types
export const NodeValidationSchemas = {
  // Base node schema that all nodes must satisfy
  baseNode: z.object({
    id: z.string().min(1, "Node ID is required"),
    type: z.string().min(1, "Node type is required"),
    data: z.object({
      label: z.string().min(1, "Node name is required").max(50, "Node name too long"),
    }),
    position: z.object({
      x: z.number(),
      y: z.number()
    })
  }),

  // Large Text node validation
  largeTextNode: z.object({
    prompt: z.string().min(10, "Prompt must be at least 10 characters").max(2000, "Prompt too long"),
    plainText: z.string().max(1000, "Plain text too long"),
    temperature: z.number().min(0, "Temperature must be 0 or higher").max(1, "Temperature must be 1 or lower"),
    staticText: z.boolean(),
    loopCondition: z.string().max(500, "Loop condition too long")
  }),

  // Small Text node validation
  smallTextNode: z.object({
    prompt: z.string().min(5, "Prompt must be at least 5 characters").max(500, "Prompt too long"),
    plainText: z.string().max(200, "Plain text too long"),
    temperature: z.number().min(0, "Temperature must be 0 or higher").max(1, "Temperature must be 1 or lower"),
    staticText: z.boolean()
  }),

  // Collect Info node validation
  collectInfoNode: z.object({
    prompt: z.string().min(10, "Information collection prompt required").max(1000, "Prompt too long"),
    requiredFields: z.array(z.string()).min(1, "At least one field must be collected"),
    validationRules: z.object({
      phone: z.string().optional(),
      email: z.string().optional(),
      name: z.string().optional()
    }).optional(),
    retryAttempts: z.number().min(1, "At least 1 retry attempt required").max(5, "Maximum 5 retry attempts"),
    loopCondition: z.string().min(10, "Loop condition required for data collection")
  }),

  // Decision node validation
  decisionNode: z.object({
    prompt: z.string().min(10, "Decision prompt required").max(1000, "Prompt too long"),
    options: z.array(z.object({
      label: z.string().min(1, "Option label required"),
      value: z.string().min(1, "Option value required"),
      nextNodeId: z.string().optional()
    })).min(2, "Decision must have at least 2 options").max(6, "Maximum 6 options allowed"),
    defaultOption: z.string().optional(),
    timeout: z.number().min(5, "Timeout must be at least 5 seconds").max(60, "Timeout cannot exceed 60 seconds").optional()
  })
};

// Node connection validation
export const ConnectionValidationSchemas = {
  // Validate edge connections
  edgeConnection: z.object({
    id: z.string().min(1, "Edge ID required"),
    source: z.string().min(1, "Source node ID required"),
    target: z.string().min(1, "Target node ID required"),
    sourceHandle: z.string().optional(),
    targetHandle: z.string().optional(),
    type: z.enum(['default', 'straight', 'step', 'smoothstep']).optional()
  }),

  // Flow validation
  flowStructure: z.object({
    nodes: z.array(z.any()).min(1, "Flow must have at least one node"),
    edges: z.array(z.any()),
    hasStartNode: z.boolean().refine(val => val === true, "Flow must have a start node"),
    hasEndNode: z.boolean().refine(val => val === true, "Flow must have an end node"),
    noOrphanedNodes: z.boolean().refine(val => val === true, "All nodes must be connected")
  })
};

// Validation error types
export const ValidationErrorTypes = {
  REQUIRED_FIELD: 'required_field',
  INVALID_FORMAT: 'invalid_format',
  OUT_OF_RANGE: 'out_of_range',
  TOO_LONG: 'too_long',
  TOO_SHORT: 'too_short',
  INVALID_CONNECTION: 'invalid_connection',
  CIRCULAR_DEPENDENCY: 'circular_dependency',
  MISSING_START_NODE: 'missing_start_node',
  MISSING_END_NODE: 'missing_end_node',
  ORPHANED_NODE: 'orphaned_node'
};

// Node validation functions
export class NodeValidator {
  static validateNode(node) {
    // Safety check for undefined/null node
    if (!node || typeof node !== 'object') {
      return {
        isValid: false,
        errors: [{
          type: ValidationErrorTypes.INVALID_FORMAT,
          field: 'node',
          message: 'Invalid or missing node data',
          severity: 'error'
        }],
        warnings: [],
        nodeId: 'unknown',
        nodeType: 'Unknown'
      };
    }

    // Ensure node has required properties
    if (!node.data || typeof node.data !== 'object') {
      return {
        isValid: false,
        errors: [{
          type: ValidationErrorTypes.INVALID_FORMAT,
          field: 'node.data',
          message: 'Node is missing data property',
          severity: 'error'
        }],
        warnings: [],
        nodeId: node.id || 'unknown',
        nodeType: 'Unknown'
      };
    }

    const errors = [];
    const warnings = [];

    try {
      // Validate base node structure
      NodeValidationSchemas.baseNode.parse(node);

      // Validate specific node type
      const nodeType = node.data.nodeType || 'Large Text';
      const nodeData = node.data;

      switch (nodeType) {
        case 'Large Text':
          try {
            NodeValidationSchemas.largeTextNode.parse(nodeData);
          } catch (error) {
            errors.push(...this.parseZodErrors(error));
          }
          break;

        case 'Small Text':
          try {
            NodeValidationSchemas.smallTextNode.parse(nodeData);
          } catch (error) {
            errors.push(...this.parseZodErrors(error));
          }
          break;

        case 'Collect Info':
          try {
            NodeValidationSchemas.collectInfoNode.parse(nodeData);
          } catch (error) {
            errors.push(...this.parseZodErrors(error));
          }
          break;

        case 'Decision':
          try {
            NodeValidationSchemas.decisionNode.parse(nodeData);
          } catch (error) {
            errors.push(...this.parseZodErrors(error));
          }
          break;
      }

      // Additional custom validations
      const customValidation = this.performCustomValidation(node);
      errors.push(...customValidation.errors);
      warnings.push(...customValidation.warnings);

    } catch (error) {
      errors.push(...this.parseZodErrors(error));
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      nodeId: node.id,
      nodeType: node.data.nodeType || 'Unknown'
    };
  }

  static validateFlow(nodes, edges) {
    // Safety checks for undefined/null inputs
    if (!nodes || !Array.isArray(nodes)) {
      nodes = [];
    }
    if (!edges || !Array.isArray(edges)) {
      edges = [];
    }

    const errors = [];
    const warnings = [];

    // Check for start node
    const hasStartNode = nodes.some(node => 
      node.data.isStartNode || 
      !edges.some(edge => edge.target === node.id)
    );

    if (!hasStartNode) {
      errors.push({
        type: ValidationErrorTypes.MISSING_START_NODE,
        message: "Flow must have a start node",
        severity: "error"
      });
    }

    // Check for end nodes
    const hasEndNode = nodes.some(node => 
      node.data.isEndNode || 
      !edges.some(edge => edge.source === node.id)
    );

    if (!hasEndNode) {
      warnings.push({
        type: ValidationErrorTypes.MISSING_END_NODE,
        message: "Flow should have at least one end node",
        severity: "warning"
      });
    }

    // Check for orphaned nodes
    const connectedNodeIds = new Set([
      ...edges.map(edge => edge.source),
      ...edges.map(edge => edge.target)
    ]);

    const orphanedNodes = nodes.filter(node => 
      !connectedNodeIds.has(node.id) && nodes.length > 1
    );

    if (orphanedNodes.length > 0) {
      warnings.push({
        type: ValidationErrorTypes.ORPHANED_NODE,
        message: `${orphanedNodes.length} node(s) are not connected to the flow`,
        severity: "warning",
        nodeIds: orphanedNodes.map(node => node.id)
      });
    }

    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(nodes, edges);
    if (circularDeps.length > 0) {
      errors.push({
        type: ValidationErrorTypes.CIRCULAR_DEPENDENCY,
        message: "Circular dependencies detected in flow",
        severity: "error",
        cycles: circularDeps
      });
    }

    // Validate individual nodes
    const nodeValidations = nodes.map(node => this.validateNode(node));
    
    return {
      isValid: errors.length === 0 && nodeValidations.every(v => v.isValid),
      errors: [
        ...errors,
        ...nodeValidations.flatMap(v => v.errors)
      ],
      warnings: [
        ...warnings,
        ...nodeValidations.flatMap(v => v.warnings)
      ],
      nodeValidations,
      flowStats: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        validNodes: nodeValidations.filter(v => v.isValid).length,
        nodeTypes: this.getNodeTypeStats(nodes)
      }
    };
  }

  static parseZodErrors(zodError) {
    // Handle cases where zodError might not have the expected structure
    if (!zodError || !zodError.errors || !Array.isArray(zodError.errors)) {
      // Fallback for non-Zod errors or malformed error objects
      return [{
        type: ValidationErrorTypes.INVALID_FORMAT,
        field: 'unknown',
        message: zodError?.message || 'Validation error occurred',
        severity: 'error'
      }];
    }

    return zodError.errors.map(err => ({
      type: ValidationErrorTypes.INVALID_FORMAT,
      field: Array.isArray(err.path) ? err.path.join('.') : 'unknown',
      message: err.message || 'Validation error',
      severity: 'error'
    }));
  }

  static performCustomValidation(node) {
    const errors = [];
    const warnings = [];

    // Check for empty or placeholder content
    if (node.data.content === 'Enter your prompt here...' || 
        node.data.prompt === 'Enter the prompt for this node...') {
      warnings.push({
        type: ValidationErrorTypes.INVALID_FORMAT,
        message: "Node contains placeholder text",
        severity: 'warning'
      });
    }

    // Check for very short prompts that might not be effective
    if (node.data.prompt && node.data.prompt.length < 20 && !node.data.staticText) {
      warnings.push({
        type: ValidationErrorTypes.TOO_SHORT,
        message: "Prompt might be too short for effective AI generation",
        severity: 'warning'
      });
    }

    // Check for conflicting settings
    if (node.data.staticText && (!node.data.plainText || node.data.plainText.trim() === '')) {
      errors.push({
        type: ValidationErrorTypes.REQUIRED_FIELD,
        message: "Static text enabled but no plain text content provided",
        severity: 'error'
      });
    }

    // Check temperature settings for static text
    if (node.data.staticText && node.data.temperature > 0.2) {
      warnings.push({
        type: ValidationErrorTypes.INVALID_FORMAT,
        message: "High temperature setting for static text node",
        severity: 'warning'
      });
    }

    return { errors, warnings };
  }

  static detectCircularDependencies(nodes, edges) {
    const adjacencyList = {};
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];

    // Build adjacency list
    nodes.forEach(node => {
      adjacencyList[node.id] = [];
    });

    edges.forEach(edge => {
      if (adjacencyList[edge.source]) {
        adjacencyList[edge.source].push(edge.target);
      }
    });

    // DFS to detect cycles
    const dfs = (nodeId, path = []) => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        cycles.push(path.slice(cycleStart));
        return true;
      }

      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      for (const neighbor of adjacencyList[nodeId] || []) {
        if (dfs(neighbor, [...path, nodeId])) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    // Check each unvisited node
    for (const nodeId of Object.keys(adjacencyList)) {
      if (!visited.has(nodeId)) {
        dfs(nodeId);
      }
    }

    return cycles;
  }

  static getNodeTypeStats(nodes) {
    const stats = {};
    nodes.forEach(node => {
      const type = node.data.nodeType || 'Unknown';
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  }

  static getRealTimeValidation(nodeData, nodeType) {
    // Quick validation for real-time feedback
    const issues = [];

    if (!nodeData.label || nodeData.label.trim() === '') {
      issues.push({ field: 'label', message: 'Node name required', type: 'error' });
    }

    if (nodeType === 'Large Text' || nodeType === 'Small Text') {
      if (!nodeData.staticText && (!nodeData.prompt || nodeData.prompt.length < 10)) {
        issues.push({ field: 'prompt', message: 'Prompt too short', type: 'warning' });
      }

      if (nodeData.staticText && (!nodeData.plainText || nodeData.plainText.trim() === '')) {
        issues.push({ field: 'plainText', message: 'Static text content required', type: 'error' });
      }
    }

    return issues;
  }
}
