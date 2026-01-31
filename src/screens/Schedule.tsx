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
import { View, Text, Image, Pressable, Alert } from 'react-native'; // Import React Native components
import Clipboard from '@react-native-clipboard/clipboard';

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

import React, { useState, useRef, useMemo } from 'react';
import { useAppStore } from '../context';
import { format } from 'date-fns';
import { Clock, MapPin, AlertCircle, CheckCircle, Shield, Swords, Calendar, Flag, Zap, Camera, Upload, Loader2, Sparkles, X, Trophy, Check, AlertTriangle, Play, Smartphone, Gamepad2, ArrowRight, Copy, Globe } from 'lucide-react';
import { Match } from '../types';

export default function Schedule() {
  const { matches, user, forfeitMatch, startMatch, claimMatchHost, submitMatchTag, confirmMatchJoin, verifyResultWithAI, updateMatch } = useAppStore();
  const [reportingMatchId, setReportingMatchId] = useState<string | null>(null);
  const [launchingMatchId, setLaunchingMatchId] = useState<string | null>(null);
  const [connectionMatchId, setConnectionMatchId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{ winnerId: string, score: string } | null>(null);
  const [gameTagInput, setGameTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myMatches = matches.filter(m => m.player1.id === user?.id || m.player2.id === user?.id);

  const handleReportResult = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !reportingMatchId) return;

    setIsVerifying(true);
    setVerificationError(null);
    
    const reader = new FileReader();
    reader.onload = async () => {
        try {
            const base64 = reader.result as string;
            const result = await verifyResultWithAI(reportingMatchId, base64);
            if (result) {
                setVerificationResult(result);
            } else {
                setVerificationError("The AI couldn't clearly identify the winner or score. Please try a clearer screenshot.");
            }
        } catch (err) {
            setVerificationError("Analysis failed. Please check your connection.");
        } finally {
            setIsVerifying(false);
        }
    };
    reader.readAsDataURL(file);
  };

  const confirmAIResult = () => {
    if (!reportingMatchId || !verificationResult) return;
    const [p1Score, p2Score] = verificationResult.score.split('-').map(s => parseInt(s.trim()) || 0);
    updateMatch(reportingMatchId, {
        status: 'Completed',
        winnerId: verificationResult.winnerId,
        player1: { ...matches.find(m => m.id === reportingMatchId)!.player1, score: p1Score },
        player2: { ...matches.find(m => m.id === reportingMatchId)!.player2, score: p2Score }
    });
    setReportingMatchId(null);
    setVerificationResult(null);
  };

  const getGameName = (match: Match) => {
      // Logic: Extract from title "Tournament Name (Game Title)" if present, otherwise generic
      const parts = match.tournamentTitle.match(/\(([^)]+)\)/);
      return parts ? parts[1] : "Championship Game";
  };

  const activeConnectionMatch = matches.find(m => m.id === connectionMatchId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-violet-500" />
            Active Deployment Schedule
        </h1>
      </div>

      {/* Connection Handshake Modal */}
      {connectionMatchId && activeConnectionMatch && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in zoom-in duration-300">
              <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                      <div>
                          <h2 className="text-xl font-bold text-white uppercase tracking-widest font-['Rajdhani']">Uplink Protocol</h2>
                          <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mt-1">{activeConnectionMatch.tournamentTitle}</p>
                      </div>
                      <button onClick={() => setConnectionMatchId(null)} className="p-2 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
                  </div>

                  <div className="p-10 space-y-8">
                      {!activeConnectionMatch.connection?.hostId ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button 
                                onClick={() => claimMatchHost(activeConnectionMatch.id)}
                                className="p-8 bg-slate-800/50 border border-slate-700 rounded-[2rem] hover:border-violet-500 hover:bg-violet-600/5 transition-all text-center group"
                              >
                                  <div className="w-14 h-14 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                      <Gamepad2 className="w-8 h-8 text-violet-400" />
                                  </div>
                                  <h3 className="text-white font-bold text-lg">HOST</h3>
                                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-2">Initialize Match Lobby</p>
                              </button>
                              <button 
                                onClick={() => Alert.alert("Waiting for Player A to initialize host protocol...")}
                                className="p-8 bg-slate-800/50 border border-slate-700 rounded-[2rem] hover:border-emerald-500 hover:bg-emerald-600/5 transition-all text-center group"
                              >
                                  <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                      <ArrowRight className="w-8 h-8 text-emerald-400" />
                                  </div>
                                  <h3 className="text-white font-bold text-lg">JOIN</h3>
                                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-2">Connect to Host Lobby</p>
                              </button>
                          </div>
                      ) : activeConnectionMatch.connection.hostId === user?.id && activeConnectionMatch.connection.status === 'waiting_for_tag' ? (
                          <div className="space-y-6 text-center">
                              <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto border border-violet-500/30">
                                  <Smartphone className="text-violet-400 w-8 h-8" />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Identity Broadcast</h3>
                                  <p className="text-xs text-slate-500 mt-1">Enter your in-game gamertag so your opponent can find you.</p>
                              </div>
                              <input 
                                type="text" 
                                placeholder="Enter Gamertag (e.g. ProGamer#1234)" 
                                value={gameTagInput}
                                onChange={(e) => setGameTagInput(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-6 py-4 text-white text-center font-bold text-lg outline-none focus:border-violet-500 shadow-inner"
                                autoFocus
                              />
                              <button 
                                onClick={() => { submitMatchTag(activeConnectionMatch.id, gameTagInput); }}
                                className="w-full py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-violet-900/30 transition-all"
                              >
                                Open Lobby & Send Signal
                              </button>
                          </div>
                      ) : activeConnectionMatch.connection.status === 'tag_ready' && activeConnectionMatch.connection.hostId !== user?.id ? (
                          <div className="space-y-6 text-center">
                              <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30">
                                  <Check className="w-8 h-8" />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Lobby Signal Detected</h3>
                                  <p className="text-xs text-slate-500 mt-1">The host is ready. Use the credentials below to connect in-game.</p>
                              </div>
                              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between group/copy">
                                  <div className="text-left">
                                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Host Identity</p>
                                      <span className="text-white font-mono font-black text-xl">{activeConnectionMatch.connection.hostGameTag}</span>
                                  </div>
                                  <button onClick={() => {
                                      Clipboard.setString(activeConnectionMatch.connection!.hostGameTag!);
                                      Alert.alert("Tag copied to clipboard!");
                                  }} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors">
                                      <Copy className="w-5 h-5" />
                                  </button>
                              </div>
                              <button 
                                onClick={() => confirmMatchJoin(activeConnectionMatch.id)}
                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-emerald-900/30 transition-all"
                              >
                                I Have Joined Lobby
                              </button>
                          </div>
                      ) : (
                          <div className="text-center py-12 space-y-8 animate-pulse">
                              <div className="relative w-24 h-24 mx-auto">
                                  <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full"></div>
                                  <Loader2 className="w-full h-full text-violet-500 animate-spin relative z-10" />
                                  <Zap className="absolute inset-0 m-auto w-10 h-10 text-violet-400 animate-pulse relative z-10" />
                              </div>
                              <div className="space-y-2">
                                  <p className="text-white font-black text-xl uppercase tracking-widest">Synchronizing Hub...</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Waiting for opponent to acknowledge signal</p>
                              </div>
                              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                                  <p className="text-[9px] text-slate-600 font-bold uppercase">Status: Handshake in Progress</p>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Launch Loading Modal */}
      {launchingMatchId && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-4 animate-in fade-in zoom-in duration-300">
              <div className="bg-slate-900 border border-slate-700 rounded-[3rem] w-full max-w-sm shadow-2xl p-12 text-center space-y-10">
                  <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 bg-violet-500/20 blur-[50px] rounded-full"></div>
                      <Loader2 className="w-full h-full text-violet-500 animate-spin relative z-10" />
                      <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-violet-400 animate-pulse relative z-10" />
                  </div>
                  
                  <div className="space-y-4">
                      <p className="text-white font-black text-2xl uppercase tracking-tighter">Match Deployment</p>
                      <div className="inline-flex items-center px-3 py-1 bg-violet-600/20 border border-violet-500/30 rounded-lg">
                          <p className="text-[10px] text-violet-400 font-mono font-black uppercase tracking-[0.3em]">
                              {getGameName(matches.find(m => m.id === launchingMatchId)!)}
                          </p>
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] animate-pulse pt-4">Connecting to Match...</p>
                  </div>
                  
                  <button 
                    onClick={() => setLaunchingMatchId(null)}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-slate-700 active:scale-95"
                  >
                      Cancel & Return
                  </button>
              </div>
          </div>
      )}

      {/* Match List */}
      <div className="grid gap-6">
        {myMatches.length === 0 ? (
             <div className="text-center py-24 bg-slate-900/40 rounded-[3rem] border-2 border-slate-800 border-dashed">
                <Globe className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-20" />
                <h3 className="text-xl font-bold text-slate-400 font-['Rajdhani'] uppercase tracking-widest">No Transmissions Received</h3>
                <p className="text-slate-600 text-sm mt-2 font-medium">Join an arena to populate your operational schedule.</p>
             </div>
        ) : (
            myMatches.map(match => {
                const isP1 = match.player1.id === user?.id;
                const opponent = isP1 ? match.player2 : match.player1;
                const isWinner = match.winnerId === user?.id;
                const gameName = getGameName(match);

                return (
                    <div key={match.id} className={`bg-slate-900 border rounded-[2.5rem] overflow-hidden transition-all duration-500 group ${match.status === 'Live' ? 'border-violet-500 shadow-2xl shadow-violet-900/30 scale-[1.02]' : 'border-slate-800 hover:border-slate-700 shadow-xl'}`}>
                        {/* Header: Tournament & Time */}
                        <div className="px-10 py-5 bg-black/20 border-b border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-[10px] bg-slate-800 text-violet-400 px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border border-slate-700">{match.round}</span>
                                <h3 className="text-sm text-slate-200 font-black uppercase tracking-widest font-['Rajdhani'] flex items-center">
                                    <Trophy className="w-4 h-4 mr-2.5 text-violet-500" />
                                    {match.tournamentTitle}
                                </h3>
                            </div>
                            <div className="flex items-center text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] bg-slate-950/50 px-4 py-1.5 rounded-full border border-slate-800">
                                <Clock className="w-3.5 h-3.5 mr-2.5 text-violet-500/50" />
                                {format(new Date(match.date), 'MMMM d, yyyy • h:mm a')}
                            </div>
                        </div>

                        {/* Versus Grid */}
                        <div className="p-10 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                                {/* Player 1 (Left) */}
                                <div className="flex items-center flex-1 w-full justify-start">
                                    <div className={`w-24 h-24 rounded-[2rem] border-2 flex items-center justify-center bg-slate-800 shadow-2xl relative transition-all duration-700 ${isWinner ? 'border-emerald-500 shadow-emerald-500/30 scale-105' : 'border-slate-700'}`}>
                                        {match.player1.avatarUrl ? (
                                            <img src={match.player1.avatarUrl} className="w-full h-full object-cover rounded-[2rem]" alt="" />
                                        ) : (
                                            <span className="text-4xl font-black font-['Rajdhani'] text-white">{match.player1.name[0]}</span>
                                        )}
                                        {match.player1.id === user?.id && (
                                            <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-violet-600 rounded-lg text-[9px] font-black text-white uppercase tracking-widest shadow-lg border border-violet-400/30">YOU</div>
                                        )}
                                    </div>
                                    <div className="ml-8 text-left">
                                        <p className="font-black text-white text-3xl tracking-tighter font-['Rajdhani'] uppercase leading-none">{match.player1.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-3 flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-violet-500 mr-2 shadow-[0_0_10px_rgba(139,92,246,0.5)]" /> Alpha Host
                                        </p>
                                    </div>
                                </div>

                                {/* Match Context (Middle) */}
                                <div className="flex flex-col items-center justify-center shrink-0 min-w-[150px]">
                                    <div className="px-6 py-2 bg-slate-950 border border-slate-800 rounded-xl mb-4 shadow-inner">
                                        <p className="text-[11px] text-violet-400 font-black uppercase tracking-[0.4em] text-center">{gameName}</p>
                                    </div>
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-lg border-2 shadow-2xl transition-all duration-500 ${match.status === 'Live' ? 'bg-violet-900/40 text-violet-400 border-violet-500 animate-pulse' : 'bg-slate-800 text-slate-600 border-slate-700'}`}>
                                        {match.status === 'Live' ? <Zap className="w-10 h-10" /> : 'VS'}
                                    </div>
                                    <div className={`mt-6 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border shadow-lg ${
                                        match.status === 'Live' ? 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse' : 
                                        match.status === 'Completed' ? 'bg-slate-800 text-slate-500 border-slate-700' :
                                        'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                    }`}>
                                        {match.status}
                                    </div>
                                </div>

                                {/* Player 2 (Right) */}
                                <div className="flex items-center flex-1 w-full justify-end text-right">
                                    <div className="mr-8">
                                        <p className="font-black text-white text-3xl tracking-tighter font-['Rajdhani'] uppercase leading-none">{match.player2.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-3 flex items-center justify-end">
                                            Omega Joiner <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        </p>
                                    </div>
                                    <div className={`w-24 h-24 rounded-[2rem] border-2 flex items-center justify-center bg-slate-800 shadow-2xl relative transition-all duration-700 ${match.winnerId && match.winnerId === match.player2.id ? 'border-emerald-500 shadow-emerald-500/30 scale-105' : 'border-slate-700'}`}>
                                        {match.player2.avatarUrl ? (
                                            <img src={match.player2.avatarUrl} className="w-full h-full object-cover rounded-[2rem]" alt="" />
                                        ) : (
                                            <span className="text-4xl font-black font-['Rajdhani'] text-white">{match.player2.name[0]}</span>
                                        )}
                                        {match.player2.id === user?.id && (
                                            <div className="absolute -bottom-2 -left-2 px-3 py-1 bg-violet-600 rounded-lg text-[9px] font-black text-white uppercase tracking-widest shadow-lg border border-violet-400/30">YOU</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Actions & Connection Info (Footer) */}
                        <div className="bg-slate-900/80 border-t border-slate-800 px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-8">
                            <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-4 ${match.connection?.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-700'}`}></div>
                                <div className="flex flex-col">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Connection Integrity</p>
                                    <p className="text-xs text-slate-300 font-bold uppercase tracking-tight">
                                        {match.connection?.status === 'connected' ? 'Secure Uplink Established' : 'Awaiting Check-In Protocol'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 w-full sm:w-auto">
                                {match.status === 'Scheduled' && (
                                    <button 
                                        onClick={() => setConnectionMatchId(match.id)}
                                        className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-[0.2em] text-white bg-violet-600 hover:bg-violet-500 px-10 py-3.5 rounded-2xl transition-all shadow-2xl shadow-violet-900/40 flex items-center justify-center group/btn active:scale-95"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-3 group-hover/btn:scale-110 transition-transform" /> 
                                        {match.connection?.status === 'connected' ? 'Uplink Ready' : 'Protocol Check-In'}
                                    </button>
                                )}
                                
                                {match.connection?.status === 'connected' && match.status === 'Scheduled' && (
                                    <button 
                                        onClick={() => { 
                                            setLaunchingMatchId(match.id); 
                                            setTimeout(() => { startMatch(match.id); setLaunchingMatchId(null); }, 4000); 
                                        }}
                                        className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-[0.2em] text-white bg-emerald-600 hover:bg-emerald-500 px-10 py-3.5 rounded-2xl transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center group/launch active:scale-95"
                                    >
                                        <Play className="w-4 h-4 mr-3 group-launch:scale-125 transition-transform" /> Engage Match
                                    </button>
                                )}

                                {match.status === 'Live' && (
                                    <button 
                                        onClick={() => setReportingMatchId(match.id)}
                                        className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-[0.2em] text-white bg-emerald-600 hover:bg-emerald-500 px-10 py-3.5 rounded-2xl transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center active:scale-95"
                                    >
                                        <Camera className="w-4 h-4 mr-3" /> Transmit Result
                                    </button>
                                )}

                                {(match.status === 'Scheduled' || match.status === 'Live') && (
                                    <button 
                                        onClick={() => Alert.alert(
                                            'Confirm forfeit?',
                                            'Terminate deployment and forfeit points?',
                                            [
                                                { text: 'Cancel', style: 'cancel' },
                                                { text: 'Yes', onPress: () => forfeitMatch(match.id) }
                                            ]
                                        )}
                                        className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70 hover:text-red-400 px-6 py-3.5 rounded-2xl transition-all hover:bg-red-500/5 flex items-center justify-center active:scale-95"
                                    >
                                        <Flag className="w-4 h-4 mr-3" /> Forfeit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })
        )}
      </div>

      {/* Score Reporting Modal */}
      {reportingMatchId && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative overflow-hidden">
                  <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                      <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest font-['Rajdhani']">Evidence Submission</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Submit visual scoreboard verification</p>
                      </div>
                      <button onClick={() => { setReportingMatchId(null); setVerificationResult(null); }} className="text-slate-400 hover:text-white">
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="p-10 space-y-8">
                      {isVerifying ? (
                          <div className="text-center py-12 space-y-8">
                              <div className="relative w-20 h-20 mx-auto">
                                  <Loader2 className="w-full h-full text-violet-500 animate-spin" />
                                  <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-violet-400 animate-pulse" />
                              </div>
                              <p className="text-white font-black uppercase tracking-widest animate-pulse">AI Visual Analysis Active...</p>
                          </div>
                      ) : !verificationResult ? (
                          <div className="text-center space-y-8">
                              <div className="w-20 h-20 bg-violet-600/10 rounded-3xl flex items-center justify-center mx-auto border border-violet-500/30">
                                  <Camera className="w-10 h-10 text-violet-400" />
                              </div>
                              <div className="space-y-2">
                                  <p className="text-slate-300 font-medium">Upload a screenshot of the final score screen.</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Our AI will verify and finalize the result</p>
                              </div>
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-violet-900/30 transition-all"
                              >
                                Select Screenshot
                              </button>
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleReportResult} />
                          </div>
                      ) : (
                          <div className="space-y-8 animate-in zoom-in duration-300">
                              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-[2.5rem] p-10 text-center space-y-6">
                                  <Trophy className="w-14 h-14 text-emerald-400 mx-auto mb-2" />
                                  <div>
                                      <h3 className="text-2xl font-black text-white uppercase font-['Rajdhani']">Result Verified</h3>
                                      <p className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-widest mt-2">Analysis Integrity 99%</p>
                                  </div>
                                  <p className="text-5xl font-black text-white font-mono tracking-tighter">{verificationResult.score}</p>
                              </div>
                              <button onClick={confirmAIResult} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-emerald-900/40 transition-all active:scale-95">
                                  Confirm Official Result
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
