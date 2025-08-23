import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Plus, Minus, RotateCcw, Maximize, Map, Grid, Layers, 
  Clock, Moon, Copy, Save, TestTube, Phone, Rocket,
  X, Settings, Command, Search, ChevronRight, Zap,
  Calendar, Mail, Smartphone, MessageSquare, Trash2,
  Eye, EyeOff, Download, Upload, Pause, Play, Shield,
  Activity, Headphones
} from 'lucide-react';

  // Import our new schema and components
  import { NodeTypeConfig } from '../lib/flowSchemas';
  import { migrateLegacyFlow, autoLayoutNodes, exportFlowToJSON } from '../lib/flowMigration';
  import { nodeTypes } from '../components/FlowNodes';
  import { railwayFlowAPI } from '../lib/railwayFlowAPI';
  import ExecutionMonitor from '../components/ExecutionMonitor';

// Lazy load Phase 3 component to reduce initial bundle size
const Phase3FlowBuilderEnhancements = React.lazy(() => import('../components/Phase3FlowBuilderEnhancementsLite'));const VocelioAIPlatform = () => {
  // State management
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [minimapVisible, setMinimapVisible] = useState(true);
  const [gridVisible, setGridVisible] = useState(false);
  const [layersVisible, setLayersVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [commandPaletteVisible, setCommandPaletteVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [currentEditingNode, setCurrentEditingNode] = useState(null);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('featured');
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [advancedTab, setAdvancedTab] = useState('voice');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragElement, setDragElement] = useState(null);
  
  // Form states
  const [nodeForm, setNodeForm] = useState({
    name: '',
    type: 'Large Text',
    prompt: '',
    plainText: '',
    loopCondition: '',
    temperature: 0.5,
    staticText: false,
    globalNode: false,
    skipResponse: false,
    blockInterruptions: false,
    disableRecording: false
  });

  // Railway execution states
  const [executionMonitorVisible, setExecutionMonitorVisible] = useState(false);
  const [currentExecution, setCurrentExecution] = useState(null);
  const [isExecutionRunning, setIsExecutionRunning] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const commandSearchRef = useRef(null);

  // Legacy nodes data (will be migrated)
  const legacyNodes = [
    {
      id: 'start',
      type: 'Start',
      icon: '🚀',
      title: 'Start',
      content: 'Entry point for all conversations',
      badge: 'Default',
      position: { x: 200, y: 100 }
    },
    {
      id: 'introduction',
      type: 'Introduce the services',
      icon: '👋',
      title: 'Introduce the services',
      content: 'Give a brief explanation of Vocelio and our services to the client',
      badge: 'Large Text',
      position: { x: 200, y: 250 }
    },
    {
      id: 'user-response',
      type: 'User responded',
      icon: '👤',
      title: 'User responded',
      content: "Process user's initial response",
      badge: 'Default',
      position: { x: 200, y: 400 }
    },
    {
      id: 'reschedule',
      type: 'New Node 16',
      icon: '📅',
      title: 'New Node 16',
      content: 'Ask for time for reschedule',
      badge: 'Default',
      position: { x: 500, y: 100 }
    },
    {
      id: 'endcall',
      type: 'End Call',
      icon: '📞',
      title: 'End Call',
      content: 'Say Thanks so much for your time. I\'ve marked you as not interested for now.',
      badge: 'End Call',
      position: { x: 500, y: 250 }
    },
    {
      id: 'technology',
      type: 'Introducing our technology',
      icon: '⚡',
      title: 'Introducing our technology',
      content: 'Explain our AI technology and capabilities',
      badge: 'Large Text', 
      position: { x: 500, y: 400 }
    }
  ];

  // Migrate legacy data to new format
  const migratedFlow = useMemo(() => {
    return migrateLegacyFlow(legacyNodes);
  }, []);

  // React Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(migratedFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(migratedFlow.edges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Modal and notification handlers (moved up to fix hoisting issues)
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setCurrentEditingNode(null);
    setNodeForm({
      name: '',
      type: 'Large Text',
      prompt: '',
      plainText: '',
      loopCondition: '',
      temperature: 0.5,
      staticText: false,
      globalNode: false,
      skipResponse: false,
      blockInterruptions: false,
      disableRecording: false
    });
  }, []);

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // React Flow event handlers
  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#3b82f6'
        },
        style: {
          stroke: '#3b82f6',
          strokeWidth: 2
        }
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  // Add new node function
  const addNewNode = useCallback((nodeType) => {
    const newNode = {
      id: `${nodeType.toLowerCase()}-${Date.now()}`,
      type: nodeType,
      position: { 
        x: Math.random() * 300 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: {
        label: `New ${nodeType}`,
        ...(nodeType === 'Say' && { text: 'Hello, this is a new message.' }),
        ...(nodeType === 'Collect' && { 
          mode: 'speech',
          prompt: 'Please provide your response.',
          timeoutMs: 4000
        }),
        ...(nodeType === 'End' && { disposition: 'not_interested' })
      }
    };
    
    setNodes((nds) => [...nds, newNode]);
    closeModal();
    showNotification(`Added new ${nodeType} node`, 'success');
  }, [setNodes, closeModal, showNotification]);

  // Auto-layout function
  const performAutoLayout = useCallback(() => {
    const layoutedNodes = autoLayoutNodes(nodes, edges);
    setNodes(layoutedNodes);
    showNotification('Auto-layout applied', 'success');
  }, [nodes, edges, setNodes, showNotification]);

  // Export flow function
  const exportFlow = useCallback(() => {
    try {
      const flow = {
        ...migratedFlow,
        nodes,
        edges,
        modified: new Date().toISOString()
      };
      
      const json = exportFlowToJSON(flow);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vocelio-flow-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showNotification('Flow exported successfully', 'success');
    } catch (error) {
      showNotification('Export failed: ' + error.message, 'error');
    }
  }, [nodes, edges, migratedFlow, showNotification]);

  // Railway execution handlers
  const handleExecutionStart = useCallback((execution) => {
    setCurrentExecution(execution);
    setIsExecutionRunning(true);
    showNotification('Flow execution started on Railway backend', 'success');
  }, [showNotification]);

  const handleExecutionEnd = useCallback((execution) => {
    setIsExecutionRunning(false);
    showNotification(`Flow execution ${execution.status}`, execution.status === 'completed' ? 'success' : 'error');
  }, [showNotification]);

  const testRailwayConnection = useCallback(async () => {
    try {
      const result = await railwayFlowAPI.testConnection();
      if (result.success) {
        showNotification('✅ Railway backend connected successfully!', 'success');
      } else {
        showNotification('❌ Railway connection failed: ' + result.error, 'error');
      }
    } catch (error) {
      showNotification('❌ Railway connection error: ' + error.message, 'error');
    }
  }, [showNotification]);

  // Zoom functions
  const zoomIn = () => {
    setCurrentZoom(prev => Math.min(prev * 1.2, 3));
  };

  const zoomOut = () => {
    setCurrentZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const resetZoom = () => {
    setCurrentZoom(1);
  };

  // Toggle functions
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMinimap = () => {
    setMinimapVisible(!minimapVisible);
  };

  const toggleGrid = () => {
    setGridVisible(!gridVisible);
    showNotification(gridVisible ? 'Grid disabled' : 'Grid enabled', 'info');
  };

  const toggleLayers = () => {
    setLayersVisible(!layersVisible);
  };

  const toggleHistory = () => {
    setHistoryVisible(!historyVisible);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showNotification(isDarkMode ? 'Light mode enabled' : 'Dark mode enabled', 'info');
  };

  const toggleCommandPalette = () => {
    setCommandPaletteVisible(!commandPaletteVisible);
    if (!commandPaletteVisible) {
      setTimeout(() => commandSearchRef.current?.focus(), 100);
    }
  };

  // Modal functions
  const showModal = (modalId) => {
    setActiveModal(modalId);
  };

  // Node management
  const editNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setCurrentEditingNode(nodeId);
      setNodeForm({
        name: node.title,
        type: node.type,
        prompt: node.content,
        plainText: '',
        loopCondition: '',
        temperature: 0.5,
        staticText: false,
        globalNode: false,
        skipResponse: false,
        blockInterruptions: false,
        disableRecording: false
      });
      showModal('editNode');
    }
  };

  const addNodeToCanvas = (nodeType) => {
    const newId = `node-${nodeCounter}`;
    const icons = {
      'collect-phone': '📱',
      'collect-email': '✉️',
      'schedule-meeting': '📅'
    };
    
    const titles = {
      'collect-phone': 'Collect Phone Number',
      'collect-email': 'Collect Email',
      'schedule-meeting': 'Schedule Meeting'
    };

    const contents = {
      'collect-phone': 'Collect and validate phone numbers from users',
      'collect-email': 'Collect and validate email addresses from users',
      'schedule-meeting': 'Book appointments and manage calendar integration'
    };

    const newNode = {
      id: newId,
      type: titles[nodeType] || 'New Node',
      icon: icons[nodeType] || '⚡',
      title: titles[nodeType] || `New Node ${nodeCounter}`,
      content: contents[nodeType] || 'New conversation node',
      badge: 'Default',
      position: { 
        x: 200 + Math.random() * 600, 
        y: 100 + Math.random() * 400 
      }
    };

    setNodes(prev => [...prev, newNode]);
    setNodeCounter(prev => prev + 1);
    closeModal();
    showNotification('Node added successfully!', 'success');
  };

  const saveNode = () => {
    if (currentEditingNode) {
      setNodes(prev => prev.map(node => 
        node.id === currentEditingNode 
          ? { ...node, title: nodeForm.name, content: nodeForm.prompt }
          : node
      ));
      showNotification('Node saved successfully!', 'success');
      closeModal();
    }
  };

  // Utility functions
  const copyId = () => {
    navigator.clipboard.writeText('3e18c41b-1902-48d7-a86e-8e3150e83ae7');
    showNotification('ID copied to clipboard!', 'success');
  };

  const saveWorkflow = () => {
    showNotification('Workflow saved successfully!', 'success');
  };

  const testPathway = () => {
    showNotification('Pathway test started!', 'success');
    closeModal();
  };

  const startCall = () => {
    showNotification('Call initiated successfully!', 'success');
    closeModal();
  };

  const promoteToProduction = () => {
    showNotification('Successfully promoted to production!', 'success');
    closeModal();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (commandPaletteVisible) {
          setCommandPaletteVisible(false);
        } else if (activeModal) {
          closeModal();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveWorkflow();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showModal('addNode');
      }

      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        toggleGrid();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteVisible, activeModal]);

  // Sidebar items
  const sidebarItems = [
    { icon: '🔗', label: 'Add New Node', action: () => showModal('addNode') },
    { icon: '🌍', label: 'Global Prompt', action: () => showModal('globalPrompt') },
    { icon: '🎯', label: 'Feature Flags', action: () => {} },
    { icon: '🧪', label: 'Test Pathway', action: () => showModal('testPathway') },
    { icon: '📞', label: 'Send Call', action: () => showModal('sendCall') },
    { icon: '🌐', label: 'Web Client', action: () => showModal('webClient') },
    { icon: '🚀', label: 'Promote to Production', action: () => showModal('promoteProduction') },
    { icon: '📊', label: 'Analytics', action: () => {} }
  ];

  return (
    <div className={`h-screen flex ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-slate-800'} text-white p-5 overflow-y-auto`}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-700">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg">
            V
          </div>
          <div>
            <h2 className="text-xl font-semibold">Vocelio AI</h2>
            <p className="text-xs text-slate-400">Conversational Platform</p>
          </div>
        </div>

        {/* Workflow Section */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Workflow</h3>
          {sidebarItems.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-blue-600 rounded-lg mb-2 cursor-pointer transition-all duration-200 transform hover:translate-x-1"
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Testing Section */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Testing</h3>
          {sidebarItems.slice(3, 6).map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-blue-600 rounded-lg mb-2 cursor-pointer transition-all duration-200 transform hover:translate-x-1"
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Deployment Section */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Deployment</h3>
          {sidebarItems.slice(6).map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-blue-600 rounded-lg mb-2 cursor-pointer transition-all duration-200 transform hover:translate-x-1"
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Railway Execution Monitor */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Railway Execution</h3>
          <ExecutionMonitor 
            flowDefinition={nodes}
            onExecutionStart={handleExecutionStart}
            onExecutionEnd={handleExecutionEnd}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`h-18 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between px-8 shadow-sm`}>
          <div className="flex items-center gap-4">
            <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Vocelio SalesBot
            </h1>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Version 1
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              Staging
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              ✓ Saved
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={copyId}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              <Copy size={16} />
              Copy ID
            </button>
            <button
              onClick={() => showModal('promoteProduction')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              <Rocket size={16} />
              Promote to Production
            </button>
            <button
              onClick={() => showModal('testPathway')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <TestTube size={16} />
              Test Pathway
            </button>
            <button
              onClick={() => showModal('sendCall')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              <Phone size={16} />
              Send Call
            </button>
            <button
              onClick={performAutoLayout}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              <Grid size={16} />
              Auto Layout
            </button>
            <button
              onClick={exportFlow}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              <Download size={16} />
              Export Flow
            </button>
            <button
              onClick={() => setExecutionMonitorVisible(!executionMonitorVisible)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                executionMonitorVisible
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              <Zap size={16} />
              Railway Execution
            </button>
            <button
              onClick={() => showModal('webClient')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
              }`}
            >
              🌐 Web Client
            </button>
            
            {/* Phase 3 Advanced Features */}
            <button
              onClick={() => {
                setShowAdvancedPanel(true);
                setAdvancedTab('compliance');
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300'
              }`}
            >
              <Shield size={16} />
              Compliance
            </button>
            <button
              onClick={() => {
                setShowAdvancedPanel(true);
                setAdvancedTab('voice');
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-green-700 hover:bg-green-600 text-white' 
                  : 'bg-green-100 hover:bg-green-200 text-green-900 border border-green-300'
              }`}
            >
              <Headphones size={16} />
              Voice Controls
            </button>
            <button
              onClick={() => {
                setShowAdvancedPanel(true);
                setAdvancedTab('collaboration');
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-orange-700 hover:bg-orange-600 text-white' 
                  : 'bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300'
              }`}
            >
              <Activity size={16} />
              Collaboration
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Canvas Controls */}
          <div className="absolute top-5 right-5 z-20 flex gap-2">
            {[
              { icon: Plus, action: zoomIn, tooltip: 'Zoom In' },
              { icon: Minus, action: zoomOut, tooltip: 'Zoom Out' },
              { icon: RotateCcw, action: resetZoom, tooltip: 'Reset Zoom' },
              { icon: Maximize, action: toggleFullscreen, tooltip: 'Toggle Fullscreen' },
              { icon: Map, action: toggleMinimap, tooltip: 'Toggle Minimap' },
              { icon: Grid, action: toggleGrid, tooltip: 'Toggle Grid' },
              { icon: Layers, action: toggleLayers, tooltip: 'Layers' },
              { icon: Clock, action: toggleHistory, tooltip: 'History' },
              { icon: Moon, action: toggleDarkMode, tooltip: 'Dark Mode' }
            ].map(({ icon: Icon, action, tooltip }, idx) => (
              <button
                key={idx}
                onClick={action}
                className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-blue-600 hover:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-500'
                }`}
                title={tooltip}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          {/* Zoom Indicator */}
          <div className={`absolute bottom-5 right-5 z-20 px-3 py-2 rounded-full text-sm font-medium shadow-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            {Math.round(currentZoom * 100)}%
          </div>

          {/* Minimap */}
          {minimapVisible && (
            <div className={`absolute bottom-5 left-5 w-48 h-36 rounded-lg shadow-lg z-20 border-2 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-300'
            }`}>
              <div className={`flex items-center justify-between p-2 border-b text-sm font-medium ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}>
                <span>Navigator</span>
                <button onClick={toggleMinimap} className={`p-1 rounded hover:bg-opacity-80 ${
                  isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
                }`}>
                  <X size={14} />
                </button>
              </div>
              <div className={`relative h-full overflow-hidden ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                {nodes.map(node => (
                  <div
                    key={node.id}
                    className="absolute w-4 h-3 bg-blue-600 rounded-sm"
                    style={{
                      left: `${(node.position.x / 10)}px`,
                      top: `${(node.position.y / 10)}px`
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Layers Panel */}
          {layersVisible && (
            <div className={`absolute top-5 left-5 w-60 rounded-xl shadow-lg z-20 border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-300'
            }`}>
              <div className={`flex items-center justify-between p-4 border-b ${
                isDarkMode 
                  ? 'border-gray-600 text-white' 
                  : 'border-gray-200 text-gray-900'
              }`}>
                <span className="font-semibold">Layers</span>
                <button onClick={toggleLayers} className={`p-1 rounded hover:bg-opacity-80 ${
                  isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
                }`}>
                  <X size={16} />
                </button>
              </div>
              {['Workflow Nodes', 'Connections', 'Comments', 'Grid'].map((layer, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-200' 
                    : 'hover:bg-gray-50 text-gray-800'
                }`}>
                  <Eye size={16} className="text-blue-600" />
                  <span className="text-sm">{layer}</span>
                </div>
              ))}
            </div>
          )}

          {/* History Panel */}
          {historyVisible && (
            <div className={`absolute top-20 right-5 w-48 rounded-xl shadow-lg z-20 border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-300'
            }`}>
              <div className={`flex items-center justify-between p-4 border-b ${
                isDarkMode 
                  ? 'border-gray-600 text-white' 
                  : 'border-gray-200 text-gray-900'
              }`}>
                <span className="font-semibold">History</span>
                <button onClick={toggleHistory} className={`p-1 rounded hover:bg-opacity-80 ${
                  isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
                }`}>
                  <X size={16} />
                </button>
              </div>
              {['Current State', 'Added Technology Node', 'Modified Introduction', 'Added End Call Node', 'Initial Setup'].map((item, idx) => (
                <div key={idx} className={`p-3 text-xs cursor-pointer border-b last:border-b-0 transition-colors ${
                  idx === 0 
                    ? isDarkMode 
                      ? 'text-blue-400 font-medium hover:bg-gray-700' 
                      : 'text-blue-600 font-medium hover:bg-gray-50'
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                } ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* React Flow Canvas */}
          <div className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(event, node) => {
                setCurrentEditingNode(node.id);
                setActiveModal('editNode');
                setNodeForm({
                  name: node.data?.label || '',
                  type: node.type || 'default',
                  prompt: node.data?.content || '',
                  plainText: node.data?.plainText || '',
                  loopCondition: node.data?.loopCondition || '',
                  temperature: node.data?.temperature || 0.5,
                  staticText: node.data?.staticText || false,
                  globalNode: node.data?.globalNode || false,
                  skipResponse: node.data?.skipResponse || false,
                  blockInterruptions: node.data?.blockInterruptions || false,
                  disableRecording: node.data?.disableRecording || false
                });
              }}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              className={isDarkMode ? 'dark' : ''}
              defaultViewport={{ x: 0, y: 0, zoom: currentZoom }}
              minZoom={0.1}
              maxZoom={2}
              deleteKeyCode={['Backspace', 'Delete']}
              multiSelectionKeyCode={['Meta', 'Ctrl']}
            >
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.type === 'Start') return '#10b981';
                  if (n.type === 'End') return '#ef4444';
                  return '#3b82f6';
                }}
                nodeColor={(n) => {
                  if (n.type === 'Start') return '#d1fae5';
                  if (n.type === 'End') return '#fee2e2';
                  return '#dbeafe';
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
                className={`${minimapVisible ? 'block' : 'hidden'} ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg`}
              />
              
              <Controls 
                className={`${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-lg`}
                showZoom={true}
                showFitView={true}
                showInteractive={true}
              />
              
              <Background 
                variant={gridVisible ? "lines" : "dots"}
                gap={20}
                size={1}
                color={isDarkMode ? "#374151" : "#e5e7eb"}
                className={isDarkMode ? "bg-gray-900" : "bg-gray-50"}
              />
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => showModal('addNode')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-30"
      >
        <Plus size={24} />
      </button>

      {/* Command Palette */}
      {commandPaletteVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) setCommandPaletteVisible(false);
        }}>
          <div className={`rounded-xl shadow-2xl w-full max-w-lg mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className={`p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <input
                ref={commandSearchRef}
                type="text"
                placeholder="Search commands..."
                className={`w-full text-lg border-none outline-none bg-transparent ${
                  isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <div className="max-h-80 overflow-y-auto">
              {[
                { icon: Plus, name: 'Add Node', description: 'Add a new workflow node', shortcut: 'Ctrl+N' },
                { icon: Save, name: 'Save Pathway', description: 'Save current workflow', shortcut: 'Ctrl+S' },
                { icon: TestTube, name: 'Test Pathway', description: 'Test the workflow', shortcut: 'Ctrl+T' },
                { icon: Download, name: 'Export Workflow', description: 'Export as JSON or image', shortcut: 'Ctrl+E' }
              ].map((command, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <command.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{command.name}</div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{command.description}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {command.shortcut}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal === 'addNode' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Add New Node</h2>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <X size={20} />
              </button>
            </div>

            <div className={`flex border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {['featured', 'library'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : isDarkMode 
                        ? 'border-transparent text-gray-400 hover:text-gray-200' 
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'featured' ? 'Featured Nodes' : 'Node Library'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'featured' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(NodeTypeConfig).map(([nodeType, config]) => (
                    <div
                      key={nodeType}
                      onClick={() => addNewNode(nodeType)}
                      className={`border-2 rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center text-white`}>
                          {config.icon}
                        </div>
                        <div className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{nodeType}</div>
                      </div>
                      <div className={`text-sm mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{config.description}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                        isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {config.category}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Node Library - Coming Soon</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Node Modal */}
      {activeModal === 'editNode' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
          <div className={`rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Edit Node</h2>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Node Type</label>
                <select 
                  value={nodeForm.type}
                  onChange={(e) => setNodeForm({...nodeForm, type: e.target.value})}
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  <option>Large Text</option>
                  <option>Small Text</option>
                  <option>Collect Info</option>
                  <option>Decision</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Name:</label>
                <input
                  type="text"
                  value={nodeForm.name}
                  onChange={(e) => setNodeForm({...nodeForm, name: e.target.value})}
                  placeholder="Enter node name"
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${nodeForm.staticText ? 'bg-blue-600' : 'bg-gray-300'}`}
                     onClick={() => setNodeForm({...nodeForm, staticText: !nodeForm.staticText})}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${nodeForm.staticText ? 'translate-x-6' : 'translate-x-0.5'} translate-y-0.5`} />
                </div>
                <label className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Static Text (When you want the agent to say a specific dialogue. Uncheck to use AI generated text)</label>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Prompt:</label>
                <textarea
                  value={nodeForm.prompt}
                  onChange={(e) => setNodeForm({...nodeForm, prompt: e.target.value})}
                  placeholder="Enter the prompt for this node..."
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none h-32 resize-vertical ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Paste Plain Text Content:</label>
                <textarea
                  value={nodeForm.plainText}
                  onChange={(e) => setNodeForm({...nodeForm, plainText: e.target.value})}
                  placeholder="Enter plain text content that the agent should say..."
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none h-32 resize-vertical ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Loop Condition</label>
                <textarea
                  value={nodeForm.loopCondition}
                  onChange={(e) => setNodeForm({...nodeForm, loopCondition: e.target.value})}
                  placeholder="Describe the condition for when the agent should move to the next node..."
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none h-24 resize-vertical ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Advanced Options */}
              <div className={`rounded-lg p-6 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Advanced Options</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Global Node</div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Make this node accessible from any other node</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${nodeForm.globalNode ? 'bg-blue-600' : 'bg-gray-300'}`}
                         onClick={() => setNodeForm({...nodeForm, globalNode: !nodeForm.globalNode})}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${nodeForm.globalNode ? 'translate-x-6' : 'translate-x-0.5'} translate-y-0.5`} />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Temperature (0.0 to 1.0)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={nodeForm.temperature}
                        onChange={(e) => setNodeForm({...nodeForm, temperature: parseFloat(e.target.value)})}
                        className="flex-1"
                      />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{nodeForm.temperature}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Skip User's Response</div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Continue immediately without waiting for user response</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${nodeForm.skipResponse ? 'bg-blue-600' : 'bg-gray-300'}`}
                         onClick={() => setNodeForm({...nodeForm, skipResponse: !nodeForm.skipResponse})}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${nodeForm.skipResponse ? 'translate-x-6' : 'translate-x-0.5'} translate-y-0.5`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Block Interruptions</div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Ignore user's interruptions at this node</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${nodeForm.blockInterruptions ? 'bg-blue-600' : 'bg-gray-300'}`}
                         onClick={() => setNodeForm({...nodeForm, blockInterruptions: !nodeForm.blockInterruptions})}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${nodeForm.blockInterruptions ? 'translate-x-6' : 'translate-x-0.5'} translate-y-0.5`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Disable Recording</div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Disable call recording for PCI compliance</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${nodeForm.disableRecording ? 'bg-blue-600' : 'bg-gray-300'}`}
                         onClick={() => setNodeForm({...nodeForm, disableRecording: !nodeForm.disableRecording})}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${nodeForm.disableRecording ? 'translate-x-6' : 'translate-x-0.5'} translate-y-0.5`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  className={`px-6 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveNode}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Node
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Prompt Modal */}
      {activeModal === 'globalPrompt' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
          <div className={`rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Global Prompt and Logs</h2>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>## **AGENT IDENTITY & ROLE**</h3>
              <textarea
                className={`w-full h-64 p-4 border-2 rounded-lg focus:border-blue-500 outline-none resize-vertical ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
                defaultValue={`You are Alex from Vocelio AI, a specialized lead generation and appointment setting company that works exclusively with businesses looking to automate their customer conversations. You are calling business owners, sales managers, and development professionals to introduce them to our services.

You're calling {{customer_name}} because you came across their company and saw they're doing great work and could benefit from conversational AI automation.`}
              />

              <div className="flex gap-3 justify-end mt-6">
                <button className={`px-6 py-2 border rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  Compress Prompt
                </button>
                <button
                  onClick={closeModal}
                  className={`px-6 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { showNotification('Global prompt saved!', 'success'); closeModal(); }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Call Modal */}
      {activeModal === 'sendCall' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
          <div className={`rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Send a Call with your pathway now!</h2>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Load Configuration</label>
                <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}>
                  <option>Select a configuration</option>
                  <option>Production Config</option>
                  <option>Test Config</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Phone number</label>
                <div className="flex gap-3">
                  <select className={`w-20 p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}>
                    <option>🇺🇸 +1</option>
                    <option>🇬🇧 +44</option>
                    <option>🇨🇦 +1</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className={`flex-1 p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                <div className="mt-2">
                  <label className={`flex items-center gap-2 text-sm cursor-pointer ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    <input type="checkbox" className="rounded" />
                    Use my phone number
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Start Node</label>
                  <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}>
                    <option>Select Node</option>
                    <option>Start</option>
                    <option>Introduction</option>
                    <option>Technology</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Version</label>
                  <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}>
                    <option>Version 1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Voice</label>
                  <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}>
                    <option>june</option>
                    <option>nat</option>
                    <option>alex</option>
                    <option>sarah</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Timezone</label>
                  <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}>
                    <option>America/Los_Angeles</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Interruption Threshold: <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>100 ms</span></label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  defaultValue="100"
                  className="w-full"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>MetaData</label>
                <textarea
                  placeholder="Add any additional information you want to associate with the call..."
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none h-24 resize-vertical ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  className={`px-6 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={startCall}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Pathway Modal */}
      {activeModal === 'testPathway' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
          <div className={`rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Test Pathway</h2>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Load Configuration</label>
                <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}>
                  <option>Select a configuration</option>
                  <option>Test Configuration</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Start Node</label>
                <p className={`text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Choose which Node to start testing from. Default node will be the Start Node.</p>
                <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}>
                  <option>Select Node</option>
                  <option>Start</option>
                  <option>Introduction</option>
                  <option>Technology</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Request Data</label>
                <p className={`text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Variables the agent has access to, and can be referenced using {`{{variable_name}}`} notation</p>
                <button className={`px-4 py-2 border rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  + Key/Value
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-6 bg-blue-600 rounded-full cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6 translate-y-0.5" />
                  </div>
                  <div>
                    <label className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Run Unit Test</label>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Check instruction following</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-6 bg-gray-300 rounded-full cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-0.5 translate-y-0.5" />
                  </div>
                  <label className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Use Candidate Model</label>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Save Configuration</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Config Name"
                    className={`flex-1 p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button className={`px-4 py-3 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                    Save
                  </button>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  className={`px-6 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={testPathway}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Pathway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Web Client Modal */}
      {activeModal === 'webClient' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
          <div className={`rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Web Client</h2>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <X size={20} />
              </button>
            </div>

            <div className="flex h-[600px]">
              {/* Left Panel - Configuration */}
              <div className={`w-1/3 border-r p-6 space-y-6 overflow-y-auto ${
                isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Pathway</label>
                      <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}>
                        <option>Vocelio SalesBot - Version 1</option>
                        <option>Customer Support Bot</option>
                        <option>Lead Qualifier Bot</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Voice</label>
                      <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}>
                        <option>june</option>
                        <option>nat</option>
                        <option>alex</option>
                        <option>sarah</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Language</label>
                      <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}>
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Start Node</label>
                      <select className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}>
                        <option>Start (Default)</option>
                        <option>Introduction</option>
                        <option>Technology Demo</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Audio Settings</h4>
                      
                      <div>
                        <label className={`block text-sm mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Speech Rate: <span className="text-blue-600">1.0x</span></label>
                        <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full" />
                      </div>

                      <div>
                        <label className={`block text-sm mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Volume: <span className="text-blue-600">80%</span></label>
                        <input type="range" min="0" max="100" defaultValue="80" className="w-full" />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-6 bg-blue-600 rounded-full cursor-pointer">
                          <div className="w-5 h-5 bg-white rounded-full translate-x-6 translate-y-0.5" />
                        </div>
                        <label className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Auto-play responses</label>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-6 bg-gray-300 rounded-full cursor-pointer">
                          <div className="w-5 h-5 bg-white rounded-full translate-x-0.5 translate-y-0.5" />
                        </div>
                        <label className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Show transcripts</label>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Custom Variables</label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input type="text" placeholder="Key" className={`flex-1 p-2 border rounded text-sm ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`} />
                          <input type="text" placeholder="Value" className={`flex-1 p-2 border rounded text-sm ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`} />
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">+ Add Variable</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Chat Interface */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="border-b p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Vocelio AI Assistant</h3>
                      <p className="text-sm opacity-90">Sales & Lead Generation Bot</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Online</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  {/* Welcome Message */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      AI
                    </div>
                    <div className={`rounded-lg p-3 shadow-sm max-w-md ${
                      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                      <p className="text-sm">
                        Hello! I'm Alex from Vocelio AI. Thanks for taking the time to chat with me today. 
                        I'd love to tell you about how we help businesses automate their customer conversations. 
                        Would you like to hear more about our services?
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button className={`p-1 rounded transition-colors ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}>
                          <Play size={14} className="text-blue-600" />
                        </button>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>0:03</span>
                      </div>
                    </div>
                  </div>

                  {/* Sample User Message */}
                  <div className="flex gap-3 justify-end">
                    <div className="bg-blue-600 text-white rounded-lg p-3 shadow-sm max-w-md">
                      <p className="text-sm">
                        Yes, I'd like to learn more. What exactly does Vocelio AI do?
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      U
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      AI
                    </div>
                    <div className={`rounded-lg p-3 shadow-sm max-w-md ${
                      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                      <p className="text-sm">
                        Great question! Vocelio AI is a specialized conversational automation platform that helps businesses 
                        handle customer interactions automatically. We work with companies to set up intelligent chat systems 
                        that can qualify leads, book appointments, and provide customer support 24/7. 
                        What type of business are you in?
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button className={`p-1 rounded transition-colors ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}>
                          <Play size={14} className="text-blue-600" />
                        </button>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>0:12</span>
                      </div>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      AI
                    </div>
                    <div className={`rounded-lg p-3 shadow-sm ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className={`border-t p-4 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className={`flex-1 p-3 border-2 rounded-lg focus:border-blue-500 outline-none ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Send
                    </button>
                  </div>
                  
                  <div className={`flex items-center justify-between mt-3 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-4">
                      <span>🎤 Voice input available</span>
                      <span>⌨️ Press Enter to send</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`border-t p-4 flex items-center justify-between ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`flex items-center gap-4 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span>Session ID: abc123xyz</span>
                <span>Duration: 2:34</span>
                <span>Messages: 4</span>
              </div>
              
              <div className="flex gap-2">
                <button className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  Export Chat
                </button>
                <button className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  Reset Session
                </button>
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promote to Production Modal */}
      {activeModal === 'promoteProduction' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
          <div className={`rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Promote to Production</h2>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className={`mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Are you sure you want to promote your staging pathway to production? Your staging environment will remain available for further changes.
              </p>
              <p className={`text-sm mb-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                The current production version will be saved under: Previously Published Pathway
              </p>

              <div className={`rounded-lg p-6 mb-6 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`font-semibold text-lg mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Nodes</h3>
                
                <div className="mb-4">
                  <h4 className="text-green-600 font-medium mb-2">✓ Added (1)</h4>
                  <ul className={`ml-5 space-y-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <li>• Unnamed</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="text-yellow-600 font-medium mb-2">⟳ Modified (15)</h4>
                  <ul className={`ml-5 space-y-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <li>• Start - 3 changes (Default)</li>
                    <li>• End call - 0 changes (End Call)</li>
                    <li>• User busy - 2 changes (Default)</li>
                    <li>• Introducing our technology - 1 change (Default)</li>
                    <li>• KB - 3 changes (Knowledge Base)</li>
                    <li>• Thanks - 0 changes (Default)</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  className={`px-6 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={promoteToProduction}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Promote to Production
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className={`fixed bottom-0 left-0 right-0 h-8 border-t flex items-center justify-between px-5 text-xs z-10 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 text-gray-300' 
          : 'bg-gray-50 border-gray-200 text-gray-700'
      }`}>
        <div className="flex gap-5">
          <span>Nodes: {nodes.length}</span>
          <span>Connections: 5</span>
          <span>Auto-saved 30s ago</span>
        </div>
        <div className="flex gap-5">
          <span>Performance: Good</span>
          <span>Users: 3 online</span>
          <span>Version 1.0</span>
        </div>
      </div>
      
      {/* Phase 3 Advanced Features Panel */}
      {showAdvancedPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className={`w-full max-w-4xl h-3/4 rounded-lg shadow-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Advanced Features - Phase 3
              </h2>
              <button
                onClick={() => setShowAdvancedPanel(false)}
                className={`p-1 rounded hover:${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                } ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setAdvancedTab('voice')}
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    advancedTab === 'voice'
                      ? isDarkMode 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-100 text-green-900'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Headphones size={16} className="inline mr-1" />
                  Voice Controls
                </button>
                <button
                  onClick={() => setAdvancedTab('compliance')}
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    advancedTab === 'compliance'
                      ? isDarkMode 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-100 text-purple-900'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Shield size={16} className="inline mr-1" />
                  Compliance
                </button>
                <button
                  onClick={() => setAdvancedTab('collaboration')}
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    advancedTab === 'collaboration'
                      ? isDarkMode 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-orange-100 text-orange-900'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Activity size={16} className="inline mr-1" />
                  Collaboration
                </button>
              </div>
              
              <div className="h-96 overflow-auto">
                <React.Suspense fallback={
                  <div className={`flex items-center justify-center h-full ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Loading advanced features...
                  </div>
                }>
                  <Phase3FlowBuilderEnhancements 
                    activeTab={advancedTab}
                    isDarkMode={isDarkMode}
                    onClose={() => setShowAdvancedPanel(false)}
                  />
                </React.Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocelioAIPlatform;