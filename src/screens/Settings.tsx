// components/ProductCard.tsx (Web)
import React from 'react';

interface ProductCardProps {
  productName: string;
  price: number;
  imageUrl: string;
  description: string;
  onAddToCart: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  price,
  imageUrl,
  description,
  onAddToCart,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 p-4 flex flex-col">
      <img className="w-full h-48 object-cover mb-4" src={imageUrl} alt={productName} />
      <div className="px-6 py-4 flex-grow">
        <div className="font-bold text-xl mb-2 text-gray-800">{productName}</div>
        <p className="text-gray-700 text-base mb-4">{description}</p>
        <div className="flex items-baseline justify-between mt-auto">
          <span className="text-2xl font-bold text-indigo-600">${price.toFixed(2)}</span>
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            onClick={() => onAddToCart(productName)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
// components/ProductCard.tsx (React Native)
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native'; // Import React Native components

interface ProductCardProps {
  productName: string;
  price: number;
  imageUrl: string;
  description: string;
  onAddToCart: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  price,
  imageUrl,
  description,
  onAddToCart,
}) => {
  return (
    <View className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 p-4 flex flex-col">
      <Image
        className="w-full h-48 object-cover mb-4" // NativeWind handles object-cover -> resizeMode: 'cover'
        source={{ uri: imageUrl }} // Use source prop for images
        accessibilityLabel={productName} // Good practice for accessibility
      />
      <View className="px-6 py-4 flex-grow">
        <Text className="font-bold text-xl mb-2 text-gray-800">{productName}</Text>
        <Text className="text-gray-700 text-base mb-4">{description}</Text>
        <View className="flex items-baseline justify-between mt-auto">
          <Text className="text-2xl font-bold text-indigo-600">${price.toFixed(2)}</Text>
          <Pressable // Use Pressable for clickable elements
            className="bg-indigo-500 active:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full" // active: for hover effect in RN
            onPress={() => onAddToCart(productName)} // onClick becomes onPress
          >
            <Text className="text-white font-bold">Add to Cart</Text> {/* Text inside Pressable */}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
npm install nativewind
# or
yarn add nativewind
npm install -D tailwindcss
# or
yarn add -D tailwindcss
npx tailwindcss init
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"], // Adjust paths to your components
  theme: {
    extend: {},
  },
  plugins: [],
};
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['nativewind/babel'], // Add this line
};
// App.tsx
import './global.css'; // Or wherever your global styles are
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import ProductCard from './components/ProductCard'; // Your new component

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <ProductCard
        productName="Wireless Headphones"
        price={99.99}
        imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        description="Experience immersive sound with these comfortable and stylish wireless headphones."
        onAddToCart={(name) => console.log(`Added ${name} to cart!`)}
      />
      <StatusBar style="auto" />
    </View>
  );
}

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../context';
import * as ReactRouterDOM from 'react-router-dom';
import { Moon, Sun, Monitor, Type, Volume2, Eye, LogOut, Shield, Save, Upload, CheckCircle, Bell, Smartphone, Zap, Award, Speaker, Vibrate, Lock, MapPin, Phone, MessageSquare, ToggleRight, UserCog, User, Megaphone, Loader2 } from 'lucide-react';
import { NotificationPreferences, PrivacySettings } from '../types';

// Fix: Destructure from ReactRouterDOM to bypass potential named export resolution issues
const { useNavigate } = ReactRouterDOM;

