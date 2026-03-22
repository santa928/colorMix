import type { BaseColor, PigmentVector } from '../data/baseColors';
import { describeMixedColor, type RgbColor } from './colorNames';

export type AmountMode = 'normal' | 'extra';

export interface MixEntry {
  colorId: BaseColor['id'];
  amount: AmountMode;
}

export interface PigmentMix {
  pigments: PigmentVector;
  totalWeight: number;
  entries: MixEntry[];
}

export interface ResolvedMixedColor {
  rgb: RgbColor;
  hex: string;
  label: string;
}

const AMOUNT_WEIGHT: Record<AmountMode, number> = {
  normal: 1,
  extra: 2,
};

/**
 * Creates an empty paint state before any colors have been added.
 */
export function createEmptyMix(): PigmentMix {
  return {
    pigments: { red: 0, yellow: 0, blue: 0, white: 0, black: 0 },
    totalWeight: 0,
    entries: [],
  };
}

/**
 * Returns a new pigment mix with one extra color pour applied.
 */
export function addColorToMix(
  mix: PigmentMix,
  color: BaseColor,
  amount: AmountMode,
): PigmentMix {
  const weight = AMOUNT_WEIGHT[amount];

  return {
    pigments: {
      red: mix.pigments.red + color.pigment.red * weight,
      yellow: mix.pigments.yellow + color.pigment.yellow * weight,
      blue: mix.pigments.blue + color.pigment.blue * weight,
      white: mix.pigments.white + color.pigment.white * weight,
      black: mix.pigments.black + color.pigment.black * weight,
    },
    totalWeight: mix.totalWeight + weight,
    entries: [...mix.entries, { colorId: color.id, amount }],
  };
}

/**
 * Resolves pigment state into a display color and human-friendly label.
 */
export function resolveMixedColor(mix: PigmentMix): ResolvedMixedColor {
  if (mix.totalWeight === 0) {
    const rgb = { r: 255, g: 249, b: 240 };

    return {
      rgb,
      hex: rgbToHex(rgb),
      label: 'まだ まぜていないよ',
    };
  }

  const rgb = pigmentsToRgb(mix.pigments, mix.totalWeight);

  return {
    rgb,
    hex: rgbToHex(rgb),
    label: describeMixedColor(rgb),
  };
}

/**
 * Approximates paint mixing by blending pigment totals on a simple RYB wheel.
 */
function pigmentsToRgb(pigments: PigmentVector, totalWeight: number): RgbColor {
  const chromaWeight = pigments.red + pigments.yellow + pigments.blue;
  const whiteRatio = pigments.white / totalWeight;
  const blackRatio = pigments.black / totalWeight;
  const multiColorRatio =
    countActivePigments(pigments) > 2 ? Math.min(0.18, (chromaWeight / totalWeight) * 0.18) : 0;

  let base = { r: 245, g: 239, b: 230 };

  if (chromaWeight > 0) {
    const ryb = {
      red: pigments.red / chromaWeight,
      yellow: pigments.yellow / chromaWeight,
      blue: pigments.blue / chromaWeight,
    };

    base = rybToRgb(ryb);
  }

  return normalizeRgb({
    r: base.r * (1 - blackRatio * 0.72) + 255 * whiteRatio * 0.72 + 12 * multiColorRatio,
    g: base.g * (1 - blackRatio * 0.72) + 250 * whiteRatio * 0.72 + 10 * multiColorRatio,
    b: base.b * (1 - blackRatio * 0.72) + 245 * whiteRatio * 0.72 + 8 * multiColorRatio,
  });
}

function countActivePigments(pigments: PigmentVector): number {
  return [pigments.red, pigments.yellow, pigments.blue].filter((value) => value > 0)
    .length;
}

function normalizeRgb(rgb: { r: number; g: number; b: number }): RgbColor {
  return {
    r: clampChannel(rgb.r),
    g: clampChannel(rgb.g),
    b: clampChannel(rgb.b),
  };
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function rgbToHex({ r, g, b }: RgbColor): string {
  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

function rybToRgb(ryb: { red: number; yellow: number; blue: number }): RgbColor {
  let red = ryb.red;
  let yellow = ryb.yellow;
  let blue = ryb.blue;

  const white = Math.min(red, yellow, blue);
  red -= white;
  yellow -= white;
  blue -= white;

  const maxYellow = Math.max(red, yellow, blue);
  let green = Math.min(yellow, blue);
  yellow -= green;
  blue -= green;

  if (blue > 0 && green > 0) {
    blue *= 2;
    green *= 2;
  }

  red += yellow;
  green += yellow;

  const maxGreen = Math.max(red, green, blue);

  if (maxGreen > 0) {
    const scale = maxYellow / maxGreen;
    red *= scale;
    green *= scale;
    blue *= scale;
  }

  red += white;
  green += white;
  blue += white;

  return {
    r: clampChannel(red * 255),
    g: clampChannel(green * 255),
    b: clampChannel(blue * 255),
  };
}
