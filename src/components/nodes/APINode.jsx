import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Link, Settings, Shield, Database, Globe } from 'lucide-react';

const APINode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(data);

  const handleDataChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    if (data.onChange) {
      data.onChange(id, newData);
    }
  };

  const handleHeaderChange = (index, field, value) => {
    const headers = { ...(localData.headers || {}) };
    if (field === 'key') {
      // Handle key change - need to update object key
      const oldKey = Object.keys(headers)[index];
      const newHeaders = {};
      Object.keys(headers).forEach((key, i) => {
        if (i === index) {
          newHeaders[value] = headers[key];
        } else {
          newHeaders[key] = headers[key];
        }
      });
      handleDataChange('headers', newHeaders);
    } else {
      // Handle value change
      const keys = Object.keys(headers);
      headers[keys[index]] = value;
      handleDataChange('headers', headers);
    }
  };

  const addHeader = () => {
    const headers = { ...(localData.headers || {}) };
    headers[`header${Object.keys(headers).length + 1}`] = '';
    handleDataChange('headers', headers);
  };

  const removeHeader = (key) => {
    const headers = { ...(localData.headers || {}) };
    delete headers[key];
    handleDataChange('headers', headers);
  };

  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  const authTypes = [
    { value: 'none', label: 'No Authentication' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'api_key', label: 'API Key' },
    { value: 'oauth', label: 'OAuth 2.0' }
  ];

  const renderAuthSettings = () => {
    switch (localData.authType) {
      case 'bearer':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bearer Token
            </label>
            <input
              type="password"
              value={localData.bearerToken || ''}
              onChange={(e) => handleDataChange('bearerToken', e.target.value)}
              placeholder="Enter bearer token"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        );

      case 'basic':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={localData.username || ''}
                onChange={(e) => handleDataChange('username', e.target.value)}
                placeholder="Username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={localData.password || ''}
                onChange={(e) => handleDataChange('password', e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'api_key':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key Name
              </label>
              <input
                type="text"
                value={localData.apiKeyName || ''}
                onChange={(e) => handleDataChange('apiKeyName', e.target.value)}
                placeholder="e.g., X-API-Key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key Value
              </label>
              <input
                type="password"
                value={localData.apiKeyValue || ''}
                onChange={(e) => handleDataChange('apiKeyValue', e.target.value)}
                placeholder="API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'oauth':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OAuth Token
            </label>
            <input
              type="password"
              value={localData.oauthToken || ''}
              onChange={(e) => handleDataChange('oauthToken', e.target.value)}
              placeholder="OAuth 2.0 token"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border-2 rounded-lg shadow-lg min-w-64 ${
      selected ? 'border-purple-500' : 'border-purple-300'
    }`}>
      
      {/* Node Header */}
      <div className="bg-purple-500 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link className="w-4 h-4" />
          <span className="font-medium">{localData.label || 'API Node'}</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 hover:bg-purple-600 rounded"
          title="Edit Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Node Content */}
      <div className="p-4">
        <div className="space-y-3">
          
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API URL
            </label>
            {isEditing ? (
              <input
                type="url"
                value={localData.url || ''}
                onChange={(e) => handleDataChange('url', e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-800 font-mono truncate">
                {localData.url || 'No URL configured'}
              </div>
            )}
          </div>

          {isEditing && (
            <>
              {/* HTTP Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HTTP Method
                </label>
                <select
                  value={localData.method || 'GET'}
                  onChange={(e) => handleDataChange('method', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {httpMethods.map(method => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {/* Authentication */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Authentication
                </label>
                <select
                  value={localData.authType || 'none'}
                  onChange={(e) => handleDataChange('authType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
                >
                  {authTypes.map(auth => (
                    <option key={auth.value} value={auth.value}>
                      {auth.label}
                    </option>
                  ))}
                </select>
                {renderAuthSettings()}
              </div>

              {/* Headers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Headers
                  </label>
                  <button
                    onClick={addHeader}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    + Add Header
                  </button>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {Object.entries(localData.headers || {}).map(([key, value], index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 items-center">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                        placeholder="Header name"
                        className="col-span-2 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                        placeholder="Header value"
                        className="col-span-2 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeHeader(key)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Body (for POST/PUT/PATCH) */}
              {(localData.method === 'POST' || localData.method === 'PUT' || localData.method === 'PATCH') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Request Body (JSON)
                  </label>
                  <textarea
                    value={localData.requestBody || ''}
                    onChange={(e) => handleDataChange('requestBody', e.target.value)}
                    placeholder='{"key": "value", "data": "{{variable}}"}'
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-xs"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Use {"{{variableName}}"} to include variables
                  </div>
                </div>
              )}

              {/* Response Handling */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Database className="w-4 h-4 inline mr-1" />
                  Store Response As
                </label>
                <input
                  type="text"
                  value={localData.responseVariable || ''}
                  onChange={(e) => handleDataChange('responseVariable', e.target.value)}
                  placeholder="e.g., apiResponse, userData"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Variable name to store the API response
                </div>
              </div>

              {/* Timeout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={localData.timeout || 30}
                  onChange={(e) => handleDataChange('timeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* Summary when not editing */}
          {!isEditing && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  localData.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                  localData.method === 'POST' ? 'bg-green-100 text-green-700' :
                  localData.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                  localData.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {localData.method || 'GET'}
                </span>
                <span className="text-gray-600">
                  {localData.authType && localData.authType !== 'none' && (
                    <span className="text-green-600">🔒 Secured</span>
                  )}
                </span>
              </div>
              
              {localData.responseVariable && (
                <div className="text-gray-600">
                  → Store as: <span className="font-medium">{localData.responseVariable}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ top: -6 }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="success"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ bottom: -6, left: '30%' }}
        title="Success path"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="error"
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ bottom: -6, right: '30%' }}
        title="Error path"
      />
    </div>
  );
};

export default memo(APINode);
