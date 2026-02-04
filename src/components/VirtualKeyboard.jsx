import React from 'react';
import { motion } from 'framer-motion';

const rows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'ShiftRight'],
  ['Space']
];

const VirtualKeyboard = ({ activeKey, pressedKey, isError }) => {
  const getKeyStyle = (key) => {
    const baseStyle = "flex items-center justify-center rounded-lg border border-white/10 text-sm font-bold transition-all duration-100 uppercase";
    let sizeStyle = "w-10 h-10 md:w-12 md:h-12";
    let colorStyle = "bg-white/5 text-gray-400";

    // Special key sizing
    if (key === 'Backspace') sizeStyle = "w-20 md:w-24 h-10 md:h-12 text-[10px]";
    if (key === 'Tab') sizeStyle = "w-16 md:w-20 h-10 md:h-12 text-[10px]";
    if (key === 'Caps') sizeStyle = "w-18 md:w-22 h-10 md:h-12 text-[10px]";
    if (key === 'Enter') sizeStyle = "w-20 md:w-24 h-10 md:h-12 text-[10px]";
    if (key === 'Shift' || key === 'ShiftRight') sizeStyle = "w-24 md:w-28 h-10 md:h-12 text-[10px]";
    if (key === 'Space') sizeStyle = "w-64 md:w-80 h-10 md:h-12";

    // Active state (Next key to type)
    if (activeKey && key.toLowerCase() === activeKey.toLowerCase()) {
      colorStyle = "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105 z-10";
    }
    
    // Space handling
    if (activeKey === ' ' && key === 'Space') {
       colorStyle = "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105 z-10";
    }

    // Pressed state feedback
    if (pressedKey && key.toLowerCase() === pressedKey.toLowerCase()) {
      if (isError) {
        colorStyle = "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
      } else {
        colorStyle = "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
      }
    }

    return `${baseStyle} ${sizeStyle} ${colorStyle}`;
  };

  return (
    <div className="flex flex-col gap-2 select-none bg-black/40 p-4 md:p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 justify-center">
          {row.map((key) => (
            <motion.div
              key={key}
              layout
              className={getKeyStyle(key)}
            >
              {key === 'ShiftRight' ? 'Shift' : key}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
