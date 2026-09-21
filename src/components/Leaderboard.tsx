import { useState } from 'react';
import {
  Youtube,
  Instagram,
  Music2,
  TrendingUp,
  Trophy,
  ArrowUp,
  ArrowDown,
  Plus,
  Crown,
} from 'lucide-react';
import { SEED_CHANNELS, type Platform, type Channel } from '@/lib/valuation';

const platformIcon = (p: Platform) =>
  p === 'youtube' ? Youtube : p === 'instagram' ? Instagram : Music2;

const platformColor = (p: Platform) =>
  p === 'youtube' ? 'text-red-400' : p === 'instagram' ? 'text-fuchsia-400' : 'text-sky-400';

const fmtMoney = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `$${(n / 1_000).toFixed(0)}K`
      : `$${n}`;

export default function Leaderboard() {
  const [channels, setChannels] = useState<Channel[]>(SEED_CHANNELS);
  const [visibleCount, setVisibleCount] = useState(8);
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());

  const sorted = [...channels].sort((a, b) => b.estimatedValue - a.estimatedValue);
  const visible = sorted.slice(0, visibleCount);

  const handleVote = (id: number, dir: 'up' | 'down') => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === id ? { ...ch, votes: ch.votes + (dir === 'up' ? 1 : -1) } : ch,
      ),
    );
    setVotedIds((prev) => new Set(prev).add(id));
  };

  const rankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
          <Crown className="h-4 w-4 text-amber-400" />
        </div>
      );
    if (rank === 2)
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-300/10">
          <span className="text-sm font-bold text-slate-300">2</span>
        </div>
      );
    if (rank === 3)
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-700/15">
          <span className="text-sm font-bold text-orange-500">3</span>
        </div>
      );
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-sm font-bold text-slate-400">
        {rank}
      </div>
    );
  };

  return (
    <section id="leaderboard" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-400">
          <Trophy className="h-3.5 w-3.5" />
          Live This Week
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Highest Valued Viral Channels
        </h2>
        <p className="mt-2 text-slate-400">Community hype leaderboard — vote up channels you believe in.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
        {/* Table header — desktop */}
        <div className="hidden grid-cols-[60px_1fr_120px_140px_120px] gap-4 border-b border-white/5 px-6 py-3 text-xs font-medium uppercase tracking-widest text-slate-500 sm:grid">
          <span>Rank</span>
          <span>Channel</span>
          <span>Platform</span>
          <span className="text-right">Est. Value</span>
          <span className="text-right">Votes</span>
        </div>

        {visible.map((ch, idx) => {
          const rank = idx + 1;
          const Icon = platformIcon(ch.platform);
          return (
            <div
              key={ch.id}
              className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-white/5 px-4 py-4 transition hover:bg-white/[0.02] sm:grid-cols-[60px_1fr_120px_140px_120px] sm:gap-4 sm:px-6"
            >
              {/* Rank */}
              <div className="flex items-center">{rankBadge(rank)}</div>

              {/* Channel name + followers (mobile combines) */}
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{ch.name}</p>
                <p className="text-xs text-slate-500">
                  {ch.followers >= 1_000_000
                    ? `${(ch.followers / 1_000_000).toFixed(1)}M`
                    : `${(ch.followers / 1_000).toFixed(0)}K`}{' '}
                  followers · {ch.category}
                </p>
              </div>

              {/* Platform — desktop */}
              <div className="hidden items-center gap-2 sm:flex">
                <Icon className={`h-5 w-5 ${platformColor(ch.platform)}`} />
                <span className="text-sm capitalize text-slate-400">{ch.platform}</span>
              </div>

              {/* Est value — desktop */}
              <div className="hidden items-center justify-end gap-1.5 sm:flex">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold text-white">{fmtMoney(ch.estimatedValue)}</span>
              </div>

              {/* Votes */}
              <div className="flex items-center justify-end gap-2">
                <div className="hidden text-right sm:block">
                  <span className="font-bold text-white">{ch.votes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleVote(ch.id, 'up')}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                      votedIds.has(ch.id)
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 text-slate-500 hover:border-emerald-500/30 hover:text-emerald-400'
                    }`}
                    aria-label="Vote up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleVote(ch.id, 'down')}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition hover:border-red-500/30 hover:text-red-400"
                    aria-label="Vote down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {visibleCount < sorted.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + 8)}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-6 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/15"
          >
            <Plus className="h-4 w-4" />
            Load More Channels
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Showing {visible.length} of {sorted.length} channels
          </p>
        </div>
      )}
    </section>
  );
}
