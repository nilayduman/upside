interface Character {
  id: string;
  name: string;
  type: 'player' | 'npc' | 'enemy';
  stats: {
    hp: number;
    maxHp: number;
    ac: number;
    initiative: number;
  };
  position: { x: number; y: number };
}

interface GameScene {
  id: string;
  type: 'combat' | 'exploration' | 'social';
  characters: Character[];
  activeCharacterId?: string;
  round: number;
}

export class GameState {
  private static instance: GameState;
  private currentScene: GameScene = {
    id: 'initial',
    type: 'exploration',
    characters: [],
    round: 1
  };
  private storyProgress: Map<string, boolean> = new Map();
  private listeners: Set<(scene: GameScene) => void> = new Set();

  static getInstance() {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  startCombat(characters: Character[]) {
    this.currentScene = {
      id: `combat-${Date.now()}`,
      type: 'combat',
      characters: characters.sort((a, b) => b.stats.initiative - a.stats.initiative),
      round: 1
    };
    this.notifyListeners();
  }

  nextTurn() {
    if (this.currentScene.type !== 'combat') return;

    const currentIndex = this.currentScene.characters.findIndex(
      c => c.id === this.currentScene.activeCharacterId
    );
    
    const nextIndex = (currentIndex + 1) % this.currentScene.characters.length;
    this.currentScene.activeCharacterId = this.currentScene.characters[nextIndex].id;

    if (nextIndex === 0) {
      this.currentScene.round++;
    }

    this.notifyListeners();
  }

  subscribe(listener: (scene: GameScene) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentScene));
  }
} 