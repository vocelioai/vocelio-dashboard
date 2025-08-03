import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  EdgeTypes,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Save, Phone, Download, Upload, Rocket, Play, Settings,
  MessageSquare, PhoneCall, PhoneOff, Zap, Brain, Clock,
  Plus, Trash2, Edit, X, Check, AlertTriangle,
  Sun, Moon, Grid, Layers, TestTube, Users
} from 'lucide-react';
import { flowService, callService } from '../lib/supabase';

// Custom Node Components
const StartNode = ({ data, selected }) => (
  <div className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg ${
    selected ? 'ring-4 ring-green-300' : ''
  }`}>
    <div className="flex items-center space-x-2">
      <PhoneCall className="w-5 h-5" />
      <div>
        <div className="font-semibold text-sm">{data.label}</div>
        <div className="text-xs opacity-90">Call Entry Point</div>
      </div>
    </div>
  </div>
);

const MessageNode = ({ data, selected }) => (
  <div className={`px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600 shadow-lg ${
    selected ? 'ring-4 ring-blue-300' : ''
  }`}>
    <div className="flex items-center space-x-2">
      <MessageSquare className="w-5 h-5 text-blue-500" />
      <div>
        <div className="font-semibold text-sm text-gray-900 dark:text-white">{data.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
          {data.script || 'No script set'}
        </div>
      </div>
    </div>
  </div>
);

const ConditionNode = ({ data, selected }) => (
  <div className={`px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 border-orange-300 dark:border-orange-600 shadow-lg ${
    selected ? 'ring-4 ring-orange-300' : ''
  }`}>
    <div className="flex items-center space-x-2">
      <Brain className="w-5 h-5 text-orange-500" />
      <div>
        <div className="font-semibold text-sm text-gray-900 dark:text-white">{data.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Decision Point</div>
      </div>
    </div>
  </div>
);

const ActionNode = ({ data, selected }) => (
  <div className={`px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-600 shadow-lg ${
    selected ? 'ring-4 ring-purple-300' : ''
  }`}>
    <div className="flex items-center space-x-2">
      <Zap className="w-5 h-5 text-purple-500" />
      <div>
        <div className="font-semibold text-sm text-gray-900 dark:text-white">{data.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Action</div>
      </div>
    </div>
  </div>
);

const EndNode = ({ data, selected }) => (
  <div className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg ${
    selected ? 'ring-4 ring-red-300' : ''
  }`}>
    <div className="flex items-center space-x-2">
      <PhoneOff className="w-5 h-5" />
      <div>
        <div className="font-semibold text-sm">{data.label}</div>
        <div className="text-xs opacity-90">Call End</div>
      </div>
    </div>
  </div>
);

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
  end: EndNode,
};

// Default nodes with your requirements
const defaultNodes = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Start Call',
      script: 'Hello! Thank you for calling. How can I help you today?',
      objectionHandling: {
        tooExpensive: '',
        alreadyHaveAgency: '',
        notInterested: ''
      },
      settings: {
        temperature: 0.7,
        interruptionThreshold: 1000,
        skipResponses: false
      }
    }
  },
  {
    id: 'message-1',
    type: 'message',
    position: { x: 100, y: 250 },
    data: {
      label: 'Introduce Services',
      script: 'We offer premium digital marketing solutions to help grow your business...',
      objectionHandling: {
        tooExpensive: 'I understand cost is a concern. Let me explain our ROI...',
        alreadyHaveAgency: 'That\'s great! How satisfied are you with their results?',
        notInterested: 'I appreciate your honesty. Can I ask what\'s working for you now?'
      },
      settings: {
        temperature: 0.7,
        interruptionThreshold: 1000,
        skipResponses: false
      }
    }
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 100, y: 400 },
    data: { 
      label: 'End Call',
      script: 'Thank you for your time. Have a great day!',
      objectionHandling: {
        tooExpensive: '',
        alreadyHaveAgency: '',
        notInterested: ''
      },
      settings: {
        temperature: 0.7,
        interruptionThreshold: 1000,
        skipResponses: false
      }
    }
  }
];

