import OpenAI from 'openai';

interface StoryContext {
  campaign: {
    setting: string;
    mainPlot: string;
    tone: string;
  };
  characters: {
    id: string;
    name: string;
    race: string;
    class: string;
    background: string;
    personality: string[];
  }[];
  currentScene: {
    location: string;
    time: string;
    npcs: string[];
    recentEvents: string[];
  };
  questProgress: Record<string, {
    status: 'active' | 'completed' | 'failed';
    progress: number;
  }>;
}

export class GPTStorytellingEngine {
  private openai: OpenAI;
  private context: StoryContext;
  private conversationHistory: { role: 'system' | 'user' | 'assistant', content: string }[] = [];

  constructor(apiKey: string, initialContext: StoryContext) {
    this.openai = new OpenAI({ apiKey });
    this.context = initialContext;
    this.initializeConversation();
  }

  private async initializeConversation() {
    // Set up the initial system message with campaign context
    this.conversationHistory.push({
      role: 'system',
      content: this.createSystemPrompt()
    });
  }

  private createSystemPrompt(): string {
    return `You are a creative and engaging Dungeon Master for a D&D campaign with the following context:
    Setting: ${this.context.campaign.setting}
    Main Plot: ${this.context.campaign.mainPlot}
    Tone: ${this.context.campaign.tone}

    Your role is to:
    1. Create immersive and dynamic story moments
    2. Respond to player actions naturally
    3. Maintain consistency with established lore
    4. Balance challenge and entertainment
    5. Adapt the story based on player choices

    Current party:
    ${this.context.characters.map(char => 
      `- ${char.name}: ${char.race} ${char.class}, ${char.background}`
    ).join('\n')}

    Please maintain the established tone and consider the party's capabilities when creating encounters and challenges.`;
  }

  async generateResponse(
    playerAction: string,
    type: 'narrative' | 'combat' | 'dialogue' | 'description'
  ): Promise<string> {
    const prompt = this.createPrompt(playerAction, type);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          ...this.conversationHistory,
          { role: 'user', content: prompt }
        ],
        temperature: this.getTemperatureForType(type),
        max_tokens: this.getMaxTokensForType(type),
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        this.updateConversationHistory(playerAction, response);
        return response;
      }
      throw new Error('No response generated');
    } catch (error) {
      console.error('GPT Story Generation Error:', error);
      return this.getFallbackResponse(type);
    }
  }

  private createPrompt(playerAction: string, type: string): string {
    const baseContext = `
Current location: ${this.context.currentScene.location}
Time: ${this.context.currentScene.time}
Recent events: ${this.context.currentScene.recentEvents.join(', ')}
`;

    switch (type) {
      case 'narrative':
        return `${baseContext}
The party has just: ${playerAction}
Continue the story with an engaging narrative description of what happens next.`;

      case 'combat':
        return `${baseContext}
Combat situation: ${playerAction}
Describe the combat scene vividly, including environmental factors and enemy actions.`;

      case 'dialogue':
        return `${baseContext}
NPC interaction: ${playerAction}
Present a realistic dialogue response from the NPC, considering their personality and goals.`;

      case 'description':
        return `${baseContext}
Describe in detail: ${playerAction}
Provide a rich, atmospheric description of the location or object.`;

      default:
        return `${baseContext}\n${playerAction}`;
    }
  }

  private getTemperatureForType(type: 'narrative' | 'combat' | 'dialogue' | 'description'): number {
    const temperatures = {
      narrative: 0.8,
      combat: 0.6,
      dialogue: 0.7,
      description: 0.5
    };
    return temperatures[type] ?? 0.7;
  }

  private getMaxTokensForType(type: 'narrative' | 'combat' | 'dialogue' | 'description'): number {
    const tokens = {
      narrative: 300,
      combat: 250,
      dialogue: 150,
      description: 200
    };
    return tokens[type] ?? 200;
  }

  private updateConversationHistory(
    playerAction: string,
    aiResponse: string
  ) {
    // Keep conversation history manageable by limiting size
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = [
        this.conversationHistory[0], // Keep system prompt
        ...this.conversationHistory.slice(-4) // Keep last 4 exchanges
      ];
    }

    this.conversationHistory.push(
      { role: 'user', content: playerAction },
      { role: 'assistant', content: aiResponse }
    );
  }

  private getFallbackResponse(type: 'narrative' | 'combat' | 'dialogue' | 'description'): string {
    const fallbacks = {
      narrative: "The party continues their journey, staying alert for any signs of activity...",
      combat: "The battle continues with both sides exchanging blows...",
      dialogue: "The NPC considers your words carefully before responding...",
      description: "The area appears much as you'd expect for such a location..."
    };
    return fallbacks[type] ?? "The adventure continues...";
  }

  async generateEncounter(): Promise<string> {
    const prompt = `Create a challenging but fair combat encounter for:
    Party size: ${this.context.characters.length}
    Average party level: ${this.getAveragePartyLevel()}
    Current location: ${this.context.currentScene.location}
    
    Consider the party composition and provide a tactically interesting encounter.`;

    return this.generateResponse(prompt, 'combat');
  }

  async generateQuestHook(): Promise<string> {
    const prompt = `Create an intriguing quest hook that:
    1. Fits the campaign tone
    2. Connects to the main plot
    3. Provides interesting choices
    4. Suits the party's current situation
    
    Current location: ${this.context.currentScene.location}
    Active quests: ${Object.keys(this.context.questProgress)
      .filter(q => this.context.questProgress[q].status === 'active')
      .join(', ')}`;

    return this.generateResponse(prompt, 'narrative');
  }

  private getAveragePartyLevel(): number {
    // Implementation to calculate average party level
    return 1;
  }
}