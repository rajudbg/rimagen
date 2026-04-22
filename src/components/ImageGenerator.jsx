import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageCard from './ImageCard'
import ImageModal from './ImageModal'

function ImageGenerator({
  onGenerate,
  isGenerating,
  images,
  error
}) {
  const [prompt, setPrompt] = useState('')
  const [imageCount, setImageCount] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeStyle, setActiveStyle] = useState('general')

  const styles = [
    { id: 'general', name: 'General', icon: '✨' },
    { id: 'photorealistic', name: 'Photorealistic', icon: '📷' },
    { id: 'anime', name: 'Anime', icon: '🎨' },
    { id: '3d-render', name: '3D Render', icon: '🎲' },
    { id: 'oil-painting', name: 'Oil Painting', icon: '🖼️' },
    { id: 'watercolor', name: 'Watercolor', icon: '💧' }
  ]

  const handleGenerate = useCallback(async (e) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return

    const fullPrompt = activeStyle === 'general'
      ? prompt
      : `${prompt}, ${activeStyle.replace('-', ' ')} style`

    await onGenerate(fullPrompt, imageCount)
  }, [prompt, imageCount, activeStyle, isGenerating, onGenerate])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate(e)
    }
  }, [handleGenerate])

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0])
    }
  }, [images])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              AI Image Generator
            </h1>
            <p className="text-slate-400 text-lg">
              Transform your ideas into stunning visuals
            </p>
          </motion.div>

          {/* Generate Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-500/5"
          >
            <form onSubmit={handleGenerate}>
              <div className="space-y-5">
                <div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe the image you want to create..."
                    className="w-full bg-slate-950/50 text-slate-100 placeholder-slate-500 resize-none outline-none min-h-[120px] text-lg p-4 rounded-2xl border border-slate-800 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    disabled={isGenerating}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400 font-medium">Count:</span>
                    <div className="flex items-center gap-1.5 bg-slate-950/50 rounded-xl p-1.5 border border-slate-800/50">
                      {[1, 2, 3, 4].map((count) => (
                        <motion.button
                          key={count}
                          type="button"
                          onClick={() => setImageCount(count)}
                          disabled={isGenerating}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                            imageCount === count
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                          }`}
                        >
                          {count}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2.5 shadow-lg shadow-indigo-500/25"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Style Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.15 }}
          >
            <p className="text-sm text-slate-400 mb-3 font-medium">Style:</p>
            <div className="flex flex-wrap gap-2.5">
              {styles.map((style) => (
                <motion.button
                  key={style.id}
                  onClick={() => setActiveStyle(style.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    activeStyle === style.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500/50 shadow-lg shadow-indigo-500/25'
                      : 'bg-slate-900/50 text-slate-300 border-slate-800/50 hover:text-slate-100 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <span className="mr-1.5">{style.icon}</span>
                  {style.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-red-950/30 border border-red-900/50 text-red-300"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Images */}
          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-100">Generated Images</h2>
                  <span className="text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800/50">
                    {images.length} image{images.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <ImageCard
                        image={image}
                        onClick={() => setSelectedImage(image)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isGenerating && images.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {[...Array(imageCount)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300, delay: i * 0.1 }}
                  className="aspect-square rounded-2xl image-skeleton"
                />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!isGenerating && images.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.2 }}
                className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-slate-800/50 flex items-center justify-center"
              >
                <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H3.75A2.25 2.25 0 0 0 1.5 6v12a2.25 2.25 0 0 0 2.25 2.25Zm9-7.5 1.5 1.5 3-3" />
                </svg>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-400 text-base max-w-sm"
              >
                Describe the image you want and click Generate to create AI artwork
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImageGenerator