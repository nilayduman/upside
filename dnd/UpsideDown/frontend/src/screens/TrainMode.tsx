import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type Tutorial = {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  steps: {
    id: number;
    title: string;
    description: string;
    image?: string;
    completed: boolean;
  }[];
};

export const TrainMode = () => {
  const navigation = useNavigation();
  const [tutorials] = useState<Tutorial[]>([
    {
      id: 1,
      title: 'Game Basics',
      description: 'Learn the fundamental concepts of the game',
      icon: '🎮',
      completed: true,
      steps: [
        {
          id: 1,
          title: 'Understanding the Interface',
          description: 'Get familiar with the game controls and UI elements',
          image: 'tutorial_ui.jpg',
          completed: true,
        },
        {
          id: 2,
          title: 'Character Movement',
          description: 'Learn how to move your character and interact with objects',
          image: 'tutorial_movement.jpg',
          completed: true,
        },
      ],
    },
    {
      id: 2,
      title: 'Combat System',
      description: 'Master the art of combat',
      icon: '⚔️',
      completed: false,
      steps: [
        {
          id: 1,
          title: 'Basic Attacks',
          description: 'Learn how to perform basic attacks and combinations',
          image: 'tutorial_combat.jpg',
          completed: false,
        },
        {
          id: 2,
          title: 'Special Abilities',
          description: 'Discover and master your character\'s special abilities',
          image: 'tutorial_abilities.jpg',
          completed: false,
        },
      ],
    },
    {
      id: 3,
      title: 'Story Mode',
      description: 'Learn how to create and participate in story campaigns',
      icon: '📚',
      completed: false,
      steps: [
        {
          id: 1,
          title: 'Campaign Creation',
          description: 'Learn how to create engaging story campaigns',
          image: 'tutorial_story.jpg',
          completed: false,
        },
        {
          id: 2,
          title: 'Character Development',
          description: 'Understand character progression and storytelling',
          image: 'tutorial_character.jpg',
          completed: false,
        },
      ],
    },
  ]);

  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => {
          if (selectedTutorial) {
            setSelectedTutorial(null);
          } else {
            navigation.goBack();
          }
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {selectedTutorial ? selectedTutorial.title : 'Training Mode'}
      </Text>
    </View>
  );

  const renderTutorialCard = (tutorial: Tutorial) => (
    <TouchableOpacity
      key={tutorial.id}
      style={[styles.tutorialCard, tutorial.completed && styles.completedCard]}
      onPress={() => setSelectedTutorial(tutorial)}
    >
      <Text style={styles.tutorialIcon}>{tutorial.icon}</Text>
      <View style={styles.tutorialInfo}>
        <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
        <Text style={styles.tutorialDescription}>{tutorial.description}</Text>
      </View>
      {tutorial.completed ? (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={24} color="#81b0ff" />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#999" />
      )}
    </TouchableOpacity>
  );

  const renderTutorialStep = (step: Tutorial['steps'][0], index: number) => (
    <View key={step.id} style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.stepInfo}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
        </View>
      </View>
      
      {step.image && (
        <Image
          source={require('../assets/images/placeholder.jpg')}
          style={styles.stepImage}
        />
      )}

      <TouchableOpacity 
        style={[styles.stepButton, step.completed && styles.completedStepButton]}
        onPress={() => {
          // TODO: Implement step completion logic
        }}
      >
        <Text style={[styles.stepButtonText, step.completed && styles.completedStepButtonText]}>
          {step.completed ? 'Completed' : 'Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {selectedTutorial ? (
          <View style={styles.tutorialContent}>
            <View style={styles.tutorialHeader}>
              <Text style={styles.tutorialIcon}>{selectedTutorial.icon}</Text>
              <Text style={styles.selectedTutorialTitle}>{selectedTutorial.title}</Text>
              <Text style={styles.selectedTutorialDescription}>
                {selectedTutorial.description}
              </Text>
            </View>

            <View style={styles.stepsContainer}>
              {selectedTutorial.steps.map((step, index) => 
                renderTutorialStep(step, index)
              )}
            </View>
          </View>
        ) : (
          <View style={styles.tutorialsList}>
            {tutorials.map(tutorial => renderTutorialCard(tutorial))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  tutorialsList: {
    padding: 15,
  },
  tutorialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  completedCard: {
    borderColor: '#81b0ff',
    borderWidth: 1,
  },
  tutorialIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  tutorialInfo: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  tutorialDescription: {
    fontSize: 14,
    color: '#999',
  },
  completedBadge: {
    backgroundColor: 'rgba(129, 176, 255, 0.1)',
    borderRadius: 12,
    padding: 2,
  },
  tutorialContent: {
    padding: 15,
  },
  tutorialHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedTutorialTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  selectedTutorialDescription: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 20,
  },
  stepContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 15,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#81b0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#999',
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  stepButton: {
    backgroundColor: '#81b0ff',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  completedStepButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#81b0ff',
  },
  stepButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completedStepButtonText: {
    color: '#81b0ff',
  },
});
