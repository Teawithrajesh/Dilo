/** The DILO star, used for Sparkles. */
export function SparkleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="spk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe39a" />
          <stop offset="0.55" stopColor="#ffb000" />
          <stop offset="1" stopColor="#fe8f02" />
        </linearGradient>
      </defs>
      <path fill="url(#spk)" d="M12 1.5c.5 4.9 2.3 7.9 10.5 10.5-8.2 2.6-10 5.6-10.5 10.5-.5-4.9-2.3-7.9-10.5-10.5C9.7 9.4 11.5 6.4 12 1.5z" />
    </svg>
  );
}
