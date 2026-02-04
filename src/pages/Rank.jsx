import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, TrendingUp, Calendar, Shield, Crown, Medal, Lock, ChevronRight, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const ranks = [
  { id: 'bronze', name: 'Bronze', color: 'text-orange-700', border: 'border-orange-700', bg: 'bg-orange-900/20', shadow: 'shadow-orange-900/50', minXp: 0, reward: 'Basic Badge' },
  { id: 'silver', name: 'Silver', color: 'text-base-content/80', border: 'border-gray-400', bg: 'bg-gray-700/20', shadow: 'shadow-gray-500/50', minXp: 1000, reward: 'Silver Frame' },
  { id: 'gold', name: 'Gold', color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-600/20', shadow: 'shadow-yellow-500/50', minXp: 3000, reward: 'Gold Glow' },
  { id: 'platinum', name: 'Platinum', color: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-600/20', shadow: 'shadow-cyan-500/50', minXp: 6000, reward: 'Neon Trail' },
  { id: 'diamond', name: 'Diamond', color: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-600/20', shadow: 'shadow-purple-500/50', minXp: 10000, reward: 'Diamond Icon' },
  { id: 'apex', name: 'Apex', color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-600/20', shadow: 'shadow-red-500/50', minXp: 20000, reward: 'Legendary Status' }
];

const Rank = () => {
  const { user } = useAuth();
  const currentXp = user?.stats?.xp || 0;
  
  // Find current and next rank
  const currentRankIndex = ranks.findIndex((r, i) => currentXp >= r.minXp && (i === ranks.length - 1 || currentXp < ranks[i+1].minXp));
  const currentRank = ranks[currentRankIndex];
  const nextRank = ranks[currentRankIndex + 1];
  
  // XP Progress
  const rankStart = currentRank.minXp;
  const rankEnd = nextRank ? nextRank.minXp : rankStart * 1.5; // Cap if max rank
  const progress = Math.min(((currentXp - rankStart) / (rankEnd - rankStart)) * 100, 100);

  return (
    <div className="min-h-screen bg-base-dark text-base-content font-sans">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* 1. Rank Identity Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 relative"
          >
            {/* Glow Effect */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${currentRank.bg} blur-[100px] rounded-full opacity-50`}></div>
            
            <div className="relative z-10">
                <div className={`inline-flex p-6 rounded-full ${currentRank.bg} border-4 ${currentRank.border} mb-6 shadow-2xl ${currentRank.shadow}`}>
                    <Trophy className={`w-20 h-20 ${currentRank.color}`} />
                </div>
                <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter ${currentRank.color} drop-shadow-lg`}>
                    {currentRank.name} <span className="text-base-content text-4xl align-top">II</span>
                </h1>
                <p className="text-xl text-base-muted mt-2 font-mono">Global Rank #12,430 • Top 15%</p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 2. XP Progression Panel */}
                <div className="glass-card p-8 rounded-2xl border border-base-content/5 bg-gradient-to-r from-base-navy/50 to-transparent">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-sm text-base-muted uppercase tracking-widest font-bold">Current Progression</span>
                            <div className="text-2xl font-mono font-bold text-base-content mt-1">
                                {currentXp} <span className="text-base-muted text-lg">/ {rankEnd} XP</span>
                            </div>
                        </div>
                        <div className="text-green-400 font-bold text-sm bg-green-500/10 px-2 py-1 rounded">
                            +24 XP Last Match
                        </div>
                    </div>
                    
                    <div className="relative w-full h-4 bg-black/50 rounded-full overflow-hidden mb-2">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full ${currentRank.bg.replace('/20', '')} ${currentRank.color.replace('text-', 'bg-')} shadow-[0_0_20px_currentColor]`}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-base-muted font-bold uppercase tracking-wider">
                        <span>{currentRank.name}</span>
                        <span>{nextRank ? nextRank.name : 'Max Rank'}</span>
                    </div>
                </div>

                {/* 3. Rank Ladder View */}
                <div className="glass-card p-8 rounded-2xl border border-base-content/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" /> Competitive Ladder
                    </h3>
                    <div className="space-y-4">
                        {ranks.map((rank, idx) => {
                            const isUnlocked = idx <= currentRankIndex;
                            const isCurrent = idx === currentRankIndex;
                            
                            return (
                                <div 
                                    key={rank.id}
                                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                        isCurrent 
                                        ? `${rank.bg} ${rank.border} shadow-lg` 
                                        : 'bg-base-content/5 border-base-content/5 opacity-50'
                                    }`}
                                >
                                    <div className={`p-2 rounded-full ${rank.bg} ${isUnlocked ? rank.color : 'text-base-muted'}`}>
                                        {isUnlocked ? <Medal className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className={`font-bold ${isUnlocked ? 'text-base-content' : 'text-base-muted'}`}>{rank.name}</span>
                                            <span className="text-xs font-mono text-base-muted">{rank.minXp} XP</span>
                                        </div>
                                        <div className="text-xs text-base-muted mt-1">
                                            Reward: {rank.reward}
                                        </div>
                                    </div>
                                    {isCurrent && (
                                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg transform translate-x-1/2">
                                            YOU
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
                
                {/* 4. Performance Rating */}
                <div className="glass-card p-6 rounded-2xl border border-base-content/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-400" /> Rating Breakdown
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Speed Rating', val: 'S+', color: 'text-yellow-400' },
                            { label: 'Accuracy', val: 'A', color: 'text-green-400' },
                            { label: 'Consistency', val: 'B+', color: 'text-blue-400' },
                            { label: 'Impact', val: 'S', color: 'text-purple-400' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex justify-between items-center p-3 bg-base-content/5 rounded-lg">
                                <span className="text-sm text-base-muted">{stat.label}</span>
                                <span className={`font-bold font-mono text-xl ${stat.color}`}>{stat.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Season Info */}
                <div className="glass-card p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" /> Season 1: Genesis
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <div className="text-center p-4 bg-base-content/5 rounded-xl border border-base-content/10">
                            <div className="text-2xl font-bold text-base-content">14 Days</div>
                            <div className="text-xs text-base-muted uppercase tracking-widest">Remaining</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs text-base-muted font-bold uppercase">Season Reward</div>
                            <div className="flex items-center gap-3 p-3 bg-base-content/5 rounded-lg border border-base-content/10">
                                <Crown className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <div className="text-sm font-bold text-base-content">Genesis Emblem</div>
                                    <div className="text-xs text-base-muted">Reach Gold Tier</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Rank History */}
                <div className="glass-card p-6 rounded-2xl border border-base-content/5">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-base-muted" /> History
                    </h3>
                    <div className="space-y-4 pl-2 border-l-2 border-base-content/10">
                        {[
                            { event: 'Promoted to Silver', date: '2 days ago', type: 'up' },
                            { event: 'Placement Complete', date: '1 week ago', type: 'neutral' },
                        ].map((item, idx) => (
                            <div key={idx} className="relative pl-4">
                                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-base-dark ${item.type === 'up' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                <div className="text-sm font-bold text-base-content">{item.event}</div>
                                <div className="text-xs text-base-muted">{item.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rank;
