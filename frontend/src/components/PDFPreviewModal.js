import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// import * as pdfjs from 'pdfjs-dist'; 
import { X, ZoomIn, ZoomOut, RotateCw, AlertTriangle } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
      <div className="bg-eco-darker border border-eco-dark rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-eco-text font-code text-lg">{documentTitle}</h3>
            <p className="text-eco-gray text-sm">
              Page {pageNumber} of {numPages || "..."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Zoom controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale((scale) => Math.max(0.5, scale - 0.1))}
                className="text-eco-gray hover:text-eco-text transition-colors"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="text-eco-text font-code text-sm">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((scale) => Math.min(2, scale + 0.1))}
                className="text-eco-gray hover:text-eco-text transition-colors"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>
            {/* Rotate */}
            <button
              onClick={() => setRotation((r) => r + 90)}
              className="text-eco-gray hover:text-eco-text transition-colors"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            {/* Close */}
            <button
              onClick={onClose}
              className="text-eco-gray hover:text-eco-text transition-colors"
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
