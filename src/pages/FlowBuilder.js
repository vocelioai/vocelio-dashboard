// 🚀 WORLD-CLASS ENTERPRISE FLOW BUILDER 🚀
// The most advanced and feature-rich flow builder in the world
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { Editor } from '@monaco-editor/react';
import { useHotkeys } from 'react-hotkeys-hook';
import debounce from 'lodash.debounce';
import { v4 as uuidv4 } from 'uuid';

// Icons from lucide-react
import {
  Play, Square, RotateCcw, Save, Share2, Download, Upload, 
  Settings, Users, MessageSquare, Phone, Database, Globe, 
  Zap, Bot, Shield, BarChart3, TestTube, Clock, Bell,
  Plus, Search, Filter, Grid, List, Eye, EyeOff, Lock,
  Unlock, Copy, Trash2, Move, RotateCw, Maximize,
  Minimize, X, ChevronDown, ChevronUp, ChevronLeft,
  ChevronRight, Home, Folder, FileText, Code, Image,
  Video, Music, Mail, Calendar, Map, Star, Heart,
  Bookmark, Tag, Flag, AlertCircle, CheckCircle, 
  XCircle, Info, HelpCircle, Lightbulb, Target,
  TrendingUp, Award, Gift, Sparkles, Wand2, Palette,
  Layers, Monitor, Smartphone, Tablet, Cpu, Workflow,
  Network, Server, Cloud, Link, Anchor, Compass,
  Navigation, Route, Signpost, MapPin, Locate, GitBranch,
  Loader2
} from 'lucide-react';

