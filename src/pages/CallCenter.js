import React, { useState, useEffect } from 'react';
import {
  Phone, Radio, Users, Activity, Globe, Clock, TrendingUp, BarChart3,
  Play, Pause, PhoneCall, Headphones, UserPlus, Eye, Settings, AlertTriangle,
  CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, Volume2, VolumeX,
  Maximize2, Minimize2, RotateCcw, Share2, Download, Upload, Filter,
  Search, MapPin, Calendar, Target, Zap, Brain, Crown, Award, Flame,
  Monitor, Wifi, Server, Database, Shield, Lock, Unlock, RefreshCw,
  MessageSquare, Bell, AlertCircle, Info, Star, ThumbsUp, ThumbsDown,
  ExternalLink, Copy, Mic, MicOff, Gauge, Timer, Crosshair, LineChart,
  Minus, X
} from 'lucide-react';

const LiveCallCenter = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    agent: 'all',
    industry: 'all',
    priority: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveMetrics, setLiveMetrics] = useState({
    activeCalls: 47283,
    successRate: 23.4,
    totalAgents: 247,
    conversionsToday: 11234,
    appointmentsToday: 7129,
    queuedCalls: 5647,
    avgWaitTime: 1.3,
    systemLoad: 73,
    peakTime: '2:00-4:00 PM',
    globalCoverage: {
      northAmerica: 32400,
      europe: 12800,
      asiaPacific: 8300
    }
  });

  // Simulated live calls data
  const [liveCalls, setLiveCalls] = useState([
    {
      id: 'call_001',
      status: 'converting',
      customerPhone: '+1 (555) 123-4567',
      customerInfo: {
        name: 'John Smith',
        location: 'Los Angeles, CA',
        type: 'Homeowner',
        age: 45,
        interest: 'High'
      },
      campaign: {
        name: 'Solar Prospects - California',
        type: 'Solar Energy',
        priority: 'high'
      },
      agent: {
        name: 'Sarah',
        type: 'AI Agent',
        performance: 94.2,
        voiceId: 'professional_female'
      },
      duration: '2:34',
      sentiment: 'positive',
      stage: 'qualification',
      transcript: [
        { speaker: 'agent', text: "Hi John! I'm Sarah from Solar Solutions. I see you inquired about solar panels for your home. Is this still something you're interested in exploring?" },
        { speaker: 'customer', text: "Yes, we've been thinking about it for months. Our electric bill is getting crazy high." },
        { speaker: 'agent', text: "I completely understand! Many homeowners in your area are saving 70-90% on their electric bills. What's your current monthly bill running?" }
      ],
      aiInsights: {
        conversionProbability: 87,
        nextBestAction: 'Continue qualification - customer shows strong buying signals',
        objections: [],
        sentiment: 0.8
      }
    },
    {
      id: 'call_002',
      status: 'qualifying',
      customerPhone: '+1 (555) 987-6543',
      customerInfo: {
        name: 'Maria Rodriguez',
        location: 'Austin, TX',
        type: 'Previous Lead',
        age: 38,
        interest: 'Warm'
      },
      campaign: {
        name: 'Insurance Follow-up - Texas',
        type: 'Insurance',
        priority: 'medium'
      },
      agent: {
        name: 'Mike',
        type: 'AI Agent',
        performance: 97.1,
        voiceId: 'confident_male'
      },
      duration: '1:12',
      sentiment: 'neutral',
      stage: 'opening',
      transcript: [
        { speaker: 'agent', text: "Hi Maria, this is Mike from SecureLife Insurance. We spoke a few weeks ago about life insurance options. Do you have a moment?" },
        { speaker: 'customer', text: "Oh yes, I remember. I was going to call back but got busy with work." }
      ],
      aiInsights: {
        conversionProbability: 64,
        nextBestAction: 'Probe for family situation and financial goals',
        objections: ['time_constraints'],
        sentiment: 0.6
      }
    },
    {
      id: 'call_003',
      status: 'objection_handling',
      customerPhone: '+1 (555) 456-7890',
      customerInfo: {
        name: 'Robert Chen',
        location: 'New York, NY',
        type: 'Investor',
        age: 52,
        interest: 'Price Concerned'
      },
      campaign: {
        name: 'Real Estate Investors - NYC',
        type: 'Real Estate',
        priority: 'high'
      },
      agent: {
        name: 'Lisa',
        type: 'AI Agent',
        performance: 89.7,
        voiceId: 'professional_female'
      },
      duration: '4:52',
      sentiment: 'concerned',
      stage: 'pricing_discussion',
      transcript: [
        { speaker: 'customer', text: "I'm interested but your fees seem higher than what I'm paying my current property manager." },
        { speaker: 'agent', text: "I understand your concern about pricing, Robert. Many investors initially focus on fees, but what matters most is your net return. Can I show you how our premium service actually increases your profits?" }
      ],
      aiInsights: {
        conversionProbability: 45,
        nextBestAction: 'Present ROI calculator and testimonials from similar investors',
        objections: ['price_concern', 'competitor_comparison'],
        sentiment: 0.4
      }
    },
    {
      id: 'call_004',
      status: 'closing',
      customerPhone: '+1 (555) 321-9876',
      customerInfo: {
        name: 'Jennifer Williams',
        location: 'Miami, FL',
        type: 'Healthcare Professional',
        age: 41,
        interest: 'Ready to Buy'
      },
      campaign: {
        name: 'Healthcare Appointment Scheduling',
        type: 'Healthcare',
        priority: 'urgent'
      },
      agent: {
        name: 'Emma',
        type: 'AI Agent',
        performance: 92.8,
        voiceId: 'caring_female'
      },
      duration: '6:23',
      sentiment: 'positive',
      stage: 'appointment_booking',
      transcript: [
        { speaker: 'agent', text: "Perfect! I have availability this Friday at 2 PM or Monday at 10 AM. Which works better for your schedule?" },
        { speaker: 'customer', text: "Friday at 2 PM would be perfect. Can you send me a confirmation?" }
      ],
      aiInsights: {
        conversionProbability: 95,
        nextBestAction: 'Confirm appointment details and send calendar invite',
        objections: [],
        sentiment: 0.9
      }
    },
    {
      id: 'call_005',
      status: 'follow_up',
      customerPhone: '+1 (555) 654-3210',
      customerInfo: {
        name: 'David Thompson',
        location: 'Chicago, IL',
        type: 'Small Business Owner',
        age: 47,
        interest: 'Needs Information'
      },
      campaign: {
        name: 'Business Loan Qualification',
        type: 'Finance',
        priority: 'medium'
      },
      agent: {
        name: 'Alex',
        type: 'AI Agent',
        performance: 88.5,
        voiceId: 'trustworthy_male'
      },
      duration: '3:17',
      sentiment: 'interested',
      stage: 'information_gathering',
      transcript: [
        { speaker: 'agent', text: "Based on what you've told me about your business, it sounds like you'd qualify for our growth capital program. What's your primary use for the funding?" },
        { speaker: 'customer', text: "We're looking to expand to a second location and need equipment financing." }
      ],
      aiInsights: {
        conversionProbability: 72,
        nextBestAction: 'Gather financial details and schedule loan officer consultation',
        objections: ['documentation_requirements'],
        sentiment: 0.7
      }
    }
  ]);

  // Top performing agents
  const topAgents = [
    { name: 'Sarah', specialty: 'Solar Expert', performance: 97.2, callsToday: 234, status: 'active' },
    { name: 'Mike', specialty: 'Insurance Pro', performance: 94.8, callsToday: 189, status: 'active' },
    { name: 'Lisa', specialty: 'Real Estate', performance: 91.5, callsToday: 156, status: 'active' },
    { name: 'Emma', specialty: 'Healthcare', performance: 92.8, callsToday: 178, status: 'active' },
    { name: 'Alex', specialty: 'Finance', performance: 88.5, callsToday: 143, status: 'active' }
  ];

  // Update live metrics every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        activeCalls: Math.max(40000, prev.activeCalls + Math.floor(Math.random() * 200) - 100),
        successRate: Math.max(20, Math.min(30, prev.successRate + (Math.random() - 0.5) * 0.5)),
        conversionsToday: prev.conversionsToday + Math.floor(Math.random() * 5),
        appointmentsToday: prev.appointmentsToday + Math.floor(Math.random() * 3),
        queuedCalls: Math.max(3000, prev.queuedCalls + Math.floor(Math.random() * 100) - 50)
      }));
      setCurrentTime(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Filter calls based on active filters and search
  const filteredCalls = liveCalls.filter(call => {
    const matchesSearch = 
      call.customerInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.customerPhone.includes(searchQuery) ||
      call.campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.agent.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeFilters.status === 'all' || call.status === activeFilters.status;
    const matchesAgent = activeFilters.agent === 'all' || call.agent.name === activeFilters.agent;
    const matchesIndustry = activeFilters.industry === 'all' || call.campaign.type === activeFilters.industry;
    const matchesPriority = activeFilters.priority === 'all' || call.campaign.priority === activeFilters.priority;

    return matchesSearch && matchesStatus && matchesAgent && matchesIndustry && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'converting': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'qualifying': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'objection_handling': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'closing': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'follow_up': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'converting': return 'Converting';
      case 'qualifying': return 'Qualifying';
      case 'objection_handling': return 'Handling Objections';
      case 'closing': return 'Closing';
      case 'follow_up': return 'Follow-up';
      default: return 'Unknown';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case 'neutral': return <Minus className="w-4 h-4 text-yellow-500" />;
      case 'concerned': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  // Call detail modal
  const CallDetailModal = ({ call, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
              call.status === 'converting' ? 'from-green-500 to-emerald-500' :
              call.status === 'qualifying' ? 'from-blue-500 to-cyan-500' :
              call.status === 'objection_handling' ? 'from-yellow-500 to-orange-500' :
              call.status === 'closing' ? 'from-purple-500 to-pink-500' :
              'from-cyan-500 to-blue-500'
            } flex items-center justify-center`}>
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{call.customerInfo.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{call.customerPhone} • {getStatusLabel(call.status)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all">
              End Call
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Call Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Real-time Transcript */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                  Live Conversation
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
                  {call.transcript.map((message, index) => (
                    <div key={index} className={`flex ${message.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.speaker === 'agent' 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                      }`}>
                        <div className="text-xs text-gray-500 mb-1 capitalize">{message.speaker}</div>
                        <div className="text-sm">{message.text}</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-start">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Agent (typing...)</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
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
                      <div className="text-2xl font-bold text-purple-500">{call.aiInsights.conversionProbability}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Probability</div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-500">{call.aiInsights.sentiment.toFixed(1)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Sentiment Score</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Next Best Action:</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{call.aiInsights.nextBestAction}</p>
                    </div>
                    {call.aiInsights.objections.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Detected Objections:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {call.aiInsights.objections.map((objection, index) => (
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
                <h4 className="font-semibold mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium">{call.customerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="font-medium">{call.customerInfo.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="font-medium">{call.customerInfo.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Interest Level:</span>
                    <span className="font-medium">{call.customerInfo.interest}</span>
                  </div>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Campaign Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Campaign:</span>
                    <span className="font-medium">{call.campaign.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                    <span className="font-medium">{call.campaign.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                    <span className={`font-medium capitalize ${
                      call.campaign.priority === 'high' ? 'text-red-500' :
                      call.campaign.priority === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>{call.campaign.priority}</span>
                  </div>
                </div>
              </div>

              {/* Agent Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3">AI Agent</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Agent:</span>
                    <span className="font-medium">{call.agent.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Performance:</span>
                    <span className="font-medium text-green-500">{call.agent.performance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Voice:</span>
                    <span className="font-medium">{call.agent.voiceId.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                  <Headphones className="w-5 h-5" />
                  <span>Listen In</span>
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Transfer to Human</span>
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Export Call Data</span>
                </button>
              </div>

              {/* Call Statistics */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Call Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-medium">{call.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Stage:</span>
                    <span className="font-medium capitalize">{call.stage.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Sentiment:</span>
                    <div className="flex items-center space-x-1">
                      {getSentimentIcon(call.sentiment)}
                      <span className="font-medium capitalize">{call.sentiment}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Live Command Center Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-700/50' : 'bg-gradient-to-r from-red-50/80 to-orange-50/80 border-red-200/50'} 
        rounded-2xl border p-8 backdrop-blur-xl relative overflow-hidden`}>
        
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                LIVE CALL CENTER
              </h1>
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Real-time AI Call Monitoring • {liveMetrics.activeCalls.toLocaleString()} Active Calls Worldwide
            </p>
            <p className="text-sm text-red-500 font-medium">
              🔴 LIVE • Updates every 2 seconds • Global Coverage Active • {currentTime.toLocaleTimeString()}
            </p>
          </div>

          {/* Live Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30">
              <div className="text-5xl font-bold text-red-400 mb-2 animate-pulse">
                {(liveMetrics.activeCalls / 1000).toFixed(1)}K
              </div>
              <div className="text-sm font-medium text-red-300">📞 Live Calls</div>
              <div className="text-xs text-green-400 mt-1">+{Math.floor(Math.random() * 50) + 10}/sec</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
              <div className="text-5xl font-bold text-green-400 mb-2">
                {liveMetrics.successRate.toFixed(1)}%
              </div>
              <div className="text-sm font-medium text-green-300">✅ Success Rate</div>
              <div className="text-xs text-green-400 mt-1">Real-time average</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                {liveMetrics.conversionsToday.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-blue-300">⚡ Conversions</div>
              <div className="text-xs text-green-400 mt-1">Today so far</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
              <div className="text-5xl font-bold text-purple-400 mb-2">
                {liveMetrics.appointmentsToday.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-purple-300">🎯 Appointments</div>
              <div className="text-xs text-green-400 mt-1">Booked today</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
              <Radio className="w-6 h-6 animate-pulse" />
              <span>🔴 Monitor Live Calls</span>
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
              <PhoneCall className="w-6 h-6" />
              <span>📞 Start Emergency Blast</span>
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
              <Users className="w-6 h-6" />
              <span>👥 Agent Performance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search calls, agents, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-3 rounded-lg border w-full ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                value={activeFilters.status}
                onChange={(e) => setActiveFilters({...activeFilters, status: e.target.value})}
                className={`px-3 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                <option value="all">All Status</option>
                <option value="converting">Converting</option>
                <option value="qualifying">Qualifying</option>
                <option value="objection_handling">Handling Objections</option>
                <option value="closing">Closing</option>
                <option value="follow_up">Follow-up</option>
              </select>

              <select 
                value={activeFilters.industry}
                onChange={(e) => setActiveFilters({...activeFilters, industry: e.target.value})}
                className={`px-3 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                <option value="all">All Industries</option>
                <option value="Solar Energy">Solar Energy</option>
                <option value="Insurance">Insurance</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Showing {filteredCalls.length} of {liveCalls.length} active calls
            </div>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-colors`}>
              <Filter className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-colors`}>
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Call Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Calls Panel */}
        <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <Radio className="w-6 h-6 text-red-500 animate-pulse" />
              <span>🔴 Live Active Calls</span>
              <div className="px-3 py-1 bg-red-500/10 text-red-500 text-sm rounded-full">
                {Math.floor(liveMetrics.activeCalls / 100)} calls/sec
              </div>
            </h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors">
                Live View
              </button>
              <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
                All Calls
              </button>
              <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
                Issues
              </button>
            </div>
          </div>

          {/* Live Calls List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCalls.map((call) => (
              <div key={call.id} className={`p-4 rounded-xl border transition-all hover:shadow-lg cursor-pointer ${
                darkMode ? 'bg-gray-700/50 border-gray-600/50 hover:border-blue-500/50' : 'bg-gray-50 border-gray-200 hover:border-blue-500/50'
              }`} onClick={() => setSelectedCall(call)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                      call.status === 'converting' ? 'bg-green-500' :
                      call.status === 'qualifying' ? 'bg-blue-500' :
                      call.status === 'objection_handling' ? 'bg-yellow-500' :
                      call.status === 'closing' ? 'bg-purple-500' :
                      'bg-cyan-500'
                    }`}></div>
                    <div>
                      <h4 className="font-semibold">{call.campaign.name}</h4>
                      <p className="text-sm text-gray-500">Agent: {call.agent.name} • Campaign: {call.campaign.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(call.status)}`}>
                      {getStatusLabel(call.status)}
                    </span>
                    <span className="text-sm text-gray-500">{call.duration}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">📞 {call.customerPhone}</span>
                    <span className="text-blue-500">{call.customerInfo.type}, {call.customerInfo.location}</span>
                    <span className={`${
                      call.customerInfo.interest === 'High' ? 'text-green-500' :
                      call.customerInfo.interest === 'Warm' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`}>{call.customerInfo.interest} Interest</span>
                    <div className="flex items-center space-x-1">
                      {getSentimentIcon(call.sentiment)}
                      <span className="capitalize">{call.sentiment}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {e.stopPropagation(); setSelectedCall(call);}}
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors" 
                      title="Listen In"
                    >
                      <Headphones className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors" title="Transfer">
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="End Call">
                      <PhoneCall className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* AI Insights Preview */}
                <div className="mt-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-600">AI: {call.aiInsights.conversionProbability}% conversion probability</span>
                    </div>
                    <div className="text-xs text-gray-500">Click to view details</div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{call.aiInsights.nextBestAction}</p>
                </div>
              </div>
            ))}

            {/* Load More */}
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-2">
                Showing {filteredCalls.length} of {(liveMetrics.activeCalls / 1000).toFixed(1)}K active calls
              </p>
              <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                Load More Active Calls →
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Metrics Sidebar */}
        <div className="space-y-6">
          {/* Call Queue Status */}
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              📋 Call Queue Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Queued Calls:</span>
                <span className="font-bold text-blue-500">{liveMetrics.queuedCalls.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Avg Wait Time:</span>
                <span className="font-bold text-green-500">{liveMetrics.avgWaitTime}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Peak Time:</span>
                <span className="font-bold text-orange-500">{liveMetrics.peakTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">System Load:</span>
                <span className="font-bold text-purple-500">{liveMetrics.systemLoad}%</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Capacity Usage</span>
                <span className="text-sm font-medium">{liveMetrics.systemLoad}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000" style={{width: `${liveMetrics.systemLoad}%`}}></div>
              </div>
            </div>
          </div>

          {/* Agent Performance */}
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              👥 Top Agents Live
            </h3>
            
            <div className="space-y-3">
              {topAgents.map((agent, index) => (
                <div key={agent.name} className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-green-500/5 border border-green-500/20' :
                  index === 1 ? 'bg-blue-500/5 border border-blue-500/20' :
                  index === 2 ? 'bg-purple-500/5 border border-purple-500/20' :
                  'bg-gray-500/5 border border-gray-500/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div>
                      <div className="font-semibold flex items-center space-x-1">
                        <span>{agent.name}</span>
                        {index === 0 && <Crown className="w-3 h-3 text-yellow-500" />}
                      </div>
                      <div className="text-xs text-gray-500">{agent.specialty}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      index === 0 ? 'text-green-500' :
                      index === 1 ? 'text-blue-500' :
                      index === 2 ? 'text-purple-500' :
                      'text-gray-500'
                    }`}>{agent.performance}%</div>
                    <div className="text-xs text-gray-500">{agent.callsToday} calls</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-blue-500 hover:text-blue-600 font-medium">
              View All Agent Performance →
            </button>
          </div>

          {/* System Health */}
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              🔧 System Health
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  API Status
                </span>
                <span className="text-green-500 font-medium">Operational</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Voice Services
                </span>
                <span className="text-green-500 font-medium">99.99%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  AI Models
                </span>
                <span className="text-green-500 font-medium">Optimal</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                  Call Routing
                </span>
                <span className="text-yellow-500 font-medium">High Load</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
            <h3 className="text-lg font-bold mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Emergency Stop All</span>
              </button>
              <button className="w-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Boost Performance</span>
              </button>
              <button className="w-full bg-green-500/10 text-green-500 hover:bg-green-500/20 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export Live Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Call Map & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Call Map */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-500" />
            🌍 Global Call Activity
          </h3>
          
          <div className="h-64 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 animate-pulse"></div>
            <div className="text-center z-10">
              <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" style={{animationDuration: '20s'}} />
              <p className="text-lg font-semibold mb-2">Live Global Coverage</p>
              <p className="text-sm text-gray-500 mb-4">
                Active in 47 countries • 23 time zones
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-bold text-blue-500">{(liveMetrics.globalCoverage.northAmerica / 1000).toFixed(1)}K</div>
                  <div className="text-gray-500">North America</div>
                </div>
                <div>
                  <div className="font-bold text-green-500">{(liveMetrics.globalCoverage.europe / 1000).toFixed(1)}K</div>
                  <div className="text-gray-500">Europe</div>
                </div>
                <div>
                  <div className="font-bold text-purple-500">{(liveMetrics.globalCoverage.asiaPacific / 1000).toFixed(1)}K</div>
                  <div className="text-gray-500">Asia Pacific</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Analytics */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-500" />
            📊 Real-time Analytics
          </h3>
          
          <div className="space-y-6">
            {/* Conversion Funnel */}
            <div>
              <h4 className="font-semibold mb-3">Today's Conversion Funnel</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Calls Initiated</span>
                  <span className="font-bold">{liveMetrics.activeCalls.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{width: '100%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Answered</span>
                  <span className="font-bold">{Math.floor(liveMetrics.activeCalls * 0.73).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{width: '73%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Qualified</span>
                  <span className="font-bold">{Math.floor(liveMetrics.activeCalls * 0.45).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{width: '45%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Converted</span>
                  <span className="font-bold">{Math.floor(liveMetrics.activeCalls * 0.234).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{width: '23.4%'}}></div>
                </div>
              </div>
            </div>

            {/* Call Outcomes */}
            <div>
              <h4 className="font-semibold mb-3">Call Outcomes (Last Hour)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-green-500/10">
                  <div className="text-lg font-bold text-green-500">23.4%</div>
                  <div className="text-xs text-gray-500">Appointments</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-500/10">
                  <div className="text-lg font-bold text-blue-500">18.7%</div>
                  <div className="text-xs text-gray-500">Follow-ups</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                  <div className="text-lg font-bold text-yellow-500">12.3%</div>
                  <div className="text-xs text-gray-500">Callbacks</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-500/10">
                  <div className="text-lg font-bold text-purple-500">8.9%</div>
                  <div className="text-xs text-gray-500">Transfers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <CallDetailModal call={selectedCall} onClose={() => setSelectedCall(null)} />
      )}
    </div>
  );
};

export default LiveCallCenter;