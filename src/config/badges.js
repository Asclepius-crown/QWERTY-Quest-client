// Rank Badge Configuration
// Sprite sheet layout from badges.png (2 rows x 4 columns):
// Row 1: Bronze | Silver | Gold | Platinum
// Row 2: Diamond | Master | Legend | Apex

import badgesSprite from '../assets/badges.png';

export const BADGES = [
  {
    id: 'bronze',
    name: 'Bronze',
    spritePosition: { x: 0, y: 0 },
    spriteSize: { width: 25, height: 50 },
    themeColor: '#C2410C',
    themeBg: 'bg-orange-900/20',
    themeBorder: 'border-orange-700',
    themeText: 'text-orange-700',
    glowColor: 'rgba(194, 65, 12, 0.5)',
    minElo: 0,
    reward: 'Basic Badge'
  },
  {
    id: 'silver',
    name: 'Silver',
    spritePosition: { x: 25, y: 0 },
    spriteSize: { width: 25, height: 50 },
    themeColor: '#9CA3AF',
    themeBg: 'bg-gray-700/20',
    themeBorder: 'border-gray-400',
    themeText: 'text-gray-400',
    glowColor: 'rgba(156, 163, 175, 0.5)',
    minElo: 1150,
    reward: 'Silver Frame'
  },
  {
    id: 'gold',
    name: 'Gold',
    spritePosition: { x: 50, y: 0 },
    spriteSize: { width: 25, height: 50 },
    themeColor: '#FACC15',
    themeBg: 'bg-yellow-600/20',
    themeBorder: 'border-yellow-500',
    themeText: 'text-yellow-400',
    glowColor: 'rgba(250, 204, 21, 0.5)',
    minElo: 1300,
    reward: 'Gold Glow'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    spritePosition: { x: 75, y: 0 },
    spriteSize: { width: 25, height: 50 },
    themeColor: '#22D3EE',
    themeBg: 'bg-cyan-600/20',
    themeBorder: 'border-cyan-500',
    themeText: 'text-cyan-400',
    glowColor: 'rgba(34, 211, 238, 0.5)',
    minElo: 1500,
    reward: 'Neon Trail'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    spritePosition: { x: 0, y: 50 },
    spriteSize: { width: 25, height: 50 },
    themeColor: '#A855F7',
    themeBg: 'bg-purple-600/20',
    themeBorder: 'border-purple-500',
    themeText: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    minElo: 1750,
    reward: 'Diamond Icon'
  },
  {
    id: 'master',
    name: 'Master',
    spritePosition: { x: 25, y: 50 },
    spriteSize: { width: 25, height: 50 },
    themeColor: '#EC4899',
    themeBg: 'bg-pink-600/20',
    themeBorder: 'border-pink-500',
    themeText: 'text-pink-400',
    glowColor: 'rgba(236, 72, 153, 0.5)',
    minElo: 2000,
    reward: 'Master Status'
  },
  {
    id: 'legend',
    name: 'Legend',
    spritePosition: { x: 50, y: 50 },
    spriteSize: { width: 25, height: 50 },
    themeColor: '#F97316',
    themeBg: 'bg-orange-500/20',
    themeBorder: 'border-orange-500',
    themeText: 'text-orange-400',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    minElo: 2250,
    reward: 'Legendary Title'
  },
  {
    id: 'apex',
    name: 'Apex',
    spritePosition: { x: 75, y: 50 },
    spriteSize: { width: 25, height: 50 },
    themeColor: '#EF4444',
    themeBg: 'bg-red-600/20',
    themeBorder: 'border-red-500',
    themeText: 'text-red-500',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    minElo: 2500,
    reward: 'Ultimate Prestige'
  }
];

/**
 * Sprite sheet source image
 */
export const BADGES_SPRITE = badgesSprite;

/**
 * Get badge by rank ID
 * @param {string} rankId - Rank identifier
 * @returns {object|null} Badge object or null if not found
 */
export const getBadgeByRank = (rankId) => {
  if (!rankId) return null;
  // Normalize rankId to lowercase for case-insensitive matching
  const normalizedId = rankId.toLowerCase().replace(/\s+/g, '');
  return BADGES.find(badge => 
    badge.id === normalizedId || 
    badge.name.toLowerCase() === normalizedId
  ) || null;
};

