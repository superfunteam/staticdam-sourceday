import { useState } from 'react'
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

  return (
    <Document
      file={url}
      onLoadSuccess={({ numPages }) => {
        setNumPages(numPages)
        setIsLoading(false)
      }}
      onLoadError={() => setIsLoading(false)}
      loading={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      }
      className="flex flex-col items-center"
    >
      {isLoading ? null : (
        <div className="flex flex-col items-center gap-4 p-4">
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              className="shadow-lg"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </div>
      )}
    </Document>
  )
}
