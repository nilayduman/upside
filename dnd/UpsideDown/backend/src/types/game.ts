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