// 🐍 Pip Voice Provider Integration
// Connects VoiceLab to Pip AI for specialized voice synthesis

class PipProvider {
  constructor() {
    this.apiKey = process.env.REACT_APP_PIP_API_KEY;
    this.baseURL = 'https://api.pip.ai/v1';
    this.headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Get available Pip voices
  async getVoices() {
    try {
      const response = await fetch(`${this.baseURL}/voices`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Pip API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform Pip format to VoiceLab format
      return data.voices.map(voice => ({
        voice_id: voice.id,
        name: `${voice.name} - Pip AI`,
        gender: voice.gender || this.inferGender(voice.name),
        age: voice.age_group || 'adult',
        accent: voice.accent || 'neutral',
        language: voice.language || 'en',
        description: voice.description || `Specialized AI voice: ${voice.name}`,
        use_case: voice.specialization || 'general',
        category: voice.type === 'custom' ? 'cloned' : 'premade',
        quality_score: voice.quality_rating || 90,
        settings: {
          stability: 0.7,
          similarity_boost: 0.85,
          style: 0.3,
          speed: 1.0,
          pitch: 0.0,
          emotion_intensity: 0.6
        },
        ai_features: {
          emotion_adaptation: voice.features?.emotion_control || false,
          real_time_optimization: voice.features?.real_time || false,
          context_awareness: voice.features?.context_aware || false,
          sentiment_matching: voice.features?.sentiment || false,
          neural_enhancement: voice.features?.neural || true,
          pip_specialization: voice.specialization // Pip-specific feature
        },
        provider: 'pip',
        preview_url: voice.sample_url || null,
        cost_per_char: voice.pricing?.per_character || 0.0001,
        neural_model: `Pip-${voice.model_version || 'Standard'}-V1`,
        specialization: voice.specialization
      }));
    } catch (error) {
      console.error('Pip getVoices error:', error);
      return [];
    }
  }

  // Generate speech with Pip
  async generateSpeech(voiceId, text, settings = {}) {
    try {
      const requestBody = {
        voice_id: voiceId,
        text: text,
        voice_settings: {
          stability: settings.stability || 0.7,
          similarity_boost: settings.similarity_boost || 0.85,
          style: settings.style || 0.3,
          speed: settings.speed || 1.0,
          pitch: settings.pitch || 0.0,
          emotion_intensity: settings.emotion_intensity || 0.6
        },
        output_format: {
          format: 'mp3',
          sample_rate: 22050,
          bit_rate: 128
        },
        pip_options: {
          enable_specialization: true,
          optimize_for_speech: true,
          enhance_clarity: true
        }
      };

      const response = await fetch(`${this.baseURL}/synthesize`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pip TTS error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      // Check if response is audio or job reference
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('audio')) {
        // Direct audio response
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
      } else {
        // JSON response with audio URL or job ID
        const result = await response.json();
        if (result.audio_url) {
          return result.audio_url;
        } else if (result.job_id) {
          return await this.pollSynthesisJob(result.job_id);
        }
        throw new Error('Unexpected response format from Pip');
      }
    } catch (error) {
      console.error('Pip generateSpeech error:', error);
      throw error;
    }
  }

  // Poll synthesis job status
  async pollSynthesisJob(jobId, maxAttempts = 20) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(`${this.baseURL}/jobs/${jobId}`, {
          headers: this.headers
        });
        
        if (!response.ok) {
          throw new Error(`Job status check failed: ${response.status}`);
        }
        
        const job = await response.json();
        
        if (job.status === 'completed' && job.audio_url) {
          return job.audio_url;
        } else if (job.status === 'failed') {
          throw new Error(`Synthesis failed: ${job.error || 'Unknown error'}`);
        }
        
        // Wait 2 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Poll attempt ${i + 1} failed:`, error);
      }
    }
    throw new Error('Synthesis job timeout');
  }

  // Create specialized voice
  async createSpecializedVoice(audioFile, name, description, specialization = 'general') {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('audio_sample', audioFile);
      formData.append('specialization', specialization);
      formData.append('enable_neural_enhancement', 'true');

      const response = await fetch(`${this.baseURL}/voices/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pip voice creation error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      return {
        success: true,
        voice_id: result.voice_id,
        name: name,
        description: description,
        specialization: specialization,
        training_status: result.training_status || 'queued'
      };
    } catch (error) {
      console.error('Pip createSpecializedVoice error:', error);
      throw error;
    }
  }

  // Get voice specializations available
  async getAvailableSpecializations() {
    try {
      const response = await fetch(`${this.baseURL}/specializations`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Pip specializations error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Pip getAvailableSpecializations error:', error);
      return [
        { id: 'general', name: 'General Purpose', description: 'Versatile voice for all use cases' },
        { id: 'business', name: 'Business Professional', description: 'Optimized for professional communications' },
        { id: 'sales', name: 'Sales & Marketing', description: 'Persuasive and engaging for sales calls' },
        { id: 'support', name: 'Customer Support', description: 'Helpful and patient for support interactions' },
        { id: 'education', name: 'Educational', description: 'Clear and instructional for learning content' }
      ];
    }
  }

  // Analyze voice performance
  async analyzeVoicePerformance(voiceId, usageData) {
    try {
      const response = await fetch(`${this.baseURL}/voices/${voiceId}/analyze`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(usageData)
      });
      
      if (!response.ok) {
        throw new Error(`Pip analysis error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Pip analyzeVoicePerformance error:', error);
      throw error;
    }
  }

  // Helper methods
  inferGender(name) {
    const femaleNames = ['sarah', 'rachel', 'bella', 'sofia', 'olivia', 'emma', 'luna', 'maya', 'zoe', 'anna'];
    const maleNames = ['adam', 'mike', 'james', 'david', 'alex', 'sam', 'chris', 'max', 'tom', 'ben'];
    
    const lowerName = name.toLowerCase();
    if (femaleNames.some(n => lowerName.includes(n))) return 'female';
    if (maleNames.some(n => lowerName.includes(n))) return 'male';
    return 'unknown';
  }

  // Test voice quality
  async testVoiceQuality(voiceId, testPhrase = "Hello, this is a test of voice quality.") {
    try {
      const response = await fetch(`${this.baseURL}/voices/${voiceId}/test`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          test_phrase: testPhrase,
          quality_metrics: ['clarity', 'naturalness', 'consistency']
        })
      });
      
      if (!response.ok) {
        throw new Error(`Pip quality test error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Pip testVoiceQuality error:', error);
      throw error;
    }
  }

  // Get voice usage statistics
  async getVoiceStats(voiceId, timeframe = '7d') {
    try {
      const response = await fetch(`${this.baseURL}/voices/${voiceId}/stats?timeframe=${timeframe}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Pip stats error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Pip getVoiceStats error:', error);
      throw error;
    }
  }
}

export default PipProvider;
