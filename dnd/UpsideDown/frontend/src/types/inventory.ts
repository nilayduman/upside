export interface Item {
     id: string;
     name: string;
     type: 'weapon' | 'armor' | 'potion' | 'scroll' | 'misc';
     description: string;
     quantity: number;
     weight: number;
     value: number;
     effects?: string[];
   }
   
   export interface InventoryState {
     items: Item[];
     gold: number;
     maxWeight: number;
   }