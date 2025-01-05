import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface Location {
  id: string;
  name: string;
  type: 'town' | 'dungeon' | 'wilderness';
  description: string;
  status: 'unexplored' | 'visited' | 'completed';
  notes?: string[];
}

interface LocationCardProps extends Location {
  onPress: () => void;
}

export const LocationCard = ({ name, type, description, status, onPress }: LocationCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.type}>{type}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.status}>{status}</Text>
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
  type: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    marginTop: 8,
  },
  status: {
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 