import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { DeathSaves } from './DeathSaves';
import { HealthDialog, DamageType } from './HealthDialog';

interface HitDice {
  dieType: number;
  total: number;
  used: number;
}

interface CombatStatsProps {
  maxHp: number;
  currentHp: number;
  tempHp: number;
  armorClass: number;
  initiative: number;
  speed: number;
  hitDice: HitDice;
  deathSaves: {
    successes: boolean[];
    failures: boolean[];
  };
  onHpChange?: (value: number) => void;
  onHitDiceUse?: () => void;
  onToggleDeathSaveSuccess: (index: number) => void;
  onToggleDeathSaveFailure: (index: number) => void;
  resistances?: DamageType[];
  vulnerabilities?: DamageType[];
}

export const CombatStats = ({
  maxHp,
  currentHp,
  tempHp,
  armorClass,
  initiative,
  speed,
  hitDice,
  deathSaves,
  onHpChange,
  onHitDiceUse,
  onToggleDeathSaveSuccess,
  onToggleDeathSaveFailure,
  resistances,
  vulnerabilities,
}: CombatStatsProps) => {
  const [healthDialogVisible, setHealthDialogVisible] = useState(false);

  const handleHealthChange = (amount: number, type: 'damage' | 'healing' | 'temp') => {
    if (type === 'damage') {
      // Apply damage to temp HP first
      const remainingDamage = amount - tempHp;
      if (remainingDamage > 0) {
        onHpChange?.(Math.max(currentHp - remainingDamage, 0));
      }
    } else if (type === 'healing') {
      onHpChange?.(Math.min(currentHp + amount, maxHp));
    } else if (type === 'temp') {
      // Update temp HP logic here
    }
  };

  return (
    <View style={styles.container}>
      {/* HP Section with added press handler */}
      <TouchableOpacity 
        style={styles.hpContainer}
        onPress={() => setHealthDialogVisible(true)}
      >
        <Text style={styles.label}>Hit Points</Text>
        <View style={styles.hpValues}>
          <Text style={styles.currentHp}>{currentHp}</Text>
          <Text style={styles.maxHp}>/ {maxHp}</Text>
          {tempHp > 0 && (
            <Text style={styles.tempHp}>(+{tempHp})</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Combat Values */}
      <View style={styles.combatValues}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{armorClass}</Text>
          <Text style={styles.statLabel}>Armor Class</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{initiative >= 0 ? `+${initiative}` : initiative}</Text>
          <Text style={styles.statLabel}>Initiative</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{speed}</Text>
          <Text style={styles.statLabel}>Speed</Text>
        </View>
      </View>

      {/* Hit Dice Section */}
      <View style={styles.hitDiceContainer}>
        <Text style={styles.label}>Hit Dice</Text>
        <View style={styles.hitDiceContent}>
          <Text style={styles.hitDiceValue}>
            {hitDice.total - hitDice.used}d{hitDice.dieType}
          </Text>
          <TouchableOpacity
            style={[
              styles.hitDiceButton,
              (hitDice.total === hitDice.used) && styles.hitDiceButtonDisabled
            ]}
            onPress={onHitDiceUse}
            disabled={hitDice.total === hitDice.used}
          >
            <Text style={styles.hitDiceButtonText}>Use</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Death Saves Section (only show when HP is 0) */}
      {currentHp <= 0 && (
        <DeathSaves
          successes={deathSaves.successes}
          failures={deathSaves.failures}
          onToggleSuccess={onToggleDeathSaveSuccess}
          onToggleFailure={onToggleDeathSaveFailure}
        />
      )}

      <HealthDialog
        visible={healthDialogVisible}
        currentHp={currentHp}
        maxHp={maxHp}
        tempHp={tempHp}
        resistances={resistances ?? []}
        vulnerabilities={vulnerabilities ?? []}
        onClose={() => setHealthDialogVisible(false)}
        onApply={handleHealthChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  hpContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hpValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentHp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  maxHp: {
    fontSize: 20,
    color: '#666',
    marginLeft: 4,
  },
  tempHp: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 8,
  },
  combatValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statBox: {
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  hitDiceContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  hitDiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hitDiceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  hitDiceButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  hitDiceButtonDisabled: {
    backgroundColor: '#ccc',
  },
  hitDiceButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 