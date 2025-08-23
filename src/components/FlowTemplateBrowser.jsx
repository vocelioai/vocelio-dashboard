import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List,
  Star,
  Clock,
  Users,
  TrendingUp,
  Download,
  Eye,
  Copy,
  X,
  ChevronDown,
  ChevronRight,
  Zap,
  Award,
  BarChart3,
  Calendar,
  Headphones,
  Wrench,
  PieChart
} from 'lucide-react';

import {
  FLOW_TEMPLATES,
  FLOW_CATEGORIES,
  COMPLEXITY_LEVELS,
  getFlowsByCategory,
  searchFlowTemplates,
  getFlowsByComplexity,
  getPopularFlows,
  getHighRatedFlows,
  createFlowFromTemplate,
  getFlowTemplateAnalytics
} from '../lib/flowTemplates';

const CATEGORY_ICONS = {
  [FLOW_CATEGORIES.CUSTOMER_SERVICE]: Headphones,
  [FLOW_CATEGORIES.SALES]: TrendingUp,
  [FLOW_CATEGORIES.APPOINTMENT_BOOKING]: Calendar,
  [FLOW_CATEGORIES.LEAD_QUALIFICATION]: Users,
  [FLOW_CATEGORIES.SUPPORT]: Wrench,
  [FLOW_CATEGORIES.SURVEY]: BarChart3,
  [FLOW_CATEGORIES.GENERAL]: Zap
};

const CATEGORY_COLORS = {
  [FLOW_CATEGORIES.CUSTOMER_SERVICE]: 'bg-blue-500',
  [FLOW_CATEGORIES.SALES]: 'bg-green-500',
  [FLOW_CATEGORIES.APPOINTMENT_BOOKING]: 'bg-purple-500',
  [FLOW_CATEGORIES.LEAD_QUALIFICATION]: 'bg-orange-500',
  [FLOW_CATEGORIES.SUPPORT]: 'bg-red-500',
  [FLOW_CATEGORIES.SURVEY]: 'bg-indigo-500',
  [FLOW_CATEGORIES.GENERAL]: 'bg-gray-500'
};

const COMPLEXITY_COLORS = {
  [COMPLEXITY_LEVELS.SIMPLE]: 'text-green-500',
  [COMPLEXITY_LEVELS.MEDIUM]: 'text-yellow-500',
  [COMPLEXITY_LEVELS.COMPLEX]: 'text-red-500'
};

