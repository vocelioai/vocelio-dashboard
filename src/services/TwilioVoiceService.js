// Twilio Voice Service - Real calling integration for CallCenter
import { Device } from '@twilio/voice-sdk';

class TwilioVoiceService {
  constructor() {
    this.device = null;
    this.activeCall = null;
    this.isInitialized = false;
    this.token = null;
    this.identity = `user_${Date.now()}`;
    
    // Get configuration from environment
    this.config = {
      accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID,
      authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.REACT_APP_TWILIO_PHONE_NUMBER,
      apiUrl: process.env.REACT_APP_CALL_CENTER_API || 'https://call.vocelio.ai',
      voiceWebhook: process.env.REACT_APP_TWILIO_VOICE_WEBHOOK || 'https://call.vocelio.ai/api/v1/twilio/voice'
    };
    
    console.log('🎯 TwilioVoiceService initialized:', {
      hasCredentials: !!(this.config.accountSid && this.config.authToken),
      apiUrl: this.config.apiUrl,
      phoneNumber: this.config.phoneNumber
    });
    
    // Event handlers
    this.onCallStatusChange = null;
    this.onCallConnected = null;
    this.onCallDisconnected = null;
    this.onIncomingCall = null;
    this.onError = null;
  }

  /**
   * Initialize Twilio Device with access token
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Twilio Voice Service...');
      
      // Get access token from backend
      await this.getAccessToken();
      
      // Create and configure Twilio Device
      this.device = new Device(this.token, {
        logLevel: 1, // Error level logging
        codecPreferences: ['opus', 'pcmu'],
        fakeLocalDTMF: true,
        enableRingingState: true
      });
      
      // Set up device event listeners
      this.setupDeviceListeners();
      
      // Register the device
      await this.device.register();
      
      this.isInitialized = true;
      console.log('✅ Twilio Device initialized and registered successfully');
      
      return { success: true, message: 'Voice service initialized' };
      
    } catch (error) {
      console.error('❌ Failed to initialize Twilio Voice Service:', error);
      this.onError && this.onError('Failed to initialize voice service: ' + error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get access token from backend
   */
  async getAccessToken() {
    try {
      console.log('🔑 Getting Twilio access token...');
      
      const response = await fetch(`${this.config.apiUrl}/api/v1/voice/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: this.identity
        })
      });
      
      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success || !data.token) {
        throw new Error(data.message || 'Failed to get access token');
      }
      
      this.token = data.token;
      console.log('✅ Access token obtained successfully');
      
      return data.token;
      
    } catch (error) {
      console.error('❌ Failed to get access token:', error);
      throw error;
    }
  }

  /**
   * Refresh access token and update device
   */
  async refreshAccessToken() {
    try {
      console.log('🔄 Refreshing Twilio access token...');
      
      // Get new token
      await this.getAccessToken();
      
      // Update device with new token
      if (this.device && this.token) {
        await this.device.updateToken(this.token);
        console.log('✅ Access token refreshed and device updated');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Failed to refresh access token:', error);
      throw error;
    }
  }

  /**
   * Handle token expiration and retry operation
   */
  async handleTokenExpiration(operation, ...args) {
    try {
      console.log('🔄 Token expired, attempting to refresh...');
      await this.refreshAccessToken();
      
      // Retry the original operation
      return await operation.apply(this, args);
    } catch (error) {
      console.error('❌ Failed to handle token expiration:', error);
      throw error;
    }
  }

  /**
   * Set up Twilio Device event listeners
   */
  setupDeviceListeners() {
    if (!this.device) return;

    // Device ready
    this.device.on('registered', () => {
      console.log('📱 Twilio Device registered and ready for calls');
    });

    // Device error
    this.device.on('error', async (error) => {
      console.error('📱 Twilio Device error:', error);
      
      // Handle token expiration errors
      if (error.code === 20104 || error.message.includes('AccessTokenExpired')) {
        console.log('🔄 Handling access token expiration...');
        try {
          await this.refreshAccessToken();
          console.log('✅ Token refreshed successfully, device should recover');
        } catch (refreshError) {
          console.error('❌ Failed to refresh expired token:', refreshError);
          this.onError && this.onError(`Token refresh failed: ${refreshError.message}`);
        }
      } else {
        this.onError && this.onError(`Device error: ${error.message}`);
      }
    });

    // Incoming call
    this.device.on('incoming', (call) => {
      console.log('📞 Incoming call received:', call.parameters);
      this.activeCall = call;
      this.setupCallListeners(call);
      this.onIncomingCall && this.onIncomingCall(call);
    });

    // Device disconnect
    this.device.on('unregistered', () => {
      console.log('📱 Twilio Device unregistered');
    });
  }

  /**
   * Set up individual call event listeners
   */
  setupCallListeners(call) {
    if (!call) return;

    call.on('accept', () => {
      console.log('📞 Call accepted');
      this.onCallConnected && this.onCallConnected(call);
      this.onCallStatusChange && this.onCallStatusChange('connected', call);
    });

    call.on('disconnect', () => {
      console.log('📞 Call disconnected');
      this.activeCall = null;
      this.onCallDisconnected && this.onCallDisconnected(call);
      this.onCallStatusChange && this.onCallStatusChange('disconnected', call);
    });

    call.on('cancel', () => {
      console.log('📞 Call cancelled');
      this.activeCall = null;
      this.onCallStatusChange && this.onCallStatusChange('cancelled', call);
    });

    call.on('reject', () => {
      console.log('📞 Call rejected');
      this.activeCall = null;
      this.onCallStatusChange && this.onCallStatusChange('rejected', call);
    });

    call.on('error', (error) => {
      console.error('📞 Call error:', error);
      this.activeCall = null;
      this.onError && this.onError(`Call error: ${error.message}`);
      this.onCallStatusChange && this.onCallStatusChange('error', call);
    });

    // Call quality and volume events
    call.on('volume', (inputVolume, outputVolume) => {
      // Update volume levels in UI if needed
    });

    call.on('warning', (name, data) => {
      console.warn('📞 Call warning:', name, data);
    });
  }

  /**
   * Make an outbound call
   */
  async makeCall(phoneNumber, options = {}) {
    try {
      if (!this.isInitialized || !this.device) {
        throw new Error('Voice service not initialized');
      }

      if (this.activeCall) {
        throw new Error('Another call is already in progress');
      }

      console.log('📞 Making outbound call to:', phoneNumber);

      // Prepare call parameters
      const callParams = {
        To: phoneNumber,
        From: this.config.phoneNumber,
        ...options
      };

      // Make the call
      const call = await this.device.connect(callParams);
      this.activeCall = call;
      this.setupCallListeners(call);

      console.log('📞 Outbound call initiated');
      this.onCallStatusChange && this.onCallStatusChange('connecting', call);

      return {
        success: true,
        call: call,
        callSid: call.parameters.CallSid
      };

    } catch (error) {
      console.error('❌ Failed to make call:', error);
      
      // Handle token expiration during call attempt
      if (error.code === 20104 || error.message.includes('AccessTokenExpired')) {
        console.log('🔄 Call failed due to expired token, attempting refresh...');
        try {
          await this.refreshAccessToken();
          console.log('🔄 Token refreshed, retrying call...');
          return await this.makeCall(phoneNumber, options);
        } catch (refreshError) {
          console.error('❌ Failed to refresh token and retry call:', refreshError);
          this.onError && this.onError(`Call failed and token refresh failed: ${refreshError.message}`);
          return { success: false, error: refreshError.message };
        }
      }
      
      this.onError && this.onError(`Failed to make call: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Accept an incoming call
   */
  async acceptCall() {
    try {
      if (!this.activeCall) {
        throw new Error('No incoming call to accept');
      }

      console.log('📞 Accepting incoming call');
      await this.activeCall.accept();
      
      return { success: true };

    } catch (error) {
      console.error('❌ Failed to accept call:', error);
      this.onError && this.onError(`Failed to accept call: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reject an incoming call
   */
  async rejectCall() {
    try {
      if (!this.activeCall) {
        throw new Error('No incoming call to reject');
      }

      console.log('📞 Rejecting incoming call');
      this.activeCall.reject();
      this.activeCall = null;
      
      return { success: true };

    } catch (error) {
      console.error('❌ Failed to reject call:', error);
      this.onError && this.onError(`Failed to reject call: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * End the current call
   */
  async endCall() {
    try {
      if (!this.activeCall) {
        throw new Error('No active call to end');
      }

      console.log('📞 Ending current call');
      this.activeCall.disconnect();
      
      return { success: true };

    } catch (error) {
      console.error('❌ Failed to end call:', error);
      this.onError && this.onError(`Failed to end call: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mute/unmute the call
   */
  async toggleMute() {
    try {
      if (!this.activeCall) {
        throw new Error('No active call to mute/unmute');
      }

      const isMuted = this.activeCall.isMuted();
      this.activeCall.mute(!isMuted);
      
      console.log(`📞 Call ${!isMuted ? 'muted' : 'unmuted'}`);
      
      return { 
        success: true, 
        muted: !isMuted 
      };

    } catch (error) {
      console.error('❌ Failed to toggle mute:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send DTMF tones
   */
  async sendDTMF(tone) {
    try {
      if (!this.activeCall) {
        throw new Error('No active call to send DTMF');
      }

      this.activeCall.sendDigits(tone);
      console.log('📞 DTMF tone sent:', tone);
      
      return { success: true };

    } catch (error) {
      console.error('❌ Failed to send DTMF:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get call status
   */
  getCallStatus() {
    if (!this.activeCall) {
      return { active: false, status: 'idle' };
    }

    return {
      active: true,
      status: this.activeCall.status(),
      direction: this.activeCall.direction,
      from: this.activeCall.parameters.From,
      to: this.activeCall.parameters.To,
      callSid: this.activeCall.parameters.CallSid,
      muted: this.activeCall.isMuted()
    };
  }

  /**
   * Check if service is ready
   */
  isReady() {
    return this.isInitialized && this.device && this.device.state === 'Registered';
  }

  /**
   * Get device state
   */
  getDeviceState() {
    if (!this.device) return 'Uninitialized';
    return this.device.state;
  }

  /**
   * Destroy the service and cleanup
   */
  async destroy() {
    try {
      console.log('🔄 Destroying Twilio Voice Service...');
      
      // End any active calls
      if (this.activeCall) {
        this.activeCall.disconnect();
        this.activeCall = null;
      }

      // Unregister and destroy device
      if (this.device) {
        this.device.removeAllListeners();
        if (this.device.state !== 'Destroyed') {
          this.device.unregister();
          this.device.destroy();
        }
        this.device = null;
      }

      this.isInitialized = false;
      console.log('✅ Twilio Voice Service destroyed');

    } catch (error) {
      console.error('❌ Error destroying voice service:', error);
    }
  }

  /**
   * Set event handlers
   */
  setEventHandlers(handlers) {
    this.onCallStatusChange = handlers.onCallStatusChange;
    this.onCallConnected = handlers.onCallConnected;
    this.onCallDisconnected = handlers.onCallDisconnected;
    this.onIncomingCall = handlers.onIncomingCall;
    this.onError = handlers.onError;
  }
}

// Create singleton instance
const twilioVoiceService = new TwilioVoiceService();

export default twilioVoiceService;
