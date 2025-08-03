import React, { useState } from 'react';
import FlowBuilder from '../components/FlowBuilder';
import TestFlowBuilder from '../components/TestFlowBuilder';
import { 
  BarChart3, Users, Settings, GitBranch
} from 'lucide-react';

const FlowBuilderPage = () => {
  const [activeTab, setActiveTab] = useState('builder');
  
  // Check if Supabase is configured
  const isSupabaseConfigured = 
    process.env.REACT_APP_SUPABASE_URL && 
    process.env.REACT_APP_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.REACT_APP_SUPABASE_ANON_KEY &&
    process.env.REACT_APP_SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here';
  
  // Check if user wants to force proceed
  const forceDemo = new URLSearchParams(window.location.search).get('force') === 'true';
  
  // Always show the actual FlowBuilder - it has its own error handling
  // if (!isSupabaseConfigured && !forceDemo && activeTab === 'builder') {
  //   return <TestFlowBuilder />;
  // }
  
  // Simple tab-based interface that can include both the new ReactFlow builder
  // and the existing advanced features
  
  if (activeTab === 'builder') {
    return <FlowBuilder />;
  }
  
  // Keep the existing advanced features as separate tabs or integrate them
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === 'builder' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Flow Builder</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === 'analytics' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeTab === 'collaboration' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Collaboration</span>
          </button>
        </div>
        
        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6" />
              <span>Analytics Dashboard</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">Total Calls</h3>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">1,247</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-300">Success Rate</h3>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">68%</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300">Avg Duration</h3>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">4:32</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Advanced analytics features coming soon...</p>
          </div>
        )}
        
        {activeTab === 'collaboration' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span>Team Collaboration</span>
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Active Collaborators</h3>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    JD
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                    AS
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                    MK
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• John Doe updated "Sales Qualification" node</p>
                  <p>• Alice Smith added new objection handling</p>
                  <p>• Mike Kim created new flow version</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Real-time collaboration features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowBuilderPage;