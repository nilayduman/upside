import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { Button } from '../Button';
import { GameModeManager, GameMode, GameSession, Player } from '../../game/modes/GameModeManager';
import { AIDungeonMaster } from '../../game/ai/AIDungeonMaster';

interface SessionUIProps {
  mode: GameMode;
  sessionId: string;
}

export const SessionUI = ({ mode, sessionId }: SessionUIProps) => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [aiDM, setAIDM] = useState<AIDungeonMaster | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    const manager = GameModeManager.getInstance();
    const unsubscribe = manager.subscribe(setSession);

    if (mode.includes('ai-dm')) {
      setAIDM(new AIDungeonMaster('medium', 4, 1));
    }

    return () => {
      unsubscribe();
    };
  }, [mode]);

  useEffect(() => {
    const context = {
      playerHealth: 100,
      timeOfDay: 'day',
      recentEvents: []
    };
    
    const fetchResponse = async () => {
      if (aiDM) {
        const result = await aiDM.generateResponse('', context);
        setResponse(result.toString());
      }
    };
    
    fetchResponse();
  }, [aiDM]);

  const renderContent = () => {
    switch (mode) {
      case 'friend-dm':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Friend DM Session</Text>
            <View style={styles.playerList}>
              {session?.players.map((player: Player) => (
                <Card key={player.id} style={styles.playerCard}>
                  <Text>{player.name}</Text>
                  <Text>{player.isDM ? 'Dungeon Master' : 'Player'}</Text>
                </Card>
              ))}
            </View>
          </View>
        );

      case 'ai-dm-random':
      case 'ai-dm-friends':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>AI Dungeon Master</Text>
            <Card style={styles.aiResponse}>
              <Text>{response}</Text>
            </Card>
            <View style={styles.actionButtons}>
              <Button title="Explore" onPress={() => {}} />
              <Button title="Fight" onPress={() => {}} />
              <Button title="Talk" onPress={() => {}} />
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  playerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  playerCard: {
    padding: 12,
    width: 150,
  },
  aiResponse: {
    padding: 16,
    marginVertical: 16,
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
}); 