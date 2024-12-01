import React, { useState, useEffect } from 'react';
import { Search, Grid, List, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchDocuments } from '../lib/api';
import FiltersDrawer from '../components/FiltersDrawer';

export default function DocumentLibrary() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    region: null,
    category: null,
    tags: [],
    year: null,
    page: 1,
    per_page: 12
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchDocuments({
        query: searchTerm,
        ...filters,
      });
      setDocuments(response.items);
    } catch (err) {
      setError("Failed to fetch documents");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [searchTerm, filters]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  return (
    <div className="flex h-screen bg-eco-black">
      {/* Preview Sidebar - Now smaller */}
      <div className="w-1/4 border-r border-eco-dark bg-eco-darker overflow-y-auto p-6">
        {selectedDocument ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-code text-eco-text mb-1">{selectedDocument.title}</h2>
              <p className="text-eco-green text-sm mb-3">{selectedDocument.publication_year}</p>
              <p className="text-eco-gray">{selectedDocument.description}</p>
            </div>

            <div>
              <h3 className="text-eco-text font-code mb-2">Details</h3>
              <div className="space-y-2">
                <p className="text-eco-gray">Region: <span className="text-eco-text">{selectedDocument.region}</span></p>
                <p className="text-eco-gray">Category: <span className="text-eco-text">{selectedDocument.category}</span></p>
                <p className="text-eco-gray">File Size: <span className="text-eco-text">{Math.round(selectedDocument.file_size / 1024)} KB</span></p>
                <p className="text-eco-gray">Type: <span className="text-eco-text">{selectedDocument.mime_type}</span></p>
                <p className="text-eco-gray">Updated: <span className="text-eco-text">
                  {new Date(selectedDocument.updated_at).toLocaleDateString()}
                </span></p>
              </div>
            </div>

            <div>
              <h3 className="text-eco-text font-code mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDocument.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-eco-green/10 text-eco-green text-sm px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={selectedDocument.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-eco-green/10 text-eco-green border border-eco-green px-4 py-2 rounded-lg hover:bg-eco-green/20 transition-colors text-center"
            >
              Download Document
            </a>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="space-y-4">
              <h3 className="text-xl font-code text-eco-text">Document Preview</h3>
              <p className="text-eco-gray">Select a document to view its details</p>
            </div>
          </div>
        )}
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
                placeholder="Search documents..."
                className="flex-1 bg-eco-black border border-eco-dark rounded-lg py-2 pl-10 pr-4 text-eco-text placeholder:text-eco-gray focus:outline-none focus:ring-2 focus:ring-eco-green"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
            <button 
              onClick={() => setIsFiltersOpen(true)}
              className="bg-eco-green/10 text-eco-green border border-eco-green px-4 py-2 rounded-lg hover:bg-eco-green/20 transition-colors"
            >
              Filters
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
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
              {documents.map((doc) => (
                <div
                  key={doc.document_id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`bg-eco-darker border border-eco-dark rounded-lg p-4 cursor-pointer hover:border-eco-green transition-colors ${
                    selectedDocument?.document_id === doc.document_id ? 'border-eco-green' : ''
                  }`}
                >
                  <div className={viewMode === 'grid' ? '' : 'flex items-center gap-4 flex-1'}>
                    <div className="flex-1">
                      <h3 className="text-eco-text font-code text-lg mb-1">{doc.title}</h3>
                      <p className="text-eco-green text-sm mb-2">{doc.publication_year}</p>
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add the FiltersDrawer component */}
      <FiltersDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
