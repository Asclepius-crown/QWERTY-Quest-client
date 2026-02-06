import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, Sparkles } from 'lucide-react';
import { playHoverSound, RARITY } from '../contexts/AchievementContext';

const AchievementCard = ({ achievement, progress, isUnlocked, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const Icon = achievement.icon;
  const rarity = achievement.rarity || RARITY.COMMON;

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateX: -mousePosition.y,
        rotateY: mousePosition.x,
        y: isHovered ? -8 : 0,
        scale: isHovered ? 1.02 : 1
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500 ${
          isUnlocked ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${rarity.color}40, transparent 70%)`,
          transform: 'translateZ(-10px)'
        }}
      />

      {/* Card Container */}
      <div
        className={`relative rounded-2xl p-5 h-full transition-all duration-300 ${
          isUnlocked
            ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90'
            : 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 grayscale'
        }`}
        style={{
          border: `2px solid ${isUnlocked ? rarity.color : '#374151'}`,
          boxShadow: isUnlocked
            ? `0 0 30px ${rarity.color}30, inset 0 0 20px ${rarity.color}10`
            : 'none'
        }}
      >
        {/* Animated Border for Legendary */}
        {isUnlocked && rarity.name === 'Legendary' && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div
              className="absolute inset-[-50%] animate-spin-slow"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${rarity.color}, transparent)`,
                animation: 'spin 4s linear infinite'
              }}
            />
            <div className="absolute inset-[2px] rounded-2xl bg-slate-900" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Header: Icon and Status */}
          <div className="flex justify-between items-start mb-4">
            <motion.div
              className={`p-3 rounded-xl ${isUnlocked ? '' : 'bg-slate-700/50'}`}
              style={{
                background: isUnlocked
                  ? `linear-gradient(135deg, ${rarity.color}20, ${rarity.color}10)`
                  : undefined,
                boxShadow: isUnlocked ? `0 0 20px ${rarity.color}30` : 'none'
              }}
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon
                className="w-8 h-8"
                style={{ color: isUnlocked ? rarity.color : '#6B7280' }}
              />
              
              {/* Sparkles for unlocked */}
              {isUnlocked && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: rarity.color }} />
                </motion.div>
              )}
            </motion.div>

            {/* Status Badge */}
            <div
              className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isUnlocked
                  ? ''
                  : 'bg-slate-700 text-slate-400'
              }`}
              style={{
                background: isUnlocked ? `${rarity.color}20` : undefined,
                color: isUnlocked ? rarity.color : undefined
              }}
            >
              {isUnlocked ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> Unlocked
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
            </div>
          </div>

          {/* Title and Description */}
          <h4
            className="font-bold text-lg mb-1 truncate"
            style={{ color: isUnlocked ? '#fff' : '#9CA3AF' }}
          >
            {achievement.title}
          </h4>
          <p className="text-xs text-slate-400 mb-3 line-clamp-2">
            {achievement.desc}
          </p>

          {/* Rarity Badge */}
          <div
            className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold mb-3"
            style={{
              background: `${rarity.color}15`,
              color: rarity.color,
              border: `1px solid ${rarity.color}30`
            }}
          >
            {rarity.name}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Progress</span>
              <span
                className="font-bold"
                style={{ color: isUnlocked ? rarity.color : '#6B7280' }}
              >
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, ${rarity.color}60, ${rarity.color})`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </motion.div>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              {achievement.criteria}
            </p>
          </div>
        </div>

        {/* Floating particles on hover for unlocked */}
        <AnimatePresence>
          {isHovered && isUnlocked && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full pointer-events-none"
                  style={{ background: rarity.color }}
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 1,
                    scale: 0
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 100}%`,
                    y: `${50 + (Math.random() - 0.5) * 100}%`,
                    opacity: 0,
                    scale: 1
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
