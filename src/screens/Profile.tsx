import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native'; // For navigation.navigate
import { ShieldCheck } from '@tamagui/lucide-icons'; // Or your preferred icon library (e.g., 'lucide-react-native', 'react-native-vector-icons')

// Assume you have a User type/interface
interface User {
  id: string;
  name: string;
  isAdmin: boolean;
  // ... other user properties
}

// Example component where you might use this button
interface MyScreenProps {
  user: User; // Pass the user object as a prop
}

const MyScreen: React.FC<MyScreenProps> = ({ user }) => {
  const navigation = useNavigation(); // Initialize navigation hook

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-semibold mb-4">Welcome, {user.name}!</Text>

      {/* Other content of your screen */}

      {/* The specialized admin button */}
      {user.isAdmin && (
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminTerminal')}
          className="mt-6 flex-row items-center p-4 bg-red-900/20 border border-red-500/30 rounded-2xl"
        >
          <ShieldCheck color="#ef4444" size={20} />
          <Text className="text-red-500 font-bold ml-3">Enter Admin Terminal</Text>
        </TouchableOpacity>
      )}

      {/* More content */}
    </View>
  );
};

export default MyScreen;
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you use react-navigation
import { ShieldAlert, ChevronRight } from 'lucide-react-native'; // Your provided import

// --- Mock User Data (Replace with your actual user context/props) ---
// In a real app, 'user' would come from props, context (e.g., AuthContext), or a state management solution.
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean; // This is the key property for conditional rendering
  // Add other user properties as needed
}

// Example of a user object (for testing purposes)
const mockUser: User = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  isAdmin: true, // Set to 'false' to test hiding the terminal
};
// --- End Mock User Data ---

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  // In a real app, you would get the 'user' object from your authentication context or props.
  // For this example, we'll use the mockUser.
  const user: User = mockUser; // Replace with your actual user data source

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-6">
          <Text className="text-white text-3xl font-bold mb-2">Profile</Text>
          <Text className="text-slate-400 text-lg">Manage your account settings</Text>
        </View>

        {/* User Information Section */}
        <View className="mt-6 px-6">
          <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            Account Details
          </Text>
          <View className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
            <Text className="text-white font-bold text-lg">{user.name}</Text>
            <Text className="text-slate-400 text-sm">{user.email}</Text>
            {user.isAdmin && (
              <Text className="text-green-400 text-xs mt-2">Administrator Access</Text>
            )}
          </View>
        </View>

        {/*
          // --- START: Your Admin Terminal Code ---
          // This section will only render if user.isAdmin is true
        */}
        {user.isAdmin && (
          <View className="mt-10 px-6"> {/* Changed px-4 to px-6 for consistency */}
            <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
              System Level Access
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminTerminal')}
              className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <ShieldAlert color="#ef4444" size={24} />
                <View className="ml-4">
                  <Text className="text-white font-bold">Admin Terminal</Text>
                  <Text className="text-red-400/60 text-xs">Security & Event Controls</Text>
                </View>
              </View>
              <ChevronRight color="#ef4444" size={20} />
            </TouchableOpacity>
          </View>
        )}
        {/*
          // --- END: Your Admin Terminal Code ---
        */}

        {/* Other settings or profile options can go here */}
        <View className="mt-10 px-6">
          <Text className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            General Settings
          </Text>
          <TouchableOpacity className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex-row items-center justify-between mb-3">
            <Text className="text-white">Edit Profile</Text>
            <ChevronRight color="#94a3b8" size={20} />
          </TouchableOpacity>
          <TouchableOpacity className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex-row items-center justify-between">
            <Text className="text-white">Privacy Settings</Text>
            <ChevronRight color="#94a3b8" size={20} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
npm install lucide-react-native
# or
yarn add lucide-react-native
// src/components/WebCard.tsx
import React from 'react';

