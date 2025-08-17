// Simple Express server to provide Twilio token endpoint for development
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;

// Enable CORS for local development
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'vocelio-mock-backend',
    timestamp: new Date().toISOString()
  });
});

// Twilio Voice Token endpoint
app.post('/api/v1/voice/token', (req, res) => {
  try {
    console.log('🔑 Generating Twilio access token for:', req.body);
    
    const { identity = 'user_dev' } = req.body;
    
    // For development, return a mock token structure
    // In production, this would use Twilio's AccessToken class
    const mockToken = {
      token: 'mock_twilio_token_for_development',
      identity: identity,
      expires_at: Date.now() + (60 * 60 * 1000), // 1 hour
      account_sid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    };
    
    console.log('✅ Token generated:', { identity, expires_at: new Date(mockToken.expires_at) });
    
    res.json(mockToken);
    
  } catch (error) {
    console.error('❌ Token generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate token',
      message: error.message 
    });
  }
});

// Voice webhook endpoint (for incoming calls)
app.post('/api/v1/voice/incoming', (req, res) => {
  console.log('📞 Incoming voice webhook:', req.body);
  
  // Return TwiML response
  const twiml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice">Hello from Vocelio! This call is being handled by the development server.</Say>
      <Pause length="1"/>
      <Say voice="alice">Please hold while we connect you.</Say>
    </Response>
  `;
  
  res.type('text/xml');
  res.send(twiml);
});

// SMS webhook endpoint  
app.post('/api/v1/sms/incoming', (req, res) => {
  console.log('💬 Incoming SMS webhook:', req.body);
  
  const twiml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>Thanks for your message! This is an automated response from Vocelio development server.</Message>
    </Response>
  `;
  
  res.type('text/xml');
  res.send(twiml);
});

// Enhanced health endpoint
app.get('/api/v1/enhanced/health/enhanced', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'vocelio-enhanced-backend',
    version: '1.0.0-dev',
    timestamp: new Date().toISOString(),
    features: {
      twilio_voice: true,
      twilio_sms: true,
      mock_mode: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Vocelio Mock Backend running on port ${PORT}`);
  console.log(`📞 Twilio token endpoint: http://localhost:${PORT}/api/v1/voice/token`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`✨ CORS enabled for local development`);
});
