import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Radio, Wifi, Shield, Zap, Activity, Hexagon, 
  UserPlus, CheckCircle, XCircle, Keyboard, Cpu, Sword, Trash2, MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import { useFriends } from '../contexts/FriendsContext';
import { useAuth } from '../contexts/AuthContext';

  const HexNode = ({ friend, center = false, currentUser, onChallenge, onViewProfile }) => {
    const statusColor = center ? 'bg-primary' 
      : friend?.isOnline ? 'bg-green-500' 
      : 'bg-base-muted';
    
    const activityStatus = friend?.activityStatus || (friend?.isOnline ? 'Online' : 'Offline');
    const statusColors = {
      'Online': 'bg-green-500',
      'In a Race': 'bg-yellow-500',
      'Idle': 'bg-orange-500',
      'Editing Profile': 'bg-purple-500',
      'Offline': 'bg-base-muted'
    };
    const statusColorClass = statusColors[activityStatus] || statusColor;
      
    return (
      <motion.div 
        layout
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, zIndex: 10 }}
        className="relative w-32 h-32 flex items-center justify-center group cursor-pointer"
        onClick={() => !center && onViewProfile && onViewProfile(friend)}
      >
        {/* Hexagon Shape */}
        <div className={`absolute inset-0 hex-mask ${center ? 'bg-primary/20 border-2 border-primary' : 'bg-base-content/5 hover:bg-base-content/10'} transition-colors duration-300`}></div>
        
        {/* Border Glow */}
        <div className="absolute inset-0 hex-mask border border-base-content/10 group-hover:border-primary/50 transition-colors"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center p-2">
           <div className="relative">
             <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-base-content/20 mb-2">
                <div className={`w-full h-full bg-gradient-to-br ${center ? 'from-primary to-purple-600' : 'from-gray-700 to-gray-900'}`}>
                   {/* Avatar Placeholder */}
                   <Users className="w-full h-full p-3 text-base-content/50" />
                </div>
             </div>
             {/* Status Dot */}
             {!center && (
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-dark ${statusColorClass} shadow-[0_0_10px_currentColor]`}></div>
             )}
           </div>
           
           <span className={`text-xs font-bold truncate max-w-[80px] ${center ? 'text-primary-glow' : 'text-base-content'}`}>
             {center ? currentUser?.username : friend.username}
           </span>
           
           <span className={`text-[9px] font-mono -mt-0.5 ${center ? 'text-primary' : 'text-base-muted/50'}`}>
             {center ? currentUser?.netId : friend?.netId || '###-###'}
           </span>
           
           {!center && (
             <span className="text-[10px] text-base-muted font-mono mt-0.5">{friend.rank || 'Unranked'}</span>
           )}
           
           {/* Hover Actions */}
           {!center && (
             <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
               {onChallenge && (
                 <button
                   onClick={(e) => { e.stopPropagation(); onChallenge(friend); }}
                   className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold py-1 px-2 rounded-full flex items-center gap-1 shadow-lg"
                   title="Challenge to race"
                 >
                   <Sword className="w-3 h-3" />
                 </button>
               )}
               <button
                 onClick={(e) => { e.stopPropagation(); onViewProfile(friend); }}
                 className="bg-base-content/20 hover:bg-base-content/40 text-white text-[10px] font-bold py-1 px-2 rounded-full flex items-center gap-1 shadow-lg"
                 title="View profile"
               >
                 <Users className="w-3 h-3" />
               </button>
             </div>
           )}
        </div>
      </motion.div>
    );
  };

const Network = () => {
  const { friends, loading, sendRequest, acceptRequest, removeFriend, fetchFriends } = useFriends();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('grid'); // grid, requests, add
  const [searchTerm, setSearchTerm] = useState('');
  const [addUsername, setAddUsername] = useState('');
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, found, error
  const [scanMsg, setScanMsg] = useState('');
  
  // For "Typing to Accept"
  const [confirmInput, setConfirmInput] = useState('');
  const [targetRequest, setTargetRequest] = useState(null);

  // Challenge System
  const [socket, setSocket] = useState(null);
  const [incomingChallenge, setIncomingChallenge] = useState(null);

  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const pendingRequests = friends.filter(f => f.status === 'pending_received');
  const sentRequests = friends.filter(f => f.status === 'pending_sent');
  
  // Filter friends based on search term
  const filteredFriends = acceptedFriends.filter(friend => 
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.netId?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Unfriend confirmation state
  const [unfriendConfirm, setUnfriendConfirm] = useState(null);
  
  // Profile Dossier state
  const [selectedFriend, setSelectedFriend] = useState(null);
  
  // Poke feature state
  const [pokeMessage, setPokeMessage] = useState('');
  const [pokeModalOpen, setPokeModalOpen] = useState(false);
  const [pokeTarget, setPokeTarget] = useState(null);

  useEffect(() => {
    if (user?.id) {
      const newSocket = io(import.meta.env.VITE_API_BASE_URL.replace('/api', ''), {
        withCredentials: true
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket for network features');
        newSocket.emit('register', user.id);
      });

      newSocket.on('challenge-received', (data) => {
        setIncomingChallenge(data);
      });

      newSocket.on('challenge-accepted', ({ roomId }) => {
        // Navigate to play page with private room details
        navigate('/play', { 
          state: { 
            mode: 'private-race', 
            roomId 
          } 
        });
      });

      newSocket.on('challenge-declined', () => {
        alert('Challenge declined.');
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [user?.id, navigate]);

  const handleChallenge = (friend) => {
    if (socket && friend.id) {
      socket.emit('send-challenge', { 
        targetUserId: friend.id,
        senderName: user.username 
      });
      alert(`Challenge sent to ${friend.username}! Waiting for response...`);
    }
  };

  const handleViewProfile = (friend) => {
    setSelectedFriend(friend);
  };

  const handlePoke = (friend) => {
    setPokeTarget(friend);
    setPokeModalOpen(true);
  };

  const sendPoke = () => {
    if (socket && pokeTarget) {
      socket.emit('send-poke', {
        targetUserId: pokeTarget.id,
        senderName: user.username,
        message: pokeMessage || 'Hey! Ready to race?'
      });
      setPokeModalOpen(false);
      setPokeMessage('');
      setPokeTarget(null);
      alert(`Message sent to ${pokeTarget.username}!`);
    }
  };

  const respondToChallenge = (accepted) => {
    if (socket && incomingChallenge) {
      socket.emit('respond-challenge', {
        challengerId: incomingChallenge.challengerId,
        accepted,
        responderId: user.id
      });
      setIncomingChallenge(null);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setScanStatus('scanning');
    
    // Simulate scan delay for effect
    setTimeout(async () => {
      const result = await sendRequest(addUsername);
      if (result.success) {
        setScanStatus('found');
        setScanMsg(`Uplink established: Signal sent to ${addUsername}`);
        setAddUsername('');
      } else {
        setScanStatus('error');
        setScanMsg(`Connection failed: ${result.msg}`);
      }
      setTimeout(() => setScanStatus('idle'), 3000);
    }, 1500);
  };

  const handleAcceptTyping = (e) => {
    const val = e.target.value;
    setConfirmInput(val);
    if (val === targetRequest.username) {
       // Auto-accept on match
       acceptRequest(targetRequest.id);
       setTargetRequest(null);
       setConfirmInput('');
    }
  };

  return (
    <div className="min-h-screen bg-base-dark text-base-content relative overflow-hidden">
      <Navbar />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-hex-mesh opacity-20 pointer-events-none"></div>

      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
        
        {/* Header / Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div>
             <h1 className="text-3xl font-bold flex items-center gap-3">
               <Activity className="text-primary" /> 
               <span className="text-glow">Neural Network</span>
             </h1>
             <p className="text-base-muted text-sm font-mono mt-1">
               Uplink Status: <span className="text-green-400">ONLINE</span> • Nodes: {acceptedFriends.length}
             </p>
          </div>

          <div className="flex bg-base-navy rounded-xl p-1 border border-base-content/10">
             <button 
               onClick={() => setActiveTab('grid')}
               className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-base-muted hover:text-base-content'}`}
             >
               <Hexagon className="w-4 h-4" /> Grid
             </button>
             <button 
               onClick={() => setActiveTab('requests')}
               className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'requests' ? 'bg-primary text-white shadow-lg' : 'text-base-muted hover:text-base-content'}`}
             >
               <Radio className="w-4 h-4" /> 
               Transmissions
               {pendingRequests.length > 0 && (
                 <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{pendingRequests.length}</span>
               )}
             </button>
             <button 
               onClick={() => setActiveTab('add')}
               className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'add' ? 'bg-primary text-white shadow-lg' : 'text-base-muted hover:text-base-content'}`}
             >
               <UserPlus className="w-4 h-4" /> Uplink
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative">
           <AnimatePresence mode='wait'>
             
              {/* GRID VIEW */}
              {activeTab === 'grid' && (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex flex-col items-center overflow-auto"
                >
                   {/* Search Bar */}
                   {acceptedFriends.length > 0 && (
                     <div className="w-full max-w-md mb-6 relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-muted" />
                       <input
                         type="text"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         placeholder="Search friends by username or Net-ID..."
                         className="w-full bg-base-navy border border-base-content/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-base-muted focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                       />
                       {searchTerm && (
                         <button
                           onClick={() => setSearchTerm('')}
                           className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
                         >
                           <XCircle className="w-4 h-4 text-base-muted" />
                         </button>
                       )}
                     </div>
                   )}
                   
                   {/* Results count */}
                   {searchTerm && (
                     <div className="text-sm text-base-muted mb-4">
                       Showing {filteredFriends.length} of {acceptedFriends.length} friends
                     </div>
                   )}
                   
                   {/* Hex Grid Layout Logic - simplified visual clustering */}
                   <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                      {/* User Center Node */}
                      <HexNode center currentUser={user} />
                      
                      {filteredFriends.map((friend) => (
                         <HexNode 
                           key={friend.id} 
                           friend={friend} 
                           currentUser={user}
                           onChallenge={handleChallenge}
                           onViewProfile={handleViewProfile}
                         />
                      ))}
                      
                      {/* Empty Slots for effect */}
                      {filteredFriends.length > 0 && [...Array(6 - (filteredFriends.length % 6))].map((_, i) => (
                         <div key={`empty-${i}`} className="w-32 h-32 opacity-10 hex-mask bg-base-content/20 flex items-center justify-center">
                            <Wifi className="w-6 h-6" />
                         </div>
                      ))}
                   </div>
                   
                   {/* No results message */}
                   {searchTerm && filteredFriends.length === 0 && (
                     <div className="text-center py-12 opacity-50">
                       <Search className="w-16 h-16 mx-auto mb-4" />
                       <h3 className="text-xl font-bold">No friends found</h3>
                       <p>No matches for "{searchTerm}"</p>
                     </div>
                   )}
                </motion.div>
              )}

             {/* REQUESTS VIEW */}
             {activeTab === 'requests' && (
               <motion.div 
                 key="requests"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="max-w-2xl mx-auto"
               >
                  {pendingRequests.length === 0 && sentRequests.length === 0 ? (
                     <div className="text-center py-20 opacity-50">
                        <Radio className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">No Incoming Signals</h3>
                        <p>Your frequency is clear.</p>
                     </div>
                  ) : (
                    <div className="space-y-6">
                       {/* Incoming */}
                       {pendingRequests.length > 0 && (
                         <div>
                            <h3 className="text-primary font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                               <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                               Incoming Handshakes
                            </h3>
                            <div className="space-y-3">
                               {pendingRequests.map(req => (
                                  <div key={req.id} className="glass-card p-4 rounded-xl border border-primary/30 flex items-center justify-between">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-base-content/10 flex items-center justify-center">
                                           <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                           <div className="font-bold text-lg">{req.username}</div>
                                           <div className="text-xs text-base-muted font-mono">{req.rank} Division</div>
                                        </div>
                                     </div>
                                     
                                     {targetRequest?.id === req.id ? (
                                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right">
                                           <div className="relative">
                                              <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                              <input 
                                                autoFocus
                                                type="text" 
                                                value={confirmInput}
                                                onChange={handleAcceptTyping}
                                                placeholder={`Type "${req.username}"`}
                                                className="bg-base-navy border border-primary text-white pl-9 pr-3 py-2 rounded-lg text-sm font-mono w-48 focus:outline-none focus:ring-1 focus:ring-primary"
                                              />
                                           </div>
                                           <button onClick={() => setTargetRequest(null)} className="p-2 hover:bg-white/10 rounded-lg">
                                              <XCircle className="w-5 h-5 text-red-400" />
                                           </button>
                                        </div>
                                     ) : (
                                         <div className="flex gap-2">
                                            <button 
                                              onClick={() => setTargetRequest(req)}
                                              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold flex items-center gap-2"
                                            >
                                               <Keyboard className="w-4 h-4" /> Accept
                                            </button>
                                            <button 
                                               onClick={() => setUnfriendConfirm({ id: req.id, username: req.username, type: 'reject' })}
                                               className="p-2 hover:bg-white/10 rounded-lg border border-white/10 text-base-muted hover:text-red-400 transition-colors"
                                            >
                                               <XCircle className="w-5 h-5" />
                                            </button>
                                         </div>
                                     )}
                                  </div>
                               ))}
                            </div>
                         </div>
                       )}

                       {/* Sent */}
                       {sentRequests.length > 0 && (
                         <div className="opacity-60">
                            <h3 className="text-base-muted font-mono text-sm uppercase tracking-widest mb-4">Outgoing Signals</h3>
                            <div className="space-y-2">
                               {sentRequests.map(req => (
                                  <div key={req.id} className="p-3 bg-base-content/5 rounded-lg flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-base-content/10 flex items-center justify-center">
                                           <Wifi className="w-4 h-4 animate-pulse" />
                                        </div>
                                        <span className="font-mono text-sm">{req.username}</span>
                                     </div>
                                     <span className="text-xs text-base-muted">Awaiting Response...</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                  )}
               </motion.div>
             )}

             {/* ADD / UPLINK VIEW */}
             {activeTab === 'add' && (
               <motion.div 
                 key="add"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="flex flex-col items-center justify-center h-full"
               >
                  <div className="w-full max-w-md">
                     <div className={`glass-card p-8 rounded-2xl border transition-colors duration-500 ${scanStatus === 'error' ? 'border-red-500/50' : scanStatus === 'found' ? 'border-green-500/50' : 'border-primary/30'}`}>
                        <div className="text-center mb-8">
                           <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${scanStatus === 'scanning' ? 'bg-primary/20 animate-pulse' : 'bg-base-content/5'}`}>
                              {scanStatus === 'scanning' ? <Wifi className="w-10 h-10 text-primary animate-spin" /> : 
                               scanStatus === 'found' ? <CheckCircle className="w-10 h-10 text-green-500" /> :
                               scanStatus === 'error' ? <XCircle className="w-10 h-10 text-red-500" /> :
                               <Search className="w-10 h-10 text-base-muted" />
                              }
                           </div>
                           <h2 className="text-2xl font-bold mb-2">Establish Frequency Uplink</h2>
                           <p className="text-base-muted text-sm">Enter the target's Net-Signature (Username or Net-ID: XXX-XXX) to broadcast a handshake request.</p>
                        </div>

                        <form onSubmit={handleSendRequest} className="relative">
                           <input 
                             type="text" 
                             value={addUsername}
                             onChange={(e) => setAddUsername(e.target.value)}
                             placeholder="Username or Net-ID (123-456)..."
                             className="w-full bg-base-navy border border-base-content/20 rounded-xl px-4 py-4 pl-12 text-lg font-mono focus:ring-2 focus:ring-primary focus:border-primary outline-none text-white"
                             disabled={scanStatus === 'scanning'}
                           />
                           <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 text-base-muted w-5 h-5" />
                           
                           <button 
                             type="submit"
                             disabled={!addUsername || scanStatus === 'scanning'}
                             className="w-full mt-4 py-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                           >
                             {scanStatus === 'scanning' ? 'Scanning Network...' : 'Broadcast Handshake'}
                           </button>
                        </form>

                        {scanMsg && (
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className={`mt-4 text-center text-sm font-mono ${scanStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}
                           >
                              {scanMsg}
                           </motion.div>
                        )}
                     </div>
                  </div>
               </motion.div>
             )}

           </AnimatePresence>
        </div>

         {/* Challenge Invitation Modal */}
         <AnimatePresence>
           {incomingChallenge && (
             <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 50 }}
               className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
             >
               <div className="glass-card p-6 rounded-2xl border border-primary/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] bg-base-dark/95 backdrop-blur-xl">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                     <Sword className="w-6 h-6 text-primary" />
                   </div>
                   <div className="flex-1">
                     <h3 className="font-bold text-lg mb-1">Incoming Challenge!</h3>
                     <p className="text-base-muted text-sm mb-4">
                       <span className="text-white font-bold">{incomingChallenge.challengerName}</span> wants to race you.
                     </p>
                     <div className="flex gap-2">
                       <button
                         onClick={() => respondToChallenge(true)}
                         className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm transition-all"
                       >
                         Accept
                       </button>
                       <button
                         onClick={() => respondToChallenge(false)}
                         className="flex-1 py-2 bg-base-content/10 hover:bg-red-500/20 hover:text-red-400 text-base-content rounded-lg font-bold text-sm transition-all"
                       >
                         Decline
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>

         {/* Unfriend Confirmation Modal */}
         <AnimatePresence>
           {unfriendConfirm && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
               onClick={() => setUnfriendConfirm(null)}
             >
               <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="glass-card p-6 rounded-2xl border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-base-dark/95 backdrop-blur-xl max-w-md w-full"
                 onClick={(e) => e.stopPropagation()}
               >
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                     <Shield className="w-6 h-6 text-red-400" />
                   </div>
                   <div className="flex-1">
                     <h3 className="font-bold text-lg mb-1 text-red-400">Sever Connection?</h3>
                     <p className="text-base-muted text-sm mb-4">
                       Are you sure you want to remove <span className="text-white font-bold">{unfriendConfirm.username}</span> from your network? This action cannot be undone.
                     </p>
                     <div className="flex gap-2">
                       <button
                         onClick={() => {
                           removeFriend(unfriendConfirm.id);
                           setUnfriendConfirm(null);
                         }}
                         className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-all"
                       >
                         Yes, Remove
                       </button>
                       <button
                         onClick={() => setUnfriendConfirm(null)}
                         className="flex-1 py-2 bg-base-content/10 hover:bg-white/10 text-base-content rounded-lg font-bold text-sm transition-all"
                       >
                         Cancel
                       </button>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>

         {/* Profile Dossier Modal */}
         <AnimatePresence>
           {selectedFriend && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
               onClick={() => setSelectedFriend(null)}
             >
               <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="glass-card p-6 rounded-2xl border border-primary/30 shadow-[0_0_30px_rgba(34,197,94,0.2)] bg-base-dark/95 backdrop-blur-xl max-w-md w-full"
                 onClick={(e) => e.stopPropagation()}
               >
                 {/* Header */}
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                     <Users className="w-10 h-10 text-base-content/50" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold text-white">{selectedFriend.username}</h3>
                     <div className="text-sm text-primary font-mono">Net-ID: {selectedFriend.netId || '###-###'}</div>
                     <div className="flex items-center gap-2 mt-1">
                       <span className={`w-2 h-2 rounded-full ${selectedFriend.isOnline ? 'bg-green-500' : 'bg-base-muted'}`}></span>
                       <span className="text-xs text-base-muted">{selectedFriend.activityStatus || (selectedFriend.isOnline ? 'Online' : 'Offline')}</span>
                     </div>
                   </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-base-content/5 rounded-lg p-3 text-center">
                     <div className="text-xs text-base-muted mb-1">Rank</div>
                     <div className="text-lg font-bold text-primary">{selectedFriend.rank || 'Unranked'}</div>
                   </div>
                   <div className="bg-base-content/5 rounded-lg p-3 text-center">
                     <div className="text-xs text-base-muted mb-1">Intimacy</div>
                     <div className="text-lg font-bold text-yellow-400">{selectedFriend.intimacy || 0}%</div>
                   </div>
                   <div className="bg-base-content/5 rounded-lg p-3 text-center">
                     <div className="text-xs text-base-muted mb-1">Best WPM</div>
                     <div className="text-lg font-bold text-green-400">{selectedFriend.stats?.bestWPM || '??'}</div>
                   </div>
                   <div className="bg-base-content/5 rounded-lg p-3 text-center">
                     <div className="text-xs text-base-muted mb-1">Races</div>
                     <div className="text-lg font-bold text-blue-400">{selectedFriend.stats?.races || '??'}</div>
                   </div>
                 </div>

                 {/* Connection Info */}
                 <div className="bg-base-content/5 rounded-lg p-3 mb-6">
                   <div className="text-xs text-base-muted mb-2">Connection Status</div>
                   <div className="flex justify-between text-sm">
                     <span className="text-base-content">Friends Since</span>
                     <span className="text-base-muted font-mono">
                       {selectedFriend.since ? new Date(selectedFriend.since).toLocaleDateString() : 'Unknown'}
                     </span>
                   </div>
                 </div>

                 {/* Actions */}
                 <div className="flex gap-2">
                   <button
                     onClick={() => {
                       handleChallenge(selectedFriend);
                       setSelectedFriend(null);
                     }}
                     className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                   >
                     <Sword className="w-4 h-4" />
                     Challenge
                   </button>
                   <button
                     onClick={() => {
                       handlePoke(selectedFriend);
                       setSelectedFriend(null);
                     }}
                     className="flex-1 py-3 bg-base-content/10 hover:bg-base-content/20 text-base-content rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                   >
                     <Zap className="w-4 h-4" />
                     Poke
                   </button>
                 </div>

                 <button
                   onClick={() => setSelectedFriend(null)}
                   className="w-full mt-3 py-2 text-base-muted hover:text-white text-sm transition-colors"
                 >
                   Close
                 </button>
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>

         {/* Poke/DM Modal */}
         <AnimatePresence>
           {pokeModalOpen && pokeTarget && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
               onClick={() => setPokeModalOpen(false)}
             >
               <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="glass-card p-6 rounded-2xl border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-base-dark/95 backdrop-blur-xl max-w-md w-full"
                 onClick={(e) => e.stopPropagation()}
               >
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                     <Zap className="w-6 h-6 text-yellow-400" />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg">Send Signal to {pokeTarget.username}</h3>
                     <p className="text-sm text-base-muted">Quick message or poke</p>
                   </div>
                 </div>

                 <div className="space-y-3 mb-4">
                   <button
                     onClick={() => setPokeMessage('Ready to race?')}
                     className={`w-full py-2 px-4 rounded-lg text-sm text-left transition-all ${pokeMessage === 'Ready to race?' ? 'bg-primary text-white' : 'bg-base-content/5 hover:bg-base-content/10 text-base-content'}`}
                   >
                     Ready to race?
                   </button>
                   <button
                     onClick={() => setPokeMessage('Good game!')}
                     className={`w-full py-2 px-4 rounded-lg text-sm text-left transition-all ${pokeMessage === 'Good game!' ? 'bg-primary text-white' : 'bg-base-content/5 hover:bg-base-content/10 text-base-content'}`}
                   >
                     Good game!
                   </button>
                   <button
                     onClick={() => setPokeMessage('Want to practice?')}
                     className={`w-full py-2 px-4 rounded-lg text-sm text-left transition-all ${pokeMessage === 'Want to practice?' ? 'bg-primary text-white' : 'bg-base-content/5 hover:bg-base-content/10 text-base-content'}`}
                   >
                     Want to practice?
                   </button>
                 </div>

                 <div className="relative mb-4">
                   <input
                     type="text"
                     value={pokeMessage}
                     onChange={(e) => setPokeMessage(e.target.value)}
                     placeholder="Or type a custom message..."
                     className="w-full bg-base-navy border border-base-content/20 rounded-lg px-4 py-3 text-white placeholder-base-muted focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                   />
                 </div>

                 <div className="flex gap-2">
                   <button
                     onClick={sendPoke}
                     disabled={!pokeMessage}
                     className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                   >
                     <Zap className="w-4 h-4" />
                     Send Signal
                   </button>
                   <button
                     onClick={() => setPokeModalOpen(false)}
                     className="flex-1 py-3 bg-base-content/10 hover:bg-base-content/20 text-base-content font-bold rounded-lg transition-all"
                   >
                     Cancel
                   </button>
                 </div>
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>

       </div>
     </div>
   );
 };

export default Network;
