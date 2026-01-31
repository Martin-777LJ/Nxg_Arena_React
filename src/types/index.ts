
export enum GameType {
  FPS = 'FPS',
  MOBA = 'MOBA',
  RTS = 'RTS',
  FIGHTING = 'Fighting',
  SPORTS = 'Sports',
  CARD = 'Card',
  SOCCER = 'Soccer'
}

export enum TournamentStatus {
  UPCOMING = 'Upcoming',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed'
}

export interface NotificationPreferences {
  matchReminders: boolean;
  opponentAssignments: boolean;
  tournamentUpdates: boolean;
  leaderboardChanges: boolean;
  referralRewards: boolean;
  adminAnnouncements: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface PrivacySettings {
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
  publicProfile: boolean;
}

export interface DisciplinaryRecord {
  id: string;
  type: 'Warning' | 'Kick' | 'Ban';
  reason: string;
  date: string;
  tournamentName: string;
  issuedBy: string;
}

export interface LinkedAccount {
  id: string;
  platform: 'Steam' | 'Riot Games' | 'Epic Games' | 'Discord' | 'Twitch' | 'Xbox' | 'PlayStation';
  username?: string;
  connected: boolean;
}

export interface User {
  id: string;
  gamertag: string;
  email: string;
  avatarUrl: string;
  isOrganizer: boolean;
  isAdmin: boolean;
  organizerStatus: 'none' | 'pending' | 'approved' | 'rejected';
  organizerMode: boolean;
  organizerTier: 'basic' | 'pro';
  tournamentsCreatedMonth: number;
  bio: string;
  referralCode: string;
  phoneNumber?: string;
  location?: string;
  xp: number;
  walletBalance: number;
  purchasedBadges: string[]; // IDs of badges bought in store
  linkedAccounts: LinkedAccount[];
  referralStats: {
    count: number;
    totalEarned: number;
  };
  stats: {
    wins: number;
    losses: number;
    tournamentsPlayed: number;
  };
  disciplinaryHistory?: DisciplinaryRecord[];
  settings: {
    theme: 'dark' | 'light';
    highContrast: boolean;
    largeText: boolean;
    textToSpeech: boolean;
    notifications: NotificationPreferences;
    privacy: PrivacySettings;
  };
}

export interface Announcement {
  id: string;
  message: string;
  date: string;
  read?: boolean;
}

export interface TournamentGame {
  id: string;
  type: GameType;
  customName?: string; // Specific name e.g., "Dream League" for Soccer
  registrationFee: number;
  maxParticipants: number;
  participants: number;
  status: TournamentStatus;
}

export interface TournamentParticipant {
  id: string;
  gamertag: string;
  avatarUrl: string;
  joinedAt: string;
  gameIds: string[]; // Which games this participant is registered for
  xp?: number;
}

export interface Tournament {
  id: string;
  title: string;
  date: string;
  prizePool: string;
  status: TournamentStatus;
  organizerId: string;
  description: string;
  rules: string[];
  prizeBreakdown: string[];
  announcements: Announcement[];
  registeredPlayers: TournamentParticipant[];
  games: TournamentGame[]; // Multi-game support
  location?: string;
  bannedPlayers?: TournamentParticipant[];
  imageUrl?: string;
  minLevel?: number; // Gating mechanism: 0 or undefined = Open, 5 = Silver, etc.
  chatRoomId?: string; // Linked Group Chat ID
  isPriority?: boolean; // Pro feature
  isVerifiedEvent?: boolean; // Pro feature
}

export interface MatchConnection {
  hostId?: string;
  hostGameTag?: string;
  status: 'idle' | 'waiting_for_tag' | 'tag_ready' | 'connected';
}

export interface Match {
  id: string;
  tournamentId: string;
  gameId: string; // ID of the specific game in the tournament
  tournamentTitle: string;
  round: string;
  bracketSide?: 'Upper' | 'Lower';
  player1: { id: string; name: string; avatarUrl?: string; score?: number };
  player2: { id: string; name: string; avatarUrl?: string; score?: number };
  date: string;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Dispute';
  winnerId?: string;
  nextMatchId?: string;
  loserNextMatchId?: string;
  verifiedByApi?: boolean;
  connection?: MatchConnection; // New field for handshake logic
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  gamertag: string;
  points: number;
  winRate: string;
  avatarUrl: string;
}

export type NotificationType = 'match' | 'system' | 'invite' | 'reward' | 'announcement' | 'rank' | 'payment';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  timestamp: string;
  attachment?: {
    type: 'image' | 'video';
    url: string;
  };
}

export interface ChatRoom {
  id: string;
  type: 'global' | 'direct' | 'match' | 'group';
  name: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  avatarUrl?: string;
}
