import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Grid, List, X, Star, Clock, Users, Database, Phone, Zap, Workflow } from 'lucide-react';
import { 
  NODE_TEMPLATES, 
  TEMPLATE_CATEGORIES, 
  getTemplatesByCategory, 
  searchTemplates,
  createNodeFromTemplate 
} from '../lib/nodeTemplates';

const CATEGORY_ICONS = {
  [TEMPLATE_CATEGORIES.GREETING]: Clock,
  [TEMPLATE_CATEGORIES.INFORMATION]: Database,
  [TEMPLATE_CATEGORIES.DECISION]: Zap,
  [TEMPLATE_CATEGORIES.DATA_COLLECTION]: Users,
  [TEMPLATE_CATEGORIES.VOICE_ACTIONS]: Phone,
  [TEMPLATE_CATEGORIES.INTEGRATION]: Grid,
  [TEMPLATE_CATEGORIES.WORKFLOW]: Workflow
};

const CATEGORY_COLORS = {
  [TEMPLATE_CATEGORIES.GREETING]: 'bg-blue-500',
  [TEMPLATE_CATEGORIES.INFORMATION]: 'bg-green-500',
  [TEMPLATE_CATEGORIES.DECISION]: 'bg-yellow-500',
  [TEMPLATE_CATEGORIES.DATA_COLLECTION]: 'bg-purple-500',
  [TEMPLATE_CATEGORIES.VOICE_ACTIONS]: 'bg-pink-500',
  [TEMPLATE_CATEGORIES.INTEGRATION]: 'bg-indigo-500',
  [TEMPLATE_CATEGORIES.WORKFLOW]: 'bg-red-500'
};

const NodeTemplateBrowser = ({ 
  isDarkMode, 
  onTemplateSelect, 
  onClose,
  isOpen 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [favoriteTemplates, setFavoriteTemplates] = useState(new Set());

  // Filter and search templates
  const filteredTemplates = useMemo(() => {
    let templates = Object.values(NODE_TEMPLATES);
    
    // Filter by category
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery);
    }
    
    return templates;
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (templateId) => {
    const newFavorites = new Set(favoriteTemplates);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavoriteTemplates(newFavorites);
  };

  const handleTemplateSelect = (template, position) => {
    const newNode = createNodeFromTemplate(template.id, position);
    if (newNode && onTemplateSelect) {
      onTemplateSelect(newNode);
    }
  };

  const getCategoryDisplayName = (category) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-6xl mx-4 h-5/6 rounded-xl shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <Grid size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Node Templates</h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Choose from pre-built node templates to speed up your workflow creation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className={`flex rounded-lg p-1 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={16} />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={`p-4 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} size={20} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Categories</option>
              {Object.values(TEMPLATE_CATEGORIES).map(category => (
                <option key={category} value={category}>
                  {getCategoryDisplayName(category)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className={`flex-1 overflow-y-auto p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Search className={`mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} size={48} />
              <p className={`text-lg font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>No templates found</p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
            }>
              {filteredTemplates.map(template => {
                const CategoryIcon = CATEGORY_ICONS[template.category] || Grid;
                const categoryColor = CATEGORY_COLORS[template.category] || 'bg-gray-500';
                const isFavorite = favoriteTemplates.has(template.id);

                return viewMode === 'grid' ? (
                  // Grid View
                  <div
                    key={template.id}
                    className={`relative rounded-lg border-2 border-dashed cursor-pointer transition-all hover:border-blue-500 hover:shadow-lg group ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-650'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleTemplateSelect(template, { x: 100, y: 100 })}
                  >
                    {/* Favorite Star */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(template.id);
                      }}
                      className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                        isFavorite 
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : isDarkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>

                    <div className="p-4">
                      {/* Category Badge */}
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white mb-3 ${categoryColor}`}>
                        <CategoryIcon size={12} />
                        {getCategoryDisplayName(template.category)}
                      </div>

                      {/* Template Icon and Name */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">{template.icon}</div>
                        <h3 className={`font-semibold truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{template.name}</h3>
                      </div>

                      {/* Description */}
                      <p className={`text-sm line-clamp-2 mb-3 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{template.description}</p>

                      {/* Add Button */}
                      <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                        <Plus size={16} />
                        Add Template
                      </button>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div
                    key={template.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:border-blue-500 hover:shadow-md group ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-650'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleTemplateSelect(template, { x: 100, y: 100 })}
                  >
                    {/* Template Icon */}
                    <div className="text-2xl flex-shrink-0">{template.icon}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`font-semibold truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{template.name}</h3>
                        
                        {/* Category Badge */}
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${categoryColor}`}>
                          <CategoryIcon size={10} />
                          {getCategoryDisplayName(template.category)}
                        </div>
                      </div>
                      <p className={`text-sm truncate ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{template.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(template.id);
                        }}
                        className={`p-2 rounded transition-colors ${
                          isFavorite 
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : isDarkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      
                      <button className="flex items-center gap-2 py-2 px-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-between items-center ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </p>
          
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {favoriteTemplates.size} favorite{favoriteTemplates.size !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeTemplateBrowser;
