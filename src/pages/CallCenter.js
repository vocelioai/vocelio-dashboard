import React, { useState } from 'react';
import {
  Phone, Users, TrendingUp, Clock, Play, Pause, Square, SkipForward,
  Settings, MessageSquare, Brain, User, Star, PhoneCall, Headphones,
  Volume2, VolumeX, Mic, MicOff, Video, VideoOff, MoreVertical,
  Download, Upload, Filter, Search, Calendar, Target, BarChart3,
  PieChart, Activity, Zap, Shield, Globe, MapPin, Mail, FileText,
  CheckCircle, XCircle, AlertCircle, RefreshCw, ArrowUp, ArrowDown,
  Plus, Minus, Edit, Trash2, Copy, X, ChevronDown, ChevronUp,
  ThumbsUp, ThumbsDown, Flag, Tag, Bookmark, Share2, Eye, EyeOff,
  Lock, Unlock, Save, RotateCcw, FastForward, Rewind, Home, Building2,
  CreditCard, DollarSign, Percent, Timer, Signal, Wifi, WifiOff, Battery,
  BellRing, Bell, Smartphone, Tablet, Monitor, Printer, HardDrive,
  Database, Server, Cloud, CloudOff, Link, Unlink, QrCode, Scan,
  Navigation, Compass, Map, Route, Car, Truck, Plane, Ship, Train,
  Bus, Bike, Walk, Coffee, Utensils, ShoppingCart, Package, Box,
  Gift, Heart, Star as StarIcon, Award, Trophy, Medal, Crown, Diamond,
  Gem, Sparkles, Sun, Moon, CloudRain, Snowflake, Wind, Thermometer,
  Umbrella, Rainbow, Flower, Tree, Leaf, Sprout, Mountain, Waves
} from 'lucide-react';

const LiveCallCenter = () => {
  const [activeTab, setActiveTab] = useState('live-monitoring');
  const [selectedCall, setSelectedCall] = useState(null);

  // Mock data for demonstration
  const mockData = {
    activeCalls: [
      {
        id: 1,
        customerInfo: {
          name: 'John Smith',
          location: 'New York, NY',
          previousCalls: 2,
          leadSource: 'Website',
          interestLevel: 85
        },
        customerPhone: '+1 (555) 123-4567',
        agentName: 'Sarah Johnson',
        status: 'converting',
        duration: '05:23',
        startTime: '10:15 AM',
        transcript: [
          { speaker: 'agent', text: 'Hi John, thanks for your interest in our services. How can I help you today?', timestamp: '10:15 AM' },
          { speaker: 'customer', text: 'I\'m looking for a solution to help with my business communications.', timestamp: '10:16 AM' },
          { speaker: 'agent', text: 'That\'s great! Can you tell me more about your current setup?', timestamp: '10:17 AM' }
        ],
        aiInsights: {
          conversionProbability: 78,
          sentiment: 4.2,
          nextBestAction: 'Present pricing options and emphasize ROI benefits',
          objections: ['price_concern', 'timing']
        },
        isAgentTyping: false
      },
      {
        id: 2,
        customerInfo: {
          name: 'Maria Garcia',
          location: 'Los Angeles, CA',
          previousCalls: 0,
          leadSource: 'Google Ads',
          interestLevel: 65
        },
        customerPhone: '+1 (555) 987-6543',
        agentName: 'Mike Chen',
        status: 'qualifying',
        duration: '02:45',
        startTime: '10:35 AM',
        transcript: [
          { speaker: 'agent', text: 'Hello Maria, thank you for calling. What brings you to us today?', timestamp: '10:35 AM' },
          { speaker: 'customer', text: 'I saw your ad and wanted to learn more about your call center software.', timestamp: '10:36 AM' }
        ],
        aiInsights: {
          conversionProbability: 45,
          sentiment: 3.8,
          nextBestAction: 'Ask discovery questions about current pain points',
          objections: []
        },
        isAgentTyping: true
      }
    ],
    agents: [
      { id: 1, name: 'Sarah Johnson', status: 'on_call', callsToday: 12, conversions: 4 },
      { id: 2, name: 'Mike Chen', status: 'on_call', callsToday: 8, conversions: 2 },
      { id: 3, name: 'Lisa Rodriguez', status: 'available', callsToday: 15, conversions: 6 },
      { id: 4, name: 'David Kim', status: 'break', callsToday: 10, conversions: 3 }
    ]
  };

  const getStatusLabel = (status) => {
    const labels = {
      'converting': 'Converting',
      'qualifying': 'Qualifying',
      'objection_handling': 'Handling Objections',
      'closing': 'Closing',
      'completed': 'Completed'
    };
    return labels[status] || status;
  };

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'live-monitoring', name: 'Live Monitoring', icon: Activity },
          { id: 'auto-dialer', name: 'Auto Dialer', icon: Phone },
          { id: 'inbound-center', name: 'Inbound Center', icon: PhoneCall },
          { id: 'phone-system', name: 'Phone System', icon: Headphones },
          { id: 'lead-management', name: 'Lead Management', icon: Users },
          { id: 'ivr-builder', name: 'IVR Builder', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`mr-2 h-5 w-5 ${
                activeTab === tab.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );

  // Auto Dialer Component
  const AutoDialerComponent = () => {
    const [dialerMode, setDialerMode] = useState('predictive');
    const [isDialing, setIsDialing] = useState(false);
    
    return (
      <div className="space-y-6">
        {/* Dialer Control Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Auto Dialer Control</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dialing Mode
              </label>
              <select 
                value={dialerMode} 
                onChange={(e) => setDialerMode(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="predictive">Predictive Dialing</option>
                <option value="progressive">Progressive Dialing</option>
                <option value="preview">Preview Dialing</option>
                <option value="manual">Manual Dialing</option>
              </select>
            </div>

            {/* Campaign Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Active Campaign
              </label>
              <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>Summer Sales Blitz</option>
                <option>Q4 Lead Follow-up</option>
                <option>Cold Outreach - Tech</option>
                <option>Warm Leads - Healthcare</option>
              </select>
            </div>

            {/* Control Buttons */}
            <div className="flex items-end space-x-2">
              <button 
                onClick={() => setIsDialing(!isDialing)}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  isDialing 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isDialing ? (
                  <>
                    <Square className="w-4 h-4 inline mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 inline mr-2" />
                    Start
                  </>
                )}
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Calls/Hour</p>
                <p className="text-2xl font-bold text-blue-600">127</p>
              </div>
              <Phone className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connect Rate</p>
                <p className="text-2xl font-bold text-green-600">34.8%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drop Rate</p>
                <p className="text-2xl font-bold text-red-600">2.1%</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversions</p>
                <p className="text-2xl font-bold text-purple-600">18</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* DNC and Compliance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-500" />
            Compliance & DNC Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.7%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">DNC Compliance</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">847,392</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">DNC Records</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Last Updated</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Inbound Center Component
  const InboundCenterComponent = () => (
    <div className="space-y-6">
      {/* Queue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Calls in Queue</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Wait Time</p>
              <p className="text-2xl font-bold text-blue-600">1:43</p>
            </div>
            <Timer className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Agents</p>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Service Level</p>
              <p className="text-2xl font-bold text-purple-600">94.2%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Department Routing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Department Call Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium">Sales</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">5 calls</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium">Support</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">4 calls</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium">Billing</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">3 calls</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="font-medium">Average Handle Time</span>
              <span className="text-sm font-bold text-green-600">4:32</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="font-medium">First Call Resolution</span>
              <span className="text-sm font-bold text-blue-600">87%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="font-medium">Customer Satisfaction</span>
              <span className="text-sm font-bold text-purple-600">4.6★</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-3">Queue Actions</h4>
            <div className="space-y-2">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Force Next Call
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Broadcast Message
              </button>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Emergency Override
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Phone System Component
  const PhoneSystemComponent = () => (
    <div className="space-y-6">
      {/* Phone Numbers & Extensions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Phone Numbers & Extensions</h3>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
            <Plus className="w-4 h-4 inline mr-1" />
            Add Number
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2">Number</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Assigned To</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3">+1 (555) 123-4567</td>
                <td className="py-3">Main Line</td>
                <td className="py-3">Reception</td>
                <td className="py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3">+1 (555) 123-4568</td>
                <td className="py-3">Sales</td>
                <td className="py-3">Sales Team</td>
                <td className="py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status</p>
              <p className="text-lg font-bold text-green-600">All Systems Operational</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Lines</p>
              <p className="text-2xl font-bold text-blue-600">24/30</p>
            </div>
            <Signal className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Call Quality</p>
              <p className="text-2xl font-bold text-purple-600">98.7%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );

  // Lead Management Component
  const LeadManagementComponent = () => (
    <div className="space-y-6">
      {/* Lead Import/Export */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Lead Database Management</h3>
          <div className="space-x-2">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              <Upload className="w-4 h-4 inline mr-1" />
              Import Leads
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              <Download className="w-4 h-4 inline mr-1" />
              Export Data
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">12,847</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Leads</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">3,492</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Qualified</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">1,847</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">892</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Converted</div>
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium">Summer Sales Blitz</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">2,847 leads • 23.4% conversion rate</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">+$127K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium">Q4 Lead Follow-up</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">1,492 leads • 18.7% conversion rate</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">+$89K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // IVR Builder Component
  const IVRBuilderComponent = () => (
    <div className="space-y-6">
      {/* IVR Flow Builder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">IVR Flow Builder</h3>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
            <Plus className="w-4 h-4 inline mr-1" />
            New Flow
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Active IVR Flows</h4>
            <div className="space-y-3">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">Main Reception</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">English/Spanish • 5 options</p>
                  </div>
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-green-600 hover:text-green-800">Test</button>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">Sales Department</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">English only • 3 options</p>
                  </div>
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-green-600 hover:text-green-800">Test</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">IVR Analytics</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Option 1 (Sales)</span>
                  <span className="text-sm font-bold">42%</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Option 2 (Support)</span>
                  <span className="text-sm font-bold">31%</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Option 0 (Operator)</span>
                  <span className="text-sm font-bold">18%</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Hang-ups</span>
                  <span className="text-sm font-bold text-red-600">9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-language Support */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Multi-language Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-600">English</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Primary Language</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-600">Spanish</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Secondary Language</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Plus className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-600">Add Language</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Configure New</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <TabNavigation />

      {/* Render active tab content */}
      {activeTab === 'live-monitoring' && (
        <div className="space-y-8">
          {/* Live Command Center Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Live Call Monitoring</h2>
                  <p className="text-blue-100">Real-time oversight and assistance</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockData.activeCalls.length}</div>
                  <div className="text-sm text-blue-100">Active Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockData.agents.filter(a => a.status === 'on_call').length}</div>
                  <div className="text-sm text-blue-100">Agents Online</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Calls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockData.activeCalls.map((call) => (
              <div key={call.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        call.status === 'converting' ? 'bg-green-500' :
                        call.status === 'qualifying' ? 'bg-blue-500' :
                        call.status === 'objection_handling' ? 'bg-yellow-500' :
                        call.status === 'closing' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="font-medium">{call.customerInfo.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{call.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{call.agentName}</span>
                    <span className="capitalize">{call.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Score:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 40) + 60}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sentiment:</span>
                    <span className={`font-medium ${
                      Math.random() > 0.6 ? 'text-green-600' :
                      Math.random() > 0.3 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.random() > 0.6 ? 'Positive' : Math.random() > 0.3 ? 'Neutral' : 'Negative'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedCall(call)}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Listen In
                      </button>
                      <button className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Assist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-bold text-green-600">24.3%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Call Time</p>
                  <p className="text-2xl font-bold text-blue-600">8:32</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Queue Wait</p>
                  <p className="text-2xl font-bold text-orange-600">2:14</p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction</p>
                  <p className="text-2xl font-bold text-purple-600">4.7★</p>
                </div>
                <Star className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'auto-dialer' && <AutoDialerComponent />}
      {activeTab === 'inbound-center' && <InboundCenterComponent />}
      {activeTab === 'phone-system' && <PhoneSystemComponent />}
      {activeTab === 'lead-management' && <LeadManagementComponent />}
      {activeTab === 'ivr-builder' && <IVRBuilderComponent />}

      {/* Call Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                  selectedCall.status === 'converting' ? 'from-green-500 to-emerald-500' :
                  selectedCall.status === 'qualifying' ? 'from-blue-500 to-cyan-500' :
                  selectedCall.status === 'objection_handling' ? 'from-yellow-500 to-orange-500' :
                  selectedCall.status === 'closing' ? 'from-purple-500 to-pink-500' :
                  'from-gray-500 to-slate-500'
                } flex items-center justify-center`}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCall.customerInfo.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedCall.customerPhone} • {getStatusLabel(selectedCall.status)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                  End Call
                </button>
                <button onClick={() => setSelectedCall(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Call Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Real-time Transcript */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                      Live Conversation
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-64 overflow-y-auto p-4">
                      {selectedCall.transcript.map((message, index) => (
                        <div key={index} className={`mb-3 ${message.speaker === 'agent' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block max-w-xs p-3 rounded-lg ${
                            message.speaker === 'agent' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          }`}>
                            <div className="text-xs opacity-75 mb-1 font-medium">
                              {message.speaker === 'agent' ? 'Agent' : 'Customer'}
                            </div>
                            <p className="text-sm">{message.text}</p>
                            <div className="text-xs opacity-75 mt-1">{message.timestamp}</div>
                          </div>
                        </div>
                      ))}
                      {selectedCall.isAgentTyping && (
                        <div className="text-left">
                          <div className="inline-block bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Agent is typing...</div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-500" />
                      AI Insights & Recommendations
                    </h3>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-purple-500">{selectedCall.aiInsights.conversionProbability}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Probability</div>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-green-500">{selectedCall.aiInsights.sentiment.toFixed(1)}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Sentiment Score</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Next Best Action:</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{selectedCall.aiInsights.nextBestAction}</p>
                        </div>
                        {selectedCall.aiInsights.objections.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Detected Objections:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedCall.aiInsights.objections.map((objection, index) => (
                                <span key={index} className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                                  {objection.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-gray-500" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                        <p className="text-gray-900 dark:text-gray-100">{selectedCall.customerInfo.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                        <p className="text-gray-900 dark:text-gray-100">{selectedCall.customerPhone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                        <p className="text-gray-900 dark:text-gray-100">{selectedCall.customerInfo.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Previous Calls</label>
                        <p className="text-gray-900 dark:text-gray-100">{selectedCall.customerInfo.previousCalls}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Lead Source</label>
                        <p className="text-gray-900 dark:text-gray-100">{selectedCall.customerInfo.leadSource}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Interest Level</label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{width: `${selectedCall.customerInfo.interestLevel}%`}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{selectedCall.customerInfo.interestLevel}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call Actions */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-gray-500" />
                      Actions
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Join Call
                      </button>
                      <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Send Message
                      </button>
                      <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Transfer Call
                      </button>
                      <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        End Call
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Call Started:</span>
                        <span className="font-medium">{selectedCall.startTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium">{selectedCall.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className="font-medium capitalize">{getStatusLabel(selectedCall.status)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Recording:</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-500 font-medium text-xs">LIVE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCallCenter;
