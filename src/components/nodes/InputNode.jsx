import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Mic, Keyboard, Settings } from 'lucide-react';

const InputNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(data);

  const handleDataChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    if (data.onChange) {
      data.onChange(id, newData);
    }
  };

  const inputTypes = [
    { value: 'speech', label: 'Speech Recognition', icon: Mic },
    { value: 'dtmf', label: 'DTMF (Keypad)', icon: Keyboard },
    { value: 'both', label: 'Speech + DTMF', icon: Mic }
  ];

  const getInputIcon = () => {
    const inputType = inputTypes.find(type => type.value === (localData.inputType || 'speech'));
    const IconComponent = inputType?.icon || Mic;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className={`bg-white border-2 rounded-lg shadow-lg min-w-64 ${
      selected ? 'border-green-500' : 'border-green-300'
    }`}>
      
      {/* Node Header */}
      <div className="bg-green-500 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getInputIcon()}
          <span className="font-medium">{localData.label || 'Input Node'}</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 hover:bg-green-600 rounded"
          title="Edit Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Node Content */}
      <div className="p-4">
        <div className="space-y-3">
          
          {/* Prompt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt
            </label>
            {isEditing ? (
              <textarea
                value={localData.prompt || ''}
                onChange={(e) => handleDataChange('prompt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={2}
                placeholder="Enter the prompt for user input..."
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-800 min-h-12">
                {localData.prompt || 'Enter a prompt...'}
              </div>
            )}
          </div>

          {isEditing && (
            <>
              {/* Input Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input Type
                </label>
                <select
                  value={localData.inputType || 'speech'}
                  onChange={(e) => handleDataChange('inputType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {inputTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localData.timeout ? localData.timeout / 1000 : 5}
                  onChange={(e) => handleDataChange('timeout', parseInt(e.target.value) * 1000)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-1">
                  How long to wait for user input
                </div>
              </div>

              {/* Max Attempts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={localData.maxAttempts || 3}
                  onChange={(e) => handleDataChange('maxAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Number of retry attempts
                </div>
              </div>

              {/* Variable Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Input As
                </label>
                <input
                  type="text"
                  value={localData.variableName || ''}
                  onChange={(e) => handleDataChange('variableName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., userResponse, customerChoice"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Variable name to store the input value
                </div>
              </div>

              {/* Validation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input Validation
                </label>
                <select
                  value={localData.validation || 'none'}
                  onChange={(e) => handleDataChange('validation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="none">No validation</option>
                  <option value="digits">Digits only</option>
                  <option value="letters">Letters only</option>
                  <option value="email">Email format</option>
                  <option value="phone">Phone number</option>
                  <option value="custom">Custom regex</option>
                </select>
              </div>

              {localData.validation === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Regex Pattern
                  </label>
                  <input
                    type="text"
                    value={localData.customRegex || ''}
                    onChange={(e) => handleDataChange('customRegex', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., ^[0-9]{4}$ for 4-digit code"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ top: -6 }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ bottom: -6 }}
      />

      {/* Timeout Handle (optional) */}
      <Handle
        type="source"
        position={Position.Right}
        id="timeout"
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
        style={{ right: -6, top: '60%' }}
        title="Timeout path"
      />
    </div>
  );
};

export default memo(InputNode);
