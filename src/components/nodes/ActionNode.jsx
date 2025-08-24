import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Zap, Phone, Mail, MessageSquare, Settings, Database } from 'lucide-react';

const ActionNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(data);

  const handleDataChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    if (data.onChange) {
      data.onChange(id, newData);
    }
  };

  const actionTypes = [
    { value: 'transfer', label: 'Transfer Call', icon: Phone, color: 'text-blue-600' },
    { value: 'hangup', label: 'Hang Up', icon: Phone, color: 'text-red-600' },
    { value: 'send_sms', label: 'Send SMS', icon: MessageSquare, color: 'text-green-600' },
    { value: 'send_email', label: 'Send Email', icon: Mail, color: 'text-purple-600' },
    { value: 'store_data', label: 'Store Data', icon: Database, color: 'text-orange-600' },
    { value: 'webhook', label: 'Webhook Call', icon: Zap, color: 'text-indigo-600' }
  ];

  const getActionIcon = () => {
    const actionType = actionTypes.find(type => type.value === (localData.actionType || 'transfer'));
    const IconComponent = actionType?.icon || Zap;
    const colorClass = actionType?.color || 'text-red-600';
    return <IconComponent className={`w-4 h-4 ${colorClass}`} />;
  };

  const getActionLabel = () => {
    const actionType = actionTypes.find(type => type.value === (localData.actionType || 'transfer'));
    return actionType?.label || 'Action';
  };

  const renderActionSettings = () => {
    switch (localData.actionType) {
      case 'transfer':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transfer To
              </label>
              <input
                type="text"
                value={localData.target || ''}
                onChange={(e) => handleDataChange('target', e.target.value)}
                placeholder="+1234567890 or agent@company.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transfer Type
              </label>
              <select
                value={localData.transferType || 'warm'}
                onChange={(e) => handleDataChange('transferType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="warm">Warm Transfer</option>
                <option value="cold">Cold Transfer</option>
                <option value="conference">Conference</option>
              </select>
            </div>
          </div>
        );

      case 'send_sms':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={localData.phoneNumber || ''}
                onChange={(e) => handleDataChange('phoneNumber', e.target.value)}
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={localData.message || ''}
                onChange={(e) => handleDataChange('message', e.target.value)}
                placeholder="SMS message content..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'send_email':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Email
              </label>
              <input
                type="email"
                value={localData.email || ''}
                onChange={(e) => handleDataChange('email', e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={localData.subject || ''}
                onChange={(e) => handleDataChange('subject', e.target.value)}
                placeholder="Email subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={localData.message || ''}
                onChange={(e) => handleDataChange('message', e.target.value)}
                placeholder="Email message content..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'store_data':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Key
              </label>
              <input
                type="text"
                value={localData.dataKey || ''}
                onChange={(e) => handleDataChange('dataKey', e.target.value)}
                placeholder="e.g., customerInfo, callSummary"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Value
              </label>
              <textarea
                value={localData.dataValue || ''}
                onChange={(e) => handleDataChange('dataValue', e.target.value)}
                placeholder="Data to store (use variables like {{customerName}})"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Location
              </label>
              <select
                value={localData.storageLocation || 'session'}
                onChange={(e) => handleDataChange('storageLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="session">Session Storage</option>
                <option value="database">Database</option>
                <option value="crm">CRM System</option>
              </select>
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="url"
                value={localData.webhookUrl || ''}
                onChange={(e) => handleDataChange('webhookUrl', e.target.value)}
                placeholder="https://api.example.com/webhook"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                value={localData.method || 'POST'}
                onChange={(e) => handleDataChange('method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payload (JSON)
              </label>
              <textarea
                value={localData.payload || ''}
                onChange={(e) => handleDataChange('payload', e.target.value)}
                placeholder='{"key": "value", "variable": "{{customerName}}"}'
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'hangup':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (Optional)
              </label>
              <select
                value={localData.reason || 'completed'}
                onChange={(e) => handleDataChange('reason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="completed">Call Completed</option>
                <option value="busy">Busy</option>
                <option value="no-answer">No Answer</option>
                <option value="failed">Failed</option>
                <option value="customer-request">Customer Request</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border-2 rounded-lg shadow-lg min-w-64 ${
      selected ? 'border-red-500' : 'border-red-300'
    }`}>
      
      {/* Node Header */}
      <div className="bg-red-500 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getActionIcon()}
          <span className="font-medium">{localData.label || getActionLabel()}</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 hover:bg-red-600 rounded"
          title="Edit Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Node Content */}
      <div className="p-4">
        <div className="space-y-3">
          
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Type
              </label>
              <select
                value={localData.actionType || 'transfer'}
                onChange={(e) => handleDataChange('actionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {actionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action-specific settings */}
          {isEditing ? (
            renderActionSettings()
          ) : (
            <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-800">
              <div className="font-medium mb-1">{getActionLabel()}</div>
              {localData.actionType === 'transfer' && localData.target && (
                <div>Transfer to: {localData.target}</div>
              )}
              {localData.actionType === 'send_sms' && localData.phoneNumber && (
                <div>SMS to: {localData.phoneNumber}</div>
              )}
              {localData.actionType === 'send_email' && localData.email && (
                <div>Email to: {localData.email}</div>
              )}
              {localData.actionType === 'store_data' && localData.dataKey && (
                <div>Store: {localData.dataKey}</div>
              )}
              {localData.actionType === 'webhook' && localData.webhookUrl && (
                <div>Webhook: {localData.webhookUrl}</div>
              )}
              {localData.actionType === 'hangup' && (
                <div>Reason: {localData.reason || 'completed'}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ top: -6 }}
      />
      
      {localData.actionType !== 'hangup' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-red-500 border-2 border-white"
          style={{ bottom: -6 }}
        />
      )}
    </div>
  );
};

export default memo(ActionNode);
