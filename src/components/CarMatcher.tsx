import { useState, useEffect, useCallback } from 'react';
import {
  Car,
  Loader2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Fuel,
  Gauge,
  RefreshCw,
  Zap,
  CircleDollarSign,
} from 'lucide-react';
import { fetchGlobalCarData, type CarListing } from '@/api/globalCarApi';

interface CarMatcherProps {
  targetMarketWorth: number;
}

export default function CarMatcher({ targetMarketWorth }: CarMatcherProps) {
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'mock' | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const vehicleBudget = Math.round(targetMarketWorth * 0.3);

  const fetchCars = useCallback(async () => {
    if (vehicleBudget <= 0) return;
    setLoading(true);
    setError(null);
    setHasFetched(true);
    try {
      const result = await fetchGlobalCarData(vehicleBudget);
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
  }, [vehicleBudget]);

  useEffect(() => {
    if (targetMarketWorth > 0) {
      fetchCars();
    } else {
      setCars([]);
      setHasFetched(false);
      setError(null);
      setSource(null);
    }
  }, [targetMarketWorth, fetchCars]);

  const fmtMoney = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <section id="car-matcher" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-400">
          <Car className="h-3.5 w-3.5" />
          Global Car Matching Engine
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Vehicles Matching Your Budget
        </h2>
        <p className="mt-2 text-slate-400">
          30% of your target market worth is allocated to your vehicle purchase budget.
        </p>
      </div>

      {/* Budget Display */}
      {targetMarketWorth > 0 && (
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-950 p-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30">
                <CircleDollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                  Vehicle Budget (30% of Worth)
                </p>
                <p className="text-2xl font-bold text-white">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {fmtMoney(vehicleBudget)}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Target Worth: {fmtMoney(targetMarketWorth)}
            </div>
          </div>
        </div>
      )}

      {/* Waiting State */}
      {targetMarketWorth <= 0 && (
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
              <Car className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">Calculate Your Worth First</h3>
            <p className="mt-2 text-sm text-slate-400">
              Use the Target Market Worth Calculator above to determine your vehicle budget.
              The car matcher will automatically find vehicles within 30% of your calculated worth.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
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

      {/* Error (non-blocking, just a notice) */}
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

      {/* Error with no fallback data */}
      {error && !loading && cars.length === 0 && targetMarketWorth > 0 && (
        <div className="mx-auto max-w-2xl rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Unable to Load Vehicles</p>
              <p className="mt-0.5 text-sm text-slate-400">{error}</p>
              <button
                onClick={fetchCars}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/15"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Car Grid */}
      {!loading && cars.length > 0 && (
        <>
          {/* Source badge */}
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
              onClick={fetchCars}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:border-white/20 hover:text-white"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} budget={vehicleBudget} />
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            {cars.length} vehicles found within {fmtMoney(vehicleBudget)} budget
          </p>
        </>
      )}
    </section>
  );
}

function CarCard({ car, budget }: { car: CarListing; budget: number }) {
  const fmtMoney = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const affordability = (car.price / budget) * 100;
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
        {/* Affordability badge */}
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
