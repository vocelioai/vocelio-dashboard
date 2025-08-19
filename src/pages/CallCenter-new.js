import React, { useState, useEffect, useMemo } from 'react';
import { Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, Settings, Users, BarChart3, Clock, Mic, MicOff, Volume2, VolumeX, User, MessageSquare, Calendar, FileText, Zap, Activity, TrendingUp, AlertCircle, CheckCircle, Play, Pause, Square, RotateCcw, Save, Upload, Download, Search, Filter, Bell, Shield, Headphones, Globe, UserCheck, Shuffle, ArrowRight, ArrowDown, Map, Flag, ChevronDown, PhoneForwarded, UserPlus, Briefcase, HeartHandshake, Clock3, Route, Target, Command, Keyboard, FastForward, Rewind, SkipBack, SkipForward, Volume1, Repeat, X, SlidersHorizontal, Radio, Moon, Sun, Layers, BarChart2, PieChart, LineChart, Bookmark, Mic2, Waves, Brain, Lightbulb, Cpu, Workflow, GitBranch, Share2, Eye, EyeOff, Maximize2, Minimize2, RefreshCw, Wifi, WifiOff, Signal, Battery, Smartphone, Monitor, Tablet, Bluetooth, Cast, Send, MessageCircle, Star, Award, Trophy, Flame, Gauge, Timer, MapPin, Hash, MoreHorizontal, Plus, Minus, ArrowUp, ArrowLeft, CornerDownLeft, CornerDownRight, Split, Merge, Copy, Edit3, Trash2, Archive, Pin, Link, ExternalLink, Home, Building, UserCircle, HelpCircle, Info, CheckSquare, CircleDot, Circle, PlayCircle, StopCircle, Maximize, MousePointer, Move, RotateCw, ZoomIn, ZoomOut, Layers3, Database, Cloud, CloudOff, Server, MemoryStick, HardDrive, Lock, Unlock, Key, UserX, UserMinus, AlertTriangle, XCircle, Loader, Loader2 } from 'lucide-react';

// Import Services for Live Integration
import TwilioVoiceService from '../services/TwilioVoiceService';
import CallCenterApiService from '../services/CallCenterApiService';

