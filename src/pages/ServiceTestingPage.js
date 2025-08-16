import React, { useState, useEffect } from 'react';
import { 
  Play, Database, Zap, RefreshCw, CheckCircle, 
  BarChart3, Users, Phone, Brain, Activity,
  Download, Upload, Settings, Eye
} from 'lucide-react';
import ServiceTester from '../components/ServiceTester';
import DataPopulationService from '../services/dataPopulationService';

const ServiceTestingPage = ({ darkMode = false }) => {
  const [activeTab, setActiveTab] = useState('testing');
  const [populationStatus, setPopulationStatus] = useState('idle');
  const [populatedData, setPopulatedData] = useState(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(null);

  const dataService = new DataPopulationService();

  // Handle data population
  const handlePopulateData = async () => {
    setPopulationStatus('running');
    
    try {
      const data = await dataService.populateAllData();
      setPopulatedData(data);
      setPopulationStatus('success');
      
      // Show success notification
      console.log('✅ Dashboard data populated successfully:', data);
    } catch (error) {
      console.error('❌ Data population failed:', error);
      setPopulationStatus('error');
    }
  };

  // Toggle real-time updates
  const toggleRealTimeUpdates = () => {
    if (realTimeUpdates) {
      if (updateInterval) {
        clearInterval(updateInterval);
        setUpdateInterval(null);
      }
      setRealTimeUpdates(false);
    } else {
      const interval = dataService.simulateRealTimeUpdates((data) => {
        setPopulatedData(data);
        console.log('🔄 Real-time data update:', new Date().toLocaleTimeString());
      });
      setUpdateInterval(interval);
      setRealTimeUpdates(true);
    }
  };

  // Load existing data on mount
  useEffect(() => {
    const existingData = dataService.getPopulatedData();
    if (existingData) {
      setPopulatedData(existingData);
      setPopulationStatus('success');
    }
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [updateInterval]);

  // Get data summary stats
  const getDataSummary = () => {
    if (!populatedData) return null;
    
    return {
      agents: populatedData.agents?.length || 0,
      campaigns: populatedData.campaigns?.length || 0,
      activeCalls: populatedData.callCenter?.activeCalls?.length || 0,
      phoneNumbers: populatedData.phoneNumbers?.ownedNumbers?.length || 0,
      voices: populatedData.voiceLab?.availableVoices?.length || 0,
      totalRevenue: populatedData.analytics?.overview?.totalRevenue || 0
    };
  };

  const dataSummary = getDataSummary();

  const tabs = [
    { id: 'testing', name: 'Service Testing', icon: Activity },
    { id: 'population', name: 'Data Population', icon: Database },
    { id: 'overview', name: 'Data Overview', icon: BarChart3 }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Service Testing & Data Population</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Test all Vocelio.ai services and populate dashboard with live data
              </p>
            </div>
            
            {realTimeUpdates && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Real-time Updates Active
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8 mt-4">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Service Testing Tab */}
        {activeTab === 'testing' && (
          <ServiceTester darkMode={darkMode} />
        )}

        {/* Data Population Tab */}
        {activeTab === 'population' && (
          <div className="space-y-8">
            {/* Population Controls */}
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Data Population Controls</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Generate and populate realistic test data for all dashboard services
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={toggleRealTimeUpdates}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                      realTimeUpdates
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {realTimeUpdates ? <RefreshCw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {realTimeUpdates ? 'Stop Updates' : 'Start Real-time Updates'}
                  </button>
                  
                  <button
                    onClick={handlePopulateData}
                    disabled={populationStatus === 'running'}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                      populationStatus === 'running'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {populationStatus === 'running' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Database className="w-4 h-4" />
                    )}
                    {populationStatus === 'running' ? 'Populating...' : 'Populate Data'}
                  </button>
                </div>
              </div>

              {/* Status */}
              {populationStatus !== 'idle' && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  populationStatus === 'success' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : populationStatus === 'error'
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                }`}>
                  {populationStatus === 'success' && <CheckCircle className="w-5 h-5" />}
                  {populationStatus === 'running' && <RefreshCw className="w-5 h-5 animate-spin" />}
                  {populationStatus === 'error' && <Zap className="w-5 h-5" />}
                  
                  <span className="font-medium">
                    {populationStatus === 'success' && 'Data populated successfully!'}
                    {populationStatus === 'running' && 'Generating realistic test data...'}
                    {populationStatus === 'error' && 'Failed to populate data. Check console for details.'}
                  </span>
                </div>
              )}
            </div>

            {/* Population Summary */}
            {dataSummary && (
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Agents</span>
                  </div>
                  <div className="text-2xl font-bold">{dataSummary.agents}</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">Campaigns</span>
                  </div>
                  <div className="text-2xl font-bold">{dataSummary.campaigns}</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Active Calls</span>
                  </div>
                  <div className="text-2xl font-bold">{dataSummary.activeCalls}</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Phone Numbers</span>
                  </div>
                  <div className="text-2xl font-bold">{dataSummary.phoneNumbers}</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-pink-500" />
                    <span className="font-medium">Voices</span>
                  </div>
                  <div className="text-2xl font-bold">{dataSummary.voices}</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Revenue</span>
                  </div>
                  <div className="text-2xl font-bold">${dataSummary.totalRevenue?.toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Overview Tab */}
        {activeTab === 'overview' && populatedData && (
          <div className="space-y-6">
            {/* Data Export */}
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Data Export & Management</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(populatedData, null, 2);
                      const dataBlob = new Blob([dataStr], {type: 'application/json'});
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'vocelio-dashboard-data.json';
                      link.click();
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                  
                  <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Raw Data
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                Generated at: {new Date(populatedData.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Data Structure Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(populatedData).map(([key, value]) => {
                if (key === 'timestamp') return null;
                
                return (
                  <div key={key} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="font-bold text-lg mb-3 capitalize">{key}</h3>
                    <div className="text-sm space-y-2">
                      {typeof value === 'object' && value !== null ? (
                        Object.entries(value).map(([subKey, subValue]) => (
                          <div key={subKey} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{subKey}:</span>
                            <span className="font-medium">
                              {Array.isArray(subValue) 
                                ? `${subValue.length} items` 
                                : typeof subValue === 'object' && subValue !== null
                                ? `${Object.keys(subValue).length} properties`
                                : String(subValue).substring(0, 50) + (String(subValue).length > 50 ? '...' : '')
                              }
                            </span>
                          </div>
                        ))
                      ) : (
                        <div>No data structure available</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceTestingPage;
