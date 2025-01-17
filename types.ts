export interface Fish {
  id: number;
  name: string;
  value: number;
  image: string;
  requiredDice: number[];
}

export interface Rod {
  id: number;
  name: string;
  price: number;
  image: string;
  catchableFish: number[];
}

export interface Bait {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface Player {
  id: string;
  name: string;
  money: number;
  rods: Rod[];
  bait: Bait[];
  caughtFish: Fish[];
}

