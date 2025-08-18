// Twilio API Integration for Phone Number Management
class TwilioAPI {
  constructor() {
    this.accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    this.authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
    this.phoneNumbersAPI = process.env.REACT_APP_PHONE_NUMBERS_API || 'https://numbers.vocelio.ai';
    this.railwayBaseURL = process.env.REACT_APP_API_GATEWAY || 'https://api.vocelio.ai';
    
    // Debug environment variable loading
    console.log('🔍 TwilioAPI Constructor - Environment Variables:', {
      accountSid: this.accountSid ? `${this.accountSid.substring(0, 10)}...` : 'MISSING',
      authToken: this.authToken ? 'PRESENT' : 'MISSING', 
      phoneNumbersAPI: this.phoneNumbersAPI,
      apiGateway: this.railwayBaseURL,
      allEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
    });
    
    // API configuration - Use vocelio.ai backend services
    this.backendEndpoint = `${this.phoneNumbersAPI}/api/v1`;
    this.directTwilioBase = 'https://api.twilio.com/2010-04-01';
    this.lookupBase = 'https://lookups.twilio.com/v1';
    
    // Configuration validation
    this.isFullyConfigured = !!(this.phoneNumbersAPI || (this.accountSid && this.authToken));
    this.hasBackendAccess = !!(this.phoneNumbersAPI);
    this.hasDirectTwilioAccess = !!(this.accountSid && this.authToken);
    
    console.log('📋 TwilioAPI Configuration:', {
      hasBackendAccess: this.hasBackendAccess,
      hasDirectTwilioAccess: this.hasDirectTwilioAccess,
      isFullyConfigured: this.isFullyConfigured,
      phoneNumbersAPI: this.phoneNumbersAPI ? 'configured' : 'missing',
      accountSid: this.accountSid ? `${this.accountSid.substring(0, 10)}...` : 'missing'
    });
  }

  // Main API request method - Use vocelio.ai backend services
  async request(endpoint, options = {}) {
    console.log('🔍 TwilioAPI Request:', {
      endpoint,
      hasBackendAccess: this.hasBackendAccess,
      phoneNumbersAPI: this.phoneNumbersAPI,
      backendEndpoint: this.backendEndpoint
    });
    
    // Primary: Use vocelio.ai backend services
    if (this.hasBackendAccess) {
      try {
        console.log('🚀 Using vocelio.ai backend services...');
        const result = await this.requestVocelioBackend(endpoint, options);
        
        // Mark backend responses as non-mock
        if (result && typeof result === 'object') {
          result.mock = false;
        }
        
        console.log('✅ Vocelio backend API success:', result);
        return result;
      } catch (error) {
        console.error('❌ Vocelio backend API failed:', error.message);
        // Fall back to direct Twilio if backend fails and we have credentials
        if (this.hasDirectTwilioAccess) {
          console.log('🔄 Falling back to direct Twilio API...');
          try {
            const result = await this.requestDirectTwilio(endpoint, options);
            if (result && typeof result === 'object') {
              result.mock = false;
            }
            console.log('✅ Direct Twilio API fallback success');
            return result;
          } catch (directError) {
            console.error('❌ Direct Twilio API also failed:', directError.message);
          }
        }
        throw error;
      }
    }
    
    // Fallback: Direct Twilio API calls if we have credentials
    if (this.hasDirectTwilioAccess) {
      try {
        console.log('🚀 Using direct Twilio API as fallback...');
        const result = await this.requestDirectTwilio(endpoint, options);
        
        // Mark real API responses as non-mock
        if (result && typeof result === 'object') {
          result.mock = false;
        }
        
        console.log('✅ Direct Twilio API success:', result);
        return result;
      } catch (error) {
        console.error('❌ Direct Twilio API failed:', error.message);
        throw error;
      }
    }
    
    // No backend or credentials available
    throw new Error('Phone numbers service not configured. Please check your configuration.');
  }
  
