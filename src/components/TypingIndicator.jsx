function TypingIndicator() {
  return (
    <div className="typing-indicator">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="typing-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
  )
}

export default TypingIndicator