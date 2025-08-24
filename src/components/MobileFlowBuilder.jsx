import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Smartphone, Tablet, Monitor, RotateCcw, RotateCw, 
  Plus, Minus, Save, Download, Upload, Share2, 
  Play, Pause, Square, Settings, Info, HelpCircle,
  Zap, Phone, MessageSquare, Mail, Calendar,
  Search, Filter, Grid, List, Eye, EyeOff,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  Maximize2, Minimize2, Move, MousePointer, Hand,
  Layers, Box, Circle, Triangle, Star,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Link, Unlink, Copy, Trash2, Edit3, Check, X,
  Volume2, VolumeX, Mic, MicOff, Headphones,
  Wifi, WifiOff, Battery, Signal, MapPin,
  Clock, User, Users, Building, Globe, Shield,
  Database, Server, Cloud, Cpu, Memory,
  BarChart3, PieChart, LineChart, Activity, TrendingUp,
  Target, Award, Trophy, Flag, Tag, Bookmark,
  AlertTriangle, CheckCircle, XCircle, Info as InfoIcon,
  Loader, RefreshCw, Archive, Folder, File,
  Camera, Video, Image, Music, FileText, Code
} from 'lucide-react';

const MobileFlowBuilder = ({ 
  isOpen, 
  onClose, 
  nodes = [], 
  edges = [], 
  onNodesChange,
  onEdgesChange,
  onSave,
  onLoad,
  currentFlow = null 
}) => {
  // Mobile-specific state management
  const [orientation, setOrientation] = useState('portrait');
  const [deviceType, setDeviceType] = useState('mobile');
  const [touchMode, setTouchMode] = useState('pan');
  const [selectedTool, setSelectedTool] = useState('select');
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [panelOpen, setPanelOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('nodes');
  const [gestureState, setGestureState] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [connectionMode, setConnectionMode] = useState(false);
  const [sourceNode, setSourceNode] = useState(null);
  
  // Local nodes state for mobile builder
  const [localNodes, setLocalNodes] = useState(nodes);
  
  // Touch and gesture tracking
  const [touchStart, setTouchStart] = useState(null);
  const [lastTap, setLastTap] = useState(0);
  const [pinchDistance, setPinchDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  
  // Mobile UI state
  const [showToolbar, setShowToolbar] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  
  // Performance and accessibility
  const [performanceMode, setPerformanceMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [voiceControl, setVoiceControl] = useState(false);
  
  // Refs for touch handling
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gestureRef = useRef(null);
  
  // Mobile node types optimized for touch interaction
  const MOBILE_NODE_TYPES = {
    start: {
      label: 'Start',
      icon: Play,
      color: 'bg-green-500',
      category: 'flow',
      size: 'large',
      touchPriority: 'high'
    },
    voice_input: {
      label: 'Voice Input',
      icon: Mic,
      color: 'bg-blue-500',
      category: 'input',
      size: 'medium',
      touchPriority: 'high'
    },
    voice_output: {
      label: 'Voice Output',
      icon: Volume2,
      color: 'bg-purple-500',
      category: 'output',
      size: 'medium',
      touchPriority: 'high'
    },
    condition: {
      label: 'Condition',
      icon: ArrowRight,
      color: 'bg-yellow-500',
      category: 'logic',
      size: 'medium',
      touchPriority: 'medium'
    },
    api_call: {
      label: 'API Call',
      icon: Database,
      color: 'bg-indigo-500',
      category: 'integration',
      size: 'medium',
      touchPriority: 'medium'
    },
    transfer: {
      label: 'Transfer',
      icon: Phone,
      color: 'bg-orange-500',
      category: 'action',
      size: 'medium',
      touchPriority: 'high'
    },
    end: {
      label: 'End',
      icon: Square,
      color: 'bg-red-500',
      category: 'flow',
      size: 'large',
      touchPriority: 'high'
    },
    sms: {
      label: 'SMS',
      icon: MessageSquare,
      color: 'bg-teal-500',
      category: 'communication',
      size: 'small',
      touchPriority: 'medium'
    },
    email: {
      label: 'Email',
      icon: Mail,
      color: 'bg-pink-500',
      category: 'communication',
      size: 'small',
      touchPriority: 'medium'
    },
    webhook: {
      label: 'Webhook',
      icon: Zap,
      color: 'bg-cyan-500',
      category: 'integration',
      size: 'small',
      touchPriority: 'low'
    }
  };
  
  // Touch tools for mobile interaction
  const TOUCH_TOOLS = {
    select: { label: 'Select', icon: MousePointer, gesture: 'tap' },
    pan: { label: 'Pan', icon: Move, gesture: 'drag' },
    zoom: { label: 'Zoom', icon: Search, gesture: 'pinch' },
    connect: { label: 'Connect', icon: Link, gesture: 'drag' },
    delete: { label: 'Delete', icon: Trash2, gesture: 'tap' },
    hand: { label: 'Hand', icon: Hand, gesture: 'grab' }
  };
  
  // Mobile panels configuration
  const MOBILE_PANELS = {
    nodes: {
      title: 'Node Library',
      icon: Box,
      content: 'node_palette'
    },
    properties: {
      title: 'Properties',
      icon: Settings,
      content: 'node_properties'
    },
    minimap: {
      title: 'Overview',
      icon: Grid,
      content: 'flow_minimap'
    },
    settings: {
      title: 'Settings',
      icon: Settings,
      content: 'mobile_settings'
    }
  };

  // Device orientation and type detection
  useEffect(() => {
    const checkDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      
      setOrientation(isLandscape ? 'landscape' : 'portrait');
      
      if (width <= 768) {
        setDeviceType('mobile');
        setCompactMode(true);
      } else if (width <= 1024) {
        setDeviceType('tablet');
        setCompactMode(false);
      } else {
        setDeviceType('desktop');
        setCompactMode(false);
      }
    };
    
    checkDeviceInfo();
    window.addEventListener('resize', checkDeviceInfo);
    window.addEventListener('orientationchange', checkDeviceInfo);
    
    return () => {
      window.removeEventListener('resize', checkDeviceInfo);
      window.removeEventListener('orientationchange', checkDeviceInfo);
    };
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const now = Date.now();
    
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: now
    });
    
    // Double tap detection
    if (now - lastTap < 300) {
      handleDoubleTap(touch.clientX, touch.clientY);
    }
    setLastTap(now);
    
    // Multi-touch gesture detection
    if (e.touches.length === 2) {
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      setPinchDistance(distance);
      setGestureState('pinch');
    } else {
      setGestureState('single');
    }
  }, [lastTap]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    if (e.touches.length === 2 && gestureState === 'pinch') {
      // Handle pinch-to-zoom
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      
      if (pinchDistance > 0) {
        const scale = distance / pinchDistance;
        setViewport(prev => ({
          ...prev,
          zoom: Math.max(0.1, Math.min(3, prev.zoom * scale))
        }));
      }
      setPinchDistance(distance);
    } else if (touchMode === 'pan') {
      // Handle pan gesture
      setViewport(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setTouchStart({ x: touch.clientX, y: touch.clientY, timestamp: touchStart.timestamp });
      setIsDragging(true);
    }
  }, [touchStart, gestureState, pinchDistance, touchMode]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    setTouchStart(null);
    setGestureState(null);
    setPinchDistance(0);
    setIsDragging(false);
    setDragTarget(null);
  }, []);

  const handleDoubleTap = useCallback((x, y) => {
    // Double tap to zoom in/out
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = (x - rect.left) / viewport.zoom - viewport.x;
      const centerY = (y - rect.top) / viewport.zoom - viewport.y;
      
      setViewport(prev => ({
        x: centerX,
        y: centerY,
        zoom: prev.zoom >= 2 ? 1 : prev.zoom * 1.5
      }));
    }
  }, [viewport]);

  // Mobile toolbar actions
  const handleToolbarAction = useCallback((action) => {
    switch (action) {
      case 'add_node':
        setPanelOpen(true);
        setActivePanel('nodes');
        break;
      case 'zoom_in':
        setViewport(prev => ({ ...prev, zoom: Math.min(3, prev.zoom * 1.2) }));
        break;
      case 'zoom_out':
        setViewport(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom / 1.2) }));
        break;
      case 'zoom_fit':
        // Fit all nodes in view
        setViewport({ x: 0, y: 0, zoom: 1 });
        break;
      case 'toggle_grid':
        setSnapToGrid(!snapToGrid);
        break;
      case 'toggle_minimap':
        setShowMinimap(!showMinimap);
        break;
      case 'toggle_fullscreen':
        setFullscreen(!fullscreen);
        break;
      case 'save_flow':
        if (onSave) onSave(nodes, edges);
        break;
      case 'settings':
        setPanelOpen(true);
        setActivePanel('settings');
        break;
      default:
        console.log('Mobile action:', action);
    }
  }, [viewport, snapToGrid, showMinimap, fullscreen, nodes, edges, onSave]);

  // Mobile Node Palette Component
  const MobileNodePalette = () => (
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(MOBILE_NODE_TYPES).map(([type, config]) => {
        const Icon = config.icon;
        const sizeClass = config.size === 'large' ? 'col-span-2' : '';
        return (
          <button
            key={type}
            onClick={() => handleAddNode(type, config)}
            className={`${sizeClass} flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all touch-manipulation active:scale-95`}
            style={{ minHeight: '80px' }}
          >
            <div className={`flex items-center justify-center w-12 h-12 ${config.color} rounded-lg mb-2`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-800 text-center leading-tight">
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  // Handle adding mobile nodes
  const handleAddNode = (type, config) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: 'mobile',
      position: { 
        x: Math.random() * 300 + 50, 
        y: Math.random() * 200 + 50 
      },
      data: {
        label: config.label,
        icon: config.icon,
        color: config.color,
        category: config.category,
        touchArea: config.touchPriority === 'high' ? 80 : 60
      }
    };
    
    setLocalNodes(prev => [...prev, newNode]);
    
    // Provide haptic feedback on mobile devices
    if (navigator.vibrate && deviceType === 'mobile') {
      navigator.vibrate(50);
    }
  };

  // Create mobile node at specific position
  const createMobileNode = (type, position) => {
    const config = MOBILE_NODE_TYPES[type];
    if (!config) return;
    
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: 'mobile',
      position,
      data: {
        label: config.label,
        icon: config.icon,
        color: config.color,
        category: config.category,
        touchArea: config.touchPriority === 'high' ? 80 : 60
      }
    };
    
    setLocalNodes(prev => [...prev, newNode]);
    
    // Provide haptic feedback
    if (navigator.vibrate && deviceType === 'mobile') {
      navigator.vibrate(50);
    }
  };

  // Mobile settings panel
  const MobileSettingsPanel = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-3">Mobile Settings</div>
      
      {/* Device & Display */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Display</h4>
        <div className="space-y-2">
          <label className="flex items-center justify-between">
            <span className="text-sm">Compact Mode</span>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${compactMode ? 'bg-blue-600' : 'bg-gray-200'}`}
              onClick={() => setCompactMode(!compactMode)}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${compactMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">High Contrast</span>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highContrast ? 'bg-blue-600' : 'bg-gray-200'}`}
              onClick={() => setHighContrast(!highContrast)}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Large Text</span>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${largeText ? 'bg-blue-600' : 'bg-gray-200'}`}
              onClick={() => setLargeText(!largeText)}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${largeText ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
        </div>
      </div>

      {/* Touch & Gestures */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Touch & Gestures</h4>
        <div className="space-y-2">
          <label className="flex items-center justify-between">
            <span className="text-sm">Snap to Grid</span>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${snapToGrid ? 'bg-blue-600' : 'bg-gray-200'}`}
              onClick={() => setSnapToGrid(!snapToGrid)}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${snapToGrid ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
          <div className="space-y-1">
            <span className="text-sm">Touch Mode</span>
            <div className="flex space-x-2">
              {Object.entries(TOUCH_TOOLS).map(([tool, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={tool}
                    className={`flex-1 flex items-center justify-center p-2 rounded border ${
                      touchMode === tool 
                        ? 'bg-blue-100 border-blue-500 text-blue-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                    onClick={() => setTouchMode(tool)}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Performance</h4>
        <div className="space-y-2">
          <label className="flex items-center justify-between">
            <span className="text-sm">Performance Mode</span>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${performanceMode ? 'bg-blue-600' : 'bg-gray-200'}`}
              onClick={() => setPerformanceMode(!performanceMode)}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${performanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </label>
        </div>
      </div>

      {/* Device Info */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Device Info</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Type:</span>
            <span className="capitalize">{deviceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Orientation:</span>
            <span className="capitalize">{orientation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Zoom:</span>
            <span>{Math.round(viewport.zoom * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-white ${fullscreen ? 'pt-0' : 'pt-16'}`}>
      {/* Mobile Header */}
      <div className={`flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 ${fullscreen ? 'hidden' : 'block'}`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            {deviceType === 'mobile' && <Smartphone className="w-5 h-5 text-blue-600" />}
            {deviceType === 'tablet' && <Tablet className="w-5 h-5 text-blue-600" />}
            {deviceType === 'desktop' && <Monitor className="w-5 h-5 text-blue-600" />}
            <span className="text-lg font-semibold">Mobile Flow Builder</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToolbarAction('save_flow')}
            className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleToolbarAction('settings')}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-gray-50"
        style={{
          height: fullscreen ? '100vh' : 'calc(100vh - 120px)'
        }}
      >
        <div
          ref={canvasRef}
          className="absolute inset-0 touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Grid Pattern */}
          {snapToGrid && (
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="pointer-events-none">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}

          {/* Mobile-optimized nodes rendering */}
          <div className="absolute inset-0">
            {localNodes.map((node) => {
              const Icon = node.data?.icon;
              return (
                <div
                  key={node.id}
                  className={`absolute bg-white border-2 border-gray-300 rounded-xl p-4 shadow-lg touch-manipulation ${
                    compactMode ? 'transform scale-90' : ''
                  } ${largeText ? 'text-base' : 'text-sm'}`}
                  style={{
                    left: node.position?.x || 0,
                    top: node.position?.y || 0,
                    minWidth: node.data?.touchArea || 60,
                    minHeight: node.data?.touchArea || 60
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    {Icon && (
                      <div className={`flex items-center justify-center w-8 h-8 ${node.data.color || 'bg-gray-500'} rounded-lg mb-2`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`font-medium text-center leading-tight ${
                      largeText ? 'text-sm' : 'text-xs'
                    } ${highContrast ? 'text-black' : 'text-gray-800'}`}>
                      {node.data?.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini-map */}
        {showMinimap && (
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
            <div className="text-xs font-medium mb-1">Overview</div>
            <div className="relative w-full h-16 bg-gray-100 rounded">
              <div
                className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-30"
                style={{
                  left: `${Math.max(0, Math.min(80, viewport.x / 10))}%`,
                  top: `${Math.max(0, Math.min(60, viewport.y / 10))}%`,
                  width: `${20 / viewport.zoom}%`,
                  height: `${15 / viewport.zoom}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Toolbar */}
      {showToolbar && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-around">
            <button
              onClick={() => handleToolbarAction('add_node')}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100"
            >
              <Plus className="w-6 h-6 text-blue-600" />
              <span className="text-xs text-gray-600">Add</span>
            </button>
            <button
              onClick={() => handleToolbarAction('zoom_fit')}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100"
            >
              <Maximize2 className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-600">Fit</span>
            </button>
            <button
              onClick={() => handleToolbarAction('toggle_grid')}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 ${snapToGrid ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Grid className="w-6 h-6" />
              <span className="text-xs">Grid</span>
            </button>
            <button
              onClick={() => handleToolbarAction('toggle_fullscreen')}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100"
            >
              <Maximize2 className="w-6 h-6 text-gray-600" />
              <span className="text-xs text-gray-600">Full</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Side Panel */}
      {panelOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-4 max-h-2/3 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{MOBILE_PANELS[activePanel]?.title}</h3>
              <button
                onClick={() => setPanelOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex space-x-2 mb-4">
              {Object.entries(MOBILE_PANELS).map(([panel, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={panel}
                    onClick={() => setActivePanel(panel)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                      activePanel === panel 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              {activePanel === 'nodes' && <MobileNodePalette />}
              {activePanel === 'settings' && <MobileSettingsPanel />}
              {activePanel === 'properties' && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Select a node to edit properties</p>
                </div>
              )}
              {activePanel === 'minimap' && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Flow Overview</div>
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg border">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Flow visualization</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFlowBuilder;
