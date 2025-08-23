import React, { useState, useEffect } from 'react';
import {
  Plus,
  Download,
  Upload,
  Trash2,
  Edit,
  Copy,
  Star,
  Archive,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  FolderOpen,
  Save,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';

import {
  FLOW_TEMPLATES,
  FLOW_CATEGORIES,
  COMPLEXITY_LEVELS,
  exportFlowTemplate,
  importFlowTemplate,
  createFlowFromTemplate,
  getFlowTemplateAnalytics
} from '../lib/flowTemplates';

const FlowTemplateManager = ({
  isDarkMode = false,
  onTemplateCreate,
  onTemplateImport,
  onTemplateEdit,
  onClose
}) => {
  const [templates, setTemplates] = useState(Object.values(FLOW_TEMPLATES));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplates, setSelectedTemplates] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setAnalytics(getFlowTemplateAnalytics());
  }, [templates]);

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (templateId) => {
    const newSelected = new Set(selectedTemplates);
    if (newSelected.has(templateId)) {
      newSelected.delete(templateId);
    } else {
      newSelected.add(templateId);
    }
    setSelectedTemplates(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedTemplates.size === 0) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedTemplates.size} template(s)?`);
    if (confirmed) {
      setTemplates(prev => prev.filter(t => !selectedTemplates.has(t.id)));
      setSelectedTemplates(new Set());
    }
  };

  const handleExportTemplate = (template) => {
    const exportData = exportFlowTemplate(template);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = (jsonData) => {
    try {
      const importedTemplate = importFlowTemplate(jsonData);
      setTemplates(prev => [...prev, importedTemplate]);
      setShowImportModal(false);
      if (onTemplateImport) {
        onTemplateImport(importedTemplate);
      }
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };

  const handleDuplicateTemplate = (template) => {
    const duplicated = {
      ...template,
      id: `${template.id}_copy_${Date.now()}`,
      name: `${template.name} (Copy)`,
      metadata: {
        ...template.metadata,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        useCount: 0,
        originalTemplate: template.id
      }
    };
    setTemplates(prev => [...prev, duplicated]);
  };

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div>
          <h1 className="text-2xl font-bold">Flow Template Manager</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and organize your flow templates
          </p>
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

      {/* Analytics Cards */}
      {analytics && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Templates
                </p>
                <p className="text-2xl font-bold">{analytics.totalTemplates}</p>
              </div>
              <FolderOpen className={`w-8 h-8 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
              }`} />
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Avg Rating
                </p>
                <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Uses
                </p>
                <p className="text-2xl font-bold">{analytics.totalUseCount}</p>
              </div>
              <RefreshCw className={`w-8 h-8 ${
                isDarkMode ? 'text-green-400' : 'text-green-500'
              }`} />
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Most Popular
                </p>
                <p className="text-lg font-bold truncate">
                  {analytics.mostPopular?.name || 'N/A'}
                </p>
              </div>
              <Archive className={`w-8 h-8 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-500'
              }`} />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className={`flex flex-col lg:flex-row gap-4 p-6 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
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
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
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

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          {selectedTemplates.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedTemplates.size})
            </button>
          )}
        </div>
      </div>

      {/* Templates Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className={`sticky top-0 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <tr className={`border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <th className="w-8 p-4">
                <input
                  type="checkbox"
                  checked={selectedTemplates.size === filteredTemplates.length && filteredTemplates.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTemplates(new Set(filteredTemplates.map(t => t.id)));
                    } else {
                      setSelectedTemplates(new Set());
                    }
                  }}
                  className="rounded"
                />
              </th>
              <th className="text-left p-4 font-semibold">Template</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Complexity</th>
              <th className="text-left p-4 font-semibold">Rating</th>
              <th className="text-left p-4 font-semibold">Uses</th>
              <th className="text-left p-4 font-semibold">Modified</th>
              <th className="text-center p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTemplates.map((template) => (
              <tr
                key={template.id}
                className={`border-b transition-colors hover:bg-opacity-50 ${
                  isDarkMode 
                    ? 'border-gray-700 hover:bg-gray-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                } ${selectedTemplates.has(template.id) ? 
                  isDarkMode ? 'bg-gray-700' : 'bg-blue-50' 
                  : ''
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedTemplates.has(template.id)}
                    onChange={() => handleSelectTemplate(template.id)}
                    className="rounded"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{template.icon || '📋'}</div>
                    <div>
                      <div className="font-semibold">{template.name}</div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {template.description.substring(0, 80)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {template.category.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${
                    template.complexity === 'simple' ? 'text-green-500' :
                    template.complexity === 'medium' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {template.complexity.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{template.metadata.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </td>
                <td className="p-4">
                  {template.metadata.useCount || 0}
                </td>
                <td className="p-4">
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {new Date(template.metadata.lastModified).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleDuplicateTemplate(template)}
                      className={`p-2 rounded transition-colors ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingTemplate(template)}
                      className={`p-2 rounded transition-colors ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExportTemplate(template)}
                      className={`p-2 rounded transition-colors ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title="Export"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Search className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>No templates found</p>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          isDarkMode={isDarkMode}
          onImport={handleImportTemplate}
          onClose={() => setShowImportModal(false)}
        />
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <CreateTemplateModal
          isDarkMode={isDarkMode}
          onCreate={(template) => {
            setTemplates(prev => [...prev, template]);
            setShowCreateModal(false);
            if (onTemplateCreate) onTemplateCreate(template);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Template Modal */}
      {editingTemplate && (
        <EditTemplateModal
          template={editingTemplate}
          isDarkMode={isDarkMode}
          onSave={(updatedTemplate) => {
            setTemplates(prev => prev.map(t => 
              t.id === updatedTemplate.id ? updatedTemplate : t
            ));
            setEditingTemplate(null);
            if (onTemplateEdit) onTemplateEdit(updatedTemplate);
          }}
          onClose={() => setEditingTemplate(null)}
        />
      )}
    </div>
  );
};

// Import Modal Component
const ImportModal = ({ isDarkMode, onImport, onClose }) => {
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');

  const handleImport = () => {
    try {
      setError('');
      onImport(jsonData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonData(e.target?.result || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Import Template</h3>
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

        <div className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Upload JSON file:
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className={`w-full p-2 border rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="text-center">
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>or</span>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Paste JSON data:
            </label>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              rows={10}
              className={`w-full p-3 border rounded-lg font-mono text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              placeholder="Paste your template JSON here..."
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
        </div>

        <div className={`flex gap-3 p-6 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!jsonData.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            Import Template
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Template Modal (placeholder - you can expand this)
const CreateTemplateModal = ({ isDarkMode, onCreate, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`w-full max-w-md rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`p-6 text-center`}>
          <h3 className={`text-xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Create New Template</h3>
          <p className={`mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            This feature will allow you to create templates from existing flows.
            Coming soon!
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Template Modal (placeholder - you can expand this)
const EditTemplateModal = ({ template, isDarkMode, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`w-full max-w-md rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`p-6 text-center`}>
          <h3 className={`text-xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Edit Template</h3>
          <p className={`mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Editing template: {template.name}
          </p>
          <p className={`mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Template editing interface coming soon!
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowTemplateManager;
