import React, { useState } from 'react';
import { Shield, Lock, Key, Users, Eye, AlertTriangle, CheckCircle, Settings, Plus, Search } from 'lucide-react';

const EnterpriseSecurityCenter = () => {
  const [securityAlerts] = useState([
    { id: 1, type: 'warning', message: 'Unusual login pattern detected', time: '5 min ago' },
    { id: 2, type: 'info', message: 'SSL certificate renewed', time: '2 hours ago' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Enterprise Security Center</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">🛡️ Advanced security • Threat monitoring • Compliance</p>
              </div>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl">Security Audit</button>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-red-100 text-sm">Security Score</p><p className="text-2xl font-bold">98/100</p></div>
                <Shield className="w-8 h-8 text-red-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-orange-100 text-sm">Active Threats</p><p className="text-2xl font-bold">2</p></div>
                <AlertTriangle className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-green-100 text-sm">Secured Endpoints</p><p className="text-2xl font-bold">47</p></div>
                <Lock className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-blue-100 text-sm">Compliance Score</p><p className="text-2xl font-bold">100%</p></div>
                <CheckCircle className="w-8 h-8 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Alerts</h3>
            <div className="space-y-3">
              {securityAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Control</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Role-Based Access</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">API Rate Limiting</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseSecurityCenter;
