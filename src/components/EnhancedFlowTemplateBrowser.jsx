import React, { useState, useEffect } from 'react';
import { 
  Template, Search, Filter, Download, Plus, Star,
  Eye, Copy, Trash2, BookOpen, Zap, Users, Settings,
  CheckCircle, Clock, ArrowRight, X, FileText
} from 'lucide-react';
import FlowTemplateManager, { FlowCategories } from '../lib/flowTemplateManager';

const EnhancedFlowTemplateBrowser = ({ isOpen, onClose, onTemplateSelect, onTemplateLoad }) => {
  const [templateManager] = useState(() => new FlowTemplateManager());
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadTemplates();
  }, [templateManager]);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory, sortBy]);

  const loadTemplates = () => {
    const allTemplates = templateManager.getAllTemplates();
    setTemplates(Object.values(allTemplates));
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'created':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'nodes':
          return (b.nodes?.length || 0) - (a.nodes?.length || 0);
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = (template) => {
    try {
      const instance = templateManager.instantiateTemplate(template.id);
      if (onTemplateLoad) {
        onTemplateLoad(instance.nodes, instance.edges, template);
      }
      if (onTemplateSelect) {
        onTemplateSelect(template);
      }
      onClose();
    } catch (error) {
      console.error('Failed to load template:', error);
      alert('Failed to load template: ' + error.message);
    }
  };

  const getCategoryIcon = (category) => {
    const categoryInfo = FlowCategories[category];
    return categoryInfo?.icon || '📄';
  };

  const getCategoryColor = (category) => {
    const categoryInfo = FlowCategories[category];
    return categoryInfo?.color || 'bg-gray-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex">
        
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Template className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Flow Templates</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(FlowCategories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="category">Category</option>
                  <option value="created">Created Date</option>
                  <option value="nodes">Complexity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Template List */}
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`group p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:shadow-md transition-all ${
                    selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(template.category)}</span>
                        <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getCategoryColor(template.category)}`}>
                          {FlowCategories[template.category]?.name || template.category}
                        </span>
                        {template.isCustom && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{template.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{template.nodes?.length || 0} nodes</span>
                        <span>{template.edges?.length || 0} connections</span>
                        {template.createdAt && (
                          <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No templates found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedTemplate ? (
            <div className="flex-1 flex flex-col">
              
              {/* Template Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(selectedTemplate.category)}</span>
                      <h1 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h1>
                      {selectedTemplate.isCustom && (
                        <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                          Custom
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{selectedTemplate.nodes?.length || 0} nodes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>{selectedTemplate.edges?.length || 0} connections</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span className="capitalize">{selectedTemplate.category}</span>
                      </div>
                      {selectedTemplate.createdAt && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(selectedTemplate.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUseTemplate(selectedTemplate)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Template Preview */}
              <div className="flex-1 p-6 bg-gray-50">
                <div className="bg-white rounded-lg border border-gray-200 h-full p-6">
                  <h3 className="text-lg font-medium mb-4">Flow Preview</h3>
                  
                  <div className="space-y-4">
                    {selectedTemplate.nodes?.slice(0, 5).map((node, index) => (
                      <div key={node.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{node.data?.label || node.id}</div>
                          <div className="text-sm text-gray-500 capitalize">{node.type} node</div>
                        </div>
                        {index < selectedTemplate.nodes.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                    
                    {selectedTemplate.nodes?.length > 5 && (
                      <div className="text-center py-3 text-gray-500">
                        ... and {selectedTemplate.nodes.length - 5} more nodes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Template className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Select a Template</h3>
                <p>Choose a template from the list to see its details and preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedFlowTemplateBrowser;
