import React, { useState } from 'react';
import { 
  Mic2, Play, Pause, Download, Upload, Settings, BarChart3, 
  TestTube, Wand2, Users, Globe, Volume2, VolumeX, Eye,
  Sparkles, Target, TrendingUp, Clock, Star, Award,
  Copy, Edit, Trash2, RefreshCw, Filter, Search,
  ChevronDown, ChevronUp, Headphones, Sliders, Zap,
  FileAudio, Waves, Activity, Brain, Cpu, Database,
  CheckCircle, XCircle, AlertCircle, Info, ArrowRight,
  Maximize2, Minimize2, RotateCcw, Share2, ExternalLink,
  Heart, ThumbsUp, ThumbsDown, MessageSquare, Phone
} from 'lucide-react';

const VoiceLabPage = () => {
  const [activeTab, setActiveTab] = useState('voices');
  const [selectedVoices, setSelectedVoices] = useState([]);
  const [isPlaying, setIsPlaying] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  // Voice data with all the features from your backend
  const [voices] = useState([
    {
      voice_id: "21m00Tcm4TlvDq8ikWAM",
      name: "Rachel - Professional",
      gender: "female",
      age: "young",
      accent: "american",
      language: "en",
      description: "Calm, professional female voice perfect for business calls and customer service",
      use_case: "business",
      category: "premade",
      quality_score: 95,
      performance: { usage_count: 15420, avg_sentiment: 0.78, success_rate: 73.2 },
      settings: { stability: 0.7, similarity_boost: 0.8, style: 0.2 },
      preview_url: "/api/voices/preview/rachel.mp3",
      cost_per_char: 0.00018,
      available_for_tiers: ["free", "starter", "pro", "enterprise"]
    },
    {
      voice_id: "EXAVITQu4vr4xnSDxMaL",
      name: "Bella - Warm Sales",
      gender: "female",
      age: "young",
      accent: "american", 
      language: "en",
      description: "Friendly, warm female voice excellent for sales calls and customer engagement",
      use_case: "sales",
      category: "premade",
      quality_score: 92,
      performance: { usage_count: 12890, avg_sentiment: 0.82, success_rate: 76.8 },
      settings: { stability: 0.6, similarity_boost: 0.85, style: 0.4 },
      preview_url: "/api/voices/preview/bella.mp3",
      cost_per_char: 0.00018,
      available_for_tiers: ["starter", "pro", "enterprise"]
    },
    {
      voice_id: "VR6AewLTigWG4xSOukaG",
      name: "Sofia - Spanish Native",
      gender: "female",
      age: "young",
      accent: "spanish",
      language: "es",
      description: "Native Spanish speaker perfect for Spanish-language calling campaigns",
      use_case: "multilingual",
      category: "premade",
      quality_score: 89,
      performance: { usage_count: 4200, avg_sentiment: 0.75, success_rate: 71.5 },
      settings: { stability: 0.65, similarity_boost: 0.8, style: 0.35 },
      preview_url: "/api/voices/preview/sofia.mp3",
      cost_per_char: 0.00024,
      available_for_tiers: ["pro", "enterprise"]
    },
    {
      voice_id: "pNInz6obpgDQGcFmaJgB",
      name: "Adam - Executive",
      gender: "male",
      age: "middle_aged",
      accent: "american",
      language: "en",
      description: "Professional male voice for formal business communication and executive calls",
      use_case: "executive",
      category: "premade",
      quality_score: 90,
      performance: { usage_count: 7120, avg_sentiment: 0.69, success_rate: 65.9 },
      settings: { stability: 0.8, similarity_boost: 0.75, style: 0.3 },
      preview_url: "/api/voices/preview/adam.mp3",
      cost_per_char: 0.00018,
      available_for_tiers: ["starter", "pro", "enterprise"]
    },
    {
      voice_id: "custom_001",
      name: "CEO Clone - Premium",
      gender: "male",
      age: "middle_aged",
      accent: "american",
      language: "en",
      description: "Custom cloned voice for enterprise branding and executive communications",
      use_case: "executive",
      category: "cloned",
      quality_score: 87,
      performance: { usage_count: 850, avg_sentiment: 0.74, success_rate: 68.2 },
      settings: { stability: 0.75, similarity_boost: 0.9, style: 0.25 },
      preview_url: "/api/voices/preview/ceo.mp3",
      cost_per_char: 0.00035,
      available_for_tiers: ["enterprise"]
    }
  ]);

  const [testResults, setTestResults] = useState({});
  const [voiceComparison, setVoiceComparison] = useState(null);
  const [analytics, setAnalytics] = useState({});

  const handlePlayVoice = (voiceId) => {
    // Toggle play state
    setIsPlaying(prev => ({
      ...prev,
      [voiceId]: !prev[voiceId]
    }));
    
    // Simulate audio playback
    if (!isPlaying[voiceId]) {
      // Stop other playing voices
      setIsPlaying({ [voiceId]: true });
      
      // Auto-stop after 3 seconds (simulated audio duration)
      setTimeout(() => {
        setIsPlaying(prev => ({ ...prev, [voiceId]: false }));
      }, 3000);
    }
  };

  const handleCloneVoice = (voiceId) => {
    alert(`🔬 Voice cloning started for voice ID: ${voiceId}\n\nThis would typically:\n1. Upload audio sample\n2. Process with AI\n3. Generate voice model\n4. Test & validate\n\nFeature available in production!`);
  };

  // Filter voices based on search and filters
  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         voice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || voice.language === filterLanguage;
    const matchesGender = filterGender === 'all' || voice.gender === filterGender;
    
    return matchesSearch && matchesLanguage && matchesGender;
  });

  // Get unique languages and genders for filters
  const languages = [...new Set(voices.map(v => v.language))];
  const genders = [...new Set(voices.map(v => v.gender))];

  const playVoice = async (voiceId, text = "Hello, this is a test of this voice. How does it sound for your calling campaigns?") => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying({});
    }

    setIsPlaying({[voiceId]: true});
    
    try {
      // Simulate API call to generate and play voice
      const response = await fetch('/api/voices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice_id: voiceId, text })
      });
      
      if (response.ok) {
        const audio = new Audio('/api/voices/preview/' + voiceId + '.mp3');
        audio.onended = () => {
          setIsPlaying({});
          setCurrentAudio(null);
        };
        audio.play();
        setCurrentAudio(audio);
      }
    } catch (error) {
      console.error('Error playing voice:', error);
      setIsPlaying({});
    }
  };

  const stopPlayback = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying({});
    }
  };

  const testVoiceQuality = async (voiceId) => {
    setTestResults({...testResults, [voiceId]: 'testing'});
    
    // Simulate quality test
    setTimeout(() => {
      const result = {
        overall_score: 85 + Math.random() * 15,
        clarity: 90 + Math.random() * 10,
        naturalness: 85 + Math.random() * 15,
        consistency: 88 + Math.random() * 12,
        emotion_range: 80 + Math.random() * 20,
        recommendation: "Excellent for professional business calls",
        tested_phrases: 5,
        generation_time: 2.3 + Math.random() * 2
      };
      setTestResults({...testResults, [voiceId]: result});
    }, 3000);
  };

  const compareVoices = async () => {
    if (selectedVoices.length < 2) return;
    
    setIsGenerating(true);
    
    // Simulate voice comparison
    setTimeout(() => {
      const comparison = {
        sample_text: "Hello, this is a comparison test to help you choose the best voice for your campaigns.",
        voices: selectedVoices.map(voiceId => {
          const voice = voices.find(v => v.voice_id === voiceId);
          return {
            ...voice,
            comparison_score: 75 + Math.random() * 25,
            generation_time: 1.5 + Math.random() * 2,
            audio_url: `/api/voices/comparison/${voiceId}.mp3`
          };
        }).sort((a, b) => b.comparison_score - a.comparison_score)
      };
      setVoiceComparison(comparison);
      setIsGenerating(false);
      setActiveTab('comparison');
    }, 4000);
  };

  const cloneVoice = async (file, name, description) => {
    const formData = new FormData();
    formData.append('audio_file', file);
    formData.append('voice_name', name);
    formData.append('description', description);

    try {
      const response = await fetch('/api/voices/clone', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        // Handle successful cloning
        console.log('Voice cloned successfully:', result);
      }
    } catch (error) {
      console.error('Error cloning voice:', error);
    }
  };

  const VoiceCard = ({ voice }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
            voice.quality_score >= 95 ? 'from-green-500 to-emerald-500' :
            voice.quality_score >= 90 ? 'from-blue-500 to-cyan-500' :
            voice.quality_score >= 85 ? 'from-purple-500 to-pink-500' :
            'from-yellow-500 to-orange-500'
          } flex items-center justify-center`}>
            {voice.category === 'cloned' ? <Users className="w-6 h-6 text-white" /> : <Mic2 className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="font-bold text-lg">{voice.name}</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                voice.language === 'en' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                voice.language === 'es' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {voice.language.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">{voice.gender} • {voice.accent}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedVoices.includes(voice.voice_id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedVoices([...selectedVoices, voice.voice_id]);
              } else {
                setSelectedVoices(selectedVoices.filter(id => id !== voice.voice_id));
              }
            }}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
            voice.category === 'cloned' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {voice.category === 'cloned' ? 'CUSTOM' : 'PREMIUM'}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {voice.description}
      </p>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality Score</span>
            <span className={`text-lg font-bold ${
              voice.quality_score >= 95 ? 'text-green-500' :
              voice.quality_score >= 90 ? 'text-blue-500' :
              voice.quality_score >= 85 ? 'text-purple-500' :
              'text-yellow-500'
            }`}>
              {voice.quality_score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                voice.quality_score >= 95 ? 'bg-green-500' :
                voice.quality_score >= 90 ? 'bg-blue-500' :
                voice.quality_score >= 85 ? 'bg-purple-500' :
                'bg-yellow-500'
              }`}
              style={{ width: `${voice.quality_score}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Success Rate</span>
            <span className="text-lg font-bold text-cyan-500">
              {voice.performance.success_rate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className="h-2 rounded-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${voice.performance.success_rate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{voice.performance.usage_count.toLocaleString()} calls</span>
        <span>${voice.cost_per_char * 1000}/1k chars</span>
        <span>⭐ {voice.performance.avg_sentiment.toFixed(2)} sentiment</span>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => isPlaying[voice.voice_id] ? stopPlayback() : playVoice(voice.voice_id)}
            className={`p-2 rounded-lg transition-all transform hover:scale-105 ${
              isPlaying[voice.voice_id] 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isPlaying[voice.voice_id] ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => testVoiceQuality(voice.voice_id)}
            className={`p-2 rounded-lg transition-all transform hover:scale-105 ${
              testResults[voice.voice_id] === 'testing'
                ? 'bg-yellow-500 text-white'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            disabled={testResults[voice.voice_id] === 'testing'}
          >
            {testResults[voice.voice_id] === 'testing' ? 
              <RefreshCw className="w-4 h-4 animate-spin" /> : 
              <TestTube className="w-4 h-4" />
            }
          </button>
          
          <button className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all transform hover:scale-105">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1">
          {voice.available_for_tiers.includes('enterprise') && (
            <Award className="w-4 h-4 text-yellow-500" title="Enterprise" />
          )}
          {voice.quality_score >= 95 && (
            <Star className="w-4 h-4 text-yellow-500" title="Top Quality" />
          )}
          {voice.performance.success_rate >= 75 && (
            <TrendingUp className="w-4 h-4 text-green-500" title="High Performance" />
          )}
        </div>
      </div>

      {/* Test Results */}
      {testResults[voice.voice_id] && testResults[voice.voice_id] !== 'testing' && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">Quality Test Results</span>
            <span className="text-lg font-bold text-green-500">
              {testResults[voice.voice_id].overall_score.toFixed(1)}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Clarity: {testResults[voice.voice_id].clarity.toFixed(1)}%</div>
            <div>Natural: {testResults[voice.voice_id].naturalness.toFixed(1)}%</div>
            <div>Consistent: {testResults[voice.voice_id].consistency.toFixed(1)}%</div>
            <div>Emotional: {testResults[voice.voice_id].emotion_range.toFixed(1)}%</div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {testResults[voice.voice_id].recommendation}
          </p>
        </div>
      )}
    </div>
  );

  const ComparisonResults = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <span>Voice Comparison Results</span>
        </h3>
        
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Sample Text: "{voiceComparison?.sample_text}"
          </p>
        </div>

        <div className="grid gap-4">
          {voiceComparison?.voices.map((voice, index) => (
            <div key={voice.voice_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-gold bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  'bg-orange-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold">{voice.name}</h4>
                  <p className="text-sm text-gray-500">{voice.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-green-500">
                    {voice.comparison_score.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {voice.generation_time.toFixed(1)}s generation
                  </div>
                </div>
                
                <button
                  onClick={() => playVoice(voice.voice_id, voiceComparison.sample_text)}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => setVoiceComparison(null)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            Clear Results
          </button>
        </div>
      </div>
    </div>
  );

  const VoiceCloner = () => {
    const [cloneFile, setCloneFile] = useState(null);
    const [cloneName, setCloneName] = useState('');
    const [cloneDescription, setCloneDescription] = useState('');
    const [isCloning, setIsCloning] = useState(false);

    const handleClone = async () => {
      if (!cloneFile || !cloneName) return;
      
      setIsCloning(true);
      // Simulate cloning process
      setTimeout(() => {
        setIsCloning(false);
        setCloneFile(null);
        setCloneName('');
        setCloneDescription('');
        // Show success message
      }, 8000);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-500" />
            <span>Voice Cloning Lab</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs rounded-full font-bold">
              ENTERPRISE
            </span>
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-3">Upload Audio Sample</h4>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drop your audio file here or click to browse
                </p>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setCloneFile(e.target.files[0])}
                  className="hidden"
                  id="voice-upload"
                />
                <label 
                  htmlFor="voice-upload"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer inline-block"
                >
                  Choose File
                </label>
                {cloneFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✅ {cloneFile.name} ({(cloneFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>• Minimum 1 minute of clear speech</p>
                <p>• Maximum file size: 10MB</p>
                <p>• Supported formats: MP3, WAV, M4A</p>
                <p>• Best quality: 16kHz, mono, noise-free</p>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Voice Name</label>
                  <input
                    type="text"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    placeholder="e.g., CEO Voice, Customer Service Rep"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={cloneDescription}
                    onChange={(e) => setCloneDescription(e.target.value)}
                    placeholder="Describe the voice characteristics and intended use..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>

                <button
                  onClick={handleClone}
                  disabled={!cloneFile || !cloneName || isCloning}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    isCloning
                      ? 'bg-yellow-500 text-white'
                      : cloneFile && cloneName
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isCloning ? (
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Cloning Voice... (3-5 mins)</span>
                    </div>
                  ) : (
                    'Clone Voice'
                  )}
                </button>
              </div>
            </div>
          </div>

          {isCloning && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-800 dark:text-yellow-200">AI Voice Cloning in Progress</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Our advanced AI is analyzing your voice sample and creating a high-quality clone. 
                This process typically takes 3-5 minutes for optimal results.
              </p>
              <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2 mt-3">
                <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-2xl p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              🎙️ Voice Lab - Advanced Voice Management
            </h1>
            <p className="text-gray-400">
              Test, compare, clone and optimize AI voices for maximum performance
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={compareVoices}
              disabled={selectedVoices.length < 2 || isGenerating}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 ${
                selectedVoices.length >= 2 && !isGenerating
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Comparing...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span>Compare Voices ({selectedVoices.length})</span>
                </>
              )}
            </button>
            
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Clone Voice</span>
            </button>
            
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2">
              <TestTube className="w-5 h-5" />
              <span>Batch Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2">
        <div className="flex space-x-2">
          {[
            { id: 'voices', label: 'Voice Library', icon: Mic2, count: filteredVoices.length },
            { id: 'comparison', label: 'Voice Comparison', icon: BarChart3, count: voiceComparison?.voices?.length || 0 },
            { id: 'cloning', label: 'Voice Cloning', icon: Users, badge: 'ENTERPRISE' },
            { id: 'analytics', label: 'Performance Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Voice Settings', icon: Settings },
            { id: 'batch', label: 'Batch Operations', icon: Zap }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'voices' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search voices by name, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 w-80"
                  />
                </div>
                
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="all">All Languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
                
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="all">All Genders</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Advanced</span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                <div className="text-sm text-gray-500">
                  {selectedVoices.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                      {selectedVoices.length} selected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quality Score</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700">
                      <option value="all">All Scores</option>
                      <option value="95+">95%+ (Premium)</option>
                      <option value="90+">90%+ (High)</option>
                      <option value="85+">85%+ (Good)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Use Case</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700">
                      <option value="all">All Use Cases</option>
                      <option value="business">Business</option>
                      <option value="sales">Sales</option>
                      <option value="executive">Executive</option>
                      <option value="multilingual">Multilingual</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Voice Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700">
                      <option value="all">All Categories</option>
                      <option value="premade">Premade</option>
                      <option value="cloned">Custom Cloned</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Pricing Tier</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700">
                      <option value="all">All Tiers</option>
                      <option value="free">Free Tier</option>
                      <option value="starter">Starter+</option>
                      <option value="pro">Pro+</option>
                      <option value="enterprise">Enterprise Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Voice Library Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVoices.map(voice => (
              <VoiceCard key={voice.voice_id} voice={voice} />
            ))}
          </div>

          {filteredVoices.length === 0 && (
            <div className="text-center py-12">
              <Mic2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No voices found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'comparison' && (
        voiceComparison ? <ComparisonResults /> : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Voice Comparison Lab</h3>
            <p className="text-gray-500 mb-6">
              Select 2 or more voices from the Voice Library to run a detailed comparison analysis
            </p>
            <button
              onClick={() => setActiveTab('voices')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
            >
              Go to Voice Library
            </button>
          </div>
        )
      )}

      {activeTab === 'cloning' && <VoiceCloner />}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <span>Voice Performance Analytics</span>
            </h3>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">247</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Voices</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600">94.2%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Quality</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">73.1%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">$0.18</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Cost/1k chars</div>
              </div>
            </div>

            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Advanced Analytics Dashboard</p>
                <p className="text-sm text-gray-500">
                  Interactive charts showing voice performance trends, usage patterns, and optimization insights
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Settings className="w-6 h-6 text-blue-500" />
              <span>Voice Settings & Optimization</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold mb-4">Global Voice Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Stability</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Variable</span>
                      <span>Stable</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Similarity Boost</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.8"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Style Enhancement</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.3"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Natural</span>
                      <span>Expressive</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4">Emotion Presets</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Professional', color: 'blue' },
                    { name: 'Friendly', color: 'green' },
                    { name: 'Empathetic', color: 'purple' },
                    { name: 'Confident', color: 'orange' },
                    { name: 'Calm', color: 'cyan' },
                    { name: 'Enthusiastic', color: 'pink' }
                  ].map(preset => (
                    <button
                      key={preset.name}
                      className={`p-3 rounded-lg border-2 border-${preset.color}-200 hover:border-${preset.color}-400 hover:bg-${preset.color}-50 dark:hover:bg-${preset.color}-900/20 transition-all text-left`}
                    >
                      <div className={`font-medium text-${preset.color}-700 dark:text-${preset.color}-300`}>
                        {preset.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Optimized settings
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'batch' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span>Batch Voice Operations</span>
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <TestTube className="w-8 h-8 text-green-500 mb-3" />
                <h4 className="font-bold mb-2">Batch Quality Testing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Test multiple voices simultaneously with standardized phrases
                </p>
                <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all">
                  Start Batch Test
                </button>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Waves className="w-8 h-8 text-blue-500 mb-3" />
                <h4 className="font-bold mb-2">Batch Generation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Generate multiple audio samples with different voices
                </p>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">
                  Start Generation
                </button>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <BarChart3 className="w-8 h-8 text-purple-500 mb-3" />
                <h4 className="font-bold mb-2">Performance Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Analyze and compare voice performance metrics
                </p>
                <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-all">
                  Run Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceLabPage;