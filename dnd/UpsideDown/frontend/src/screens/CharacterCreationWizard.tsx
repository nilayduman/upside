import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SelectList } from '../components/SelectList';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface CharacterCreationStep {
  id: string;
  title: string;
  completed: boolean;
}

export const CharacterCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [character, setCharacter] = useState({
    race: '',
    class: '',
    background: '',
    alignment: '',
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }
  });

  const steps: CharacterCreationStep[] = [
    { id: 'race', title: 'Choose Race', completed: !!character.race },
    { id: 'class', title: 'Choose Class', completed: !!character.class },
    { id: 'background', title: 'Choose Background', completed: !!character.background },
    { id: 'abilities', title: 'Set Abilities', completed: false },
    { id: 'equipment', title: 'Select Equipment', completed: false }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card style={styles.stepCard}>
            <SelectList
              label="Race"
              options={[
                'Human',
                'Elf',
                'Dwarf',
                'Halfling',
                'Dragonborn',
                'Tiefling'
              ]}
              value={character.race}
              onChange={(value) => setCharacter({ ...character, race: value })}
            />
          </Card>
        );
      case 1:
        return (
          <Card style={styles.stepCard}>
            <SelectList
              label="Class"
              options={[
                'Fighter',
                'Wizard',
                'Rogue',
                'Cleric',
                'Ranger',
                'Paladin'
              ]}
              value={character.class}
              onChange={(value) => setCharacter({ ...character, class: value })}
            />
          </Card>
        );
      // Add more cases for other steps
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <Button
            key={step.id}
            title={step.title}
            onPress={() => setCurrentStep(index)}
            style={[
              styles.stepButton,
              currentStep === index && styles.activeStep,
              step.completed && styles.completedStep
            ]}
          />
        ))}
      </View>

      {renderStep()}

      <View style={styles.navigation}>
        <Button
          title="Previous"
          onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          style={styles.navButton}
        />
        <Button
          title={currentStep === steps.length - 1 ? "Finish" : "Next"}
          onPress={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={!steps[currentStep].completed}
          style={styles.navButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  stepsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  stepButton: {
    flex: 1,
    minWidth: 150,
  },
  activeStep: {
    backgroundColor: '#4A90E2',
  },
  completedStep: {
    backgroundColor: '#2ECC71',
  },
  stepCard: {
    margin: 16,
    padding: 16,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});