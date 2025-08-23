import React from 'react';
import { 
  ArrowRight, 
  GitBranch, 
  Shuffle, 
  Repeat,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

// Dependency relationship types
export const DependencyTypes = {
  SEQUENTIAL: 'sequential',      // Node B follows Node A
  CONDITIONAL: 'conditional',    // Node B depends on condition in Node A  
  PARALLEL: 'parallel',         // Nodes execute in parallel
  LOOP: 'loop',                 // Node creates a loop back
  TRIGGER: 'trigger',           // Node A triggers Node B
  FALLBACK: 'fallback'          // Node B is fallback for Node A
};

// Visual indicators for different dependency types
const DependencyIndicators = {
  [DependencyTypes.SEQUENTIAL]: {
    icon: ArrowRight,
    color: 'blue',
    label: 'Sequential',
    description: 'Executes in order'
  },
  [DependencyTypes.CONDITIONAL]: {
    icon: GitBranch,
    color: 'yellow',
    label: 'Conditional',
    description: 'Depends on condition'
  },
  [DependencyTypes.PARALLEL]: {
    icon: Shuffle,
    color: 'green',
    label: 'Parallel',
    description: 'Executes simultaneously'
  },
  [DependencyTypes.LOOP]: {
    icon: Repeat,
    color: 'purple',
    label: 'Loop',
    description: 'Creates a cycle'
  },
  [DependencyTypes.TRIGGER]: {
    icon: Zap,
    color: 'orange',
    label: 'Trigger',
    description: 'Triggers execution'
  },
  [DependencyTypes.FALLBACK]: {
    icon: AlertCircle,
    color: 'red',
    label: 'Fallback',
    description: 'Fallback option'
  }
};

export class NodeDependencyAnalyzer {
  
  static analyzeDependencies(nodes, edges) {
    const dependencies = {};
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    // Initialize dependency structure for each node
    nodes.forEach(node => {
      dependencies[node.id] = {
        nodeId: node.id,
        nodeLabel: node.data.label || node.id,
        nodeType: node.data.nodeType || 'Unknown',
        incoming: [],      // Nodes that this node depends on
        outgoing: [],      // Nodes that depend on this node
        dependencyType: null,
        criticalPath: false,
        depth: 0,
        canExecuteParallel: false,
        hasConditionalLogic: false,
        isStartNode: false,
        isEndNode: false,
        loopTarget: null,
        warnings: []
      };
    });

    // Analyze edges to determine dependencies
    edges.forEach(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      if (sourceNode && targetNode) {
        const dependencyInfo = this.analyzeDependencyType(sourceNode, targetNode, edge);
        
        // Add to outgoing dependencies of source
        dependencies[edge.source].outgoing.push({
          nodeId: edge.target,
          nodeLabel: targetNode.data.label || edge.target,
          edgeId: edge.id,
          dependencyType: dependencyInfo.type,
          condition: dependencyInfo.condition,
          priority: dependencyInfo.priority
        });

        // Add to incoming dependencies of target
        dependencies[edge.target].incoming.push({
          nodeId: edge.source,
          nodeLabel: sourceNode.data.label || edge.source,
          edgeId: edge.id,
          dependencyType: dependencyInfo.type,
          condition: dependencyInfo.condition,
          priority: dependencyInfo.priority
        });

        // Set dependency type for target node if not already set
        if (!dependencies[edge.target].dependencyType) {
          dependencies[edge.target].dependencyType = dependencyInfo.type;
        }
      }
    });

    // Identify start and end nodes
    this.identifyStartEndNodes(dependencies);

    // Calculate node depths and critical path
    this.calculateNodeDepths(dependencies);

    // Identify parallel execution opportunities
    this.identifyParallelNodes(dependencies);

    // Detect potential issues
    this.detectDependencyIssues(dependencies);

    return dependencies;
  }

  static analyzeDependencyType(sourceNode, targetNode, edge) {
    const sourceData = sourceNode.data;
    const targetData = targetNode.data;

    // Check for conditional dependencies
    if (sourceData.nodeType === 'Decision' || 
        sourceData.loopCondition || 
        edge.sourceHandle?.includes('condition')) {
      return {
        type: DependencyTypes.CONDITIONAL,
        condition: sourceData.loopCondition || 'Decision outcome',
        priority: 1
      };
    }

    // Check for loops
    if (this.isLoopEdge(sourceNode, targetNode, edge)) {
      return {
        type: DependencyTypes.LOOP,
        condition: sourceData.loopCondition || 'Loop condition',
        priority: 2
      };
    }

    // Check for triggers (API calls, integrations)
    if (sourceData.nodeType === 'Integration' || 
        sourceData.content?.includes('API') ||
        sourceData.template?.includes('api')) {
      return {
        type: DependencyTypes.TRIGGER,
        condition: 'API response',
        priority: 1
      };
    }

    // Check for fallback patterns
    if (edge.label?.toLowerCase().includes('fallback') ||
        edge.label?.toLowerCase().includes('error') ||
        sourceData.content?.toLowerCase().includes('fallback')) {
      return {
        type: DependencyTypes.FALLBACK,
        condition: 'Error or failure',
        priority: 3
      };
    }

    // Default to sequential
    return {
      type: DependencyTypes.SEQUENTIAL,
      condition: null,
      priority: 0
    };
  }

  static isLoopEdge(sourceNode, targetNode, edge) {
    // Simple heuristic: if target node has lower position or is marked as loop
    return targetNode.position.y < sourceNode.position.y ||
           edge.label?.toLowerCase().includes('loop') ||
           sourceNode.data.loopCondition;
  }

  static identifyStartEndNodes(dependencies) {
    Object.values(dependencies).forEach(node => {
      // Start nodes have no incoming dependencies
      node.isStartNode = node.incoming.length === 0;
      
      // End nodes have no outgoing dependencies
      node.isEndNode = node.outgoing.length === 0;
    });
  }

  static calculateNodeDepths(dependencies) {
    const visited = new Set();
    const depths = {};

    // Calculate depth using DFS
    const calculateDepth = (nodeId, currentDepth = 0) => {
      if (visited.has(nodeId)) {
        return depths[nodeId] || 0;
      }

      visited.add(nodeId);
      depths[nodeId] = currentDepth;
      dependencies[nodeId].depth = currentDepth;

      // Calculate depths for outgoing nodes
      dependencies[nodeId].outgoing.forEach(dep => {
        calculateDepth(dep.nodeId, currentDepth + 1);
      });

      return currentDepth;
    };

    // Start from start nodes
    Object.values(dependencies)
      .filter(node => node.isStartNode)
      .forEach(startNode => {
        calculateDepth(startNode.nodeId);
      });

    // Mark critical path (longest path)
    const maxDepth = Math.max(...Object.values(depths));
    Object.values(dependencies).forEach(node => {
      if (node.depth === maxDepth) {
        node.criticalPath = true;
      }
    });
  }

  static identifyParallelNodes(dependencies) {
    // Nodes can execute in parallel if they:
    // 1. Have the same depth
    // 2. Don't depend on each other
    // 3. Are not in a sequential chain

    const depthGroups = {};
    
    Object.values(dependencies).forEach(node => {
      const depth = node.depth;
      if (!depthGroups[depth]) {
        depthGroups[depth] = [];
      }
      depthGroups[depth].push(node);
    });

    Object.values(depthGroups).forEach(group => {
      if (group.length > 1) {
        // Check if nodes in this group can execute in parallel
        group.forEach(node => {
          const hasSharedDependencies = group.some(otherNode => 
            otherNode.nodeId !== node.nodeId &&
            (node.incoming.some(dep => 
              otherNode.incoming.some(otherDep => dep.nodeId === otherDep.nodeId)
            ) ||
            node.outgoing.some(dep => 
              otherNode.outgoing.some(otherDep => dep.nodeId === otherDep.nodeId)
            ))
          );

          if (!hasSharedDependencies) {
            node.canExecuteParallel = true;
          }
        });
      }
    });
  }

  static detectDependencyIssues(dependencies) {
    Object.values(dependencies).forEach(node => {
      const warnings = [];

      // Check for circular dependencies
      if (this.hasCircularDependency(node, dependencies)) {
        warnings.push({
          type: 'circular_dependency',
          message: 'Circular dependency detected',
          severity: 'error'
        });
      }

      // Check for orphaned nodes
      if (node.incoming.length === 0 && node.outgoing.length === 0 && 
          Object.keys(dependencies).length > 1) {
        warnings.push({
          type: 'orphaned_node',
          message: 'Node is not connected to flow',
          severity: 'warning'
        });
      }

      // Check for missing conditions on decision nodes
      if (node.nodeType === 'Decision' && node.outgoing.length > 1) {
        const hasDefaultPath = node.outgoing.some(dep => 
          dep.condition === 'default' || dep.condition === null
        );
        if (!hasDefaultPath) {
          warnings.push({
            type: 'missing_default_path',
            message: 'Decision node missing default path',
            severity: 'warning'
          });
        }
      }

      // Check for excessive fan-out
      if (node.outgoing.length > 5) {
        warnings.push({
          type: 'excessive_fanout',
          message: 'Node has too many outgoing connections',
          severity: 'warning'
        });
      }

      // Check for deep nesting
      if (node.depth > 10) {
        warnings.push({
          type: 'deep_nesting',
          message: 'Node is deeply nested in flow',
          severity: 'info'
        });
      }

      node.warnings = warnings;
    });
  }

  static hasCircularDependency(node, dependencies, visited = new Set(), recursionStack = new Set()) {
    if (recursionStack.has(node.nodeId)) {
      return true;
    }
    if (visited.has(node.nodeId)) {
      return false;
    }

    visited.add(node.nodeId);
    recursionStack.add(node.nodeId);

    for (const outgoing of node.outgoing) {
      const dependentNode = dependencies[outgoing.nodeId];
      if (dependentNode && this.hasCircularDependency(dependentNode, dependencies, visited, recursionStack)) {
        return true;
      }
    }

    recursionStack.delete(node.nodeId);
    return false;
  }

  static getNodeDependencyInfo(nodeId, dependencies) {
    return dependencies[nodeId] || null;
  }

  static getDependencyPath(fromNodeId, toNodeId, dependencies) {
    const visited = new Set();
    const path = [];

    const findPath = (currentId, targetId, currentPath) => {
      if (currentId === targetId) {
        return [...currentPath, currentId];
      }

      if (visited.has(currentId)) {
        return null;
      }

      visited.add(currentId);
      const node = dependencies[currentId];

      if (node) {
        for (const outgoing of node.outgoing) {
          const result = findPath(outgoing.nodeId, targetId, [...currentPath, currentId]);
          if (result) {
            return result;
          }
        }
      }

      return null;
    };

    return findPath(fromNodeId, toNodeId, []);
  }
}

// Visual component for dependency indicators
export const NodeDependencyIndicator = ({ 
  dependencyType, 
  isIncoming = false, 
  condition = null,
  size = 'sm',
  showLabel = false,
  isDarkMode = false
}) => {
  const indicator = DependencyIndicators[dependencyType];
  if (!indicator) return null;

  const Icon = indicator.icon;
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
    yellow: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20',
    green: 'text-green-500 bg-green-100 dark:bg-green-900/20',
    purple: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
    orange: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20',
    red: 'text-red-500 bg-red-100 dark:bg-red-900/20'
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
      colorClasses[indicator.color]
    }`} title={`${indicator.label}: ${indicator.description}${condition ? ` (${condition})` : ''}`}>
      <Icon className={sizeClasses[size]} />
      {showLabel && (
        <span className="font-medium">{indicator.label}</span>
      )}
    </div>
  );
};

export default NodeDependencyAnalyzer;
