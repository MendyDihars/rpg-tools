export default function Crest() {
  return (
    <div className="h-11 w-11 rounded-full border border-amber-400/40 bg-zinc-900/70 grid place-items-center shadow-[0_0_0_2px_rgba(212,175,55,0.15)]">
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#ad8a26" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#f6e08a" />
          </linearGradient>
        </defs>
        <path fill="url(#g1)" d="M12 2l2.4 4.9L20 8l-4 3.9.9 5.6L12 15.8 7.1 17.5 8 11.9 4 8l5.6-1.1z"/>
      </svg>
    </div>
  )
}