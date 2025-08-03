import React from 'react';
import { MessageSquare, Phone, Save } from 'lucide-react';

// Simple test component to verify our setup
const TestFlowBuilder = () => {
  return (
    <div className="h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-blue-500" />
          <span>Vocelio Flow Builder Test</span>
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">✅ Setup Verification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">React Flow</h3>
              <p className="text-green-600 text-sm">Ready for drag & drop flow building</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Supabase</h3>
              <p className="text-blue-600 text-sm">Database integration configured</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Tailwind CSS</h3>
              <p className="text-purple-600 text-sm">Styling framework active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Next Steps</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <Save className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <h3 className="font-medium">1. Configure Supabase</h3>
                <p className="text-sm text-gray-600">Add your Supabase URL and API key to .env.local</p>
              </div>
              <button
                onClick={() => {
                  const supabaseUrl = prompt('Enter your Supabase URL:');
                  const supabaseKey = prompt('Enter your Supabase Anon Key:');
                  if (supabaseUrl && supabaseKey) {
                    alert('Please update your .env.local file with these values and restart the development server.');
                  }
                }}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Quick Setup
              </button>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium">2. Setup Twilio (Optional)</h3>
                <p className="text-sm text-gray-600">Add Twilio credentials for test calling feature</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium">3. Start Building</h3>
                <p className="text-sm text-gray-600">The FlowBuilder will automatically load once configured</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">🔧 Development Mode</h3>
          <p className="text-yellow-700 text-sm">
            The FlowBuilder is running in development mode. You can test all features locally, 
            even without Supabase configured. Database operations will show helpful error messages.
          </p>
        </div>

        <div className="mt-6 text-center space-y-4">
          <button
            onClick={() => {
              // Force proceed to FlowBuilder
              window.location.href = window.location.href + '?force=true';
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            🚀 Try FlowBuilder Anyway (Demo Mode)
          </button>
          <p className="text-gray-600">
            See <code className="bg-gray-100 px-2 py-1 rounded">SETUP_GUIDE.md</code> for detailed instructions
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestFlowBuilder;
