export type Spell = {
  id: string;
  name: string;
  level: number;
  school: string;

  concentration: boolean;
  ritual: boolean;

  verbal: boolean;
  somatic: boolean;
  material: boolean;

  materialDescription?: string;

  range: {
    type: string;
    distanceType: string;
    amount: number;
  };

  castingTime: {
    amount: number;
    type: string;
  }[];

  duration: {
    amount: number;
    type: string;
  }[];

  classes: string[];

  damageTypes: string[];

  savingThrows: string[];

  conditions: string[];
};
