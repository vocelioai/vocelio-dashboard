import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ConnectionLineType,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

// Advanced feature imports
import FlowExecutionEngine from '../lib/flowExecution';
import FlowTemplateManager from '../lib/flowTemplateManager';
import FlowExecutionPanel from './FlowExecutionPanel';
import EnhancedFlowTemplateBrowser from './EnhancedFlowTemplateBrowser';

// Node type imports
import VoiceNode from './nodes/VoiceNode';
import InputNode from './nodes/InputNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import APINode from './nodes/APINode';

// UI icons
import { 
  Play, Template, Save, Upload, Download, Settings, Zap,
  Eye, TestTube, Layers, Grid, Maximize2, Minimize2
} from 'lucide-react';

const nodeTypes = {
  voice: VoiceNode,
  input: InputNode,
  condition: ConditionNode,
  action: ActionNode,
  api: APINode
};

const edgeOptions = {
  animated: true,
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#4F46E5'
  },
  style: {
    strokeWidth: 2,
    stroke: '#4F46E5'
  }
};

const FlowBuilder = () => {
  // Core React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // Advanced feature state
  const [executionEngine] = useState(() => new FlowExecutionEngine());
  const [templateManager] = useState(() => new FlowTemplateManager());
  const [showExecutionPanel, setShowExecutionPanel] = useState(false);
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [validationResults, setValidationResults] = useState({ isValid: true, errors: [], warnings: [] });
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  
  // Node creation state
  const [draggedNodeType, setDraggedNodeType] = useState(null);

  // Initialize execution engine event listeners
  useEffect(() => {
    const handleExecutionUpdate = (event) => {
      console.log('Execution update:', event.detail);
      setExecutionResults(prev => ({
        ...prev,
        ...event.detail
      }));
    };

    const handleValidationUpdate = (event) => {
      setValidationResults(event.detail);
    };

    document.addEventListener('flowExecutionUpdate', handleExecutionUpdate);
    document.addEventListener('flowValidationUpdate', handleValidationUpdate);

    return () => {
      document.removeEventListener('flowExecutionUpdate', handleExecutionUpdate);
      document.removeEventListener('flowValidationUpdate', handleValidationUpdate);
    };
  }, []);

  // Auto-validate flow when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      validateCurrentFlow();
    }
  }, [nodes, edges]);

  const validateCurrentFlow = useCallback(() => {
    try {
      const flow = { nodes, edges };
      const results = executionEngine.validateFlow(flow);
      setValidationResults(results);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResults({
        isValid: false,
        errors: [{ message: error.message, nodeId: null }],
        warnings: []
      });
    }
  }, [nodes, edges, executionEngine]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        ...edgeOptions,
        id: `edge-${params.source}-${params.target}-${Date.now()}`
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          ...getDefaultNodeData(type)
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const getDefaultNodeData = (type) => {
    switch (type) {
      case 'voice':
        return {
          message: 'Welcome to our service!',
          voice: 'alice',
          language: 'en-US'
        };
      case 'input':
        return {
          prompt: 'Please enter your response',
          inputType: 'speech',
          timeout: 5000
        };
      case 'condition':
        return {
          conditions: [{ field: 'input', operator: 'equals', value: 'yes' }],
          logic: 'AND'
        };
      case 'action':
        return {
          actionType: 'transfer',
          target: '+1234567890'
        };
      case 'api':
        return {
          url: 'https://api.example.com/data',
          method: 'GET',
          headers: {}
        };
      default:
        return {};
    }
  };

  const handleExecuteFlow = async () => {
    try {
      setIsExecuting(true);
      const flow = { nodes, edges };
      const results = await executionEngine.executeFlow(flow);
      setExecutionResults(results);
      setShowExecutionPanel(true);
    } catch (error) {
      console.error('Execution error:', error);
      setExecutionResults({
        success: false,
        error: error.message,
        steps: []
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleTestFlow = async () => {
    try {
      const flow = { nodes, edges };
      const testResults = await executionEngine.testFlow(flow, {
        input: 'test input',
        variables: { customerName: 'John Doe' }
      });
      setExecutionResults(testResults);
      setShowExecutionPanel(true);
    } catch (error) {
      console.error('Test error:', error);
      alert('Test failed: ' + error.message);
    }
  };

  const handleLoadTemplate = (templateNodes, templateEdges, template) => {
    setNodes(templateNodes);
    setEdges(templateEdges);
    setShowTemplateBrowser(false);
    
    // Auto-fit view to show all template nodes
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2 });
      }
    }, 100);
  };

  const handleSaveAsTemplate = () => {
    if (nodes.length === 0) {
      alert('No flow to save as template');
      return;
    }

    const templateName = prompt('Enter template name:');
    if (!templateName) return;

    const templateDescription = prompt('Enter template description:');
    if (!templateDescription) return;

    const category = prompt('Enter category (basic/support/survey):') || 'basic';

    try {
      const templateId = templateManager.saveCustomTemplate({
        name: templateName,
        description: templateDescription,
        category: category,
        nodes: nodes,
        edges: edges
      });
      
      alert(`Template "${templateName}" saved successfully!`);
    } catch (error) {
      console.error('Save template error:', error);
      alert('Failed to save template: ' + error.message);
    }
  };

  const handleExportFlow = () => {
    const flowData = {
      nodes,
      edges,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    const dataStr = JSON.stringify(flowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flow-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFlow = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flowData = JSON.parse(e.target.result);
        if (flowData.nodes && flowData.edges) {
          setNodes(flowData.nodes);
          setEdges(flowData.edges);
          
          // Auto-fit view
          setTimeout(() => {
            if (reactFlowInstance) {
              reactFlowInstance.fitView({ padding: 0.2 });
            }
          }, 100);
        } else {
          alert('Invalid flow file format');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import flow: ' + error.message);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const nodeCreationButtons = [
    { type: 'voice', label: 'Voice', icon: '🗣️', color: 'bg-blue-500' },
    { type: 'input', label: 'Input', icon: '🎤', color: 'bg-green-500' },
    { type: 'condition', label: 'Condition', icon: '❓', color: 'bg-yellow-500' },
    { type: 'action', label: 'Action', icon: '⚡', color: 'bg-red-500' },
    { type: 'api', label: 'API', icon: '🔗', color: 'bg-purple-500' }
  ];

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-96 border border-gray-300 rounded-lg'}`}>
      
      <div className="h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          snapToGrid={snapToGrid}
          snapGrid={[15, 15]}
          defaultEdgeOptions={edgeOptions}
          fitView
          attributionPosition="top-right"
        >
          
          <Background variant="dots" gap={12} size={1} />
          <Controls />
          {showMiniMap && <MiniMap />}

          {/* Top Panel - Main Controls */}
          <Panel position="top-left">
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
              
              {/* Node Creation Buttons */}
              {nodeCreationButtons.map((button) => (
                <button
                  key={button.type}
                  className={`${button.color} text-white px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-1`}
                  onDragStart={(event) => {
                    event.dataTransfer.setData('application/reactflow', button.type);
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  draggable
                  title={`Drag to add ${button.label} node`}
                >
                  <span>{button.icon}</span>
                  <span>{button.label}</span>
                </button>
              ))}

              <div className="w-px h-6 bg-gray-300" />

              {/* Template Controls */}
              <button
                onClick={() => setShowTemplateBrowser(true)}
                className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                title="Browse Templates"
              >
                <Template className="w-4 h-4" />
                <span>Templates</span>
              </button>

              <button
                onClick={handleSaveAsTemplate}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
                title="Save as Template"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </Panel>

          {/* Top Panel - Execution Controls */}
          <Panel position="top-center">
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
              
              <button
                onClick={handleExecuteFlow}
                disabled={isExecuting || !validationResults.isValid}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
                  isExecuting || !validationResults.isValid
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                title="Execute Flow"
              >
                {isExecuting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{isExecuting ? 'Executing...' : 'Execute'}</span>
              </button>

              <button
                onClick={handleTestFlow}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                title="Test Flow"
              >
                <TestTube className="w-4 h-4" />
                <span>Test</span>
              </button>

              <button
                onClick={() => setShowExecutionPanel(!showExecutionPanel)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                title="Show Execution Panel"
              >
                <Zap className="w-4 h-4" />
                <span>Debug</span>
              </button>
            </div>
          </Panel>

          {/* Top Panel - View Controls */}
          <Panel position="top-right">
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
              
              {/* Import/Export */}
              <label className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFlow}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportFlow}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
                title="Export Flow"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <div className="w-px h-6 bg-gray-300" />

              {/* View Controls */}
              <button
                onClick={() => setShowMiniMap(!showMiniMap)}
                className={`p-2 rounded-md text-sm font-medium ${
                  showMiniMap ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle Mini Map"
              >
                <Layers className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`p-2 rounded-md text-sm font-medium ${
                  snapToGrid ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle Snap to Grid"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </Panel>

          {/* Bottom Panel - Status */}
          <Panel position="bottom-left">
            <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${validationResults.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={validationResults.isValid ? 'text-green-700' : 'text-red-700'}>
                    {validationResults.isValid ? 'Valid Flow' : `${validationResults.errors.length} Error(s)`}
                  </span>
                </div>
                
                {validationResults.warnings.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-yellow-700">{validationResults.warnings.length} Warning(s)</span>
                  </div>
                )}
                
                <div className="text-gray-600">
                  {nodes.length} nodes, {edges.length} connections
                </div>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Advanced Feature Components */}
      {showExecutionPanel && (
        <FlowExecutionPanel
          isOpen={showExecutionPanel}
          onClose={() => setShowExecutionPanel(false)}
          executionEngine={executionEngine}
          currentFlow={{ nodes, edges }}
          executionResults={executionResults}
          validationResults={validationResults}
        />
      )}

      {showTemplateBrowser && (
        <EnhancedFlowTemplateBrowser
          isOpen={showTemplateBrowser}
          onClose={() => setShowTemplateBrowser(false)}
          onTemplateLoad={handleLoadTemplate}
        />
      )}
    </div>
  );
};

export default FlowBuilder;
