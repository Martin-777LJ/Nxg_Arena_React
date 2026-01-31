import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Home: undefined;
  Wallet: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Home: NavigatorScreenParams<BottomTabParamList>;
  TournamentDetails: { id: string };
  Notifications: undefined;
};
