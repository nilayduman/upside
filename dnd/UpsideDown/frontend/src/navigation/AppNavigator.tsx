import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';

// Screens
import { Home } from '../screens/Home';
import { GameModes } from '../screens/GameModes';
import { FriendMode } from '../screens/FriendMode';
import { RandomMode } from '../screens/RandomMode';
import { StoryMode } from '../screens/StoryMode';
import { Settings } from '../screens/Settings';
import { CharacterCreation } from '../screens/CharacterCreation';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
      <Stack.Navigator
        initialRouteName="GameModes"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: '#000000',
          },
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="GameModes" component={GameModes} />
        <Stack.Screen name="FriendMode" component={FriendMode} />
        <Stack.Screen name="RandomMode" component={RandomMode} />
        <Stack.Screen name="StoryMode" component={StoryMode} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="CharacterCreation" component={CharacterCreation} />
      </Stack.Navigator>
  );
};