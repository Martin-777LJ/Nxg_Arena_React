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
import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../context';
import { Calendar, Users, Trophy, Search, Sliders, ShieldCheck, Gamepad2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Tournament, GameType, TournamentStatus } from '../types';

// --- COMPONENTS ---

interface TournamentCardProps {
  tournament: Tournament;
  style?: React.CSSProperties;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, style }) => {
  const navigate = useNavigate();
  const { user, getParticipantProfile } = useAppStore();
  
  const isRegistered = useMemo(() => 
    tournament.registeredPlayers.some(p => p.id === user?.id), 
    [tournament.registeredPlayers, user?.id]
  );

  const primaryGameType = tournament.games.length > 0 ? (tournament.games[0].customName || tournament.games[0].type) : 'Event';
  const totalCapacity = tournament.games.reduce((acc, g) => acc + g.maxParticipants, 0);

  return (
    <div 
        onClick={() => navigate(`/tournament/${tournament.id}`)}
        style={style}
        className="group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-900/10 transition-all duration-500 relative h-full animate-enter"
    >
        <div className="h-40 md:h-44 bg-slate-800 relative overflow-hidden flex-shrink-0">
            {tournament.imageUrl ? (
                <img 
                    src={tournament.imageUrl} 
                    alt={tournament.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 group-hover:scale-105 transition-transform duration-700"></div>
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
            
            <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="px-2 py-1 bg-violet-600/90 backdrop-blur-md border border-violet-500/40 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-xl">
                    {primaryGameType}
                </span>
                {isRegistered && (
                    <span className="px-2 py-1 bg-emerald-600/90 backdrop-blur-md border border-emerald-500/40 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-xl">
                        Joined
                    </span>
                )}
            </div>
            
            <div className="absolute top-3 right-3 flex items-center bg-black/60 px-2 py-1 rounded-xl text-xs text-slate-200 backdrop-blur-xl border border-white/10 shadow-2xl">
                <Users className="w-3 h-3 mr-1.5 text-violet-400" />
                <span className="font-mono font-bold">{tournament.registeredPlayers.length}/{totalCapacity}</span>
            </div>
        </div>

        <div className="p-4 flex-1 flex flex-col bg-slate-900 transition-colors border-t border-slate-800/50">
            <div className="flex justify-between items-start mb-3 gap-4">
                <h3 className="font-bold text-lg text-white group-hover:text-violet-400 transition-colors line-clamp-1 font-['Rajdhani']">
                    {tournament.title}
                </h3>
            </div>
            
            <div className="flex items-center text-[10px] text-slate-400 mb-4 font-mono bg-slate-950/50 w-fit px-2 py-1 rounded-lg border border-slate-800">
                <Calendar className="w-3 h-3 mr-2 text-slate-600" />
                {format(new Date(tournament.date), 'MMM d • h:mm a')}
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/80">
                <div className="space-y-0.5">
                     <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Prize Pool</p>
                     <p className="text-emerald-400 font-bold font-mono text-base leading-none">{tournament.prizePool}</p>
                </div>
                
                <div className={`px-2 py-1 rounded-xl text-[9px] uppercase font-bold tracking-widest border flex items-center shadow-lg transition-all ${
                    tournament.status === TournamentStatus.ONGOING ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    tournament.status === TournamentStatus.COMPLETED ? 'bg-slate-800 text-slate-500 border-slate-700' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                    {tournament.status === TournamentStatus.ONGOING && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />}
                    {tournament.status}
                </div>
            </div>
        </div>
    </div>
  );
};

// --- LOADING SCREEN COMPONENT (Updated CSS for Centering) ---
const GameLoadingScreen = ({ progress, loadingText }: { progress: number, loadingText: string }) => (
    <div className="fixed top-0 left-0 w-full h-[100dvh] z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 overscroll-none">
        <div className="w-full max-w-md space-y-8 text-center flex flex-col items-center justify-center">
            {/* Logo or Icon */}
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-violet-600 blur-2xl opacity-20 animate-pulse"></div>
                                
                <h1 className="text-3xl font-black text-white uppercase tracking-widest font-['Rajdhani']">
                    WELCOME
                </h1>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-2 w-full">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>{loadingText}</span>
                    <span className="text-violet-400">{Math.round(progress)}%</span>
                </div>
                
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                        className="h-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Tips / Flavor Text */}
            <p className="text-[10px] text-slate-600 font-mono animate-pulse">
                LOADING...
            </p>
        </div>
    </div>
);

// --- MAIN DASHBOARD ---

export default function Dashboard() {
  const { tournaments, isLoading } = useAppStore();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Loading State
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");

  // SMART LOADING LOGIC
  useEffect(() => {
    const texts = ["Fetching Tournaments...", "Syncing Player Data...", "Calibrating...", "Loading Assets..."];
    let textIndex = 0;
    
    // Timer to update text
    const textInterval = setInterval(() => {
        textIndex = (textIndex + 1) % texts.length;
        setLoadingText(texts[textIndex]);
    }, 800);

    const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
            // If actual data is still loading, cap at 90%
            if (isLoading && prev >= 90) return 90;
            
            // If data is ready, speed up to 100%
            if (!isLoading) {
                const jump = prev + 5; 
                return jump >= 100 ? 100 : jump;
            }

            // Normal slow increment
            return prev + Math.random() * 5;
        });
    }, 100);

    return () => {
        clearInterval(progressInterval);
        clearInterval(textInterval);
    };
  }, [isLoading]);

  // Reveal Dashboard when progress hits 100%
  useEffect(() => {
    if (loadingProgress >= 100) {
        setTimeout(() => setShowDashboard(true), 200); // Small delay for smoothness
    }
  }, [loadingProgress]);


  const featuredTournament = useMemo(() => {
    return tournaments.find(t => t.isPriority) || 
           tournaments.find(t => t.status === 'Ongoing') || 
           tournaments[0];
  }, [tournaments]);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGame = gameFilter === 'All' || t.games.some(g => g.type === gameFilter);
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const isNotFeatured = !featuredTournament || t.id !== featuredTournament.id;
        return matchesSearch && matchesGame && matchesStatus && isNotFeatured;
    });
  }, [tournaments, searchQuery, gameFilter, statusFilter, featuredTournament]);

  // RENDER: Show Loading Screen UNTIL ready
  if (!showDashboard) {
      return <GameLoadingScreen progress={loadingProgress} loadingText={loadingText} />;
  }

  return (
    <div className="animate-enter">
      {/* Header & Search */}
      <div className="flex flex-col gap-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 md:w-7 md:h-7 text-violet-500" />
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight font-['Rajdhani']">Discover Tournaments</h1>
            </div>
            
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-xl border font-medium text-sm flex items-center justify-center transition-all ${showFilters ? 'bg-violet-600 border-violet-500 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}
            >
                <Sliders className="w-4 h-4 mr-2" /> Filters
            </button>
          </div>

          <div className="relative">
              <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 shadow-xl">
                  <Search className="w-5 h-5 text-slate-500 mr-3" />
                  <input 
                      type="text" 
                      placeholder="Search tournaments..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-white w-full placeholder-slate-600 text-sm"
                  />
              </div>
          </div>
      </div>

      {showFilters && (
          <div className="mb-8 p-4 bg-slate-900 border border-slate-800 rounded-2xl animate-enter">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select 
                    value={gameFilter}
                    onChange={(e) => setGameFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  >
                      <option value="All">All Games</option>
                      {Object.values(GameType).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  >
                      <option value="All">All Statuses</option>
                      {Object.values(TournamentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
              </div>
          </div>
      )}

      {/* DYNAMIC HERO SECTION */}
      {!searchQuery && !showFilters && featuredTournament ? (
        <div 
            onClick={() => navigate(`/tournament/${featuredTournament.id}`)}
            className="mb-8 relative group cursor-pointer overflow-hidden rounded-[2rem] border border-slate-800"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 to-indigo-900/90 mix-blend-multiply z-10"></div>
            {featuredTournament.imageUrl ? (
                <img src={featuredTournament.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            ) : (
                <div className="absolute inset-0 bg-slate-800 group-hover:scale-105 transition-transform duration-1000"></div>
            )}
            
            <div className="relative z-20 p-6 md:p-10 flex flex-col justify-between h-full gap-6">
                <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <Trophy className="w-3 h-3 mr-2" /> Featured Event
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight font-['Rajdhani'] leading-none">
                        {featuredTournament.title}
                    </h2>
                </div>
                
                <div className="flex items-end justify-between">
                    <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-xl">
                        Join Now
                    </button>
                    <div className="text-right hidden md:block">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Prize Pool</p>
                        <p className="text-3xl font-black text-emerald-400 font-mono">{featuredTournament.prizePool}</p>
                    </div>
                </div>
            </div>
        </div>
      ) : !searchQuery && !showFilters && (
        <div className="mb-8 p-12 text-center border border-slate-800 border-dashed rounded-[2rem] bg-slate-900/30">
            <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Active Tournaments</h2>
            <p className="text-slate-500 text-sm">Be the first to create one!</p>
        </div>
      )}

      {/* TOURNAMENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredTournaments.map((tournament, idx) => (
            <TournamentCard 
                key={tournament.id} 
                tournament={tournament} 
                style={{ animationDelay: `${idx * 100}ms` }}
            />
        ))}
      </div>

      {filteredTournaments.length === 0 && searchQuery && (
          <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No tournaments found matching "{searchQuery}"</p>
          </div>
      )}
    </div>
  );
}
