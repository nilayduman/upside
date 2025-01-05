import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SavingThrowProps {
  ability: string;
  modifier: number;
  isProficient: boolean;
}

export const SavingThrow = ({ ability, modifier, isProficient }: SavingThrowProps) => {
  const displayModifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <View style={styles.container}>
      <View style={[styles.proficiencyDot, isProficient && styles.proficient]} />
      <Text style={styles.ability}>{ability}</Text>
      <Text style={styles.modifier}>{displayModifier}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginVertical: 2,
  },
  proficiencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  proficient: {
    backgroundColor: '#4A90E2',
  },
  ability: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  modifier: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
    minWidth: 40,
    textAlign: 'right',
  },
}); 