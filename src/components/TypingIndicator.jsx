function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="typing-dot"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
      <div className="flex-1 space-y-2 w-48">
        <div className="h-2.5 bg-zinc-700/50 rounded-full w-3/4 animate-pulse" />
        <div className="h-2.5 bg-zinc-700/50 rounded-full w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  )
}

export default TypingIndicator