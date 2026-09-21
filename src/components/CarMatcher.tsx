import { useState, useCallback } from 'react';
import {
  Car,
  AlertCircle,
  TrendingUp,
  Calendar,
  Fuel,
  Gauge,
  RefreshCw,
  Zap,
  Search,
  Loader2,
  DollarSign,
  X,
} from 'lucide-react';
import { fetchGlobalCarData, type CarListing } from '@/api/globalCarApi';

export default function CarMatcher() {
  const [makeQuery, setMakeQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [budget, setBudget] = useState('');
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'mock' | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const budgetNum = parseInt(budget) || 0;
      const result = await fetchGlobalCarData({
        budget: budgetNum,
        make: makeQuery.trim() || undefined,
        model: modelQuery.trim() || undefined,
      });
      setCars(result.cars);
      setSource(result.source);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicle data.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [budget, makeQuery, modelQuery, loading]);

  const handleClear = () => {
    setMakeQuery('');
    setModelQuery('');
    setBudget('');
    setCars([]);
    setError(null);
    setSource(null);
    setHasSearched(false);
  };

  const fmtMoney = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const effectiveBudget = parseInt(budget) || 0;

  return (
    <section id="car-matcher" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-400">
          <Car className="h-3.5 w-3.5" />
          Global Vehicle Lookup
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Global Car Matching Engine
        </h2>
        <p className="mt-2 text-slate-400">
          Search any vehicle by make, model, or budget. Live data powered by CarAPI.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-3xl">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-5 shadow-2xl shadow-black/40 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Make */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                <Car className="mr-1.5 inline h-4 w-4 text-cyan-400" />
                Make
              </label>
              <input
                type="text"
                value={makeQuery}
                onChange={(e) => setMakeQuery(e.target.value)}
                placeholder="e.g. Toyota, BMW"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {/* Model */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                <Gauge className="mr-1.5 inline h-4 w-4 text-cyan-400" />
                Model
              </label>
              <input
                type="text"
                value={modelQuery}
                onChange={(e) => setModelQuery(e.target.value)}
                placeholder="e.g. Camry, Model 3"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                <DollarSign className="mr-1.5 inline h-4 w-4 text-cyan-400" />
                Max Budget ($)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 40000"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              {loading ? 'Searching...' : 'Search Vehicles'}
            </button>
            {(makeQuery || modelQuery || budget) && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:border-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Error (non-blocking, fallback data active) */}
      {error && !loading && cars.length > 0 && (
        <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-400">Using Fallback Vehicle Data</p>
              <p className="mt-0.5 text-sm text-slate-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error with no data */}
      {error && !loading && cars.length === 0 && (
        <div className="mx-auto max-w-2xl rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Unable to Load Vehicles</p>
              <p className="mt-0.5 text-sm text-slate-400">{error}</p>
              <button
                onClick={() => handleSearch()}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/15"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-white/5 bg-slate-950/60 p-5"
            >
              <div className="mb-4 h-32 rounded-xl bg-slate-800" />
              <div className="h-4 w-24 rounded bg-slate-800" />
              <div className="mt-2 h-3 w-16 rounded bg-slate-800" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-8 rounded-lg bg-slate-800" />
                <div className="h-8 rounded-lg bg-slate-800" />
                <div className="h-8 rounded-lg bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Car Grid */}
      {!loading && cars.length > 0 && (
        <>
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                source === 'live'
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                  : 'border-amber-500/20 bg-amber-500/5 text-amber-400'
              }`}
            >
              {source === 'live' ? <Zap className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              {source === 'live' ? 'Live API Data' : 'Fallback Data Active'}
            </span>
            <button
              onClick={() => handleSearch()}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:border-white/20 hover:text-white"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} budget={effectiveBudget} />
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            {cars.length} vehicles found
            {effectiveBudget > 0 && ` within ${fmtMoney(effectiveBudget)} budget`}
          </p>
        </>
      )}

      {/* Empty state */}
      {!loading && !error && hasSearched && cars.length === 0 && (
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
              <Search className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">No Vehicles Found</h3>
            <p className="mt-2 text-sm text-slate-400">
              Try adjusting your search criteria or increasing your budget.
            </p>
          </div>
        </div>
      )}

      {/* Initial state */}
      {!loading && !hasSearched && (
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
              <Car className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">Search for Any Vehicle</h3>
            <p className="mt-2 text-sm text-slate-400">
              Enter a make, model, or budget above to find real vehicle data.
              Leave fields blank to browse all available vehicles.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function CarCard({ car, budget }: { car: CarListing; budget: number }) {
  const fmtMoney = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const affordability = budget > 0 ? (car.price / budget) * 100 : 0;
  const showBudgetBadge = budget > 0;
  const isAffordable = affordability <= 85;
  const isTight = affordability > 85 && affordability <= 100;

  return (
    <div className="group animate-[fadeIn_0.4s_ease-out] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 transition-all duration-200 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10">
      {/* Image area */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <Car className="h-12 w-12 text-slate-600 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        {showBudgetBadge && (
          <div className="absolute right-3 top-3">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                isAffordable
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isTight
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-red-500/20 text-red-400'
              }`}
            >
              {Math.round(affordability)}% of budget
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white">{car.make}</h3>
            <p className="text-sm text-slate-400">{car.model}</p>
          </div>
          <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-medium text-slate-300">
            {car.year}
          </span>
        </div>

        {/* Specs */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Spec icon={Calendar} label="Year" value={`${car.year}`} />
          <Spec icon={Fuel} label="Fuel" value={car.fuelType} />
          <Spec icon={Gauge} label="Body" value={car.bodyType} />
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Target Price</p>
            <p className="text-lg font-bold text-white">{fmtMoney(car.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Valuation</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-cyan-400">
              <TrendingUp className="h-3.5 w-3.5" />
              {fmtMoney(car.valuation)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-center">
      <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-slate-500" />
      <p className="truncate text-xs font-semibold text-white">{value}</p>
      <p className="text-[9px] text-slate-500">{label}</p>
    </div>
  );
}
