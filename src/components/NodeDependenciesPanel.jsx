import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  GitBranch, 
  ArrowRight,
  Eye,
  EyeOff,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  CheckCircle,
  Route,
  Layers,
  Zap
} from 'lucide-react';
import { 
  NodeDependencyAnalyzer, 
  NodeDependencyIndicator,
  DependencyTypes 
} from '../lib/nodeDependencies';

const NodeDependenciesPanel = ({ 
  nodes = [], 
  edges = [], 
  currentEditingNode = null,
  onNodeFocus = null,
  onHighlightPath = null,
  isDarkMode = false 
}) => {
  const [dependencies, setDependencies] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'details', 'paths'
  const [expandedSections, setExpandedSections] = useState({
    incoming: true,
    outgoing: true,
    issues: true
  });
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Analyze dependencies whenever nodes or edges change
  useEffect(() => {
    if (nodes.length > 0) {
      const analyzed = NodeDependencyAnalyzer.analyzeDependencies(nodes, edges);
      setDependencies(analyzed);
    }
  }, [nodes, edges]);

  // Set selected node to current editing node
  useEffect(() => {
    if (currentEditingNode && dependencies[currentEditingNode]) {
      setSelectedNode(currentEditingNode);
    }
  }, [currentEditingNode, dependencies]);

  const getDependencyTypeStats = useCallback((dependencyValues) => {
    const stats = {};
    dependencyValues.forEach(node => {
      node.outgoing.forEach(dep => {
        stats[dep.dependencyType] = (stats[dep.dependencyType] || 0) + 1;
      });
    });
    return stats;
  }, []);

  // Compute summary statistics
  const summaryStats = useMemo(() => {
    const dependencyValues = Object.values(dependencies);
    
    return {
      totalNodes: dependencyValues.length,
      startNodes: dependencyValues.filter(n => n.isStartNode).length,
      endNodes: dependencyValues.filter(n => n.isEndNode).length,
      parallelNodes: dependencyValues.filter(n => n.canExecuteParallel).length,
      criticalPathNodes: dependencyValues.filter(n => n.criticalPath).length,
      issueNodes: dependencyValues.filter(n => n.warnings.length > 0).length,
      maxDepth: Math.max(...dependencyValues.map(n => n.depth), 0),
      dependencyTypes: getDependencyTypeStats(dependencyValues)
    };
  }, [dependencies, getDependencyTypeStats]);

  // Filter nodes based on search and filter criteria
  const filteredNodes = useMemo(() => {
    let nodeList = Object.values(dependencies);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      nodeList = nodeList.filter(node =>
        node.nodeLabel.toLowerCase().includes(query) ||
        node.nodeType.toLowerCase().includes(query) ||
        node.nodeId.toLowerCase().includes(query)
      );
    }

    // Apply dependency type filter
    if (filterType !== 'all') {
      switch (filterType) {
        case 'start':
          nodeList = nodeList.filter(n => n.isStartNode);
          break;
        case 'end':
          nodeList = nodeList.filter(n => n.isEndNode);
          break;
        case 'parallel':
          nodeList = nodeList.filter(n => n.canExecuteParallel);
          break;
        case 'critical':
          nodeList = nodeList.filter(n => n.criticalPath);
          break;
        case 'issues':
          nodeList = nodeList.filter(n => n.warnings.length > 0);
          break;
      }
    }

    return nodeList;
  }, [dependencies, searchQuery, filterType]);

  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId);
    if (onNodeFocus) {
      onNodeFocus(nodeId);
    }
  };

  const handleHighlightPath = (fromNodeId, toNodeId) => {
    if (onHighlightPath) {
      const path = NodeDependencyAnalyzer.getDependencyPath(fromNodeId, toNodeId, dependencies);
      onHighlightPath(path);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getNodeIcon = (node) => {
    if (node.isStartNode) return '🎯';
    if (node.isEndNode) return '🏁';
    if (node.criticalPath) return '⚡';
    if (node.canExecuteParallel) return '🔀';
    if (node.warnings.length > 0) return '⚠️';
    return '📦';
  };

  const selectedNodeData = selectedNode ? dependencies[selectedNode] : null;

  return (
    <div className={`h-full flex flex-col ${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500 text-white">
              <GitBranch size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Node Dependencies</h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Flow relationships and execution order</p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className={`flex rounded-lg p-1 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {[
              { key: 'overview', icon: Layers, label: 'Overview' },
              { key: 'details', icon: Info, label: 'Details' },
              { key: 'paths', icon: Route, label: 'Paths' }
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === mode.key
                    ? 'bg-purple-500 text-white'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <mode.icon size={14} />
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} size={16} />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Nodes</option>
            <option value="start">Start Nodes</option>
            <option value="end">End Nodes</option>
            <option value="parallel">Parallel</option>
            <option value="critical">Critical Path</option>
            <option value="issues">With Issues</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className={`p-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className={`p-2 rounded ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="text-blue-500" size={14} />
              <span className="text-xs font-medium">Total Nodes</span>
            </div>
            <p className="text-lg font-semibold">{summaryStats.totalNodes}</p>
          </div>

          <div className={`p-2 rounded ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Route className="text-purple-500" size={14} />
              <span className="text-xs font-medium">Max Depth</span>
            </div>
            <p className="text-lg font-semibold">{summaryStats.maxDepth}</p>
          </div>
        </div>

        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{summaryStats.startNodes} Start</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>{summaryStats.endNodes} End</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{summaryStats.parallelNodes} Parallel</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>{summaryStats.issueNodes} Issues</span>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'overview' && (
          <div className="p-4">
            {/* Node List */}
            <div className="space-y-2">
              {filteredNodes.map(node => (
                <div
                  key={node.nodeId}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedNode === node.nodeId
                      ? isDarkMode 
                        ? 'border-purple-500 bg-purple-900/20' 
                        : 'border-purple-500 bg-purple-50'
                      : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => handleNodeSelect(node.nodeId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getNodeIcon(node)}</span>
                      <div>
                        <h4 className="font-medium text-sm truncate max-w-32">
                          {node.nodeLabel}
                        </h4>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {node.nodeType} • Depth {node.depth}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {node.criticalPath && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          Critical
                        </span>
                      )}
                      {node.canExecuteParallel && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          Parallel
                        </span>
                      )}
                      {node.warnings.length > 0 && (
                        <AlertTriangle className="text-yellow-500" size={14} />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className={`${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {node.incoming.length} incoming • {node.outgoing.length} outgoing
                    </span>
                    
                    {node.dependencyType && (
                      <NodeDependencyIndicator 
                        dependencyType={node.dependencyType}
                        size="xs"
                        isDarkMode={isDarkMode}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'details' && selectedNodeData && (
          <div className="p-4">
            {/* Selected Node Details */}
            <div className={`p-4 rounded-lg border mb-4 ${
              isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{getNodeIcon(selectedNodeData)}</span>
                <div>
                  <h3 className="font-semibold">{selectedNodeData.nodeLabel}</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {selectedNodeData.nodeType} • ID: {selectedNodeData.nodeId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-xs font-medium mb-1">Depth</p>
                  <p className="text-sm">{selectedNodeData.depth}</p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Incoming</p>
                  <p className="text-sm">{selectedNodeData.incoming.length}</p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Outgoing</p>
                  <p className="text-sm">{selectedNodeData.outgoing.length}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedNodeData.isStartNode && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Start Node
                  </span>
                )}
                {selectedNodeData.isEndNode && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                    End Node
                  </span>
                )}
                {selectedNodeData.criticalPath && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    Critical Path
                  </span>
                )}
                {selectedNodeData.canExecuteParallel && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    Can Execute Parallel
                  </span>
                )}
              </div>
            </div>

            {/* Incoming Dependencies */}
            {selectedNodeData.incoming.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('incoming')}
                  className="w-full flex items-center justify-between p-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="text-blue-500 rotate-180" size={16} />
                    <span className="font-medium">
                      Incoming Dependencies ({selectedNodeData.incoming.length})
                    </span>
                  </div>
                  {expandedSections.incoming ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expandedSections.incoming && (
                  <div className="space-y-2 ml-6">
                    {selectedNodeData.incoming.map((dep, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded border cursor-pointer hover:shadow-sm ${
                          isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                        }`}
                        onClick={() => handleNodeSelect(dep.nodeId)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{dep.nodeLabel}</span>
                          <NodeDependencyIndicator 
                            dependencyType={dep.dependencyType}
                            size="sm"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                        {dep.condition && (
                          <p className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Condition: {dep.condition}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Outgoing Dependencies */}
            {selectedNodeData.outgoing.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('outgoing')}
                  className="w-full flex items-center justify-between p-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="text-green-500" size={16} />
                    <span className="font-medium">
                      Outgoing Dependencies ({selectedNodeData.outgoing.length})
                    </span>
                  </div>
                  {expandedSections.outgoing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expandedSections.outgoing && (
                  <div className="space-y-2 ml-6">
                    {selectedNodeData.outgoing.map((dep, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded border cursor-pointer hover:shadow-sm ${
                          isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                        }`}
                        onClick={() => handleNodeSelect(dep.nodeId)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{dep.nodeLabel}</span>
                          <NodeDependencyIndicator 
                            dependencyType={dep.dependencyType}
                            size="sm"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                        {dep.condition && (
                          <p className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Condition: {dep.condition}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Issues/Warnings */}
            {selectedNodeData.warnings.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('issues')}
                  className="w-full flex items-center justify-between p-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-yellow-500" size={16} />
                    <span className="font-medium">
                      Issues ({selectedNodeData.warnings.length})
                    </span>
                  </div>
                  {expandedSections.issues ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expandedSections.issues && (
                  <div className="space-y-2 ml-6">
                    {selectedNodeData.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded border ${
                          warning.severity === 'error' 
                            ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                            : warning.severity === 'warning'
                            ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                            : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                        }`}
                      >
                        <p className="text-sm font-medium">{warning.message}</p>
                        <p className="text-xs capitalize mt-1">
                          {warning.severity} • {warning.type.replace('_', ' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {viewMode === 'paths' && (
          <div className="p-4">
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Route size={32} className="mx-auto mb-2" />
              <p className="font-medium">Path Analysis</p>
              <p className="text-sm">Select two nodes to analyze execution paths</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeDependenciesPanel;
