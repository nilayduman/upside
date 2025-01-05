import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface NPC {
  id: string;
  name: string;
  race: string;
  occupation: string;
  disposition: 'friendly' | 'neutral' | 'hostile';
  location: string;
  notes?: string[];
}

interface NPCCardProps extends NPC {
  onPress: () => void;
}

export const NPCCard = ({ name, race, occupation, disposition, onPress }: NPCCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.details}>{race} • {occupation}</Text>
      <Text style={[styles.disposition, styles[disposition]]}>{disposition}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  disposition: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  friendly: { color: '#2ECC71' },
  neutral: { color: '#F1C40F' },
  hostile: { color: '#E74C3C' },
}); 