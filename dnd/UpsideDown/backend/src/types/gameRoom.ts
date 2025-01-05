export interface GameRoom {
  id: string;
  hostId: string;
  name: string;
  players: Player[];
  status: 'waiting' | 'in-progress' | 'completed';
  createdAt: number;
  maxPlayers: number;
}

export interface Player {
  id: string;
  name: string;
  role: 'host' | 'player';
  character?: {
    name: string;
    class: string;
    level: number;
  };
} 