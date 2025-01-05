import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Character } from '../types/character'; 
import { Button } from '../components/Button';
import { NavigationProp } from '../types/navigation';// Adjust the import based on your character type definition

// Temporary mock data - will be replaced with Redux state later
const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Aragorn',
    race: 'Human',
    class: 'Fighter',
    background: 'Soldier',
    level: 5,
    stats: {
      strength: 16,
      dexterity: 14,
      constitution: 15,
      intelligence: 12,
      wisdom: 14,
      charisma: 14
    },
    savingThrowProficiencies: ['strength', 'constitution'], // Add this property
    skills: [
      { name: 'Athletics', ability: 'strength', isProficient: true, isExpertise: false },
      { name: 'Intimidation', ability: 'charisma', isProficient: true, isExpertise: false }
    ],
    proficiencyBonus: 3, // Add this property
    maxHp: 45, // Add this property
    currentHp: 45, // Add this property
    tempHp: 0, // Add this property
    armorClass: 16, // Add this property
    initiative: 2, // Add this property
    speed: 30, // Add this property
    equipment: [
      { id: '1', name: 'Longsword', type: 'weapon', equipped: true, quantity: 1 },
      { id: '2', name: 'Chain Mail', type: 'armor', equipped: true, quantity: 1 },
      { id: '3', name: 'Backpack', type: 'gear', equipped: false, quantity: 1 }
    ],
    spellcastingAbility: 'intelligence', // Add this property
    spellSaveDC: 15, // Add this property
    spellAttackBonus: 7, // Add this property
    spellSlots: { 1: { total: 4, used: 1 }, 2: { total: 3, used: 0 } }, // Add this property
    spells: [
      { id: '1', name: 'Magic Missile', level: 1, prepared: true },
      { id: '2', name: 'Shield', level: 1, prepared: true }
    ],
    hitDice: {
      dieType: 10,  // d10 for Fighter
      total: 5,     // Level 5
      used: 0
    },
    deathSaves: {
      successes: [false, false, false],
      failures: [false, false, false]
    }
  },
  // Add more mock characters as needed
];
  // Add more mock characters as needed


export const CharacterList: React.FC = () => {
  
  const navigation = useNavigation<NavigationProp>();


  const renderItem = ({ item }: { item: Character }) => (
    <View style={styles.characterItem}>
      <Text style={styles.characterName}>{item.name}</Text>
      <Text>{item.race} {item.class}</Text>
      <Text>Level: {item.level}</Text>
      <Button 
        title="View Details" 
        onPress={() => navigation.navigate('CharacterDetails', { characterId: item.id })} 
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Character List</Text>
      <FlatList
        data={mockCharacters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  characterItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});