export type Ability = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export type DamageType = 'slashing' | 'piercing' | 'bludgeoning' | 'fire' | 'cold' | 
                 'lightning' | 'acid' | 'poison' | 'necrotic' | 'radiant' | 'force';

export interface Skill {
  id: string;
  name: string;
  ability: string;
  description: string;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  description: string;
} 