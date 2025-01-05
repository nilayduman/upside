import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { DiceType, rollDice, calculateTotal } from '../utils/dice';

interface DiceRollerProps {
  onRollComplete?: (total: number) => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ onRollComplete }) => {
  const [lastRoll, setLastRoll] = useState<number[]>([]);
  const [diceType, setDiceType] = useState<DiceType>('d20');
  const [numberOfDice, setNumberOfDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const spinValue = new Animated.Value(0);

  const handleRoll = () => {
    setIsRolling(true);
    
    // Animate the dice
    Animated.sequence([
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(spinValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Roll the dice
    const rolls = rollDice(diceType, numberOfDice);
    setLastRoll(rolls);
    
    setTimeout(() => {
      setIsRolling(false);
      if (onRollComplete) {
        onRollComplete(calculateTotal(rolls));
      }
    }, 500);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.diceOptions}>
        {(['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as DiceType[]).map((type) => (
          <Pressable
            key={type}
            style={[styles.diceButton, diceType === type && styles.selectedDice]}
            onPress={() => setDiceType(type)}
          >
            <Text style={styles.diceButtonText}>{type}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.numberSelector}>
        <Pressable
          style={styles.numberButton}
          onPress={() => setNumberOfDice(Math.max(1, numberOfDice - 1))}
        >
          <Text style={styles.numberButtonText}>-</Text>
        </Pressable>
        <Text style={styles.numberText}>{numberOfDice}</Text>
        <Pressable
          style={styles.numberButton}
          onPress={() => setNumberOfDice(Math.min(10, numberOfDice + 1))}
        >
          <Text style={styles.numberButtonText}>+</Text>
        </Pressable>
      </View>

      <Pressable style={styles.rollButton} onPress={handleRoll}>
        <Animated.Text 
          style={[
            styles.rollButtonText,
            { transform: [{ rotate: spin }] }
          ]}
        >
          🎲 Roll {numberOfDice}{diceType}
        </Animated.Text>
      </Pressable>

      {lastRoll.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Results:</Text>
          <Text style={styles.resultText}>
            {lastRoll.join(', ')}
          </Text>
          <Text style={styles.totalText}>
            Total: {calculateTotal(lastRoll)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
  },
  diceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  diceButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#3d3d3d',
    minWidth: 50,
    alignItems: 'center',
  },
  selectedDice: {
    backgroundColor: '#4a90e2',
  },
  diceButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  numberSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  numberButton: {
    backgroundColor: '#3d3d3d',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  numberText: {
    color: '#ffffff',
    fontSize: 20,
    marginHorizontal: 16,
  },
  rollButton: {
    backgroundColor: '#00ff9d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  rollButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    color: '#00ff9d',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  totalText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});