function Header({ onToggleSidebar, chatModel, onChatModelChange }) {
  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-3 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors active:scale-95"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h1 className="text-sm font-semibold text-zinc-300 tracking-tight">Reimagen by Rajendra</h1>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={chatModel}
          onChange={(e) => onChatModelChange(e.target.value)}
          className="text-xs bg-zinc-900 text-zinc-300 px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 cursor-pointer transition-all"
        >
          <option value="gemini-2.5-flash">Flash</option>
          <option value="gemini-2.5-pro">Pro</option>
        </select>
        <span className="text-xs text-zinc-400 bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-800 font-medium">
          BolderBrain AI
        </span>
      </div>
    </header>
  )
}

export default Header