export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  estimatedValue: number;
  votes: number;
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const fmtCount = (s: string | undefined): number => {
  if (!s) return 0;
  return parseInt(s, 10) || 0;
};

export async function searchYouTubeChannels(
  query: string,
  pageToken?: string,
): Promise<{ channels: YouTubeChannel[]; nextPageToken: string | null }> {
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured.');
  }

  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  searchUrl.searchParams.set('part', 'snippet');
  searchUrl.searchParams.set('type', 'channel');
  searchUrl.searchParams.set('q', query);
  searchUrl.searchParams.set('maxResults', '12');
  searchUrl.searchParams.set('key', API_KEY);
  if (pageToken) searchUrl.searchParams.set('pageToken', pageToken);

  const searchRes = await fetch(searchUrl.toString());
  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Search failed (${searchRes.status})`);
  }
  const searchData = await searchRes.json();

  const items: Array<{ id: { channelId: string }; snippet: { title: string; description: string; thumbnails: { high?: { url: string }; default?: { url: string } } } }> =
    searchData.items || [];

  const channelIds = items.map((i) => i.id.channelId).filter(Boolean);
  if (channelIds.length === 0) {
    return { channels: [], nextPageToken: searchData.nextPageToken || null };
  }

  const statsUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
  statsUrl.searchParams.set('part', 'statistics,snippet');
  statsUrl.searchParams.set('id', channelIds.join(','));
  statsUrl.searchParams.set('key', API_KEY);

  const statsRes = await fetch(statsUrl.toString());
  if (!statsRes.ok) {
    const err = await statsRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Statistics fetch failed (${statsRes.status})`);
  }
  const statsData = await statsRes.json();

  const statMap = new Map<string, { statistics: { subscriberCount?: string; viewCount?: string; videoCount?: string }; snippet: { thumbnails: { high?: { url: string }; default?: { url: string } } } }>();
  for (const item of statsData.items || []) {
    statMap.set(item.id, item);
  }

  const channels: YouTubeChannel[] = items
    .filter((i) => statMap.has(i.id.channelId))
    .map((i) => {
      const stats = statMap.get(i.id.channelId)!;
      const subs = fmtCount(stats.statistics.subscriberCount);
      const views = fmtCount(stats.statistics.viewCount);
      const thumb =
        stats.snippet.thumbnails.high?.url ||
        stats.snippet.thumbnails.default?.url ||
        i.snippet.thumbnails.high?.url ||
        i.snippet.thumbnails.default?.url ||
        '';

      return {
        id: i.id.channelId,
        title: i.snippet.title,
        description: i.snippet.description,
        thumbnail: thumb,
        subscriberCount: subs,
        viewCount: views,
        videoCount: fmtCount(stats.statistics.videoCount),
        estimatedValue: Math.round(subs * 0.05 + views * 0.15),
        votes: 0,
      };
    });

  return { channels, nextPageToken: searchData.nextPageToken || null };
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

export function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}
