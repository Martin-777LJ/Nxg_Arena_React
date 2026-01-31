import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; 
import { User, Tournament, Match, Notification, TournamentStatus, LeaderboardEntry, NotificationType, ChatMessage, ChatRoom } from './types';
import { supabase } from './supabase';
import { api } from './api';

interface AppContextType {
  user: User | null;
  session: any | null;
  tournaments: Tournament[];
  matches: Match[];
  notifications: Notification[];
  leaderboard: LeaderboardEntry[];
  activeToast: Notification | null;
  chatRooms: ChatRoom[];
  chatMessages: ChatMessage[];
  isLoading: boolean;
  isAuthLoading: boolean;
  transactions: any[];
  organizerRequests: User[];
  allUsers: User[];
  
  signIn: (email: string, pass: string) => Promise<{error: any}>;
  signUp: (email: string, pass: string, gamertag: string) => Promise<{error: any}>;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<{error: any}>;
  verifyOtp: (phone: string, token: string) => Promise<{error: any}>;
  signOut: () => Promise<void>;

  toggleOrganizerMode: () => void;
  registerForTournament: (id: string, selectedGameIds: string[], method: 'wallet' | 'external') => Promise<boolean>;
  leaveTournament: (id: string) => Promise<void>; // Added to interface
  createTournament: (t: any) => Promise<void>;
  updateTournament: (id: string, data: Partial<Tournament>) => Promise<void>;
  updateUser: (u: Partial<User>) => Promise<void>;
  updateMatch: (id: string, data: Partial<Match>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  markNotificationRead: (id: string) => void;
  dismissToast: () => void;
  sendMessage: (roomId: string, text: string) => void;
  calculateLevel: (xp: number) => number;
  refreshAppData: () => Promise<void>;

  getParticipantProfile: (id: string) => any;
  claimMatchHost: (matchId: string) => void;
  submitMatchTag: (matchId: string, tag: string) => void;
  confirmMatchJoin: (matchId: string) => void;
  startMatch: (matchId: string) => void;
  forfeitMatch: (matchId: string) => void;
  verifyResultWithAI: (matchId: string, base64: string) => Promise<{ winnerId: string, score: string } | null>;
  openDirectMessage: (playerId: string) => string;
  generateBracket: (tId: string, gId: string) => void;
  simulateReferral: () => void;
  addAnnouncement: (tId: string, msg: string) => void;
  buyStoreItem: (type: 'xp' | 'badge' | 'subscription', idOrAmount: any, cost: number, name: string) => Promise<void>;
  
  submitOrganizerRequest: () => Promise<void>;
  approveOrganizer: (userId: string) => Promise<void>;
  rejectOrganizer: (userId: string) => Promise<void>;
  refreshAdminData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([{ id: 'global', type: 'global', name: 'Global Arena Chat', participantIds: [] }]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [organizerRequests, setOrganizerRequests] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
          setUser(null);
          setIsLoading(false); 
      }
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const messageChannel = supabase
      .channel('realtime_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage: ChatMessage = {
          id: payload.new.id,
          roomId: payload.new.room_id,
          senderId: payload.new.sender_id,
          text: payload.new.text,
          timestamp: payload.new.created_at || new Date().toISOString()
        };
        
        setChatMessages(prev => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          const withoutOptimistic = prev.filter(m => 
            !(m.id.startsWith('temp-') && 
              m.senderId === newMessage.senderId && 
              m.roomId === newMessage.roomId && 
              m.text === newMessage.text)
          );
          return [...withoutOptimistic, newMessage];
        });
      })
      .subscribe();

    const matchChannel = supabase
      .channel('realtime_matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        refreshMatches();
      })
      .subscribe();

    const tournamentChannel = supabase
      .channel('realtime_tournaments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, () => {
        refreshTournaments();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => {
        refreshTournaments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(matchChannel);
      supabase.removeChannel(tournamentChannel);
    };
  }, [session]);

  const fetchProfile = async (userId: string) => {
    try {
        const dbProfile = await api.fetchCurrentUser(userId);
        if (dbProfile) setUser(dbProfile);
    } catch (e) {
        setUser(null);
    }
  };

  const refreshTournaments = async () => {
    const tData = await api.getTournaments();
    setTournaments(tData || []);
  };

  const refreshMatches = async () => {
    const mData = await api.getAllMatches();
    setMatches(mData || []);
  };

  const refreshAdminData = async () => {
    if (!user?.isAdmin) return;
    try {
        const [requests, users] = await Promise.all([
            api.getOrganizerRequests(),
            api.getAllUsers()
        ]);
        setOrganizerRequests(requests);
        setAllUsers(users);
    } catch (err) {
        console.error("Admin data refresh failed", err);
    }
  };

  const refreshAppData = async () => {
      setIsLoading(true);
      try {
          const [tData, mData, lData, txData] = await Promise.all([
              api.getTournaments(),
              api.getAllMatches(),
              api.getLeaderboard(),
              session?.user?.id ? api.getWalletTransactions(session.user.id) : Promise.resolve([])
          ]);
          setTournaments(tData || []);
          setMatches(mData || []);
          setLeaderboard(lData || []);
          setTransactions(txData || []);
          
          if (user?.isAdmin) {
              await refreshAdminData();
          }

          const messages = await api.getMessages('global');
          setChatMessages(messages.map(m => ({
            id: m.id,
            roomId: m.room_id,
            senderId: m.sender_id,
            text: m.text,
            timestamp: m.created_at
          })));
      } catch (err: any) {
          console.error("Data refresh failed", err.message);
          if (err.message.includes('infinite recursion')) {
             triggerNotification('system', 'System Error', 'Database security policy recursion detected. Please contact system admin.');
          }
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    if (session) refreshAppData();
  }, [session, user?.isAdmin]);

  const triggerNotification = (type: NotificationType, title: string, message: any) => {
    const stringMessage = typeof message === 'string' ? message : (message?.message || JSON.stringify(message));
    const newNotif: Notification = { id: Date.now().toString(), type, title, message: stringMessage, date: new Date().toISOString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
    setTimeout(() => setActiveToast(null), 4000);
  };

  const signIn = async (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
  const signUp = async (email: string, password: string, gamertag: string) => {
    const res = await supabase.auth.signUp({ email, password });
    if (!res.error && res.data.user) {
        await api.updateProfile(res.data.user.id, { gamertag, email, organizerStatus: 'none', isAdmin: false, isOrganizer: false });
        await fetchProfile(res.data.user.id);
    }
    return res;
  };

  const signInWithGoogle = async () => supabase.auth.signInWithOAuth({ provider: 'google' });
  const signInWithPhone = async (phone: string) => supabase.auth.signInWithOtp({ phone });
  const verifyOtp = async (phone: string, token: string) => supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setSession(null); };

  const updateUser = async (data: Partial<User>) => {
      if (!user) return;
      try {
          await api.updateProfile(user.id, data);
          await fetchProfile(user.id);
      } catch (e: any) {
          triggerNotification('system', 'Sync Failed', e.message);
      }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    try {
        const url = await api.uploadAvatar(user.id, file);
        await updateUser({ avatarUrl: url });
        triggerNotification('system', 'Avatar Updated', 'Your profile image has been synchronized.');
    } catch (e: any) {
        triggerNotification('system', 'Upload Error', e.message);
    }
  };

  const registerForTournament = async (id: string, selectedGameIds: string[], method: 'wallet' | 'external'): Promise<boolean> => {
    if (!user) {
      triggerNotification('error', 'Error', 'Not logged in');
      return false;
    }
    
    const previousTournaments = tournaments;
    
    try {
        await api.joinTournament(id, user.id, selectedGameIds);
        await refreshTournaments();
        triggerNotification('payment', 'Registered', 'Entry confirmed.');
        return true;
    } catch (e: any) {
        console.error("Tournament registration failed:", e);
        // Rollback UI state
        setTournaments(previousTournaments);
        triggerNotification('error', 'Registration Failed', e.message || 'Could not register. Please try again.');
        return false;
    }
  };

const leaveTournament = async (tournamentId: string) => {
  if (!user) return;
  try {
      // 1. Target the SPECIFIC tournament_participants table
      const { error } = await supabase
          .from('tournament_participants') 
          .delete()
          .match({ tournament_id: tournamentId, user_id: user.id });

      if (error) throw error;

      // 2. Refresh the local state immediately so the button UI changes
      await refreshTournaments();
      
      triggerNotification('system', 'Withdrawn', 'Your registration has been cancelled.');
  } catch (e: any) {
      console.error("Database Delete Error:", e.message);
      triggerNotification('system', 'Error', 'Could not sync with database.');
  }
};


  const createTournament = async (t: any) => {
    if (!user) return;
    try {
        await api.createTournament({ ...t, organizerId: user.id });
        await refreshTournaments();
        triggerNotification('system', 'Success', 'Tournament is now live.');
    } catch (e: any) {
        triggerNotification('system', 'Error', e.message);
    }
  };

  const updateTournament = async (id: string, data: Partial<Tournament>) => {
    try {
        await api.updateTournament(id, data);
        await refreshTournaments();
    } catch (e: any) {
        triggerNotification('system', 'Error', e.message);
    }
  };

  const updateMatch = async (id: string, data: Partial<Match>) => {
      try {
          await api.updateMatch(id, data);
          await refreshMatches();
      } catch (e: any) {
          triggerNotification('system', 'Error', e.message);
      }
  };

  const sendMessage = (roomId: string, text: string) => {
    if (!user) {
      triggerNotification('error', 'Error', 'Not logged in');
      return;
    }
    if (!text.trim()) return;
    
    const tempId = `temp-${Date.now()}`;
    setChatMessages(prev => [...prev, { id: tempId, roomId, senderId: user.id, text, timestamp: new Date().toISOString() }]);
    
    api.postMessage(roomId, user.id, text)
      .catch(e => {
        console.error("Chat sync error:", e.message);
        triggerNotification('error', 'Message Failed', 'Could not send message. Please try again.');
        // Remove optimistic message on failure
        setChatMessages(prev => prev.filter(m => m.id !== tempId));
      });
  };

  const getParticipantProfile = (id: string) => {
    for (const t of tournaments) {
      const p = t.registeredPlayers.find(rp => rp.id === id);
      if (p) return p;
    }
    return null;
  };

  const claimMatchHost = (matchId: string) => {
    if (!user) return;
    updateMatch(matchId, { connection: { hostId: user.id, status: 'waiting_for_tag' } });
  };

  const submitMatchTag = (matchId: string, tag: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    updateMatch(matchId, { connection: { ...match.connection, hostGameTag: tag, status: 'tag_ready' } });
  };

  const confirmMatchJoin = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    updateMatch(matchId, { connection: { ...match.connection, status: 'connected' } });
  };

  const startMatch = (matchId: string) => {
    updateMatch(matchId, { status: 'Live' });
    triggerNotification('match', 'Match Live', 'Combat initiated. Good luck.');
  };

  const forfeitMatch = (matchId: string) => {
    if (!user) return;
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    const opponentId = match.player1.id === user.id ? match.player2.id : match.player1.id;
    updateMatch(matchId, { status: 'Completed', winnerId: opponentId });
    triggerNotification('match', 'Forfeited', 'You have surrendered the match.');
  };

  const verifyResultWithAI = async (matchId: string, base64: string) => {
    try {
      const match = matches.find(m => m.id === matchId);
      if (!match) return null;
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) return null;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const mimeType = base64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || "image/png";
      const base64Data = base64.split(',')[1] || base64;
      
      const prompt = `Analyze this game screenshot. Player 1 is "${match.player1.name}", Player 2 is "${match.player2.name}". Return JSON: { winnerId, score }`;

      const result = await model.generateContent([
        prompt, { inlineData: { data: base64Data, mimeType: mimeType } }
      ]);
      
      const response = await result.response;
      return JSON.parse(response.text().replace(/```json|```/g, '').trim());
    } catch (err) {
      return null;
    }
  };

  const openDirectMessage = (playerId: string) => {
    if (!user) return 'global';
    const existing = chatRooms.find(r => r.type === 'direct' && r.participantIds.includes(playerId) && r.participantIds.includes(user.id));
    if (existing) return existing.id;
    const newRoom: ChatRoom = { id: `dr-${Date.now()}`, type: 'direct', name: `Direct: ${playerId}`, participantIds: [user.id, playerId] };
    setChatRooms(prev => [...prev, newRoom]);
    return newRoom.id;
  };

  const generateBracket = async (tId: string, gId: string) => {
    const t = tournaments.find(x => x.id === tId);
    if (!t) return;
    const players = [...t.registeredPlayers.filter(p => p.gameIds.includes(gId))];
    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }
    if (players.length < 2) return;
    
    for (let i = 0; i < players.length; i += 2) {
      if (players[i+1]) {
        await api.createMatch({
          tournament_id: tId, game_id: gId, round: 'Round 1',
          player1_id: players[i].id, player2_id: players[i+1].id,
          date: t.date, status: 'Scheduled'
        });
      }
    }
    const updatedGames = t.games.map(g => g.id === gId ? { ...g, status: TournamentStatus.ONGOING } : g);
    await updateTournament(tId, { games: updatedGames, status: TournamentStatus.ONGOING });
  };

  const simulateReferral = () => triggerNotification('reward', 'Referral Success', '+500 XP granted.');

  const addAnnouncement = async (tId: string, message: string) => {
    const t = tournaments.find(x => x.id === tId);
    if (!t) return;
    const newAnnouncement = { id: Date.now().toString(), message, date: new Date().toISOString(), read: false };
    const updatedAnnouncements = [...(t.announcements || []), newAnnouncement];
    await updateTournament(tId, { announcements: updatedAnnouncements });
  };

  const buyStoreItem = async (type: 'xp' | 'badge' | 'subscription', idOrAmount: any, cost: number, name: string) => {
    if (!user || user.walletBalance < cost) {
      triggerNotification('system', 'Payment Denied', 'Insufficient wallet balance.');
      return;
    }
    try {
      let updates: Partial<User> = { walletBalance: user.walletBalance - cost };
      if (type === 'xp') updates.xp = user.xp + idOrAmount;
      if (type === 'badge') updates.purchasedBadges = [...user.purchasedBadges, idOrAmount];
      if (type === 'subscription' && idOrAmount === 'pro_tier') updates.organizerTier = 'pro';

      await api.updateProfile(user.id, updates);
      await api.recordTransaction({ user_id: user.id, amount: cost, type: 'debit', title: `Purchased ${name}`, created_at: new Date().toISOString() });
      await fetchProfile(user.id);
      triggerNotification('reward', 'Unlocked', `${name} added to profile.`);
    } catch (e: any) {
      triggerNotification('system', 'Transaction Error', e.message);
    }
  };

  const submitOrganizerRequest = async () => {
    if (!user) return;
    try {
        await api.updateProfile(user.id, { organizerStatus: 'pending' });
        await fetchProfile(user.id);
        triggerNotification('system', 'Request Sent', 'Application pending review.');
    } catch (e: any) {
        triggerNotification('system', 'Error', e.message);
    }
  };

  const approveOrganizer = async (userId: string) => {
    try {
        await api.updateProfile(userId, { organizerStatus: 'approved', isOrganizer: true });
        await refreshAdminData();
        triggerNotification('system', 'Approved', 'User is now an organizer.');
    } catch (e: any) {
        triggerNotification('system', 'Error', e.message);
    }
  };

  const rejectOrganizer = async (userId: string) => {
    try {
        await api.updateProfile(userId, { organizerStatus: 'rejected', isOrganizer: false });
        await refreshAdminData();
        triggerNotification('system', 'Rejected', 'Request rejected.');
    } catch (e: any) {
        triggerNotification('system', 'Error', e.message);
    }
  };

  return (
    <AppContext.Provider value={{
      user, session, tournaments, matches, notifications, leaderboard, activeToast, chatRooms, chatMessages, isLoading, isAuthLoading, transactions,
      organizerRequests, allUsers,
      signIn, signUp, signInWithGoogle, signInWithPhone, verifyOtp, signOut, refreshAppData,
      toggleOrganizerMode: () => updateUser({ organizerMode: !user?.organizerMode }),
      registerForTournament, 
      leaveTournament, // Added to Provider
      createTournament, updateTournament,
      updateUser, updateMatch, uploadAvatar, 
      markNotificationRead: (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)),
      dismissToast: () => setActiveToast(null), calculateLevel: (xp) => Math.floor(xp / 1000) + 1, sendMessage,
      getParticipantProfile, claimMatchHost, submitMatchTag, confirmMatchJoin, startMatch, forfeitMatch, verifyResultWithAI,
      openDirectMessage, generateBracket, simulateReferral, addAnnouncement, buyStoreItem,
      submitOrganizerRequest, approveOrganizer, rejectOrganizer, refreshAdminData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within provider');
  return context;
};
