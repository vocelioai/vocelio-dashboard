from flask import Flask, request, jsonify
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VoiceGrant
from twilio.twiml import VoiceResponse
import os
import logging
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Twilio Configuration - these will be set in Vercel environment variables
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_API_KEY = os.getenv('TWILIO_API_KEY') 
TWILIO_API_SECRET = os.getenv('TWILIO_API_SECRET')
TWILIO_APP_SID = os.getenv('TWILIO_APP_SID')
TWILIO_CALLER_ID = os.getenv('TWILIO_CALLER_ID')

@app.route('/api/v1/voice/token', methods=['POST'])
def generate_token():
    """Generate Twilio access token for voice calls"""
    try:
        data = request.get_json()
        identity = data.get('identity', 'dashboard_user')
        
        logger.info(f"Generating token for identity: {identity}")
        
        # Create access token
        token = AccessToken(
            TWILIO_ACCOUNT_SID,
            TWILIO_API_KEY,
            TWILIO_API_SECRET,
            identity=identity,
            ttl=3600  # 1 hour
        )
        
        # Create voice grant
        voice_grant = VoiceGrant(
            outgoing_application_sid=TWILIO_APP_SID,
            incoming_allow=True
        )
        
        token.add_grant(voice_grant)
        jwt_token = token.to_jwt()
        
        logger.info(f"Token generated successfully for {identity}")
        
        return jsonify({
            'success': True,
            'token': jwt_token.decode('utf-8'),
            'identity': identity,
            'expires_at': (datetime.utcnow() + timedelta(hours=1)).isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error generating token: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate token',
            'message': str(e)
        }), 500

@app.route('/api/v1/twilio/voice', methods=['POST'])
def handle_outbound_call():
    """Handle outbound calls - dial the target phone number"""
    try:
        # Get call parameters from Twilio
        call_sid = request.values.get('CallSid', '')
        from_number = request.values.get('From', '')
        to_number = request.values.get('To', '')
        call_status = request.values.get('CallStatus', '')
        
        logger.info(f"Outbound call - From: {from_number}, To: {to_number}, Status: {call_status}, CallSid: {call_sid}")
        
        # Create TwiML response
        response = VoiceResponse()
        
        # Say welcome message
        response.say("Welcome to Vocelio. Connecting your call now.", voice="alice")
        
        # Dial the target phone number
        if to_number:
            logger.info(f"Dialing target number: {to_number}")
            dial = response.dial(
                caller_id=TWILIO_CALLER_ID,
                timeout=30,
                action='/api/v1/twilio/call-status'
            )
            dial.number(to_number)
        else:
            response.say("I'm sorry, no phone number was provided. Please try again.")
            
        logger.info(f"Generated TwiML for outbound call {call_sid}")
        
        return str(response), 200, {'Content-Type': 'text/xml; charset=utf-8'}
        
    except Exception as e:
        logger.error(f"Error in outbound call handler: {str(e)}")
        
        response = VoiceResponse()
        response.say("I'm sorry, there was an error processing your call. Please try again.")
        
        return str(response), 500, {'Content-Type': 'text/xml; charset=utf-8'}

@app.route('/api/v1/voice/twiml/incoming', methods=['POST'])
def handle_incoming_call():
    """Handle incoming calls - connect to dashboard client"""
    try:
        from_number = request.values.get('From', '')
        to_number = request.values.get('To', '')
        call_sid = request.values.get('CallSid', '')
        
        logger.info(f"Incoming call - From: {from_number}, To: {to_number}, CallSid: {call_sid}")
        
        response = VoiceResponse()
        
        # Say welcome message
        response.say("Welcome to Vocelio. Connecting you to an agent.", voice="alice")
        
        # Dial the dashboard client
        dial = response.dial(timeout=30)
        dial.client('vocelio_dashboard')
        
        # Fallback voicemail
        response.say("Thank you for calling. All agents are currently busy. Please leave a message after the beep.")
        response.record(
            action='/api/v1/voice/recording',
            max_length=60,
            timeout=10,
            transcribe=True
        )
        
        logger.info(f"Generated TwiML for incoming call {call_sid}")
        
        return str(response), 200, {'Content-Type': 'text/xml; charset=utf-8'}
        
    except Exception as e:
        logger.error(f"Error in incoming call handler: {str(e)}")
        
        response = VoiceResponse()
        response.say("I'm sorry, there was an error. Please try again later.")
        
        return str(response), 500, {'Content-Type': 'text/xml; charset=utf-8'}

@app.route('/api/v1/twilio/call-status', methods=['POST'])
def handle_call_status():
    """Handle call status updates"""
    try:
        call_sid = request.values.get('CallSid', '')
        call_status = request.values.get('CallStatus', '')
        
        logger.info(f"Call status update - CallSid: {call_sid}, Status: {call_status}")
        
        # Just return empty response - Twilio doesn't need any TwiML here
        return '', 200
        
    except Exception as e:
        logger.error(f"Error in call status handler: {str(e)}")
        return '', 500

@app.route('/api/v1/voice/make-call', methods=['POST'])
def make_outbound_call():
    """Make an outbound call using Twilio REST API"""
    try:
        from twilio.rest import Client
        
        data = request.get_json()
        to_number = data.get('to')
        from_number = data.get('from', TWILIO_CALLER_ID)
        
        if not to_number:
            return jsonify({
                'success': False,
                'error': 'Missing phone number'
            }), 400
            
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_API_SECRET)
        
        call = client.calls.create(
            twiml=f'<Response><Say>Connecting your call to {to_number}</Say><Dial>{to_number}</Dial></Response>',
            to=to_number,
            from_=from_number
        )
        
        logger.info(f"Outbound call created - CallSid: {call.sid}")
        
        return jsonify({
            'success': True,
            'call_sid': call.sid,
            'to': to_number,
            'from': from_number
        })
        
    except Exception as e:
        logger.error(f"Error making outbound call: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to make call',
            'message': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'service': 'vocelio-voice-api',
        'status': 'operational',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat(),
        'features': [
            'Voice token generation',
            'Outbound call handling',
            'Incoming call routing',
            'TwiML generation'
        ]
    })

# For Vercel serverless functions
def handler(request):
    return app(request.environ, lambda *args: None)
