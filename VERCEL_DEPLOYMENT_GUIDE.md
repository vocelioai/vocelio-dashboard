# Vercel Environment Variables Setup Guide

## 1. Deploy to Vercel

First, make sure your build is ready:
```bash
npm run build
```

Then deploy to Vercel:
```bash
npx vercel --prod
```

## 2. Set Environment Variables in Vercel

Go to your Vercel dashboard > Project Settings > Environment Variables

Add these variables:

### Twilio Configuration
- `TWILIO_ACCOUNT_SID` = Your Twilio Account SID
- `TWILIO_API_KEY` = Your Twilio API Key  
- `TWILIO_API_SECRET` = Your Twilio API Secret
- `TWILIO_APP_SID` = Your Twilio TwiML App SID
- `TWILIO_CALLER_ID` = Your Twilio phone number (e.g., +13073017993)

### React App Configuration  
- `REACT_APP_CALL_CENTER_API` = https://your-vercel-app.vercel.app

## 3. Update Twilio Webhook URLs

In your Twilio Console, update these URLs to point to your Vercel deployment:

**TwiML App Configuration:**
- Voice URL: `https://your-vercel-app.vercel.app/api/v1/twilio/voice`
- Voice Method: POST

**Phone Number Configuration:**
- Voice URL: `https://your-vercel-app.vercel.app/api/v1/voice/twiml/incoming`
- Voice Method: POST

## 4. API Endpoints

Your Vercel deployment will have these endpoints:

- **Token Generation**: `POST /api/v1/voice/token`
- **Outbound Calls**: `POST /api/v1/twilio/voice` 
- **Incoming Calls**: `POST /api/v1/voice/twiml/incoming`
- **Health Check**: `GET /api/health`

## 5. Key Features

✅ **Fixed Outbound Calling**: TwiML now dials the target phone number
✅ **Complete Token System**: JWT generation with proper Twilio grants
✅ **Error Handling**: Comprehensive logging and fallbacks
✅ **CORS Support**: Proper headers for browser requests

## 6. Testing

After deployment, test with:
```bash
curl -X POST https://your-vercel-app.vercel.app/api/v1/voice/token \
  -H "Content-Type: application/json" \
  -d '{"identity": "vocelio_dashboard"}'
```

Your voice calling system will be fully operational! 🎉
