// Enhanced Voice Service - Integrates Twilio with flow execution and mobile bridge
import { Device } from '@twilio/voice-sdk';
import EventEmitter from 'events';

class EnhancedVoiceService extends EventEmitter {
  constructor() {
    super();
    this.device = null;
    this.activeCall = null;
    this.isInitialized = false;
    this.connectionState = 'disconnected';
    this.flows = new Map(); // Store active flow executions
    this.mobileConnections = new Map(); // Store mobile bridge connections
    
    // Configuration
    this.config = {
      logLevel: 'info',
      codecPreferences: ['opus', 'pcmu'],
      enableRingingState: true,
      maxAverageBitrate: 32000,
      enableImprovedSignalingErrorPrecision: true
    };
    
    // Metrics tracking
    this.metrics = {
      calls: {
        total: 0,
        successful: 0,
        failed: 0,
        averageDuration: 0
      },
      flows: {
        executed: 0,
        completed: 0,
        errors: 0
      },
      mobile: {
        connected: 0,
        bridged: 0
      }
    };
    
    this.log('🚀 Enhanced Voice Service initialized');
  }

  async initialize() {
    try {
      this.log('🔄 Initializing enhanced voice service...');
      
      // Get access token with enhanced capabilities
      const tokenData = await this.getEnhancedAccessToken();
      
      if (!tokenData.success || !tokenData.token) {
        throw new Error('Failed to get access token');
      }
      
      // Create Twilio Device with enhanced configuration
      this.device = new Device(tokenData.token, {
        ...this.config,
        // Enhanced mobile support
        enableIceRestart: true,
        forceAggressiveIceNomination: true,
        // Better error handling
        allowIncomingWhileBusy: false
      });
      
      this.setupDeviceEventHandlers();
      this.setupFlowIntegration();
      this.setupMobileBridge();
      
      this.isInitialized = true;
      this.connectionState = 'connected';
      
      this.log('✅ Enhanced voice service initialized successfully');
      this.emit('ready');
      
      return true;
    } catch (error) {
      this.log(`❌ Initialization failed: ${error.message}`, 'error');
      this.emit('error', error);
      return false;
    }
  }

