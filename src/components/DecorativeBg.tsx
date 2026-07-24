export default function DecorativeBg({ variant = 'default' }: { variant?: 'default' | 'subtle' }) {
  if (variant === 'subtle') {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-rose-100/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-nude-200/40 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Soft color blobs */}
      <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-rose-100/30 blur-3xl" />
      <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-brand-100/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-nude-200/40 blur-3xl" />

      {/* Scattered hearts */}
      <svg className="absolute left-[8%] top-[15%] h-6 w-6 animate-float-slow text-rose-200/50" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg className="absolute right-[12%] top-[60%] h-5 w-5 animate-float text-rose-200/40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg className="absolute left-[45%] top-[85%] h-4 w-4 animate-float-slow text-rose-200/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* Delicate leaf/branch */}
      <svg className="absolute right-[6%] top-[20%] h-16 w-16 animate-float-slow text-nude-300/40" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 Q30 30 30 50 Q30 70 50 90 Q70 70 70 50 Q70 30 50 10 Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M50 10 L50 90" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute left-[3%] bottom-[15%] h-12 w-12 animate-float text-brand-200/30" viewBox="0 0 100 100" fill="none">
        <path d="M20 80 Q40 60 50 40 Q60 20 80 20" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="35" cy="65" rx="6" ry="3" fill="currentColor" opacity="0.5" transform="rotate(-30 35 65)" />
        <ellipse cx="55" cy="45" rx="6" ry="3" fill="currentColor" opacity="0.5" transform="rotate(-30 55 45)" />
        <ellipse cx="70" cy="30" rx="6" ry="3" fill="currentColor" opacity="0.5" transform="rotate(-30 70 30)" />
      </svg>

      {/* Sparkle dots */}
      <svg className="absolute right-[30%] top-[10%] h-3 w-3 animate-pulse-soft text-rose-300/50" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0 L13.5 9.5 L24 12 L13.5 14.5 L12 24 L10.5 14.5 L0 12 L10.5 9.5 Z" />
      </svg>
      <svg className="absolute left-[35%] top-[50%] h-2 w-2 animate-pulse-soft text-brand-300/40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0 L13.5 9.5 L24 12 L13.5 14.5 L12 24 L10.5 14.5 L0 12 L10.5 9.5 Z" />
      </svg>
    </div>
  );
}
