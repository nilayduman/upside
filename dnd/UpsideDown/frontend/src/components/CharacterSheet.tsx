import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Character } from '../types/character';
import { Card } from './Card';
import { AbilityScore } from './AbilityScore';
import { SavingThrow } from './SavingThrow';
import { Skill } from './Skill';
import { SelectList } from './SelectList';
import { Badge } from './Badge';
import { AbilityName } from '../types/character';
import { CombatStats } from './CombatStats';
import { EquipmentSection } from './EquipmentSection';
import { SpellcastingSection } from './SpellcastingSection';

interface CharacterSheetProps {
  character: Character; // We'll define this type later
  onUpdate?: (field: string, value: any) => void;
}

export const CharacterSheet = ({ character, onUpdate }: CharacterSheetProps) => {
  return (
    <ScrollView style={styles.container}>
      {/* Basic Info Section */}
      <Card style={styles.section}>
        <View style={styles.basicInfo}>
          <Badge text={character.race} variant="primary" />
          <Badge text={character.class} variant="info" />
          <Badge text={`Level ${character.level}`} variant="success" />
        </View>
        
        <SelectList
          label="Background"
          options={[
            { value: 'Acolyte', label: 'Acolyte' },
            { value: 'Criminal', label: 'Criminal' },
            { value: 'Folk Hero', label: 'Folk Hero' },
            { value: 'Noble', label: 'Noble' },
            { value: 'Sage', label: 'Sage' },
            { value: 'Soldier', label: 'Soldier' }
          ]}
          value={character.background}
          onChange={(value) => onUpdate?.('background', value)}
        />
      </Card>

      {/* Ability Scores Section */}
      <Card title="Ability Scores" style={styles.section}>
        <View style={styles.abilityScores}>
          {Object.entries(character.stats).map(([ability, score]) => (
            <AbilityScore
              key={ability}
              name={ability}
              score={score}
              modifier={Math.floor((score - 10) / 2)}
              isProficient={character.savingThrowProficiencies.includes(ability)}
              onPress={() => onUpdate?.(`stats.${ability}`, score)}
            />
          ))}
        </View>
      </Card>

      {/* Saving Throws Section */}
      <Card title="Saving Throws" style={styles.section}>
        {Object.entries(character.stats).map(([ability, score]) => (
          <SavingThrow
            key={ability}
            ability={ability}
            modifier={Math.floor((score - 10) / 2) + 
              (character.savingThrowProficiencies.includes(ability) ? character.proficiencyBonus : 0)}
            isProficient={character.savingThrowProficiencies.includes(ability)}
          />
        ))}
      </Card>

      {/* Skills Section */}
      <Card title="Skills" style={styles.section}>
        {character.skills.map((skill) => (
          <Skill
            key={skill.name}
            name={skill.name}
            ability={skill.ability}
            modifier={Math.floor((character.stats[skill.ability.toLowerCase() as AbilityName] - 10) / 2) +
              (skill.isProficient ? character.proficiencyBonus : 0) +
              (skill.isExpertise ? character.proficiencyBonus : 0)}
            isProficient={skill.isProficient}
            isExpertise={skill.isExpertise}
          />
        ))}
      </Card>

      {/* Combat Stats Section */}
      <Card title="Combat" style={styles.section}>
        <CombatStats
          maxHp={character.maxHp}
          currentHp={character.currentHp}
          tempHp={character.tempHp}
          armorClass={character.armorClass}
          initiative={character.initiative}
          speed={character.speed}
          hitDice={character.hitDice}
          deathSaves={character.deathSaves}
          onHpChange={(value) => onUpdate?.('currentHp', value)}
          onToggleDeathSaveSuccess={(index) => onUpdate?.('deathSaves.successes', index)}
          onToggleDeathSaveFailure={(index) => onUpdate?.('deathSaves.failures', index)}
        />
      </Card>

      {/* Equipment Section */}
      <Card title="Equipment" style={styles.section}>
        <EquipmentSection
          equipment={character.equipment}
          onEquip={(id) => onUpdate?.('equipment', id)}
          onUnequip={(id) => onUpdate?.('equipment', id)}
        />
      </Card>

      {/* Spellcasting Section */}
      {character.spellcasting && (
        <Card title="Spellcasting" style={styles.section}>
          <SpellcastingSection
            spellcastingClass={character.class}
            spellcastingAbility={character.spellcastingAbility}
            spellSaveDC={character.spellSaveDC}
            spellAttackBonus={character.spellAttackBonus}
            spellSlots={character.spellSlots}
            spells={character.spells}
            onPrepareSpell={(id) => onUpdate?.('preparedSpells', id)}
            onUnprepareSpell={(id) => onUpdate?.('preparedSpells', id)}
            onUseSpellSlot={(level) => onUpdate?.('spellSlots', level)}
          />
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  basicInfo: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  abilityScores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
}); 