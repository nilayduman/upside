import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CharacterListItem } from './CharacterListItem';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { Button } from './Button';
import { Character } from '../types/character';
import { NavigationProp } from '../types/navigation';

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
    savingThrowProficiencies: ['strength', 'constitution'],
    skills: [
      { name: 'Athletics', ability: 'strength', isProficient: true, isExpertise: false },
      { name: 'Intimidation', ability: 'charisma', isProficient: true, isExpertise: false }
    ],
    proficiencyBonus: 3,
    maxHp: 45,
    currentHp: 45,
    tempHp: 0,
    armorClass: 16,
    initiative: 2,
    speed: 30,
    equipment: [
      { id: '1', name: 'Longsword', type: 'weapon', equipped: true, quantity: 1 },
      { id: '2', name: 'Chain Mail', type: 'armor', equipped: true, quantity: 1 },
      { id: '3', name: 'Backpack', type: 'gear', equipped: false, quantity: 1 }
    ],
    spellcastingAbility: 'intelligence',
    spellSaveDC: 15,
    spellAttackBonus: 7,
    spellSlots: { 1: { total: 4, used: 1 }, 2: { total: 3, used: 0 } },
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
  }
];

export const CharacterList = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading] = React.useState(false);
  const [error] = React.useState<string | null>(null);

  const handleCharacterPress = (character: Character) => {
    navigation.navigate('CharacterDetails', { characterId: character.id });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => {}} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mockCharacters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CharacterListItem
            character={item}
            onPress={() => handleCharacterPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <Button
            title="Create New Character"
            onPress={() => navigation.navigate('CharacterCreation')}
            style={styles.createButton}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingVertical: 16,
  },
  createButton: {
    marginHorizontal: 16,
    marginTop: 8,
  },
});