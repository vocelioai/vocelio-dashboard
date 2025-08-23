import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeTypeConfig } from '../lib/flowSchemas';
import { AlertTriangle, Clock, Zap } from 'lucide-react';

// Base node wrapper with handles and validation
const BaseNode = ({ 
  id, 
  type, 
  data, 
  selected, 
  isDarkMode = false,
  validationErrors = [],
  metrics = null
}) => {
  const config = NodeTypeConfig[type];
  const hasErrors = validationErrors.length > 0;
  
  return (
    <div className={`relative min-w-[200px] rounded-lg shadow-lg border-2 transition-all duration-200 ${
      selected 
        ? 'ring-4 ring-blue-300 border-blue-500' 
        : hasErrors
        ? 'border-red-500 ring-2 ring-red-200'
        : 'border-gray-300 hover:border-gray-400'
    } ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      
      {/* Input Handle */}
      {type !== 'Start' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-gray-400 border-2 border-white"
        />
      )}
      
      {/* Node Header */}
      <div className={`px-4 py-3 rounded-t-lg bg-gradient-to-r ${config.color}`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <span className="font-semibold text-sm">{data.label || type}</span>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-1">
            {hasErrors && (
              <div className="bg-red-500 rounded-full p-1" title="Validation errors">
                <AlertTriangle size={12} className="text-white" />
              </div>
            )}
            {metrics && (
              <div className="bg-green-500 rounded-full px-2 py-1 text-xs font-mono">
                {metrics.p95}ms
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Node Content */}
      <div className={`px-4 py-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <NodeContent type={type} data={data} isDarkMode={isDarkMode} />
        
        {/* Validation Errors */}
        {hasErrors && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
            <div className="font-medium text-red-700 mb-1">Validation Errors:</div>
            {validationErrors.map((error, idx) => (
              <div key={idx} className="text-red-600">• {error.message}</div>
            ))}
          </div>
        )}
      </div>
      
      {/* Output Handles */}
      {type !== 'End' && (
        <>
          {/* Default output */}
          <Handle
            type="source"
            position={Position.Right}
            className="w-3 h-3 !bg-blue-500 border-2 border-white"
          />
          
          {/* Conditional outputs for branching nodes */}
          {(type === 'Collect' || type === 'Branch' || type === 'LLM') && (
            <>
              <Handle
                type="source"
                position={Position.Bottom}
                id="success"
                className="w-3 h-3 !bg-green-500 border-2 border-white"
                style={{ left: '25%' }}
              />
              <Handle
                type="source" 
                position={Position.Bottom}
                id="error"
                className="w-3 h-3 !bg-red-500 border-2 border-white"
                style={{ left: '75%' }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

// Content renderer for different node types
const NodeContent = ({ type, data, isDarkMode }) => {
  switch (type) {
    case 'Start':
      return (
        <div className="text-sm">
          <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {data.description || 'Entry point for all conversations'}
          </div>
        </div>
      );
      
    case 'Say':
      return (
        <div className="text-sm space-y-2">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Text to Speak:
          </div>
          <div className={`p-2 rounded text-xs font-mono ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {data.text?.substring(0, 100) || 'No text configured'}
            {data.text?.length > 100 && '...'}
          </div>
          <div className="flex gap-4 text-xs">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Voice: {data.voice || 'june'}
            </span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Speed: {data.speed || 1.0}x
            </span>
          </div>
        </div>
      );
      
    case 'Collect':
      return (
        <div className="text-sm space-y-2">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Collect Input:
          </div>
          <div className="flex gap-2 text-xs">
            <span className={`px-2 py-1 rounded ${
              isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
            }`}>
              {data.mode || 'speech'}
            </span>
            {data.grammar && (
              <span className={`px-2 py-1 rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {data.grammar.length} options
              </span>
            )}
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                {data.timeoutMs || 4000}ms
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={12} />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                {data.interruptMs || 120}ms
              </span>
            </div>
          </div>
        </div>
      );
      
    case 'Branch':
      return (
        <div className="text-sm space-y-2">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Condition:
          </div>
          <div className={`p-2 rounded text-xs font-mono ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {data.condition || 'No condition set'}
          </div>
        </div>
      );
      
    case 'LLM':
      return (
        <div className="text-sm space-y-2">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Model: {data.model || 'gpt-4'}
          </div>
          <div className={`p-2 rounded text-xs ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {data.systemPrompt?.substring(0, 80) || 'No system prompt'}
            {data.systemPrompt?.length > 80 && '...'}
          </div>
          <div className="flex gap-4 text-xs">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Temp: {data.temperature || 0.7}
            </span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Max: {data.maxTokens || 150}
            </span>
          </div>
        </div>
      );
      
    case 'API':
      return (
        <div className="text-sm space-y-2">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {data.method || 'POST'} Request
          </div>
          <div className={`p-2 rounded text-xs font-mono ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {data.url || 'No URL configured'}
          </div>
          <div className="text-xs">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Timeout: {data.timeoutMs || 3000}ms
            </span>
          </div>
        </div>
      );
      
    case 'Handoff':
      return (
        <div className="text-sm space-y-2">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Transfer to: {data.number || 'No number'}
          </div>
          {data.department && (
            <div className={`inline-block px-2 py-1 rounded text-xs ${
              isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
            }`}>
              {data.department}
            </div>
          )}
          <div className="text-xs">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Priority: {data.priority || 'medium'}
            </span>
          </div>
        </div>
      );
      
    case 'End':
      return (
        <div className="text-sm space-y-2">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Disposition: 
          </div>
          <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            data.disposition === 'booked' ? 'bg-green-100 text-green-800' :
            data.disposition === 'qualified' ? 'bg-blue-100 text-blue-800' :
            data.disposition === 'not_interested' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {data.disposition || 'not_interested'}
          </div>
          {data.message && (
            <div className={`p-2 rounded text-xs ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              {data.message.substring(0, 60)}
              {data.message.length > 60 && '...'}
            </div>
          )}
        </div>
      );
      
    default:
      return (
        <div className="text-sm text-gray-500">
          Unknown node type: {type}
        </div>
      );
  }
};

// Individual node components (memoized for performance)
export const StartNode = memo((props) => <BaseNode {...props} />);
export const SayNode = memo((props) => <BaseNode {...props} />);
export const CollectNode = memo((props) => <BaseNode {...props} />);
export const BranchNode = memo((props) => <BaseNode {...props} />);
export const LLMNode = memo((props) => <BaseNode {...props} />);
export const APINode = memo((props) => <BaseNode {...props} />);
export const HandoffNode = memo((props) => <BaseNode {...props} />);
export const EndNode = memo((props) => <BaseNode {...props} />);

// Node type registry for React Flow
export const nodeTypes = {
  Start: StartNode,
  Say: SayNode,
  Collect: CollectNode,
  Branch: BranchNode,
  LLM: LLMNode,
  API: APINode,
  Handoff: HandoffNode,
  End: EndNode
};

export default nodeTypes;
