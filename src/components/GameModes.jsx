import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const modes = [
  {
    icon: Zap,
    title: 'Quick Race',
    desc: 'Jump into a live race in seconds. Instant matchmaking with players of your skill level.',
    action: 'Race Now',
    route: '/play',
    color: 'text-primary-glow',
    bg: 'group-hover:bg-primary/10',
    border: 'group-hover:border-primary/50'
  },
  {
    icon: Trophy,
    title: 'Ranked Mode',
    desc: 'Compete for XP, climb leagues from Bronze to Apex, and earn seasonal rewards.',
    action: 'Enter League',
    route: '/ranked-lobby',
    color: 'text-yellow-400',
    bg: 'group-hover:bg-yellow-400/10',
    border: 'group-hover:border-yellow-400/50'
  },
  {
    icon: Lock,
    title: 'Private Rooms',
    desc: 'Create your own typing arena. Challenge friends, set custom text, and organize tournaments.',
    action: 'Manage Network',
    route: '/network',
    color: 'text-accent-purple',
    bg: 'group-hover:bg-accent-purple/10',
    border: 'group-hover:border-accent-purple/50'
  }
];

const GameModes = () => {
  const navigate = useNavigate();

  return (
    <section id="play" className="py-16 md:py-24 bg-base-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your <span className="text-primary-glow">Arena</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Whether you want a quick warmup or a competitive showdown, TypeMaster has a mode for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {modes.map((mode, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group glass-card p-8 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden`}
            >
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${mode.bg}`}></div>
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 ${mode.border} transition-colors`}>
                  <mode.icon className={`w-7 h-7 ${mode.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{mode.title}</h3>
                <p className="text-gray-400 mb-8 leading-relaxed h-20">
                  {mode.desc}
                </p>
                <button 
                  onClick={() => navigate(mode.route)}
                  className="w-full py-3 rounded-lg border border-white/10 font-medium hover:bg-white/5 transition-colors flex items-center justify-center group-hover:border-white/20"
                >
                  {mode.action}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameModes;
