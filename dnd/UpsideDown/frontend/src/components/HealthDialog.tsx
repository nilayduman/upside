import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput } from 'react-native';
import { SelectList } from './SelectList';
import { Button } from './Button';

export type DamageType = 'slashing' | 'piercing' | 'bludgeoning' | 'fire' | 'cold' | 
                 'lightning' | 'acid' | 'poison' | 'necrotic' | 'radiant' | 'force';


interface HealthDialogProps {
  visible: boolean;
  currentHp: number;
  maxHp: number;
  tempHp: number;
  resistances: DamageType[];
  vulnerabilities: DamageType[];
  onClose: () => void;
  onApply: (amount: number, type: 'damage' | 'healing' | 'temp', damageType?: DamageType) => void;
}

const DAMAGE_TYPES: DamageType[] = [
  'slashing', 'piercing', 'bludgeoning', 'fire', 'cold',
  'lightning', 'acid', 'poison', 'necrotic', 'radiant', 'force'
];

export const HealthDialog = ({
  visible,
  currentHp,
  maxHp,
  tempHp,
  resistances,
  vulnerabilities,
  onClose,
  onApply,
}: HealthDialogProps) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'damage' | 'healing' | 'temp'>('healing');
  const [damageType, setDamageType] = useState<DamageType>('slashing');

  const calculateFinalDamage = (inputAmount: number): number => {
    if (type !== 'damage') return inputAmount;

    if (resistances.includes(damageType)) {
      return Math.floor(inputAmount / 2);
    }
    if (vulnerabilities.includes(damageType)) {
      return inputAmount * 2;
    }
    return inputAmount;
  };

  const handleApply = () => {
    const numAmount = parseInt(amount, 10);
    if (!isNaN(numAmount) && numAmount > 0) {
      const finalAmount = calculateFinalDamage(numAmount);
      onApply(finalAmount, type, type === 'damage' ? damageType : undefined);
      setAmount('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Modify Health</Text>
          
          <View style={styles.currentHealth}>
            <Text style={styles.healthText}>
              Current HP: {currentHp}/{maxHp}
            </Text>
            {tempHp > 0 && (
              <Text style={styles.tempHpText}>
                Temporary HP: {tempHp}
              </Text>
            )}
          </View>

          <SelectList
            label="Type"
            options={[
              { value: 'healing', label: 'Healing' },
              { value: 'damage', label: 'Damage' },
              { value: 'temp', label: 'Temporary' }
            ]}
            value={type}
            onChange={(value) => setType(value as 'damage' | 'healing' | 'temp')}
          />

          {type === 'damage' && (
            <>
              <SelectList
                label="Damage Type"
                options={DAMAGE_TYPES.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))}
                value={damageType}
                onChange={(value) => setDamageType(value as DamageType)}
              />
              {(resistances.includes(damageType) || vulnerabilities.includes(damageType)) && (
                <Text style={[
                  styles.damageModifier,
                  resistances.includes(damageType) ? styles.resistance : styles.vulnerability
                ]}>
                  {resistances.includes(damageType) ? 'Resistant' : 'Vulnerable'} to {damageType}
                </Text>
              )}
            </>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              maxLength={3}
            />
            {amount && type === 'damage' && (
              <Text style={styles.finalDamage}>
                Final damage: {calculateFinalDamage(parseInt(amount, 10))}
              </Text>
            )}
          </View>

          <View style={styles.buttons}>
            <Button
              title="Cancel"
              onPress={onClose}
              style={styles.cancelButton}
            />
            <Button
              title="Apply"
              onPress={handleApply}
              style={styles.applyButton}
              disabled={!amount || parseInt(amount, 10) <= 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  damageModifier: {
    textAlign: 'center',
    marginTop: 8,
    padding: 4,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  resistance: {
    backgroundColor: '#2ECC71',
    color: 'white',
  },
  vulnerability: {
    backgroundColor: '#E74C3C',
    color: 'white',
  },
  finalDamage: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#ccc',
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  currentHealth: {
    alignItems: 'center',
    marginBottom: 16,
  },
  healthText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  tempHpText: {
    fontSize: 14,
    color: '#4A90E2',
  },
  inputContainer: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});