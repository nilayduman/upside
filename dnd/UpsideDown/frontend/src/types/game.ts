export interface Player {
  id: string;
  name: string;
  character?: {
    name: string;
    class: string;
    level: number;
  };
  isReady: boolean;
  isHost: boolean;
}

export interface MatchmakingSession {
  id: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'full' | 'starting' | 'in-progress';
  aiDifficulty: 'easy' | 'medium' | 'hard';
  campaignType: 'dungeon' | 'city' | 'wilderness';
} 