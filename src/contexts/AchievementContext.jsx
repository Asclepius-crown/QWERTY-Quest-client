import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Trophy, Zap, Target, Shield, Crown, Flame, Users, Ghost, 
  Code, Keyboard, Monitor, Clock, Sword, Award, Star, 
  TrendingUp, Calendar, Moon, Sun, Globe, Eye, Crosshair,
  Activity, Medal, Sparkles, Bolt
} from 'lucide-react';
import { useAuth } from './AuthContext';

const AchievementContext = createContext();

export const useAchievements = () => useContext(AchievementContext);

// Rarity levels with colors
export const RARITY = {
  COMMON: { name: 'Common', color: '#9CA3AF', glow: '0 0 10px rgba(156,163,175,0.5)' },
  RARE: { name: 'Rare', color: '#3B82F6', glow: '0 0 15px rgba(59,130,246,0.6)' },
  EPIC: { name: 'Epic', color: '#A855F7', glow: '0 0 20px rgba(168,85,247,0.7)' },
  LEGENDARY: { name: 'Legendary', color: '#EAB308', glow: '0 0 25px rgba(234,179,8,0.8)' }
};

// Achievement sound effects
const playUnlockSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a triumphant chord
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C major chord
    const now = ctx.currentTime;
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 1);
      
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 1.2);
    });
    
    // Add sparkle sound
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkleOsc.frequency.setValueAtTime(2000, now);
    sparkleOsc.frequency.exponentialRampToValueAtTime(4000, now + 0.3);
    sparkleGain.gain.setValueAtTime(0.1, now);
    sparkleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    sparkleOsc.start(now);
    sparkleOsc.stop(now + 0.3);
  } catch (e) { 
    console.error('Audio error:', e); 
  }
};

export const playHoverSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
};

