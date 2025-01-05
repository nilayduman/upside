export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export const rollDice = (diceType: DiceType, numberOfDice: number = 1): number[] => {
  const maxValue = parseInt(diceType.substring(1));
  return Array(numberOfDice)
    .fill(0)
    .map(() => Math.floor(Math.random() * maxValue) + 1);
};

export const calculateTotal = (rolls: number[]): number => {
  return rolls.reduce((sum, roll) => sum + roll, 0);
};