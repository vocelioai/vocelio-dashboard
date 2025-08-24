/**
 * AI Flow Optimizer Component
 * Intelligent analysis and optimization suggestions for voice flows
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Brain, Zap, Target, TrendingUp, AlertTriangle, CheckCircle,
  Lightbulb, BarChart3, PieChart, LineChart, Settings, RefreshCw,
  Star, Award, Flame, Rocket, Wand2, Sparkles, Bot, Cpu,
  ArrowRight, ArrowDown, ArrowUp, Circle, Square, Triangle,
  Eye, EyeOff, Play, Pause, FastForward, Rewind, SkipForward
} from 'lucide-react';

const AIFlowOptimizer = ({ flowData, onOptimizationApply, onAnalysisUpdate }) => {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [optimizationSuggestions, setSuggestionResults] = useState([]);
  const [selectedOptimization, setSelectedOptimization] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(false);
  const [aiInsights, setAiInsights] = useState({});

  // Mock AI analysis results (in real app, this would come from AI/ML service)
  const mockAnalysisResults = useMemo(() => ({
    overallScore: 87.3,
    performancePrediction: {
      successRate: 92.8,
      averageCallDuration: '4:32',
      completionRate: 89.4,
      customerSatisfaction: 4.2
    },
    flowMetrics: {
      totalNodes: 24,
      complexity: 'Medium',
      conversationDepth: 6,
      branchingFactor: 3.2,
      errorHandling: 'Good',
      fallbackCoverage: 85.7
    },
    bottlenecks: [
      {
        id: 'bottleneck-1',
        nodeId: 'node-qualification',
        type: 'high_dropout',
        severity: 'high',
        description: 'High customer dropout rate (32%) at qualification step',
        impact: 'Reduces overall completion rate by 15%',
        suggestion: 'Simplify qualification questions or add clarification prompts'
      },
      {
        id: 'bottleneck-2',
        nodeId: 'node-transfer',
        type: 'long_response_time',
        severity: 'medium',
        description: 'Response time exceeds 8 seconds for human transfer',
        impact: 'Customer satisfaction drops by 0.8 points',
        suggestion: 'Add progress indicators and estimated wait times'
      }
    ],
    opportunities: [
      {
        id: 'opportunity-1',
        type: 'personalization',
        priority: 'high',
        title: 'Add Dynamic Personalization',
        description: 'Customize greetings based on customer history and preferences',
        expectedImprovement: '+12% engagement, +8% satisfaction',
        implementationEffort: 'Medium'
      },
      {
        id: 'opportunity-2',
        type: 'smart_routing',
        priority: 'medium',
        title: 'Implement Smart Call Routing',
        description: 'Use AI to route calls to optimal agents based on context',
        expectedImprovement: '+15% first-call resolution',
        implementationEffort: 'High'
      }
    ]
  }), []);

  // Mock optimization suggestions
  const mockOptimizations = useMemo(() => [
    {
      id: 'opt-1',
      type: 'node_reordering',
      priority: 'high',
      title: 'Optimize Node Sequence',
      description: 'Reorder qualification questions for better flow',
      confidence: 94.2,
      expectedImprovement: '+18% completion rate',
      changes: [
        { action: 'move', nodeId: 'node-budget', newPosition: 2 },
        { action: 'move', nodeId: 'node-timeline', newPosition: 3 }
      ],
      reasoning: 'Budget questions earlier in flow reduce dropout by 23%'
    },
    {
      id: 'opt-2',
      type: 'prompt_optimization',
      priority: 'high',
      title: 'Enhanced Voice Prompts',
      description: 'AI-optimized prompts for better user understanding',
      confidence: 89.7,
      expectedImprovement: '+14% success rate',
      changes: [
        { action: 'update_prompt', nodeId: 'node-welcome', newPrompt: 'Hello! I\'m here to help you find the perfect solution. This will take just 2-3 minutes.' },
        { action: 'add_clarification', nodeId: 'node-qualification', clarification: 'Let me know if you need any of these options explained further.' }
      ],
      reasoning: 'Clear time expectations and offer clarification improves engagement'
    },
    {
      id: 'opt-3',
      type: 'error_handling',
      priority: 'medium',
      title: 'Smart Error Recovery',
      description: 'Add intelligent fallback paths for common errors',
      confidence: 91.5,
      expectedImprovement: '+22% error recovery',
      changes: [
        { action: 'add_fallback', nodeId: 'node-input', fallbackType: 'clarification' },
        { action: 'add_retry_logic', nodeId: 'node-payment', maxRetries: 2 }
      ],
      reasoning: 'Proactive error handling prevents 67% of call abandonments'
    },
    {
      id: 'opt-4',
      type: 'personalization',
      priority: 'medium',
      title: 'Dynamic Content Adaptation',
      description: 'Personalize content based on caller profile',
      confidence: 86.3,
      expectedImprovement: '+11% engagement',
      changes: [
        { action: 'add_personalization', nodeId: 'node-welcome', variables: ['customer_name', 'previous_interaction'] },
        { action: 'dynamic_content', nodeId: 'node-offers', criteria: 'customer_segment' }
      ],
      reasoning: 'Personalized experiences increase satisfaction by 31%'
    }
  ], []);

  // Perform AI analysis
  const performAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setAnalysisResults(mockAnalysisResults);
      setSuggestionResults(mockOptimizations);
      setOptimizationScore(mockAnalysisResults.overallScore);
      setIsAnalyzing(false);
      
      onAnalysisUpdate?.(mockAnalysisResults);
    }, 2000);
  }, [mockAnalysisResults, mockOptimizations, onAnalysisUpdate]);

  // Auto-run analysis when component mounts
  useEffect(() => {
    performAnalysis();
  }, [performAnalysis]);

  const applyOptimization = (optimization) => {
    setSelectedOptimization(optimization);
    onOptimizationApply?.(optimization);
    
    // Update score after applying optimization
    const improvementPercentage = parseFloat(optimization.expectedImprovement.match(/\+(\d+)%/)?.[1] || 0);
    setOptimizationScore(prev => Math.min(100, prev + improvementPercentage * 0.3));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-700/50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Flame className="w-4 h-4 text-red-500" />;
      case 'medium': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Circle className="w-4 h-4 text-green-500" />;
      default: return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* AI Score Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">AI Optimization Score</h3>
            <div className="text-3xl font-bold">{optimizationScore.toFixed(1)}/100</div>
            <p className="text-blue-100 mt-2">
              {optimizationScore >= 90 ? 'Excellent' : 
               optimizationScore >= 70 ? 'Good' : 
               optimizationScore >= 50 ? 'Fair' : 'Needs Improvement'}
            </p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40" cy="40" r="30"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="40" cy="40" r="30"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(optimizationScore / 100) * 188.5} 188.5`}
                strokeLinecap="round"
              />
            </svg>
            <Bot className="absolute inset-0 w-8 h-8 m-auto text-white" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysisResults?.performancePrediction.successRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysisResults?.performancePrediction.completionRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysisResults?.performancePrediction.customerSatisfaction}/5.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
          Top AI Recommendations
        </h3>
        <div className="space-y-4">
          {optimizationSuggestions.slice(0, 3).map((suggestion) => (
            <div key={suggestion.id} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              {getPriorityIcon(suggestion.priority)}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{suggestion.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{suggestion.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {suggestion.expectedImprovement}
                  </span>
                  <button
                    onClick={() => applyOptimization(suggestion)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Bottlenecks Tab
  const BottlenecksTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          Identified Bottlenecks
        </h3>
        
        {analysisResults?.bottlenecks.map((bottleneck) => (
          <div key={bottleneck.id} className="border dark:border-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(bottleneck.severity)}`}>
                  {bottleneck.severity.toUpperCase()}
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">Node: {bottleneck.nodeId}</h4>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-2">{bottleneck.description}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Impact: {bottleneck.impact}</p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Suggestion:</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{bottleneck.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Optimization Suggestions Tab
  const OptimizationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI-Powered Optimizations
        </h3>
        <button
          onClick={performAnalysis}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      <div className="grid gap-4">
        {optimizationSuggestions.map((optimization) => (
          <div key={optimization.id} className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getPriorityIcon(optimization.priority)}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{optimization.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{optimization.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {optimization.confidence}%
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Improvement:</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{optimization.expectedImprovement}</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Reasoning:</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{optimization.reasoning}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {optimization.changes.length} changes • {optimization.type.replace('_', ' ')}
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Preview
                </button>
                <button
                  onClick={() => applyOptimization(optimization)}
                  className="px-4 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Apply Optimization
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // AI Insights Tab
  const InsightsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Brain className="w-5 h-5 text-purple-500 mr-2" />
          AI-Generated Insights
        </h3>

        {analysisResults?.opportunities.map((opportunity) => (
          <div key={opportunity.id} className="border dark:border-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{opportunity.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  {getPriorityIcon(opportunity.priority)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">{opportunity.type}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {opportunity.implementationEffort} effort
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-3">{opportunity.description}</p>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">Expected Impact:</p>
              <p className="text-sm text-green-800 dark:text-green-200">{opportunity.expectedImprovement}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, component: OverviewTab },
    { id: 'bottlenecks', label: 'Bottlenecks', icon: AlertTriangle, component: BottlenecksTab },
    { id: 'optimizations', label: 'Optimizations', icon: Wand2, component: OptimizationsTab },
    { id: 'insights', label: 'AI Insights', icon: Brain, component: InsightsTab }
  ];

  if (isAnalyzing && !analysisResults) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Bot className="w-12 h-12 text-blue-500 animate-bounce mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-white">AI Analyzing Your Flow...</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Flow Optimizer</h2>
            <p className="text-gray-600 dark:text-gray-400">Intelligent analysis and optimization suggestions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Auto-optimize</span>
            <button
              onClick={() => setAutoOptimizeEnabled(!autoOptimizeEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                autoOptimizeEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoOptimizeEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b dark:border-gray-700">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {tabs.find(tab => tab.id === selectedTab)?.component()}
      </div>
    </div>
  );
};

export default AIFlowOptimizer;
