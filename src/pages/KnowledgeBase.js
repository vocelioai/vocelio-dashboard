import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Plus, FileText, Folder, Star, Clock, 
  User, Tag, Filter, Download, Share2, Edit, Trash2, Eye,
  Brain, Zap, TrendingUp, ArrowRight, ChevronRight, ChevronDown,
  Bookmark, MessageSquare, ThumbsUp, Heart, Award, Target,
  Settings, MoreHorizontal, Upload, RefreshCw, Grid, List,
  Globe, Lock, Users, Calendar, Activity, BarChart3, PieChart
} from 'lucide-react';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock knowledge base data
  const [categories] = useState([
    { id: 'all', name: 'All Categories', count: 156, icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', count: 24, icon: Zap },
    { id: 'ai-agents', name: 'AI Agents', count: 32, icon: Brain },
    { id: 'voice-calls', name: 'Voice Calls', count: 18, icon: MessageSquare },
    { id: 'integrations', name: 'Integrations', count: 28, icon: Globe },
    { id: 'billing', name: 'Billing & Plans', count: 15, icon: Award },
    { id: 'troubleshooting', name: 'Troubleshooting', count: 21, icon: Settings },
    { id: 'api-docs', name: 'API Documentation', count: 18, icon: FileText }
  ]);

  const [articles] = useState([
    {
      id: 1,
      title: 'Getting Started with AI Agents',
      description: 'Learn how to create and configure your first AI agent for automated customer conversations.',
      category: 'getting-started',
      author: 'Sarah Chen',
      date: '2025-08-10',
      readTime: '5 min read',
      views: 2847,
      likes: 156,
      featured: true,
      tags: ['ai-agents', 'setup', 'beginner'],
      status: 'published',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: 'Advanced Voice Lab Configurations',
      description: 'Master voice synthesis settings, custom voice training, and advanced audio processing techniques.',
      category: 'voice-calls',
      author: 'Marcus Rodriguez',
      date: '2025-08-08',
      readTime: '12 min read',
      views: 1923,
      likes: 89,
      featured: true,
      tags: ['voice-lab', 'synthesis', 'advanced'],
      status: 'published',
      difficulty: 'Advanced'
    },
    {
      id: 3,
      title: 'Twilio Integration Setup Guide',
      description: 'Complete walkthrough for integrating Twilio services with your Vocelio dashboard.',
      category: 'integrations',
      author: 'Alex Thompson',
      date: '2025-08-05',
      readTime: '8 min read',
      views: 3156,
      likes: 203,
      featured: false,
      tags: ['twilio', 'integration', 'phone-numbers'],
      status: 'published',
      difficulty: 'Intermediate'
    },
    {
      id: 4,
      title: 'Understanding Billing and Usage Metrics',
      description: 'Learn how to track usage, understand billing cycles, and optimize your plan.',
      category: 'billing',
      author: 'Jennifer Liu',
      date: '2025-08-03',
      readTime: '6 min read',
      views: 1567,
      likes: 78,
      featured: false,
      tags: ['billing', 'metrics', 'optimization'],
      status: 'published',
      difficulty: 'Beginner'
    },
    {
      id: 5,
      title: 'Campaign Analytics and Performance Optimization',
      description: 'Deep dive into campaign metrics, A/B testing, and performance optimization strategies.',
      category: 'ai-agents',
      author: 'David Park',
      date: '2025-08-01',
      readTime: '15 min read',
      views: 2234,
      likes: 167,
      featured: true,
      tags: ['campaigns', 'analytics', 'optimization'],
      status: 'published',
      difficulty: 'Advanced'
    },
    {
      id: 6,
      title: 'API Authentication and Rate Limiting',
      description: 'Complete guide to API authentication methods, rate limiting, and best practices.',
      category: 'api-docs',
      author: 'Emma Wilson',
      date: '2025-07-28',
      readTime: '10 min read',
      views: 1789,
      likes: 124,
      featured: false,
      tags: ['api', 'authentication', 'rate-limiting'],
      status: 'published',
      difficulty: 'Intermediate'
    }
  ]);

  const [stats] = useState({
    totalArticles: 156,
    totalViews: 45234,
    avgRating: 4.8,
    searchesThisWeek: 1247
  });

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📚 AI-powered documentation • Smart search • Expert guides
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 text-blue-500 px-4 py-2 rounded-lg font-semibold">
                {stats.totalArticles} Articles
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition-all">
                <Plus className="w-5 h-5" />
                <span>New Article</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Articles</p>
                  <p className="text-2xl font-bold">{stats.totalArticles}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Views</p>
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Rating</p>
                  <p className="text-2xl font-bold">{stats.avgRating}/5</p>
                </div>
                <Star className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Searches This Week</p>
                  <p className="text-2xl font-bold">{stats.searchesThisWeek}</p>
                </div>
                <Search className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <div className="w-80 space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search Knowledge Base</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, guides, and docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Plus className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">Create New Article</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Upload className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Import Documents</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Manage Categories</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-500 dark:text-gray-400">
                  ({filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'})
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Articles Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group ${
                    viewMode === 'list' ? 'p-6' : 'p-6'
                  }`}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className={viewMode === 'list' ? 'flex items-center space-x-6' : ''}>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {article.featured && (
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(article.difficulty)}`}>
                            {article.difficulty}
                          </span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {article.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className={viewMode === 'list' ? 'flex items-center space-x-6' : 'flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'}>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{article.likes}</span>
                        </div>
                      </div>
                      
                      {viewMode === 'list' && (
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or browse different categories.
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all">
                  Create New Article
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
