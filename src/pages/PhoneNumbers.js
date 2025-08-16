import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Search, Filter, Globe, Phone, MessageSquare, Headphones, ChevronDown, Star, ArrowUpRight, DollarSign, MapPin, Clock, CheckCircle, XCircle, RefreshCw, Zap, Shield, Mail, FileText } from 'lucide-react';
import twilioAPI from '../lib/twilioAPI';

const PhoneNumberPurchasePage = () => {
  const [selectedCountry, setSelectedCountry] = useState('US (+1) United States - US');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchCriteria, setMatchCriteria] = useState('First part of number');
  const [selectedCapabilities, setSelectedCapabilities] = useState({
    voice: false, // Don't require voice by default
    sms: false,   // Don't require SMS by default  
    mms: false,   // Don't require MMS by default
    fax: false    // Don't require fax by default
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Advanced search filters
  const [numberTypes, setNumberTypes] = useState({
    local: true,
    mobile: true,
    tollFree: true
  });
  const [addressRequirement, setAddressRequirement] = useState('Any');
  const [excludeBeta, setExcludeBeta] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Comprehensive list of countries where Twilio offers phone numbers
  const availableCountries = [
    { code: 'AD', name: 'Andorra', dialCode: '+376' },
    { code: 'AR', name: 'Argentina', dialCode: '+54' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
    { code: 'AT', name: 'Austria', dialCode: '+43' },
    { code: 'BE', name: 'Belgium', dialCode: '+32' },
    { code: 'BZ', name: 'Belize', dialCode: '+501' },
    { code: 'BR', name: 'Brazil', dialCode: '+55' },
    { code: 'BG', name: 'Bulgaria', dialCode: '+359' },
    { code: 'CA', name: 'Canada', dialCode: '+1' },
    { code: 'CL', name: 'Chile', dialCode: '+56' },
    { code: 'CO', name: 'Colombia', dialCode: '+57' },
    { code: 'CR', name: 'Costa Rica', dialCode: '+506' },
    { code: 'HR', name: 'Croatia', dialCode: '+385' },
    { code: 'CY', name: 'Cyprus', dialCode: '+357' },
    { code: 'CZ', name: 'Czech Republic', dialCode: '+420' },
    { code: 'DK', name: 'Denmark', dialCode: '+45' },
    { code: 'DO', name: 'Dominican Republic', dialCode: '+1' },
    { code: 'EE', name: 'Estonia', dialCode: '+372' },
    { code: 'FI', name: 'Finland', dialCode: '+358' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'GE', name: 'Georgia', dialCode: '+995' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
    { code: 'GR', name: 'Greece', dialCode: '+30' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852' },
    { code: 'HU', name: 'Hungary', dialCode: '+36' },
    { code: 'IS', name: 'Iceland', dialCode: '+354' },
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62' },
    { code: 'IE', name: 'Ireland', dialCode: '+353' },
    { code: 'IL', name: 'Israel', dialCode: '+972' },
    { code: 'IT', name: 'Italy', dialCode: '+39' },
    { code: 'JP', name: 'Japan', dialCode: '+81' },
    { code: 'KE', name: 'Kenya', dialCode: '+254' },
    { code: 'KR', name: 'South Korea', dialCode: '+82' },
    { code: 'LV', name: 'Latvia', dialCode: '+371' },
    { code: 'LT', name: 'Lithuania', dialCode: '+370' },
    { code: 'LU', name: 'Luxembourg', dialCode: '+352' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60' },
    { code: 'MT', name: 'Malta', dialCode: '+356' },
    { code: 'MX', name: 'Mexico', dialCode: '+52' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
    { code: 'NG', name: 'Nigeria', dialCode: '+234' },
    { code: 'NO', name: 'Norway', dialCode: '+47' },
    { code: 'PA', name: 'Panama', dialCode: '+507' },
    { code: 'PE', name: 'Peru', dialCode: '+51' },
    { code: 'PH', name: 'Philippines', dialCode: '+63' },
    { code: 'PL', name: 'Poland', dialCode: '+48' },
    { code: 'PT', name: 'Portugal', dialCode: '+351' },
    { code: 'PR', name: 'Puerto Rico', dialCode: '+1' },
    { code: 'RO', name: 'Romania', dialCode: '+40' },
    { code: 'SG', name: 'Singapore', dialCode: '+65' },
    { code: 'SK', name: 'Slovakia', dialCode: '+421' },
    { code: 'SI', name: 'Slovenia', dialCode: '+386' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27' },
    { code: 'ES', name: 'Spain', dialCode: '+34' },
    { code: 'SE', name: 'Sweden', dialCode: '+46' },
    { code: 'CH', name: 'Switzerland', dialCode: '+41' },
    { code: 'TW', name: 'Taiwan', dialCode: '+886' },
    { code: 'TH', name: 'Thailand', dialCode: '+66' },
    { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'UY', name: 'Uruguay', dialCode: '+598' },
    { code: 'VE', name: 'Venezuela', dialCode: '+58' }
  ];

  // API State Management
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // Fetch phone numbers from Twilio API
  const fetchPhoneNumbers = useCallback(async () => {
    console.log('🔍 fetchPhoneNumbers called with:', { selectedCountry, searchQuery, matchCriteria, numberTypes });
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      const country = selectedCountry.split(' - ')[1] || 'US';
      const options = {
        areaCode: searchQuery && matchCriteria === 'First part of number' ? searchQuery : undefined,
        contains: matchCriteria === 'Contains' ? searchQuery : undefined,
        nearNumber: undefined, // Can be implemented for location-based search
        limit: 50 // Twilio limit
      };

      console.log('📞 Calling twilioAPI.searchAvailableNumbers with:', { country, options });
      
      // Add debug info about API state
      const apiStatus = {
        hasCredentials: !!twilioAPI.accountSid && !!twilioAPI.authToken,
        hasBackend: !!twilioAPI.railwayBaseURL,
        accountSid: twilioAPI.accountSid ? `${twilioAPI.accountSid.substring(0, 10)}...` : 'MISSING',
        authToken: twilioAPI.authToken ? 'PRESENT' : 'MISSING',
        railwayURL: twilioAPI.railwayBaseURL || 'MISSING'
      };
      console.log('🔧 API Status:', apiStatus);
      setDebugInfo(apiStatus);

      // Map our number types to Twilio types
      const typeMapping = {
        local: 'Local',
        mobile: 'Mobile',
        tollFree: 'TollFree'
      };
      
      // Get enabled number types
      const enabledTypes = Object.entries(numberTypes)
        .filter(([key, value]) => value)
        .map(([key]) => typeMapping[key])
        .filter(Boolean);

      if (enabledTypes.length > 0) {
        options.type = enabledTypes;
      }

      const response = await twilioAPI.searchAvailableNumbers(country, options);
      console.log('📈 Raw API response:', response);
      
      if (response.success && response.data) {
        console.log(`✅ Successfully fetched ${response.data.length} phone numbers`);
        // Transform Twilio data to our format
        const transformedNumbers = response.data.map(number => ({
          number: number.phone_number,
          type: number.type || 'Local',
          location: number.locality ? `${number.locality}, ${number.region} ${country}` : country,
          capabilities: {
            voice: number.capabilities?.voice || false,
            sms: number.capabilities?.SMS || false,
            mms: number.capabilities?.MMS || false,
            fax: number.capabilities?.fax || false
          },
          addressRequirement: number.address_requirements?.length > 0 ? 'Local' : 'None',
          monthlyFee: '$1.15', // Default Twilio pricing, could be dynamic
          isBeta: number.beta || false,
          emergencyCapable: number.capabilities?.voice || false
        }));
        
        setPhoneNumbers(transformedNumbers);
        console.log('🎯 Transformed numbers:', transformedNumbers.length);
      } else {
        const errorMsg = response.error || 'Failed to fetch phone numbers';
        console.error('❌ API Error:', errorMsg, response);
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error('💥 Error fetching phone numbers:', err);
      setError(`Failed to load phone numbers: ${err.message}`);
      setPhoneNumbers([]); // Clear existing data on error
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, searchQuery, matchCriteria, numberTypes]);

  // Load initial data
  useEffect(() => {
    // Debug: Log environment variables
    console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
    console.log('REACT_APP_TWILIO_ACCOUNT_SID:', process.env.REACT_APP_TWILIO_ACCOUNT_SID);
    console.log('REACT_APP_TWILIO_AUTH_TOKEN exists:', !!process.env.REACT_APP_TWILIO_AUTH_TOKEN);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('All environment variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_TWILIO')));
    
    fetchPhoneNumbers();
  }, [fetchPhoneNumbers]); // Now uses fetchPhoneNumbers with proper dependencies

  // Search function
  const handleSearch = async () => {
    setIsSearching(true);
    await fetchPhoneNumbers();
    setIsSearching(false);
  };

  const filteredNumbers = useMemo(() => {
    return phoneNumbers.filter(num => {
      // Search filter
      if (searchQuery) {
        const cleanNumber = num.number.replace(/[^\d]/g, '');
        const cleanSearch = searchQuery.replace(/[^\d]/g, '');
        
        if (matchCriteria === 'First part of number') {
          // For US/Canada numbers, skip country code and check area code
          const areaCodeStart = cleanNumber.startsWith('1') ? cleanNumber.substring(1) : cleanNumber;
          if (!areaCodeStart.startsWith(cleanSearch)) {
            return false;
          }
        } else if (matchCriteria === 'Contains' && !cleanNumber.includes(cleanSearch)) {
          return false;
        } else if (matchCriteria === 'Ends with' && !cleanNumber.endsWith(cleanSearch)) {
          return false;
        }
      }

      // Capability filters
      if (selectedCapabilities.voice && !num.capabilities.voice) return false;
      if (selectedCapabilities.sms && !num.capabilities.sms) return false;
      if (selectedCapabilities.mms && !num.capabilities.mms) return false;
      if (selectedCapabilities.fax && !num.capabilities.fax) return false;

      // Number type filters (Advanced)
      if (!numberTypes.local && num.type === 'Local') return false;
      if (!numberTypes.mobile && num.type === 'Mobile') return false;
      if (!numberTypes.tollFree && num.type === 'Toll-free') return false;

      // Address requirement filter (Advanced)
      if (addressRequirement !== 'Any') {
        if (addressRequirement === 'None' && num.addressRequirement !== 'None') return false;
        if (addressRequirement === 'Exclude local requirements' && num.addressRequirement === 'Local') return false;
        if (addressRequirement === 'Exclude foreign requirements' && num.addressRequirement === 'Foreign') return false;
      }

      // Beta numbers filter (Advanced)
      if (excludeBeta && num.isBeta) return false;

      // Emergency calling filter (Advanced)
      if (emergencyOnly && !num.emergencyCapable) return false;

      return true;
    });
  }, [searchQuery, matchCriteria, selectedCapabilities, numberTypes, addressRequirement, excludeBeta, emergencyOnly, phoneNumbers]);

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNumbers = filteredNumbers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredNumbers.length / pageSize);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPhoneNumbers();
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const handleCapabilityChange = (capability) => {
    setSelectedCapabilities(prev => ({
      ...prev,
      [capability]: !prev[capability]
    }));
  };

  const CapabilityIcon = ({ type, enabled }) => {
    const icons = {
      voice: Phone,
      sms: MessageSquare,
      mms: Mail,
      fax: FileText
    };
    const Icon = icons[type];
    return (
      <div className={`p-2 rounded ${enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
        <Icon size={16} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Buy a Phone Number</h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${
                isRefreshing 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm transform hover:scale-105'
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-105">
            Can't find a number?
          </button>
        </div>

        {/* Country Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Select Country</label>
            <div className="relative">
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full max-w-md px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {availableCountries.map((country) => (
                  <option key={country.code} value={`${country.code} (${country.dialCode}) ${country.name} - ${country.code}`} className="text-gray-700 font-medium py-2">
                    {country.code} ({country.dialCode}) {country.name} - {country.code}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Capabilities */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Required Capabilities</label>
            <div className="flex gap-6">
              {[
                { key: 'voice', label: 'Voice', icon: 'voice' },
                { key: 'sms', label: 'SMS', icon: 'sms' },
                { key: 'mms', label: 'MMS', icon: 'mms' },
                { key: 'fax', label: 'Fax', icon: 'fax' }
              ].map(({ key, label, icon }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCapabilities[key]}
                    onChange={() => handleCapabilityChange(key)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Search Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Search criteria</label>
              <div className="relative">
                <select className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  <option className="text-gray-700 font-medium py-2">Number</option>
                  <option className="text-gray-700 font-medium py-2">Area Code</option>
                  <option className="text-gray-700 font-medium py-2">City</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Match to</label>
              <div className="relative">
                <select 
                  value={matchCriteria}
                  onChange={(e) => setMatchCriteria(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option className="text-gray-700 font-medium py-2">First part of number</option>
                  <option className="text-gray-700 font-medium py-2">Contains</option>
                  <option className="text-gray-700 font-medium py-2">Ends with</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by digits or phrases"
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className={`px-4 py-2 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 ${
                  isSearching 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                }`}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCapabilities({ voice: true, sms: true, mms: true, fax: true });
                  setNumberTypes({ local: true, mobile: true, tollFree: true });
                  setAddressRequirement('Any');
                  setExcludeBeta(false);
                  setEmergencyOnly(false);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-gray-700 font-semibold bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                Reset filters
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
            💡 <strong>Search Tip:</strong> Search by area code, prefix, or specific digits you want in your phone number
          </p>

          {/* Advanced Search Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-105"
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
            Advanced Search Options
          </button>

          {/* Advanced Search Section */}
          {showAdvanced && (
            <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
              {/* Number Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Number type</label>
                <div className="flex gap-6">
                  {[
                    { key: 'local', label: 'Local' },
                    { key: 'mobile', label: 'Mobile' },
                    { key: 'tollFree', label: 'Toll-free' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={numberTypes[key]}
                        onChange={(e) => setNumberTypes(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Address Requirements */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Address requirements
                  <span className="ml-2 text-gray-400 cursor-help" title="Some numbers require address verification">ⓘ</span>
                </label>
                <div className="relative">
                  <select 
                    value={addressRequirement}
                    onChange={(e) => setAddressRequirement(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="Any" className="text-gray-700 font-medium py-2">Any</option>
                    <option value="None" className="text-gray-700 font-medium py-2">None</option>
                    <option value="Exclude local requirements" className="text-gray-700 font-medium py-2">Exclude local requirements</option>
                    <option value="Exclude foreign requirements" className="text-gray-700 font-medium py-2">Exclude foreign requirements</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Beta Numbers */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Beta numbers
                  <span className="ml-2 text-gray-400 cursor-help" title="Beta numbers may have limited features">ⓘ</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={excludeBeta}
                    onChange={(e) => setExcludeBeta(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Exclude beta phone numbers in search results.</span>
                </label>
              </div>

              {/* Emergency Calling */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Emergency Calling</label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={emergencyOnly}
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Only include phone numbers capable of emergency calling.</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading phone numbers...</span>
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 mb-2">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Phone Numbers</h3>
              <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
              
              {/* Debug Information */}
              {debugInfo && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 max-w-md w-full text-left">
                  <h4 className="font-medium text-gray-900 mb-2">Debug Information:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Has Credentials: <span className={debugInfo.hasCredentials ? 'text-green-600' : 'text-red-600'}>{debugInfo.hasCredentials ? 'Yes' : 'No'}</span></div>
                    <div>Account SID: <span className="font-mono">{debugInfo.accountSid}</span></div>
                    <div>Auth Token: <span className={debugInfo.authToken === 'PRESENT' ? 'text-green-600' : 'text-red-600'}>{debugInfo.authToken}</span></div>
                    <div>Backend URL: <span className="font-mono text-xs break-all">{debugInfo.railwayURL}</span></div>
                  </div>
                </div>
              )}
              
              <button
                onClick={fetchPhoneNumbers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : phoneNumbers.length === 0 ? (
            /* No Results State */
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-2">
                <Phone className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Phone Numbers Found</h3>
              <p className="text-gray-600 text-center max-w-md">Try adjusting your search criteria or selecting a different country.</p>
            </div>
          ) : (
            /* Results Table */
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capabilities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address Requirement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedNumbers.map((number, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{number.number}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-500">{number.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{number.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <CapabilityIcon type="voice" enabled={number.capabilities.voice} />
                        <CapabilityIcon type="sms" enabled={number.capabilities.sms} />
                        <CapabilityIcon type="mms" enabled={number.capabilities.mms} />
                        <CapabilityIcon type="fax" enabled={number.capabilities.fax} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {number.addressRequirement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {number.monthlyFee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredNumbers.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredNumbers.length)}</span> of{' '}
                  <span className="font-medium">{filteredNumbers.length}</span> results
                </p>
                <div className="ml-4 flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-800">Show:</label>
                  <div className="relative">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 pr-8 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value={10} className="text-gray-700 font-medium">10</option>
                      <option value={20} className="text-gray-700 font-medium">20</option>
                      <option value={50} className="text-gray-700 font-medium">50</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 h-3 w-3 text-gray-500 pointer-events-none" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">per page</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        {filteredNumbers.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>Showing {filteredNumbers.length} available numbers</span>
            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberPurchasePage;