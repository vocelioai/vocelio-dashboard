import React, { useState } from 'react';
import { Building, Users, CreditCard, TrendingUp, Globe, Shield, Award, Target } from 'lucide-react';

const EnterprisePortal = () => {
  const [accounts] = useState([
    { name: 'TechCorp Solutions', plan: 'Enterprise', users: 245, spend: '$12,450', growth: '+15%' },
    { name: 'Global Industries', plan: 'Business', users: 89, spend: '$5,670', growth: '+8%' },
    { name: 'StartupXYZ', plan: 'Pro', users: 12, spend: '$890', growth: '+25%' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Enterprise Portal</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">🏢 Multi-tenant management • Enterprise features • Admin controls</p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl">Add Account</button>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-blue-100 text-sm">Enterprise Accounts</p><p className="text-2xl font-bold">47</p></div>
                <Building className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-green-100 text-sm">Total Users</p><p className="text-2xl font-bold">12,450</p></div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-purple-100 text-sm">Revenue</p><p className="text-2xl font-bold">$245K</p></div>
                <CreditCard className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-orange-100 text-sm">Growth</p><p className="text-2xl font-bold">+18%</p></div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enterprise Accounts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Spend</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {accounts.map((account, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Building className="w-8 h-8 text-blue-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{account.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-md">
                        {account.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{account.users}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{account.spend}</td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 dark:text-green-400 font-medium">{account.growth}</span>
                    </td>
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

export default EnterprisePortal;
