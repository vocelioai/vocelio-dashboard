import React, { useState } from 'react';
import { Database, Server, Cpu, HardDrive, Network, Monitor, Activity, BarChart3 } from 'lucide-react';

const DataWarehouse = () => {
  const [databases] = useState([
    { name: 'Voice Interactions DB', size: '2.3 TB', status: 'healthy', connections: 45 },
    { name: 'Campaign Analytics DB', size: '890 GB', status: 'healthy', connections: 23 },
    { name: 'User Data Warehouse', size: '1.7 TB', status: 'warning', connections: 67 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-500 rounded-xl">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Warehouse</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">🗄️ Enterprise data storage • Analytics engine • Query optimization</p>
              </div>
            </div>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl">New Query</button>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-gray-100 text-sm">Total Storage</p><p className="text-2xl font-bold">5.2 TB</p></div>
                <HardDrive className="w-8 h-8 text-gray-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-blue-100 text-sm">Active Queries</p><p className="text-2xl font-bold">127</p></div>
                <Activity className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-green-100 text-sm">Databases</p><p className="text-2xl font-bold">12</p></div>
                <Database className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-purple-100 text-sm">Performance</p><p className="text-2xl font-bold">98%</p></div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {databases.map((db, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-8 h-8 text-gray-500" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{db.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{db.size}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`text-sm ${db.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {db.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Connections:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{db.connections}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataWarehouse;
