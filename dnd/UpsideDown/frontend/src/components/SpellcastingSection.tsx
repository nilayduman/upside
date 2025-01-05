import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from './Card';
import { SelectList } from './SelectList';

interface Spell {
  id: string;
  name: string;
  level: number;
  prepared: boolean;
}

interface SpellcastingSectionProps {
  spellcastingClass: string;
  spellcastingAbility?: string;
  spellSaveDC?: number;
  spellAttackBonus?: number;
  spellSlots?: { [key: number]: { total: number; used: number } };
  spells?: Spell[];
  onPrepareSpell: (id: string) => void;
  onUnprepareSpell: (id: string) => void;
  onUseSpellSlot: (level: number) => void;
}

export const SpellcastingSection = ({
  spellcastingClass,
  spellcastingAbility,
  spellSaveDC,
  spellAttackBonus,
  spellSlots,
  spells,
  onPrepareSpell,
  onUnprepareSpell,
  onUseSpellSlot,
}: SpellcastingSectionProps) => {
  const spellsByLevel = spells?.reduce((acc, spell) => {
    if (!acc[spell.level]) {
      acc[spell.level] = [];
    }
    acc[spell.level].push(spell);
    return acc;
  }, {} as Record<number, Spell[]>) ?? {};

  return (
    <View style={styles.container}>
      <Card style={styles.statsCard}>
        <View style={styles.spellStats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Save DC</Text>
            <Text style={styles.statValue}>{spellSaveDC || '--'}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Attack Bonus</Text>
            <Text style={styles.statValue}>+{spellAttackBonus || '--'}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Ability</Text>
            <Text style={styles.statValue}>{spellcastingAbility || 'None'}</Text>
          </View>
        </View>
      </Card>

      {Object.entries(spellsByLevel).map(([level, levelSpells]) => (
        <Card key={level} style={styles.spellLevelCard}>
          <Text style={styles.levelTitle}>
            {level === '0' ? 'Cantrips' : `Level ${level}`}
          </Text>
          
          {level !== '0' && spellSlots?.[Number(level)] && (
            <View style={styles.slotsContainer}>
              <Text style={styles.slotsText}>
                Slots: {spellSlots[Number(level)].total - spellSlots[Number(level)].used} / {spellSlots[Number(level)].total}
              </Text>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {levelSpells.map((spell) => (
              <View key={spell.id} style={styles.spellContainer}>
                <Text style={styles.spellName}>{spell.name}</Text>
                <SelectList
                  label=""
                  options={[
                    { value: 'Prepared', label: 'Prepared' },
                    { value: 'Unprepared', label: 'Unprepared' }
                  ]}
                  value={spell.prepared ? 'Prepared' : 'Unprepared'}
                  onChange={(value) => 
                    value === 'Prepared' ? onPrepareSpell(spell.id) : onUnprepareSpell(spell.id)
                  }
                />
              </View>
            ))}
          </ScrollView>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  statsCard: {
    marginBottom: 16,
  },
  spellStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  spellLevelCard: {
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  slotsContainer: {
    marginBottom: 8,
  },
  slotsText: {
    fontSize: 14,
    color: '#666',
  },
  spellContainer: {
    marginRight: 16,
    minWidth: 150,
  },
  spellName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
}); 