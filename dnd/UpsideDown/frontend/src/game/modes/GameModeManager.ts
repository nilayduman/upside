import { Character } from '../../types/character';

export type GameMode = 'friend-dm' | 'ai-dm-random' | 'ai-dm-friends';

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isDM: boolean;
  character?: Character;
}

export interface GameSession {
  id: string;
  mode: GameMode;
  players: Player[];
  status: 'waiting' | 'in-progress' | 'completed';
  settings: {
    maxPlayers: number;
    isPrivate: boolean;
    aiDifficulty?: 'easy' | 'medium' | 'hard';
  };
}

export class GameModeManager {
  private static instance: GameModeManager;
  private currentSession: GameSession | null = null;
  private listeners: Set<(session: GameSession | null) => void> = new Set();

  static getInstance() {
    if (!GameModeManager.instance) {
      GameModeManager.instance = new GameModeManager();
    }
    return GameModeManager.instance;
  }

  async createSession(mode: GameMode, player: Player, settings: Partial<GameSession['settings']> = {}) {
    const defaultSettings: GameSession['settings'] = {
      maxPlayers: mode === 'ai-dm-random' ? 4 : 6,
      isPrivate: mode !== 'ai-dm-random',
      aiDifficulty: 'medium' as 'easy' | 'medium' | 'hard'
    };

    this.currentSession = {
      id: `session-${Date.now()}`,
      mode,
      players: [player],
      status: 'waiting',
      settings: { ...defaultSettings, ...settings }
    };

    this.notifyListeners();
    return this.currentSession;
  }

  async joinSession(sessionId: string, player: Player) {
    if (!this.currentSession || this.currentSession.id !== sessionId) {
      throw new Error('Session not found');
    }

    if (this.currentSession.players.length >= this.currentSession.settings.maxPlayers) {
      throw new Error('Session is full');
    }

    this.currentSession.players.push(player);
    this.notifyListeners();
  }

  async assignDM(playerId: string) {
    if (!this.currentSession) return;

    // Only allow DM assignment in friend-dm mode
    if (this.currentSession.mode === 'friend-dm') {
      this.currentSession.players = this.currentSession.players.map(p => ({
        ...p,
        isDM: p.id === playerId
      }));
      this.notifyListeners();
    }
  }

  async startSession() {
    if (!this.currentSession) return;

    // Validate session can start based on mode
    switch (this.currentSession.mode) {
      case 'friend-dm':
        if (!this.currentSession.players.some(p => p.isDM)) {
          throw new Error('No DM assigned');
        }
        break;
      case 'ai-dm-random':
        if (this.currentSession.players.length < 2) {
          throw new Error('Not enough players');
        }
        break;
      case 'ai-dm-friends':
        if (this.currentSession.players.length < 1) {
          throw new Error('Not enough players');
        }
        break;
    }

    this.currentSession.status = 'in-progress';
    this.notifyListeners();
  }

  subscribe(listener: (session: GameSession | null) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentSession));
  }
}