import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Dashboard: undefined;
  TournamentDetails: { id: string };
  Profile: undefined;
  Wallet: undefined;
  Settings: undefined;
  Notifications: undefined;
  Chat: undefined;
  Schedule: undefined;
  Leaderboard: undefined;
  Store: undefined;
  Admin: undefined;
  Organizer: undefined;
};
