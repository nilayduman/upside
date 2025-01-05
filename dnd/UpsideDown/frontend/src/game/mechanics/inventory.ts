import { DamageType } from './types';

export type ItemType = 'weapon' | 'armor' | 'potion' | 'scroll' | 'gear' | 'treasure';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  description: string;
  weight: number;
  value: number;
  quantity: number;
  isEquippable?: boolean;
  isConsumable?: boolean;
}

export interface Weapon extends Item {
  type: 'weapon';
  damage: {
    diceCount: number;
    diceType: number;
    bonus?: number;
    type: DamageType;
  };
  properties: string[];
  range?: {
    normal: number;
    maximum: number;
  };
}

export interface Armor extends Item {
  type: 'armor';
  armorClass: number;
  stealthDisadvantage?: boolean;
  strengthRequired?: number;
}

export class InventoryManager {
  private items: Map<string, Item> = new Map();
  private equippedItems: Set<string> = new Set();
  private weightLimit: number;

  constructor(weightLimit: number = 150) {
    this.weightLimit = weightLimit;
  }

  addItem(item: Item): boolean {
    const currentWeight = this.getCurrentWeight();
    if (currentWeight + item.weight > this.weightLimit) {
      return false;
    }

    const existingItem = this.items.get(item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.items.set(item.id, existingItem);
    } else {
      this.items.set(item.id, item);
    }
    return true;
  }

  removeItem(itemId: string, quantity: number = 1): boolean {
    const item = this.items.get(itemId);
    if (!item) return false;

    if (item.quantity <= quantity) {
      this.items.delete(itemId);
      this.equippedItems.delete(itemId);
    } else {
      item.quantity -= quantity;
      this.items.set(itemId, item);
    }
    return true;
  }

  equipItem(itemId: string): boolean {
    const item = this.items.get(itemId);
    if (!item?.isEquippable) return false;

    this.equippedItems.add(itemId);
    return true;
  }

  unequipItem(itemId: string): boolean {
    return this.equippedItems.delete(itemId);
  }

  private getCurrentWeight(): number {
    return Array.from(this.items.values())
      .reduce((total, item) => total + (item.weight * item.quantity), 0);
  }
} 