"""
Vocelio Flow Runtime Engine
FastAPI backend for world-class deterministic flow execution
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from typing import Dict, List, Any, Optional, Union
import asyncio
import json
import uuid
import logging
from datetime import datetime
from enum import Enum
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Vocelio Flow Runtime",
    description="Deterministic execution engine for voice workflows",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Runtime Models
class NodeType(str, Enum):
    START = "start"
    SAY = "say"
    COLLECT = "collect"
    BRANCH = "branch"
    LLM = "llm"
    API = "api"
    HANDOFF = "handoff"
    END = "end"

class ExecutionStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"
    PAUSED = "paused"

class FlowNode(BaseModel):
    id: str
    type: NodeType
    data: Dict[str, Any]
    position: Dict[str, float]

class FlowEdge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class FlowDefinition(BaseModel):
    nodes: List[FlowNode]
    edges: List[FlowEdge]
    metadata: Optional[Dict[str, Any]] = {}

class ExecutionContext(BaseModel):
    execution_id: str
    flow_id: str
    status: ExecutionStatus
    current_node_id: Optional[str] = None
    variables: Dict[str, Any] = {}
    call_data: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime
    trace: List[Dict[str, Any]] = []

class ExecutionTrace(BaseModel):
    timestamp: datetime
    node_id: str
    node_type: NodeType
    action: str
    data: Dict[str, Any] = {}
    duration_ms: Optional[int] = None
    error: Optional[str] = None

# Runtime Engine
class FlowRuntimeEngine:
    def __init__(self):
        self.active_executions: Dict[str, ExecutionContext] = {}
        self.flow_definitions: Dict[str, FlowDefinition] = {}
        self.websocket_connections: Dict[str, WebSocket] = {}
    
    async def start_execution(self, flow_definition: FlowDefinition, call_data: Dict[str, Any] = None) -> str:
        """Start a new flow execution"""
        execution_id = str(uuid.uuid4())
        flow_id = str(uuid.uuid4())
        
        # Store flow definition
        self.flow_definitions[flow_id] = flow_definition
        
        # Find start node
        start_node = next((node for node in flow_definition.nodes if node.type == NodeType.START), None)
        if not start_node:
            raise HTTPException(status_code=400, detail="No start node found in flow")
        
        # Create execution context
        context = ExecutionContext(
            execution_id=execution_id,
            flow_id=flow_id,
            status=ExecutionStatus.PENDING,
            current_node_id=start_node.id,
            variables={},
            call_data=call_data or {},
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.active_executions[execution_id] = context
        
        # Start execution in background
        asyncio.create_task(self._execute_flow(execution_id))
        
        return execution_id
    
    async def _execute_flow(self, execution_id: str):
        """Execute flow deterministically"""
        context = self.active_executions.get(execution_id)
        if not context:
            return
        
        try:
            context.status = ExecutionStatus.RUNNING
            await self._broadcast_status(execution_id, context)
            
            while context.current_node_id and context.status == ExecutionStatus.RUNNING:
                await self._execute_node(execution_id)
                
        except Exception as e:
            logger.error(f"Flow execution error: {str(e)}")
            context.status = ExecutionStatus.ERROR
            await self._add_trace(execution_id, context.current_node_id or "unknown", "error", 
                                {"error": str(e), "traceback": traceback.format_exc()})
        
        finally:
            context.updated_at = datetime.now()
            await self._broadcast_status(execution_id, context)
    
    async def _execute_node(self, execution_id: str):
        """Execute a single node"""
        context = self.active_executions.get(execution_id)
        if not context:
            return
        
        flow_definition = self.flow_definitions[context.flow_id]
        current_node = next((n for n in flow_definition.nodes if n.id == context.current_node_id), None)
        
        if not current_node:
            context.status = ExecutionStatus.ERROR
            await self._add_trace(execution_id, context.current_node_id or "unknown", "error", 
                                {"error": f"Node {context.current_node_id} not found"})
            return
        
        start_time = datetime.now()
        
        try:
            # Execute node based on type
            next_node_id = await self._execute_node_logic(execution_id, current_node)
            
            # Calculate duration
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            
            # Add trace
            await self._add_trace(execution_id, current_node.id, "executed", 
                                current_node.data, duration_ms)
            
            # Move to next node
            context.current_node_id = next_node_id
            if not next_node_id:
                context.status = ExecutionStatus.COMPLETED
            
        except Exception as e:
            duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
            await self._add_trace(execution_id, current_node.id, "error", 
                                {"error": str(e)}, duration_ms, str(e))
            context.status = ExecutionStatus.ERROR
    
    async def _execute_node_logic(self, execution_id: str, node: FlowNode) -> Optional[str]:
        """Execute specific node logic"""
        context = self.active_executions[execution_id]
        flow_definition = self.flow_definitions[context.flow_id]
        
        if node.type == NodeType.START:
            # Initialize variables from call data
            context.variables.update(context.call_data)
            return self._get_next_node_id(flow_definition, node.id)
        
        elif node.type == NodeType.SAY:
            # Process text-to-speech
            text = self._process_template(node.data.get("text", ""), context.variables)
            context.variables["last_said"] = text
            await self._add_trace(execution_id, node.id, "say", {"text": text})
            return self._get_next_node_id(flow_definition, node.id)
        
        elif node.type == NodeType.COLLECT:
            # Simulate input collection (in real implementation, this would wait for user input)
            input_type = node.data.get("inputType", "speech")
            prompt = self._process_template(node.data.get("prompt", ""), context.variables)
            
            # For simulation, generate mock input
            mock_input = self._generate_mock_input(input_type)
            context.variables[node.data.get("variable", "user_input")] = mock_input
            
            await self._add_trace(execution_id, node.id, "collect", {
                "prompt": prompt, 
                "input_type": input_type,
                "collected": mock_input
            })
            return self._get_next_node_id(flow_definition, node.id)
        
        elif node.type == NodeType.BRANCH:
            # Evaluate condition and branch
            condition = node.data.get("condition", "true")
            result = self._evaluate_condition(condition, context.variables)
            
            # Find appropriate edge based on condition result
            target_handle = "true" if result else "false"
            next_node_id = self._get_next_node_id(flow_definition, node.id, target_handle)
            
            await self._add_trace(execution_id, node.id, "branch", {
                "condition": condition,
                "result": result,
                "next_node": next_node_id
            })
            return next_node_id
        
        elif node.type == NodeType.LLM:
            # Process LLM request
            prompt = self._process_template(node.data.get("prompt", ""), context.variables)
            model = node.data.get("model", "gpt-4")
            temperature = node.data.get("temperature", 0.7)
            
            # Simulate LLM response (in real implementation, call actual LLM API)
            mock_response = f"AI response to: {prompt[:50]}..."
            context.variables[node.data.get("outputVariable", "llm_response")] = mock_response
            
            await self._add_trace(execution_id, node.id, "llm", {
                "prompt": prompt,
                "model": model,
                "temperature": temperature,
                "response": mock_response
            })
            return self._get_next_node_id(flow_definition, node.id)
        
        elif node.type == NodeType.API:
            # Make API call
            url = self._process_template(node.data.get("url", ""), context.variables)
            method = node.data.get("method", "GET")
            headers = node.data.get("headers", {})
            
            # Simulate API call (in real implementation, make actual HTTP request)
            mock_response = {"status": "success", "data": "mock_api_response"}
            context.variables[node.data.get("responseVariable", "api_response")] = mock_response
            
            await self._add_trace(execution_id, node.id, "api", {
                "url": url,
                "method": method,
                "headers": headers,
                "response": mock_response
            })
            return self._get_next_node_id(flow_definition, node.id)
        
        elif node.type == NodeType.HANDOFF:
            # Transfer to human agent
            reason = node.data.get("reason", "Customer request")
            department = node.data.get("department", "General Support")
            
            await self._add_trace(execution_id, node.id, "handoff", {
                "reason": reason,
                "department": department,
                "variables": context.variables
            })
            
            context.status = ExecutionStatus.COMPLETED  # End flow on handoff
            return None
        
        elif node.type == NodeType.END:
            # End execution
            await self._add_trace(execution_id, node.id, "end", {
                "final_variables": context.variables
            })
            return None
        
        else:
            raise ValueError(f"Unknown node type: {node.type}")
    
    def _get_next_node_id(self, flow_definition: FlowDefinition, current_node_id: str, 
                         source_handle: Optional[str] = None) -> Optional[str]:
        """Get next node ID from edges"""
        for edge in flow_definition.edges:
            if edge.source == current_node_id:
                if source_handle is None or edge.sourceHandle == source_handle:
                    return edge.target
        return None
    
    def _process_template(self, template: str, variables: Dict[str, Any]) -> str:
        """Process template strings with variable substitution"""
        try:
            # Simple variable substitution (in real implementation, use proper template engine)
            result = template
            for key, value in variables.items():
                result = result.replace(f"{{{key}}}", str(value))
            return result
        except Exception:
            return template
    
    def _evaluate_condition(self, condition: str, variables: Dict[str, Any]) -> bool:
        """Evaluate condition safely"""
        try:
            # Simple condition evaluation (in real implementation, use safe evaluator)
            # For now, just check if condition contains "true" or variable name exists
            if "true" in condition.lower():
                return True
            if "false" in condition.lower():
                return False
            
            # Check if any variable name in condition evaluates to truthy
            for key, value in variables.items():
                if key in condition:
                    return bool(value)
            
            return False
        except Exception:
            return False
    
    def _generate_mock_input(self, input_type: str) -> str:
        """Generate mock user input for testing"""
        mock_inputs = {
            "speech": "User said: Hello, I need help",
            "dtmf": "1",
            "text": "Hello"
        }
        return mock_inputs.get(input_type, "mock_input")
    
    async def _add_trace(self, execution_id: str, node_id: str, action: str, 
                        data: Dict[str, Any] = None, duration_ms: int = None, error: str = None):
        """Add execution trace"""
        context = self.active_executions.get(execution_id)
        if not context:
            return
        
        current_node = None
        if context.flow_id in self.flow_definitions:
            flow_def = self.flow_definitions[context.flow_id]
            current_node = next((n for n in flow_def.nodes if n.id == node_id), None)
        
        trace = ExecutionTrace(
            timestamp=datetime.now(),
            node_id=node_id,
            node_type=current_node.type if current_node else NodeType.START,
            action=action,
            data=data or {},
            duration_ms=duration_ms,
            error=error
        )
        
        context.trace.append(trace.dict())
        context.updated_at = datetime.now()
        
        # Broadcast trace to connected websockets
        await self._broadcast_trace(execution_id, trace)
    
    async def _broadcast_status(self, execution_id: str, context: ExecutionContext):
        """Broadcast execution status to websockets"""
        message = {
            "type": "status_update",
            "execution_id": execution_id,
            "status": context.status.value,
            "current_node_id": context.current_node_id,
            "variables": context.variables
        }
        await self._broadcast_message(execution_id, message)
    
    async def _broadcast_trace(self, execution_id: str, trace: ExecutionTrace):
        """Broadcast execution trace to websockets"""
        message = {
            "type": "trace",
            "execution_id": execution_id,
            "trace": trace.dict()
        }
        await self._broadcast_message(execution_id, message)
    
    async def _broadcast_message(self, execution_id: str, message: Dict[str, Any]):
        """Broadcast message to all connected websockets"""
        disconnected = []
        for conn_id, websocket in self.websocket_connections.items():
            try:
                await websocket.send_json(message)
            except:
                disconnected.append(conn_id)
        
        # Clean up disconnected websockets
        for conn_id in disconnected:
            del self.websocket_connections[conn_id]

# Global runtime engine instance
runtime_engine = FlowRuntimeEngine()

# API Endpoints
@app.post("/api/executions/start")
async def start_execution(flow_definition: FlowDefinition, call_data: Dict[str, Any] = None):
    """Start a new flow execution"""
    try:
        execution_id = await runtime_engine.start_execution(flow_definition, call_data)
        return {"execution_id": execution_id, "status": "started"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/executions/{execution_id}")
async def get_execution(execution_id: str):
    """Get execution details"""
    context = runtime_engine.active_executions.get(execution_id)
    if not context:
        raise HTTPException(status_code=404, detail="Execution not found")
    return context

@app.post("/api/executions/{execution_id}/pause")
async def pause_execution(execution_id: str):
    """Pause execution"""
    context = runtime_engine.active_executions.get(execution_id)
    if not context:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    context.status = ExecutionStatus.PAUSED
    context.updated_at = datetime.now()
    return {"status": "paused"}

@app.post("/api/executions/{execution_id}/resume")
async def resume_execution(execution_id: str):
    """Resume execution"""
    context = runtime_engine.active_executions.get(execution_id)
    if not context:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    if context.status == ExecutionStatus.PAUSED:
        context.status = ExecutionStatus.RUNNING
        context.updated_at = datetime.now()
        asyncio.create_task(runtime_engine._execute_flow(execution_id))
    
    return {"status": "resumed"}

@app.get("/api/executions")
async def list_executions():
    """List all executions"""
    return [
        {
            "execution_id": exec_id,
            "status": context.status.value,
            "created_at": context.created_at,
            "updated_at": context.updated_at
        }
        for exec_id, context in runtime_engine.active_executions.items()
    ]

# WebSocket endpoint for real-time updates
@app.websocket("/ws/executions")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connection_id = str(uuid.uuid4())
    runtime_engine.websocket_connections[connection_id] = websocket
    
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_json()
            if data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        del runtime_engine.websocket_connections[connection_id]

@app.get("/")
async def root():
    return {
        "name": "Vocelio Flow Runtime Engine",
        "version": "1.0.0",
        "status": "running",
        "active_executions": len(runtime_engine.active_executions),
        "websocket_connections": len(runtime_engine.websocket_connections)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
