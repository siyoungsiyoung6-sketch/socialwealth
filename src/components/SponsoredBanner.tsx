import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function SponsoredBanner() {
  const [closed, setClosed] = useState(false);
  if (closed) return null;

  return (
    <div className="relative w-full overflow-hidden border-b border-white/5 bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.08),_transparent_70%)]" />
      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 sm:gap-4">
        <Sparkles className="h-4 w-4 shrink-0 text-cyan-400 sm:h-5 sm:w-5" />
        <p className="text-center text-xs text-slate-300 sm:text-sm">
          <span className="font-semibold text-cyan-400">Sponsored</span> — Want your brand featured here?
          <span className="hidden sm:inline"> Reach millions of creators through SocialWorth AI.</span>{' '}
          <span className="font-medium text-white underline decoration-cyan-400/50 underline-offset-2">
            Advertise with us
          </span>
        </p>
        <button
          onClick={() => setClosed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
