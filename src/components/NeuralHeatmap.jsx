import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Zap } from 'lucide-react';

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const getKeyStats = (key) => {
  // Deterministic mock data based on char code for consistency
  const code = key.charCodeAt(0);
  const errorRate = (code % 5) * 0.8; // 0 to 4%
  const speed = 100 - (code % 20); // ms latency
  
  let color = 'bg-gray-800';
  let borderColor = 'border-white/10';
  let textColor = 'text-gray-500';
  
  // Heatmap Logic
  if (errorRate > 2.5) {
    color = 'bg-red-500/10';
    borderColor = 'border-red-500/40';
    textColor = 'text-red-400';
  } else if (errorRate > 1) {
    color = 'bg-yellow-500/10';
    borderColor = 'border-yellow-500/40';
    textColor = 'text-yellow-400';
  } else {
    color = 'bg-cyan-500/10';
    borderColor = 'border-cyan-500/40';
    textColor = 'text-cyan-400';
  }

  return { speed, errorRate, color, borderColor, textColor };
};

const NeuralHeatmap = () => {
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
         <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Neural Heatmap
            </h3>
            <p className="text-gray-400 text-sm">Keystroke latency & error analysis</p>
         </div>
         <div className="flex gap-4 text-xs font-mono">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-cyan-500/20 border border-cyan-500/50 rounded"></span> Optimized</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-yellow-500/20 border-yellow-500/50 rounded"></span> Average</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500/20 border-red-500/50 rounded"></span> Critical</div>
         </div>
      </div>

      <div className="relative glass-card p-8 rounded-2xl border border-white/5 bg-black/40">
        <div className="flex flex-col items-center gap-2 select-none">
          {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((key) => {
                const stats = getKeyStats(key);
                return (
                  <motion.div
                    key={key}
                    onHoverStart={() => setHoveredKey({ key, ...stats })}
                    onHoverEnd={() => setHoveredKey(null)}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    className={`
                      w-10 h-10 md:w-14 md:h-14 rounded-lg border flex items-center justify-center relative cursor-crosshair transition-colors duration-300
                      ${stats.color} ${stats.borderColor}
                    `}
                  >
                    <span className={`font-mono font-bold text-lg ${stats.textColor}`}>{key}</span>
                    
                    {/* Corner Marker for High Error Keys */}
                    {stats.errorRate > 2.5 && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
          {/* Spacebar */}
          <div className="w-64 h-10 md:h-14 mt-2 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
            <span className="text-xs text-gray-600 uppercase tracking-widest">Space</span>
          </div>
        </div>

        {/* Floating Stats Tooltip */}
        <AnimatePresence>
          {hoveredKey && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-4 right-4 bg-base-dark border border-white/20 p-4 rounded-xl shadow-2xl z-20 w-48 pointer-events-none"
            >
               <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                  <span className="font-bold text-white text-lg">Key: {hoveredKey.key}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${hoveredKey.errorRate > 2 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {hoveredKey.errorRate > 2 ? 'Weak' : 'Strong'}
                  </span>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1"><Zap className="w-3 h-3" /> Latency</span>
                      <span className="text-white font-mono">{hoveredKey.speed}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Error Rate</span>
                      <span className={`${hoveredKey.textColor} font-mono`}>{hoveredKey.errorRate.toFixed(1)}%</span>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NeuralHeatmap;