import { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useCopyToClipboard } from '../hooks/useTheme'

function formatRelativeTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function MessageBubble({ message, onRegenerate }) {
  const [copiedText, copy] = useCopyToClipboard()
  const isUser = message.role === 'user'
  const isError = message.isError

  const handleCopy = useCallback(() => {
    const text = typeof message.content === 'string'
      ? message.content
      : message.content[0]?.text || ''
    copy(text)
  }, [message.content, copy])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
        {message.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-zinc-700">
            <img src={message.imageUrl} alt="Uploaded" className="max-w-xs rounded-xl" />
          </div>
        )}

        <div
          className={`px-4 py-3 text-[15px] leading-relaxed ${
            isUser
              ? 'bg-violet-600 text-white rounded-2xl rounded-br-sm'
              : isError
                ? 'bg-red-950/50 border border-red-900 text-red-300 rounded-2xl rounded-bl-sm'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-2xl rounded-bl-sm'
          }`}
        >
          {typeof message.content === 'string' ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <div className="code-block mt-2">
                        <div className="code-header">
                          <div className="flex items-center gap-2">
                            <div className="code-dot code-dot-red" />
                            <div className="code-dot code-dot-yellow" />
                            <div className="code-dot code-dot-green" />
                          </div>
                          <button
                            onClick={handleCopy}
                            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                          >
                            {copiedText ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-zinc-700 px-1.5 py-0.5 rounded text-sm text-zinc-200" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-zinc-300">{message.content?.[0]?.text}</p>
          )}
        </div>

        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-zinc-500" title={new Date(message.timestamp).toLocaleString()}>
            {formatRelativeTime(message.timestamp)}
          </span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Copy"
            >
              {copiedText ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default memo(MessageBubble)