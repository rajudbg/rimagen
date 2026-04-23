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
    link.download = `reimagen-${image.id}.png`
    link.click()
  }, [image.b64_json, image.id])

  const handleCopy = useCallback(async (e) => {
    e.stopPropagation()
    if (!image.b64_json) return
    await copy(image.b64_json)
  }, [image.b64_json, copy])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-zinc-900/50 border border-zinc-800/50 shadow-xl"
    >
      {/* Image */}
      {image.b64_json && (
        <img
          src={`data:image/png;base64,${image.b64_json}`}
          alt={`Generated ${image.id}`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}

      {/* Hover overlay with gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/60 to-transparent flex items-center justify-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDownload}
          className="p-3.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-xl shadow-violet-500/30 transition-all border border-violet-500/30"
          title="Download"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />
          </svg>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="p-3.5 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 shadow-xl transition-all border border-zinc-700/50"
          title={copiedText ? 'Copied!' : 'Copy'}
        >
          {copiedText ? (
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
            </svg>
          )}
        </motion.button>
      </motion.div>

      {/* Timestamp + Prompt metadata */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-zinc-950/95 via-zinc-950/70 to-transparent">
        {image.prompt && (
          <p className="text-[11px] text-zinc-300 leading-snug mb-1 line-clamp-2 font-medium">
            {image.prompt}
          </p>
        )}
        <p className="text-[10px] text-zinc-500">
          {new Date(image.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  )
}

export default ImageCard