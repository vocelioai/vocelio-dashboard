import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, Stop, Volume2, VolumeX, Mic, MicOff,
  SkipForward, SkipBack, RotateCcw, Download, Share,
  PhoneCall, MessageSquare, Clock, User, Settings,
  Eye, Headphones, FileAudio, Waveform, CheckCircle
} from 'lucide-react';

// Voice Flow Preview and Testing Component
const VoiceFlowPreview = ({ flow, onFlowUpdate, isPreviewMode = false }) => {
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [userInputs, setUserInputs] = useState({});
  const [variables, setVariables] = useState({});
  const [callLogs, setCallLogs] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [previewMode, setPreviewMode] = useState('voice'); // voice, visual, mixed
  
  const audioRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Voice synthesis setup
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const currentNode = flow?.nodes?.[currentNodeIndex];

  const addCallLog = useCallback((message, type = 'info', nodeId = null) => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date(),
      message,
      type,
      nodeId: nodeId || currentNode?.id,
      nodeType: currentNode?.type
    };
    setCallLogs(prev => [...prev, logEntry]);
  }, [currentNode]);

  const speakText = useCallback(async (text, voice = 'alice', language = 'en-US') => {
    if (!text || !speechSynthesisRef.current) return;

    return new Promise((resolve) => {
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      utterance.volume = isMuted ? 0 : volume;
      utterance.lang = language;
      
      // Try to match voice preference
      const voices = speechSynthesisRef.current.getVoices();
      const selectedVoice = voices.find(v => 
        v.name.toLowerCase().includes(voice.toLowerCase()) ||
        (voice === 'alice' && v.name.toLowerCase().includes('female')) ||
        (voice === 'bob' && v.name.toLowerCase().includes('male'))
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        addCallLog(`🗣️ Finished speaking: "${text}"`);
        resolve();
      };

      utterance.onerror = (error) => {
        addCallLog(`❌ Speech error: ${error.error}`, 'error');
        resolve();
      };

      addCallLog(`🗣️ Speaking: "${text}" (${voice}, ${language})`);
      speechSynthesisRef.current.speak(utterance);
    });
  }, [playbackSpeed, volume, isMuted, addCallLog]);

  const executeNode = useCallback(async (node) => {
    if (!node) return;

    addCallLog(`▶️ Executing ${node.type} node: ${node.data?.label || node.id}`, 'info');

    switch (node.type) {
      case 'voice':
        await speakText(
          node.data?.message || 'No message configured',
          node.data?.voice || 'alice',
          node.data?.language || 'en-US'
        );
        break;

      case 'input':
        addCallLog(`🎤 Waiting for input: ${node.data?.prompt || 'Please provide input'}`, 'input');
        
        // Simulate input collection or wait for actual input
        if (isPreviewMode) {
          const mockInput = userInputs[node.id] || 'Sample response';
          addCallLog(`📝 Received input: "${mockInput}"`, 'success');
          
          if (node.data?.variableName) {
            setVariables(prev => ({
              ...prev,
              [node.data.variableName]: mockInput
            }));
          }
        }
        break;

      case 'condition':
        const conditions = node.data?.conditions || [];
        const logic = node.data?.logic || 'AND';
        
        let conditionResult = logic === 'AND';
        
        conditions.forEach(condition => {
          const fieldValue = variables[condition.field] || userInputs[condition.field] || '';
          let result = false;
          
          switch (condition.operator) {
            case 'equals':
              result = fieldValue === condition.value;
              break;
            case 'contains':
              result = fieldValue.includes(condition.value);
              break;
            case 'greater_than':
              result = parseFloat(fieldValue) > parseFloat(condition.value);
              break;
            default:
              result = false;
          }
          
          if (logic === 'AND') {
            conditionResult = conditionResult && result;
          } else {
            conditionResult = conditionResult || result;
          }
        });

        addCallLog(`🔀 Condition result: ${conditionResult}`, conditionResult ? 'success' : 'warning');
        break;

      case 'action':
        const actionType = node.data?.actionType || 'unknown';
        
        switch (actionType) {
          case 'transfer':
            addCallLog(`📞 Transferring call to: ${node.data?.target}`, 'info');
            break;
          case 'send_sms':
            addCallLog(`📱 Sending SMS to: ${node.data?.phoneNumber}`, 'info');
            break;
          case 'store_data':
            addCallLog(`💾 Storing data: ${node.data?.dataKey}`, 'info');
            break;
          case 'hangup':
            addCallLog(`📴 Hanging up call - Reason: ${node.data?.reason || 'completed'}`, 'info');
            break;
          default:
            addCallLog(`⚡ Executing action: ${actionType}`, 'info');
        }
        break;

      case 'api':
        addCallLog(`🔗 Making API call to: ${node.data?.url}`, 'info');
        
        // Simulate API call
        setTimeout(() => {
          addCallLog(`✅ API call completed successfully`, 'success');
          
          if (node.data?.responseVariable) {
            setVariables(prev => ({
              ...prev,
              [node.data.responseVariable]: { success: true, data: 'Mock API response' }
            }));
          }
        }, 1000);
        break;

      default:
        addCallLog(`❓ Unknown node type: ${node.type}`, 'warning');
    }
  }, [speakText, userInputs, variables, isPreviewMode, addCallLog]);

  const playFlow = useCallback(async () => {
    if (!flow?.nodes?.length) return;
    
    setIsPlaying(true);
    setIsPaused(false);
    addCallLog('🚀 Starting flow playback', 'info');
    
    try {
      for (let i = currentNodeIndex; i < flow.nodes.length; i++) {
        if (!isPlaying) break;
        
        setCurrentNodeIndex(i);
        await executeNode(flow.nodes[i]);
        
        // Add delay between nodes
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      addCallLog('✅ Flow playback completed', 'success');
    } catch (error) {
      addCallLog(`❌ Flow playback error: ${error.message}`, 'error');
    } finally {
      setIsPlaying(false);
    }
  }, [flow, currentNodeIndex, isPlaying, executeNode, addCallLog]);

  const pauseFlow = useCallback(() => {
    setIsPaused(true);
    setIsPlaying(false);
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.pause();
    }
    addCallLog('⏸️ Flow playback paused', 'info');
  }, [addCallLog]);

  const stopFlow = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentNodeIndex(0);
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    addCallLog('⏹️ Flow playback stopped', 'info');
  }, [addCallLog]);

  const stepForward = useCallback(() => {
    if (currentNodeIndex < (flow?.nodes?.length || 0) - 1) {
      const nextIndex = currentNodeIndex + 1;
      setCurrentNodeIndex(nextIndex);
      executeNode(flow.nodes[nextIndex]);
    }
  }, [currentNodeIndex, flow, executeNode]);

  const stepBackward = useCallback(() => {
    if (currentNodeIndex > 0) {
      setCurrentNodeIndex(currentNodeIndex - 1);
    }
  }, [currentNodeIndex]);

  const resetFlow = useCallback(() => {
    stopFlow();
    setUserInputs({});
    setVariables({});
    setCallLogs([]);
    addCallLog('🔄 Flow reset to beginning', 'info');
  }, [stopFlow, addCallLog]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        addCallLog(`🎵 Recording saved: ${url}`, 'success');
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      addCallLog('🔴 Started recording', 'info');
    } catch (error) {
      addCallLog(`❌ Recording error: ${error.message}`, 'error');
    }
  }, [addCallLog]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    addCallLog('⏹️ Stopped recording', 'info');
  }, [addCallLog]);

  const exportFlowAudio = useCallback(async () => {
    if (!flow?.nodes?.length) return;
    
    addCallLog('📦 Exporting flow as audio...', 'info');
    
    try {
      // This would generate audio for the entire flow
      const audioData = await generateFlowAudio(flow);
      const blob = new Blob([audioData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `flow-audio-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addCallLog('✅ Flow audio exported successfully', 'success');
    } catch (error) {
      addCallLog(`❌ Export error: ${error.message}`, 'error');
    }
  }, [flow, addCallLog]);

  // Mock function for audio generation
  const generateFlowAudio = async (flow) => {
    // This would use Web Audio API to generate audio
    return new ArrayBuffer(1024);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNodeIcon = (nodeType) => {
    switch (nodeType) {
      case 'voice': return <Volume2 className="w-4 h-4" />;
      case 'input': return <Mic className="w-4 h-4" />;
      case 'condition': return <MessageSquare className="w-4 h-4" />;
      case 'action': return <PhoneCall className="w-4 h-4" />;
      case 'api': return <Settings className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (!flow?.nodes?.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
        <FileAudio className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Flow to Preview</h3>
        <p className="text-gray-600">Create a flow with voice nodes to start previewing.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Voice Flow Preview</h3>
              <p className="text-sm text-gray-600">
                Test and preview your voice flow in real-time
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Preview Mode Toggle */}
            <select
              value={previewMode}
              onChange={(e) => setPreviewMode(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="voice">Voice Only</option>
              <option value="visual">Visual Only</option>
              <option value="mixed">Voice + Visual</option>
            </select>
            
            <button
              onClick={exportFlowAudio}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-md"
              title="Export as Audio"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Control Panel */}
          <div className="space-y-4">
            
            {/* Playback Controls */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Playback Controls</h4>
              
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={isPlaying ? pauseFlow : playFlow}
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={stopFlow}
                  className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                  title="Stop"
                >
                  <Stop className="w-4 h-4" />
                </button>
                
                <button
                  onClick={stepBackward}
                  className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                  title="Previous Node"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                
                <button
                  onClick={stepForward}
                  className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                  title="Next Node"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                
                <button
                  onClick={resetFlow}
                  className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                  title="Reset Flow"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Audio Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volume
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600">{Math.round(volume * 100)}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speed
                  </label>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Recording</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isRecording 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Start Recording</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Current Node Info */}
            {currentNode && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  {getNodeIcon(currentNode.type)}
                  <span>Current Node</span>
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Type:</strong> {currentNode.type}</div>
                  <div><strong>Label:</strong> {currentNode.data?.label || currentNode.id}</div>
                  <div><strong>Position:</strong> {currentNodeIndex + 1} of {flow.nodes.length}</div>
                  {currentNode.data?.message && (
                    <div><strong>Message:</strong> {currentNode.data.message}</div>
                  )}
                  {currentNode.data?.prompt && (
                    <div><strong>Prompt:</strong> {currentNode.data.prompt}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logs and Variables Panel */}
          <div className="space-y-4">
            
            {/* Call Logs */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Call Logs</h4>
                <button
                  onClick={() => setCallLogs([])}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-1 text-sm font-mono">
                {callLogs.map(log => (
                  <div
                    key={log.id}
                    className={`flex items-start space-x-2 ${
                      log.type === 'error' ? 'text-red-600' :
                      log.type === 'success' ? 'text-green-600' :
                      log.type === 'warning' ? 'text-yellow-600' :
                      log.type === 'input' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}
                  >
                    <span className="text-xs text-gray-400 mt-0.5">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                ))}
                
                {callLogs.length === 0 && (
                  <div className="text-gray-500 text-center py-4">
                    No logs yet. Start playing the flow to see activity.
                  </div>
                )}
              </div>
            </div>

            {/* Variables */}
            {Object.keys(variables).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Flow Variables</h4>
                <div className="space-y-2">
                  {Object.entries(variables).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2 text-sm">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceFlowPreview;
