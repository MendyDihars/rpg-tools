export default function Ornament({ className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width="140" height="12" viewBox="0 0 140 12" className="drop-shadow-[0_0_10px_rgba(212,175,55,0.25)]">
        <defs>
          <linearGradient id="gold" x1="0" x2="1">
            <stop offset="0%" stopColor="#ad8a26" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#f0d46a" />
          </linearGradient>
        </defs>
        <path d="M2 6h50M88 6h50" stroke="url(#gold)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="70" cy="6" r="5" fill="none" stroke="url(#gold)" strokeWidth="2" />
        <circle cx="70" cy="6" r="2" fill="url(#gold)" />
      </svg>
    </div>
  );
}