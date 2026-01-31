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
import React, { useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Alert, FlatList, ScrollView, TouchableOpacity, Text } from 'react-native';
import BlurHeader from '../components/BlurHeader';
import { useAppStore } from '../context';
import { 
    Calendar, Users, Trophy, ScrollText, DollarSign, ChevronLeft, 
    CheckCircle, Megaphone, AlertTriangle, Send, ShieldAlert, 
    UserX, MessageSquare, MapPin, Link as LinkIcon, Check, 
    Eye, X, Shield, Gavel, Percent, Zap, CreditCard, 
    Wallet, Sparkles, ShieldCheck, LayoutGrid, Loader2, 
    Target, Sword, Activity, Info, Clock, Lock, LogOut 
} from 'lucide-react';
import { format } from 'date-fns';
import { Match, User, TournamentGame } from '../types';

// replaced react-router usage with react-navigation


// --- SUB-COMPONENTS ---

const BracketPlayer: React.FC<{ player: { id: string, name: string, avatarUrl?: string, score?: number }, winnerId?: string }> = ({ player, winnerId }) => {
    const isWinner = winnerId === player.id;
    const isLoser = winnerId && winnerId !== player.id;
    const isTBD = player.id === 'tbd';

    return (
        <View className={`flex-row items-center justify-between p-2.5 rounded-lg transition-colors ${isWinner ? 'bg-emerald-500/5' : isTBD ? 'opacity-50' : 'hover:bg-slate-800'}`}>
            <View className="flex-row items-center space-x-3 overflow-hidden">
                <View className={`w-7 h-7 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold border transition-colors overflow-hidden ${
                    isWinner ? 'bg-emerald-500 text-black border-emerald-400' : 
                    isTBD ? 'bg-slate-800/50 text-slate-600 border-slate-700/50 border-dashed' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                    {player.avatarUrl && !isTBD ? (
                        <Image source={{ uri: player.avatarUrl }} accessibilityLabel={player.name} className="w-full h-full object-cover" />
                    ) : (
                        <Text>{isTBD ? '-' : player.name ? player.name.charAt(0).toUpperCase() : '?'}</Text>
                    )}
                </View>
                <Text className={`text-sm font-medium truncate transition-colors ${isWinner ? 'text-emerald-400' : isLoser ? 'text-slate-500' : isTBD ? 'text-slate-600 italic' : 'text-slate-200'}`}>
                    {player.name}
                </Text>
            </View>
            {!isTBD && (
                <Text className={`font-mono font-bold text-sm ml-2 ${isWinner ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {player.score ?? '-'}
                </Text>
            )}
        </View>
    );
};

