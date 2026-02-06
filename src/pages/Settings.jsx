import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Gamepad2, Keyboard, Palette, Volume2, Bell, Lock, Cpu, 
  Save, RotateCcw, Trash2, Check, Smartphone, Monitor, Globe, Mail, Eye, Download, AlertTriangle,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import Navbar from '../components/Navbar';
import { getUserAvatarDisplay, isCustomAvatar, getAvatarsByCategory } from '../config/avatars';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'gameplay', label: 'Gameplay', icon: Gamepad2 },
  { id: 'typing', label: 'Typing', icon: Keyboard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'audio', label: 'Audio', icon: Volume2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'advanced', label: 'Advanced', icon: Cpu },
];

  const SectionTitle = ({ title, desc }) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-base-content mb-1">{title}</h2>
      <p className="text-base-muted text-sm">{desc}</p>
    </div>
  );

  const SettingCard = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl border border-white/5 mb-6">
      {title && <h3 className="text-lg font-bold text-gray-200 mb-4 border-b border-white/5 pb-2">{title}</h3>}
      {children}
    </div>
  );

  const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium text-gray-200">{label}</div>
        <div className="text-xs text-base-muted">{desc}</div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-gray-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );

const Input = ({ label, value, type = "text", placeholder, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-base-muted mb-1">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-base-navy/30 border border-base-content/10 rounded-lg px-4 py-2 text-base-content focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
      />
    </div>
  );

  const Select = ({ label, options, value, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-base-muted mb-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-base-navy/30 border border-base-content/10 rounded-lg px-4 py-2 text-base-content focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const Slider = ({ label, value, onChange }) => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-base-muted">{label}</label>
        <span className="text-sm text-primary font-mono">{value}%</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );

const AccountTab = ({ user, fileInputRef, handleFileChange, handleAvatarSelect }) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [formData, setFormData] = useState({
      username: user?.username || '',
      displayTitle: user?.displayTitle || '',
      bio: user?.bio || '',
      country: user?.country || 'Global',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    
    const avatarDisplay = getUserAvatarDisplay(user);
    const isCustom = isCustomAvatar(user?.avatar);
    const avatarsByCategory = getAvatarsByCategory();

    const handleInputChange = (field) => (e) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Account Settings" desc="Manage your identity and public profile information." />
      
      <SettingCard title="Public Profile">
        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            {/* Current Avatar Display */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-2xl border-2 border-base-content/10 flex items-center justify-center overflow-hidden relative group bg-base-content/5">
                     <img 
                        src={avatarDisplay.imageSrc} 
                        alt={avatarDisplay.name}
                        className="w-full h-full object-cover"
                     />
                     
                     {/* Overlay for actions on hover */}
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        <button 
                            onClick={() => setIsPreviewOpen(true)}
                            className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                            title="Preview"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-primary hover:bg-primary-hover rounded-lg text-white text-xs font-bold transition-colors"
                        >
                            Change
                        </button>
                     </div>
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold text-base-content mb-1">{avatarDisplay.name}</p>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                    >
                        Upload Custom
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/gif"
                    />
                </div>
            </div>

            {/* Avatar Selection Grid */}
            <div className="flex-1">
                <label className="block text-sm font-medium text-base-muted mb-3">Choose Your Avatar</label>
                
                {Object.entries(avatarsByCategory).map(([category, categoryAvatars]) => (
                    <div key={category} className="mb-6">
                        <h4 className="text-xs font-bold text-base-muted uppercase tracking-wider mb-3">{category}</h4>
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                            {categoryAvatars.map((avatar) => {
                                const isSelected = user?.avatar === avatar.id;
                                return (
                                    <button
                                        key={avatar.id}
                                        onClick={() => handleAvatarSelect(avatar.id)}
                                        className={`relative aspect-square rounded-xl flex items-center justify-center border-2 transition-all duration-200 overflow-hidden group ${
                                            isSelected 
                                            ? `border-[${avatar.themeColor}] shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-110 z-10` 
                                            : 'border-transparent hover:border-base-content/20 hover:scale-105'
                                        }`}
                                        style={{
                                            borderColor: isSelected ? avatar.themeColor : undefined,
                                            boxShadow: isSelected ? `0 0 20px ${avatar.themeColor}40` : undefined
                                        }}
                                        title={`${avatar.name}${avatar.description ? ` - ${avatar.description}` : ''}`}
                                    >
                                        <img 
                                            src={avatar.image} 
                                            alt={avatar.name}
                                            className={`w-full h-full object-cover transition-transform duration-200 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                                        />
                                        
                                        {/* Selection indicator */}
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        
                                        {/* Hover tooltip */}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                            <div className="bg-base-navy border border-base-content/20 px-2 py-1 rounded text-xs text-base-content shadow-lg">
                                                {avatar.name}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>

<div className="grid md:grid-cols-2 gap-4">
          <Input 
            label="Username" 
            value={formData.username} 
            onChange={handleInputChange('username')}
          />
          <Input 
            label="Display Title" 
            value={formData.displayTitle}
            placeholder="e.g. Speed Demon"
            onChange={handleInputChange('displayTitle')}
          />
          <Input 
            label="Bio" 
            value={formData.bio}
            placeholder="Tell the world about yourself..."
            onChange={handleInputChange('bio')}
          />
          <Select 
            label="Country / Region" 
            options={['Global', 'North America', 'Europe', 'Asia']} 
            value={formData.country} 
            onChange={(v) => setFormData(prev => ({ ...prev, country: v }))}
          />
        </div>
      </SettingCard>

<SettingCard title="Contact Info">
        <div className="grid md:grid-cols-2 gap-4">
          <Input 
            label="Email Address" 
            value={formData.email} 
            type="email" 
            onChange={handleInputChange('email')}
          />
          <Input 
            label="Phone Number" 
            value={formData.phone}
            placeholder="+1 (555) 000-0000" 
            type="tel"
            onChange={handleInputChange('phone')}
          />
        </div>
      </SettingCard>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }}
              className="bg-base-dark border border-white/10 p-2 rounded-2xl max-w-lg w-full aspect-square flex flex-col items-center justify-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 w-full flex items-center justify-center p-4">
                 <img 
                    src={avatarDisplay.imageSrc} 
                    alt={avatarDisplay.name}
                    className="w-full h-full object-contain rounded-xl"
                 />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                 <p className="text-xl font-bold text-white">{avatarDisplay.name}</p>
                 {!isCustom && avatarDisplay.avatar?.description && (
                    <p className="text-sm text-base-muted mt-1">{avatarDisplay.avatar.description}</p>
                 )}
              </div>
               <button 
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    );
};

const SecurityTab = ({ changePassword }) => {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handlePasswordChange = async () => {
      try {
        setPasswordError('');
        setIsChangingPassword(true);

        // Validation
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
          throw new Error('All fields are required');
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
          throw new Error('New password must be different from current password');
        }

        if (passwordData.newPassword.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
          throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
          throw new Error('New passwords do not match');
        }

        // Use AuthContext changePassword function
        const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

        if (result.success) {
          // Password changed successfully
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setIsPasswordModalOpen(false);
          alert('Password changed successfully!');
        } else {
          throw new Error(result.error);
        }
        
      } catch (error) {
        setPasswordError(error.message);
      } finally {
        setIsChangingPassword(false);
      }
    };

    const handlePasswordInputChange = (field) => (e) => {
      setPasswordData(prev => ({ ...prev, [field]: e.target.value }));
      setPasswordError(''); // Clear error on input
    };

    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Security & Login" desc="Protect your account and manage sessions." />
      
      <SettingCard title="Password">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="font-bold text-base-content">Change Password</div>
            <div className="text-xs text-base-muted">Last changed 3 months ago</div>
          </div>
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-4 py-2 border border-base-content/10 hover:bg-base-content/5 rounded-lg text-sm transition-all"
          >
            Update
          </button>
        </div>
      </SettingCard>

      <SettingCard title="Two-Factor Authentication">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-green-500/10 rounded-full text-green-400">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-base-content">Authenticator App</div>
            <div className="text-xs text-base-muted">Secure your account with TOTP (Google Auth, Authy).</div>
          </div>
          <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold transition-all">Enable</button>
        </div>
      </SettingCard>

<SettingCard title="Active Sessions">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-base-content/5 rounded-lg">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-base-muted" />
              <div>
                <div className="text-sm font-bold text-base-content">Windows PC (Chrome)</div>
                <div className="text-xs text-green-400">● Active now • New York, USA</div>
              </div>
            </div>
          </div>
        </div>
        <button className="mt-4 text-sm text-red-400 hover:text-red-300 font-bold flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Log out of all devices
        </button>
      </SettingCard>

      {/* Password Change Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsPasswordModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-base-dark border border-white/10 p-6 rounded-2xl max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-base-content mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-base-muted mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange('currentPassword')}
                    className="w-full bg-base-navy/30 border border-base-content/10 rounded-lg px-4 py-2 text-base-content focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-base-muted mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange('newPassword')}
                    className="w-full bg-base-navy/30 border border-base-content/10 rounded-lg px-4 py-2 text-base-content focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
                    placeholder="Enter new password (min 8 chars)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-base-muted mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange('confirmPassword')}
                    className="w-full bg-base-navy/30 border border-base-content/10 rounded-lg px-4 py-2 text-base-content focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{passwordError}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError('');
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 border border-base-content/10 hover:bg-base-content/5 rounded-lg text-sm transition-all"
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>

              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-base-muted hover:text-base-content transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
);
  };

  const GameplayTab = ({ settings, updateSettings }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Gameplay Settings" desc="Customize your race experience." />
      
      <SettingCard title="Race Behavior">
        <Select 
          label="Default Mode" 
          options={['Ranked', 'Quick Race', 'Practice']} 
          value={settings.defaultMode} 
          onChange={(v) => updateSettings({ defaultMode: v })}
        />
        <Select 
          label="Countdown Length" 
          options={['3 Seconds', '5 Seconds', '10 Seconds']} 
          value={settings.countdownLength} 
          onChange={(v) => updateSettings({ countdownLength: v })}
        />
        <Toggle 
          label="Auto-Join Next Match" 
          desc="Automatically queue for a new race after finishing." 
          checked={settings.autoJoin} 
          onChange={(v) => updateSettings({ autoJoin: v })}
        />
        <Toggle 
          label="Live Opponent WPM" 
          desc="Show opponent speeds in real-time." 
          checked={settings.liveWpm} 
          onChange={(v) => updateSettings({ liveWpm: v })}
        />
      </SettingCard>

      <SettingCard title="Matchmaking">
<Select 
          label="Preferred Region" 
          options={['Auto (Best Latency)', 'US East', 'Europe', 'Asia']} 
          value={settings.preferredRegion || 'Auto (Best Latency)'} 
          onChange={(v) => updateSettings({ preferredRegion: v })}
        />
        <Toggle 
          label="Cross-Platform Play" 
          desc="Match with mobile/console players." 
          checked={settings.crossPlatform} 
          onChange={(v) => updateSettings({ crossPlatform: v })}
        />
      </SettingCard>
    </motion.div>
  );

  const TypingTab = ({ settings, updateSettings }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Typing Preferences" desc="Fine-tune your keyboard feel." />
      
      <SettingCard>
        <div className="grid md:grid-cols-2 gap-4">
          <Select 
            label="Keyboard Layout" 
            options={['QWERTY', 'AZERTY', 'Dvorak', 'Colemak']} 
            value={settings.layout} 
            onChange={(v) => updateSettings({ layout: v })}
          />
          <Select 
            label="Target Language" 
            options={['English', 'Spanish', 'French', 'Code (JS)']} 
            value={settings.language} 
            onChange={(v) => updateSettings({ language: v })}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Select 
            label="Font Family" 
            options={['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'System']} 
            value={settings.fontFamily} 
            onChange={(v) => updateSettings({ fontFamily: v })}
          />
          <Select 
            label="Font Size" 
            options={['Small', 'Medium', 'Large', 'Extra Large']} 
            value={settings.fontSize} 
            onChange={(v) => updateSettings({ fontSize: v })}
          />
        </div>
      </SettingCard>

      <SettingCard title="Visual Feedback">
        <Toggle 
          label="Highlight Mistakes" 
          desc="Turn incorrect letters red immediately." 
          checked={settings.highlightMistakes} 
          onChange={(v) => updateSettings({ highlightMistakes: v })}
        />
        <Toggle 
          label="Caret Animation" 
          desc="Smooth caret movement." 
          checked={settings.caretAnimation} 
          onChange={(v) => updateSettings({ caretAnimation: v })}
        />
        <Select 
          label="Caret Style" 
          options={['Line', 'Block', 'Underline', 'None']} 
          value={settings.caretStyle} 
          onChange={(v) => updateSettings({ caretStyle: v })}
        />
      </SettingCard>
    </motion.div>
  );

  const AppearanceTab = ({ settings, updateSettings }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Appearance" desc="Make the platform yours." />
      
      <SettingCard title="Theme">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {['Dark', 'Midnight', 'Neon', 'Light'].map(theme => (
            <button 
              key={theme} 
              onClick={() => updateSettings({ theme })}
              className={`p-2 rounded-lg border text-sm transition-all ${
                settings.theme === theme 
                ? 'border-primary bg-primary/20 text-base-content shadow-md' 
                : 'border-base-content/10 bg-base-content/5 text-base-muted hover:bg-white/10'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
        <Select 
          label="Accent Color" 
          options={['Electric Blue', 'Cyber Purple', 'Toxic Green', 'Crimson Red']} 
          value={settings.accentColor} 
          onChange={(v) => updateSettings({ accentColor: v })}
        />
      </SettingCard>

      <SettingCard title="Effects">
        <Toggle 
          label="Background Animations" 
          desc="Grid movements and particles." 
          checked={settings.backgroundAnimations} 
          onChange={(v) => updateSettings({ backgroundAnimations: v })}
        />
        <Toggle 
          label="Glow Intensity" 
          desc="Neon bloom effects on text." 
          checked={settings.glowIntensity} 
          onChange={(v) => updateSettings({ glowIntensity: v })}
        />
        <Toggle 
          label="Reduced Motion" 
          desc="Minimize animations for accessibility." 
          checked={settings.reducedMotion} 
          onChange={(v) => updateSettings({ reducedMotion: v })}
        />
      </SettingCard>
    </motion.div>
  );

  const AudioTab = ({ settings, updateSettings }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Audio Settings" desc="Control the soundscape of your races." />
      
      <SettingCard title="Volume Control">
        <Slider label="Master Volume" value={settings.masterVolume} onChange={(v) => updateSettings({ masterVolume: v })} />
        <Slider label="SFX Volume" value={settings.sfxVolume} onChange={(v) => updateSettings({ sfxVolume: v })} />
        <Slider label="Music Volume" value={settings.musicVolume} onChange={(v) => updateSettings({ musicVolume: v })} />
      </SettingCard>

      <SettingCard title="Sound Effects">
        <Toggle label="Keystroke Sounds" desc="Mechanical keyboard click sounds." checked={settings.keystrokeSounds} onChange={(v) => updateSettings({ keystrokeSounds: v })} />
        <Toggle label="Error Sounds" desc="Audio feedback on mistakes." checked={settings.errorSounds} onChange={(v) => updateSettings({ errorSounds: v })} />
        <Toggle label="Victory / Defeat Music" desc="Play themes at end of race." checked={settings.musicEnabled} onChange={(v) => updateSettings({ musicEnabled: v })} />
        <Select label="Voice Alerts" options={['None', 'Standard', 'Cyberpunk']} value={settings.voiceAlerts} onChange={(v) => updateSettings({ voiceAlerts: v })} />
      </SettingCard>
    </motion.div>
  );

  const NotificationsTab = ({ settings, updateSettings }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Notifications" desc="Manage how and when we contact you." />
      
      <SettingCard title="In-Game Notifications">
        <Toggle label="Match Invites" desc="Popups when friends challenge you." checked={settings.matchInvites} onChange={(v) => updateSettings({ matchInvites: v })} />
        <Toggle label="Friend Requests" desc="Alerts for new social connections." checked={settings.friendRequests} onChange={(v) => updateSettings({ friendRequests: v })} />
        <Toggle label="System Alerts" desc="Maintenance and server status updates." checked={settings.systemAlerts} onChange={(v) => updateSettings({ systemAlerts: v })} />
      </SettingCard>

      <SettingCard title="External">
        <Toggle label="Email Summaries" desc="Weekly progress reports." checked={settings.emailSummaries} onChange={(v) => updateSettings({ emailSummaries: v })} />
        <Toggle label="Push Notifications" desc="Browser alerts for matches." checked={settings.pushNotifications} onChange={(v) => updateSettings({ pushNotifications: v })} />
      </SettingCard>
    </motion.div>
  );

  const PrivacyTab = ({ settings, updateSettings }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Privacy & Social" desc="Control your visibility and data." />
      
      <SettingCard title="Social Visibility">
        <Select label="Profile Visibility" options={['Public', 'Friends Only', 'Private']} value={settings.profileVisibility} onChange={(v) => updateSettings({ profileVisibility: v })} />
        <Toggle label="Show Online Status" desc="Let friends see when you are active." checked={settings.showOnlineStatus} onChange={(v) => updateSettings({ showOnlineStatus: v })} />
        <Toggle label="Allow Challenges" desc="Receive race invites from strangers." checked={settings.allowChallenges} onChange={(v) => updateSettings({ allowChallenges: v })} />
      </SettingCard>

      <SettingCard title="Data Management">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-base-content">Export Data</div>
            <div className="text-xs text-base-muted">Download a copy of your race history.</div>
          </div>
          <button className="px-4 py-2 border border-base-content/10 hover:bg-base-content/5 rounded-lg text-sm transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Download JSON
          </button>
        </div>
      </SettingCard>
    </motion.div>
  );

  const AdvancedTab = ({ settings, updateSettings }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle title="Advanced Settings" desc="Developer tools and system utilities." />
      
      <SettingCard title="Performance Overlay">
        <Toggle label="Show FPS Counter" desc="Display frames per second." checked={settings.showFps} onChange={(v) => updateSettings({ showFps: v })} />
        <Toggle label="Show Network Stats" desc="Ping and packet loss info." checked={settings.showNetwork} onChange={(v) => updateSettings({ showNetwork: v })} />
        <Toggle label="Detailed Debug Info" desc="Show raw input latency data." checked={settings.debugInfo} onChange={(v) => updateSettings({ debugInfo: v })} />
      </SettingCard>

      <SettingCard title="Maintenance">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-base-content">Clear Local Cache</div>
              <div className="text-xs text-base-muted">Fixes loading issues.</div>
            </div>
            <button className="px-4 py-2 bg-base-content/5 hover:bg-white/10 rounded-lg text-sm">Clear</button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-base-content">Reset Practice Data</div>
              <div className="text-xs text-base-muted">Clears local drill history only.</div>
            </div>
            <button className="px-4 py-2 bg-base-content/5 hover:bg-white/10 rounded-lg text-sm">Reset</button>
          </div>
        </div>
      </SettingCard>

      <div className="mt-8 glass-card p-6 rounded-2xl border border-red-500/20 bg-red-900/5">
        <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-base-content">Delete Account</div>
            <div className="text-xs text-red-400/70">Permanently remove your account and all data.</div>
          </div>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold">Delete</button>
        </div>
      </div>
    </motion.div>
  );

const Settings = () => {
  const { user, uploadAvatar, updateAvatar, changePassword } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('account');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        if (file.size > 2 * 1024 * 1024) {
          throw new Error("File size too large (max 2MB)");
        }
        const result = await uploadAvatar(file);
        if (result.success) {
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        } else {
          throw new Error(result.error || "Upload failed");
        }
      } catch (error) {
        console.error("Avatar upload error:", error);
        alert(error.message || "Upload failed. Please try again.");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

const handleAvatarSelect = async (avatarId) => {
    try {
      const result = await updateAvatar(avatarId);
      if (result.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        throw new Error(result.error || "Failed to update avatar");
      }
    } catch (error) {
      console.error("Avatar update error:", error);
      alert(error.message || "Failed to update avatar. Please try again.");
    }
  };

  const handleSave = () => {
    // Settings are auto-saved to context/localStorage on change, 
    // but this gives visual feedback.
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-base-dark text-base-content font-sans">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card p-4 rounded-2xl border border-white/5">
              <h3 className="text-xs font-bold text-base-muted uppercase tracking-widest mb-4 px-3">Settings</h3>
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'text-base-muted hover:bg-base-content/5 hover:text-base-content'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'account' && <AccountTab user={user} fileInputRef={fileInputRef} handleFileChange={handleFileChange} handleAvatarSelect={handleAvatarSelect} />}
                {activeTab === 'security' && <SecurityTab changePassword={changePassword} />}
                {activeTab === 'gameplay' && <GameplayTab settings={settings} updateSettings={updateSettings} />}
                {activeTab === 'typing' && <TypingTab settings={settings} updateSettings={updateSettings} />}
                {activeTab === 'appearance' && <AppearanceTab settings={settings} updateSettings={updateSettings} />}
                {activeTab === 'audio' && <AudioTab settings={settings} updateSettings={updateSettings} />}
                {activeTab === 'notifications' && <NotificationsTab settings={settings} updateSettings={updateSettings} />}
                {activeTab === 'privacy' && <PrivacyTab settings={settings} updateSettings={updateSettings} />}
                {activeTab === 'advanced' && <AdvancedTab settings={settings} updateSettings={updateSettings} />}
              </motion.div>
            </AnimatePresence>

            {/* Action Bar */}
            <div className="mt-8 flex justify-end gap-4 border-t border-base-content/10 pt-6">
              <button 
                onClick={resetSettings}
                className="px-6 py-3 text-base-muted hover:text-base-content font-medium transition-colors"
              >
                Reset to Default
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all"
              >
                {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {isSaved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
