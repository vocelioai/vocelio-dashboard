// Twilio API Integration for Phone Number Management
class TwilioAPI {
  constructor() {
    this.accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    this.authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN; // Available for direct API calls
    this.railwayBaseURL = process.env.REACT_APP_API_URL; // Use main API URL
    
    // Debug environment variable loading
    console.log('🔍 TwilioAPI Constructor - Environment Variables:', {
      accountSid: this.accountSid ? `${this.accountSid.substring(0, 10)}...` : 'MISSING',
      authToken: this.authToken ? 'PRESENT' : 'MISSING', 
      apiUrl: this.railwayBaseURL || 'MISSING',
      allEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_TWILIO'))
    });
    
    // Primary: Route through secure backend, Fallback: Direct API for development
    this.backendEndpoint = `${this.railwayBaseURL}/api/v1/twilio`;
    this.directTwilioBase = 'https://api.twilio.com/2010-04-01';
    this.lookupBase = 'https://lookups.twilio.com/v1';
    
    // Enhanced configuration validation
    this.isFullyConfigured = !!(this.accountSid && this.authToken);
    this.hasBackendAccess = !!(this.railwayBaseURL);
  }

  // Generic API request method through Railway backend with direct Twilio fallback
  async request(endpoint, options = {}) {
    console.log('🔍 TwilioAPI Request:', {
      endpoint,
      hasBackendAccess: this.hasBackendAccess,
      isFullyConfigured: this.isFullyConfigured,
      accountSid: this.accountSid ? `${this.accountSid.substring(0, 10)}...` : 'missing',
      authToken: this.authToken ? 'present' : 'missing',
      railwayURL: this.railwayBaseURL
    });
    
    // If we have Twilio credentials, prioritize direct API calls
    if (this.isFullyConfigured) {
      try {
        console.log('� Using direct Twilio API (primary method)...');
        const result = await this.requestDirectTwilio(endpoint, options);
        console.log('✅ Direct Twilio API success:', result);
        return result;
      } catch (error) {
        console.error('❌ Direct Twilio API failed:', error);
        // Continue to try backend as fallback
      }
    }
    
    // Try backend as secondary option
    if (this.hasBackendAccess && process.env.REACT_APP_AUTH_TOKEN) {
      try {
        console.log('� Trying backend as fallback...');
        return await this.requestViaBackend(endpoint, options);
      } catch (error) {
        console.warn('⚠️ Backend also unavailable:', error.message);
      }
    }
    
    // Final fallback to mock data only if both methods fail
    console.warn('🧪 Both Twilio API and backend failed, using mock data');
    return this.getMockData(endpoint, options);
  }
  
  // Backend request method (original secure approach)
  async requestViaBackend(endpoint, options = {}) {
    const url = `${this.backendEndpoint}${endpoint}`;
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
  }
  
