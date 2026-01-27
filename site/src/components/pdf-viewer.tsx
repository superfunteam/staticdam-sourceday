import { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Loader2 } from 'lucide-react'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  url: string
}

export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Leave some padding on the sides
        setContainerWidth(containerRef.current.clientWidth - 48)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return (
    <div ref={containerRef} className="w-full min-h-full">
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages)
          setIsLoading(false)
        }}
        onLoadError={() => setIsLoading(false)}
        loading={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        }
        className="flex flex-col items-center"
      >
        {!isLoading && numPages > 0 && (
          <div className="flex flex-col items-center gap-6 py-6">
            {Array.from({ length: numPages }, (_, i) => (
              <div key={i} className="bg-white shadow-lg">
                <Page
                  pageNumber={i + 1}
                  width={containerWidth > 0 ? Math.min(containerWidth, 800) : undefined}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </div>
        )}
      </Document>
    </div>
  )
}
