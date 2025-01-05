import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../Card';

interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  objectives: QuestObjective[];
}

interface QuestLogProps {
  quests: Quest[];
  onQuestSelect?: (questId: string) => void;
}

export const QuestLog = ({ quests, onQuestSelect }: QuestLogProps) => {
  const activeQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');
  const failedQuests = quests.filter(q => q.status === 'failed');

  const renderQuest = (quest: Quest) => (
    <TouchableOpacity
      key={quest.id}
      style={styles.questItem}
      onPress={() => onQuestSelect?.(quest.id)}
    >
      <View style={styles.questHeader}>
        <Text style={styles.questTitle}>{quest.title}</Text>
        <Text style={[
          styles.questStatus,
          quest.status === 'completed' && styles.statusCompleted,
          quest.status === 'failed' && styles.statusFailed,
        ]}>
          {quest.status.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.questDescription}>{quest.description}</Text>

      {quest.objectives.map(objective => (
        <View key={objective.id} style={styles.objective}>
          <Text style={[
            styles.objectiveText,
            objective.completed && styles.objectiveCompleted
          ]}>
            • {objective.description}
          </Text>
        </View>
      ))}
    </TouchableOpacity>
  );

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Quest Log</Text>
      <ScrollView style={styles.scrollView}>
        {activeQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Quests</Text>
            {activeQuests.map(renderQuest)}
          </View>
        )}

        {completedQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed Quests</Text>
            {completedQuests.map(renderQuest)}
          </View>
        )}

        {failedQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Failed Quests</Text>
            {failedQuests.map(renderQuest)}
          </View>
        )}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#7f8c8d',
  },
  questItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  questStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f39c12',
  },
  statusCompleted: {
    color: '#27ae60',
  },
  statusFailed: {
    color: '#c0392b',
  },
  questDescription: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 8,
  },
  objective: {
    marginLeft: 8,
  },
  objectiveText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  objectiveCompleted: {
    color: '#27ae60',
    textDecorationLine: 'line-through',
  },
}); 