  // Direct Twilio API request method  
  async requestDirectTwilio(endpoint, options = {}) {
    if (!this.isFullyConfigured) {
      throw new Error('Twilio credentials not configured for direct API access');
    }
    
    // Convert our generic endpoint to actual Twilio API endpoint
    const twilioEndpoint = this.convertToTwilioEndpoint(endpoint, options);
    const url = `${this.directTwilioBase}/Accounts/${this.accountSid}${twilioEndpoint}`;
    
    // Create basic auth header
    const credentials = btoa(`${this.accountSid}:${this.authToken}`);
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      },
    };

    // Convert JSON body to URL-encoded for Twilio API
    if (options.body && options.method !== 'GET') {
      const formData = new URLSearchParams();
      Object.entries(options.body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      config.body = formData.toString();
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Twilio API Error: ${response.status} - ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  }
  
  // Convert our generic endpoints to actual Twilio API paths
  convertToTwilioEndpoint(endpoint, options = {}) {
    // Handle available numbers search
    if (endpoint.includes('/available-phone-numbers')) {
      const parts = endpoint.split('/available-phone-numbers/');
      if (parts.length > 1) {
        const [country, type] = parts[1].split('/');
        const queryString = endpoint.includes('?') ? endpoint.split('?')[1] : '';
        return `/AvailablePhoneNumbers/${country}/${type}.json?${queryString}`;
      }
    }
    
    // Handle incoming phone numbers
    if (endpoint.includes('/incoming-phone-numbers')) {
      const parts = endpoint.split('/incoming-phone-numbers');
      if (parts.length > 1 && parts[1].startsWith('/')) {
        // Specific number operations
        const numberSid = parts[1].substring(1).split('?')[0];
        return `/IncomingPhoneNumbers/${numberSid}.json`;
      } else {
        // List all numbers
        const queryString = endpoint.includes('?') ? endpoint.split('?')[1] : '';
        return `/IncomingPhoneNumbers.json?${queryString}`;
      }
    }
    
    // Handle usage records
    if (endpoint.includes('/usage/records')) {
      const queryString = endpoint.includes('?') ? endpoint.split('?')[1] : '';
      return `/Usage/Records/Daily.json?${queryString}`;
    }
    
    // Default passthrough
    return endpoint;
  }

  // Enhanced mock data fallback for development with more realistic data
  getMockData(endpoint, options) {
    console.info('🧪 Using Twilio Mock Data - Configure real credentials for live data');
    
    if (endpoint.includes('/available-phone-numbers')) {
      // Extract search parameters from endpoint and options
      const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
      const country = endpoint.split('/available-phone-numbers/')[1]?.split('/')[0] || 'US';
      const numberType = endpoint.split('/').pop()?.split('?')[0] || 'Local';
      const searchedAreaCode = urlParams.get('AreaCode') || options.areaCode;
      const containsPattern = urlParams.get('Contains') || options.contains;
      
      const generateMockNumbers = (count = 20) => {
        const numbers = [];
        
        // Country-specific data
        const countryData = {
          'US': {
            areaCodes: ['415', '212', '310', '713', '404', '206', '617', '303', '512', '214', '408', '646', '323', '281', '678', '307'],
            localities: ['San Francisco', 'New York', 'Los Angeles', 'Houston', 'Atlanta', 'Seattle', 'Boston', 'Denver', 'Austin', 'Dallas', 'San Jose', 'Phoenix', 'Chicago', 'Miami', 'Portland', 'Cheyenne'],
            regions: ['CA', 'NY', 'CA', 'TX', 'GA', 'WA', 'MA', 'CO', 'TX', 'TX', 'CA', 'AZ', 'IL', 'FL', 'OR', 'WY'],
            countryCode: '+1'
          },
          'CA': {
            areaCodes: ['416', '604', '514', '403', '778', '647', '905', '613', '519', '902', '250', '306', '204', '709', '867'],
            localities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Surrey', 'Mississauga', 'Ottawa', 'London', 'Halifax', 'Victoria', 'Saskatoon', 'Winnipeg', 'St. Johns', 'Yellowknife'],
            regions: ['ON', 'BC', 'QC', 'AB', 'BC', 'ON', 'ON', 'ON', 'NS', 'BC', 'SK', 'MB', 'NL', 'NT'],
            countryCode: '+1'
          },
          'GB': {
            areaCodes: ['20', '121', '161', '113', '114', '115', '116', '117', '118', '131', '141', '151', '181', '191', '1534'],
            localities: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Sheffield', 'Nottingham', 'Liverpool', 'Bristol', 'Reading', 'Edinburgh', 'Glasgow', 'Leicester', 'Romford', 'Newcastle', 'Jersey'],
            regions: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Sheffield', 'Nottingham', 'Liverpool', 'Bristol', 'Reading', 'Edinburgh', 'Glasgow', 'Leicester', 'Romford', 'Newcastle', 'Jersey'],
            countryCode: '+44'
          }
        };
        
        const data = countryData[country] || countryData['US'];
        let areaCodesToUse = data.areaCodes;
        
        // Filter by searched area code if specified
        if (searchedAreaCode) {
          areaCodesToUse = [searchedAreaCode];
          // If area code doesn't exist in our data, still generate numbers for it
          if (!data.areaCodes.includes(searchedAreaCode)) {
            console.log(`🔍 Generating mock numbers for area code: ${searchedAreaCode}`);
          }
        }
        
        for (let i = 0; i < count; i++) {
          const areaCode = areaCodesToUse[i % areaCodesToUse.length];
          let phoneNumber;
          
          if (numberType === 'TollFree') {
            const tollFreePrefixes = ['800', '888', '877', '866', '855', '844', '833'];
            const prefix = tollFreePrefixes[i % tollFreePrefixes.length];
            phoneNumber = `${data.countryCode}${prefix}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
          } else {
            // Generate phone number with correct country code
            let number = Math.floor(Math.random() * 1000).toString().padStart(3, '0') + 
                        Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            
            // Apply contains filter if specified
            if (containsPattern) {
              number = containsPattern + number.substring(containsPattern.length);
            }
            
            phoneNumber = `${data.countryCode}${areaCode}${number}`;
          }
          
          // Use appropriate locality/region for the area code if we have specific data
          let locality = data.localities[i % data.localities.length];
          let region = data.regions[i % data.regions.length];
          
          // Special handling for searched area codes
          if (searchedAreaCode === '307') {
            locality = ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs'][i % 5];
            region = 'WY';
          } else if (searchedAreaCode && data.areaCodes.includes(searchedAreaCode)) {
            const areaIndex = data.areaCodes.indexOf(searchedAreaCode);
            locality = data.localities[areaIndex] || locality;
            region = data.regions[areaIndex] || region;
          }
          
          numbers.push({
            phone_number: phoneNumber,
            friendly_name: this.formatPhoneNumber(phoneNumber),
            locality: locality,
            region: region,
            postal_code: country === 'US' ? `${Math.floor(Math.random() * 90000) + 10000}` : 
                        country === 'CA' ? `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}` :
                        `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            iso_country: country,
            capabilities: {
              voice: true,
              sms: numberType !== 'TollFree',
              mms: numberType === 'Mobile'
            },
            price: this.getPricing(country, numberType.toLowerCase()).toString(),
            price_unit: 'USD',
            beta: false,
            lata: Math.floor(Math.random() * 999) + 1,
            rate_center: locality.toUpperCase().replace(' ', '')
          });
        }
        
        return numbers;
      };

      return {
        available_phone_numbers: generateMockNumbers(15),
        uri: `/2010-04-01/Accounts/${this.accountSid}/AvailablePhoneNumbers/${country}/${numberType}.json`,
        mock: true // Mark as mock data for UI detection
      };
    }
    
    if (endpoint.includes('/incoming-phone-numbers')) {
      if (options.method === 'GET') {
        return {
          incoming_phone_numbers: [
            {
              sid: 'PN1234567890abcdef1234567890abcdef',
              phone_number: '+15551234567',
              friendly_name: 'Main Sales Line',
              capabilities: {
                voice: true,
                sms: true,
                mms: false
              },
              status: 'in-use',
              date_created: '2024-01-15T10:30:00Z',
              date_updated: '2024-01-15T10:30:00Z',
              voice_url: process.env.REACT_APP_TWILIO_VOICE_WEBHOOK || '',
              sms_url: process.env.REACT_APP_TWILIO_SMS_WEBHOOK || ''
            },
            {
              sid: 'PN1234567890abcdef1234567890abcde2',
              phone_number: '+18005551234',
              friendly_name: 'Toll-Free Support',
              capabilities: {
                voice: true,
                sms: false,
                mms: false
              },
              status: 'in-use',
              date_created: '2024-02-01T14:20:00Z',
              date_updated: '2024-02-01T14:20:00Z',
              voice_url: process.env.REACT_APP_TWILIO_VOICE_WEBHOOK || '',
              sms_url: ''
            }
          ],
          uri: `/2010-04-01/Accounts/${this.accountSid}/IncomingPhoneNumbers.json`
        };
      }
      
      if (options.method === 'POST') {
        return {
          sid: 'PN' + Math.random().toString(36).substr(2, 32),
          phone_number: options.body.PhoneNumber,
          friendly_name: options.body.FriendlyName || 'New Number',
          capabilities: {
            voice: true,
            sms: true,
            mms: false
          },
          status: 'in-use',
          date_created: new Date().toISOString(),
          date_updated: new Date().toISOString(),
          voice_url: options.body.VoiceUrl || '',
          sms_url: options.body.SmsUrl || ''
        };
      }
    }
    
    return { success: true, data: {}, mock: true };
  }

  // Search for available phone numbers
  async searchAvailableNumbers(country = 'US', options = {}) {
    const params = new URLSearchParams({
      ...options,
      Country: country,
      Limit: options.limit || 10
    });

    if (options.areaCode) {
      params.append('AreaCode', options.areaCode);
    }
    
    if (options.contains) {
      params.append('Contains', options.contains);
    }

    const numberType = options.type || 'Local';
    const endpoint = `/available-phone-numbers/${country}/${numberType}?${params}`;
    
    return this.request(endpoint);
  }

  // Alias for searchAvailableNumbers for compatibility
  async searchNumbers(country = 'US', options = {}) {
    return this.searchAvailableNumbers(country, options);
  }

  // Get owned phone numbers
  async getOwnedNumbers() {
    return this.request('/incoming-phone-numbers');
  }

  // Purchase a phone number
  async purchaseNumber(phoneNumber, options = {}) {
    return this.request('/incoming-phone-numbers', {
      method: 'POST',
      body: {
        PhoneNumber: phoneNumber,
        FriendlyName: options.friendlyName || 'New Number',
        VoiceUrl: options.voiceUrl || '',
        SmsUrl: options.smsUrl || '',
        ...options
      }
    });
  }

  // Update phone number configuration
  async updateNumber(numberSid, options = {}) {
    return this.request(`/incoming-phone-numbers/${numberSid}`, {
      method: 'POST',
      body: options
    });
  }

  // Delete phone number
  async deleteNumber(numberSid) {
    return this.request(`/incoming-phone-numbers/${numberSid}`, {
      method: 'DELETE'
    });
  }

  // Get number usage statistics (through Railway backend)
  async getNumberUsage(numberSid, options = {}) {
    const params = new URLSearchParams({
      StartDate: options.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      EndDate: options.endDate || new Date().toISOString().split('T')[0],
      ...options
    });

    return this.request(`/usage/records/daily?${params}`);
  }

  // Format phone number for display
  formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    
    // Handle US numbers
    if (phoneNumber.startsWith('+1')) {
      const digits = phoneNumber.replace(/\D/g, '').substring(1);
      if (digits.length === 10) {
        return `+1 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
      }
    }
    
    return phoneNumber;
  }

  // Get pricing for country and number type
  getPricing(country = 'US', type = 'local') {
    const pricingMap = {
      'US': { local: 1.15, tollFree: 2.00, mobile: 1.50 },
      'CA': { local: 1.00, tollFree: 2.00, mobile: 1.25 },
      'GB': { local: 1.30, tollFree: 2.50, mobile: 1.80 },
      'AU': { local: 2.00, tollFree: 3.00, mobile: 2.50 },
      'DE': { local: 1.50, tollFree: 2.80, mobile: 2.00 },
      'FR': { local: 1.40, tollFree: 2.60, mobile: 1.90 },
      'ES': { local: 1.20, tollFree: 2.40, mobile: 1.70 },
      'IT': { local: 1.35, tollFree: 2.55, mobile: 1.85 }
    };

    return pricingMap[country]?.[type.toLowerCase()] || 1.15;
  }

  // Enhanced Twilio configuration validation
  isConfigured() {
    return this.isFullyConfigured;
  }
  
  // Get configuration status with details
  getConfigurationStatus() {
    return {
      isConfigured: this.isFullyConfigured,
      hasCredentials: !!(this.accountSid && this.authToken),
      hasBackend: this.hasBackendAccess,
      mode: this.isFullyConfigured ? 'direct' : this.hasBackendAccess ? 'backend' : 'mock',
      accountSid: this.accountSid ? `${this.accountSid.substring(0, 8)}...` : 'missing'
    };
  }

  // Enhanced connection testing with fallback detection
  async testConnection() {
    const status = this.getConfigurationStatus();
    
    try {
      console.log('🔍 Testing connection...');
      const result = await this.request('/incoming-phone-numbers?PageSize=1');
      
      // Determine if we're using real Twilio API or mock data
      const isUsingRealAPI = !result.mock && this.isFullyConfigured;
      const connectionMode = isUsingRealAPI ? 'direct-twilio' : 
                           result.mock ? 'mock' : 'backend';
      
      console.log('📊 Connection test result:', {
        success: true,
        isReal: isUsingRealAPI,
        mode: connectionMode,
        hasData: !!(result.incoming_phone_numbers || result.data)
      });
      
      return { 
        success: true, 
        data: result,
        mode: connectionMode,
        isReal: isUsingRealAPI,
        message: isUsingRealAPI ? 'Connected to Live Twilio API' : 
                result.mock ? 'Using mock data - Twilio API unavailable' : 
                'Connected via backend API'
      };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { 
        success: false, 
        error: error.message,
        mode: 'failed',
        isReal: false,
        message: 'Connection failed - using mock data'
      };
    }
  }
}

// Create and export singleton instance
const twilioAPI = new TwilioAPI();
export default twilioAPI;

// Named exports for specific functions
export const {
  searchAvailableNumbers,
  searchNumbers,
  getOwnedNumbers,
  purchaseNumber,
  updateNumber,
  deleteNumber,
  getNumberUsage,
  formatPhoneNumber,
  getPricing,
  isConfigured,
  testConnection
} = twilioAPI;
