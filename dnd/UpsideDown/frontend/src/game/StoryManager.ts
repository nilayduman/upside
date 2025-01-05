import { GameState } from './GameState';

interface StoryNode {
     id: string;
     type: 'scene' | 'choice' | 'combat';
     content: string;
     choices?: {
       text: string;
       nextId: string;
       condition?: (state: GameState) => boolean;
     }[];
     consequences?: {
       type: 'item' | 'quest' | 'reputation';
       value: any;
     }[];
   }
   
   interface QuestState {
     id: string;
     title: string;
     description: string;
     status: 'active' | 'completed' | 'failed';
     objectives: {
       id: string;
       description: string;
       completed: boolean;
     }[];
   }
   
   export class StoryManager {
     private static instance: StoryManager;
     private currentNode: StoryNode | null = null;
     private quests: Map<string, QuestState> = new Map();
     private listeners: Set<(node: StoryNode) => void> = new Set();
   
     static getInstance() {
       if (!StoryManager.instance) {
         StoryManager.instance = new StoryManager();
       }
       return StoryManager.instance;
     }
   
     startStory(initialNode: StoryNode) {
       this.currentNode = initialNode;
       this.notifyListeners();
     }
   
     makeChoice(choiceIndex: number) {
       if (!this.currentNode?.choices?.[choiceIndex]) return;
   
       const choice = this.currentNode.choices[choiceIndex];
       // Process consequences
       this.currentNode.consequences?.forEach(consequence => {
         switch (consequence.type) {
           case 'quest':
             this.addQuest(consequence.value);
             break;
           case 'reputation':
             // Handle reputation changes
             break;
           // Add more consequence types as needed
         }
       });
   
       // Move to next node
       // This would typically load the next node from a story database
       this.notifyListeners();
     }
   
     addQuest(quest: QuestState) {
       this.quests.set(quest.id, quest);
     }
   
     updateQuestObjective(questId: string, objectiveId: string, completed: boolean) {
       const quest = this.quests.get(questId);
       if (!quest) return;
   
       const objective = quest.objectives.find(o => o.id === objectiveId);
       if (!objective) return;
   
       objective.completed = completed;
   
       // Check if all objectives are completed
       if (quest.objectives.every(o => o.completed)) {
         quest.status = 'completed';
       }
   
       this.notifyListeners();
     }
   
     subscribe(listener: (node: StoryNode) => void) {
       this.listeners.add(listener);
       return () => this.listeners.delete(listener);
     }
   
     private notifyListeners() {
       if (!this.currentNode) return;
       this.listeners.forEach(listener => listener(this.currentNode!));
     }
   }