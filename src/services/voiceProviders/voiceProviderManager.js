// 🎯 Unified Voice Provider Manager
// Manages multiple voice providers (ElevenLabs, Ramble, Pip) for VoiceLab

import ElevenLabsProvider from './elevenLabsProvider.js';
import RambleProvider from './rambleProvider.js';
import PipProvider from './pipProvider.js';

class VoiceProviderManager {
  constructor() {
    this.providers = {
      elevenlabs: new ElevenLabsProvider(),
      ramble: new RambleProvider(),
      pip: new PipProvider()
    };
    
    this.enabledProviders = [];
    this.initializeProviders();
  }

  // Initialize and check which providers are available
  async initializeProviders() {
    this.enabledProviders = [];
    
    // Check ElevenLabs
    if (process.env.REACT_APP_ELEVENLABS_API_KEY) {
      try {
        await this.providers.elevenlabs.getVoices();
        this.enabledProviders.push('elevenlabs');
        console.log('✅ ElevenLabs provider initialized');
      } catch (error) {
        console.warn('⚠️ ElevenLabs provider unavailable:', error.message);
      }
    }

    // Check Ramble
    if (process.env.REACT_APP_RAMBLE_API_KEY) {
      try {
        await this.providers.ramble.getVoices();
        this.enabledProviders.push('ramble');
        console.log('✅ Ramble provider initialized');
      } catch (error) {
        console.warn('⚠️ Ramble provider unavailable:', error.message);
      }
    }

    // Check Pip
    if (process.env.REACT_APP_PIP_API_KEY) {
      try {
        await this.providers.pip.getVoices();
        this.enabledProviders.push('pip');
        console.log('✅ Pip provider initialized');
      } catch (error) {
        console.warn('⚠️ Pip provider unavailable:', error.message);
      }
    }

    console.log(`🎙️ Voice providers enabled: ${this.enabledProviders.join(', ')}`);
  }

  // Get all voices from all enabled providers
  async getAllVoices() {
    const allVoices = [];
    
    for (const providerName of this.enabledProviders) {
      try {
        const voices = await this.providers[providerName].getVoices();
        allVoices.push(...voices);
      } catch (error) {
        console.error(`Error fetching voices from ${providerName}:`, error);
      }
    }

    return allVoices;
  }

  // Generate speech using the appropriate provider
  async generateSpeech(voiceId, text, settings = {}) {
    // Find which provider has this voice
    const provider = await this.findVoiceProvider(voiceId);
    
    if (!provider) {
      throw new Error(`Voice ${voiceId} not found in any provider`);
    }

    return await this.providers[provider].generateSpeech(voiceId, text, settings);
  }

  // Clone voice using the specified provider
  async cloneVoice(providerName, audioFile, name, description, options = {}) {
    if (!this.enabledProviders.includes(providerName)) {
      throw new Error(`Provider ${providerName} is not available`);
    }

    const provider = this.providers[providerName];
    
    if (provider.cloneVoice) {
      return await provider.cloneVoice(audioFile, name, description);
    } else if (provider.createSpecializedVoice) {
      return await provider.createSpecializedVoice(audioFile, name, description, options.specialization);
    } else if (provider.createConversationalVoice) {
      return await provider.createConversationalVoice(audioFile, name, description, options.conversationStyle);
    } else {
      throw new Error(`Provider ${providerName} does not support voice cloning`);
    }
  }

  // Find which provider has a specific voice
  async findVoiceProvider(voiceId) {
    for (const providerName of this.enabledProviders) {
      try {
        const voices = await this.providers[providerName].getVoices();
        if (voices.some(voice => voice.voice_id === voiceId)) {
          return providerName;
        }
      } catch (error) {
        console.error(`Error checking provider ${providerName}:`, error);
      }
    }
    return null;
  }

