import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Auth stack navigation
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Registration: undefined;
};

// App stack navigation
export type AppStackParamList = {
  Home: undefined;
  GameModes: undefined;
  FriendMode: undefined;
  RandomMode: undefined;
  StoryMode: undefined;
  Settings: undefined;
  CharacterCreation: undefined;
  GameRoom: { roomId: string };
  CreateGameRoom: undefined;
};

// Root level navigation
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;