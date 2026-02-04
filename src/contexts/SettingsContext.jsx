import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const defaultSettings = {
  // Gameplay
  defaultMode: 'Ranked',
  countdownLength: '3 Seconds',
  autoJoin: true,
  liveWpm: true,
  crossPlatform: true,
  preferredRegion: 'Auto (Best Latency)',

  // Typing
  layout: 'QWERTY',
  language: 'English',
  fontFamily: 'JetBrains Mono',
  fontSize: 'Medium',
  highlightMistakes: true,
  caretAnimation: true,
  caretStyle: 'Block',

  // Appearance
  theme: 'Midnight',
  accentColor: 'Electric Blue',
  backgroundAnimations: true,
  glowIntensity: true,
  reducedMotion: false,

  // Audio
  masterVolume: 80,
  sfxVolume: 100,
  musicVolume: 40,
  keystrokeSounds: true,
  errorSounds: true,
  musicEnabled: true,
  voiceAlerts: 'Standard',

  // Notifications
  matchInvites: true,
  friendRequests: true,
  systemAlerts: true,
  emailSummaries: false,
  pushNotifications: true,

  // Privacy
  profileVisibility: 'Public',
  showOnlineStatus: true,
  allowChallenges: true,

  // Advanced
  showFps: false,
  showNetwork: false,
  debugInfo: false,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('typemaster_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-midnight', 'theme-neon', 'theme-light');
    root.classList.add(`theme-${theme.toLowerCase()}`);
    
    // Apply theme-specific CSS variables
    const themeColors = {
      'Dark': {
        '--primary': '#3b82f6',
        '--primary-hover': '#2563eb',
        '--base-dark': '#0f172a',
        '--base-navy': '#1e293b',
        '--base-content': '#e2e8f0',
        '--base-muted': '#94a3b8'
      },
      'Midnight': {
        '--primary': '#8b5cf6',
        '--primary-hover': '#7c3aed',
        '--base-dark': '#0a0a0a',
        '--base-navy': '#171717',
        '--base-content': '#fafafa',
        '--base-muted': '#a1a1aa'
      },
      'Neon': {
        '--primary': '#10b981',
        '--primary-hover': '#059669',
        '--base-dark': '#0c0c0c',
        '--base-navy': '#1a1a1a',
        '--base-content': '#f0fdf4',
        '--base-muted': '#86efac'
      },
      'Light': {
        '--primary': '#0ea5e9',
        '--primary-hover': '#0284c7',
        '--base-dark': '#ffffff',
        '--base-navy': '#f8fafc',
        '--base-content': '#1e293b',
        '--base-muted': '#64748b'
      }
    };
    
    const colors = themeColors[theme] || themeColors['Dark'];
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  useEffect(() => {
    localStorage.setItem('typemaster_settings', JSON.stringify(settings));
    applyTheme(settings.theme);
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};