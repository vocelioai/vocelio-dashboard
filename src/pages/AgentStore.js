import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Star, Play, ShoppingCart, Download, Eye, Heart,
  TrendingUp, Award, Zap, Globe, Users, Phone, DollarSign, Clock,
  CheckCircle, XCircle, ArrowRight, Plus, Minus, ChevronDown, 
  ChevronRight, Grid, List, SortAsc, SortDesc, Badge, Crown,
  Building, Car, Stethoscope, Monitor, Package,
  CreditCard, Home, Sun, Shield, Briefcase, Code, Headphones,
  MessageSquare, Target, BarChart3, Settings, PlayCircle, 
  ShoppingBag, BookOpen, Sparkles, Flame, ThumbsUp, Share2,
  ExternalLink, Copy, Check, X, RefreshCw, AlertCircle, Info
} from 'lucide-react';

const AgentStore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: 'all',
    rating: 'all',
    language: 'all',
    features: []
  });
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [cart, setCart] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(null);

  // Agent categories
  const categories = [
    { id: 'All', name: 'All Agents', icon: Grid, count: 96 },
    { id: 'Real Estate', name: 'Real Estate', icon: Home, count: 12 },
    { id: 'Solar/Energy', name: 'Solar & Energy', icon: Sun, count: 8 },
    { id: 'Insurance', name: 'Insurance', icon: Shield, count: 10 },
    { id: 'Healthcare', name: 'Healthcare', icon: Stethoscope, count: 9 },
    { id: 'SaaS/Technology', name: 'SaaS & Tech', icon: Monitor, count: 15 },
    { id: 'E-commerce', name: 'E-commerce', icon: Package, count: 11 },
    { id: 'Finance', name: 'Finance', icon: CreditCard, count: 13 },
    { id: 'Automotive', name: 'Automotive', icon: Car, count: 8 },
    { id: 'Legal', name: 'Legal Services', icon: Briefcase, count: 6 },
    { id: 'Education', name: 'Education', icon: BookOpen, count: 4 }
  ];

  // Sample agents data
  const agents = [
    // Real Estate
    {
      id: 'RE001',
      name: 'LeadMax Pro',
      category: 'Real Estate',
      description: 'Advanced lead qualification agent with smart objection handling and appointment setting capabilities.',
      price: { free: true, standard: 299, premium: 599 },
      rating: 4.9,
      reviews: 247,
      successRate: 73.2,
      avgDuration: 4.8,
      conversionRate: 34.5,
      languages: ['English', 'Spanish'],
      voices: ['Professional Female', 'Confident Male', 'Warm Female'],
      features: ['Lead Scoring', 'CRM Integration', 'Calendar Sync', 'SMS Follow-up'],
      tags: ['HOT', 'TRENDING'],
      image: '🏠',
      creator: 'Vocelio Labs',
      downloads: 15420,
      lastUpdated: '2024-01-15',
      demoScript: "Hi! I'm calling about the property listing you inquired about. Do you have 2 minutes to discuss your home buying needs?",
      sampleConversations: [
        {
          turn: 1,
          agent: "Hi! I'm Sarah from ABC Realty. I see you inquired about our listing on Maple Street. Are you currently looking to buy in that area?",
          customer: "Yes, we've been looking for about 3 months now."
        },
        {
          turn: 2,
          agent: "Perfect! What's most important to you in your next home - location, size, or budget?",
          customer: "Definitely location, we need good schools."
        }
      ]
    },
    {
      id: 'RE002',
      name: 'Property Qualifier Elite',
      category: 'Real Estate',
      description: 'Intelligent property matching agent with advanced buyer qualification and financial pre-screening.',
      price: { free: false, standard: 399, premium: 799 },
      rating: 4.8,
      reviews: 189,
      successRate: 71.8,
      avgDuration: 5.2,
      conversionRate: 38.9,
      languages: ['English'],
      voices: ['Professional Male', 'Trusted Female'],
      features: ['Financial Screening', 'Property Matching', 'Credit Check Integration', 'Automated Follow-up'],
      tags: ['PREMIUM'],
      image: '🔍',
      creator: 'RealtyTech Solutions',
      downloads: 8920,
      lastUpdated: '2024-01-10'
    },

    // Solar/Energy
    {
      id: 'SE001',
      name: 'Solar Savings Calculator',
      category: 'Solar/Energy',
      description: 'Expert solar consultation agent with real-time savings calculations and financing options.',
      price: { free: true, standard: 349, premium: 699 },
      rating: 4.7,
      reviews: 156,
      successRate: 68.4,
      avgDuration: 6.1,
      conversionRate: 42.3,
      languages: ['English', 'Spanish'],
      voices: ['Expert Male', 'Friendly Female', 'Confident Male'],
      features: ['ROI Calculator', 'Financing Options', 'Utility Bill Analysis', 'Government Incentives'],
      tags: ['ECO-FRIENDLY', 'ROI'],
      image: '☀️',
      creator: 'GreenTech AI',
      downloads: 6740,
      lastUpdated: '2024-01-12'
    },

    // Insurance
    {
      id: 'IN001',
      name: 'QuoteGenius Pro',
      category: 'Insurance',
      description: 'Intelligent insurance quoting agent with real-time rate comparison and policy recommendations.',
      price: { free: false, standard: 449, premium: 899 },
      rating: 4.9,
      reviews: 203,
      successRate: 76.1,
      avgDuration: 4.3,
      conversionRate: 45.7,
      languages: ['English'],
      voices: ['Trustworthy Male', 'Caring Female', 'Professional Male'],
      features: ['Multi-Carrier Quotes', 'Risk Assessment', 'Policy Comparison', 'Claims History'],
      tags: ['TOP RATED', 'TRUSTED'],
      image: '🛡️',
      creator: 'InsureTech Labs',
      downloads: 12350,
      lastUpdated: '2024-01-14'
    },

    // Healthcare
    {
      id: 'HC001',
      name: 'MedScheduler Plus',
      category: 'Healthcare',
      description: 'HIPAA-compliant appointment scheduling agent with symptom pre-screening and insurance verification.',
      price: { free: true, standard: 399, premium: 799 },
      rating: 4.8,
      reviews: 178,
      successRate: 82.3,
      avgDuration: 3.9,
      conversionRate: 67.8,
      languages: ['English', 'Spanish', 'French'],
      voices: ['Caring Female', 'Professional Male', 'Warm Female'],
      features: ['HIPAA Compliant', 'Insurance Verification', 'Symptom Screening', 'Reminder System'],
      tags: ['HIPAA', 'CERTIFIED'],
      image: '🏥',
      creator: 'HealthTech AI',
      downloads: 9850,
      lastUpdated: '2024-01-13'
    },

    // SaaS/Technology
    {
      id: 'ST001',
      name: 'Demo Booking Master',
      category: 'SaaS/Technology',
      description: 'Technical sales agent specializing in SaaS demo booking with feature explanation and trial conversion.',
      price: { free: true, standard: 379, premium: 759 },
      rating: 4.9,
      reviews: 294,
      successRate: 79.5,
      avgDuration: 5.7,
      conversionRate: 52.1,
      languages: ['English'],
      voices: ['Tech Expert Male', 'Knowledgeable Female', 'Confident Male'],
      features: ['Technical Knowledge', 'Demo Scheduling', 'Feature Explanation', 'Trial Setup'],
      tags: ['HOT', 'HIGH CONVERT'],
      image: '💻',
      creator: 'TechSales AI',
      downloads: 18790,
      lastUpdated: '2024-01-16'
    },

    // E-commerce
    {
      id: 'EC001',
      name: 'Cart Recovery Champion',
      category: 'E-commerce',
      description: 'Advanced cart abandonment recovery agent with personalized product recommendations and discount automation.',
      price: { free: false, standard: 329, premium: 649 },
      rating: 4.6,
      reviews: 167,
      successRate: 64.7,
      avgDuration: 3.2,
      conversionRate: 28.9,
      languages: ['English', 'Spanish'],
      voices: ['Friendly Female', 'Helpful Male', 'Enthusiastic Female'],
      features: ['Cart Recovery', 'Product Recommendations', 'Discount Management', 'Order Tracking'],
      tags: ['ECOM', 'RECOVERY'],
      image: '🛒',
      creator: 'ShopBot Solutions',
      downloads: 7650,
      lastUpdated: '2024-01-11'
    },

    // Finance
    {
      id: 'FI001',
      name: 'LoanPro Qualifier',
      category: 'Finance',
      description: 'Professional loan pre-qualification agent with credit assessment and financial planning guidance.',
      price: { free: false, standard: 499, premium: 999 },
      rating: 4.8,
      reviews: 231,
      successRate: 71.3,
      avgDuration: 7.2,
      conversionRate: 43.6,
      languages: ['English'],
      voices: ['Financial Advisor Male', 'Trusted Female', 'Professional Male'],
      features: ['Credit Analysis', 'Loan Matching', 'Financial Planning', 'Rate Comparison'],
      tags: ['PREMIUM', 'FINANCE'],
      image: '💰',
      creator: 'FinanceBot Pro',
      downloads: 11290,
      lastUpdated: '2024-01-15'
    },

    // Automotive
    {
      id: 'AU001',
      name: 'AutoSales Ace',
      category: 'Automotive',
      description: 'Automotive sales specialist with inventory management, financing options, and test drive scheduling.',
      price: { free: true, standard: 359, premium: 719 },
      rating: 4.7,
      reviews: 142,
      successRate: 69.8,
      avgDuration: 5.8,
      conversionRate: 35.2,
      languages: ['English', 'Spanish'],
      voices: ['Car Expert Male', 'Friendly Female', 'Professional Male'],
      features: ['Inventory Search', 'Financing Calculator', 'Trade-in Valuation', 'Appointment Booking'],
      tags: ['AUTO', 'INVENTORY'],
      image: '🚗',
      creator: 'AutoTech AI',
      downloads: 5840,
      lastUpdated: '2024-01-09'
    }
  ];

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    
    const matchesPriceRange = selectedFilters.priceRange === 'all' ||
      (selectedFilters.priceRange === 'free' && agent.price.free) ||
      (selectedFilters.priceRange === 'premium' && agent.price.premium > 500) ||
      (selectedFilters.priceRange === 'standard' && agent.price.standard <= 400);
    
    const matchesRating = selectedFilters.rating === 'all' ||
      agent.rating >= parseFloat(selectedFilters.rating);
    
    return matchesSearch && matchesCategory && matchesPriceRange && matchesRating;
  });

  // Sort agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price.standard - b.price.standard;
      case 'price-high':
        return b.price.standard - a.price.standard;
      case 'newest':
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      case 'popularity':
      default:
        return b.downloads - a.downloads;
    }
  });

  // Add to cart function
  const addToCart = (agent, tier = 'standard') => {
    const cartItem = {
      id: `${agent.id}-${tier}`,
      agent,
      tier,
      price: agent.price[tier],
      quantity: 1
    };
    
    const existingItem = cart.find(item => item.id === cartItem.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === cartItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, cartItem]);
    }
  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Agent Card Component
  const AgentCard = ({ agent }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer relative overflow-hidden">
      {/* Agent Tags */}
      {agent.tags && agent.tags.length > 0 && (
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          {agent.tags.map((tag, index) => (
            <span key={index} className={`px-2 py-1 text-xs font-bold rounded-full ${
              tag === 'HOT' ? 'bg-red-500 text-white animate-pulse' :
              tag === 'TRENDING' ? 'bg-orange-500 text-white' :
              tag === 'NEW' ? 'bg-green-500 text-white' :
              tag === 'PREMIUM' ? 'bg-purple-500 text-white' :
              tag === 'TOP RATED' ? 'bg-blue-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Agent Image/Icon */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
        <div className="text-6xl">{agent.image}</div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button 
            onClick={() => setCurrentDemo(agent)}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-full font-semibold transition-all transform scale-0 group-hover:scale-100 flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Demo</span>
          </button>
        </div>
      </div>

      {/* Agent Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
              {agent.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{agent.category}</p>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {agent.description}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{agent.successRate}%</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{agent.avgDuration}m</div>
            <div className="text-xs text-gray-500">Avg Duration</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{agent.conversionRate}%</div>
            <div className="text-xs text-gray-500">Conversion</div>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{agent.rating}</span>
            <span className="text-sm text-gray-500">({agent.reviews})</span>
          </div>
          <div className="text-sm text-gray-500">{agent.downloads.toLocaleString()} downloads</div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {agent.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                {feature}
              </span>
            ))}
            {agent.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{agent.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              {agent.price.free ? (
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-semibold">Free Trial</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">${agent.price.standard}/mo</span>
                </div>
              ) : (
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ${agent.price.standard}/mo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedAgent(agent)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
          <button 
            onClick={() => addToCart(agent)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Agent Detail Modal
  const AgentDetailModal = ({ agent, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{agent.image}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{agent.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">by {agent.creator}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">{agent.description}</p>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{agent.successRate}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{agent.avgDuration}m</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{agent.conversionRate}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Conversion</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{agent.downloads.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Downloads</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {agent.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice Options */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Voices</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.voices.map((voice, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {voice}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Conversation */}
              {agent.sampleConversations && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Sample Conversation</h3>
                  <div className="space-y-3">
                    {agent.sampleConversations.map((conv, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            AI
                          </div>
                          <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <p className="text-gray-800 dark:text-gray-200">{conv.agent}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            C
                          </div>
                          <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <p className="text-gray-800 dark:text-gray-200">{conv.customer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Pricing Plans</h3>
                <div className="space-y-3">
                  {agent.price.free && (
                    <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-green-600">Free Trial</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">7 days, 100 calls</div>
                        </div>
                        <button 
                          onClick={() => addToCart(agent, 'free')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                          Start Free
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-blue-600">Standard</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Up to 1,000 calls/month</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">${agent.price.standard}/mo</div>
                      </div>
                      <button 
                        onClick={() => addToCart(agent, 'standard')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-purple-600">Premium</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Unlimited calls + extras</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">${agent.price.premium}/mo</div>
                      </div>
                      <button 
                        onClick={() => addToCart(agent, 'premium')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                  <PlayCircle className="w-5 h-5" />
                  <span>Try Demo Now</span>
                </button>
                <button className="w-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share Agent</span>
                </button>
              </div>

              {/* Agent Stats */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Agent Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="font-medium">{agent.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Languages:</span>
                    <span className="font-medium">{agent.languages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <span className="font-medium">{new Date(agent.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Reviews:</span>
                    <span className="font-medium">{agent.reviews}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Demo Modal
  const DemoModal = ({ agent, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full">
        <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{agent.image}</div>
            <div>
              <h3 className="text-xl font-bold">{agent.name} Demo</h3>
              <p className="text-gray-600 dark:text-gray-400">Interactive voice preview</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold">Sample Script</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hear how this agent sounds</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-gray-800 dark:text-gray-200 italic">"{agent.demoScript || "Hi! I'm calling about your recent inquiry. Do you have a few minutes to discuss how we can help you achieve your goals?"}"</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm">
                  {agent.voices.map((voice, index) => (
                    <option key={index} value={voice}>{voice}</option>
                  ))}
                </select>
                <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm">
                  {agent.languages.map((lang, index) => (
                    <option key={index} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Play Demo</span>
              </button>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                addToCart(agent);
                onClose();
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                setSelectedAgent(agent);
                onClose();
              }}
              className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg font-semibold"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Shopping Cart Modal
  const CartModal = ({ isOpen, onClose }) => (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-xl font-bold">Shopping Cart ({cart.length})</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
                <button 
                  onClick={onClose}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border dark:border-gray-700 rounded-lg">
                      <div className="text-2xl">{item.agent.image}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.agent.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{item.tier} Plan</p>
                        <p className="text-lg font-bold">${item.price}/mo</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold">${cartTotal.toLocaleString()}/mo</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={onClose}
                      className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg font-semibold"
                    >
                      Continue Shopping
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold">
                      Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span>Agent Store</span>
                <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                  {agents.length} Agents
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover and deploy AI agents for every industry. The world's largest marketplace for conversational AI.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowCart(true)}
                className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">🔥 Featured AI Agents</h2>
            <p className="text-blue-100 text-lg">Top-performing agents trusted by thousands of businesses worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.filter(agent => agent.tags?.includes('HOT')).slice(0, 3).map(agent => (
              <div key={agent.id} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">{agent.image}</div>
                <h3 className="font-bold text-lg mb-2">{agent.name}</h3>
                <p className="text-blue-100 text-sm mb-4">{agent.description.substring(0, 80)}...</p>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold">{agent.successRate}%</div>
                    <div className="text-xs text-blue-200">Success</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{agent.downloads.toLocaleString()}</div>
                    <div className="text-xs text-blue-200">Downloads</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAgent(agent)}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition-all w-full"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Grid className="w-5 h-5" />
                <span>Categories</span>
              </h3>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </h3>
              
              <div className="space-y-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range
                  </label>
                  <select
                    value={selectedFilters.priceRange}
                    onChange={(e) => setSelectedFilters({...selectedFilters, priceRange: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Prices</option>
                    <option value="free">Free Trial Available</option>
                    <option value="standard">Under $400/mo</option>
                    <option value="premium">Premium ($500+/mo)</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={selectedFilters.rating}
                    onChange={(e) => setSelectedFilters({...selectedFilters, rating: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={selectedFilters.language}
                    onChange={(e) => setSelectedFilters({...selectedFilters, language: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Languages</option>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="multilingual">Multilingual</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-lg mb-4 text-green-800 dark:text-green-300">
                🎯 Marketplace Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Agents:</span>
                  <span className="font-bold">{agents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Categories:</span>
                  <span className="font-bold">{categories.length - 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Success Rate:</span>
                  <span className="font-bold text-green-600">72.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Downloads:</span>
                  <span className="font-bold">847K+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {sortedAgents.length} of {agents.length} agents
                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* View Mode */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'grid' 
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'list' 
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Agents Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            {/* Empty State */}
            {sortedAgents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No agents found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or filters to find more agents.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedFilters({
                      priceRange: 'all',
                      rating: 'all',
                      language: 'all',
                      features: []
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedAgent && (
        <AgentDetailModal 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
        />
      )}

      {currentDemo && (
        <DemoModal 
          agent={currentDemo} 
          onClose={() => setCurrentDemo(null)} 
        />
      )}

      <CartModal 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
      />
    </div>
  );
};

export default AgentStore;