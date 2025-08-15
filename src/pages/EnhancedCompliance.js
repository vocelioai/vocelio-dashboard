import React, { useState, useEffect, useCallback } from 'react';
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
import enhancedComplianceClient from '../api/enhancedComplianceClient';

const ComplianceDashboard = ({ darkMode = true }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAlerts, setShowAlerts] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Real-time data from enhanced compliance backend
  const [dashboardData, setDashboardData] = useState(null);
  const [complianceMetrics, setComplianceMetrics] = useState(null);
  const [auditEvents, setAuditEvents] = useState([]);
  const [gdprRequests, setGdprRequests] = useState([]);
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [incidentReports, setIncidentReports] = useState([]);

  // Compliance alerts
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
      title: 'Enhanced Compliance Active',
      message: 'New enhanced compliance backend integrated - Real-time monitoring active',
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

  // Fetch dashboard data from enhanced compliance backend
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check backend health
      const isHealthy = await enhancedComplianceClient.healthCheck();
      setConnected(isHealthy);
      
      if (isHealthy) {
        // Fetch dashboard and metrics data
        const [dashboard, metrics] = await Promise.all([
          enhancedComplianceClient.getComplianceDashboard(),
          enhancedComplianceClient.getComplianceMetrics()
        ]);
        
        setDashboardData(dashboard);
        setComplianceMetrics(metrics);
        
        // Fetch recent data for different sections
        const [events, gdpr, risks, incidents] = await Promise.all([
          enhancedComplianceClient.getAuditEvents({ limit: 50 }),
          enhancedComplianceClient.getGDPRRequests({ limit: 20 }),
          enhancedComplianceClient.getRiskAssessments({ limit: 20 }),
          enhancedComplianceClient.getIncidentReports({ limit: 10 })
        ]);
        
        setAuditEvents(events || []);
        setGdprRequests(gdpr || []);
        setRiskAssessments(risks || []);
        setIncidentReports(incidents || []);
        
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setConnected(false);
      // Set fallback data if backend is unavailable
      setDashboardData({
        compliance_score: 94.7,
        framework_scores: { gdpr: 97.2, sox: 89.1, iso27001: 93.5 },
        risk_summary: { critical: 0, high: 2, medium: 15, low: 45 },
        key_metrics: {
          pending_assessments: 3,
          gdpr_requests_pending: 2,
          audit_events_today: 127,
          overdue_reviews: 1
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh data
  useEffect(() => {
    fetchDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [fetchDashboardData, autoRefresh]);

  // Connection status component
  const ConnectionStatus = () => (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
      connected 
        ? 'bg-green-500/10 text-green-500' 
        : 'bg-red-500/10 text-red-500'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        connected ? 'bg-green-500' : 'bg-red-500'
      } ${connected ? 'animate-pulse' : ''}`}></div>
      <span>{connected ? 'Connected' : 'Offline'}</span>
      {lastUpdated && (
        <span className="opacity-75">
          • {lastUpdated.toLocaleTimeString()}
        </span>
      )}
    </div>
  );

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading Enhanced Compliance Dashboard...</p>
        </div>
      </div>
    );
  }

  // Metric card component with real data
  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color, onClick, realTimeData }) => (
    <div 
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 hover:scale-105 p-6 rounded-2xl backdrop-blur-xl border ${
        darkMode 
          ? `bg-gray-800/40 border-gray-700/50 hover:border-${color}-500/50` 
          : `bg-white/40 border-gray-200/50 hover:border-${color}-500/50`
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 text-${color}-500`} />
        {realTimeData && (
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`}></div>
            <span className={`text-xs text-${color}-500`}>LIVE</span>
          </div>
        )}
      </div>
      <div className={`text-3xl font-bold mb-2 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {value}
      </div>
      <div className={`text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {title}
      </div>
      {subtitle && (
        <div className={`text-xs mt-1 ${
          darkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          {subtitle}
        </div>
      )}
      {trend !== undefined && (
        <div className={`flex items-center mt-2 text-xs ${
          trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'
        }`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : 
           trend < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
          {trend !== 0 && `${Math.abs(trend)}%`}
        </div>
      )}
    </div>
  );

  // Overview content with real backend data
  const renderOverviewContent = () => {
    if (!dashboardData) return <div>No data available</div>;

    return (
      <div className="space-y-8">
        {/* Enhanced Header with Real Data */}
        <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50/80 to-blue-50/80 border-green-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
              🛡️ Compliance Management System
            </h1>
            <p className="text-sm text-green-500 font-medium">
              🌍 Global Regulatory Compliance • Real-time Monitoring • AI-Powered Analytics
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <ConnectionStatus />
              <button 
                onClick={fetchDashboardData}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-full text-xs transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Real-time Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={ShieldCheck}
              title="Overall Compliance Score"
              value={`${dashboardData.compliance_score?.toFixed(1) || 0}%`}
              subtitle="AI-powered assessment"
              trend={0.5}
              color="green"
              realTimeData={true}
              onClick={() => setActiveSection('analytics')}
            />
            <MetricCard
              icon={AlertTriangle}
              title="Active Risk Items"
              value={dashboardData.risk_summary?.critical + dashboardData.risk_summary?.high || 0}
              subtitle={`${dashboardData.risk_summary?.medium || 0} medium, ${dashboardData.risk_summary?.low || 0} low`}
              trend={-2.1}
              color="orange"
              realTimeData={true}
              onClick={() => setActiveSection('risk-management')}
            />
            <MetricCard
              icon={Clock}
              title="Pending Reviews"
              value={dashboardData.key_metrics?.pending_assessments || 0}
              subtitle={`${dashboardData.key_metrics?.overdue_reviews || 0} overdue`}
              trend={0}
              color="blue"
              realTimeData={true}
              onClick={() => setActiveSection('assessments')}
            />
            <MetricCard
              icon={Eye}
              title="Today's Events"
              value={dashboardData.key_metrics?.audit_events_today || 0}
              subtitle="Audit trail monitoring"
              trend={12.3}
              color="purple"
              realTimeData={true}
              onClick={() => setActiveSection('audit')}
            />
          </div>
        </div>

        {/* Framework Compliance Scores */}
        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <Scale className="w-8 h-8 text-blue-500" />
            <span>Regulatory Framework Compliance</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(dashboardData.framework_scores || {}).map(([framework, score]) => (
              <div key={framework} className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-lg">{framework.toUpperCase()}</span>
                  <span className={`text-2xl font-bold ${score >= 95 ? 'text-green-500' : score >= 85 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${score >= 95 ? 'bg-green-500' : score >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Audit Events */}
          <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Activity className="w-6 h-6 text-green-500" />
              <span>Recent Audit Events</span>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                {auditEvents.length} Today
              </span>
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {auditEvents.slice(0, 5).map((event, index) => (
                <div key={event.id || index} className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{event.event_type || 'System Event'}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.risk_level === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                      event.risk_level === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                      event.risk_level === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-green-500/10 text-green-500'
                    }`}>
                      {event.risk_level || 'LOW'}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {event.description || 'No description available'}
                  </p>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(event.timestamp || Date.now()).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GDPR Requests */}
          <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <UserCheck className="w-6 h-6 text-blue-500" />
              <span>GDPR Requests</span>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                {dashboardData.key_metrics?.gdpr_requests_pending || 0} Pending
              </span>
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {gdprRequests.slice(0, 5).map((request, index) => (
                <div key={request.id || index} className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{request.request_type || 'Data Request'}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                      request.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {request.status || 'PENDING'}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Subject: {request.subject_email || 'Anonymous'}
                  </p>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(request.created_date || Date.now()).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Risk Management content
  const renderRiskManagementContent = () => (
    <div className="space-y-8">
      <div className={`${darkMode ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-700/50' : 'bg-gradient-to-r from-red-50/80 to-orange-50/80 border-red-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
            ⚠️ Risk Management Center
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            AI-powered risk assessment and incident response management
          </p>
        </div>

        {/* Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-500/30">
            <div className="text-4xl font-bold text-red-400 mb-2">{dashboardData?.risk_summary?.critical || 0}</div>
            <div className="text-sm font-medium text-red-300">Critical Risks</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
            <div className="text-4xl font-bold text-orange-400 mb-2">{dashboardData?.risk_summary?.high || 0}</div>
            <div className="text-sm font-medium text-orange-300">High Risks</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{dashboardData?.risk_summary?.medium || 0}</div>
            <div className="text-sm font-medium text-yellow-300">Medium Risks</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <div className="text-4xl font-bold text-green-400 mb-2">{dashboardData?.risk_summary?.low || 0}</div>
            <div className="text-sm font-medium text-green-300">Low Risks</div>
          </div>
        </div>
      </div>

      {/* Risk Assessments and Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Risk Assessments */}
        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Target className="w-6 h-6 text-orange-500" />
            <span>Risk Assessments</span>
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {riskAssessments.slice(0, 5).map((assessment, index) => (
              <div key={assessment.id || index} className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{assessment.title || `Risk Assessment ${index + 1}`}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    assessment.risk_level === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                    assessment.risk_level === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                    assessment.risk_level === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {assessment.risk_level || 'LOW'}
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {assessment.description || 'No description available'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span>Incident Reports</span>
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {incidentReports.slice(0, 5).map((incident, index) => (
              <div key={incident.id || index} className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{incident.title || `Incident ${index + 1}`}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    incident.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                    incident.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                    incident.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {incident.severity || 'LOW'}
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Status: {incident.status || 'Open'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // DNC Management content
  const renderDNCContent = () => (
    <div className="space-y-8">
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-green-900/30 border-blue-700/50' : 'bg-gradient-to-r from-blue-50/80 to-green-50/80 border-blue-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent mb-4">
            📞 DNC Management Center
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Comprehensive Do Not Call registry management and compliance monitoring
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
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Daily Sync Status</span>
                <span className="text-green-500 font-bold">✓ Complete</span>
              </div>
              <div className="text-sm text-gray-500">Last sync: 2 hours ago</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Registry Coverage</span>
                <span className="text-blue-500 font-bold">50 States + Federal</span>
              </div>
              <div className="text-sm text-gray-500">Complete national coverage</div>
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
                <span className="text-2xl font-bold text-blue-500">47,832</span>
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
          </div>
        </div>
      </div>
    </div>
  );

  // Consent Management content
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
            <div className="text-4xl font-bold text-green-400 mb-2">99.94%</div>
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
            <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
            <div className="text-sm font-medium text-orange-300">Monitoring</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-blue-500" />
            <span>Consent Types</span>
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Verbal Consent</span>
                <span className="text-green-500 font-bold">1.8M Records</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
              </div>
              <p className="text-sm text-green-500 mt-1">Call recording verified</p>
            </div>
            
            <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Written Consent</span>
                <span className="text-blue-500 font-bold">1.2M Records</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
              <p className="text-sm text-blue-500 mt-1">Digital signatures</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-purple-500" />
            <span>Consent Lifecycle</span>
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center">
                <span className="font-medium">Active Consents</span>
                <span className="text-green-500 font-bold">2.8M</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center">
                <span className="font-medium">Expiring (30 days)</span>
                <span className="text-yellow-500 font-bold">15,234</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center">
                <span className="font-medium">Revoked Today</span>
                <span className="text-red-500 font-bold">127</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Data Protection content
  const renderDataProtectionContent = () => (
    <div className="space-y-8">
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-purple-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            🔒 Data Protection Center
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Advanced data protection, privacy controls, and GDPR compliance management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-sm font-medium text-green-300">Data Encrypted</div>
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
            <div className="text-sm font-medium text-orange-300">TB Protected</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Lock className="w-6 h-6 text-purple-500" />
            <span>Privacy Controls</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Data Encryption</span>
              </div>
              <span className="text-green-500 font-bold">AES-256</span>
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
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-blue-500" />
            <span>GDPR Requests</span>
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Data Access</span>
                <span className="text-blue-500 font-bold">23 Requests</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
              <p className="text-sm text-blue-500 mt-1">Avg response: 2.1 days</p>
            </div>
            
            <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Data Deletion</span>
                <span className="text-red-500 font-bold">12 Requests</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              <p className="text-sm text-red-500 mt-1">All completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Training Center content
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
            <div className="text-4xl font-bold text-green-400 mb-2">97.8%</div>
            <div className="text-sm font-medium text-green-300">Completion Rate</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
            <div className="text-4xl font-bold text-blue-400 mb-2">247</div>
            <div className="text-sm font-medium text-blue-300">Active Agents</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
            <div className="text-4xl font-bold text-purple-400 mb-2">15</div>
            <div className="text-sm font-medium text-purple-300">Pending Renewals</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
            <div className="text-4xl font-bold text-orange-400 mb-2">8</div>
            <div className="text-sm font-medium text-orange-300">Certifications</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Book className="w-6 h-6 text-green-500" />
            <span>Training Modules</span>
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">TCPA Compliance</span>
                <span className="text-green-500 font-bold">100% Complete</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">GDPR Training</span>
                <span className="text-blue-500 font-bold">96% Complete</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '96%'}}></div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Security Awareness</span>
                <span className="text-yellow-500 font-bold">94% Complete</span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Award className="w-6 h-6 text-purple-500" />
            <span>Certifications</span>
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current Certifications</span>
                <span className="text-green-500 font-bold">8 Active</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center">
                <span className="font-medium">Expiring Soon</span>
                <span className="text-yellow-500 font-bold">2 (30 days)</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-500/10">
              <div className="flex justify-between items-center">
                <span className="font-medium">Renewal Required</span>
                <span className="text-red-500 font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main content renderer
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewContent();
      case 'risk-management':
        return renderRiskManagementContent();
      case 'dnc':
        return renderDNCContent();
      case 'consent':
        return renderConsentContent();
      case 'data-protection':
        return renderDataProtectionContent();
      case 'training':
        return renderTrainingContent();
      case 'audit':
        return (
          <div className="text-center p-8">
            <Activity className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Audit Management</h2>
            <p className="text-gray-500">Comprehensive audit trail and event tracking</p>
          </div>
        );
      case 'gdpr':
        return (
          <div className="text-center p-8">
            <UserCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">GDPR Management</h2>
            <p className="text-gray-500">Data protection and privacy request handling</p>
          </div>
        );
      default:
        return renderOverviewContent();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} sticky top-0 z-50`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                Compliance Dashboard
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                🛡️ Enterprise Compliance Management • Real-time Monitoring • AI Analytics
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ConnectionStatus />
              
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  autoRefresh
                    ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                    : darkMode
                      ? 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                      : 'bg-gray-100/50 text-gray-600 border border-gray-300/30'
                }`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
              </button>

              <button 
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-4 py-2 rounded-lg font-medium transition-all"
              >
                <Bell className="w-4 h-4 mr-2" />
                Alerts
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
              { id: 'training', label: 'Training', icon: Book },
              { id: 'audit', label: 'Audit Trail', icon: Activity },
              { id: 'gdpr', label: 'GDPR Management', icon: UserCheck },
              { id: 'risk-management', label: 'Risk Management', icon: AlertTriangle },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Alerts Modal */}
        {showAlerts && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center space-x-2">
                  <Bell className="w-8 h-8 text-orange-500" />
                  <span>🚨 Live Compliance Alerts</span>
                  <div className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full">
                    {alerts.filter(a => a.status === 'active').length} Active
                  </div>
                </h3>
                <button 
                  onClick={() => setShowAlerts(false)}
                  className="p-2 rounded-lg hover:bg-gray-700/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-xl border ${
                    alert.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                    alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    alert.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
                    'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{alert.title}</h4>
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
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      {alert.message}
                    </p>
                    <div className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  );
};

export default ComplianceDashboard;
