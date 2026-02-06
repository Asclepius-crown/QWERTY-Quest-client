import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, TrendingUp, Calendar, Shield, Crown, Medal, Lock, ChevronRight, Award, Activity, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const ranks = [
  { id: 'bronze', name: 'Bronze', color: 'text-orange-700', border: 'border-orange-700', bg: 'bg-orange-900/20', shadow: 'shadow-orange-900/50', minElo: 0, reward: 'Basic Badge' },
  { id: 'silver', name: 'Silver', color: 'text-base-content/80', border: 'border-gray-400', bg: 'bg-gray-700/20', shadow: 'shadow-gray-500/50', minElo: 1150, reward: 'Silver Frame' },
  { id: 'gold', name: 'Gold', color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-600/20', shadow: 'shadow-yellow-500/50', minElo: 1300, reward: 'Gold Glow' },
  { id: 'platinum', name: 'Platinum', color: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-600/20', shadow: 'shadow-cyan-500/50', minElo: 1500, reward: 'Neon Trail' },
  { id: 'diamond', name: 'Diamond', color: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-600/20', shadow: 'shadow-purple-500/50', minElo: 1750, reward: 'Diamond Icon' },
  { id: 'apex', name: 'Apex', color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-600/20', shadow: 'shadow-red-500/50', minElo: 2000, reward: 'Legendary Status' }
];

const Rank = () => {
  const { user } = useAuth();
  const [rankedStats, setRankedStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch ranked stats
  useEffect(() => {
    const fetchRankedStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/ranked-stats`, {
          credentials: 'include'
        });
        if (response.ok) {
          const stats = await response.json();
          setRankedStats(stats);
        }
      } catch (err) {
        console.error('Failed to fetch ranked stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRankedStats();
  }, []);
  
  const currentElo = rankedStats?.elo || user?.stats?.elo || 1000;
  const currentRankName = rankedStats?.rank || user?.stats?.rank || 'Bronze';
  
  // Find current and next rank
  const currentRankIndex = ranks.findIndex(r => r.name === currentRankName);
  const currentRank = ranks[currentRankIndex] || ranks[0];
  const nextRank = ranks[currentRankIndex - 1]; // Higher index = lower rank in our array
  
  // ELO Progress
  const rankStart = currentRank.minElo;
  const rankEnd = nextRank ? nextRank.minElo : rankStart + 250; // Cap if max rank
  const progress = Math.min(((currentElo - rankStart) / (rankEnd - rankStart)) * 100, 100);

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
                    {currentRank.name}
                </h1>
                <div className="flex items-center justify-center gap-6 mt-2">
                    <p className="text-xl text-base-muted font-mono flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        {currentElo} ELO
                    </p>
                    {rankedStats?.highestElo > currentElo && (
                        <p className="text-sm text-base-muted/60">
                            Peak: {rankedStats.highestElo}
                        </p>
                    )}
                </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 2. ELO Progression Panel */}
                <div className="glass-card p-8 rounded-2xl border border-base-content/5 bg-gradient-to-r from-base-navy/50 to-transparent">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-sm text-base-muted uppercase tracking-widest font-bold">ELO Rating</span>
                            <div className="text-2xl font-mono font-bold text-base-content mt-1">
                                {currentElo} <span className="text-base-muted text-lg">/ {nextRank ? nextRank.minElo : '∞'} ELO</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-green-400 font-bold text-sm bg-green-500/10 px-2 py-1 rounded">
                                {rankedStats?.winRate || 0}% Win Rate
                            </div>
                            <div className="text-xs text-base-muted mt-1">
                                {rankedStats?.rankedWins || 0}W - {rankedStats?.rankedLosses || 0}L - {rankedStats?.rankedDraws || 0}D
                            </div>
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
                        <span>{currentRank.name} ({rankStart} ELO)</span>
                        <span>{nextRank ? `${nextRank.name} (${nextRank.minElo} ELO)` : 'Max Rank'}</span>
                    </div>
                </div>

                {/* 3. Rank Ladder View */}
                <div className="glass-card p-8 rounded-2xl border border-base-content/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" /> Competitive Ladder
                    </h3>
                    <div className="space-y-4">
                        {ranks.map((rank, idx) => {
                            const isUnlocked = currentElo >= rank.minElo;
                            const isCurrent = rank.name === currentRankName;
                            
                            return (
                                <div 
                                    key={rank.id}
                                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                        isCurrent 
                                        ? `${rank.bg} ${rank.border} shadow-lg` 
                                        : isUnlocked
                                            ? 'bg-base-content/5 border-base-content/10'
                                            : 'bg-base-content/5 border-base-content/5 opacity-50'
                                    }`}
                                >
                                    <div className={`p-2 rounded-full ${rank.bg} ${isUnlocked ? rank.color : 'text-base-muted'}`}>
                                        {isUnlocked ? <Medal className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className={`font-bold ${isUnlocked ? 'text-base-content' : 'text-base-muted'}`}>{rank.name}</span>
                                            <span className="text-xs font-mono text-base-muted">{rank.minElo} ELO</span>
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
                        <BarChart3 className="w-5 h-5 text-green-400" /> Ranked Statistics
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Total Matches', val: rankedStats?.totalRankedMatches || 0, color: 'text-blue-400' },
                            { label: 'Wins', val: rankedStats?.rankedWins || 0, color: 'text-green-400' },
                            { label: 'Losses', val: rankedStats?.rankedLosses || 0, color: 'text-red-400' },
                            { label: 'Draws', val: rankedStats?.rankedDraws || 0, color: 'text-yellow-400' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex justify-between items-center p-3 bg-base-content/5 rounded-lg">
                                <span className="text-sm text-base-muted">{stat.label}</span>
                                <span className={`font-bold font-mono text-xl ${stat.color}`}>{stat.val}</span>
                            </div>
                        ))}
                        <div className="pt-2 border-t border-base-content/10">
                            <div className="flex justify-between items-center p-3">
                                <span className="text-sm text-base-muted">Win Rate</span>
                                <span className={`font-bold font-mono text-2xl ${(rankedStats?.winRate || 0) >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {rankedStats?.winRate || 0}%
                                </span>
                            </div>
                        </div>
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
