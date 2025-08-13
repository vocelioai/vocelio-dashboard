import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Plus, Search, Filter, Settings, Users, Phone,
  MessageSquare, Video, Mail, AlertTriangle, CheckCircle, X,
  Edit, Trash2, Eye, Copy, Share2, MoreHorizontal, ChevronLeft,
  ChevronRight, ChevronDown, RefreshCw, Download, Upload,
  Target, Zap, Activity, TrendingUp, BarChart3, Globe,
  User, Building, MapPin, Tag, Star, Heart, Award, Shield,
  Briefcase, CreditCard, FileText, Database, Server, Monitor,
  Smartphone, Headphones, Speaker, Mic, PlayCircle, PauseCircle
} from 'lucide-react';

const SchedulingCenter = () => {
  const [currentView, setCurrentView] = useState('month'); // month, week, day, agenda
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'AI Agent Demo Call',
      description: 'Product demonstration for TechCorp Solutions - Voice AI capabilities showcase',
      type: 'demo',
      startTime: '2025-08-14T10:00:00Z',
      endTime: '2025-08-14T11:00:00Z',
      attendees: [
        { name: 'Sarah Johnson', email: 'sarah@techcorp.com', role: 'VP Sales' },
        { name: 'Mike Chen', email: 'mike@vocelio.ai', role: 'Sales Rep' }
      ],
      location: 'Zoom Meeting',
      status: 'confirmed',
      priority: 'high',
      tags: ['demo', 'enterprise', 'ai-agents'],
      notes: 'Focus on enterprise features and ROI metrics',
      reminderSet: true,
      recordingEnabled: true,
      aiAgentId: 'agent_123',
      leadId: 'lead_456'
    },
    {
      id: 2,
      title: 'Campaign Review Meeting',
      description: 'Weekly review of Q3 voice campaign performance and optimization strategies',
      type: 'internal',
      startTime: '2025-08-14T14:00:00Z',
      endTime: '2025-08-14T15:00:00Z',
      attendees: [
        { name: 'Emma Rodriguez', email: 'emma@vocelio.ai', role: 'Campaign Manager' },
        { name: 'David Park', email: 'david@vocelio.ai', role: 'Analytics Lead' },
        { name: 'Lisa Thompson', email: 'lisa@vocelio.ai', role: 'Voice Engineer' }
      ],
      location: 'Conference Room A',
      status: 'confirmed',
      priority: 'medium',
      tags: ['campaign', 'review', 'internal'],
      notes: 'Bring Q3 performance reports and optimization recommendations',
      reminderSet: true,
      recordingEnabled: false,
      campaignId: 'campaign_789'
    },
    {
      id: 3,
      title: 'Voice Training Session',
      description: 'Custom voice model training for RetailPlus customer service agent',
      type: 'training',
      startTime: '2025-08-15T09:00:00Z',
      endTime: '2025-08-15T12:00:00Z',
      attendees: [
        { name: 'Alex Wilson', email: 'alex@retailplus.com', role: 'IT Director' },
        { name: 'Jordan Kim', email: 'jordan@vocelio.ai', role: 'Voice Engineer' }
      ],
      location: 'Voice Lab Studio',
      status: 'pending',
      priority: 'high',
      tags: ['voice-training', 'custom-model', 'retail'],
      notes: 'Client will provide voice samples and brand guidelines',
      reminderSet: true,
      recordingEnabled: true,
      voiceModelId: 'voice_model_456'
    },
    {
      id: 4,
      title: 'Technical Integration Call',
      description: 'API integration walkthrough for new enterprise client',
      type: 'technical',
      startTime: '2025-08-15T16:00:00Z',
      endTime: '2025-08-15T17:30:00Z',
      attendees: [
        { name: 'Robert Kim', email: 'robert@globalcorp.com', role: 'CTO' },
        { name: 'Sarah Ahmed', email: 'sarah@globalcorp.com', role: 'Dev Lead' },
        { name: 'Alex Thompson', email: 'alex@vocelio.ai', role: 'Solutions Engineer' }
      ],
      location: 'Google Meet',
      status: 'confirmed',
      priority: 'high',
      tags: ['integration', 'api', 'technical'],
      notes: 'Prepare API documentation and integration examples',
      reminderSet: true,
      recordingEnabled: true,
      integrationId: 'integration_123'
    },
    {
      id: 5,
      title: 'Follow-up Call: StartupXYZ',
      description: 'Post-demo follow-up to discuss pricing and implementation timeline',
      type: 'followup',
      startTime: '2025-08-16T11:00:00Z',
      endTime: '2025-08-16T11:30:00Z',
      attendees: [
        { name: 'Michael Chen', email: 'michael@startupxyz.com', role: 'Founder' },
        { name: 'Jennifer Liu', email: 'jennifer@vocelio.ai', role: 'Account Manager' }
      ],
      location: 'Phone Call',
      status: 'confirmed',
      priority: 'medium',
      tags: ['followup', 'startup', 'pricing'],
      notes: 'Focus on startup-friendly pricing options',
      reminderSet: true,
      recordingEnabled: false,
      leadId: 'lead_789'
    },
    {
      id: 6,
      title: 'Voice Quality Assurance Review',
      description: 'Monthly QA review of voice synthesis quality and user feedback',
      type: 'qa',
      startTime: '2025-08-17T13:00:00Z',
      endTime: '2025-08-17T14:30:00Z',
      attendees: [
        { name: 'Maria Garcia', email: 'maria@vocelio.ai', role: 'QA Lead' },
        { name: 'Kevin Wong', email: 'kevin@vocelio.ai', role: 'Voice Engineer' },
        { name: 'Taylor Johnson', email: 'taylor@vocelio.ai', role: 'UX Researcher' }
      ],
      location: 'Voice Lab',
      status: 'confirmed',
      priority: 'low',
      tags: ['qa', 'quality', 'review'],
      notes: 'Review August voice quality metrics and user feedback',
      reminderSet: true,
      recordingEnabled: false
    }
  ]);

  const [stats] = useState({
    totalEvents: 47,
    thisWeek: 12,
    confirmed: 38,
    pending: 9,
    completed: 156
  });

  const eventTypes = [
    { id: 'all', name: 'All Events', color: 'bg-gray-500', count: stats.totalEvents },
    { id: 'demo', name: 'Product Demos', color: 'bg-blue-500', count: 15 },
    { id: 'training', name: 'Voice Training', color: 'bg-green-500', count: 8 },
    { id: 'technical', name: 'Technical Calls', color: 'bg-purple-500', count: 12 },
    { id: 'followup', name: 'Follow-ups', color: 'bg-orange-500', count: 7 },
    { id: 'internal', name: 'Internal Meetings', color: 'bg-teal-500', count: 3 },
    { id: 'qa', name: 'QA Reviews', color: 'bg-red-500', count: 2 }
  ];

  const statusConfig = {
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
  };

  const priorityConfig = {
    high: { label: 'High', color: 'bg-red-500' },
    medium: { label: 'Medium', color: 'bg-yellow-500' },
    low: { label: 'Low', color: 'bg-green-500' }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'demo': return Video;
      case 'training': return Mic;
      case 'technical': return Monitor;
      case 'followup': return Phone;
      case 'internal': return Users;
      case 'qa': return CheckCircle;
      default: return Calendar;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scheduling Center</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📅 Smart scheduling • Automated reminders • AI-powered optimization
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 text-blue-500 px-4 py-2 rounded-lg font-semibold">
                {stats.thisWeek} This Week
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Schedule Event</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-5 gap-6 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Events</p>
                  <p className="text-2xl font-bold">{stats.totalEvents}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">This Week</p>
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                </div>
                <Clock className="w-8 h-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Confirmed</p>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <Activity className="w-8 h-8 text-teal-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search Events</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Event Types */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Types</h3>
              <div className="space-y-2">
                {eventTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedFilter(type.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedFilter === type.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${selectedFilter === type.id ? 'bg-white' : type.color}`}></div>
                      <span className="font-medium">{type.name}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedFilter === type.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {type.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Video className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">Schedule Demo</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Mic className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Book Training</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700 dark:text-gray-300">Plan Follow-up</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Calendar Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upcoming Events
                </h2>
                <span className="text-gray-500 dark:text-gray-400">
                  ({filteredEvents.length} events)
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setCurrentView('agenda')}
                    className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                      currentView === 'agenda'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Agenda
                  </button>
                  <button
                    onClick={() => setCurrentView('calendar')}
                    className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                      currentView === 'calendar'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const EventIcon = getEventTypeIcon(event.type);
                const eventTypeConfig = eventTypes.find(t => t.id === event.type);
                
                return (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-xl ${eventTypeConfig?.color || 'bg-gray-500'} text-white`}>
                          <EventIcon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                              {event.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[event.status].color}`}>
                              {statusConfig[event.status].label}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${priorityConfig[event.priority].color}`}></div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {event.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees.length} attendees</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.startTime)}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {event.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            {event.reminderSet && (
                              <div className="flex items-center space-x-1">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Reminder set</span>
                              </div>
                            )}
                            {event.recordingEnabled && (
                              <div className="flex items-center space-x-1">
                                <Video className="w-4 h-4" />
                                <span>Recording enabled</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all">
                          <Copy className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all">
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or filters.
                </p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all"
                >
                  Schedule Your First Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingCenter;
