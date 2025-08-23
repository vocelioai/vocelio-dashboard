/**
 * Simplified Phase 3 Integration Component
 * Lightweight version for better performance
 */

import React, { useState } from 'react';
import { Shield, Activity, Headphones, Gauge, Users, Settings } from 'lucide-react';

const Phase3FlowBuilderEnhancementsLite = ({ flowId, userId, userInfo, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('compliance');

  const tabs = [
    { id: 'compliance', name: 'Compliance', icon: Shield },
    { id: 'collaboration', name: 'Collaboration', icon: Users },
    { id: 'voice', name: 'Voice', icon: Headphones },
    { id: 'performance', name: 'Performance', icon: Activity }
  ];

  return (
    <div className="phase3-enhancements-lite">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'compliance' && (
          <ComplianceTab onUpdate={onUpdate} />
        )}
        {activeTab === 'collaboration' && (
          <CollaborationTab onUpdate={onUpdate} />
        )}
        {activeTab === 'voice' && (
          <VoiceTab onUpdate={onUpdate} />
        )}
        {activeTab === 'performance' && (
          <PerformanceTab onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
};

// Compliance Tab Component
const ComplianceTab = ({ onUpdate }) => {
  const [complianceScore] = useState(92);
  const [violations] = useState(['DNC_CHECK_PENDING']);
  const [recommendations] = useState([
    'Update consent records for 3 contacts',
    'Review calling schedule for PST timezone'
  ]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Compliance Overview</h4>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{complianceScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Passed Checks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{violations.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Violations</div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
            <h5 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Recommendations:</h5>
            {recommendations.map((rec, index) => (
              <div key={index} className="text-sm mb-1 text-yellow-700 dark:text-yellow-300">
                • {rec}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onUpdate({ type: 'compliance_check', action: 'run_full_check' })}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        >
          Run Full Check
        </button>
        <button
          onClick={() => onUpdate({ type: 'compliance_check', action: 'generate_report' })}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

// Collaboration Tab Component
const CollaborationTab = ({ onUpdate }) => {
  const [isConnected] = useState(false);
  const [collaborators] = useState([]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Real-time Collaboration</h4>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <button
            onClick={() => onUpdate({ type: 'collaboration', action: isConnected ? 'disconnect' : 'connect' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isConnected
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Active Collaborators: {collaborators.length}
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdate({ type: 'collaboration', action: 'invite_user' })}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
            >
              Invite User
            </button>
            <button
              onClick={() => onUpdate({ type: 'collaboration', action: 'share_flow' })}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
            >
              Share Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Voice Tab Component
const VoiceTab = ({ onUpdate }) => {
  const [voiceSettings, setVoiceSettings] = useState({
    persona: 'professional',
    emotion: 'neutral',
    quality: 'high'
  });

  const updateVoiceSettings = (newSettings) => {
    const updated = { ...voiceSettings, ...newSettings };
    setVoiceSettings(updated);
    onUpdate({ type: 'voice_settings', data: updated });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Voice Grade Controls</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Voice Persona
            </label>
            <select
              value={voiceSettings.persona}
              onChange={(e) => updateVoiceSettings({ persona: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="authoritative">Authoritative</option>
              <option value="energetic">Energetic</option>
              <option value="calm">Calm</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Emotion
            </label>
            <select
              value={voiceSettings.emotion}
              onChange={(e) => updateVoiceSettings({ emotion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="neutral">Neutral</option>
              <option value="happy">Happy</option>
              <option value="confident">Confident</option>
              <option value="concerned">Concerned</option>
              <option value="excited">Excited</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Audio Quality
            </label>
            <select
              value={voiceSettings.quality}
              onChange={(e) => updateVoiceSettings({ quality: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="high">High (HD)</option>
              <option value="standard">Standard</option>
              <option value="optimized">Optimized</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onUpdate({ type: 'voice', action: 'test_voice', data: voiceSettings })}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
          >
            Test Voice
          </button>
          <button
            onClick={() => onUpdate({ type: 'voice', action: 'apply_to_all', data: voiceSettings })}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
          >
            Apply to All
          </button>
        </div>
      </div>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab = ({ onUpdate }) => {
  const [metrics] = useState({
    memory: 65,
    fps: 58,
    loadTime: 1200,
    cacheHitRate: 87
  });

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Performance Dashboard</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <h5 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Memory Usage</h5>
            <div className="text-2xl font-bold text-blue-600">{metrics.memory}%</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <h5 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Average FPS</h5>
            <div className="text-2xl font-bold text-green-600">{metrics.fps}</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <h5 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Load Time</h5>
            <div className="text-2xl font-bold text-purple-600">{metrics.loadTime}ms</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <h5 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Cache Hit Rate</h5>
            <div className="text-2xl font-bold text-orange-600">{metrics.cacheHitRate}%</div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onUpdate({ type: 'performance', action: 'optimize' })}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Optimize
          </button>
          <button
            onClick={() => onUpdate({ type: 'performance', action: 'clear_cache' })}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
};

export default Phase3FlowBuilderEnhancementsLite;
