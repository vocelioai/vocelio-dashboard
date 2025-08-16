// Real Twilio API Integration for Phone Number Management

class RealTwilioAPI {
  constructor() {
    this.accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    this.authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
    
    // Twilio REST API endpoints
    this.baseURL = 'https://api.twilio.com/2010-04-01';
    
    // Configuration validation
    this.isConfigured = !!(this.accountSid && this.authToken);
    
    if (!this.isConfigured) {
      console.warn('⚠️ Twilio credentials not configured. Add REACT_APP_TWILIO_ACCOUNT_SID and REACT_APP_TWILIO_AUTH_TOKEN to environment variables.');
    } else {
      console.log('✅ Real Twilio API configured');
    }
  }

  // Create authorization header
  getAuthHeader() {
    if (!this.isConfigured) {
      throw new Error('Twilio credentials not configured');
    }
    const credentials = btoa(`${this.accountSid}:${this.authToken}`);
    return `Basic ${credentials}`;
  }

  // Make authenticated request to Twilio API
  async makeRequest(endpoint, method = 'GET', data = null) {
    const url = `${this.baseURL}/Accounts/${this.accountSid}${endpoint}`;
    
    const config = {
      method,
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    if (data && method !== 'GET') {
      const formData = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      config.body = formData.toString();
    }

    console.log(`📞 Twilio API ${method}:`, url);
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Twilio API Error: ${response.status} - ${errorData.message || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Twilio API Request Failed:', error);
      throw error;
    }
  }

  // Search for available phone numbers
  async searchAvailableNumbers(country = 'US', type = 'Local', options = {}) {
    if (!this.isConfigured) {
      throw new Error('Twilio credentials not configured. Please set REACT_APP_TWILIO_ACCOUNT_SID and REACT_APP_TWILIO_AUTH_TOKEN.');
    }

    const queryParams = new URLSearchParams();
    
    // Add search parameters
    if (options.areaCode) queryParams.append('AreaCode', options.areaCode);
    if (options.contains) queryParams.append('Contains', options.contains);
    if (options.smsEnabled !== undefined) queryParams.append('SmsEnabled', options.smsEnabled);
    if (options.voiceEnabled !== undefined) queryParams.append('VoiceEnabled', options.voiceEnabled);
    if (options.mmsEnabled !== undefined) queryParams.append('MmsEnabled', options.mmsEnabled);
    if (options.limit) queryParams.append('PageSize', options.limit);

    const endpoint = `/AvailablePhoneNumbers/${country}/${type}.json?${queryParams.toString()}`;
    
    try {
      const response = await this.makeRequest(endpoint);
      return {
        available_phone_numbers: response.available_phone_numbers || [],
        total: response.available_phone_numbers?.length || 0
      };
    } catch (error) {
      console.error('Failed to search available numbers:', error);
      throw error;
    }
  }

  // Get owned/purchased phone numbers
  async getOwnedNumbers() {
    if (!this.isConfigured) {
      throw new Error('Twilio credentials not configured');
    }

    try {
      const response = await this.makeRequest('/IncomingPhoneNumbers.json');
      return {
        incoming_phone_numbers: response.incoming_phone_numbers || [],
        total: response.incoming_phone_numbers?.length || 0
      };
    } catch (error) {
      console.error('Failed to get owned numbers:', error);
      throw error;
    }
  }

  // Purchase a phone number
  async purchaseNumber(phoneNumber, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Twilio credentials not configured');
    }

    const data = {
      PhoneNumber: phoneNumber,
      ...options
    };

    // Optional configuration
    if (options.friendlyName) data.FriendlyName = options.friendlyName;
    if (options.voiceUrl) data.VoiceUrl = options.voiceUrl;
    if (options.smsUrl) data.SmsUrl = options.smsUrl;
    if (options.voiceMethod) data.VoiceMethod = options.voiceMethod;
    if (options.smsMethod) data.SmsMethod = options.smsMethod;

    try {
      const response = await this.makeRequest('/IncomingPhoneNumbers.json', 'POST', data);
      console.log('✅ Phone number purchased successfully:', phoneNumber);
      return response;
    } catch (error) {
      console.error('Failed to purchase number:', error);
      throw error;
    }
  }

  // Update phone number configuration
  async updateNumber(numberSid, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Twilio credentials not configured');
    }

    try {
      const response = await this.makeRequest(`/IncomingPhoneNumbers/${numberSid}.json`, 'POST', options);
      console.log('✅ Phone number updated successfully:', numberSid);
      return response;
    } catch (error) {
      console.error('Failed to update number:', error);
      throw error;
    }
  }

  // Release/delete a phone number
  async releaseNumber(numberSid) {
    if (!this.isConfigured) {
      throw new Error('Twilio credentials not configured');
    }

    try {
      await this.makeRequest(`/IncomingPhoneNumbers/${numberSid}.json`, 'DELETE');
      console.log('✅ Phone number released successfully:', numberSid);
      return { success: true, message: 'Number released successfully' };
    } catch (error) {
      console.error('Failed to release number:', error);
      throw error;
    }
  }

  // Get phone number details
  async getNumberDetails(numberSid) {
    if (!this.isConfigured) {
      throw new Error('Twilio credentials not configured');
    }

    try {
      const response = await this.makeRequest(`/IncomingPhoneNumbers/${numberSid}.json`);
      return response;
    } catch (error) {
      console.error('Failed to get number details:', error);
      throw error;
    }
  }

  // Get account balance and usage
  async getAccountInfo() {
    if (!this.isConfigured) {
      throw new Error('Twilio credentials not configured');
    }

    try {
      const response = await this.makeRequest('.json');
      return {
        balance: response.balance,
        status: response.status,
        type: response.type,
        date_created: response.date_created,
        date_updated: response.date_updated
      };
    } catch (error) {
      console.error('Failed to get account info:', error);
      throw error;
    }
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  // Format phone number for display
  formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    
    // Remove any existing formatting
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format US/Canada numbers
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // For other countries, just add + if missing
    if (!phoneNumber.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return phoneNumber;
  }
}

// Export singleton instance
const realTwilioAPI = new RealTwilioAPI();
export default realTwilioAPI;
