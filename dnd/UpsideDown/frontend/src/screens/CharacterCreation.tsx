import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SelectList } from '../components/SelectList';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Character, Race, CharacterClass, CharacterStats } from '../types/character';
import { StatInput } from '../components/StatInput';

const RACES: Race[] = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Tiefling'];
const CLASSES: CharacterClass[] = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin'];

const calculateModifier = (stat: number): number => {
  return Math.floor((stat - 10) / 2);
};

export const CharacterCreation = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [character, setCharacter] = useState<Partial<Character>>({
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
      charisma: 10
    }
  });

  const updateStat = (statName: keyof CharacterStats, value: number) => {
    setCharacter((prev) => {
      const updatedStats: CharacterStats = {
        ...prev.stats!,
        [statName]: Math.max(3, Math.min(18, value)),
      };
      return {
        ...prev,
        stats: updatedStats,
      };
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!character.name?.trim()) {
      newErrors.name = 'Character name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCharacter = () => {
    if (validateForm()) {
      console.log('Character created:', character);
    }
  };

  const raceOptions = RACES.map(race => ({ value: race, label: race }));
  const classOptions = CLASSES.map(cls => ({ value: cls, label: cls }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Your Character</Text>

      <Input
        label="Character Name"
        value={character.name}
        onChangeText={(text) => setCharacter(prev => ({ ...prev, name: text }))}
        placeholder="Enter character name"
        error={errors.name}
        autoCapitalize="words"
      />

      <SelectList
        label="Choose Race"
        options={raceOptions}
        value={character.race || 'Human'}
        onChange={(race) => setCharacter(prev => ({ ...prev, race: race as Race }))}
      />

      <SelectList
        label="Choose Class"
        options={classOptions}
        value={character.class || 'Fighter'}
        onChange={(charClass) => setCharacter(prev => ({ ...prev, class: charClass as CharacterClass }))}
      />

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Ability Scores</Text>
        
        {Object.entries(character.stats || {}).map(([stat, value]) => (
          <StatInput
            key={stat}
            label={stat.charAt(0).toUpperCase() + stat.slice(1)}
            value={value}
            modifier={calculateModifier(value)}
            onIncrease={() => updateStat(stat as keyof CharacterStats, value + 1)}
            onDecrease={() => updateStat(stat as keyof CharacterStats, value - 1)}
          />
        ))}
      </View>

      <Button 
        title="Create Character"
        onPress={handleCreateCharacter}
        style={styles.createButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  statsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});