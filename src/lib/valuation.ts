export type Platform = 'youtube' | 'instagram' | 'tiktok';
export type Category = 'gaming' | 'tech' | 'fashion' | 'meme' | 'lifestyle';

export const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'youtube', label: 'YouTube' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
];

export const CATEGORIES: { id: Category; label: string; weight: number }[] = [
  { id: 'gaming', label: 'Gaming', weight: 1.15 },
  { id: 'tech', label: 'Tech', weight: 1.2 },
  { id: 'fashion', label: 'Fashion', weight: 1.1 },
  { id: 'meme', label: 'Meme', weight: 0.9 },
  { id: 'lifestyle', label: 'Lifestyle', weight: 1.05 },
];

export interface ValuationResult {
  netAssetValue: number;
  perPostRate: number;
  grade: string;
  gradeColor: string;
  tier: string;
}

export function calculateValuation(
  platform: Platform,
  followers: number,
  avgViews: number,
  category: Category,
): ValuationResult {
  const cat = CATEGORIES.find((c) => c.id === category);
  const weight = cat ? cat.weight : 1;

  const platformMult =
    platform === 'youtube' ? 1.3 : platform === 'instagram' ? 1.1 : 1.0;

  const base = followers * 0.05 + avgViews * 0.15;
  const netAssetValue = Math.round(base * weight * platformMult);
  const perPostRate = Math.round((avgViews * 0.02 * weight * platformMult) + followers * 0.001);

  let grade = 'Nano Catalyst';
  let gradeColor = 'text-cyan-400';
  let tier = 'Tier I';

  if (followers > 1000000) {
    grade = 'Mega-Influencer';
    gradeColor = 'text-amber-400';
    tier = 'Tier S';
  } else if (followers > 500000) {
    grade = 'Macro Influencer';
    gradeColor = 'text-fuchsia-400';
    tier = 'Tier A';
  } else if (followers > 100000) {
    grade = 'Mid-Tier Influencer';
    gradeColor = 'text-emerald-400';
    tier = 'Tier B';
  } else if (followers > 10000) {
    grade = 'Micro Influencer';
    gradeColor = 'text-sky-400';
    tier = 'Tier C';
  } else if (followers > 1000) {
    grade = 'Rising Star';
    gradeColor = 'text-blue-300';
    tier = 'Tier D';
  }

  return { netAssetValue, perPostRate, grade, gradeColor, tier };
}

export interface Channel {
  id: number;
  name: string;
  platform: Platform;
  followers: number;
  category: Category;
  estimatedValue: number;
  votes: number;
}

const rawChannels: Omit<Channel, 'id' | 'votes'>[] = [
  { name: 'PixelPlayz', platform: 'youtube', followers: 2400000, category: 'gaming', estimatedValue: 3200000 },
  { name: 'TechNova', platform: 'youtube', followers: 1800000, category: 'tech', estimatedValue: 2800000 },
  { name: 'GlamGoddess', platform: 'instagram', followers: 1300000, category: 'fashion', estimatedValue: 1900000 },
  { name: 'MemeMachine', platform: 'tiktok', followers: 3100000, category: 'meme', estimatedValue: 1700000 },
  { name: 'LifeWithLuna', platform: 'youtube', followers: 900000, category: 'lifestyle', estimatedValue: 1200000 },
  { name: 'GlideKing', platform: 'tiktok', followers: 4200000, category: 'gaming', estimatedValue: 2600000 },
  { name: 'FitFocus', platform: 'instagram', followers: 750000, category: 'lifestyle', estimatedValue: 980000 },
  { name: 'CodeCrunch', platform: 'youtube', followers: 520000, category: 'tech', estimatedValue: 860000 },
  { name: 'DripDiary', platform: 'instagram', followers: 680000, category: 'fashion', estimatedValue: 720000 },
  { name: 'QuickClips', platform: 'tiktok', followers: 2100000, category: 'meme', estimatedValue: 1100000 },
  { name: 'StreamSniper', platform: 'youtube', followers: 1100000, category: 'gaming', estimatedValue: 1500000 },
  { name: 'ChicVibes', platform: 'instagram', followers: 430000, category: 'fashion', estimatedValue: 540000 },
  { name: 'ByteBuster', platform: 'tiktok', followers: 1500000, category: 'tech', estimatedValue: 1300000 },
  { name: 'UrbanUplift', platform: 'youtube', followers: 320000, category: 'lifestyle', estimatedValue: 410000 },
  { name: 'SnackHacks', platform: 'tiktok', followers: 890000, category: 'lifestyle', estimatedValue: 760000 },
  { name: 'RetroRGB', platform: 'youtube', followers: 650000, category: 'gaming', estimatedValue: 880000 },
  { name: 'TrendTilt', platform: 'instagram', followers: 1200000, category: 'meme', estimatedValue: 1000000 },
  { name: 'GadgetGuru', platform: 'youtube', followers: 780000, category: 'tech', estimatedValue: 990000 },
  { name: 'StyleSprint', platform: 'instagram', followers: 240000, category: 'fashion', estimatedValue: 320000 },
  { name: 'ViralVault', platform: 'tiktok', followers: 5600000, category: 'meme', estimatedValue: 3400000 },
  { name: 'CosmicCook', platform: 'youtube', followers: 410000, category: 'lifestyle', estimatedValue: 480000 },
  { name: 'NeonNinja', platform: 'tiktok', followers: 1900000, category: 'gaming', estimatedValue: 1600000 },
  { name: 'LuxeLens', platform: 'instagram', followers: 950000, category: 'fashion', estimatedValue: 1150000 },
  { name: 'PitchPerfect', platform: 'youtube', followers: 600000, category: 'tech', estimatedValue: 770000 },
  { name: 'DailyDose', platform: 'tiktok', followers: 3300000, category: 'lifestyle', estimatedValue: 2200000 },
  { name: 'FrameFury', platform: 'youtube', followers: 870000, category: 'gaming', estimatedValue: 1120000 },
  { name: 'AuraArt', platform: 'instagram', followers: 510000, category: 'lifestyle', estimatedValue: 630000 },
  { name: 'ClipCartel', platform: 'tiktok', followers: 2700000, category: 'meme', estimatedValue: 1850000 },
  { name: 'SyncSavvy', platform: 'youtube', followers: 380000, category: 'tech', estimatedValue: 450000 },
  { name: 'FitFlux', platform: 'instagram', followers: 1600000, category: 'lifestyle', estimatedValue: 1480000 },
];

export const SEED_CHANNELS: Channel[] = rawChannels.map((c, i) => ({
  ...c,
  id: i + 1,
  votes: Math.floor(Math.random() * 5000) + 200,
}));
