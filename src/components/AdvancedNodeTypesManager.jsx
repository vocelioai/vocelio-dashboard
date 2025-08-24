/**
 * Advanced Node Types System
 * Sophisticated node types for complex voice flow logic
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GitBranch, Database, Webhook, RotateCcw, Code2, Brain,
  ArrowRight, ArrowDown, Plus, Settings, Edit3, Trash2,
  Play, Pause, CheckCircle, XCircle, AlertTriangle, Info,
  Calendar, Clock, User, Phone, Mail, MessageSquare,
  FileText, Hash, Zap, Target, Filter, Shuffle, Split,
  Merge, BarChart3, PieChart, TrendingUp, Activity,
  Key, Lock, Unlock, Shield, Server, Cloud, Globe,
  Radio, Headphones, Mic, Volume2, VolumeX, PhoneCall,
  Users, UserCheck, UserX, Crown, Star, Award, Flame,
  Timer, Gauge, Crosshair, MapPin, Navigation, Compass,
  Search, Filter as FilterIcon, SortAsc, SortDesc,
  Copy, Share2, Download, Upload, RefreshCw, Maximize2,
  Eye, EyeOff, ThumbsUp, ThumbsDown, Heart, Flag
} from 'lucide-react';

// Advanced Node Types Configuration
const ADVANCED_NODE_TYPES = {
  // Conditional Logic
  CONDITIONAL: {
    id: 'conditional',
    name: 'Conditional Logic',
    category: 'Logic',
    icon: GitBranch,
    color: 'blue',
    description: 'Branch flow based on conditions and variables',
    inputs: ['condition', 'variables'],
    outputs: ['true', 'false', 'error'],
    config: {
      condition: '',
      operator: 'equals',
      value: '',
      variable: '',
      fallbackPath: 'false'
    }
  },
  
  // API Integration
  API_CALL: {
    id: 'api_call',
    name: 'API Integration',
    category: 'Integration',
    icon: Database,
    color: 'green',
    description: 'Call external APIs and process responses',
    inputs: ['trigger'],
    outputs: ['success', 'error', 'timeout'],
    config: {
      method: 'GET',
      url: '',
      headers: {},
      body: '',
      timeout: 30000,
      retries: 3,
      responseMapping: {},
      errorHandling: 'stop'
    }
  },

  // Webhook Handler
  WEBHOOK: {
    id: 'webhook',
    name: 'Webhook Handler',
    category: 'Integration',
    icon: Webhook,
    color: 'purple',
    description: 'Handle incoming webhook data and events',
    inputs: ['webhook_data'],
    outputs: ['processed', 'invalid', 'error'],
    config: {
      webhookUrl: '',
      method: 'POST',
      authentication: 'none',
      dataValidation: true,
      responseTemplate: '',
      timeoutMs: 10000
    }
  },

  // Loop Controller
  LOOP: {
    id: 'loop',
    name: 'Loop Controller',
    category: 'Logic',
    icon: RotateCcw,
    color: 'orange',
    description: 'Iterate through data or repeat actions',
    inputs: ['data', 'condition'],
    outputs: ['iteration', 'complete', 'break'],
    config: {
      loopType: 'for_each',
      maxIterations: 100,
      breakCondition: '',
      iterationVariable: 'item',
      continueOnError: false
    }
  },

  // Data Transformer
  DATA_TRANSFORM: {
    id: 'data_transform',
    name: 'Data Transformer',
    category: 'Processing',
    icon: Code2,
    color: 'teal',
    description: 'Transform and manipulate data structures',
    inputs: ['raw_data'],
    outputs: ['transformed', 'error'],
    config: {
      transformationType: 'map',
      script: '',
      inputSchema: {},
      outputSchema: {},
      errorHandling: 'skip'
    }
  },

  // Decision Tree
  DECISION_TREE: {
    id: 'decision_tree',
    name: 'Decision Tree',
    category: 'Logic',
    icon: Brain,
    color: 'indigo',
    description: 'Multi-path decision making with complex logic',
    inputs: ['input'],
    outputs: ['path1', 'path2', 'path3', 'default'],
    config: {
      decisions: [
        { condition: '', output: 'path1', priority: 1 },
        { condition: '', output: 'path2', priority: 2 },
        { condition: '', output: 'path3', priority: 3 }
      ],
      defaultPath: 'default',
      evaluationMode: 'first_match'
    }
  },

  // Voice Recognition
  VOICE_RECOGNITION: {
    id: 'voice_recognition',
    name: 'Voice Recognition',
    category: 'Voice',
    icon: Mic,
    color: 'pink',
    description: 'Advanced voice recognition and intent detection',
    inputs: ['audio'],
    outputs: ['recognized', 'no_match', 'error'],
    config: {
      language: 'en-US',
      confidence_threshold: 0.8,
      intent_detection: true,
      custom_vocabulary: [],
      timeout_seconds: 10,
      fallback_message: "I didn't understand that"
    }
  },

  // User Authentication
  AUTH_CHECK: {
    id: 'auth_check',
    name: 'Authentication',
    category: 'Security',
    icon: Shield,
    color: 'red',
    description: 'Verify user identity and permissions',
    inputs: ['credentials'],
    outputs: ['authenticated', 'denied', 'expired'],
    config: {
      auth_method: 'api_key',
      endpoint: '',
      required_permissions: [],
      session_timeout: 3600,
      retry_attempts: 3
    }
  },

  // SMS Integration
  SMS_SENDER: {
    id: 'sms_sender',
    name: 'SMS Sender',
    category: 'Communication',
    icon: MessageSquare,
    color: 'cyan',
    description: 'Send SMS messages to users',
    inputs: ['message', 'phone'],
    outputs: ['sent', 'failed', 'invalid_number'],
    config: {
      provider: 'twilio',
      from_number: '',
      message_template: '',
      delivery_tracking: true,
      character_limit: 160
    }
  },

  // Email Integration
  EMAIL_SENDER: {
    id: 'email_sender',
    name: 'Email Sender',
    category: 'Communication',
    icon: Mail,
    color: 'amber',
    description: 'Send automated email messages',
    inputs: ['content', 'recipient'],
    outputs: ['sent', 'failed', 'bounced'],
    config: {
      smtp_server: '',
      from_address: '',
      subject_template: '',
      html_template: '',
      attachments: [],
      priority: 'normal'
    }
  }
};

const AdvancedNodeTypesManager = ({ onNodeCreate, onNodeUpdate, onNodeDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [nodeConfig, setNodeConfig] = useState({});

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    Object.values(ADVANCED_NODE_TYPES).forEach(node => cats.add(node.category));
    return Array.from(cats);
  }, []);

  // Filter nodes based on search and category
  const filteredNodes = useMemo(() => {
    return Object.values(ADVANCED_NODE_TYPES).filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || node.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Handle node configuration
  const handleConfigureNode = useCallback((nodeType) => {
    setSelectedNode(nodeType);
    setNodeConfig(nodeType.config);
    setIsConfiguring(true);
  }, []);

  // Save node configuration
  const handleSaveConfiguration = useCallback(() => {
    if (selectedNode) {
      const configuredNode = {
        ...selectedNode,
        config: nodeConfig,
        id: `${selectedNode.id}_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      
      onNodeCreate?.(configuredNode);
      setIsConfiguring(false);
      setSelectedNode(null);
      setNodeConfig({});
    }
  }, [selectedNode, nodeConfig, onNodeCreate]);

  // Get color classes for node types
  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300',
      green: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300',
      orange: 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300',
      teal: 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-700 dark:text-teal-300',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-700 dark:text-indigo-300',
      pink: 'bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-300',
      red: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-900/20 dark:border-cyan-700 dark:text-cyan-300',
      amber: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300'
    };
    return colorMap[color] || colorMap.blue;
  };

  // Configuration Modal Component
  const ConfigurationModal = () => {
    if (!isConfiguring || !selectedNode) return null;

    const IconComponent = selectedNode.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="w-full max-w-4xl h-5/6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getColorClasses(selectedNode.color)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Configure {selectedNode.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedNode.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsConfiguring(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Configuration Form */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                {/* Node Inputs/Outputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Input Connections
                    </h3>
                    <div className="space-y-2">
                      {selectedNode.inputs.map(input => (
                        <div key={input} className="flex items-center space-x-2">
                          <ArrowRight className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{input}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Output Connections
                    </h3>
                    <div className="space-y-2">
                      {selectedNode.outputs.map(output => (
                        <div key={output} className="flex items-center space-x-2">
                          <ArrowDown className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{output}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Configuration Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Configuration
                  </h3>
                  
                  {/* Dynamic configuration based on node type */}
                  {selectedNode.id === 'conditional' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Condition Variable
                        </label>
                        <input
                          type="text"
                          value={nodeConfig.variable || ''}
                          onChange={(e) => setNodeConfig({...nodeConfig, variable: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="e.g., user_response, score, status"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Operator
                        </label>
                        <select
                          value={nodeConfig.operator || 'equals'}
                          onChange={(e) => setNodeConfig({...nodeConfig, operator: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="equals">Equals</option>
                          <option value="not_equals">Not Equals</option>
                          <option value="greater_than">Greater Than</option>
                          <option value="less_than">Less Than</option>
                          <option value="contains">Contains</option>
                          <option value="starts_with">Starts With</option>
                          <option value="regex">Regex Match</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Comparison Value
                        </label>
                        <input
                          type="text"
                          value={nodeConfig.value || ''}
                          onChange={(e) => setNodeConfig({...nodeConfig, value: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Value to compare against"
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.id === 'api_call' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          API Method
                        </label>
                        <select
                          value={nodeConfig.method || 'GET'}
                          onChange={(e) => setNodeConfig({...nodeConfig, method: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                          <option value="PATCH">PATCH</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          API URL
                        </label>
                        <input
                          type="url"
                          value={nodeConfig.url || ''}
                          onChange={(e) => setNodeConfig({...nodeConfig, url: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="https://api.example.com/endpoint"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Request Body (JSON)
                        </label>
                        <textarea
                          value={nodeConfig.body || ''}
                          onChange={(e) => setNodeConfig({...nodeConfig, body: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                          placeholder='{"key": "value"}'
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Timeout (ms)
                          </label>
                          <input
                            type="number"
                            value={nodeConfig.timeout || 30000}
                            onChange={(e) => setNodeConfig({...nodeConfig, timeout: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            min="1000"
                            max="120000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Retry Attempts
                          </label>
                          <input
                            type="number"
                            value={nodeConfig.retries || 3}
                            onChange={(e) => setNodeConfig({...nodeConfig, retries: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            min="0"
                            max="10"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add more configuration forms for other node types */}
                  {selectedNode.id === 'voice_recognition' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={nodeConfig.language || 'en-US'}
                          onChange={(e) => setNodeConfig({...nodeConfig, language: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="en-US">English (US)</option>
                          <option value="en-GB">English (UK)</option>
                          <option value="es-ES">Spanish</option>
                          <option value="fr-FR">French</option>
                          <option value="de-DE">German</option>
                          <option value="it-IT">Italian</option>
                          <option value="pt-BR">Portuguese (Brazil)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confidence Threshold
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.1"
                            value={nodeConfig.confidence_threshold || 0.8}
                            onChange={(e) => setNodeConfig({...nodeConfig, confidence_threshold: parseFloat(e.target.value)})}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                            {nodeConfig.confidence_threshold || 0.8}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={nodeConfig.intent_detection || false}
                            onChange={(e) => setNodeConfig({...nodeConfig, intent_detection: e.target.checked})}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Enable Intent Detection
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Fallback Message
                        </label>
                        <input
                          type="text"
                          value={nodeConfig.fallback_message || ''}
                          onChange={(e) => setNodeConfig({...nodeConfig, fallback_message: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Message when recognition fails"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t dark:border-gray-700 flex justify-between">
              <button
                onClick={() => setIsConfiguring(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setNodeConfig(selectedNode.config)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Reset
                </button>
                <button
                  onClick={handleSaveConfiguration}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Node
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Advanced Node Types
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sophisticated logic and integration components
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search node types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Node Types Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map(nodeType => {
            const IconComponent = nodeType.icon;
            return (
              <div
                key={nodeType.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${getColorClasses(nodeType.color)}`}
                onClick={() => handleConfigureNode(nodeType)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">{nodeType.name}</h3>
                      <p className="text-xs opacity-75">{nodeType.category}</p>
                    </div>
                  </div>
                  <button className="opacity-50 hover:opacity-100">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm opacity-80 mb-4">{nodeType.description}</p>

                <div className="flex justify-between text-xs">
                  <div>
                    <span className="opacity-75">Inputs: </span>
                    <span>{nodeType.inputs.length}</span>
                  </div>
                  <div>
                    <span className="opacity-75">Outputs: </span>
                    <span>{nodeType.outputs.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNodes.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No nodes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      <ConfigurationModal />
    </div>
  );
};

export default AdvancedNodeTypesManager;
