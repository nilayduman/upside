import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { Button } from '../Button';
import { SelectList } from '../SelectList';
import type { Skill, Spell } from '../../game/mechanics/types';

interface ActionPanelProps {
  skills: Skill[];
  spells: Spell[];
  onSkillUse: (skill: Skill) => void;
  onSpellCast: (spell: Spell, target?: string) => void;
}

export const ActionPanel = ({ skills, spells, onSkillUse, onSpellCast }: ActionPanelProps) => {
  const [selectedAction, setSelectedAction] = useState<'skills' | 'spells'>('skills');
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  return (
    <Card style={styles.container}>
      <View style={styles.tabs}>
        <Button
          title="Skills"
          onPress={() => setSelectedAction('skills')}
          style={[
            styles.tab,
            selectedAction === 'skills' && styles.selectedTab
          ]}
        />
        <Button
          title="Spells"
          onPress={() => setSelectedAction('spells')}
          style={[
            styles.tab,
            selectedAction === 'spells' && styles.selectedTab
          ]}
        />
      </View>

      {selectedAction === 'skills' ? (
        <View style={styles.actionList}>
          {skills.map(skill => (
            <Button
              key={skill.id}
              title={`${skill.name} (${skill.ability.slice(0, 3).toUpperCase()})`}
              onPress={() => onSkillUse(skill)}
              style={styles.actionButton}
            />
          ))}
        </View>
      ) : (
        <View style={styles.actionList}>
          {spells.map(spell => (
            <Button
              key={spell.id}
              title={`${spell.name} (Level ${spell.level})`}
              onPress={() => setSelectedSpell(spell)}
              style={styles.actionButton}
            />
          ))}
        </View>
      )}

      {selectedSpell && (
        <View style={styles.spellDetails}>
          <Text style={styles.spellName}>{selectedSpell.name}</Text>
          <Text style={styles.spellInfo}>
            Level {selectedSpell.level} {selectedSpell.school}
          </Text>
          <Text style={styles.spellDescription}>{selectedSpell.description}</Text>
          <Button
            title="Cast Spell"
            onPress={() => {
              onSpellCast(selectedSpell);
              setSelectedSpell(null);
            }}
            style={styles.castButton}
          />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    marginHorizontal: 4,
  },
  selectedTab: {
    backgroundColor: '#3498db',
  },
  actionList: {
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#2ecc71',
  },
  spellDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  spellName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  spellInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  spellDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  castButton: {
    backgroundColor: '#e74c3c',
  },
}); 