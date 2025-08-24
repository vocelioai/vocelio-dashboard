import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Volume2, Settings, Play } from 'lucide-react';

const VoiceNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(data);

  const handleDataChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    // Update parent component data
    if (data.onChange) {
      data.onChange(id, newData);
    }
  };

  const voices = [
    { value: 'alice', label: 'Alice (Female)' },
    { value: 'bob', label: 'Bob (Male)' },
    { value: 'charlie', label: 'Charlie (Male)' },
    { value: 'diana', label: 'Diana (Female)' }
  ];

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' }
  ];

  return (
    <div className={`bg-white border-2 rounded-lg shadow-lg min-w-64 ${
      selected ? 'border-blue-500' : 'border-blue-300'
    }`}>
      
      {/* Node Header */}
      <div className="bg-blue-500 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4" />
          <span className="font-medium">{localData.label || 'Voice Node'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-blue-600 rounded"
            title="Edit Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              // Preview voice message
              console.log(`Preview: "${localData.message}" in ${localData.voice} voice`);
            }}
            className="p-1 hover:bg-blue-600 rounded"
            title="Preview Voice"
          >
            <Play className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-4">
        <div className="space-y-3">
          
          {/* Message Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            {isEditing ? (
              <textarea
                value={localData.message || ''}
                onChange={(e) => handleDataChange('message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter the message to speak..."
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-800 min-h-16">
                {localData.message || 'Enter a message...'}
              </div>
            )}
          </div>

          {isEditing && (
            <>
              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice
                </label>
                <select
                  value={localData.voice || 'alice'}
                  onChange={(e) => handleDataChange('voice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {voices.map(voice => (
                    <option key={voice.value} value={voice.value}>
                      {voice.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={localData.language || 'en-US'}
                  onChange={(e) => handleDataChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Speed and Pitch */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speed
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={localData.speed || 1}
                    onChange={(e) => handleDataChange('speed', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {localData.speed || 1}x
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pitch
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={localData.pitch || 1}
                    onChange={(e) => handleDataChange('pitch', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {localData.pitch || 1}x
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ top: -6 }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ bottom: -6 }}
      />
    </div>
  );
};

export default memo(VoiceNode);
