import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, UserCheck, UserX, Crown, Shield, Star, Award,
  TrendingUp, TrendingDown, BarChart3, Activity, Phone, Target,
  Settings, Search, Filter, MoreHorizontal, Edit, Trash2, Eye,
  Mail, MessageSquare, Calendar, Clock, MapPin, Building,
  Zap, Brain, Headphones, Mic, Volume2, PhoneCall, Video,
  FileText, Download, Upload, RefreshCw, Plus, X, ChevronDown,
  AlertCircle, CheckCircle, XCircle, Info, Bell, Flag,
  BookOpen, GraduationCap, Trophy, Medal,
  Briefcase, Globe, Monitor, Smartphone, Tablet, Laptop
} from 'lucide-react';

const TeamHubDashboard = ({ darkMode = true }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);

  // Live team metrics
  const [teamMetrics, setTeamMetrics] = useState({
    totalMembers: 247,
    activeToday: 189,
    onBreak: 23,
    offline: 35,
    avgPerformance: 94.2,
    totalCallsToday: 18947,
    avgCallDuration: 847,
    customerSatisfaction: 96.8,
    trainingsCompleted: 89,
    certificationRate: 97.3
  });

  // Team members data
  const teamMembers = [
    {
      id: 'usr_001',
      name: 'Sarah Chen',
      email: 'sarah.chen@vocelio.ai',
      role: 'Senior AI Agent Manager',
      department: 'Operations',
      status: 'online',
      avatar: '👩‍💼',
      performance: 98.5,
      callsToday: 73,
      avgCallDuration: 892,
      satisfaction: 98.2,
      joinDate: '2023-01-15',
      lastLogin: '2024-11-28T09:30:00Z',
      location: 'San Francisco, CA',
      timezone: 'PST',
      skills: ['Team Leadership', 'AI Optimization', 'Customer Success'],
      certifications: ['TCPA Advanced', 'AI Agent Specialist', 'Leadership Pro'],
      phoneNumber: '+1 (555) 0123'
    },
    {
      id: 'usr_002',
      name: 'Marcus Rodriguez',
      email: 'marcus.rodriguez@vocelio.ai',
      role: 'AI Call Specialist',
      department: 'Sales',
      status: 'on-call',
      avatar: '👨‍💻',
      performance: 95.8,
      callsToday: 89,
      avgCallDuration: 756,
      satisfaction: 94.7,
      joinDate: '2023-03-22',
      lastLogin: '2024-11-28T10:15:00Z',
      location: 'Austin, TX',
      timezone: 'CST',
      skills: ['Sales Excellence', 'Lead Conversion', 'CRM Management'],
      certifications: ['Sales Pro', 'AI Voice Specialist'],
      phoneNumber: '+1 (555) 0124'
    },
    {
      id: 'usr_003',
      name: 'Elena Vasquez',
      email: 'elena.vasquez@vocelio.ai',
      role: 'Compliance Specialist',
      department: 'Legal & Compliance',
      status: 'training',
      avatar: '👩‍⚖️',
      performance: 99.1,
      callsToday: 0,
      avgCallDuration: 0,
      satisfaction: 97.9,
      joinDate: '2022-11-08',
      lastLogin: '2024-11-28T08:45:00Z',
      location: 'Miami, FL',
      timezone: 'EST',
      skills: ['TCPA Compliance', 'Legal Review', 'Risk Management'],
      certifications: ['TCPA Expert', 'GDPR Specialist', 'Compliance Master'],
      phoneNumber: '+1 (555) 0125'
    },
    {
      id: 'usr_004',
      name: 'David Kim',
      email: 'david.kim@vocelio.ai',
      role: 'Technical Support Lead',
      department: 'Technology',
      status: 'break',
      avatar: '👨‍🔧',
      performance: 92.4,
      callsToday: 45,
      avgCallDuration: 1203,
      satisfaction: 91.8,
      joinDate: '2023-06-12',
      lastLogin: '2024-11-28T11:20:00Z',
      location: 'Seattle, WA',
      timezone: 'PST',
      skills: ['Technical Support', 'System Integration', 'API Management'],
      certifications: ['Technical Expert', 'API Specialist'],
      phoneNumber: '+1 (555) 0126'
    },
    {
      id: 'usr_005',
      name: 'Amanda Foster',
      email: 'amanda.foster@vocelio.ai',
      role: 'Quality Assurance Manager',
      department: 'Quality',
      status: 'offline',
      avatar: '👩‍🔬',
      performance: 96.7,
      callsToday: 0,
      avgCallDuration: 0,
      satisfaction: 95.4,
      joinDate: '2023-02-28',
      lastLogin: '2024-11-27T18:30:00Z',
      location: 'Denver, CO',
      timezone: 'MST',
      skills: ['Quality Control', 'Performance Analysis', 'Training Development'],
      certifications: ['QA Professional', 'Training Specialist'],
      phoneNumber: '+1 (555) 0127'
    },
    {
      id: 'usr_006',
      name: 'James Wilson',
      email: 'james.wilson@vocelio.ai',
      role: 'Customer Success Representative',
      department: 'Customer Success',
      status: 'online',
      avatar: '👨‍💼',
      performance: 93.9,
      callsToday: 67,
      avgCallDuration: 934,
      satisfaction: 96.1,
      joinDate: '2023-04-10',
      lastLogin: '2024-11-28T10:45:00Z',
      location: 'Chicago, IL',
      timezone: 'CST',
      skills: ['Customer Relations', 'Account Management', 'Retention Strategy'],
      certifications: ['Customer Success Pro', 'Account Management'],
      phoneNumber: '+1 (555) 0128'
    }
  ];

  // Departments data
  const departments = [
    { name: 'Operations', count: 89, growth: 12.3, color: 'blue' },
    { name: 'Sales', count: 67, growth: 8.7, color: 'green' },
    { name: 'Customer Success', count: 45, growth: 15.2, color: 'purple' },
    { name: 'Technology', count: 23, growth: 22.1, color: 'orange' },
    { name: 'Legal & Compliance', count: 12, growth: 5.8, color: 'red' },
    { name: 'Quality', count: 11, growth: 18.9, color: 'cyan' }
  ];

  const roles = [
    'Senior AI Agent Manager',
    'AI Call Specialist',
    'Compliance Specialist',
    'Technical Support Lead',
    'Quality Assurance Manager',
    'Customer Success Representative',
    'Team Lead',
    'Training Coordinator',
    'Analytics Specialist',
    'System Administrator'
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTeamMetrics(prev => ({
        ...prev,
        totalCallsToday: prev.totalCallsToday + Math.floor(Math.random() * 10) + 5,
        avgPerformance: Math.max(92, Math.min(98, prev.avgPerformance + (Math.random() - 0.5) * 0.3)),
        customerSatisfaction: Math.max(94, Math.min(99, prev.customerSatisfaction + (Math.random() - 0.5) * 0.2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'on-call': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'break': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'training': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'offline': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 95) return 'text-green-500';
    if (score >= 90) return 'text-blue-500';
    if (score >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color, onClick }) => {
    const getColorClasses = (colorName) => {
      const colorMap = {
        green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20' },
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20' },
        red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' }
      };
      return colorMap[colorName] || colorMap.blue;
    };

    const colors = getColorClasses(color);

    return (
      <div 
        className={`${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-xl rounded-2xl border ${colors.border} p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {title}
          </h3>
          <p className={`text-2xl font-bold ${colors.text} mb-1`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  };

  const TeamMemberCard = ({ member, onClick }) => (
    <div 
      className={`${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-xl rounded-xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
      onClick={() => onClick(member)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl relative">
            {member.avatar}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'} ${
              member.status === 'online' ? 'bg-green-500' :
              member.status === 'on-call' ? 'bg-blue-500' :
              member.status === 'break' ? 'bg-yellow-500' :
              member.status === 'training' ? 'bg-purple-500' :
              'bg-gray-500'
            }`}></div>
          </div>
          <div>
            <h3 className="font-bold text-lg">{member.name}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.role}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>{member.department}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(member.status)}`}>
          {member.status.replace('-', ' ').toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className={`text-xl font-bold ${getPerformanceColor(member.performance)}`}>
            {member.performance}%
          </p>
          <p className="text-xs text-gray-500">Performance</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-500">{member.callsToday}</p>
          <p className="text-xs text-gray-500">Calls Today</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-purple-500">{member.satisfaction}%</p>
          <p className="text-xs text-gray-500">Satisfaction</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>{member.location}</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
            <Mail className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const DepartmentCard = ({ department }) => {
    const getColorClasses = (colorName) => {
      const colorMap = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
        green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20' },
        red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20' }
      };
      return colorMap[colorName] || colorMap.blue;
    };

    const colors = getColorClasses(department.color);

    return (
      <div className={`${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-xl rounded-xl border ${colors.border} p-6 hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{department.name}</h3>
          <div className={`flex items-center text-sm ${department.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {department.growth > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span>{department.growth}%</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className={`text-3xl font-bold ${colors.text} mb-2`}>
            {department.count}
          </p>
          <p className="text-sm text-gray-500">Team Members</p>
        </div>
      </div>
    );
  };

  const renderOverviewContent = () => (
    <div className="space-y-8">
      {/* Team Overview Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50' : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              TEAM HUB
            </h1>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            👥 Enterprise Team Management & Performance Center
          </p>
          <p className="text-sm text-blue-500 font-medium">
            🌍 {teamMetrics.totalMembers} Global Team Members • {teamMetrics.activeToday} Active Today • Real-time Performance Tracking
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <div className="text-5xl font-bold text-green-400 mb-2">
              {teamMetrics.activeToday}
            </div>
            <div className="text-sm font-medium text-green-300">Active Today</div>
            <div className="text-xs text-green-400 mt-1">+12 from yesterday</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
            <div className="text-5xl font-bold text-blue-400 mb-2">
              {teamMetrics.avgPerformance.toFixed(1)}%
            </div>
            <div className="text-sm font-medium text-blue-300">Avg Performance</div>
            <div className="text-xs text-green-400 mt-1">Above target</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
            <div className="text-5xl font-bold text-purple-400 mb-2">
              {(teamMetrics.totalCallsToday / 1000).toFixed(1)}K
            </div>
            <div className="text-sm font-medium text-purple-300">Calls Today</div>
            <div className="text-xs text-green-400 mt-1">On pace for 25K</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
            <div className="text-5xl font-bold text-orange-400 mb-2">
              {teamMetrics.customerSatisfaction.toFixed(1)}%
            </div>
            <div className="text-sm font-medium text-orange-300">Satisfaction</div>
            <div className="text-xs text-green-400 mt-1">Industry leading</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          title="Total Team Members"
          value={teamMetrics.totalMembers}
          subtitle="Across 6 departments"
          trend={8.3}
          color="blue"
          onClick={() => setActiveSection('members')}
        />
        <MetricCard
          icon={Activity}
          title="Performance Score"
          value={`${teamMetrics.avgPerformance.toFixed(1)}%`}
          subtitle="Team average"
          trend={2.1}
          color="green"
          onClick={() => setActiveSection('performance')}
        />
        <MetricCard
          icon={Clock}
          title="Avg Call Duration"
          value={`${Math.floor(teamMetrics.avgCallDuration / 60)}:${(teamMetrics.avgCallDuration % 60).toString().padStart(2, '0')}`}
          subtitle="Minutes per call"
          trend={-1.4}
          color="purple"
          onClick={() => setActiveSection('analytics')}
        />
        <MetricCard
          icon={GraduationCap}
          title="Training Completed"
          value={teamMetrics.trainingsCompleted}
          subtitle="This month"
          trend={15.7}
          color="orange"
          onClick={() => setActiveSection('training')}
        />
      </div>

      {/* Departments Overview */}
      <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <Building className="w-8 h-8 text-blue-500" />
            <span>🏢 Department Overview</span>
          </h3>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
            View All Departments
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {departments.map((department, index) => (
            <DepartmentCard key={index} department={department} />
          ))}
        </div>
      </div>

      {/* Team Status */}
      <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <Activity className="w-8 h-8 text-green-500" />
            <span>📊 Real-time Team Status</span>
          </h3>
          <div className="flex space-x-3">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all">
              Live View
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all">
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="text-3xl font-bold text-green-500 mb-2">{teamMetrics.activeToday}</div>
            <div className="text-sm font-medium text-green-500">🟢 Online</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-500 mb-2">47</div>
            <div className="text-sm font-medium text-blue-500">📞 On Call</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="text-3xl font-bold text-yellow-500 mb-2">{teamMetrics.onBreak}</div>
            <div className="text-sm font-medium text-yellow-500">⏸️ Break</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="text-3xl font-bold text-purple-500 mb-2">15</div>
            <div className="text-sm font-medium text-purple-500">🎓 Training</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
            <div className="text-3xl font-bold text-gray-500 mb-2">{teamMetrics.offline}</div>
            <div className="text-sm font-medium text-gray-500">⚫ Offline</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMembersContent = () => (
    <div className="space-y-8">
      {/* Members Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50/80 to-blue-50/80 border-green-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
              👥 Team Members Directory
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive team management with real-time status and performance tracking
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddMember(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Member</span>
            </button>
            <button             >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                darkMode 
                  ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                  : 'bg-white/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className={`px-4 py-3 rounded-xl border ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                : 'bg-white/50 border-gray-200/50 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-3 rounded-xl border ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                : 'bg-white/50 border-gray-200/50 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="on-call">On Call</option>
            <option value="break">Break</option>
            <option value="training">Training</option>
            <option value="offline">Offline</option>
          </select>
          
          <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
            <Filter className="w-5 h-5" />
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers
          .filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                member.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = filterRole === 'all' || member.role === filterRole;
            const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
            return matchesSearch && matchesRole && matchesStatus;
          })
          .map((member) => (
            <TeamMemberCard key={member.id} member={member} onClick={setSelectedTeamMember} />
          ))}
      </div>

      {/* Quick Stats */}
      <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-purple-500" />
          <span>Team Performance Summary</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-lg bg-green-500/10">
            <div className="text-2xl font-bold text-green-500 mb-1">94.2%</div>
            <div className="text-sm text-gray-500">Avg Performance</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-500/10">
            <div className="text-2xl font-bold text-blue-500 mb-1">18,947</div>
            <div className="text-sm text-gray-500">Total Calls Today</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-500/10">
            <div className="text-2xl font-bold text-purple-500 mb-1">96.8%</div>
            <div className="text-sm text-gray-500">Customer Satisfaction</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-orange-500/10">
            <div className="text-2xl font-bold text-orange-500 mb-1">97.3%</div>
            <div className="text-sm text-gray-500">Certification Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Performance Content
  const renderPerformanceContent = () => (
    <div className="space-y-8">
      {/* Performance Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-purple-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Performance Analytics
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time insights into team performance and productivity
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Today</option>
            </select>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-2xl font-bold text-green-500">94.2%</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Avg Performance</p>
            <div className="mt-2 text-xs text-green-500">+2.1% from last month</div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <Phone className="w-8 h-8 text-blue-500" />
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-2xl font-bold text-blue-500">18,947</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Calls Today</p>
            <div className="mt-2 text-xs text-blue-500">+5.3% from yesterday</div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-orange-500" />
              <span className="text-2xl">⏱️</span>
            </div>
            <h3 className="text-2xl font-bold text-orange-500">14:07</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Avg Call Duration</p>
            <div className="mt-2 text-xs text-orange-500">-1.2% from last week</div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-2xl font-bold text-yellow-500">96.8%</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Customer Satisfaction</p>
            <div className="mt-2 text-xs text-yellow-500">+0.8% from last month</div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trends */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Performance Trends</h3>
            <BarChart3 className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-4">
            {teamMembers.slice(0, 5).map((member, index) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{member.avatar}</div>
                  <div>
                    <div className="font-semibold">{member.name}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.role}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                      style={{ width: `${member.performance}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-purple-500">{member.performance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call Volume Distribution */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Call Volume by Department</h3>
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-4">
            {[
              { dept: 'Sales', calls: 8934, percentage: 47, color: 'blue' },
              { dept: 'Support', calls: 5692, percentage: 30, color: 'green' },
              { dept: 'Customer Success', calls: 2847, percentage: 15, color: 'purple' },
              { dept: 'Operations', calls: 1474, percentage: 8, color: 'orange' }
            ].map((dept, index) => (
              <div key={dept.dept} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{dept.dept}</span>
                  <span className={`text-${dept.color}-500 font-bold`}>{dept.calls.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div 
                    className={`bg-${dept.color}-500 h-3 rounded-full transition-all duration-1000`}
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Performance Details */}
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Team Performance Leaderboard</h3>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-sm text-yellow-500 font-semibold">Top Performers</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Agent</th>
                <th className="text-left py-3 px-4">Performance</th>
                <th className="text-left py-3 px-4">Calls Today</th>
                <th className="text-left py-3 px-4">Satisfaction</th>
                <th className="text-left py-3 px-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers
                .sort((a, b) => b.performance - a.performance)
                .slice(0, 8)
                .map((member, index) => (
                <tr key={member.id} className={`${darkMode ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-200/50 hover:bg-gray-100/30'} border-b transition-all`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                      {index === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                      {index === 2 && <Award className="w-5 h-5 text-orange-500" />}
                      <span className="font-bold">#{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{member.avatar}</div>
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                          style={{ width: `${member.performance}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-green-500">{member.performance}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold">{member.callsToday}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-yellow-500">{member.satisfaction}%</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 text-sm font-semibold">+{(Math.random() * 5).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Analytics Content
  const renderAnalyticsContent = () => (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-700/50' : 'bg-gradient-to-r from-cyan-50/80 to-blue-50/80 border-cyan-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-2">
              Team Analytics
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Deep insights into team productivity and operational efficiency
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
              <option>Real-time</option>
              <option>Hourly</option>
              <option>Daily</option>
            </select>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Generate Insights
            </button>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-4 backdrop-blur-sm text-center`}>
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-red-500">{teamMetrics.activeToday}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Now</div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-4 backdrop-blur-sm text-center`}>
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-yellow-500">847</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Response</div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-4 backdrop-blur-sm text-center`}>
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-green-500">94.2%</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-4 backdrop-blur-sm text-center`}>
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-purple-500">+12.8%</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Growth</div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-4 backdrop-blur-sm text-center`}>
            <div className="text-3xl mb-2">💼</div>
            <div className="text-2xl font-bold text-blue-500">247</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Team</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productivity Heatmap */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Activity Heatmap</h3>
            <Activity className="w-6 h-6 text-cyan-500" />
          </div>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dayIndex) => (
              <div key={day} className="flex items-center space-x-2">
                <div className="w-16 text-sm font-medium">{day.slice(0, 3)}</div>
                <div className="flex space-x-1">
                  {Array.from({ length: 24 }, (_, hourIndex) => {
                    const intensity = Math.random();
                    return (
                      <div
                        key={hourIndex}
                        className={`w-4 h-4 rounded-sm ${
                          intensity > 0.7 ? 'bg-green-500' :
                          intensity > 0.4 ? 'bg-yellow-500' :
                          intensity > 0.2 ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                        title={`${hourIndex}:00 - ${intensity > 0.5 ? 'High' : 'Low'} activity`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-sm">
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            </div>
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>More</span>
          </div>
        </div>

        {/* Department Analytics */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Department Insights</h3>
            <BarChart3 className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-6">
            {[
              { name: 'Sales', efficiency: 97, satisfaction: 95, calls: 8934, color: 'blue', trend: '+8.2%' },
              { name: 'Support', efficiency: 94, satisfaction: 98, calls: 5692, color: 'green', trend: '+5.1%' },
              { name: 'Customer Success', efficiency: 89, satisfaction: 97, calls: 2847, color: 'purple', trend: '+12.4%' },
              { name: 'Operations', efficiency: 92, satisfaction: 93, calls: 1474, color: 'orange', trend: '+3.7%' }
            ].map((dept, index) => (
              <div key={dept.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 bg-${dept.color}-500 rounded-full`}></div>
                    <span className="font-semibold">{dept.name}</span>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">{dept.trend}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Efficiency</div>
                    <div className="font-bold text-cyan-500">{dept.efficiency}%</div>
                  </div>
                  <div>
                    <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Satisfaction</div>
                    <div className="font-bold text-yellow-500">{dept.satisfaction}%</div>
                  </div>
                  <div>
                    <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Calls</div>
                    <div className="font-bold">{dept.calls.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Response Time Analysis */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Response Times</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {[
              { metric: 'Avg First Response', time: '47s', status: 'excellent', color: 'green' },
              { metric: 'Avg Resolution', time: '14m 23s', status: 'good', color: 'blue' },
              { metric: 'Peak Response', time: '1m 34s', status: 'needs improvement', color: 'orange' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{item.metric}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.status}</div>
                </div>
                <div className={`font-bold text-${item.color}-500`}>{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Quality Score</h3>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-yellow-500">96.8</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Quality</div>
          </div>
          <div className="space-y-3">
            {[
              { metric: 'Communication', score: 98 },
              { metric: 'Problem Solving', score: 96 },
              { metric: 'Compliance', score: 97 }
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.metric}</span>
                  <span className="font-semibold">{item.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Predictions */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">AI Predictions</h3>
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-4">
            {[
              { prediction: 'Call volume will increase 15% next week', confidence: 89, type: 'high' },
              { prediction: 'Performance trending upward', confidence: 94, type: 'positive' },
              { prediction: 'Need 3 more support agents by month-end', confidence: 76, type: 'neutral' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.prediction}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence</span>
                  <span className={`font-semibold ${
                    item.confidence > 90 ? 'text-green-500' :
                    item.confidence > 75 ? 'text-yellow-500' : 'text-orange-500'
                  }`}>{item.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                  <div 
                    className={`h-1 rounded-full transition-all duration-1000 ${
                      item.confidence > 90 ? 'bg-green-500' :
                      item.confidence > 75 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${item.confidence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Training Content
  const renderTrainingContent = () => (
    <div className="space-y-8">
      {/* Training Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-700/50' : 'bg-gradient-to-r from-orange-50/80 to-red-50/80 border-orange-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              Training & Development
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive learning management and skill development platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Create Course
            </button>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Training Report
            </button>
          </div>
        </div>

        {/* Training Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-2xl font-bold text-blue-500">89</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Trainings Completed</p>
            <div className="mt-2 text-xs text-blue-500">+12 this week</div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-2xl font-bold text-yellow-500">97.3%</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Certification Rate</p>
            <div className="mt-2 text-xs text-yellow-500">+2.1% this month</div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-green-500" />
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-green-500">127</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Available Courses</p>
            <div className="mt-2 text-xs text-green-500">+5 new courses</div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-purple-500" />
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-2xl font-bold text-purple-500">47.3h</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Avg Training Time</p>
            <div className="mt-2 text-xs text-purple-500">-2.1h from last month</div>
          </div>
        </div>
      </div>

      {/* Training Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Courses */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Active Courses</h3>
            <BookOpen className="w-6 h-6 text-orange-500" />
          </div>
          <div className="space-y-4">
            {[
              { title: 'Advanced TCPA Compliance', progress: 78, students: 23, difficulty: 'Advanced', duration: '6h' },
              { title: 'AI Voice Optimization', progress: 45, students: 34, difficulty: 'Intermediate', duration: '4h' },
              { title: 'Customer Success Strategies', progress: 92, students: 18, difficulty: 'Beginner', duration: '3h' },
              { title: 'Leadership in Remote Teams', progress: 23, students: 12, difficulty: 'Advanced', duration: '8h' }
            ].map((course, index) => (
              <div key={index} className={`${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-100/30 hover:bg-gray-100/50'} rounded-xl p-4 transition-all cursor-pointer`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{course.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    course.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-500' :
                    course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-green-500/20 text-green-500'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.students} students</span>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.duration}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Tracking */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Certifications</h3>
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'TCPA Expert', holders: 45, total: 247, color: 'blue', icon: '🛡️' },
              { name: 'AI Specialist', holders: 89, total: 247, color: 'purple', icon: '🤖' },
              { name: 'Sales Pro', holders: 67, total: 247, color: 'green', icon: '💼' },
              { name: 'Leadership', holders: 23, total: 247, color: 'orange', icon: '👑' },
              { name: 'Quality Expert', holders: 34, total: 247, color: 'yellow', icon: '⭐' }
            ].map((cert, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{cert.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{cert.name}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {cert.holders}/{cert.total} certified
                      </div>
                    </div>
                  </div>
                  <span className={`text-${cert.color}-500 font-bold text-sm`}>
                    {Math.round((cert.holders / cert.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className={`bg-${cert.color}-500 h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${(cert.holders / cert.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Calendar */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Upcoming Sessions</h3>
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-4">
            {[
              { title: 'TCPA Compliance Workshop', date: 'Nov 29', time: '2:00 PM', attendees: 23, type: 'workshop' },
              { title: 'AI Voice Training', date: 'Dec 1', time: '10:00 AM', attendees: 45, type: 'training' },
              { title: 'Leadership Seminar', date: 'Dec 3', time: '3:00 PM', attendees: 12, type: 'seminar' },
              { title: 'Customer Success Bootcamp', date: 'Dec 5', time: '9:00 AM', attendees: 34, type: 'bootcamp' }
            ].map((session, index) => (
              <div key={index} className={`${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-100/30 hover:bg-gray-100/50'} rounded-xl p-4 transition-all cursor-pointer`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{session.title}</h4>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {session.date} at {session.time}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    session.type === 'workshop' ? 'bg-blue-500/20 text-blue-500' :
                    session.type === 'training' ? 'bg-green-500/20 text-green-500' :
                    session.type === 'seminar' ? 'bg-purple-500/20 text-purple-500' :
                    'bg-orange-500/20 text-orange-500'
                  }`}>
                    {session.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {session.attendees} registered
                    </span>
                  </div>
                  <button className="text-blue-500 text-xs font-semibold hover:underline">
                    Join Session
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all">
            View Full Calendar
          </button>
        </div>
      </div>

      {/* Individual Progress Tracking */}
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-xl`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Individual Progress</h3>
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-green-500" />
            <span className="text-sm text-green-500 font-semibold">Goal: 95% Completion</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <th className="text-left py-3 px-4">Team Member</th>
                <th className="text-left py-3 px-4">Active Courses</th>
                <th className="text-left py-3 px-4">Completed</th>
                <th className="text-left py-3 px-4">Certifications</th>
                <th className="text-left py-3 px-4">Progress</th>
                <th className="text-left py-3 px-4">Next Deadline</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.slice(0, 6).map((member, index) => (
                <tr key={member.id} className={`${darkMode ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-200/50 hover:bg-gray-100/30'} border-b transition-all`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{member.avatar}</div>
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-blue-500">{Math.floor(Math.random() * 4) + 1}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-green-500">{Math.floor(Math.random() * 15) + 5}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-1">
                      {member.certifications.slice(0, 2).map((cert, certIndex) => (
                        <span key={certIndex} className="text-xl" title={cert}>
                          {certIndex === 0 ? '🛡️' : certIndex === 1 ? '🤖' : '💼'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-orange-500 text-sm">{Math.floor(Math.random() * 40) + 60}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Dec {Math.floor(Math.random() * 10) + 1}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderComingSoonContent = (title, description, color, icon) => (
    <div className="space-y-8">
      <div className={`${darkMode ? `bg-gradient-to-r from-${color}-900/30 to-${color}-900/30 border-${color}-700/50` : `bg-gradient-to-r from-${color}-50/80 to-${color}-50/80 border-${color}-200/50`} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold bg-gradient-to-r from-${color}-500 to-${color}-500 bg-clip-text text-transparent mb-4`}>
            {title}
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
      </div>

      <div className="text-center py-16">
        <div className={`w-20 h-20 bg-gradient-to-r from-${color}-500 to-${color}-500 rounded-full flex items-center justify-center mx-auto mb-6`}>
          {React.createElement(icon, { className: "w-10 h-10 text-white" })}
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
          {description}
        </p>
        <button className={`bg-gradient-to-r from-${color}-500 to-${color}-500 hover:from-${color}-600 hover:to-${color}-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105`}>
          🎯 Coming Soon
        </button>
      </div>
    </div>
  );

  // Team Member Detail Modal
  const TeamMemberModal = ({ member, onClose }) => {
    if (!member) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl relative">
                {member.avatar}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'} ${
                  member.status === 'online' ? 'bg-green-500' :
                  member.status === 'on-call' ? 'bg-blue-500' :
                  member.status === 'break' ? 'bg-yellow-500' :
                  member.status === 'training' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{member.name}</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.role}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>{member.department}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(member.status)}`}>
                  {member.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
              <div className={`text-2xl font-bold ${getPerformanceColor(member.performance)} mb-1`}>
                {member.performance}%
              </div>
              <div className="text-sm text-gray-500">Performance Score</div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
              <div className="text-2xl font-bold text-blue-500 mb-1">{member.callsToday}</div>
              <div className="text-sm text-gray-500">Calls Today</div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
              <div className="text-2xl font-bold text-purple-500 mb-1">{member.satisfaction}%</div>
              <div className="text-sm text-gray-500">Customer Satisfaction</div>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
              <div className="text-2xl font-bold text-orange-500 mb-1">
                {Math.floor(member.avgCallDuration / 60)}:{(member.avgCallDuration % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-500">Avg Call Duration</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-500" />
                  <span>{member.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <span>{member.location} ({member.timezone})</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Skills & Certifications</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {member.certifications.map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Send Message</span>
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewContent();
      case 'members':
        return renderMembersContent();
      case 'performance':
        return renderPerformanceContent();
      case 'analytics':
        return renderAnalyticsContent();
      case 'training':
        return renderTrainingContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50'} border-b px-6 py-4 backdrop-blur-xl sticky top-0 z-30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Team Hub
                </h1>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-500 font-medium">{teamMetrics.activeToday} Active</span>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>•</span>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{teamMetrics.totalMembers} Total Members</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-64 px-4 py-2 pl-10 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <button className={`p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-all relative`}>
              <Bell className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                7
              </div>
            </button>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
              Team Report
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-6 mt-6 border-b border-gray-700/30 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'members', label: 'Team Members', icon: UserCheck },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'training', label: 'Training', icon: GraduationCap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeSection === id
                  ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/30'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {renderContent()}
      </main>

      {/* Team Member Detail Modal */}
      {selectedTeamMember && (
        <TeamMemberModal 
          member={selectedTeamMember} 
          onClose={() => setSelectedTeamMember(null)} 
        />
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-2xl w-full`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Add New Team Member</h2>
              <button 
                onClick={() => setShowAddMember(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                        : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="john.doe@vocelio.ai"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                        : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className={`px-6 py-3 rounded-xl ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  } transition-all`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all transform hover:scale-105"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamHubDashboard;