import { Ability, DamageType } from './types';
import { Weapon } from './inventory';

export interface AttackRoll {
  natural: number;
  total: number;
  advantage: boolean;
  disadvantage: boolean;
  critical: boolean;
  modifiers: number;
}

export interface DamageRoll {
  diceRolls: number[];
  total: number;
  type: DamageType;
  modifiers: number;
}

export class CombatManager {
  static rollD20(advantage: boolean = false, disadvantage: boolean = false): number {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    if (!advantage && !disadvantage) return roll1;

    const roll2 = Math.floor(Math.random() * 20) + 1;
    return advantage ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
  }

  static rollDamage(diceCount: number, diceType: number, modifier: number = 0): number[] {
    const rolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * diceType) + 1);
    }
    return rolls;
  }

  static makeAttack(
    attacker: {
      proficiencyBonus: number;
      abilityModifiers: Record<Ability, number>;
    },
    target: {
      armorClass: number;
    },
    weapon: Weapon,
    advantage: boolean = false,
    disadvantage: boolean = false
  ): { attackRoll: AttackRoll; damageRoll?: DamageRoll } {
    // Calculate attack modifiers
    const abilityMod = attacker.abilityModifiers[
      weapon.properties.includes('finesse') ? 'dexterity' : 'strength'
    ];
    const attackModifier = abilityMod + attacker.proficiencyBonus;

    // Make attack roll
    const naturalRoll = this.rollD20(advantage, disadvantage);
    const totalRoll = naturalRoll + attackModifier;
    const isCritical = naturalRoll === 20;
    const isCriticalFail = naturalRoll === 1;

    const attackRoll: AttackRoll = {
      natural: naturalRoll,
      total: totalRoll,
      advantage,
      disadvantage,
      critical: isCritical,
      modifiers: attackModifier
    };

    // Check if attack hits
    if (isCriticalFail || (!isCritical && totalRoll < target.armorClass)) {
      return { attackRoll };
    }

    // Calculate damage
    const { diceCount, diceType, bonus = 0 } = weapon.damage;
    const rolls = this.rollDamage(
      isCritical ? diceCount * 2 : diceCount,
      diceType
    );

    const damageRoll: DamageRoll = {
      diceRolls: rolls,
      total: rolls.reduce((sum, roll) => sum + roll, 0) + bonus + abilityMod,
      type: weapon.damage.type,
      modifiers: bonus + abilityMod
    };

    return { attackRoll, damageRoll };
  }
}