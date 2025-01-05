import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface CombatEvent {
  id: string;
  timestamp: Date;
  type: 'attack' | 'damage' | 'heal' | 'spell' | 'effect';
  actor: string;
  target?: string;
  description: string;
}

interface CombatLogProps {
  events?: CombatEvent[];
}

export const CombatLog = ({ events = [] }: CombatLogProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Combat Log</Text>
      <ScrollView style={styles.log}>
        {events.map((event) => (
          <View key={event.id} style={styles.eventRow}>
            <Text style={styles.timestamp}>
              {event.timestamp.toLocaleTimeString()}
            </Text>
            <View style={styles.eventContent}>
              <Text style={[styles.eventType, styles[event.type]]}>
                {event.type.toUpperCase()}
              </Text>
              <Text style={styles.description}>
                <Text style={styles.actor}>{event.actor}</Text>
                {event.target && (
                  <Text> → <Text style={styles.target}>{event.target}</Text></Text>
                )}
                {': '}
                {event.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  log: {
    flex: 1,
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    width: 70,
  },
  eventContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventType: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  attack: {
    backgroundColor: '#E74C3C',
    color: 'white',
  },
  damage: {
    backgroundColor: '#C0392B',
    color: 'white',
  },
  heal: {
    backgroundColor: '#2ECC71',
    color: 'white',
  },
  spell: {
    backgroundColor: '#9B59B6',
    color: 'white',
  },
  effect: {
    backgroundColor: '#3498DB',
    color: 'white',
  },
  description: {
    flex: 1,
    fontSize: 14,
  },
  actor: {
    fontWeight: 'bold',
    color: '#2980B9',
  },
  target: {
    fontWeight: 'bold',
    color: '#E74C3C',
  },
});