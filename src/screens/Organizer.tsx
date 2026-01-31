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
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'; // Import React Native components

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
import React, { useState, useRef, useMemo } from 'react';
import { useAppStore } from '../context';
import { useNavigation } from '@react-navigation/native';
import { Plus, Users, Calendar, Trophy, AlertTriangle, Edit, MapPin, Check, ArrowLeft, X, Save, Flag, Shuffle, ChevronRight, Settings, Info, CloudLightning, CheckCircle2, Image as ImageIcon, Camera, Sparkles, Loader2, DollarSign, Trash2, LayoutGrid, Edit3, ClipboardList, Sliders, Save as SaveIcon, PowerOff, ShieldAlert, MessageCircle, Lock, Crown } from 'lucide-react';
import { GameType, Tournament, Match, TournamentStatus, TournamentGame } from '../types';
import { format } from 'date-fns';



const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
    <button 
        type="button"
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-violet-500 ${enabled ? 'bg-violet-600' : 'bg-slate-700'}`}
    >
        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

export default function Organizer() {
  const { user, tournaments, matches, createTournament, updateTournament, updateMatch, generateBracket } = useAppStore();
  const navigation = useNavigation();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [managingGame, setManagingGame] = useState<{ tournamentId: string, gameId: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myTournaments = useMemo(() => tournaments.filter(t => t.organizerId === (user?.id || '')), [tournaments, user?.id]);
  
  const isBasicTier = user?.organizerTier === 'basic';
  const monthlyLimit = isBasicTier ? 2 : 9999;
  const createdThisMonth = user?.tournamentsCreatedMonth || 0;
  const isLimitReached = isBasicTier && createdThisMonth >= monthlyLimit;

  const [newTourney, setNewTourney] = useState<{
    title: string;
    date: string;
    prizePool: string;
    description: string;
    location: string;
    rules: string[];
    prizeBreakdown: string[];
    imageUrl: string;
    minLevel: number;
    createGroupChat: boolean;
    isPriority: boolean;
    isVerifiedEvent: boolean;
    games: any[];
  }>({
    title: '',
    date: '',
    prizePool: '',
    description: '',
    location: '',
    rules: [''],
    prizeBreakdown: ['Winner takes all'],
    imageUrl: '',
    minLevel: 0,
    createGroupChat: true,
    isPriority: false,
    isVerifiedEvent: false,
    games: [{ type: GameType.FPS, registrationFee: 0, maxParticipants: 16 }]
  });

  const [rulesText, setRulesText] = useState('No cheating\nRespect admins\nHave fun');

  const addGameField = () => {
    setNewTourney(prev => ({
        ...prev,
        games: [...prev.games, { type: GameType.FPS, registrationFee: 0, maxParticipants: 16 }]
    }));
  };

  const removeGameField = (index: number) => {
    if (newTourney.games.length <= 1) return;
    setNewTourney(prev => ({
        ...prev,
        games: prev.games.filter((_, i) => i !== index)
    }));
  };

  const updateGameField = (index: number, field: string, value: any) => {
    const newGames = [...newTourney.games];
    newGames[index] = { ...newGames[index], [field]: value };
    setNewTourney(prev => ({ ...prev, games: newGames }));
  };

  const handleEdit = (t: Tournament) => {
    setEditingId(t.id);
    setNewTourney({
      title: t.title,
      date: t.date.slice(0, 16),
      prizePool: t.prizePool,
      description: t.description,
      location: t.location || '',
      rules: t.rules,
      prizeBreakdown: t.prizeBreakdown,
      imageUrl: t.imageUrl || '',
      minLevel: t.minLevel || 0,
      createGroupChat: !!t.chatRoomId,
      isPriority: !!t.isPriority,
      isVerifiedEvent: !!t.isVerifiedEvent,
      games: t.games.map(g => ({ ...g }))
    });
    setRulesText(t.rules.join('\n'));
    setStep('form');
    setIsCreating(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setNewTourney({
      title: '',
      date: '',
      prizePool: '',
      description: '',
      location: '',
      rules: [''],
      prizeBreakdown: ['Winner takes all'],
      imageUrl: '',
      minLevel: 0,
      createGroupChat: true,
      isPriority: false,
      isVerifiedEvent: false,
      games: [{ type: GameType.FPS, registrationFee: 0, maxParticipants: 16 }]
    });
    setRulesText('No cheating\nRespect admins\nHave fun');
    setStep('form');
    setIsCreating(true);
  };

  const generateAIBanner = async () => {
    if (!newTourney.title) {
        Alert.alert("Enter a title first.");
        return;
    }
    setIsGeneratingImage(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-pro',
            contents: { 
                parts: [{ text: `Epic multi-game esports tournament banner for "${newTourney.title}". Dark cinematic theme.` }] 
            },
            config: { imageConfig: { aspectRatio: "16:9" } }
        });
        
        const parts = response.candidates?.[0]?.content?.parts;
        const part = parts?.find(p => p.inlineData);
        if (part && part.inlineData) {
            setNewTourney(prev => ({ ...prev, imageUrl: `data:image/png;base64,${part.inlineData.data}` }));
        }
    } catch (error) {
        console.error("AI Banner Generation Failed:", error);
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setNewTourney(prev => ({ ...prev, rules: rulesText.split('\n').filter(r => r.trim() !== '') }));
    setStep('review');
  };

  const handleFinalSubmit = () => {
    if (!editingId && isLimitReached) {
        Alert.alert("Monthly limit reached. Please upgrade to Pro.");
        return;
    }

    const submission: any = { ...newTourney };
    
    if (submission.createGroupChat) {
        if (!submission.chatRoomId) {
            // FIX: Replaced deprecated `substr` with `substring` for consistency and to avoid potential type errors.
            submission.chatRoomId = `room-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        }
    } else {
        submission.chatRoomId = null;
    }
    delete submission.createGroupChat;

    const processedGames = submission.games.map((g: any) => ({
        ...g,
        id: g.id || crypto.randomUUID(),
        participants: g.participants || 0,
        status: g.status || TournamentStatus.UPCOMING
    }));

    submission.games = processedGames;

    if (editingId) {
      updateTournament(editingId, submission);
    } else {
      createTournament(submission);
    }
    setIsCreating(false);
    setStep('form');
  };

  const handleManualMatchUpdate = (matchId: string, p1Score: number, p2Score: number, status: Match['status']) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const winnerId = status === 'Completed' ? (p1Score > p2Score ? match.player1.id : p2Score > p1Score ? match.player2.id : undefined) : undefined;
    
    updateMatch(matchId, {
        player1: { ...match.player1, score: p1Score },
        player2: { ...match.player2, score: p2Score },
        status: status,
        winnerId: winnerId
    });
  };

  const finalizeGameProtocol = (tournamentId: string, gameId: string) => {
    const t = tournaments.find(tour => tour.id === tournamentId);
    if (!t) return;
    
    const updatedGames = t.games.map(g => g.id === gameId ? { ...g, status: TournamentStatus.COMPLETED } : g);
    updateTournament(tournamentId, { games: updatedGames });
    setManagingGame(null);
    Alert.alert('Game finalized', 'Game finalized and marked as completed.');
  };

  const activeManagementMatches = useMemo(() => {
    if (!managingGame) return [];
    return matches.filter(m => m.tournamentId === managingGame.tournamentId && m.gameId === managingGame.gameId);
  }, [managingGame, matches]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-white">Organizer Dashboard</h1>
            <p className="text-slate-400 text-sm">Manage multi-game tournaments</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-2 pr-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isBasicTier ? 'bg-slate-800 text-slate-400' : 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg'}`}>
                {isBasicTier ? <LayoutGrid className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
            </div>
            <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Plan Status</p>
                <div className="flex items-center text-sm font-bold text-white">
                    {isBasicTier ? 'Basic Tier' : 'Pro Tier'}
                    {isBasicTier && <span className="mx-2 text-slate-600">•</span>}
                    {isBasicTier && (
                        <span className={`${isLimitReached ? 'text-red-400' : 'text-emerald-400'}`}>
                            {createdThisMonth}/{monthlyLimit} Created
                        </span>
                    )}
                </div>
            </div>
            {isBasicTier && (
                <button onClick={() => navigation.navigate('Store' as any)} className="ml-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all">
                    Upgrade
                </button>
            )}
        </div>

        <button 
            onClick={handleCreateNew}
            disabled={!editingId && isLimitReached}
            className={`flex items-center px-5 py-2.5 rounded-xl font-bold transition-all ${!editingId && isLimitReached ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/20'}`}
        >
            <Plus className="w-4 h-4 mr-2" /> Create Tournament
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {myTournaments.length === 0 ? (
             <div className="text-center py-24 bg-slate-900/30 border-2 border-slate-800 border-dashed rounded-[3rem]">
                <LayoutGrid className="w-16 h-16 text-slate-800 mx-auto mb-4 opacity-20" />
                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">No Tournaments Created</p>
             </div>
         ) : (
            myTournaments.map(t => (
                <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-violet-500/50 transition-all p-8 group shadow-2xl relative">
                    <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
                        <div className="w-full lg:w-48 h-32 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 relative">
                            {t.imageUrl ? (
                                <img src={t.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-950"><Trophy className="w-10 h-10 text-slate-800" /></div>
                            )}
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight font-['Rajdhani']">{t.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${t.status === 'Ongoing' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{t.status}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center">
                                        <Calendar className="w-3 h-3 mr-2" /> {format(new Date(t.date), 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6 text-slate-400">
                                     <div className="text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Prize</p>
                                        <p className="font-mono font-bold text-emerald-400">{t.prizePool}</p>
                                     </div>
                                     <div className="text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Players</p>
                                        <p className="font-mono font-bold text-white">{t.registeredPlayers.length}</p>
                                     </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/50">
                                {t.games.map(g => (
                                    <div key={g.id} className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                                        <span className="text-[10px] font-black text-white uppercase">{g.customName || g.type}</span>
                                        <div className="h-3 w-px bg-slate-800"></div>
                                        {g.status === TournamentStatus.UPCOMING ? (
                                            <button onClick={() => generateBracket(t.id, g.id)} className="text-[9px] text-violet-400 hover:text-white uppercase font-bold tracking-wider">Gen Bracket</button>
                                        ) : (
                                            <button onClick={() => setManagingGame({ tournamentId: t.id, gameId: g.id })} className="text-[9px] text-emerald-400 hover:text-white uppercase font-bold tracking-wider">Manage Matches</button>
                                        )}
                                    </div>
                                ))}
                                <div className="flex-1 flex justify-end gap-2">
                                    <button onClick={() => handleEdit(t)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                                    <button onClick={() => navigation.navigate('TournamentDetails' as any, { id: t.id })} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))
         )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto pt-20 md:pt-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-6xl shadow-2xl transition-all duration-300 relative">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-10 rounded-t-3xl">
                    <h2 className="text-xl font-bold text-white font-['Rajdhani'] uppercase tracking-widest">
                        {step === 'form' ? (editingId ? 'Edit Protocol' : 'Creation Protocol') : 'Review Details'}
                    </h2>
                    <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white p-2">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {step === 'form' ? (
                    <form onSubmit={handleReview} className="p-6 lg:p-10 space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Tournament Title</label>
                                        <input required type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all shadow-inner" 
                                            value={newTourney.title} onChange={e => setNewTourney({...newTourney, title: e.target.value})} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Prize Pool</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                                <input required type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-violet-500 outline-none shadow-inner"
                                                    value={newTourney.prizePool} onChange={e => setNewTourney({...newTourney, prizePool: e.target.value})} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Start Date & Time</label>
                                            <input required type="datetime-local" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none shadow-inner"
                                                value={newTourney.date} onChange={e => setNewTourney({...newTourney, date: e.target.value})} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Access Control</label>
                                        <select 
                                            value={newTourney.minLevel}
                                            onChange={e => setNewTourney({...newTourney, minLevel: parseInt(e.target.value)})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none shadow-inner cursor-pointer"
                                        >
                                            <option value={0}>Open (No Requirement)</option>
                                            <option value={5}>Silver Rank (Level 5+)</option>
                                            <option value={10}>Gold Rank (Level 10+)</option>
                                            <option value={15}>Elite Rank (Level 15+)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Description</label>
                                        <textarea 
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none min-h-[100px] text-sm leading-relaxed shadow-inner" 
                                            value={newTourney.description} 
                                            onChange={e => setNewTourney({...newTourney, description: e.target.value})}
                                            placeholder="Describe the event, game mode, map pool, etc."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Rules</label>
                                        <textarea className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none min-h-[140px] font-mono text-sm leading-relaxed shadow-inner" 
                                            value={rulesText} onChange={e => setRulesText(e.target.value)} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Tournament Banner</label>
                                        <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group/banner shadow-inner">
                                            {newTourney.imageUrl ? (
                                                <img src={newTourney.imageUrl} className="w-full h-full object-cover opacity-60 group-hover/banner:opacity-40 transition-opacity" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                                                    <ImageIcon className="w-10 h-10 mb-2 opacity-10" />
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Upload Banner Image</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover/banner:opacity-100 transition-all bg-black/40 backdrop-blur-sm">
                                                <button type="button" onClick={generateAIBanner} title="Generate with AI" className="p-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white shadow-xl transition-transform active:scale-95"><Sparkles className="w-5 h-5" /></button>
                                                <button type="button" onClick={() => fileInputRef.current?.click()} title="Upload Manual" className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white shadow-xl transition-transform active:scale-95"><Camera className="w-5 h-5" /></button>
                                            </div>
                                            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => setNewTourney(prev => ({ ...prev, imageUrl: reader.result as string }));
                                                    reader.readAsDataURL(file);
                                                }
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                            <MessageCircle className="w-6 h-6 text-violet-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm">Tournament Group Chat</h3>
                                            <p className="text-xs text-slate-500 mt-1">Automatically invite players to a dedicated channel.</p>
                                        </div>
                                    </div>
                                    <Toggle enabled={newTourney.createGroupChat} onChange={() => setNewTourney({...newTourney, createGroupChat: !newTourney.createGroupChat})} />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-3">Game Events</label>
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar p-1">
                                        {newTourney.games.map((game, idx) => (
                                            <div key={idx} className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-2 relative group/game shadow-2xl">
                                                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-1">
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Game {idx + 1}</span>
                                                    {newTourney.games.length > 1 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeGameField(idx)}
                                                            className="text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded-full transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">Category</label>
                                                        <select 
                                                            value={game.type}
                                                            onChange={e => updateGameField(idx, 'type', e.target.value)}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-violet-500 outline-none transition-colors"
                                                        >
                                                            {Object.values(GameType).map(g => <option key={g} value={g}>{g}</option>)}
                                                        </select>
                                                        
                                                        <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                                                            <label className="block text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">Game Title (Specific)</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Dream League, Valorant, Dota 2"
                                                                value={game.customName || ''}
                                                                onChange={e => updateGameField(idx, 'customName', e.target.value)}
                                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-violet-500 outline-none transition-colors"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">Entry Fee ($)</label>
                                                        <input 
                                                            type="number" 
                                                            value={game.registrationFee}
                                                            onChange={e => updateGameField(idx, 'registrationFee', parseFloat(e.target.value))}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-violet-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">Player Capacity</label>
                                                        <input 
                                                            type="number" 
                                                            value={game.maxParticipants}
                                                            onChange={e => updateGameField(idx, 'maxParticipants', parseInt(e.target.value))}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-violet-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            onClick={addGameField}
                                            className="w-full py-4 border-2 border-dashed border-slate-800 hover:border-violet-500/50 hover:bg-violet-500/5 rounded-3xl text-slate-500 hover:text-violet-400 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center group"
                                        >
                                            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" /> Add Game
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end pt-8 border-t border-slate-800 sticky bottom-0 bg-slate-900 rounded-b-3xl">
                            <button type="submit" className="px-12 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center shadow-xl shadow-violet-900/40 active:scale-95 transition-all">
                                Review Summary <ChevronRight className="w-5 h-5 ml-3" />
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 lg:p-12 space-y-10">
                        <div className="bg-slate-950/80 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
                             <div className="h-80 relative">
                                {newTourney.imageUrl ? (
                                    <img src={newTourney.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-950"></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                                <div className="absolute bottom-10 left-10">
                                    <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-['Rajdhani'] drop-shadow-2xl">{newTourney.title}</h3>
                                    <div className="flex items-center gap-4 mt-3">
                                        <p className="text-violet-400 font-bold tracking-[0.3em] uppercase text-sm flex items-center">
                                            <Calendar className="w-4 h-4 mr-3" /> {newTourney.date ? format(new Date(newTourney.date), 'MMMM d, yyyy • h:mm a') : 'Temporal Sync Required'}
                                        </p>
                                    </div>
                                </div>
                             </div>
                             
                             <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Active Games</label>
                                    <div className="space-y-4">
                                        {newTourney.games.map((g, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-inner">
                                                <div>
                                                    <span className="text-white font-black text-xs uppercase tracking-[0.1em]">
                                                        {g.customName || g.type}
                                                        {g.customName && <span className="block text-[9px] text-slate-500 mt-0.5 tracking-normal uppercase">{g.type}</span>}
                                                    </span>
                                                    <p className="text-[9px] text-slate-500 mt-0.5">Capacity: {g.maxParticipants} Players</p>
                                                </div>
                                                <span className="text-emerald-400 font-mono font-bold text-lg">${g.registrationFee.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                     <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 shadow-inner">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-2">Total Capacity</label>
                                        <p className="text-4xl font-black text-white font-mono tracking-tighter">{newTourney.games.reduce((acc, g) => acc + g.maxParticipants, 0)} Players</p>
                                     </div>
                                </div>
                             </div>
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-slate-800">
                            <button onClick={() => setStep('form')} className="flex items-center text-slate-400 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors group">
                                <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" /> Edit Details
                            </button>
                            <button onClick={handleFinalSubmit} className="px-16 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_15px_40px_rgba(16,185,129,0.3)] active:scale-95 transition-all">
                                {editingId ? 'Update Tournament' : 'Create Tournament'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {managingGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[85vh]">
                  <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 sticky top-0 z-20">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/30">
                              <ClipboardList className="w-6 h-6 text-violet-400" />
                          </div>
                          <div>
                              <h2 className="text-2xl font-black text-white uppercase tracking-widest font-['Rajdhani'] leading-none">Result Management</h2>
                              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Force update scores and complete matches</p>
                          </div>
                      </div>
                      <button onClick={() => setManagingGame(null)} className="text-slate-400 hover:text-white p-2 bg-slate-800/50 rounded-xl transition-colors">
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                      {activeManagementMatches.length === 0 ? (
                          <div className="text-center py-20 opacity-30 flex flex-col items-center">
                              <Loader2 className="w-12 h-12 mb-4 animate-spin text-violet-500" />
                              <p className="font-black uppercase tracking-widest text-xs">Awaiting Matches...</p>
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 gap-6">
                              {activeManagementMatches.map(m => (
                                  <div key={m.id} className="bg-slate-950/50 border border-slate-800 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-10 hover:border-violet-500/30 transition-colors">
                                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                                          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
                                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Player 1</span>
                                              <div className="flex items-center gap-4">
                                                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-lg border border-slate-700">
                                                      {m.player1.avatarUrl ? <img src={m.player1.avatarUrl} className="w-full h-full object-cover rounded-2xl" /> : m.player1.name[0]}
                                                  </div>
                                                  <div className="flex flex-col">
                                                      <span className="font-black text-white uppercase tracking-tight leading-none">{m.player1.name}</span>
                                                      <input 
                                                          type="number" 
                                                          defaultValue={m.player1.score || 0}
                                                          onBlur={(e) => handleManualMatchUpdate(m.id, parseInt(e.target.value), m.player2.score || 0, m.status)}
                                                          className="mt-2 w-16 bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-center font-mono font-bold text-violet-400 focus:border-violet-500 outline-none"
                                                      />
                                                  </div>
                                              </div>
                                          </div>

                                          <div className="flex flex-col items-center gap-4">
                                              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                                  m.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                                              }`}>{m.status}</span>
                                              <div className="h-px w-full bg-slate-800"></div>
                                              <div className="flex gap-2">
                                                  <button 
                                                      onClick={() => handleManualMatchUpdate(m.id, m.player1.score || 0, m.player2.score || 0, 'Live')}
                                                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                      title="Mark as Live"
                                                  >
                                                      <Sliders className="w-4 h-4" />
                                                  </button>
                                                  <button 
                                                      onClick={() => handleManualMatchUpdate(m.id, m.player1.score || 0, m.player2.score || 0, 'Completed')}
                                                      className="p-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20"
                                                      title="Mark as Completed"
                                                  >
                                                      <Check className="w-4 h-4" />
                                                  </button>
                                              </div>
                                          </div>

                                          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-3">
                                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Player 2</span>
                                              <div className="flex items-center gap-4 flex-row-reverse">
                                                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-lg border border-slate-700">
                                                      {m.player2.avatarUrl ? <img src={m.player2.avatarUrl} className="w-full h-full object-cover rounded-2xl" /> : m.player2.name[0]}
                                                  </div>
                                                  <div className="flex flex-col items-end">
                                                      <span className="font-black text-white uppercase tracking-tight leading-none">{m.player2.name}</span>
                                                      <input 
                                                          type="number" 
                                                          defaultValue={m.player2.score || 0}
                                                          onBlur={(e) => handleManualMatchUpdate(m.id, m.player1.score || 0, parseInt(e.target.value), m.status)}
                                                          className="mt-2 w-16 bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-center font-mono font-bold text-violet-400 focus:border-violet-500 outline-none"
                                                      />
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>

                  <div className="p-8 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center gap-4">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-md hidden md:block">
                          Caution: Finalizing results will lock all match data and mark this game as COMPLETED.
                      </p>
                      <div className="flex gap-4 w-full md:w-auto">
                          <button 
                            onClick={() => setManagingGame(null)}
                            className="flex-1 md:flex-none px-8 py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-slate-800 transition-all"
                          >
                              Close Management
                          </button>
                          <button 
                            onClick={() => Alert.alert(
                                'Finalize and close?',
                                'This will permanently close the game. Continue?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Yes', onPress: () => finalizeGameProtocol(managingGame!.tournamentId, managingGame!.gameId) }
                                ]
                            )}
                            className="flex-1 md:flex-none px-10 py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-900/30 flex items-center justify-center transition-all active:scale-95"
                          >
                              <PowerOff className="w-4 h-4 mr-2" /> Finalize Game
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
