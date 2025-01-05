import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { SelectList } from './SelectList';

export type GameMode = 'ai-dm' | 'player-dm' | 'friend-dm';

interface GameModeSelectionProps {
  selectedMode: GameMode;
  onModeSelect: (mode: GameMode) => void;
}

export const GameModeSelection = ({ selectedMode, onModeSelect }: GameModeSelectionProps) => {
  const gameModes = [
    {
      value: 'ai-dm',
      label: 'AI Dungeon Master',
      description: 'Play with an AI-powered DM and random players'
    },
    {
      value: 'player-dm',
      label: 'Friend as DM',
      description: 'Play with friends where one takes the role of DM'
    },
    {
      value: 'friend-dm',
      label: 'Join Friend\'s Game',
      description: 'Join an existing game hosted by a friend'
    }
  ];

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Choose Game Mode</Text>
      <SelectList
        label="Game Mode"
        options={gameModes.map(mode => ({
          value: mode.value,
          label: mode.label,
          description: mode.description
        }))}
        value={selectedMode}
        onChange={(value) => onModeSelect(value as GameMode)}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  }
}); 