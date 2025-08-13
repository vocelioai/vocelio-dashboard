import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Phone, Settings, Users, Clock, CheckCircle } from 'lucide-react';

const NotificationService = () => {
  const [templates] = useState([
    { name: 'Welcome Email', type: 'email', status: 'active', sent: 1247 },
    { name: 'Call Summary SMS', type: 'sms', status: 'active', sent: 856 },
    { name: 'Campaign Alert', type: 'push', status: 'draft', sent: 0 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-xl">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notification Service</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">📨 Multi-channel notifications • Templates • Automation</p>
              </div>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl">New Template</button>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-orange-100 text-sm">Templates</p><p className="text-2xl font-bold">24</p></div>
                <Mail className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-blue-100 text-sm">Sent Today</p><p className="text-2xl font-bold">1,247</p></div>
                <MessageSquare className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-green-100 text-sm">Delivery Rate</p><p className="text-2xl font-bold">98.5%</p></div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-purple-100 text-sm">Channels</p><p className="text-2xl font-bold">6</p></div>
                <Phone className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Templates</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {templates.map((template, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-orange-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{template.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-md">
                        {template.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-sm rounded-md ${
                        template.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{template.sent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationService;
