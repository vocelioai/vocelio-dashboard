"""
Vocelio Flow Builder Backend - FastAPI Routes
Handles flow management and Twilio integration for test calls.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
import json
from datetime import datetime
import asyncio
import logging

# Third-party imports
import openai
from twilio.rest import Client
from supabase import create_client, Client as SupabaseClient

# Initialize FastAPI app
app = FastAPI(title="Vocelio Flow Builder API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize clients
openai.api_key = OPENAI_API_KEY
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
supabase: SupabaseClient = create_client(SUPABASE_URL, SUPABASE_KEY)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
class NodeData(BaseModel):
    label: str
    script: str = ""
    objectionHandling: Dict[str, str] = Field(default_factory=dict)
    settings: Dict[str, Any] = Field(default_factory=dict)

class FlowNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: NodeData

class FlowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None

class FlowData(BaseModel):
    name: str
    nodes: List[FlowNode]
    edges: List[FlowEdge]

class TestCallRequest(BaseModel):
    phone_number: str = Field(..., regex=r'^\+?[1-9]\d{1,14}$')
    flow_nodes: List[FlowNode]

class FlowResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    flow_id: Optional[str] = None

# Helper functions
def create_twiml_script(nodes: List[FlowNode]) -> str:
    """
    Convert flow nodes into a coherent TwiML script for Twilio.
    """
    script_parts = []
    
    for node in nodes:
        if node.data.script:
            script_parts.append(node.data.script.strip())
    
    # Combine all scripts with natural transitions
    combined_script = " ".join(script_parts)
    
    return combined_script

async def enhance_script_with_ai(script: str, settings: Dict[str, Any]) -> str:
    """
    Use OpenAI GPT-4o-mini to enhance and improve the call script.
    """
    try:
        temperature = settings.get('temperature', 0.7)
        
        prompt = f"""
        You are an expert sales script writer. Please enhance the following call script to make it more natural, persuasive, and conversational while maintaining the core message:

        Original Script: {script}

        Requirements:
        - Keep the script natural and conversational
        - Make it sound human, not robotic
        - Include appropriate pauses and transitions
        - Maintain professional tone
        - Keep the core message intact
        - Make it suitable for voice synthesis

        Enhanced Script:
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert sales script writer specializing in phone conversations."},
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            max_tokens=500
        )
        
        enhanced_script = response.choices[0].message.content.strip()
        return enhanced_script
        
    except Exception as e:
        logger.error(f"Error enhancing script with AI: {str(e)}")
        return script  # Return original script if enhancement fails

def create_twiml_response(script: str) -> str:
    """
    Create a TwiML response for Twilio with the enhanced script.
    """
    # Basic TwiML structure for a voice call
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" rate="medium" pitch="medium">
        {script}
    </Say>
    <Gather input="speech" timeout="10" speechTimeout="auto">
        <Say voice="alice">Please let me know your thoughts.</Say>
    </Gather>
    <Say voice="alice">Thank you for your time. Have a great day!</Say>
