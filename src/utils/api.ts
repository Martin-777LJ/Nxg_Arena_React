import { supabase } from './supabase';
import { Tournament, Match, User, LeaderboardEntry, TournamentParticipant } from './types';

class ApiService {
  private handleError(error: any, context: string) {
    const message = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    if (message.includes('infinite recursion')) {
      console.error(`[ApiService] RLS Policy Recursion detected in ${context}. Please run the updated SQL setup script.`);
    } else if (message.includes('schema cache') || message.includes('Bucket not found')) {
      console.warn(`[ApiService] Resource missing in ${context}: ${message}. Please check Supabase setup.`);
    } else {
      console.error(`[ApiService] ${context}:`, message);
    }
    return message;
  }

  private mapProfileToUser(data: any): User {
    return {
      id: data.id,
      gamertag: data.gamertag || 'Anonymous',
      email: data.email || '',
      avatarUrl: data.avatar_url || '',
      xp: data.xp || 0,
      walletBalance: data.wallet_balance || 0,
      bio: data.bio || '',
      location: data.location || '',
      phoneNumber: data.phone_number || '',
      organizerMode: data.organizer_mode || false,
      organizerTier: data.organizer_tier || 'basic',
      isOrganizer: data.is_organizer || false,
      isAdmin: data.is_admin || false,
      organizerStatus: data.organizer_status || 'none',
      tournamentsCreatedMonth: 0,
      referralCode: data.referral_code || '',
      purchasedBadges: [],
      linkedAccounts: [],
      referralStats: { count: 0, totalEarned: 0 },
      stats: { wins: 0, losses: 0, tournamentsPlayed: 0 },
      settings: data.settings || {
        theme: 'dark',
        highContrast: false,
        largeText: false,
        textToSpeech: false,
        notifications: {
          matchReminders: true,
          opponentAssignments: true,
          tournamentUpdates: true,
          leaderboardChanges: true,
          referralRewards: true,
          adminAnnouncements: true,
          sound: true,
          vibration: true
        },
        privacy: {
          showOnlineStatus: true,
          allowFriendRequests: true,
          publicProfile: true
        }
      }
    };
  }

  private mapTournamentToDb(t: Partial<Tournament>): any {
    const db: any = { ...t };
    
    // Robust mapping helper that handles falsy values (0, "", null) correctly
    const rename = (oldKey: string, newKey: string) => {
      if (db[oldKey] !== undefined) {
        db[newKey] = db[oldKey];
        delete db[oldKey];
      }
    };

    rename('prizePool', 'prize_pool');
    rename('organizerId', 'organizer_id');
    rename('chatRoomId', 'chat_room_id');
    rename('isPriority', 'is_priority');
    rename('isVerifiedEvent', 'is_verified_event');
    rename('minLevel', 'min_level');
    rename('imageUrl', 'image_url');
    rename('prizeBreakdown', 'prize_breakdown');

    // Clean up UI only fields if they leak through
    delete db.createGroupChat; 
    
    return db;
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile_avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw new Error(this.handleError(uploadError, "uploadAvatar"));
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (e: any) {
      throw e;
    }
  }

