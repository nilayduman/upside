type SceneType = 'combat' | 'exploration' | 'social' | 'puzzle' | 'rest';
type Environment = 'dungeon' | 'wilderness' | 'urban' | 'underwater' | 'planar';

interface AIResponse {
  narration: string;
  options: string[];
  consequences: {
    success: string;
    failure: string;
  };
  difficulty: number;
}

interface NPCTemplate {
  type: 'friendly' | 'neutral' | 'hostile';
  role: 'merchant' | 'quest_giver' | 'enemy' | 'ally';
  personality: string[];
  motivations: string[];
}

export class AIDungeonMaster {
  private difficulty: 'easy' | 'medium' | 'hard';
  private partySize: number;
  private partyLevel: number;
  private environment: Environment;
  private currentScene: SceneType;
  private narrativeHistory: string[] = [];
  private activeNPCs: Map<string, NPCTemplate> = new Map();

  constructor(
    difficulty: 'easy' | 'medium' | 'hard',
    partySize: number,
    partyLevel: number,
    environment: Environment = 'dungeon'
  ) {
    this.difficulty = difficulty;
    this.partySize = partySize;
    this.partyLevel = partyLevel;
    this.environment = environment;
    this.currentScene = 'exploration';
  }

  generateResponse(playerAction: string, context: {
    playerHealth: number;
    timeOfDay: string;
    recentEvents: string[];
  }): AIResponse {
    const responses = this.getResponseTemplates(this.currentScene);
    const selectedResponse = this.selectAppropriateResponse(responses, context);
    
    return this.customizeResponse(selectedResponse, context);
  }

  private getResponseTemplates(sceneType: SceneType): AIResponse[] {
    // Extensive response templates for different scenarios
    const templates: Record<SceneType, AIResponse[]> = {
      combat: [
        {
          narration: "A group of [enemies] emerges from [direction], their weapons drawn. They seem [attitude].",
          options: [
            "Attempt to negotiate",
            "Take defensive positions",
            "Launch a surprise attack",
            "Try to retreat"
          ],
          consequences: {
            success: "The situation is handled with minimal casualties",
            failure: "The enemy gains the upper hand"
          },
          difficulty: 3
        },
        // ... more combat templates
      ],
      exploration: [
        {
          narration: "You discover [discovery] in this [environment]. There are signs of [clue].",
          options: [
            "Investigate further",
            "Mark it on your map",
            "Look for hidden passages",
            "Continue exploring"
          ],
          consequences: {
            success: "You uncover valuable information",
            failure: "You miss important details"
          },
          difficulty: 2
        },
        // ... more exploration templates
      ],
      social: [
        {
          narration: "A [npc_type] approaches your group, seeking [motivation].",
          options: [
            "Listen to their story",
            "Offer assistance",
            "Remain cautious",
            "Share information"
          ],
          consequences: {
            success: "You gain a valuable ally",
            failure: "The NPC becomes distrustful"
          },
          difficulty: 2
        },
        // ... more social templates
      ],
      puzzle: [
        {
          narration: "Before you stands [puzzle_description]. It appears to require [mechanism].",
          options: [
            "Examine the mechanism",
            "Search for clues",
            "Try a solution",
            "Look for an alternative"
          ],
          consequences: {
            success: "The puzzle reveals its secrets",
            failure: "The puzzle remains unsolved"
          },
          difficulty: 4
        },
        // ... more puzzle templates
      ],
      rest: [
        {
          narration: "You find a [safe_place] suitable for rest. The atmosphere is [atmosphere].",
          options: [
            "Set up camp",
            "Keep watch",
            "Tend to wounds",
            "Share stories"
          ],
          consequences: {
            success: "The party recovers strength",
            failure: "Rest is interrupted"
          },
          difficulty: 1
        }
      ]
    };

    return templates[sceneType];
  }

  private selectAppropriateResponse(responses: AIResponse[], context: any): AIResponse {
    // Select based on difficulty and context
    const validResponses = responses.filter(r => {
      const difficultyMatch = r.difficulty <= (this.difficulty === 'easy' ? 2 : this.difficulty === 'medium' ? 3 : 4);
      const healthAppropriate = context.playerHealth > 30 || r.difficulty <= 2;
      return difficultyMatch && healthAppropriate;
    });

    return validResponses[Math.floor(Math.random() * validResponses.length)];
  }

  private customizeResponse(template: AIResponse, context: any): AIResponse {
    // Replace placeholders with contextual content
    const customized = {...template};
    customized.narration = this.replacePlaceholders(template.narration, context);
    customized.options = template.options.map(opt => this.replacePlaceholders(opt, context));
    
    return customized;
  }

  private replacePlaceholders(text: string, context: any): string {
    // Replace template placeholders with appropriate content
    return text
      .replace('[enemies]', this.getEnemyType())
      .replace('[direction]', this.getDirection())
      .replace('[attitude]', this.getAttitude())
      .replace('[discovery]', this.getDiscovery())
      .replace('[environment]', this.environment)
      .replace('[clue]', this.getClue());
  }

  // Helper methods for generating specific content
  private getEnemyType(): string {
    const enemies = {
      easy: ['goblins', 'bandits', 'wolves'],
      medium: ['orcs', 'undead', 'cultists'],
      hard: ['dragons', 'demons', 'liches']
    };
    return enemies[this.difficulty][Math.floor(Math.random() * enemies[this.difficulty].length)];
  }

  private getDirection(): string {
    const directions = ['north', 'south', 'east', 'west', 'above', 'below'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private getAttitude(): string {
    const attitudes = ['hostile', 'cautious', 'aggressive', 'fearful'];
    return attitudes[Math.floor(Math.random() * attitudes.length)];
  }

  private getDiscovery(): string {
    const discoveries = ['ancient ruins', 'hidden treasure', 'mysterious symbols', 'strange markings'];
    return discoveries[Math.floor(Math.random() * discoveries.length)];
  }

  private getClue(): string {
    const clues = ['recent activity', 'danger ahead', 'valuable resources', 'secret passages'];
    return clues[Math.floor(Math.random() * clues.length)];
  }
}