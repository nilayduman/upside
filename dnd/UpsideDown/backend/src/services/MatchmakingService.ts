import { Player } from '../types/game';

interface MatchmakingSession {
  id: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'full' | 'starting' | 'in-progress';
  aiDifficulty: 'easy' | 'medium' | 'hard';
  campaignType: 'dungeon' | 'city' | 'wilderness';
}

export class MatchmakingService {
  private static instance: MatchmakingService;
  private activeSessions: Map<string, MatchmakingSession> = new Map();

  static getInstance() {
    if (!MatchmakingService.instance) {
      MatchmakingService.instance = new MatchmakingService();
    }
    return MatchmakingService.instance;
  }

  async findOrCreateSession(player: Player, preferences: {
    aiDifficulty: 'easy' | 'medium' | 'hard';
    campaignType: 'dungeon' | 'city' | 'wilderness';
  }): Promise<MatchmakingSession> {
    // Find suitable existing session
    for (const [_, session] of this.activeSessions) {
      if (
        session.status === 'waiting' &&
        session.aiDifficulty === preferences.aiDifficulty &&
        session.campaignType === preferences.campaignType &&
        session.players.length < session.maxPlayers
      ) {
        session.players.push(player);
        if (session.players.length === session.maxPlayers) {
          session.status = 'full';
        }
        return session;
      }
    }

    // Create new session if no suitable one found
    const newSession: MatchmakingSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      players: [player],
      maxPlayers: 4,
      status: 'waiting',
      aiDifficulty: preferences.aiDifficulty,
      campaignType: preferences.campaignType
    };

    this.activeSessions.set(newSession.id, newSession);
    return newSession;
  }

  async leaveSession(sessionId: string, playerId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.players = session.players.filter(p => p.id !== playerId);
      if (session.players.length === 0) {
        this.activeSessions.delete(sessionId);
      } else {
        session.status = 'waiting';
      }
    }
  }
}