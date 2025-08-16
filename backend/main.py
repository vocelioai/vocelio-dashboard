from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import os
from datetime import datetime, timedelta
from twilio.twiml import VoiceResponse
from twilio.rest import Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Twilio credentials - these should be set as environment variables
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_API_KEY = os.getenv('TWILIO_API_KEY')
TWILIO_API_SECRET = os.getenv('TWILIO_API_SECRET')
TWILIO_APP_SID = os.getenv('TWILIO_APP_SID')

# Default values for development (you should set these in Railway)
if not TWILIO_ACCOUNT_SID:
    logger.warning("TWILIO_ACCOUNT_SID not set in environment variables")
if not TWILIO_API_KEY:
    logger.warning("TWILIO_API_KEY not set in environment variables")

@app.route('/')
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'vocelio-call-center-api',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/v1/voice/token', methods=['POST'])
def generate_voice_token():
    """Generate JWT token for Twilio Voice SDK"""
    try:
        data = request.get_json()
        identity = data.get('identity', 'dashboard_user')
        
        logger.info(f"Generating token for identity: {identity}")
        
        if not all([TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET]):
            logger.error("Missing required Twilio credentials")
            return jsonify({
                'success': False,
                'error': 'Server configuration error: Missing Twilio credentials'
            }), 500

        # Create JWT token for Voice SDK
        # Token expires in 1 hour
        now = datetime.utcnow()
        expiry = now + timedelta(hours=1)
        
        # JWT payload for Twilio Voice
        payload = {
            'iss': TWILIO_API_KEY,
            'sub': TWILIO_ACCOUNT_SID,
            'nbf': int(now.timestamp()),
            'exp': int(expiry.timestamp()),
            'grants': {
                'voice': {
                    'outgoing': {
                        'application_sid': TWILIO_APP_SID
                    },
                    'incoming': {
                        'allow': True
                    }
                },
                'identity': identity
            }
        }
        
        # Generate JWT token
        token = jwt.encode(
            payload,
            TWILIO_API_SECRET,
            algorithm='HS256'
        )
        
        logger.info(f"Token generated successfully for {identity}")
        
        return jsonify({
            'success': True,
            'token': token,
            'identity': identity,
            'expires_at': expiry.isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error generating token: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to generate token: {str(e)}'
        }), 500

@app.route('/api/v1/twilio/voice', methods=['POST'])
def handle_outbound_call():
    """Handle outbound call - this is called when the call is answered"""
    try:
        # Get call parameters
        to_number = request.values.get('To', '')
        from_number = request.values.get('From', '')
        call_sid = request.values.get('CallSid', '')
        
        logger.info(f"Outbound call answered - To: {to_number}, From: {from_number}, CallSid: {call_sid}")
        
        # Create TwiML response
        response = VoiceResponse()
        
        # Connect the call to the dashboard user
        # This creates a bridge between the outbound call and the browser client
        dial = response.dial(
            caller_id=from_number,
            timeout=30,
            action='/api/v1/twilio/call-status',
            method='POST'
        )
        
        # Connect to the client (browser)
        dial.client('dashboard_user')
        
        # Fallback message if connection fails
        response.say("We're connecting your call. Please hold on.")
        
        logger.info("TwiML response generated for outbound call")
        
        return str(response), 200, {'Content-Type': 'text/xml'}
        
    except Exception as e:
        logger.error(f"Error handling outbound call: {str(e)}")
        
        # Return error TwiML
        response = VoiceResponse()
        response.say("We're sorry, there was an error connecting your call. Please try again later.")
        response.hangup()
        
        return str(response), 200, {'Content-Type': 'text/xml'}

@app.route('/api/v1/twilio/call-status', methods=['POST'])
def handle_call_status():
    """Handle call status updates"""
    try:
        call_sid = request.values.get('CallSid', '')
        call_status = request.values.get('CallStatus', '')
        duration = request.values.get('CallDuration', '0')
        
        logger.info(f"Call status update - CallSid: {call_sid}, Status: {call_status}, Duration: {duration}s")
        
        # You can add database logging here if needed
        
        return '', 200
        
    except Exception as e:
        logger.error(f"Error handling call status: {str(e)}")
        return '', 500

@app.route('/api/v1/twilio/incoming', methods=['POST'])
def handle_incoming_call():
    """Handle incoming calls"""
    try:
        from_number = request.values.get('From', '')
        to_number = request.values.get('To', '')
        call_sid = request.values.get('CallSid', '')
        
        logger.info(f"Incoming call - From: {from_number}, To: {to_number}, CallSid: {call_sid}")
        
        response = VoiceResponse()
        
        # Connect incoming call to dashboard user
        dial = response.dial(timeout=30)
        dial.client('dashboard_user')
        
        # Fallback voicemail
        response.say("Thank you for calling. Please leave a message after the beep.")
        response.record(
            max_length=60,
            action='/api/v1/twilio/recording',
            method='POST'
        )
        
        return str(response), 200, {'Content-Type': 'text/xml'}
        
    except Exception as e:
        logger.error(f"Error handling incoming call: {str(e)}")
        
        response = VoiceResponse()
        response.say("We're sorry, we're unable to take your call right now. Please try again later.")
        response.hangup()
        
        return str(response), 200, {'Content-Type': 'text/xml'}

@app.route('/api/v1/twilio/recording', methods=['POST'])
def handle_recording():
    """Handle voicemail recordings"""
    try:
        recording_url = request.values.get('RecordingUrl', '')
        call_sid = request.values.get('CallSid', '')
        
        logger.info(f"Recording received - CallSid: {call_sid}, URL: {recording_url}")
        
        response = VoiceResponse()
        response.say("Thank you for your message. Goodbye.")
        response.hangup()
        
        return str(response), 200, {'Content-Type': 'text/xml'}
        
    except Exception as e:
        logger.error(f"Error handling recording: {str(e)}")
        return '', 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
