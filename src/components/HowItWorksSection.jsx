import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Play, Keyboard, Trophy } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up Free',
    desc: 'Create your account in seconds or jump right in as a guest. No barriers to entry.',
    color: 'text-primary-glow',
    bg: 'group-hover:bg-primary/10',
    border: 'group-hover:border-primary/50'
  },
  {
    icon: Play,
    title: 'Choose Your Arena',
    desc: 'Pick Quick Race for instant action, Ranked Mode for competition, or create a private room.',
    color: 'text-accent-purple',
    bg: 'group-hover:bg-accent-purple/10',
    border: 'group-hover:border-accent-purple/50'
  },
  {
    icon: Keyboard,
    title: 'Type to Compete',
    desc: 'Race against real players. Your speed and accuracy determine your position in the pack.',
    color: 'text-primary-glow',
    bg: 'group-hover:bg-primary/10',
    border: 'group-hover:border-primary/50'
  },
  {
    icon: Trophy,
    title: 'Climb the Ranks',
    desc: 'Track your WPM, accuracy streaks, and global ranking. Earn achievements and bragging rights.',
    color: 'text-yellow-400',
    bg: 'group-hover:bg-yellow-400/10',
    border: 'group-hover:border-yellow-400/50'
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-base-navy relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            How It <span className="text-primary-glow">Works</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Get started in under a minute. Our streamlined process gets you racing against the world faster than you can type "hello".
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-accent-purple/20 to-yellow-400/20 -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`group glass-card p-6 md:p-8 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative text-center`}
              >
                <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${step.bg} rounded-2xl`}></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${step.border} transition-colors group-hover:scale-110`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <div className="mb-4">
                    <span className="inline-block w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center mb-3">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;