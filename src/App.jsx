import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatInterface from './components/ChatInterface'
import ImageGenerator from './components/ImageGenerator'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Toast from './components/Toast'
import { useToast } from './hooks/useToast'
import { useMediaQuery } from './hooks/useTheme'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''
const API_KEY = import.meta.env.VITE_API_KEY || 'raju123'

function apiUrl(path) {
  return `${API_BASE_URL}${path}`
}

async function makeApiRequest(path, body) {
  const url = apiUrl(path)
  let response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    })
  } catch (networkError) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const isRemote = url.startsWith('http')
    if (isLocalhost && isRemote) {
      throw new Error(
        `Network error (CORS?). You are on localhost calling ${url}. ` +
        `Router2 must enable CORS for cross-origin requests, or test via a proxy.`
      )
    }
    throw new Error(`Network error: ${networkError.message || 'Cannot reach server'}`)
  }

  if (!response.ok) {
    let errorText = `HTTP ${response.status} ${response.statusText}`
    try {
      const errorJson = await response.json()
      if (errorJson.error) errorText = errorJson.error
      else if (errorJson.details) errorText += ` — ${errorJson.details}`
    } catch {
      try {
        const text = await response.text()
        if (text) errorText += ` — ${text.slice(0, 200)}`
      } catch { /* ignore */ }
    }
    throw new Error(errorText)
  }

  try {
    return await response.json()
  } catch (parseError) {
    throw new Error('Invalid JSON in response')
  }
}

function App() {
  const { toasts, addToast } = useToast()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [activeTab, setActiveTab] = useState('chat')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState([])
  const [imageError, setImageError] = useState(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [chatModel, setChatModel] = useState('gemini-2.5-flash')
  const messagesEndRef = useRef(null)

  // Sync sidebar state with screen size
  useEffect(() => {
    setIsSidebarOpen(isDesktop)
  }, [isDesktop])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const messageIdRef = useRef(0)
  const nextId = () => {
    messageIdRef.current += 1
    return `${Date.now()}-${messageIdRef.current}`
  }

  const handleSendMessage = useCallback(async (content, imageUrl = null) => {
    const userMessage = {
      id: nextId(),
      role: 'user',
      content,
      imageUrl,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setIsChatLoading(true)

    try {
      const hasImage = !!imageUrl

      const recentMessages = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }))

      const userPayload = hasImage
        ? [
            { type: 'text', text: content },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        : content

      const data = await makeApiRequest('/v1/chat/completions', {
        model: chatModel,
        messages: [...recentMessages, { role: 'user', content: userPayload }],
        stream: false
      })

      const assistantMessage = {
        id: nextId(),
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || 'No response from model.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = {
        id: nextId(),
        role: 'assistant',
        content: `Error: ${error.message}`,
        isError: true,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
      addToast(error.message, 'error', 5000)
    } finally {
      setIsChatLoading(false)
    }
  }, [messages, chatModel, addToast])

  const handleGenerateImage = useCallback(async (prompt, count = 1) => {
    setIsImageLoading(true)
    setGeneratedImages([])
    setImageError(null)

    try {
      const data = await makeApiRequest('/v1/images/generations', {
        prompt,
        n: count,
        model: 'imagen-3.0-generate-002'
      })

      const images = data.data?.map((img, idx) => ({
        id: nextId(),
        b64_json: img.b64_json,
        prompt,
        timestamp: new Date().toISOString()
      })) || []

      setGeneratedImages(images)
      addToast(`Generated ${images.length} image${images.length > 1 ? 's' : ''}`, 'success')
    } catch (error) {
      console.error('Image generation error:', error)
      setImageError(error.message || 'Failed to generate image')
      addToast(error.message || 'Image generation failed', 'error', 5000)
    } finally {
      setIsImageLoading(false)
    }
  }, [addToast])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          chatModel={chatModel}
          onChatModelChange={setChatModel}
        />

        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isGenerating={isChatLoading}
                  messagesEndRef={messagesEndRef}
                  addToast={addToast}
                />
              </motion.div>
            ) : (
              <motion.div
                key="image"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ImageGenerator
                  onGenerate={handleGenerateImage}
                  isGenerating={isImageLoading}
                  images={generatedImages}
                  error={imageError}
                  addToast={addToast}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <Toast toasts={toasts} />
    </div>
  )
}

export default App