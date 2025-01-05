import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { SelectList } from './SelectList';
import type { GameMode } from './GameModeSelection';

interface Player {
  id: string;
  name: string;
  character?: string;
  isDM: boolean;
}

interface GameLobbyProps {
  mode: GameMode;
  players: Player[];
  onStartGame: () => void;
  onInvitePlayer: () => void;
  onLeaveLobby: () => void;
}

export const GameLobby = ({
  mode,
  players,
  onStartGame,
  onInvitePlayer,
  onLeaveLobby
}: GameLobbyProps) => {
  const [isReady, setIsReady] = useState(false);

  const renderModeSpecificContent = () => {
    switch (mode) {
      case 'ai-dm':
        return (
          <View style={styles.modeContent}>
            <Text style={styles.modeTitle}>AI Dungeon Master Mode</Text>
            <Text style={styles.modeDescription}>
              The AI will act as your DM and guide you through the adventure.
              Waiting for {4 - players.length} more players to join...
            </Text>
          </View>
        );

      case 'player-dm':
        return (
          <View style={styles.modeContent}>
            <Text style={styles.modeTitle}>Friend DM Mode</Text>
            <SelectList
              label="Select DM"
              options={players.map(p => p.name)}
              value={players.find(p => p.isDM)?.name || ''}
              onChange={() => {/* Handle DM selection */}}
            />
          </View>
        );

      case 'friend-dm':
        return (
          <View style={styles.modeContent}>
            <Text style={styles.modeTitle}>Join Friend's Game</Text>
            <Button
              title="Enter Game Code"
              onPress={() => {/* Handle game code entry */}}
              style={styles.codeButton}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderModeSpecificContent()}

      <Card style={styles.playersCard}>
        <Text style={styles.sectionTitle}>Players ({players.length}/4)</Text>
        {players.map(player => (
          <View key={player.id} style={styles.playerRow}>
            <Text style={styles.playerName}>
              {player.name} {player.isDM && '(DM)'}
            </Text>
            {player.character && (
              <Text style={styles.characterName}>{player.character}</Text>
            )}
          </View>
        ))}
      </Card>

      <View style={styles.actions}>
        <Button
          title="Invite Player"
          onPress={onInvitePlayer}
          style={styles.actionButton}
        />
        <Button
          title="Ready"
          onPress={() => setIsReady(!isReady)}
          style={[
            styles.actionButton,
            isReady && styles.readyButton
          ]}
        />
      </View>

      <Button
        title="Leave Lobby"
        onPress={onLeaveLobby}
        style={styles.leaveButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  modeContent: {
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  playersCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  characterName: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  readyButton: {
    backgroundColor: '#2ECC71',
  },
  leaveButton: {
    backgroundColor: '#E74C3C',
  },
  codeButton: {
    marginTop: 8,
  },
}); 