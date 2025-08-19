import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneOff, Settings, Users, BarChart3, Clock, Mic, MicOff, Volume2, VolumeX, User, MessageSquare, Calendar, FileText, Zap, Activity, TrendingUp, AlertCircle, CheckCircle, Play, Pause, Square, RotateCcw, Save, Upload, Download, Search, Filter, Bell, Shield, Headphones, Globe, UserCheck, Shuffle, ArrowRight, ArrowDown, Map, Flag, ChevronDown, PhoneForwarded, UserPlus, Briefcase, HeartHandshake, Clock3, Route, Target, Command, Keyboard, FastForward, Rewind, SkipBack, SkipForward, Volume1, Repeat, X, SlidersHorizontal, Radio, Edit3, Copy, Trash2, Plus, Minus, RotateCw, PieChart, LineChart, Calendar as CalendarIcon, Timer, Users2, Brain, Lightbulb, Gauge, Star, Award, TrendingDown, AlertTriangle, Share, GitBranch } from 'lucide-react';
import twilioVoiceService from '../services/TwilioVoiceService';
import callCenterApiService from '../services/CallCenterApiService';
import { useRealTimeData, useContacts } from '../hooks/useRealTimeData';

const CallCenterDashboard = () => {
  // Real-time data hooks
  const { data: realTimeData, isLoading: dataLoading, error: dataError, connectionStatus } = useRealTimeData();
  const { contacts: liveContacts, loading: contactsLoading, error: contactsError, refetch: refetchContacts } = useContacts();

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
  
  // Advanced tab states
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState('sales_call');
  const [customPrompt, setCustomPrompt] = useState('');
  const [promptObjective, setPromptObjective] = useState('sales');
  const [promptTone, setPromptTone] = useState('professional');
  const [promptLanguage, setPromptLanguage] = useState('english');
  const [transferTriggers, setTransferTriggers] = useState(['pricing_question', 'technical_detail']);
  const [routingMode, setRoutingMode] = useState('intelligent');
  const [selectedDepartments, setSelectedDepartments] = useState(['sales', 'support']);
  const [businessHours, setBusinessHours] = useState({ start: '09:00', end: '17:00' });
  const [maxWaitTime, setMaxWaitTime] = useState(300);
  const [analyticsDateRange, setAnalyticsDateRange] = useState('7');
  
  // Enhanced Agent Management States
  const [availableAgents, setAvailableAgents] = useState([
    { id: 1, name: 'Sarah Chen', status: 'available', department: 'support', currentCall: null, skills: ['technical', 'billing'], priority: 'high', queuePosition: 1 },
    { id: 2, name: 'Mike Torres', status: 'busy', department: 'sales', currentCall: 'C001', skills: ['sales', 'enterprise'], priority: 'high', queuePosition: null },
    { id: 3, name: 'Lisa Park', status: 'available', department: 'billing', currentCall: null, skills: ['billing', 'refunds'], priority: 'medium', queuePosition: 2 },
    { id: 4, name: 'David Kim', status: 'away', department: 'support', currentCall: null, skills: ['support', 'technical'], priority: 'medium', queuePosition: null }
  ]);

  // Advanced Call Management States
  const [callRoutingVisualization, setCallRoutingVisualization] = useState(true);
  const [agentQueueView, setAgentQueueView] = useState('detailed');
  const [transferWorkflowActive, setTransferWorkflowActive] = useState(false);
  const [routingFlowData, setRoutingFlowData] = useState({
    currentFlow: 'intelligent-routing',
    nodes: [
      { id: 'incoming', type: 'entry', label: 'Incoming Call', position: { x: 50, y: 200 } },
      { id: 'ai-analysis', type: 'process', label: 'AI Analysis', position: { x: 200, y: 200 } },
      { id: 'skill-match', type: 'decision', label: 'Skill Matching', position: { x: 350, y: 200 } },
      { id: 'queue-assign', type: 'process', label: 'Queue Assignment', position: { x: 500, y: 200 } },
      { id: 'agent-connect', type: 'output', label: 'Agent Connected', position: { x: 650, y: 200 } }
    ],
    connections: [
      { from: 'incoming', to: 'ai-analysis' },
      { from: 'ai-analysis', to: 'skill-match' },
      { from: 'skill-match', to: 'queue-assign' },
      { from: 'queue-assign', to: 'agent-connect' }
    ]
  });
  
  const [queueMetrics, setQueueMetrics] = useState({
    totalInQueue: 8,
    averageWaitTime: 145,
    longestWait: 320,
    queueThroughput: 85.2,
    agentUtilization: 76.8,
    callAbandonment: 5.2
  });
  
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Smith', number: '+1 (555) 123-4567', type: 'lead', priority: 'high', lastCalled: '2024-08-17', status: 'new' },
    { id: 2, name: 'Sarah Johnson', number: '+1 (555) 234-5678', type: 'customer', priority: 'medium', lastCalled: '2024-08-16', status: 'contacted' },
    { id: 3, name: 'Mike Davis', number: '+44 20 7123 4567', type: 'prospect', priority: 'low', lastCalled: '2024-08-15', status: 'callback' },
    { id: 4, name: 'Emma Wilson', number: '+1 (555) 345-6789', type: 'customer', priority: 'high', lastCalled: '2024-08-17', status: 'completed' },
    { id: 5, name: 'David Brown', number: '+61 2 1234 5678', type: 'lead', priority: 'medium', lastCalled: '2024-08-14', status: 'new' }
  ]);
  const [liveMetrics, setLiveMetrics] = useState({
    activeCalls: 12,
    queuedCalls: 8,
    avgWaitTime: '2:34',
    successRate: 94.2,
    totalCallsToday: 247,
    inboundCalls: 156,
    outboundCalls: 91,
    transferRate: 15.3
  });

  // Real Twilio Voice Service States
  const [twilioInitialized, setTwilioInitialized] = useState(false);
  const [twilioStatus, setTwilioStatus] = useState('Initializing...');
  const [realCallActive, setRealCallActive] = useState(false);
  const [realCallStatus, setRealCallStatus] = useState('idle');
  const [incomingCall, setIncomingCall] = useState(null);
  const [callError, setCallError] = useState(null);
  const [loading, setLoading] = useState(false);

  const countries = [
    // Popular countries (shown at top)
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', popular: true },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', popular: true },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', popular: true },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', popular: true },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', popular: true },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', popular: true },
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', popular: true },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', popular: true },
    
    // All countries (alphabetical)
    { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
    { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱' },
    { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
    { code: 'AS', name: 'American Samoa', dialCode: '+1', flag: '🇦🇸' },
    { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩' },
    { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
    { code: 'AI', name: 'Anguilla', dialCode: '+1', flag: '🇦🇮' },
    { code: 'AQ', name: 'Antarctica', dialCode: '+672', flag: '🇦🇶' },
    { code: 'AG', name: 'Antigua and Barbuda', dialCode: '+1', flag: '🇦🇬' },
    { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
    { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲' },
    { code: 'AW', name: 'Aruba', dialCode: '+297', flag: '🇦🇼' },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
    { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
    { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿' },
    { code: 'BS', name: 'Bahamas', dialCode: '+1', flag: '🇧🇸' },
    { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
    { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
    { code: 'BB', name: 'Barbados', dialCode: '+1', flag: '🇧🇧' },
    { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾' },
    { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
    { code: 'BZ', name: 'Belize', dialCode: '+501', flag: '🇧🇿' },
    { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯' },
    { code: 'BM', name: 'Bermuda', dialCode: '+1', flag: '🇧🇲' },
    { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹' },
    { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
    { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦' },
    { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
    { code: 'IO', name: 'British Indian Ocean Territory', dialCode: '+246', flag: '🇮🇴' },
    { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳' },
    { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
    { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
    { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
    { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭' },
    { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲' },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
    { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: '🇨🇻' },
    { code: 'KY', name: 'Cayman Islands', dialCode: '+1', flag: '🇰🇾' },
    { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: '🇨🇫' },
    { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩' },
    { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
    { code: 'CX', name: 'Christmas Island', dialCode: '+61', flag: '🇨🇽' },
    { code: 'CC', name: 'Cocos Islands', dialCode: '+61', flag: '🇨🇨' },
    { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
    { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲' },
    { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬' },
    { code: 'CD', name: 'Congo (DRC)', dialCode: '+243', flag: '🇨🇩' },
    { code: 'CK', name: 'Cook Islands', dialCode: '+682', flag: '🇨🇰' },
    { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
    { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
    { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷' },
    { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
    { code: 'CW', name: 'Curaçao', dialCode: '+599', flag: '🇨🇼' },
    { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾' },
    { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
    { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
    { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
    { code: 'DM', name: 'Dominica', dialCode: '+1', flag: '🇩🇲' },
    { code: 'DO', name: 'Dominican Republic', dialCode: '+1', flag: '🇩🇴' },
    { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
    { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
    { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
    { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶' },
    { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷' },
    { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
    { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
    { code: 'FK', name: 'Falkland Islands', dialCode: '+500', flag: '🇫🇰' },
    { code: 'FO', name: 'Faroe Islands', dialCode: '+298', flag: '🇫🇴' },
    { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: '🇫🇯' },
    { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
    { code: 'GF', name: 'French Guiana', dialCode: '+594', flag: '🇬🇫' },
    { code: 'PF', name: 'French Polynesia', dialCode: '+689', flag: '🇵🇫' },
    { code: 'TF', name: 'French Southern Territories', dialCode: '+262', flag: '🇹🇫' },
    { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
    { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
    { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪' },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
    { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
    { code: 'GI', name: 'Gibraltar', dialCode: '+350', flag: '🇬🇮' },
    { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
    { code: 'GL', name: 'Greenland', dialCode: '+299', flag: '🇬🇱' },
    { code: 'GD', name: 'Grenada', dialCode: '+1', flag: '🇬🇩' },
    { code: 'GP', name: 'Guadeloupe', dialCode: '+590', flag: '🇬🇵' },
    { code: 'GU', name: 'Guam', dialCode: '+1', flag: '🇬🇺' },
    { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
    { code: 'GG', name: 'Guernsey', dialCode: '+44', flag: '🇬🇬' },
    { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳' },
    { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼' },
    { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾' },
    { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹' },
    { code: 'HM', name: 'Heard Island and McDonald Islands', dialCode: '+672', flag: '🇭🇲' },
    { code: 'VA', name: 'Holy See (Vatican City)', dialCode: '+379', flag: '🇻🇦' },
    { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
    { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
    { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸' },
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
    { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷' },
    { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
    { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
    { code: 'IM', name: 'Isle of Man', dialCode: '+44', flag: '🇮🇲' },
    { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
    { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
    { code: 'JM', name: 'Jamaica', dialCode: '+1', flag: '🇯🇲' },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
    { code: 'JE', name: 'Jersey', dialCode: '+44', flag: '🇯🇪' },
    { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
    { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿' },
    { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
    { code: 'KI', name: 'Kiribati', dialCode: '+686', flag: '🇰🇮' },
    { code: 'KP', name: 'Korea, North', dialCode: '+850', flag: '🇰🇵' },
    { code: 'KR', name: 'Korea, South', dialCode: '+82', flag: '🇰🇷' },
    { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
    { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬' },
    { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
    { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻' },
    { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
    { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
    { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
    { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾' },
    { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮' },
    { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹' },
    { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
    { code: 'MO', name: 'Macao', dialCode: '+853', flag: '🇲🇴' },
    { code: 'MK', name: 'Macedonia', dialCode: '+389', flag: '🇲🇰' },
    { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
    { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
    { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻' },
    { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
    { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹' },
    { code: 'MH', name: 'Marshall Islands', dialCode: '+692', flag: '🇲🇭' },
    { code: 'MQ', name: 'Martinique', dialCode: '+596', flag: '🇲🇶' },
    { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
    { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺' },
    { code: 'YT', name: 'Mayotte', dialCode: '+262', flag: '🇾🇹' },
    { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
    { code: 'FM', name: 'Micronesia', dialCode: '+691', flag: '🇫🇲' },
    { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩' },
    { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨' },
    { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳' },
    { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪' },
    { code: 'MS', name: 'Montserrat', dialCode: '+1', flag: '🇲🇸' },
    { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
    { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
    { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
    { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
    { code: 'NR', name: 'Nauru', dialCode: '+674', flag: '🇳🇷' },
    { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
    { code: 'NC', name: 'New Caledonia', dialCode: '+687', flag: '🇳🇨' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
    { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
    { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
    { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
    { code: 'NU', name: 'Niue', dialCode: '+683', flag: '🇳🇺' },
    { code: 'NF', name: 'Norfolk Island', dialCode: '+672', flag: '🇳🇫' },
    { code: 'MP', name: 'Northern Mariana Islands', dialCode: '+1', flag: '🇲🇵' },
    { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
    { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
    { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
    { code: 'PW', name: 'Palau', dialCode: '+680', flag: '🇵🇼' },
    { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸' },
    { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦' },
    { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', flag: '🇵🇬' },
    { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
    { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
    { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
    { code: 'PN', name: 'Pitcairn', dialCode: '+64', flag: '🇵🇳' },
    { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
    { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
    { code: 'PR', name: 'Puerto Rico', dialCode: '+1', flag: '🇵🇷' },
    { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
    { code: 'RE', name: 'Réunion', dialCode: '+262', flag: '🇷🇪' },
    { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
    { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
    { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
    { code: 'BL', name: 'Saint Barthélemy', dialCode: '+590', flag: '🇧🇱' },
    { code: 'SH', name: 'Saint Helena', dialCode: '+290', flag: '🇸🇭' },
    { code: 'KN', name: 'Saint Kitts and Nevis', dialCode: '+1', flag: '🇰🇳' },
    { code: 'LC', name: 'Saint Lucia', dialCode: '+1', flag: '🇱🇨' },
    { code: 'MF', name: 'Saint Martin', dialCode: '+590', flag: '🇲🇫' },
    { code: 'PM', name: 'Saint Pierre and Miquelon', dialCode: '+508', flag: '🇵🇲' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', dialCode: '+1', flag: '🇻🇨' },
    { code: 'WS', name: 'Samoa', dialCode: '+685', flag: '🇼🇸' },
    { code: 'SM', name: 'San Marino', dialCode: '+378', flag: '🇸🇲' },
    { code: 'ST', name: 'São Tomé and Príncipe', dialCode: '+239', flag: '🇸🇹' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
    { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
    { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸' },
    { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
    { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
    { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
    { code: 'SX', name: 'Sint Maarten', dialCode: '+1', flag: '🇸🇽' },
    { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰' },
    { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
    { code: 'SB', name: 'Solomon Islands', dialCode: '+677', flag: '🇸🇧' },
    { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
    { code: 'GS', name: 'South Georgia and the South Sandwich Islands', dialCode: '+500', flag: '🇬🇸' },
    { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸' },
    { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
    { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
    { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
    { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen', dialCode: '+47', flag: '🇸🇯' },
    { code: 'SZ', name: 'Swaziland', dialCode: '+268', flag: '🇸🇿' },
    { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
    { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
    { code: 'SY', name: 'Syria', dialCode: '+963', flag: '🇸🇾' },
    { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼' },
    { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: '🇹🇯' },
    { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
    { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
    { code: 'TL', name: 'Timor-Leste', dialCode: '+670', flag: '🇹🇱' },
    { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
    { code: 'TK', name: 'Tokelau', dialCode: '+690', flag: '🇹🇰' },
    { code: 'TO', name: 'Tonga', dialCode: '+676', flag: '🇹🇴' },
    { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1', flag: '🇹🇹' },
    { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
    { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
    { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲' },
    { code: 'TC', name: 'Turks and Caicos Islands', dialCode: '+1', flag: '🇹🇨' },
    { code: 'TV', name: 'Tuvalu', dialCode: '+688', flag: '🇹🇻' },
    { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
    { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
    { code: 'UM', name: 'United States Minor Outlying Islands', dialCode: '+1', flag: '🇺🇲' },
    { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
    { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿' },
    { code: 'VU', name: 'Vanuatu', dialCode: '+678', flag: '🇻🇺' },
    { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
    { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
    { code: 'VG', name: 'Virgin Islands (British)', dialCode: '+1', flag: '🇻🇬' },
    { code: 'VI', name: 'Virgin Islands (US)', dialCode: '+1', flag: '🇻🇮' },
    { code: 'WF', name: 'Wallis and Futuna', dialCode: '+681', flag: '🇼🇫' },
    { code: 'EH', name: 'Western Sahara', dialCode: '+212', flag: '🇪🇭' },
    { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪' },
    { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲' },
    { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' }
  ];

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  // Filter countries based on search query
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
    country.dialCode.includes(countrySearchQuery) ||
    country.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  // Separate popular and other countries
  const popularCountries = filteredCountries.filter(c => c.popular);
  const otherCountries = filteredCountries.filter(c => !c.popular);

  // Handle click outside to close dropdown
  const countryDropdownRef = React.useRef(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
        setCountrySearchQuery('');
      }
    };
    
    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCountryDropdown]);

  // Handle keyboard navigation for country dropdown
  const handleCountryKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowCountryDropdown(false);
      setCountrySearchQuery('');
    }
  };

  const keyboardShortcuts = [
    { key: 'Space', action: 'Start/End Call', description: 'Toggle call state' },
    { key: 'M', action: 'Mute/Unmute', description: 'Toggle microphone' },
    { key: 'T', action: 'Transfer Call', description: 'Transfer to human agent' },
    { key: 'R', action: 'Start/Stop Recording', description: 'Toggle call recording' },
    { key: 'P', action: 'Play/Pause Playback', description: 'Control recording playback' },
    { key: 'Ctrl + /', action: 'Show Shortcuts', description: 'Display this help' },
    { key: 'Ctrl + F', action: 'Search Contacts', description: 'Focus contact search' },
    { key: '1-5', action: 'Switch Tabs', description: 'Navigate configuration tabs' },
    { key: 'Escape', action: 'Close Modals', description: 'Close any open modal' },
    { key: 'Enter', action: 'Answer Call', description: 'Answer first queued call' }
  ];

  useEffect(() => {
    let interval;
    if (activeCall) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
        if (isRecording) {
          setRecordingTime(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall, isRecording]);

  useEffect(() => {
    let interval;
    if (isPlayingBack) {
      interval = setInterval(() => {
        setPlaybackTime(prev => {
          const newTime = prev + playbackSpeed;
          if (newTime >= playbackDuration) {
            setIsPlayingBack(false);
            return playbackDuration;
          }
          return newTime;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlayingBack, playbackSpeed, playbackDuration]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const newCall = {
          id: Date.now(),
          number: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          country: countries[Math.floor(Math.random() * countries.length)],
          type: ['sales_inquiry', 'support', 'complaint', 'general'][Math.floor(Math.random() * 4)],
          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
          waitTime: 0,
          sentiment: 'neutral'
        };
        setInboundQueue(prev => [...prev, newCall].slice(-5));
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts handler
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
        case 'enter':
          if (inboundQueue.length > 0) {
            handleInboundCall(inboundQueue[0]);
          }
          break;
        case 'escape':
          setShowKeyboardShortcuts(false);
          setShowCountryDropdown(false);
          setCountrySearchQuery('');
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
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeCall, muted, callType, callTimer, transferRequested, inboundQueue, showKeyboardShortcuts, isPlayingBack, showRecordingControls]);

  // API Testing Functions
  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const analytics = await callCenterApiService.getAnalytics();
      console.log('Analytics data:', analytics);
      
      const systemHealth = await callCenterApiService.getSystemHealth();
      console.log('System health:', systemHealth);
      
      alert('API connection successful! Check console for data.');
    } catch (error) {
      console.error('API connection failed:', error);
      alert(`API connection failed: ${error.message}`);
    }
  };

  const refreshLiveData = async () => {
    try {
      await refetchContacts();
      console.log('Live data refreshed');
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  // Initialize Twilio Voice Service
  useEffect(() => {
    const initializeTwilio = async () => {
      try {
        console.log('🚀 Initializing Twilio Voice Service...');
        setTwilioStatus('Connecting to Twilio...');
        
        // Set up event handlers
        twilioVoiceService.setEventHandlers({
          onCallStatusChange: (status, call) => {
            console.log('📞 Call status changed:', status);
            setRealCallStatus(status);
            
            // Update UI based on call status
            if (status === 'connecting') {
              setActiveCall(true);
              setCallStatus('connecting');
            } else if (status === 'connected') {
              setActiveCall(true);
              setCallStatus('active');
              setRealCallActive(true);
            } else if (status === 'disconnected') {
              setActiveCall(false);
              setCallStatus('idle');
              setRealCallActive(false);
              setCallTimer(0);
            }
          },
          
          onCallConnected: (call) => {
            console.log('✅ Call connected:', call);
            setTwilioStatus('Call Active');
            setCallError(null);
          },
          
          onCallDisconnected: (call) => {
            console.log('📱 Call disconnected:', call);
            setTwilioStatus('Ready for calls');
            setRealCallActive(false);
          },
          
          onIncomingCall: (call) => {
            console.log('📞 Incoming call received:', call);
            setIncomingCall(call);
            setCallType('inbound');
            setTwilioStatus('Incoming call...');
          },
          
          onError: (error) => {
            console.error('❌ Twilio error:', error);
            setCallError(error);
            setTwilioStatus('Error: ' + error);
          }
        });

        // Initialize the service
        const result = await twilioVoiceService.initialize();
        
        if (result.success) {
          setTwilioInitialized(true);
          setTwilioStatus('Ready for calls');
          console.log('✅ Twilio Voice Service initialized successfully');
        } else {
          setTwilioStatus('Failed to initialize: ' + result.error);
          setCallError(result.error);
        }
        
      } catch (error) {
        console.error('❌ Failed to initialize Twilio:', error);
        setTwilioStatus('Initialization failed');
        setCallError(error.message);
      }
    };

    initializeTwilio();

    // Cleanup on unmount
    return () => {
      twilioVoiceService.destroy();
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCall = async () => {
    if (!twilioInitialized) {
      setCallError('Twilio service not initialized');
      return;
    }

    try {
      if (!activeCall && !realCallActive) {
        console.log('📞 Starting real call to:', phoneNumber);
        
        // Make outbound call using Twilio
        const result = await twilioVoiceService.makeCall(phoneNumber, {
          record: isRecording
        });
        
        if (result.success) {
          console.log('✅ Call initiated successfully');
          setCallError(null);
          // UI updates will be handled by event listeners
        } else {
          console.error('❌ Failed to start call:', result.error);
          setCallError(result.error);
        }
        
      } else if (realCallActive) {
        console.log('📞 Ending real call');
        
        // End current call
        const result = await twilioVoiceService.endCall();
        
        if (result.success) {
          console.log('✅ Call ended successfully');
        } else {
          console.error('❌ Failed to end call:', result.error);
          setCallError(result.error);
        }
      }
    } catch (error) {
      console.error('❌ Call operation failed:', error);
      setCallError(error.message);
    }
  };

  const handleMuteToggle = async () => {
    if (!realCallActive) {
      setMuted(!muted);
      return;
    }

    try {
      const result = await twilioVoiceService.toggleMute();
      
      if (result.success) {
        setMuted(result.muted);
        console.log(`📞 Call ${result.muted ? 'muted' : 'unmuted'}`);
      } else {
        console.error('❌ Failed to toggle mute:', result.error);
      }
    } catch (error) {
      console.error('❌ Mute toggle failed:', error);
    }
  };

  // Handle incoming call accept
  const handleIncomingCall = async (call) => {
    try {
      setLoading(true);
      await twilioVoiceService.acceptCall(call);
      setIncomingCall(null);
      setRealCallActive(true);
      setActiveCall({
        id: Date.now(),
        contact: call.parameters?.From || 'Unknown Number',
        startTime: new Date(),
        type: 'incoming',
        status: 'connected'
      });
    } catch (error) {
      console.error('Failed to accept call:', error);
      setCallError(`Failed to accept call: ${error.message}`);
      setIncomingCall(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle incoming call reject
  const handleRejectCall = () => {
    if (incomingCall) {
      incomingCall.reject();
      setIncomingCall(null);
    }
  };

  const handleTransferToHuman = () => {
    setTransferRequested(true);
    setTimeout(() => {
      alert('Call transferred to human agent successfully!');
      setTransferRequested(false);
    }, 2000);
  };

  const handleInboundCall = (call) => {
    setCallType('inbound');
    setActiveCall(true);
    setCallStatus('active');
    setPhoneNumber(call.number);
    setCallTimer(0);
    setInboundQueue(prev => prev.filter(c => c.id !== call.id));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
      setShowRecordingControls(true);
    }
  };

  const togglePlayback = () => {
    setIsPlayingBack(!isPlayingBack);
    if (!isPlayingBack && playbackTime >= playbackDuration) {
      setPlaybackTime(0);
    }
    if (!playbackDuration) {
      setPlaybackDuration(recordingTime || 180); // Default 3 minutes if no recording
    }
  };

  const skipPlayback = (seconds) => {
    setPlaybackTime(prev => Math.max(0, Math.min(playbackDuration, prev + seconds)));
  };

  const setPlaybackPosition = (position) => {
    setPlaybackTime(position);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.number.includes(searchQuery);
    const matchesFilter = filterType === 'all' || contact.type === filterType || contact.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const voices = [
    { name: 'June', accent: 'American', gender: 'Female', premium: true, specialty: 'Sales & Support' },
    { name: 'Alex', accent: 'British', gender: 'Male', premium: false, specialty: 'Professional Calls' },
    { name: 'Sofia', accent: 'Spanish', gender: 'Female', premium: true, specialty: 'Multilingual Support' },
    { name: 'Marcus', accent: 'Australian', gender: 'Male', premium: false, specialty: 'Casual Conversations' },
    { name: 'Yuki', accent: 'Japanese', gender: 'Female', premium: true, specialty: 'Technical Support' },
    { name: 'Emma', accent: 'Canadian', gender: 'Female', premium: true, specialty: 'Healthcare & Empathy' }
  ];

  const presetPrompts = [
    { name: 'Sales Call', icon: TrendingUp, description: 'Professional sales outreach with lead qualification', transferTriggers: ['pricing_question', 'technical_detail', 'decision_maker'] },
    { name: 'Customer Support', icon: Headphones, description: 'Technical support with escalation options', transferTriggers: ['complex_issue', 'billing_dispute', 'angry_customer'] },
    { name: 'Appointment Booking', icon: Calendar, description: 'Schedule appointments with availability check', transferTriggers: ['special_request', 'bulk_booking'] },
    { name: 'Lead Qualification', icon: Users, description: 'Qualify potential leads and gather information', transferTriggers: ['enterprise_inquiry', 'custom_solution'] },
    { name: 'Receptionist', icon: PhoneIncoming, description: 'Professional call answering and routing', transferTriggers: ['urgent_matter', 'executive_request', 'emergency'] },
    { name: 'Cold Outreach', icon: Target, description: 'Initial contact and interest generation', transferTriggers: ['interested_prospect', 'objection_handling'] }
  ];

  const routingDepartments = [
    { id: 'sales', name: 'Sales Team', agents: 8, available: 6, avgResponse: '45s', expertise: ['Product Demo', 'Pricing', 'Contracts'] },
    { id: 'support', name: 'Technical Support', agents: 12, available: 9, avgResponse: '1m 20s', expertise: ['Technical Issues', 'Troubleshooting', 'Setup'] },
    { id: 'billing', name: 'Billing & Finance', agents: 4, available: 3, avgResponse: '2m 10s', expertise: ['Billing Questions', 'Refunds', 'Payment Issues'] },
    { id: 'management', name: 'Management', agents: 3, available: 1, avgResponse: '5m 30s', expertise: ['Escalations', 'Complaints', 'Executive Requests'] },
    { id: 'hr', name: 'Human Resources', agents: 2, available: 2, avgResponse: '1m 45s', expertise: ['Employment', 'Benefits', 'Policies'] }
  ];

  // Advanced Call Management Functions
  const handleAgentAssignment = (callId, agentId) => {
    setAvailableAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return { ...agent, status: 'busy', currentCall: callId };
      }
      return agent;
    }));
    
    setInboundQueue(prev => prev.map(call => {
      if (call.id === callId) {
        return { ...call, assignedAgent: agentId, status: 'assigned' };
      }
      return call;
    }));
  };

  const handleAgentStatusUpdate = (agentId, newStatus) => {
    setAvailableAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return { ...agent, status: newStatus };
      }
      return agent;
    }));
  };

  const handleQueueReorder = (dragIndex, hoverIndex) => {
    setInboundQueue(prev => {
      const draggedItem = prev[dragIndex];
      const newQueue = [...prev];
      newQueue.splice(dragIndex, 1);
      newQueue.splice(hoverIndex, 0, draggedItem);
      return newQueue.map((item, index) => ({ ...item, queuePosition: index + 1 }));
    });
  };

  const calculateRoutingVisualization = () => {
    // Simulate real-time routing flow updates
    return {
      ...routingFlowData,
      activeFlow: realCallActive ? 'active' : 'idle',
      metrics: {
        callsProcessed: liveMetrics.totalCallsToday,
        averageRoutingTime: '2.3s',
        routingAccuracy: '94.2%',
        queueEfficiency: `${queueMetrics.queueThroughput}%`
      }
    };
  };

  const handleTransferWorkflow = (workflowId, callContext) => {
    setTransferWorkflowActive(true);
    
    // Simulate workflow execution
    setTimeout(() => {
      console.log(`Executing transfer workflow: ${workflowId}`, callContext);
      setTransferWorkflowActive(false);
      alert(`Transfer workflow "${workflowId}" completed successfully!`);
    }, 2000);
  };

  const renderRoutingVisualization = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GitBranch size={20} className="text-blue-600" />
          Call Routing Visualization
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${realCallActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">{realCallActive ? 'Active Flow' : 'Idle'}</span>
        </div>
      </div>
      
      <div className="relative h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 overflow-hidden">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Flow connections */}
          {routingFlowData.connections.map((connection, index) => {
            const fromNode = routingFlowData.nodes.find(n => n.id === connection.from);
            const toNode = routingFlowData.nodes.find(n => n.id === connection.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={index}
                x1={fromNode.position.x + 50}
                y1={fromNode.position.y + 20}
                x2={toNode.position.x}
                y2={toNode.position.y + 20}
                stroke={realCallActive ? '#3B82F6' : '#9CA3AF'}
                strokeWidth="2"
                strokeDasharray={realCallActive ? "0" : "5,5"}
                className={realCallActive ? 'animate-pulse' : ''}
              />
            );
          })}
        </svg>
        
        {/* Flow nodes */}
        {routingFlowData.nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-300 ${
              realCallActive 
                ? 'bg-blue-100 border-blue-300 text-blue-800 shadow-lg scale-105' 
                : 'bg-white border-gray-300 text-gray-700'
            }`}
            style={{ left: node.position.x, top: node.position.y }}
          >
            {node.label}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-4 gap-4 mt-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{liveMetrics.totalCallsToday}</div>
          <div className="text-xs text-gray-600">Calls Processed</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">2.3s</div>
          <div className="text-xs text-gray-600">Avg Routing Time</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">94.2%</div>
          <div className="text-xs text-gray-600">Routing Accuracy</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{queueMetrics.queueThroughput}%</div>
          <div className="text-xs text-gray-600">Queue Efficiency</div>
        </div>
      </div>
    </div>
  );

  const renderAgentQueueManagement = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users size={20} className="text-green-600" />
          Agent Queue Management
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAgentQueueView(agentQueueView === 'detailed' ? 'compact' : 'detailed')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {agentQueueView === 'detailed' ? 'Compact View' : 'Detailed View'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status Panel */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Available Agents</h4>
          <div className="space-y-3">
            {availableAgents.map((agent) => (
              <div 
                key={agent.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  agent.status === 'available' ? 'border-green-200 bg-green-50' :
                  agent.status === 'busy' ? 'border-red-200 bg-red-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      agent.status === 'available' ? 'bg-green-400' :
                      agent.status === 'busy' ? 'bg-red-400' :
                      'bg-gray-400'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{agent.name}</div>
                      <div className="text-sm text-gray-600">{agent.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'available' ? 'bg-green-100 text-green-800' :
                      agent.status === 'busy' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.status}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Queue: #{agent.queuePosition || 'N/A'}
                    </div>
                  </div>
                </div>
                
                {agentQueueView === 'detailed' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-700">Skills:</span>
                      {agent.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    {agent.currentCall && (
                      <div className="text-xs text-gray-600">Current Call: {agent.currentCall}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Queue Status Panel */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Call Queue Status</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{queueMetrics.totalInQueue}</div>
                <div className="text-sm text-blue-800">Calls in Queue</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">{Math.floor(queueMetrics.averageWaitTime / 60)}m {queueMetrics.averageWaitTime % 60}s</div>
                <div className="text-sm text-orange-800">Avg Wait Time</div>
              </div>
            </div>
            
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Queue Performance</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Throughput Rate</span>
                  <span className="font-medium text-green-600">{queueMetrics.queueThroughput}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Agent Utilization</span>
                  <span className="font-medium text-blue-600">{queueMetrics.agentUtilization}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Call Abandonment</span>
                  <span className="font-medium text-red-600">{queueMetrics.callAbandonment}%</span>
                </div>
              </div>
            </div>
            
            {inboundQueue.length > 0 && (
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Current Queue</h5>
                <div className="space-y-2">
                  {inboundQueue.slice(0, 3).map((call, index) => (
                    <div key={call.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="text-sm text-gray-600">{call.caller || 'Unknown'}</span>
                      </div>
                      <span className="text-xs text-gray-500">Wait: {formatTime(call.waitTime || 0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Call Center Pro</h1>
                  <p className="text-sm text-gray-500">World-Class Communication Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* API Connection Status */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                } ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`}></div>
                <span className="text-xs font-medium text-gray-700">
                  {connectionStatus === 'connected' ? 'Live Data' :
                   connectionStatus === 'connecting' ? 'Connecting...' : 'API Offline'}
                </span>
              </div>

              {/* Twilio Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border">
                <div className={`w-2 h-2 rounded-full ${
                  twilioInitialized ? 'bg-green-500' : callError ? 'bg-red-500' : 'bg-yellow-500'
                } ${twilioInitialized ? 'animate-pulse' : ''}`}></div>
                <span className="text-xs font-medium text-gray-700">
                  {callError ? 'Twilio Error' : twilioStatus}
                </span>
              </div>
              
              <button 
                onClick={() => setShowKeyboardShortcuts(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Keyboard Shortcuts (Ctrl+/)"
              >
                <Keyboard size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Call Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Calls</p>
                    <p className="text-2xl font-bold text-gray-900">{liveMetrics.totalCallsToday}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <PhoneCall className="text-blue-600" size={20} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Inbound</p>
                    <p className="text-2xl font-bold text-green-600">{liveMetrics.inboundCalls}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <PhoneIncoming className="text-green-600" size={20} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Outbound</p>
                    <p className="text-2xl font-bold text-purple-600">{liveMetrics.outboundCalls}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <PhoneOutgoing className="text-purple-600" size={20} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">{liveMetrics.successRate}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Transfer Rate</p>
                    <p className="text-2xl font-bold text-orange-600">{liveMetrics.transferRate}%</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <PhoneForwarded className="text-orange-600" size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Call Management Components */}
            {callRoutingVisualization && renderRoutingVisualization()}
            {renderAgentQueueManagement()}

            {/* Enhanced Call Interface */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">Smart Call Interface</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCallType('outbound')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          callType === 'outbound' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <PhoneOutgoing size={14} className="inline mr-1" />
                        Outbound
                      </button>
                      <button
                        onClick={() => setCallType('inbound')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          callType === 'inbound' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <PhoneIncoming size={14} className="inline mr-1" />
                        Inbound
                      </button>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      callStatus === 'idle' ? 'bg-gray-100 text-gray-600' :
                      callStatus === 'connecting' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {callStatus === 'idle' ? 'Ready' : callStatus === 'connecting' ? 'Connecting...' : 'Live Call'}
                    </div>
                  </div>
                  {activeCall && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-lg font-mono">
                        <Clock size={16} className="text-gray-500" />
                        {formatTime(callTimer)}
                      </div>
                      {isRecording && (
                        <div className="flex items-center gap-2 text-red-600">
                          <Radio size={16} className="animate-pulse" />
                          <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                        </div>
                      )}
                      {callType === 'outbound' && callTimer > 30 && (
                        <button
                          onClick={handleTransferToHuman}
                          disabled={transferRequested}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            transferRequested 
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                          title="Transfer to Human (T)"
                        >
                          {transferRequested ? 'Transferring...' : 'Transfer to Human'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Modern World-Class Country Dropdown */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="flex">
                    <div className="relative" ref={countryDropdownRef}>
                      <button
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="group relative flex items-center px-5 py-3.5 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-l-xl hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm hover:shadow-md"
                        aria-label="Select country"
                        aria-expanded={showCountryDropdown}
                        aria-haspopup="listbox"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl drop-shadow-sm transform group-hover:scale-110 transition-transform duration-200" role="img" aria-label={selectedCountryData.name}>
                            {selectedCountryData.flag}
                          </span>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-bold text-gray-800 group-hover:text-blue-800 transition-colors">
                              {selectedCountryData.dialCode}
                            </span>
                            <span className="text-xs text-gray-700 group-hover:text-blue-700 font-semibold transition-colors truncate max-w-16">
                              {selectedCountryData.code}
                            </span>
                          </div>
                        </div>
                        <ChevronDown 
                          size={18} 
                          className={`text-gray-400 group-hover:text-blue-500 transition-all duration-300 ml-2 ${
                            showCountryDropdown ? 'rotate-180 text-blue-500' : ''
                          }`} 
                        />
                        
                        {/* Subtle gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 rounded-l-xl transition-all duration-300"></div>
                      </button>
                      
                      {showCountryDropdown && (
                        <div 
                          className="absolute top-full left-0 z-50 w-[420px] bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl mt-3 overflow-hidden transform animate-in zoom-in-95 slide-in-from-top-3 duration-300"
                          style={{
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)'
                          }}
                          role="listbox"
                          aria-label="Country options"
                        >
                          {/* Modern Search Header */}
                          <div className="relative p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-gray-200/30">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={18} className="text-blue-500/70" />
                              </div>
                              <input
                                type="text"
                                value={countrySearchQuery}
                                onChange={(e) => setCountrySearchQuery(e.target.value)}
                                onKeyDown={handleCountryKeyDown}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm placeholder-gray-500 transition-all duration-200 shadow-sm"
                                placeholder="Search for a country or dial code..."
                                autoFocus
                              />
                              {countrySearchQuery && (
                                <button
                                  onClick={() => setCountrySearchQuery('')}
                                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                >
                                  <X size={16} className="text-gray-400 hover:text-gray-600 transition-colors" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Modern Countries List Container */}
                          <div className="max-h-80 overflow-y-auto custom-scrollbar">
                            <style jsx>{`
                              .custom-scrollbar::-webkit-scrollbar {
                                width: 6px;
                              }
                              .custom-scrollbar::-webkit-scrollbar-track {
                                background: #f1f5f9;
                              }
                              .custom-scrollbar::-webkit-scrollbar-thumb {
                                background: #cbd5e1;
                                border-radius: 3px;
                              }
                              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                background: #94a3b8;
                              }
                            `}</style>
                            
                            {/* Popular Countries Section */}
                            {!countrySearchQuery && popularCountries.length > 0 && (
                              <>
                                <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100/50">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Popular Countries
                                    </h3>
                                  </div>
                                </div>
                                {popularCountries.map((country, index) => (
                                  <button
                                    key={`popular-${country.code}`}
                                    onClick={() => {
                                      setSelectedCountry(country.code);
                                      setShowCountryDropdown(false);
                                      setCountrySearchQuery('');
                                    }}
                                    className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 text-left group relative overflow-hidden ${
                                      selectedCountry === country.code ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-r-4 border-blue-500' : ''
                                    }`}
                                    style={{
                                      animationDelay: `${index * 50}ms`
                                    }}
                                    role="option"
                                    aria-selected={selectedCountry === country.code}
                                  >
                                    {selectedCountry === country.code && (
                                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
                                    )}
                                    <div className="relative flex items-center gap-4 w-full">
                                      <span className="text-2xl drop-shadow-sm" role="img" aria-label={country.name}>
                                        {country.flag}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors text-base">
                                          {country.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-gray-600 group-hover:text-blue-700 font-medium">
                                            {country.dialCode}
                                          </span>
                                          <span className="text-xs font-bold text-gray-800 group-hover:text-blue-800 bg-gray-100 group-hover:bg-blue-100 px-1.5 py-0.5 rounded transition-all">
                                            {country.code}
                                          </span>
                                        </div>
                                      </div>
                                      {selectedCountry === country.code ? (
                                        <div className="flex items-center gap-2">
                                          <CheckCircle size={18} className="text-blue-600 drop-shadow-sm" />
                                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Selected</span>
                                        </div>
                                      ) : (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </>
                            )}

                            {/* All Countries Section */}
                            {(countrySearchQuery || !popularCountries.length) && (
                              <>
                                {!countrySearchQuery && (
                                  <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-slate-50/30 border-b border-gray-100/50">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        All Countries
                                      </h3>
                                    </div>
                                  </div>
                                )}
                                {(countrySearchQuery ? filteredCountries : otherCountries).map((country, index) => (
                                  <button
                                    key={country.code}
                                    onClick={() => {
                                      setSelectedCountry(country.code);
                                      setShowCountryDropdown(false);
                                      setCountrySearchQuery('');
                                    }}
                                    className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 text-left group relative overflow-hidden ${
                                      selectedCountry === country.code ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-r-4 border-blue-500' : ''
                                    }`}
                                    style={{
                                      animationDelay: `${index * 20}ms`
                                    }}
                                    role="option"
                                    aria-selected={selectedCountry === country.code}
                                  >
                                    {selectedCountry === country.code && (
                                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
                                    )}
                                    <div className="relative flex items-center gap-4 w-full">
                                      <span className="text-2xl drop-shadow-sm" role="img" aria-label={country.name}>
                                        {country.flag}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                                          {country.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-gray-600 group-hover:text-blue-700 font-medium">
                                            {country.dialCode}
                                          </span>
                                          <span className="text-xs font-bold text-gray-800 group-hover:text-blue-800 bg-gray-100 group-hover:bg-blue-100 px-1.5 py-0.5 rounded transition-all">
                                            {country.code}
                                          </span>
                                        </div>
                                      </div>
                                      {selectedCountry === country.code ? (
                                        <div className="flex items-center gap-2">
                                          <CheckCircle size={18} className="text-blue-600 drop-shadow-sm" />
                                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Selected</span>
                                        </div>
                                      ) : (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </>
                            )}

                            {/* Enhanced No Results Message */}
                            {countrySearchQuery && filteredCountries.length === 0 && (
                              <div className="px-6 py-12 text-center">
                                <div className="relative">
                                  <Globe size={48} className="mx-auto text-gray-300 mb-4 animate-pulse" />
                                  <div className="absolute -top-2 -right-2">
                                    <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                                      <X size={12} className="text-red-500" />
                                    </div>
                                  </div>
                                </div>
                                <div className="text-base font-medium text-gray-700 mb-2">
                                  No countries found
                                </div>
                                <div className="text-sm text-gray-500 mb-4">
                                  Try searching for "{countrySearchQuery}" in a different way
                                </div>
                                <button
                                  onClick={() => setCountrySearchQuery('')}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Clear search
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Modern Footer */}
                          <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30 border-t border-gray-200/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Globe size={14} />
                                <span>{filteredCountries.length} countries available</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <kbd className="px-2.5 py-1.5 text-xs font-mono font-semibold bg-gray-800 text-white border border-gray-700 rounded-lg shadow-sm">ESC</kbd>
                                <span className="text-xs text-gray-600 font-medium">to close</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-5 py-3.5 bg-gradient-to-r from-white to-gray-50 border border-gray-200 border-l-0 rounded-r-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:from-blue-50 focus:to-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md text-gray-800 placeholder-gray-500"
                      placeholder="Enter phone number..."
                    />
                  </div>
                </div>

                {/* Enhanced Voice Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">AI Agent Voice</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {voices.map((voice) => (
                      <button
                        key={voice.name}
                        onClick={() => setSelectedVoice(voice.name)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedVoice === voice.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-600" />
                            <span className="font-medium text-gray-900">{voice.name}</span>
                          </div>
                          {voice.premium && (
                            <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full">
                              Pro
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-600">{voice.accent} • {voice.gender}</p>
                          <p className="text-xs text-gray-500 mt-1">{voice.specialty}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Call Controls with Recording */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleMuteToggle}
                    className={`p-3 rounded-full transition-colors ${
                      muted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={!activeCall}
                    title="Mute/Unmute (M)"
                  >
                    {muted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  <button
                    onClick={toggleRecording}
                    className={`p-3 rounded-full transition-colors ${
                      isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={!activeCall}
                    title="Start/Stop Recording (R)"
                  >
                    <Radio size={20} className={isRecording ? 'animate-pulse' : ''} />
                  </button>
                  
                  <button
                    onClick={handleCall}
                    className={`px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 ${
                      activeCall
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                        : callType === 'outbound'
                        ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
                        : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
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
                        {callType === 'outbound' ? 'Start Outbound Call' : 'Ready for Inbound'}
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setVolume(!volume)}
                    className={`p-3 rounded-full transition-colors ${
                      !volume ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={!activeCall}
                    title="Volume On/Off"
                  >
                    {volume ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>
                </div>

                {/* Recording Playback Controls */}
                {showRecordingControls && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Call Recording Playback</h4>
                      <button
                        onClick={() => setShowRecordingControls(false)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-12">{formatTime(playbackTime)}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 cursor-pointer relative">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${playbackDuration > 0 ? (playbackTime / playbackDuration) * 100 : 0}%` }}
                          ></div>
                          <input
                            type="range"
                            min="0"
                            max={playbackDuration}
                            value={playbackTime}
                            onChange={(e) => setPlaybackPosition(parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-12">{formatTime(playbackDuration)}</span>
                      </div>

                      {/* Playback Controls */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => skipPlayback(-10)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          title="Skip backward 10s"
                        >
                          <Rewind size={16} className="text-gray-600" />
                        </button>
                        
                        <button
                          onClick={() => skipPlayback(-5)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          title="Skip backward 5s"
                        >
                          <SkipBack size={16} className="text-gray-600" />
                        </button>
                        
                        <button
                          onClick={togglePlayback}
                          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                          title="Play/Pause (P)"
                        >
                          {isPlayingBack ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        
                        <button
                          onClick={() => skipPlayback(5)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          title="Skip forward 5s"
                        >
                          <SkipForward size={16} className="text-gray-600" />
                        </button>
                        
                        <button
                          onClick={() => skipPlayback(10)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          title="Skip forward 10s"
                        >
                          <FastForward size={16} className="text-gray-600" />
                        </button>

                        <div className="border-l border-gray-300 h-8 mx-2"></div>

                        <select
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                          className="text-sm border border-gray-300 rounded px-2 py-1 text-gray-900 font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          title="Playback Speed"
                        >
                          <option value={0.5} className="text-gray-900 font-medium">0.5x</option>
                          <option value={0.75} className="text-gray-900 font-medium">0.75x</option>
                          <option value={1} className="text-gray-900 font-medium">1x</option>
                          <option value={1.25} className="text-gray-900 font-medium">1.25x</option>
                          <option value={1.5} className="text-gray-900 font-medium">1.5x</option>
                          <option value={2} className="text-gray-900 font-medium">2x</option>
                        </select>

                        <button
                          onClick={() => {
                            setPlaybackTime(0);
                            setIsPlayingBack(false);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          title="Reset to beginning"
                        >
                          <RotateCcw size={16} className="text-gray-600" />
                        </button>

                        <button
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          title="Download recording"
                        >
                          <Download size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Configuration with keyboard shortcuts indicators */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Settings size={20} className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Advanced Configuration</h3>
                  <div className="text-xs text-gray-500 ml-auto">Press 1-5 to switch tabs</div>
                </div>

                {/* Enhanced Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <TabButton id="basic" label="Basic Setup (1)" icon={Phone} isActive={activeTab === 'basic'} onClick={setActiveTab} />
                  <TabButton id="prompts" label="AI Prompts (2)" icon={MessageSquare} isActive={activeTab === 'prompts'} onClick={setActiveTab} />
                  <TabButton id="routing" label="Call Routing (3)" icon={Route} isActive={activeTab === 'routing'} onClick={setActiveTab} />
                  <TabButton id="transfers" label="Transfer Rules (4)" icon={PhoneForwarded} isActive={activeTab === 'transfers'} onClick={setActiveTab} />
                  <TabButton id="analytics" label="Analytics (5)" icon={BarChart3} isActive={activeTab === 'analytics'} onClick={setActiveTab} />
                </div>

                {/* Tab Content remains the same for brevity */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Opening Greeting</label>
                      <input
                        type="text"
                        value={firstSentence}
                        onChange={(e) => setFirstSentence(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                        placeholder="Thank you for calling [Company Name], how may I help you today?"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Call Objective</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white">
                          <option value="sales" className="text-gray-900">Sales & Lead Generation</option>
                          <option value="support" className="text-gray-900">Customer Support & Help</option>
                          <option value="booking" className="text-gray-900">Appointment Scheduling</option>
                          <option value="survey" className="text-gray-900">Survey & Feedback Collection</option>
                          <option value="reception" className="text-gray-900">General Reception & Routing</option>
                          <option value="followup" className="text-gray-900">Follow-up & Retention</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language & Locale</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white">
                          <option value="en-us" className="text-gray-900">English (US)</option>
                          <option value="en-uk" className="text-gray-900">English (UK)</option>
                          <option value="es" className="text-gray-900">Spanish (ES)</option>
                          <option value="fr" className="text-gray-900">French (FR)</option>
                          <option value="de" className="text-gray-900">German (DE)</option>
                          <option value="ja" className="text-gray-900">Japanese (JP)</option>
                          <option value="zh" className="text-gray-900">Chinese (CN)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Prompts Tab - Complete Implementation */}
                {activeTab === 'prompts' && (
                  <div className="space-y-6">
                    {/* Prompt Template Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {presetPrompts.map((template) => (
                        <button
                          key={template.name}
                          onClick={() => setSelectedPromptTemplate(template.name.toLowerCase().replace(/\s+/g, '_'))}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            selectedPromptTemplate === template.name.toLowerCase().replace(/\s+/g, '_')
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${
                              selectedPromptTemplate === template.name.toLowerCase().replace(/\s+/g, '_')
                                ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <template.icon size={20} className={
                                selectedPromptTemplate === template.name.toLowerCase().replace(/\s+/g, '_')
                                  ? 'text-blue-600' : 'text-gray-600'
                              } />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{template.name}</h4>
                              <div className="flex gap-1 mt-1">
                                {template.transferTriggers.slice(0, 2).map((trigger, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {trigger.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                        </button>
                      ))}
                    </div>

                    {/* Advanced Prompt Configuration */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Brain size={20} className="text-blue-600" />
                        Advanced AI Configuration
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Conversation Objective</label>
                          <select 
                            value={promptObjective}
                            onChange={(e) => setPromptObjective(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white"
                          >
                            <option value="sales" className="text-gray-900">Sales & Conversion</option>
                            <option value="support" className="text-gray-900">Support & Resolution</option>
                            <option value="qualification" className="text-gray-900">Lead Qualification</option>
                            <option value="booking" className="text-gray-900">Appointment Booking</option>
                            <option value="survey" className="text-gray-900">Survey & Feedback</option>
                            <option value="retention" className="text-gray-900">Customer Retention</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Communication Tone</label>
                          <select 
                            value={promptTone}
                            onChange={(e) => setPromptTone(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white"
                          >
                            <option value="professional" className="text-gray-900">Professional</option>
                            <option value="friendly" className="text-gray-900">Friendly & Casual</option>
                            <option value="empathetic" className="text-gray-900">Empathetic & Caring</option>
                            <option value="assertive" className="text-gray-900">Assertive & Direct</option>
                            <option value="consultative" className="text-gray-900">Consultative</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Language</label>
                          <select 
                            value={promptLanguage}
                            onChange={(e) => setPromptLanguage(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white"
                          >
                            <option value="english" className="text-gray-900">English</option>
                            <option value="spanish" className="text-gray-900">Español</option>
                            <option value="french" className="text-gray-900">Français</option>
                            <option value="german" className="text-gray-900">Deutsch</option>
                            <option value="italian" className="text-gray-900">Italiano</option>
                            <option value="portuguese" className="text-gray-900">Português</option>
                          </select>
                        </div>
                      </div>

                      {/* Custom Prompt Input */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Instructions</label>
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="Add specific instructions for the AI agent. For example: 'Always ask about their current solution before presenting ours' or 'Focus on pain points related to efficiency and cost savings.'"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none text-gray-900 placeholder-gray-500 bg-white"
                        />
                      </div>

                      {/* Transfer Triggers */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Auto-Transfer Triggers</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            'pricing_question', 'technical_detail', 'decision_maker', 'complex_issue',
                            'billing_dispute', 'angry_customer', 'special_request', 'enterprise_inquiry',
                            'custom_solution', 'urgent_matter', 'executive_request', 'objection_handling'
                          ].map((trigger) => (
                            <label key={trigger} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={transferTriggers.includes(trigger)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setTransferTriggers([...transferTriggers, trigger]);
                                  } else {
                                    setTransferTriggers(transferTriggers.filter(t => t !== trigger));
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">
                                {trigger.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Save size={16} />
                          Save Prompt Configuration
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Play size={16} />
                          Test AI Response
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Copy size={16} />
                          Export Configuration
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Call Routing Tab - Complete Implementation */}
                {activeTab === 'routing' && (
                  <div className="space-y-6">
                    {/* Routing Strategy Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { 
                          id: 'intelligent', 
                          name: 'Intelligent Routing', 
                          icon: Brain,
                          description: 'AI-powered routing based on call context and agent expertise',
                          features: ['Context analysis', 'Skill matching', 'Load balancing']
                        },
                        { 
                          id: 'round_robin', 
                          name: 'Round Robin', 
                          icon: RotateCw,
                          description: 'Distribute calls evenly across all available agents',
                          features: ['Even distribution', 'Fair workload', 'Simple setup']
                        },
                        { 
                          id: 'priority_based', 
                          name: 'Priority Based', 
                          icon: Star,
                          description: 'Route calls based on customer priority and agent hierarchy',
                          features: ['VIP handling', 'Agent tiers', 'Escalation paths']
                        }
                      ].map((strategy) => (
                        <button
                          key={strategy.id}
                          onClick={() => setRoutingMode(strategy.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            routingMode === strategy.id
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${
                              routingMode === strategy.id ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <strategy.icon size={20} className={
                                routingMode === strategy.id ? 'text-blue-600' : 'text-gray-600'
                              } />
                            </div>
                            <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                          <div className="space-y-1">
                            {strategy.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle size={12} className="text-green-500" />
                                <span className="text-xs text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Department Management */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users2 size={20} className="text-blue-600" />
                        Department Configuration
                      </h4>
                      
                      <div className="space-y-4">
                        {routingDepartments.map((dept) => (
                          <div key={dept.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedDepartments.includes(dept.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedDepartments([...selectedDepartments, dept.id]);
                                    } else {
                                      setSelectedDepartments(selectedDepartments.filter(d => d !== dept.id));
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <h5 className="font-medium text-gray-900">{dept.name}</h5>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{dept.available}/{dept.agents} available</span>
                                <span>Avg: {dept.avgResponse}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm text-gray-600">Expertise:</span>
                              {dept.expertise.map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            
                            {/* Agent availability bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (dept.available / dept.agents) > 0.7 ? 'bg-green-500' :
                                  (dept.available / dept.agents) > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(dept.available / dept.agents) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Routing Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Clock size={16} className="text-blue-600" />
                          Business Hours
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                            <input
                              type="time"
                              value={businessHours.start}
                              onChange={(e) => setBusinessHours({...businessHours, start: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">End Time</label>
                            <input
                              type="time"
                              value={businessHours.end}
                              onChange={(e) => setBusinessHours({...businessHours, end: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Timer size={16} className="text-blue-600" />
                          Queue Settings
                        </h5>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Max Wait Time (seconds)</label>
                          <input
                            type="number"
                            min="30"
                            max="1800"
                            value={maxWaitTime}
                            onChange={(e) => setMaxWaitTime(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Calls will be escalated or handled by AI after this time
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Save size={16} />
                        Save Routing Rules
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Play size={16} />
                        Test Routing Logic
                      </button>
                    </div>
                  </div>
                )}
                {/* Transfer Rules Tab - Complete Implementation */}
                {activeTab === 'transfers' && (
                  <div className="space-y-6">
                    {/* Transfer Strategy Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <PhoneForwarded size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Smart Transfer Management</h4>
                          <p className="text-gray-700 mb-3">
                            Configure when and how the AI should transfer calls to human agents based on conversation context, customer emotions, and specific triggers.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-500" />
                              <span className="text-gray-700">Context-aware transfers</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-500" />
                              <span className="text-gray-700">Sentiment analysis triggers</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-500" />
                              <span className="text-gray-700">Escalation pathways</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transfer Conditions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Keyword Triggers */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb size={18} className="text-yellow-500" />
                          Keyword Triggers
                        </h5>
                        <div className="space-y-3">
                          {[
                            { keyword: 'manager', priority: 'high', department: 'management' },
                            { keyword: 'billing issue', priority: 'medium', department: 'billing' },
                            { keyword: 'cancel subscription', priority: 'high', department: 'retention' },
                            { keyword: 'technical problem', priority: 'medium', department: 'support' },
                            { keyword: 'enterprise solution', priority: 'high', department: 'sales' },
                            { keyword: 'complaint', priority: 'high', department: 'management' }
                          ].map((trigger, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-900">"{trigger.keyword}"</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  trigger.priority === 'high' ? 'bg-red-100 text-red-700' : 
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {trigger.priority}
                                </span>
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                  {trigger.department}
                                </span>
                              </div>
                              <button className="p-1 hover:bg-gray-200 rounded">
                                <Trash2 size={14} className="text-gray-500" />
                              </button>
                            </div>
                          ))}
                          <button className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
                            <Plus size={16} />
                            Add Keyword Trigger
                          </button>
                        </div>
                      </div>

                      {/* Sentiment Triggers */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <HeartHandshake size={18} className="text-green-500" />
                          Sentiment Triggers
                        </h5>
                        <div className="space-y-4">
                          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-red-800">Angry/Frustrated</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                              </label>
                            </div>
                            <p className="text-sm text-red-700">Transfer immediately to management when customer shows anger or extreme frustration</p>
                            <div className="mt-2">
                              <select className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white">
                                <option className="text-gray-900">Management Team</option>
                                <option className="text-gray-900">Senior Support</option>
                                <option className="text-gray-900">Customer Success</option>
                              </select>
                            </div>
                          </div>

                          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-yellow-800">Confused/Uncertain</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                              </label>
                            </div>
                            <p className="text-sm text-yellow-700">Offer human assistance when customer seems confused or needs detailed explanation</p>
                            <div className="mt-2">
                              <select className="w-full px-3 py-2 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white">
                                <option className="text-gray-900">Technical Support</option>
                                <option className="text-gray-900">Customer Success</option>
                                <option className="text-gray-900">Sales Team</option>
                              </select>
                            </div>
                          </div>

                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-green-800">Highly Interested</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                              </label>
                            </div>
                            <p className="text-sm text-green-700">Transfer to sales when customer shows high interest in purchasing</p>
                            <div className="mt-2">
                              <select className="w-full px-3 py-2 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white">
                                <option className="text-gray-900">Sales Team</option>
                                <option className="text-gray-900">Account Executive</option>
                                <option className="text-gray-900">Business Development</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transfer Timing & Conditions */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-blue-600" />
                        Transfer Timing & Conditions
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Call Duration</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white">
                            <option value="0" className="text-gray-900">Immediate</option>
                            <option value="30" className="text-gray-900" selected>30 seconds</option>
                            <option value="60" className="text-gray-900">1 minute</option>
                            <option value="120" className="text-gray-900">2 minutes</option>
                            <option value="300" className="text-gray-900">5 minutes</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">Minimum time before transfer is allowed</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max AI Attempts</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white">
                            <option value="1" className="text-gray-900">1 attempt</option>
                            <option value="2" className="text-gray-900">2 attempts</option>
                            <option value="3" className="text-gray-900" selected>3 attempts</option>
                            <option value="5" className="text-gray-900">5 attempts</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">How many times AI should try before transferring</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours Only</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm text-gray-700">Only transfer during business hours</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">Outside hours: take message or schedule callback</p>
                        </div>
                      </div>
                    </div>

                    {/* Transfer Success Metrics */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 size={18} className="text-green-600" />
                        Transfer Performance (Last 7 Days)
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Total Transfers</p>
                              <p className="text-2xl font-bold text-gray-900">47</p>
                            </div>
                            <PhoneForwarded className="text-blue-500" size={24} />
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Success Rate</p>
                              <p className="text-2xl font-bold text-green-600">94.3%</p>
                            </div>
                            <CheckCircle className="text-green-500" size={24} />
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Avg Wait Time</p>
                              <p className="text-2xl font-bold text-orange-600">1:24</p>
                            </div>
                            <Timer className="text-orange-500" size={24} />
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Customer Satisfaction</p>
                              <p className="text-2xl font-bold text-green-600">4.8/5</p>
                            </div>
                            <Star className="text-yellow-500" size={24} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Save size={16} />
                        Save Transfer Rules
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Play size={16} />
                        Test Transfer Logic
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download size={16} />
                        Export Rules
                      </button>
                    </div>
                  </div>
                )}
                {/* Analytics Tab - Complete Implementation */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* Date Range Selector */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <BarChart3 size={20} className="text-blue-600" />
                        Performance Analytics
                      </h4>
                      <select 
                        value={analyticsDateRange}
                        onChange={(e) => setAnalyticsDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white"
                      >
                        <option value="1" className="text-gray-900">Last 24 Hours</option>
                        <option value="7" className="text-gray-900">Last 7 Days</option>
                        <option value="30" className="text-gray-900">Last 30 Days</option>
                        <option value="90" className="text-gray-900">Last 90 Days</option>
                      </select>
                    </div>

                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-blue-500 rounded-lg">
                            <PhoneCall className="text-white" size={24} />
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp size={14} />
                              <span className="text-sm font-medium">
                                {realTimeData?.analytics?.callGrowth > 0 ? '+' : ''}{realTimeData?.analytics?.callGrowth || 12}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {dataLoading ? '...' : (realTimeData?.analytics?.totalCalls?.toLocaleString() || '2,847')}
                          </p>
                          <p className="text-sm text-gray-600">Total Calls</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-green-500 rounded-lg">
                            <CheckCircle className="text-white" size={24} />
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp size={14} />
                              <span className="text-sm font-medium">
                                {realTimeData?.analytics?.successRateChange > 0 ? '+' : ''}{realTimeData?.analytics?.successRateChange || 8}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {dataLoading ? '...' : `${realTimeData?.analytics?.successRate || '96.2'}%`}
                          </p>
                          <p className="text-sm text-gray-600">Success Rate</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-purple-500 rounded-lg">
                            <Clock size={24} className="text-white" />
                          </div>
                          <div className="text-right">
                            <div className={`flex items-center gap-1 ${
                              (realTimeData?.analytics?.avgDurationChange || -3) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {(realTimeData?.analytics?.avgDurationChange || -3) >= 0 ? 
                                <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              <span className="text-sm font-medium">
                                {realTimeData?.analytics?.avgDurationChange > 0 ? '+' : ''}{realTimeData?.analytics?.avgDurationChange || -3}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {dataLoading ? '...' : (realTimeData?.analytics?.avgDuration || '4:32')}
                          </p>
                          <p className="text-sm text-gray-600">Avg Duration</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-orange-500 rounded-lg">
                            <Star className="text-white" size={24} />
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp size={14} />
                              <span className="text-sm font-medium">
                                +{realTimeData?.analytics?.ratingChange || '0.2'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {dataLoading ? '...' : `${realTimeData?.analytics?.customerRating || '4.7'}/5`}
                          </p>
                          <p className="text-sm text-gray-600">Customer Rating</p>
                        </div>
                      </div>
                    </div>

                    {/* Call Volume Chart */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h5 className="font-semibold text-gray-900">Call Volume Trends</h5>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">Daily</button>
                          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Weekly</button>
                          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Monthly</button>
                        </div>
                      </div>
                      
                      {/* Mock Chart Area */}
                      <div className="h-64 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 flex items-end justify-around p-8">
                          {[65, 80, 75, 90, 85, 95, 88, 92, 87, 94, 89, 96, 91, 98].map((height, index) => (
                            <div
                              key={index}
                              className="bg-blue-500 rounded-t-lg transition-all duration-1000 ease-out opacity-80 hover:opacity-100"
                              style={{ height: `${height}%`, width: '20px', animationDelay: `${index * 100}ms` }}
                            />
                          ))}
                        </div>
                        <div className="absolute bottom-4 left-4 text-xs text-gray-500">0</div>
                        <div className="absolute top-4 left-4 text-xs text-gray-500">500</div>
                        <div className="z-10 text-gray-500">
                          <LineChart size={48} />
                          <p className="text-sm mt-2">Interactive chart would appear here</p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Call Types Distribution */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <PieChart size={18} className="text-blue-600" />
                          Call Types Distribution
                        </h5>
                        
                        <div className="space-y-4">
                          {[
                            { type: 'Sales Inquiries', count: 1247, percentage: 44, color: 'bg-blue-500' },
                            { type: 'Support Requests', count: 856, percentage: 30, color: 'bg-green-500' },
                            { type: 'Billing Questions', count: 428, percentage: 15, color: 'bg-yellow-500' },
                            { type: 'General Info', count: 316, percentage: 11, color: 'bg-purple-500' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="text-sm text-gray-700">{item.type}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${item.color}`}
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Agent Performance */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Users size={18} className="text-blue-600" />
                          Top Performing Agents
                        </h5>
                        
                        <div className="space-y-4">
                          {[
                            { name: 'Sarah Johnson', calls: 156, satisfaction: 4.9, efficiency: 96 },
                            { name: 'Mike Chen', calls: 142, satisfaction: 4.8, efficiency: 94 },
                            { name: 'Emily Davis', calls: 138, satisfaction: 4.7, efficiency: 91 },
                            { name: 'James Wilson', calls: 124, satisfaction: 4.6, efficiency: 89 }
                          ].map((agent, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{agent.name}</p>
                                  <p className="text-xs text-gray-500">{agent.calls} calls handled</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  <Star size={12} className="text-yellow-500" />
                                  <span className="text-sm font-medium text-gray-900">{agent.satisfaction}</span>
                                </div>
                                <div className="text-xs text-gray-500">{agent.efficiency}% efficiency</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Real-time Monitoring */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-green-600" />
                        Real-time System Health
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-3">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
                            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-green-600">98%</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">System Uptime</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-3">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
                            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-blue-500" style={{ 
                              borderTopColor: 'transparent',
                              transform: 'rotate(252deg)' // 70% of 360deg
                            }}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">70%</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">AI Resolution Rate</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-3">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
                            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-orange-500" style={{ 
                              borderTopColor: 'transparent',
                              transform: 'rotate(108deg)' // 30% of 360deg
                            }}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-orange-600">30%</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Transfer Rate</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download size={16} />
                        Export Report
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <CalendarIcon size={16} />
                        Schedule Report
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share size={16} />
                        Share Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Contact Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact List</h3>
                  <div className="text-xs text-gray-500">Ctrl+F to search</div>
                </div>
                
                {/* Search and Filter */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="contact-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search contacts..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all" className="text-gray-900 font-medium">All Contacts</option>
                      <option value="lead" className="text-purple-700 font-medium">Leads</option>
                      <option value="customer" className="text-blue-700 font-medium">Customers</option>
                      <option value="prospect" className="text-green-700 font-medium">Prospects</option>
                      <option value="new" className="text-orange-700 font-medium">New</option>
                      <option value="contacted" className="text-teal-700 font-medium">Contacted</option>
                      <option value="callback" className="text-red-700 font-medium">Callback</option>
                    </select>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <SlidersHorizontal size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Contact List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{contact.name}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            contact.priority === 'high' ? 'bg-red-100 text-red-700' :
                            contact.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {contact.priority}
                          </span>
                        </div>
                        <button
                          onClick={() => setPhoneNumber(contact.number)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Select number"
                        >
                          <Phone size={14} className="text-gray-500" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">{contact.number}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.type === 'lead' ? 'bg-purple-100 text-purple-700' :
                          contact.type === 'customer' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {contact.type}
                        </span>
                        <span className="text-xs text-gray-500">Last: {contact.lastCalled}</span>
                      </div>
                    </div>
                  ))}
                  
                  {filteredContacts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Search size={24} className="mx-auto mb-2" />
                      <p>No contacts found</p>
                      <p className="text-xs">Try adjusting your search or filter</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Real-Time Data Debug Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Activity size={20} className="text-green-600" />
                    Live Data Monitor
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
                      connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-500">
                      {connectionStatus === 'connected' ? 'Connected' :
                       connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                    </span>
                    <button 
                      onClick={testApiConnection}
                      className="ml-3 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Test API
                    </button>
                    <button 
                      onClick={refreshLiveData}
                      className="ml-2 px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                
                {dataError ? (
                  <div className="text-center py-4 text-red-600">
                    <AlertTriangle className="mx-auto mb-2" size={24} />
                    <p className="text-sm">Connection Error: {dataError}</p>
                  </div>
                ) : dataLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    <div className="animate-spin mx-auto mb-2">
                      <Activity size={24} />
                    </div>
                    <p className="text-sm">Loading live data...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {realTimeData?.callMetrics?.activeCalls || 0}
                      </div>
                      <div className="text-xs text-gray-600">Active Calls</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {realTimeData?.callMetrics?.queueSize || 0}
                      </div>
                      <div className="text-xs text-gray-600">In Queue</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {realTimeData?.agentMetrics?.online || 0}
                      </div>
                      <div className="text-xs text-gray-600">Agents Online</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {realTimeData?.systemHealth?.uptime || '99.9%'}
                      </div>
                      <div className="text-xs text-gray-600">Uptime</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Inbound Call Queue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Inbound Queue</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">Live</span>
                    <div className="text-xs text-gray-500 ml-2">Enter to answer</div>
                  </div>
                </div>
                
                {inboundQueue.length === 0 ? (
                  <div className="text-center py-8">
                    <PhoneIncoming className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-500">No incoming calls</p>
                    <p className="text-xs text-gray-400">Waiting for inbound calls...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inboundQueue.map((call, index) => (
                      <div key={call.id} className={`p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500 ${index === 0 ? 'ring-2 ring-blue-200' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{call.country.flag}</span>
                            <span className="font-medium text-gray-900">{call.number}</span>
                            {index === 0 && <span className="text-xs text-blue-600 font-medium">NEXT</span>}
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
                          <span className="text-xs text-gray-500">Wait: {Math.floor(call.waitTime / 60)}:{(call.waitTime % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <button
                          onClick={() => handleInboundCall(call)}
                          className={`w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium ${
                            index === 0 ? 'ring-2 ring-green-300' : ''
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

            {/* Quick Actions with Shortcuts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Upload size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Import Contact List</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Calendar size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Schedule Campaign</span>
                  </button>
                  <button 
                    onClick={() => setShowRecordingControls(true)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Play size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">View Recordings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Download size={16} className="text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Export Call Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{shortcut.action}</div>
                    <div className="text-sm text-gray-600">{shortcut.description}</div>
                  </div>
                  <div className="bg-white px-3 py-1 rounded border border-gray-300 text-sm font-mono">
                    {shortcut.key}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Press <kbd className="bg-gray-100 px-2 py-1 rounded">Escape</kbd> to close this dialog</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Floating Indicators */}
      {activeCall && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="font-medium">
            {callType === 'inbound' ? 'Inbound' : 'Outbound'} Call Active - {formatTime(callTimer)}
          </span>
          {transferRequested && (
            <div className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
              Transferring...
            </div>
          )}
        </div>
      )}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <PhoneIncoming className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Incoming Call</h3>
              <p className="text-gray-600 mb-2">
                {incomingCall.parameters?.From || 'Unknown Number'}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Incoming voice call via Twilio
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleIncomingCall(incomingCall)}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Accept
                </button>
                <button
                  onClick={handleRejectCall}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneOff size={18} />
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Error Modal */}
      {callError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneOff className="text-red-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Error</h3>
              <p className="text-red-600 mb-4 text-sm">
                {callError}
              </p>
              <button
                onClick={() => setCallError(null)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Notification Modal */}
      {transferRequested && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneForwarded className="text-orange-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transferring Call</h3>
              <p className="text-gray-600 mb-4">
                AI agent is transferring the call to a human specialist based on the conversation context.
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
              </div>
              <div className="text-sm text-gray-500">
                Connecting to best available agent...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Country Dropdown Overlay */}
      {showCountryDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCountryDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default CallCenterDashboard;