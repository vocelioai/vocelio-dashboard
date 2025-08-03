import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Shield, Bell, Globe, Palette, Database, Key,
  Smartphone, Headphones, Brain, Zap, Cloud, Lock, Unlock,
  Monitor, Wifi, Server, Network, Activity, AlertCircle, CheckCircle,
  Eye, EyeOff, Save, RefreshCw, Download, Upload, Copy, ExternalLink,
  Users, Crown, CreditCard, BarChart3, Phone, Mail, MessageSquare,
  Calendar, Clock, MapPin, Languages, Mic, Volume2, VolumeX,
  Layers, Boxes, Code, FileText, HelpCircle, Star, Award,
  Target, Crosshair, Gauge, Timer, Sparkles, Wand2, Bot,
  Radio, Cpu, HardDrive, MemoryStick, Thermometer, Battery,
  Sliders, Filter, Search, Plus, Minus, ChevronRight,
  ChevronDown, ChevronUp, MoreHorizontal, Edit, Trash2, Link,
  Share2, Bookmark, Flag, Tag, Hash, AtSign, DollarSign,
  Percent, Info, AlertTriangle, X
} from 'lucide-react';

const VocelioSettingsDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Settings data with comprehensive configuration options
  const [settings, setSettings] = useState({
    general: {
      organizationName: 'Vocelio Enterprise',
      timezone: 'America/New_York',
      language: 'en-US',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      businessHours: {
        start: '09:00',
        end: '18:00',
        timezone: 'America/New_York',
        workdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      }
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 60,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: true
      },
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      auditLogging: true,
      dataEncryption: true,
      ssoEnabled: false
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      campaignAlerts: true,
      systemAlerts: true,
      performanceAlerts: true,
      slackIntegration: false,
      webhookUrl: ''
    },
    voice: {
      defaultVoice: 'Sarah Premium',
      voiceSpeed: 1.0,
      voiceStability: 0.75,
      voiceSimilarity: 0.85,
      autoOptimization: true,
      qualityMode: 'premium',
      languageDetection: true,
      emotionEngine: true
    },
    calling: {
      maxConcurrentCalls: 100,
      callRetryAttempts: 3,
      callRetryDelay: 300,
      answeringMachineDetection: true,
      callRecording: true,
      callTranscription: true,
      dncListChecking: true,
      timeZoneRespect: true,
      callerIdMasking: false
    },
    ai: {
      aiOptimization: true,
      machineLearning: true,
      predictiveAnalytics: true,
      sentimentAnalysis: true,
      intentRecognition: true,
      autoResponseGeneration: true,
      conversationMemory: true,
      performanceTuning: true
    },
    integrations: {
      crmIntegration: 'salesforce',
      zapierEnabled: true,
      webhooksEnabled: true,
      apiAccess: true,
      singleSignOn: false,
      calendarSync: true,
      emailSync: true,
      slackBot: false
    },
    billing: {
      billingCycle: 'monthly',
      autoRecharge: true,
      lowBalanceAlert: 100,
      usageAlerts: true,
      invoiceEmail: 'billing@company.com',
      taxId: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      }
    },
    compliance: {
      tcpaCompliance: true,
      hipaaCompliance: false,
      gdprCompliance: true,
      dncListSync: true,
      callConsent: true,
      dataRetention: 365,
      privacyMode: false,
      auditTrail: true
    },
    performance: {
      cacheEnabled: true,
      cdnEnabled: true,
      compressionEnabled: true,
      autoScaling: true,
      loadBalancing: true,
      redundancy: true,
      monitoring: true,
      alerting: true
    }
  });

  // System status and health metrics
  const [systemHealth, setSystemHealth] = useState({
    overall: 'excellent',
    uptime: '99.99%',
    lastUpdate: new Date().toISOString(),
    activeUsers: 247,
    systemLoad: 23,
    memoryUsage: 45,
    diskUsage: 67,
    networkLatency: 12,
    apiResponseTime: 143
  });

  // Settings sections configuration
  const settingSections = [
    {
      id: 'general',
      label: 'General',
      icon: Settings,
      description: 'Basic organization and system settings',
      badge: null
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Authentication, access control, and security policies',
      badge: settings.security.twoFactorAuth ? 'SECURE' : 'REVIEW'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Email, SMS, and push notification preferences',
      badge: null
    },
    {
      id: 'voice',
      label: 'Voice & Audio',
      icon: Mic,
      description: 'Voice synthesis, quality, and optimization settings',
      badge: 'AI'
    },
    {
      id: 'calling',
      label: 'Call Management',
      icon: Phone,
      description: 'Call routing, recording, and telephony configuration',
      badge: null
    },
    {
      id: 'ai',
      label: 'AI Engine',
      icon: Brain,
      description: 'Machine learning, optimization, and AI features',
      badge: 'ADVANCED'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Network,
      description: 'CRM, webhooks, API access, and third-party services',
      badge: '15+'
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
      description: 'Payment methods, invoicing, and usage tracking',
      badge: null
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: Lock,
      description: 'TCPA, HIPAA, GDPR, and regulatory compliance',
      badge: 'COMPLIANT'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Gauge,
      description: 'System optimization, caching, and monitoring',
      badge: 'OPTIMIZED'
    }
  ];

  // Update settings handler
  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Save settings handler
  const saveSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      // Show success notification
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Settings form components
  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', placeholder, description }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {description && (
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg border ${
          darkMode 
            ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
            : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
        } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, description }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {description && (
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border ${
          darkMode 
            ? 'bg-gray-700/50 border-gray-600/50 text-white' 
            : 'bg-gray-100/50 border-gray-200/50 text-gray-900'
        } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  // Render settings content based on active section
  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Organization Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Organization Name"
                  value={settings.general.organizationName}
                  onChange={(value) => updateSetting('general', 'organizationName', value)}
                  description="Display name for your organization"
                />
                <SelectField
                  label="Default Timezone"
                  value={settings.general.timezone}
                  onChange={(value) => updateSetting('general', 'timezone', value)}
                  options={[
                    { value: 'America/New_York', label: 'Eastern Time' },
                    { value: 'America/Chicago', label: 'Central Time' },
                    { value: 'America/Denver', label: 'Mountain Time' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time' },
                    { value: 'UTC', label: 'UTC' }
                  ]}
                  description="Default timezone for campaigns and scheduling"
                />
                <SelectField
                  label="Language"
                  value={settings.general.language}
                  onChange={(value) => updateSetting('general', 'language', value)}
                  options={[
                    { value: 'en-US', label: 'English (US)' },
                    { value: 'en-GB', label: 'English (UK)' },
                    { value: 'es-ES', label: 'Spanish' },
                    { value: 'fr-FR', label: 'French' },
                    { value: 'de-DE', label: 'German' }
                  ]}
                  description="Default language for the interface"
                />
                <SelectField
                  label="Currency"
                  value={settings.general.currency}
                  onChange={(value) => updateSetting('general', 'currency', value)}
                  options={[
                    { value: 'USD', label: 'US Dollar ($)' },
                    { value: 'EUR', label: 'Euro (€)' },
                    { value: 'GBP', label: 'British Pound (£)' },
                    { value: 'CAD', label: 'Canadian Dollar (C$)' }
                  ]}
                  description="Currency for billing and reporting"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  label="Start Time"
                  type="time"
                  value={settings.general.businessHours.start}
                  onChange={(value) => updateSetting('general', 'businessHours', {
                    ...settings.general.businessHours,
                    start: value
                  })}
                  description="Default campaign start time"
                />
                <InputField
                  label="End Time"
                  type="time"
                  value={settings.general.businessHours.end}
                  onChange={(value) => updateSetting('general', 'businessHours', {
                    ...settings.general.businessHours,
                    end: value
                  })}
                  description="Default campaign end time"
                />
                <SelectField
                  label="Timezone"
                  value={settings.general.businessHours.timezone}
                  onChange={(value) => updateSetting('general', 'businessHours', {
                    ...settings.general.businessHours,
                    timezone: value
                  })}
                  options={[
                    { value: 'America/New_York', label: 'Eastern Time' },
                    { value: 'America/Chicago', label: 'Central Time' },
                    { value: 'America/Denver', label: 'Mountain Time' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time' }
                  ]}
                  description="Business hours timezone"
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Authentication & Access</h3>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.security.twoFactorAuth}
                  onChange={(value) => updateSetting('security', 'twoFactorAuth', value)}
                  label="Two-Factor Authentication"
                  description="Require 2FA for all user accounts"
                />
                <ToggleSwitch
                  enabled={settings.security.ssoEnabled}
                  onChange={(value) => updateSetting('security', 'ssoEnabled', value)}
                  label="Single Sign-On (SSO)"
                  description="Enable SAML/OAuth integration"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(value) => updateSetting('security', 'sessionTimeout', parseInt(value))}
                    description="Automatic logout after inactivity"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Password Policy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Minimum Length"
                  type="number"
                  value={settings.security.passwordPolicy.minLength}
                  onChange={(value) => updateSetting('security', 'passwordPolicy', {
                    ...settings.security.passwordPolicy,
                    minLength: parseInt(value)
                  })}
                />
                <div className="space-y-4">
                  <ToggleSwitch
                    enabled={settings.security.passwordPolicy.requireUppercase}
                    onChange={(value) => updateSetting('security', 'passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      requireUppercase: value
                    })}
                    label="Require Uppercase"
                  />
                  <ToggleSwitch
                    enabled={settings.security.passwordPolicy.requireNumbers}
                    onChange={(value) => updateSetting('security', 'passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      requireNumbers: value
                    })}
                    label="Require Numbers"
                  />
                  <ToggleSwitch
                    enabled={settings.security.passwordPolicy.requireSymbols}
                    onChange={(value) => updateSetting('security', 'passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      requireSymbols: value
                    })}
                    label="Require Symbols"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Security Features</h3>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.security.auditLogging}
                  onChange={(value) => updateSetting('security', 'auditLogging', value)}
                  label="Audit Logging"
                  description="Log all user actions and system events"
                />
                <ToggleSwitch
                  enabled={settings.security.dataEncryption}
                  onChange={(value) => updateSetting('security', 'dataEncryption', value)}
                  label="Data Encryption"
                  description="Encrypt all data at rest and in transit"
                />
              </div>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Voice Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Default Voice"
                  value={settings.voice.defaultVoice}
                  onChange={(value) => updateSetting('voice', 'defaultVoice', value)}
                  options={[
                    { value: 'Sarah Premium', label: 'Sarah - Professional Female' },
                    { value: 'Mike Confident', label: 'Mike - Confident Male' },
                    { value: 'Lisa Empathetic', label: 'Lisa - Empathetic Female' },
                    { value: 'David Expert', label: 'David - Expert Male' }
                  ]}
                  description="Default voice for new campaigns"
                />
                <SelectField
                  label="Quality Mode"
                  value={settings.voice.qualityMode}
                  onChange={(value) => updateSetting('voice', 'qualityMode', value)}
                  options={[
                    { value: 'standard', label: 'Standard Quality' },
                    { value: 'premium', label: 'Premium Quality' },
                    { value: 'ultra', label: 'Ultra Quality' }
                  ]}
                  description="Voice synthesis quality level"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Voice Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium">Voice Speed: {settings.voice.voiceSpeed}</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.voice.voiceSpeed}
                    onChange={(e) => updateSetting('voice', 'voiceSpeed', parseFloat(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="text-xs text-gray-500 mt-1">0.5x to 2.0x speed</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Stability: {settings.voice.voiceStability}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.voice.voiceStability}
                    onChange={(e) => updateSetting('voice', 'voiceStability', parseFloat(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="text-xs text-gray-500 mt-1">Lower = more variable</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Similarity: {settings.voice.voiceSimilarity}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.voice.voiceSimilarity}
                    onChange={(e) => updateSetting('voice', 'voiceSimilarity', parseFloat(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="text-xs text-gray-500 mt-1">Voice consistency</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">AI Features</h3>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.voice.autoOptimization}
                  onChange={(value) => updateSetting('voice', 'autoOptimization', value)}
                  label="Auto Voice Optimization"
                  description="Automatically optimize voice settings for better performance"
                />
                <ToggleSwitch
                  enabled={settings.voice.languageDetection}
                  onChange={(value) => updateSetting('voice', 'languageDetection', value)}
                  label="Language Detection"
                  description="Automatically detect and switch to appropriate language"
                />
                <ToggleSwitch
                  enabled={settings.voice.emotionEngine}
                  onChange={(value) => updateSetting('voice', 'emotionEngine', value)}
                  label="Emotion Engine"
                  description="Adjust voice tone based on conversation context"
                />
              </div>
            </div>
          </div>
        );

      case 'calling':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Call Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Max Concurrent Calls"
                  type="number"
                  value={settings.calling.maxConcurrentCalls}
                  onChange={(value) => updateSetting('calling', 'maxConcurrentCalls', parseInt(value))}
                  description="Maximum simultaneous active calls"
                />
                <InputField
                  label="Retry Attempts"
                  type="number"
                  value={settings.calling.callRetryAttempts}
                  onChange={(value) => updateSetting('calling', 'callRetryAttempts', parseInt(value))}
                  description="Number of retry attempts for failed calls"
                />
                <InputField
                  label="Retry Delay (seconds)"
                  type="number"
                  value={settings.calling.callRetryDelay}
                  onChange={(value) => updateSetting('calling', 'callRetryDelay', parseInt(value))}
                  description="Wait time between retry attempts"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Call Features</h3>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.calling.answeringMachineDetection}
                  onChange={(value) => updateSetting('calling', 'answeringMachineDetection', value)}
                  label="Answering Machine Detection"
                  description="Automatically detect voicemail and handle appropriately"
                />
                <ToggleSwitch
                  enabled={settings.calling.callRecording}
                  onChange={(value) => updateSetting('calling', 'callRecording', value)}
                  label="Call Recording"
                  description="Record all calls for quality and training purposes"
                />
                <ToggleSwitch
                  enabled={settings.calling.callTranscription}
                  onChange={(value) => updateSetting('calling', 'callTranscription', value)}
                  label="Call Transcription"
                  description="Automatically transcribe call conversations"
                />
                <ToggleSwitch
                  enabled={settings.calling.dncListChecking}
                  onChange={(value) => updateSetting('calling', 'dncListChecking', value)}
                  label="DNC List Checking"
                  description="Check numbers against Do Not Call lists"
                />
                <ToggleSwitch
                  enabled={settings.calling.timeZoneRespect}
                  onChange={(value) => updateSetting('calling', 'timeZoneRespect', value)}
                  label="Timezone Respect"
                  description="Respect local business hours based on phone number location"
                />
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">AI Engine Settings</h3>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.ai.aiOptimization}
                  onChange={(value) => updateSetting('ai', 'aiOptimization', value)}
                  label="AI Optimization"
                  description="Enable continuous AI-driven performance optimization"
                />
                <ToggleSwitch
                  enabled={settings.ai.machineLearning}
                  onChange={(value) => updateSetting('ai', 'machineLearning', value)}
                  label="Machine Learning"
                  description="Use ML algorithms to improve conversation quality"
                />
                <ToggleSwitch
                  enabled={settings.ai.predictiveAnalytics}
                  onChange={(value) => updateSetting('ai', 'predictiveAnalytics', value)}
                  label="Predictive Analytics"
                  description="Predict call outcomes and optimize strategies"
                />
                <ToggleSwitch
                  enabled={settings.ai.sentimentAnalysis}
                  onChange={(value) => updateSetting('ai', 'sentimentAnalysis', value)}
                  label="Sentiment Analysis"
                  description="Analyze customer sentiment in real-time"
                />
                <ToggleSwitch
                  enabled={settings.ai.intentRecognition}
                  onChange={(value) => updateSetting('ai', 'intentRecognition', value)}
                  label="Intent Recognition"
                  description="Automatically recognize customer intent and adapt responses"
                />
                <ToggleSwitch
                  enabled={settings.ai.autoResponseGeneration}
                  onChange={(value) => updateSetting('ai', 'autoResponseGeneration', value)}
                  label="Auto Response Generation"
                  description="Generate contextually appropriate responses automatically"
                />
                <ToggleSwitch
                  enabled={settings.ai.conversationMemory}
                  onChange={(value) => updateSetting('ai', 'conversationMemory', value)}
                  label="Conversation Memory"
                  description="Remember context from previous interactions"
                />
                <ToggleSwitch
                  enabled={settings.ai.performanceTuning}
                  onChange={(value) => updateSetting('ai', 'performanceTuning', value)}
                  label="Performance Tuning"
                  description="Automatically tune AI parameters for optimal performance"
                />
              </div>
            </div>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Regulatory Compliance</h3>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.compliance.tcpaCompliance}
                  onChange={(value) => updateSetting('compliance', 'tcpaCompliance', value)}
                  label="TCPA Compliance"
                  description="Telephone Consumer Protection Act compliance"
                />
                <ToggleSwitch
                  enabled={settings.compliance.hipaaCompliance}
                  onChange={(value) => updateSetting('compliance', 'hipaaCompliance', value)}
                  label="HIPAA Compliance"
                  description="Health Insurance Portability and Accountability Act"
                />
                <ToggleSwitch
                  enabled={settings.compliance.gdprCompliance}
                  onChange={(value) => updateSetting('compliance', 'gdprCompliance', value)}
                  label="GDPR Compliance"
                  description="General Data Protection Regulation compliance"
                />
                <ToggleSwitch
                  enabled={settings.compliance.dncListSync}
                  onChange={(value) => updateSetting('compliance', 'dncListSync', value)}
                  label="DNC List Sync"
                  description="Automatically sync with Do Not Call registries"
                />
                <ToggleSwitch
                  enabled={settings.compliance.callConsent}
                  onChange={(value) => updateSetting('compliance', 'callConsent', value)}
                  label="Call Consent Verification"
                  description="Verify consent before making calls"
                />
                <ToggleSwitch
                  enabled={settings.compliance.auditTrail}
                  onChange={(value) => updateSetting('compliance', 'auditTrail', value)}
                  label="Audit Trail"
                  description="Maintain detailed logs for compliance audits"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Data Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Data Retention (days)"
                  type="number"
                  value={settings.compliance.dataRetention}
                  onChange={(value) => updateSetting('compliance', 'dataRetention', parseInt(value))}
                  description="How long to retain call data and recordings"
                />
                <div className="space-y-4">
                  <ToggleSwitch
                    enabled={settings.compliance.privacyMode}
                    onChange={(value) => updateSetting('compliance', 'privacyMode', value)}
                    label="Privacy Mode"
                    description="Enhanced privacy protection for sensitive data"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">System Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} text-center`}>
                  <div className="text-2xl font-bold text-green-500">{systemHealth.uptime}</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} text-center`}>
                  <div className="text-2xl font-bold text-blue-500">{systemHealth.systemLoad}%</div>
                  <div className="text-sm text-gray-500">System Load</div>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} text-center`}>
                  <div className="text-2xl font-bold text-purple-500">{systemHealth.memoryUsage}%</div>
                  <div className="text-sm text-gray-500">Memory Usage</div>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} text-center`}>
                  <div className="text-2xl font-bold text-orange-500">{systemHealth.apiResponseTime}ms</div>
                  <div className="text-sm text-gray-500">API Response</div>
                </div>
              </div>

              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.performance.cacheEnabled}
                  onChange={(value) => updateSetting('performance', 'cacheEnabled', value)}
                  label="Cache Optimization"
                  description="Enable advanced caching for improved performance"
                />
                <ToggleSwitch
                  enabled={settings.performance.cdnEnabled}
                  onChange={(value) => updateSetting('performance', 'cdnEnabled', value)}
                  label="CDN (Content Delivery Network)"
                  description="Use global CDN for faster content delivery"
                />
                <ToggleSwitch
                  enabled={settings.performance.compressionEnabled}
                  onChange={(value) => updateSetting('performance', 'compressionEnabled', value)}
                  label="Data Compression"
                  description="Compress data transfers to reduce bandwidth usage"
                />
                <ToggleSwitch
                  enabled={settings.performance.autoScaling}
                  onChange={(value) => updateSetting('performance', 'autoScaling', value)}
                  label="Auto Scaling"
                  description="Automatically scale resources based on demand"
                />
                <ToggleSwitch
                  enabled={settings.performance.loadBalancing}
                  onChange={(value) => updateSetting('performance', 'loadBalancing', value)}
                  label="Load Balancing"
                  description="Distribute load across multiple servers"
                />
                <ToggleSwitch
                  enabled={settings.performance.redundancy}
                  onChange={(value) => updateSetting('performance', 'redundancy', value)}
                  label="Redundancy"
                  description="Maintain backup systems for high availability"
                />
                <ToggleSwitch
                  enabled={settings.performance.monitoring}
                  onChange={(value) => updateSetting('performance', 'monitoring', value)}
                  label="Performance Monitoring"
                  description="Continuous monitoring of system performance"
                />
                <ToggleSwitch
                  enabled={settings.performance.alerting}
                  onChange={(value) => updateSetting('performance', 'alerting', value)}
                  label="Performance Alerting"
                  description="Get alerts when performance thresholds are exceeded"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Advanced Settings</h3>
            <p className="text-gray-500 mb-6">
              {settingSections.find(s => s.id === activeSection)?.description}
            </p>
            <button className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors">
              Coming Soon
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header with System Status */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800/90 via-blue-900/30 to-gray-800/90 border-gray-700/50' : 'bg-gradient-to-r from-blue-50/80 via-cyan-50/80 to-blue-50/80 border-blue-200/50'} 
        rounded-2xl border p-8 backdrop-blur-xl relative overflow-hidden`}>
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Settings className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                    ⚙️ Enterprise Settings Center
                  </h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                    System configuration and advanced enterprise controls
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        systemHealth.overall === 'excellent' ? 'bg-green-500' : 
                        systemHealth.overall === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-green-500 font-medium">System Status: Excellent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-500 font-medium">{systemHealth.activeUsers} Active Users</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Server className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-purple-500 font-medium">Uptime: {systemHealth.uptime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-xl"
              >
                <Wand2 className="w-5 h-5" />
                <span>Advanced Mode</span>
              </button>
              <button 
                onClick={saveSettings}
                disabled={!hasUnsavedChanges}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-xl ${
                  hasUnsavedChanges 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white' 
                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-xl">
                <Download className="w-5 h-5" />
                <span>Export Config</span>
              </button>
            </div>
          </div>

          {/* Quick System Health Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
              <div className="text-2xl font-bold text-green-400 mb-1">{systemHealth.uptime}</div>
              <div className="text-xs font-medium text-green-300">System Uptime</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400 mb-1">{systemHealth.activeUsers}</div>
              <div className="text-xs font-medium text-blue-300">Active Users</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400 mb-1">{systemHealth.systemLoad}%</div>
              <div className="text-xs font-medium text-purple-300">System Load</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
              <div className="text-2xl font-bold text-orange-400 mb-1">{systemHealth.apiResponseTime}ms</div>
              <div className="text-xs font-medium text-orange-300">API Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Navigation and Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className={`lg:w-80 ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
          rounded-2xl border backdrop-blur-sm p-6`}>
          
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' 
                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {settingSections.map(({ id, label, icon: Icon, description, badge }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeSection === id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105'
                    : darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeSection === id ? 'text-white' : ''} transition-all group-hover:scale-110`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{label}</div>
                  {activeSection === id && (
                    <div className="text-xs text-white/80 mt-1">{description}</div>
                  )}
                </div>
                {badge && (
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeSection === id 
                      ? 'bg-white/20 text-white' 
                      : badge === 'SECURE' || badge === 'COMPLIANT'
                        ? 'bg-green-500/10 text-green-500'
                        : badge === 'AI' || badge === 'ADVANCED'
                          ? 'bg-purple-500/10 text-purple-500'
                          : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {badge}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 space-y-3">
            <button className={`w-full p-3 rounded-xl ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-100/30 hover:bg-gray-100/50'} 
              transition-all flex items-center space-x-3 group`}>
              <RefreshCw className="w-5 h-5 text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-medium">Reset to Defaults</span>
            </button>
            <button className={`w-full p-3 rounded-xl ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-100/30 hover:bg-gray-100/50'} 
              transition-all flex items-center space-x-3`}>
              <Download className="w-5 h-5 text-green-500" />
              <span className="font-medium">Backup Settings</span>
            </button>
            <button className={`w-full p-3 rounded-xl ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-100/30 hover:bg-gray-100/50'} 
              transition-all flex items-center space-x-3`}>
              <Upload className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Import Settings</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
            rounded-2xl border backdrop-blur-sm p-8`}>
            
            {/* Content Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold flex items-center space-x-3">
                  {React.createElement(settingSections.find(s => s.id === activeSection)?.icon || Settings, {
                    className: "w-8 h-8 text-blue-500"
                  })}
                  <span>{settingSections.find(s => s.id === activeSection)?.label}</span>
                  {settingSections.find(s => s.id === activeSection)?.badge && (
                    <div className="px-3 py-1 bg-blue-500/10 text-blue-500 text-sm rounded-full">
                      {settingSections.find(s => s.id === activeSection)?.badge}
                    </div>
                  )}
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  {settingSections.find(s => s.id === activeSection)?.description}
                </p>
              </div>
              
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-2 text-orange-500">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Unsaved Changes</span>
                </div>
              )}
            </div>

            {/* Settings Content */}
            <div className="max-h-[70vh] overflow-y-auto">
              {renderSettingsContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Save Confirmation Bar */}
      {hasUnsavedChanges && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${
          darkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50'
        } border rounded-xl p-4 backdrop-blur-xl shadow-2xl flex items-center space-x-4 z-50`}>
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <span className="font-medium">You have unsaved changes</span>
          <div className="flex space-x-2">
            <button 
              onClick={() => setHasUnsavedChanges(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Discard
            </button>
            <button 
              onClick={saveSettings}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocelioSettingsDashboard;