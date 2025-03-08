import React, { useState, useEffect } from "react";
import { Search, Grid, List, ArrowLeft, Download, X } from "lucide-react";
import { Link } from "react-router-dom";
import { searchDocuments } from "../lib/api";
import FiltersDrawer from "../components/FiltersDrawer";
import Pagination from "../components/Pagination";

export default function DocumentLibrary() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
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
    per_page: 12,
  });
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchDocuments({
        query: searchTerm,
        ...filters,
      });
      setDocuments(response.items);
      setTotalPages(response.total_pages);
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
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
    if (window.innerWidth < 768) {
      setShowMobilePreview(true);
    }
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-harvey-bg">
      {/* Desktop Preview Sidebar */}
      <div className="hidden md:block w-1/4 border-r border-gray-800 bg-harvey-sidebar overflow-y-auto p-6">
        {selectedDocument ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-white mb-1 font-medium">
                {selectedDocument.title}
              </h2>
              <p className="text-gray-300 text-sm mb-3">
                {selectedDocument.publication_year}
              </p>
              <p className="text-gray-400">{selectedDocument.description}</p>
            </div>

            <div>
              <h3 className="text-white mb-2 font-medium">Details</h3>
              <div className="space-y-2">
                <p className="text-gray-400">
                  Region:{" "}
                  <span className="text-gray-300">
                    {selectedDocument.region}
                  </span>
                </p>
                <p className="text-gray-400">
                  Category:{" "}
                  <span className="text-gray-300">
                    {selectedDocument.category}
                  </span>
                </p>
                <p className="text-gray-400">
                  File Size:{" "}
                  <span className="text-gray-300">
                    {Math.round(selectedDocument.file_size / 1024)} KB
                  </span>
                </p>
                <p className="text-gray-400">
                  Type:{" "}
                  <span className="text-gray-300">
                    {selectedDocument.mime_type}
                  </span>
                </p>
                <p className="text-gray-400">
                  Updated:{" "}
                  <span className="text-gray-300">
                    {new Date(selectedDocument.updated_at).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-white mb-2 font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDocument.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-800 text-gray-300 text-sm px-2 py-1 rounded-full"
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
              className="block w-full bg-gray-800 text-gray-300 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-center"
            >
              Download Document
            </a>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="space-y-4">
              <h3 className="text-xl text-white font-medium">
                Document Preview
              </h3>
              <p className="text-gray-400">
                Select a document to view its details
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Preview Overlay */}
      {showMobilePreview && (
        <div className="md:hidden fixed inset-0 bg-harvey-sidebar z-40 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={() => setShowMobilePreview(false)}
              className="text-gray-300 mb-4 flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              Close Preview
            </button>
            {selectedDocument && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl text-white mb-1 font-medium">
                    {selectedDocument.title}
                  </h2>
                  <p className="text-gray-300 text-sm mb-3">
                    {selectedDocument.publication_year}
                  </p>
                  <p className="text-gray-400">
                    {selectedDocument.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-white mb-2 font-medium">Details</h3>
                  <div className="space-y-2">
                    <p className="text-gray-400">
                      Region:{" "}
                      <span className="text-gray-300">
                        {selectedDocument.region}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Category:{" "}
                      <span className="text-gray-300">
                        {selectedDocument.category}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      File Size:{" "}
                      <span className="text-gray-300">
                        {Math.round(selectedDocument.file_size / 1024)} KB
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Type:{" "}
                      <span className="text-gray-300">
                        {selectedDocument.mime_type}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Updated:{" "}
                      <span className="text-gray-300">
                        {new Date(
                          selectedDocument.updated_at
                        ).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-white mb-2 font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-800 text-gray-300 text-sm px-2 py-1 rounded-full"
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
                  className="block w-full bg-gray-800 text-gray-300 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-center"
                >
                  Download Document
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Search Header */}
        <div className="p-4 border-b border-harvey-border">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search documents..."
                  className="w-full bg-harvey-bg-lighter border border-harvey-border rounded-lg py-2 pl-4 pr-12 text-harvey-text"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-harvey-text-light hover:text-harvey-text p-2"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "text-gray-700 bg-gray-100"
                    : "text-harvey-text-light"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "text-gray-700 bg-gray-100"
                    : "text-harvey-text-light"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Filters
            </button>
          </div>
        </div>

        {/* Documents Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div
            className={`grid ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            } gap-4`}
          >
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-700">Loading...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-red-600">{error}</div>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.document_id}
                  onClick={() => handleDocumentClick(doc)}
                  className={`bg-harvey-bg-lighter border border-harvey-border rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors shadow-sm ${
                    selectedDocument?.document_id === doc.document_id
                      ? "border-gray-500"
                      : ""
                  }`}
                >
                  <div
                    className={
                      viewMode === "grid"
                        ? ""
                        : "flex items-center gap-4 flex-1"
                    }
                  >
                    <div className="flex-1">
                      <h3 className="text-harvey-text text-lg mb-1 font-medium">
                        {doc.title}
                      </h3>
                      <p className="text-gray-700 text-sm mb-2">
                        {doc.publication_year}
                      </p>
                      <p className="text-harvey-text-light text-sm">
                        {doc.region}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 my-3">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`flex ${
                      viewMode === "grid" ? "justify-between" : "gap-4"
                    } items-center mt-4`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-harvey-text-light text-sm">
                        Updated {new Date(doc.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={doc.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-harvey-text-light hover:text-gray-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fixed Pagination */}
        <div className="p-4 fixed bottom-0 left-0 right-0 bg-harvey-bg border-t border-harvey-border">
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* FiltersDrawer */}
      <FiltersDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
