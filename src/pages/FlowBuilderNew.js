import React, { useState, useCallback } from 'react';
import { 
  Zap, Play, Pause, Save, Download, Upload, Settings, Share2, Users, Eye,
  GitBranch, Layers, Grid, TestTube, BarChart3, Clock, MessageSquare,
  Phone, Mail, Brain, Target, ArrowRight, Plus, X, Edit, Copy, Trash2,
  ChevronDown, Search, Filter, MoreVertical, Maximize, Minimize,
  Sparkles, Crown, Shield, Lock, Globe, Cpu, Database, Network,
  Volume2, Mic, Speaker, Headphones, Video, Image, FileText,
  Calendar, Timer, Bell, AlertTriangle, CheckCircle, Info,
  TrendingUp, Activity, PieChart, RotateCcw, RefreshCw, Hash
} from 'lucide-react';

const FlowBuilderPage = () => {
  const [activeView, setActiveView] = useState('canvas');
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGrid, setShowGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);

  // Node types for the palette
  const nodeTypes = [
    { 
      id: 'start', 
      label: 'Start Call', 
      icon: Phone, 
      color: 'from-green-500 to-emerald-500',
      category: 'trigger',
      description: 'Entry point for incoming calls'
    },
    { 
      id: 'message', 
      label: 'AI Message', 
      icon: MessageSquare, 
      color: 'from-blue-500 to-cyan-500',
      category: 'communication',
      description: 'AI speaks to the caller'
    },
    { 
      id: 'listen', 
      label: 'Listen', 
      icon: Mic, 
      color: 'from-purple-500 to-pink-500',
      category: 'input',
      description: 'Capture caller response'
    },
    { 
      id: 'decision', 
      label: 'Decision', 
      icon: GitBranch, 
      color: 'from-orange-500 to-red-500',
      category: 'logic',
      description: 'Branch based on conditions'
    },
    { 
      id: 'transfer', 
      label: 'Transfer', 
      icon: Phone, 
      color: 'from-indigo-500 to-purple-500',
      category: 'action',
      description: 'Transfer to human agent'
    },
    { 
      id: 'webhook', 
      label: 'Webhook', 
      icon: Network, 
      color: 'from-teal-500 to-cyan-500',
      category: 'integration',
      description: 'External API integration'
    },
    { 
      id: 'database', 
      label: 'Database', 
      icon: Database, 
      color: 'from-yellow-500 to-orange-500',
      category: 'data',
      description: 'Store or retrieve data'
    },
    { 
      id: 'email', 
      label: 'Send Email', 
      icon: Mail, 
      color: 'from-green-500 to-blue-500',
      category: 'communication',
      description: 'Send automated email'
    },
    { 
      id: 'wait', 
      label: 'Wait/Delay', 
      icon: Timer, 
      color: 'from-gray-500 to-slate-500',
      category: 'control',
      description: 'Add delay in flow'
    },
    { 
      id: 'ai_analysis', 
      label: 'AI Analysis', 
      icon: Brain, 
      color: 'from-purple-500 to-indigo-500',
      category: 'ai',
      description: 'Advanced AI processing'
    },
    { 
      id: 'record', 
      label: 'Record', 
      icon: Video, 
      color: 'from-red-500 to-pink-500',
      category: 'media',
      description: 'Record conversation'
    },
    { 
      id: 'end', 
      label: 'End Call', 
      icon: Phone, 
      color: 'from-red-500 to-orange-500',
      category: 'trigger',
      description: 'Terminate the call'
    }
  ];

  // Demo flows
  const flows = [
    {
      id: 1,
      name: 'Sales Qualification Flow',
      description: 'Qualify leads and book appointments',
      status: 'active',
      nodes: 12,
      connections: 18,
      lastModified: '2 hours ago',
      performance: 94.2,
      category: 'sales'
    },
    {
      id: 2,
      name: 'Customer Support Flow',
      description: 'Handle support inquiries and escalations',
      status: 'draft',
      nodes: 8,
      connections: 11,
      lastModified: '1 day ago',
      performance: 87.5,
      category: 'support'
    },
    {
      id: 3,
      name: 'Appointment Booking',
      description: 'Schedule appointments with calendar integration',
      status: 'active',
      nodes: 15,
      connections: 22,
      lastModified: '3 hours ago',
      performance: 91.8,
      category: 'scheduling'
    }
  ];

  // Canvas nodes (demo)
  const [canvasNodes] = useState([
    {
      id: '1',
      type: 'start',
      position: { x: 100, y: 100 },
      data: { label: 'Incoming Call', script: 'Welcome to Vocelio AI' }
    },
    {
      id: '2',
      type: 'message',
      position: { x: 300, y: 100 },
      data: { label: 'Greeting', script: 'Hello! How can I help you today?' }
    },
    {
      id: '3',
      type: 'listen',
      position: { x: 500, y: 100 },
      data: { label: 'Capture Intent', timeout: 5 }
    },
    {
      id: '4',
      type: 'decision',
      position: { x: 700, y: 100 },
      data: { label: 'Route Request', conditions: ['sales', 'support', 'info'] }
    }
  ]);

  const categories = [
    { id: 'all', label: 'All Nodes', count: nodeTypes.length },
    { id: 'trigger', label: 'Triggers', count: nodeTypes.filter(n => n.category === 'trigger').length },
    { id: 'communication', label: 'Communication', count: nodeTypes.filter(n => n.category === 'communication').length },
    { id: 'logic', label: 'Logic', count: nodeTypes.filter(n => n.category === 'logic').length },
    { id: 'integration', label: 'Integrations', count: nodeTypes.filter(n => n.category === 'integration').length },
    { id: 'ai', label: 'AI/ML', count: nodeTypes.filter(n => n.category === 'ai').length }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredNodes = nodeTypes.filter(node => 
    (selectedCategory === 'all' || node.category === selectedCategory) &&
    (searchTerm === '' || node.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const FlowCanvas = () => (
    <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Grid Background */}
      {showGrid && (
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Canvas Nodes */}
      <div className="relative z-10 p-8">
        {canvasNodes.map((node) => (
          <div
            key={node.id}
            className={`absolute bg-gradient-to-r ${nodeTypes.find(n => n.id === node.type)?.color || 'from-gray-500 to-slate-500'} 
              rounded-2xl p-4 text-white shadow-2xl border border-white/20 backdrop-blur-sm
              transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer
              ${selectedNode?.id === node.id ? 'ring-4 ring-white/50 scale-110' : ''}`}
            style={{ 
              left: node.position.x * (canvasZoom / 100), 
              top: node.position.y * (canvasZoom / 100),
              transform: `scale(${canvasZoom / 100})`
            }}
            onClick={() => setSelectedNode(node)}
          >
            <div className="flex items-center space-x-3">
              {React.createElement(nodeTypes.find(n => n.id === node.type)?.icon || Brain, { 
                className: "w-6 h-6" 
              })}
              <div>
                <h4 className="font-bold text-sm">{node.data.label}</h4>
                <p className="text-xs opacity-90 max-w-[120px] truncate">
                  {node.data.script || node.data.timeout || 'Configure...'}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Connections */}
        <svg className="absolute inset-0 pointer-events-none z-0">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgb(59, 130, 246)" />
            </marker>
          </defs>
          {canvasNodes.slice(0, -1).map((node, index) => {
            const nextNode = canvasNodes[index + 1];
            const startX = (node.position.x + 100) * (canvasZoom / 100);
            const startY = (node.position.y + 30) * (canvasZoom / 100);
            const endX = nextNode.position.x * (canvasZoom / 100);
            const endY = (nextNode.position.y + 30) * (canvasZoom / 100);
            
            return (
              <line
                key={`edge-${index}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="rgb(59, 130, 246)"
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
                className="drop-shadow-lg"
              />
            );
          })}
        </svg>
      </div>

      {/* Minimap */}
      {showMinimap && (
        <div className="absolute bottom-4 right-4 w-48 h-32 bg-white/90 dark:bg-gray-800/90 rounded-lg border border-gray-300 dark:border-gray-600 backdrop-blur-sm p-2">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Overview</div>
          <div className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
            {canvasNodes.map(node => (
              <div
                key={`mini-${node.id}`}
                className="absolute w-2 h-2 bg-blue-500 rounded"
                style={{
                  left: `${(node.position.x / 800) * 100}%`,
                  top: `${(node.position.y / 400) * 100}%`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Enhanced Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 border-r border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Flow Builder
                  </h1>
                  <p className="text-sm text-gray-400">World-class AI flow designer</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? <Maximize className="w-5 h-5" /> : <Minimize className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-700">
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2 font-semibold shadow-lg transform hover:scale-105">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">New Flow</span>
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-3 rounded-xl transition-all flex items-center space-x-2 font-semibold shadow-lg transform hover:scale-105 ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-sm">{isPlaying ? 'Stop' : 'Test'}</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{category.label}</span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Node Palette */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Node Palette</h3>
              <div className="space-y-3">
                {filteredNodes.map(node => (
                  <div
                    key={node.id}
                    className="group p-4 bg-gray-800 hover:bg-gray-750 rounded-xl border border-gray-700 hover:border-gray-600 transition-all cursor-pointer transform hover:scale-105"
                    draggable
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 bg-gradient-to-br ${node.color} rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                        <node.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {node.label}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          {node.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* View Selector */}
              <div className="flex items-center space-x-2 bg-gray-900 rounded-xl p-1">
                {[
                  { id: 'canvas', label: 'Canvas', icon: Grid },
                  { id: 'flows', label: 'Flows', icon: Layers },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      activeView === view.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <view.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{view.label}</span>
                  </button>
                ))}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCanvasZoom(Math.max(25, canvasZoom - 25))}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Minimize className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-300 min-w-[50px] text-center">
                  {canvasZoom}%
                </span>
                <button
                  onClick={() => setCanvasZoom(Math.min(200, canvasZoom + 25))}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Canvas Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded-lg transition-colors ${
                    showGrid ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowMinimap(!showMinimap)}
                  className={`p-2 rounded-lg transition-colors ${
                    showMinimap ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-2 transition-colors">
                  <Save className="w-4 h-4" />
                  <span className="text-sm">Save</span>
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg flex items-center space-x-2 transition-all font-semibold shadow-lg">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Deploy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative">
          {activeView === 'canvas' && <FlowCanvas />}
          
          {activeView === 'flows' && (
            <div className="p-8 h-full overflow-y-auto bg-gradient-to-br from-gray-900 to-slate-900">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">My Flows</h2>
                    <p className="text-gray-400">Manage and organize your conversation flows</p>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl flex items-center space-x-2 font-semibold shadow-lg transform hover:scale-105 transition-all">
                    <Plus className="w-5 h-5" />
                    <span>Create New Flow</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {flows.map(flow => (
                    <div key={flow.id} className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                            <GitBranch className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors">{flow.name}</h3>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              flow.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {flow.status}
                            </div>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{flow.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-2xl font-bold text-white">{flow.nodes}</p>
                          <p className="text-xs text-gray-400">Nodes</p>
                        </div>
                        <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-2xl font-bold text-white">{flow.connections}</p>
                          <p className="text-xs text-gray-400">Connections</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">{flow.performance}% success</span>
                        </div>
                        <span className="text-xs text-gray-400">{flow.lastModified}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors">
                          Edit Flow
                        </button>
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'analytics' && (
            <div className="p-8 h-full overflow-y-auto bg-gradient-to-br from-gray-900 to-slate-900">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-black text-white mb-8">Flow Analytics</h2>
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { title: 'Total Flows', value: '24', change: '+12%', icon: GitBranch, color: 'from-blue-500 to-cyan-500' },
                    { title: 'Success Rate', value: '94.2%', change: '+5.3%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
                    { title: 'Avg Duration', value: '4:32', change: '-0:45', icon: Clock, color: 'from-purple-500 to-pink-500' },
                    { title: 'Total Calls', value: '12.8K', change: '+23%', icon: Phone, color: 'from-orange-500 to-red-500' }
                  ].map((metric, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-xl shadow-lg`}>
                          <metric.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${
                          metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">{metric.title}</h3>
                      <p className="text-3xl font-bold text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* Performance Chart */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 mb-8">
                  <h3 className="text-xl font-bold text-white mb-6">Flow Performance Over Time</h3>
                  <div className="h-64 bg-gray-700/50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Performance chart visualization</p>
                      <p className="text-sm text-gray-500">Chart component would be integrated here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <div className="w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-l border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Node Properties</h3>
            <button 
              onClick={() => setSelectedNode(null)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Node Name</label>
              <input 
                type="text" 
                value={selectedNode.data.label}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                readOnly
              />
            </div>

            {selectedNode.type === 'message' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">AI Script</label>
                <textarea 
                  value={selectedNode.data.script || ''}
                  rows={4}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Enter the message the AI should speak..."
                  readOnly
                />
              </div>
            )}

            {selectedNode.type === 'listen' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Timeout (seconds)</label>
                <input 
                  type="number" 
                  value={selectedNode.data.timeout || 5}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  readOnly
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea 
                rows={3}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Add a description for this node..."
              />
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-white transition-all shadow-lg">
              Update Node
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowBuilderPage;