  // Get provider-specific features
  getProviderFeatures(providerName) {
    const features = {
      elevenlabs: {
        strengths: ['High quality', 'Voice cloning', 'Multiple languages'],
        specialties: ['Premium voices', 'Celebrity voices', 'Custom cloning'],
        pricing: 'Premium',
        best_for: 'High-quality production voices'
      },
      ramble: {
        strengths: ['Conversational AI', 'Real-time optimization', 'Context awareness'],
        specialties: ['Conversation flow', 'Interruption handling', 'Natural pauses'],
        pricing: 'Competitive',
        best_for: 'Interactive conversations and calls'
      },
      pip: {
        strengths: ['Specialized voices', 'Performance analytics', 'Custom training'],
        specialties: ['Business optimization', 'Industry-specific voices', 'Performance tracking'],
        pricing: 'Cost-effective',
        best_for: 'Business and specialized use cases'
      }
    };

    return features[providerName] || {};
  }

  // Compare voices across providers
  async compareVoices(voiceIds) {
    const comparisons = [];
    
    for (const voiceId of voiceIds) {
      const provider = await this.findVoiceProvider(voiceId);
      if (provider) {
        const providerInstance = this.providers[provider];
        const features = this.getProviderFeatures(provider);
        
        // Get voice details
        let voiceDetails = null;
        try {
          if (providerInstance.getVoiceDetails) {
            voiceDetails = await providerInstance.getVoiceDetails(voiceId);
          }
        } catch (error) {
          console.warn(`Could not get details for voice ${voiceId}:`, error);
        }

        comparisons.push({
          voice_id: voiceId,
          provider: provider,
          features: features,
          details: voiceDetails,
          test_url: await this.generateTestSample(voiceId, "This is a test comparison sample.")
        });
      }
    }

    return comparisons;
  }

  // Generate test samples for comparison
  async generateTestSample(voiceId, testText = "Hello, this is a test sample for voice comparison.") {
    try {
      return await this.generateSpeech(voiceId, testText);
    } catch (error) {
      console.error(`Failed to generate test sample for ${voiceId}:`, error);
      return null;
    }
  }

  // Get analytics across all providers
  async getUnifiedAnalytics(timeframe = '7d') {
    const analytics = {
      total_usage: 0,
      provider_breakdown: {},
      top_voices: [],
      performance_metrics: {}
    };

    for (const providerName of this.enabledProviders) {
      try {
        const provider = this.providers[providerName];
        
        if (provider.getVoiceAnalytics) {
          const providerAnalytics = await provider.getVoiceAnalytics(null, timeframe);
          analytics.provider_breakdown[providerName] = providerAnalytics;
        }
      } catch (error) {
        console.error(`Error getting analytics from ${providerName}:`, error);
      }
    }

    return analytics;
  }

  // Test all providers
  async testAllProviders() {
    const testResults = {
      timestamp: new Date().toISOString(),
      results: {}
    };

    for (const providerName of this.enabledProviders) {
      try {
        const provider = this.providers[providerName];
        const startTime = Date.now();
        
        // Test basic functionality
        const voices = await provider.getVoices();
        const responseTime = Date.now() - startTime;
        
        testResults.results[providerName] = {
          status: 'success',
          voice_count: voices.length,
          response_time: responseTime,
          available: true
        };
      } catch (error) {
        testResults.results[providerName] = {
          status: 'error',
          error: error.message,
          available: false
        };
      }
    }

    return testResults;
  }

  // Get provider status
  getProviderStatus() {
    return {
      total_providers: Object.keys(this.providers).length,
      enabled_providers: this.enabledProviders.length,
      providers: this.enabledProviders.map(name => ({
        name: name,
        status: 'active',
        features: this.getProviderFeatures(name)
      }))
    };
  }

  // Recommend best provider for use case
  recommendProvider(useCase) {
    const recommendations = {
      'high_quality': 'elevenlabs',
      'conversational': 'ramble',
      'business': 'pip',
      'sales': 'ramble',
      'executive': 'elevenlabs',
      'multilingual': 'elevenlabs',
      'cost_effective': 'pip',
      'real_time': 'ramble'
    };

    const recommended = recommendations[useCase] || 'elevenlabs';
    
    if (this.enabledProviders.includes(recommended)) {
      return {
        provider: recommended,
        reason: `Best suited for ${useCase} use case`,
        features: this.getProviderFeatures(recommended)
      };
    }

    // Fallback to first available provider
    return {
      provider: this.enabledProviders[0] || null,
      reason: 'Fallback - recommended provider not available',
      features: this.getProviderFeatures(this.enabledProviders[0])
    };
  }
}

export default VoiceProviderManager;
