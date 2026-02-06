import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Lock, Zap, AlertTriangle, Eye, EyeOff, 
  Terminal, AlertOctagon, Skull, ChevronRight, Clock, Users
} from 'lucide-react';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const RankedLobby = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [socket, setSocket] = useState(null);
  const [searchTime, setSearchTime] = useState(0);
  const [matchFound, setMatchFound] = useState(false);
  const [error, setError] = useState(null);

  // Determine Rank Tier based on ELO
  const currentRank = user?.stats?.rank || 'Bronze';
  const currentElo = user?.stats?.elo || 1000;
  
  const protocols = {
    'Bronze': {
      level: 1,
      name: 'Public Access',
      color: 'text-orange-500',
      border: 'border-orange-500',
      bg: 'bg-orange-500/10',
      icon: Shield,
      modifiers: [],
      desc: 'Standard security. No active countermeasures.'
    },
    'Silver': {
      level: 2,
      name: 'Restricted',
      color: 'text-gray-400',
      border: 'border-gray-400',
      bg: 'bg-gray-400/10',
      icon: Lock,
      modifiers: [{ id: 'dim', name: 'Visual Noise', desc: 'Text contrast reduced by 30%', icon: EyeOff }],
      desc: 'Low-level visual interference detected.'
    },
    'Gold': {
      level: 3,
      name: 'Confidential',
      color: 'text-yellow-400',
      border: 'border-yellow-400',
      bg: 'bg-yellow-400/10',
      icon: AlertTriangle,
      modifiers: [{ id: 'fog', name: 'Data Fog', desc: 'Upcoming text is obscured', icon: Eye }],
      desc: 'Predictive algorithms disabled. Visibility limited.'
    },
    'Diamond': {
      level: 4,
      name: 'Top Secret',
      color: 'text-cyan-400',
      border: 'border-cyan-400',
      bg: 'bg-cyan-400/10',
      icon: Terminal,
      modifiers: [
        { id: 'code', name: 'Polymorphic', desc: 'Complex code syntax mixed in', icon: Terminal },
        { id: 'fog', name: 'Data Fog', desc: 'Upcoming text is obscured', icon: Eye }
      ],
      desc: 'Encryption protocols active. Syntax complexity increased.'
    },
    'Master': {
      level: 5,
      name: 'Black Ops',
      color: 'text-purple-500',
      border: 'border-purple-500',
      bg: 'bg-purple-500/10',
      icon: AlertOctagon,
      modifiers: [
        { id: 'no_backspace', name: 'Hardcore', desc: 'Backspace disabled', icon: AlertOctagon },
        { id: 'code', name: 'Polymorphic', desc: 'Complex code syntax mixed in', icon: Terminal }
      ],
      desc: 'Zero tolerance policy. Error correction disabled.'
    },
    'Apex': {
      level: 6,
      name: 'Kernel Level',
      color: 'text-red-600',
      border: 'border-red-600',
      bg: 'bg-red-600/10',
      icon: Skull,
      modifiers: [
        { id: 'permadeath', name: 'Sudden Death', desc: '3 Errors = Instant Fail', icon: Skull },
        { id: 'chaos', name: 'Chaos Mode', desc: 'All countermeasures active', icon: Zap }
      ],
      desc: 'God-level security. Survival probability: < 1%.'
    }
  };

  const activeProtocol = protocols[currentRank] || protocols['Bronze'];

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
      withCredentials: true
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to ranked queue');
      // Register user
      newSocket.emit('register', user?._id || user?.id);
    });

    newSocket.on('race-matched', (data) => {
      console.log('Ranked match found:', data);
      setMatchFound(true);
      
      // Navigate to play with ranked match data
      setTimeout(() => {
        navigate('/play', { 
          state: { 
            mode: 'ranked',
            raceId: data.raceId,
            text: data.text,
            participants: data.participants,
            startTime: data.startTime,
            modifiers: activeProtocol.modifiers.map(m => m.id),
            rank: currentRank,
            elo: currentElo
          } 
        });
      }, 1000);
    });

    newSocket.on('waiting-for-opponent', (data) => {
      console.log('Waiting for opponent...');
      setIsSearching(true);
    });

    newSocket.on('ranked-queue-error', (data) => {
      console.error('Ranked queue error:', data);
      setError(data.message);
      setIsSearching(false);
    });

    newSocket.on('left-ranked-queue', () => {
      setIsSearching(false);
      setSearchTime(0);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [user]);

  // Search timer
  useEffect(() => {
    let interval;
    if (isSearching && !matchFound) {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSearching, matchFound]);

  const handleStartBreach = () => {
    if (!socket) return;
    
    setError(null);
    socket.emit('join-ranked-queue', { userId: user?._id || user?.id });
  };

  const handleCancelSearch = () => {
    if (!socket) return;
    
    socket.emit('leave-ranked-queue', { userId: user?._id || user?.id });
    setIsSearching(false);
    setSearchTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-base-dark text-base-content font-sans overflow-hidden relative">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 pointer-events-none ${activeProtocol.bg.replace('/10', '/30')}`}></div>

      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col items-center justify-center relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center"
        >
          {/* Left: Rank Identity */}
          <div className="text-center md:text-left space-y-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${activeProtocol.border} ${activeProtocol.bg} ${activeProtocol.color} font-mono text-sm uppercase tracking-widest`}>
              <activeProtocol.icon className="w-4 h-4" />
              Security Clearance: {activeProtocol.level}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-base-content to-base-muted/50">
              {currentRank}
            </h1>
            
            <p className="text-xl text-base-muted max-w-md">
              Current protocol: <span className={`${activeProtocol.color} font-bold`}>{activeProtocol.name}</span>.
              <br/>
              {activeProtocol.desc}
            </p>

            {/* ELO Display */}
            <div className="flex items-center gap-4 text-base-muted">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-mono text-lg">{currentElo} ELO</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Action Button */}
            <div className="pt-8 space-y-4">
              {!isSearching ? (
                <button
                  onClick={handleStartBreach}
                  disabled={!socket}
                  className={`group relative px-8 py-5 w-full md:w-auto bg-base-content text-base-dark font-bold text-xl rounded-none clip-path-slant overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100`}
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <>
                      INITIATE BREACH <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  </span>
                  {/* Button Glitch Effect */}
                  <div className={`absolute inset-0 ${activeProtocol.bg.replace('/10', '')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                </button>
              ) : matchFound ? (
                <div className="flex items-center gap-3 text-green-400">
                  <Users className="w-6 h-6 animate-bounce" />
                  <span className="font-bold text-lg">OPPONENT FOUND!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-base-dark/50 rounded-xl border border-base-content/10">
                    <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                    <div className="flex-1">
                      <div className="text-sm text-base-muted">SEARCHING FOR OPPONENT</div>
                      <div className="text-xs text-base-muted/50">Skill-based matchmaking active</div>
                    </div>
                    <div className="font-mono text-xl text-yellow-400">
                      <Clock className="w-4 h-4 inline mr-2" />
                      {formatTime(searchTime)}
                    </div>
                  </div>
                  <button
                    onClick={handleCancelSearch}
                    className="px-6 py-3 text-sm font-bold text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-all"
                  >
                    CANCEL SEARCH
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: I.C.E. Protocols (Modifiers) */}
          <div className={`glass-card p-1 rounded-2xl border ${activeProtocol.border} relative overflow-hidden`}>
             <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
             
             {/* Header */}
             <div className={`p-4 ${activeProtocol.bg} border-b ${activeProtocol.border} flex justify-between items-center`}>
                <span className={`font-mono font-bold ${activeProtocol.color} flex items-center gap-2`}>
                   <Shield className="w-5 h-5" /> ACTIVE COUNTERMEASURES
                </span>
                <span className="text-xs font-mono text-base-muted animate-pulse">SYSTEM_LOCKED</span>
             </div>

             {/* Modifiers List */}
             <div className="p-6 space-y-4">
                {activeProtocol.modifiers.length > 0 ? (
                  activeProtocol.modifiers.map((mod, idx) => (
                    <motion.div 
                      key={mod.id}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.2 }}
                      className="flex items-start gap-4 p-4 bg-base-dark/50 rounded-xl border border-base-content/5 group hover:border-red-500/50 transition-colors"
                    >
                       <div className={`p-3 rounded-lg ${activeProtocol.bg} ${activeProtocol.color}`}>
                          <mod.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className={`font-bold text-lg ${activeProtocol.color}`}>{mod.name}</h4>
                          <p className="text-sm text-base-muted">{mod.desc}</p>
                       </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-base-muted/50 font-mono">
                     NO ACTIVE THREATS DETECTED
                     <br/>
                     <span className="text-xs">Standard typing protocols apply.</span>
                  </div>
                )}
             </div>

             {/* Footer Warning */}
             <div className="p-4 bg-black/20 text-center text-xs font-mono text-base-muted border-t border-base-content/5">
                WARNING: UNAUTHORIZED ACCESS ATTEMPT WILL BE LOGGED.
             </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default RankedLobby;
