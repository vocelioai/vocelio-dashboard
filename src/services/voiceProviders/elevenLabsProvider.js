// 🎙️ ElevenLabs Voice Provider Integration
// Connects VoiceLab to ElevenLabs API for real voice synthesis

class ElevenLabsProvider {
  constructor() {
    this.apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;
    this.baseURL = 'https://api.elevenlabs.io/v1';
    this.headers = {
      'Accept': 'application/json',
      'xi-api-key': this.apiKey
    };
  }

  // Get available voices from ElevenLabs
  async getVoices() {
    try {
      const response = await fetch(`${this.baseURL}/voices`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform ElevenLabs format to VoiceLab format
      return data.voices.map(voice => ({
        voice_id: voice.voice_id,
        name: voice.name,
        gender: this.inferGender(voice.name),
        age: 'unknown',
        accent: voice.labels?.accent || 'neutral',
        language: 'en', // ElevenLabs default
        description: voice.description || `High-quality voice: ${voice.name}`,
        use_case: voice.category || 'general',
        category: voice.category === 'cloned' ? 'cloned' : 'premade',
        quality_score: 95, // ElevenLabs is high quality
        settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          style: 0.25
        },
        provider: 'elevenlabs',
        preview_url: voice.preview_url || null,
        cost_per_char: 0.00015, // ElevenLabs pricing
        neural_model: "ElevenLabs-V3-Neural-Pro"
      }));
    } catch (error) {
      console.error('ElevenLabs getVoices error:', error);
      return [];
    }
  }

  // Generate speech with ElevenLabs
  async generateSpeech(voiceId, text, settings = {}) {
    try {
      const requestBody = {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: settings.stability || 0.75,
          similarity_boost: settings.similarity_boost || 0.85,
          style: settings.style || 0.25,
          use_speaker_boost: true
        }
      };

      const response = await fetch(`${this.baseURL}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS error: ${response.status}`);
      }

      // Return audio blob URL for playback
      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('ElevenLabs generateSpeech error:', error);
      throw error;
    }
  }

  // Clone voice with audio sample
  async cloneVoice(audioFile, name, description) {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('files', audioFile);

      const response = await fetch(`${this.baseURL}/voices/add`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs clone error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        voice_id: result.voice_id,
        name: name,
        description: description
      };
    } catch (error) {
      console.error('ElevenLabs cloneVoice error:', error);
      throw error;
    }
  }

  // Helper to infer gender from name
  inferGender(name) {
    const femaleNames = ['sarah', 'rachel', 'bella', 'sofia', 'olivia', 'emma', 'luna'];
    const maleNames = ['adam', 'mike', 'james', 'david', 'morpheus', 'maximus'];
    
    const lowerName = name.toLowerCase();
    if (femaleNames.some(n => lowerName.includes(n))) return 'female';
    if (maleNames.some(n => lowerName.includes(n))) return 'male';
    return 'unknown';
  }

  // Get voice details
  async getVoiceDetails(voiceId) {
    try {
      const response = await fetch(`${this.baseURL}/voices/${voiceId}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`ElevenLabs voice details error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('ElevenLabs getVoiceDetails error:', error);
      throw error;
    }
  }
}

export default ElevenLabsProvider;
