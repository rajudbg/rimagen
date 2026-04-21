import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useCopyToClipboard } from '../hooks/useTheme'

function ImageCard({ image, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [copiedText, copy] = useCopyToClipboard()

  const handleDownload = useCallback((e) => {
    e.stopPropagation()
    if (!image.b64_json) return

    const link = document.createElement('a')
    link.href = `data:image/png;base64,${image.b64_json}`
    link.download = `rimagen-${image.id}.png`
    link.click()
  }, [image.b64_json, image.id])

  const handleCopy = useCallback(async (e) => {
    e.stopPropagation()
    if (!image.b64_json) return
    await copy(image.b64_json)
  }, [image.b64_json, copy])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800"
    >
      {/* Image */}
      {image.b64_json && (
        <img
          src={`data:image/png;base64,${image.b64_json}`}
          alt={`Generated ${image.id}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}

      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-slate-950/70 flex items-center justify-center gap-2"
      >
        <button
          onClick={handleDownload}
          className="p-3 rounded-full bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition-colors"
          title="Download"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />
          </svg>
        </button>

        <button
          onClick={handleCopy}
          className="p-3 rounded-full bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition-colors"
          title={copiedText ? 'Copied!' : 'Copy Base64'}
        >
          {copiedText ? (
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
            </svg>
          )}
        </button>
      </motion.div>

      {/* Timestamp */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950/80 to-transparent">
        <p className="text-xs text-slate-400">
          {new Date(image.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  )
}

export default ImageCard