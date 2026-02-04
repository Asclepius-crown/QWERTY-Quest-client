import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Keyboard, Zap, Trophy, Target } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-base-dark text-base-content">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-6">Master the <span className="text-primary-glow">Art of Typing</span></h1>
            <p className="text-xl text-base-muted">Your journey from novice to speed demon starts here.</p>
          </motion.div>

          <div className="space-y-12">
            {[
              { icon: Keyboard, title: "1. The Basics", desc: "Learn proper finger placement and home row technique in our Practice Dojo." },
              { icon: Zap, title: "2. Build Speed", desc: "Challenge yourself with common words and bursts of speed in Quick Races." },
              { icon: Trophy, title: "3. Compete", desc: "Climb the global leaderboard and earn your rank from Bronze to Apex." },
              { icon: Target, title: "4. Master", desc: "Achieve 100% accuracy and unlock the precision specialist badges." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 rounded-2xl border border-base-content/5 flex items-start gap-6"
              >
                <div className="p-4 bg-primary/10 rounded-xl text-primary">
                  <step.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-base-muted">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
