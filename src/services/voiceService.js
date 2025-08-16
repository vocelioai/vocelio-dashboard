import { Device } from '@twilio/voice-sdk';

/**
 * Voice Service for managing Twilio Voice SDK integration
 * This service connects to your Railway backend for secure token generation
 */
class VoiceService {
  constructor() {
    this.device = null;
    this.activeCall = null;
    this.isInitialized = false;
    this.isConnected = false;
    this.isMuted = false;
    this.railwayBackendUrl = process.env.REACT_APP_CALL_CENTER_API || 'https://vocelio-dashboard-n856762i7-vocelioais-projects.vercel.app';
    this.listeners = {
      ready: [],
      error: [],
      incoming: [],
      connect: [],
      disconnect: [],
      cancel: [],
      accept: [],
      reject: []
    };
  }

  /**
   * Initialize the Twilio Device with access token from Railway backend
   */
  async initialize() {
    try {
      if (this.isInitialized && this.device && this.device.state === 'ready') {
        console.log('✅ Voice service already initialized and ready');
        return true;
      }

      console.log('🔄 Initializing voice service...');
      console.log('🌐 Backend URL:', this.railwayBackendUrl);
      
      // Get access token from Railway backend
      let token;
      try {
        token = await this.getAccessToken();
        if (!token) {
          throw new Error('No token received from backend');
        }
      } catch (tokenError) {
        console.error('❌ Token retrieval failed:', tokenError);
        throw new Error(`Service unavailable: ${tokenError.message}`);
      }

      console.log('🎯 Creating Twilio Device with token...');

      try {
        // Initialize Twilio Device with proper configuration for outbound calls
        this.device = new Device(token, {
          logLevel: 'debug', // Enable debug logs to see initialization details
          codecPreferences: ['opus', 'pcmu'],
          closeProtection: true,
          enableRingingState: true,
          enableImprovedSignalingErrorPrecision: true,
          // Configure audio properly
          sounds: {
            disconnect: false,
            incoming: false,
            outgoing: false
          },
          // Enable microphone access for outbound calls
          allowIncomingWhileBusy: true
        });
      } catch (deviceError) {
        console.error('❌ Device creation failed:', deviceError);
        throw new Error(`Device initialization failed: ${deviceError.message}`);
      }

      // Set up device event listeners BEFORE registering
      this.setupDeviceListeners();

      console.log('📝 Registering device with Twilio...');
      try {
        // Register the device and wait for it to be ready
        await this.device.register();
      } catch (registerError) {
        console.error('❌ Device registration failed:', registerError);
        throw new Error(`Device registration failed: ${registerError.message}`);
      }
      
      // Wait for device to be ready with improved handling
      console.log('⏳ Checking device state after registration...');
      console.log('📱 Current device state:', this.device.state);
      
      if (this.device.state !== 'ready') {
        console.log('⏳ Waiting for device to be ready...');
        try {
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              console.log('⏰ Device ready timeout - checking final state:', this.device.state);
              // If device is registered but not "ready", it might still work
              if (this.device.state === 'registered') {
                console.log('✅ Device is registered, proceeding anyway');
                resolve();
              } else {
                reject(new Error(`Device failed to become ready within 10 seconds. Final state: ${this.device.state}`));
              }
            }, 10000); // Reduced to 10 seconds
            
      // Double-check current state immediately
            if (this.device.state === 'ready') {
              clearTimeout(timeout);
              console.log('🎉 Device is already ready!');
              this.isConnected = true;
              resolve();
              return;
            }
            
            if (this.device.state === 'registered') {
              // Sometimes device is functional even without "ready" event
              setTimeout(() => {
                if (this.device.state === 'registered') {
                  clearTimeout(timeout);
                  console.log('✅ Device is registered and stable, proceeding');
                  this.isConnected = true;
                  resolve();
                }
              }, 2000); // Give it 2 seconds to transition to ready
            }
            
            this.device.once('ready', () => {
              clearTimeout(timeout);
              console.log('🎉 Device ready event received');
              this.isConnected = true;
              resolve();
            });
            
            this.device.once('error', (error) => {
              clearTimeout(timeout);
              reject(new Error(`Device error: ${error.message}`));
            });
          });
        } catch (readyError) {
          console.error('❌ Device ready issue:', readyError);
          // Don't throw immediately - check if device is still functional
          if (this.device.state === 'registered') {
            console.log('⚠️ Device ready timeout but device is registered - continuing');
          } else {
            throw new Error(`Device not ready: ${readyError.message}`);
          }
        }
      }
      
      // Request microphone permissions explicitly
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('🎤 Microphone access granted');
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
      } catch (micError) {
        console.warn('⚠️ Microphone access denied:', micError);
        // Continue anyway - user might grant permission when making a call
      }
      
      // Initialize audio devices after registration
      try {
        await this.initializeAudioDevices();
      } catch (audioError) {
        console.warn('⚠️ Audio device initialization warning:', audioError);
        // Non-critical, continue
      }
      
      this.isInitialized = true;
      
      console.log('✅ Voice service initialized successfully');
      console.log('📱 Device state:', this.device.state);
      console.log('🔗 Device identity:', this.device.identity);
      console.log('🎤 Device can make outbound calls:', this.device.state === 'ready' || this.device.state === 'registered');
      console.log('🔌 Is connected:', this.isConnected);
      
      return true;

    } catch (error) {
      console.error('❌ Failed to initialize voice service:', error);
      
      // Clean up partially initialized state
      this.isInitialized = false;
      this.isConnected = false;
      if (this.device) {
        try {
          this.device.destroy();
        } catch (destroyError) {
          console.warn('Failed to cleanup device:', destroyError);
        }
        this.device = null;
      }
      
      this.notifyListeners('error', error);
      throw error; // Re-throw to let caller handle
    }
  }

  /**
   * Get access token from Railway backend
   */
  async getAccessToken() {
    try {
      console.log('🔄 Requesting access token from:', `${this.railwayBackendUrl}/api/v1/voice/token`);
      
      const response = await fetch(`${this.railwayBackendUrl}/api/v1/voice/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: 'vocelio_dashboard'
        })
      });

      console.log('📡 Token response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Token request failed:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('🎯 Token response data:', data);
      
      // Handle the response format from your Railway backend
      if (data.success && data.token) {
        console.log('✅ Successfully obtained voice token from Railway backend');
        // Validate token format (should be a JWT)
        if (data.token.split('.').length === 3) {
          console.log('✅ Token appears to be valid JWT format');
          return data.token;
        } else {
          console.warn('⚠️ Token does not appear to be valid JWT format:', data.token.substring(0, 50) + '...');
          return data.token; // Try anyway
        }
      } else {
        console.error('❌ Invalid token response structure:', data);
        throw new Error('Invalid token response from backend');
      }
    } catch (error) {
      console.error('❌ Failed to get access token:', error);
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to voice service backend');
      } else if (error.message.includes('HTTP error')) {
        throw new Error(`Backend error: ${error.message}`);
      } else {
        throw new Error(`Token request failed: ${error.message}`);
      }
    }
  }

  /**
   * Initialize audio devices safely
   */
  async initializeAudioDevices() {
    try {
      if (!this.device) return;

      // Get available audio devices
      const devices = await this.device.audio.availableOutputDevices.get();
      
      if (devices.size > 0) {
        // Use the first available device or browser default
        const deviceMap = Array.from(devices.values());
        const defaultDevice = deviceMap.find(device => device.deviceId === 'default') || deviceMap[0];
        
        if (defaultDevice) {
          await this.device.audio.speakerDevices.set(defaultDevice.deviceId);
          console.log('✅ Audio output device set successfully:', defaultDevice.label || 'Default');
        }
      } else {
        console.log('ℹ️ No specific audio devices found, using browser default');
      }

      // Set reasonable volume levels
      this.device.audio.incoming(true);
      this.device.audio.outgoing(true);
      
    } catch (error) {
      // Silently handle audio device errors - they're not critical
      console.log('ℹ️ Audio device setup completed with browser defaults');
    }
  }

  /**
   * Generate fallback token when Railway backend is unavailable
   */
  async generateFallbackToken() {
    try {
      // This is a temporary fallback using your direct Twilio credentials
      const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
      const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
      
      if (!accountSid || !authToken) {
        throw new Error('Twilio credentials not found in environment variables');
      }

      console.log('🎯 Generating fallback voice token...');
      
      // For testing purposes, return a mock token structure
      // In production, this should be generated by your backend
      const identity = `user_${Date.now()}`;
      
      // Mock token for testing - replace with actual Twilio token generation
      return `mock_token_${Date.now()}_${identity}`;
    } catch (error) {
      console.error('Failed to generate fallback token:', error);
      return null;
    }
  }

  /**
   * Set up device event listeners
   */
  setupDeviceListeners() {
    if (!this.device) return;

    // Device ready
    this.device.on('ready', async () => {
      console.log('Twilio Device is ready for use');
      this.isConnected = true;
      
      // Ensure audio devices are properly set up
      try {
        if (this.device.audio && this.device.audio.availableOutputDevices) {
          const devices = await this.device.audio.availableOutputDevices.get();
          if (devices.size === 0) {
            console.log('ℹ️ Using browser default audio devices');
          }
        }
      } catch (error) {
        // Audio device check is non-critical
        console.log('ℹ️ Audio device check completed');
      }
      
      this.notifyListeners('ready');
    });

    // Device registered (backup for when ready event doesn't fire)
    this.device.on('registered', () => {
      console.log('Twilio Device is registered');
      // Set connection state if not already set
      if (!this.isConnected) {
        setTimeout(() => {
          if (this.device.state === 'registered' && !this.isConnected) {
            console.log('✅ Setting connection state from registered event');
            this.isConnected = true;
          }
        }, 3000); // Wait 3 seconds for potential ready event
      }
    });

    // Device error
    this.device.on('error', (error) => {
      console.error('Twilio Device error:', error);
      this.notifyListeners('error', error);
    });

    // Incoming call
    this.device.on('incoming', (call) => {
      console.log('Incoming call from:', call.parameters.From);
      this.activeCall = call;
      this.setupCallListeners(call);
      this.notifyListeners('incoming', call);
    });

    // Device offline
    this.device.on('offline', () => {
      console.log('Twilio Device is offline');
      this.isConnected = false;
    });

    // Token will expire
    this.device.on('tokenWillExpire', async () => {
      console.log('Token will expire, refreshing...');
      try {
        const newToken = await this.getAccessToken();
        if (newToken) {
          await this.device.updateToken(newToken);
          console.log('Token updated successfully');
        }
      } catch (error) {
        console.error('Failed to update token:', error);
      }
    });
  }

  /**
   * Set up call event listeners
   */
  setupCallListeners(call) {
    call.on('accept', () => {
      console.log('Call accepted');
      this.notifyListeners('accept', call);
    });

    call.on('disconnect', () => {
      console.log('Call ended');
      this.activeCall = null;
      this.notifyListeners('disconnect', call);
    });

    call.on('cancel', () => {
      console.log('Call cancelled');
      this.activeCall = null;
      this.notifyListeners('cancel', call);
    });

    call.on('reject', () => {
      console.log('Call rejected');
      this.activeCall = null;
      this.notifyListeners('reject', call);
    });

    call.on('error', (error) => {
      console.error('Call error:', error);
      this.notifyListeners('error', error);
    });
  }

  /**
   * Make an outbound call
   */
  async makeCall(phoneNumber, params = {}) {
    try {
      console.log('🔄 Attempting to make call to:', phoneNumber);
      console.log('🔍 Device state check:');
      console.log('  - Device exists:', !!this.device);
      console.log('  - Is initialized:', this.isInitialized);
      console.log('  - Is connected:', this.isConnected);
      
      // First check if device exists
      if (!this.device) {
        console.error('❌ Device not initialized');
        throw new Error('Voice device not initialized. Please refresh the page.');
      }

      // Check device state more thoroughly
      const deviceState = this.device.state;
      console.log('  - Device state:', deviceState);
      
      // Accept both 'ready' and 'registered' states for calls
      if (!this.isConnected || (deviceState !== 'ready' && deviceState !== 'registered')) {
        console.log('⏳ Device not ready, attempting to initialize...');
        
        // Try to wait for device to be ready (max 5 seconds)
        const readyPromise = new Promise((resolve, reject) => {
          if (deviceState === 'ready') {
            resolve();
            return;
          }
          
          const timeout = setTimeout(() => {
            reject(new Error('Device failed to become ready within 5 seconds'));
          }, 5000);
          
          this.device.once('ready', () => {
            clearTimeout(timeout);
            this.isConnected = true;
            resolve();
          });
          
          this.device.once('error', (error) => {
            clearTimeout(timeout);
            reject(error);
          });
        });
        
        try {
          await readyPromise;
          console.log('✅ Device is now ready for calls');
        } catch (waitError) {
          console.error('❌ Device failed to become ready:', waitError);
          throw new Error(`Device not ready: ${waitError.message}`);
        }
      }

      console.log('📞 Making call to:', phoneNumber);
      
      const call = await this.device.connect({
        params: {
          To: phoneNumber,
          ...params
        }
      });

      this.activeCall = call;
      this.setupCallListeners(call);
      this.notifyListeners('connect', call);
      
      console.log('✅ Call initiated successfully');
      return call;

    } catch (error) {
      console.error('❌ Failed to make call:', error);
      this.notifyListeners('error', error);
      throw error;
    }
  }

  /**
   * Answer incoming call
   */
  answerCall() {
    if (this.activeCall) {
      this.activeCall.accept();
      return true;
    }
    return false;
  }

  /**
   * Reject incoming call
   */
  rejectCall() {
    if (this.activeCall) {
      this.activeCall.reject();
      return true;
    }
    return false;
  }

  /**
   * Hang up active call
   */
  hangUp() {
    if (this.activeCall) {
      this.activeCall.disconnect();
      return true;
    }
    return false;
  }

  /**
   * Mute/unmute the call
   */
  toggleMute() {
    if (this.activeCall) {
      this.isMuted = !this.isMuted;
      this.activeCall.mute(this.isMuted);
      return this.isMuted;
    }
    return false;
  }

  /**
   * Send DTMF tones
   */
  sendDigits(digits) {
    if (this.activeCall) {
      this.activeCall.sendDigits(digits);
      return true;
    }
    return false;
  }

  /**
   * Get call statistics
   */
  getCallStats() {
    if (this.activeCall) {
      return this.activeCall.getRemoteStream()?.getAudioTracks()?.[0]?.getStats();
    }
    return null;
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback);
      if (index > -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }

  /**
   * Notify all listeners of an event
   */
  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Get device status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isConnected: this.isConnected,
      hasActiveCall: !!this.activeCall,
      isMuted: this.isMuted,
      deviceState: this.device?.state || 'offline'
    };
  }

  /**
   * Destroy the device and cleanup
   */
  destroy() {
    if (this.activeCall) {
      this.activeCall.disconnect();
    }
    
    if (this.device) {
      this.device.destroy();
    }

    this.device = null;
    this.activeCall = null;
    this.isInitialized = false;
    this.isConnected = false;
    this.listeners = {
      ready: [],
      error: [],
      incoming: [],
      connect: [],
      disconnect: [],
      cancel: [],
      accept: [],
      reject: []
    };
  }
}

// Create singleton instance
const voiceService = new VoiceService();

export default voiceService;
