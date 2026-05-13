import { Spell } from "../types/spell";

export const spells: Spell[] = [
  {
    id: "1",
    name: "Fireball",
    level: 3,
    school: "Evocation",

    concentration: false,
    ritual: false,

    verbal: true,
    somatic: true,
    material: true,

    materialDescription: "Bat guano and sulfur",

    range: {
      type: "Point",
      distanceType: "Feet",
      amount: 150,
    },

    castingTime: [
      {
        amount: 1,
        type: "Action",
      },
    ],

    duration: [
      {
        amount: 0,
        type: "Instant",
      },
    ],

    classes: ["Wizard", "Sorcerer"],

    damageTypes: ["Fire"],

    savingThrows: ["Dexterity"],

    conditions: [],
  },

  {
    id: "2",
    name: "Mage Armor",
    level: 1,
    school: "Abjuration",

    concentration: false,
    ritual: false,

    verbal: true,
    somatic: true,
    material: true,

    materialDescription: "A piece of cured leather",

    range: {
      type: "Touch",
      distanceType: "Self",
      amount: 0,
    },

    castingTime: [
      {
        amount: 1,
        type: "Action",
      },
    ],

    duration: [
      {
        amount: 8,
        type: "Hour",
      },
    ],

    classes: ["Wizard", "Sorcerer"],

    damageTypes: [],

    savingThrows: [],

    conditions: [],
  },

  {
    id: "3",
    name: "Hold Person",
    level: 2,
    school: "Enchantment",

    concentration: true,
    ritual: false,

    verbal: true,
    somatic: true,
    material: true,

    materialDescription: "Small iron piece",

    range: {
      type: "Point",
      distanceType: "Feet",
      amount: 60,
    },

    castingTime: [
      {
        amount: 1,
        type: "Action",
      },
    ],

    duration: [
      {
        amount: 1,
        type: "Minute",
      },
    ],

    classes: ["Wizard", "Cleric", "Bard"],

    damageTypes: [],

    savingThrows: ["Wisdom"],

    conditions: ["Paralyzed"],
  },
];