const FlowTemplateBrowser = ({
  isDarkMode = false,
  onTemplateSelect,
  onClose,
  isOpen = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'popularity', 'name', 'complexity'
  const [showFilters, setShowFilters] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [favoriteTemplates, setFavoriteTemplates] = useState(new Set());

  // Get analytics data
  const analytics = useMemo(() => getFlowTemplateAnalytics(), []);

  // Filter and search templates
  const filteredTemplates = useMemo(() => {
    let templates = Object.values(FLOW_TEMPLATES);

    // Apply search
    if (searchQuery.trim()) {
      templates = searchFlowTemplates(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === selectedCategory);
    }

    // Apply complexity filter
    if (selectedComplexity !== 'all') {
      templates = templates.filter(t => t.complexity === selectedComplexity);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        templates.sort((a, b) => (b.metadata.rating || 0) - (a.metadata.rating || 0));
        break;
      case 'popularity':
        templates.sort((a, b) => (b.metadata.useCount || 0) - (a.metadata.useCount || 0));
        break;
      case 'name':
        templates.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'complexity':
        const complexityOrder = { simple: 1, medium: 2, complex: 3 };
        templates.sort((a, b) => complexityOrder[a.complexity] - complexityOrder[b.complexity]);
        break;
      default:
        break;
    }

    return templates;
  }, [searchQuery, selectedCategory, selectedComplexity, sortBy]);

  const handleTemplateSelect = (template) => {
    try {
      const newFlow = createFlowFromTemplate(template.id);
      onTemplateSelect(newFlow);
      onClose();
    } catch (error) {
      console.error('Error creating flow from template:', error);
    }
  };

  const toggleFavorite = (templateId) => {
    const newFavorites = new Set(favoriteTemplates);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavoriteTemplates(newFavorites);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`w-full max-w-7xl h-5/6 rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Flow Templates</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Choose from {analytics.totalTemplates} pre-built workflow templates</p>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Analytics Bar */}
        <div className={`p-4 border-b grid grid-cols-4 gap-4 ${
          isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{analytics.totalTemplates}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Total Templates</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{analytics.averageRating.toFixed(1)}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Avg Rating</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{analytics.totalUseCount}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Total Uses</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-green-500`}>
              {Math.round((analytics.complexityDistribution.simple / analytics.totalTemplates) * 100)}%
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Simple Flows</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="all">All Categories</option>
              {Object.entries(FLOW_CATEGORIES).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>

            {/* Complexity Filter */}
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="all">All Complexity</option>
              {Object.values(COMPLEXITY_LEVELS).map(complexity => (
                <option key={complexity} value={complexity}>
                  {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value="rating">Sort by Rating</option>
              <option value="popularity">Sort by Popularity</option>
              <option value="name">Sort by Name</option>
              <option value="complexity">Sort by Complexity</option>
            </select>

            {/* View Mode Toggle */}
            <div className={`flex rounded-lg border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid'
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-500 text-white'
                    : isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list'
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-500 text-white'
                    : isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <PieChart className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>No templates found</p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const CategoryIcon = CATEGORY_ICONS[template.category];
                const categoryColor = CATEGORY_COLORS[template.category];
                
                return (
                  <div
                    key={template.id}
                    className={`group relative border rounded-xl p-6 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                      isDarkMode 
                        ? 'bg-gray-750 border-gray-600 hover:border-gray-500' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl'
                    }`}
                  >
                    {/* Template Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${categoryColor}`}>
                          {template.icon ? (
                            <span className="text-xl">{template.icon}</span>
                          ) : (
                            <CategoryIcon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-sm ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{template.name}</h3>
                          <div className={`flex items-center gap-2 mt-1`}>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {template.category.replace('_', ' ')}
                            </span>
                            <span className={`text-xs font-medium ${COMPLEXITY_COLORS[template.complexity]}`}>
                              {template.complexity}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(template.id);
                        }}
                        className={`p-1 rounded transition-colors ${
                          favoriteTemplates.has(template.id)
                            ? 'text-yellow-500'
                            : isDarkMode 
                              ? 'text-gray-400 hover:text-yellow-500' 
                              : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${favoriteTemplates.has(template.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Template Description */}
                    <p className={`text-sm mb-4 line-clamp-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {template.description}
                    </p>

                    {/* Template Stats */}
                    <div className="flex items-center justify-between mb-4 text-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {template.metadata.rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {template.metadata.useCount || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {template.estimatedDuration}
                          </span>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        template.successRate >= 90 
                          ? 'bg-green-100 text-green-700' 
                          : template.successRate >= 75 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {template.successRate}% success
                      </div>
                    </div>

                    {/* Template Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 rounded ${
                            isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags?.length > 3 && (
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleTemplateSelect(template)}
                        className="flex-1 px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Use Template
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List view
            <div className="space-y-4">
              {filteredTemplates.map((template) => {
                const CategoryIcon = CATEGORY_ICONS[template.category];
                
                return (
                  <div
                    key={template.id}
                    className={`flex items-center gap-6 p-4 border rounded-lg transition-colors cursor-pointer hover:shadow-md ${
                      isDarkMode 
                        ? 'bg-gray-750 border-gray-600 hover:border-gray-500' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${CATEGORY_COLORS[template.category]}`}>
                      {template.icon ? (
                        <span className="text-xl">{template.icon}</span>
                      ) : (
                        <CategoryIcon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{template.name}</h3>
                        <span className={`text-sm font-medium ${COMPLEXITY_COLORS[template.complexity]}`}>
                          {template.complexity}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{template.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{template.metadata.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{template.metadata.useCount || 0} uses</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{template.estimatedDuration}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full ${
                          template.successRate >= 90 
                            ? 'bg-green-100 text-green-700' 
                            : template.successRate >= 75 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {template.successRate}% success
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(template.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          favoriteTemplates.has(template.id)
                            ? 'text-yellow-500'
                            : isDarkMode 
                              ? 'text-gray-400 hover:text-yellow-500' 
                              : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${favoriteTemplates.has(template.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleTemplateSelect(template)}
                        className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center">
          <div className={`w-full max-w-4xl max-h-5/6 rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } flex flex-col`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{previewTemplate.name}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Description</h4>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {previewTemplate.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Template Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Category:</span>
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {previewTemplate.category.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Complexity:</span>
                        <span className={`font-medium ${COMPLEXITY_COLORS[previewTemplate.complexity]}`}>
                          {previewTemplate.complexity.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Duration:</span>
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {previewTemplate.estimatedDuration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Success Rate:</span>
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {previewTemplate.successRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Flow Structure</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Nodes:</span>
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {previewTemplate.nodes.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Connections:</span>
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {previewTemplate.edges.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                            {previewTemplate.metadata.rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className={`font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className={`font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Node Breakdown</h4>
                  <div className="space-y-2">
                    {previewTemplate.nodes.map((node, index) => (
                      <div
                        key={node.id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-medium`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{node.data.label}</div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>Type: {node.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleTemplateSelect(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowTemplateBrowser;
