import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Use the same version of pdfjs-dist that react-pdf bundles
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [containerWidth, setContainerWidth] = useState<number>(() => 
    typeof window !== 'undefined' ? Math.min(window.innerWidth - 48, 800) : 600
  );

  React.useEffect(() => {
    const handleResize = () => {
      setContainerWidth(Math.min(window.innerWidth - 48, 800));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onLoadError = (err: Error) => {
    setError(`Failed to load PDF: ${err.message}`);
    setLoading(false);
  };

  return (
    <div className="w-full rounded border border-line-border overflow-hidden bg-gray-50">
      {loading && (
        <div className="flex items-center justify-center h-40 text-sm text-ink-500 font-mono-code">
          <span className="animate-pulse">Loading PDF…</span>
        </div>
      )}
      {error && (
        <div className="p-4 text-red-600 text-sm font-mono-code bg-red-50 rounded">
          <strong>PDF Error:</strong> {error}
          <br />
          <a
            href={fileUrl}
            download
            className="underline mt-1 inline-block text-terracotta"
          >
            Download PDF instead
          </a>
        </div>
      )}
      {!error && (
        <div className="overflow-auto max-h-[700px] p-2 flex flex-col items-center">
          <Document
            file={fileUrl}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={null}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={`page-${i + 1}`}
                pageNumber={i + 1}
                width={containerWidth}
                renderAnnotationLayer={false}
                renderTextLayer={true}
                className="my-2 shadow-sm max-w-full"
              />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
};
