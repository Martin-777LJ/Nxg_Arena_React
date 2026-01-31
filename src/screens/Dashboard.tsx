import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../context';
import { Calendar, Users, Trophy, Search, Sliders, ShieldCheck, Gamepad2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Tournament, GameType, TournamentStatus } from '../types';
import { RootStackParamList } from '../types/navigation';
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import BlurHeader from '../components/BlurHeader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  card: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    height: 160,
    backgroundColor: '#0f172a',
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    flex: 1,
    backgroundColor: '#0f172a',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
  },
  noResultsContainer: {
    padding: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

// Simple date formatter utility
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  const displayHours = date.getHours() % 12 || 12;
  return `${month} ${day} • ${displayHours}:${minutes} ${ampm}`;
};

// --- COMPONENTS ---

interface TournamentCardProps {
  tournament: Tournament;
  style?: any;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, style }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, getParticipantProfile } = useAppStore();
  
  const isRegistered = useMemo(() => 
    tournament.registeredPlayers.some(p => p.id === user?.id), 
    [tournament.registeredPlayers, user?.id]
  );

  const primaryGameType = tournament.games.length > 0 ? (tournament.games[0].customName || tournament.games[0].type) : 'Event';
  const totalCapacity = tournament.games.reduce((acc, g) => acc + g.maxParticipants, 0);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('TournamentDetails', { id: tournament.id })}
      style={[styles.card, style]}
      activeOpacity={0.85}
    >
      <View style={styles.cardImage}>
        {tournament.imageUrl ? (
          <Image
            source={{ uri: tournament.imageUrl }}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <View style={{ width: '100%', height: '100%', backgroundColor: '#1e293b' }} />
        )}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />

        <View style={{ position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', gap: 8 }}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{primaryGameType}</Text>
          </View>
          {isRegistered && (
            <View style={[styles.badge, { backgroundColor: '#10b981' }]}>
              <Text style={styles.badgeText}>Joined</Text>
            </View>
          )}
        </View>

        <View style={{ position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
          <Users size={12} color="#a78bfa" style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#fff', fontSize: 12 }}>
            {tournament.registeredPlayers.length}/{totalCapacity}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff', marginBottom: 8 }}>
            {tournament.title}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#0b1220', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' }}>
          <Calendar size={12} color="#475569" style={{ marginRight: 6 }} />
          <Text style={{ color: '#94a3b8', fontSize: 10 }}>
            {formatDate(tournament.date)}
          </Text>
        </View>

        <View style={{ marginTop: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1e293b' }}>
          <View>
            <Text style={{ fontSize: 9, color: '#64748b', fontWeight: 'bold' }}>Prize Pool</Text>
            <Text style={{ color: '#10b981', fontWeight: 'bold', fontFamily: 'monospace', fontSize: 16 }}>
              {tournament.prizePool}
            </Text>
          </View>

          <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', borderColor: tournament.status === TournamentStatus.ONGOING ? '#ef4444' : tournament.status === TournamentStatus.COMPLETED ? '#475569' : '#3b82f6' }}>
            {tournament.status === TournamentStatus.ONGOING && (
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#ef4444', marginRight: 6 }} />
            )}
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: tournament.status === TournamentStatus.ONGOING ? '#ef4444' : tournament.status === TournamentStatus.COMPLETED ? '#64748b' : '#60a5fa' }}>
              {tournament.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- LOADING SCREEN COMPONENT ---
const GameLoadingScreen = ({ progress, loadingText }: { progress: number, loadingText: string }) => (
    <View style={{ flex: 1, backgroundColor: '#0b1220', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <View style={{ width: '100%', maxWidth: 320, gap: 32, justifyContent: 'center', alignItems: 'center' }}>
            {/* Logo or Icon */}
            <View style={{ position: 'relative' }}>
                <View style={{ position: 'absolute', inset: 0, backgroundColor: '#7c3aed', opacity: 0.2, borderRadius: 50 }} />
                <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 2 }}>
                    WELCOME
                </Text>
            </View>

            {/* Progress Bar Container */}
            <View style={{ width: '100%', gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#64748b' }}>
                        {loadingText}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#7c3aed' }}>
                        {Math.round(progress)}%
                    </Text>
                </View>
                
                <View style={{ height: 8, width: '100%', backgroundColor: '#0f172a', borderRadius: 9999, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' }}>
                    <View 
                        style={{ 
                            height: '100%',
                            backgroundColor: '#7c3aed',
                            width: `${progress}%`,
                        }}
                    />
                </View>
            </View>

            {/* Tips / Flavor Text */}
            <Text style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>
                LOADING...
            </Text>
        </View>
    </View>
);

// --- MAIN DASHBOARD ---

export default function Dashboard() {
  const { tournaments, isLoading, user, signOut } = useAppStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

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
        const matchesGame = gameFilter === 'All' || t.games.some((g: any) => g.type === gameFilter);
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
    <View style={styles.container}>
      <BlurHeader title="Discover Tournaments" right={<TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Notifications')}><Text style={{color:'#fff'}}>🔔</Text></TouchableOpacity>} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header & Search */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Trophy size={28} color="#a78bfa" />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Discover Tournaments</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity 
              onPress={() => setShowFilters(!showFilters)} 
              activeOpacity={0.85} 
              style={{ 
                paddingHorizontal: 16, 
                paddingVertical: 10, 
                borderRadius: 12, 
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: showFilters ? '#7c3aed' : '#1e293b',
                borderColor: showFilters ? '#7c3aed' : '#334155'
              }}
            >
              <Sliders size={16} color={showFilters ? '#fff' : '#94a3b8'} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: showFilters ? '#fff' : '#94a3b8' }}>Filters</Text>
            </TouchableOpacity>

            {/* User area */}
            { !user ? (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Auth')} 
                activeOpacity={0.85} 
                style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#7c3aed', borderRadius: 8 }}
              >
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff' }}>Sign Up</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity 
                  onPress={() => setShowAccountMenu(true)} 
                  activeOpacity={0.85} 
                  style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 8 }}
                >
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>{user?.gamertag}</Text>
                </TouchableOpacity>

                <Modal transparent visible={showAccountMenu} animationType="fade">
                  <TouchableOpacity 
                    style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.4)'}} 
                    onPress={() => setShowAccountMenu(false)} 
                    activeOpacity={0.85}
                  >
                    <View style={{backgroundColor:'#0b1220',padding:16,borderRadius:12,minWidth:200}}>
                      <TouchableOpacity onPress={() => { setShowAccountMenu(false); navigation.navigate('Home', { screen: 'Profile' }); }} activeOpacity={0.85} style={{paddingVertical:8}}>
                        <Text style={{color:'#fff'}}>Profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setShowAccountMenu(false); signOut(); }} activeOpacity={0.85} style={{paddingVertical:8}}>
                        <Text style={{color:'#ef4444'}}>Logout</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </>
            )}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <TextInput
              placeholder="Search tournaments..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#64748b"
              style={styles.textInput}
            />
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={{ marginBottom: 32, marginHorizontal: 16, padding: 16, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 16 }}>
              <View style={{ gap: 16 }}>
                  <TouchableOpacity 
                    style={{ width: '100%', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}
                  >
                      <Text style={{ color: '#fff', fontSize: 14 }}>{gameFilter}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{ width: '100%', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}
                  >
                      <Text style={{ color: '#fff', fontSize: 14 }}>{statusFilter}</Text>
                  </TouchableOpacity>
              </View>
          </View>
        )}

        {/* FEATURED TOURNAMENT */}
        {!searchQuery && !showFilters && featuredTournament ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('TournamentDetails', { id: featuredTournament.id })}
              activeOpacity={0.85}
              style={{ marginHorizontal: 16, marginBottom: 32, backgroundColor: '#7c3aed', borderRadius: 24, overflow: 'hidden' }}
          >
              <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(123, 58, 237, 0.9)' }} />
              {featuredTournament.imageUrl ? (
                  <Image source={{ uri: featuredTournament.imageUrl }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              ) : (
                  <View style={{ position: 'absolute', inset: 0, backgroundColor: '#1e293b' }} />
              )}
              
              <View style={{ position: 'relative', paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'space-between', minHeight: 300 }}>
                  <View>
                      <View style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(234, 179, 8, 0.2)', borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.3)', marginBottom: 16, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                          <Trophy size={12} color="#fbbf24" style={{ marginRight: 6 }} />
                          <Text style={{ color: '#fbbf24', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>Featured Event</Text>
                      </View>
                      <Text style={{ fontSize: 32, fontWeight: '900', color: '#fff', textTransform: 'uppercase' }}>
                          {featuredTournament.title}
                      </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <TouchableOpacity activeOpacity={0.85} style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12 }}>
                          <Text style={{ color: '#0b1220', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Join Now</Text>
                      </TouchableOpacity>
                      <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ color: '#cbd5e1', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold', marginBottom: 4 }}>Prize Pool</Text>
                          <Text style={{ fontSize: 28, fontWeight: '900', color: '#10b981', fontFamily: 'monospace' }}>{featuredTournament.prizePool}</Text>
                      </View>
                  </View>
              </View>
          </TouchableOpacity>
        ) : !searchQuery && !showFilters && (
          <View style={{ marginHorizontal: 16, marginBottom: 32, paddingVertical: 48, paddingHorizontal: 48, borderWidth: 1, borderColor: '#334155', borderStyle: 'dashed', borderRadius: 32, backgroundColor: 'rgba(30, 41, 59, 0.3)', justifyContent: 'center', alignItems: 'center' }}>
              <Trophy size={48} color="#64748b" style={{ marginBottom: 16 }} />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 }}>No Active Tournaments</Text>
              <Text style={{ color: '#64748b', fontSize: 14 }}>Be the first to create one!</Text>
          </View>
        )}

        {/* TOURNAMENT GRID */}
        <View style={{ paddingHorizontal: 16 }}>
          <FlatList
            data={filteredTournaments}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item, index }) => (
              <TournamentCard 
                tournament={item} 
                style={{ flex: 1, marginRight: index % 2 === 0 ? 8 : 0, marginBottom: 16 }}
              />
            )}
            scrollEnabled={false}
          />
        </View>

        {filteredTournaments.length === 0 && searchQuery && (
          <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No tournaments found matching "{searchQuery}"</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
