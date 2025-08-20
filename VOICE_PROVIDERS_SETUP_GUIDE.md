# 🎙️ Voice Providers Integration Guide

Complete setup guide for integrating ElevenLabs, Ramble AI, and Pip AI voice providers into your VoiceLab dashboard.

## 📋 Overview

Your VoiceLab dashboard now supports multiple voice providers:
- **ElevenLabs**: Premium neural voice synthesis
- **Ramble AI**: Conversational AI voice generation
- **Pip AI**: Business-optimized voice synthesis

## 🔧 Environment Configuration

### Required Environment Variables

Add these to your `.env` file or environment configuration:

```bash
# ElevenLabs Configuration
REACT_APP_ELEVENLABS_API_KEY=sk_your_elevenlabs_api_key_here
REACT_APP_ELEVENLABS_BASE_URL=https://api.elevenlabs.io/v1

# Ramble AI Configuration  
REACT_APP_RAMBLE_API_KEY=your_ramble_api_key_here
REACT_APP_RAMBLE_BASE_URL=https://api.ramble.ai/v1

# Pip AI Configuration
REACT_APP_PIP_API_KEY=your_pip_api_key_here
REACT_APP_PIP_BASE_URL=https://api.pip.ai/v1

# Provider Settings
REACT_APP_DEFAULT_VOICE_PROVIDER=elevenlabs
REACT_APP_VOICE_PROVIDER_FALLBACK=true
REACT_APP_VOICE_PROVIDER_TIMEOUT=30000
```

### Current API Keys Status

✅ **ElevenLabs**: Already configured
- API Key: `sk_0d8ce39ef4d94e4fd5722966988b075fdeb2a2dd168de360`
- Status: Ready to use

❓ **Ramble AI**: Need API key
- Sign up at: https://ramble.ai
- Get API key from dashboard
- Add to environment variables

❓ **Pip AI**: Need API key  
- Sign up at: https://pip.ai
- Get API key from dashboard
- Add to environment variables

## 🚀 Quick Start

### 1. Test Current Setup

```bash
# Navigate to your project
cd c:\Users\SNC\vocelio-dashboard

# Install any missing dependencies
npm install

# Start the development server
npm start
```

### 2. Verify Provider Integration

1. Open VoiceLab dashboard
2. Click on **"Voice Providers"** tab
3. Check provider status indicators:
   - 🟢 Green = Connected and working
   - 🔴 Red = Disconnected or API key missing
   - 🟡 Yellow = Connecting or partial functionality

### 3. Test Voice Generation

1. Go to **"Voice Library"** tab
2. Select any voice
3. Click **"Play"** button
4. Voice should generate using available providers

## 📊 Provider Features

### ElevenLabs
- ✅ High-quality neural voices
- ✅ Voice cloning capabilities
- ✅ Multiple languages
- ✅ Custom voice training
- ✅ Real-time synthesis

### Ramble AI
- ✅ Conversational context awareness
- ✅ Dynamic tone adjustment
- ✅ Multi-turn dialogue
- ✅ Emotion-aware synthesis
- ✅ Business conversation optimization

### Pip AI
- ✅ Business-focused voices
- ✅ Sales call optimization
- ✅ Customer service voices
- ✅ Performance analytics
- ✅ ROI tracking

## 🔧 Technical Architecture

### File Structure
```
src/
├── services/
│   └── voiceProviders/
│       ├── voiceProviderManager.js     # Central coordinator
│       ├── elevenLabsProvider.js       # ElevenLabs integration
│       ├── rambleProvider.js           # Ramble AI integration
│       └── pipProvider.js              # Pip AI integration
└── pages/
    └── VoiceLab.js                     # Updated with provider support
```

### API Integration Flow

1. **Voice Request** → VoiceProviderManager
2. **Provider Selection** → Based on availability and priority
3. **API Call** → Specific provider (ElevenLabs/Ramble/Pip)
4. **Response Processing** → Unified format
5. **Audio Delivery** → Back to VoiceLab UI

## 🛠️ Troubleshooting

### Common Issues

#### Provider Shows "Disconnected"
1. Check API key in environment variables
2. Verify API key is valid and active
3. Check network connectivity
4. Look at browser console for error messages

#### Voice Generation Fails
1. Check if API quota/credits available
2. Verify text input is valid
3. Try different provider
4. Check API rate limits

#### Audio Playback Issues
1. Check browser audio permissions
2. Try different browser
3. Verify audio file generation
4. Check network connection

### Debug Commands

```bash
# Check environment variables
echo $REACT_APP_ELEVENLABS_API_KEY

# Test API connection (browser console)
window.voiceProviderManager.testAllProviders()

# Check provider status
window.voiceProviderManager.getProviderStatus()
```

## 🔐 API Key Setup Instructions

### ElevenLabs API Key
1. Go to https://elevenlabs.io
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. Copy your API key
5. Add to environment: `REACT_APP_ELEVENLABS_API_KEY=sk_your_key_here`

### Ramble AI API Key
1. Go to https://ramble.ai
2. Create account
3. Go to **Dashboard** → **API Access**
4. Generate new API key
5. Add to environment: `REACT_APP_RAMBLE_API_KEY=your_key_here`

### Pip AI API Key
1. Go to https://pip.ai
2. Create account
3. Navigate to **API** section
4. Generate API key
5. Add to environment: `REACT_APP_PIP_API_KEY=your_key_here`

## 📈 Usage Examples

### Generate Voice with Specific Provider

```javascript
// Use ElevenLabs specifically
const audio = await voiceProviderManager.generateSpeech(
  "Hello, this is a test message",
  "elevenlabs",
  { voice_id: "21m00Tcm4TlvDq8ikWAM" }
);

// Use best available provider
const audio = await voiceProviderManager.generateSpeech(
  "Hello, this is a test message"
);

// Clone voice with ElevenLabs
const clonedVoice = await voiceProviderManager.cloneVoice(
  audioFile,
  "My Cloned Voice",
  "elevenlabs"
);
```

### Provider Status Monitoring

```javascript
// Get all provider status
const status = await voiceProviderManager.getProviderStatus();
console.log(status);

// Test specific provider
const isWorking = await voiceProviderManager.testProvider('elevenlabs');
console.log(`ElevenLabs working: ${isWorking}`);
```

## 🎯 Next Steps

1. **Get API Keys**: Sign up for Ramble AI and Pip AI
2. **Configure Environment**: Add all API keys to `.env`
3. **Test Integration**: Use provider status tab to verify
4. **Optimize Settings**: Configure fallback and priority
5. **Monitor Usage**: Track API usage and costs

## 📞 Support

- **VoiceLab Issues**: Check browser console and network tab
- **API Issues**: Contact respective provider support
- **Integration Help**: Review this guide and test systematically

---

**Status**: ✅ ElevenLabs Ready | ⏳ Ramble AI Pending | ⏳ Pip AI Pending

Your VoiceLab is now ready for multi-provider voice generation! 🚀
