import { Player } from '../types/game';

export interface MatchmakingSession {
  id: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'full' | 'starting' | 'in-progress';
  aiDifficulty: 'easy' | 'medium' | 'hard';
  campaignType: 'dungeon' | 'city' | 'wilderness';
}

class MatchmakingService {
  private static instance: MatchmakingService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new MatchmakingService();
    }
    return this.instance;
  }

  async findOrCreateSession(player: Player, preferences: {
    aiDifficulty: 'easy' | 'medium' | 'hard';
    campaignType: 'dungeon' | 'city' | 'wilderness';
  }): Promise<MatchmakingSession> {
    // TODO: Implement actual API call
    return {
      id: 'test-session',
      players: [player],
      maxPlayers: 4,
      status: 'waiting',
      ...preferences
    };
  }
}

export { MatchmakingService }; 