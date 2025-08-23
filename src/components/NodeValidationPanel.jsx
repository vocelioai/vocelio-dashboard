import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Settings
} from 'lucide-react';
import { NodeValidator } from '../lib/nodeValidation';

const ValidationSeverityIcons = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle
};

const ValidationSeverityColors = {
  error: 'text-red-500 bg-red-50 border-red-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  info: 'text-blue-500 bg-blue-50 border-blue-200',
  success: 'text-green-500 bg-green-50 border-green-200'
};

const ValidationSeverityColorsDark = {
  error: 'text-red-400 bg-red-900/20 border-red-800/30',
  warning: 'text-yellow-400 bg-yellow-900/20 border-yellow-800/30',
  info: 'text-blue-400 bg-blue-900/20 border-blue-800/30',
  success: 'text-green-400 bg-green-900/20 border-green-800/30'
};

const NodeValidationPanel = ({ 
  nodes = [], 
  edges = [], 
  currentEditingNode = null,
  isDarkMode = false,
  onNodeFocus = null,
  autoValidate = true
}) => {
  const [validationResults, setValidationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    errors: true,
    warnings: true,
    nodeDetails: false
  });
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Validate flow whenever nodes or edges change
  useEffect(() => {
    if (autoValidate && nodes && Array.isArray(nodes) && nodes.length > 0) {
      validateFlow();
    }
  }, [nodes, edges, autoValidate]);

  const validateFlow = async () => {
    setIsLoading(true);
    
    try {
      // Simulate async validation (in real app, this might involve API calls)
      setTimeout(() => {
        const results = NodeValidator.validateFlow(nodes || [], edges || []);
        setValidationResults(results);
        setIsLoading(false);
      }, 200);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResults({
        isValid: false,
        errors: [{
          type: 'VALIDATION_ERROR',
          message: 'An error occurred during validation: ' + (error.message || 'Unknown error'),
          severity: 'error'
        }],
        warnings: [],
        nodeValidations: [],
        flowStats: { totalNodes: 0, totalEdges: 0, validNodes: 0, nodeTypes: {} }
      });
      setIsLoading(false);
    }
  };

  // Filter and search issues
  const filteredIssues = useMemo(() => {
    if (!validationResults) return { errors: [], warnings: [] };

    let allIssues = [
      ...validationResults.errors.map(e => ({ ...e, severity: 'error' })),
      ...validationResults.warnings.map(w => ({ ...w, severity: 'warning' }))
    ];

    // Filter by severity
    if (filterSeverity !== 'all') {
      allIssues = allIssues.filter(issue => issue.severity === filterSeverity);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allIssues = allIssues.filter(issue => 
        issue.message.toLowerCase().includes(query) ||
        (issue.nodeId && issue.nodeId.toLowerCase().includes(query))
      );
    }

    return {
      errors: allIssues.filter(issue => issue.severity === 'error'),
      warnings: allIssues.filter(issue => issue.severity === 'warning')
    };
  }, [validationResults, filterSeverity, searchQuery]);

  // Get current node validation if editing a specific node
  const currentNodeValidation = useMemo(() => {
    if (!currentEditingNode || !validationResults) return null;
    
    return validationResults.nodeValidations.find(
      validation => validation.nodeId === currentEditingNode
    );
  }, [currentEditingNode, validationResults]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNodeFocus = (nodeId) => {
    if (onNodeFocus) {
      onNodeFocus(nodeId);
    }
  };

  const getIssueIcon = (severity) => {
    const Icon = ValidationSeverityIcons[severity] || Info;
    return <Icon size={16} />;
  };

  const getIssueColors = (severity) => {
    return isDarkMode 
      ? ValidationSeverityColorsDark[severity] || ValidationSeverityColorsDark.info
      : ValidationSeverityColors[severity] || ValidationSeverityColors.info;
  };

  const formatNodeId = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.data.label || nodeId : nodeId;
  };

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
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <CheckCircle size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Flow Validation</h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Real-time validation and quality checks</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={validateFlow}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            
            <button className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Settings size={16} />
            </button>
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
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Issues</option>
            <option value="error">Errors Only</option>
            <option value="warning">Warnings Only</option>
          </select>
        </div>
      </div>

      {/* Validation Summary */}
      {validationResults && (
        <div className={`p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-sm font-medium">Flow Status</span>
              </div>
              <p className={`text-sm ${
                validationResults.isValid 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {validationResults.isValid ? 'Valid' : 'Issues Found'}
              </p>
            </div>

            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Info className="text-blue-500" size={16} />
                <span className="text-sm font-medium">Nodes</span>
              </div>
              <p className="text-sm">
                {validationResults.flowStats.validNodes}/{validationResults.flowStats.totalNodes} Valid
              </p>
            </div>
          </div>

          {/* Issue counts */}
          <div className="flex justify-center gap-6 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <XCircle className="text-red-500" size={16} />
              <span className="text-sm">
                {filteredIssues.errors.length} Error{filteredIssues.errors.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" size={16} />
              <span className="text-sm">
                {filteredIssues.warnings.length} Warning{filteredIssues.warnings.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Current Node Validation */}
      {currentNodeValidation && (
        <div className={`p-4 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1 rounded ${
              currentNodeValidation.isValid 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {currentNodeValidation.isValid ? 
                <CheckCircle size={14} /> : 
                <XCircle size={14} />
              }
            </div>
            <span className="font-medium text-sm">Current Node</span>
          </div>
          <p className="text-sm mb-1 font-medium">
            {formatNodeId(currentEditingNode)}
          </p>
          <p className={`text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {currentNodeValidation.errors.length} error{currentNodeValidation.errors.length !== 1 ? 's' : ''}, {' '}
            {currentNodeValidation.warnings.length} warning{currentNodeValidation.warnings.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="animate-spin text-blue-500" size={24} />
            <span className="ml-2">Validating flow...</span>
          </div>
        ) : !validationResults ? (
          <div className="flex items-center justify-center h-32">
            <Info className="text-gray-400" size={24} />
            <span className="ml-2 text-gray-500">Click refresh to validate</span>
          </div>
        ) : (
          <div>
            {/* Errors Section */}
            {filteredIssues.errors.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('errors')}
                  className={`w-full flex items-center justify-between p-3 text-left hover:bg-red-50 ${
                    isDarkMode ? 'hover:bg-red-900/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="text-red-500" size={16} />
                    <span className="font-medium text-red-600">
                      Errors ({filteredIssues.errors.length})
                    </span>
                  </div>
                  {expandedSections.errors ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expandedSections.errors && (
                  <div className="space-y-2 px-3 pb-3">
                    {filteredIssues.errors.map((error, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm ${getIssueColors('error')}`}
                        onClick={() => error.nodeId && handleNodeFocus(error.nodeId)}
                      >
                        <div className="flex items-start gap-2">
                          {getIssueIcon('error')}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-1">{error.message}</p>
                            {error.nodeId && (
                              <p className="text-xs opacity-75">
                                Node: {formatNodeId(error.nodeId)}
                              </p>
                            )}
                            {error.field && (
                              <p className="text-xs opacity-75">
                                Field: {error.field}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Warnings Section */}
            {filteredIssues.warnings.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('warnings')}
                  className={`w-full flex items-center justify-between p-3 text-left hover:bg-yellow-50 ${
                    isDarkMode ? 'hover:bg-yellow-900/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-yellow-500" size={16} />
                    <span className="font-medium text-yellow-600">
                      Warnings ({filteredIssues.warnings.length})
                    </span>
                  </div>
                  {expandedSections.warnings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expandedSections.warnings && (
                  <div className="space-y-2 px-3 pb-3">
                    {filteredIssues.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm ${getIssueColors('warning')}`}
                        onClick={() => warning.nodeId && handleNodeFocus(warning.nodeId)}
                      >
                        <div className="flex items-start gap-2">
                          {getIssueIcon('warning')}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-1">{warning.message}</p>
                            {warning.nodeId && (
                              <p className="text-xs opacity-75">
                                Node: {formatNodeId(warning.nodeId)}
                              </p>
                            )}
                            {warning.field && (
                              <p className="text-xs opacity-75">
                                Field: {warning.field}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* No Issues */}
            {filteredIssues.errors.length === 0 && filteredIssues.warnings.length === 0 && validationResults && (
              <div className="flex flex-col items-center justify-center h-32">
                <CheckCircle className="text-green-500 mb-2" size={32} />
                <p className="text-green-600 font-medium">No Issues Found</p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Your flow looks great!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeValidationPanel;
