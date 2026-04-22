import { useState } from 'react'
import { motion } from 'framer-motion'

const navItems = [
  {
    id: 'chat',
    label: 'Chat',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    )
  },
  {
    id: 'image',
    label: 'Images',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H3.75A2.25 2.25 0 0 0 1.5 6v12a2.25 2.25 0 0 0 2.25 2.25Zm9-7.5 1.5 1.5 3-3" />
      </svg>
    )
  }
]

function Sidebar({ isOpen, onToggle, activeTab, onTabChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggle = () => {
    setIsCollapsed(!isCollapsed)
    onToggle()
  }

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: isCollapsed ? -260 : 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 z-40"
    >
      <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-800">
        <span className="text-lg font-semibold text-zinc-100 tracking-tight">Rimagen</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id)
              if (window.innerWidth < 768) onToggle()
            }}
            className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all ${
              activeTab === item.id
                ? 'bg-zinc-800 text-zinc-100 border-r-2 border-violet-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={`hidden lg:block transition-all duration-200 ${isCollapsed ? 'w-16' : 'w-60'}`} />
    </motion.aside>
  )
}

export default Sidebar