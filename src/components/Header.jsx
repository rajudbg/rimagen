function Header({ onToggleSidebar, chatModel, onChatModelChange }) {
  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h1 className="text-sm font-semibold text-zinc-300 tracking-tight">Rimagen</h1>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={chatModel}
          onChange={(e) => onChatModelChange(e.target.value)}
          className="text-xs bg-zinc-900 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-violet-500 cursor-pointer"
        >
          <option value="gemini-2.5-flash">Flash</option>
          <option value="gemini-2.5-pro">Pro</option>
        </select>
        <span className="text-xs text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
          Vertex AI
        </span>
      </div>
    </header>
  )
}

export default Header