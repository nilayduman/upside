import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Card } from './Card';
import { Badge } from './Badge';
import { StatInput } from './StatInput';
import { Button } from './Button';
import { RootStackParamList } from '../types/navigation';
import { Character } from '../types/character';

type CharacterDetailsRouteProp = RouteProp<RootStackParamList, 'CharacterDetails'>;

// Temporary mock data - will be replaced with Redux state later
const mockCharacter: Character = {
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
};

export const CharacterDetails = () => {
  const route = useRoute<CharacterDetailsRouteProp>();
  const character = mockCharacter; // Will be fetched from Redux later

  const calculateModifier = (stat: number): number => {
    return Math.floor((stat - 10) / 2);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <View>
            <Badge text={character.race} variant="primary" />
            <Badge 
              text={character.class} 
              variant="info" 
              style={styles.classBadge} 
            />
          </View>
          <Badge text={`Level ${character.level}`} variant="success" />
        </View>
      </Card>

      <Card title="Ability Scores">
        <View style={styles.statsGrid}>
          {Object.entries(character.stats).map(([stat, value]) => (
            <View key={stat} style={styles.statBlock}>
              <StatInput
                label={stat.charAt(0).toUpperCase() + stat.slice(1)}
                value={value}
                modifier={calculateModifier(value)}
                onIncrease={() => {}}
                onDecrease={() => {}}
              />
            </View>
          ))}
        </View>
      </Card>

      <Card title="Actions">
        <Button 
          title="Edit Character" 
          onPress={() => {}} 
          style={styles.actionButton}
        />
        <Button 
  title="Delete Character" 
  onPress={() => {}} 
  style={[styles.actionButton, styles.deleteButton]}
/>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classBadge: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBlock: {
    width: '48%',
    marginBottom: 16,
  },
  actionButton: {
    marginVertical: 8,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
}); 