import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput } from 'react-native';
import { SelectList } from './SelectList';
import { Button } from './Button';

interface NPCCreationDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (npc: {
    name: string;
    race: string;
    occupation: string;
    disposition: 'friendly' | 'neutral' | 'hostile';
    location: string;
    notes: string;
  }) => void;
}

export const NPCCreationDialog = ({
  visible,
  onClose,
  onSave,
}: NPCCreationDialogProps) => {
  const [npc, setNpc] = useState({
    name: '',
    race: '',
    occupation: '',
    disposition: 'neutral' as const,
    location: '',
    notes: '',
  });

  const handleSave = () => {
    if (npc.name && npc.race && npc.occupation) {
      onSave(npc);
      setNpc({
        name: '',
        race: '',
        occupation: '',
        disposition: 'neutral',
        location: '',
        notes: '',
      });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Create New NPC</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={npc.name}
            onChangeText={(text) => setNpc({ ...npc, name: text })}
          />

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
            value={npc.race}
            onChange={(value) => setNpc({ ...npc, race: value })}
          />

          <TextInput
            style={styles.input}
            placeholder="Occupation"
            value={npc.occupation}
            onChangeText={(text) => setNpc({ ...npc, occupation: text })}
          />

          <SelectList
            label="Disposition"
            options={['friendly', 'neutral', 'hostile']}
            value={npc.disposition}
            onChange={(value) => setNpc({ ...npc, disposition: value as any })}
          />

          <TextInput
            style={styles.input}
            placeholder="Location"
            value={npc.location}
            onChangeText={(text) => setNpc({ ...npc, location: text })}
          />

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes"
            value={npc.notes}
            onChangeText={(text) => setNpc({ ...npc, notes: text })}
            multiline
          />

          <View style={styles.buttons}>
            <Button
              title="Cancel"
              onPress={onClose}
              style={styles.cancelButton}
            />
            <Button
              title="Save"
              onPress={handleSave}
              disabled={!npc.name || !npc.race || !npc.occupation}
              style={styles.saveButton}
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
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
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
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
}); 