const defaultEdges = [
  {
    id: 'e1-2',
    source: 'start-1',
    target: 'message-1',
    label: 'Next',
    type: 'smoothstep'
  },
  {
    id: 'e2-3',
    source: 'message-1',
    target: 'end-1',
    label: 'Continue',
    type: 'smoothstep'
  }
];

// Sidebar Node Editor Component
const NodeEditor = ({ selectedNode, onUpdateNode, onDeleteNode, onClose, darkMode }) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data || {});

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data);
    }
  }, [selectedNode]);

  const handleUpdate = (field, value) => {
    const newData = { ...nodeData, [field]: value };
    setNodeData(newData);
    onUpdateNode(selectedNode.id, newData);
  };

  const handleObjectionUpdate = (type, value) => {
    const newObjections = { ...nodeData.objectionHandling, [type]: value };
    const newData = { ...nodeData, objectionHandling: newObjections };
    setNodeData(newData);
    onUpdateNode(selectedNode.id, newData);
  };

  const handleSettingsUpdate = (setting, value) => {
    const newSettings = { ...nodeData.settings, [setting]: value };
    const newData = { ...nodeData, settings: newSettings };
    setNodeData(newData);
    onUpdateNode(selectedNode.id, newData);
  };

  if (!selectedNode) return null;

  return (
    <div className={`fixed right-0 top-0 h-full w-96 ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-l shadow-lg z-50 overflow-y-auto`}>
      
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
        <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Edit Node: {selectedNode.data.label}
        </h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Node Label */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Node Label
          </label>
          <input
            type="text"
            value={nodeData.label || ''}
            onChange={(e) => handleUpdate('label', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Enter node label"
          />
        </div>

        {/* Main Script */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Main Script
          </label>
          <textarea
            value={nodeData.script || ''}
            onChange={(e) => handleUpdate('script', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="What should the AI say in this node?"
          />
        </div>

        {/* Objection Handling */}
        <div>
          <h4 className={`font-medium text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Objection Handling
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Too Expensive
              </label>
              <textarea
                value={nodeData.objectionHandling?.tooExpensive || ''}
                onChange={(e) => handleObjectionUpdate('tooExpensive', e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Response to price objections..."
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Already Have Agency
              </label>
              <textarea
                value={nodeData.objectionHandling?.alreadyHaveAgency || ''}
                onChange={(e) => handleObjectionUpdate('alreadyHaveAgency', e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Response when they have existing agency..."
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Not Interested
              </label>
              <textarea
                value={nodeData.objectionHandling?.notInterested || ''}
                onChange={(e) => handleObjectionUpdate('notInterested', e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Response to lack of interest..."
              />
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div>
          <h4 className={`font-medium text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Advanced Settings
          </h4>
          
          <div className="space-y-4">
            {/* Temperature */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Temperature: {nodeData.settings?.temperature || 0.7}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={nodeData.settings?.temperature || 0.7}
                onChange={(e) => handleSettingsUpdate('temperature', parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Focused (0)</span>
                <span>Creative (1)</span>
              </div>
            </div>

            {/* Interruption Threshold */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Interruption Threshold (ms)
              </label>
              <input
                type="number"
                min="500"
                max="5000"
                step="100"
                value={nodeData.settings?.interruptionThreshold || 1000}
                onChange={(e) => handleSettingsUpdate('interruptionThreshold', parseInt(e.target.value))}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Skip Responses */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={nodeData.settings?.skipResponses || false}
                onChange={(e) => handleSettingsUpdate('skipResponses', e.target.checked)}
                className="rounded focus:ring-blue-500 text-blue-500"
              />
              <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Skip Responses
              </label>
            </div>
          </div>
        </div>

        {/* Delete Node */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Node</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Test Call Modal
const TestCallModal = ({ isOpen, onClose, onCall, darkMode }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCall = async () => {
    if (!phoneNumber.trim()) return;
    
    setIsLoading(true);
    await onCall(phoneNumber);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg shadow-xl w-96 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <h3 className="text-lg font-semibold mb-4">Test Call</h3>
        
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="+1234567890"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className={`flex-1 py-2 px-4 rounded-lg border ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleCall}
            disabled={!phoneNumber.trim() || isLoading}
            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Phone className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Calling...' : 'Start Test Call'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main FlowBuilder Component
export default function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const reactFlowWrapper = useRef(null);

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle edge connection
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    [setEdges]
  );

  // Update node data
  const updateNode = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  // Delete node
  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // Add new node
  const addNode = useCallback((type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        script: '',
        objectionHandling: {
          tooExpensive: '',
          alreadyHaveAgency: '',
          notInterested: ''
        },
        settings: {
          temperature: 0.7,
          interruptionThreshold: 1000,
          skipResponses: false
        }
      }
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Save flow
  const saveFlow = async () => {
    setIsLoading(true);
    try {
      const result = await flowService.saveFlow({
        name: `Flow ${new Date().toLocaleDateString()}`,
        nodes,
        edges
      });
      
      if (result.success) {
        showNotification('Flow saved successfully!', 'success');
      } else {
        if (result.error.includes('Supabase not configured')) {
          showNotification('Please configure Supabase in .env.local to save flows', 'error');
        } else {
          showNotification(`Error saving flow: ${result.error}`, 'error');
        }
      }
    } catch (error) {
      showNotification('Error saving flow. Check your Supabase configuration.', 'error');
    }
    setIsLoading(false);
  };

  // Load flow
  const loadFlow = async () => {
    setIsLoading(true);
    try {
      const result = await flowService.loadLatestFlow();
      
      if (result.success) {
        setNodes(result.data.nodes);
        setEdges(result.data.edges);
        showNotification('Flow loaded successfully!', 'success');
      } else {
        if (result.error.includes('Supabase not configured')) {
          showNotification('Please configure Supabase in .env.local to load flows', 'error');
        } else {
          showNotification(`Error loading flow: ${result.error}`, 'error');
        }
      }
    } catch (error) {
      showNotification('Error loading flow. Check your Supabase configuration.', 'error');
    }
    setIsLoading(false);
  };

  // Test call
  const testCall = async (phoneNumber) => {
    try {
      const result = await callService.testCall(phoneNumber, nodes);
      
      if (result.success) {
        showNotification('Test call initiated successfully!', 'success');
        setShowTestModal(false);
      } else {
        showNotification(`Error initiating call: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error making test call', 'error');
    }
  };

  return (
    <div className={`h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Canvas */}
      <div className="flex-1 relative">
        
        {/* Top Toolbar */}
        <div className={`absolute top-4 left-4 right-4 z-10 flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Vocelio Flow Builder
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Add Node Buttons */}
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => addNode('message')}
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                title="Add Message Node"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => addNode('condition')}
                className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded"
                title="Add Condition Node"
              >
                <Brain className="w-4 h-4" />
              </button>
              <button
                onClick={() => addNode('action')}
                className="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded"
                title="Add Action Node"
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={saveFlow}
                disabled={isLoading}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              
              <button
                onClick={() => setShowTestModal(true)}
                className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Phone className="w-4 h-4" />
                <span>Test Call</span>
              </button>
              
              <button
                onClick={loadFlow}
                disabled={isLoading}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Load</span>
              </button>
              
              <button
                onClick={() => showNotification('Promote to Production feature coming soon!', 'info')}
                className="flex items-center space-x-1 px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                <Rocket className="w-4 h-4" />
                <span>Promote</span>
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div ref={reactFlowWrapper} className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className={darkMode ? 'dark' : ''}
          >
            <Controls />
            <MiniMap 
              className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}
              nodeColor={darkMode ? '#374151' : '#e5e7eb'}
            />
            <Background 
              variant="dots" 
              gap={12} 
              size={1} 
              color={darkMode ? '#374151' : '#e5e7eb'} 
            />
          </ReactFlow>
        </div>
      </div>

      {/* Sidebar Node Editor */}
      <NodeEditor
        selectedNode={selectedNode}
        onUpdateNode={updateNode}
        onDeleteNode={deleteNode}
        onClose={() => setSelectedNode(null)}
        darkMode={darkMode}
      />

      {/* Test Call Modal */}
      <TestCallModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        onCall={testCall}
        darkMode={darkMode}
      />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && <Check className="w-5 h-5" />}
            {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
