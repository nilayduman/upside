import { openai } from '../config/openai';

export class DungeonMaster {
  private context: string;
  private character: any;

  constructor(character: any) {
    this.character = character;
    this.context = this.buildInitialContext();
  }

  private buildInitialContext(): string {
    return `You are a Dungeon Master in a D&D game. 
    The player's character is a level ${this.character.level} ${this.character.race} ${this.character.class} named ${this.character.name}.
    Respond in character as a DM, be creative and engaging, and maintain game mechanics accuracy.`;
  }

  async getResponse(userInput: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.context },
          { role: "user", content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content || "The DM ponders...";
    } catch (error) {
      console.error('DM Error:', error);
      return "The DM encounters a magical disturbance. Please try again.";
    }
  }
}