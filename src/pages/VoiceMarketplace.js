import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Star, Crown, Zap, 
  Mic, Check, X, Sparkles, Brain, Settings,
  BarChart3, DollarSign, TestTube, CheckCircle,
  ChevronRight, Users, Bookmark, Search, Shield
} from 'lucide-react';

const VocelioVoiceMarketplace = () => {
  const [selectedTier, setSelectedTier] = useState('standard');
  const [currentSelectedVoice, setCurrentSelectedVoice] = useState('std_sarah_us'); // Default to first standard voice
  const [playingVoice, setPlayingVoice] = useState(null);
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterStyle, setFilterStyle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonVoices, setComparisonVoices] = useState([]);
  const [expandedTier, setExpandedTier] = useState('standard');

  const voiceTiers = {
    standard: {
      name: 'Standard Voices',
      price: '$0.08',
      features: ['Natural HD voice', 'English & Spanish', 'Fast response (100-200ms)', 'Basic emotions'],
      useCase: 'Appointment setting & cold calling',
      provider: 'Powered by Piper TTS',
      color: 'green',
      popular: false,
      isDefault: true,
      voiceCount: '8 Premium Voices',
      languages: 'English, Spanish'
    },
    pro: {
      name: 'Pro Voices', 
      price: '$0.18',
      features: ['More natural flow & intonation', '15+ languages', 'Low-latency streaming (<100ms)', 'Advanced emotions'],
      useCase: 'Sales calls & client follow-ups',
      provider: 'Powered by Ramble.AI',
      color: 'blue',
      popular: true,
      isDefault: false,
      voiceCount: '12 Elite Voices',
      languages: '15+ Languages'
    },
    enterprise: {
      name: 'Enterprise Voices',
      price: '$0.25', 
      features: ['Branded custom cloned voice', '100+ languages & accents', 'Persona control', 'Voice analytics'],
      useCase: 'Branded outbound campaigns',
      provider: 'Powered by ElevenLabs + Custom',
      color: 'purple',
      popular: false,
      voiceCount: '18 Custom Voices',
      languages: '100+ Languages'
    },
    elite: {
      name: 'Elite Voices',
      price: '$0.35',
      features: ['Ultra-realistic, human-like', 'Emotional tags ([excited], [whispers])', '70+ languages & 1000+ voices', 'Real-time optimization'],
      useCase: 'VIP clients & high-stakes conversations', 
      provider: 'Powered by ElevenLabs Premium',
      color: 'red',
      popular: false,
      voiceCount: '25+ Ultra-Premium',
      languages: '70+ Languages'
    }
  };

  const subVoices = {
    standard: [
      {
        id: 'std_sarah_us', name: 'Sarah - Professional US', tier: 'standard', language: 'EN-US', 
        gender: 'female', accent: 'American', style: 'Professional', quality: 85,
        description: 'Clear, professional American female voice perfect for appointment setting',
        samples: 3, reviews: 2847, rating: 4.3, price: 0.08,
        tags: ['Professional', 'Clear', 'Trustworthy'], avatar: '👩‍💼',
        performance: { successRate: 68, avgDuration: 3.2, satisfaction: 4.1 }
      },
      {
        id: 'std_mike_us', name: 'Mike - Friendly US', tier: 'standard', language: 'EN-US',
        gender: 'male', accent: 'American', style: 'Friendly', quality: 82,
        description: 'Warm, approachable American male voice for cold calling campaigns',
        samples: 4, reviews: 1923, rating: 4.1, price: 0.08,
        tags: ['Friendly', 'Warm', 'Persuasive'], avatar: '👨‍💼',
        performance: { successRate: 71, avgDuration: 4.1, satisfaction: 4.0 }
      },
      {
        id: 'std_emma_uk', name: 'Emma - Professional UK', tier: 'standard', language: 'EN-GB',
        gender: 'female', accent: 'British', style: 'Professional', quality: 83,
        description: 'Professional British female voice with clear diction',
        samples: 3, reviews: 1456, rating: 4.2, price: 0.08,
        tags: ['Professional', 'British', 'Clear'], avatar: '🇬🇧',
        performance: { successRate: 69, avgDuration: 3.8, satisfaction: 4.2 }
      },
      {
        id: 'std_carlos_es', name: 'Carlos - Bilingual Pro', tier: 'standard', language: 'ES-MX',
        gender: 'male', accent: 'Mexican', style: 'Professional', quality: 80,
        description: 'Native Spanish speaker with clear English pronunciation',
        samples: 3, reviews: 987, rating: 4.0, price: 0.08,
        tags: ['Bilingual', 'Professional', 'Clear'], avatar: '🌎',
        performance: { successRate: 67, avgDuration: 4.2, satisfaction: 3.9 }
      },
      {
        id: 'std_maria_es', name: 'Maria - Friendly Spanish', tier: 'standard', language: 'ES-ES',
        gender: 'female', accent: 'Spanish', style: 'Friendly', quality: 81,
        description: 'Warm Spanish female voice perfect for Hispanic markets',
        samples: 3, reviews: 743, rating: 4.1, price: 0.08,
        tags: ['Friendly', 'Spanish', 'Warm'], avatar: '🇪🇸',
        performance: { successRate: 70, avgDuration: 3.9, satisfaction: 4.0 }
      },
      {
        id: 'std_james_uk', name: 'James - Formal UK', tier: 'standard', language: 'EN-GB',
        gender: 'male', accent: 'British', style: 'Formal', quality: 84,
        description: 'Formal British male voice for professional communications',
        samples: 3, reviews: 1234, rating: 4.2, price: 0.08,
        tags: ['Formal', 'British', 'Professional'], avatar: '🎩',
        performance: { successRate: 72, avgDuration: 3.6, satisfaction: 4.1 }
      },
      {
        id: 'std_lisa_neutral', name: 'Lisa - Neutral Accent', tier: 'standard', language: 'EN-US',
        gender: 'female', accent: 'Neutral', style: 'Professional', quality: 83,
        description: 'Neutral accent female voice suitable for global audiences',
        samples: 3, reviews: 891, rating: 4.0, price: 0.08,
        tags: ['Neutral', 'Global', 'Professional'], avatar: '🌍',
        performance: { successRate: 68, avgDuration: 3.7, satisfaction: 4.0 }
      },
      {
        id: 'std_david_energetic', name: 'David - Energetic US', tier: 'standard', language: 'EN-US',
        gender: 'male', accent: 'American', style: 'Energetic', quality: 82,
        description: 'High-energy American male voice for motivational calls',
        samples: 3, reviews: 678, rating: 4.1, price: 0.08,
        tags: ['Energetic', 'Motivational', 'Dynamic'], avatar: '⚡',
        performance: { successRate: 74, avgDuration: 4.0, satisfaction: 4.2 }
      }
    ],
    
    pro: [
      {
        id: 'pro_sophia_elegant', name: 'Sophia - Elegant US', tier: 'pro', language: 'EN-US',
        gender: 'female', accent: 'American', style: 'Elegant', quality: 94,
        description: 'Sophisticated American female voice for premium client interactions',
        samples: 6, reviews: 4821, rating: 4.8, price: 0.18,
        tags: ['Elegant', 'Sophisticated', 'Premium'], avatar: '👑',
        performance: { successRate: 89, avgDuration: 5.7, satisfaction: 4.7 }
      },
      {
        id: 'pro_alexander_formal', name: 'Alexander - Formal UK', tier: 'pro', language: 'EN-GB',
        gender: 'male', accent: 'British', style: 'Formal', quality: 93,
        description: 'Distinguished British male voice for executive communications',
        samples: 5, reviews: 3456, rating: 4.7, price: 0.18,
        tags: ['Formal', 'Executive', 'Distinguished'], avatar: '🎯',
        performance: { successRate: 87, avgDuration: 6.1, satisfaction: 4.6 }
      },
      {
        id: 'pro_olivia_friendly', name: 'Olivia - Friendly AU', tier: 'pro', language: 'EN-AU',
        gender: 'female', accent: 'Australian', style: 'Friendly', quality: 91,
        description: 'Warm Australian female voice with natural conversational flow',
        samples: 6, reviews: 2987, rating: 4.6, price: 0.18,
        tags: ['Friendly', 'Australian', 'Natural'], avatar: '🦘',
        performance: { successRate: 85, avgDuration: 5.3, satisfaction: 4.5 }
      },
      {
        id: 'pro_marco_energetic', name: 'Marco - Energetic IT', tier: 'pro', language: 'IT-IT',
        gender: 'male', accent: 'Italian', style: 'Energetic', quality: 90,
        description: 'Dynamic Italian male voice perfect for sales and persuasion',
        samples: 5, reviews: 2134, rating: 4.5, price: 0.18,
        tags: ['Energetic', 'Italian', 'Persuasive'], avatar: '🇮🇹',
        performance: { successRate: 83, avgDuration: 5.8, satisfaction: 4.4 }
      },
      {
        id: 'pro_claire_french', name: 'Claire - Elegant FR', tier: 'pro', language: 'FR-FR',
        gender: 'female', accent: 'French', style: 'Elegant', quality: 92,
        description: 'Refined French female voice for luxury and premium services',
        samples: 6, reviews: 1876, rating: 4.6, price: 0.18,
        tags: ['Elegant', 'French', 'Luxury'], avatar: '🇫🇷',
        performance: { successRate: 86, avgDuration: 5.9, satisfaction: 4.5 }
      },
      {
        id: 'pro_hans_german', name: 'Hans - Professional DE', tier: 'pro', language: 'DE-DE',
        gender: 'male', accent: 'German', style: 'Professional', quality: 89,
        description: 'Professional German male voice for business communications',
        samples: 5, reviews: 1543, rating: 4.4, price: 0.18,
        tags: ['Professional', 'German', 'Business'], avatar: '🇩🇪',
        performance: { successRate: 81, avgDuration: 5.4, satisfaction: 4.3 }
      },
      {
        id: 'pro_ana_bilingual', name: 'Ana - Bilingual ES/EN', tier: 'pro', language: 'ES-US',
        gender: 'female', accent: 'Latin American', style: 'Professional', quality: 91,
        description: 'Perfect bilingual Spanish-English voice for diverse markets',
        samples: 6, reviews: 2456, rating: 4.7, price: 0.18,
        tags: ['Bilingual', 'Professional', 'Versatile'], avatar: '🌎',
        performance: { successRate: 88, avgDuration: 5.6, satisfaction: 4.6 }
      },
      {
        id: 'pro_ryan_energetic', name: 'Ryan - High Energy US', tier: 'pro', language: 'EN-US',
        gender: 'male', accent: 'American', style: 'Energetic', quality: 90,
        description: 'High-energy American male voice perfect for sales motivation',
        samples: 5, reviews: 1987, rating: 4.5, price: 0.18,
        tags: ['High-Energy', 'Sales', 'Motivational'], avatar: '🚀',
        performance: { successRate: 84, avgDuration: 6.0, satisfaction: 4.4 }
      },
      {
        id: 'pro_kate_calm', name: 'Kate - Calm & Caring', tier: 'pro', language: 'EN-CA',
        gender: 'female', accent: 'Canadian', style: 'Calm', quality: 92,
        description: 'Gentle Canadian female voice ideal for healthcare and support',
        samples: 6, reviews: 1765, rating: 4.8, price: 0.18,
        tags: ['Calm', 'Caring', 'Healthcare'], avatar: '💙',
        performance: { successRate: 90, avgDuration: 6.2, satisfaction: 4.7 }
      },
      {
        id: 'pro_diego_confident', name: 'Diego - Confident MX', tier: 'pro', language: 'ES-MX',
        gender: 'male', accent: 'Mexican', style: 'Confident', quality: 88,
        description: 'Confident Mexican male voice for real estate and high-ticket sales',
        samples: 5, reviews: 1432, rating: 4.4, price: 0.18,
        tags: ['Confident', 'Mexican', 'Sales'], avatar: '🏠',
        performance: { successRate: 82, avgDuration: 5.7, satisfaction: 4.3 }
      },
      {
        id: 'pro_liam_tech', name: 'Liam - Tech Expert', tier: 'pro', language: 'EN-US',
        gender: 'male', accent: 'American', style: 'Tech-Savvy', quality: 91,
        description: 'Tech-savvy American male voice perfect for SaaS and technology',
        samples: 5, reviews: 2109, rating: 4.6, price: 0.18,
        tags: ['Tech-Savvy', 'Modern', 'Innovative'], avatar: '💻',
        performance: { successRate: 86, avgDuration: 5.5, satisfaction: 4.5 }
      },
      {
        id: 'pro_isabella_warm', name: 'Isabella - Warm & Personal', tier: 'pro', language: 'EN-US',
        gender: 'female', accent: 'American', style: 'Warm', quality: 93,
        description: 'Exceptionally warm American female voice for customer retention',
        samples: 6, reviews: 2678, rating: 4.7, price: 0.18,
        tags: ['Warm', 'Personal', 'Retention'], avatar: '🤗',
        performance: { successRate: 88, avgDuration: 6.1, satisfaction: 4.6 }
      }
    ],

    enterprise: [
      {
        id: 'ent_victoria_executive', name: 'Victoria - C-Suite Executive', tier: 'enterprise', language: 'EN-US',
        gender: 'female', accent: 'American', style: 'Executive', quality: 97,
        description: 'Authoritative female executive voice for C-level conversations',
        samples: 4, reviews: 1247, rating: 4.9, price: 0.25,
        tags: ['Executive', 'Authoritative', 'C-Suite'], avatar: '🏆',
        performance: { successRate: 93, avgDuration: 8.1, satisfaction: 4.8 }
      },
      {
        id: 'ent_winston_distinguished', name: 'Winston - Distinguished UK', tier: 'enterprise', language: 'EN-GB',
        gender: 'male', accent: 'British', style: 'Distinguished', quality: 96,
        description: 'Exceptionally distinguished British voice for luxury brands',
        samples: 5, reviews: 891, rating: 4.8, price: 0.25,
        tags: ['Distinguished', 'Luxury', 'Premium'], avatar: '🎩',
        performance: { successRate: 91, avgDuration: 7.8, satisfaction: 4.7 }
      },
      {
        id: 'ent_dr_sarah', name: 'Dr. Sarah - Healthcare Pro', tier: 'enterprise', language: 'EN-US',
        gender: 'female', accent: 'American', style: 'Compassionate', quality: 95,
        description: 'Compassionate healthcare specialist voice with medical expertise',
        samples: 5, reviews: 1891, rating: 4.8, price: 0.25,
        tags: ['Compassionate', 'Healthcare', 'Medical'], avatar: '👩‍⚕️',
        performance: { successRate: 94, avgDuration: 7.3, satisfaction: 4.9 }
      },
      {
        id: 'ent_carlos_regional', name: 'Carlos - Regional Texan', tier: 'enterprise', language: 'EN-US',
        gender: 'male', accent: 'Texan', style: 'Regional', quality: 94,
        description: 'Authentic Texan accent for regional targeting and local appeal',
        samples: 4, reviews: 743, rating: 4.7, price: 0.25,
        tags: ['Regional', 'Texan', 'Authentic'], avatar: '🤠',
        performance: { successRate: 89, avgDuration: 7.1, satisfaction: 4.6 }
      },
      {
        id: 'ent_priya_indian', name: 'Priya - Indian English Pro', tier: 'enterprise', language: 'EN-IN',
        gender: 'female', accent: 'Indian', style: 'Professional', quality: 93,
        description: 'Professional Indian English voice for global business markets',
        samples: 4, reviews: 1234, rating: 4.6, price: 0.25,
        tags: ['Indian English', 'Global', 'Business'], avatar: '🇮🇳',
        performance: { successRate: 87, avgDuration: 6.9, satisfaction: 4.5 }
      },
      {
        id: 'ent_eduardo_latin', name: 'Eduardo - Latin Executive', tier: 'enterprise', language: 'ES-AR',
        gender: 'male', accent: 'Argentinian', style: 'Executive', quality: 95,
        description: 'Executive-level Argentinian Spanish for Latin American markets',
        samples: 4, reviews: 567, rating: 4.8, price: 0.25,
        tags: ['Executive', 'Latin', 'Argentinian'], avatar: '🇦🇷',
        performance: { successRate: 92, avgDuration: 7.6, satisfaction: 4.7 }
      },
      {
        id: 'ent_custom_clone_1', name: 'Custom Clone - CEO Voice', tier: 'enterprise', language: 'EN-US',
        gender: 'male', accent: 'Custom', style: 'Custom', quality: 98,
        description: 'Custom cloned voice of your CEO for branded communications',
        samples: 3, reviews: 89, rating: 4.9, price: 0.25,
        tags: ['Custom Clone', 'Branded', 'CEO'], avatar: '🎯',
        performance: { successRate: 96, avgDuration: 8.5, satisfaction: 4.9 }
      },
      {
        id: 'ent_michelle_calm', name: 'Michelle - Ultra Calm', tier: 'enterprise', language: 'EN-US',
        gender: 'female', accent: 'American', style: 'Ultra Calm', quality: 96,
        description: 'Exceptionally calming voice for crisis management and support',
        samples: 4, reviews: 1456, rating: 4.9, price: 0.25,
        tags: ['Ultra Calm', 'Crisis', 'Support'], avatar: '🕊️',
        performance: { successRate: 95, avgDuration: 8.2, satisfaction: 4.8 }
      },
      {
        id: 'ent_andre_formal', name: 'André - Formal French', tier: 'enterprise', language: 'FR-FR',
        gender: 'male', accent: 'French', style: 'Ultra Formal', quality: 94,
        description: 'Ultra-formal French voice for diplomatic and luxury communications',
        samples: 4, reviews: 623, rating: 4.7, price: 0.25,
        tags: ['Ultra Formal', 'Diplomatic', 'French'], avatar: '🇫🇷',
        performance: { successRate: 90, avgDuration: 7.4, satisfaction: 4.6 }
      },
      {
        id: 'ent_tokyo_ai', name: 'Akiko - Japanese Business', tier: 'enterprise', language: 'JA-JP',
        gender: 'female', accent: 'Japanese', style: 'Business Formal', quality: 93,
        description: 'Professional Japanese voice for Asian market penetration',
        samples: 4, reviews: 456, rating: 4.6, price: 0.25,
        tags: ['Japanese', 'Business', 'Asian Markets'], avatar: '🇯🇵',
        performance: { successRate: 86, avgDuration: 6.8, satisfaction: 4.4 }
      }
    ],

    elite: [
      {
        id: 'elite_aurora_ultra', name: 'Aurora - Ultra Premium', tier: 'elite', language: 'EN-US',
        gender: 'female', accent: 'American', style: 'Ultra-Realistic', quality: 99,
        description: 'Ultra-realistic voice with perfect emotional intelligence and human-like nuances',
        samples: 8, reviews: 847, rating: 4.95, price: 0.35,
        tags: ['Ultra-Realistic', 'Emotional AI', 'Human-Like'], avatar: '💎',
        performance: { successRate: 97, avgDuration: 9.4, satisfaction: 4.9 }
      },
      {
        id: 'elite_maximus_celebrity', name: 'Maximus - Celebrity Grade', tier: 'elite', language: 'EN-US',
        gender: 'male', accent: 'American', style: 'Celebrity', quality: 98,
        description: 'Hollywood-quality voice with perfect emotion control and charismatic delivery',
        samples: 6, reviews: 624, rating: 4.92, price: 0.35,
        tags: ['Celebrity-Grade', 'Charismatic', 'Hollywood'], avatar: '⭐',
        performance: { successRate: 95, avgDuration: 8.8, satisfaction: 4.8 }
      },
      {
        id: 'elite_seraphina_emotional', name: 'Seraphina - Emotional Master', tier: 'elite', language: 'EN-GB',
        gender: 'female', accent: 'British', style: 'Emotional', quality: 98,
        description: 'Master of emotional expression with tags: [excited], [whisper], [empathetic], [urgent]',
        samples: 9, reviews: 756, rating: 4.93, price: 0.35,
        tags: ['Emotional Master', '[Excited]', '[Whisper]', '[Empathetic]'], avatar: '🎭',
        performance: { successRate: 96, avgDuration: 9.1, satisfaction: 4.9 }
      },
      {
        id: 'elite_morpheus_adaptive', name: 'Morpheus - Adaptive AI', tier: 'elite', language: 'EN-US',
        gender: 'male', accent: 'Neutral', style: 'Adaptive', quality: 99,
        description: 'AI that adapts voice style in real-time based on conversation context',
        samples: 7, reviews: 489, rating: 4.94, price: 0.35,
        tags: ['Adaptive AI', 'Real-Time', 'Context-Aware'], avatar: '🧠',
        performance: { successRate: 98, avgDuration: 9.7, satisfaction: 4.9 }
      },
      {
        id: 'elite_luna_multilingual', name: 'Luna - Multilingual Genius', tier: 'elite', language: 'MULTI',
        gender: 'female', accent: 'Global', style: 'Multilingual', quality: 97,
        description: 'Seamlessly switches between 70+ languages with native-level pronunciation',
        samples: 12, reviews: 1203, rating: 4.91, price: 0.35,
        tags: ['70+ Languages', 'Native-Level', 'Seamless'], avatar: '🌍',
        performance: { successRate: 94, avgDuration: 8.9, satisfaction: 4.8 }
      },
      {
        id: 'elite_titan_commanding', name: 'Titan - Commanding Presence', tier: 'elite', language: 'EN-US',
        gender: 'male', accent: 'American', style: 'Commanding', quality: 98,
        description: 'Ultra-authoritative voice that commands attention and respect',
        samples: 5, reviews: 367, rating: 4.96, price: 0.35,
        tags: ['Ultra-Authoritative', 'Commanding', 'Respect'], avatar: '⚡',
        performance: { successRate: 97, avgDuration: 9.3, satisfaction: 4.9 }
      }
    ]
  };

  const filteredVoices = subVoices[selectedTier]?.filter(voice => {
    const matchesLanguage = filterLanguage === 'all' || voice.language.startsWith(filterLanguage);
    const matchesGender = filterGender === 'all' || voice.gender === filterGender;
    const matchesStyle = filterStyle === 'all' || voice.style.toLowerCase().includes(filterStyle.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesLanguage && matchesGender && matchesStyle && matchesSearch;
  }) || [];

  const handlePlayVoice = (voiceId) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceId);
      // Simulate audio duration
      setTimeout(() => setPlayingVoice(null), 3000);
    }
  };

  const handleSelectVoice = (voice) => {
    setCurrentSelectedVoice(voice.id);
    setSelectedTier(voice.tier);
  };

  const addToComparison = (voice) => {
    if (comparisonVoices.length < 4 && !comparisonVoices.find(v => v.id === voice.id)) {
      setComparisonVoices([...comparisonVoices, voice]);
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      green: { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-500', gradient: 'from-green-500 to-emerald-500' },
      blue: { border: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500' },
      purple: { border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-500', gradient: 'from-purple-500 to-pink-500' },
      red: { border: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-500', gradient: 'from-red-500 to-orange-500' }
    };
    return colorMap[color] || colorMap.blue;
  };

  const TierCard = ({ tierKey, tier }) => {
    const colors = getColorClasses(tier.color);
    const voiceCount = subVoices[tierKey]?.length || 0;
    
    return (
      <div 
        onClick={() => {
          setSelectedTier(tierKey);
          setExpandedTier(tierKey);
        }}
        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          selectedTier === tierKey
            ? `${colors.border} ${colors.bg} shadow-2xl`
            : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-gray-400'
        }`}
      >
        {tier.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold">
              🔥 MOST POPULAR
            </span>
          </div>
        )}
        
        <div className="text-center mb-4">
          <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center`}>
            {tierKey === 'standard' && <Mic className="w-8 h-8 text-white" />}
            {tierKey === 'pro' && <Star className="w-8 h-8 text-white" />}
            {tierKey === 'enterprise' && <Crown className="w-8 h-8 text-white" />}
            {tierKey === 'elite' && <Sparkles className="w-8 h-8 text-white" />}
          </div>
          
          <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
          <div className="text-3xl font-bold mb-1">
            <span className={colors.text}>{tier.price}</span>
            <span className="text-sm text-gray-500 ml-1">/ minute</span>
          </div>
          
          <div className="mb-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}>
              <Users className="w-4 h-4 mr-1" />
              {voiceCount} Voices Available
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tier.languages}</p>
          <p className="text-xs text-gray-500 mb-4">{tier.useCase}</p>
        </div>

        <ul className="space-y-2 mb-4">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className={`w-4 h-4 ${colors.text} mr-2 flex-shrink-0`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-3">{tier.provider}</p>
          <div className="flex flex-col space-y-2">
            <button className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
              selectedTier === tierKey
                ? `bg-gradient-to-r ${colors.gradient} text-white`
                : `${colors.bg} ${colors.text} hover:bg-opacity-20`
            }`}>
              {selectedTier === tierKey ? '✓ Selected Tier' : 'Select Tier'}
            </button>
            {tier.isDefault && (
              <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                🏠 Default Tier
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const VoiceCard = ({ voice }) => {
    const isSelected = currentSelectedVoice === voice.id;
    
    return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-6 hover:shadow-lg transition-all duration-300 group ${
      isSelected 
        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{voice.avatar}</div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg">{voice.name}</h3>
              {isSelected && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  ✓ ACTIVE
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{voice.language}</span>
              <span>•</span>
              <span>{voice.accent}</span>
              <span>•</span>
              <span>{voice.style}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="font-semibold">{voice.rating}</span>
          <span className="text-sm text-gray-500">({voice.reviews})</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{voice.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {voice.tags.map((tag, index) => (
          <span key={index} className={`px-2 py-1 text-xs rounded-full ${
            tag.startsWith('[') ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
          }`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div>
          <div className="text-lg font-bold text-green-500">{voice.performance.successRate}%</div>
          <div className="text-xs text-gray-500">Success Rate</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-500">{voice.performance.avgDuration}m</div>
          <div className="text-xs text-gray-500">Avg Duration</div>
        </div>
        <div>
          <div className="text-lg font-bold text-purple-500">{voice.performance.satisfaction}</div>
          <div className="text-xs text-gray-500">Satisfaction</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-bold">
          ${voice.price}/min
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePlayVoice(voice.id)}
            className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-all"
          >
            {playingVoice === voice.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <span className="text-sm text-gray-500">{voice.samples} samples</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => handleSelectVoice(voice)}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Selected</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Select Voice</span>
            </>
          )}
        </button>
        <button
          onClick={() => addToComparison(voice)}
          className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 py-2 px-4 rounded-lg transition-all"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
        <button className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 py-2 px-4 rounded-lg transition-all">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Vocelio Voice Marketplace
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  🎙️ World's Largest AI Voice Collection • {Object.values(subVoices).flat().length}+ Premium Voices
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Current Selected Voice */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 min-w-[200px]">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Currently Selected Voice</div>
                {(() => {
                  const selectedVoice = Object.values(subVoices).flat().find(v => v.id === currentSelectedVoice);
                  return selectedVoice ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{selectedVoice.avatar}</span>
                      <div>
                        <div className="font-semibold text-sm">{selectedVoice.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          ${selectedVoice.price}/min • {selectedVoice.tier} tier
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No voice selected</div>
                  );
                })()}
              </div>
              
              <button className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 p-3 rounded-xl transition-all">
                <TestTube className="w-6 h-6" />
              </button>
              <button className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 p-3 rounded-xl transition-all">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">🎯 Select Your Perfect AI Voice</h2>
          <p className="text-xl mb-6 opacity-90">
            Choose your voice • Auto-billing per call minute • Switch anytime
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{Object.values(subVoices).flat().length}+</div>
              <div className="opacity-80">Premium Voices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">70+</div>
              <div className="opacity-80">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4</div>
              <div className="opacity-80">Quality Tiers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Pay/Use</div>
              <div className="opacity-80">Auto Billing</div>
            </div>
          </div>
        </div>

        {/* Voice Tiers */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">🎙️ Voice Quality Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(voiceTiers).map(([key, tier]) => (
              <TierCard key={key} tierKey={key} tier={tier} />
            ))}
          </div>
        </div>

        {/* Selected Tier Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getColorClasses(voiceTiers[selectedTier].color).gradient} flex items-center justify-center`}>
                {selectedTier === 'standard' && <Mic className="w-6 h-6 text-white" />}
                {selectedTier === 'pro' && <Star className="w-6 h-6 text-white" />}
                {selectedTier === 'enterprise' && <Crown className="w-6 h-6 text-white" />}
                {selectedTier === 'elite' && <Sparkles className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className="text-xl font-bold">{voiceTiers[selectedTier].name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subVoices[selectedTier]?.length || 0} voices available • {voiceTiers[selectedTier].price}/min
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full ${getColorClasses(voiceTiers[selectedTier].color).bg} ${getColorClasses(voiceTiers[selectedTier].color).text} font-semibold`}>
              {voiceTiers[selectedTier].languages}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search voices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Languages</option>
                <option value="EN">English</option>
                <option value="ES">Spanish</option>
                <option value="FR">French</option>
                <option value="DE">German</option>
                <option value="IT">Italian</option>
                <option value="JA">Japanese</option>
                <option value="MULTI">Multilingual</option>
              </select>

              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Genders</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>

              <select
                value={filterStyle}
                onChange={(e) => setFilterStyle(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Styles</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="energetic">Energetic</option>
                <option value="calm">Calm</option>
                <option value="elegant">Elegant</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {comparisonVoices.length > 0 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Compare ({comparisonVoices.length})</span>
                </button>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredVoices.length} voices found
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVoices.map(voice => (
            <VoiceCard key={voice.id} voice={voice} />
          ))}
        </div>

        {filteredVoices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No voices found in {voiceTiers[selectedTier].name}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or select a different tier
            </p>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">🔍 Voice Comparison</h3>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {comparisonVoices.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">No voices to compare</h4>
                  <p className="text-gray-600 dark:text-gray-400">Add voices to comparison from the marketplace</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold">Voice</th>
                        <th className="text-center py-3 px-4 font-semibold">Tier</th>
                        <th className="text-center py-3 px-4 font-semibold">Rating</th>
                        <th className="text-center py-3 px-4 font-semibold">Success Rate</th>
                        <th className="text-center py-3 px-4 font-semibold">Price</th>
                        <th className="text-center py-3 px-4 font-semibold">Style</th>
                        <th className="text-center py-3 px-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonVoices.map((voice, index) => (
                        <tr key={voice.id} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{voice.avatar}</span>
                              <div>
                                <div className="font-semibold">{voice.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {voice.language} • {voice.accent}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              voice.tier === 'standard' ? 'bg-green-500/10 text-green-500' :
                              voice.tier === 'pro' ? 'bg-blue-500/10 text-blue-500' :
                              voice.tier === 'enterprise' ? 'bg-purple-500/10 text-purple-500' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              {voice.tier.charAt(0).toUpperCase() + voice.tier.slice(1)}
                            </span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-semibold">{voice.rating}</span>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className="text-green-500 font-bold">{voice.performance.successRate}%</span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className="font-bold">${voice.price}/min</span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className="text-gray-600 dark:text-gray-400">{voice.style}</span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleSelectVoice(voice)}
                                className={`px-3 py-1 rounded text-sm font-semibold ${
                                  currentSelectedVoice === voice.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                              >
                                {currentSelectedVoice === voice.id ? 'Selected' : 'Select'}
                              </button>
                              <button
                                onClick={() => setComparisonVoices(comparisonVoices.filter(v => v.id !== voice.id))}
                                className="text-red-500 hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Client Flow Steps */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">🛠️ Voice Selection Flow (Step-by-Step)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
              <h4 className="font-bold mb-2">Choose Tier</h4>
              <p className="text-sm opacity-80">Standard (default), Pro, Enterprise, or Elite</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
              <h4 className="font-bold mb-2">Browse & Listen</h4>
              <p className="text-sm opacity-80">Filter by language, gender, and style</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
              <h4 className="font-bold mb-2">Select Voice</h4>
              <p className="text-sm opacity-80">Click "Select Voice" on your preferred option</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">4</div>
              <h4 className="font-bold mb-2">Auto-Activation</h4>
              <p className="text-sm opacity-80">Voice immediately available for all calls</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">5</div>
              <h4 className="font-bold mb-2">Pay Per Use</h4>
              <p className="text-sm opacity-80">Automatic billing at tier rate per minute</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm inline-block">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Standard: $0.08/min (Default)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Pro: $0.18/min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Enterprise: $0.25/min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Elite: $0.35/min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Comparison */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">💰 Multiple Voices Per Tier</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Each tier offers multiple voice options • Upgrade anytime • Pay only for what you use
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-green-500 mb-2">$0.08</div>
              <div className="font-semibold mb-1">Standard</div>
              <div className="text-sm text-gray-500 mb-3">per minute</div>
              <div className="text-lg font-bold text-green-600 mb-1">{subVoices.standard?.length || 0}</div>
              <div className="text-xs text-gray-500">voices available</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">POPULAR</span>
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-2">$0.18</div>
              <div className="font-semibold mb-1">Pro</div>
              <div className="text-sm text-gray-500 mb-3">per minute</div>
              <div className="text-lg font-bold text-blue-600 mb-1">{subVoices.pro?.length || 0}</div>
              <div className="text-xs text-gray-500">voices available</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-purple-500 mb-2">$0.25</div>
              <div className="font-semibold mb-1">Enterprise</div>
              <div className="text-sm text-gray-500 mb-3">per minute</div>
              <div className="text-lg font-bold text-purple-600 mb-1">{subVoices.enterprise?.length || 0}</div>
              <div className="text-xs text-gray-500">voices available</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-red-500 mb-2">$0.35</div>
              <div className="font-semibold mb-1">Elite</div>
              <div className="text-sm text-gray-500 mb-3">per minute</div>
              <div className="text-lg font-bold text-red-600 mb-1">{subVoices.elite?.length || 0}</div>
              <div className="text-xs text-gray-500">voices available</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-xl px-6 py-3 border border-gray-200 dark:border-gray-700">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">30-day money-back guarantee</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Switch voices anytime</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Crown className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Enterprise custom cloning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Features by Tier */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h3 className="text-2xl font-bold mb-6 text-center">🎯 What's Included in Each Tier</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Standard Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-green-600">🟢 Standard ($0.08/min)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />8 Premium Voices</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />English + Spanish</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Male/Female Options</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />US/UK Accents</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />Basic Emotions</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" />100-200ms Response</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">Perfect for: Cold calling, appointment setting</p>
          </div>

          {/* Pro Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-500 p-6 relative">
            <div className="absolute -top-3 left-4">
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">POPULAR</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-blue-600">🔵 Pro ($0.18/min)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><Check className="w-4 h-4 text-blue-500 mr-2" />12 Elite Voices</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-blue-500 mr-2" />15+ Languages</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-blue-500 mr-2" />Advanced Emotions</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-blue-500 mr-2" />Regional Accents</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-blue-500 mr-2" />Bilingual Options</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-blue-500 mr-2" />&lt;100ms Streaming</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">Perfect for: Sales calls, client follow-ups</p>
          </div>

          {/* Enterprise Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-purple-600">🟣 Enterprise ($0.25/min)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><Check className="w-4 h-4 text-purple-500 mr-2" />18 Custom Voices</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-purple-500 mr-2" />100+ Languages</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-purple-500 mr-2" />Voice Cloning</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-purple-500 mr-2" />Persona Control</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-purple-500 mr-2" />Regional Targeting</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-purple-500 mr-2" />Voice Analytics</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">Perfect for: Branded campaigns, agencies</p>
          </div>

          {/* Elite Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-red-600">🔴 Elite ($0.35/min)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><Check className="w-4 h-4 text-red-500 mr-2" />25+ Ultra Voices</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-red-500 mr-2" />70+ Languages</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-red-500 mr-2" />Emotional Tags</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-red-500 mr-2" />Celebrity Quality</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-red-500 mr-2" />Real-time Adaptation</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-red-500 mr-2" />1000+ Variants</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">Perfect for: VIP clients, high-stakes calls</p>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">🧪 A/B Voice Testing</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Test multiple voices simultaneously across tiers to find your perfect match
            </p>
            <button className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 px-4 py-2 rounded-lg transition-all">
              Start A/B Test
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">🤖 AI Voice Matching</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              AI analyzes your campaigns and recommends the optimal voice from any tier
            </p>
            <button className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 px-4 py-2 rounded-lg transition-all">
              Get AI Recommendation
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">📊 Voice Performance Analytics</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Real-time tracking and insights for every voice across all tiers
            </p>
            <button className="bg-green-500/10 text-green-500 hover:bg-green-500/20 px-4 py-2 rounded-lg transition-all">
              View Analytics
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">🎭 Voice Personalization</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Custom voice training and persona fine-tuning for your brand
            </p>
            <button className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 px-4 py-2 rounded-lg transition-all">
              Customize Voice
            </button>
          </div>
        </div>
      </div>

      {/* Voice Usage Analytics */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">📊 Voice Performance Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time insights across all tiers • Monitor ROI and optimize voice selection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">94.2%</div>
              <div className="font-semibold mb-1">Avg Success Rate</div>
              <div className="text-sm text-gray-500 mb-3">Across all tiers</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '94.2%'}}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">6.3m</div>
              <div className="font-semibold mb-1">Avg Call Duration</div>
              <div className="text-sm text-gray-500 mb-3">Elite performs best</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">4.7⭐</div>
              <div className="font-semibold mb-1">Customer Satisfaction</div>
              <div className="text-sm text-gray-500 mb-3">15,847+ reviews</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">312%</div>
              <div className="font-semibold mb-1">ROI Improvement</div>
              <div className="text-sm text-gray-500 mb-3">vs standard TTS</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-6 bg-white dark:bg-gray-800 rounded-xl px-8 py-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Standard Tier: 68-74% success</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Pro Tier: 81-90% success</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Enterprise: 86-95% success</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Elite Tier: 94-98% success</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Path */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🚀 Seamless Tier Upgrades</h3>
          <p className="text-lg mb-6 opacity-90">
            Start with Standard → Upgrade to Pro → Scale to Enterprise → Dominate with Elite
          </p>
          
          <div className="flex justify-center items-center space-x-6 mb-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🟢</div>
              <div className="font-semibold">Standard</div>
              <div className="text-sm opacity-80">8 voices</div>
            </div>
            <ChevronRight className="w-6 h-6" />
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/30">
              <div className="text-2xl mb-2">🔵</div>
              <div className="font-semibold">Pro</div>
              <div className="text-sm opacity-80">12 voices</div>
            </div>
            <ChevronRight className="w-6 h-6" />
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🟣</div>
              <div className="font-semibold">Enterprise</div>
              <div className="text-sm opacity-80">18 voices</div>
            </div>
            <ChevronRight className="w-6 h-6" />
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🔴</div>
              <div className="font-semibold">Elite</div>
              <div className="text-sm opacity-80">25+ voices</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Zap className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Instant Switching</div>
              <div className="opacity-80">Change tiers anytime</div>
            </div>
            <div>
              <DollarSign className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Fair Billing</div>
              <div className="opacity-80">Pay per minute used</div>
            </div>
            <div>
              <Crown className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">No Lock-in</div>
              <div className="opacity-80">Downgrade anytime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Vocelio.ai
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              🌍 World's #1 AI Call Center Platform • {Object.values(subVoices).flat().length}+ voices across 4 tiers • Pay-per-use billing • Trusted by 100,000+ businesses globally
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-500 transition-colors">API Documentation</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Voice API</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Support Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VocelioVoiceMarketplace;