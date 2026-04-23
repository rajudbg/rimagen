import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ImagePreview from './ImagePreview'

function ChatInterface({
  messages,
  onSendMessage,
  isGenerating,
  messagesEndRef,
  addToast
}) {
  const [input, setInput] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!input.trim() && !selectedImage) return
    if (isGenerating) return

    const content = input.trim()
    const imageUrl = selectedImage

    setInput('')
    setSelectedImage(null)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await onSendMessage(content, imageUrl)
  }, [input, selectedImage, isGenerating, onSendMessage])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }, [handleSubmit])

  const loadImage = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        addToast?.('Image attached', 'success', 2000)
      }
      reader.readAsDataURL(file)
    }
  }, [addToast])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    loadImage(file)
  }, [loadImage])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    loadImage(file)
  }, [loadImage])

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items
    if (items) {
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          loadImage(file)
          break
        }
      }
    }
  }, [loadImage])

  // Keyboard shortcut: / to focus input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
        e.preventDefault()
        textareaRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
    }
  }, [])

  return (
    <div
      className="h-full flex flex-col relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 bg-violet-500/10 backdrop-blur-sm border-2 border-dashed border-violet-500/50 rounded-none flex items-center justify-center"
        >
          <div className="text-center">
            <svg className="w-12 h-12 text-violet-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H3.75A2.25 2.25 0 0 0 1.5 6v12a2.25 2.25 0 0 0 2.25 2.25Zm9-7.5 1.5 1.5 3-3" />
            </svg>
            <p className="text-violet-300 font-medium">Drop image here</p>
          </div>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
              className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/30"
            >
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-3"
            >
              Welcome to Rimagen
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-zinc-400 text-base max-w-sm leading-relaxed"
            >
              Chat with AI or generate stunning images. Type a message or upload an image to get started.
            </motion.p>
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300, delay: index * 0.05 }}
              >
                <MessageBubble
                  message={message}
                  onRegenerate={() => {
                    if (message.role === 'user') {
                      onSendMessage(
                        typeof message.content === 'string'
                          ? message.content
                          : message.content[0]?.text || '',
                        message.imageUrl
                      )
                    }
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex justify-start max-w-3xl mx-auto"
          >
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl rounded-tl-sm px-5 py-4 border border-zinc-800/50 shadow-lg">
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-5 border-t border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 flex items-center gap-3"
          >
            <ImagePreview
              src={selectedImage}
              onRemove={() => setSelectedImage(null)}
              size="sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(null)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-2 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/10 transition-all shadow-lg">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H3.75A2.25 2.25 0 0 0 1.5 6v12a2.25 2.25 0 0 0 2.25 2.25Zm9-7.5 1.5 1.5 3-3" />
              </svg>
            </motion.button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                adjustTextareaHeight()
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Message Rimagen..."
              className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 resize-none outline-none max-h-48 min-h-[28px] py-3 text-[15px] leading-relaxed"
              rows={1}
              disabled={isGenerating}
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={(!input.trim() && !selectedImage) || isGenerating}
              className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-500 hover:to-fuchsia-500 transition-all flex-shrink-0 shadow-lg shadow-violet-500/25"
            >
              {isGenerating ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              )}
            </motion.button>
          </div>
          <p className="text-center text-xs text-zinc-600 mt-2">Shift + Enter for new line</p>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  )
}

export default ChatInterface