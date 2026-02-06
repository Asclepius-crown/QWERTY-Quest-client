import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Trophy, Zap, Target, Award, Clock, 
  Share2, Shield, Crown, Flame, Activity, BarChart2, Keyboard, 
  ArrowUp, History, Filter, Grid3X3, List, Lock, Unlock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useAchievements, ACHIEVEMENTS, RARITY } from '../contexts/AchievementContext';
import Navbar from '../components/Navbar';
import NeuralHeatmap from '../components/NeuralHeatmap';
import AchievementCard from '../components/AchievementCard';
import { getUserAvatarDisplay, isCustomAvatar } from '../config/avatars';

const Profile = () => {
  const { user } = useAuth();
  const { unlocked, getProgress, getCategoryProgress, totalUnlocked, totalAchievements } = useAchievements();
  const [activeTab, setActiveTab] = useState('overview');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState('wpm'); // 'wpm' or 'accuracy'
  
  // Achievement filter states
  const [achievementFilter, setAchievementFilter] = useState('all'); // 'all', 'unlocked', 'locked'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'speed', 'precision', 'progress', 'competitive', 'special'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const avatarDisplay = getUserAvatarDisplay(user);
  const isCustom = isCustomAvatar(user?.avatar);
  
  // Filter achievements
  const filteredAchievements = Object.values(ACHIEVEMENTS).filter(achievement => {
    const isUnlocked = unlocked.includes(achievement.id);
    
    // Filter by lock status
    if (achievementFilter === 'unlocked' && !isUnlocked) return false;
    if (achievementFilter === 'locked' && isUnlocked) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) return false;
    
    return true;
  });
  
  // Category definitions
  const categories = [
    { id: 'all', label: 'All', icon: Grid3X3 },
    { id: 'speed', label: 'Speed', icon: Zap },
    { id: 'precision', label: 'Precision', icon: Target },
    { id: 'progress', label: 'Progress', icon: Trophy },
    { id: 'competitive', label: 'Competitive', icon: Crown },
    { id: 'special', label: 'Special', icon: Award }
  ];

  // Fetch History logic from Dashboard
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/races/history`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data.races.reverse());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Calculate trends
  const calculateTrend = (key) => {
    if (history.length < 2) return 0;
    const last10 = history.slice(-10);
    const firstHalf = last10.slice(0, 5);
    const secondHalf = last10.slice(5);
    
    const getValue = (race, k) => race.participants?.[0]?.[k] || 0;
    
    const avgFirst = firstHalf.reduce((acc, curr) => acc + getValue(curr, key), 0) / firstHalf.length || 0;
    const avgSecond = secondHalf.reduce((acc, curr) => acc + getValue(curr, key), 0) / secondHalf.length || 0;
    
    return ((avgSecond - avgFirst)).toFixed(1);
  };

  const wpmTrend = calculateTrend('wpm');
  const accTrend = calculateTrend('accuracy');

  // Chart Data
  const chartData = history.map((race, idx) => ({
    name: `Race ${idx + 1}`,
    wpm: race.participants?.[0]?.wpm || 0,
    accuracy: race.participants?.[0]?.accuracy || 0
  }));

  return (
    <div className="min-h-screen bg-base-dark text-base-content font-sans">
      <Navbar />
      
      {/* 1. Player Banner Header */}
      <div className="relative pt-20">
        {/* Banner Image */}
        <div className="h-64 w-full bg-gradient-to-r from-blue-900 via-purple-900 to-base-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-base-dark to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative -mt-20">
            <div className="flex flex-col md:flex-row items-end md:items-center gap-6 pb-6 border-b border-base-content/10">
                {/* Avatar */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-base-dark border-4 border-base-dark relative z-10 shadow-2xl">
                    <div className="w-full h-full rounded-xl flex items-center justify-center border border-base-content/10 overflow-hidden bg-base-content/5">
                        <img 
                           src={avatarDisplay.imageSrc} 
                           alt={avatarDisplay.name}
                           className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-yellow-500 text-base-dark font-bold px-3 py-1 rounded-full text-sm border-4 border-base-dark">
                        Lvl {user?.stats?.level || 1}
                    </div>
                    
                    {/* Avatar name badge */}
                    <div className="absolute -top-2 -left-2 bg-base-dark border border-base-content/10 px-2 py-1 rounded-lg shadow-lg">
                        <span className="text-xs font-bold text-base-content">{avatarDisplay.name}</span>
                    </div>
                </div>

                {/* Identity */}
                <div className="flex-1 mb-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-base-content">{user?.username || 'Player'}</h1>
                            <div className="px-2 py-1 bg-base-content/5 border border-base-content/10 rounded font-mono text-sm text-primary-glow flex items-center gap-2">
                                <span className="text-[10px] text-base-muted uppercase font-sans tracking-widest">Net-ID</span>
                                {user?.netId || '###-###'}
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                            Precision Specialist
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-base-muted text-sm">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Global</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Quick Race
                    </button>
                    <button className="p-2 bg-base-content/5 hover:bg-base-content/10 border border-base-content/10 rounded-lg text-base-content transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Rank (Fixed) */}
        <div className="space-y-8">
            {/* Rank Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-2xl border border-base-content/5 bg-gradient-to-br from-white/5 to-transparent"
            >
                <h3 className="text-base-muted text-xs font-bold uppercase tracking-widest mb-4">Competitive Rank</h3>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-base-content">{user?.stats?.rank || 'Bronze'} I</div>
                        <div className="text-sm text-base-muted">Top 15% Global</div>
                    </div>
                </div>
                {/* XP Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-base-muted">
                        <span>Current XP</span>
                        <span>{user?.stats?.xp || 0} / 5000</span>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[70%]"></div>
                    </div>
                    <p className="text-xs text-center text-base-muted mt-2">Win 3 more matches to rank up</p>
                </div>
            </motion.div>

            {/* Daily Challenge */}
            <div className="glass-card p-6 rounded-2xl border border-base-content/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Daily Goal</h3>
                <span className="text-xs bg-base-content/10 px-2 py-1 rounded">12h left</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-base-content/5 rounded-lg">
                    <Keyboard className="w-5 h-5 text-base-muted" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Type 1,000 Words</div>
                    <div className="w-full h-1.5 bg-base-content/10 rounded-full mt-2">
                      <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legacy Archive (Achievements) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-2xl border border-base-content/5"
            >
                {/* Header with Progress */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-base-muted text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            Legacy Archive
                        </h3>
                        <span className="text-xs text-primary font-bold">
                            {totalUnlocked} / {totalAchievements} Unlocked
                        </span>
                    </div>
                    
                    {/* Overall Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Total Completion</span>
                            <span className="text-primary font-bold">
                                {Math.round((totalUnlocked / totalAchievements) * 100)}%
                            </span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EAB308)'
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(totalUnlocked / totalAchievements) * 100}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-1 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => {
                        const CatIcon = cat.icon;
                        const progress = getCategoryProgress(cat.id);
                        const isActive = categoryFilter === cat.id;
                        
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setCategoryFilter(cat.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                    isActive
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700/50'
                                }`}
                            >
                                <CatIcon className="w-3.5 h-3.5" />
                                <span>{cat.label}</span>
                                {cat.id !== 'all' && (
                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                                        isActive ? 'bg-primary/30' : 'bg-slate-700'
                                    }`}>
                                        {progress.unlocked}/{progress.total}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Filter Controls */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAchievementFilter('all')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                achievementFilter === 'all'
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Grid3X3 className="w-3.5 h-3.5" />
                            All
                        </button>
                        <button
                            onClick={() => setAchievementFilter('unlocked')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                achievementFilter === 'unlocked'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'text-slate-400 hover:text-green-400'
                            }`}
                        >
                            <Unlock className="w-3.5 h-3.5" />
                            Unlocked
                        </button>
                        <button
                            onClick={() => setAchievementFilter('locked')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                achievementFilter === 'locked'
                                    ? 'bg-slate-600 text-slate-300 border border-slate-500'
                                    : 'text-slate-400 hover:text-slate-300'
                            }`}
                        >
                            <Lock className="w-3.5 h-3.5" />
                            Locked
                        </button>
                    </div>
                    
                    <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded transition-all ${
                                viewMode === 'grid' ? 'bg-slate-600 text-white' : 'text-slate-400'
                            }`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded transition-all ${
                                viewMode === 'list' ? 'bg-slate-600 text-white' : 'text-slate-400'
                            }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Achievements Grid */}
                <motion.div 
                    layout
                    className={viewMode === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin"
                        : "space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin"
                    }
                >
                    <AnimatePresence mode="popLayout">
                        {filteredAchievements.map((achievement) => (
                            <motion.div
                                key={achievement.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <AchievementCard
                                    achievement={achievement}
                                    progress={getProgress(achievement.id)}
                                    isUnlocked={unlocked.includes(achievement.id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredAchievements.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No achievements match your filters</p>
                        <button
                            onClick={() => {
                                setAchievementFilter('all');
                                setCategoryFilter('all');
                            }}
                            className="mt-3 text-xs text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </motion.div>
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-base-content/10">
                {['Overview', 'Matches', 'Inventory'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                            activeTab === tab.toLowerCase() 
                            ? 'text-primary border-b-2 border-primary' 
                            : 'text-base-muted hover:text-base-content'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <AnimatePresence mode='wait'>
                {activeTab === 'overview' && (
                    <motion.div 
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* 1. Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard 
                                icon={Zap} 
                                label="Avg WPM" 
                                value={user?.stats?.avgWPM || 0} 
                                trend={wpmTrend} 
                                color="text-yellow-400" 
                                trendLabel="recent avg"
                            />
                            <StatCard 
                                icon={Target} 
                                label="Accuracy" 
                                value={user?.stats?.avgWPM ? '98%' : '0%'} 
                                trend={accTrend} 
                                color="text-green-400" 
                                trendLabel="recent avg"
                            />
                            <StatCard 
                                icon={Trophy} 
                                label="Win Rate" 
                                value="64%" 
                                trend="+2.1" 
                                color="text-orange-400" 
                                trendLabel="this week"
                            />
                            <StatCard 
                                icon={BarChart2} 
                                label="Races" 
                                value={user?.stats?.racesWon || 0} 
                                sub="Matches"
                                color="text-blue-400" 
                            />
                        </div>

                        {/* 2. Performance Graph */}
                        <div className="glass-card p-6 rounded-2xl border border-base-content/5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" /> Performance History
                                </h3>
                                <div className="flex gap-2">
                                <button
                                  onClick={() => setChartMetric('wpm')}
                                  className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
                                    chartMetric === 'wpm'
                                      ? 'bg-primary/20 text-primary border-primary/20'
                                      : 'bg-base-content/5 text-base-muted border-base-content/10 hover:bg-base-content/10'
                                  }`}
                                >
                                  Speed
                                </button>
                                <button
                                  onClick={() => setChartMetric('accuracy')}
                                  className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
                                    chartMetric === 'accuracy'
                                      ? 'bg-green-500/20 text-green-400 border-green-500/20'
                                      : 'bg-base-content/5 text-base-muted border-base-content/10 hover:bg-base-content/10'
                                  }`}
                                >
                                  Accuracy
                                </button>
                                </div>
                            </div>
                            <div className="h-64 w-full min-h-[250px]">
                                {history.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                            <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                                            </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="name" hide />
                                            <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip 
                                            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                            />
                                            <Area 
                                              type="monotone" 
                                              dataKey={chartMetric} 
                                              stroke={chartMetric === 'wpm' ? '#3B82F6' : '#22C55E'} 
                                              strokeWidth={3} 
                                              fillOpacity={1} 
                                              fill={chartMetric === 'wpm' ? 'url(#colorWpm)' : 'url(#colorAcc)'} 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-base-muted italic border border-dashed border-base-content/10 rounded-xl">
                                        Insufficient data to generate performance graph.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Neural Heatmap */}
                        <NeuralHeatmap />
                    </motion.div>
                )}

                {activeTab === 'matches' && (
                    <motion.div
                        key="matches"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="glass-card rounded-2xl border border-base-content/5 overflow-hidden">
                            <div className="p-6 border-b border-base-content/5 flex justify-between items-center">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                <History className="w-5 h-5 text-base-muted" /> Recent Matches
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                <thead className="bg-base-content/5 text-xs uppercase text-base-muted">
                                    <tr>
                                    <th className="px-6 py-4">Result</th>
                                    <th className="px-6 py-4">WPM</th>
                                    <th className="px-6 py-4">Accuracy</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.slice().reverse().map((race, idx) => (
                                    <tr key={idx} className="hover:bg-base-content/5 transition-colors">
                                        <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 text-green-400 font-bold text-xs bg-green-500/10 px-2 py-1 rounded">
                                            <Trophy className="w-3 h-3" /> VICTORY
                                        </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-base-content">{race.participants?.[0]?.wpm || 0}</td>
                                        <td className="px-6 py-4 text-base-content/80">{race.participants?.[0]?.accuracy || 0}%</td>
                                        <td className="px-6 py-4 text-base-muted text-sm">{new Date(race.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                        <button className="text-xs bg-base-content/10 hover:bg-white/20 text-base-content px-3 py-1 rounded transition-colors">
                                            Replay
                                        </button>
                                        </td>
                                    </tr>
                                    ))}
                                    {history.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-base-muted italic">
                                        No matches played yet.
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color, trendLabel, sub }) => (
  <div className="glass-card p-5 rounded-2xl border border-base-content/5 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-base-content/5 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className={`text-xs font-bold flex items-center ${Number(trend) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {Number(trend) >= 0 ? <ArrowUp className="w-3 h-3" /> : null}
          {trend}%
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold text-base-content">{value}</div>
      <div className="text-xs text-base-muted uppercase tracking-wider mt-1">{label}</div>
      {(trendLabel || sub) && (
        <div className="text-[10px] text-base-muted mt-1">{trendLabel || sub}</div>
      )}
    </div>
  </div>
);

const ActionButton = ({ to, icon: Icon, label, color }) => (
  <Link 
    to={to}
    className="flex items-center gap-3 w-full p-3 rounded-xl bg-base-content/5 hover:bg-base-content/10 border border-base-content/5 transition-all group"
  >
    <div className={`p-2 rounded-lg text-base-content shadow-lg ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-4 h-4" />
    </div>
    <span className="font-medium text-gray-200 group-hover:text-base-content">{label}</span>
  </Link>
);

export default Profile;