const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
    <button 
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-violet-500 ${enabled ? 'bg-violet-600' : 'bg-slate-700'}`}
    >
        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

export default function SettingsView() {
  const { user, updateUser, simulateReferral } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'app'>('account');
  
  // Feedback Form State
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Account Form State (Local draft)
  const [accountForm, setAccountForm] = useState({
      location: user?.location || '',
      phoneNumber: user?.phoneNumber || '',
      email: user?.email || ''
  });

  const [isSaving, setIsSaving] = useState(false);

  // Sync form with user data when it's loaded or changed
  useEffect(() => {
    if (user) {
      setAccountForm({
        location: user.location || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
      current: '',
      new: '',
      confirm: ''
  });

  const handleAccountSave = async () => {
      if (!user) return;
      setIsSaving(true);
      try {
        await updateUser({
            location: accountForm.location,
            phoneNumber: accountForm.phoneNumber,
            email: accountForm.email
        });
      } finally {
        setIsSaving(false);
      }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordForm.new !== passwordForm.confirm) {
          alert("New passwords do not match.");
          return;
      }
      alert("Password changed successfully (Simulated).");
      setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFeedbackSent(true);
      setTimeout(() => {
          setFeedback('');
          setFeedbackSent(false);
      }, 3000);
  };

  const toggleAppSetting = (key: keyof typeof user.settings) => {
    if (!user) return;
    updateUser({
      settings: {
        ...user.settings,
        [key]: !user.settings[key]
      }
    });
  };

  const toggleNotification = (key: keyof NotificationPreferences) => {
      if (!user) return;
      updateUser({
          settings: {
              ...user.settings,
              notifications: {
                  ...user.settings.notifications,
                  [key]: !user.settings.notifications[key]
              }
          }
      });
  };

  const togglePrivacy = (key: keyof PrivacySettings) => {
      if (!user) return;
      updateUser({
          settings: {
              ...user.settings,
              privacy: {
                  ...user.settings.privacy,
                  [key]: !user.settings.privacy[key]
              }
          }
      });
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 mb-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex-1 min-w-[120px] py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${activeTab === 'account' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
              <UserCog className="w-4 h-4 mr-2" /> Account
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 min-w-[120px] py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${activeTab === 'notifications' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
              <Bell className="w-4 h-4 mr-2" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('app')}
            className={`flex-1 min-w-[120px] py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${activeTab === 'app' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
              <Monitor className="w-4 h-4 mr-2" /> App
          </button>
      </div>

      {activeTab === 'account' && (
          <div className="space-y-6">
             {/* Personal Info */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-950/50 border-b border-slate-800 font-bold text-white flex items-center justify-between">
                    <div className="flex items-center">
                        <UserCog className="w-5 h-5 mr-2 text-slate-400" /> Account Management
                    </div>
                    <button 
                        onClick={handleAccountSave} 
                        disabled={isSaving}
                        className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
                        Save Changes
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={accountForm.email} 
                            onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                            <input 
                                type="tel" 
                                value={accountForm.phoneNumber} 
                                onChange={(e) => setAccountForm({...accountForm, phoneNumber: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:border-violet-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                        <div className="relative">
                            <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                            <input 
                                type="text" 
                                value={accountForm.location} 
                                onChange={(e) => setAccountForm({...accountForm, location: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:border-violet-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
             </div>

             {/* Privacy Controls */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-950/50 border-b border-slate-800 font-bold text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-slate-400" /> Privacy Controls
                </div>
                <div className="p-6 space-y-6 divide-y divide-slate-800">
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-white font-medium">Show Online Status</p>
                            <p className="text-sm text-slate-500">Allow friends to see when you are active.</p>
                        </div>
                        <Toggle enabled={user.settings.privacy.showOnlineStatus} onChange={() => togglePrivacy('showOnlineStatus')} />
                    </div>
                    <div className="flex items-center justify-between pt-6 py-2">
                        <div>
                            <p className="text-white font-medium">Allow Friend Requests</p>
                            <p className="text-sm text-slate-500">Let others send you friend invites.</p>
                        </div>
                        <Toggle enabled={user.settings.privacy.allowFriendRequests} onChange={() => togglePrivacy('allowFriendRequests')} />
                    </div>
                    <div className="flex items-center justify-between pt-6 py-2">
                        <div>
                            <p className="text-white font-medium">Public Profile</p>
                            <p className="text-sm text-slate-500">Make your profile visible to non-friends.</p>
                        </div>
                        <Toggle enabled={user.settings.privacy.publicProfile} onChange={() => togglePrivacy('publicProfile')} />
                    </div>
                </div>
             </div>

             {/* Password Change */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-950/50 border-b border-slate-800 font-bold text-white flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-slate-400" /> Change Password
                </div>
                <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                        <input 
                            type="password" 
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                            <input 
                                type="password" 
                                value={passwordForm.new}
                                onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={passwordForm.confirm}
                                onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Update Password
                        </button>
                    </div>
                </form>
             </div>

             {/* Logout Zone */}
             <div className="border-t border-slate-800/50 pt-6">
                <button 
                    onClick={() => { alert("Logged out"); }}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl p-4 flex items-center justify-center font-bold transition-all"
                >
                    <LogOut className="w-5 h-5 mr-2" /> Log Out of Nexgen
                </button>
             </div>
          </div>
      )}

      {activeTab === 'notifications' && (
          <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-950/50 border-b border-slate-800 font-bold text-white flex items-center justify-between">
                    <div className="flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-slate-400" /> Push Notifications
                    </div>
                    <button onClick={simulateReferral} className="text-xs text-violet-400 hover:text-violet-300">Test Notification</button>
                </div>
                <div className="p-6 space-y-6 divide-y divide-slate-800">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Match Reminders</p>
                                <p className="text-sm text-slate-500">Get notified when your match is about to start.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.notifications.matchReminders} onChange={() => toggleNotification('matchReminders')} />
                    </div>

                    <div className="flex items-center justify-between pt-6 py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Monitor className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Opponent Assignments</p>
                                <p className="text-sm text-slate-500">Know immediately when brackets are generated.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.notifications.opponentAssignments} onChange={() => toggleNotification('opponentAssignments')} />
                    </div>

                    <div className="flex items-center justify-between pt-6 py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Award className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Tournament Updates</p>
                                <p className="text-sm text-slate-500">Status changes, result confirmations, and round progression.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.notifications.tournamentUpdates} onChange={() => toggleNotification('tournamentUpdates')} />
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Award className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Leaderboard Changes</p>
                                <p className="text-sm text-slate-500">Alerts when your rank changes.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.notifications.leaderboardChanges} onChange={() => toggleNotification('leaderboardChanges')} />
                    </div>

                     <div className="flex items-center justify-between pt-6 py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <User className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Referral Rewards</p>
                                <p className="text-sm text-slate-500">Notifications when you earn XP from invites.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.notifications.referralRewards} onChange={() => toggleNotification('referralRewards')} />
                    </div>

                    <div className="flex items-center justify-between pt-6 py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Megaphone className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Admin Announcements</p>
                                <p className="text-sm text-slate-500">Direct messages and broadcasts from organizers.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.notifications.adminAnnouncements} onChange={() => toggleNotification('adminAnnouncements')} />
                    </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-950/50 border-b border-slate-800 font-bold text-white flex items-center">
                    <Smartphone className="w-5 h-5 mr-2 text-slate-400" /> Delivery Preferences
                </div>
                <div className="p-6 space-y-6 divide-y divide-slate-800">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Speaker className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Sound</p>
                                <p className="text-sm text-slate-500">Play a sound when a notification arrives.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.notifications.sound} onChange={() => toggleNotification('sound')} />
                    </div>

                    <div className="flex items-center justify-between pt-6 py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Vibrate className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Vibration</p>
                                <p className="text-sm text-slate-500">Vibrate device on notification (Mobile only).</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.notifications.vibration} onChange={() => toggleNotification('vibration')} />
                    </div>
                </div>
              </div>
          </div>
      )}

      {activeTab === 'app' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-950/50 border-b border-slate-800 font-bold text-white flex items-center">
                    <Monitor className="w-5 h-5 mr-2 text-slate-400" /> Appearance
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Theme</p>
                            <p className="text-sm text-slate-500">Select your preferred interface style.</p>
                        </div>
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            <button className="p-2 bg-slate-700 rounded text-white shadow"><Moon className="w-4 h-4" /></button>
                            <button className="p-2 text-slate-500 hover:text-white"><Sun className="w-4 h-4" /></button>
                            <button className="p-2 text-slate-500 hover:text-white"><Monitor className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-950/50 border-b border-slate-800 font-bold text-white flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-slate-400" /> Accessibility
                </div>
                <div className="p-6 space-y-6 divide-y divide-slate-800">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Monitor className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium">High Contrast Mode</p>
                                <p className="text-sm text-slate-500">Increase contrast for better visibility.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.highContrast} onChange={() => toggleAppSetting('highContrast')} />
                    </div>

                    <div className="flex items-center justify-between pt-6 py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Type className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Large Text</p>
                                <p className="text-sm text-slate-500">Increase font size across the app.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.largeText} onChange={() => toggleAppSetting('largeText')} />
                    </div>

                    <div className="flex items-center justify-between pt-6 py-2">
                        <div className="flex items-center">
                            <div className="p-2 bg-slate-800 rounded-lg mr-3 text-slate-300">
                                <Volume2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Text-to-Speech</p>
                                <p className="text-sm text-slate-500">Read screen content aloud.</p>
                            </div>
                        </div>
                        <Toggle enabled={user.settings.textToSpeech} onChange={() => toggleAppSetting('textToSpeech')} />
                    </div>
                </div>
            </div>

            {/* App Feedback */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-950/50 border-b border-slate-800 font-bold text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-slate-400" /> App Feedback
                </div>
                <div className="p-6">
                    {feedbackSent ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg flex items-center">
                            <CheckCircle className="w-5 h-5 mr-3" />
                            Thank you for your feedback! We'll look into it.
                        </div>
                    ) : (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                            <p className="text-sm text-slate-400">Found a bug or have a suggestion? Let us know!</p>
                            <textarea 
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none"
                                placeholder="Describe your experience or issue..."
                                required
                            />
                            <div className="flex justify-end">
                                <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors">
                                    Submit Feedback
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
          </div>
      )}
    </div>
  );
}
