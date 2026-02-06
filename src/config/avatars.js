// Avatar Configuration
// Centralized avatar system using actual PNG images from assets folder

import giraffeImg from '../assets/giraffe.png';
import dinosaurImg from '../assets/dinosaur.png';
import astronautImg from '../assets/astronaut.png';
import gorillaImg from '../assets/gorilla.png';
import meerkatImg from '../assets/meerkat.png';
import chickenImg from '../assets/chicken.png';
import bearImg from '../assets/bear.png';
import rabbitImg from '../assets/rabbit.png';
import pandaImg from '../assets/panda.png';
import catImg from '../assets/cat.png';

/**
 * Avatar data structure:
 * - id: Unique identifier used in database/API
 * - name: Display name shown to users
 * - image: Imported image path
 * - category: Grouping category
 * - themeColor: Primary color for UI accents
 * - themeBg: Background color class for selection states
 * - description: Fun description (optional)
 */

export const AVATARS = [
  {
    id: 'giraffe',
    name: 'Giraffe',
    image: giraffeImg,
    category: 'Animals',
    themeColor: '#F59E0B',
    themeBg: 'bg-amber-500/20',
    themeBorder: 'border-amber-500',
    themeText: 'text-amber-400',
    description: 'Tall and steady'
  },
  {
    id: 'dinosaur',
    name: 'Dinosaur',
    image: dinosaurImg,
    category: 'Animals',
    themeColor: '#10B981',
    themeBg: 'bg-emerald-500/20',
    themeBorder: 'border-emerald-500',
    themeText: 'text-emerald-400',
    description: 'Ancient speed demon'
  },
  {
    id: 'astronaut',
    name: 'Astronaut',
    image: astronautImg,
    category: 'Characters',
    themeColor: '#3B82F6',
    themeBg: 'bg-blue-500/20',
    themeBorder: 'border-blue-500',
    themeText: 'text-blue-400',
    description: 'Out of this world'
  },
  {
    id: 'gorilla',
    name: 'Gorilla',
    image: gorillaImg,
    category: 'Animals',
    themeColor: '#6B7280',
    themeBg: 'bg-gray-500/20',
    themeBorder: 'border-gray-500',
    themeText: 'text-gray-400',
    description: 'Strong and powerful'
  },
  {
    id: 'meerkat',
    name: 'Meerkat',
    image: meerkatImg,
    category: 'Animals',
    themeColor: '#D97706',
    themeBg: 'bg-amber-600/20',
    themeBorder: 'border-amber-600',
    themeText: 'text-amber-500',
    description: 'Always alert'
  },
  {
    id: 'chicken',
    name: 'Chicken',
    image: chickenImg,
    category: 'Animals',
    themeColor: '#EF4444',
    themeBg: 'bg-red-500/20',
    themeBorder: 'border-red-500',
    themeText: 'text-red-400',
    description: 'Fast and furious'
  },
  {
    id: 'bear',
    name: 'Bear',
    image: bearImg,
    category: 'Animals',
    themeColor: '#92400E',
    themeBg: 'bg-amber-800/20',
    themeBorder: 'border-amber-800',
    themeText: 'text-amber-700',
    description: 'Fierce competitor'
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    image: rabbitImg,
    category: 'Animals',
    themeColor: '#F472B6',
    themeBg: 'bg-pink-400/20',
    themeBorder: 'border-pink-400',
    themeText: 'text-pink-400',
    description: 'Quick and nimble'
  },
  {
    id: 'panda',
    name: 'Panda',
    image: pandaImg,
    category: 'Animals',
    themeColor: '#1F2937',
    themeBg: 'bg-gray-800/20',
    themeBorder: 'border-gray-800',
    themeText: 'text-gray-800',
    description: 'Cool and calm'
  },
  {
    id: 'cat',
    name: 'Cat',
    image: catImg,
    category: 'Animals',
    themeColor: '#8B5CF6',
    themeBg: 'bg-violet-500/20',
    themeBorder: 'border-violet-500',
    themeText: 'text-violet-400',
    description: 'Default companion'
  }
];

/**
 * Default avatar assigned to new users
 */
export const DEFAULT_AVATAR_ID = 'cat';

/**
 * Get avatar by ID
 * @param {string} id - Avatar ID
 * @returns {object|null} Avatar object or null if not found
 */
export const getAvatarById = (id) => {
  if (!id) return null;
  return AVATARS.find(avatar => avatar.id === id) || null;
};

/**
 * Check if avatar is a custom upload
 * @param {string} avatar - Avatar value from user object
 * @returns {boolean}
 */
export const isCustomAvatar = (avatar) => {
  return avatar?.startsWith('/uploads');
};

/**
 * Get avatar display info for a user
 * @param {object} user - User object with avatar property
 * @returns {object} Avatar display information
 */
export const getUserAvatarDisplay = (user) => {
  if (!user?.avatar) {
    const defaultAvatar = getAvatarById(DEFAULT_AVATAR_ID);
    return {
      type: 'preset',
      avatar: defaultAvatar,
      imageSrc: defaultAvatar?.image,
      name: defaultAvatar?.name || 'Unknown'
    };
  }

  if (isCustomAvatar(user.avatar)) {
    return {
      type: 'custom',
      avatar: null,
      imageSrc: `${import.meta.env.VITE_API_BASE_URL}${user.avatar}`,
      name: 'Custom Avatar'
    };
  }

  const presetAvatar = getAvatarById(user.avatar);
  if (presetAvatar) {
    return {
      type: 'preset',
      avatar: presetAvatar,
      imageSrc: presetAvatar.image,
      name: presetAvatar.name
    };
  }

  // Fallback to default
  const defaultAvatar = getAvatarById(DEFAULT_AVATAR_ID);
  return {
    type: 'preset',
    avatar: defaultAvatar,
    imageSrc: defaultAvatar?.image,
    name: defaultAvatar?.name || 'Unknown'
  };
};

/**
 * Group avatars by category
 * @returns {object} Avatars grouped by category
 */
export const getAvatarsByCategory = () => {
  return AVATARS.reduce((acc, avatar) => {
    if (!acc[avatar.category]) {
      acc[avatar.category] = [];
    }
    acc[avatar.category].push(avatar);
    return acc;
  }, {});
};

export default AVATARS;
