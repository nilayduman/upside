import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SelectList } from '../components/SelectList';
import { NPCCard } from '../components/NPCCard';
import { LocationCard } from '../components/LocationCard';
import { Card } from '../components/Card';
import { Location } from '../components/LocationCard';
import { NPC } from '../components/NPCCard';
import { Quest } from '../components/QuestCard';

export const StoryScreen = () => {
  const [selectedView, setSelectedView] = useState<'npcs' | 'locations' | 'quests'>('npcs');
  const [npcs, setNpcs] = useState<NPC[]>([]); // Define NPC type
  const [locations, setLocations] = useState<Location[]>([]); // Define Location type
  const [quests, setQuests] = useState<Quest[]>([]); // Define Quest type

  return (
    <ScrollView style={styles.container}>
      <SelectList
        label="View"
        options={['NPCs', 'Locations', 'Quests']}
        value={selectedView}
        onChange={(value) => setSelectedView(value.toLowerCase() as any)}
      />

      {selectedView === 'npcs' && (
        <View style={styles.section}>
          {npcs.map(npc => (
            <NPCCard
              key={npc.id}
              {...npc}
              onPress={() => {/* Handle NPC press */}}
            />
          ))}
        </View>
      )}

      {selectedView === 'locations' && (
        <View style={styles.section}>
          {locations.map(location => (
            <LocationCard
              key={location.id}
              {...location}
              onPress={() => {/* Handle location press */}}
            />
          ))}
        </View>
      )}

      {selectedView === 'quests' && (
        <View style={styles.section}>
          {/* Existing quest cards */}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    marginTop: 16,
  },
}); 