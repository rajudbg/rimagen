import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCopyToClipboard } from '../hooks/useTheme'

function ImageModal({ image, onClose }) {
  const [copiedText, copy] = useCopyToClipboard()
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const handleDownload = useCallback(() => {
    if (!image.b64_json) return

    const link = document.createElement('a')
    link.href = `data:image/png;base64,${image.b64_json}`
    link.download = `rimagen-${image.id}.png`
    link.click()
  }, [image.b64_json, image.id])

  const handleCopy = useCallback(async () => {
    if (!image.b64_json) return
    await copy(image.b64_json)
  }, [image.b64_json, copy])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (image) {
      setIsImageLoaded(false)
    }
  }, [image])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-[90vw] max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 transition-all hover:scale-110 border border-slate-700/50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image container */}
            <div className="relative flex items-center justify-center bg-slate-950 min-h-[300px]">
              {image?.b64_json && (
                <img
                  src={`data:image/png;base64,${image.b64_json}`}
                  alt="Generated"
                  className={`max-w-[90vw] max-h-[70vh] object-contain transition-all duration-500 ${
                    isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              )}

              {/* Loading skeleton - only shown when image not loaded */}
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                  <div className="relative">
                    <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-3 border-purple-500/30 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-5 flex items-center justify-between border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
              <span className="text-xs text-slate-500 font-medium">
                {new Date(image?.timestamp).toLocaleString()}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-all hover:scale-105 flex items-center gap-2 text-sm font-medium border border-slate-700/50"
                >
                  {copiedText ? (
                    <>
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-105 flex items-center gap-2 text-sm shadow-lg shadow-indigo-500/25"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImageModal