import { useState, useCallback } from 'react';
import {
  Search,
  Loader2,
  Youtube,
  Eye,
  Users,
  Video,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Plus,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  searchYouTubeChannels,
  formatCompact,
  formatMoney,
  type YouTubeChannel,
} from '@/lib/youtube';

export default function ChannelSearch() {
  const [query, setQuery] = useState('');
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await searchYouTubeChannels(q);
      setChannels(result.channels);
      setNextPageToken(result.nextPageToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search channels.');
      setChannels([]);
      setNextPageToken(null);
    } finally {
      setLoading(false);
    }
  }, [query, loading]);

  const handleLoadMore = useCallback(async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await searchYouTubeChannels(query.trim(), nextPageToken);
      setChannels((prev) => [...prev, ...result.channels]);
      setNextPageToken(result.nextPageToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more channels.');
    } finally {
      setLoadingMore(false);
    }
  }, [nextPageToken, query, loadingMore]);

  const handleVote = (id: string, dir: 'up' | 'down') => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === id ? { ...ch, votes: ch.votes + (dir === 'up' ? 1 : -1) } : ch,
      ),
    );
    setVotedIds((prev) => new Set(prev).add(id));
  };

  const handleClear = () => {
    setQuery('');
    setChannels([]);
    setNextPageToken(null);
    setError(null);
    setHasSearched(false);
    setVotedIds(new Set());
  };

  return (
    <section id="search" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400">
          <Youtube className="h-3.5 w-3.5" />
          Live YouTube Search
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Search Any YouTube Channel
        </h2>
        <p className="mt-2 text-slate-400">
          Find real channels with live subscriber counts, total views, and estimated value.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by channel name or paste channel ID (e.g. MrBeast)"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-4 pl-12 pr-28 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/10 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40 disabled:opacity-50 sm:px-5"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Search Error</p>
              <p className="mt-0.5 text-sm text-slate-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-white/5 bg-slate-950/60 p-5"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-800" />
                <div className="flex-1">
                  <div className="h-4 w-32 rounded bg-slate-800" />
                  <div className="mt-2 h-3 w-20 rounded bg-slate-800" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-12 rounded-lg bg-slate-800" />
                <div className="h-12 rounded-lg bg-slate-800" />
                <div className="h-12 rounded-lg bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!loading && channels.length > 0 && (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((ch) => (
              <ChannelCard
                key={ch.id}
                channel={ch}
                voted={votedIds.has(ch.id)}
                onVote={handleVote}
              />
            ))}
          </div>

          {/* Load More */}
          {nextPageToken && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-6 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/15 disabled:opacity-50"
              >
                {loadingMore ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Load More Channels
              </button>
              <p className="mt-2 text-xs text-slate-500">
                {channels.length} channels loaded
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && hasSearched && channels.length === 0 && (
        <div className="mt-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
            <Search className="h-8 w-8 text-slate-600" />
          </div>
          <p className="text-slate-400">No channels found. Try a different search term.</p>
        </div>
      )}
    </section>
  );
}

function ChannelCard({
  channel,
  voted,
  onVote,
}: {
  channel: YouTubeChannel;
  voted: boolean;
  onVote: (id: string, dir: 'up' | 'down') => void;
}) {
  return (
    <div className="group animate-[fadeIn_0.4s_ease-out] rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-5 transition-all duration-200 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10">
      {/* Header */}
      <div className="flex items-start gap-4">
        <img
          src={channel.thumbnail}
          alt={channel.title}
          className="h-16 w-16 shrink-0 rounded-full border-2 border-cyan-500/20 object-cover"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Youtube className="h-4 w-4 shrink-0 text-red-400" />
            <h3 className="truncate font-semibold text-white">{channel.title}</h3>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{channel.description}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat icon={Users} label="Subs" value={formatCompact(channel.subscriberCount)} color="text-red-400" />
        <Stat icon={Eye} label="Views" value={formatCompact(channel.viewCount)} color="text-cyan-400" />
        <Stat icon={Video} label="Videos" value={formatCompact(channel.videoCount)} color="text-blue-400" />
      </div>

      {/* Footer: Value + Votes */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Est. Value</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <span className="text-lg font-bold text-white">{formatMoney(channel.estimatedValue)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">{channel.votes > 0 ? `+${channel.votes}` : channel.votes}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onVote(channel.id, 'up')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                voted
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 text-slate-500 hover:border-emerald-500/30 hover:text-emerald-400'
              }`}
              aria-label="Vote up"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => onVote(channel.id, 'down')}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition hover:border-red-500/30 hover:text-red-400"
              aria-label="Vote down"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
      <Icon className={`mx-auto mb-1 h-4 w-4 ${color}`} />
      <p className="text-sm font-bold text-white">{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}
