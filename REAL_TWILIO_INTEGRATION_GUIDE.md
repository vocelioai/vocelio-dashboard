# Real Twilio Integration Setup Guide

This guide will help you configure real Twilio API integration for your phone number purchase system.

## 🔧 Environment Variables Setup

Add these environment variables to your project:

### For Local Development (.env.local)
```bash
REACT_APP_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### For Vercel Production
1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to "Environment Variables"
4. Add these variables:
   - `REACT_APP_TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `REACT_APP_TWILIO_AUTH_TOKEN`: Your Twilio Auth Token

## 🔑 Getting Twilio Credentials

1. **Create Twilio Account**
   - Go to https://www.twilio.com/
   - Sign up for a free account
   - Verify your phone number

2. **Find Your Credentials**
   - Go to Twilio Console: https://console.twilio.com/
   - Your Account SID and Auth Token are on the dashboard
   - Account SID starts with `AC`
   - Auth Token is a 32-character string

3. **Account Setup**
   - Add funds to your account ($20 minimum recommended)
   - Verify your identity if required
   - Enable the services you need (Voice, SMS, MMS)

## 💰 Pricing Information

- **Phone Number Purchase**: $1.00 (one-time)
- **Monthly Fee**: $1.15/month per number
- **Voice Calls**: $0.0085/minute (US)
- **SMS**: $0.0075/message (US)
- **MMS**: $0.02/message (US)

## 🚀 Features Available

### Real Twilio Integration Includes:
- ✅ Real phone number search by country/area code
- ✅ Actual phone number purchasing
- ✅ View owned/purchased numbers from Twilio account
- ✅ Configure phone number settings (Voice URL, SMS URL)
- ✅ Release/delete phone numbers
- ✅ Get detailed number information and capabilities
- ✅ Account balance and status checking

### Phone Number Management:
- **Configure**: Set webhook URLs for voice and SMS
- **Details**: View complete Twilio information
- **Release**: Delete numbers from your account
- **Status Tracking**: Real-time status from Twilio API

## 🧪 Testing vs Production

### Without Credentials (Demo Mode):
- Shows error message requesting credentials
- No mock data fallback (encourages real setup)
- LocalStorage backup for purchased numbers

### With Credentials (Production Mode):
- Real Twilio API calls
- Actual phone number operations
- Live account balance checking
- Real webhook configuration

## 🔒 Security Notes

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate auth tokens** regularly
4. **Monitor usage** and costs in Twilio console
5. **Set up billing alerts** to avoid unexpected charges

## 📱 Supported Countries

The system supports phone number purchase in all countries where Twilio offers numbers:
- United States, Canada
- United Kingdom, Germany, France, Spain, Italy
- Australia, Japan, Singapore
- Brazil, Mexico, Argentina
- And 60+ more countries

## 🔧 Webhook Configuration

When purchasing numbers, you can configure:

### Voice Configuration:
- **Voice URL**: Webhook for incoming calls
- **Voice Method**: HTTP method (POST/GET)
- **Voice Fallback URL**: Backup webhook

### SMS Configuration:
- **SMS URL**: Webhook for incoming messages
- **SMS Method**: HTTP method (POST/GET) 
- **SMS Fallback URL**: Backup webhook

## 📊 Usage Monitoring

The system provides:
- Real-time account balance
- Phone number status tracking
- Usage statistics (requires additional API calls)
- Cost tracking and billing information

## 🆘 Support

If you need help:
1. Check Twilio Console for account issues
2. Verify environment variables are set correctly
3. Check browser console for API errors
4. Review Twilio documentation: https://www.twilio.com/docs
5. Contact Twilio support for account-specific issues

## 🚀 Next Steps

1. **Add environment variables** with your Twilio credentials
2. **Test phone number search** to verify API connection
3. **Purchase a test number** to validate the flow
4. **Configure webhooks** for your application
5. **Monitor usage** and costs regularly

---

**⚠️ Important**: This integration uses real Twilio APIs and will incur actual charges. Always monitor your usage and set appropriate billing limits.