/**
 * Get badge display style for sprite sheet
 * @param {string} rankId - Rank identifier
 * @returns {object} CSS style object for background positioning
 */
export const getBadgeStyle = (rankId) => {
  const badge = getBadgeByRank(rankId);
  if (!badge) return {};

  return {
    backgroundImage: `url(${BADGES_SPRITE})`,
    backgroundPosition: `${badge.spritePosition.x}% ${badge.spritePosition.y}%`,
    backgroundSize: '400% 200%',
    backgroundRepeat: 'no-repeat',
    imageRendering: 'pixelated'
  };
};

/**
 * Get badge display info for a user
 * @param {object} user - User object with rank property
 * @returns {object} Badge display information
 */
export const getUserRankBadge = (user) => {
  const rank = user?.stats?.rank || 'Bronze';
  const badge = getBadgeByRank(rank);

  if (!badge) {
    const defaultBadge = BADGES[0];
    return {
      badge: defaultBadge,
      style: {
        backgroundImage: `url(${BADGES_SPRITE})`,
        backgroundPosition: '0% 0%',
        backgroundSize: '400% 200%',
        backgroundRepeat: 'no-repeat'
      }
    };
  }

  return {
    badge,
    style: {
      backgroundImage: `url(${BADGES_SPRITE})`,
      backgroundPosition: `${badge.spritePosition.x}% ${badge.spritePosition.y}%`,
      backgroundSize: '400% 200%',
      backgroundRepeat: 'no-repeat'
    }
  };
};

/**
 * Check if user meets minimum ELO for a rank
 * @param {number} elo - User's current ELO
 * @param {string} rankId - Rank to check
 * @returns {boolean}
 */
export const hasRank = (elo, rankId) => {
  const badge = getBadgeByRank(rankId);
  if (!badge) return false;
  return elo >= badge.minElo;
};

/**
 * Get next rank for a given rank
 * @param {string} currentRankId - Current rank ID
 * @returns {object|null} Next rank badge or null if at max rank
 */
export const getNextRank = (currentRankId) => {
  const currentIndex = BADGES.findIndex(b => b.id === currentRankId.toLowerCase());
  if (currentIndex === -1 || currentIndex === 0) return null;
  return BADGES[currentIndex - 1];
};

export const getAllRanks = () => {
  return [...BADGES].sort((a, b) => a.minElo - b.minElo);
};

export const getBadgeByElo = (elo) => {
  const sortedRanks = getAllRanks();
  for (let i = sortedRanks.length - 1; i >= 0; i--) {
    if (elo >= sortedRanks[i].minElo) {
      return sortedRanks[i];
    }
  }
  return sortedRanks[0];
};

export const getProgressToNextRank = (elo, currentRankId) => {
  const currentBadge = getBadgeByRank(currentRankId);
  if (!currentBadge) return { progress: 0, nextRank: null, eloNeeded: 0 };

  const nextRank = getNextRank(currentRankId);
  if (!nextRank) return { progress: 100, nextRank: null, eloNeeded: 0 };

  const currentMinElo = currentBadge.minElo;
  const nextMinElo = nextRank.minElo;
  const eloInCurrentTier = elo - currentMinElo;
  const eloNeededForNext = nextMinElo - currentMinElo;

  const progress = Math.min(100, Math.max(0, Math.round((eloInCurrentTier / eloNeededForNext) * 100)));

  return {
    progress,
    nextRank: nextRank.name,
    nextRankElo: nextMinElo,
    eloNeeded: Math.max(0, nextMinElo - elo)
  };
};

export const getRankTierInfo = (rankId) => {
  const badge = getBadgeByRank(rankId);
  if (!badge) return null;

  const nextRank = getNextRank(rankId);
  const sortedRanks = getAllRanks();
  const currentIndex = sortedRanks.findIndex(b => b.id === badge.id);
  const totalRanks = sortedRanks.length;
  const tier = totalRanks - currentIndex;

  return {
    ...badge,
    tier,
    totalRanks,
    nextRank: nextRank ? { id: nextRank.id, name: nextRank.name, minElo: nextRank.minElo } : null,
    isMaxRank: nextRank === null
  };
};

export default BADGES;
