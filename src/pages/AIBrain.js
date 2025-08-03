import React, { useState, useEffect } from 'react';
import { 
  Brain, Zap, Target, TrendingUp, Activity, AlertTriangle, CheckCircle,
  BarChart3, Settings, Play, Pause, RefreshCw, Maximize2, Eye,
  Cpu, Network, Database, Gauge, Sparkles, Flame, Crown, Star,
  MessageSquare, Phone, Users, DollarSign, Clock, Globe, Shield,
  Wand2, TestTube, Beaker, FlaskConical, MousePointer, Command,
  ArrowUpRight, ArrowDownRight, TrendingDown, AlertCircle, Info,
  LineChart, PieChart, Monitor, Headphones, Mic2, Volume2,
  ThumbsUp, ThumbsDown, Heart, Award, Trophy, Timer, Map
} from 'lucide-react';

const AIBrainCenter = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('intelligence');
  const [aiMetrics, setAiMetrics] = useState({
    overallScore: 94.7,
    optimizationsActive: 247,
    modelsRunning: 15,
    predictionsToday: 89234,
    accuracyRate: 97.3,
    learningRate: 0.0023,
    dataPoints: 2847392,
    activeConnections: 1847
  });

  const [liveInsights, setLiveInsights] = useState([
    {
      id: 1,
      type: 'critical',
      title: '🚨 Ultra High-Value Prospect Alert',
      description: 'AI detected 2,847 prospects with 95%+ booking probability',
      impact: '$47M potential revenue',
      confidence: 98.7,
      action: 'Priority dialing recommended',
      timestamp: '2m ago'
    },
    {
      id: 2,
      type: 'optimization',
      title: '⚡ Performance Boost Available',
      description: 'Switch 89% of Solar campaigns to "Confident Mike" voice',
      impact: '+34% success rate, +$2.3M revenue',
      confidence: 97.2,
      action: 'Auto-apply optimization',
      timestamp: '5m ago'
    },
    {
      id: 3,
      type: 'trend',
      title: '📈 Market Pattern Discovery',
      description: 'Peak performance window: 2:00-4:00 PM EST globally',
      impact: '+67% answer rate improvement',
      confidence: 94.1,
      action: 'Schedule smart timing',
      timestamp: '8m ago'
    },
    {
      id: 4,
      type: 'prediction',
      title: '🔮 Revenue Forecast Update',
      description: 'AI predicts 23% increase in Q4 conversions',
      impact: '$12.7M additional projected revenue',
      confidence: 91.8,
      action: 'Expand capacity planning',
      timestamp: '12m ago'
    }
  ]);

  const [neuralNetworks] = useState([
    {
      name: 'Conversation Optimizer',
      type: 'Deep Learning',
      accuracy: 97.3,
      status: 'active',
      description: 'Real-time conversation flow optimization',
      neurons: 2847392,
      layers: 156,
      trainingData: '847TB'
    },
    {
      name: 'Voice Emotion Detector',
      type: 'Neural Network',
      accuracy: 94.8,
      status: 'active',
      description: 'Advanced sentiment and emotion analysis',
      neurons: 1239847,
      layers: 89,
      trainingData: '234TB'
    },
    {
      name: 'Outcome Predictor',
      type: 'Transformer',
      accuracy: 91.7,
      status: 'training',
      description: 'Call outcome prediction with 95% accuracy',
      neurons: 3847291,
      layers: 234,
      trainingData: '1.2PB'
    },
    {
      name: 'Timing Optimizer',
      type: 'Reinforcement Learning',
      accuracy: 96.2,
      status: 'active',
      description: 'Optimal call timing across global time zones',
      neurons: 847392,
      layers: 67,
      trainingData: '456TB'
    }
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAiMetrics(prev => ({
        ...prev,
        overallScore: Math.max(85, Math.min(100, prev.overallScore + (Math.random() - 0.5) * 0.2)),
        predictionsToday: prev.predictionsToday + Math.floor(Math.random() * 10),
        accuracyRate: Math.max(90, Math.min(100, prev.accuracyRate + (Math.random() - 0.5) * 0.1)),
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 100),
        activeConnections: Math.max(1000, prev.activeConnections + Math.floor(Math.random() * 20) - 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend }) => {
    const getColorClasses = (colorName) => {
      const colorMap = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500' },
        green: { bg: 'bg-green-500/10', text: 'text-green-500', gradient: 'from-green-500 to-emerald-500' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', gradient: 'from-purple-500 to-pink-500' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', gradient: 'from-orange-500 to-red-500' },
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', gradient: 'from-cyan-500 to-blue-500' },
        red: { bg: 'bg-red-500/10', text: 'text-red-500', gradient: 'from-red-500 to-pink-500' }
      };
      return colorMap[colorName] || colorMap.blue;
    };

    const colors = getColorClasses(color);

    return (
      <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} 
        backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 group cursor-pointer relative overflow-hidden`}>
        
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            {trend !== undefined && (
              <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                <span className="font-medium">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <p className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-1`}>
              {value}
            </p>
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const InsightCard = ({ insight }) => {
    const getTypeConfig = (type) => {
      switch (type) {
        case 'critical':
          return { bg: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', icon: AlertTriangle, color: 'text-red-400' };
        case 'optimization':
          return { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', icon: Zap, color: 'text-green-400' };
        case 'trend':
          return { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', icon: TrendingUp, color: 'text-blue-400' };
        case 'prediction':
          return { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', icon: Brain, color: 'text-purple-400' };
        default:
          return { bg: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/30', icon: Info, color: 'text-gray-400' };
      }
    };

    const config = getTypeConfig(insight.type);
    const IconComponent = config.icon;

    return (
      <div className={`bg-gradient-to-br ${config.bg} backdrop-blur-sm border ${config.border} rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg bg-black/20 ${config.color}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-white">{insight.title}</h4>
              <p className="text-sm text-gray-300">{insight.timestamp}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold bg-white/10 text-white`}>
            {insight.confidence}% confidence
          </div>
        </div>

        <p className="text-gray-200 mb-4">{insight.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-white">{insight.impact}</p>
            <p className="text-sm text-gray-300">Projected Impact</p>
          </div>
        </div>

        <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-all transform group-hover:scale-105 border border-white/20">
          {insight.action}
        </button>
      </div>
    );
  };

  const NetworkCard = ({ network }) => (
    <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
      backdrop-blur-sm rounded-xl border p-6 hover:shadow-lg transition-all duration-300 group`}>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
            network.accuracy >= 95 ? 'from-green-500 to-emerald-500' :
            network.accuracy >= 90 ? 'from-blue-500 to-cyan-500' :
            'from-yellow-500 to-orange-500'
          } flex items-center justify-center`}>
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{network.name}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{network.type}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          network.status === 'active' ? 'bg-green-500/10 text-green-500' :
          network.status === 'training' ? 'bg-yellow-500/10 text-yellow-500' :
          'bg-gray-500/10 text-gray-500'
        }`}>
          {network.status}
        </div>
      </div>

      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
        {network.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className={`text-2xl font-bold ${network.accuracy >= 95 ? 'text-green-500' : network.accuracy >= 90 ? 'text-blue-500' : 'text-yellow-500'}`}>
            {network.accuracy}%
          </p>
          <p className="text-sm text-gray-500">Accuracy</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-500">{network.layers}</p>
          <p className="text-sm text-gray-500">Layers</p>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        {network.neurons.toLocaleString()} neurons • {network.trainingData} training data
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium">
          Monitor
        </button>
        <button className="flex-1 p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors text-sm font-medium">
          Optimize
        </button>
        <button className="p-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderAISection = () => {
    switch (activeSection) {
      case 'intelligence':
        return (
          <div className="space-y-8">
            {/* AI Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <MetricCard 
                icon={Brain} 
                title="AI Performance Score" 
                value={`${aiMetrics.overallScore.toFixed(1)}%`}
                subtitle="Global intelligence rating"
                color="purple"
                trend={2.3}
              />
              <MetricCard 
                icon={Zap} 
                title="Active Optimizations" 
                value={aiMetrics.optimizationsActive.toLocaleString()}
                subtitle="Running continuously"
                color="orange"
                trend={12.7}
              />
              <MetricCard 
                icon={Target} 
                title="Prediction Accuracy" 
                value={`${aiMetrics.accuracyRate.toFixed(1)}%`}
                subtitle="Real-time validation"
                color="green"
                trend={5.4}
              />
              <MetricCard 
                icon={Database} 
                title="Data Points Today" 
                value={`${(aiMetrics.dataPoints / 1000000).toFixed(1)}M`}
                subtitle="Processed and analyzed"
                color="cyan"
                trend={23.1}
              />
            </div>

            {/* Live AI Insights */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-purple-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl`}>
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold flex items-center space-x-3">
                  <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
                  <span>🧠 Live AI Intelligence Feed</span>
                  <div className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full animate-pulse">REAL-TIME</div>
                </h3>
                <div className="flex space-x-3">
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
                    View All Insights
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
                    Auto-Apply All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>

            {/* Neural Networks Dashboard */}
            <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <Network className="w-6 h-6 text-blue-500" />
                  <span>🧠 Neural Network Operations</span>
                </h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors">
                    Overview
                  </button>
                  <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
                    Performance
                  </button>
                  <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
                    Training
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {neuralNetworks.map((network, index) => (
                  <NetworkCard key={index} network={network} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl text-center`}>
              
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                ⚡ AI Optimization Engine
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto text-lg`}>
                Advanced machine learning algorithms continuously optimize your campaigns for maximum performance. 
                Real-time adjustments based on 2.8M+ data points.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Smart Targeting</h4>
                  <p className="text-sm text-gray-500">AI-powered prospect scoring</p>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Perfect Timing</h4>
                  <p className="text-sm text-gray-500">Global timezone optimization</p>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <Volume2 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Voice Matching</h4>
                  <p className="text-sm text-gray-500">Dynamic voice selection</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
                🚀 Launch Optimization
              </button>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-700/50' : 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-blue-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl text-center`}>
              
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                📊 Advanced AI Analytics
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto text-lg`}>
                Deep learning insights, predictive analytics, and real-time performance monitoring 
                across all your AI call center operations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <LineChart className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Predictive Insights</h4>
                  <p className="text-sm text-gray-500">Future performance forecasting</p>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Trend Analysis</h4>
                  <p className="text-sm text-gray-500">Market pattern recognition</p>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <Gauge className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Real-time Metrics</h4>
                  <p className="text-sm text-gray-500">Live performance dashboard</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
                📈 View Analytics
              </button>
            </div>
          </div>
        );

      case 'models':
        return (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-purple-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl text-center`}>
              
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cpu className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                🤖 AI Model Management
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto text-lg`}>
                Advanced machine learning models powering your AI call center. 
                Deploy, monitor, and optimize cutting-edge AI technology.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <Brain className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">GPT-4 Integration</h4>
                  <p className="text-sm text-gray-500">Advanced conversation AI</p>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <TestTube className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Custom Models</h4>
                  <p className="text-sm text-gray-500">Industry-specific training</p>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}`}>
                  <Activity className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Real-time Learning</h4>
                  <p className="text-sm text-gray-500">Continuous improvement</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
                🧠 Manage Models
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">AI Brain Section</h3>
            <p className="text-gray-500">Select a section from the navigation above</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800/90 via-purple-800/90 to-gray-800/90' : 'bg-gradient-to-r from-purple-50/90 via-pink-50/90 to-purple-50/90'} 
        rounded-3xl p-8 border ${darkMode ? 'border-purple-700/50' : 'border-purple-200/50'} relative overflow-hidden backdrop-blur-xl`}>
        
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                🧠 AI BRAIN CENTER
              </h1>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Advanced Artificial Intelligence • {aiMetrics.modelsRunning} Neural Networks Active
            </p>
            <p className="text-sm text-purple-500 font-medium">
              🤖 Real-time AI Operations • {aiMetrics.predictionsToday.toLocaleString()}+ Predictions Today • 99.97% Accuracy
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
              <div className="text-5xl font-bold text-purple-400 mb-2 animate-pulse">
                {aiMetrics.overallScore.toFixed(1)}%
              </div>
              <div className="text-sm font-medium text-purple-300">🧠 AI Performance</div>
              <div className="text-xs text-green-400 mt-1">+2.3% this hour</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                {aiMetrics.optimizationsActive}
              </div>
              <div className="text-sm font-medium text-blue-300">⚡ Live Optimizations</div>
              <div className="text-xs text-green-400 mt-1">Running continuously</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
              <div className="text-5xl font-bold text-green-400 mb-2">
                {aiMetrics.accuracyRate.toFixed(1)}%
              </div>
              <div className="text-sm font-medium text-green-300">🎯 Prediction Accuracy</div>
              <div className="text-xs text-green-400 mt-1">Industry leading</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
              <div className="text-5xl font-bold text-orange-400 mb-2">
                {aiMetrics.modelsRunning}
              </div>
              <div className="text-sm font-medium text-orange-300">🤖 Neural Networks</div>
              <div className="text-xs text-green-400 mt-1">All systems operational</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
              <Brain className="w-6 h-6" />
              <span>🧠 Deep Learning Hub</span>
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
              <Wand2 className="w-6 h-6" />
              <span>⚡ Auto-Optimization</span>
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl">
              <TestTube className="w-6 h-6" />
              <span>🧪 Model Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-2 backdrop-blur-sm`}>
        <nav className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'intelligence', label: '🧠 Intelligence', icon: Brain },
            { id: 'optimization', label: '⚡ Optimization', icon: Wand2 },
            { id: 'analytics', label: '📊 Analytics', icon: BarChart3 },
            { id: 'models', label: '🤖 Models', icon: Cpu },
            { id: 'training', label: '🎓 Training', icon: TestTube },
            { id: 'insights', label: '💡 Insights', icon: Sparkles }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                activeSection === id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      {renderAISection()}

      {/* Real-time Status Bar */}
      <div className={`${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} 
        rounded-xl border p-4 backdrop-blur-sm`}>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Systems: Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{aiMetrics.activeConnections.toLocaleString()} Active Connections</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-purple-500" />
              <span className="text-sm">{(aiMetrics.dataPoints / 1000000).toFixed(1)}M Data Points Processed</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Learning Rate: {aiMetrics.learningRate.toFixed(4)}
            </div>
            <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBrainCenter;