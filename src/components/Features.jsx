import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Crosshair, Award, BarChart2 } from 'lucide-react';

const ranks = [
  { name: 'Bronze', color: 'bg-orange-700', shadow: 'shadow-orange-700/50' },
  { name: 'Silver', color: 'bg-gray-400', shadow: 'shadow-gray-400/50' },
  { name: 'Gold', color: 'bg-yellow-500', shadow: 'shadow-yellow-500/50' },
  { name: 'Diamond', color: 'bg-cyan-400', shadow: 'shadow-cyan-400/50' },
  { name: 'Master', color: 'bg-purple-600', shadow: 'shadow-purple-600/50' },
  { name: 'Apex', color: 'bg-red-600', shadow: 'shadow-red-600/50' },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-base-navy relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/5 blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Ranking System */}
        <div className="mb-20 md:mb-32">
          <div className="text-center mb-12 md:mb-16">
             <h2 className="text-3xl md:text-5xl font-bold mb-4">Rank Up. <span className="text-primary-glow">Stand Out.</span></h2>
             <p className="text-base-muted">Your keyboard is your weapon. Your rank is your reputation.</p>
          </div>
          
          <div className="relative">
             {/* Line */}
             <div className="absolute top-1/2 left-0 w-full h-1 bg-base-content/10 -translate-y-1/2 hidden md:block"></div>
             
             <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative">
                {ranks.map((rank, idx) => (
                  <motion.div 
                    key={rank.name}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center gap-4 group cursor-pointer"
                  >
                     <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${rank.color} flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:${rank.shadow} shadow-lg`}>
                        <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                     </div>
                     <span className="font-bold text-lg text-base-content group-hover:text-primary-glow transition-colors">{rank.name}</span>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Progress & Skill */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Data-Driven <br />
                <span className="text-accent-purple">Performance Tracking</span>
              </h2>
              <p className="text-base-muted text-lg">
                Every race improves your profile. Track speed, consistency, accuracy, and growth with professional-grade analytics.
              </p>
              
              <div className="grid gap-6">
                {[
                  { icon: TrendingUp, title: "WPM Analysis", desc: "Track your typing speed evolution over time." },
                  { icon: Crosshair, title: "Precision Heatmaps", desc: "Identify and eliminate your most common typos." },
                  { icon: BarChart2, title: "Global Comparison", desc: "See how you stack up against the top 1%." }
                ].map((item, i) => (
                   <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-base-content/5 transition-colors border border-transparent hover:border-base-content/5">
                      <div className="p-3 bg-primary/10 rounded-lg h-fit">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-base-muted text-sm">{item.desc}</p>
                      </div>
                   </div>
                ))}
              </div>
           </div>

           {/* UI Mockup */}
           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="glass-card p-6 rounded-2xl border border-base-content/10"
           >
              <div className="flex justify-between items-end mb-8">
                 <div>
                    <div className="text-sm text-base-muted mb-1">Average Speed</div>
                    <div className="text-4xl font-bold text-base-content">142 <span className="text-lg text-base-muted font-normal">WPM</span></div>
                 </div>
                 <div className="text-green-400 text-sm font-mono">+12% this week</div>
              </div>
              
              {/* Fake Graph */}
              <div className="h-48 flex items-end gap-2 justify-between">
                 {[40, 65, 45, 70, 85, 60, 75, 50, 80, 95, 85, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-sm relative group"
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-base-content/10 text-white">
                          {h + 80} WPM
                       </div>
                    </motion.div>
                 ))}
              </div>
              
              <div className="flex justify-between mt-4 pt-4 border-t border-base-content/5 text-xs text-base-muted uppercase tracking-wider">
                 <span>Mon</span>
                 <span>Tue</span>
                 <span>Wed</span>
                 <span>Thu</span>
                 <span>Fri</span>
                 <span>Sat</span>
                 <span>Sun</span>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
