import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, RotateCcw, Award, Settings, Keyboard, Zap, ChevronRight, Play } from 'lucide-react';
import Navbar from '../components/Navbar';
import VirtualKeyboard from '../components/VirtualKeyboard';

const drills = {
  fundamentals: [
    { id: 'home-row', label: 'Home Row', text: "asdf jkl; a s d f j k l ; sad lad fad dad asks falls" },
    { id: 'top-row', label: 'Top Row', text: "qwerty uiop q w e r t y u i o p quiet power tree your" },
    { id: 'bottom-row', label: 'Bottom Row', text: "zxcv bnm ,. z x c v b n m , . zebra van ban man can" },
  ],
  speed: [
    { id: 'common-50', label: 'Top 50 Words', text: "the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me" },
    { id: 'common-100', label: 'Top 100 Words', text: "when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us" },
  ],
  advanced: [
    { id: 'pangrams', label: 'Pangrams', text: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump." },
    { id: 'code', label: 'Code Syntax', text: "const active = true; function init() { return array.map(x => x * 2); } import { useState } from 'react'; <Component prop={val} />" },
  ]
};

const Practice = () => {
  const [category, setCategory] = useState('fundamentals');
  const [activeDrill, setActiveDrill] = useState(drills.fundamentals[0]);
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState(null);
  const [isErrorKey, setIsErrorKey] = useState(false);
  const inputRef = useRef(null);

  // Focus input on mount/change
  useEffect(() => {
    if (!isFinished) {
      inputRef.current?.focus();
    }
  }, [activeDrill, isFinished]);

  const startDrill = (drill) => {
    setActiveDrill(drill);
    reset();
  };

  const reset = () => {
    setInput('');
    setCurrentIndex(0);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setIsFinished(false);
    setLastKeyPressed(null);
    setIsErrorKey(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInput = (e) => {
    if (isFinished) return;

    const value = e.target.value;
    const char = value.slice(-1);
    const targetChar = activeDrill.text[currentIndex];

    // Start timer on first key
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Set visual feedback key
    setLastKeyPressed(char);

    if (char === targetChar) {
      // Correct
      setIsErrorKey(false);
      setCurrentIndex(prev => prev + 1);
      setInput(value);
      
      // Calculate stats
      if (startTime) {
        const timeElapsed = (Date.now() - startTime) / 60000;
        const newWpm = Math.round(((currentIndex + 1) / 5) / timeElapsed);
        setWpm(newWpm === Infinity ? 0 : newWpm);
      }

      // Check finish
      if (currentIndex + 1 === activeDrill.text.length) {
        setIsFinished(true);
      }
    } else {
      // Incorrect
      setIsErrorKey(true);
      setErrors(prev => prev + 1);
      // Don't advance cursor (strict mode style) or optionally do
      // For practice, let's block progress until correct
    }

    // Calc Accuracy
    const totalKeystrokes = currentIndex + errors + 1;
    setAccuracy(Math.round(((currentIndex + 1) / totalKeystrokes) * 100));
  };

  const renderText = () => {
    return activeDrill.text.split('').map((char, idx) => {
      let className = "text-base-muted transition-colors duration-200";
      if (idx < currentIndex) {
        className = "text-green-400";
      } else if (idx === currentIndex) {
        className = "bg-primary/20 text-base-content border-b-2 border-primary animate-pulse";
      }
      return <span key={idx} className={className}>{char}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-base-dark text-base-content">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Target className="w-10 h-10 text-primary" />
              The <span className="text-primary-glow">Dojo</span>
            </h1>
            <p className="text-base-muted">Master your keystrokes. No timer, just focus.</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar: Drill Selection */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-4 rounded-xl border border-base-content/5">
                <h3 className="text-sm font-bold text-base-muted uppercase tracking-widest mb-4">Drill Type</h3>
                <div className="space-y-2">
                  {Object.keys(drills).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                        category === cat 
                        ? 'bg-primary/20 text-base-content border border-primary/20' 
                        : 'text-base-muted hover:bg-base-content/5 hover:text-base-content'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      {category === cat && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-base-content/5">
                <h3 className="text-sm font-bold text-base-muted uppercase tracking-widest mb-4">Select Drill</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {drills[category].map(drill => (
                    <button
                      key={drill.id}
                      onClick={() => startDrill(drill)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                        activeDrill.id === drill.id 
                        ? 'bg-base-content/10 text-primary font-bold' 
                        : 'text-base-muted hover:bg-base-content/5'
                      }`}
                    >
                      {drill.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Area */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-xl border border-base-content/5 text-center">
                  <div className="text-xs text-base-muted uppercase tracking-wider mb-1">Speed</div>
                  <div className="text-2xl font-mono font-bold text-primary">{wpm} <span className="text-sm text-base-muted">WPM</span></div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-base-content/5 text-center">
                  <div className="text-xs text-base-muted uppercase tracking-wider mb-1">Accuracy</div>
                  <div className={`text-2xl font-mono font-bold ${accuracy > 95 ? 'text-green-400' : 'text-yellow-400'}`}>{accuracy}%</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-base-content/5 text-center">
                  <div className="text-xs text-base-muted uppercase tracking-wider mb-1">Progress</div>
                  <div className="text-2xl font-mono font-bold text-blue-400">
                    {Math.round((currentIndex / activeDrill.text.length) * 100)}%
                  </div>
                </div>
              </div>

              {/* Typing Area */}
              <div className="glass-card p-8 rounded-2xl border border-base-content/5 relative min-h-[200px] flex flex-col justify-center">
                {!isFinished ? (
                  <>
                    <div 
                      className="text-2xl md:text-3xl font-mono leading-relaxed tracking-wide text-center"
                      onClick={() => inputRef.current?.focus()}
                    >
                      {renderText()}
                    </div>
                    <input 
                      ref={inputRef}
                      type="text" 
                      value={input}
                      onChange={handleInput}
                      className="opacity-0 absolute inset-0 cursor-default"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-base-muted">
                      <Keyboard className="w-4 h-4" /> Focus Mode
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-block p-4 rounded-full bg-green-500/20 border border-green-500/50 mb-6"
                    >
                      <Award className="w-12 h-12 text-green-400" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-base-content mb-2">Drill Complete!</h2>
                    <p className="text-base-muted mb-8">Great focus. Here is how you did.</p>
                    
                    <div className="flex justify-center gap-12 mb-8">
                      <div>
                        <div className="text-4xl font-bold text-primary">{wpm}</div>
                        <div className="text-sm text-base-muted">Final WPM</div>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-green-400">{accuracy}%</div>
                        <div className="text-sm text-base-muted">Accuracy</div>
                      </div>
                    </div>

                    <button 
                      onClick={reset}
                      className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold flex items-center gap-2 mx-auto transition-all"
                    >
                      <RotateCcw className="w-5 h-5" /> Repeat Drill
                    </button>
                  </div>
                )}
              </div>

              {/* Virtual Keyboard */}
              <div className="mt-8">
                <VirtualKeyboard 
                  activeKey={!isFinished ? activeDrill.text[currentIndex] : null} 
                  pressedKey={lastKeyPressed}
                  isError={isErrorKey}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
