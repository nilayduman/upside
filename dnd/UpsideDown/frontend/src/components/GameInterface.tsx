import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { InitiativeTracker } from './InitiativeTracker';
import { CombatLog } from './CombatLog';
import { DiceRoller } from './DiceRoller';

export const GameInterface = () => {
  return (
    <View style={styles.container}>
      {/* Main Game Area */}
      <View style={styles.gameArea}>
        {/* Left Panel - Character & Party Info */}
        <Card style={styles.leftPanel}>
          {/* Character stats, inventory, etc */}
        </Card>

        {/* Center Panel - Main Game View */}
        <View style={styles.centerPanel}>
          {/* Game map, current scene, or combat grid */}
        </View>

        {/* Right Panel - Game Tools */}
        <Card style={styles.rightPanel}>
          <InitiativeTracker />
          <DiceRoller />
          <CombatLog />
        </Card>
      </View>

      {/* Bottom Panel - Actions & Chat */}
      <Card style={styles.bottomPanel}>
        {/* Action buttons, chat interface */}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: 250,
    margin: 8,
  },
  centerPanel: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  rightPanel: {
    width: 300,
    margin: 8,
  },
  bottomPanel: {
    height: 150,
    margin: 8,
  },
}); 