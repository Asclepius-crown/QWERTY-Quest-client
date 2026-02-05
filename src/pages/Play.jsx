import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Play as PlayIcon, RotateCcw, Trophy, Zap, Target, Clock, Users, User, Keyboard, Sword, Github, Code, Skull } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAchievements } from '../contexts/AchievementContext';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

const Play = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { checkAchievements } = useAchievements();
  const location = useLocation();
  const controls = useAnimation();
  
  // I.C.E. Protocol Modifiers
  const modifiers = location.state?.modifiers || [];
  const isDim = modifiers.includes('dim');
  const isFog = modifiers.includes('fog');
  const isNoBackspace = modifiers.includes('no_backspace');
  const isPermadeath = modifiers.includes('permadeath');

  const [mode, setMode] = useState(location.state?.mode || 'solo');
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(60);
  const [gameState, setGameState] = useState('waiting');
  const [text, setText] = useState(location.state?.textContent || '');
  const [textId, setTextId] = useState(location.state?.textId || null);
  const [language, setLanguage] = useState('plain');
  const [customText, setCustomText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [raceId, setRaceId] = useState(null);
  const [opponents, setOpponents] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [raceHistory, setRaceHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [chaosEffect, setChaosEffect] = useState(null);
  const [raceResults, setRaceResults] = useState(null);

  // Ghost & Shadow Racing
  const [ghostIndex, setGhostIndex] = useState(0);
  const historyRef = useRef([]);
  const opponentsRef = useRef({}); // Store latest server data for interpolation

  const inputRef = useRef(null);
  const audioContextRef = useRef(null);

  // Chaos Mode Logic
  useEffect(() => {
    let timeout;
    if (gameState === 'active' && mode === 'chaos') {
      const triggerChaos = () => {
        const effects = [
          { name: 'BLUR', class: 'blur-sm scale-95 opacity-50 duration-1000' },
          { name: 'SHAKE', class: 'animate-bounce text-red-500' },
          { name: 'FLIP', class: 'scale-y-[-1] text-purple-400' },
          { name: 'PULSE', class: 'animate-pulse contrast-200 brightness-150' },
          { name: 'DIM', class: 'brightness-0 opacity-20' }
        ];
        
        // 30% chance to trigger an effect every 3 seconds
        if (Math.random() > 0.4) {
          const effect = effects[Math.floor(Math.random() * effects.length)];
          setChaosEffect(effect);
          
          // Clear effect after 2-4 seconds
          setTimeout(() => setChaosEffect(null), 2000 + Math.random() * 2000);
        }
        
        timeout = setTimeout(triggerChaos, 3000);
      };
      
      triggerChaos();
    } else {
      setChaosEffect(null);
    }
    return () => clearTimeout(timeout);
  }, [gameState, mode]);

  const getAtmosphereClass = () => {
    if (gameState !== 'active') return 'bg-base-dark';
    if (!settings.backgroundAnimations) return 'bg-base-dark';
    
    if (wpm > 80) return 'bg-gradient-to-br from-red-900/20 via-base-dark to-orange-900/20';
    if (wpm > 40) return 'bg-gradient-to-br from-purple-900/20 via-base-dark to-blue-900/20';
    return 'bg-base-dark';
  };

  // Game Loop: Ghost & Optimistic UI
  useEffect(() => {
    let animationFrameId;
    
    const updateGame = () => {
      if (gameState === 'active' && startTime) {
        const now = Date.now();
        const elapsedSec = (now - startTime) / 1000;

        // 1. Shadow/Ghost Logic (Constant Speed based on target WPM)
        // Default target: User avg or 60 WPM
        const targetWpm = user?.stats?.avgWPM || 60; 
        const targetCharsPerSec = (targetWpm * 5) / 60;
        const projectedGhostIndex = Math.floor(targetCharsPerSec * elapsedSec);
        setGhostIndex(Math.min(projectedGhostIndex, text.length));

        // 2. Optimistic UI for Opponents
        setOpponents(prevOpponents => {
          if (prevOpponents.length === 0) return prevOpponents;

          return prevOpponents.map(op => {
            const realData = opponentsRef.current[op.userId];
            if (!realData) return op;

            // If ghost bot, use local calculation
            if (op.isGhost) return op; 

            // Interpolate
            const timeSinceUpdate = (now - realData.lastUpdate) / 1000; // seconds
            // Predicted chars added = WPM * 5 chars/word / 60 sec/min * seconds
            const predictedChars = (realData.wpm * 5 / 60) * timeSinceUpdate;
            const newIndex = Math.min(Math.floor(realData.currentIndex + predictedChars), text.length);
            
            // Don't let it jump backwards or go too far ahead of reality (max 10 chars ahead of server)
            const clampedIndex = Math.max(op.currentIndex, Math.min(newIndex, realData.currentIndex + 15));
            
            return { ...op, currentIndex: clampedIndex };
          });
        });
      }
      animationFrameId = requestAnimationFrame(updateGame);
    };

    animationFrameId = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, startTime, text.length, user?.stats?.avgWPM]);

  const inputVariants = {
    shake: { x: [-10, 10, -10, 10, 0], borderColor: '#ef4444', transition: { duration: 0.3 } },
    pulse: { scale: [1, 1.02, 1], borderColor: '#22c55e', boxShadow: '0 0 20px rgba(34,197,94,0.3)', transition: { duration: 0.1 } },
    normal: { scale: 1, x: 0, borderColor: 'rgba(255,255,255,0.1)' }
  };

  useEffect(() => {
    if (location.state?.mode === 'ghost') {
      setMode('ghost');
      setText(location.state.textContent);
      setTextId(location.state.textId);
      setOpponents([{
        userId: 'ghost-bot',
        username: location.state.ghostProfile.username,
        wpm: location.state.ghostProfile.wpm,
        accuracy: location.state.ghostProfile.accuracy,
        currentIndex: 0,
        isGhost: true
      }]);
    }
  }, [location.state]);

  useEffect(() => {
    let interval;
    if (gameState === 'active' && mode === 'ghost' && startTime) {
      const ghostWpm = location.state?.ghostProfile?.wpm || 60;
      const charsPerMinute = ghostWpm * 5;
      const charsPerSecond = charsPerMinute / 60;
      
      interval = setInterval(() => {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const expectedChars = Math.floor(charsPerSecond * elapsedSeconds);
        
        setOpponents(prev => prev.map(op => {
          if (op.isGhost) {
            return {
              ...op,
              currentIndex: Math.min(expectedChars, text.length)
            };
          }
          return op;
        }));

        if (expectedChars >= text.length) {
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, mode, startTime, text.length, location.state]);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioContextRef.current = new AudioContext();
        }
      } catch (e) {
        console.error('Web Audio API not supported', e);
      }
    }
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume().catch(console.error);
    }
    return audioContextRef.current;
  };

  const playKeySound = () => {
    if (!settings.keystrokeSounds) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(800 + (streak * 10), ctx.currentTime);
      oscillator.frequency.setValueAtTime(600 + (streak * 10), ctx.currentTime + 0.1);
      
      const volume = (settings.sfxVolume / 100) * 0.1;
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.error('Error playing key sound', e);
    }
  };

  const playCompleteSound = () => {
    if (!settings.musicEnabled) return; // Using musicEnabled for victory sound as generic audio toggle
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(523, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      
      const volume = (settings.sfxVolume / 100) * 0.1;
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error('Error playing complete sound', e);
    }
  };

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_BASE_URL.replace('/api', ''), {
      withCredentials: true
    });
    setSocket(newSocket);

    newSocket.on('waiting-for-opponent', () => {
      setGameState('matching');
    });

    newSocket.on('race-matched', (data) => {
      setRaceId(data.raceId);
      setText(data.text);
      setOpponents(data.participants.filter(p => p.userId !== user?.id));
      setGameState('countdown');
      const countdownMs = parseInt(settings.countdownLength) * 1000 || 3000;
      setTimeout(() => {
        setGameState('active');
        setStartTime(Date.now());
      }, data.startTime - Date.now()); // Using server time diff, but could override for local practice
    });

    newSocket.on('opponent-progress', (data) => {
      // Update Ref for Optimistic UI base
      opponentsRef.current[data.userId] = {
          ...data,
          lastUpdate: Date.now()
      };
      
      // Also update state directly to ensure we have the latest 'hard' data point
      setOpponents(prev => prev.map(o =>
        o.userId === data.userId ? { ...o, wpm: data.wpm, accuracy: data.accuracy } : o
      ));
    });

    newSocket.on('race-results', (data) => {
      setRaceResults(data);
      setGameState('completed');
    });

    return () => newSocket.disconnect();
  }, [user?.id, settings.countdownLength]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/races/history`, {
        credentials: 'include'
      });
      if (response.ok) {
        const races = await response.json();
        setRaceHistory(races.races);
        setShowHistory(true);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    let interval = null;
    if (gameState === 'active' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setGameState('completed');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('completed');
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (startTime && currentIndex > 0) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      const calculatedWpm = Math.round((currentIndex / 5) / timeElapsed);
      const calculatedAccuracy = Math.round(((currentIndex - errors) / currentIndex) * 100);
      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);

      if (raceId && socket && user) {
        socket.emit('race-progress', {
          raceId,
          userId: user.id,
          currentIndex,
          wpm: calculatedWpm,
          accuracy: calculatedAccuracy
        });
      }
    }
  }, [currentIndex, errors, startTime, raceId, socket, user]);

  const saveResults = React.useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      const timeTaken = 60 - timeLeft;
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/races`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          textId,
          wpm: wpm || 0,
          accuracy: accuracy || 0,
          errors,
          timeTaken,
          replayData: historyRef.current
        })
      });

      checkAchievements({
        mode,
        wpm: wpm || 0,
        accuracy: accuracy || 0,
        duration: 60 - timeLeft
      });

    } catch (err) {
      console.error('Failed to save results:', err);
    }
  }, [user, timeLeft, textId, wpm, accuracy, errors, mode, checkAchievements]);

  useEffect(() => {
    if (gameState === 'completed' && user) {
      if (mode === 'solo' || mode === 'github') {
        saveResults();
      } else if (mode === 'quick-race' && raceId && socket && user) {
        const timeTaken = 60 - timeLeft;
        socket.emit('race-finished', {
          raceId,
          userId: user.id,
          wpm: wpm || 0,
          accuracy: accuracy || 0,
          errors,
          timeTaken,
          replayData: historyRef.current
        });
      }
    }
  }, [gameState, mode, raceId, socket, user, wpm, accuracy, errors, timeLeft, saveResults]);

  const startGame = async () => {
    setUserInput('');
    setCurrentIndex(0);
    setErrors(0);
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setStreak(0);
    setChaosEffect(null);
    
    if (mode !== 'ghost') {
      setOpponents([]);
    }

    if (mode === 'solo' || mode === 'chaos') {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/texts/random?difficulty=${difficulty}`);
        if (!response.ok) throw new Error('Failed to fetch text');
        const data = await response.json();
        setText(data.text.content);
        setTextId(data.text._id);
        setLanguage('plain');
        setGameState('active');
        setStartTime(Date.now());
      } catch (err) {
        console.error(err);
        alert('Failed to load text. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'github') {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/texts/github`);
        if (!response.ok) throw new Error('Failed to fetch GitHub code');
        const data = await response.json();
        setText(data.text.content);
        setTextId(data.text._id);
        setLanguage(data.text.language || 'javascript');
        setGameState('active');
        setStartTime(Date.now());
      } catch (err) {
        console.error(err);
        alert('Failed to load GitHub code. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'ghost') {
      if (location.state?.ghostProfile) {
        setOpponents([{
          userId: 'ghost-bot',
          username: location.state.ghostProfile.username,
          wpm: location.state.ghostProfile.wpm,
          accuracy: location.state.ghostProfile.accuracy,
          currentIndex: 0,
          isGhost: true
        }]);
      }
      setGameState('active');
      setStartTime(Date.now());
    } else if (mode === 'quick-race') {
      if (user && socket) {
        socket.emit('join-queue', { userId: user.id });
      } else {
        alert('Please log in to play multiplayer races');
        return;
      }
    } else if (mode === 'custom') {
      if (customText.trim().length < 10) {
        alert('Please enter at least 10 characters for custom text.');
        return;
      }
      setText(customText.trim());
      setTextId(null);
      setLanguage('plain');
      setGameState('active');
      setStartTime(Date.now());
    }
  };

  const handleKeyDown = (e) => {
    if (isNoBackspace && e.key === 'Backspace') {
      e.preventDefault();
      controls.start('shake');
    }
  };

  const handleInputChange = (e) => {
    if (gameState !== 'active') return;

    const value = e.target.value;
    
    // Prevent deletion if no_backspace is active (for non-keyboard events)
    if (isNoBackspace && value.length < userInput.length) {
        return; 
    }

    const lastChar = value.slice(-1);

    if (lastChar === text[currentIndex]) {
      playKeySound();
      let nextIndex = currentIndex + 1;
      let nextUserInput = value;

      // Auto-indentation logic
      if (lastChar === '\n' && (mode === 'github' || language !== 'plain')) {
          // Check if next characters are whitespace and skip them automatically
          let i = nextIndex;
          while (i < text.length && (text[i] === ' ' || text[i] === '\t')) {
              i++;
          }
          if (i > nextIndex) {
              const indentation = text.substring(nextIndex, i);
              nextIndex = i;
              nextUserInput += indentation;
          }
      }

      // Record History
      if (startTime) {
        historyRef.current.push({
            time: Date.now() - startTime,
            index: nextIndex
        });
      }

      setCurrentIndex(nextIndex);
      setUserInput(nextUserInput);
      setStreak(prev => prev + 1);
      
      if (settings.caretAnimation) {
        controls.start('pulse');
      }

      if (nextIndex >= text.length) {
        setGameState('completed');
        playCompleteSound();
      }
    } else if (value.length > userInput.length) {
      if (settings.errorSounds) {
        // We could add a specific error sound here, currently only visual
      }
      
      const newErrors = errors + 1;
      setErrors(newErrors);
      
      if (isPermadeath && newErrors >= 3) {
          setGameState('completed'); // Or failed state if supported
          alert('SYSTEM FAILURE: Permadeath Protocol Triggered (3 Errors).');
          return;
      }

      setUserInput(value);
      setStreak(0);
      if (settings.caretAnimation) {
        controls.start('shake');
      }
    } else {
      setUserInput(value);
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setUserInput('');
    setCurrentIndex(0);
    setErrors(0);
    setStartTime(null);
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setRaceId(null);
    setOpponents([]);
    setStreak(0);
    setChaosEffect(null);
    setGhostIndex(0);
    setRaceResults(null);
    historyRef.current = [];
    opponentsRef.current = {};
  };

  const renderText = () => {
    if (language !== 'plain' && language !== '') {
        // Highlighting logic
        const tokens = Prism.tokenize(text, Prism.languages[language] || Prism.languages.javascript);
        
        let charIndex = 0;
        const result = [];

        const processToken = (token, type) => {
            if (typeof token === 'string') {
                for (let char of token) {
                    const idx = charIndex++;
                    let className = 'text-base-muted';
                    let style = {};
                    
                    // Prism color mapping (simplified)
                    if (type) {
                        // We rely on CSS classes from Prism theme
                        className = `token ${type}`;
                    }

                    if (idx < currentIndex) {
                        className = idx < userInput.length && userInput[idx] === char ? 'text-green-400 font-bold' : 'text-red-400 bg-red-900/20';
                    } else if (idx === currentIndex) {
                        className = 'bg-primary/50 text-white animate-pulse';
                    } else if (idx === ghostIndex) {
                        // Ghost Cursor
                        className = 'bg-purple-500/50 text-white border-b-2 border-purple-400';
                    }

                    // Fog Modifier
                    if (isFog && idx > currentIndex + 8) {
                        className += ' blur-[4px] opacity-30';
                    }

                    result.push(
                        <span key={idx} className={className} style={{ fontSize: settings.fontSize === 'Large' ? '1.5rem' : '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
                            {char === '\n' ? '↵\n' : char}
                        </span>
                    );
                }
            } else if (Array.isArray(token)) {
                token.forEach(t => processToken(t, type));
            } else {
                processToken(token.content, token.type);
            }
        };

        tokens.forEach(token => processToken(token));
        return result;
    }

    return text.split('').map((char, index) => {
      let className = 'text-base-muted';
      if (index < currentIndex) {
        className = index < userInput.length && userInput[index] === char ? 'text-green-400' : 'text-red-400';
      } else if (index === currentIndex) {
        className = 'bg-primary/50 text-white';
      } else if (index === ghostIndex) {
        className = 'bg-purple-500/50 text-white border-b-2 border-purple-400';
      }
      
      if (settings.highlightMistakes && index < userInput.length && userInput[index] !== char) {
         className = 'text-red-500 bg-red-900/20'; // Enhanced error highlight
      }

      // Fog Modifier
      if (isFog && index > currentIndex + 8) {
          className += ' blur-[4px] opacity-50 transition-all duration-300';
      }

      return (
        <span key={index} className={className} style={{ fontSize: settings.fontSize === 'Large' ? '1.5rem' : '1.25rem', fontFamily: settings.fontFamily }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${getAtmosphereClass()} text-base-content ${isDim ? 'opacity-80 saturate-50' : ''}`}>
      <Navbar />
      {/* Background Effects */}
      {settings.backgroundAnimations && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute bottom-0 w-full h-[50vh] bg-retro-grid"></div>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`
              }}
            />
          ))}
        </div>
      )}

      <div className="pt-20 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {location.state?.mode === 'ranked' ? (
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">I.C.E. BREACH IN PROGRESS</span>
              ) : (
                 <>Start Your <span className="text-primary-glow">Typing Race</span></>
              )}
            </h1>
            <p className="text-base-muted text-lg">Test your speed and accuracy against the clock</p>
          </motion.div>

          {gameState === 'waiting' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-2xl border border-base-content/5 text-center"
            >
              <h2 className="text-2xl font-bold mb-6">Choose Your Race Mode</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <button
                  onClick={() => setMode('solo')}
                  className={`p-4 rounded-xl border transition-all touch-manipulation ${mode === 'solo' ? 'border-primary bg-primary/20' : 'border-base-content/10 hover:border-base-content/20'}`}
                >
                  <User className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold">Solo</div>
                </button>
                <button
                  onClick={() => setMode('github')}
                  className={`p-4 rounded-xl border transition-all touch-manipulation ${mode === 'github' ? 'border-primary bg-primary/20' : 'border-base-content/10 hover:border-base-content/20'}`}
                >
                  <Github className="w-8 h-8 mx-auto mb-2 text-white" />
                  <div className="font-bold">GitHub</div>
                </button>
                <button
                  onClick={() => setMode('quick-race')}
                  className={`p-4 rounded-xl border transition-all touch-manipulation ${mode === 'quick-race' ? 'border-primary bg-primary/20' : 'border-base-content/10 hover:border-base-content/20'}`}
                >
                  <Users className="w-8 h-8 mx-auto mb-2 text-accent-purple" />
                  <div className="font-bold">Multiplayer</div>
                </button>
                <button
                  onClick={() => setMode('custom')}
                  className={`p-4 rounded-xl border transition-all touch-manipulation ${mode === 'custom' ? 'border-primary bg-primary/20' : 'border-base-content/10 hover:border-base-content/20'}`}
                >
                  <Keyboard className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="font-bold">Custom</div>
                </button>
                <button
                  onClick={() => setMode('chaos')}
                  className={`p-4 rounded-xl border transition-all touch-manipulation ${mode === 'chaos' ? 'border-red-500 bg-red-900/20' : 'border-base-content/10 hover:border-base-content/20'}`}
                >
                  <Skull className="w-8 h-8 mx-auto mb-2 text-red-500 animate-pulse" />
                  <div className="font-bold text-red-400">Chaos</div>
                </button>
              </div>

              {(mode === 'solo' || mode === 'quick-race' || mode === 'github' || mode === 'chaos') && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-base-content/80 mb-1">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-3 bg-base-content/5 border border-base-content/10 rounded-xl text-base-content focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-base-content/80 mb-1">Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full p-3 bg-base-content/5 border border-base-content/10 rounded-xl text-base-content focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      >
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                        <option value={120}>2 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'custom' && (
                <div className="mb-6 text-left">
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Enter your custom text:</label>
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Type or paste your custom text here..."
                    className="w-full p-4 bg-base-content/5 border border-base-content/10 rounded-xl text-base-content placeholder-gray-500 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[100px] resize-y"
                  />
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  disabled={loading || (mode === 'custom' && customText.trim().length < 10)}
                  className="px-8 py-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-base-content rounded-xl font-bold text-xl shadow-lg transition-all flex items-center gap-3"
                >
                  <PlayIcon className="w-6 h-6" />
                  {loading ? 'Loading...' : mode === 'quick-race' ? 'Find Match' : mode === 'github' ? 'Fetch Code' : mode === 'chaos' ? 'Start Chaos' : 'Start Race'}
                </button>
                <button
                  onClick={fetchHistory}
                  className="px-6 py-4 bg-base-content/10 hover:bg-white/20 text-base-content rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  History
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'matching' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-2xl border border-base-content/5 text-center"
            >
              <h2 className="text-2xl font-bold mb-6">Finding Opponent...</h2>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-base-muted mt-4">Please wait while we match you with another player</p>
            </motion.div>
          )}

          {gameState === 'countdown' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-2xl border border-base-content/5 text-center"
            >
              <h2 className="text-3xl font-bold mb-6">Race Starting!</h2>
              <div className="text-6xl font-bold text-primary mb-4">3</div>
              <p className="text-base-muted">Get ready to type...</p>
            </motion.div>
          )}

          {(gameState === 'active' || gameState === 'completed') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-xl border border-base-content/5 text-center">
                  <Zap className={`w-6 h-6 text-yellow-400 mx-auto mb-2`} />
                  <div className="text-2xl font-bold">{wpm}</div>
                  <div className="text-sm text-base-muted">WPM</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-base-content/5 text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{accuracy}%</div>
                  <div className="text-sm text-base-muted">Accuracy</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-base-content/5 text-center">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{timeLeft}s</div>
                  <div className="text-sm text-base-muted">Time Left</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-base-content/5 text-center">
                  <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round((currentIndex / text.length) * 100)}%</div>
                  <div className="text-sm text-base-muted">Progress</div>
                </div>
              </div>

              {/* Language Indicator */}
              {language !== 'plain' && (
                  <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                      <Code className="w-4 h-4" />
                      {language.toUpperCase()} MODE
                  </div>
              )}

              {/* Opponents */}
              {opponents.length > 0 && settings.liveWpm && ( // Respect liveWpm setting
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opponents.map((opponent, idx) => (
                    <div key={opponent.userId} className="glass-card p-4 rounded-xl border border-base-content/5">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-base-muted" />
                        <span className="font-medium">{opponent.displayName || opponent.username || `Opponent ${idx + 1}`}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="font-bold text-primary">{opponent.wpm || 0}</div>
                          <div className="text-base-muted">WPM</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-400">{opponent.accuracy || 0}%</div>
                          <div className="text-base-muted">Acc</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-400">{opponent.currentIndex ? Math.round((opponent.currentIndex / text.length) * 100) : 0}%</div>
                          <div className="text-base-muted">Prog</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress Bar */}
              <div className="glass-card p-6 rounded-xl border border-base-content/5">
                <div className="w-full bg-base-content/5 rounded-full h-3 mb-4">
                  <motion.div
                    className="bg-primary h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentIndex / text.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Text Display */}
              <div className={`glass-card p-8 rounded-xl border border-base-content/5 relative transition-all duration-500 ${chaosEffect ? chaosEffect.class : ''}`}>
                {chaosEffect && (
                  <div className="absolute top-2 right-2 text-xs font-bold text-red-500 animate-pulse bg-red-900/20 px-2 py-1 rounded">
                    CHAOS EVENT: {chaosEffect.name}
                  </div>
                )}
                <div className="text-lg md:text-xl leading-relaxed font-mono mb-6 min-h-[120px] md:min-h-[150px] whitespace-pre-wrap">
                  {renderText()}
                </div>
                <motion.input
                  ref={inputRef}
                  variants={inputVariants}
                  animate={controls}
                  onKeyDown={handleKeyDown}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  disabled={gameState !== 'active'}
                  className="w-full p-4 md:p-6 bg-base-content/5 border border-base-content/10 rounded-xl text-base-content placeholder-gray-500 focus:outline-none text-lg md:text-xl font-mono touch-manipulation"
                  placeholder={gameState === 'active' ? "Start typing..." : "Race completed!"}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              {gameState === 'completed' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`glass-card p-8 rounded-xl border text-center relative overflow-hidden ${
                    mode === 'quick-race' && raceResults
                      ? raceResults.winner === user?.id
                        ? 'border-yellow-500/50 bg-yellow-900/10 shadow-[0_0_50px_rgba(234,179,8,0.2)]'
                        : 'border-red-500/50 bg-red-900/10'
                      : 'border-base-content/5'
                  }`}
                >
                  {mode === 'quick-race' && raceResults ? (
                    <div className="space-y-6">
                      {raceResults.winner === user?.id ? (
                        <>
                           <div className="absolute inset-0 pointer-events-none">
                              {[...Array(12)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ y: -20, opacity: 0 }}
                                  animate={{ y: 200, opacity: [0, 1, 0], x: (Math.random() - 0.5) * 200 }}
                                  transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                                  className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                                />
                              ))}
                           </div>
                           <motion.div 
                             initial={{ scale: 0 }}
                             animate={{ scale: 1, rotate: 360 }}
                             transition={{ type: "spring", stiffness: 260, damping: 20 }}
                             className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-yellow-500/50 shadow-lg"
                           >
                             <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                           </motion.div>
                           <div>
                             <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-amber-600 mb-2 filter drop-shadow-lg">
                               VICTORY
                             </h2>
                             <p className="text-yellow-200/80 font-medium">You dominated the race!</p>
                           </div>
                        </>
                      ) : (
                        <>
                           <motion.div 
                             initial={{ scale: 0 }}
                             animate={{ scale: 1 }}
                             className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-red-500/50"
                           >
                             <Skull className="w-12 h-12 text-red-500" />
                           </motion.div>
                           <div>
                             <h2 className="text-4xl md:text-5xl font-black text-red-500 mb-2">DEFEAT</h2>
                             <p className="text-red-300/80">Keep practicing to claim the crown.</p>
                           </div>
                        </>
                      )}

                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto bg-base-dark/50 p-4 rounded-xl border border-white/10">
                        <div>
                          <div className={`text-3xl font-bold ${raceResults.winner === user?.id ? 'text-yellow-400' : 'text-base-content'}`}>{wpm}</div>
                          <div className="text-xs uppercase tracking-wider opacity-60">Final WPM</div>
                        </div>
                        <div>
                          <div className={`text-3xl font-bold ${raceResults.winner === user?.id ? 'text-green-400' : 'text-base-content'}`}>{accuracy}%</div>
                          <div className="text-xs uppercase tracking-wider opacity-60">Accuracy</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold mb-4">Race Complete!</h2>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="text-4xl font-bold text-primary">{wpm}</div>
                          <div className="text-base-muted">Final WPM</div>
                        </div>
                        <div>
                          <div className="text-4xl font-bold text-green-400">{accuracy}%</div>
                          <div className="text-base-muted">Accuracy</div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <button
                    onClick={resetGame}
                    className={`mt-8 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                      mode === 'quick-race' && raceResults && raceResults.winner === user?.id 
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-yellow-500/20' 
                      : 'bg-primary hover:bg-primary-hover text-white'
                    }`}
                  >
                    <RotateCcw className="w-5 h-5" />
                    {mode === 'quick-race' ? 'Find New Match' : 'Race Again'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 rounded-2xl border border-base-content/5 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Race History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-base-muted hover:text-base-content"
              >
                ✕
              </button>
            </div>
            {raceHistory.length === 0 ? (
              <p className="text-base-muted text-center">No races completed yet.</p>
            ) : (
              <div className="space-y-4">
                {raceHistory.map((race, idx) => {
                  const userResult = race.participants.find(p => p.userId === user.id);
                  return (
                    <div key={idx} className="glass-card p-4 rounded-xl border border-base-content/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{race.type === 'solo' ? 'Solo Race' : 'Multiplayer'}</span>
                        <span className="text-sm text-base-muted">{new Date(race.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-bold text-primary">{userResult?.wpm || 0}</div>
                          <div className="text-base-muted">WPM</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-400">{userResult?.accuracy || 0}%</div>
                          <div className="text-base-muted">Accuracy</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-400">{userResult?.timeTaken || 0}s</div>
                          <div className="text-base-muted">Time</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
