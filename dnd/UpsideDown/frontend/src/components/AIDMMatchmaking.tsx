import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from './Card';
import { SelectList } from './SelectList';
import { Button } from './Button';
import { MatchmakingService } from '../services/MatchmakingService';
import { Player, MatchmakingSession } from '../types/game';

interface AIDMMatchmakingProps {
  player: Player;
  onSessionFound: (session: MatchmakingSession) => void;
  onCancel: () => void;
}

export const AIDMMatchmaking = ({
  player,
  onSessionFound,
  onCancel
}: AIDMMatchmakingProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [preferences, setPreferences] = useState({
    aiDifficulty: 'medium' as 'easy' | 'medium' | 'hard',
    campaignType: 'dungeon' as 'dungeon' | 'city' | 'wilderness'
  });

  const startMatchmaking = async () => {
    setIsSearching(true);
    try {
      const session = await MatchmakingService.getInstance()
        .findOrCreateSession(player, preferences);
      
      if (session.status === 'full') {
        onSessionFound(session);
      }
    } catch (error) {
      console.error('Matchmaking error:', error);
      setIsSearching(false);
    }
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>AI Dungeon Master Matchmaking</Text>

      {!isSearching ? (
        <>
          <SelectList
            label="AI Difficulty"
            options={[
              { value: 'easy', label: 'Easy', description: 'Beginner-friendly AI DM' },
              { value: 'medium', label: 'Medium', description: 'Balanced challenge' },
              { value: 'hard', label: 'Hard', description: 'Experienced players' }
            ]}
            value={preferences.aiDifficulty}
            onChange={(value) => setPreferences({
              ...preferences,
              aiDifficulty: value as 'easy' | 'medium' | 'hard'
            })}
          />

          <SelectList
            label="Campaign Type"
            options={[
              { value: 'dungeon', label: 'Dungeon', description: 'Classic dungeon crawl' },
              { value: 'city', label: 'City', description: 'Urban adventure' },
              { value: 'wilderness', label: 'Wilderness', description: 'Outdoor exploration' }
            ]}
            value={preferences.campaignType}
            onChange={(value) => setPreferences({
              ...preferences,
              campaignType: value as 'dungeon' | 'city' | 'wilderness'
            })}
          />

          <Button
            title="Find Game"
            onPress={startMatchmaking}
            style={styles.findButton}
          />
        </>
      ) : (
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.searchingText}>
            Finding players for {preferences.campaignType} adventure...
          </Text>
          <Text style={styles.searchingSubtext}>
            AI Difficulty: {preferences.aiDifficulty}
          </Text>
          <Button
            title="Cancel"
            onPress={onCancel}
            style={styles.cancelButton}
          />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  findButton: {
    marginTop: 16,
  },
  searchingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  searchingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  searchingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
}); 