interface WebCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const WebCard: React.FC<WebCardProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      {imageUrl && (
        <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      )}
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      {buttonText && onButtonClick && (
        <div className="px-6 pt-4 pb-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default WebCard;
// src/components/NativeCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'; // Import React Native components

// Ensure NativeWind is set up in your project (e.g., tailwind.config.js)
// and that you've run `npx tailwindcss init -p` and configured it for React Native.

interface NativeCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const NativeCard: React.FC<NativeCardProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  onButtonClick,
}) => {
  return (
    // Replaced div with View
    <View className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      {imageUrl && (
        // Replaced img with Image
        // src becomes source={{ uri: '...' }} for network images
        // For local images, it would be source={require('./path/to/image.png')}
        // alt becomes accessibilityLabel
        <Image
          className="w-full h-48 object-cover" // NativeWind handles object-cover (resizeMode)
          source={{ uri: imageUrl }}
          accessibilityLabel={title}
        />
      )}
      <View className="px-6 py-4">
        {/* Replaced h2 with Text */}
        <Text className="font-bold text-xl mb-2 text-gray-800">{title}</Text>
        {/* Replaced p with Text */}
        <Text className="text-gray-700 text-base">{description}</Text>
      </View>
      {buttonText && onButtonClick && (
        <View className="px-6 pt-4 pb-2">
          {/* Replaced button with Pressable */}
          {/* onClick becomes onPress */}
          {/* NativeWind handles hover/active states for Pressable */}
          <Pressable
            className="bg-blue-500 active:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onPress={onButtonClick}
          >
            {/* Button text also needs to be wrapped in Text */}
            <Text className="text-white font-bold">{buttonText}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default NativeCard;

import React, { useState } from 'react';
import { useAppStore } from '../context';
import { Camera, Edit2, Share2, Copy, Shield, Save, X, Zap, Award, Gamepad2, Swords, Box, MessageSquare, Monitor, Plus, CheckCircle2, ShieldAlert, UserCheck, Clock } from 'lucide-react';
import { LinkedAccount } from '../types';

export default function Profile() {
  const { user, toggleOrganizerMode, updateUser, uploadAvatar, calculateLevel, submitOrganizerRequest } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
      gamertag: user?.gamertag || '',
      bio: user?.bio || ''
  });

  if (!user) return null;

  const level = calculateLevel(user.xp);
  const xpInLevel = user.xp % 1000;
  const progress = (xpInLevel / 1000) * 100;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
  };

  const saveProfile = async () => {
      await updateUser(editForm);
      setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="relative mb-20 md:mb-0">
        <div className="h-32 md:h-48 bg-gradient-to-r from-violet-900 to-indigo-900 rounded-t-2xl opacity-80"></div>
        <div className="absolute -bottom-16 md:-bottom-12 left-0 right-0 md:left-8 md:right-auto flex flex-col md:flex-row items-center md:items-end text-center md:text-left">
            <div className="relative group">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-violet-500 bg-slate-900 object-cover" />
                ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-4xl">
                        {user.gamertag[0]}
                    </div>
                )}
                <label className="absolute bottom-2 right-2 p-1.5 bg-violet-600 rounded-full text-white hover:bg-violet-500 border border-slate-600 cursor-pointer shadow-lg transition-transform hover:scale-110">
                    <Camera className="w-3 h-3 md:w-4 md:h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                </label>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-4 md:mb-3 flex-1 min-w-[200px]">
                {isEditing ? (
                    <div className="space-y-2 bg-slate-900/90 p-3 rounded-lg border border-slate-700 backdrop-blur-sm mx-4 md:mx-0">
                        <input 
                            type="text" 
                            value={editForm.gamertag}
                            onChange={(e) => setEditForm({...editForm, gamertag: e.target.value})}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-bold text-xl w-full focus:border-violet-500 outline-none"
                            placeholder="Gamertag"
                        />
                        <textarea 
                            value={editForm.bio}
                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                            rows={2}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 w-full focus:border-violet-500 outline-none"
                            placeholder="Bio"
                        />
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-col md:flex-row items-center gap-2 justify-center md:justify-start">
                             <h1 className="text-2xl md:text-3xl font-bold text-white">{user.gamertag}</h1>
                             <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-white text-xs font-bold flex items-center uppercase tracking-wider">
                                 Level {level}
                             </span>
                        </div>
                        <p className="text-slate-400 text-sm md:text-base mt-1">{user.bio || 'No bio provided.'}</p>
                    </div>
                )}
            </div>
        </div>

        <div className="absolute top-4 right-4">
            {isEditing ? (
                <div className="flex space-x-2">
                    <button onClick={saveProfile} className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg font-medium transition-colors flex items-center text-xs md:text-sm">
                        <Save className="w-3 h-3 md:w-4 md:h-4 mr-2" /> Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg backdrop-blur-sm font-medium transition-colors flex items-center text-xs md:text-sm">
                        <X className="w-3 h-3 md:w-4 md:h-4 mr-2" /> Cancel
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 md:px-4 md:py-2 bg-black/20 hover:bg-black/40 text-white rounded-lg backdrop-blur-sm text-xs md:text-sm font-medium transition-colors flex items-center">
                    <Edit2 className="w-3 h-3 md:w-4 md:h-4 mr-2" /> Edit Profile
                </button>
            )}
        </div>
      </div>

      <div className="pt-8 md:pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Progression</h3>
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-bold">{user.xp} XP</span>
                        <span className="text-slate-500">Next Level: {(level * 1000)}</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {user.isOrganizer ? (
                 <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-violet-500/30 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-white flex items-center">
                                <Shield className="w-4 h-4 mr-2 text-violet-400" /> Organizer Mode
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">Tournament tools.</p>
                        </div>
                        <button 
                            onClick={toggleOrganizerMode}
                            className={`w-12 h-6 rounded-full transition-colors relative ${user.organizerMode ? 'bg-violet-600' : 'bg-slate-700'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${user.organizerMode ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                 </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Organizer Status</h3>
                    {user.organizerStatus === 'none' && (
                        <button 
                            onClick={submitOrganizerRequest}
                            className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            Apply to Host
                        </button>
                    )}
                    {user.organizerStatus === 'pending' && (
                        <div className="flex items-center text-yellow-500 text-xs font-bold uppercase tracking-widest bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                            <Clock className="w-4 h-4 mr-2" /> Application Pending
                        </div>
                    )}
                    {user.organizerStatus === 'rejected' && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center text-red-500 text-xs font-bold uppercase tracking-widest bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                <ShieldAlert className="w-4 h-4 mr-2" /> Application Rejected
                            </div>
                            <button onClick={submitOrganizerRequest} className="text-[10px] text-slate-500 hover:text-white underline">Re-apply?</button>
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-white text-lg mb-4">Referral Code</h3>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                    <code className="text-violet-400 font-mono font-bold text-xl">{user.referralCode || 'N/A'}</code>
                    <button onClick={() => { Clipboard.setString(user.referralCode); }} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                        <Copy className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-white text-lg mb-4">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Wins</p>
                        <p className="text-xl font-black text-emerald-400">{user.stats.wins}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Losses</p>
                        <p className="text-xl font-black text-red-400">{user.stats.losses}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Ratio</p>
                        <p className="text-xl font-black text-violet-400">
                            {user.stats.wins + user.stats.losses > 0 ? ((user.stats.wins / (user.stats.wins + user.stats.losses)) * 100).toFixed(0) : 0}%
                        </p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tourneys</p>
                        <p className="text-xl font-black text-blue-400">{user.stats.tournamentsPlayed}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