// 🎯 WORLD-CLASS ENTERPRISE FLOW BUILDER COMPONENT
const EnterpriseFlowBuilder = () => {
  // 🚀 ENHANCED STATE MANAGEMENT
  const [activeView, setActiveView] = useState('canvas');
  const [canvasNodes, setCanvasNodes] = useState([
    // Sample nodes to showcase functionality
    {
      id: 'demo-1',
      type: 'phone',
      label: 'Phone Call',
      icon: Phone,
      color: 'from-green-500 to-emerald-600',
      position: { x: 200, y: 150 },
      data: { label: 'Incoming Call', phoneNumber: '+1 (555) 123-4567' }
    },
    {
      id: 'demo-2',
      type: 'ai-assistant',
      label: 'AI Assistant',
      icon: Bot,
      color: 'from-purple-500 to-indigo-600',
      position: { x: 500, y: 200 },
      data: { label: 'AI Processing', model: 'gpt-4', systemPrompt: 'You are a helpful customer service assistant.' }
    },
    {
      id: 'demo-3',
      type: 'webhook',
      label: 'Webhook',
      icon: Globe,
      color: 'from-teal-500 to-green-600',
      position: { x: 350, y: 350 },
      data: { label: 'Send to CRM', url: 'https://api.example.com/webhook', method: 'POST' }
    }
  ]);
  const [canvasConnections, setCanvasConnections] = useState([
    // Sample connection to showcase functionality
    { id: 'conn-1', source: 'demo-1', target: 'demo-2', sourceHandle: 'output', targetHandle: 'input' },
    { id: 'conn-2', source: 'demo-2', target: 'demo-3', sourceHandle: 'output', targetHandle: 'input' }
  ]);
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [selectedConnections, setSelectedConnections] = useState(new Set());
  const [draggedNode, setDraggedNode] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [connectionEnd, setConnectionEnd] = useState(null);
  const [connections, setConnections] = useState([]); // Visual connections between nodes
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [selectedNodeForProperties, setSelectedNodeForProperties] = useState(null);
  const [flowName, setFlowName] = useState('Untitled Flow'); // Main flow name
  const [showCreateFlowModal, setShowCreateFlowModal] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [aiAssistantExpanded, setAiAssistantExpanded] = useState(true);
  const [realTimeUsers, setRealTimeUsers] = useState([]);
  const [flowHistory, setFlowHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [flowTesting, setFlowTesting] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  // Phase 2: Advanced Flow Management State
  const [flowVersions, setFlowVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState('1.0.0');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [flowBranches, setFlowBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState('main');

  // Refs for advanced functionality
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const autoSaveRef = useRef(null);
  const historyRef = useRef([]);

  // 🌟 20+ ENTERPRISE NODE TYPES
  const nodeTypes = useMemo(() => [
    // AI & ML Nodes
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, color: 'from-purple-500 to-indigo-600', category: 'AI' },
    { id: 'ml-prediction', label: 'ML Prediction', icon: TrendingUp, color: 'from-green-500 to-teal-600', category: 'AI' },
    { id: 'nlp-processor', label: 'NLP Processor', icon: MessageSquare, color: 'from-blue-500 to-purple-600', category: 'AI' },
    { id: 'vision-ai', label: 'Vision AI', icon: Eye, color: 'from-orange-500 to-red-600', category: 'AI' },

    // Communication Nodes
    { id: 'phone', label: 'Phone Call', icon: Phone, color: 'from-green-500 to-emerald-600', category: 'Communication' },
    { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'from-blue-500 to-cyan-600', category: 'Communication' },
    { id: 'email', label: 'Email', icon: Mail, color: 'from-red-500 to-pink-600', category: 'Communication' },
    { id: 'voicemail', label: 'Voicemail', icon: Music, color: 'from-indigo-500 to-purple-600', category: 'Communication' },

    // Routing & Logic Nodes
    { id: 'condition', label: 'Condition', icon: Route, color: 'from-yellow-500 to-orange-600', category: 'Logic' },
    { id: 'switch', label: 'Switch', icon: Signpost, color: 'from-purple-500 to-pink-600', category: 'Logic' },
    { id: 'loop', label: 'Loop', icon: RotateCw, color: 'from-green-500 to-blue-600', category: 'Logic' },
    { id: 'timer', label: 'Timer', icon: Clock, color: 'from-orange-500 to-red-600', category: 'Logic' },

    // Integration Nodes
    { id: 'webhook', label: 'Webhook', icon: Globe, color: 'from-teal-500 to-green-600', category: 'Integration' },
    { id: 'database', label: 'Database', icon: Database, color: 'from-gray-500 to-slate-600', category: 'Integration' },
    { id: 'api-call', label: 'API Call', icon: Network, color: 'from-blue-500 to-indigo-600', category: 'Integration' },
    { id: 'cloud-service', label: 'Cloud Service', icon: Cloud, color: 'from-sky-500 to-blue-600', category: 'Integration' },

    // Analytics & Testing Nodes
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-violet-500 to-purple-600', category: 'Analytics' },
    { id: 'ab-test', label: 'A/B Test', icon: TestTube, color: 'from-emerald-500 to-green-600', category: 'Testing' },
    { id: 'performance', label: 'Performance', icon: Cpu, color: 'from-red-500 to-orange-600', category: 'Analytics' },
    { id: 'monitoring', label: 'Monitoring', icon: Monitor, color: 'from-blue-500 to-cyan-600', category: 'Analytics' },

    // Security & Compliance Nodes
    { id: 'auth', label: 'Authentication', icon: Shield, color: 'from-red-500 to-pink-600', category: 'Security' },
    { id: 'encryption', label: 'Encryption', icon: Lock, color: 'from-gray-500 to-slate-600', category: 'Security' },
    { id: 'compliance', label: 'Compliance', icon: Award, color: 'from-yellow-500 to-orange-600', category: 'Security' },
    { id: 'audit-log', label: 'Audit Log', icon: FileText, color: 'from-indigo-500 to-blue-600', category: 'Security' },
  ], []);

  // 🎨 FLOW TEMPLATES - Phase 2 Advanced Template System
  const [flowTemplates, setFlowTemplates] = useState([
    {
      id: 'customer-service',
      name: 'Customer Service Flow',
      thumbnail: '🎧',
      description: 'Advanced customer service with AI routing',
      complexity: 'Advanced',
      estimatedSetup: '15 min',
      nodes: 12,
      features: ['AI Assistant', 'Smart Routing', 'Analytics'],
      category: 'Customer Service',
      version: '2.1.0',
      author: 'Vocelio Team',
      downloads: 2847,
      rating: 4.9,
      tags: ['ai', 'routing', 'support'],
      preview: {
        nodes: [
          { id: '1', type: 'start', x: 100, y: 100 },
          { id: '2', type: 'ai-assistant', x: 300, y: 100 },
          { id: '3', type: 'decision', x: 500, y: 100 }
        ],
        connections: [
          { from: '1', to: '2' },
          { from: '2', to: '3' }
        ]
      }
    },
    {
      id: 'sales-automation',
      name: 'Sales Automation',
      thumbnail: '💼',
      description: 'Complete sales funnel automation',
      complexity: 'Expert',
      estimatedSetup: '25 min',
      nodes: 18,
      features: ['CRM Integration', 'Lead Scoring', 'Follow-up'],
      category: 'Sales',
      version: '3.0.0',
      author: 'Sales Team',
      downloads: 1923,
      rating: 4.8,
      tags: ['crm', 'sales', 'automation'],
      preview: {
        nodes: [
          { id: '1', type: 'start', x: 100, y: 100 },
          { id: '2', type: 'crm-lookup', x: 300, y: 100 },
          { id: '3', type: 'lead-scoring', x: 500, y: 100 }
        ],
        connections: [
          { from: '1', to: '2' },
          { from: '2', to: '3' }
        ]
      }
    },
    {
      id: 'marketing-campaign',
      name: 'Marketing Campaign',
      thumbnail: '📈',
      description: 'Multi-channel marketing automation',
      complexity: 'Intermediate',
      estimatedSetup: '20 min',
      nodes: 15,
      features: ['A/B Testing', 'Segmentation', 'Analytics'],
      category: 'Marketing',
      version: '1.8.0',
      author: 'Marketing Team',
      downloads: 3156,
      rating: 4.7,
      tags: ['marketing', 'ab-test', 'analytics'],
      preview: {
        nodes: [
          { id: '1', type: 'start', x: 100, y: 100 },
          { id: '2', type: 'segment', x: 300, y: 100 },
          { id: '3', type: 'ab-test', x: 500, y: 100 }
        ],
        connections: [
          { from: '1', to: '2' },
          { from: '2', to: '3' }
        ]
      }
    },
    {
      id: 'voice-survey',
      name: 'Voice Survey Flow',
      thumbnail: '📋',
      description: 'Interactive voice survey with analytics',
      complexity: 'Beginner',
      estimatedSetup: '10 min',
      nodes: 8,
      features: ['Voice Recording', 'Data Collection', 'Reports'],
      category: 'Research',
      version: '1.5.0',
      author: 'Research Team',
      downloads: 1654,
      rating: 4.6,
      tags: ['survey', 'voice', 'data'],
      preview: {
        nodes: [
          { id: '1', type: 'start', x: 100, y: 100 },
          { id: '2', type: 'voice-prompt', x: 300, y: 100 },
          { id: '3', type: 'record', x: 500, y: 100 }
        ],
        connections: [
          { from: '1', to: '2' },
          { from: '2', to: '3' }
        ]
      }
    },
    {
      id: 'appointment-booking',
      name: 'Appointment Booking',
      thumbnail: '📅',
      description: 'Smart appointment scheduling system',
      complexity: 'Intermediate',
      estimatedSetup: '18 min',
      nodes: 14,
      features: ['Calendar Integration', 'Reminders', 'Confirmations'],
      category: 'Scheduling',
      version: '2.3.0',
      author: 'Scheduling Team',
      downloads: 2341,
      rating: 4.8,
      tags: ['calendar', 'booking', 'reminders'],
      preview: {
        nodes: [
          { id: '1', type: 'start', x: 100, y: 100 },
          { id: '2', type: 'calendar-check', x: 300, y: 100 },
          { id: '3', type: 'booking', x: 500, y: 100 }
        ],
        connections: [
          { from: '1', to: '2' },
          { from: '2', to: '3' }
        ]
      }
    }
  ]);

  // 🚀 WORLD-CLASS KEYBOARD SHORTCUTS
  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    saveFlow();
  });

  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault();
    undo();
  });

  useHotkeys('ctrl+y, cmd+y', (e) => {
    e.preventDefault();
    redo();
  });

  useHotkeys('delete, backspace', (e) => {
    if (selectedNodes.size > 0) {
      e.preventDefault();
      deleteSelectedNodes();
    }
  });

  useHotkeys('ctrl+a, cmd+a', (e) => {
    e.preventDefault();
    selectAllNodes();
  });

  useHotkeys('ctrl+d, cmd+d', (e) => {
    e.preventDefault();
    duplicateSelectedNodes();
  });

  useHotkeys('ctrl+g, cmd+g', (e) => {
    e.preventDefault();
    groupSelectedNodes();
  });

  // 🎯 AI-POWERED FUNCTIONS
  const optimizeFlow = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/optimize-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: canvasNodes, connections: canvasConnections })
      });
      const optimization = await response.json();
      // Apply AI recommendations
      console.log('AI Optimization:', optimization);
    } catch (error) {
      console.error('Flow optimization failed:', error);
    }
  }, [canvasNodes, canvasConnections]);

  const generateFlowFromPrompt = useCallback(async (prompt) => {
    try {
      const response = await fetch('/api/ai/generate-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const generatedFlow = await response.json();
      setCanvasNodes(generatedFlow.nodes);
      setCanvasConnections(generatedFlow.connections);
    } catch (error) {
      console.error('AI flow generation failed:', error);
    }
  }, []);

  // 🔄 REAL-TIME COLLABORATION ENGINE
  useEffect(() => {
    if (collaborationMode) {
      socketRef.current = io('/flow-collaboration');
      
      socketRef.current.on('user-joined', (user) => {
        setRealTimeUsers(prev => [...prev, user]);
      });

      socketRef.current.on('user-left', (userId) => {
        setRealTimeUsers(prev => prev.filter(u => u.id !== userId));
      });

      socketRef.current.on('flow-updated', (flowData) => {
        setCanvasNodes(flowData.nodes);
        setCanvasConnections(flowData.connections);
      });

      socketRef.current.on('cursor-moved', (cursorData) => {
        // Handle real-time cursor updates
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [collaborationMode]);

  // 💾 AUTO-SAVE FUNCTIONALITY
  useEffect(() => {
    const debouncedSave = debounce(() => {
      saveFlow();
    }, 2000);

    const saveTimer = setInterval(() => {
      if (canvasNodes.length > 0) {
        debouncedSave();
      }
    }, 5000);

    return () => {
      clearInterval(saveTimer);
      debouncedSave.cancel();
    };
  }, [canvasNodes, canvasConnections]);

  // 🚀 Phase 2: Advanced Template Management
  const createTemplateFromFlow = useCallback(() => {
    const template = {
      id: `template_${Date.now()}`,
      name: flowName || 'Custom Template',
      thumbnail: '🎨',
      description: 'Custom flow template',
      complexity: canvasNodes.length > 15 ? 'Expert' : canvasNodes.length > 8 ? 'Intermediate' : 'Beginner',
      estimatedSetup: `${Math.ceil(canvasNodes.length * 1.5)} min`,
      nodes: canvasNodes.length,
      features: ['Custom Logic', 'Personalized Flow'],
      category: 'Custom',
      version: '1.0.0',
      author: 'You',
      downloads: 0,
      rating: 5.0,
      tags: ['custom', 'personal'],
      preview: {
        nodes: canvasNodes.slice(0, 3),
        connections: connections.slice(0, 2)
      },
      flowData: { nodes: canvasNodes, connections }
    };
    
    setFlowTemplates(prev => [...prev, template]);
    setShowTemplateModal(false);
  }, [flowName, canvasNodes, connections]);

  const loadTemplate = useCallback((templateId) => {
    const template = flowTemplates.find(t => t.id === templateId);
    if (template && template.flowData) {
      setCanvasNodes(template.flowData.nodes);
      setConnections(template.flowData.connections);
      setFlowName(template.name);
      addToHistory({ nodes: template.flowData.nodes, connections: template.flowData.connections });
    }
  }, [flowTemplates]);

  // 🔀 Version Control System
  const createVersion = useCallback((versionName, description = '') => {
    const newVersion = {
      id: `v_${Date.now()}`,
      version: versionName || `${parseInt(currentVersion.split('.')[0]) + 1}.0.0`,
      name: versionName,
      description,
      timestamp: new Date().toISOString(),
      author: 'Current User',
      flowData: { nodes: canvasNodes, connections },
      branch: currentBranch,
      changes: validationErrors.length === 0 ? 'Stable' : 'Has Issues'
    };
    
    setFlowVersions(prev => [...prev, newVersion]);
    setCurrentVersion(newVersion.version);
    setShowVersionModal(false);
  }, [canvasNodes, connections, currentVersion, currentBranch, validationErrors]);

  const loadVersion = useCallback((versionId) => {
    const version = flowVersions.find(v => v.id === versionId);
    if (version) {
      setCanvasNodes(version.flowData.nodes);
      setConnections(version.flowData.connections);
      setCurrentVersion(version.version);
      addToHistory(version.flowData);
    }
  }, [flowVersions]);

  const createBranch = useCallback((branchName) => {
    const newBranch = {
      id: `branch_${Date.now()}`,
      name: branchName,
      createdFrom: currentBranch,
      timestamp: new Date().toISOString(),
      flowData: { nodes: canvasNodes, connections }
    };
    
    setFlowBranches(prev => [...prev, newBranch]);
    setCurrentBranch(branchName);
  }, [currentBranch, canvasNodes, connections]);

  // 🔍 Advanced Flow Validation
  const validateFlow = useCallback(() => {
    setIsValidating(true);
    const errors = [];
    
    // Check for orphaned nodes
    const connectedNodeIds = new Set();
    connections.forEach(conn => {
      connectedNodeIds.add(conn.from);
      connectedNodeIds.add(conn.to);
    });
    
    canvasNodes.forEach(node => {
      if (!connectedNodeIds.has(node.id) && node.type !== 'start' && node.type !== 'end') {
        errors.push({
          id: `orphan_${node.id}`,
          type: 'warning',
          message: `Node "${node.label}" is not connected`,
          nodeId: node.id
        });
      }
    });

    // Check for missing end nodes
    const hasEndNode = canvasNodes.some(node => node.type === 'end');
    if (canvasNodes.length > 1 && !hasEndNode) {
      errors.push({
        id: 'no_end_node',
        type: 'error',
        message: 'Flow must have at least one end node'
      });
    }

    // Check for circular references
    const visited = new Set();
    const checkCircular = (nodeId, path = []) => {
      if (path.includes(nodeId)) {
        errors.push({
          id: `circular_${Date.now()}`,
          type: 'error',
          message: `Circular reference detected: ${path.join(' → ')} → ${nodeId}`,
          nodeIds: [...path, nodeId]
        });
        return;
      }
      
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const outgoingConnections = connections.filter(conn => conn.from === nodeId);
      outgoingConnections.forEach(conn => {
        checkCircular(conn.to, [...path, nodeId]);
      });
    };
    
    const startNodes = canvasNodes.filter(node => node.type === 'start');
    startNodes.forEach(startNode => checkCircular(startNode.id));

    setValidationErrors(errors);
    setIsValidating(false);
    
    return errors.length === 0;
  }, [canvasNodes, connections]);

  // 👥 Collaboration Functions
  const inviteCollaborator = useCallback((email, role = 'editor') => {
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      role,
      status: 'invited',
      joinedAt: new Date().toISOString()
    };
    
    setOnlineUsers(prev => [...prev, newUser]);
    
    if (socketRef.current) {
      socketRef.current.emit('invite-user', { email, role, flowId: 'current' });
    }
  }, []);

  const startCollaboration = useCallback(() => {
    setCollaborationMode(true);
    setShowCollaborationPanel(true);
  }, []);

  const stopCollaboration = useCallback(() => {
    setCollaborationMode(false);
    setShowCollaborationPanel(false);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setOnlineUsers([]);
  }, []);

  // 📊 PERFORMANCE OPTIMIZATION
  const memoizedNodes = useMemo(() => {
    return canvasNodes.map(node => ({
      ...node,
      rendered: true
    }));
  }, [canvasNodes]);

  // 🔗 CONNECTION MANAGEMENT FUNCTIONS
  const startConnection = useCallback((nodeId, handleType) => {
    setIsConnecting(true);
    setConnectionStart({ nodeId, handleType });
  }, []);

  const endConnection = useCallback((nodeId, handleType) => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
      const newConnection = {
        id: uuidv4(),
        source: connectionStart.nodeId,
        target: nodeId,
        sourceHandle: connectionStart.handleType,
        targetHandle: handleType
      };
      setCanvasConnections([...canvasConnections, newConnection]);
    }
    setIsConnecting(false);
    setConnectionStart(null);
    setConnectionEnd(null);
  }, [connectionStart, canvasConnections]);

  const deleteConnection = useCallback((connectionId) => {
    setCanvasConnections(canvasConnections.filter(conn => conn.id !== connectionId));
    setSelectedConnections(prev => {
      const updated = new Set(prev);
      updated.delete(connectionId);
      return updated;
    });
  }, [canvasConnections]);

  // 📐 BEZIER CURVE CALCULATION
  const createConnectionPath = useCallback((sourcePos, targetPos) => {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    
    const controlOffset = Math.abs(dx) * 0.5;
    const sourceControlX = sourcePos.x + controlOffset;
    const targetControlX = targetPos.x - controlOffset;
    
    return `M ${sourcePos.x} ${sourcePos.y} C ${sourceControlX} ${sourcePos.y}, ${targetControlX} ${targetPos.y}, ${targetPos.x} ${targetPos.y}`;
  }, []);

  // 🎯 NODE POSITION HELPERS
  const getNodeCenter = useCallback((nodeId) => {
    const node = canvasNodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.position.x + 96, // Half of node width (192px)
      y: node.position.y + 48   // Half of node height (96px)
    };
  }, [canvasNodes]);

  const getConnectionHandlePosition = useCallback((nodeId, handleType) => {
    const node = canvasNodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    
    if (handleType === 'input') {
      return { x: node.position.x, y: node.position.y + 48 }; // Left center
    } else {
      return { x: node.position.x + 192, y: node.position.y + 48 }; // Right center
    }
  }, [canvasNodes]);

  // 🎨 ENHANCED UI FUNCTIONS
  const saveFlow = useCallback(() => {
    setIsAutoSaving(true);
    const flowData = {
      nodes: canvasNodes,
      connections: canvasConnections,
      metadata: {
        name: 'Untitled Flow',
        created: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    
    // Save to localStorage for now (later we'll add database integration)
    localStorage.setItem('vocelio-flow-builder', JSON.stringify(flowData));
    
    setTimeout(() => {
      setIsAutoSaving(false);
      addToHistory();
    }, 1000);
  }, [canvasNodes, canvasConnections]);

  const addToHistory = useCallback(() => {
    const snapshot = {
      nodes: [...canvasNodes],
      connections: [...canvasConnections],
      timestamp: Date.now()
    };
    
    const newHistory = [...flowHistory.slice(0, currentHistoryIndex + 1), snapshot];
    setFlowHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [canvasNodes, canvasConnections, flowHistory, currentHistoryIndex]);

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const previousState = flowHistory[currentHistoryIndex - 1];
      setCanvasNodes(previousState.nodes);
      setCanvasConnections(previousState.connections);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  }, [flowHistory, currentHistoryIndex]);

  const redo = useCallback(() => {
    if (currentHistoryIndex < flowHistory.length - 1) {
      const nextState = flowHistory[currentHistoryIndex + 1];
      setCanvasNodes(nextState.nodes);
      setCanvasConnections(nextState.connections);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    }
  }, [flowHistory, currentHistoryIndex]);

  const deleteSelectedNodes = useCallback(() => {
    const newNodes = canvasNodes.filter(node => !selectedNodes.has(node.id));
    const newConnections = canvasConnections.filter(conn => 
      !selectedNodes.has(conn.source) && !selectedNodes.has(conn.target)
    );
    
    setCanvasNodes(newNodes);
    setCanvasConnections(newConnections);
    setSelectedNodes(new Set());
  }, [canvasNodes, canvasConnections, selectedNodes]);

  const selectAllNodes = useCallback(() => {
    setSelectedNodes(new Set(canvasNodes.map(node => node.id)));
  }, [canvasNodes]);

  const duplicateSelectedNodes = useCallback(() => {
    const nodesToDuplicate = canvasNodes.filter(node => selectedNodes.has(node.id));
    const duplicatedNodes = nodesToDuplicate.map(node => ({
      ...node,
      id: uuidv4(),
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50
      }
    }));
    
    setCanvasNodes([...canvasNodes, ...duplicatedNodes]);
    setSelectedNodes(new Set(duplicatedNodes.map(node => node.id)));
  }, [canvasNodes, selectedNodes]);

  const groupSelectedNodes = useCallback(() => {
    if (selectedNodes.size < 2) return;
    
    const selectedNodesList = canvasNodes.filter(node => selectedNodes.has(node.id));
    const minX = Math.min(...selectedNodesList.map(n => n.position.x));
    const minY = Math.min(...selectedNodesList.map(n => n.position.y));
    const maxX = Math.max(...selectedNodesList.map(n => n.position.x + 200));
    const maxY = Math.max(...selectedNodesList.map(n => n.position.y + 100));
    
    const groupNode = {
      id: uuidv4(),
      type: 'group',
      position: { x: minX - 20, y: minY - 40 },
      data: {
        label: `Group (${selectedNodes.size} nodes)`,
        width: maxX - minX + 40,
        height: maxY - minY + 60,
        children: Array.from(selectedNodes)
      }
    };
    
    setCanvasNodes([...canvasNodes, groupNode]);
  }, [canvasNodes, selectedNodes]);

  // 🎨 ENHANCED SIDEBAR COMPONENT
  const EnhancedSidebar = () => (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: leftPanelCollapsed ? -250 : 0 }}
      className={`${leftPanelCollapsed ? 'w-16' : 'w-80'} bg-black/50 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 relative z-20 h-full`}
    >
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!leftPanelCollapsed && (
            <h2 className="text-lg font-bold text-white">Node Library</h2>
          )}
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            {leftPanelCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!leftPanelCollapsed && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
            </div>
          </div>

          <div className="space-y-6">
            {['AI', 'Communication', 'Logic', 'Integration', 'Analytics', 'Security'].map(category => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-2">
                  {nodeTypes
                    .filter(nodeType => nodeType.category === category)
                    .map(nodeType => (
                      <motion.div
                        key={nodeType.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 cursor-grab active:cursor-grabbing transition-all group"
                        draggable
                        onDragStart={(e) => {
                          setDraggedNode(nodeType);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragEnd={() => {
                          setDraggedNode(null);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 bg-gradient-to-br ${nodeType.color} rounded-lg group-hover:scale-110 transition-transform`}>
                            {React.createElement(nodeType.icon, { className: "w-4 h-4 text-white" })}
                          </div>
                          <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                            {nodeType.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  // 🤖 AI ASSISTANT PANEL
  const AIAssistantPanel = () => (
    <AnimatePresence>
      {aiAssistantExpanded && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed right-4 top-20 w-80 bg-gradient-to-b from-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 z-50"
        >
          <div className="p-4 border-b border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-white">AI Assistant</span>
              </div>
              <button 
                onClick={() => setAiAssistantExpanded(false)}
                className="p-1 hover:bg-purple-800 rounded"
              >
                <X className="w-4 h-4 text-purple-400" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              <div className="p-3 bg-purple-800/50 rounded-lg">
                <p className="text-sm text-purple-200">🎯 I can help you optimize your flow!</p>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={optimizeFlow}
                  className="w-full p-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white text-sm font-medium transition-all"
                >
                  Analyze Flow Performance
                </button>
                
                <button className="w-full p-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg text-white text-sm font-medium transition-all">
                  Generate Test Cases
                </button>
                
                <button className="w-full p-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg text-white text-sm font-medium transition-all">
                  Detect Issues
                </button>
              </div>
              
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Ask AI to generate a flow..."
                  className="w-full p-2 bg-purple-800/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      generateFlowFromPrompt(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // 🔧 PROPERTY PANEL COMPONENT
  const PropertyPanel = () => (
    <AnimatePresence>
      {showPropertyPanel && selectedNodeForProperties && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed right-4 top-20 w-80 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-600/50 z-50 max-h-[80vh] overflow-hidden"
        >
          <div className="p-4 border-b border-gray-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-2 bg-gradient-to-br ${selectedNodeForProperties.color} rounded-lg`}>
                  {selectedNodeForProperties.icon && React.createElement(selectedNodeForProperties.icon, { className: "w-4 h-4 text-white" })}
                </div>
                <span className="font-semibold text-white">{selectedNodeForProperties.label}</span>
              </div>
              <button 
                onClick={() => {
                  setShowPropertyPanel(false);
                  setSelectedNodeForProperties(null);
                }}
                className="p-1 hover:bg-gray-700 rounded text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-96">
            <div className="space-y-4">
              {/* Basic Properties */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Node Name
                </label>
                <input
                  type="text"
                  value={selectedNodeForProperties.data?.label || selectedNodeForProperties.label || ''}
                  onChange={(e) => {
                    const updatedNodes = canvasNodes.map(node => 
                      node.id === selectedNodeForProperties.id 
                        ? { ...node, data: { ...node.data, label: e.target.value } }
                        : node
                    );
                    setCanvasNodes(updatedNodes);
                    setSelectedNodeForProperties(prev => ({
                      ...prev,
                      data: { ...prev.data, label: e.target.value }
                    }));
                  }}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  placeholder="Enter node name"
                />
              </div>

              {/* Node Type Specific Properties */}
              {selectedNodeForProperties.type === 'phone' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={selectedNodeForProperties.data?.phoneNumber || ''}
                      onChange={(e) => {
                        const updatedNodes = canvasNodes.map(node => 
                          node.id === selectedNodeForProperties.id 
                            ? { ...node, data: { ...node.data, phoneNumber: e.target.value } }
                            : node
                        );
                        setCanvasNodes(updatedNodes);
                        setSelectedNodeForProperties(prev => ({
                          ...prev,
                          data: { ...prev.data, phoneNumber: e.target.value }
                        }));
                      }}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Call Type
                    </label>
                    <select
                      value={selectedNodeForProperties.data?.callType || 'inbound'}
                      onChange={(e) => {
                        const updatedNodes = canvasNodes.map(node => 
                          node.id === selectedNodeForProperties.id 
                            ? { ...node, data: { ...node.data, callType: e.target.value } }
                            : node
                        );
                        setCanvasNodes(updatedNodes);
                        setSelectedNodeForProperties(prev => ({
                          ...prev,
                          data: { ...prev.data, callType: e.target.value }
                        }));
                      }}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    >
                      <option value="inbound">Inbound Call</option>
                      <option value="outbound">Outbound Call</option>
                      <option value="internal">Internal Transfer</option>
                    </select>
                  </div>
                </>
              )}

              {selectedNodeForProperties.type === 'ai-assistant' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      AI Model
                    </label>
                    <select
                      value={selectedNodeForProperties.data?.model || 'gpt-4'}
                      onChange={(e) => {
                        const updatedNodes = canvasNodes.map(node => 
                          node.id === selectedNodeForProperties.id 
                            ? { ...node, data: { ...node.data, model: e.target.value } }
                            : node
                        );
                        setCanvasNodes(updatedNodes);
                        setSelectedNodeForProperties(prev => ({
                          ...prev,
                          data: { ...prev.data, model: e.target.value }
                        }));
                      }}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                      <option value="gemini-pro">Gemini Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      System Prompt
                    </label>
                    <textarea
                      value={selectedNodeForProperties.data?.systemPrompt || ''}
                      onChange={(e) => {
                        const updatedNodes = canvasNodes.map(node => 
                          node.id === selectedNodeForProperties.id 
                            ? { ...node, data: { ...node.data, systemPrompt: e.target.value } }
                            : node
                        );
                        setCanvasNodes(updatedNodes);
                        setSelectedNodeForProperties(prev => ({
                          ...prev,
                          data: { ...prev.data, systemPrompt: e.target.value }
                        }));
                      }}
                      rows={3}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      placeholder="You are a helpful customer service assistant..."
                    />
                  </div>
                </>
              )}

              {selectedNodeForProperties.type === 'webhook' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={selectedNodeForProperties.data?.url || ''}
                      onChange={(e) => {
                        const updatedNodes = canvasNodes.map(node => 
                          node.id === selectedNodeForProperties.id 
                            ? { ...node, data: { ...node.data, url: e.target.value } }
                            : node
                        );
                        setCanvasNodes(updatedNodes);
                        setSelectedNodeForProperties(prev => ({
                          ...prev,
                          data: { ...prev.data, url: e.target.value }
                        }));
                      }}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      placeholder="https://api.example.com/webhook"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      HTTP Method
                    </label>
                    <select
                      value={selectedNodeForProperties.data?.method || 'POST'}
                      onChange={(e) => {
                        const updatedNodes = canvasNodes.map(node => 
                          node.id === selectedNodeForProperties.id 
                            ? { ...node, data: { ...node.data, method: e.target.value } }
                            : node
                        );
                        setCanvasNodes(updatedNodes);
                        setSelectedNodeForProperties(prev => ({
                          ...prev,
                          data: { ...prev.data, method: e.target.value }
                        }));
                      }}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                </>
              )}

              {/* Advanced Properties */}
              <div className="pt-4 border-t border-gray-600/50">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Advanced Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={selectedNodeForProperties.data?.description || ''}
                      onChange={(e) => {
                        const updatedNodes = canvasNodes.map(node => 
                          node.id === selectedNodeForProperties.id 
                            ? { ...node, data: { ...node.data, description: e.target.value } }
                            : node
                        );
                        setCanvasNodes(updatedNodes);
                        setSelectedNodeForProperties(prev => ({
                          ...prev,
                          data: { ...prev.data, description: e.target.value }
                        }));
                      }}
                      rows={2}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      placeholder="Describe what this node does..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="node-enabled"
                      checked={selectedNodeForProperties.data?.enabled !== false}
                      onChange={(e) => {
                        const updatedNodes = canvasNodes.map(node => 
                          node.id === selectedNodeForProperties.id 
                            ? { ...node, data: { ...node.data, enabled: e.target.checked } }
                            : node
                        );
                        setCanvasNodes(updatedNodes);
                        setSelectedNodeForProperties(prev => ({
                          ...prev,
                          data: { ...prev.data, enabled: e.target.checked }
                        }));
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="node-enabled" className="text-sm text-gray-300">
                      Node Enabled
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // 📁 FLOW MANAGEMENT COMPONENT
  const FlowManagement = () => {
    const [showManagement, setShowManagement] = useState(false);
    const [flowName, setFlowName] = useState('My Flow');
    const [flows, setFlows] = useState([]);

    const saveCurrentFlow = () => {
      const flowData = {
        id: Date.now().toString(),
        name: flowName,
        nodes: canvasNodes,
        connections,
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const savedFlows = JSON.parse(localStorage.getItem('vocelio-flows') || '[]');
      savedFlows.push(flowData);
      localStorage.setItem('vocelio-flows', JSON.stringify(savedFlows));
      setFlows(savedFlows);
      
      // Show success message
      alert(`Flow "${flowName}" saved successfully!`);
    };

    const loadFlow = (flow) => {
      setCanvasNodes(flow.nodes || []);
      setConnections(flow.connections || []);
      setFlowName(flow.name);
      setShowManagement(false);
    };

    const deleteFlow = (flowId) => {
      if (window.confirm('Are you sure you want to delete this flow?')) {
        const savedFlows = JSON.parse(localStorage.getItem('vocelio-flows') || '[]');
        const updatedFlows = savedFlows.filter(flow => flow.id !== flowId);
        localStorage.setItem('vocelio-flows', JSON.stringify(updatedFlows));
        setFlows(updatedFlows);
      }
    };

    const exportFlow = () => {
      const flowData = {
        name: flowName,
        nodes: canvasNodes,
        connections,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const dataStr = JSON.stringify(flowData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${flowName.replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    const importFlow = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const flowData = JSON.parse(e.target.result);
            setCanvasNodes(flowData.nodes || []);
            setConnections(flowData.connections || []);
            setFlowName(flowData.name || 'Imported Flow');
            alert('Flow imported successfully!');
          } catch (error) {
            alert('Error importing flow: Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };

    React.useEffect(() => {
      const savedFlows = JSON.parse(localStorage.getItem('vocelio-flows') || '[]');
      setFlows(savedFlows);
    }, []);

    return (
      <>
        <button
          onClick={() => setShowManagement(true)}
          className="fixed bottom-4 left-4 p-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-30"
          title="Flow Management"
        >
          <Folder className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {showManagement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border border-gray-600"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Folder className="w-6 h-6" />
                    <span>Flow Management</span>
                  </h2>
                  <button
                    onClick={() => setShowManagement(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Current Flow */}
                  <div className="border border-gray-600 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Current Flow</h3>
                    <div className="flex items-center space-x-3 mb-4">
                      <input
                        type="text"
                        value={flowName}
                        onChange={(e) => setFlowName(e.target.value)}
                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                        placeholder="Flow name"
                      />
                      <button
                        onClick={saveCurrentFlow}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{canvasNodes.length} nodes</span>
                      <span>•</span>
                      <span>{connections.length} connections</span>
                    </div>
                  </div>

                  {/* Import/Export */}
                  <div className="border border-gray-600 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Import/Export</h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={exportFlow}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Flow</span>
                      </button>
                      <label className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Import Flow</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importFlow}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Saved Flows */}
                  <div className="border border-gray-600 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Saved Flows ({flows.length})</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {flows.length === 0 ? (
                        <div className="text-gray-400 text-center py-8">
                          <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No saved flows yet</p>
                          <p className="text-sm">Create and save your first flow above!</p>
                        </div>
                      ) : (
                        flows.map((flow) => (
                          <div key={flow.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-white">{flow.name}</h4>
                                <span className="text-xs text-gray-400">v{flow.version}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                                <span>{flow.nodes?.length || 0} nodes</span>
                                <span>•</span>
                                <span>{flow.connections?.length || 0} connections</span>
                                <span>•</span>
                                <span>{new Date(flow.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => loadFlow(flow)}
                                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                title="Load Flow"
                              >
                                <Folder className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteFlow(flow.id)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                title="Delete Flow"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  // 🎨 MAIN COMPONENT RETURN
  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 text-white overflow-hidden relative">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* World-Class Header */}
        <div className="h-16 bg-black/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 relative z-30">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {activeView === 'canvas' ? 'Flow Canvas' : 
               activeView === 'flows' ? 'Enterprise Flows' :
               activeView === 'analytics' ? 'Flow Analytics' : 'Flow Builder'}
            </h1>
            
            {isAutoSaving && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-green-400"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs">Auto-saving...</span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Flow Controls */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setActiveView('flows')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeView === 'flows' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Flows
              </button>
              <button
                onClick={() => setActiveView('canvas')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeView === 'canvas' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Canvas
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeView === 'analytics' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFlowTesting(!flowTesting)}
                className={`p-2 rounded-lg transition-all ${
                  flowTesting ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
                title="Test Flow"
              >
                <Play className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setCollaborationMode(!collaborationMode)}
                className={`p-2 rounded-lg transition-all ${
                  collaborationMode ? 'bg-purple-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
                title="Collaboration Mode"
              >
                <Users className="w-4 h-4" />
              </button>

              {selectedNodes.size > 0 && (
                <button
                  onClick={deleteSelectedNodes}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all text-red-400"
                  title={`Delete ${selectedNodes.size} selected node${selectedNodes.size > 1 ? 's' : ''}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={saveFlow}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-gray-300"
                title="Save Flow"
              >
                <Save className="w-4 h-4" />
              </button>

              {/* Phase 2: Advanced Controls */}
              <button
                onClick={() => setShowTemplateModal(true)}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all text-blue-400"
                title="Flow Templates"
              >
                <Folder className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowVersionModal(true)}
                className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all text-green-400"
                title="Version Control"
              >
                <GitBranch className="w-4 h-4" />
              </button>

              <button
                onClick={startCollaboration}
                className={`p-2 rounded-lg transition-all ${
                  collaborationMode ? 'bg-purple-500 text-white' : 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400'
                }`}
                title="Start Collaboration"
              >
                <Users className="w-4 h-4" />
              </button>

              <button
                onClick={validateFlow}
                className="p-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg transition-all text-orange-400"
                title="Validate Flow"
              >
                <CheckCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAiAssistantExpanded(!aiAssistantExpanded)}
                className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg transition-all text-white shadow-lg"
                title="AI Assistant"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex relative">
          {/* Canvas */}
          <div 
            ref={canvasRef}
            className="flex-1 bg-gradient-to-br from-gray-900/50 to-slate-900/50 relative overflow-hidden"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }}
            onClick={(e) => {
              // Clear selection when clicking on empty canvas
              if (e.target === e.currentTarget) {
                setSelectedNodes(new Set());
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedNode) {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left - 96; // Center the node (192px width / 2)
                const y = e.clientY - rect.top - 48; // Center the node (96px height / 2)
                
                const newNode = {
                  id: uuidv4(),
                  type: draggedNode.id,
                  label: draggedNode.label,
                  icon: draggedNode.icon,
                  color: draggedNode.color,
                  position: { x, y },
                  data: { label: draggedNode.label }
                };
                
                setCanvasNodes([...canvasNodes, newNode]);
                setDraggedNode(null);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          >
            {activeView === 'canvas' && (
              <div className="absolute inset-0">
                {/* Canvas Content */}
                <div className="w-full h-full relative">
                  {/* Selection indicator */}
                  {selectedNodes.size > 0 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg z-20">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {selectedNodes.size} node{selectedNodes.size > 1 ? 's' : ''} selected
                        </span>
                        <button
                          onClick={() => setSelectedNodes(new Set())}
                          className="ml-2 p-1 hover:bg-white/20 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Render nodes */}
                  {memoizedNodes.map(node => (
                    <motion.div
                      key={node.id}
                      className={`absolute w-48 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 ${
                        selectedNodes.has(node.id) ? 'border-blue-500 shadow-lg shadow-blue-500/25' : 'border-gray-600'
                      } cursor-move transition-all hover:scale-105 group`}
                      style={{
                        left: node.position?.x || 100,
                        top: node.position?.y || 100
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      drag
                      dragConstraints={canvasRef}
                      onDragStart={() => {
                        if (!selectedNodes.has(node.id)) {
                          setSelectedNodes(new Set([node.id]));
                        }
                      }}
                      onDragEnd={(event, info) => {
                        const newNodes = canvasNodes.map(n => {
                          if (selectedNodes.has(n.id)) {
                            return {
                              ...n,
                              position: {
                                x: n.id === node.id ? n.position.x + info.offset.x : n.position.x,
                                y: n.id === node.id ? n.position.y + info.offset.y : n.position.y
                              }
                            };
                          }
                          return n;
                        });
                        setCanvasNodes(newNodes);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newSelection = new Set();
                        if (e.ctrlKey || e.metaKey) {
                          newSelection.add(...selectedNodes);
                          if (selectedNodes.has(node.id)) {
                            newSelection.delete(node.id);
                          } else {
                            newSelection.add(node.id);
                          }
                        } else {
                          newSelection.add(node.id);
                        }
                        setSelectedNodes(newSelection);
                        setSelectedNodeForProperties(node);
                        setShowPropertyPanel(true);
                      }}
                    >
                      <div className="p-4 h-full flex flex-col justify-between">
                        {/* Input Handle */}
                        <div
                          className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isConnecting && connectionStart) {
                              endConnection(node.id, 'input');
                            } else {
                              startConnection(node.id, 'input');
                            }
                          }}
                          title="Input port"
                        />
                        
                        {/* Output Handle */}
                        <div
                          className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isConnecting && connectionStart) {
                              endConnection(node.id, 'output');
                            } else {
                              startConnection(node.id, 'output');
                            }
                          }}
                          title="Output port"
                        />

                        <div className="flex items-center space-x-3">
                          <div className={`p-2 bg-gradient-to-br ${node.color || 'from-blue-500 to-purple-600'} rounded-lg`}>
                            {node.icon && React.createElement(node.icon, { className: "w-4 h-4 text-white" })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">
                              {node.data?.label || node.label || 'Untitled'}
                            </h3>
                            <p className="text-xs text-gray-400 truncate">
                              {node.type || 'Node'}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newNodes = canvasNodes.filter(n => n.id !== node.id);
                              const newConnections = canvasConnections.filter(conn => 
                                conn.source !== node.id && conn.target !== node.id
                              );
                              setCanvasNodes(newNodes);
                              setCanvasConnections(newConnections);
                              setSelectedNodes(prev => {
                                const updated = new Set(prev);
                                updated.delete(node.id);
                                return updated;
                              });
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                            title="Delete Node"
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            {node.id.slice(0, 8)}
                          </div>
                          <div className="text-xs text-blue-400">
                            {selectedNodes.has(node.id) ? 'Selected' : ''}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#60a5fa"
                        />
                      </marker>
                    </defs>
                    
                    {canvasConnections.map(connection => {
                      const sourcePos = getConnectionHandlePosition(connection.source, 'output');
                      const targetPos = getConnectionHandlePosition(connection.target, 'input');
                      const path = createConnectionPath(sourcePos, targetPos);
                      const isSelected = selectedConnections.has(connection.id);
                      
                      return (
                        <g key={connection.id}>
                          {/* Invisible thick line for easier clicking */}
                          <path
                            d={path}
                            stroke="transparent"
                            strokeWidth="20"
                            fill="none"
                            className="pointer-events-auto cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedConnections.has(connection.id)) {
                                setSelectedConnections(new Set());
                              } else {
                                setSelectedConnections(new Set([connection.id]));
                              }
                            }}
                          />
                          {/* Visible connection line */}
                          <path
                            d={path}
                            stroke={isSelected ? "#f59e0b" : "#60a5fa"}
                            strokeWidth={isSelected ? "3" : "2"}
                            fill="none"
                            markerEnd="url(#arrowhead)"
                            className={`transition-all duration-200 ${isSelected ? 'drop-shadow-lg' : ''}`}
                          />
                          {/* Connection label */}
                          {isSelected && (
                            <foreignObject
                              x={sourcePos.x + (targetPos.x - sourcePos.x) / 2 - 20}
                              y={sourcePos.y + (targetPos.y - sourcePos.y) / 2 - 15}
                              width="40"
                              height="30"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConnection(connection.id);
                                }}
                                className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                                title="Delete Connection"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </foreignObject>
                          )}
                        </g>
                      );
                    })}
                    
                    {/* Active connection being drawn */}
                    {isConnecting && connectionStart && connectionEnd && (
                      <path
                        d={createConnectionPath(
                          getConnectionHandlePosition(connectionStart.nodeId, connectionStart.handleType),
                          connectionEnd
                        )}
                        stroke="#10b981"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                      />
                    )}
                  </svg>

                  {/* Empty state */}
                  {canvasNodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Workflow className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">Start Building Your Flow</h2>
                        <p className="text-gray-500 mb-6">Drag nodes from the sidebar to begin</p>
                        <button
                          onClick={() => setShowCreateFlowModal(true)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-white transition-all shadow-lg"
                        >
                          Create New Flow
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Demo showcase message */}
                  {canvasNodes.length > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 max-w-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-white">World-Class Flow Builder</h3>
                      </div>
                      <p className="text-sm text-blue-200 mb-3">
                        🎯 This is one of the world's most advanced flow builders with AI-powered features, real-time collaboration, and 20+ enterprise node types!
                      </p>
                      <div className="space-y-1 text-xs text-blue-300">
                        <p>✅ Drag & drop nodes from sidebar</p>
                        <p>✅ Select nodes to edit properties</p>
                        <p>✅ Use Ctrl+S to save, Ctrl+Z to undo</p>
                        <p>✅ Click AI Assistant for optimization</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeView === 'flows' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Your Flows</h2>
                    <p className="text-gray-400">Manage and organize your automation flows</p>
                  </div>
                  <button
                    onClick={() => setShowCreateFlowModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-white transition-all shadow-lg flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Flow</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flowTemplates.map(template => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer shadow-lg"
                      onClick={() => {
                        setActiveView('canvas');
                        // Load template
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{template.thumbnail}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          template.complexity === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          template.complexity === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          template.complexity === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {template.complexity}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{template.nodes} nodes</span>
                        <span>{template.estimatedSetup}</span>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {template.features.map(feature => (
                          <span key={feature} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'analytics' && (
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Flow Analytics</h2>
                  <p className="text-gray-400">Monitor performance and optimize your flows</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Active Flows', value: '12', change: '+2', icon: Workflow },
                    { label: 'Total Executions', value: '1,234', change: '+15%', icon: Play },
                    { label: 'Success Rate', value: '98.5%', change: '+0.5%', icon: CheckCircle },
                    { label: 'Avg Response Time', value: '245ms', change: '-12ms', icon: Clock }
                  ].map((metric, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg`}>
                          {React.createElement(metric.icon, { className: "w-5 h-5 text-white" })}
                        </div>
                        <span className={`text-sm font-medium ${
                          metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                        <div className="text-gray-400 text-sm">{metric.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Performance Overview</h3>
                  <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Analytics Chart Placeholder</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <AIAssistantPanel />

      {/* Property Panel */}
      <PropertyPanel />

      {/* Flow Management */}
      <FlowManagement />

      {/* Enhanced Properties Panel */}
      {selectedNodes.size > 0 && !rightPanelCollapsed && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-96 bg-gradient-to-b from-gray-800 to-gray-900 border-l border-gray-700 flex flex-col relative z-20"
        >
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Properties</h2>
              <button
                onClick={() => setRightPanelCollapsed(true)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {selectedNodes.size === 1 && (
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                {(() => {
                  const node = canvasNodes.find(n => selectedNodes.has(n.id));
                  const nodeType = nodeTypes.find(nt => nt.id === node?.type);
                  return (
                    <>
                      <div className={`p-2 bg-gradient-to-br ${nodeType?.color} rounded-lg`}>
                        {nodeType && React.createElement(nodeType.icon, { className: "w-5 h-5 text-white" })}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{nodeType?.label}</h3>
                        <p className="text-xs text-gray-400">{node?.data?.label || 'Untitled'}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedNodes.size === 1 && (() => {
              const selectedNode = canvasNodes.find(n => selectedNodes.has(n.id));
              if (!selectedNode) return null;
              
              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Label</label>
                    <input
                      type="text"
                      value={selectedNode.data?.label || ''}
                      onChange={(e) => {
                        const newNodes = canvasNodes.map(node =>
                          node.id === selectedNode.id
                            ? { ...node, data: { ...node.data, label: e.target.value } }
                            : node
                        );
                        setCanvasNodes(newNodes);
                      }}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Enter node label"
                    />
                  </div>

                  {selectedNode.type === 'phone' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={selectedNode.data?.phoneNumber || ''}
                        onChange={(e) => {
                          const newNodes = canvasNodes.map(node =>
                            node.id === selectedNode.id
                              ? { ...node, data: { ...node.data, phoneNumber: e.target.value } }
                              : node
                          );
                          setCanvasNodes(newNodes);
                        }}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  )}

                  {selectedNode.type === 'ai-assistant' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">AI Model</label>
                        <select
                          value={selectedNode.data?.model || 'gpt-4'}
                          onChange={(e) => {
                            const newNodes = canvasNodes.map(node =>
                              node.id === selectedNode.id
                                ? { ...node, data: { ...node.data, model: e.target.value } }
                                : node
                            );
                            setCanvasNodes(newNodes);
                          }}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500"
                        >
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="claude-3">Claude 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">System Prompt</label>
                        <textarea
                          value={selectedNode.data?.systemPrompt || ''}
                          onChange={(e) => {
                            const newNodes = canvasNodes.map(node =>
                              node.id === selectedNode.id
                                ? { ...node, data: { ...node.data, systemPrompt: e.target.value } }
                                : node
                            );
                            setCanvasNodes(newNodes);
                          }}
                          rows={4}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 resize-none"
                          placeholder="You are a helpful AI assistant..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {selectedNodes.size > 1 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Multiple Nodes Selected</h3>
                <p className="text-gray-400 mb-4">{selectedNodes.size} nodes selected</p>
                <div className="space-y-2">
                  <button 
                    onClick={deleteSelectedNodes}
                    className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-colors"
                  >
                    Delete Selected ({selectedNodes.size})
                  </button>
                  <button 
                    onClick={groupSelectedNodes}
                    className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                  >
                    Group Nodes
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Create Flow Modal */}
      <AnimatePresence>
        {showCreateFlowModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Flow</h2>
                <button
                  onClick={() => setShowCreateFlowModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Flow Name</label>
                  <input
                    type="text"
                    placeholder="My Awesome Flow"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Template</label>
                    <div className="space-y-2">
                      {flowTemplates.slice(0, 3).map(template => (
                        <div key={template.id} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors border border-gray-600">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{template.thumbnail}</span>
                            <div>
                              <h4 className="font-medium text-white">{template.name}</h4>
                              <p className="text-xs text-gray-400">{template.complexity} • {template.estimatedSetup}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Advanced Options</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Enable Analytics</span>
                        <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Auto-save</span>
                        <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-6">
                <button
                  onClick={() => setShowCreateFlowModal(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateFlowModal(false);
                    setActiveView('canvas');
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-white transition-all shadow-lg"
                >
                  Create Flow
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collaboration Users */}
      {collaborationMode && realTimeUsers.length > 0 && (
        <div className="fixed top-20 right-4 z-40">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white">
                {realTimeUsers.length} collaborator{realTimeUsers.length > 1 ? 's' : ''} online
              </span>
            </div>
            <div className="flex space-x-2 mt-2">
              {realTimeUsers.slice(0, 5).map(user => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white"
                  title={user.name}
                >
                  {user.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Advanced Template Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowTemplateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Flow Templates</h2>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flowTemplates.map(template => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800 rounded-lg p-4 border border-white/10 cursor-pointer hover:border-blue-500/50"
                    onClick={() => loadTemplate(template.id)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{template.thumbnail}</div>
                      <div>
                        <h3 className="font-semibold text-white">{template.name}</h3>
                        <p className="text-sm text-gray-400">{template.category} • v{template.version}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">{template.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        template.complexity === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                        template.complexity === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {template.complexity}
                      </span>
                      <span className="text-xs text-gray-400">{template.estimatedSetup}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>⭐ {template.rating}</span>
                      <span>📥 {template.downloads.toLocaleString()}</span>
                      <span>🧩 {template.nodes} nodes</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={createTemplateFromFlow}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Template from Current Flow</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: Version Control Modal */}
      <AnimatePresence>
        {showVersionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowVersionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Version Control</h2>
                <button
                  onClick={() => setShowVersionModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Current: {currentBranch}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-green-400" />
                    <span className="text-white">v{currentVersion}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => createVersion()}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Version</span>
                  </button>
                  <button
                    onClick={() => createBranch(`branch_${Date.now()}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>New Branch</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Version History</h3>
                {flowVersions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No versions created yet</p>
                ) : (
                  flowVersions.map(version => (
                    <motion.div
                      key={version.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-gray-800 rounded-lg p-4 border border-white/10 cursor-pointer hover:border-blue-500/50"
                      onClick={() => loadVersion(version.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white">v{version.version}</span>
                            <span className="text-sm text-gray-400">by {version.author}</span>
                          </div>
                          <p className="text-sm text-gray-300">{version.description || 'No description'}</p>
                          <p className="text-xs text-gray-500">{new Date(version.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs ${
                            version.changes === 'Stable' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {version.changes}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: Collaboration Panel */}
      <AnimatePresence>
        {showCollaborationPanel && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-white/20 z-40 flex flex-col"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Collaboration</h3>
                <button
                  onClick={() => setShowCollaborationPanel(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Online Users ({onlineUsers.length})</h4>
                <div className="space-y-2">
                  {onlineUsers.map(user => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Invite Collaborator</h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                  <button
                    onClick={() => inviteCollaborator('user@example.com')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                  >
                    Invite
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Flow Validation</h4>
                <button
                  onClick={validateFlow}
                  disabled={isValidating}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded-lg text-white"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Validate Flow</span>
                    </>
                  )}
                </button>
                
                {validationErrors.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {validationErrors.map(error => (
                      <div
                        key={error.id}
                        className={`p-2 rounded-lg text-sm ${
                          error.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {error.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-white/10">
              <button
                onClick={stopCollaboration}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
              >
                <X className="w-4 h-4" />
                <span>Stop Collaboration</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnterpriseFlowBuilder;
