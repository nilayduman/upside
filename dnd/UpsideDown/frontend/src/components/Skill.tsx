import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SkillProps {
  name: string;
  ability: string;
  modifier: number;
  isProficient: boolean;
  isExpertise?: boolean;
}

export const Skill = ({ 
  name, 
  ability, 
  modifier, 
  isProficient,
  isExpertise = false 
}: SkillProps) => {
  const displayModifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <View style={styles.container}>
      <View style={styles.proficiencyContainer}>
        <View style={[
          styles.proficiencyDot,
          isProficient && styles.proficient,
          isExpertise && styles.expertise
        ]} />
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.ability}>({ability})</Text>
      </View>
      <Text style={styles.modifier}>{displayModifier}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginVertical: 2,
  },
  proficiencyContainer: {
    width: 24,
    alignItems: 'center',
  },
  proficiencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  proficient: {
    backgroundColor: '#4A90E2',
  },
  expertise: {
    backgroundColor: '#2ECC71',
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 14,
    color: '#333',
  },
  ability: {
    fontSize: 12,
    color: '#666',
  },
  modifier: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
    minWidth: 40,
    textAlign: 'right',
  },
}); 