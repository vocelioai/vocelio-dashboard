import React, { useState, useEffect } from 'react';
import { 
  Palette, Crown, Building, Globe, Settings, Star, Zap, Shield,
  Eye, Edit, Save, RefreshCw, Upload, Download, Copy, Check,
  Smartphone, Monitor, Tablet, Laptop, Link, ExternalLink,
  Code, FileText, Image, Video, Music, Heart, Award,
  Target, TrendingUp, BarChart3, Users, Phone, Mail,
  MessageSquare, Calendar, Clock, MapPin, Flag, Tag,
  Layers, Brush, Type, Package, Boxes, Store, Briefcase,
  Search, Filter, Plus, X, ChevronDown, ChevronRight,
  AlertCircle, CheckCircle, Info, Bell, HelpCircle, Trophy,
  Server, Database, Activity, Wifi, Lock, ArrowLeft
} from 'lucide-react';

const WhiteLabelDashboard = ({ darkMode = true, onBackToMainDashboard }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedBrand, setSelectedBrand] = useState('demo-brand');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isLivePreview, setIsLivePreview] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // White label metrics and data
  const [whiteLabel, setWhiteLabel] = useState({
    totalPartners: 47,
    activeBrands: 189,
    monthlyRevenue: 2847592,
    customDomains: 156,
    apiCalls: 15847293,
    supportTickets: 23,
    uptime: 99.99,
    satisfaction: 98.7
  });

  // Brand configurations
  const [brands] = useState([
    {
      id: 'demo-brand',
      name: 'CallMaster Pro',
      domain: 'callmaster.com',
      status: 'active',
      partner: 'TechCorp Solutions',
      created: '2024-01-15',
      lastModified: '2024-11-28',
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        accentColor: '#10B981',
        backgroundColor: '#F8FAFC',
        textColor: '#1F2937',
        fontFamily: 'Inter'
      },
      branding: {
        logo: '🚀',
        companyName: 'CallMaster Pro',
        tagline: 'Advanced AI Call Solutions',
        favicon: '🚀',
        brandColors: ['#3B82F6', '#8B5CF6', '#10B981'],
        customCSS: '.header { border-radius: 12px; }',
        footerText: '© 2024 CallMaster Pro. All rights reserved.'
      },
      features: {
        dashboard: true,
        analytics: true,
        voiceCloning: false,
        apiAccess: true,
        whiteLabeling: true,
        customDomain: true,
        ssoIntegration: true,
        multiLanguage: true
      },
      metrics: {
        users: 1247,
        calls: 89534,
        revenue: 567823,
        satisfaction: 97.2
      }
    },
    {
      id: 'enterprise-voice',
      name: 'VoiceFlow Enterprise',
      domain: 'voiceflow-ent.com',
      status: 'active',
      partner: 'Enterprise Dynamics',
      created: '2024-02-20',
      lastModified: '2024-11-27',
      theme: {
        primaryColor: '#7C3AED',
        secondaryColor: '#EC4899',
        accentColor: '#F59E0B',
        backgroundColor: '#111827',
        textColor: '#F9FAFB',
        fontFamily: 'Roboto'
      },
      branding: {
        logo: '🎙️',
        companyName: 'VoiceFlow Enterprise',
        tagline: 'Enterprise Voice Solutions',
        favicon: '🎙️',
        brandColors: ['#7C3AED', '#EC4899', '#F59E0B'],
        customCSS: '.dashboard { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }',
        footerText: '© 2024 VoiceFlow Enterprise. Powered by Innovation.'
      },
      features: {
        dashboard: true,
        analytics: true,
        voiceCloning: true,
        apiAccess: true,
        whiteLabeling: true,
        customDomain: true,
        ssoIntegration: true,
        multiLanguage: false
      },
      metrics: {
        users: 2847,
        calls: 156892,
        revenue: 1247593,
        satisfaction: 98.9
      }
    },
    {
      id: 'sales-accelerator',
      name: 'SalesBot AI',
      domain: 'salesbot-ai.io',
      status: 'active',
      partner: 'Growth Ventures',
      created: '2024-03-10',
      lastModified: '2024-11-26',
      theme: {
        primaryColor: '#EF4444',
        secondaryColor: '#F97316',
        accentColor: '#22C55E',
        backgroundColor: '#FFFFFF',
        textColor: '#374151',
        fontFamily: 'Poppins'
      },
      branding: {
        logo: '🤖',
        companyName: 'SalesBot AI',
        tagline: 'AI-Powered Sales Acceleration',
        favicon: '🤖',
        brandColors: ['#EF4444', '#F97316', '#22C55E'],
        customCSS: '.card { box-shadow: 0 10px 25px rgba(0,0,0,0.1); }',
        footerText: '© 2024 SalesBot AI. Accelerating Success.'
      },
      features: {
        dashboard: true,
        analytics: true,
        voiceCloning: false,
        apiAccess: true,
        whiteLabeling: true,
        customDomain: true,
        ssoIntegration: false,
        multiLanguage: true
      },
      metrics: {
        users: 892,
        calls: 45782,
        revenue: 324156,
        satisfaction: 95.8
      }
    }
  ]);

  // Navigation items
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Crown, badge: 'LIVE' },
    { id: 'brand-customizer', label: 'Brand Customizer', icon: Palette, badge: 'HOT' },
    { id: 'brand-builder', label: 'Brand Builder', icon: Plus, badge: 'SOON' },
    { id: 'partners', label: 'Partner Management', icon: Building, badge: 'SOON' },
    { id: 'api', label: 'API Management', icon: Code, badge: 'SOON' },
    { id: 'monitoring', label: 'System Monitoring', icon: Activity, badge: 'SOON' },
    { id: 'analytics', label: 'Analytics Hub', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWhiteLabel(prev => ({
        ...prev,
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 100) + 50,
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 1000) + 500
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'inactive': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color, onClick }) => {
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
              <TrendingUp className="w-4 h-4 mr-1" />
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

  const BrandCard = ({ brand, isSelected, onClick }) => (
    <div 
      className={`${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-xl rounded-xl border ${
        isSelected ? 'border-blue-500/50 ring-2 ring-blue-500/20' : darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
      } p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
      onClick={() => onClick(brand)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: brand.theme.primaryColor + '20' }}
          >
            {brand.branding.logo}
          </div>
          <div>
            <h3 className="font-bold text-lg">{brand.name}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{brand.domain}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>{brand.partner}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(brand.status)}`}>
          {brand.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 rounded-lg" style={{ backgroundColor: brand.theme.primaryColor + '10' }}>
          <p className="text-lg font-bold" style={{ color: brand.theme.primaryColor }}>
            {brand.metrics.users.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Users</p>
        </div>
        <div className="text-center p-3 rounded-lg" style={{ backgroundColor: brand.theme.secondaryColor + '10' }}>
          <p className="text-lg font-bold" style={{ color: brand.theme.secondaryColor }}>
            {brand.metrics.calls.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Calls</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Modified: {new Date(brand.lastModified).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ColorPicker = ({ color, onChange, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        ></div>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 px-3 py-2 rounded-lg border ${
            darkMode 
              ? 'bg-gray-700/50 border-gray-600/50 text-white' 
              : 'bg-white/50 border-gray-200/50 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
          placeholder="#3B82F6"
        />
      </div>
    </div>
  );

  const ComingSoonBadge = () => (
    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-4 py-2 text-sm font-medium text-yellow-400">
      <Zap className="w-4 h-4" />
      <span>Coming Soon</span>
    </div>
  );

  const renderOverviewContent = () => (
    <div className="space-y-8">
      {/* White Label Overview Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-purple-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              WHITE LABEL HUB
            </h1>
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            🎨 Enterprise White Label Solutions & Partner Management
          </p>
          <p className="text-sm text-purple-500 font-medium">
            🌍 {whiteLabel.totalPartners} Global Partners • {whiteLabel.activeBrands} Active Brands • ${(whiteLabel.monthlyRevenue / 1000000).toFixed(1)}M Monthly Revenue
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
            <div className="text-5xl font-bold text-purple-400 mb-2">
              {whiteLabel.totalPartners}
            </div>
            <div className="text-sm font-medium text-purple-300">Global Partners</div>
            <div className="text-xs text-green-400 mt-1">+8 this month</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
            <div className="text-5xl font-bold text-blue-400 mb-2">
              {whiteLabel.activeBrands}
            </div>
            <div className="text-sm font-medium text-blue-300">Active Brands</div>
            <div className="text-xs text-green-400 mt-1">+23 this month</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <div className="text-5xl font-bold text-green-400 mb-2">
              ${(whiteLabel.monthlyRevenue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm font-medium text-green-300">Monthly Revenue</div>
            <div className="text-xs text-green-400 mt-1">+47% YoY growth</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
            <div className="text-5xl font-bold text-orange-400 mb-2">
              {whiteLabel.customDomains}
            </div>
            <div className="text-sm font-medium text-orange-300">Custom Domains</div>
            <div className="text-xs text-green-400 mt-1">SSL secured</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          icon={Building}
          title="Partner Organizations"
          value={whiteLabel.totalPartners}
          subtitle="Enterprise partners"
          trend={12.3}
          color="blue"
          onClick={() => setActiveSection('partners')}
        />
        <MetricCard
          icon={Palette}
          title="API Calls Today"
          value={`${(whiteLabel.apiCalls / 1000000).toFixed(1)}M`}
          subtitle="White label API usage"
          trend={8.7}
          color="green"
          onClick={() => setActiveSection('api')}
        />
        <MetricCard
          icon={Globe}
          title="System Uptime"
          value={`${whiteLabel.uptime}%`}
          subtitle="Enterprise SLA"
          trend={0.01}
          color="purple"
          onClick={() => setActiveSection('monitoring')}
        />
        <MetricCard
          icon={Crown}
          title="Customer Satisfaction"
          value={`${whiteLabel.satisfaction}%`}
          subtitle="Partner feedback"
          trend={3.2}
          color="orange"
          onClick={() => setActiveSection('feedback')}
        />
      </div>

      {/* Featured Brands */}
      <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <span>🌟 Featured White Label Brands</span>
          </h3>
          <div className="flex space-x-3">
            <button 
              onClick={() => setActiveSection('brand-builder')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Create New Brand
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
              View All Brands
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {brands.slice(0, 3).map((brand) => (
            <BrandCard 
              key={brand.id} 
              brand={brand} 
              isSelected={selectedBrand === brand.id}
              onClick={(brand) => {
                setSelectedBrand(brand.id);
                setActiveSection('brand-customizer');
              }}
            />
          ))}
        </div>
      </div>

      {/* Partner Success Stories */}
      <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span>🏆 Partner Success Stories</span>
          </h3>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
            View All Stories
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} border border-green-500/20`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                TC
              </div>
              <div>
                <h4 className="font-bold">TechCorp Solutions</h4>
                <p className="text-sm text-gray-500">Enterprise Partner</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              "Vocelio's white label solution helped us launch our AI call center product 6 months ahead of schedule. Revenue increased by 340% in the first quarter."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-500">+340%</span>
              <span className="text-sm text-gray-500">Q1 Revenue Growth</span>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} border border-blue-500/20`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                ED
              </div>
              <div>
                <h4 className="font-bold">Enterprise Dynamics</h4>
                <p className="text-sm text-gray-500">Global Partner</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              "The white label platform's scalability is incredible. We're now serving 15+ enterprise clients across 8 countries with zero infrastructure concerns."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-500">15+</span>
              <span className="text-sm text-gray-500">Enterprise Clients</span>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} border border-purple-500/20`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                GV
              </div>
              <div>
                <h4 className="font-bold">Growth Ventures</h4>
                <p className="text-sm text-gray-500">Strategic Partner</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              "Perfect white label solution for our portfolio companies. The customization options and partner support are exceptional."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-500">98.9%</span>
              <span className="text-sm text-gray-500">Satisfaction Score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrandCustomizerContent = () => {
    const currentBrand = brands.find(b => b.id === selectedBrand) || brands[0];
    
    return (
      <div className="space-y-8">
        {/* Brand Customizer Header */}
        <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50' : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-200/50'} rounded-2xl border p-8 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
                🎨 Brand Customizer
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Customize and preview your white label brand in real-time
              </p>
            </div>
            <div className="flex space-x-3">
              <select 
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className={`px-4 py-3 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                    : 'bg-white/50 border-gray-200/50 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              >
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* Preview Mode Toggle */}
          <div className="flex items-center space-x-4">
            <span className="font-medium">Preview Mode:</span>
            <div className="flex items-center space-x-2 bg-gray-500/10 rounded-lg p-1">
              {[
                { id: 'desktop', icon: Monitor, label: 'Desktop' },
                { id: 'tablet', icon: Tablet, label: 'Tablet' },
                { id: 'mobile', icon: Smartphone, label: 'Mobile' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setPreviewMode(id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    previewMode === id
                      ? 'bg-blue-500 text-white'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsLivePreview(!isLivePreview)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isLivePreview
                  ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                  : 'bg-gray-500/20 text-gray-500 border border-gray-500/30'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Live Preview</span>
            </button>
          </div>
        </div>

        {/* Customization Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Customization Panel */}
          <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
            <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <Brush className="w-6 h-6 text-purple-500" />
              <span>Brand Configuration</span>
            </h3>

            <div className="space-y-8">
              {/* Brand Identity */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Brand Identity</span>
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      value={currentBrand.branding.companyName}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                          : 'bg-white/50 border-gray-200/50 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Domain</label>
                    <input
                      type="text"
                      value={currentBrand.domain}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                          : 'bg-white/50 border-gray-200/50 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <input
                      type="text"
                      value={currentBrand.branding.tagline}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                          : 'bg-white/50 border-gray-200/50 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Logo/Icon</label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 border-dashed border-gray-400"
                        style={{ backgroundColor: currentBrand.theme.primaryColor + '20' }}
                      >
                        {currentBrand.branding.logo}
                      </div>
                      <input
                        type="text"
                        value={currentBrand.branding.logo}
                        className={`flex-1 px-3 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                            : 'bg-white/50 border-gray-200/50 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        placeholder="🚀"
                      />
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Scheme */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Color Scheme</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker 
                    color={currentBrand.theme.primaryColor}
                    onChange={() => {}}
                    label="Primary Color"
                  />
                  <ColorPicker 
                    color={currentBrand.theme.secondaryColor}
                    onChange={() => {}}
                    label="Secondary Color"
                  />
                  <ColorPicker 
                    color={currentBrand.theme.accentColor}
                    onChange={() => {}}
                    label="Accent Color"
                  />
                  <ColorPicker 
                    color={currentBrand.theme.backgroundColor}
                    onChange={() => {}}
                    label="Background Color"
                  />
                </div>
              </div>

              {/* Typography */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Type className="w-5 h-5" />
                  <span>Typography</span>
                </h4>
                <div>
                  <label className="block text-sm font-medium mb-2">Font Family</label>
                  <select 
                    value={currentBrand.theme.fontFamily}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                        : 'bg-white/50 border-gray-200/50 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>
              </div>

              {/* Feature Configuration */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Feature Configuration</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentBrand.features).map(([feature, enabled]) => (
                    <label key={feature} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom CSS */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>Custom CSS</span>
                </h4>
                <textarea
                  value={currentBrand.branding.customCSS}
                  rows={6}
                  className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                      : 'bg-white/50 border-gray-200/50 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  placeholder="/* Custom CSS styles */"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className={`${darkMode ? 'bg-gray-800/40' : 'bg-white/40'} backdrop-blur-xl rounded-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center space-x-3">
                <Eye className="w-6 h-6 text-green-500" />
                <span>Live Preview</span>
              </h3>
              <div className="flex space-x-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in New Tab</span>
                </button>
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Container */}
            <div className={`relative bg-gray-100 rounded-xl overflow-hidden ${
              previewMode === 'desktop' ? 'aspect-video' :
              previewMode === 'tablet' ? 'aspect-[4/3] max-w-md mx-auto' :
              'aspect-[9/16] max-w-sm mx-auto'
            }`}>
              {/* Browser Chrome */}
              <div className="bg-gray-300 px-4 py-2 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-sm text-gray-600">
                  https://{currentBrand.domain}
                </div>
              </div>

              {/* Preview Content */}
              <div 
                className="h-full overflow-auto"
                style={{ 
                  backgroundColor: currentBrand.theme.backgroundColor,
                  fontFamily: currentBrand.theme.fontFamily
                }}
              >
                {/* Header */}
                <div 
                  className="p-4 text-white flex items-center justify-between"
                  style={{ backgroundColor: currentBrand.theme.primaryColor }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currentBrand.branding.logo}</span>
                    <div>
                      <h1 className="font-bold text-lg">{currentBrand.branding.companyName}</h1>
                      <p className="text-sm opacity-80">{currentBrand.branding.tagline}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                    <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-4 space-y-4">
                  {/* Metrics Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: currentBrand.theme.primaryColor + '10' }}
                    >
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: currentBrand.theme.primaryColor }}
                      >
                        {currentBrand.metrics.users.toLocaleString()}
                      </div>
                      <div className="text-sm opacity-60">Total Users</div>
                    </div>
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: currentBrand.theme.secondaryColor + '10' }}
                    >
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: currentBrand.theme.secondaryColor }}
                      >
                        {currentBrand.metrics.calls.toLocaleString()}
                      </div>
                      <div className="text-sm opacity-60">Total Calls</div>
                    </div>
                  </div>

                  {/* Sample Content */}
                  <div 
                    className="p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: currentBrand.theme.backgroundColor,
                      borderColor: currentBrand.theme.primaryColor + '30'
                    }}
                  >
                    <h3 
                      className="font-bold mb-2"
                      style={{ color: currentBrand.theme.textColor }}
                    >
                      Recent Activity
                    </h3>
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: currentBrand.theme.accentColor }}
                          ></div>
                          <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div 
                    className="text-center text-sm pt-4 border-t"
                    style={{ 
                      color: currentBrand.theme.textColor + '80',
                      borderColor: currentBrand.theme.primaryColor + '20'
                    }}
                  >
                    {currentBrand.branding.footerText}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Controls */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <div className="flex space-x-2">
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>Copy URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComingSoonContent = (title, description, IconComponent) => (
    <div className="space-y-8">
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-900/30 to-blue-900/30 border-gray-700/50' : 'bg-gradient-to-r from-gray-50/80 to-blue-50/80 border-gray-200/50'} rounded-2xl border p-12 backdrop-blur-xl text-center`}>
        <IconComponent className="w-24 h-24 mx-auto mb-6 text-blue-500" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
          {description}
        </p>
        <ComingSoonBadge />
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="email"
              placeholder="Enter your email for updates"
              className={`flex-1 px-4 py-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                  : 'bg-white/50 border-gray-200/50 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              Notify Me
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Be the first to know when this feature launches
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewContent();
      case 'brand-customizer':
        return renderBrandCustomizerContent();
      case 'brand-builder':
        return renderComingSoonContent(
          '🏗️ Brand Builder',
          'Advanced drag-and-drop brand creation with AI-assisted design recommendations and template marketplace',
          Plus
        );
      case 'partners':
        return renderComingSoonContent(
          '🤝 Partner Management',
          'Comprehensive partner onboarding, performance tracking, and revenue sharing management',
          Building
        );
      case 'api':
        return renderComingSoonContent(
          '⚡ API Management',
          'Advanced API analytics, developer portal, rate limiting, and webhook configuration',
          Code
        );
      case 'monitoring':
        return renderComingSoonContent(
          '📊 System Monitoring',
          'Real-time system health monitoring, performance metrics, and uptime tracking with SLA management',
          Activity
        );
      case 'analytics':
        return renderComingSoonContent(
          '📈 Analytics Hub',
          'Comprehensive analytics dashboard with partner performance insights and revenue attribution',
          BarChart3
        );
      case 'settings':
        return renderComingSoonContent(
          '⚙️ Settings',
          'Global platform settings, security configuration, and administrative controls',
          Settings
        );
      default:
        return renderOverviewContent();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${darkMode ? 'white' : 'black'} 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-xl border-r ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} z-50`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Vocelio
                </h1>
                <p className="text-xs text-gray-500">White Label Hub</p>
              </div>
            </div>
            {onBackToMainDashboard && (
              <button
                onClick={onBackToMainDashboard}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                title="Back to Main Dashboard"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  item.badge === 'LIVE' ? 'bg-green-500/20 text-green-400' :
                  item.badge === 'HOT' ? 'bg-red-500/20 text-red-400' :
                  item.badge === 'SOON' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50">
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
              Enterprise Support
            </button>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Navigation Banner */}
        {onBackToMainDashboard && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-semibold text-blue-400">White Label Dashboard</h3>
                <p className="text-sm text-blue-300">Enterprise-level customization and partner management</p>
              </div>
            </div>
            <button
              onClick={onBackToMainDashboard}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Dashboard</span>
            </button>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default WhiteLabelDashboard;