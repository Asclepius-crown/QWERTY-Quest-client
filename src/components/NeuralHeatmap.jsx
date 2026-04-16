import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Zap } from 'lucide-react';

const keys = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", '↵'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

const getKeyStats = (key, insights) => {
  // Handle special keys
  const specialKeys = ['Tab', 'Caps', 'Shift', 'Ctrl', 'Alt', '⌫', '↵', 'Space'];
  if (specialKeys.includes(key)) {
    return {
      speed: 100,
      errorRate: 0,
      color: 'bg-gray-700/50',
      borderColor: 'border-gray-600/30',
      textColor: 'text-gray-400',
      occurrences: 0,
      isSpecial: true
    };
  }

  // Handle punctuation and numbers
  const punctuationKeys = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '[', ']', '\\', ';', "'", ',', '.', '/'];
  if (punctuationKeys.includes(key)) {
    return {
      speed: 120,
      errorRate: 0.5,
      color: 'bg-blue-500/15',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-300',
      occurrences: 0,
      isSpecial: false
    };
  }

  // Find real data from coaching insights
  const keyLower = key.toLowerCase();
  let errorRate = 0;
  let avgTime = 150;
  let occurrences = 0;

  if (insights?.commonWeaknesses && Array.isArray(insights.commonWeaknesses)) {
    const keyWeaknesses = insights.commonWeaknesses.filter(w =>
      w.pair?.toLowerCase().includes(keyLower) ||
      w.description?.toLowerCase().includes(keyLower)
    );

    if (keyWeaknesses.length > 0) {
      const totalOccurrences = keyWeaknesses.reduce((sum, w) => sum + (w.occurrences || 0), 0);
      errorRate = Math.min((totalOccurrences / Math.max(insights.totalRaces || 1, 1)) * 20, 15);
      occurrences = totalOccurrences;
      avgTime = keyWeaknesses.reduce((sum, w) => sum + (w.avgTime || 150), 0) / keyWeaknesses.length;
    }
  }

  // Enhanced baseline error rates
  const baselineErrors = {
    'q': 0.3, 'w': 0.2, 'e': 0.1, 'r': 0.4, 't': 0.2,
    'a': 0.1, 's': 0.8, 'd': 0.2, 'f': 0.4, 'g': 0.3,
    'z': 1.0, 'x': 1.2, 'c': 0.5, 'v': 0.3, 'b': 0.4,
    'n': 0.3, 'm': 0.5, 'h': 0.2, 'j': 0.1, 'k': 0.3,
    'l': 0.2, 'y': 0.4, 'u': 0.2, 'i': 0.1, 'o': 0.2,
    'p': 0.3
  };

  if (baselineErrors[keyLower] && errorRate === 0) {
    errorRate = baselineErrors[keyLower];
  }

  // Calculate speed based on error rate and average time
  const speed = Math.max(50, Math.min(300, avgTime - (errorRate * 5)));

  // Improved color scheme
  let color = 'bg-green-500/20';
  let borderColor = 'border-green-500/40';
  let textColor = 'text-green-300';
  let performance = 'Excellent';

  if (errorRate > 5 || occurrences > 8) {
    color = 'bg-red-500/25';
    borderColor = 'border-red-500/50';
    textColor = 'text-red-300';
    performance = 'Needs Work';
  } else if (errorRate > 2.5 || occurrences > 4) {
    color = 'bg-orange-500/20';
    borderColor = 'border-orange-500/40';
    textColor = 'text-orange-300';
    performance = 'Average';
  } else if (errorRate > 1 || occurrences > 1) {
    color = 'bg-yellow-500/20';
    borderColor = 'border-yellow-500/40';
    textColor = 'text-yellow-300';
    performance = 'Good';
  }

  return { speed, errorRate, color, borderColor, textColor, occurrences, performance, isSpecial: false };
};

const NeuralHeatmap = ({ insights }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (hoveredKey) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div className="w-full" onMouseMove={handleMouseMove}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Neural Heatmap
          </h3>
          <p className="text-gray-400 text-sm">Real-time keystroke performance analysis</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500/25 border border-green-500/50 rounded"></span>
            Excellent
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-500/25 border border-yellow-500/50 rounded"></span>
            Good
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-orange-500/25 border border-orange-500/50 rounded"></span>
            Average
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500/25 border border-red-500/50 rounded"></span>
            Needs Work
          </div>
        </div>
      </div>

      <div className="relative glass-card p-6 md:p-8 rounded-2xl border border-white/5 bg-black/40 overflow-hidden">
        <div className="flex flex-col items-center gap-1 select-none">
          {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((key, colIndex) => {
                const stats = getKeyStats(key, insights);
                const keySize = stats.isSpecial ? 
                  (key === 'Space' ? 'w-32 h-12' : key.length > 4 ? 'w-16 h-10' : 'w-12 h-10') : 
                  'w-8 h-10 md:w-10 md:h-12';

                return (
                  <motion.div
                    key={`${key}-${rowIndex}-${colIndex}`}
                    onHoverStart={(e) => {
                      setHoveredKey({ key, ...stats });
                      setTooltipPosition({ x: e.clientX, y: e.clientY });
                    }}
                    onHoverEnd={() => setHoveredKey(null)}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      ${keySize} rounded-md border flex items-center justify-center relative cursor-pointer transition-all duration-200
                      ${stats.color} ${stats.borderColor} hover:shadow-lg hover:shadow-primary/20
                      ${stats.isSpecial ? 'text-xs' : 'text-sm md:text-base font-mono font-bold'}
                      ${stats.textColor}
                    `}
                  >
                    {key}
                    
                    {/* Performance indicator */}
                    {!stats.isSpecial && stats.errorRate > 1 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-75" />
                    )}
                    
                    {/* Excellence badge */}
                    {!stats.isSpecial && stats.errorRate < 0.5 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-75" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Dynamic Tooltip */}
        <AnimatePresence>
          {hoveredKey && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y - 10,
                pointerEvents: 'none',
                zIndex: 50
              }}
              className="bg-base-dark/95 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-2xl w-56"
            >
              <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                <span className="font-bold text-white text-lg">{hoveredKey.key}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  hoveredKey.performance === 'Excellent' ? 'bg-green-500/20 text-green-300' :
                  hoveredKey.performance === 'Good' ? 'bg-yellow-500/20 text-yellow-300' :
                  hoveredKey.performance === 'Average' ? 'bg-orange-500/20 text-orange-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {hoveredKey.performance}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Speed
                  </span>
                  <span className="text-white font-mono">{Math.round(hoveredKey.speed)}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Error Rate
                  </span>
                  <span className={`font-mono ${hoveredKey.errorRate > 2 ? 'text-red-300' : hoveredKey.errorRate > 1 ? 'text-yellow-300' : 'text-green-300'}`}>
                    {hoveredKey.errorRate.toFixed(1)}%
                  </span>
                </div>
                {hoveredKey.occurrences > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Occurrences</span>
                    <span className="text-white font-mono">{hoveredKey.occurrences}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Hover over keys to see detailed performance metrics
          </p>
        </div>
      </div>
    </div>
  );
};

export default NeuralHeatmap;