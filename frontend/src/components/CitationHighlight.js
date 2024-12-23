import React from 'react';

export default function CitationHighlight({ text, onCitationClick }) {
  // Function to parse text and wrap citations in styled spans
  const renderTextWithCitations = (text) => {
    // Split text by citation pattern [0] or [1,2,3]
    const parts = text.split(/(\[[0-9,\s]+\])/g);
    
    return parts.map((part, index) => {
      // Check if part matches citation pattern
      if (/^\[[0-9,\s]+\]$/.test(part)) {
        return (
          <button
            key={index}
            onClick={() => {
              // Extract citation numbers from [0,1,2] format
              const citations = part
                .slice(1, -1)  // Remove [ ]
                .split(',')    // Split by comma
                .map(num => num.trim()); // Clean up and convert to numbers
              onCitationClick(citations);
            }}
            className="text-red-500 hover:text-red-400 font-medium 
                     inline-block animate-citation-pulse"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return <div className="inline">{renderTextWithCitations(text)}</div>;
} 