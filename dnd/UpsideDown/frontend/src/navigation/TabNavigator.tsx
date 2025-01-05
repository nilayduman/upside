import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GameScreen, StoryScreen, CharacterScreen } from '../screens';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Game" 
        component={GameScreen}
        options={{
          title: 'Game Mode',
          // We can add icons later
        }}
      />
      <Tab.Screen 
        name="Story" 
        component={StoryScreen}
        options={{
          title: 'Story Mode',
        }}
      />
      <Tab.Screen 
        name="Character" 
        component={CharacterScreen}
        options={{
          title: 'Character',
        }}
      />
    </Tab.Navigator>
  );
}; 