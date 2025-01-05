import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { Button } from '../Button';

interface StoryChoice {
  text: string;
  onSelect: () => void;
  disabled?: boolean;
}

interface StoryViewProps {
  content: string;
  choices?: StoryChoice[];
  speaker?: {
    name: string;
    type: 'npc' | 'narrator' | 'player';
  };
  onContinue?: () => void;
}

export const StoryView = ({ content, choices, speaker, onContinue }: StoryViewProps) => {
  return (
    <Card style={styles.container}>
      <ScrollView style={styles.contentScroll}>
        {speaker && (
          <Text style={[
            styles.speaker,
            speaker.type === 'npc' && styles.npcSpeaker,
            speaker.type === 'narrator' && styles.narratorSpeaker
          ]}>
            {speaker.name}:
          </Text>
        )}
        
        <Text style={styles.content}>{content}</Text>
      </ScrollView>

      <View style={styles.choices}>
        {choices ? (
          choices.map((choice, index) => (
            <Button
              key={index}
              title={choice.text}
              onPress={choice.onSelect}
              disabled={choice.disabled}
              style={styles.choiceButton}
            />
          ))
        ) : onContinue ? (
          <Button
            title="Continue"
            onPress={onContinue}
            style={styles.continueButton}
          />
        ) : null}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    margin: 16,
    maxHeight: 400,
  },
  contentScroll: {
    flex: 1,
    marginBottom: 16,
  },
  speaker: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  npcSpeaker: {
    color: '#8e44ad',
  },
  narratorSpeaker: {
    color: '#2980b9',
    fontStyle: 'italic',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
  },
  choices: {
    gap: 8,
  },
  choiceButton: {
    marginVertical: 4,
  },
  continueButton: {
    backgroundColor: '#2ecc71',
  },
}); 