</Response>"""
    
    return twiml

# API Routes

@app.post("/api/save-flow", response_model=FlowResponse)
async def save_flow(flow_data: FlowData):
    """
    Save flow data to Supabase database.
    """
    try:
        # Insert flow metadata
        flow_result = supabase.table('flows').insert({
            'name': flow_data.name,
            'created_at': datetime.utcnow().isoformat(),
            'is_production': False
        }).execute()
        
        if not flow_result.data:
            raise HTTPException(status_code=500, detail="Failed to create flow record")
        
        flow_id = flow_result.data[0]['id']
        
        # Insert nodes
        nodes_data = []
        for node in flow_data.nodes:
            nodes_data.append({
                'flow_id': flow_id,
                'node_id': node.id,
                'type': node.type,
                'data': node.data.dict(),
                'position': node.position
            })
        
        if nodes_data:
            supabase.table('flow_nodes').insert(nodes_data).execute()
        
        # Insert edges
        edges_data = []
        for edge in flow_data.edges:
            edges_data.append({
                'flow_id': flow_id,
                'edge_id': edge.id,
                'source': edge.source,
                'target': edge.target,
                'label': edge.label
            })
        
        if edges_data:
            supabase.table('flow_edges').insert(edges_data).execute()
        
        logger.info(f"Successfully saved flow {flow_id}")
        
        return FlowResponse(
            success=True,
            flow_id=str(flow_id),
            data={"message": "Flow saved successfully"}
        )
        
    except Exception as e:
        logger.error(f"Error saving flow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save flow: {str(e)}")

@app.get("/api/load-flow", response_model=FlowResponse)
async def load_latest_flow():
    """
    Load the most recent flow from Supabase.
    """
    try:
        # Get the latest flow
        flow_result = supabase.table('flows').select('*').order('created_at', desc=True).limit(1).execute()
        
        if not flow_result.data:
            return FlowResponse(
                success=False,
                error="No flows found"
            )
        
        flow = flow_result.data[0]
        flow_id = flow['id']
        
        # Get nodes for this flow
        nodes_result = supabase.table('flow_nodes').select('*').eq('flow_id', flow_id).execute()
        
        # Get edges for this flow
        edges_result = supabase.table('flow_edges').select('*').eq('flow_id', flow_id).execute()
        
        # Format nodes
        nodes = []
        for node_data in nodes_result.data:
            nodes.append({
                'id': node_data['node_id'],
                'type': node_data['type'],
                'position': node_data['position'],
                'data': node_data['data']
            })
        
        # Format edges
        edges = []
        for edge_data in edges_result.data:
            edges.append({
                'id': edge_data['edge_id'],
                'source': edge_data['source'],
                'target': edge_data['target'],
                'label': edge_data['label']
            })
        
        return FlowResponse(
            success=True,
            data={
                'flow': flow,
                'nodes': nodes,
                'edges': edges
            }
        )
        
    except Exception as e:
        logger.error(f"Error loading flow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to load flow: {str(e)}")

@app.post("/api/test-call")
async def test_call(request: TestCallRequest, background_tasks: BackgroundTasks):
    """
    Initiate a test call using Twilio with the provided flow nodes.
    """
    try:
        # Validate phone number format
        phone_number = request.phone_number
        if not phone_number.startswith('+'):
            phone_number = '+' + phone_number
        
        # Create script from flow nodes
        base_script = create_twiml_script(request.flow_nodes)
        
        if not base_script.strip():
            raise HTTPException(status_code=400, detail="No script content found in flow nodes")
        
        # Get settings from first node with settings, or use defaults
        settings = {'temperature': 0.7}
        for node in request.flow_nodes:
            if node.data.settings:
                settings.update(node.data.settings)
                break
        
        # Enhance script with AI
        enhanced_script = await enhance_script_with_ai(base_script, settings)
        
        # Create TwiML
        twiml_content = create_twiml_response(enhanced_script)
        
        # For this example, we'll create a simple call using Twilio's Say verb
        # In production, you might want to host the TwiML on your server
        call = twilio_client.calls.create(
            twiml=twiml_content,
            to=phone_number,
            from_=TWILIO_PHONE_NUMBER
        )
        
        logger.info(f"Test call initiated: {call.sid} to {phone_number}")
        
        # Log the call in database (background task)
        background_tasks.add_task(log_test_call, call.sid, phone_number, enhanced_script)
        
        return {
            "success": True,
            "call_sid": call.sid,
            "message": "Test call initiated successfully",
            "enhanced_script": enhanced_script
        }
        
    except Exception as e:
        logger.error(f"Error initiating test call: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to initiate test call: {str(e)}")

async def log_test_call(call_sid: str, phone_number: str, script: str):
    """
    Background task to log test call details.
    """
    try:
        supabase.table('test_calls').insert({
            'call_sid': call_sid,
            'phone_number': phone_number,
            'script': script,
            'created_at': datetime.utcnow().isoformat()
        }).execute()
        
        logger.info(f"Logged test call {call_sid}")
        
    except Exception as e:
        logger.error(f"Error logging test call: {str(e)}")

@app.post("/api/promote-flow/{flow_id}")
async def promote_flow_to_production(flow_id: str):
    """
    Promote a flow to production status.
    """
    try:
        # First, set all flows to non-production
        supabase.table('flows').update({'is_production': False}).neq('id', 0).execute()
        
        # Then set this specific flow to production
        result = supabase.table('flows').update({'is_production': True}).eq('id', flow_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Flow not found")
        
        return {
            "success": True,
            "message": f"Flow {flow_id} promoted to production"
        }
        
    except Exception as e:
        logger.error(f"Error promoting flow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to promote flow: {str(e)}")

@app.get("/api/flows")
async def get_all_flows():
    """
    Get all flows with basic metadata.
    """
    try:
        result = supabase.table('flows').select('id, name, created_at, is_production').order('created_at', desc=True).execute()
        
        return {
            "success": True,
            "data": result.data
        }
        
    except Exception as e:
        logger.error(f"Error getting flows: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get flows: {str(e)}")

@app.get("/api/health")
async def health_check():
    """
    Simple health check endpoint.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# WebSocket endpoint for real-time collaboration (stretch goal)
@app.websocket("/ws/flow/{flow_id}")
async def websocket_endpoint(websocket, flow_id: str):
    """
    WebSocket endpoint for real-time collaboration on flows.
    This is a stretch goal implementation.
    """
    await websocket.accept()
    
    try:
        while True:
            # Receive data from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast to other clients (simplified implementation)
            # In production, you'd maintain a list of connected clients per flow
            await websocket.send_text(json.dumps({
                "type": "flow_update",
                "flow_id": flow_id,
                "data": message
            }))
            
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