export const ACHIEVEMENTS = {
  // === SPEED & PERFORMANCE (8 achievements) ===
  speed_demon_1: {
    id: 'speed_demon_1',
    title: 'Speed Novice',
    desc: 'Reach 60 WPM in any mode',
    criteria: 'Type at 60 WPM or higher',
    icon: Zap,
    rarity: RARITY.COMMON,
    category: 'speed',
    target: 60,
    check: (stats) => stats.bestWPM >= 60
  },
  speed_demon_2: {
    id: 'speed_demon_2',
    title: 'Speed Demon',
    desc: 'Reach 100 WPM in any mode',
    criteria: 'Type at 100 WPM or higher',
    icon: Bolt,
    rarity: RARITY.RARE,
    category: 'speed',
    target: 100,
    check: (stats) => stats.bestWPM >= 100
  },
  speed_demon_3: {
    id: 'speed_demon_3',
    title: 'Lightning Fingers',
    desc: 'Reach 150 WPM in any mode',
    criteria: 'Type at 150 WPM or higher',
    icon: Sparkles,
    rarity: RARITY.EPIC,
    category: 'speed',
    target: 150,
    check: (stats) => stats.bestWPM >= 150
  },
  perfect_precision: {
    id: 'perfect_precision',
    title: 'Perfect Precision',
    desc: 'Complete a race with 100% accuracy',
    criteria: 'Finish any race with zero errors',
    icon: Target,
    rarity: RARITY.RARE,
    category: 'precision',
    target: 1,
    check: (stats) => stats.perfectRaces >= 1
  },
  consistency_king: {
    id: 'consistency_king',
    title: 'Consistency King',
    desc: 'Maintain 95%+ accuracy across 50 races',
    criteria: 'Complete 50 races with 95% or higher accuracy',
    icon: Crosshair,
    rarity: RARITY.EPIC,
    category: 'precision',
    target: 50,
    check: (stats) => stats.highAccuracyRaces >= 50
  },
  error_hunter: {
    id: 'error_hunter',
    title: 'Error Hunter',
    desc: 'Complete 10 races with 0 errors',
    criteria: 'Finish 10 races without any mistakes',
    icon: Shield,
    rarity: RARITY.RARE,
    category: 'precision',
    target: 10,
    check: (stats) => stats.zeroErrorRaces >= 10
  },
  speed_streak: {
    id: 'speed_streak',
    title: 'Speed Streak',
    desc: 'Achieve personal best 3 times in a row',
    criteria: 'Break your WPM record 3 times consecutively',
    icon: TrendingUp,
    rarity: RARITY.EPIC,
    category: 'speed',
    target: 3,
    check: (stats) => stats.personalBestStreak >= 3
  },
  no_look: {
    id: 'no_look',
    title: 'Blind Typist',
    desc: 'Type 80+ WPM without looking at keyboard',
    criteria: 'Self-reported: Enable blind mode and reach 80 WPM',
    icon: Eye,
    rarity: RARITY.LEGENDARY,
    category: 'speed',
    target: 1,
    check: (stats) => stats.blindModeHighWPM >= 1
  },

  // === PROGRESS & MILESTONES (6 achievements) ===
  first_steps: {
    id: 'first_steps',
    title: 'First Steps',
    desc: 'Complete your first race',
    criteria: 'Finish any race',
    icon: Award,
    rarity: RARITY.COMMON,
    category: 'progress',
    target: 1,
    check: (stats) => stats.totalRaces >= 1
  },
  centurion: {
    id: 'centurion',
    title: 'Centurion',
    desc: 'Complete 100 races',
    criteria: 'Participate in 100 races total',
    icon: Trophy,
    rarity: RARITY.RARE,
    category: 'progress',
    target: 100,
    check: (stats) => stats.totalRaces >= 100
  },
  marathon_runner: {
    id: 'marathon_runner',
    title: 'Marathon Runner',
    desc: 'Complete 1,000 races',
    criteria: 'Participate in 1,000 races total',
    icon: Medal,
    rarity: RARITY.EPIC,
    category: 'progress',
    target: 1000,
    check: (stats) => stats.totalRaces >= 1000
  },
  typing_veteran: {
    id: 'typing_veteran',
    title: 'Typing Veteran',
    desc: 'Reach Level 25',
    criteria: 'Accumulate enough XP to reach level 25',
    icon: Star,
    rarity: RARITY.RARE,
    category: 'progress',
    target: 25,
    check: (stats) => stats.level >= 25
  },
  typing_master: {
    id: 'typing_master',
    title: 'Typing Master',
    desc: 'Reach Level 50',
    criteria: 'Accumulate enough XP to reach level 50',
    icon: Crown,
    rarity: RARITY.EPIC,
    category: 'progress',
    target: 50,
    check: (stats) => stats.level >= 50
  },
  typing_legend: {
    id: 'typing_legend',
    title: 'Typing Legend',
    desc: 'Reach Level 100',
    criteria: 'Accumulate enough XP to reach level 100',
    icon: Ghost,
    rarity: RARITY.LEGENDARY,
    category: 'progress',
    target: 100,
    check: (stats) => stats.level >= 100
  },

  // === COMPETITIVE (5 achievements) ===
  first_victory: {
    id: 'first_victory',
    title: 'First Victory',
    desc: 'Win your first ranked match',
    criteria: 'Win any ranked or multiplayer race',
    icon: Sword,
    rarity: RARITY.COMMON,
    category: 'competitive',
    target: 1,
    check: (stats) => stats.racesWon >= 1
  },
  winning_streak: {
    id: 'winning_streak',
    title: 'Winning Streak',
    desc: 'Win 10 ranked matches in a row',
    criteria: 'Win 10 consecutive ranked races',
    icon: Flame,
    rarity: RARITY.EPIC,
    category: 'competitive',
    target: 10,
    check: (stats) => stats.winStreak >= 10
  },
  underdog: {
    id: 'underdog',
    title: 'Underdog',
    desc: 'Beat an opponent with 20+ higher avg WPM',
    criteria: 'Win against a player with significantly higher stats',
    icon: Activity,
    rarity: RARITY.RARE,
    category: 'competitive',
    target: 1,
    check: (stats) => stats.underdogWins >= 1
  },
  rank_climber: {
    id: 'rank_climber',
    title: 'Rank Climber',
    desc: 'Advance from Bronze to Silver rank',
    criteria: 'Reach Silver rank or higher',
    icon: TrendingUp,
    rarity: RARITY.RARE,
    category: 'competitive',
    target: 1,
    check: (stats) => ['Silver', 'Gold', 'Platinum', 'Diamond', 'Master'].includes(stats.rank)
  },
  elite_class: {
    id: 'elite_class',
    title: 'Elite Class',
    desc: 'Reach Gold rank or higher',
    criteria: 'Achieve Gold rank status',
    icon: Crown,
    rarity: RARITY.EPIC,
    category: 'competitive',
    target: 1,
    check: (stats) => ['Gold', 'Platinum', 'Diamond', 'Master'].includes(stats.rank)
  },

  // === SPECIAL CHALLENGES (5 achievements) ===
  night_owl: {
    id: 'night_owl',
    title: 'Night Owl',
    desc: 'Complete 25 races between midnight and 4 AM',
    criteria: 'Race during late night hours',
    icon: Moon,
    rarity: RARITY.RARE,
    category: 'special',
    target: 25,
    check: (stats) => stats.nightRaces >= 25
  },
  early_bird: {
    id: 'early_bird',
    title: 'Early Bird',
    desc: 'Complete 25 races before 8 AM',
    criteria: 'Race during early morning hours',
    icon: Sun,
    rarity: RARITY.RARE,
    category: 'special',
    target: 25,
    check: (stats) => stats.morningRaces >= 25
  },
  daily_devotee: {
    id: 'daily_devotee',
    title: 'Daily Devotee',
    desc: 'Complete daily goal 30 days in a row',
    criteria: 'Maintain a 30-day daily streak',
    icon: Calendar,
    rarity: RARITY.EPIC,
    category: 'special',
    target: 30,
    check: (stats) => stats.dailyStreak >= 30
  },
  multilingual_master: {
    id: 'multilingual_master',
    title: 'Multilingual Master',
    desc: 'Complete races in 5 different languages',
    criteria: 'Race in English, Spanish, French, German, and more',
    icon: Globe,
    rarity: RARITY.RARE,
    category: 'special',
    target: 5,
    check: (stats) => stats.languagesUsed >= 5
  },
  comeback_kid: {
    id: 'comeback_kid',
    title: 'Comeback Kid',
    desc: 'Win after being behind by 50% progress',
    criteria: 'Make a dramatic comeback victory',
    icon: Zap,
    rarity: RARITY.LEGENDARY,
    category: 'special',
    target: 1,
    check: (stats) => stats.comebackWins >= 1
  }
};