  async fetchCurrentUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) return null;
    return this.mapProfileToUser(data);
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<void> {
    const dbData: any = { ...data };
    if (data.isAdmin !== undefined) dbData.is_admin = data.isAdmin;
    if (data.isOrganizer !== undefined) dbData.is_organizer = data.isOrganizer;
    if (data.organizerStatus !== undefined) dbData.organizer_status = data.organizerStatus;
    if (data.organizerMode !== undefined) dbData.organizer_mode = data.organizerMode;
    if (data.organizerTier !== undefined) dbData.organizer_tier = data.organizerTier;
    
    const { error } = await supabase.from('profiles').upsert({ ...dbData, id: userId }, { onConflict: 'id' });
    if (error) throw new Error(this.handleError(error, "updateProfile"));
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('profiles').select('*').order('gamertag');
    if (error) {
      this.handleError(error, "getAllUsers");
      return [];
    }
    return data.map(this.mapProfileToUser);
  }

  async getOrganizerRequests(): Promise<User[]> {
    const { data, error } = await supabase.from('profiles').select('*').eq('organizer_status', 'pending');
    if (error) {
      this.handleError(error, "getOrganizerRequests");
      return [];
    }
    return data.map(this.mapProfileToUser);
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase.from('profiles').select('id, gamertag, xp, avatar_url').order('xp', { ascending: false }).limit(100);
    if (error) return [];
    return (data || []).map((p, index) => ({
      rank: index + 1,
      userId: p.id,
      gamertag: p.gamertag || 'Anonymous',
      points: p.xp || 0,
      winRate: '0%',
      avatarUrl: p.avatar_url || ''
    }));
  }

  async getWalletTransactions(userId: string) {
    const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  }

  async recordTransaction(tx: any): Promise<void> {
    const { error } = await supabase.from('transactions').insert([tx]);
    if (error) this.handleError(error, "recordTransaction");
  }

  async getTournaments(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        registeredPlayers:participants(
          user_id, 
          created_at,
          game_ids,
          profiles:user_id(gamertag, avatar_url, xp)
        )
      `)
      .order('date', { ascending: true });
    
    if (error) {
      this.handleError(error, "getTournaments");
      return [];
    }

    return (data || []).map(t => ({
      id: t.id,
      title: t.title,
      date: t.date,
      status: t.status,
      description: t.description,
      location: t.location,
      organizerId: t.organizer_id,
      prizePool: t.prize_pool,
      imageUrl: t.image_url,
      minLevel: t.min_level,
      chatRoomId: t.chat_room_id,
      isPriority: t.is_priority,
      isVerifiedEvent: t.is_verified_event,
      
      // Ensure all array properties are initialized to prevent "cannot read length of undefined"
      games: Array.isArray(t.games) ? t.games : [],
      announcements: Array.isArray(t.announcements) ? t.announcements : [],
      rules: Array.isArray(t.rules) ? t.rules : [],
      prizeBreakdown: Array.isArray(t.prize_breakdown) ? t.prize_breakdown : [],
      
      registeredPlayers: (t.registeredPlayers || []).map((p: any) => ({
        id: p.user_id,
        gamertag: p.profiles?.gamertag || 'Unknown Player',
        avatarUrl: p.profiles?.avatar_url || '',
        joinedAt: p.created_at,
        xp: p.profiles?.xp || 0,
        gameIds: Array.isArray(p.game_ids) ? p.game_ids : []
      })),
    })) as Tournament[];
  }

  async createTournament(tournament: Partial<Tournament>): Promise<Tournament> {
    const dbData = this.mapTournamentToDb(tournament);
    const { data, error } = await supabase.from('tournaments').insert([dbData]).select().single();
    if (error) throw new Error(this.handleError(error, "createTournament"));
    return data;
  }

  async updateTournament(id: string, tournament: Partial<Tournament>): Promise<void> {
    const dbData = this.mapTournamentToDb(tournament);
    const { error } = await supabase.from('tournaments').update(dbData).eq('id', id);
    if (error) throw new Error(this.handleError(error, "updateTournament"));
  }

  async joinTournament(tournamentId: string, userId: string, gameIds: string[]): Promise<void> {
    const { error } = await supabase.from('participants').insert([{ 
      tournament_id: tournamentId, 
      user_id: userId,
      game_ids: gameIds
    }]);
    if (error) throw new Error(this.handleError(error, "joinTournament"));
  }

  async getAllMatches(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        player1_profile:profiles!player1_id(id, gamertag, avatar_url),
        player2_profile:profiles!player2_id(id, gamertag, avatar_url),
        tournaments ( title )
      `);
    
    if (error) {
      this.handleError(error, "getAllMatches");
      return [];
    }

    return (data || []).map((m: any) => ({
        ...m,
        player1: { id: m.player1_id, name: m.player1_profile?.gamertag || 'TBD', avatarUrl: m.player1_profile?.avatar_url, score: m.player1_score },
        player2: { id: m.player2_id, name: m.player2_profile?.gamertag || 'TBD', avatarUrl: m.player2_profile?.avatar_url, score: m.player2_score },
        tournamentTitle: m.tournaments?.title || 'Nexgen Match'
    })) as Match[];
  }

  async createMatch(match: any): Promise<void> {
    const { error } = await supabase.from('matches').insert([match]);
    if (error) throw new Error(this.handleError(error, "createMatch"));
  }

  async updateMatch(matchId: string, updates: Partial<Match>): Promise<void> {
    const { error } = await supabase.from('matches').update(updates).eq('id', matchId);
    if (error) throw new Error(this.handleError(error, "updateMatch"));
  }

  async postMessage(roomId: string, senderId: string, text: string): Promise<void> {
    const { error } = await supabase.from('messages').insert([{ room_id: roomId, sender_id: senderId, text: text }]);
    if (error) throw new Error(this.handleError(error, "postMessage"));
  }

  async getMessages(roomId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*, profiles:sender_id(gamertag, avatar_url)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    if (error) return [];
    return data;
  }
}

export const api = new ApiService();