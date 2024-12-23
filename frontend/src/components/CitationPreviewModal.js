import React from 'react';
import { X } from 'lucide-react';

export default function CitationPreviewModal({ 
  isOpen, 
  onClose, 
  citations,  // Array of citation objects with chunk content, document info, etc.
  onViewSource // Callback when "View original source" is clicked for a specific citation
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
      <div className="bg-eco-darker border border-eco-dark rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-eco-text font-code text-lg">Source References</h3>
          <button
            onClick={onClose}
            className="text-eco-gray hover:text-eco-text transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Citations Content */}
        <div className="space-y-6">
          {citations.map((citation, index) => (
            <div 
              key={citation.index} 
              className="border border-eco-dark rounded-lg p-4"
            >
              <h4 className="text-eco-green font-code mb-2">
                Source {citation.index}
              </h4>
              
              {/* Document Info */}
              <div className="mb-3">
                <p className="text-eco-text font-code text-sm">
                  {citation.document_title}
                </p>
                <div className="flex items-center gap-2 text-eco-gray text-sm">
                  <span>Page {citation.page_number}</span>
                  <span>•</span>
                  <span>{citation.publication_year}</span>
                </div>
              </div>

              {/* Chunk Content */}
              <div className="bg-eco-black/50 rounded p-3 mb-4 text-eco-text text-sm">
                {citation.content}
              </div>

              {/* View Source Button */}
              <button
                onClick={() => onViewSource(citation)}
                className="w-full bg-eco-green/10 text-eco-green font-code py-2 px-4 
                         rounded-lg hover:bg-eco-green/20 transition-all border 
                         border-eco-green text-sm"
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