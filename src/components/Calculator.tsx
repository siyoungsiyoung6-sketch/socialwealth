import { useState } from 'react';
import {
  Calculator as CalcIcon,
  Youtube,
  Instagram,
  Music2,
  Loader2,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  PLATFORMS,
  CATEGORIES,
  calculateValuation,
  type Platform,
  type Category,
  type ValuationResult,
} from '@/lib/valuation';

const platformIcon = (p: Platform) =>
  p === 'youtube' ? Youtube : p === 'instagram' ? Instagram : Music2;

export default function Calculator() {
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [followers, setFollowers] = useState('');
  const [avgViews, setAvgViews] = useState('');
  const [category, setCategory] = useState<Category>('gaming');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);

  const PlatformIcon = platformIcon(platform);

  const handleCalculate = () => {
    const f = parseInt(followers) || 0;
    const v = parseInt(avgViews) || 0;
    if (f <= 0 && v <= 0) return;

    setScanning(true);
    setResult(null);

    setTimeout(() => {
      const val = calculateValuation(platform, f, v, category);
      setResult(val);
      setScanning(false);
    }, 3000);
  };

  const handleReset = () => {
    setResult(null);
    setFollowers('');
    setAvgViews('');
  };

  const fmtMoney = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <section id="calculator" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Channel Value Calculator
        </h2>
        <p className="mt-2 text-slate-400">
          Enter your channel details and let the AI engine evaluate your net worth.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-6 shadow-2xl shadow-black/40 sm:p-8">
          {/* Platform Selector */}
          <label className="mb-2 block text-sm font-medium text-slate-300">Platform</label>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {PLATFORMS.map((p) => {
              const Icon = platformIcon(p.id);
              const active = platform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border py-4 transition-all duration-200 ${
                    active
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className={`text-xs font-medium ${active ? 'text-white' : 'text-slate-400'}`}>
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Number Inputs */}
          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {platform === 'youtube' ? 'Subscribers' : 'Followers'}
              </label>
              <input
                type="number"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="e.g. 1500000"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Average Views per {platform === 'youtube' ? 'Video' : 'Post'}
              </label>
              <input
                type="number"
                value={avgViews}
                onChange={(e) => setAvgViews(e.target.value)}
                placeholder="e.g. 300000"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <label className="mb-2 block text-sm font-medium text-slate-300">Category / Niche</label>
          <div className="relative mb-6">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-10 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Action Button */}
          <button
            onClick={handleCalculate}
            disabled={scanning}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 disabled:opacity-70"
          >
            {scanning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing Channel Data...
              </>
            ) : (
              <>
                <CalcIcon className="h-5 w-5" />
                Calculate Channel Worth
              </>
            )}
          </button>
        </div>

        {/* Scanning Animation */}
        {scanning && <ScanningAnimation platform={platform} />}

        {/* Results Dashboard */}
        {result && !scanning && (
          <div className="mt-6 animate-[fadeIn_0.5s_ease-out] rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl shadow-cyan-500/10 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Valuation Report</h3>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>

            {/* Main Net Worth */}
            <div className="mb-5 rounded-xl border border-white/5 bg-gradient-to-br from-cyan-950/40 to-slate-950 p-6 text-center">
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
                Estimated Net Asset Value
              </p>
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {fmtMoney(result.netAssetValue)}
                </span>
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                <PlatformIcon className="h-4 w-4 text-cyan-400" />
                {PLATFORMS.find((p) => p.id === platform)?.label}
                <span className="text-slate-600">·</span>
                {CATEGORIES.find((c) => c.id === category)?.label}
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                    Sponsored Post Rate
                  </p>
                </div>
                <p className="text-2xl font-bold text-white">
                  {fmtMoney(result.perPostRate)}
                  <span className="text-sm font-normal text-slate-500"> / post</span>
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                    <Award className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                    Channel Grade
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${result.gradeColor}`}>{result.grade}</span>
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                    {result.tier}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar showing tier */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>Influence Tier</span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <TrendingUp className="h-3 w-3" />
                  {result.tier}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, Math.max(8, (result.netAssetValue / 4000000) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ScanningAnimation({ platform }: { platform: Platform }) {
  const steps = [
    'Connecting to platform API...',
    'Scanning engagement metrics...',
    'Analyzing category benchmarks...',
    'Calculating monetization potential...',
  ];
  const PlatformIcon = platformIcon(platform);

  return (
    <div className="mt-6 animate-[fadeIn_0.3s_ease-out] overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950 p-8">
      <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
        {/* Rotating rings */}
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400 [animation-duration:1.5s]" />
        <div className="absolute inset-3 animate-spin rounded-full border-2 border-blue-500/20 border-b-blue-400 [animation-duration:2s] [animation-direction:reverse]" />
        <div className="absolute inset-6 animate-pulse rounded-full bg-cyan-500/10" />
        <PlatformIcon className="h-10 w-10 text-cyan-400" />
      </div>

      <div className="space-y-2.5">
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-slate-400 opacity-0 [animation:fadeIn_0.4s_ease-out_forwards]"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <div
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 opacity-0 [animation:fadeIn_0.3s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            {s}
          </div>
        ))}
      </div>

      {/* Scan line */}
      <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-slate-800">
        <div className="absolute inset-y-0 w-1/3 animate-[scan_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>
    </div>
  );
}
