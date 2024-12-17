import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 ${
          currentPage === 1 
            ? 'text-eco-gray cursor-not-allowed' 
            : 'text-eco-green hover:text-eco-text'
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>
      
      <span className="text-eco-text font-code">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 ${
          currentPage === totalPages 
            ? 'text-eco-gray cursor-not-allowed' 
            : 'text-eco-green hover:text-eco-text'
        }`}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
