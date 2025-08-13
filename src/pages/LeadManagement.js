import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, Download, Upload, Mail, Phone, 
  Calendar, MapPin, Star, TrendingUp, Activity, Clock, CheckCircle,
  XCircle, AlertTriangle, Eye, Edit, Trash2, MoreHorizontal,
  Target, Zap, Award, DollarSign, UserPlus, MessageSquare,
  BarChart3, PieChart, Globe, Building, Briefcase, Heart,
  ArrowRight, ChevronDown, RefreshCw, Settings, FileText,
  Tag, Send, PhoneCall, Video, Calendar as CalendarIcon
} from 'lucide-react';

const LeadManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // cards, table, kanban
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock lead data
  const [leads] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Solutions',
      position: 'VP of Sales',
      status: 'hot',
      source: 'website',
      score: 92,
      value: '$45,000',
      lastContact: '2025-08-13',
      nextFollowUp: '2025-08-14',
      tags: ['enterprise', 'high-value', 'decision-maker'],
      notes: 'Very interested in enterprise plan. Scheduling demo for next week.',
      location: 'San Francisco, CA',
      industry: 'Technology',
      employeeCount: '500-1000',
      avatar: null,
      activities: [
        { type: 'email', date: '2025-08-13', note: 'Sent pricing proposal' },
        { type: 'call', date: '2025-08-12', note: 'Discovery call completed' },
        { type: 'website', date: '2025-08-10', note: 'Downloaded whitepaper' }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@startupxyz.com',
      phone: '+1 (555) 987-6543',
      company: 'StartupXYZ',
      position: 'Founder & CEO',
      status: 'warm',
      source: 'referral',
      score: 78,
      value: '$12,000',
      lastContact: '2025-08-11',
      nextFollowUp: '2025-08-15',
      tags: ['startup', 'founder', 'early-stage'],
      notes: 'Looking for cost-effective solution. Budget constraints.',
      location: 'Austin, TX',
      industry: 'Software',
      employeeCount: '10-50',
      avatar: null,
      activities: [
        { type: 'demo', date: '2025-08-11', note: 'Product demo completed' },
        { type: 'email', date: '2025-08-09', note: 'Initial outreach' }
      ]
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.r@globalcorp.com',
      phone: '+1 (555) 456-7890',
      company: 'Global Corp International',
      position: 'IT Director',
      status: 'cold',
      source: 'linkedin',
      score: 45,
      value: '$78,000',
      lastContact: '2025-08-05',
      nextFollowUp: '2025-08-16',
      tags: ['enterprise', 'it-decision-maker'],
      notes: 'Initial interest shown. Need to follow up with technical requirements.',
      location: 'New York, NY',
      industry: 'Finance',
      employeeCount: '1000+',
      avatar: null,
      activities: [
        { type: 'linkedin', date: '2025-08-05', note: 'Connected on LinkedIn' }
      ]
    },
    {
      id: 4,
      name: 'David Park',
      email: 'dpark@innovatetech.com',
      phone: '+1 (555) 321-0987',
      company: 'InnovateTech',
      position: 'CTO',
      status: 'qualified',
      source: 'webinar',
      score: 85,
      value: '$32,000',
      lastContact: '2025-08-12',
      nextFollowUp: '2025-08-14',
      tags: ['technical', 'decision-maker', 'ai-interested'],
      notes: 'Attended AI webinar. Very interested in voice AI capabilities.',
      location: 'Seattle, WA',
      industry: 'Technology',
      employeeCount: '100-500',
      avatar: null,
      activities: [
        { type: 'webinar', date: '2025-08-12', note: 'Attended AI webinar' },
        { type: 'email', date: '2025-08-12', note: 'Follow-up email sent' }
      ]
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa@retailplus.com',
      phone: '+1 (555) 654-3210',
      company: 'RetailPlus',
      position: 'Operations Manager',
      status: 'nurturing',
      source: 'google-ads',
      score: 62,
      value: '$18,000',
      lastContact: '2025-08-08',
      nextFollowUp: '2025-08-17',
      tags: ['retail', 'operations', 'cost-conscious'],
      notes: 'Interested in customer service automation. Price sensitive.',
      location: 'Chicago, IL',
      industry: 'Retail',
      employeeCount: '200-500',
      avatar: null,
      activities: [
        { type: 'call', date: '2025-08-08', note: 'Needs assessment call' },
        { type: 'google-ads', date: '2025-08-06', note: 'Clicked on Google ad' }
      ]
    }
  ]);

  const [stats] = useState({
    totalLeads: 247,
    hotLeads: 23,
    qualifiedLeads: 89,
    conversionRate: 18.5,
    averageDealSize: '$34,500',
    pipelineValue: '$2.1M'
  });

  const statusConfig = {
    hot: { label: 'Hot', color: 'bg-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-700 dark:text-red-400' },
    warm: { label: 'Warm', color: 'bg-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-700 dark:text-orange-400' },
    cold: { label: 'Cold', color: 'bg-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-700 dark:text-blue-400' },
    qualified: { label: 'Qualified', color: 'bg-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-700 dark:text-green-400' },
    nurturing: { label: 'Nurturing', color: 'bg-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-700 dark:text-purple-400' }
  };

  const sourceConfig = {
    website: { label: 'Website', icon: Globe },
    referral: { label: 'Referral', icon: Users },
    linkedin: { label: 'LinkedIn', icon: Building },
    'google-ads': { label: 'Google Ads', icon: Target },
    webinar: { label: 'Webinar', icon: Video },
    email: { label: 'Email Campaign', icon: Mail }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lead Management</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🎯 AI-powered lead scoring • Smart nurturing • Pipeline optimization
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-lg font-semibold">
                ${stats.pipelineValue} Pipeline
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition-all">
                <Plus className="w-5 h-5" />
                <span>Add Lead</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-6 gap-6 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Leads</p>
                  <p className="text-2xl font-bold">{stats.totalLeads}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Hot Leads</p>
                  <p className="text-2xl font-bold">{stats.hotLeads}</p>
                </div>
                <Zap className="w-8 h-8 text-red-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Qualified</p>
                  <p className="text-2xl font-bold">{stats.qualifiedLeads}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Avg Deal Size</p>
                  <p className="text-2xl font-bold">{stats.averageDealSize}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Pipeline Value</p>
                  <p className="text-2xl font-bold">{stats.pipelineValue}</p>
                </div>
                <Target className="w-8 h-8 text-teal-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Sources</option>
              {Object.entries(sourceConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group p-6"
              onClick={() => setSelectedLead(lead)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(lead.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                      {lead.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{lead.position}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[lead.status].bgColor} ${statusConfig[lead.status].textColor}`}>
                    {statusConfig[lead.status].label}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Company Info */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Building className="w-4 h-4" />
                  <span>{lead.company}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{lead.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{lead.employeeCount} employees</span>
                </div>
              </div>

              {/* Score and Value */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lead Score:</span>
                  <span className={`font-semibold ${getScoreColor(lead.score)}`}>
                    {lead.score}/100
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{lead.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Potential Value</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {lead.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {lead.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                    +{lead.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Last Contact & Next Follow-up */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Last: {new Date(lead.lastContact).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                    <Calendar className="w-4 h-4" />
                    <span>Next: {new Date(lead.nextFollowUp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                    <Phone className="w-4 h-4 text-green-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                  </button>
                </div>
                
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No leads found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all">
              Add New Lead
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadManagement;
