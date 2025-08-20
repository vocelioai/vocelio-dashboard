// 🎯 Ramble Voice Provider Integration  
// Connects VoiceLab to Ramble AI for conversational voice synthesis

class RambleProvider {
  constructor() {
    this.apiKey = process.env.REACT_APP_RAMBLE_API_KEY;
    this.baseURL = 'https://api.ramble.ai/v1';
    this.headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Get available Ramble voices
  async getVoices() {
    try {
      const response = await fetch(`${this.baseURL}/voices`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Ramble API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform Ramble format to VoiceLab format
      return data.voices.map(voice => ({
        voice_id: voice.id,
        name: `${voice.name} - Ramble AI`,
        gender: voice.gender || this.inferGender(voice.name),
        age: voice.age_category || 'adult',
        accent: voice.accent || 'american',
        language: voice.language_code || 'en',
        description: voice.description || `Conversational AI voice: ${voice.name}`,
        use_case: 'conversational',
        category: 'premade',
        quality_score: 92, // Ramble focuses on conversational quality
        settings: {
          stability: 0.8,
          similarity_boost: 0.9,
          style: 0.4,
          conversational_flow: 0.9, // Ramble-specific
          emotion_intensity: 0.7
        },
        ai_features: {
          emotion_adaptation: true,
          real_time_optimization: true,
          context_awareness: true,
          sentiment_matching: true,
          conversational_ai: true, // Ramble specialty
          interruption_handling: true,
          natural_pauses: true
        },
        provider: 'ramble',
        preview_url: voice.sample_url || null,
        cost_per_char: 0.00012, // Ramble competitive pricing
        neural_model: "Ramble-Conversational-V2"
      }));
    } catch (error) {
      console.error('Ramble getVoices error:', error);
      return [];
    }
  }

  // Generate conversational speech with Ramble
  async generateSpeech(voiceId, text, settings = {}) {
    try {
      const requestBody = {
        voice_id: voiceId,
        text: text,
        settings: {
          stability: settings.stability || 0.8,
          similarity_boost: settings.similarity_boost || 0.9,
          style: settings.style || 0.4,
          conversational_flow: settings.conversational_flow || 0.9,
          emotion_intensity: settings.emotion_intensity || 0.7,
          enable_ssml: true,
          optimize_streaming: true
        },
        options: {
          format: 'mp3',
          sample_rate: 22050,
          optimize_for: 'conversation' // Ramble specialty
        }
      };

      const response = await fetch(`${this.baseURL}/generate`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Ramble TTS error: ${response.status}`);
      }

      // Handle both direct audio and job-based responses
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('audio')) {
        // Direct audio response
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
      } else {
        // Job-based response
        const result = await response.json();
        if (result.job_id) {
          return await this.pollForAudio(result.job_id);
        }
        throw new Error('Unexpected response format from Ramble');
      }
    } catch (error) {
      console.error('Ramble generateSpeech error:', error);
      throw error;
    }
  }

  // Poll for audio completion (for async jobs)
  async pollForAudio(jobId, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(`${this.baseURL}/jobs/${jobId}`, {
          headers: this.headers
        });
        
        const job = await response.json();
        
        if (job.status === 'completed' && job.audio_url) {
          return job.audio_url;
        } else if (job.status === 'failed') {
          throw new Error('Audio generation failed');
        }
        
        // Wait 1 second before next poll
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Poll attempt ${i + 1} failed:`, error);
      }
    }
    throw new Error('Audio generation timeout');
  }

  // Create custom conversational voice
  async createConversationalVoice(audioFile, name, description, conversationStyle = 'friendly') {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('audio_file', audioFile);
      formData.append('conversation_style', conversationStyle);
      formData.append('optimize_for', 'conversation');

      const response = await fetch(`${this.baseURL}/voices/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Ramble voice creation error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        voice_id: result.voice_id,
        name: name,
        description: description,
        conversation_style: conversationStyle
      };
    } catch (error) {
      console.error('Ramble createConversationalVoice error:', error);
      throw error;
    }
  }

  // Analyze conversation context for voice optimization
  async analyzeConversationContext(conversationText) {
    try {
      const response = await fetch(`${this.baseURL}/analyze/context`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          text: conversationText,
          analyze_emotion: true,
          analyze_intent: true,
          analyze_tone: true
        })
      });

      if (!response.ok) {
        throw new Error(`Ramble context analysis error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ramble analyzeConversationContext error:', error);
      throw error;
    }
  }

  // Helper methods
  inferGender(name) {
    const femaleNames = ['sarah', 'rachel', 'bella', 'sofia', 'olivia', 'emma', 'luna', 'maya', 'zoe'];
    const maleNames = ['adam', 'mike', 'james', 'david', 'alex', 'sam', 'chris', 'max'];
    
    const lowerName = name.toLowerCase();
    if (femaleNames.some(n => lowerName.includes(n))) return 'female';
    if (maleNames.some(n => lowerName.includes(n))) return 'male';
    return 'unknown';
  }

  // Get voice analytics
  async getVoiceAnalytics(voiceId, timeframe = '7d') {
    try {
      const response = await fetch(`${this.baseURL}/voices/${voiceId}/analytics?timeframe=${timeframe}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Ramble analytics error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ramble getVoiceAnalytics error:', error);
      throw error;
    }
  }
}

export default RambleProvider;
