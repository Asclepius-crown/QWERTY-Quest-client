import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trophy, Zap, Target, Shield, Crown, Flame, Users, Ghost, Code, Keyboard, Monitor, Clock, Sword } from 'lucide-react';
import { useAuth } from './AuthContext';

const AchievementContext = createContext();

export const useAchievements = () => useContext(AchievementContext);

export const ACHIEVEMENTS = {
  // Solo Mode
  'speed_demon': { id: 'speed_demon', title: 'Overclocked', desc: 'Reach 80 WPM in Solo Mode', icon: Zap, mode: 'solo' },
  'surgeon': { id: 'surgeon', title: 'Surgeon', desc: '100% Accuracy in Solo Mode', icon: Target, mode: 'solo' },
  'marathon': { id: 'marathon', title: 'Marathon', desc: 'Complete a 60s race', icon: Clock, mode: 'solo' },

  // GitHub Mode
  'hello_world': { id: 'hello_world', title: 'Hello World', desc: 'Complete first GitHub race', icon: Code, mode: 'github' },
  'clean_compile': { id: 'clean_compile', title: 'Clean Compile', desc: '100% Accuracy in GitHub Mode', icon: Shield, mode: 'github' },

  // Chaos Mode
  'entropy_survivor': { id: 'entropy_survivor', title: 'Entropy Survivor', desc: '>90% Accuracy in Chaos Mode', icon: Flame, mode: 'chaos' },
  'chaos_lord': { id: 'chaos_lord', title: 'Chaos Lord', desc: 'Win a Chaos Mode race with >60 WPM', icon: Crown, mode: 'chaos' },

  // Multiplayer
  'first_blood': { id: 'first_blood', title: 'First Blood', desc: 'Win a Multiplayer race', icon: Sword, mode: 'quick-race' },
  'uplink': { id: 'uplink', title: 'Uplink Established', desc: 'Play a Multiplayer match', icon: Users, mode: 'quick-race' },

  // General
  'newbie': { id: 'newbie', title: 'Script Kiddie', desc: 'Complete your first race', icon: Keyboard, mode: 'all' },
};

export const AchievementProvider = ({ children }) => {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user?.achievements) {
      const newIds = user.achievements.map(a => a.id);
      setUnlocked(prev => {
        if (prev.length === newIds.length && prev.every((val, index) => val === newIds[index])) {
          return prev;
        }
        return newIds;
      });
    }
  }, [user]);

  const unlock = async (id) => {
    if (!unlocked.includes(id)) {
      setUnlocked(prev => [...prev, id]);
      
      const achievement = ACHIEVEMENTS[id];
      setNotification(achievement);
      
      // Play sound
      try {
        const audio = new Audio('/sounds/achievement.mp3'); // Needs a file, or synthetic
        // Synthetic fallback
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) { console.error(e); }

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

      setTimeout(() => setNotification(null), 4000);
    }
  };

  const checkAchievements = (stats) => {
    // General
    unlock('newbie');

    // Solo
    if (stats.mode === 'solo') {
      if (stats.wpm >= 80) unlock('speed_demon');
      if (stats.accuracy === 100) unlock('surgeon');
      if (stats.duration >= 60) unlock('marathon');
    }

    // GitHub
    if (stats.mode === 'github') {
      unlock('hello_world');
      if (stats.accuracy === 100) unlock('clean_compile');
    }

    // Chaos
    if (stats.mode === 'chaos') {
      if (stats.accuracy >= 90) unlock('entropy_survivor');
      if (stats.wpm >= 60) unlock('chaos_lord');
    }

    // Multiplayer
    if (stats.mode === 'quick-race') {
      unlock('uplink');
      if (stats.rank === 1) unlock('first_blood'); // Assuming rank is passed
    }
  };

  return (
    <AchievementContext.Provider value={{ unlocked, checkAchievements }}>
      {children}
      {notification && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce-in">
          <div className="bg-base-navy/90 backdrop-blur-md border border-primary/50 p-4 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-4 min-w-[300px]">
            <div className="p-3 bg-primary/20 rounded-full text-primary">
              <notification.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-widest">Achievement Unlocked</div>
              <div className="font-bold text-white text-lg">{notification.title}</div>
              <div className="text-xs text-base-muted">{notification.desc}</div>
            </div>
          </div>
        </div>
      )}
    </AchievementContext.Provider>
  );
};
