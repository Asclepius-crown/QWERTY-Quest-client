import React from 'react';
import { Keyboard, Twitter, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-base-dark border-t border-base-content/5 pt-20 pb-10">
       <div className="max-w-7xl mx-auto px-6">
          
          {/* Main CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-accent-purple/10 rounded-3xl p-8 md:p-12 text-center border border-base-content/5 relative overflow-hidden mb-20">
             <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
             <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Stop practicing. Start <span className="text-primary-glow">competing.</span></h2>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/play" className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg shadow-lg transition-all text-center">
                       Enter the Arena
                    </Link>
                    <Link to="/signup" className="px-8 py-4 bg-base-content/5 hover:bg-base-content/10 text-base-content border border-base-content/10 rounded-xl font-bold text-lg backdrop-blur-sm transition-all text-center">
                       Create Free Account
                    </Link>
                 </div>
             </div>
          </div>

          {/* Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 border-b border-base-content/5 pb-12 mb-12">
             <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                   <Keyboard className="w-6 h-6 text-primary" />
                   <span className="text-xl font-bold tracking-wider text-base-content">
                      TYPE<span className="text-primary">MASTER</span>
                   </span>
                </div>
                <p className="text-base-muted max-w-sm">
                   The ultimate competitive typing platform. Race against real players, climb the leaderboards, and master your keyboard.
                </p>
             </div>
             
             <div>
                <h4 className="font-bold text-base-content mb-6">Platform</h4>
                <ul className="space-y-4 text-base-muted">
                   <li><a href="#" className="hover:text-primary transition-colors">Play Now</a></li>
                   <li><a href="#" className="hover:text-primary transition-colors">Leaderboard</a></li>
                   <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                   <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                </ul>
             </div>

             <div>
                <h4 className="font-bold text-base-content mb-6">Community</h4>
                <ul className="space-y-4 text-base-muted">
                   <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                   <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                   <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                   <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                </ul>
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-base-muted">
             <p>&copy; 2026 TypeMaster Inc. All rights reserved.</p>
             <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-base-content transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-base-content transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="hover:text-base-content transition-colors"><Linkedin className="w-5 h-5" /></a>
             </div>
          </div>
       </div>
    </footer>
  );
};

export default Footer;
