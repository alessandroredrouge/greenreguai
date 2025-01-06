import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// TODO: Add this to the project
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handleInputChange = (e) => {
    const page = Number(e.target.value);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 ${
          currentPage === 1
            ? "text-eco-gray cursor-not-allowed"
            : "text-eco-green hover:text-eco-text"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

      <input
        type="number"
        value={currentPage}
        onChange={handleInputChange}
        className="w-12 text-center text-eco-text font-code bg-eco-darker border border-eco-dark rounded-lg"
      />

      <span className="text-eco-text font-code">of {totalPages}</span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 ${
          currentPage === totalPages
            ? "text-eco-gray cursor-not-allowed"
            : "text-eco-green hover:text-eco-text"
        }`}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
