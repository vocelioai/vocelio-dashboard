import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Minimize2, Maximize2, X } from 'lucide-react';
import voiceService from '../services/voiceService';

const VoiceCallingWidget = ({ 
  onCallStatusChange, 
  customerData, 
  isMinimized = false, 
  onMinimize, 
  onMaximize,
  onClose 
}) => {
  console.log('🚀 VoiceCallingWidget component rendered!', { isMinimized, onClose });
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, connected, failed
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Timer for call duration
  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Initialize voice service
  useEffect(() => {
    const initializeVoiceService = async () => {
      try {
        console.log('🚀 VoiceCallingWidget: Initializing voice service...');
        setIsInitializing(true);
        setError(null);
        
        const initialized = await voiceService.initialize();
        if (!initialized) {
          throw new Error('Voice service initialization returned false');
        }
        
        console.log('✅ VoiceCallingWidget: Voice service initialized successfully');
        
        // Set up voice service listeners
        voiceService.on('ready', () => {
          console.log('🎉 VoiceCallingWidget: Voice service ready event');
          setIsInitializing(false);
          setCallStatus('idle');
        });

        voiceService.on('connect', (call) => {
          console.log('📞 VoiceCallingWidget: Call connected');
          setCallStatus('connected');
          setCallDuration(0);
        });

        voiceService.on('disconnect', () => {
          console.log('📴 VoiceCallingWidget: Call disconnected');
          setCallStatus('idle');
          setCallDuration(0);
        });

        voiceService.on('error', (error) => {
          console.error('❌ VoiceCallingWidget: Voice service error:', error);
          setError(error.message || 'Voice service error');
          setCallStatus('failed');
        });

        setIsInitializing(false);
      } catch (err) {
        console.error('❌ VoiceCallingWidget: Failed to initialize voice service:', err);
        setError(err.message || 'Failed to initialize voice service');
        setIsInitializing(false);
      }
    };

    initializeVoiceService();
  }, []);

  // Notify parent of status changes
  useEffect(() => {
    if (onCallStatusChange) {
      onCallStatusChange({
        status: callStatus,
        phoneNumber,
        duration: callDuration,
        isMuted,
        error
      });
    }
  }, [callStatus, phoneNumber, callDuration, isMuted, error, onCallStatusChange]);

  const handleCall = async () => {
    console.log('🎯 Make Call button clicked!');
    console.log('📞 Phone number:', phoneNumber);
    console.log('🔍 Voice service state:', {
      isInitialized: voiceService.isInitialized,
      isConnected: voiceService.isConnected,
      deviceExists: !!voiceService.device,
      deviceState: voiceService.device?.state
    });
    
    if (!phoneNumber.trim()) {
      console.log('❌ No phone number entered');
      setError('Please enter a phone number');
      return;
    }

    // Check if voice service is properly initialized
    if (!voiceService.isInitialized) {
      console.log('⚠️ Voice service not initialized, attempting to initialize...');
      setError('Initializing voice service...');
      setIsInitializing(true);
      
      try {
        const initialized = await voiceService.initialize();
        if (!initialized) {
          throw new Error('Voice service initialization failed');
        }
        console.log('✅ Voice service initialized successfully');
        setIsInitializing(false);
        setError(null);
      } catch (initError) {
        console.error('❌ Voice service initialization failed:', initError);
        setError(`Initialization failed: ${initError.message}`);
        setIsInitializing(false);
        return;
      }
    }

    // Double-check device state - accept both 'ready' and 'registered'
    const deviceState = voiceService.device?.state;
    if (!voiceService.device || (deviceState !== 'ready' && deviceState !== 'registered')) {
      console.log('⚠️ Device not ready, current state:', deviceState);
      setError(`Device not ready for calls. Current state: ${deviceState}. Please try again.`);
      return;
    }

    console.log('✅ Device is ready for calls. State:', deviceState);

    try {
      console.log('🔄 Starting call process...');
      setCallStatus('connecting');
      setError(null);
      
      const success = await voiceService.makeCall(phoneNumber);
      console.log('📞 Call result:', success);
      if (!success) {
        throw new Error('Failed to initiate call');
      }
    } catch (err) {
      console.error('❌ Call failed:', err);
      setError(err.message || 'Call failed');
      setCallStatus('failed');
      
      // Reset to idle after showing error
      setTimeout(() => {
        setCallStatus('idle');
      }, 3000);
    }
  };

  const handleHangup = async () => {
    try {
      await voiceService.hangup();
      setCallStatus('idle');
    } catch (err) {
      console.error('Hangup failed:', err);
      setError(err.message || 'Failed to end call');
    }
  };

  const handleMuteToggle = async () => {
    try {
      const newMutedState = !isMuted;
      await voiceService.mute(newMutedState);
      setIsMuted(newMutedState);
    } catch (err) {
      console.error('Mute toggle failed:', err);
      setError(err.message || 'Failed to toggle mute');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusText = () => {
    if (isInitializing) return 'Initializing voice service...';
    switch (callStatus) {
      case 'connecting': return 'Connecting...';
      case 'connected': return `Connected - ${formatDuration(callDuration)}`;
      case 'failed': return 'Call failed';
      default: return voiceService.isInitialized ? 'Ready' : 'Service unavailable';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-slate-800 rounded-lg p-3 shadow-lg border border-slate-700 z-50">
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white">{getStatusText()}</span>
          <button
            onClick={onMaximize}
            className="text-slate-400 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  console.log('🎨 VoiceCallingWidget rendering main UI', { callStatus, phoneNumber, error });

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-2xl border border-slate-700 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Voice Call</h3>
        </div>
        <div className="flex items-center space-x-1">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="text-slate-400 hover:text-white p-1"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Info */}
      {customerData && (
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
          <div className="text-sm text-slate-300">Calling:</div>
          <div className="text-white font-medium">{customerData.name || 'Unknown'}</div>
        </div>
      )}

      {/* Phone Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
          disabled={callStatus === 'connected' || callStatus === 'connecting'}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
        {error && (
          <div className="text-sm text-red-400 mt-1">{error}</div>
        )}
      </div>

      {/* Call Controls */}
      <div className="flex items-center justify-center space-x-4">
        {callStatus === 'idle' || callStatus === 'failed' ? (
          <button
            onClick={handleCall}
            disabled={isInitializing || !phoneNumber.trim() || !voiceService.isInitialized}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>Call</span>
          </button>
        ) : (
          <>
            {/* Mute Button */}
            <button
              onClick={handleMuteToggle}
              disabled={callStatus !== 'connected'}
              className={`p-3 rounded-full transition-colors ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Hangup Button */}
            <button
              onClick={handleHangup}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </button>
          </>
        )}
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-slate-900/50 rounded text-xs text-slate-400">
          <div>Service: {voiceService.isInitialized ? 'Ready' : 'Not Ready'}</div>
          <div>Status: {callStatus}</div>
          <div>Phone: {phoneNumber || 'None'}</div>
        </div>
      )}
    </div>
  );
};

export default VoiceCallingWidget;
