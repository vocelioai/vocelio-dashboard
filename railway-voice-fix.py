# Quick fix for Railway deployment
# This file contains the missing endpoint that will fix the "application error"

from flask import Flask, request, jsonify
from twilio.twiml import VoiceResponse
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/v1/twilio/voice', methods=['POST'])
def handle_outbound_voice():
    """Handle outbound voice calls - this fixes the 404 error"""
    try:
        # Get call parameters from Twilio
        call_sid = request.values.get('CallSid', '')
        from_number = request.values.get('From', '')
        to_number = request.values.get('To', '')
        call_status = request.values.get('CallStatus', '')
        
        logger.info(f"Outbound call - From: {from_number}, To: {to_number}, Status: {call_status}, CallSid: {call_sid}")
        
        # Create TwiML response to connect call to browser client
        response = VoiceResponse()
        
        # Say welcome message
        response.say("Welcome to Vocelio. Connecting you now.", voice="alice")
        
        # Dial the browser client (this connects the call to your dashboard)
        dial = response.dial(timeout=30)
        dial.client('vocelio_dashboard')  # This must match your frontend identity
        
        # Fallback if client doesn't answer
        response.say("I'm sorry, the agent is not available. Please try again later.")
        
        logger.info(f"Generated TwiML for call {call_sid}")
        
        return str(response), 200, {'Content-Type': 'text/xml; charset=utf-8'}
        
    except Exception as e:
        logger.error(f"Error in outbound voice handler: {str(e)}")
        
        # Return error TwiML
        response = VoiceResponse()
        response.say("I'm sorry, there was an error processing your call. Please try again.")
        
        return str(response), 500, {'Content-Type': 'text/xml; charset=utf-8'}

if __name__ == '__main__':
    app.run(debug=True)