const MatchCard: React.FC<{ match: Match, onClick: () => void }> = ({ match, onClick }) => (
    <Pressable 
        onPress={onClick}
        className={`bg-slate-900 border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:border-violet-500/50 cursor-pointer relative z-20 w-72 md:w-80 flex-shrink-0 group ${
        match.status === 'Live' ? 'border-violet-500 shadow-lg shadow-violet-900/20' : 'border-slate-800'
    }`}>
        <View className="px-4 py-2 bg-black/20 border-b border-slate-800/50 flex-row justify-between items-center group-hover:bg-violet-600/10 transition-colors">
            <Text className="text-[10px] text-slate-500 font-mono group-hover:text-violet-400">#{match.id.slice(-4)}</Text>
            <View className={`text-[10px] font-bold uppercase ${match.status === 'Live' ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                <Text>{match.status === 'Completed' ? 'Final' : match.status === 'Live' ? 'LIVE' : format(new Date(match.date), 'h:mm a')}</Text>
            </View>
        </View>
        <View className="p-3 space-y-1">
            <BracketPlayer player={match.player1} winnerId={match.winnerId} />
            <View className="h-px bg-slate-800/50 mx-2" />
            <BracketPlayer player={match.player2} winnerId={match.winnerId} />
        </View>
    </Pressable>
);

const MatchDetailModal: React.FC<{ match: Match, onClose: () => void }> = ({ match, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative overflow-hidden">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest font-['Rajdhani']">Match Info</h2>
                        <p className="text-[10px] text-violet-400 font-bold uppercase tracking-[0.2em] mt-1">{match.round}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-10 space-y-10">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 flex flex-col items-center text-center space-y-4">
                            <div className={`w-24 h-24 rounded-[2rem] border-2 flex items-center justify-center text-3xl font-bold bg-slate-800 ${match.winnerId === match.player1.id ? 'border-emerald-500' : 'border-slate-700'}`}>
                                {match.player1.avatarUrl ? <img src={match.player1.avatarUrl} className="w-full h-full object-cover rounded-[2rem]" /> : match.player1.name[0]}
                            </div>
                            <h4 className="font-black text-white text-xl font-['Rajdhani'] uppercase tracking-tight">{match.player1.name}</h4>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                                <span className="text-4xl font-black font-mono tracking-tighter text-white">{match.player1.score ?? 0} : {match.player2.score ?? 0}</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${match.status === 'Live' ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{match.status}</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center text-center space-y-4">
                            <div className={`w-24 h-24 rounded-[2rem] border-2 flex items-center justify-center text-3xl font-bold bg-slate-800 ${match.winnerId === match.player2.id ? 'border-emerald-500' : 'border-slate-700'}`}>
                                {match.player2.avatarUrl ? <img src={match.player2.avatarUrl} className="w-full h-full object-cover rounded-[2rem]" /> : match.player2.name[0]}
                            </div>
                            <h4 className="font-black text-white text-xl font-['Rajdhani'] uppercase tracking-tight">{match.player2.name}</h4>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Close</button>
                </div>
            </div>
        </div>
    );
};

const CheckoutModal: React.FC<{ 
    tournament: any, 
    user: User, 
    onClose: () => void, 
    onSuccess: (selectedGameIds: string[], method: 'wallet' | 'external') => Promise<void> 
}> = ({ tournament, user, onClose, onSuccess }) => {
    const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'external'>('wallet');
    const [step, setStep] = useState<'select-games' | 'select-payment' | 'processing' | 'success'>('select-games');

    const totalFee = tournament.games
        .filter((g: any) => selectedGameIds.includes(g.id))
        .reduce((sum: number, g: any) => sum + g.registrationFee, 0);

    const toggleGame = (id: string) => {
        setSelectedGameIds(prev => prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]);
    };

    const handleConfirm = async () => {
        setStep('processing');
        try {
            await onSuccess(selectedGameIds, paymentMethod);
            setStep('success');
            setTimeout(onClose, 2500);
        } catch (err) {
            setStep('select-payment');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                {step === 'select-games' && (
                    <div className="p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white font-['Rajdhani']">Choose Events</h2>
                            <button onClick={onClose} className="text-slate-500"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="space-y-3">
                            {tournament.games.map((g: any) => {
                                const isJoined = tournament.registeredPlayers.some((p: any) => p.id === user.id && p.gameIds.includes(g.id));
                                return (
                                    <button 
                                        key={g.id}
                                        disabled={isJoined}
                                        onClick={() => toggleGame(g.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isJoined ? 'bg-emerald-900/10 border-emerald-500/20 opacity-50' : selectedGameIds.includes(g.id) ? 'bg-violet-600/10 border-violet-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                                    >
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white">{g.customName || g.type}</p>
                                            <p className="text-[10px] text-slate-500">${g.registrationFee.toFixed(2)} Entry</p>
                                        </div>
                                        {isJoined ? <span className="text-[10px] text-emerald-400 font-bold uppercase">Already In</span> : selectedGameIds.includes(g.id) ? <CheckCircle className="w-5 h-5 text-violet-400" /> : <div className="w-5 h-5 rounded-full border border-slate-800" />}
                                    </button>
                                );
                            })}
                        </div>
                        <button 
                            disabled={selectedGameIds.length === 0}
                            onClick={() => setStep('select-payment')}
                            className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm uppercase tracking-widest disabled:opacity-50"
                        >
                            Continue to Payment (${totalFee.toFixed(2)})
                        </button>
                    </div>
                )}

                {step === 'select-payment' && (
                    <div className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white font-['Rajdhani']">Confirm Registration</h2>
                        <div className="space-y-3">
                            <button onClick={() => setPaymentMethod('wallet')} className={`w-full p-4 rounded-2xl border flex items-center ${paymentMethod === 'wallet' ? 'bg-violet-600/10 border-violet-500' : 'bg-slate-950 border-slate-800'}`}>
                                <Wallet className="w-5 h-5 mr-4 text-violet-400" />
                                <div className="text-left"><p className="text-sm font-bold text-white">Wallet</p><p className="text-[10px] text-slate-500">${user.walletBalance.toFixed(2)} available</p></div>
                            </button>
                        </div>
                        <button onClick={handleConfirm} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold text-sm">Pay ${totalFee.toFixed(2)} Now</button>
                    </div>
                )}
                {step === 'processing' && <div className="p-16 text-center"><Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" /><p className="text-white font-bold">Processing...</p></div>}
                {step === 'success' && <div className="p-16 text-center"><CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" /><p className="text-white font-bold">Success!</p></div>}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function TournamentDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const id = route.params?.id as string;
  const { tournaments, matches, user, registerForTournament, leaveTournament, calculateLevel, openDirectMessage } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'bracket' | 'announcements' | 'participants'>('bracket');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const tournament = tournaments.find(t => t.id === id);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(() => tournament?.games[0]?.id || null);
  
  if (!tournament || !user) return <View className="p-10 items-center"><Text className="text-white">Loading...</Text></View>;

  const activeGame = tournament.games.find(g => g.id === selectedGameId);
  const gameMatches = matches.filter(m => m.tournamentId === tournament.id && m.gameId === selectedGameId);
  const userLevel = calculateLevel(user.xp);
  const isLocked = tournament.minLevel && userLevel < tournament.minLevel;

  const isRegisteredInAnyGame = useMemo(() => {
    if (!user || !tournament) return false;
    return tournament.registeredPlayers.some((p: any) => p.id === user.id);
  }, [tournament, user]);


  const handleLeaveTournament = async () => {
    Alert.alert(
      'Confirm withdrawal?',
      'Your slot will be immediately reopened.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: async () => {
            setIsLeaving(true);
            try {
                await leaveTournament(tournament.id);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLeaving(false);
            }
        } }
      ]
    );
  };

  const matchesByRound = useMemo(() => {
    return gameMatches.reduce((acc, match) => {
        if (!acc[match.round]) acc[match.round] = [];
        acc[match.round].push(match);
        return acc;
    }, {} as Record<string, Match[]>);
  }, [gameMatches]);

  const roundOrder = ['Round 1', 'Quarter-Finals', 'Semi-Finals', 'Finals'];
  const activeRounds = roundOrder.filter(r => matchesByRound[r]);
  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  return (
    <ScrollView className="flex-1 bg-[#020617] space-y-6 md:space-y-8 pb-20">
      <BlurHeader title={tournament.title} right={<TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Notifications' as any)}><Text style={{color:'#fff'}}>🔔</Text></TouchableOpacity>} />
      {showCheckout && (
          <CheckoutModal 
            tournament={tournament} 
            user={user} 
            onClose={() => setShowCheckout(false)} 
            onSuccess={async (gameIds, method) => { await registerForTournament(tournament.id, gameIds, method); }}
          />
      )}

      {selectedMatchId && selectedMatch && (
          <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatchId(null)} />
      )}

      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl min-h-[300px] md:min-h-[400px]">
        <div className="absolute inset-0">
            {tournament.imageUrl ? <img src={tournament.imageUrl} className="w-full h-full object-cover opacity-40" /> : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-slate-950 opacity-60"></div>}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter font-['Rajdhani'] uppercase leading-none">{tournament.title}</h1>
                    <div className="flex flex-wrap gap-4 text-slate-400 text-xs md:text-sm font-mono">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {format(new Date(tournament.date), 'PPP')}</span>
                        <span className="flex items-center"><Trophy className="w-4 h-4 mr-2 text-emerald-400" /> {tournament.prizePool}</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {isLocked ? (
                        <button disabled className="px-8 py-3 bg-slate-800 text-slate-500 border border-slate-700 rounded-2xl font-bold cursor-not-allowed uppercase text-xs">
                            <Lock className="w-4 h-4 mr-2" /> Locked
                        </button>
                    ) : isRegisteredInAnyGame ? (
                        <TouchableOpacity
                            onPress={handleLeaveTournament}
                            disabled={isLeaving}
                            activeOpacity={0.85}
                            className={`px-8 py-3 rounded-2xl font-bold shadow-2xl transition-all flex items-center text-xs uppercase tracking-widest ${isLeaving ? 'bg-slate-800 text-slate-500 opacity-50' : 'bg-slate-800 hover:bg-red-900/40 text-red-500 border border-red-500/20'}`}
                        >
                            {isLeaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                            <Text>Leave Tournament</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => {
                            if (!user) {
                                Alert.alert(
                                    'Sign up required',
                                    'Please create an account to register for tournaments.',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Sign Up', onPress: () => navigation.navigate('Auth' as any) }
                                    ]
                                );
                            } else {
                                setShowCheckout(true);
                            }
                        }} activeOpacity={0.85} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-2xl flex items-center text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                            <Zap className="w-4 h-4 mr-2" />
                            <Text>Register Now</Text>
                        </TouchableOpacity>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-slate-800 pb-4">
                <div className="flex gap-6 min-w-max">
                    <TouchableOpacity onPress={() => setActiveTab('bracket')} activeOpacity={0.85} className={`pb-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'bracket' ? 'border-violet-500 text-white' : 'border-transparent text-slate-500'}`}><Text>Arena</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('participants')} activeOpacity={0.85} className={`pb-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'participants' ? 'border-violet-500 text-white' : 'border-transparent text-slate-500'}`}><Text>Players</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('announcements')} activeOpacity={0.85} className={`pb-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'announcements' ? 'border-violet-500 text-white' : 'border-transparent text-slate-500'}`}><Text>Announcements</Text></TouchableOpacity>
                </div>
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 w-fit">
                    {tournament.games.map(g => (
                        <button key={g.id} onClick={() => setSelectedGameId(g.id)} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${selectedGameId === g.id ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                            {g.customName || g.type}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'bracket' && (
                <div className="min-h-[400px] overflow-x-auto custom-scrollbar pb-10">
                    {gameMatches.length === 0 ? (
                        <View className="text-center py-20 opacity-30"><LayoutGrid className="w-12 h-12 mx-auto mb-4" /><Text className="text-xs uppercase font-bold">Awaiting Brackets</Text></View>
                    ) : (
                        <FlatList
                          data={activeRounds}
                          horizontal
                          keyExtractor={(item) => item}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
                          renderItem={({ item: round }) => (
                            <View key={round} className="space-y-8 min-w-[300px]">
                              <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-['Rajdhani'] border-b border-slate-800/50 pb-2">{round}</Text>
                              <FlatList
                                data={matchesByRound[round]}
                                keyExtractor={(m) => m.id}
                                renderItem={({ item: m }) => <MatchCard match={m} onClick={() => setSelectedMatchId(m.id)} />}
                                showsVerticalScrollIndicator={false}
                                style={{ marginTop: 8 }}
                              />
                            </View>
                          )}
                        />
                    )}
                </div>
            )}

            {activeTab === 'participants' && (
                <FlatList
                  data={tournament.registeredPlayers.filter(p => p.gameIds.includes(selectedGameId || ''))}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  renderItem={({ item: player }) => (
                    <View key={player.id} className="flex-1 m-2 bg-slate-900 border border-slate-800 rounded-3xl p-5">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-4">
                                <View className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400">{player.gamertag?.substring(0,2).toUpperCase()}</View>
                                <Text className="font-bold text-white uppercase text-sm">{player.gamertag}</Text>
                            </View>
                            {player.id === user.id && <Text className="bg-violet-600 text-[8px] px-2 py-1 rounded font-black text-white">YOU</Text>}
                        </View>
                    </View>
                  )}
                />
            )}

            {activeTab === 'announcements' && (
                <View className="space-y-4 max-w-2xl">
                    {tournament.announcements.length === 0 ? <Text className="text-slate-600 text-center py-10 italic">No announcements.</Text> : (
                        <FlatList
                          data={tournament.announcements}
                          keyExtractor={(a) => a.id}
                          renderItem={({ item: a }) => (
                            <View key={a.id} className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl flex-row gap-4">
                                <Megaphone className="w-5 h-5 text-violet-500 shrink-0" />
                                <Text className="text-sm text-slate-300">{a.message}</Text>
                            </View>
                          )}
                        />
                    )}
                </View>
            )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-800/50">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white font-['Rajdhani'] flex items-center gap-3"><ScrollText className="w-5 h-5 text-violet-500" /> Details</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{tournament.description}</p>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white font-['Rajdhani'] flex items-center gap-3"><ShieldAlert className="w-5 h-5 text-red-500" /> Rules</h3>
                <ul className="space-y-3">
                    {tournament.rules.map((rule, idx) => (
                        <li key={idx} className="flex text-sm text-slate-400 gap-3"><span className="text-red-500 font-bold">{idx + 1}.</span> {rule}</li>
                    ))}
                </ul>
            </div>
      </div>
    </div>
  );
}
