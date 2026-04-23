import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-zinc-900 border-emerald-500/30 text-emerald-400'
                : toast.type === 'error'
                  ? 'bg-zinc-900 border-red-500/30 text-red-400'
                  : 'bg-zinc-900 border-violet-500/30 text-violet-400'
            }`}
          >
            {toast.type === 'success' && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Toast
