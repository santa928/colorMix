/**
 * Paint-like palette entries shown to the child in the color box.
 */
export type BaseColorId =
  | 'red'
  | 'pink'
  | 'orange'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'sky'
  | 'blue'
  | 'purple'
  | 'brown'
  | 'white'
  | 'black';

export interface PigmentVector {
  red: number;
  yellow: number;
  blue: number;
  white: number;
  black: number;
}

export interface BaseColor {
  id: BaseColorId;
  label: string;
  swatch: string;
  pigment: PigmentVector;
}

export const baseColors = [
  {
    id: 'red',
    label: 'あか',
    swatch: '#f26363',
    pigment: { red: 1, yellow: 0, blue: 0, white: 0, black: 0 },
  },
  {
    id: 'pink',
    label: 'もも',
    swatch: '#f79cc4',
    pigment: { red: 0.78, yellow: 0, blue: 0.02, white: 0.74, black: 0 },
  },
  {
    id: 'orange',
    label: 'だいだい',
    swatch: '#f39b4e',
    pigment: { red: 0.62, yellow: 0.72, blue: 0, white: 0.08, black: 0 },
  },
  {
    id: 'yellow',
    label: 'きいろ',
    swatch: '#f5cf4f',
    pigment: { red: 0, yellow: 1, blue: 0, white: 0.02, black: 0 },
  },
  {
    id: 'lime',
    label: 'きみどり',
    swatch: '#a7d957',
    pigment: { red: 0, yellow: 0.86, blue: 0.2, white: 0.1, black: 0 },
  },
  {
    id: 'green',
    label: 'みどり',
    swatch: '#53b96d',
    pigment: { red: 0, yellow: 0.55, blue: 0.55, white: 0.04, black: 0 },
  },
  {
    id: 'sky',
    label: 'みずいろ',
    swatch: '#7dcff2',
    pigment: { red: 0, yellow: 0.03, blue: 0.55, white: 0.62, black: 0 },
  },
  {
    id: 'blue',
    label: 'あお',
    swatch: '#5f81f2',
    pigment: { red: 0, yellow: 0, blue: 1, white: 0, black: 0 },
  },
  {
    id: 'purple',
    label: 'むらさき',
    swatch: '#9b77df',
    pigment: { red: 0.5, yellow: 0, blue: 0.74, white: 0.2, black: 0 },
  },
  {
    id: 'brown',
    label: 'ちゃいろ',
    swatch: '#9a6b42',
    pigment: { red: 0.46, yellow: 0.62, blue: 0.24, white: 0, black: 0.32 },
  },
  {
    id: 'white',
    label: 'しろ',
    swatch: '#f7f4ee',
    pigment: { red: 0, yellow: 0, blue: 0, white: 1, black: 0 },
  },
  {
    id: 'black',
    label: 'くろ',
    swatch: '#3e3a38',
    pigment: { red: 0, yellow: 0, blue: 0, white: 0, black: 1 },
  },
] as const satisfies readonly BaseColor[];

export const baseColorsById: Record<BaseColorId, BaseColor> = {
  red: baseColors[0],
  pink: baseColors[1],
  orange: baseColors[2],
  yellow: baseColors[3],
  lime: baseColors[4],
  green: baseColors[5],
  sky: baseColors[6],
  blue: baseColors[7],
  purple: baseColors[8],
  brown: baseColors[9],
  white: baseColors[10],
  black: baseColors[11],
};
