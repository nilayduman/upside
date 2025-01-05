export interface Character {
  id: string;
  name: string;
  race: Race;
  class: CharacterClass;
  background: string;
  level: number;
  stats: CharacterStats;
  savingThrowProficiencies: string[];
  skills: CharacterSkill[];
  proficiencyBonus: number;
  spellcasting?: boolean;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  armorClass: number;
  initiative: number;
  speed: number;
  equipment: Equipment[];
  spellcastingAbility?: AbilityName;
  spellSaveDC?: number;
  spellAttackBonus?: number;
  spellSlots?: { [key: number]: { total: number; used: number } };
  spells?: Spell[];
  hitDice: HitDice;
  deathSaves: { successes: boolean[]; failures: boolean[] };
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export type Race = 'Human' | 'Elf' | 'Dwarf' | 'Halfling' | 'Dragonborn' | 'Tiefling';
export type CharacterClass = 'Fighter' | 'Wizard' | 'Rogue' | 'Cleric' | 'Ranger' | 'Paladin';

export type AbilityName = keyof CharacterStats;

export interface CharacterSkill {
  name: string;
  ability: AbilityName;
  isProficient: boolean;
  isExpertise: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'gear';
  equipped: boolean;
  quantity: number;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  prepared: boolean;
}

export interface HitDice {
  dieType: number;  // e.g., 6, 8, 10, 12
  total: number;
  used: number;
} 