import { Gauge } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-white sm:text-lg">
              SocialWorth<span className="text-cyan-400"> AI</span>
            </span>
            <span className="text-[10px] font-medium tracking-widest text-slate-500">
              CHANNEL VALUATION ENGINE
            </span>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
          <a href="#search" className="transition hover:text-cyan-400">Search</a>
          <a href="#calculator" className="transition hover:text-cyan-400">Calculator</a>
          <a href="#leaderboard" className="transition hover:text-cyan-400">Leaderboard</a>
          <a href="#sponsors" className="transition hover:text-cyan-400">Sponsors</a>
        </nav>
        <a
          href="#calculator"
          className="rounded-lg bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400 ring-1 ring-inset ring-cyan-500/30 transition hover:bg-cyan-500/20 sm:text-sm"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}
