import { ContributorLevel } from '@/types/restaurant';

export const CONTRIBUTOR_LEVELS = {
  newbie: { min: 0, max: 4, name: 'Newbie Member', emoji: '🌱', color: 'text-gray-600' },
  bronze: { min: 5, max: 14, name: 'Bronze Contributor', emoji: '🥉', color: 'text-amber-600' },
  silver: { min: 15, max: 29, name: 'Silver Contributor', emoji: '🥈', color: 'text-gray-500' },
  gold: { min: 30, max: 49, name: 'Gold Contributor', emoji: '🥇', color: 'text-yellow-600' },
  platinum: { min: 50, max: Infinity, name: 'Platinum Contributor', emoji: '💎', color: 'text-purple-600' }
} as const;

export function calculateContributorLevel(contributionCount: number): ContributorLevel {
  if (contributionCount >= CONTRIBUTOR_LEVELS.platinum.min) return 'platinum';
  if (contributionCount >= CONTRIBUTOR_LEVELS.gold.min) return 'gold';
  if (contributionCount >= CONTRIBUTOR_LEVELS.silver.min) return 'silver';
  if (contributionCount >= CONTRIBUTOR_LEVELS.bronze.min) return 'bronze';
  return 'newbie';
}

export function getContributorDisplayName(level: ContributorLevel, showEmail: boolean, email?: string): string {
  const levelInfo = CONTRIBUTOR_LEVELS[level];
  
  if (showEmail && email) {
    return `${levelInfo.emoji} ${email}`;
  }
  
  return `${levelInfo.emoji} ${levelInfo.name}`;
}

export function getContributorInfo(level: ContributorLevel) {
  return CONTRIBUTOR_LEVELS[level];
}

export function getNextLevelInfo(currentLevel: ContributorLevel) {
  const levels: ContributorLevel[] = ['newbie', 'bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = levels.indexOf(currentLevel);
  
  if (currentIndex < levels.length - 1) {
    return CONTRIBUTOR_LEVELS[levels[currentIndex + 1]];
  }
  
  return null; // Already at highest level
}
