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
import { View, Text, Image, Pressable } from 'react-native'; // Import React Native components

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
import React from 'react';
import { useAppStore } from '../context';
import { ShoppingBag, Zap, Shield, Star, Crown, ChevronRight, Check, CheckCircle } from 'lucide-react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import BlurHeader from '../components/BlurHeader';

export default function StoreView() {
  const { user, buyStoreItem } = useAppStore();

  const xpPacks = [
      { id: 'xp-small', name: 'Starter Boost', amount: 500, cost: 1.99, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
      { id: 'xp-medium', name: 'Pro Boost', amount: 2000, cost: 6.99, icon: Star, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
      { id: 'xp-large', name: 'Elite Pack', amount: 5000, cost: 14.99, icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  ];

  const badges = [
      { id: 'badge-vip', name: 'Nexgen VIP Badge', cost: 9.99, icon: Shield, desc: 'Exclusive VIP status icon in chat and profile.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
  ];

  const isProOrganizer = user.organizerTier === 'pro';

  return (
    <View className="flex-1 bg-[#020617]">
      <BlurHeader title="Item Store" />
      <ScrollView contentContainerStyle={{ paddingTop: 72 }}>
        <View className="max-w-5xl mx-auto space-y-12 pb-20 animate-enter w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-3xl font-bold text-white flex items-center font-['Rajdhani'] uppercase tracking-wider">
                  <ShoppingBag className="w-8 h-8 mr-4 text-violet-500" /> Item Store
              </h1>
              <p className="text-slate-400 text-sm mt-2">Boost your level and unlock premium status.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-3 flex items-center shadow-lg">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mr-3">Balance</span>
              <span className="text-xl font-mono font-bold text-white">${user.walletBalance.toFixed(2)}</span>
          </div>
      </div>

      {/* Subscriptions */}
      <div className="space-y-6">
          <h2 className="text-xl font-bold text-white font-['Rajdhani'] uppercase tracking-widest flex items-center">
              <Crown className="w-5 h-5 mr-3 text-orange-400" /> Organizer Plans
          </h2>
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Crown className="w-48 h-48" /></div>
              <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                  <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Organizer Pro Pass</h3>
                          {isProOrganizer && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/30 uppercase">Active</span>}
                      </div>
                      <p className="text-slate-400 text-sm mb-6">Unlock unlimited tournaments and advanced event management features.</p>
                      <ul className="space-y-3">
                          <li className="flex items-center text-sm text-slate-300"><CheckCircle className="w-4 h-4 mr-3 text-orange-400" /> Unlimited Tournaments Created</li>
                          <li className="flex items-center text-sm text-slate-300"><CheckCircle className="w-4 h-4 mr-3 text-orange-400" /> Priority Listing on Dashboard</li>
                          <li className="flex items-center text-sm text-slate-300"><CheckCircle className="w-4 h-4 mr-3 text-orange-400" /> Verified Event Badge</li>
                          <li className="flex items-center text-sm text-slate-300"><CheckCircle className="w-4 h-4 mr-3 text-orange-400" /> Custom Participant Limits</li>
                      </ul>
                  </div>
                  <div className="w-full md:w-auto text-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Monthly Subscription</p>
                      <p className="text-4xl font-black text-white font-mono mb-6">$19.99</p>
                      {isProOrganizer ? (
                          <View className="w-full px-8 py-3 bg-slate-800 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest cursor-default items-center"><Text className="text-slate-500">Plan Active</Text></View>
                      ) : (
                          <TouchableOpacity 
                            activeOpacity={0.85}
                            onPress={() => buyStoreItem('subscription', 'pro_tier', 19.99, 'Organizer Pro Pass')}
                            className="w-full px-8 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all items-center"
                          >
                              <Text style={{color:'#fff',fontWeight:'800'}}>Upgrade Now</Text>
                          </TouchableOpacity>
                      )}
                  </div>
              </div>
          </div>
      </div>

      <div className="space-y-6">
          <h2 className="text-xl font-bold text-white font-['Rajdhani'] uppercase tracking-widest flex items-center">
              <Zap className="w-5 h-5 mr-3 text-yellow-400" /> XP Boosts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {xpPacks.map(pack => (
                  <div key={pack.id} className={`group relative bg-slate-900 border ${pack.bg} rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-2xl`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${pack.bg} ${pack.color}`}>
                          <pack.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">{pack.name}</h3>
                      <p className={`text-3xl font-black font-mono my-2 ${pack.color}`}>+{pack.amount} XP</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Instant Delivery</p>
                      
                      <TouchableOpacity activeOpacity={0.85} onPress={() => buyStoreItem('xp', pack.amount, pack.cost, pack.name)} className="w-full py-4 bg-slate-950 text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all border border-slate-800 items-center">
                          <Text style={{color:'#fff',fontWeight:'800'}}>Purchase ${pack.cost}</Text>
                      </TouchableOpacity>
                  </div>
              ))}
          </div>
      </div>

      <div className="space-y-6">
          <h2 className="text-xl font-bold text-white font-['Rajdhani'] uppercase tracking-widest flex items-center">
              <Shield className="w-5 h-5 mr-3 text-emerald-400" /> Exclusive Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {badges.map(badge => {
                  const owned = user.purchasedBadges.includes(badge.id);
                  return (
                    <div key={badge.id} className={`group relative bg-slate-900 border ${badge.bg} rounded-3xl p-8 flex items-center gap-6 transition-all hover:shadow-2xl`}>
                        <div className={`w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center ${badge.bg} ${badge.color} border-2 border-dashed border-current`}>
                            <badge.icon className="w-10 h-10" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{badge.name}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">{badge.desc}</p>
                            {owned ? (
                                <button disabled className="px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center cursor-default">
                                    <Check className="w-4 h-4 mr-2" /> Owned
                                </button>
                            ) : (
                                <TouchableOpacity activeOpacity={0.85} onPress={() => buyStoreItem('badge', badge.id, badge.cost, badge.name)} className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-violet-900/20 items-center">
                                    <Text style={{color:'#fff',fontWeight:'800'}}>Unlock for ${badge.cost}</Text>
                                </TouchableOpacity>
                            )}
                        </div>
                    </div>
                  );
              })}
          </div>
      </div>
    </div>
  );
}