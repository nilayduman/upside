import { GameMode, GameModeManager, Player } from '../modes/GameModeManager';

interface MatchCriteria {
     mode: GameMode;
     level: number;
     region: string;
     language: string;
   }
   
   interface MatchmakingPlayer {
     id: string;
     name: string;
     criteria: MatchCriteria;
     timestamp: number;
   }
   
   export class MatchmakingSystem {
     private static instance: MatchmakingSystem;
     private queue: Map<string, MatchmakingPlayer> = new Map();
     private matchingInterval: NodeJS.Timeout | null = null;
   
     static getInstance() {
       if (!MatchmakingSystem.instance) {
         MatchmakingSystem.instance = new MatchmakingSystem();
       }
       return MatchmakingSystem.instance;
     }
   
     joinQueue(player: MatchmakingPlayer) {
       this.queue.set(player.id, player);
       this.startMatching();
     }
   
     leaveQueue(playerId: string) {
       this.queue.delete(playerId);
       if (this.queue.size === 0) {
         this.stopMatching();
       }
     }
   
     private startMatching() {
       if (this.matchingInterval) return;
   
       this.matchingInterval = setInterval(() => {
         const players = Array.from(this.queue.values());
         
         // Group players by mode
         const groups = players.reduce((acc, player) => {
           const mode = player.criteria.mode;
           if (!acc[mode]) acc[mode] = [];
           acc[mode].push(player);
           return acc;
         }, {} as Record<GameMode, MatchmakingPlayer[]>);
   
         // Match players in each mode
         Object.entries(groups).forEach(([mode, modePlayers]) => {
           if (mode === 'ai-dm-random' && modePlayers.length >= 2) {
             this.createMatch(modePlayers.slice(0, 4));
           }
         });
       }, 5000); // Check every 5 seconds
     }
   
     private stopMatching() {
       if (this.matchingInterval) {
         clearInterval(this.matchingInterval);
         this.matchingInterval = null;
       }
     }
   
     private createMatch(players: MatchmakingPlayer[]) {
       players.forEach(player => this.queue.delete(player.id));
   
       const manager = GameModeManager.getInstance();
       const firstPlayer: Player = {
         id: players[0].id,
         name: players[0].name,
         isHost: true,
         isDM: false,
       };
   
       manager.createSession('ai-dm-random', firstPlayer, {
         maxPlayers: players.length
       }).then(session => {
         players.slice(1).forEach(p => {
           const player: Player = {
             id: p.id,
             name: p.name,
             isHost: false,
             isDM: false,
           };
           manager.joinSession(session.id, player);
         });
       });
     }
   }