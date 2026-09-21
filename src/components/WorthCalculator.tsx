import { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  Calendar,
  Gauge,
  MapPin,
  Calculator as CalcIcon,
  Loader2,
  RotateCcw,
  TrendingUp,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export interface WorthResult {
  baseValue: number;
  experiencePremium: number;
  performanceBonus: number;
  geoBuffer: number;
  marketPadding: number;
  targetMarketWorth: number;
}

interface JobCategory {
  id: string;
  label: string;
  defaultSalary: number;
}

const JOB_CATEGORIES: JobCategory[] = [
  { id: 'software-engineer', label: 'Software Engineer', defaultSalary: 110000 },
  { id: 'data-analyst', label: 'Data Analyst', defaultSalary: 85000 },
  { id: 'product-manager', label: 'Product Manager', defaultSalary: 125000 },
  { id: 'ux-designer', label: 'UX Designer', defaultSalary: 95000 },
  { id: 'devops-engineer', label: 'DevOps Engineer', defaultSalary: 118000 },
  { id: 'marketing-manager', label: 'Marketing Manager', defaultSalary: 98000 },
  { id: 'financial-analyst', label: 'Financial Analyst', defaultSalary: 88000 },
  { id: 'sales-director', label: 'Sales Director', defaultSalary: 135000 },
];

const PERFORMANCE_LEVELS = [
  { level: 1, label: '1 — Entry' },
  { level: 2, label: '2 — Developing' },
  { level: 3, label: '3 — Solid' },
  { level: 4, label: '4 — High Performer' },
  { level: 5, label: '5 — Exceptional' },
];

const LOCATION_TIERS = [
  { id: 'standard', label: 'Standard Cost of Living', multiplier: 0 },
  { id: 'high', label: 'High Cost of Living (SF / NY / LA)', multiplier: 0.2 },
];

function calculateWorth(
  category: JobCategory,
  yearsExperience: number,
  performanceLevel: number,
  locationTierId: string,
): WorthResult {
  const baseValue = category.defaultSalary;

  const experiencePremium = Math.round(baseValue * (yearsExperience * 0.045));

  let performanceBonus = 0;
  if (performanceLevel === 4) {
    performanceBonus = Math.round(baseValue * 0.15);
  } else if (performanceLevel === 5) {
    performanceBonus = Math.round(baseValue * 0.25);
  }

  const runningTotalBeforeGeo = baseValue + experiencePremium + performanceBonus;

  const locationTier = LOCATION_TIERS.find((t) => t.id === locationTierId)!;
  const geoBuffer = Math.round(runningTotalBeforeGeo * locationTier.multiplier);

  const runningTotal = runningTotalBeforeGeo + geoBuffer;

  const marketPadding = Math.round(runningTotal * 0.05);
  const targetMarketWorth = runningTotal + marketPadding;

  return {
    baseValue,
    experiencePremium,
    performanceBonus,
    geoBuffer,
    marketPadding,
    targetMarketWorth,
  };
}

const fmtMoney = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function WorthCalculator() {
  const [categoryId, setCategoryId] = useState(JOB_CATEGORIES[0].id);
  const [baseSalary, setBaseSalary] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [performanceLevel, setPerformanceLevel] = useState(3);
  const [locationTierId, setLocationTierId] = useState('standard');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<WorthResult | null>(null);

  const selectedCategory = JOB_CATEGORIES.find((c) => c.id === categoryId)!;

  const handleCalculate = () => {
    const customBase = parseInt(baseSalary) || 0;
    const years = parseInt(yearsExperience) || 0;
    if (customBase <= 0 && years <= 0 && !baseSalary) {
      const cat = JOB_CATEGORIES.find((c) => c.id === categoryId)!;
      const res = calculateWorth(cat, years, performanceLevel, locationTierId);
      setScanning(true);
      setResult(null);
      setTimeout(() => {
        setResult(res);
        setScanning(false);
      }, 2500);
      return;
    }

    const effectiveCategory: JobCategory = customBase > 0
      ? { ...selectedCategory, defaultSalary: customBase }
      : selectedCategory;

    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const res = calculateWorth(effectiveCategory, years, performanceLevel, locationTierId);
      setResult(res);
      setScanning(false);
    }, 2500);
  };

  const handleReset = () => {
    setResult(null);
    setBaseSalary('');
    setYearsExperience('');
    setPerformanceLevel(3);
    setLocationTierId('standard');
  };

  return (
    <section id="worth-calculator" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-400">
          <Sparkles className="h-3.5 w-3.5" />
          Career Worth Engine
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Target Market Worth Calculator
        </h2>
        <p className="mt-2 text-slate-400">
          Calculate your true market value based on role, experience, performance, and location.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-6 shadow-2xl shadow-black/40 sm:p-8">
          {/* Job Category */}
          <label className="mb-2 block text-sm font-medium text-slate-300">
            <Briefcase className="mr-1.5 inline h-4 w-4 text-cyan-400" />
            Job Category
          </label>
          <div className="relative mb-5">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-10 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              {JOB_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.label} — Default: {fmtMoney(c.defaultSalary)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Base Salary + Years Experience */}
          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                <DollarSign className="mr-1.5 inline h-4 w-4 text-cyan-400" />
                Current Base Salary ($)
              </label>
              <input
                type="number"
                value={baseSalary}
                onChange={(e) => setBaseSalary(e.target.value)}
                placeholder={`Default: ${fmtMoney(selectedCategory.defaultSalary)}`}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                <Calendar className="mr-1.5 inline h-4 w-4 text-cyan-400" />
                Years of Experience
              </label>
              <input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          {/* Performance Level */}
          <label className="mb-2 block text-sm font-medium text-slate-300">
            <Gauge className="mr-1.5 inline h-4 w-4 text-cyan-400" />
            Performance Level
          </label>
          <div className="relative mb-5">
            <select
              value={performanceLevel}
              onChange={(e) => setPerformanceLevel(parseInt(e.target.value))}
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-10 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              {PERFORMANCE_LEVELS.map((p) => (
                <option key={p.level} value={p.level} className="bg-slate-900">
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Location Tier */}
          <label className="mb-2 block text-sm font-medium text-slate-300">
            <MapPin className="mr-1.5 inline h-4 w-4 text-cyan-400" />
            Location Cost Tier
          </label>
          <div className="relative mb-6">
            <select
              value={locationTierId}
              onChange={(e) => setLocationTierId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-10 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              {LOCATION_TIERS.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900">
                  {t.label}
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
                Calculating Market Worth...
              </>
            ) : (
              <>
                <CalcIcon className="h-5 w-5" />
                Calculate My Worth
              </>
            )}
          </button>
        </div>

        {/* Scanning Animation */}
        {scanning && (
          <div className="mt-6 animate-[fadeIn_0.3s_ease-out] overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950 p-8">
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400 [animation-duration:1.5s]" />
              <div className="absolute inset-3 animate-spin rounded-full border-2 border-blue-500/20 border-b-blue-400 [animation-duration:2s] [animation-direction:reverse]" />
              <div className="absolute inset-6 animate-pulse rounded-full bg-cyan-500/10" />
              <TrendingUp className="h-8 w-8 text-cyan-400" />
            </div>
            <div className="space-y-2.5">
              {[
                'Analyzing job category benchmarks...',
                'Calculating experience premium...',
                'Evaluating performance bonus...',
                'Applying geo-location adjustments...',
                'Adding US market inflation buffer...',
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-400 opacity-0 [animation:fadeIn_0.4s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <div
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 opacity-0 [animation:fadeIn_0.3s_ease-out_forwards]"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                  {s}
                </div>
              ))}
            </div>
            <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-slate-800">
              <div className="absolute inset-y-0 w-1/3 animate-[scan_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </div>
          </div>
        )}

        {/* Results */}
        {result && !scanning && (
          <div className="mt-6 animate-[fadeIn_0.5s_ease-out] rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl shadow-cyan-500/10 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Worth Report</h3>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>

            {/* Main Target Worth */}
            <div className="mb-5 rounded-xl border border-white/5 bg-gradient-to-br from-cyan-950/40 to-slate-950 p-6 text-center">
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
                Target Market Worth
              </p>
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {fmtMoney(result.targetMarketWorth)}
                </span>
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Briefcase className="h-4 w-4 text-cyan-400" />
                {selectedCategory.label}
                <span className="text-slate-600">·</span>
                {yearsExperience || 0} yrs experience
                <span className="text-slate-600">·</span>
                Level {performanceLevel}
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <BreakdownRow label="Base Salary" value={fmtMoney(result.baseValue)} />
              <BreakdownRow
                label={`Experience Premium (${yearsExperience || 0} yrs × 4.5%)`}
                value={`+ ${fmtMoney(result.experiencePremium)}`}
                accent="text-emerald-400"
              />
              <BreakdownRow
                label={`Performance Bonus (Level ${performanceLevel})`}
                value={result.performanceBonus > 0 ? `+ ${fmtMoney(result.performanceBonus)}` : '—'}
                accent="text-emerald-400"
              />
              <BreakdownRow
                label="Geo-Location Buffer"
                value={result.geoBuffer > 0 ? `+ ${fmtMoney(result.geoBuffer)}` : '—'}
                accent="text-amber-400"
              />
              <BreakdownRow
                label="Market Inflation Padding (5%)"
                value={`+ ${fmtMoney(result.marketPadding)}`}
                accent="text-cyan-400"
              />
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>Market Position</span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <TrendingUp className="h-3 w-3" />
                  {fmtMoney(result.targetMarketWorth)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, Math.max(8, (result.targetMarketWorth / 250000) * 100))}%`,
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

function BreakdownRow({
  label,
  value,
  accent = 'text-white',
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-semibold ${accent}`}>{value}</span>
    </div>
  );
}