// Calculate progress for an achievement
export const calculateProgress = (achievementId, stats) => {
  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) return 0;
  
  if (achievement.check(stats)) return 100;
  
  // Calculate based on target
  let current = 0;
  switch (achievementId) {
    case 'speed_demon_1':
    case 'speed_demon_2':
    case 'speed_demon_3':
      current = stats.bestWPM || 0;
      break;
    case 'first_steps':
    case 'centurion':
    case 'marathon_runner':
      current = stats.totalRaces || 0;
      break;
    case 'typing_veteran':
    case 'typing_master':
    case 'typing_legend':
      current = stats.level || 1;
      break;
    case 'first_victory':
    case 'winning_streak':
      current = stats.racesWon || 0;
      break;
    case 'perfect_precision':
      current = stats.perfectRaces || 0;
      break;
    case 'consistency_king':
      current = stats.highAccuracyRaces || 0;
      break;
    case 'error_hunter':
      current = stats.zeroErrorRaces || 0;
      break;
    case 'daily_devotee':
      current = stats.dailyStreak || 0;
      break;
    case 'night_owl':
      current = stats.nightRaces || 0;
      break;
    case 'early_bird':
      current = stats.morningRaces || 0;
      break;
    case 'multilingual_master':
      current = stats.languagesUsed || 0;
      break;
    default:
      return achievement.check(stats) ? 100 : 0;
  }
  
  return Math.min(100, Math.round((current / achievement.target) * 100));
};

