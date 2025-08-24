/**
 * Advanced Flow Execution Engine
 * Handles flow validation, execution, and testing
 */

export class FlowExecutionEngine {
  constructor() {
    this.executionId = null;
    this.status = 'idle'; // idle, running, paused, completed, error
    this.currentNode = null;
    this.executionStack = [];
    this.variables = new Map();
    this.executionLog = [];
    this.listeners = new Map();
    this.stepTimeout = 5000; // 5 second timeout per step
  }

  // Event system
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Flow validation
  validateFlow(nodes, edges) {
    const errors = [];
    const warnings = [];

    // Check for start node
    const startNodes = nodes.filter(node => node.type === 'start' || node.data?.isStartNode);
    if (startNodes.length === 0) {
      errors.push({ type: 'missing_start', message: 'Flow must have a start node' });
    } else if (startNodes.length > 1) {
      warnings.push({ type: 'multiple_start', message: 'Multiple start nodes found' });
    }

    // Check for isolated nodes
    const connectedNodeIds = new Set();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const isolatedNodes = nodes.filter(node => 
      !connectedNodeIds.has(node.id) && node.type !== 'start'
    );
    
    isolatedNodes.forEach(node => {
      warnings.push({
        type: 'isolated_node',
        message: `Node "${node.data?.label || node.id}" is not connected`,
        nodeId: node.id
      });
    });

    // Check for infinite loops
    const loops = this.detectLoops(nodes, edges);
    loops.forEach(loop => {
      warnings.push({
        type: 'potential_loop',
        message: `Potential infinite loop detected: ${loop.join(' → ')}`,
        nodes: loop
      });
    });

    // Validate node configurations
    nodes.forEach(node => {
      const nodeErrors = this.validateNode(node);
      errors.push(...nodeErrors);
    });

    // Check edge connections
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode) {
        errors.push({
          type: 'invalid_edge',
          message: `Edge references non-existent source node: ${edge.source}`,
          edgeId: edge.id
        });
      }
      
