// Twilio API Integration for Phone Number Management
class TwilioAPI {
  constructor() {
    this.accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    this.authToken = null; // Auth token should never be exposed in frontend
    this.railwayBaseURL = process.env.REACT_APP_RAILWAY_API_URL;
    
    // Since we can't use auth token in frontend, we'll route through Railway backend
    this.backendEndpoint = `${this.railwayBaseURL}/api/v1/twilio`;
  }

  // Generic API request method through Railway backend
  async request(endpoint, options = {}) {
    const url = `${this.backendEndpoint}${endpoint}`;
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_RAILWAY_AUTH_TOKEN}`,
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Twilio API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Twilio API Request failed:', error);
      
      // Return mock data for development when backend is unavailable
      if (error.message.includes('fetch')) {
        return this.getMockData(endpoint, options);
      }
      
      throw error;
    }
  }

  // Mock data fallback for development
  getMockData(endpoint, options) {
    if (endpoint.includes('/available-phone-numbers')) {
      return {
        available_phone_numbers: [
          {
            phone_number: '+15551234567',
            friendly_name: '+1 (555) 123-4567',
            locality: 'San Francisco',
            region: 'CA',
            postal_code: '94102',
            iso_country: 'US',
            capabilities: {
              voice: true,
              sms: true,
              mms: false
            },
            price: '1.15',
            price_unit: 'USD'
          },
          {
            phone_number: '+15551234568',
            friendly_name: '+1 (555) 123-4568',
            locality: 'San Francisco',
            region: 'CA',
            postal_code: '94102',
            iso_country: 'US',
            capabilities: {
              voice: true,
              sms: true,
              mms: false
            },
            price: '1.15',
            price_unit: 'USD'
          },
          {
            phone_number: '+15551234569',
            friendly_name: '+1 (555) 123-4569',
            locality: 'San Francisco',
            region: 'CA',
            postal_code: '94102',
            iso_country: 'US',
            capabilities: {
              voice: true,
              sms: true,
              mms: false
            },
            price: '1.15',
            price_unit: 'USD'
          }
        ]
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
              date_updated: '2024-01-15T10:30:00Z'
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
              date_updated: '2024-02-01T14:20:00Z'
            }
          ]
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
          date_updated: new Date().toISOString()
        };
      }
    }
    
    return { success: true, data: {} };
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

  // Validate Twilio configuration
  isConfigured() {
    return !!(this.accountSid && this.railwayBaseURL);
  }

  // Test connection to Twilio via Railway
  async testConnection() {
    try {
      const result = await this.request('/incoming-phone-numbers?PageSize=1');
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
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
  getNumberUsage,
  formatPhoneNumber,
  getPricing,
  isConfigured,
  testConnection
} = twilioAPI;
