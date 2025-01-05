export interface GameRoom {
  id: string;
  hostId: string;
  name: string;
  players: {
    id: string;
    name: string;
    role: 'host' | 'player';
  }[];
  status: 'waiting' | 'in-progress' | 'completed';
  createdAt: number;
  maxPlayers: number;
} 