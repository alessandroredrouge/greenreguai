import React from "react";
import { X } from "lucide-react";

export default function CitationPreviewModal({
  isOpen,
  onClose,
  citations, // Array of citation objects with chunk content, document info, etc.
  onViewSource, // Callback when "View original source" is clicked for a specific citation
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
      <div className="bg-harvey-bg-lighter border border-harvey-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-harvey-text font-medium text-lg">
            Source References
          </h3>
          <button
            onClick={onClose}
            className="text-harvey-text-light hover:text-harvey-text transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Citations Content */}
        <div className="space-y-6">
          {citations.map((citation, index) => (
            <div
              key={citation.index}
              className="border border-harvey-border rounded-lg p-4 bg-harvey-bg"
            >
              <h4 className="text-gray-700 font-medium mb-2">
                Source {citation.index}
              </h4>

              {/* Document Info */}
              <div className="mb-3">
                <p className="text-harvey-text font-medium text-sm">
                  {citation.document_title}
                </p>
                <div className="flex items-center gap-2 text-harvey-text-light text-sm">
                  <span>Page {citation.page_number}</span>
                  <span>•</span>
                  <span>{citation.publication_year}</span>
                </div>
              </div>

              {/* Chunk Content */}
              <div className="bg-harvey-bg-darker rounded p-3 mb-4 text-harvey-text text-sm">
                {citation.content}
              </div>

              {/* View Source Button */}
              <button
                onClick={() => onViewSource(citation)}
                className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 
                         rounded-lg hover:bg-gray-200 transition-all border 
                         border-gray-300 text-sm"
              >
                View Original Source
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
