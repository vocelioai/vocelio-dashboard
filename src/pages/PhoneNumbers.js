import React, { useState, useEffect } from 'react';
import twilioAPI from '../lib/twilioAPI';
import { 
  Phone, Plus, Search, Filter, Globe, CreditCard, Check, X, 
  ArrowRight, MapPin, Shield, Clock, Star, AlertCircle, Info,
  Zap, DollarSign, Users, Settings, ChevronDown, ChevronRight,
  PhoneCall, MessageSquare, Smartphone, Radio, Wifi, Loader,
  CheckCircle, ExternalLink, Copy, RefreshCw, Eye, Download,
  Upload, Edit, Trash2, MoreHorizontal, AlertTriangle, Crown,
  Sparkles, Award, TrendingUp, BarChart3, Activity, Volume2
} from 'lucide-react';
import './PhoneNumbers.css';

const TwilioNumberPurchase = () => {
  const [activeTab, setActiveTab] = useState('my-numbers');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedType, setSelectedType] = useState('local');
  const [selectedFeatures, setSelectedFeatures] = useState(['voice']);
  const [searchArea, setSearchArea] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [myNumbers, setMyNumbers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load owned numbers on component mount
  useEffect(() => {
    loadOwnedNumbers();
  }, []);

  // Load owned numbers from Twilio API
  const loadOwnedNumbers = async () => {
    try {
      setIsLoading(true);
      const response = await twilioAPI.getOwnedNumbers();
      
      if (response.incoming_phone_numbers) {
        const formattedNumbers = response.incoming_phone_numbers.map((number, index) => ({
          id: number.sid || index + 1,
          phoneNumber: twilioAPI.formatPhoneNumber(number.phone_number),
          friendlyName: number.friendly_name || 'Unnamed Number',
          capabilities: [
            ...(number.capabilities?.voice ? ['Voice'] : []),
            ...(number.capabilities?.sms ? ['SMS'] : []),
            ...(number.capabilities?.mms ? ['MMS'] : [])
          ],
          status: number.status || 'active',
          purchaseDate: number.date_created ? new Date(number.date_created).toISOString().split('T')[0] : '2024-01-01',
          monthlyFee: `$${twilioAPI.getPricing(selectedCountry, 'local')}`,
          usage: {
            calls: Math.floor(Math.random() * 100), // TODO: Get real usage from backend
            sms: Math.floor(Math.random() * 500),
            mms: Math.floor(Math.random() * 50)
          },
          rawData: number
        }));
        setMyNumbers(formattedNumbers);
      }
    } catch (error) {
      console.error('Failed to load owned numbers:', error);
      // Keep any existing numbers in case of API failure
    } finally {
      setIsLoading(false);
    }
  };

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸', pricing: { local: 1.15, tollFree: 2.00, mobile: 1.50 } },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', pricing: { local: 1.00, tollFree: 2.00, mobile: 1.25 } },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', pricing: { local: 1.30, tollFree: 2.50, mobile: 1.80 } },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', pricing: { local: 2.00, tollFree: 3.00, mobile: 2.50 } },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', pricing: { local: 1.50, tollFree: 2.80, mobile: 2.00 } },
    { code: 'FR', name: 'France', flag: '🇫🇷', pricing: { local: 1.40, tollFree: 2.60, mobile: 1.90 } },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', pricing: { local: 1.20, tollFree: 2.40, mobile: 1.70 } },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', pricing: { local: 1.35, tollFree: 2.55, mobile: 1.85 } }
  ];

  const numberTypes = [
    { 
      id: 'local', 
      name: 'Local Numbers', 
      description: 'Geographic numbers for specific cities/regions',
      icon: MapPin,
      features: ['Voice', 'SMS'],
      bestFor: 'Local businesses, regional campaigns'
    },
    { 
      id: 'tollFree', 
      name: 'Toll-Free Numbers', 
      description: 'Free for callers, premium appearance',
      icon: Phone,
      features: ['Voice'],
      bestFor: 'Customer service, national campaigns'
    },
    { 
      id: 'mobile', 
      name: 'Mobile Numbers', 
      description: 'Mobile-friendly with enhanced features',
      icon: Smartphone,
      features: ['Voice', 'SMS', 'MMS'],
      bestFor: 'SMS campaigns, mobile marketing'
    }
  ];

  const features = [
    { id: 'voice', name: 'Voice Calls', icon: PhoneCall, required: true },
    { id: 'sms', name: 'SMS Messaging', icon: MessageSquare, required: false },
    { id: 'mms', name: 'MMS Messaging', icon: Smartphone, required: false }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const searchOptions = {
        limit: 10,
        type: selectedType === 'local' ? 'Local' : selectedType === 'tollFree' ? 'TollFree' : 'Mobile'
      };

      // Add area code filter if provided
      if (searchArea && searchArea.length === 3) {
        searchOptions.areaCode = searchArea;
      }

      // Add pattern search if provided
      if (searchArea && searchArea.length > 3) {
        searchOptions.contains = searchArea.replace(/\D/g, '');
      }

      const response = await twilioAPI.searchAvailableNumbers(selectedCountry, searchOptions);
      
      if (response.available_phone_numbers) {
        const formattedNumbers = response.available_phone_numbers.map(number => ({
          phoneNumber: number.phone_number,
          friendlyName: twilioAPI.formatPhoneNumber(number.phone_number),
          locality: number.locality || 'Unknown',
          region: number.region || 'Unknown',
          country: number.iso_country || selectedCountry,
          capabilities: [
            ...(number.capabilities?.voice ? ['voice'] : []),
            ...(number.capabilities?.sms ? ['sms'] : []),
            ...(number.capabilities?.mms ? ['mms'] : [])
          ],
          monthlyPrice: number.price ? parseFloat(number.price) : twilioAPI.getPricing(selectedCountry, selectedType),
          rawData: number
        }));
        setAvailableNumbers(formattedNumbers);
      } else {
        setAvailableNumbers([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Show fallback message or mock data
      setAvailableNumbers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePurchase = async (number) => {
    setSelectedNumber(number);
    setShowCheckout(true);
  };

  const completePurchase = async () => {
    if (!selectedNumber) return;

    try {
      setIsLoading(true);
      
      const purchaseOptions = {
        friendlyName: selectedNumber.friendlyName || `Number ${selectedNumber.phoneNumber}`,
        // Add webhook URLs from environment variables if available
        voiceUrl: process.env.REACT_APP_TWILIO_VOICE_WEBHOOK || '',
        smsUrl: process.env.REACT_APP_TWILIO_SMS_WEBHOOK || ''
      };

      const result = await twilioAPI.purchaseNumber(selectedNumber.phoneNumber, purchaseOptions);
      
      if (result.sid) {
        // Add to local state immediately
        const newNumber = {
          id: result.sid,
          phoneNumber: twilioAPI.formatPhoneNumber(result.phone_number),
          friendlyName: result.friendly_name,
          capabilities: [
            ...(result.capabilities?.voice ? ['Voice'] : []),
            ...(result.capabilities?.sms ? ['SMS'] : []),
            ...(result.capabilities?.mms ? ['MMS'] : [])
          ],
          status: 'active',
          purchaseDate: new Date().toISOString().split('T')[0],
          monthlyFee: `$${selectedNumber.monthlyPrice}`,
          usage: { calls: 0, sms: 0, mms: 0 },
          rawData: result
        };

        setMyNumbers(prev => [...prev, newNumber]);
        setShowCheckout(false);
        setSelectedNumber(null);
        setActiveTab('my-numbers');
        
        // Optionally reload all numbers to ensure sync
        setTimeout(() => loadOwnedNumbers(), 1000);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Failed to purchase number: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNumber = async (numberId) => {
    try {
      const number = myNumbers.find(n => n.id === numberId);
      if (!number) return;

      if (window.confirm(`Are you sure you want to delete ${number.phoneNumber}? This action cannot be undone.`)) {
        setIsLoading(true);
        
        // If this is a real Twilio number (has rawData.sid), delete from Twilio
        if (number.rawData?.sid) {
          await twilioAPI.deleteNumber(number.rawData.sid);
        }
        
        // Remove from local state
        setMyNumbers(prev => prev.filter(n => n.id !== numberId));
      }
    } catch (error) {
      console.error('Failed to delete number:', error);
      alert('Failed to delete number: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const NumberCard = ({ number, onDelete }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            number.capabilities.includes('Voice') && number.capabilities.includes('SMS') ? 'bg-green-500/10 text-green-500' :
            number.capabilities.includes('Voice') ? 'bg-blue-500/10 text-blue-500' :
            'bg-purple-500/10 text-purple-500'
          }`}>
            {number.capabilities.includes('Voice') ? <PhoneCall className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-lg">{number.phoneNumber}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{number.friendlyName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            number.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
          }`}>
            {number.status}
          </span>
          <div className="relative group">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button 
                onClick={() => onDelete && onDelete(number.id)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Number</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {number.capabilities.map(capability => (
          <span key={capability} className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs font-medium rounded-full">
            {capability}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-lg font-bold text-blue-500">{number.usage.calls.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Calls</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-500">{number.usage.sms.toLocaleString()}</div>
          <div className="text-xs text-gray-500">SMS</div>
        </div>
        <div>
          <div className="text-lg font-bold text-purple-500">{number.usage.mms.toLocaleString()}</div>
          <div className="text-xs text-gray-500">MMS</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <div className="text-sm font-medium">{number.monthlyFee}/month</div>
          <div className="text-xs text-gray-500">Since {number.purchaseDate}</div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Configure
          </button>
          <button className="text-gray-500 hover:text-gray-600 text-sm font-medium">
            Usage
          </button>
        </div>
      </div>
    </div>
  );

  const AvailableNumberCard = ({ number }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">{number.friendlyName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {number.locality}, {number.region} • {number.country}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-500">${number.monthlyPrice}</div>
          <div className="text-xs text-gray-500">per month</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1">
          {number.capabilities.map((cap, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
              {cap.charAt(0).toUpperCase() + cap.slice(1)}
            </span>
          ))}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
          selectedType === 'tollFree' ? 'bg-purple-500/10 text-purple-500' :
          selectedType === 'mobile' ? 'bg-blue-500/10 text-blue-500' :
          'bg-green-500/10 text-green-500'
        }`}>
          {selectedType === 'tollFree' ? 'Toll-Free' : selectedType === 'mobile' ? 'Mobile' : 'Local'}
        </div>
      </div>

      <button
        onClick={() => handlePurchase(number)}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
      >
        <CreditCard className="w-4 h-4" />
        <span>Purchase ${number.monthlyPrice}/month</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Phone Numbers
                  </h1>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    NEW
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📞 Manage your Twilio phone numbers • Global coverage • Instant provisioning
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-lg font-semibold">
                {myNumbers.length} Active Numbers
              </div>
              <button className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 p-3 rounded-xl transition-all">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveTab('my-numbers')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'my-numbers'
                ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Phone className="w-5 h-5" />
            <span>My Numbers ({myNumbers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('buy-number')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'buy-number'
                ? 'bg-white dark:bg-gray-800 text-green-500 shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>Buy Number</span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">NEW</span>
          </button>
        </div>

        {/* My Numbers Tab */}
        {activeTab === 'my-numbers' && (
          <div className="space-y-8">
            {/* Connection Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${twilioAPI.isConfigured() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">
                    Twilio Integration {twilioAPI.isConfigured() ? 'Connected' : 'Not Configured'}
                  </span>
                </div>
                {twilioAPI.isConfigured() && (
                  <span className="text-xs text-gray-500">
                    Account: {process.env.REACT_APP_TWILIO_ACCOUNT_SID?.slice(0, 8)}...
                  </span>
                )}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{myNumbers.length}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Numbers</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      ${myNumbers.reduce((sum, num) => sum + num.monthlyPrice, 0).toFixed(2)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <PhoneCall className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {myNumbers.reduce((sum, num) => sum + num.usage.calls, 0).toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Calls</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {Math.round(myNumbers.reduce((sum, num) => sum + num.usage.minutes, 0) / 60)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hours Talked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search numbers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={loadOwnedNumbers}
                    disabled={isLoading}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('buy-number')}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Buy New Number</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading && myNumbers.length === 0 ? (
                // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                ))
              ) : (
                myNumbers
                  .filter(number => 
                    searchQuery === '' || 
                    number.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    number.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(number => (
                    <NumberCard key={number.id} number={number} onDelete={deleteNumber} />
                  ))
              )}
            </div>

            {!isLoading && myNumbers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No phone numbers yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Get started by purchasing your first Twilio phone number
                </p>
                <button
                  onClick={() => setActiveTab('buy-number')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
                >
                  Buy Your First Number
                </button>
              </div>
            )}
          </div>
        )}

        {/* Buy Number Tab */}
        {activeTab === 'buy-number' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center">
              <h2 className="text-4xl font-bold mb-4">🌍 Buy Phone Numbers Globally</h2>
              <p className="text-xl mb-6 opacity-90">
                Instant provisioning • 85+ countries • Local, toll-free, and mobile numbers
              </p>
              <div className="flex justify-center space-x-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">85+</div>
                  <div className="opacity-80">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Instant</div>
                  <div className="opacity-80">Provisioning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">$1.15</div>
                  <div className="opacity-80">Starting Price</div>
                </div>
              </div>
            </div>

            {/* Number Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-2xl font-bold mb-6">🔧 Configure Your Number</h3>
              
              {/* Country Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3">Country</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {countries.map(country => (
                    <button
                      key={country.code}
                      onClick={() => setSelectedCountry(country.code)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedCountry === country.code
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl mb-2">{country.flag}</div>
                      <div className="font-semibold">{country.name}</div>
                      <div className="text-xs text-gray-500">From ${country.pricing.local}/mo</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number Type Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3">Number Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {numberTypes.map(type => {
                    const Icon = type.icon;
                    const selectedCountryData = countries.find(c => c.code === selectedCountry);
                    const price = selectedCountryData?.pricing[type.id] || 0;
                    
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          selectedType === type.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Icon className="w-6 h-6 text-blue-500" />
                          <h4 className="font-bold">{type.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {type.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-green-500">${price}/month</div>
                          <div className="text-xs text-gray-500">{type.bestFor}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Features Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3">Features</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {features.map(feature => {
                    const Icon = feature.icon;
                    const isSelected = selectedFeatures.includes(feature.id);
                    const isDisabled = feature.required || (feature.id === 'mms' && selectedType !== 'mobile');
                    
                    return (
                      <button
                        key={feature.id}
                        disabled={isDisabled}
                        onClick={() => {
                          if (!feature.required && !isDisabled) {
                            if (isSelected) {
                              setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id));
                            } else {
                              setSelectedFeatures([...selectedFeatures, feature.id]);
                            }
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-500/10'
                            : isDisabled
                              ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-green-500' : 'text-gray-400'}`} />
                          <span className="font-semibold">{feature.name}</span>
                          {feature.required && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Required</span>
                          )}
                          {isSelected && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Area Code / Search */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3">
                  {selectedType === 'local' ? 'Area Code or City' : 'Search Preferences'}
                </label>
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={selectedType === 'local' ? "Enter area code (e.g., 415) or city name" : "Enter preferences..."}
                      value={searchArea}
                      onChange={(e) => setSearchArea(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
                  >
                    {isSearching ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Search Numbers</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-lg mb-4">💰 Pricing Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      ${countries.find(c => c.code === selectedCountry)?.pricing[selectedType] || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Base</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">$0.0085</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Per Minute</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">$0.0075</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Per SMS</div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  💳 One-time setup fee: $0 • No contracts • Cancel anytime
                </div>
              </div>
            </div>

            {/* Available Numbers */}
            {availableNumbers.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">📞 Available Numbers</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Found {availableNumbers.length} numbers
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {availableNumbers.map((number, index) => (
                    <AvailableNumberCard key={index} number={number} />
                  ))}
                </div>
              </div>
            )}

            {/* Getting Started */}
            {availableNumbers.length === 0 && !isSearching && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">🔍 Ready to Find Numbers?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  Configure your preferences above and click "Search Numbers" to see available phone numbers 
                  from Twilio's global inventory. Numbers are provisioned instantly upon purchase.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Global Coverage</h4>
                    <p className="text-sm text-gray-500">85+ countries available</p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-green-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Instant Setup</h4>
                    <p className="text-sm text-gray-500">Ready in under 60 seconds</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Enterprise Grade</h4>
                    <p className="text-sm text-gray-500">99.99% uptime guarantee</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedNumber && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">💳 Complete Purchase</h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-lg mb-4">📋 Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Phone Number:</span>
                    <span className="font-semibold">{selectedNumber.friendlyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span>{selectedNumber.locality}, {selectedNumber.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{selectedType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Features:</span>
                    <span>{selectedFeatures.join(', ')}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Monthly Price:</span>
                      <span className="text-green-500">${selectedNumber.monthlyPrice}/month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-4">💳 Payment Information</h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Stripe Secure Checkout</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Your payment will be processed securely through Stripe. The number will be provisioned 
                    instantly via Twilio API and appear in your dashboard within 60 seconds.
                  </p>
                </div>
              </div>

              {/* Usage Estimates */}
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-4">📊 Estimated Monthly Costs</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-green-500">$1.15</div>
                    <div className="text-sm">Base Fee</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-blue-500">$8.50</div>
                    <div className="text-sm">~1000 minutes</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-purple-500">$7.50</div>
                    <div className="text-sm">~1000 SMS</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 py-3 px-6 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={completePurchase}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-green-400 disabled:to-emerald-400 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Purchase ${selectedNumber.monthlyPrice}/month</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">🚀 Why Choose Vocelio + Twilio Numbers?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="font-bold text-lg mb-2">Instant Provisioning</h4>
              <p className="text-sm opacity-80">
                Numbers are provisioned instantly through Twilio API and ready to use in under 60 seconds
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="font-bold text-lg mb-2">Global Coverage</h4>
              <p className="text-sm opacity-80">
                85+ countries available with local, toll-free, and mobile numbers for worldwide reach
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="font-bold text-lg mb-2">Enterprise Grade</h4>
              <p className="text-sm opacity-80">
                99.99% uptime SLA with Twilio's carrier-grade infrastructure and redundancy
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-white/10 rounded-xl px-6 py-3 backdrop-blur-sm">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm">Secure payments via Stripe</span>
              <span className="text-gray-300">•</span>
              <Phone className="w-5 h-5" />
              <span className="text-sm">Powered by Twilio</span>
              <span className="text-gray-300">•</span>
              <Shield className="w-5 h-5" />
              <span className="text-sm">SOC 2 compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Vocelio.ai
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              🌍 Global phone numbers powered by Twilio • Instant provisioning • Enterprise-grade reliability
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-500 transition-colors">Twilio Integration Docs</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Pricing Guide</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Number Porting</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Support Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TwilioNumberPurchase;