  async getEnhancedAccessToken() {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/voice/enhanced-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: `user-${Date.now()}`,
        capabilities: [
          'voice',
          'incoming',
          'outgoing', 
          'flow-execution',
          'mobile-bridge',
          'real-time-events'
        ],
        features: {
          enhancedErrors: true,
          flowIntegration: true,
          mobileSupport: true,
          realTimeMetrics: true
        }
      })
    });
    
    return await response.json();
  }

  setupDeviceEventHandlers() {
    if (!this.device) return;
    
    this.device.on('ready', () => {
      this.log('📞 Voice device ready with enhanced capabilities');
      this.connectionState = 'connected';
      this.emit('ready');
    });

    this.device.on('error', (error) => {
      this.log(`❌ Device error: ${error.message}`, 'error');
      this.connectionState = 'error';
      this.metrics.calls.failed++;
      this.emit('error', error);
    });

    this.device.on('incoming', (call) => {
      this.log('📞 Incoming call received');
      this.handleIncomingCall(call);
    });

    this.device.on('connect', (call) => {
      this.log('✅ Call connected');
      this.activeCall = call;
      this.metrics.calls.successful++;
      this.setupCallEventHandlers(call);
      this.emit('connect', call);
    });

    this.device.on('disconnect', (call) => {
      this.log('📴 Call disconnected');
      this.handleCallDisconnect(call);
    });

    this.device.on('registrationFailed', (error) => {
      this.log(`❌ Registration failed: ${error.message}`, 'error');
      this.connectionState = 'registration-failed';
      this.emit('registrationFailed', error);
    });
  }

  setupCallEventHandlers(call) {
    const callStartTime = Date.now();
    
    call.on('accept', () => {
      this.log('📞 Call accepted');
      this.emit('callAccepted', call);
    });

    call.on('cancel', () => {
      this.log('📴 Call cancelled');
      this.emit('callCancelled', call);
    });

    call.on('disconnect', () => {
      const duration = Math.floor((Date.now() - callStartTime) / 1000);
      this.updateCallMetrics(duration);
      this.log(`📴 Call ended - Duration: ${duration}s`);
      this.emit('callEnded', { call, duration });
    });

    call.on('error', (error) => {
      this.log(`❌ Call error: ${error.message}`, 'error');
      this.metrics.calls.failed++;
      this.emit('callError', { call, error });
    });

    call.on('mute', (muted) => {
      this.log(`🔇 Call ${muted ? 'muted' : 'unmuted'}`);
      this.emit('muteChanged', { call, muted });
    });

    call.on('volume', (inputVolume, outputVolume) => {
      this.emit('volumeChanged', { call, inputVolume, outputVolume });
    });
  }

  setupFlowIntegration() {
    this.log('🔄 Setting up flow integration...');
    
    // Enhanced flow execution with voice integration
    this.on('connect', (call) => {
      // Check if call has flow parameters
      const flowData = call.parameters.FlowData;
      if (flowData) {
        this.executeFlowOnCall(call, JSON.parse(flowData));
      }
    });
    
    this.log('✅ Flow integration ready');
  }

  setupMobileBridge() {
    this.log('🔄 Setting up mobile bridge...');
    
    // Mobile-specific event handling
    this.on('connect', (call) => {
      if (call.parameters.MobileFlow) {
        this.bridgeMobileFlowToVoice(call, JSON.parse(call.parameters.MobileFlow));
      }
    });
    
    this.log('✅ Mobile bridge ready');
  }

  async executeFlowOnCall(call, flow) {
    try {
      this.log(`🔄 Executing flow on call: ${flow.name || 'Unnamed Flow'}`);
      
      const flowExecution = {
        id: `flow-${Date.now()}`,
        call,
        flow,
        currentNodeIndex: 0,
        variables: {},
        startTime: Date.now()
      };
      
      this.flows.set(call.parameters.CallSid, flowExecution);
      this.metrics.flows.executed++;
      
      await this.executeFlowNodes(flowExecution);
      
      this.log('✅ Flow execution completed');
      this.metrics.flows.completed++;
      this.emit('flowCompleted', { call, flow, execution: flowExecution });
      
    } catch (error) {
      this.log(`❌ Flow execution error: ${error.message}`, 'error');
      this.metrics.flows.errors++;
      this.emit('flowError', { call, flow, error });
    }
  }

  async executeFlowNodes(execution) {
    const { flow, call } = execution;
    
    for (let i = 0; i < flow.nodes.length; i++) {
      execution.currentNodeIndex = i;
      const node = flow.nodes[i];
      
      this.log(`▶️ Executing node: ${node.type} - ${node.data?.label || node.id}`);
      
      try {
        await this.executeFlowNode(node, execution);
        
        // Add delay between nodes for natural flow
        await this.wait(500);
        
      } catch (error) {
        this.log(`❌ Node execution error: ${error.message}`, 'error');
        throw error;
      }
    }
  }

  async executeFlowNode(node, execution) {
    const { call } = execution;
    
    switch (node.type) {
      case 'voice':
        await this.executeVoiceNode(node, execution);
        break;
        
      case 'input':
        await this.executeInputNode(node, execution);
        break;
        
      case 'condition':
        await this.executeConditionNode(node, execution);
        break;
        
      case 'action':
        await this.executeActionNode(node, execution);
        break;
        
      case 'api':
        await this.executeApiNode(node, execution);
        break;
        
      default:
        this.log(`⚠️ Unknown node type: ${node.type}`, 'warning');
    }
    
    this.emit('nodeExecuted', { node, execution });
  }

  async executeVoiceNode(node, execution) {
    const message = this.replaceVariables(node.data?.message || 'Hello', execution.variables);
    const voice = node.data?.voice || 'alice';
    const language = node.data?.language || 'en-US';
    
    const twiml = `<Response><Say voice="${voice}" language="${language}">${message}</Say></Response>`;
    
    await this.sendTwiMLToCall(execution.call, twiml);
  }

  async executeInputNode(node, execution) {
    const prompt = this.replaceVariables(node.data?.prompt || 'Please provide input', execution.variables);
    const timeout = node.data?.timeout || 5;
    const inputType = node.data?.inputType || 'speech';
    
    let twiml = `<Response><Gather input="${inputType}" timeout="${timeout}" speechTimeout="auto">`;
    twiml += `<Say>${prompt}</Say>`;
    twiml += `</Gather></Response>`;
    
    await this.sendTwiMLToCall(execution.call, twiml);
    
    // Store input in variables if specified
    if (node.data?.variableName) {
      // This would be handled by webhook response
      execution.variables[node.data.variableName] = 'user_input_placeholder';
    }
  }

  async executeConditionNode(node, execution) {
    const conditions = node.data?.conditions || [];
    const logic = node.data?.logic || 'AND';
    
    let result = logic === 'AND';
    
    for (const condition of conditions) {
      const fieldValue = execution.variables[condition.field] || '';
      let conditionResult = false;
      
      switch (condition.operator) {
        case 'equals':
          conditionResult = fieldValue === condition.value;
          break;
        case 'contains':
          conditionResult = fieldValue.includes(condition.value);
          break;
        case 'greater_than':
          conditionResult = parseFloat(fieldValue) > parseFloat(condition.value);
          break;
        case 'less_than':
          conditionResult = parseFloat(fieldValue) < parseFloat(condition.value);
          break;
        default:
          conditionResult = false;
      }
      
      if (logic === 'AND') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }
    }
    
    // Store condition result
    execution.variables._lastConditionResult = result;
    
    this.log(`🔀 Condition result: ${result}`);
  }

  async executeActionNode(node, execution) {
    const actionType = node.data?.actionType || 'unknown';
    
    switch (actionType) {
      case 'transfer':
        const target = node.data?.target;
        if (target) {
          const twiml = `<Response><Dial>${target}</Dial></Response>`;
          await this.sendTwiMLToCall(execution.call, twiml);
        }
        break;
        
      case 'hangup':
        const twiml = `<Response><Hangup/></Response>`;
        await this.sendTwiMLToCall(execution.call, twiml);
        break;
        
      case 'store_data':
        const dataKey = node.data?.dataKey;
        const dataValue = this.replaceVariables(node.data?.dataValue || '', execution.variables);
        if (dataKey) {
          execution.variables[dataKey] = dataValue;
        }
        break;
        
      default:
        this.log(`⚡ Executing action: ${actionType}`);
    }
  }

  async executeApiNode(node, execution) {
    const url = node.data?.url;
    const method = node.data?.method || 'GET';
    const headers = node.data?.headers || {};
    const requestBody = node.data?.requestBody;
    
    if (!url) {
      throw new Error('API node missing URL');
    }
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      
      if (requestBody && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = this.replaceVariables(requestBody, execution.variables);
      }
      
      const response = await fetch(url, options);
      const responseData = await response.json();
      
      // Store response in variables
      if (node.data?.responseVariable) {
        execution.variables[node.data.responseVariable] = responseData;
      }
      
      this.log(`🔗 API call completed: ${url}`);
      
    } catch (error) {
      this.log(`❌ API call failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async bridgeMobileFlowToVoice(call, mobileFlow) {
    try {
      this.log('🌉 Bridging mobile flow to voice...');
      
      const bridgeExecution = {
        id: `mobile-bridge-${Date.now()}`,
        call,
        mobileFlow,
        startTime: Date.now()
      };
      
      this.mobileConnections.set(call.parameters.CallSid, bridgeExecution);
      this.metrics.mobile.bridged++;
      
      // Convert mobile nodes to voice interactions
      for (const mobileNode of mobileFlow.nodes) {
        await this.convertMobileNodeToVoice(mobileNode, bridgeExecution);
        await this.wait(1000); // Pause between interactions
      }
      
      this.log('✅ Mobile flow bridge completed');
      this.emit('mobileBridgeCompleted', bridgeExecution);
      
    } catch (error) {
      this.log(`❌ Mobile bridge error: ${error.message}`, 'error');
      this.emit('mobileBridgeError', { call, mobileFlow, error });
    }
  }

  async convertMobileNodeToVoice(mobileNode, execution) {
    const { call } = execution;
    
    switch (mobileNode.type) {
      case 'text':
        const textTwiml = `<Response><Say>${mobileNode.data?.text || 'Mobile text'}</Say></Response>`;
        await this.sendTwiMLToCall(call, textTwiml);
        break;
        
      case 'button':
        const options = mobileNode.data?.options || [];
        let menuTwiml = `<Response><Gather numDigits="1" timeout="10"><Say>Please select: `;
        options.forEach((option, index) => {
          menuTwiml += `Press ${index + 1} for ${option.text}. `;
        });
        menuTwiml += `</Say></Gather></Response>`;
        await this.sendTwiMLToCall(call, menuTwiml);
        break;
        
      case 'input':
        const inputTwiml = `<Response><Gather input="speech" timeout="10"><Say>${mobileNode.data?.placeholder || 'Please provide input'}</Say></Gather></Response>`;
        await this.sendTwiMLToCall(call, inputTwiml);
        break;
        
      default:
        this.log(`⚠️ Unknown mobile node type: ${mobileNode.type}`, 'warning');
    }
    
    this.emit('mobileNodeConverted', { mobileNode, execution });
  }

  async sendTwiMLToCall(call, twiml) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/voice/update-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callSid: call.parameters.CallSid,
          twiml: twiml
        })
      });
      
      if (!response.ok) {
        throw new Error(`TwiML update failed: ${response.status}`);
      }
      
      this.log('📨 TwiML sent successfully');
    } catch (error) {
      this.log(`❌ Failed to send TwiML: ${error.message}`, 'error');
      throw error;
    }
  }

  replaceVariables(text, variables) {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
      const pattern = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(pattern, value);
    }
    return result;
  }

  async makeCall(params) {
    if (!this.device || !this.isInitialized) {
      throw new Error('Voice service not initialized');
    }
    
    try {
      this.log(`📞 Making call to ${params.To}`);
      this.metrics.calls.total++;
      
      const call = await this.device.connect(params);
      return call;
      
    } catch (error) {
      this.log(`❌ Call failed: ${error.message}`, 'error');
      this.metrics.calls.failed++;
      throw error;
    }
  }

  hangUp() {
    if (this.activeCall) {
      this.activeCall.disconnect();
      this.log('📴 Call ended by user');
    }
  }

  mute() {
    if (this.activeCall) {
      this.activeCall.mute(true);
      this.log('🔇 Call muted');
      return true;
    }
    return false;
  }

  unmute() {
    if (this.activeCall) {
      this.activeCall.mute(false);
      this.log('🔊 Call unmuted');
      return true;
    }
    return false;
  }

  async testVoiceCapabilities() {
    const results = {
      device: false,
      microphone: false,
      speaker: false,
      network: false,
      backend: false
    };
    
    try {
      // Test device initialization
      results.device = this.isInitialized && this.device !== null;
      
      // Test microphone access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        results.microphone = true;
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        results.microphone = false;
      }
      
      // Test speaker capabilities
      const audio = new Audio();
      results.speaker = audio.canPlayType('audio/wav') !== '';
      
      // Test network connectivity
      results.network = navigator.onLine;
      
      // Test backend connectivity
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/health`);
        results.backend = response.ok;
      } catch (error) {
        results.backend = false;
      }
      
      this.log('🧪 Voice capabilities test completed');
      
    } catch (error) {
      this.log(`❌ Voice capabilities test error: ${error.message}`, 'error');
    }
    
    return results;
  }

  getMetrics() {
    return {
      ...this.metrics,
      connectionState: this.connectionState,
      isInitialized: this.isInitialized,
      activeCall: this.activeCall !== null,
      activeFlows: this.flows.size,
      activeMobileBridges: this.mobileConnections.size
    };
  }

  updateCallMetrics(duration) {
    const totalCalls = this.metrics.calls.successful;
    const currentAverage = this.metrics.calls.averageDuration;
    this.metrics.calls.averageDuration = ((currentAverage * (totalCalls - 1)) + duration) / totalCalls;
  }

  handleIncomingCall(call) {
    this.log(`📞 Incoming call from ${call.parameters.From}`);
    this.emit('incoming', call);
  }

  handleCallDisconnect(call) {
    this.activeCall = null;
    
    // Clean up flow executions
    const callSid = call.parameters?.CallSid;
    if (callSid) {
      this.flows.delete(callSid);
      this.mobileConnections.delete(callSid);
    }
    
    this.emit('disconnect', call);
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  log(message, level = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [EnhancedVoiceService] ${level.toUpperCase()}: ${message}`);
    this.emit('log', { message, level, timestamp });
  }

  destroy() {
    if (this.device) {
      this.device.destroy();
      this.device = null;
    }
    
    this.flows.clear();
    this.mobileConnections.clear();
    this.isInitialized = false;
    this.connectionState = 'disconnected';
    
    this.log('🔥 Enhanced voice service destroyed');
  }
}

// Export singleton instance
const enhancedVoiceService = new EnhancedVoiceService();
export default enhancedVoiceService;
