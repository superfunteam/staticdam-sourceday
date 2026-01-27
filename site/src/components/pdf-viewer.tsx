import { useState, useRef, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Loader2 } from 'lucide-react'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  url: string
}

interface PageStatus {
  loaded: boolean
  error: boolean
}

export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [documentLoaded, setDocumentLoaded] = useState(false)
  const [documentError, setDocumentError] = useState(false)
  const [pageStatuses, setPageStatuses] = useState<Record<number, PageStatus>>({})
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track container width for responsive page sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 48)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setDocumentLoaded(true)
    // Initialize all pages as not loaded
    const initialStatuses: Record<number, PageStatus> = {}
    for (let i = 1; i <= numPages; i++) {
      initialStatuses[i] = { loaded: false, error: false }
    }
    setPageStatuses(initialStatuses)
  }, [])

  const handleDocumentLoadError = useCallback(() => {
    setDocumentError(true)
  }, [])

  const handlePageLoadSuccess = useCallback((pageNumber: number) => {
    setPageStatuses(prev => ({
      ...prev,
      [pageNumber]: { loaded: true, error: false }
    }))
  }, [])

  const handlePageLoadError = useCallback((pageNumber: number) => {
    setPageStatuses(prev => ({
      ...prev,
      [pageNumber]: { loaded: false, error: true }
    }))
  }, [])

  // Calculate loading progress
  const loadedPages = Object.values(pageStatuses).filter(s => s.loaded).length
  const loadingProgress = numPages > 0 ? Math.round((loadedPages / numPages) * 100) : 0

  // Calculate page width - max 800px, responsive to container
  const pageWidth = containerWidth > 0 ? Math.min(containerWidth, 800) : 600

  if (documentError) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <p>Failed to load PDF</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full">
      {/* Loading progress bar */}
      {documentLoaded && loadedPages < numPages && (
        <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900 p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            <div className="flex-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-gray-500 min-w-[60px] text-right">
              {loadedPages} / {numPages}
            </span>
          </div>
        </div>
      )}

      <Document
        file={url}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={handleDocumentLoadError}
        loading={
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="text-sm text-gray-500">Loading PDF...</span>
          </div>
        }
      >
        {documentLoaded && (
          <div className="flex flex-col items-center gap-6 py-6">
            {Array.from({ length: numPages }, (_, i) => {
              const pageNumber = i + 1
              const status = pageStatuses[pageNumber]

              return (
                <div
                  key={pageNumber}
                  className="relative bg-white shadow-lg"
                  style={{ minHeight: pageWidth * 1.3 }} // Approximate page height
                >
                  {/* Page loading placeholder */}
                  {!status?.loaded && !status?.error && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gray-50"
                      style={{ width: pageWidth, height: pageWidth * 1.3 }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="text-xs text-gray-400">Page {pageNumber}</span>
                      </div>
                    </div>
                  )}

                  {/* Error state */}
                  {status?.error && (
                    <div
                      className="flex items-center justify-center bg-gray-100"
                      style={{ width: pageWidth, height: pageWidth * 1.3 }}
                    >
                      <span className="text-sm text-gray-500">Failed to load page {pageNumber}</span>
                    </div>
                  )}

                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onLoadSuccess={() => handlePageLoadSuccess(pageNumber)}
                    onLoadError={() => handlePageLoadError(pageNumber)}
                    loading={null} // We handle loading ourselves
                  />
                </div>
              )
            })}
          </div>
        )}
      </Document>
    </div>
  )
}
