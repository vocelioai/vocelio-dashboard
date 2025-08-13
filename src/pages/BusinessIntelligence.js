import React, { useState } from 'react';
import { Lightbulb, Brain, Target, TrendingUp, Award, Eye, BarChart3, Users } from 'lucide-react';

const BusinessIntelligence = () => {
  const [insights] = useState([
    { title: 'Voice Quality Optimization', impact: 'High', description: 'Improve voice synthesis for 15% better engagement' },
    { title: 'Peak Hours Analysis', impact: 'Medium', description: 'Schedule campaigns during 2-4 PM for 23% higher response' },
    { title: 'Lead Scoring Enhancement', impact: 'High', description: 'Update scoring algorithm to increase conversion by 18%' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500 rounded-xl">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Intelligence</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">💡 AI insights • Predictive analytics • Strategic recommendations</p>
              </div>
            </div>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl">Generate Report</button>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-yellow-100 text-sm">AI Insights</p><p className="text-2xl font-bold">47</p></div>
                <Brain className="w-8 h-8 text-yellow-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-blue-100 text-sm">Predictions</p><p className="text-2xl font-bold">23</p></div>
                <Target className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-green-100 text-sm">Opportunities</p><p className="text-2xl font-bold">$145K</p></div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-purple-100 text-sm">ROI Boost</p><p className="text-2xl font-bold">+32%</p></div>
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI-Generated Insights</h3>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      insight.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {insight.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trends</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                  <span className="text-green-600 font-medium">+15.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                  <span className="text-green-600 font-medium">+8.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className="text-green-600 font-medium">-23.5%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">Increase voice agent training frequency</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-300">Expand successful campaign strategies</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">Optimize resource allocation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligence;
