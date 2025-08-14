import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Clock, Eye, FileText,
  Users, Phone, Lock, Database, Globe, Bell, TrendingUp, TrendingDown,
  Download, Upload, Search, Filter, MoreHorizontal, Play, Pause,
  Calendar, Book, Award, Target, Zap, Activity, BarChart3, PieChart,
  AlertCircle, Info, Settings, RefreshCw, ExternalLink, Flag,
  Gavel, Scale, UserCheck, FileCheck, ShieldCheck, KeyRound,
  Building, MapPin, Smartphone, Monitor, Headphones, Mic,
  Archive, Trash2, Edit, Plus, X, ChevronDown, ChevronRight,
  Star, Heart, ThumbsUp, Mail, MessageSquare, Video, Briefcase, User
} from 'lucide-react';

const ComplianceDashboard = ({ darkMode = true }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAlerts, setShowAlerts] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Live compliance metrics with real-time updates
  const [complianceMetrics, setComplianceMetrics] = useState({
    overallScore: 100.0,
    activeAudits: 12,
    policyViolations: 0,
    dataRetentionCompliance: 100.0,
    consentVerificationRate: 99.94,
    dncCompliance: 100.0,
    trainingCompletion: 97.8,
    riskLevel: 'LOW',
    certificationsActive: 8,
    totalCallsMonitored: 2847593,
    complianceChecksToday: 47832,
    lastAuditDate: '2024-11-28',
    nextAuditDue: '2024-12-15'
  });

  const [alerts] = useState([
    {
      id: 1,
      type: 'info',
      severity: 'low',
      title: 'Training Renewal Due',
      message: '15 agents require TCPA compliance training renewal within 7 days',
      timestamp: '2024-11-28T10:30:00Z',
      status: 'active',
      category: 'training'
    },
    {
      id: 2,
      type: 'success',
      severity: 'info',
      title: 'SOC 2 Audit Passed',
      message: 'Annual SOC 2 Type II audit completed successfully with zero findings',
      timestamp: '2024-11-28T09:15:00Z',
      status: 'resolved',
      category: 'audit'
    },
    {
      id: 3,
      type: 'warning',
      severity: 'medium',
      title: 'New TCPA Regulation',
      message: 'Updated TCPA guidelines effective January 1, 2025 - Review required',
      timestamp: '2024-11-28T08:45:00Z',
      status: 'active',
      category: 'regulatory'
    },
    {
      id: 4,
      type: 'success',
      severity: 'info',
      title: 'DNC Sync Complete',
      message: 'National DNC Registry synchronized - 2.3M numbers updated',
      timestamp: '2024-11-28T07:20:00Z',
      status: 'resolved',
      category: 'dnc'
    }
  ]);

  const [regulatoryFrameworks] = useState([
    {
      id: 'tcpa',
      name: 'TCPA',
      fullName: 'Telephone Consumer Protection Act',
      status: 'compliant',
      score: 100,
      jurisdiction: 'United States',
      lastReview: '2024-11-25',
      nextReview: '2024-12-25',
      requirements: 47,
      violations: 0,
      riskLevel: 'low'
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      status: 'compliant',
      score: 100,
      jurisdiction: 'European Union',
      lastReview: '2024-11-20',
      nextReview: '2024-12-20',
      requirements: 83,
      violations: 0,
      riskLevel: 'low'
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      fullName: 'Health Insurance Portability and Accountability Act',
      status: 'compliant',
      score: 100,
      jurisdiction: 'United States',
      lastReview: '2024-11-22',
      nextReview: '2024-12-22',
      requirements: 34,
      violations: 0,
      riskLevel: 'low'
    },
    {
      id: 'ccpa',
      name: 'CCPA',
      fullName: 'California Consumer Privacy Act',
      status: 'compliant',
      score: 100,
      jurisdiction: 'California, USA',
      lastReview: '2024-11-18',
      nextReview: '2024-12-18',
      requirements: 29,
      violations: 0,
      riskLevel: 'low'
    },
    {
      id: 'soc2',
      name: 'SOC 2',
      fullName: 'System and Organization Controls 2',
      status: 'compliant',
      score: 100,
      jurisdiction: 'United States',
      lastReview: '2024-11-15',
      nextReview: '2025-11-15',
      requirements: 67,
      violations: 0,
      riskLevel: 'low'
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      fullName: 'Information Security Management',
      status: 'compliant',
      score: 100,
      jurisdiction: 'International',
      lastReview: '2024-11-10',
      nextReview: '2025-11-10',
      requirements: 114,
      violations: 0,
      riskLevel: 'low'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setComplianceMetrics(prev => ({
        ...prev,
        totalCallsMonitored: prev.totalCallsMonitored + Math.floor(Math.random() * 50) + 10,
        complianceChecksToday: prev.complianceChecksToday + Math.floor(Math.random() * 20) + 5,
        consentVerificationRate: Math.max(99.8, Math.min(100, prev.consentVerificationRate + (Math.random() - 0.5) * 0.1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color, onClick }) => {
    const getColorClasses = (colorName) => {
      const colorMap = {
        green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20' },
        red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' }
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
          {trend && (
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

  const ComplianceFrameworkCard = ({ framework }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'compliant': return 'text-green-500 bg-green-500/10 border-green-500/20';
        case 'warning': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        case 'violation': return 'text-red-500 bg-red-500/10 border-red-500/20';
        default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      }
    };

    return (
      <div className={`${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-xl rounded-xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6 hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold">{framework.name}</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(framework.status)}`}>
                {framework.status.toUpperCase()}
              </div>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
              {framework.fullName}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {framework.jurisdiction}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${framework.score === 100 ? 'text-green-500' : framework.score >= 95 ? 'text-yellow-500' : 'text-red-500'}`}>
              {framework.score}%
            </div>
            <p className="text-xs text-gray-500">Compliance Score</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-blue-500">{framework.requirements}</p>
            <p className="text-xs text-gray-500">Requirements</p>
          </div>
          <div>
            <p className={`text-sm font-medium ${framework.violations === 0 ? 'text-green-500' : 'text-red-500'}`}>
              {framework.violations}
            </p>
            <p className="text-xs text-gray-500">Violations</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last Review: {new Date(framework.lastReview).toLocaleDateString()}</span>
          <span>Next: {new Date(framework.nextReview).toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  const AlertItem = ({ alert }) => {
    const getAlertColor = (type) => {
      switch (type) {
        case 'success': return 'border-green-500/30 bg-green-500/5';
        case 'warning': return 'border-yellow-500/30 bg-yellow-500/5';
        case 'error': return 'border-red-500/30 bg-red-500/5';
        default: return 'border-blue-500/30 bg-blue-500/5';
      }
    };

    const getAlertIcon = (type) => {
      switch (type) {
        case 'success': return CheckCircle;
        case 'warning': return AlertTriangle;
        case 'error': return XCircle;
        default: return Info;
      }
    };

    const AlertIcon = getAlertIcon(alert.type);

    return (
      <div className={`border rounded-xl p-4 ${getAlertColor(alert.type)} mb-3`}>
        <div className="flex items-start space-x-3">
          <AlertIcon className={`w-5 h-5 mt-0.5 ${
            alert.type === 'success' ? 'text-green-500' :
            alert.type === 'warning' ? 'text-yellow-500' :
            alert.type === 'error' ? 'text-red-500' : 'text-blue-500'
          }`} />
          <div className="flex-1">
            <h4 className="font-medium mb-1">{alert.title}</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              {alert.message}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(alert.timestamp).toLocaleString()}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.status === 'active' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'
                }`}>
                  {alert.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.category === 'training' ? 'bg-purple-500/10 text-purple-500' :
                  alert.category === 'audit' ? 'bg-blue-500/10 text-blue-500' :
                  alert.category === 'regulatory' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-green-500/10 text-green-500'
                }`}>
                  {alert.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewContent = () => (
    <div className="space-y-8">
      {/* Global Compliance Status Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              100% COMPLIANT
            </h1>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            🛡️ Enterprise Compliance Management System
          </p>
          <p className="text-sm text-green-500 font-medium">
            🌍 Global Regulatory Compliance • Real-time Monitoring • Zero Violations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <div className="text-5xl font-bold text-green-400 mb-2">
              {complianceMetrics.overallScore}%
            </div>
            <div className="text-sm font-medium text-green-300">Overall Compliance</div>
            <div className="text-xs text-green-400 mt-1">Perfect Score</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
            <div className="text-5xl font-bold text-blue-400 mb-2">
              {complianceMetrics.activeAudits}
            </div>
            <div className="text-sm font-medium text-blue-300">Active Audits</div>
            <div className="text-xs text-green-400 mt-1">All On Track</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
            <div className="text-5xl font-bold text-purple-400 mb-2">
              {complianceMetrics.policyViolations}
            </div>
            <div className="text-sm font-medium text-purple-300">Policy Violations</div>
            <div className="text-xs text-green-400 mt-1">Zero Incidents</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
            <div className="text-5xl font-bold text-orange-400 mb-2">
              {complianceMetrics.certificationsActive}
            </div>
            <div className="text-sm font-medium text-orange-300">Active Certifications</div>
            <div className="text-xs text-green-400 mt-1">All Current</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={ShieldCheck}
          title="Data Retention"
          value={`${complianceMetrics.dataRetentionCompliance}%`}
          subtitle="Policy compliance"
          trend={0.2}
          color="green"
          onClick={() => setActiveSection('data-protection')}
        />
        <MetricCard
          icon={UserCheck}
          title="Consent Verification"
          value={`${complianceMetrics.consentVerificationRate.toFixed(2)}%`}
          subtitle={`${complianceMetrics.totalCallsMonitored.toLocaleString()} calls monitored`}
          trend={0.1}
          color="blue"
          onClick={() => setActiveSection('consent')}
        />
        <MetricCard
          icon={Phone}
          title="DNC Compliance"
          value={`${complianceMetrics.dncCompliance}%`}
          subtitle="Do Not Call registry"
          trend={0}
          color="green"
          onClick={() => setActiveSection('dnc')}
        />
        <MetricCard
          icon={Award}
          title="Training Completion"
          value={`${complianceMetrics.trainingCompletion}%`}
          subtitle="Team certification rate"
          trend={2.3}
          color="purple"
          onClick={() => setActiveSection('training')}
        />
      </div>

      {/* Regulatory Frameworks */}
      <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <Gavel className="w-8 h-8 text-blue-500" />
            <span>📋 Regulatory Framework Compliance</span>
          </h3>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
            View All Frameworks
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {regulatoryFrameworks.slice(0, 6).map((framework) => (
            <ComplianceFrameworkCard key={framework.id} framework={framework} />
          ))}
        </div>
      </div>

      {/* Live Alerts */}
      <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <Bell className="w-8 h-8 text-orange-500" />
            <span>🚨 Live Compliance Alerts</span>
            <div className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full">
              {alerts.filter(a => a.status === 'active').length} Active
            </div>
          </h3>
          <div className="flex space-x-3">
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                autoRefresh 
                  ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                  : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
              }`}
            >
              {autoRefresh ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all">
              View All Alerts
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderDNCContent = () => (
    <div className="space-y-8">
      <div className={`${darkMode ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-700/50' : 'bg-gradient-to-r from-red-50/80 to-orange-50/80 border-red-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
            🚫 Do Not Call Management
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Advanced DNC compliance with real-time monitoring and automatic enforcement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-sm font-medium text-green-300">DNC Compliance</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
            <div className="text-4xl font-bold text-blue-400 mb-2">2.3M</div>
            <div className="text-sm font-medium text-blue-300">Numbers Checked</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
            <div className="text-4xl font-bold text-purple-400 mb-2">0</div>
            <div className="text-sm font-medium text-purple-300">Violations</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
            <div className="text-4xl font-bold text-orange-400 mb-2">15</div>
            <div className="text-sm font-medium text-orange-300">States Monitored</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Database className="w-6 h-6 text-blue-500" />
            <span>DNC Registry Management</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="font-medium">National DNC Registry</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-500 text-sm">Synced</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="font-medium">State DNC Registries</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-500 text-sm">All Current</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="font-medium">Custom Suppression Lists</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-500 text-sm">247 Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Activity className="w-6 h-6 text-green-500" />
            <span>Real-time Monitoring</span>
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Today's Checks</span>
                <span className="text-2xl font-bold text-blue-500">{complianceMetrics.complianceChecksToday.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Numbers Scrubbed</span>
                <span className="text-2xl font-bold text-purple-500">847,293</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex justify-between items-center">
                <span className="font-medium">Violations Detected</span>
                <span className="text-2xl font-bold text-green-500">0</span>
              </div>
              <p className="text-sm text-green-500 mt-1">Perfect compliance record</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsentContent = () => (
    <div className="space-y-8">
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50' : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
            ✅ Consent Management Center
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Comprehensive consent tracking, verification, and documentation system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <div className="text-4xl font-bold text-green-400 mb-2">{complianceMetrics.consentVerificationRate.toFixed(1)}%</div>
            <div className="text-sm font-medium text-green-300">Verification Rate</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
            <div className="text-4xl font-bold text-blue-400 mb-2">2.8M</div>
            <div className="text-sm font-medium text-blue-300">Consents Tracked</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
            <div className="text-4xl font-bold text-purple-400 mb-2">847</div>
            <div className="text-sm font-medium text-purple-300">Pending Reviews</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
            <div className="text-4xl font-bold text-orange-400 mb-2">23</div>
            <div className="text-sm font-medium text-orange-300">Expiring Soon</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FileCheck className="w-6 h-6 text-green-500" />
            <span>Consent Types</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10">
              <span>Written Consent</span>
              <span className="font-bold text-green-500">2.1M</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10">
              <span>Verbal Consent</span>
              <span className="font-bold text-blue-500">687K</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10">
              <span>Digital Consent</span>
              <span className="font-bold text-purple-500">423K</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/10">
              <span>Opt-in Forms</span>
              <span className="font-bold text-orange-500">289K</span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-yellow-500" />
            <span>Expiration Tracking</span>
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Expired</span>
                <span className="text-red-500 font-bold">0</span>
              </div>
              <p className="text-sm text-red-500">No expired consents</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Expiring (30 days)</span>
                <span className="text-yellow-500 font-bold">23</span>
              </div>
              <p className="text-sm text-yellow-500">Renewal required</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Valid</span>
                <span className="text-green-500 font-bold">2.8M</span>
              </div>
              <p className="text-sm text-green-500">All current</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Archive className="w-6 h-6 text-blue-500" />
            <span>Documentation</span>
          </h3>
          <div className="space-y-3">
            <button className="w-full p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors text-left">
              <div className="flex justify-between items-center">
                <span>Audit Trail</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
            <button className="w-full p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors text-left">
              <div className="flex justify-between items-center">
                <span>Compliance Reports</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
            <button className="w-full p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors text-left">
              <div className="flex justify-between items-center">
                <span>Source Verification</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
            <button className="w-full p-3 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-colors text-left">
              <div className="flex justify-between items-center">
                <span>Legal Documentation</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataProtectionContent = () => (
    <div className="space-y-8">
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-purple-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            🔒 Data Protection & Privacy
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            GDPR, CCPA, HIPAA compliance with advanced privacy controls
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-sm font-medium text-green-300">Data Retention</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
            <div className="text-4xl font-bold text-blue-400 mb-2">47</div>
            <div className="text-sm font-medium text-blue-300">Privacy Requests</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
            <div className="text-4xl font-bold text-purple-400 mb-2">0</div>
            <div className="text-sm font-medium text-purple-300">Breaches</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
            <div className="text-4xl font-bold text-orange-400 mb-2">256</div>
            <div className="text-sm font-medium text-orange-300">Encryption Level</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Lock className="w-6 h-6 text-purple-500" />
            <span>Privacy Rights Management</span>
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Right to Access</span>
                <span className="text-blue-500 font-bold">23 Requests</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
              </div>
              <p className="text-sm text-blue-500 mt-1">Avg response: 2.3 days</p>
            </div>
            
            <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Right to Erasure</span>
                <span className="text-green-500 font-bold">12 Requests</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              <p className="text-sm text-green-500 mt-1">All completed within SLA</p>
            </div>
            
            <div className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Data Portability</span>
                <span className="text-purple-500 font-bold">8 Requests</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
              <p className="text-sm text-purple-500 mt-1">Automated exports</p>
            </div>
            
            <div className="p-4 rounded-lg border border-orange-500/20 bg-orange-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Rectification</span>
                <span className="text-orange-500 font-bold">4 Requests</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
              <p className="text-sm text-orange-500 mt-1">Real-time updates</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            <span>Security Controls</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">End-to-End Encryption</span>
              </div>
              <span className="text-green-500 font-bold">AES-256</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Data Masking</span>
              </div>
              <span className="text-green-500 font-bold">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Access Controls</span>
              </div>
              <span className="text-green-500 font-bold">RBAC</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Audit Logging</span>
              </div>
              <span className="text-green-500 font-bold">Complete</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Data Anonymization</span>
              </div>
              <span className="text-green-500 font-bold">Automated</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Breach Detection</span>
              </div>
              <span className="text-green-500 font-bold">24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrainingContent = () => (
    <div className="space-y-8">
      <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50/80 to-blue-50/80 border-green-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
            🎓 Compliance Training Center
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Comprehensive compliance education and certification management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <div className="text-4xl font-bold text-green-400 mb-2">{complianceMetrics.trainingCompletion}%</div>
            <div className="text-sm font-medium text-green-300">Completion Rate</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
            <div className="text-4xl font-bold text-blue-400 mb-2">247</div>
            <div className="text-sm font-medium text-blue-300">Certified Agents</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
            <div className="text-4xl font-bold text-purple-400 mb-2">15</div>
            <div className="text-sm font-medium text-purple-300">Active Courses</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
            <div className="text-4xl font-bold text-orange-400 mb-2">23</div>
            <div className="text-sm font-medium text-orange-300">Renewals Due</div>
          </div>
        </div>

        {/* Training Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Available Courses */}
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Book className="w-6 h-6 text-blue-500" />
              <span>Available Courses</span>
            </h3>
            <div className="space-y-4">
              {[
                { 
                  title: 'TCPA Fundamentals', 
                  duration: '45 min', 
                  level: 'Beginner', 
                  completed: false,
                  description: 'Essential TCPA compliance knowledge'
                },
                { 
                  title: 'Advanced GDPR Compliance', 
                  duration: '90 min', 
                  level: 'Advanced', 
                  completed: true,
                  description: 'Deep dive into GDPR requirements'
                },
                { 
                  title: 'AI Ethics in Communication', 
                  duration: '60 min', 
                  level: 'Intermediate', 
                  completed: false,
                  description: 'Ethical AI usage in customer communication'
                },
                { 
                  title: 'Data Breach Response', 
                  duration: '30 min', 
                  level: 'Beginner', 
                  completed: true,
                  description: 'How to handle security incidents'
                }
              ].map((course, index) => (
                <div key={index} className={`p-4 rounded-xl border ${
                  course.completed 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50' 
                    : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600/50'
                } transition-all cursor-pointer hover:shadow-md`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{course.title}</h4>
                    {course.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {course.level}
                      </span>
                      <span className="text-gray-500">{course.duration}</span>
                    </div>
                    <button className={`text-xs font-semibold ${
                      course.completed ? 'text-green-500' : 'text-blue-500 hover:underline'
                    }`}>
                      {course.completed ? 'Completed' : 'Start Course'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracking */}
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <span>Your Progress</span>
            </h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">67%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Completion</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3 dark:bg-gray-700">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Courses Completed</span>
                    <span className="text-sm text-green-500 font-semibold">8/12</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Certifications Earned</span>
                    <span className="text-sm text-blue-500 font-semibold">3/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Time Invested</span>
                    <span className="text-sm text-purple-500 font-semibold">12.5 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'} border rounded-xl p-4`}>
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-blue-500" />
                  <div>
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">Next Milestone</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Complete 2 more courses to earn Advanced Compliance certification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Award className="w-6 h-6 text-yellow-500" />
              <span>Certifications</span>
            </h3>
            <div className="space-y-4">
              {[
                { 
                  name: 'TCPA Compliance Expert', 
                  earned: true, 
                  date: '2024-10-15',
                  validUntil: '2025-10-15',
                  icon: '🛡️'
                },
                { 
                  name: 'GDPR Specialist', 
                  earned: true, 
                  date: '2024-09-22',
                  validUntil: '2025-09-22',
                  icon: '🔒'
                },
                { 
                  name: 'AI Ethics Certified', 
                  earned: true, 
                  date: '2024-11-03',
                  validUntil: '2025-11-03',
                  icon: '🤖'
                },
                { 
                  name: 'Advanced Compliance', 
                  earned: false, 
                  progress: 60,
                  icon: '🏆'
                },
                { 
                  name: 'Data Security Master', 
                  earned: false, 
                  progress: 20,
                  icon: '🔐'
                }
              ].map((cert, index) => (
                <div key={index} className={`p-4 rounded-xl border ${
                  cert.earned 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50' 
                    : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600/50'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{cert.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{cert.name}</h4>
                      {cert.earned ? (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          <div>Earned: {cert.date}</div>
                          <div>Valid until: {cert.validUntil}</div>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="font-semibold">{cert.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-600">
                            <div 
                              className="bg-blue-500 h-1 rounded-full transition-all duration-1000"
                              style={{ width: `${cert.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    {cert.earned && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold transition-colors">
              View All Certifications
            </button>
          </div>
        </div>

        {/* Upcoming Training Sessions */}
        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-purple-500" />
            <span>Upcoming Training Sessions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'TCPA Updates 2024',
                date: 'Dec 5, 2024',
                time: '2:00 PM EST',
                type: 'Live Webinar',
                instructor: 'Sarah Mitchell',
                capacity: '150 spots',
                registered: 127
              },
              {
                title: 'AI Compliance Workshop',
                date: 'Dec 12, 2024',
                time: '10:00 AM EST',
                type: 'Interactive Workshop',
                instructor: 'Dr. James Chen',
                capacity: '50 spots',
                registered: 23
              },
              {
                title: 'GDPR Advanced Topics',
                date: 'Dec 18, 2024',
                time: '3:00 PM EST',
                type: 'Certification Course',
                instructor: 'Maria Rodriguez',
                capacity: '100 spots',
                registered: 67
              }
            ].map((session, index) => (
              <div key={index} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'} hover:shadow-lg transition-all`}>
                <div className="mb-4">
                  <h4 className="font-bold text-lg mb-2">{session.title}</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{session.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Registration</span>
                    <span className="font-semibold">{session.registered}/{session.capacity.split(' ')[0]}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(session.registered / parseInt(session.capacity.split(' ')[0])) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    session.type === 'Live Webinar' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                    session.type === 'Interactive Workshop' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                    {session.type}
                  </span>
                  <button className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewContent();
      case 'dnc':
        return renderDNCContent();
      case 'consent':
        return renderConsentContent();
      case 'data-protection':
        return renderDataProtectionContent();
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
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Compliance Center
                </h1>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-500 font-medium">100% Compliant</span>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>•</span>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real-time Monitoring</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search compliance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-64 px-4 py-2 pl-10 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all`}
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <button 
              onClick={() => setShowAlerts(!showAlerts)}
              className={`p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-all relative`}
            >
              <Bell className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                {alerts.filter(a => a.status === 'active').length}
              </div>
            </button>
            
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
              Generate Report
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-6 mt-6 border-b border-gray-700/30 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'dnc', label: 'DNC Management', icon: Phone },
            { id: 'consent', label: 'Consent Center', icon: UserCheck },
            { id: 'data-protection', label: 'Data Protection', icon: Lock },
            { id: 'training', label: 'Training', icon: Book }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeSection === id
                  ? 'bg-green-500/20 text-green-500 border border-green-500/30'
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
    </div>
  );
};

export default ComplianceDashboard;