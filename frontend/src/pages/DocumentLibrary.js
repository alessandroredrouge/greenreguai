import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ArrowLeft, Download, Share, Bookmark, Eye, ChevronRight, Clock, Tag, FolderIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchDocuments } from '../lib/api';

export default function DocumentLibrary() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    region: null,
    category: null,
    tags: [],
    page: 1,
    per_page: 12
  });

  const recentItems = [
    'Solar Guidelines',
    'Wind Power Report',
    'Hydro Regulations'
  ];

  const tags = [
    { name: 'Solar', active: true },
    { name: 'Wind', active: false },
    { name: 'Hydro', active: false },
    { name: 'Compliance', active: false },
    { name: 'Safety', active: false }
  ];

  const bookmarks = [
    'Important Guidelines',
    'Reference Docs',
    'Templates'
  ];

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchDocuments({
        query: searchTerm,
        ...filters
      });
      setDocuments(response.items);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [searchTerm, filters]);

  const handleTagClick = (tagName) => {
    const updatedTags = tags.map(tag => ({
      ...tag,
      active: tag.name === tagName ? !tag.active : tag.active
    }));
    
    // Update filters with active tags
    const activeTags = updatedTags.filter(tag => tag.active).map(tag => tag.name);
    setFilters(prev => ({
      ...prev,
      tags: activeTags
    }));
  };

  const handleCategoryClick = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? null : category
    }));
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex h-screen bg-eco-black">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-eco-dark bg-eco-darker overflow-y-auto">
        {/* Folders Section */}
        <div className="p-4 border-b border-eco-dark">
          <h2 className="font-code text-eco-text mb-4 flex items-center gap-2">
            <FolderIcon className="h-4 w-4 text-eco-green" /> Folders
          </h2>
          <div className="space-y-2">
            {['Regulations', 'Guidelines', 'Reports', 'Templates'].map((folder) => (
              <button
                key={folder}
                onClick={() => handleCategoryClick(folder.toLowerCase())}
                className={`w-full text-left px-4 py-2 hover:bg-eco-dark/50 rounded-lg transition-colors font-code ${
                  filters.category === folder.toLowerCase() 
                    ? 'text-eco-green bg-eco-green/10' 
                    : 'text-eco-gray hover:text-eco-text'
                }`}
              >
                {folder}
                <ChevronRight className="float-right h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Section */}
        <div className="p-4 border-b border-eco-dark">
          <h2 className="font-code text-eco-text mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-eco-green" /> Recent
          </h2>
          <div className="space-y-2">
            {recentItems.map((item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-2 text-eco-gray hover:text-eco-text hover:bg-eco-dark/50 rounded-lg transition-colors font-code"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Section */}
        <div className="p-4 border-b border-eco-dark">
          <h2 className="font-code text-eco-text mb-4 flex items-center gap-2">
            <Tag className="h-4 w-4 text-eco-green" /> Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => handleTagClick(tag.name)}
                className={`px-3 py-1 rounded-full font-code text-sm transition-colors ${
                  tag.active 
                    ? 'bg-eco-green/20 text-eco-green border border-eco-green' 
                    : 'bg-eco-dark/50 text-eco-gray hover:text-eco-text hover:bg-eco-dark border border-transparent'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarks Section */}
        <div className="p-4">
          <h2 className="font-code text-eco-text mb-4 flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-eco-green" /> Bookmarks
          </h2>
          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <button
                key={bookmark}
                className="w-full text-left px-4 py-2 text-eco-gray hover:text-eco-text hover:bg-eco-dark/50 rounded-lg transition-colors font-code"
              >
                {bookmark}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-eco-darker border-b border-eco-dark p-4 flex items-center justify-between">
          <Link 
            to="/dashboard"
            className="flex items-center gap-2 text-eco-green hover:text-eco-text transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-code">Back to Dashboard</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-eco-gray" />
              <input
                type="text"
                placeholder="Search documents... (⌘K)"
                className="flex-1 bg-eco-black border border-eco-dark rounded-lg py-2 pl-10 pr-4 text-eco-text placeholder:text-eco-gray focus:outline-none focus:ring-2 focus:ring-eco-green"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="ml-2 bg-eco-green/10 text-eco-green border border-eco-green px-4 py-2 rounded-lg hover:bg-eco-green/20 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-eco-green/20 text-eco-green' : 'text-eco-gray hover:text-eco-text'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-eco-green/20 text-eco-green' : 'text-eco-gray hover:text-eco-text'}`}
            >
              <List className="h-5 w-5" />
            </button>
            <button className="bg-eco-green/10 text-eco-green border border-eco-green px-4 py-2 rounded-lg hover:bg-eco-green/20 transition-colors">
              Filters
            </button>
            <button className="bg-eco-green/10 text-eco-green border border-eco-green px-4 py-2 rounded-lg hover:bg-eco-green/20 transition-colors">
              Upload
            </button>
          </div>
        </div>

        {/* Documents Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-eco-green">Loading...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-red-500">{error}</div>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {documents.map((doc) => (
                <div
                  key={doc.document_id}
                  className={`bg-eco-darker border border-eco-dark rounded-lg ${
                    viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center justify-between'
                  }`}
                >
                  <div className={viewMode === 'grid' ? '' : 'flex items-center gap-4 flex-1'}>
                    <div className="text-eco-text font-code mb-2">
                      <h3 className="text-lg">{doc.title}</h3>
                      <p className="text-eco-gray text-sm">{doc.region}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 my-3">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-eco-green/10 text-eco-green text-sm px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`flex ${viewMode === 'grid' ? 'justify-between' : 'gap-4'} items-center mt-4`}>
                    <div className="flex items-center gap-2">
                      <span className="text-eco-gray text-sm">
                        Updated {new Date(doc.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={doc.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-eco-gray hover:text-eco-green"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                      <button className="p-2 text-eco-gray hover:text-eco-green">
                        <Share className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-eco-gray hover:text-eco-green">
                        <Bookmark className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-eco-gray hover:text-eco-green">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}