const CallCenterDashboard = () => {
  // Initialize Services for Live Integration  
  const [twilioService] = useState(() => TwilioVoiceService);
  const [apiService] = useState(() => CallCenterApiService);
  const [isServiceInitialized, setIsServiceInitialized] = useState(false);
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false);

  // Enhanced State Management
  const [activeCall, setActiveCall] = useState(false);
  const [callType, setCallType] = useState('outbound');
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(true);
  const [callTimer, setCallTimer] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('June');
  const [phoneNumber, setPhoneNumber] = useState('(307) 301-7993');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [firstSentence, setFirstSentence] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [callStatus, setCallStatus] = useState('idle');
  const [transferRequested, setTransferRequested] = useState(false);
  const [inboundQueue, setInboundQueue] = useState([]);
  const [routingRules, setRoutingRules] = useState('intelligent');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showRecordingControls, setShowRecordingControls] = useState(false);
  
  // New Premium State
  const [darkMode, setDarkMode] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(0.7);
  const [callFlow, setCallFlow] = useState([]);
  const [agentQueue, setAgentQueue] = useState([]);
  const [activeAgents, setActiveAgents] = useState(15);
  const [showCallFlow, setShowCallFlow] = useState(false);
  const [showAgentDashboard, setShowAgentDashboard] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [showPerformanceDash, setShowPerformanceDash] = useState(false);
  const [showCampaignManager, setShowCampaignManager] = useState(false);
  const [recordingBookmarks, setRecordingBookmarks] = useState([]);
  const [showWaveform, setShowWaveform] = useState(false);
  const [whisperMode, setWhisperMode] = useState(false);
  const [sharedNotes, setSharedNotes] = useState('');
  const [predictiveScore, setPredictiveScore] = useState(0.85);
  const [recommendedAction, setRecommendedAction] = useState('');

  // Enhanced Contact Management
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Smith', number: '+1 (555) 123-4567', type: 'lead', priority: 'high', lastCalled: '2024-08-17', status: 'new', sentiment: 0.8, predictedSuccess: 0.75, tags: ['enterprise', 'warm'], notes: 'Interested in premium package' },
    { id: 2, name: 'Sarah Johnson', number: '+1 (555) 234-5678', type: 'customer', priority: 'medium', lastCalled: '2024-08-16', status: 'contacted', sentiment: 0.6, predictedSuccess: 0.85, tags: ['support', 'billing'], notes: 'Needs technical assistance' },
    { id: 3, name: 'Mike Davis', number: '+44 20 7123 4567', type: 'prospect', priority: 'low', lastCalled: '2024-08-15', status: 'callback', sentiment: 0.4, predictedSuccess: 0.45, tags: ['cold', 'international'], notes: 'Time zone considerations' },
    { id: 4, name: 'Emma Wilson', number: '+1 (555) 345-6789', type: 'customer', priority: 'high', lastCalled: '2024-08-17', status: 'completed', sentiment: 0.9, predictedSuccess: 0.95, tags: ['vip', 'satisfied'], notes: 'Successful upsell completed' },
    { id: 5, name: 'David Brown', number: '+61 2 1234 5678', type: 'lead', priority: 'medium', lastCalled: '2024-08-14', status: 'new', sentiment: 0.7, predictedSuccess: 0.65, tags: ['australia', 'demo'], notes: 'Scheduled for product demo' }
  ]);

  // Enhanced Metrics with Real-time Updates
  const [liveMetrics, setLiveMetrics] = useState({
    activeCalls: 12,
    queuedCalls: 8,
    avgWaitTime: '2:34',
    successRate: 94.2,
    totalCallsToday: 247,
    inboundCalls: 156,
    outboundCalls: 91,
    transferRate: 15.3,
    avgCallDuration: '4:23',
    conversionRate: 23.5,
    satisfactionScore: 4.7,
    revenueToday: 12450,
    agentsOnline: 15,
    peakHours: '2:00-4:00 PM'
  });

  // Enhanced Twilio-Supported Countries with Regional Data
  const countries = [
    // North America
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', timezone: 'UTC-5', peak: '9AM-5PM', cost: 0.015, region: 'North America', quality: 'Premium' },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', timezone: 'UTC-5', peak: '9AM-5PM', cost: 0.02, region: 'North America', quality: 'Premium' },
    { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', timezone: 'UTC-6', peak: '9AM-5PM', cost: 0.025, region: 'North America', quality: 'Standard' },
    
    // Europe
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', timezone: 'UTC+0', peak: '9AM-5PM', cost: 0.022, region: 'Europe', quality: 'Premium' },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.025, region: 'Europe', quality: 'Premium' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.028, region: 'Europe', quality: 'Premium' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.024, region: 'Europe', quality: 'Premium' },
    { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.026, region: 'Europe', quality: 'Standard' },
    { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.027, region: 'Europe', quality: 'Standard' },
    { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.023, region: 'Europe', quality: 'Premium' },
    { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.029, region: 'Europe', quality: 'Standard' },
    { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.025, region: 'Europe', quality: 'Premium' },
    { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮', timezone: 'UTC+2', peak: '9AM-5PM', cost: 0.026, region: 'Europe', quality: 'Standard' },
    { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.024, region: 'Europe', quality: 'Standard' },
    { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.032, region: 'Europe', quality: 'Premium' },
    { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.025, region: 'Europe', quality: 'Standard' },
    { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.021, region: 'Europe', quality: 'Standard' },
    { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿', timezone: 'UTC+1', peak: '9AM-5PM', cost: 0.022, region: 'Europe', quality: 'Standard' },
    { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', timezone: 'UTC+0', peak: '9AM-5PM', cost: 0.026, region: 'Europe', quality: 'Premium' },
    { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', timezone: 'UTC+0', peak: '9AM-5PM', cost: 0.024, region: 'Europe', quality: 'Standard' },
    
    // Asia-Pacific
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', timezone: 'UTC+10', peak: '9AM-5PM', cost: 0.035, region: 'Asia-Pacific', quality: 'Premium' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', timezone: 'UTC+12', peak: '9AM-5PM', cost: 0.038, region: 'Asia-Pacific', quality: 'Premium' },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', timezone: 'UTC+9', peak: '9AM-5PM', cost: 0.042, region: 'Asia-Pacific', quality: 'Premium' },
    { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', timezone: 'UTC+9', peak: '9AM-5PM', cost: 0.039, region: 'Asia-Pacific', quality: 'Standard' },
    { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', timezone: 'UTC+8', peak: '9AM-5PM', cost: 0.033, region: 'Asia-Pacific', quality: 'Premium' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰', timezone: 'UTC+8', peak: '9AM-5PM', cost: 0.034, region: 'Asia-Pacific', quality: 'Premium' },
    { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼', timezone: 'UTC+8', peak: '9AM-5PM', cost: 0.036, region: 'Asia-Pacific', quality: 'Standard' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', timezone: 'UTC+8', peak: '9AM-5PM', cost: 0.028, region: 'Asia-Pacific', quality: 'Standard' },
    { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', timezone: 'UTC+7', peak: '9AM-5PM', cost: 0.031, region: 'Asia-Pacific', quality: 'Standard' },
    { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', timezone: 'UTC+8', peak: '9AM-5PM', cost: 0.024, region: 'Asia-Pacific', quality: 'Standard' },
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', timezone: 'UTC+5:30', peak: '10AM-6PM', cost: 0.012, region: 'Asia-Pacific', quality: 'Standard' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', timezone: 'UTC+7', peak: '9AM-5PM', cost: 0.026, region: 'Asia-Pacific', quality: 'Standard' },
    
    // South America
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', timezone: 'UTC-3', peak: '9AM-5PM', cost: 0.023, region: 'South America', quality: 'Standard' },
    { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', timezone: 'UTC-3', peak: '9AM-5PM', cost: 0.025, region: 'South America', quality: 'Standard' },
    { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', timezone: 'UTC-4', peak: '9AM-5PM', cost: 0.027, region: 'South America', quality: 'Standard' },
    { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', timezone: 'UTC-5', peak: '9AM-5PM', cost: 0.024, region: 'South America', quality: 'Standard' },
    { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪', timezone: 'UTC-5', peak: '9AM-5PM', cost: 0.026, region: 'South America', quality: 'Standard' },
    
    // Middle East & Africa
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', timezone: 'UTC+4', peak: '9AM-5PM', cost: 0.045, region: 'Middle East', quality: 'Premium' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', timezone: 'UTC+3', peak: '9AM-5PM', cost: 0.042, region: 'Middle East', quality: 'Standard' },
    { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', timezone: 'UTC+2', peak: '9AM-5PM', cost: 0.038, region: 'Middle East', quality: 'Premium' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', timezone: 'UTC+2', peak: '9AM-5PM', cost: 0.032, region: 'Africa', quality: 'Standard' },
    { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', timezone: 'UTC+2', peak: '9AM-5PM', cost: 0.035, region: 'Africa', quality: 'Standard' },
    
    // Additional Major Markets
    { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', timezone: 'UTC+3', peak: '9AM-5PM', cost: 0.028, region: 'Europe', quality: 'Standard' },
    { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', timezone: 'UTC+3', peak: '9AM-5PM', cost: 0.029, region: 'Europe', quality: 'Standard' },
    { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷', timezone: 'UTC+2', peak: '9AM-5PM', cost: 0.027, region: 'Europe', quality: 'Standard' }
  ];

  // Group countries by region for better organization and filtering
  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery) return countries;
    return countries.filter(country => 
      country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      country.dialCode.includes(countrySearchQuery)
    );
  }, [countrySearchQuery]);

  const countryRegions = useMemo(() => {
    const regions = {};
    filteredCountries.forEach(country => {
      if (!regions[country.region]) {
        regions[country.region] = [];
      }
      regions[country.region].push(country);
    });
    return regions;
  }, [filteredCountries]);

  const selectedCountryData = countries.find(c => c.code === selectedCountry);
  const voices = [
    { name: 'June', accent: 'American', gender: 'Female', premium: true, specialty: 'Sales & Support', aiFeatures: ['sentiment', 'objection'], emotion: 'confident', successRate: 87 },
    { name: 'Alex', accent: 'British', gender: 'Male', premium: false, specialty: 'Professional Calls', aiFeatures: ['formal'], emotion: 'professional', successRate: 82 },
    { name: 'Sofia', accent: 'Spanish', gender: 'Female', premium: true, specialty: 'Multilingual Support', aiFeatures: ['translation', 'cultural'], emotion: 'warm', successRate: 85 },
    { name: 'Marcus', accent: 'Australian', gender: 'Male', premium: false, specialty: 'Casual Conversations', aiFeatures: ['casual'], emotion: 'friendly', successRate: 78 },
    { name: 'Yuki', accent: 'Japanese', gender: 'Female', premium: true, specialty: 'Technical Support', aiFeatures: ['technical', 'patience'], emotion: 'calm', successRate: 91 },
    { name: 'Emma', accent: 'Canadian', gender: 'Female', premium: true, specialty: 'Healthcare & Empathy', aiFeatures: ['empathy', 'medical'], emotion: 'caring', successRate: 93 }
  ];

  // Agent Queue Data
  const agentQueueData = [
    { id: 1, name: 'Alice Johnson', status: 'available', calls: 23, avgDuration: '3:45', satisfaction: 4.8, department: 'sales', expertise: ['closing', 'enterprise'] },
    { id: 2, name: 'Bob Smith', status: 'busy', calls: 18, avgDuration: '5:12', satisfaction: 4.6, department: 'support', expertise: ['technical', 'billing'] },
    { id: 3, name: 'Carol Davis', status: 'available', calls: 31, avgDuration: '2:58', satisfaction: 4.9, department: 'sales', expertise: ['cold-calling', 'lead-gen'] },
    { id: 4, name: 'David Wilson', status: 'break', calls: 15, avgDuration: '4:23', satisfaction: 4.7, department: 'support', expertise: ['escalation', 'vip'] },
    { id: 5, name: 'Eva Martinez', status: 'available', calls: 27, avgDuration: '3:34', satisfaction: 4.8, department: 'billing', expertise: ['payments', 'refunds'] }
  ];

  // Enhanced Keyboard Shortcuts
  const keyboardShortcuts = [
    { key: 'Space', action: 'Start/End Call', description: 'Toggle call state', category: 'Call Control' },
    { key: 'M', action: 'Mute/Unmute', description: 'Toggle microphone', category: 'Call Control' },
    { key: 'T', action: 'Transfer Call', description: 'Transfer to human agent', category: 'Call Control' },
    { key: 'R', action: 'Start/Stop Recording', description: 'Toggle call recording', category: 'Recording' },
    { key: 'P', action: 'Play/Pause Playback', description: 'Control recording playback', category: 'Recording' },
    { key: 'B', action: 'Add Bookmark', description: 'Bookmark current playback position', category: 'Recording' },
    { key: 'W', action: 'Toggle Whisper', description: 'Enable whisper mode for agent', category: 'Collaboration' },
    { key: 'Ctrl + /', action: 'Show Shortcuts', description: 'Display this help', category: 'Navigation' },
    { key: 'Ctrl + F', action: 'Search Contacts', description: 'Focus contact search', category: 'Navigation' },
    { key: 'Ctrl + D', action: 'Toggle Dark Mode', description: 'Switch theme', category: 'Interface' },
    { key: '1-5', action: 'Switch Tabs', description: 'Navigate configuration tabs', category: 'Navigation' },
    { key: 'Alt + A', action: 'AI Insights', description: 'Toggle AI insights panel', category: 'AI Features' },
    { key: 'Alt + Q', action: 'Agent Queue', description: 'Show agent dashboard', category: 'Management' },
    { key: 'Alt + F', action: 'Call Flow', description: 'Show call flow visualization', category: 'Analytics' },
    { key: 'Escape', action: 'Close Modals', description: 'Close any open modal', category: 'Navigation' },
    { key: 'Enter', action: 'Answer Call', description: 'Answer first queued call', category: 'Call Control' }
  ];

  // Initialize Twilio Service and Backend Connection
  useEffect(() => {
    const initializeServices = async () => {
      console.log('🚀 Initializing CallCenter Services...');
      
      try {
        // Initialize Twilio Voice Service
        twilioService.onCallStatusChange = (status) => {
          console.log('📞 Call Status Changed:', status);
          setCallStatus(status);
          if (status === 'connected') {
            setActiveCall(true);
          } else if (status === 'disconnected') {
            setActiveCall(false);
            setCallTimer(0);
          }
        };

        twilioService.onCallConnected = () => {
          console.log('✅ Call Connected');
          setActiveCall(true);
          setCallStatus('active');
        };

        twilioService.onCallDisconnected = () => {
          console.log('❌ Call Disconnected');
          setActiveCall(false);
          setCallTimer(0);
          setCallStatus('idle');
          setIsRecording(false);
          setTransferRequested(false);
          setWhisperMode(false);
        };

        twilioService.onIncomingCall = (call) => {
          console.log('📥 Incoming Call:', call);
          // Add to inbound queue
          const newCall = {
            id: Date.now(),
            number: call.from || '+1234567890',
            country: countries.find(c => c.code === 'US'),
            type: 'inbound',
            priority: 'medium',
            waitTime: 0,
            call: call
          };
          setInboundQueue(prev => [...prev, newCall]);
        };

        // Initialize Twilio
        await twilioService.initialize();
        setIsServiceInitialized(true);
        
        // Test backend connection
        const healthCheck = await apiService.apiRequest('/api/v1/system/health');
        if (healthCheck.success) {
          setIsConnectedToBackend(true);
          console.log('✅ Connected to Vocelio Backend');
        }

        console.log('🎯 Services Initialized Successfully');
        
      } catch (error) {
        console.error('❌ Service Initialization Error:', error);
        // Continue with mock mode
        setIsServiceInitialized(false);
        setIsConnectedToBackend(false);
      }
    };

    initializeServices();
    
    // Cleanup on unmount
    return () => {
      if (twilioService?.device) {
        twilioService.disconnect();
      }
    };
  }, [twilioService, apiService]);

  // Load live metrics from backend
  useEffect(() => {
    if (!isConnectedToBackend) return;
    
    const loadLiveMetrics = async () => {
      try {
        const analyticsResponse = await apiService.apiRequest('/api/v1/analytics');
        if (analyticsResponse.success) {
          const data = analyticsResponse.data;
          setLiveMetrics(prev => ({
            ...prev,
            activeCalls: data.calls?.total || prev.activeCalls,
            successRate: data.calls?.success_rate || prev.successRate,
            totalCallsToday: data.calls?.today || prev.totalCallsToday,
            agentsOnline: data.agents?.active || prev.agentsOnline,
            conversionRate: data.conversion_rate || prev.conversionRate,
            revenueToday: data.revenue?.today || prev.revenueToday
          }));
        }
      } catch (error) {
        console.warn('⚠️ Failed to load live metrics, using mock data');
      }
    };

    loadLiveMetrics();
    const interval = setInterval(loadLiveMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [isConnectedToBackend, apiService]);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced timer effects
  useEffect(() => {
    let interval;
    if (activeCall) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
        if (isRecording) {
          setRecordingTime(prev => prev + 1);
        }
        // Simulate real-time sentiment updates
        if (Math.random() < 0.3) {
          setSentimentScore(prev => Math.max(0, Math.min(1, prev + (Math.random() - 0.5) * 0.1)));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall, isRecording]);

  // Real-time metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        activeCalls: prev.activeCalls + Math.floor(Math.random() * 3) - 1,
        queuedCalls: Math.max(0, prev.queuedCalls + Math.floor(Math.random() * 3) - 1),
        totalCallsToday: prev.totalCallsToday + Math.floor(Math.random() * 2),
        successRate: Math.max(85, Math.min(98, prev.successRate + (Math.random() - 0.5) * 2)),
        revenueToday: prev.revenueToday + Math.floor(Math.random() * 100)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Inbound queue simulation with enhanced data
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const callTypes = ['sales_inquiry', 'support', 'complaint', 'general', 'billing', 'technical'];
        const sentiments = ['positive', 'neutral', 'negative'];
        const newCall = {
          id: Date.now(),
          number: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          country: countries[Math.floor(Math.random() * countries.length)],
          type: callTypes[Math.floor(Math.random() * callTypes.length)],
          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
          waitTime: 0,
          sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
          predictedIssue: ['Pricing Question', 'Technical Support', 'Billing Issue', 'General Inquiry'][Math.floor(Math.random() * 4)],
          estimatedDuration: Math.floor(Math.random() * 10) + 2,
          customerValue: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
        };
        setInboundQueue(prev => [...prev, newCall].slice(-8));
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          handleCall();
          break;
        case 'm':
          if (activeCall) setMuted(!muted);
          break;
        case 't':
          if (activeCall && callType === 'outbound' && callTimer > 30) {
            handleTransferToHuman();
          }
          break;
        case 'r':
          if (activeCall) toggleRecording();
          break;
        case 'p':
          if (showRecordingControls) togglePlayback();
          break;
        case 'b':
          if (isPlayingBack) addBookmark();
          break;
        case 'w':
          if (activeCall) setWhisperMode(!whisperMode);
          break;
        case 'enter':
          if (inboundQueue.length > 0) {
            handleInboundCall(inboundQueue[0]);
          }
          break;
        case 'escape':
          setShowKeyboardShortcuts(false);
          setShowCountryDropdown(false);
          setShowAIInsights(false);
          setShowCallFlow(false);
          setShowAgentDashboard(false);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          const tabs = ['basic', 'prompts', 'routing', 'transfers', 'analytics'];
          setActiveTab(tabs[parseInt(e.key) - 1]);
          break;
      }

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case '/':
            e.preventDefault();
            setShowKeyboardShortcuts(!showKeyboardShortcuts);
            break;
          case 'f':
            e.preventDefault();
            document.getElementById('contact-search')?.focus();
            break;
          case 'd':
            e.preventDefault();
            setDarkMode(!darkMode);
            break;
        }
      }

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'a':
            e.preventDefault();
            setShowAIInsights(!showAIInsights);
            break;
          case 'q':
            e.preventDefault();
            setShowAgentDashboard(!showAgentDashboard);
            break;
          case 'f':
            e.preventDefault();
            setShowCallFlow(!showCallFlow);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeCall, muted, callType, callTimer, transferRequested, inboundQueue, showKeyboardShortcuts, isPlayingBack, showRecordingControls, darkMode, showAIInsights, showAgentDashboard, showCallFlow, whisperMode]);

  // Utility functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getSentimentColor = (score) => {
    if (score > 0.7) return 'text-green-600';
    if (score > 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentBg = (score) => {
    if (score > 0.7) return 'bg-green-100';
    if (score > 0.4) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Enhanced handlers with Live Twilio Integration
  const handleCall = async () => {
    if (!activeCall) {
      // Start outbound call
      if (!isServiceInitialized) {
        // Fallback to mock mode
        console.warn('⚠️ Twilio not initialized, using mock mode');
        setActiveCall(true);
        setCallStatus('connecting');
        setTimeout(() => setCallStatus('active'), 2000);
        setCallTimer(0);
        setRecordingTime(0);
        setRecommendedAction('Start with warm greeting and product benefits');
        return;
      }

      try {
        console.log('📞 Starting outbound call to:', phoneNumber);
        console.log('📞 DEBUG: CallCenter phoneNumber:', phoneNumber);
        console.log('📞 DEBUG: selectedVoice:', selectedVoice);
        setCallStatus('connecting');
        
        // Use Twilio Voice Service for real calls with CORRECT parameter format
        const callOptions = {
          voice: selectedVoice.toLowerCase(),
          prompt: prompt,
          firstSentence: firstSentence
        };

        console.log('📞 DEBUG: Calling makeCall with phoneNumber:', phoneNumber, 'callOptions:', callOptions);
        await twilioService.makeCall(phoneNumber, callOptions);
        
        // Log call to backend
        if (isConnectedToBackend) {
          await apiService.apiRequest('/api/v1/calls/start', {
            method: 'POST',
            body: JSON.stringify({
              to: phoneNumber,
              type: callType,
              voice: selectedVoice,
              country: selectedCountry,
              timestamp: new Date().toISOString()
            })
          });
        }

        setCallTimer(0);
        setRecordingTime(0);
        setRecommendedAction('Call connecting... Prepare your opening script');
        
      } catch (error) {
        console.error('❌ Call Start Error:', error);
        setCallStatus('error');
        alert(`Call failed: ${error.message}`);
      }
    } else {
      // End call
      try {
        console.log('📞 Ending call');
        
        if (isServiceInitialized) {
          await twilioService.hangup();
        }

        // Log call end to backend
        if (isConnectedToBackend) {
          await apiService.apiRequest('/api/v1/calls/end', {
            method: 'POST',
            body: JSON.stringify({
              duration: callTimer,
              outcome: transferRequested ? 'transferred' : 'completed',
              timestamp: new Date().toISOString()
            })
          });
        }

        // Reset call state
        setActiveCall(false);
        setCallStatus('idle');
        setCallTimer(0);
        setTransferRequested(false);
        setIsRecording(false);
        setRecordingTime(0);
        setWhisperMode(false);
        setRecommendedAction('');
        
      } catch (error) {
        console.error('❌ Call End Error:', error);
        // Force reset even if error
        setActiveCall(false);
        setCallStatus('idle');
      }
    }
  };

  const handleTransferToHuman = async () => {
    if (!activeCall) return;
    
    setTransferRequested(true);
    console.log('🔄 Transferring call to human agent');

    try {
      if (isServiceInitialized && isConnectedToBackend) {
        // Request transfer through backend
        const transferResponse = await apiService.apiRequest('/api/v1/calls/transfer', {
          method: 'POST',
          body: JSON.stringify({
            callId: twilioService.activeCall?.parameters?.CallSid,
            reason: 'agent_requested',
            timestamp: new Date().toISOString()
          })
        });

        if (transferResponse.success) {
          await twilioService.transferCall();
          alert('Call transferred to human agent successfully!');
        }
      } else {
        // Mock transfer
        setTimeout(() => {
          alert('Call transferred to human agent successfully!');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Transfer Error:', error);
      alert(`Transfer failed: ${error.message}`);
    } finally {
      setTransferRequested(false);
    }
  };

  const handleInboundCall = async (call) => {
    try {
      console.log('📥 Answering inbound call:', call);
      
      if (call.call && isServiceInitialized) {
        // Answer real Twilio call
        await call.call.accept();
      }

      setCallType('inbound');
      setActiveCall(true);
      setCallStatus('active');
      setPhoneNumber(call.number);
      setCallTimer(0);
      setInboundQueue(prev => prev.filter(c => c.id !== call.id));

      // Log inbound call to backend
      if (isConnectedToBackend) {
        await apiService.apiRequest('/api/v1/calls/inbound', {
          method: 'POST',
          body: JSON.stringify({
            from: call.number,
            type: call.type,
            priority: call.priority,
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('❌ Inbound Call Error:', error);
      alert(`Failed to answer call: ${error.message}`);
    }
  };

  const toggleRecording = async () => {
    if (!activeCall) return;

    try {
      if (!isRecording) {
        console.log('🎙️ Starting call recording');
        
        if (isServiceInitialized) {
          // Start real recording through Twilio
          await twilioService.startRecording();
        }

        setIsRecording(true);
        setRecordingTime(0);
        setShowRecordingControls(true);
        setRecordingBookmarks([]);

        // Log recording start to backend
        if (isConnectedToBackend) {
          await apiService.apiRequest('/api/v1/calls/recording/start', {
            method: 'POST',
            body: JSON.stringify({
              callId: twilioService.activeCall?.parameters?.CallSid || 'mock_call',
              timestamp: new Date().toISOString()
            })
          });
        }
      } else {
        console.log('⏹️ Stopping call recording');
        
        if (isServiceInitialized) {
          // Stop real recording through Twilio
          await twilioService.stopRecording();
        }

        setIsRecording(false);

        // Log recording end to backend
        if (isConnectedToBackend) {
          await apiService.apiRequest('/api/v1/calls/recording/stop', {
            method: 'POST',
            body: JSON.stringify({
              callId: twilioService.activeCall?.parameters?.CallSid || 'mock_call',
              duration: recordingTime,
              timestamp: new Date().toISOString()
            })
          });
        }
      }
    } catch (error) {
      console.error('❌ Recording Toggle Error:', error);
      alert(`Recording ${isRecording ? 'stop' : 'start'} failed: ${error.message}`);
    }
  };

  const toggleMute = async () => {
    if (!activeCall) return;

    try {
      if (isServiceInitialized) {
        if (muted) {
          await twilioService.unmute();
        } else {
          await twilioService.mute();
        }
      }
      setMuted(!muted);
      console.log(`🔇 ${muted ? 'Unmuted' : 'Muted'} microphone`);
    } catch (error) {
      console.error('❌ Mute Toggle Error:', error);
      // Still update UI even if service fails
      setMuted(!muted);
    }
  };

  const adjustVolume = async (newVolume) => {
    try {
      if (isServiceInitialized) {
        await twilioService.setVolume(newVolume);
      }
      setVolume(newVolume);
      console.log('🔊 Volume adjusted to:', newVolume);
    } catch (error) {
      console.error('❌ Volume Adjust Error:', error);
      // Still update UI even if service fails
      setVolume(newVolume);
    }
  };

  const togglePlayback = () => {
    setIsPlayingBack(!isPlayingBack);
    if (!isPlayingBack && playbackTime >= playbackDuration) {
      setPlaybackTime(0);
    }
    if (!playbackDuration) {
      setPlaybackDuration(recordingTime || 180);
    }
  };

  const addBookmark = () => {
    const bookmark = {
      id: Date.now(),
      time: playbackTime,
      note: `Bookmark at ${formatTime(playbackTime)}`
    };
    setRecordingBookmarks(prev => [...prev, bookmark]);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.number.includes(searchQuery);
    const matchesFilter = filterType === 'all' || contact.type === filterType || contact.status === filterType;
    return matchesSearch && matchesFilter;
  });

  // Theme classes
  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-200 text-gray-900';

  const TabButton = ({ id, label, icon: Icon, isActive, onClick, shortcut }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
          : darkMode 
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={`${label} (${shortcut})`}
    >
      <Icon size={16} />
      {!mobileView && label}
      {!mobileView && <span className="text-xs opacity-70">({shortcut})</span>}
    </button>
  );

  // Main render with responsive design
  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      {/* Enhanced Header with Premium Features */}
      <header className={`${cardClasses} shadow-sm border-b backdrop-blur-lg bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Call Center Pro Max
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enterprise-Grade Communication Platform
                  </p>
                </div>
              </div>
              
              {/* Live Connection Status */}
              <div className="hidden md:flex items-center gap-3">
                {/* Twilio Service Status */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isServiceInitialized ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Twilio {isServiceInitialized ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                {/* Backend API Status */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnectedToBackend ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Backend {isConnectedToBackend ? 'Live' : 'Mock'}
                  </span>
                </div>
                
                {/* Call Status */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${activeCall ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {callStatus === 'idle' ? 'Ready' : callStatus.charAt(0).toUpperCase() + callStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Header Controls */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 hover:bg-opacity-20 hover:bg-gray-500 rounded-lg transition-colors ${darkMode ? 'text-yellow-400' : 'text-gray-600'}`}
                title="Toggle Dark Mode (Ctrl+D)"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button 
                onClick={() => setShowAIInsights(!showAIInsights)}
                className={`p-2 hover:bg-opacity-20 hover:bg-gray-500 rounded-lg transition-colors ${showAIInsights ? 'text-purple-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                title="AI Insights (Alt+A)"
              >
                <Brain size={20} />
              </button>
              
              <button 
                onClick={() => setShowAgentDashboard(!showAgentDashboard)}
                className={`p-2 hover:bg-opacity-20 hover:bg-gray-500 rounded-lg transition-colors ${showAgentDashboard ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                title="Agent Dashboard (Alt+Q)"
              >
                <Users size={20} />
              </button>
              
              <button 
                onClick={() => setShowCallFlow(!showCallFlow)}
                className={`p-2 hover:bg-opacity-20 hover:bg-gray-500 rounded-lg transition-colors ${showCallFlow ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                title="Call Flow (Alt+F)"
              >
                <Workflow size={20} />
              </button>
              
              <button 
                onClick={() => setShowKeyboardShortcuts(true)}
                className={`p-2 hover:bg-opacity-20 hover:bg-gray-500 rounded-lg transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                title="Keyboard Shortcuts (Ctrl+/)"
              >
                <Keyboard size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Mobile-First Responsive Grid */}
        <div className={`grid grid-cols-1 ${mobileView ? '' : 'lg:grid-cols-3'} gap-6`}>
          {/* Main Interface - Responsive */}
          <div className={`${mobileView ? '' : 'lg:col-span-2'} space-y-6`}>
            {/* Enhanced Quick Stats with Real-time Updates */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className={`${cardClasses} p-4 rounded-xl shadow-sm border transform hover:scale-105 transition-all duration-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Calls</p>
                    <p className="text-xl md:text-2xl font-bold">{liveMetrics.totalCallsToday}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp size={12} className="text-green-500" />
                      <span className="text-xs text-green-500">+12%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                    <PhoneCall className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>

              <div className={`${cardClasses} p-4 rounded-xl shadow-sm border transform hover:scale-105 transition-all duration-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate</p>
                    <p className="text-xl md:text-2xl font-bold text-green-600">{liveMetrics.successRate.toFixed(1)}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div className="bg-green-600 h-1.5 rounded-full" style={{width: `${liveMetrics.successRate}%`}}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                </div>
              </div>

              <div className={`${cardClasses} p-4 rounded-xl shadow-sm border transform hover:scale-105 transition-all duration-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</p>
                    <p className="text-xl md:text-2xl font-bold text-purple-600">{formatCurrency(liveMetrics.revenueToday)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUp size={12} className="text-purple-500" />
                      <span className="text-xs text-purple-500">+8.5%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                    <TrendingUp className="text-purple-600" size={20} />
                  </div>
                </div>
              </div>

              <div className={`${cardClasses} p-4 rounded-xl shadow-sm border transform hover:scale-105 transition-all duration-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Satisfaction</p>
                    <p className="text-xl md:text-2xl font-bold text-yellow-600">{liveMetrics.satisfactionScore}/5</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < Math.floor(liveMetrics.satisfactionScore) ? 'text-yellow-500 fill-current' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg">
                    <Star className="text-yellow-600" size={20} />
                  </div>
                </div>
              </div>

              <div className={`${cardClasses} p-4 rounded-xl shadow-sm border transform hover:scale-105 transition-all duration-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agents Online</p>
                    <p className="text-xl md:text-2xl font-bold text-blue-600">{liveMetrics.agentsOnline}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Circle size={8} className="text-green-500 fill-current" />
                      <span className="text-xs text-green-500">All Active</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                    <UserCheck className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Call Interface with AI Features */}
            <div className={`${cardClasses} rounded-xl shadow-lg border backdrop-blur-lg bg-opacity-95`}>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-semibold">Smart AI Call Interface</h2>
                    
                    {/* Call Type Selector */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCallType('outbound')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          callType === 'outbound' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                            : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <PhoneOutgoing size={14} className="inline mr-1" />
                        Outbound
                      </button>
                      <button
                        onClick={() => setCallType('inbound')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          callType === 'inbound' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                            : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <PhoneIncoming size={14} className="inline mr-1" />
                        Inbound
                      </button>
                    </div>
                    
                    {/* Call Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      callStatus === 'idle' ? darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600' :
                      callStatus === 'connecting' ? 'bg-yellow-100 text-yellow-600 animate-pulse' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {callStatus === 'idle' ? 'Ready' : callStatus === 'connecting' ? 'Connecting...' : 'Live Call'}
                    </div>
                  </div>
                  
                  {/* Call Timer and AI Insights */}
                  {activeCall && (
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-lg font-mono bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-lg">
                        <Clock size={16} className="text-gray-500" />
                        {formatTime(callTimer)}
                      </div>
                      
                      {/* Real-time Sentiment */}
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getSentimentBg(sentimentScore)}`}>
                        <Activity size={16} className={getSentimentColor(sentimentScore)} />
                        <span className={`text-sm font-medium ${getSentimentColor(sentimentScore)}`}>
                          {sentimentScore > 0.7 ? 'Positive' : sentimentScore > 0.4 ? 'Neutral' : 'Negative'}
                        </span>
                      </div>

                      {/* Recording Indicator */}
                      {isRecording && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                          <Radio size={16} className="animate-pulse" />
                          <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                        </div>
                      )}

                      {/* Whisper Mode */}
                      {whisperMode && (
                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                          <MessageCircle size={16} />
                          <span className="text-sm font-medium">Whisper</span>
                        </div>
                      )}

                      {/* Transfer Button */}
                      {callType === 'outbound' && callTimer > 30 && (
                        <button
                          onClick={handleTransferToHuman}
                          disabled={transferRequested}
                          className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                            transferRequested 
                              ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                          }`}
                          title="Transfer to Human (T)"
                        >
                          {transferRequested ? 'Transferring...' : 'Transfer'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* AI Recommendation Banner */}
                {activeCall && recommendedAction && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Brain className="text-blue-600" size={20} />
                      <div>
                        <h4 className="font-medium text-blue-900">AI Recommendation</h4>
                        <p className="text-sm text-blue-700">{recommendedAction}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-xs text-blue-600 font-medium">Success: {(predictiveScore * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Phone Number Input with Smart Country Detection */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number
                  </label>
                  <div className="flex relative">
                    <div className="relative">
                      <button
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className={`flex items-center px-4 py-3 border border-r-0 rounded-l-lg hover:bg-opacity-80 transition-all duration-200 transform hover:scale-105 ${
                          darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                        } ${showCountryDropdown ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <span className="text-xl mr-3">{selectedCountryData.flag}</span>
                        <div className="text-left">
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {selectedCountryData.dialCode}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {selectedCountryData.code}
                          </div>
                        </div>
                        <ChevronDown size={16} className={`ml-2 transition-transform duration-200 ${showCountryDropdown ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      </button>
                      
                      {showCountryDropdown && (
                        <div className={`absolute top-full left-0 z-50 w-96 border rounded-xl shadow-2xl mt-2 max-h-80 overflow-hidden backdrop-blur-lg bg-opacity-95 ${
                          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                        onMouseLeave={() => {
                          // Optional: Auto-close on mouse leave
                          // setShowCountryDropdown(false);
                        }}>
                          {/* Search Bar */}
                          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                            <div className="relative">
                              <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                              <input
                                type="text"
                                placeholder="Search countries..."
                                value={countrySearchQuery}
                                onChange={(e) => setCountrySearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                  darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500'
                                }`}
                                autoFocus
                              />
                            </div>
                          </div>
                          
                          {/* Country List by Region */}
                          <div className="max-h-64 overflow-y-auto" style={{scrollBehavior: 'smooth'}}>
                            {Object.keys(countryRegions).length === 0 ? (
                              <div className="p-4 text-center">
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  No countries found
                                </p>
                              </div>
                            ) : (
                              Object.entries(countryRegions).map(([region, regionCountries]) => (
                                <div key={region}>
                                  <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10 ${
                                    darkMode ? 'bg-gray-700 text-gray-300 border-b border-gray-600' : 'bg-gray-100 text-gray-600 border-b border-gray-200'
                                  }`}>
                                    {region} ({regionCountries.length})
                                  </div>
                                  {regionCountries.map((country) => (
                                    <button
                                      key={country.code}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedCountry(country.code);
                                        setShowCountryDropdown(false);
                                        setCountrySearchQuery('');
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                      }}
                                      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 text-left cursor-pointer ${
                                        darkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-50 active:bg-gray-100'
                                      } ${country.code === selectedCountry ? 
                                        darkMode ? 'bg-blue-900 border-l-4 border-blue-400' : 'bg-blue-50 border-l-4 border-blue-500' 
                                        : ''
                                      }`}
                                      style={{
                                        transition: 'all 0.2s ease-in-out'
                                      }}
                                    >
                                      <span className="text-xl">{country.flag}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium truncate">{country.name}</div>
                                          <div className={`px-2 py-1 text-xs rounded-full ${
                                            country.quality === 'Premium' 
                                              ? 'bg-green-100 text-green-700' 
                                              : 'bg-yellow-100 text-yellow-700'
                                          }`}>
                                            {country.quality}
                                          </div>
                                        </div>
                                        <div className={`text-sm flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                          <span className="font-mono">{country.dialCode}</span>
                                          <span>•</span>
                                          <span>{country.timezone}</span>
                                          <span>•</span>
                                          <span className="text-green-600 font-medium">${country.cost}/min</span>
                                        </div>
                                        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                          Peak hours: {country.peak}
                                        </div>
                                      </div>
                                      {country.code === selectedCountry && (
                                        <CheckCircle size={16} className="text-blue-500" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              ))
                            )}
                          </div>
                          
                          {/* Footer with Stats */}
                          <div className={`p-3 border-t text-center ${
                            darkMode ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'
                          }`}>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {filteredCountries.length} countries {countrySearchQuery ? 'found' : 'supported'} • Powered by Twilio
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  {/* Enhanced Smart Suggestions */}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                      darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Clock size={12} />
                      Best time: {selectedCountryData.peak}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                      darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                    }`}>
                      <TrendingUp size={12} />
                      ${selectedCountryData.cost}/min
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                      selectedCountryData.quality === 'Premium'
                        ? darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                        : darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <Star size={12} />
                      {selectedCountryData.quality} Quality
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Globe size={12} />
                      {selectedCountryData.timezone}
                    </span>
                  </div>
                </div>

                {/* Enhanced Voice Selection with AI Metrics */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    AI Agent Voice
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {voices.map((voice) => (
                      <button
                        key={voice.name}
                        onClick={() => setSelectedVoice(voice.name)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                          selectedVoice === voice.name
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
                            : darkMode 
                            ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                            <span className="font-medium">{voice.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {voice.premium && (
                              <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full">
                                Pro
                              </div>
                            )}
                            <div className="text-xs text-green-600 font-medium">{voice.successRate}%</div>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {voice.accent} • {voice.gender}
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {voice.specialty}
                          </p>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {voice.aiFeatures.map((feature) => (
                              <span key={feature} className={`text-xs px-2 py-1 rounded ${
                                darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Call Controls with Advanced Features */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {/* Mute Button */}
                  <button
                    onClick={toggleMute}
                    className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
                      muted 
                        ? 'bg-red-100 text-red-600 shadow-lg' 
                        : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={!activeCall}
                    title="Mute/Unmute (M)"
                  >
                    {muted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  {/* Recording Button */}
                  <button
                    onClick={toggleRecording}
                    className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
                      isRecording 
                        ? 'bg-red-100 text-red-600 shadow-lg' 
                        : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={!activeCall}
                    title="Start/Stop Recording (R)"
                  >
                    <Radio size={20} className={isRecording ? 'animate-pulse' : ''} />
                  </button>

                  {/* Whisper Mode */}
                  <button
                    onClick={() => setWhisperMode(!whisperMode)}
                    className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
                      whisperMode 
                        ? 'bg-blue-100 text-blue-600 shadow-lg' 
                        : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={!activeCall}
                    title="Whisper Mode (W)"
                  >
                    <MessageCircle size={20} />
                  </button>
                  
                  {/* Main Call Button */}
                  <button
                    onClick={handleCall}
                    className={`px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                      activeCall
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        : callType === 'outbound'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    }`}
                    title="Start/End Call (Space)"
                  >
                    {activeCall ? (
                      <div className="flex items-center gap-2">
                        <Square size={20} />
                        End Call
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {callType === 'outbound' ? <PhoneOutgoing size={20} /> : <PhoneIncoming size={20} />}
                        {mobileView ? 'Call' : callType === 'outbound' ? 'Start Outbound Call' : 'Ready for Inbound'}
                      </div>
                    )}
                  </button>

                  {/* Volume Button */}
                  <button
                    onClick={() => setVolume(!volume)}
                    className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
                      !volume 
                        ? 'bg-red-100 text-red-600 shadow-lg' 
                        : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={!activeCall}
                    title="Volume On/Off"
                  >
                    {volume ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>
                </div>

                {/* Enhanced Recording Playback with Waveform */}
                {showRecordingControls && (
                  <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Call Recording Playback</h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowWaveform(!showWaveform)}
                          className={`p-1 rounded ${showWaveform ? 'bg-blue-500 text-white' : darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Toggle Waveform"
                        >
                          <Waves size={16} />
                        </button>
                        <button
                          onClick={() => setShowRecordingControls(false)}
                          className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Waveform Visualization */}
                    {showWaveform && (
                      <div className="mb-4 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-end justify-center gap-1 p-2">
                        {[...Array(50)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white bg-opacity-70 rounded-full"
                            style={{
                              width: '2px',
                              height: `${Math.random() * 100}%`,
                              opacity: i < (playbackTime / playbackDuration) * 50 ? 1 : 0.3
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {/* Progress Bar with Bookmarks */}
                      <div className="flex items-center gap-3">
                        <span className={`text-sm w-12 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {formatTime(playbackTime)}
                        </span>
                        <div className="flex-1 relative">
                          <div className={`rounded-full h-2 cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${playbackDuration > 0 ? (playbackTime / playbackDuration) * 100 : 0}%` }}
                            />
                          </div>
                          
                          {/* Bookmarks */}
                          {recordingBookmarks.map((bookmark) => (
                            <div
                              key={bookmark.id}
                              className="absolute top-0 w-3 h-3 bg-yellow-500 rounded-full transform -translate-y-0.5 cursor-pointer hover:scale-125 transition-transform"
                              style={{ left: `${(bookmark.time / playbackDuration) * 100}%` }}
                              title={bookmark.note}
                              onClick={() => setPlaybackTime(bookmark.time)}
                            />
                          ))}
                          
                          <input
                            type="range"
                            min="0"
                            max={playbackDuration}
                            value={playbackTime}
                            onChange={(e) => setPlaybackTime(parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <span className={`text-sm w-12 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {formatTime(playbackDuration)}
                        </span>
                      </div>

                      {/* Enhanced Playback Controls */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setPlaybackTime(Math.max(0, playbackTime - 10))}
                          className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Skip backward 10s"
                        >
                          <Rewind size={16} />
                        </button>
                        
                        <button
                          onClick={() => setPlaybackTime(Math.max(0, playbackTime - 5))}
                          className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Skip backward 5s"
                        >
                          <SkipBack size={16} />
                        </button>
                        
                        <button
                          onClick={togglePlayback}
                          className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full transition-all transform hover:scale-105"
                          title="Play/Pause (P)"
                        >
                          {isPlayingBack ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        
                        <button
                          onClick={() => setPlaybackTime(Math.min(playbackDuration, playbackTime + 5))}
                          className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Skip forward 5s"
                        >
                          <SkipForward size={16} />
                        </button>
                        
                        <button
                          onClick={() => setPlaybackTime(Math.min(playbackDuration, playbackTime + 10))}
                          className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Skip forward 10s"
                        >
                          <FastForward size={16} />
                        </button>

                        <div className={`border-l h-8 mx-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>

                        {/* Bookmark Button */}
                        <button
                          onClick={addBookmark}
                          disabled={!isPlayingBack}
                          className={`p-2 rounded-full transition-colors ${
                            isPlayingBack 
                              ? 'text-yellow-600 hover:bg-yellow-100' 
                              : darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}
                          title="Add Bookmark (B)"
                        >
                          <Bookmark size={16} />
                        </button>

                        <select
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                          className={`text-sm border rounded px-2 py-1 ${
                            darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                          }`}
                          title="Playback Speed"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={0.75}>0.75x</option>
                          <option value={1}>1x</option>
                          <option value={1.25}>1.25x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>

                        <button
                          onClick={() => {
                            setPlaybackTime(0);
                            setIsPlayingBack(false);
                          }}
                          className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Reset to beginning"
                        >
                          <RotateCcw size={16} />
                        </button>

                        <button
                          className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Download recording"
                        >
                          <Download size={16} />
                        </button>
                      </div>

                      {/* Bookmarks List */}
                      {recordingBookmarks.length > 0 && (
                        <div className="mt-3">
                          <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Bookmarks
                          </h5>
                          <div className="space-y-1 max-h-20 overflow-y-auto">
                            {recordingBookmarks.map((bookmark) => (
                              <div
                                key={bookmark.id}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                                  darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                                }`}
                                onClick={() => setPlaybackTime(bookmark.time)}
                              >
                                <span className="text-sm">{bookmark.note}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRecordingBookmarks(prev => prev.filter(b => b.id !== bookmark.id));
                                  }}
                                  className={`p-1 rounded ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Configuration with Enhanced Features */}
            <div className={`${cardClasses} rounded-xl shadow-lg border backdrop-blur-lg bg-opacity-95`}>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Settings size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                    <h3 className="text-lg font-semibold">Advanced Configuration</h3>
                  </div>
                  <div className={`text-xs ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Press 1-5 to switch tabs
                  </div>
                </div>

                {/* Enhanced Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
                  <TabButton id="basic" label="Basic Setup" icon={Phone} isActive={activeTab === 'basic'} onClick={setActiveTab} shortcut="1" />
                  <TabButton id="prompts" label="AI Prompts" icon={MessageSquare} isActive={activeTab === 'prompts'} onClick={setActiveTab} shortcut="2" />
                  <TabButton id="routing" label="Smart Routing" icon={Route} isActive={activeTab === 'routing'} onClick={setActiveTab} shortcut="3" />
                  <TabButton id="transfers" label="Transfer Rules" icon={PhoneForwarded} isActive={activeTab === 'transfers'} onClick={setActiveTab} shortcut="4" />
                  <TabButton id="analytics" label="Analytics" icon={BarChart3} isActive={activeTab === 'analytics'} onClick={setActiveTab} shortcut="5" />
                </div>

                {/* Enhanced Tab Content */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Opening Greeting
                      </label>
                      <input
                        type="text"
                        value={firstSentence}
                        onChange={(e) => setFirstSentence(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                        placeholder="Thank you for calling [Company Name], how may I help you today?"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Call Objective
                        </label>
                        <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}>
                          <option>Sales & Lead Generation</option>
                          <option>Customer Support & Help</option>
                          <option>Appointment Scheduling</option>
                          <option>Survey & Feedback Collection</option>
                          <option>General Reception & Routing</option>
                          <option>Follow-up & Retention</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Language & Locale
                        </label>
                        <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}>
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Spanish (ES)</option>
                          <option>French (FR)</option>
                          <option>German (DE)</option>
                          <option>Japanese (JP)</option>
                          <option>Chinese (CN)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          AI Personality
                        </label>
                        <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}>
                          <option>Professional & Confident</option>
                          <option>Friendly & Approachable</option>
                          <option>Empathetic & Caring</option>
                          <option>Authoritative & Direct</option>
                          <option>Casual & Conversational</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Escalation Threshold
                        </label>
                        <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}>
                          <option>Low (Transfer quickly)</option>
                          <option>Medium (Balanced approach)</option>
                          <option>High (AI handles most)</option>
                          <option>Custom Rules</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'prompts' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'Sales Outreach', icon: TrendingUp, color: 'purple', description: 'Professional sales calls with lead qualification' },
                        { name: 'Customer Support', icon: Headphones, color: 'blue', description: 'Technical support with smart escalation' },
                        { name: 'Appointment Booking', icon: Calendar, color: 'green', description: 'Schedule appointments with availability check' },
                        { name: 'Lead Qualification', icon: Target, color: 'orange', description: 'Qualify prospects and gather information' }
                      ].map((preset) => (
                        <div key={preset.name} className={`p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer ${
                          darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 bg-${preset.color}-100 rounded-lg`}>
                              <preset.icon className={`text-${preset.color}-600`} size={20} />
                            </div>
                            <h4 className="font-medium">{preset.name}</h4>
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {preset.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Custom AI Instructions
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                        placeholder="Provide specific instructions for the AI agent behavior, tone, and responses..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'routing' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Routing Strategy
                        </label>
                        <select 
                          value={routingRules}
                          onChange={(e) => setRoutingRules(e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                          }`}
                        >
                          <option value="intelligent">AI-Powered Intelligent Routing</option>
                          <option value="round-robin">Round Robin Distribution</option>
                          <option value="skill-based">Skill-Based Routing</option>
                          <option value="priority">Priority-Based Assignment</option>
                          <option value="load-balanced">Load Balanced</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Queue Management
                        </label>
                        <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}>
                          <option>FIFO (First In, First Out)</option>
                          <option>Priority Queue</option>
                          <option>VIP Fast Track</option>
                          <option>Callback Queue</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Department Routing Rules</h4>
                      {agentQueueData.slice(0, 3).map((dept, index) => (
                        <div key={dept.id} className={`p-4 border rounded-lg ${
                          darkMode ? 'border-gray-600' : 'border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{dept.department.charAt(0).toUpperCase() + dept.department.slice(1)}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              dept.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {dept.calls} agents
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              Avg Response: {dept.avgDuration}
                            </span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              Rating: {dept.satisfaction}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'transfers' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Auto-Transfer Triggers
                        </label>
                        <div className="space-y-2">
                          {[
                            'Complex technical issues',
                            'Billing disputes > $500',
                            'Angry customer sentiment',
                            'VIP customer requests',
                            'Legal inquiries',
                            'Enterprise sales leads'
                          ].map((trigger, index) => (
                            <label key={index} className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                defaultChecked={index < 3}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm">{trigger}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Transfer Timeout
                        </label>
                        <select className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}>
                          <option>30 seconds</option>
                          <option>1 minute</option>
                          <option>2 minutes</option>
                          <option>5 minutes</option>
                          <option>No timeout</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Transfer Message
                      </label>
                      <textarea
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                        }`}
                        placeholder="I'll connect you with a specialist who can better assist you with this request..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="text-green-600" size={20} />
                          <span className="font-medium">Conversion Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">{liveMetrics.conversionRate}%</div>
                        <div className="text-sm text-green-600">+5.2% from last week</div>
                      </div>
                      
                      <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-blue-600" size={20} />
                          <span className="font-medium">Avg Duration</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{liveMetrics.avgCallDuration}</div>
                        <div className="text-sm text-blue-600">-12s from yesterday</div>
                      </div>
                      
                      <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <PhoneForwarded className="text-orange-600" size={20} />
                          <span className="font-medium">Transfer Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">{liveMetrics.transferRate}%</div>
                        <div className="text-sm text-orange-600">-2.1% from last week</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Performance Trends</h4>
                      <div className={`h-32 border rounded-lg flex items-center justify-center ${
                        darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          Interactive analytics chart would appear here
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* AI Insights Panel */}
            {showAIInsights && (
              <div className={`${cardClasses} rounded-xl shadow-lg border backdrop-blur-lg bg-opacity-95`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Brain className="text-purple-600" size={20} />
                      AI Insights
                    </h3>
                    <button
                      onClick={() => setShowAIInsights(false)}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Real-time Sentiment */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Call Sentiment</span>
                        <span className={`text-sm ${getSentimentColor(sentimentScore)}`}>
                          {(sentimentScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                          style={{width: `${sentimentScore * 100}%`}}
                        />
                      </div>
                    </div>
                    
                    {/* Success Prediction */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Success Probability</span>
                        <span className="text-sm text-green-600">{(predictiveScore * 100).toFixed(0)}%</span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${predictiveScore * 100}%`}}
                        />
                      </div>
                    </div>
                    
                    {/* AI Recommendations */}
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900 bg-opacity-20' : 'bg-purple-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="text-purple-600" size={16} />
                        <span className="text-sm font-medium">Smart Suggestions</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle size={12} className="text-green-500" />
                          Mention value proposition early
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={12} className="text-green-500" />
                          Ask qualifying questions
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertCircle size={12} className="text-yellow-500" />
                          Address pricing objections
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Contact Management */}
            <div className={`${cardClasses} rounded-xl shadow-lg border backdrop-blur-lg bg-opacity-95`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Smart Contact List</h3>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ctrl+F to search</div>
                </div>
                
                {/* Enhanced Search and Filter */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      id="contact-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search contacts..."
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-lg text-sm transition-colors ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                      }`}
                    >
                      <option value="all">All Contacts</option>
                      <option value="lead">Leads</option>
                      <option value="customer">Customers</option>
                      <option value="prospect">Prospects</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="callback">Callback</option>
                    </select>
                    <button className={`p-2 border rounded-lg transition-colors ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      <SlidersHorizontal size={16} />
                    </button>
                  </div>
                </div>

                {/* Enhanced Contact List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className={`p-3 border rounded-lg transition-all hover:shadow-md cursor-pointer ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{contact.name}</span>
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              contact.priority === 'high' ? 'bg-red-100 text-red-700' :
                              contact.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {contact.priority}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${getSentimentBg(contact.sentiment).replace('bg-', 'bg-opacity-60 bg-')}`}></div>
                          </div>
                        </div>
                        <button
                          onClick={() => setPhoneNumber(contact.number)}
                          className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Select number"
                        >
                          <Phone size={14} />
                        </button>
                      </div>
                      
                      <div className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {contact.number}
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.type === 'lead' ? 'bg-purple-100 text-purple-700' :
                          contact.type === 'customer' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {contact.type}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last: {contact.lastCalled}
                        </span>
                      </div>
                      
                      {/* Enhanced Contact Details */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Success Rate: {(contact.predictedSuccess * 100).toFixed(0)}%
                          </span>
                          <div className="flex gap-1">
                            {contact.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className={`text-xs px-1 py-0.5 rounded ${
                                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {contact.notes && (
                          <p className={`text-xs italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {contact.notes.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredContacts.length === 0 && (
                    <div className="text-center py-8">
                      <Search size={24} className={`mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No contacts found</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Try adjusting your search or filter
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Inbound Call Queue */}
            <div className={`${cardClasses} rounded-xl shadow-lg border backdrop-blur-lg bg-opacity-95`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Live Inbound Queue</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Live</span>
                    <div className={`text-xs ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Enter to answer</div>
                  </div>
                </div>
                
                {inboundQueue.length === 0 ? (
                  <div className="text-center py-8">
                    <PhoneIncoming className={`mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={32} />
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No incoming calls</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Waiting for inbound calls...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inboundQueue.map((call, index) => (
                      <div key={call.id} className={`p-3 rounded-lg border-l-4 transition-all ${
                        index === 0 ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-300'
                      } ${darkMode && index !== 0 ? 'bg-gray-700' : index !== 0 ? 'bg-gray-50' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{call.country.flag}</span>
                            <span className="font-medium text-sm">{call.number}</span>
                            {index === 0 && <span className="text-xs text-blue-600 font-bold">NEXT</span>}
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            call.priority === 'high' ? 'bg-red-400' :
                            call.priority === 'medium' ? 'bg-yellow-400' :
                            'bg-green-400'
                          }`}></div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            call.type === 'sales_inquiry' ? 'bg-purple-100 text-purple-700' :
                            call.type === 'support' ? 'bg-blue-100 text-blue-700' :
                            call.type === 'complaint' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {call.type.replace('_', ' ')}
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Wait: {Math.floor(call.waitTime / 60)}:{(call.waitTime % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        
                        {/* Enhanced Call Details */}
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              Predicted: {call.predictedIssue}
                            </span>
                            <span className={`${
                              call.customerValue === 'high' ? 'text-green-600' :
                              call.customerValue === 'medium' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`}>
                              {call.customerValue.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              Est. Duration: {call.estimatedDuration}min
                            </span>
                            <span className={`px-1 py-0.5 rounded text-xs ${
                              call.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                              call.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {call.sentiment}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleInboundCall(call)}
                          className={`w-full px-3 py-2 rounded-lg transition-all text-sm font-medium transform hover:scale-105 ${
                            index === 0 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg' 
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          Answer Call {index === 0 ? '(Enter)' : ''}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Agent Dashboard */}
            {showAgentDashboard && (
              <div className={`${cardClasses} rounded-xl shadow-lg border backdrop-blur-lg bg-opacity-95`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="text-blue-600" size={20} />
                      Agent Dashboard
                    </h3>
                    <button
                      onClick={() => setShowAgentDashboard(false)}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {agentQueueData.map((agent) => (
                      <div key={agent.id} className={`p-3 border rounded-lg transition-all ${
                        agent.status === 'available' ? 'border-green-200 bg-green-50' :
                        agent.status === 'busy' ? 'border-red-200 bg-red-50' :
                        'border-yellow-200 bg-yellow-50'
                      } ${darkMode ? 'border-opacity-20 bg-opacity-10' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              agent.status === 'available' ? 'bg-green-500' :
                              agent.status === 'busy' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`}></div>
                            <span className="font-medium text-sm">{agent.name}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            agent.department === 'sales' ? 'bg-purple-100 text-purple-700' :
                            agent.department === 'support' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {agent.department}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Calls: {agent.calls}
                          </div>
                          <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Avg: {agent.avgDuration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={10} className="text-yellow-500 fill-current" />
                            <span>{agent.satisfaction}</span>
                          </div>
                          <div className={`text-${agent.status === 'available' ? 'green' : agent.status === 'busy' ? 'red' : 'yellow'}-600 font-medium`}>
                            {agent.status.toUpperCase()}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {agent.expertise.map((skill) => (
                            <span key={skill} className={`text-xs px-1 py-0.5 rounded ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Quick Actions */}
            <div className={`${cardClasses} rounded-xl shadow-lg border backdrop-blur-lg bg-opacity-95`}>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all transform hover:scale-105 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}>
                    <Upload size={16} className="text-blue-600" />
                    <span className="text-sm font-medium">Import Contact List</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowCampaignManager(true)}
                    className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all transform hover:scale-105 ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Target size={16} className="text-purple-600" />
                    <span className="text-sm font-medium">Campaign Manager</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowRecordingControls(true)}
                    className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all transform hover:scale-105 ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Play size={16} className="text-green-600" />
                    <span className="text-sm font-medium">View Recordings</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowPerformanceDash(true)}
                    className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all transform hover:scale-105 ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <BarChart3 size={16} className="text-orange-600" />
                    <span className="text-sm font-medium">Performance Analytics</span>
                  </button>
                  
                  <button className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all transform hover:scale-105 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}>
                    <Download size={16} className="text-red-600" />
                    <span className="text-sm font-medium">Export Reports</span>
                  </button>
                  
                  <button className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all transform hover:scale-105 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}>
                    <Settings size={16} className="text-gray-600" />
                    <span className="text-sm font-medium">Advanced Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardClasses} rounded-xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Organized by categories */}
            <div className="space-y-6">
              {['Call Control', 'Recording', 'Navigation', 'AI Features', 'Collaboration', 'Management', 'Interface'].map((category) => (
                <div key={category}>
                  <h4 className="font-medium mb-3 text-sm text-purple-600 uppercase tracking-wide">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {keyboardShortcuts
                      .filter(shortcut => shortcut.category === category)
                      .map((shortcut, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <div>
                            <div className="font-medium text-sm">{shortcut.action}</div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {shortcut.description}
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded border text-sm font-mono ${
                            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                          }`}>
                            {shortcut.key}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Press <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Escape</kbd> to close this dialog
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call Flow Visualization Modal */}
      {showCallFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardClasses} rounded-xl shadow-2xl p-6 max-w-5xl w-full mx-4 max-h-96 overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Workflow className="text-green-600" size={20} />
                Live Call Flow Visualization
              </h3>
              <button
                onClick={() => setShowCallFlow(false)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Flow Chart */}
              <div className={`p-6 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                      <PhoneIncoming className="text-white" size={24} />
                    </div>
                    <span className="text-sm font-medium">Incoming Call</span>
                  </div>
                  <ArrowRight className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                      <Brain className="text-white" size={24} />
                    </div>
                    <span className="text-sm font-medium">AI Processing</span>
                  </div>
                  <ArrowRight className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="text-white" size={24} />
                    </div>
                    <span className="text-sm font-medium">Resolution</span>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Interactive call flow diagram showing real-time call progression
                  </p>
                </div>
              </div>
              
              {/* Flow Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="text-blue-600" size={16} />
                    <span className="font-medium text-sm">Avg Flow Time</span>
                  </div>
                  <div className="text-xl font-bold">3:24</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="text-purple-600" size={16} />
                    <span className="font-medium text-sm">AI Resolution</span>
                  </div>
                  <div className="text-xl font-bold">87%</div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <PhoneForwarded className="text-orange-600" size={16} />
                    <span className="font-medium text-sm">Transfer Rate</span>
                  </div>
                  <div className="text-xl font-bold">13%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Floating Indicators */}
      {activeCall && (
        <div className={`fixed bottom-6 right-6 bg-gradient-to-r ${
          callType === 'inbound' 
            ? 'from-green-500 to-emerald-600' 
            : 'from-purple-500 to-pink-600'
        } text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 backdrop-blur-lg bg-opacity-90`}>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="font-medium">
            {callType === 'inbound' ? 'Inbound' : 'Outbound'} Call Active - {formatTime(callTimer)}
          </span>
          {transferRequested && (
            <div className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
              Transferring...
            </div>
          )}
          {whisperMode && (
            <div className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
              Whisper
            </div>
          )}
        </div>
      )}

      {/* Mobile Quick Access Floating Button */}
      {mobileView && (
        <div className="fixed bottom-6 left-6">
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Brain size={20} />
          </button>
        </div>
      )}

      {/* Enhanced Transfer Notification Modal */}
      {transferRequested && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardClasses} rounded-xl shadow-2xl p-6 max-w-md w-full mx-4`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneForwarded className="text-orange-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transferring Call</h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI agent is transferring the call to a human specialist based on the conversation context and sentiment analysis.
              </p>
              
              {/* Transfer Progress */}
              <div className="mb-4">
                <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
              </div>
              
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Connecting to best available agent...
              </div>
              
              {/* Agent Match Info */}
              <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <UserCheck className="text-green-600" size={16} />
                  <span className="text-sm font-medium">Matched: Sales Specialist</span>
                </div>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Based on call content and customer profile
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Country Dropdown Overlay */}
      {showCountryDropdown && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowCountryDropdown(false);
            setCountrySearchQuery('');
          }}
        ></div>
      )}

      {/* Connection Status Indicator */}
      <div className={`fixed top-4 right-4 z-30 flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
        connectionStatus === 'connected' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}></div>
        {connectionStatus === 'connected' ? 'Live Connection' : 'Connection Lost'}
      </div>
    </div>
  );
};

export default CallCenterDashboard;