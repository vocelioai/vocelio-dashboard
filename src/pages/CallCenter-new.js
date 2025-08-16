import React, { useState } from 'react';
import {
  Phone, Users, TrendingUp, Clock, Play, Pause, Square, SkipForward,
  Settings, MessageSquare, Brain, User, Star, PhoneCall, Headphones,
  Volume2, VolumeX, Mic, MicOff, Video, VideoOff, MoreVertical,
  Download, Upload, Filter, Search, Calendar, Target, BarChart3,
  PieChart, Activity, Zap, Shield, Globe, MapPin, Mail, FileText,
  CheckCircle, XCircle, AlertCircle, AlertTriangle, RefreshCw, ArrowUp, ArrowDown,
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
  Umbrella, Rainbow, Flower, Tree, Leaf, Sprout, Mountain, Waves,
  Fingerprint
} from 'lucide-react';
import VoiceCallingWidget from '../components/VoiceCallingWidget';

const LiveCallCenter = () => {
  const [activeTab, setActiveTab] = useState('live-monitoring');
  const [selectedCall, setSelectedCall] = useState(null);
  const [showVoiceWidget, setShowVoiceWidget] = useState(false);
  const [voiceWidgetMinimized, setVoiceWidgetMinimized] = useState(false);
  const [currentCallStatus, setCurrentCallStatus] = useState(null);

  // Debug logging
  console.log('CallCenter render - showVoiceWidget:', showVoiceWidget, 'voiceWidgetMinimized:', voiceWidgetMinimized);

  // Enhanced modern color scheme
  const colorScheme = {
    primary: 'from-indigo-600 via-purple-600 to-blue-700',
    secondary: 'from-emerald-500 via-teal-500 to-cyan-600', 
    accent: 'from-rose-500 via-pink-500 to-purple-600',
    warning: 'from-amber-500 via-orange-500 to-red-500',
    success: 'from-green-500 via-emerald-500 to-teal-600',
    dark: 'from-slate-800 via-gray-800 to-zinc-900',
    light: 'from-white via-gray-50 to-slate-100'
  };

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

  // Tab Navigation Component with Enhanced Styling
  const TabNavigation = () => (
    <div className="bg-slate-800/20 backdrop-blur-sm border-b border-white/10 rounded-t-xl shadow-lg">
      <nav className="flex space-x-1 p-2 overflow-x-auto">
        {[
          { id: 'live-monitoring', name: 'Live Monitoring', icon: Activity, color: 'from-blue-500 to-cyan-500' },
          { id: 'auto-dialer', name: 'Auto Dialer', icon: Phone, color: 'from-green-500 to-emerald-500' },
          { id: 'inbound-center', name: 'Inbound Center', icon: PhoneCall, color: 'from-purple-500 to-violet-500' },
          { id: 'phone-system', name: 'Phone System', icon: Headphones, color: 'from-indigo-500 to-blue-500' },
          { id: 'lead-management', name: 'Lead Management', icon: Users, color: 'from-orange-500 to-red-500' },
          { id: 'ivr-builder', name: 'IVR Builder', icon: Settings, color: 'from-teal-500 to-cyan-500' },
          { id: 'analytics-hub', name: 'Analytics Hub', icon: BarChart3, color: 'from-pink-500 to-rose-500' },
          { id: 'ai-coach', name: 'AI Coach', icon: Brain, color: 'from-violet-500 to-purple-500' },
          { id: 'global-presence', name: 'Global Presence', icon: Globe, color: 'from-emerald-500 to-teal-500' },
          { id: 'sentiment-analysis', name: 'Sentiment AI', icon: Heart, color: 'from-rose-500 to-pink-500' },
          { id: 'voice-biometrics', name: 'Voice ID', icon: Fingerprint, color: 'from-amber-500 to-orange-500' },
          { id: 'predictive-intelligence', name: 'Predictive AI', icon: Zap, color: 'from-yellow-500 to-amber-500' },
          { id: 'quantum-analytics', name: 'Quantum Analytics', icon: Star, color: 'from-purple-500 to-indigo-500' },
          { id: 'neural-coaching', name: 'Neural Coach', icon: Brain, color: 'from-cyan-500 to-blue-500' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative inline-flex items-center px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                isActive
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-black/25 border border-white/20`
                  : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <Icon className={`mr-2 h-5 w-5 transition-all duration-300 ${
                isActive ? 'text-white drop-shadow-sm' : 'text-gray-400 group-hover:text-white'
              }`} />
              <span className="whitespace-nowrap font-bold tracking-wide">{tab.name}</span>
              {isActive && (
                <div className="absolute inset-0 bg-white/10 rounded-lg animate-pulse"></div>
              )}
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
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Auto Dialer Control</h2>
              <p className="text-blue-100">Manage automated calling campaigns and dialing operations</p>
            </div>
            <Activity className="h-12 w-12 text-white opacity-80" />
          </div>
        </div>

        {/* Dialer Control Panel */}
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Dialer Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Dialing Mode
              </label>
              <select 
                value={dialerMode} 
                onChange={(e) => setDialerMode(e.target.value)}
                className="w-full border border-slate-600 rounded-md px-3 py-2 bg-slate-700/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="predictive">Predictive Dialing</option>
                <option value="progressive">Progressive Dialing</option>
                <option value="preview">Preview Dialing</option>
                <option value="manual">Manual Dialing</option>
              </select>
            </div>

            {/* Campaign Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Active Campaign
              </label>
              <select className="w-full border border-slate-600 rounded-md px-3 py-2 bg-slate-700/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Calls/Hour</p>
                <p className="text-2xl font-bold text-blue-400">127</p>
              </div>
              <Phone className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Connect Rate</p>
                <p className="text-2xl font-bold text-green-400">34.8%</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Drop Rate</p>
                <p className="text-2xl font-bold text-red-400">2.1%</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Conversions</p>
                <p className="text-2xl font-bold text-purple-400">18</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* DNC and Compliance */}
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
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
    <div className="space-y-8">
      {/* Enhanced Inbound Center Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white backdrop-blur-lg shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Inbound Call Center</h2>
              <p className="text-purple-100">Manage incoming calls and queue operations with real-time insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-xs text-purple-100">Queue</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">94.2%</div>
              <div className="text-xs text-purple-100">SLA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Calls in Queue</p>
              <p className="text-3xl font-bold text-orange-400 mt-2">12</p>
              <p className="text-xs text-slate-500 mt-1">+2 from last hour</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Avg Wait Time</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">1:43</p>
              <p className="text-xs text-slate-500 mt-1">-15s improvement</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Available Agents</p>
              <p className="text-3xl font-bold text-green-400 mt-2">8</p>
              <p className="text-xs text-slate-500 mt-1">of 12 total agents</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Service Level</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">94.2%</p>
              <p className="text-xs text-slate-500 mt-1">Target: 95%</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Department Routing */}
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-lg border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Activity className="w-6 h-6 mr-3 text-purple-400" />
            Department Call Distribution
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">Live Updates</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queue Distribution */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-300 mb-4">Active Queues</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="font-medium text-slate-200">Sales</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-400">5 calls</div>
                  <div className="text-xs text-slate-500">Avg: 2:15</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-green-500/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="font-medium text-slate-200">Support</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">4 calls</div>
                  <div className="text-xs text-slate-500">Avg: 3:42</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="font-medium text-slate-200">Billing</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-orange-400">3 calls</div>
                  <div className="text-xs text-slate-500">Avg: 1:58</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-300 mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-200">Average Handle Time</span>
                  <span className="text-lg font-bold text-green-400">4:32</span>
                </div>
                <div className="text-xs text-green-300 mt-1">-12% from yesterday</div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-200">First Call Resolution</span>
                  <span className="text-lg font-bold text-blue-400">87%</span>
                </div>
                <div className="text-xs text-blue-300 mt-1">+3% improvement</div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-200">Customer Satisfaction</span>
                  <span className="text-lg font-bold text-purple-400">4.6★</span>
                </div>
                <div className="text-xs text-purple-300 mt-1">+0.2 this week</div>
              </div>
            </div>
          </div>
          
          {/* Queue Actions */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-300 mb-4">Queue Management</h4>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Force Next Call</span>
              </button>
              
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <Mic className="w-4 h-4" />
                <span>Broadcast Message</span>
              </button>
              
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Emergency Override</span>
              </button>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Queue Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Phone System Component
  const PhoneSystemComponent = () => (
    <div className="space-y-8">
      {/* Enhanced Phone System Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-2xl border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Headphones className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Phone System Management
              </h2>
              <p className="text-blue-100 text-lg font-medium">Advanced telephony and communication control</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-white">47</div>
              <div className="text-blue-100 font-medium">Active Lines</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-blue-100 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Numbers & Extensions */}
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Phone Numbers & Extensions</h3>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
            <Plus className="w-4 h-4 inline mr-2" />
            Add Number
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 text-gray-200 font-semibold">Number</th>
                <th className="text-left py-3 text-gray-200 font-semibold">Type</th>
                <th className="text-left py-3 text-gray-200 font-semibold">Assigned To</th>
                <th className="text-left py-3 text-gray-200 font-semibold">Status</th>
                <th className="text-left py-3 text-gray-200 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 text-white font-medium">+1 (555) 123-4567</td>
                <td className="py-4 text-gray-300">Main Line</td>
                <td className="py-4 text-gray-300">Reception</td>
                <td className="py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                    Active
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-blue-400 hover:text-blue-300 mr-3 font-medium">Edit</button>
                  <button className="text-red-400 hover:text-red-300 font-medium">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 text-white font-medium">+1 (555) 123-4568</td>
                <td className="py-4 text-gray-300">Sales</td>
                <td className="py-4 text-gray-300">Sales Team</td>
                <td className="py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                    Active
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-blue-400 hover:text-blue-300 mr-3 font-medium">Edit</button>
                  <button className="text-red-400 hover:text-red-300 font-medium">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">System Status</p>
              <p className="text-lg font-bold text-green-400">All Systems Operational</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Active Lines</p>
              <p className="text-2xl font-bold text-blue-400">24/30</p>
            </div>
            <Signal className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Call Quality</p>
              <p className="text-2xl font-bold text-purple-400">98.7%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );

  // Lead Management Component
  const LeadManagementComponent = () => (
    <div className="space-y-6">
      {/* Enhanced Lead Database Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Advanced Lead Database Management</h3>
          <div className="space-x-2">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              <Upload className="w-4 h-4 inline mr-1" />
              Import Leads
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              <Download className="w-4 h-4 inline mr-1" />
              Export Data
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              <Brain className="w-4 h-4 inline mr-1" />
              AI Scoring
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">36,525</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Leads</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">8,492</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Qualified Leads</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">4,847</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">2,892</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Converted</div>
          </div>
        </div>
      </div>

      {/* Lead Lists Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Active Lead Lists</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <h4 className="font-medium">Enterprise Tech Prospects</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">12,847 contacts • Uploaded Aug 12, 2025 • Status: Active</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">23.4%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <h4 className="font-medium">Healthcare Decision Makers</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">8,392 contacts • Uploaded Aug 10, 2025 • Status: Active</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">31.7%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <h4 className="font-medium">Financial Services Leads</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">15,286 contacts • Uploaded Aug 8, 2025 • Status: Paused</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-600">18.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Campaign Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Campaign Performance Analytics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <div>
              <h4 className="font-medium">Summer Sales Blitz 2025</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">4,847 leads • 28.4% conversion rate • ROI: 340%</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">+$247K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Generated</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div>
              <h4 className="font-medium">Q4 Enterprise Outreach</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">2,492 leads • 35.7% conversion rate • ROI: 420%</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">+$189K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Generated</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <div>
              <h4 className="font-medium">Healthcare Vertical Push</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">1,847 leads • 42.1% conversion rate • ROI: 510%</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">+$156K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Generated</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Lead Scoring */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-500" />
          AI-Powered Lead Scoring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">A+ (90-100)</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hot Leads</div>
            <div className="text-lg font-bold mt-2">1,247</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">B+ (70-89)</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Warm Leads</div>
            <div className="text-lg font-bold mt-2">3,892</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">C+ (50-69)</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cold Leads</div>
            <div className="text-lg font-bold mt-2">7,386</div>
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

  // Analytics Hub Component
  const AnalyticsHubComponent = () => (
    <div className="space-y-6">
      {/* Real-time Global Statistics */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8 border border-white/10 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm">
              <Globe className="w-6 h-6 text-white" />
            </div>
            Global Call Center Statistics - Live
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-200">LIVE</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2">47,283</div>
            <div className="text-sm font-medium text-blue-100">Active Calls Worldwide</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2">47</div>
            <div className="text-sm font-medium text-purple-100">Countries Covered</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2">23</div>
            <div className="text-sm font-medium text-pink-100">Time Zones</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2">99.97%</div>
            <div className="text-sm font-medium text-green-100">Uptime SLA</div>
          </div>
        </div>
      </div>

      {/* Advanced Call Volume Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Call Volume Breakdown
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="font-medium">Outbound Calls</span>
              <span className="text-lg font-bold text-blue-600">43,862</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="font-medium">Inbound Calls</span>
              <span className="text-lg font-bold text-green-600">3,421</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="font-medium">Recorded Calls</span>
              <span className="text-lg font-bold text-purple-600">15,483</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="font-medium">Active Extensions</span>
              <span className="text-lg font-bold text-orange-600">89</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-green-500" />
            Phone System Capacity
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium">Total Phone Numbers</span>
              <span className="text-lg font-bold">45</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium">Available for Assignment</span>
              <span className="text-lg font-bold text-green-600">12</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium">DNC Compliance Rate</span>
              <span className="text-lg font-bold text-green-600">99.7%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium">Multi-channel Support</span>
              <span className="text-sm font-bold text-blue-600">Voice, SMS, Email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-500" />
          Live Performance Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">24.7%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">1.3 min</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Wait Time</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">234</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Voicemails</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">1,876</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Transfers</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">2.3%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Drop Rate</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg">
            <div className="text-2xl font-bold text-teal-600">4.8★</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">CSAT Score</div>
          </div>
        </div>
      </div>
    </div>
  );

  // AI Coach Component
  const AICoachComponent = () => (
    <div className="space-y-6">
      {/* AI Coaching Dashboard */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          AI-Powered Real-time Coaching
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">89%</div>
            <div className="text-sm text-purple-100">Agent Performance Boost</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">1,247</div>
            <div className="text-sm text-purple-100">Real-time Suggestions Today</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">34%</div>
            <div className="text-sm text-purple-100">Conversion Improvement</div>
          </div>
        </div>
      </div>

      {/* Live AI Coaching Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
            Live AI Suggestions
          </h4>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg">
              <div className="font-medium text-green-800 dark:text-green-200">Agent: Sarah Johnson</div>
              <div className="text-sm text-green-700 dark:text-green-300">"Try asking about their current pain points to build rapport"</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">Confidence: 94%</div>
            </div>
            <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
              <div className="font-medium text-blue-800 dark:text-blue-200">Agent: Mike Chen</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">"Customer showing price sensitivity - emphasize ROI benefits"</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Confidence: 87%</div>
            </div>
            <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-r-lg">
              <div className="font-medium text-purple-800 dark:text-purple-200">Agent: Lisa Rodriguez</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">"Perfect time to present premium package - customer highly engaged"</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Confidence: 92%</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-gold-500" />
            Agent Performance Leaderboard
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Sarah Johnson</span>
              </div>
              <span className="font-bold text-yellow-600">97.8%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <Medal className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Lisa Rodriguez</span>
              </div>
              <span className="font-bold text-gray-600">94.2%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Mike Chen</span>
              </div>
              <span className="font-bold text-orange-600">91.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Training Modules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-indigo-500" />
          Personalized Training Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-indigo-200 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
            <h5 className="font-medium text-indigo-800 dark:text-indigo-200">Objection Handling</h5>
            <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">Advanced techniques for price objections</p>
            <button className="mt-3 w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              Start Training
            </button>
          </div>
          <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
            <h5 className="font-medium text-green-800 dark:text-green-200">Closing Techniques</h5>
            <p className="text-sm text-green-600 dark:text-green-300 mt-1">Psychological closing strategies</p>
            <button className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              Start Training
            </button>
          </div>
          <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
            <h5 className="font-medium text-purple-800 dark:text-purple-200">Rapport Building</h5>
            <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">Building instant connection with prospects</p>
            <button className="mt-3 w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              Start Training
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Global Presence Component
  const GlobalPresenceComponent = () => (
    <div className="space-y-6">
      {/* Global Operations Overview */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Global Call Center Operations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm text-teal-100">Global Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">156</div>
            <div className="text-sm text-teal-100">Local Numbers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">47</div>
            <div className="text-sm text-teal-100">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">15</div>
            <div className="text-sm text-teal-100">Languages</div>
          </div>
        </div>
      </div>

      {/* Regional Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            North America
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Calls</span>
              <span className="font-medium">18,394</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
              <span className="font-medium text-green-600">28.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Handle Time</span>
              <span className="font-medium">6:47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
              <span className="font-medium text-purple-600">4.9★</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-500" />
            Europe
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Calls</span>
              <span className="font-medium">15,627</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
              <span className="font-medium text-green-600">31.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Handle Time</span>
              <span className="font-medium">7:23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
              <span className="font-medium text-purple-600">4.7★</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-purple-500" />
            Asia Pacific
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Calls</span>
              <span className="font-medium">13,262</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
              <span className="font-medium text-green-600">19.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Handle Time</span>
              <span className="font-medium">8:12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
              <span className="font-medium text-purple-600">4.6★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual Support */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-indigo-500" />
          Real-time Language Support
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="font-bold text-blue-600">🇺🇸 English</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">24,894 calls</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="font-bold text-green-600">🇪🇸 Spanish</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">8,392 calls</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="font-bold text-purple-600">🇫🇷 French</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">5,847 calls</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="font-bold text-orange-600">🇩🇪 German</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">4,239 calls</div>
          </div>
          <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <div className="font-bold text-teal-600">🇯🇵 Japanese</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">3,911 calls</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Advanced Sentiment Analysis Component
  const SentimentAnalysisComponent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Sentiment Analysis</h2>
              <p className="text-pink-100">Real-time emotion detection and customer insights</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">94.7%</div>
            <div className="text-pink-100">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* Live Sentiment Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Sentiment Monitoring */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            Live Sentiment Tracking
          </h3>
          <div className="space-y-4">
            {[
              { customer: 'John Williams', sentiment: 'positive', score: 8.7, emotion: '😊', trend: 'improving', agent: 'Sarah Johnson' },
              { customer: 'Maria Garcia', sentiment: 'neutral', score: 5.4, emotion: '😐', trend: 'stable', agent: 'Mike Chen' },
              { customer: 'David Brown', sentiment: 'frustrated', score: 2.8, emotion: '😤', trend: 'declining', agent: 'Lisa Rodriguez' },
              { customer: 'Anna Lee', sentiment: 'excited', score: 9.2, emotion: '🤩', trend: 'improving', agent: 'Tom Wilson' }
            ].map((call, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{call.emotion}</div>
                  <div>
                    <div className="font-semibold">{call.customer}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Agent: {call.agent}</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    call.sentiment === 'positive' ? 'text-green-500' :
                    call.sentiment === 'excited' ? 'text-blue-500' :
                    call.sentiment === 'neutral' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {call.score}/10
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    call.trend === 'improving' ? 'bg-green-100 text-green-700' :
                    call.trend === 'stable' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {call.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analytics */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Positive
                </span>
                <span className="font-bold">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-yellow-600">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Neutral
                </span>
                <span className="font-bold">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-red-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Negative
                </span>
                <span className="font-bold">10%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Emotion Insights</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl">😊</div>
                <div className="font-bold text-blue-600">Happy</div>
                <div className="text-sm text-gray-600">45%</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xl">🤩</div>
                <div className="font-bold text-green-600">Excited</div>
                <div className="text-sm text-gray-600">22%</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-xl">😐</div>
                <div className="font-bold text-yellow-600">Neutral</div>
                <div className="text-sm text-gray-600">23%</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-xl">😤</div>
                <div className="font-bold text-red-600">Frustrated</div>
                <div className="text-sm text-gray-600">10%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-500" />
          AI-Powered Sentiment Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="font-semibold text-red-700 dark:text-red-400">High Priority</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">Customer David Brown showing frustration. Recommend supervisor intervention.</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="font-semibold text-yellow-700 dark:text-yellow-400">Monitor</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">Maria Garcia sentiment is neutral. Agent could use engagement techniques.</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="font-semibold text-green-700 dark:text-green-400">Excellent</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">Anna Lee is highly satisfied. Perfect time to introduce upsell opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Voice Biometrics Component
  const VoiceBiometricsComponent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Voice Biometrics & Identity</h2>
              <p className="text-indigo-100">Advanced voice authentication and caller verification</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">99.8%</div>
            <div className="text-indigo-100">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* Voice ID Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Voice Analysis */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Mic className="w-5 h-5 mr-2 text-indigo-500" />
            Live Voice Analysis
          </h3>
          <div className="space-y-4">
            {[
              { caller: 'John Williams', status: 'verified', confidence: 98.7, riskLevel: 'low', voiceprint: 'JW-2024-001', agent: 'Sarah Johnson' },
              { caller: 'Maria Garcia', status: 'verifying', confidence: 85.3, riskLevel: 'medium', voiceprint: 'MG-2024-047', agent: 'Mike Chen' },
              { caller: 'Unknown Caller', status: 'unverified', confidence: 23.1, riskLevel: 'high', voiceprint: 'UNKNOWN', agent: 'Lisa Rodriguez' },
              { caller: 'David Brown', status: 'verified', confidence: 96.4, riskLevel: 'low', voiceprint: 'DB-2024-023', agent: 'Tom Wilson' }
            ].map((call, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    call.status === 'verified' ? 'bg-green-100 text-green-600' :
                    call.status === 'verifying' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {call.status === 'verified' ? <CheckCircle className="w-5 h-5" /> :
                     call.status === 'verifying' ? <Clock className="w-5 h-5" /> :
                     <XCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-semibold">{call.caller}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Agent: {call.agent} • ID: {call.voiceprint}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    call.confidence > 90 ? 'text-green-500' :
                    call.confidence > 70 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {call.confidence}%
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    call.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                    call.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {call.riskLevel} risk
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Security Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-green-600">
                  <Shield className="w-4 h-4 mr-2" />
                  Verified Callers
                </span>
                <span className="font-bold">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-yellow-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Pending Verification
                </span>
                <span className="font-bold">8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-red-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Fraud Detected
                </span>
                <span className="font-bold">5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Threat Detection</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="font-semibold text-red-700 dark:text-red-400">High Risk Alert</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Suspicious voice pattern detected</div>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="font-semibold text-yellow-700 dark:text-yellow-400">Voice Spoofing</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Potential synthetic voice detected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
          Voice Pattern Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">47,283</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Voiceprints</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">99.8%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Verification Accuracy</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0.3s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Verification Time</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">247</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Fraud Attempts Blocked</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Predictive Intelligence Component
  const PredictiveIntelligenceComponent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Predictive Intelligence Engine</h2>
              <p className="text-emerald-100">AI-powered predictions and business intelligence</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">96.4%</div>
            <div className="text-emerald-100">Prediction Accuracy</div>
          </div>
        </div>
      </div>

      {/* Predictive Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Predictions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-emerald-500" />
            Live Conversion Predictions
          </h3>
          <div className="space-y-4">
            {[
              { customer: 'John Williams', probability: 87, outcome: 'high_conversion', value: '$12,500', confidence: 'high', timeToClose: '2 days' },
              { customer: 'Maria Garcia', probability: 64, outcome: 'medium_conversion', value: '$8,200', confidence: 'medium', timeToClose: '5 days' },
              { customer: 'David Brown', probability: 23, outcome: 'low_conversion', value: '$3,100', confidence: 'low', timeToClose: '14 days' },
              { customer: 'Anna Lee', probability: 92, outcome: 'high_conversion', value: '$18,700', confidence: 'high', timeToClose: '1 day' }
            ].map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    prediction.probability > 80 ? 'bg-green-100 text-green-600' :
                    prediction.probability > 50 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{prediction.customer}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Expected: {prediction.value} • {prediction.timeToClose}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    prediction.probability > 80 ? 'text-green-500' :
                    prediction.probability > 50 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {prediction.probability}%
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    prediction.confidence === 'high' ? 'bg-green-100 text-green-700' :
                    prediction.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {prediction.confidence}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Analytics */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Forecast</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Today</span>
                <span className="font-bold text-green-600">$47,800</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">This Week</span>
                <span className="font-bold text-blue-600">$284,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">This Month</span>
                <span className="font-bold text-purple-600">$1.2M</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Market Trends</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-green-600">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  SaaS Demand
                </span>
                <span className="font-bold">+24%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-blue-600">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  Enterprise
                </span>
                <span className="font-bold">+18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-red-600">
                  <ArrowDown className="w-4 h-4 mr-1" />
                  SMB Market
                </span>
                <span className="font-bold">-8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            Strategic AI Recommendations
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="font-semibold text-green-700 dark:text-green-400">High Priority Lead</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Anna Lee shows 92% conversion probability. Assign top agent immediately.</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="font-semibold text-blue-700 dark:text-blue-400">Market Opportunity</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">SaaS segment showing 24% growth. Increase outbound efforts by 30%.</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="font-semibold text-purple-700 dark:text-purple-400">Optimization</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Peak call hours: 2-4 PM EST. Schedule 40% more agents during this window.</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
            Performance Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">96.4%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Prediction Accuracy</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">847ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2.4M</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Data Points</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">34%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Boost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Quantum Analytics Component
  const QuantumAnalyticsComponent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Quantum Analytics Engine</h2>
              <p className="text-violet-100">Next-generation quantum computing for call center optimization</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">∞</div>
            <div className="text-violet-100">Quantum Speed</div>
          </div>
        </div>
      </div>

      {/* Quantum Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quantum Processing */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-violet-500" />
            Real-time Quantum Calculations
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-violet-700 dark:text-violet-400">Quantum Optimization</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-violet-600">47,283</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Variables Analyzed</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">0.001ms</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Processing Time</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">∞</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Parallel Calculations</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="font-semibold text-green-700 dark:text-green-400 mb-2">Optimal Call Routing</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Quantum algorithm found 47 billion optimal routing combinations in 0.001ms</div>
                <div className="mt-2 text-2xl font-bold text-green-600">+34% Efficiency</div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Revenue Optimization</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Quantum prediction model analyzing market quantum states</div>
                <div className="mt-2 text-2xl font-bold text-blue-600">+89% ROI</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Quantum Entanglement Network</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">All call center operations quantum-entangled for instantaneous global synchronization</div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="font-bold text-purple-600">NYC</div>
                  <div className="text-xs text-gray-600">⟨ψ₁⟩</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="font-bold text-purple-600">LON</div>
                  <div className="text-xs text-gray-600">⟨ψ₂⟩</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="font-bold text-purple-600">TOK</div>
                  <div className="text-xs text-gray-600">⟨ψ₃⟩</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="font-bold text-purple-600">SYD</div>
                  <div className="text-xs text-gray-600">⟨ψ₄⟩</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quantum Metrics */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Quantum States</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-violet-600">Superposition Active</span>
                <span className="text-sm bg-violet-100 text-violet-700 px-2 py-1 rounded">|0⟩ + |1⟩</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-600">Coherence Time</span>
                <span className="font-bold">∞ μs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-600">Entangled Pairs</span>
                <span className="font-bold">47,283</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Quantum Advantages</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">• Parallel universe optimization</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">• Instantaneous global sync</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">• Infinite scalability</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">• Zero-latency processing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Research */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-500" />
          Quantum Research Lab
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
            <div className="font-semibold text-violet-700 dark:text-violet-400 mb-2">Quantum ML Model</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Training on all possible customer interaction outcomes simultaneously</div>
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold text-violet-600">∞</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Training Scenarios</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Quantum Encryption</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Unbreakable quantum key distribution for secure communications</div>
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Security Level</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Quantum Teleportation</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Instantaneous data transfer between quantum call centers</div>
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold text-purple-600">0ms</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Transfer Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Neural Coaching Component
  const NeuralCoachingComponent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Neural Coaching Network</h2>
              <p className="text-cyan-100">Advanced neural networks for real-time agent enhancement</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">97.8%</div>
            <div className="text-cyan-100">Neural Accuracy</div>
          </div>
        </div>
      </div>

      {/* Neural Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Neural Analysis */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-cyan-500" />
            Real-time Neural Processing
          </h3>
          <div className="space-y-4">
            {[
              { agent: 'Sarah Johnson', neuralScore: 94.7, brainwave: 'optimal', focus: 97, stress: 12, enhancement: '+47% closing rate' },
              { agent: 'Mike Chen', neuralScore: 87.3, brainwave: 'focused', focus: 89, stress: 25, enhancement: '+32% rapport building' },
              { agent: 'Lisa Rodriguez', neuralScore: 91.8, brainwave: 'creative', focus: 93, stress: 18, enhancement: '+38% objection handling' },
              { agent: 'Tom Wilson', neuralScore: 86.2, brainwave: 'calm', focus: 85, stress: 22, enhancement: '+29% conversion rate' }
            ].map((neural, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{neural.agent}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Neural State: {neural.brainwave}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-600">{neural.neuralScore}%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Neural Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm font-bold text-green-600">{neural.focus}%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Focus Level</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm font-bold text-yellow-600">{neural.stress}%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Stress Level</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-xs font-bold text-purple-600">{neural.enhancement}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Insights */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Neural Patterns</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-cyan-600">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                  Optimal State
                </span>
                <span className="font-bold">43%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Focused
                </span>
                <span className="font-bold">31%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-blue-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Creative
                </span>
                <span className="font-bold">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-purple-600">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Calm
                </span>
                <span className="font-bold">8%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Enhancement Protocols</h3>
            <div className="space-y-2">
              <div className="text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded text-green-700 dark:text-green-400">
                ✓ Binaural beats activated
              </div>
              <div className="text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-700 dark:text-blue-400">
                ✓ Neurofeedback training
              </div>
              <div className="text-sm p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-purple-700 dark:text-purple-400">
                ✓ Cognitive enhancement
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Neural Technology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Brain-Computer Interface
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Neural Headset Status</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Connected: 47 agents</div>
                <div>Signal Quality: 98.7%</div>
                <div>Battery: 94% avg</div>
                <div>Sync Rate: 1000Hz</div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Neural Network Training</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Live adaptation to each agent's unique neural patterns for optimal performance enhancement</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Performance Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
              <div className="text-2xl font-bold text-cyan-600">97.8%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Neural Accuracy</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+67%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Performance Boost</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0.1ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Neural Research */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-purple-500" />
          Advanced Neural Research
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <div className="font-semibold text-cyan-700 dark:text-cyan-400 mb-2">Neuroplasticity Training</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Real-time brain adaptation protocols to enhance learning and skill acquisition</div>
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold text-cyan-600">+89%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Learning Speed</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="font-semibold text-green-700 dark:text-green-400 mb-2">Stress Optimization</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">AI-powered stress detection and mitigation through neural feedback loops</div>
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold text-green-600">-74%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Stress Reduction</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Flow State Induction</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Precision brainwave entrainment for optimal cognitive performance states</div>
            <div className="mt-3 text-center">
              <div className="text-2xl font-bold text-purple-600">+127%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Flow Efficiency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
      <div className="space-y-6 p-6">
        {/* Enhanced Tab Navigation */}
        <TabNavigation />

        {/* Main Content Area with Modern Styling */}
        <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-6">

      {/* Render active tab content */}
      {activeTab === 'live-monitoring' && (
        <div className="space-y-8">
          {/* Enhanced Live Command Center Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-2xl border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Phone className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Live Call Monitoring
                  </h2>
                  <p className="text-blue-100 text-lg font-medium">Real-time oversight and AI-powered assistance</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-white">{mockData.activeCalls.length}</div>
                  <div className="text-blue-100 font-medium">Active Calls</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-white">{mockData.agents.filter(a => a.status === 'on_call').length}</div>
                  <div className="text-blue-100 font-medium">Agents Online</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-green-300">98.7%</div>
                  <div className="text-blue-100 font-medium">Call Quality</div>
                </div>
                <button
                  onClick={(e) => {
                    console.log('Make Call button clicked!', e);
                    console.log('Button element:', e.target);
                    console.log('Current showVoiceWidget state:', showVoiceWidget);
                    setShowVoiceWidget(true);
                    setVoiceWidgetMinimized(false);
                  }}
                  onMouseDown={() => console.log('Button mouse down')}
                  onMouseUp={() => console.log('Button mouse up')}
                  onMouseEnter={() => console.log('Button mouse enter')}
                  style={{ pointerEvents: 'auto', zIndex: 1000 }}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Make Call</span>
                </button>
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
      {activeTab === 'analytics-hub' && <AnalyticsHubComponent />}
      {activeTab === 'ai-coach' && <AICoachComponent />}
      {activeTab === 'global-presence' && <GlobalPresenceComponent />}
      {activeTab === 'sentiment-analysis' && <SentimentAnalysisComponent />}
      {activeTab === 'voice-biometrics' && <VoiceBiometricsComponent />}
      {activeTab === 'predictive-intelligence' && <PredictiveIntelligenceComponent />}
      {activeTab === 'quantum-analytics' && <QuantumAnalyticsComponent />}
      {activeTab === 'neural-coaching' && <NeuralCoachingComponent />}

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
    </div>                {/* Sidebar */}
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
        </div>
      </div>
      
      {/* Voice Calling Widget Modal - ACTUAL COMPONENT */}
      {showVoiceWidget && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            console.log('🎯 Modal overlay clicked - closing modal');
            setShowVoiceWidget(false);
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4"
            onClick={(e) => {
              console.log('🎯 Modal content clicked - preventing close');
              e.stopPropagation();
            }}
          >
            <VoiceCallingWidget
              onClose={() => {
                console.log('🎯 VoiceCallingWidget onClose called');
                setShowVoiceWidget(false);
              }}
              isMinimized={voiceWidgetMinimized}
              onMinimize={() => setVoiceWidgetMinimized(!voiceWidgetMinimized)}
              callStatus={currentCallStatus}
              onCallStatusChange={setCurrentCallStatus}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCallCenter;
