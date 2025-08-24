import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch, Plus, Trash2, Settings } from 'lucide-react';

const ConditionNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(data);

  const handleDataChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    if (data.onChange) {
      data.onChange(id, newData);
    }
  };

  const handleConditionChange = (index, field, value) => {
    const conditions = [...(localData.conditions || [])];
    conditions[index] = { ...conditions[index], [field]: value };
    handleDataChange('conditions', conditions);
  };

  const addCondition = () => {
    const conditions = [...(localData.conditions || [])];
    conditions.push({ field: '', operator: 'equals', value: '' });
    handleDataChange('conditions', conditions);
  };

  const removeCondition = (index) => {
    const conditions = [...(localData.conditions || [])];
    conditions.splice(index, 1);
    handleDataChange('conditions', conditions);
  };

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' }
  ];

  const conditions = localData.conditions || [{ field: 'input', operator: 'equals', value: 'yes' }];

  return (
    <div className={`bg-white border-2 rounded-lg shadow-lg min-w-64 ${
      selected ? 'border-yellow-500' : 'border-yellow-300'
    }`}>
      
      {/* Node Header */}
      <div className="bg-yellow-500 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-4 h-4" />
          <span className="font-medium">{localData.label || 'Condition Node'}</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 hover:bg-yellow-600 rounded"
          title="Edit Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Node Content */}
      <div className="p-4">
        <div className="space-y-3">
          
          {/* Logic Operator */}
          {conditions.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logic
              </label>
              <select
                value={localData.logic || 'AND'}
                onChange={(e) => handleDataChange('logic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                disabled={!isEditing}
              >
                <option value="AND">AND (all conditions must be true)</option>
                <option value="OR">OR (any condition must be true)</option>
              </select>
            </div>
          )}

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Conditions
              </label>
              {isEditing && (
                <button
                  onClick={addCondition}
                  className="flex items-center space-x-1 text-xs text-yellow-600 hover:text-yellow-700"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {conditions.map((condition, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {/* Field */}
                        <input
                          type="text"
                          value={condition.field || ''}
                          onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                          placeholder="Field/Variable"
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                        />
                        
                        {/* Operator */}
                        <select
                          value={condition.operator || 'equals'}
                          onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                        >
                          {operators.map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                        
                        {/* Value */}
                        <input
                          type="text"
                          value={condition.value || ''}
                          onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                          placeholder="Value"
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                          disabled={condition.operator === 'is_empty' || condition.operator === 'is_not_empty'}
                        />
                      </div>
                      
                      {conditions.length > 1 && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => removeCondition(index)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Remove condition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">{condition.field || 'field'}</span>
                      {' '}
                      <span className="text-gray-500">
                        {operators.find(op => op.value === condition.operator)?.label || condition.operator}
                      </span>
                      {' '}
                      {condition.operator !== 'is_empty' && condition.operator !== 'is_not_empty' && (
                        <span className="font-medium">"{condition.value || 'value'}"</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {!isEditing && conditions.length > 1 && (
            <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded-md">
              <span className="font-medium">{localData.logic || 'AND'}</span> logic: 
              {localData.logic === 'AND' ? ' All conditions must be true' : ' Any condition must be true'}
            </div>
          )}
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
        style={{ top: -6 }}
      />
      
      {/* True Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ bottom: -6, left: '30%' }}
        title="True path"
      />

      {/* False Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ bottom: -6, right: '30%' }}
        title="False path"
      />
    </div>
  );
};

export default memo(ConditionNode);
