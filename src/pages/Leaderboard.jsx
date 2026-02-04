import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Zap, Target, User, Sword, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

  const PodiumItem = ({ player, position, handleChallenge }) => {
    const isFirst = position === 1;
    const isSecond = position === 2;
    const isThird = position === 3;

    let height = 'h-32';
    let color = 'bg-gray-700';
    let iconColor = 'text-base-muted';
    let glow = '';

    if (isFirst) {
      height = 'h-48';
      color = 'bg-yellow-500/20 border-yellow-500/50';
      iconColor = 'text-yellow-400';
      glow = 'shadow-[0_0_30px_rgba(234,179,8,0.3)]';
    } else if (isSecond) {
      height = 'h-40';
      color = 'bg-gray-300/20 border-gray-300/50';
      iconColor = 'text-base-content/80';
    } else if (isThird) {
      height = 'h-36';
      color = 'bg-orange-700/20 border-orange-700/50';
      iconColor = 'text-orange-500';
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: position * 0.2 }}
        className={`flex flex-col items-center justify-end ${isFirst ? '-mt-12 z-10' : ''}`}
      >
        <div className="flex flex-col items-center mb-4">
          <div className={`relative ${isFirst ? 'w-24 h-24' : 'w-20 h-20'} rounded-full border-4 ${isFirst ? 'border-yellow-500' : isSecond ? 'border-gray-300' : 'border-orange-700'} overflow-hidden mb-2 bg-base-navy`}>
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
               <User className={`w-1/2 h-1/2 ${iconColor}`} />
            </div>
            {isFirst && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Crown className="w-12 h-12 text-yellow-400 fill-current animate-bounce" />
              </div>
            )}
          </div>
          <div className="text-xl font-bold">{player.username}</div>
          <div className="text-primary font-mono font-bold text-2xl">{player.wpm} WPM</div>
        </div>
        
        <div className={`w-32 md:w-40 ${height} ${color} ${glow} border-t border-x rounded-t-lg backdrop-blur-sm flex flex-col items-center justify-center relative group`}>
           <div className={`text-4xl font-bold ${iconColor} opacity-50`}>{position}</div>
           
           <button 
             onClick={() => handleChallenge(player)}
             className="absolute -bottom-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
           >
             <Sword className="w-3 h-3" /> Challenge
           </button>
        </div>
      </motion.div>
    );
  };

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const navigate = useNavigate();

  const languages = [
    { id: 'all', label: 'All Languages' },
    { id: 'plain', label: 'Plain Text' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' },
    { id: 'rust', label: 'Rust' },
    { id: 'go', label: 'Go' },
    { id: 'java', label: 'Java' },
    { id: 'cpp', label: 'C++' }
  ];

  useEffect(() => {
    fetchLeaderboard(selectedLanguage);
  }, [selectedLanguage]);

  const fetchLeaderboard = async (lang) => {
    setLoading(true);
    try {
      const url = lang === 'all' 
        ? `${import.meta.env.VITE_API_BASE_URL}/races/leaderboard`
        : `${import.meta.env.VITE_API_BASE_URL}/races/leaderboard?language=${lang}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLeaders(data);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChallenge = (player) => {
    if (!player.textId || !player.textContent) {
      alert("This record uses a custom text or the text is no longer available.");
      return;
    }
    navigate('/play', {
      state: {
        mode: 'ghost',
        ghostProfile: {
          username: player.username,
          wpm: player.wpm,
          accuracy: player.accuracy,
          avatar: player.avatar
        },
        textId: player.textId,
        textContent: player.textContent
      }
    });
  };

  const toggleRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const calculateWinProbability = (myWpm, theirWpm) => {
    if (!myWpm) return 5; // Low chance if no stats
    const diff = myWpm - theirWpm;
    // Simple sigmoid-like probability
    const prob = 1 / (1 + Math.exp(-diff / 10));
    return Math.round(prob * 100);
  };

  const PodiumItem = ({ player, position }) => {
    const isFirst = position === 1;
    const isSecond = position === 2;
    const isThird = position === 3;

    let height = 'h-32';
    let color = 'bg-gray-700';
    let iconColor = 'text-base-muted';
    let glow = '';

    if (isFirst) {
      height = 'h-48';
      color = 'bg-yellow-500/20 border-yellow-500/50';
      iconColor = 'text-yellow-400';
      glow = 'shadow-[0_0_30px_rgba(234,179,8,0.3)]';
    } else if (isSecond) {
      height = 'h-40';
      color = 'bg-gray-300/20 border-gray-300/50';
      iconColor = 'text-base-content/80';
    } else if (isThird) {
      height = 'h-36';
      color = 'bg-orange-700/20 border-orange-700/50';
      iconColor = 'text-orange-500';
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: position * 0.2 }}
        className={`flex flex-col items-center justify-end ${isFirst ? '-mt-12 z-10' : ''}`}
      >
        <div className="flex flex-col items-center mb-4">
          <div className={`relative ${isFirst ? 'w-24 h-24' : 'w-20 h-20'} rounded-full border-4 ${isFirst ? 'border-yellow-500' : isSecond ? 'border-gray-300' : 'border-orange-700'} overflow-hidden mb-2 bg-base-navy`}>
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
               <User className={`w-1/2 h-1/2 ${iconColor}`} />
            </div>
            {isFirst && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Crown className="w-12 h-12 text-yellow-400 fill-current animate-bounce" />
              </div>
            )}
          </div>
          <div className="text-xl font-bold">{player.username}</div>
          <div className="text-primary font-mono font-bold text-2xl">{player.wpm} WPM</div>
        </div>
        
        <div className={`w-32 md:w-40 ${height} ${color} ${glow} border-t border-x rounded-t-lg backdrop-blur-sm flex flex-col items-center justify-center relative group`}>
           <div className={`text-4xl font-bold ${iconColor} opacity-50`}>{position}</div>
           
           <button 
             onClick={() => handleChallenge(player)}
             className="absolute -bottom-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
           >
             <Sword className="w-3 h-3" /> Challenge
           </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-base-dark text-base-content pt-24 pb-12 px-4">
      <Navbar />
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-hex-mesh opacity-30"></div>
        <div className="laser-beam" style={{ left: '20%', animationDelay: '0s' }}></div>
        <div className="laser-beam" style={{ left: '80%', animationDelay: '-5s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">Global <span className="text-primary-glow">Leaderboard</span></h1>
          <p className="text-base-muted text-lg mb-8">The fastest fingers in the world. Can you beat them?</p>

          {/* Language Selector */}
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedLanguage === lang.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-base-content/5 text-base-muted hover:bg-base-content/10 hover:text-base-content'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {leaders.length >= 3 && (
              <div className="flex justify-center items-end gap-4 md:gap-8 mb-20 px-4">
                <PodiumItem player={leaders[1]} position={2} handleChallenge={handleChallenge} />
                <PodiumItem player={leaders[0]} position={1} handleChallenge={handleChallenge} />
                <PodiumItem player={leaders[2]} position={3} handleChallenge={handleChallenge} />
              </div>
            )}

            <div className="glass-card rounded-2xl border border-base-content/5 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-6 border-b border-base-content/10 text-base-muted font-medium text-sm uppercase tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2 text-center">WPM</div>
                <div className="col-span-2 text-center">Accuracy</div>
                <div className="col-span-3 text-right">Action</div>
              </div>

              {leaders.slice(leaders.length >= 3 ? 3 : 0).map((player, index) => {
                const isExpanded = expandedRow === player._id;
                const myStats = user?.stats || { bestWPM: 0 };
                const winProb = calculateWinProbability(myStats.bestWPM, player.wpm);

                return (
                  <React.Fragment key={player._id}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleRow(player._id)}
                      className={`grid grid-cols-12 gap-4 p-6 border-b border-base-content/5 items-center cursor-pointer transition-colors group ${isExpanded ? 'bg-base-content/5' : 'hover:bg-base-content/5'}`}
                    >
                      <div className="col-span-1 text-center font-bold text-base-muted">
                        {leaders.length >= 3 ? index + 4 : index + 1}
                      </div>
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-base-navy border border-base-content/10 flex items-center justify-center text-base-muted">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-base-content">{player.username}</div>
                          <div className="text-xs text-base-muted flex items-center gap-1">
                             {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                             details
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="font-mono font-bold text-xl text-primary">{player.wpm}</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className={`font-bold ${player.accuracy >= 98 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {player.accuracy}%
                        </span>
                      </div>
                      <div className="col-span-3 flex justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleChallenge(player); }}
                          className="opacity-0 group-hover:opacity-100 transition-all bg-base-content/10 hover:bg-white/20 hover:text-primary text-base-content px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold border border-base-content/5"
                        >
                          <Sword className="w-4 h-4" />
                          Challenge
                        </button>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="col-span-12 overflow-hidden bg-base-navy/30 border-b border-base-content/5"
                        >
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-base-muted font-bold mb-4 flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4" /> Head-to-Head
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Your Best WPM</span>
                                            <span className="text-base-content font-bold">{myStats.bestWPM}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div 
                                                className="bg-green-500 h-2 rounded-full" 
                                                style={{ width: `${Math.min((myStats.bestWPM / 200) * 100, 100)}%` }} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Opponent WPM</span>
                                            <span className="text-base-content font-bold">{player.wpm}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div 
                                                className="bg-red-500 h-2 rounded-full" 
                                                style={{ width: `${Math.min((player.wpm / 200) * 100, 100)}%` }} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center border-l border-base-content/10 pl-8">
                                <div className="text-base-muted text-sm mb-2 uppercase tracking-widest">Win Probability</div>
                                <div className={`text-5xl font-bold ${winProb > 50 ? 'text-green-400' : 'text-red-400'}`}>
                                    {winProb}%
                                </div>
                                <div className="text-xs text-base-muted mt-2">
                                    {winProb > 50 ? "You're favored to win!" : "This will be a tough race."}
                                </div>
                                <button
                                  onClick={() => handleChallenge(player)}
                                  className="mt-6 w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Sword className="w-4 h-4" /> Start Challenge
                                </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}

              {leaders.length === 0 && (
                 <div className="p-12 text-center text-base-muted">
                   No races recorded yet. Be the first to claim the throne!
                 </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