      if (!targetNode) {
        errors.push({
          type: 'invalid_edge',
          message: `Edge references non-existent target node: ${edge.target}`,
          edgeId: edge.id
        });
      }
    });

    return { errors, warnings, isValid: errors.length === 0 };
  }

  validateNode(node) {
    const errors = [];
    
    switch (node.type) {
      case 'condition':
        if (!node.data?.condition) {
          errors.push({
            type: 'missing_condition',
            message: `Condition node "${node.data?.label || node.id}" is missing condition logic`,
            nodeId: node.id
          });
        }
        break;
        
      case 'api':
        if (!node.data?.url) {
          errors.push({
            type: 'missing_url',
            message: `API node "${node.data?.label || node.id}" is missing URL`,
            nodeId: node.id
          });
        }
        break;
        
      case 'voice':
        if (!node.data?.text && !node.data?.audio) {
          errors.push({
            type: 'missing_content',
            message: `Voice node "${node.data?.label || node.id}" is missing text or audio content`,
            nodeId: node.id
          });
        }
        break;
        
      case 'input':
        if (!node.data?.inputType) {
          errors.push({
            type: 'missing_input_type',
            message: `Input node "${node.data?.label || node.id}" is missing input type`,
            nodeId: node.id
          });
        }
        break;
    }
    
    return errors;
  }

  detectLoops(nodes, edges) {
    const loops = [];
    const visited = new Set();
    const recursionStack = new Set();
    
    const dfs = (nodeId, path) => {
      if (recursionStack.has(nodeId)) {
        // Found a loop
        const loopStart = path.indexOf(nodeId);
        loops.push(path.slice(loopStart));
        return;
      }
      
      if (visited.has(nodeId)) return;
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      outgoingEdges.forEach(edge => {
        dfs(edge.target, [...path, nodeId]);
      });
      
      recursionStack.delete(nodeId);
    };
    
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    });
    
    return loops;
  }

  // Flow execution
  async executeFlow(nodes, edges, initialVariables = {}) {
    this.executionId = `exec_${Date.now()}`;
    this.status = 'running';
    this.variables = new Map(Object.entries(initialVariables));
    this.executionLog = [];
    this.executionStack = [];

    this.log('info', 'Flow execution started', { executionId: this.executionId });

    try {
      // Validate flow before execution
      const validation = this.validateFlow(nodes, edges);
      if (!validation.isValid) {
        throw new Error(`Flow validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      // Find start node
      const startNode = nodes.find(node => node.type === 'start' || node.data?.isStartNode);
      if (!startNode) {
        throw new Error('No start node found');
      }

      // Begin execution
      await this.executeFromNode(startNode.id, nodes, edges);
      
      if (this.status === 'running') {
        this.status = 'completed';
        this.log('success', 'Flow execution completed successfully');
      }

    } catch (error) {
      this.status = 'error';
      this.log('error', 'Flow execution failed', { error: error.message });
      throw error;
    }

    this.emit('executionCompleted', {
      executionId: this.executionId,
      status: this.status,
      log: this.executionLog,
      variables: Object.fromEntries(this.variables)
    });

    return {
      executionId: this.executionId,
      status: this.status,
      log: this.executionLog,
      variables: Object.fromEntries(this.variables)
    };
  }

  async executeFromNode(nodeId, nodes, edges) {
    if (this.status !== 'running') return;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    this.currentNode = node;
    this.executionStack.push(nodeId);
    
    this.log('info', `Executing node: ${node.data?.label || nodeId}`, { nodeId, nodeType: node.type });
    this.emit('nodeExecutionStarted', { nodeId, node });

    try {
      // Execute the node
      const result = await this.executeNode(node);
      
      this.log('info', `Node executed successfully: ${node.data?.label || nodeId}`, { nodeId, result });
      this.emit('nodeExecutionCompleted', { nodeId, node, result });

      // Find next node(s)
      const nextNodes = await this.getNextNodes(node, edges, result);
      
      // Continue execution
      if (nextNodes.length === 1) {
        await this.executeFromNode(nextNodes[0], nodes, edges);
      } else if (nextNodes.length > 1) {
        // Parallel execution or conditional branching
        await this.handleMultipleNextNodes(nextNodes, nodes, edges);
      }
      // If no next nodes, execution ends naturally

    } catch (error) {
      this.log('error', `Node execution failed: ${node.data?.label || nodeId}`, { nodeId, error: error.message });
      this.emit('nodeExecutionError', { nodeId, node, error });
      throw error;
    }

    this.executionStack.pop();
  }

  async executeNode(node) {
    const executionStart = Date.now();
    
    try {
      let result;
      
      switch (node.type) {
        case 'start':
          result = { type: 'start', timestamp: new Date().toISOString() };
          break;
          
        case 'voice':
          result = await this.executeVoiceNode(node);
          break;
          
        case 'input':
          result = await this.executeInputNode(node);
          break;
          
        case 'condition':
          result = await this.executeConditionNode(node);
          break;
          
        case 'api':
          result = await this.executeApiNode(node);
          break;
          
        case 'wait':
          result = await this.executeWaitNode(node);
          break;
          
        case 'variable':
          result = await this.executeVariableNode(node);
          break;
          
        case 'end':
          result = { type: 'end', timestamp: new Date().toISOString() };
          this.status = 'completed';
          break;
          
        default:
          result = await this.executeCustomNode(node);
      }

      const executionTime = Date.now() - executionStart;
      return { ...result, executionTime };
      
    } catch (error) {
      const executionTime = Date.now() - executionStart;
      throw new Error(`Node execution failed after ${executionTime}ms: ${error.message}`);
    }
  }

  async executeVoiceNode(node) {
    const { text, voice, language } = node.data || {};
    
    // Simulate voice output
    this.log('info', `Playing voice: "${text}"`, { voice, language });
    
    // In a real implementation, this would trigger TTS
    await this.simulateDelay(1000);
    
    return {
      type: 'voice',
      text,
      voice,
      language,
      played: true
    };
  }

  async executeInputNode(node) {
    const { inputType, prompt, validation } = node.data || {};
    
    // In test mode, simulate user input
    let simulatedInput;
    switch (inputType) {
      case 'speech':
        simulatedInput = 'Hello, this is test speech input';
        break;
      case 'dtmf':
        simulatedInput = '1';
        break;
      case 'number':
        simulatedInput = '42';
        break;
      default:
        simulatedInput = 'test input';
    }
    
    this.log('info', `Input received: "${simulatedInput}"`, { inputType, prompt });
    
    // Store input in variables
    const variableName = node.data?.variable || `input_${node.id}`;
    this.variables.set(variableName, simulatedInput);
    
    return {
      type: 'input',
      inputType,
      value: simulatedInput,
      variable: variableName
    };
  }

  async executeConditionNode(node) {
    const { condition, leftOperand, operator, rightOperand } = node.data || {};
    
    let result = false;
    
    if (condition) {
      // Evaluate custom condition logic
      try {
        // Simple variable substitution
        let evaluatedCondition = condition;
        for (const [key, value] of this.variables.entries()) {
          evaluatedCondition = evaluatedCondition.replace(new RegExp(`\\$${key}`, 'g'), value);
        }
        
        // Basic evaluation (in production, use a proper expression evaluator)
        result = eval(evaluatedCondition);
      } catch (error) {
        this.log('warning', `Condition evaluation error: ${error.message}`, { condition });
        result = false;
      }
    } else if (leftOperand && operator && rightOperand) {
      // Simple comparison
      const left = this.variables.get(leftOperand) || leftOperand;
      const right = this.variables.get(rightOperand) || rightOperand;
      
      switch (operator) {
        case '==': result = left == right; break;
        case '!=': result = left != right; break;
        case '>': result = Number(left) > Number(right); break;
        case '<': result = Number(left) < Number(right); break;
        case '>=': result = Number(left) >= Number(right); break;
        case '<=': result = Number(left) <= Number(right); break;
        default: result = false;
      }
    }
    
    this.log('info', `Condition evaluated: ${result}`, { condition, leftOperand, operator, rightOperand });
    
    return {
      type: 'condition',
      result,
      condition,
      branch: result ? 'true' : 'false'
    };
  }

  async executeApiNode(node) {
    const { url, method, headers, body } = node.data || {};
    
    try {
      // Simulate API call
      this.log('info', `Making API call: ${method || 'GET'} ${url}`);
      
      await this.simulateDelay(Math.random() * 2000 + 500); // 0.5-2.5s
      
      // Simulate response
      const response = {
        status: 200,
        data: { success: true, timestamp: new Date().toISOString() }
      };
      
      return {
        type: 'api',
        url,
        method: method || 'GET',
        response
      };
      
    } catch (error) {
      this.log('error', `API call failed: ${error.message}`, { url, method });
      throw error;
    }
  }

  async executeWaitNode(node) {
    const { duration } = node.data || {};
    const waitTime = duration || 1000;
    
    this.log('info', `Waiting for ${waitTime}ms`);
    await this.simulateDelay(waitTime);
    
    return {
      type: 'wait',
      duration: waitTime
    };
  }

  async executeVariableNode(node) {
    const { variable, operation, value } = node.data || {};
    
    let result;
    switch (operation) {
      case 'set':
        this.variables.set(variable, value);
        result = value;
        break;
      case 'increment':
        const current = Number(this.variables.get(variable)) || 0;
        result = current + (Number(value) || 1);
        this.variables.set(variable, result);
        break;
      case 'append':
        const existing = this.variables.get(variable) || '';
        result = existing + value;
        this.variables.set(variable, result);
        break;
      default:
        result = value;
        this.variables.set(variable, value);
    }
    
    this.log('info', `Variable operation: ${variable} ${operation} ${value} = ${result}`);
    
    return {
      type: 'variable',
      variable,
      operation,
      value: result
    };
  }

  async executeCustomNode(node) {
    // Handle custom node types
    this.log('warning', `Unknown node type: ${node.type}`, { nodeId: node.id });
    
    return {
      type: 'custom',
      nodeType: node.type,
      executed: true
    };
  }

  async getNextNodes(currentNode, edges, executionResult) {
    const outgoingEdges = edges.filter(edge => edge.source === currentNode.id);
    
    if (currentNode.type === 'condition' && executionResult) {
      // Filter edges based on condition result
      const branch = executionResult.branch;
      const filteredEdges = outgoingEdges.filter(edge => {
        const label = edge.label?.toLowerCase() || '';
        return label.includes(branch) || 
               (branch === 'true' && label.includes('yes')) ||
               (branch === 'false' && label.includes('no'));
      });
      
      if (filteredEdges.length > 0) {
        return filteredEdges.map(edge => edge.target);
      }
    }
    
    return outgoingEdges.map(edge => edge.target);
  }

  async handleMultipleNextNodes(nextNodes, nodes, edges) {
    // For now, execute the first available path
    // In a more advanced implementation, this could handle parallel execution
    if (nextNodes.length > 0) {
      await this.executeFromNode(nextNodes[0], nodes, edges);
    }
  }

  // Testing capabilities
  async testFlow(nodes, edges, testCases = []) {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.executeFlow(nodes, edges, testCase.variables);
        results.push({
          testCase,
          result,
          passed: testCase.expectedResult ? this.compareResults(result, testCase.expectedResult) : true
        });
      } catch (error) {
        results.push({
          testCase,
          error: error.message,
          passed: false
        });
      }
    }
    
    return results;
  }

  compareResults(actual, expected) {
    // Simple result comparison - can be made more sophisticated
    return actual.status === expected.status;
  }

  // Utility methods
  simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      executionId: this.executionId,
      currentNode: this.currentNode?.id,
      ...data
    };
    
    this.executionLog.push(logEntry);
    console.log(`[${level.toUpperCase()}] ${message}`, data);
    
    this.emit('log', logEntry);
  }

  // Control methods
  pause() {
    this.status = 'paused';
    this.emit('paused', { executionId: this.executionId });
  }

  resume() {
    if (this.status === 'paused') {
      this.status = 'running';
      this.emit('resumed', { executionId: this.executionId });
    }
  }

  stop() {
    this.status = 'stopped';
    this.emit('stopped', { executionId: this.executionId });
  }

  getExecutionState() {
    return {
      executionId: this.executionId,
      status: this.status,
      currentNode: this.currentNode,
      variables: Object.fromEntries(this.variables),
      executionStack: this.executionStack,
      log: this.executionLog
    };
  }
}

export default FlowExecutionEngine;
