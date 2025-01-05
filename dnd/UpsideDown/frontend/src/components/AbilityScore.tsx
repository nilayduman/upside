import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from './Card';

interface AbilityScoreProps {
  name: string;
  score: number;
  modifier: number;
  isProficient?: boolean;
  onPress?: () => void;
}

export const AbilityScore = ({
  name,
  score,
  modifier,
  isProficient = false,
  onPress
}: AbilityScoreProps) => {
  const displayModifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={[styles.container, isProficient && styles.proficientContainer]}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.modifier}>{displayModifier}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
    minWidth: 100,
  },
  proficientContainer: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  modifier: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
}); 