  // Vocelio backend API request method
  async requestVocelioBackend(endpoint, options = {}) {
    if (!this.phoneNumbersAPI) {
      throw new Error('Phone numbers backend service not configured');
    }
    
    // Map generic endpoints to vocelio backend API structure
    let backendEndpoint = endpoint;
    
    // Map common Twilio endpoints to potential vocelio backend endpoints
    if (endpoint === '/incoming-phone-numbers') {
      // Try multiple potential endpoints for phone numbers
      const potentialEndpoints = [
        '/api/v1/phone-numbers',
        '/api/v1/numbers',
        '/phone-numbers', 
        '/numbers',
        '/api/v1/twilio/numbers',
        '/api/v1/incoming-phone-numbers'
      ];
      
      for (const testEndpoint of potentialEndpoints) {
        try {
          console.log(`🔍 Trying vocelio endpoint: ${testEndpoint}`);
          return await this.makeVocelioRequest(testEndpoint, options);
        } catch (error) {
          console.log(`❌ Endpoint ${testEndpoint} failed: ${error.message}`);
          continue;
        }
      }
      
      throw new Error('No working vocelio backend endpoint found for phone numbers');
    }
    
    return await this.makeVocelioRequest(backendEndpoint, options);
  }
  
  // Make the actual vocelio backend request
  async makeVocelioRequest(endpoint, options = {}) {
    const url = `${this.phoneNumbersAPI}${endpoint}`;
    console.log('🔗 Vocelio Backend API URL:', url);
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Use environment API key if available
        ...(process.env.REACT_APP_VOCELIO_API_KEY && {
          'Authorization': `Bearer ${process.env.REACT_APP_VOCELIO_API_KEY}`
        }),
        ...options.headers,
      },
    };

    // Add JSON body if provided
    if (options.body && options.method !== 'GET') {
      config.body = JSON.stringify(options.body);
    }

    console.log('🚀 Making Vocelio Backend request:', { url, method: config.method });

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Vocelio Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Vocelio Backend API error: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  }
  
  // Direct Twilio API request method  
  async requestDirectTwilio(endpoint, options = {}) {
    if (!this.hasDirectTwilioAccess) {
      throw new Error('Twilio credentials not configured for direct API access');
    }
    
    // Convert our generic endpoint to actual Twilio API endpoint
    const twilioEndpoint = this.convertToTwilioEndpoint(endpoint, options);
    const url = `${this.directTwilioBase}/Accounts/${this.accountSid}${twilioEndpoint}`;
    
    console.log('🔗 Direct Twilio API URL:', url);
    
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

    console.log('🚀 Making Twilio API request:', { url, method: config.method });

    const response = await fetch(url, config);
    
    console.log('📥 Twilio API response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      ok: response.ok
    });
    
    // Get response text first to handle both JSON and XML
    const responseText = await response.text();
    console.log('📄 Response text preview:', responseText.substring(0, 200) + '...');
    
    if (!response.ok) {
      // Try to parse as JSON first, fallback to XML error message
      let errorMessage = response.statusText;
      let userFriendlyMessage = 'Unable to load phone numbers. Please try again.';
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        // If it's XML, extract error message
        if (responseText.includes('<?xml')) {
          const errorMatch = responseText.match(/<Message>(.*?)<\/Message>/);
          if (errorMatch) {
            errorMessage = errorMatch[1];
          }
        }
      }
      
      // Create user-friendly error messages based on status codes
      if (response.status === 404) {
        userFriendlyMessage = 'The requested phone numbers are not available. Please try a different search.';
      } else if (response.status === 401 || response.status === 403) {
        userFriendlyMessage = 'Authentication error. Please check your Twilio configuration.';
      } else if (response.status === 400) {
        userFriendlyMessage = 'Invalid search parameters. Please modify your search and try again.';
      } else if (response.status >= 500) {
        userFriendlyMessage = 'Twilio service is currently unavailable. Please try again later.';
      }
      
      // Log the detailed error for debugging, but throw user-friendly message
      console.error('🚨 Twilio API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        message: errorMessage,
        url: response.url
      });
      
      throw new Error(userFriendlyMessage);
    }
    
    // Parse JSON response
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse Twilio response as JSON:', parseError);
      console.error('📄 Response text:', responseText.substring(0, 500));
      throw new Error('Unable to process phone number data. Please try again.');
    }
  }
  
  // Convert our generic endpoints to actual Twilio API paths
  convertToTwilioEndpoint(endpoint, options = {}) {
    console.log('🔄 Converting endpoint:', endpoint);
    
    // Handle available numbers search
    if (endpoint.includes('/available-phone-numbers')) {
      const parts = endpoint.split('/available-phone-numbers/');
      if (parts.length > 1) {
        const [country, typeAndQuery] = parts[1].split('/', 2);
        const typeQueryParts = typeAndQuery.split('?');
        const type = typeQueryParts[0];
        const queryString = typeQueryParts.length > 1 ? typeQueryParts[1] : '';
        const finalEndpoint = `/AvailablePhoneNumbers/${country}/${type}.json${queryString ? '?' + queryString : ''}`;
        console.log('🔄 Converted available numbers endpoint:', finalEndpoint);
        return finalEndpoint;
      }
    }
    
    // Handle incoming phone numbers
    if (endpoint.includes('/incoming-phone-numbers')) {
      const parts = endpoint.split('/incoming-phone-numbers');
      if (parts.length > 1 && parts[1].startsWith('/')) {
        // Specific number by SID
        const finalEndpoint = `/IncomingPhoneNumbers${parts[1]}.json`;
        console.log('🔄 Converted specific number endpoint:', finalEndpoint);
        return finalEndpoint;
      }
      const finalEndpoint = '/IncomingPhoneNumbers.json';
      console.log('🔄 Converted incoming numbers endpoint:', finalEndpoint);
      return finalEndpoint;
    }
    
    // Default: return as-is with .json extension if not present
    const finalEndpoint = endpoint.endsWith('.json') ? endpoint : `${endpoint}.json`;
    console.log('🔄 Default conversion:', finalEndpoint);
    return finalEndpoint;
  }

  // Search for available phone numbers
  async searchAvailableNumbers(country = 'US', options = {}) {
    console.log('🔍 searchAvailableNumbers called with:', { country, options });
    
    // Extract type from options to avoid passing it as a query parameter
    const { type, limit, ...searchOptions } = options;
    const numberType = type || 'Local';
    
    console.log('🔍 Processing search:', { country, numberType, limit, searchOptions });
    
    // Build query parameters for Twilio API
    const params = new URLSearchParams();
    params.append('Country', country);
    params.append('Limit', limit || 20);
    
    // Add search parameters with proper Twilio API names
    Object.entries(searchOptions).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
        console.log(`🔍 Added search param: ${key} = ${value}`);
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/available-phone-numbers/${country}/${numberType}?${queryString}`;
    console.log('🔍 Built endpoint:', endpoint);
    console.log('🔍 Query parameters:', queryString);
    
    return await this.request(endpoint);
  }

  // Get owned phone numbers
  async getOwnedNumbers() {
    return await this.request('/incoming-phone-numbers');
  }

  // Purchase a phone number
  async purchaseNumber(phoneNumber, options = {}) {
    const body = {
      PhoneNumber: phoneNumber,
      FriendlyName: options.friendlyName || phoneNumber,
      VoiceUrl: options.voiceUrl || process.env.REACT_APP_TWILIO_VOICE_WEBHOOK || '',
      SmsUrl: options.smsUrl || process.env.REACT_APP_TWILIO_SMS_WEBHOOK || '',
      ...options
    };
    
    return await this.request('/incoming-phone-numbers', {
      method: 'POST',
      body
    });
  }

  // Update a phone number
  async updateNumber(numberSid, options = {}) {
    return await this.request(`/incoming-phone-numbers/${numberSid}`, {
      method: 'POST',
      body: options
    });
  }

  // Delete/release a phone number
  async deleteNumber(numberSid) {
    return await this.request(`/incoming-phone-numbers/${numberSid}`, {
      method: 'DELETE'
    });
  }

  // Utility methods
  formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      const number = cleaned.substring(1);
      return `(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6)}`;
    }
    
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    
    return phoneNumber;
  }

  getPricing(country = 'US', numberType = 'local') {
    const pricing = {
      'US': { local: 1.15, mobile: 1.15, tollFree: 2.00 },
      'CA': { local: 1.25, mobile: 1.25, tollFree: 2.00 },
      'GB': { local: 1.50, mobile: 1.50, tollFree: 2.50 }
    };
    
    return pricing[country]?.[numberType] || 1.15;
  }

  // Configuration status
  getConfigurationStatus() {
    return {
      mode: this.isFullyConfigured ? 'direct' : 'unconfigured',
      hasCredentials: this.isFullyConfigured,
      accountSid: this.accountSid ? `${this.accountSid.substring(0, 10)}...` : null,
      isConfigured: this.isFullyConfigured
    };
  }

  // Test connection to Twilio API
  async testConnection() {
    try {
      // Simple API call to test connectivity
      await this.request('/incoming-phone-numbers?PageSize=1');
      
      return {
        success: true,
        mode: 'direct-twilio',
        isReal: true,
        message: 'Connected to Live Twilio API'
      };
    } catch (error) {
      return {
        success: false,
        mode: 'failed',
        isReal: false,
        message: `Connection failed: ${error.message}`
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
  getOwnedNumbers,
  purchaseNumber,
  updateNumber,
  deleteNumber,
  formatPhoneNumber,
  getPricing,
  testConnection
} = twilioAPI;
