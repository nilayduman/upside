import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface CharacterCreationProps {
  onComplete: (character: Character) => void;
}

export interface Character {
  name: string;
  race: string;
  class: string;
  level: number;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  inventory: string[];
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete }) => {
  const [character, setCharacter] = useState<Character>({
    name: '',
    race: 'Human',
    class: 'Fighter',
    level: 1,
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    inventory: ['Backpack', 'Bedroll', 'Rations (1 day)'],
  });

  const races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn'];
  const classes = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger'];

  const rollStat = () => {
    // Simulate 4d6 drop lowest
    const rolls = Array(4).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((a, b) => a + b, 0);
  };

  const rollStats = () => {
    setCharacter(prev => ({
      ...prev,
      stats: {
        strength: rollStat(),
        dexterity: rollStat(),
        constitution: rollStat(),
        intelligence: rollStat(),
        wisdom: rollStat(),
        charisma: rollStat(),
      }
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Your Character</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={character.name}
          onChangeText={(name) => setCharacter(prev => ({ ...prev, name }))}
          placeholder="Enter character name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Race</Text>
        <Picker
          selectedValue={character.race}
          onValueChange={(race) => setCharacter(prev => ({ ...prev, race }))}
        >
          {races.map(race => (
            <Picker.Item key={race} label={race} value={race} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Class</Text>
        <Picker
          selectedValue={character.class}
          onValueChange={(characterClass: string) => setCharacter(prev => ({ ...prev, class: characterClass }))}
        >
          {classes.map(characterClass => (
            <Picker.Item key={characterClass} label={characterClass} value={characterClass} />
          ))}
        </Picker>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.label}>Stats</Text>
        <Pressable style={styles.rollButton} onPress={rollStats}>
          <Text style={styles.rollButtonText}>Roll Stats</Text>
        </Pressable>

        {Object.entries(character.stats).map(([stat, value]) => (
          <View key={stat} style={styles.statRow}>
            <Text style={styles.statLabel}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</Text>
            <Text style={styles.statValue}>{value}</Text>
          </View>
        ))}
      </View>

      <Pressable 
        style={styles.createButton}
        onPress={() => onComplete(character)}
      >
        <Text style={styles.createButtonText}>Create Character</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2c2c2c',
    padding: 12,
    borderRadius: 8,
    color: '#ffffff',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: '#ffffff',
    fontSize: 16,
  },
  statValue: {
    color: '#00ff9d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rollButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  rollButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#00ff9d',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  createButtonText: {
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});