import { TrendingUp, BarChart3, Zap, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(34,211,238,0.12),_transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,6,23,0.8))] " />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-24">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-400">
          <Zap className="h-3.5 w-3.5" />
          AI-Powered Channel Valuation
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          Know What Your Channel Is
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Really Worth</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg">
          Instantly estimate the net asset value of any YouTube, Instagram, or TikTok channel.
          Get sponsorship rates, influence grades, and see how you rank against top creators.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            Real-time estimates
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            5 niches supported
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            No login required
          </div>
        </div>
      </div>
    </section>
  );
}