export const AchievementProvider = ({ children }) => {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState([]);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({});

  // Load user stats and achievements
  useEffect(() => {
    if (user) {
      const userStats = {
        bestWPM: user.stats?.bestWPM || 0,
        totalRaces: user.stats?.racesCompleted || 0,
        racesWon: user.stats?.racesWon || 0,
        level: user.stats?.level || 1,
        rank: user.stats?.rank || 'Bronze',
        perfectRaces: user.achievementProgress?.perfectRaces || 0,
        highAccuracyRaces: user.achievementProgress?.highAccuracyRaces || 0,
        zeroErrorRaces: user.achievementProgress?.zeroErrorRaces || 0,
        winStreak: user.achievementProgress?.winStreak || 0,
        dailyStreak: user.achievementProgress?.dailyStreak || 0,
        nightRaces: user.achievementProgress?.nightRaces || 0,
        morningRaces: user.achievementProgress?.morningRaces || 0,
        languagesUsed: user.achievementProgress?.languagesUsed || 0,
        underdogWins: user.achievementProgress?.underdogWins || 0,
        comebackWins: user.achievementProgress?.comebackWins || 0,
        personalBestStreak: user.achievementProgress?.personalBestStreak || 0,
        blindModeHighWPM: user.achievementProgress?.blindModeHighWPM || 0
      };
      setStats(userStats);
      
      if (user.achievements) {
        setUnlocked(user.achievements.map(a => a.id));
      }
    }
  }, [user]);

  const unlock = useCallback(async (id) => {
    if (!unlocked.includes(id)) {
      const newUnlocked = [...unlocked, id];
      setUnlocked(newUnlocked);
      
      const achievement = ACHIEVEMENTS[id];
      setNotification({ ...achievement, isNew: true });
      
      // Play unlock sound
      playUnlockSound();

      // Persist to backend
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/achievements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ achievementId: id })
        });
      } catch (e) {
        console.error('Failed to save achievement', e);
      }

      setTimeout(() => setNotification(null), 5000);
    }
  }, [unlocked]);

  const checkAchievements = useCallback((raceStats) => {
    // Update local stats
    setStats(prev => {
      const newStats = { ...prev };
      
      // Update basic stats
      if (raceStats.wpm > newStats.bestWPM) newStats.bestWPM = raceStats.wpm;
      newStats.totalRaces += 1;
      if (raceStats.won) newStats.racesWon += 1;
      
      // Update achievement-specific stats
      if (raceStats.accuracy === 100) newStats.perfectRaces += 1;
      if (raceStats.accuracy >= 95) newStats.highAccuracyRaces += 1;
      if (raceStats.errors === 0) newStats.zeroErrorRaces += 1;
      
      // Check all achievements
      Object.values(ACHIEVEMENTS).forEach(achievement => {
        if (achievement.check(newStats)) {
          unlock(achievement.id);
        }
      });
      
      return newStats;
    });
  }, [unlock]);

  const getProgress = useCallback((achievementId) => {
    return calculateProgress(achievementId, stats);
  }, [stats]);

  const getCategoryProgress = useCallback((category) => {
    const categoryAchievements = Object.values(ACHIEVEMENTS).filter(a => a.category === category);
    const unlockedInCategory = categoryAchievements.filter(a => unlocked.includes(a.id)).length;
    return {
      total: categoryAchievements.length,
      unlocked: unlockedInCategory,
      percentage: Math.round((unlockedInCategory / categoryAchievements.length) * 100)
    };
  }, [unlocked]);

  return (
    <AchievementContext.Provider value={{ 
      unlocked, 
      checkAchievements, 
      getProgress, 
      getCategoryProgress,
      stats,
      totalUnlocked: unlocked.length,
      totalAchievements: Object.keys(ACHIEVEMENTS).length
    }}>
      {children}
      {notification && (
        <div className="fixed bottom-8 right-8 z-50 animate-achievement-in">
          <div 
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)',
              border: `2px solid ${notification.rarity.color}`,
              boxShadow: notification.rarity.glow
            }}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
            </div>
            
            {/* Particle effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-particle"
                  style={{
                    background: notification.rarity.color,
                    left: `${20 + i * 15}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative p-6 flex items-center gap-4 min-w-[350px]">
              <div 
                className="p-4 rounded-full animate-pulse-glow"
                style={{ 
                  background: `${notification.rarity.color}20`,
                  boxShadow: notification.rarity.glow
                }}
              >
                <notification.icon className="w-10 h-10" style={{ color: notification.rarity.color }} />
              </div>
              <div className="flex-1">
                <div 
                  className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: notification.rarity.color }}
                >
                  {notification.rarity.name} Achievement Unlocked!
                </div>
                <div className="font-bold text-white text-xl mb-1">{notification.title}</div>
                <div className="text-sm text-gray-300">{notification.desc}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AchievementContext.Provider>
  );
};
