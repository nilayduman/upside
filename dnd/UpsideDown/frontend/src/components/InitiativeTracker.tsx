import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';

interface Combatant {
  id: string;
  name: string;
  initiative: number;
}

export const InitiativeTracker = () => {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Initiative Order</Text>
      {combatants.length === 0 ? (
        <Text style={styles.emptyText}>No active combat</Text>
      ) : (
        combatants.map((combatant, index) => (
          <View key={combatant.id} style={styles.combatantRow}>
            <Text style={styles.initiative}>{combatant.initiative}</Text>
            <Text style={[
              styles.name,
              index === currentTurn && styles.currentTurn
            ]}>
              {combatant.name}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
  combatantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  initiative: {
    width: 40,
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
  },
  currentTurn: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
}); 