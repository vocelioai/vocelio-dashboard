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
        return renderComingSoonContent(
          '📈 Performance Analytics',
          'Advanced performance tracking and optimization insights',
          'purple',
          BarChart3
        );
      case 'analytics':
        return renderComingSoonContent(
          '📊 Team Analytics',
          'Deep insights into team productivity and operational efficiency',
          'cyan',
          Activity
        );
      case 'training':
        return renderComingSoonContent(
          '🎓 Training & Development',
          'Comprehensive learning management and skill development platform',
          'orange',
          GraduationCap
        );
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