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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
              AI Image Generator
            </h1>
            <p className="text-slate-400">
              Create stunning images with AI
            </p>
          </motion.div>

          {/* Generate Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <form onSubmit={handleGenerate}>
              <div className="space-y-4">
                <div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe the image you want to create..."
                    className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 resize-none outline-none min-h-[100px] text-lg p-2"
                    disabled={isGenerating}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Count:</span>
                    <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setImageCount(count)}
                          disabled={isGenerating}
                          className={`w-8 h-8 rounded-md text-sm font-medium transition-all ${
                            imageCount === count
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors flex items-center gap-2"
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
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Style Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-slate-400 mb-2">Style:</p>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setActiveStyle(style.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    activeStyle === style.id
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-slate-100 hover:bg-slate-700'
                  }`}
                >
                  <span className="mr-1">{style.icon}</span>
                  {style.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-300"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span className="text-sm">{error}</span>
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
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-100">Generated Images</h2>
                  <span className="text-sm text-slate-500 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {images.length} image{images.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[...Array(imageCount)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl image-skeleton" />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!isGenerating && images.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 mb-5 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H3.75A2.25 2.25 0 0 0 1.5 6v12a2.25 2.25 0 0 0 2.25 2.25Zm9-7.5 1.5 1.5 3-3" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm max-w-sm">
                Describe the image you want and click Generate to create AI artwork
              </p>
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