import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, Trophy, Target, ArrowRight, Crown, Sword, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [champion, setChampion] = useState(null);
  const [feed, setFeed] = useState([]);
  const [stats, setStats] = useState({
    onlinePlayers: 0,
    totalRaces: 0,
    countries: 0,
    matchmakingTime: 0.02
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch leaderboard
    fetch(`${import.meta.env.VITE_API_BASE_URL}/races/leaderboard`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setChampion(data[0]);
          setFeed(data.slice(0, 10));
        }
      })
      .catch(err => console.error(err));

    // Fetch statistics
    fetch(`${import.meta.env.VITE_API_BASE_URL}/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setStatsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        setStatsLoading(false);
      });
  }, []);

  const handleDethrone = () => {
    if (!champion) return;
    navigate('/play', {
      state: {
        mode: 'ghost',
        ghostProfile: {
          username: champion.username,
          wpm: champion.wpm,
          accuracy: champion.accuracy,
          avatar: champion.avatar
        },
        textId: champion.textId,
        textContent: champion.textContent
      }
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col pt-20 overflow-hidden bg-base-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <div className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          {/* Left Content */}
          <div className="text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-content/5 border border-base-content/10 text-primary-glow text-sm font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {statsLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${stats.onlinePlayers.toLocaleString()} player${stats.onlinePlayers !== 1 ? 's' : ''} online now`
              )}
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              Race against <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-cyan text-glow">
                the world.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base-muted text-lg md:text-xl max-w-xl leading-relaxed"
            >
              Improve your typing speed, compete in real-time, track WPM & accuracy, and climb the global ranks.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={() => navigate('/play')}
                className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all flex items-center justify-center gap-2 group"
              >
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Quick Race
              </button>
              <button className="px-8 py-4 bg-base-content/5 hover:bg-base-content/10 text-base-content border border-base-content/10 rounded-xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Create Room
              </button>
            </motion.div>

            {/* Mini Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-8 pt-8 border-t border-base-content/5"
            >
              <div>
                <div className="text-2xl font-bold text-base-content">
                  {statsLoading ? '...' : `${stats.countries}+`}
                </div>
                <div className="text-sm text-base-muted uppercase tracking-wider">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-base-content">
                  {statsLoading ? '...' : `${(stats.totalRaces / 1000).toFixed(1)}K+`}
                </div>
                <div className="text-sm text-base-muted uppercase tracking-wider">Races Run</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-base-content">
                  {statsLoading ? '...' : `${stats.matchmakingTime}s`}
                </div>
                <div className="text-sm text-base-muted uppercase tracking-wider">Matchmaking</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Throne Room Widget */}
          <div className="relative w-full lg:block mt-12 lg:mt-0">
             {/* Abstract Decoration */}
             <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent-purple/30 rounded-full blur-3xl opacity-50 animate-pulse hidden lg:block"></div>

             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="relative z-10"
             >
                {/* Main Card */}
                {champion ? (
                  <div className="glass-card rounded-2xl p-8 border border-yellow-500/30 w-full max-w-md mx-auto lg:ml-auto lg:mr-0 transform lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-500 shadow-[0_0_50px_rgba(234,179,8,0.15)]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                         <div className="flex items-center gap-2 text-yellow-500 mb-1">
                            <Crown className="w-5 h-5 fill-current" />
                            <span className="font-bold tracking-widest text-xs uppercase">Current Champion</span>
                         </div>
                         <h3 className="text-3xl font-bold text-base-content">{champion.username}</h3>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 p-[2px]">
                         <div className="w-full h-full rounded-full bg-base-dark flex items-center justify-center">
                            <span className="text-2xl">👑</span>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-base-content/5 rounded-xl p-4 border border-base-content/5">
                        <div className="text-base-muted text-xs uppercase mb-1">Top Speed</div>
                        <div className="text-3xl font-mono font-bold text-primary-glow">{champion.wpm}</div>
                        <div className="text-xs text-base-muted">Words Per Min</div>
                      </div>
                      <div className="bg-base-content/5 rounded-xl p-4 border border-base-content/5">
                        <div className="text-base-muted text-xs uppercase mb-1">Accuracy</div>
                        <div className="text-3xl font-mono font-bold text-green-400">{champion.accuracy}%</div>
                        <div className="text-xs text-base-muted">Precision</div>
                      </div>
                    </div>

                    <button 
                      onClick={handleDethrone}
                      className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 group transition-all"
                    >
                      <Sword className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Dethrone Champion
                    </button>
                    <p className="text-center text-xs text-base-muted mt-4">
                      Can you beat {champion.wpm} WPM? Prove it.
                    </p>
                  </div>
                ) : (
                  // Loading / Empty State
                  <div className="glass-card rounded-2xl p-8 border border-base-content/10 w-full max-w-md mx-auto lg:ml-auto lg:mr-0">
                    <div className="animate-pulse space-y-4">
                       <div className="h-8 bg-base-content/10 rounded w-1/2"></div>
                       <div className="h-32 bg-base-content/5 rounded"></div>
                       <div className="h-12 bg-primary/20 rounded"></div>
                    </div>
                  </div>
                )}
             </motion.div>
          </div>
        </div>
      </div>

      {/* Live Ticker Footer */}
      <div className="h-12 bg-base-navy border-t border-base-content/5 flex items-center overflow-hidden relative z-20">
         <div className="px-4 bg-primary/20 h-full flex items-center font-bold text-xs uppercase tracking-widest text-primary border-r border-base-content/10 z-10">
            <TrendingUp className="w-4 h-4 mr-2" /> Live Feed
         </div>
         <div className="flex-1 overflow-hidden relative">
            <motion.div 
               animate={{ x: ["0%", "-100%"] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="flex items-center gap-12 whitespace-nowrap absolute top-1/2 -translate-y-1/2"
            >
               {[...feed, ...feed].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-2 text-sm text-base-muted">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="font-bold text-base-content">{item.username}</span>
                    <span>just hit</span>
                    <span className="text-primary font-mono font-bold">{item.wpm} WPM</span>
                    <span className="text-xs opacity-50">on {item.textTitle}</span>
                 </div>
               ))}
               {feed.length === 0 && (
                 <span className="text-base-muted italic">Waiting for new records...</span>
               )}
            </motion.div>
         </div>
      </div>
    </div>
  );
};

export default Hero;
