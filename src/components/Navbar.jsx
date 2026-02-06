import React, { useState, useEffect } from 'react';
import { 
  Keyboard, Menu, X, LogOut, ChevronDown,
  Shield, Settings, UserCircle, 
  Trophy, Target, Palette, Bell, Users as UsersIcon, HelpCircle, Bug, Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFriends } from '../contexts/FriendsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserAvatarDisplay, isCustomAvatar } from '../config/avatars';

  const MenuLink = ({ to, icon: Icon, label, onClick }) => (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 text-sm text-base-content/80 hover:text-base-content hover:bg-base-content/5 rounded-lg transition-all group"
    >
      <Icon className="w-4 h-4 text-base-muted group-hover:text-primary transition-colors" />
      <span>{label}</span>
    </Link>
  );

  const MenuButton = ({ icon: Icon, label, onClick, danger = false }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all group text-left ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-base-content/80 hover:text-base-content hover:bg-base-content/5'}`}
    >
      <Icon className={`w-4 h-4 transition-colors ${danger ? 'text-red-400' : 'text-base-muted group-hover:text-primary'}`} />
      <span>{label}</span>
    </button>
  );

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [status] = useState('online');
  const { isLoggedIn, user, logout } = useAuth();
  const { friends } = useFriends();
  
  // Get pending friend requests count
  const pendingRequestsCount = friends.filter(f => f.status === 'pending_received').length;

  const avatarDisplay = getUserAvatarDisplay(user);
  const isCustom = isCustomAvatar(user?.avatar);
  const stats = user?.stats || { level: 1, xp: 0, rank: 'Bronze', bestWPM: 0, avgWPM: 0 };
  const nextLevelXp = stats.level * 100;
  const xpProgress = Math.min((stats.xp / nextLevelXp) * 100, 100);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest('.profile-dropdown')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-4 bg-base-navy/80 backdrop-blur-md shadow-lg' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/40 transition-colors border border-primary/50">
            <Keyboard className="w-6 h-6 text-primary-glow" />
          </div>
          <span className="text-xl font-bold tracking-wider text-base-content group-hover:text-primary-glow transition-colors">
            TYPE<span className="text-primary">MASTER</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Home', to: '/' },
            { label: 'Play', to: '/play' },
            { label: 'Ranked', to: '/ranked-lobby' },
            { label: 'Leaderboard', to: '/leaderboard' },
            { label: 'How it Works', to: '/how-it-works' }
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-base-muted hover:text-base-content transition-colors text-sm uppercase tracking-wide font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative profile-dropdown">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 pl-3 py-1.5 bg-base-content/5 hover:bg-base-content/10 border border-base-content/10 rounded-full font-medium transition-all group"
              >
                <div className="flex flex-col items-end mr-1">
                    <span className="text-xs font-bold text-base-content leading-tight">{user?.username || 'User'}</span>
                    <span className="text-[10px] text-primary uppercase tracking-wider">Lvl {stats.level}</span>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-base-content/10 flex items-center justify-center relative overflow-hidden bg-base-content/5">
                  <img 
                    src={avatarDisplay.imageSrc} 
                    alt={avatarDisplay.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-base-dark ${status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
                <ChevronDown className={`w-4 h-4 text-base-muted group-hover:text-base-content transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-base-navy/95 backdrop-blur-xl border border-base-content/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden z-50 ring-1 ring-base-content/5"
                  >
                    {/* Zone 1: Player Snapshot */}
                    <div className="p-5 bg-gradient-to-br from-white/5 to-transparent border-b border-base-content/5 relative">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
                        
                        <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center border border-base-content/10 shadow-lg overflow-hidden bg-base-content/5">
                                <img 
                                  src={avatarDisplay.imageSrc} 
                                  alt={avatarDisplay.name}
                                  className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-base-content leading-none mb-1">{user?.username}</h3>
                                <div className="text-[10px] font-mono text-primary mb-2 flex items-center gap-1">
                                    <span className="text-base-muted">Net-ID:</span> {user?.netId}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                    {stats.rank}
                                  </span>
                                  <span className="text-[10px] text-base-muted">
                                    {status === 'online' ? '● Online' : '○ Stealth'}
                                  </span>
                                </div>
                                {/* XP Bar */}
                                <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-primary to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                        style={{ width: `${xpProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[9px] text-base-muted mt-1 font-mono">
                                  <span>{Math.floor(stats.xp)} XP</span>
                                  <span>{nextLevelXp} XP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                      {/* Zone 2: Core Player Actions */}
                      <div className="mb-2">
                        <div className="px-3 py-1 text-[10px] font-bold text-base-muted uppercase tracking-widest">Menu</div>
                         <MenuLink to="/profile" icon={UserCircle} label="My Profile & Stats" onClick={() => setProfileOpen(false)} />
                         <Link 
                           to="/network" 
                           onClick={() => setProfileOpen(false)}
                           className="flex items-center gap-3 px-3 py-2 text-sm text-base-content/80 hover:text-base-content hover:bg-base-content/5 rounded-lg transition-all group"
                         >
                           <Share2 className="w-4 h-4 text-base-muted group-hover:text-primary transition-colors" />
                           <span>Network (Friends)</span>
                           {pendingRequestsCount > 0 && (
                             <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                               {pendingRequestsCount}
                             </span>
                           )}
                         </Link>
                        <MenuLink to="/leaderboard" icon={Trophy} label="My Rank" onClick={() => setProfileOpen(false)} />
                        <MenuLink to="/practice" icon={Target} label="Practice Mode" onClick={() => setProfileOpen(false)} />
                      </div>

                      <div className="h-px bg-base-content/5 my-1 mx-2"></div>

                      {/* Zone 3: Account & System */}
                      <div className="mb-2">
                        <div className="px-3 py-1 text-[10px] font-bold text-base-muted uppercase tracking-widest">System</div>
                         <MenuLink to="/settings" icon={Settings} label="Settings" onClick={() => setProfileOpen(false)} />
                         <MenuLink to="/settings" icon={Palette} label="Customize" onClick={() => setProfileOpen(false)} />
                         <MenuButton icon={Bell} label="Notifications" onClick={() => alert('Notifications system coming soon!')} />
                         <Link 
                           to="/network" 
                           onClick={() => setProfileOpen(false)}
                           className="flex items-center gap-3 px-3 py-2 text-sm text-base-content/80 hover:text-base-content hover:bg-base-content/5 rounded-lg transition-all group"
                         >
                           <UsersIcon className="w-4 h-4 text-base-muted group-hover:text-primary transition-colors" />
                           <span>Manage Uplinks</span>
                           {pendingRequestsCount > 0 && (
                             <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                               {pendingRequestsCount}
                             </span>
                           )}
                         </Link>
                      </div>

                      <div className="h-px bg-base-content/5 my-1 mx-2"></div>

                      {/* Zone 4: Session & Support */}
                      <div>
                        <MenuLink to="/how-it-works" icon={HelpCircle} label="Help / How it works" onClick={() => setProfileOpen(false)} />
                        <MenuButton icon={Bug} label="Report a bug" onClick={() => alert('Please report bugs to our GitHub repository!')} />
                        <MenuButton icon={LogOut} label="Logout" danger onClick={() => { logout(); setProfileOpen(false); }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-base-content hover:text-primary transition-colors font-medium">
                Login
              </Link>
              <Link to="/signup" className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-full font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all transform hover:-translate-y-0.5">
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-base-content" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

       {/* Mobile Menu */}
       {isOpen && (
         <div className="md:hidden absolute top-full left-0 w-full bg-base-dark/95 backdrop-blur-xl border-t border-base-content/10 p-6 flex flex-col gap-4 shadow-2xl h-screen z-40">
            {[
              { label: 'Home', to: '/' },
              { label: 'Play', to: '/play' },
              { label: 'Ranked', to: '/ranked-lobby' },
              { label: 'Leaderboard', to: '/leaderboard' },
              { label: 'How it Works', to: '/how-it-works' }
            ].map((item) => (
             <Link
               key={item.label}
               to={item.to}
               className="text-base-content/80 hover:text-base-content py-4 text-xl font-medium border-b border-base-content/5 last:border-0 block text-center"
               onClick={() => setIsOpen(false)}
             >
               {item.label}
             </Link>
           ))}
           <div className="flex flex-col gap-4 mt-8">
             {isLoggedIn ? (
               <>
                    <div className="w-full py-4 text-base-content border border-base-content/20 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-base-content/5">
                      <img 
                        src={avatarDisplay.imageSrc} 
                        alt={avatarDisplay.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {user?.username || 'User'}
                  </div>
                 <Link to="/profile" className="w-full py-4 text-base-content border border-base-content/20 rounded-xl font-bold hover:bg-base-content/5 transition-colors text-center" onClick={() => setIsOpen(false)}>My Profile</Link>
                 <button
                   onClick={() => { logout(); setIsOpen(false); }}
                   className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-colors text-center flex items-center justify-center gap-2"
                 >
                   <LogOut className="w-4 h-4" />
                   Logout
                 </button>
               </>
             ) : (
               <>
                 <Link to="/login" className="w-full py-4 text-base-content border border-base-content/20 rounded-xl font-bold hover:bg-base-content/5 transition-colors text-center" onClick={() => setIsOpen(false)}>Login</Link>
                 <Link to="/signup" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-hover transition-colors text-center" onClick={() => setIsOpen(false)}>Sign Up Free</Link>
               </>
             )}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
