import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// import * as pdfjs from 'pdfjs-dist';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  AlertTriangle,
} from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { supabase } from "../lib/supabaseClient";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFPreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  pageNumber,
  locationData,
  documentTitle,
}) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const HighlightOverlay = ({ locationData }) => {
    if (!locationData?.bbox) return null;

    const { x0, y0, x1, y1 } = locationData.bbox;

    return (
      <div
        className="absolute border-2 border-red-500 pointer-events-none animate-pulse"
        style={{
          left: `${x0 * scale}px`,
          top: `${y0 * scale}px`,
          width: `${(x1 - x0) * scale}px`,
          height: `${(y1 - y0) * scale}px`,
          transform: `rotate(${rotation}deg)`,
        }}
      />
    );
  };

  const handleDownload = async () => {
    try {
      // Extract file path from the pdfUrl
      const urlObj = new URL(pdfUrl);
      const filePath = urlObj.pathname.split("/official_documents/")[1];

      // Get a new signed URL with longer expiry for download
      const {
        data: { signedUrl },
        error,
      } = await supabase.storage
        .from("official_documents")
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;

      // Open URL in new window
      window.open(signedUrl, "_blank");
    } catch (error) {
      console.error("Error generating download link:", error);
      setError("Failed to generate download link");
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="relative w-full h-full max-w-5xl mx-auto bg-eco-darker rounded-lg shadow-xl flex flex-col">
        {/* Header - Modified for mobile responsiveness */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-eco-dark">
          {/* Title - Full width on mobile */}
          <h3 className="text-eco-text font-code mb-3 sm:mb-0 break-words">
            {documentTitle}
          </h3>
          
          {/* Controls - Centered below title on mobile */}
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-eco-green hover:text-eco-text transition-colors"
              title="Download Document"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}
              className="p-2 text-eco-green hover:text-eco-text transition-colors"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => setScale(prev => Math.min(2, prev + 0.2))}
              className="p-2 text-eco-green hover:text-eco-text transition-colors"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={() => setRotation(prev => (prev + 90) % 360)}
              className="p-2 text-eco-green hover:text-eco-text transition-colors"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-eco-green hover:text-eco-text transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto relative bg-eco-black rounded-lg">
          <div className="min-h-full flex items-center justify-center">
            {isLoading && <div className="text-eco-gray">Loading PDF...</div>}

            <div className="relative">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="text-eco-gray">Loading PDF...</div>}
                error={
                  <div className="text-red-500 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Failed to load PDF
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  loading={<div className="text-eco-gray">Loading page...</div>}
                />
                {!isLoading && locationData && (
                  <HighlightOverlay locationData={locationData} />
                )}
              </Document>

              {/* Missing location data warning */}
              {!locationData?.bbox && !isLoading && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-lg border border-yellow-500/50 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    Exact location within the page couldn't be determined
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
