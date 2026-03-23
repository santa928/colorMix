import type { BaseColor, PigmentVector } from '../data/baseColors';
import { describeMixedColor, type ColorNameHints, type RgbColor } from './colorNames';

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

  const rgb = pigmentsToRgb(mix.pigments);

  return {
    rgb,
    hex: rgbToHex(rgb),
    label: describeMixedColor(rgb, buildColorNameHints(mix.pigments)),
  };
}

/**
 * Approximates paint mixing by blending pigment totals on a simple RYB wheel.
 */
function pigmentsToRgb(pigments: PigmentVector): RgbColor {
  const chromaWeight = pigments.red + pigments.yellow + pigments.blue;
  const totalPigmentWeight =
    pigments.red + pigments.yellow + pigments.blue + pigments.white + pigments.black;

  if (totalPigmentWeight === 0) {
    return { r: 245, g: 239, b: 230 };
  }

  const whiteRatio = pigments.white / totalPigmentWeight;
  const chromaRatio = chromaWeight / totalPigmentWeight;
  const multiColorRatio =
    countActivePigments(pigments) > 2 && chromaWeight > 0
      ? Math.min(0.08, chromaRatio * 0.08)
      : 0;

  let base = { r: 0, g: 0, b: 0 };

  if (chromaWeight > 0) {
    const ryb = {
      red: pigments.red / chromaWeight,
      yellow: pigments.yellow / chromaWeight,
      blue: pigments.blue / chromaWeight,
    };

    base = rybToRgb(ryb);
  }

  return normalizeRgb({
    r: base.r * chromaRatio + 255 * whiteRatio + 8 * multiColorRatio,
    g: base.g * chromaRatio + 255 * whiteRatio + 6 * multiColorRatio,
    b: base.b * chromaRatio + 255 * whiteRatio + 4 * multiColorRatio,
  });
}

function countActivePigments(pigments: PigmentVector): number {
  return [pigments.red, pigments.yellow, pigments.blue].filter((value) => value > 0)
    .length;
}

function buildColorNameHints(pigments: PigmentVector): ColorNameHints {
  const chromaEntries = [
    ['red', pigments.red],
    ['yellow', pigments.yellow],
    ['blue', pigments.blue],
  ] as const;
  const chromaWeight = chromaEntries.reduce((sum, [, value]) => sum + value, 0);

  if (chromaWeight === 0) {
    return {};
  }

  const [dominantPigment, dominantWeight] = chromaEntries.reduce((current, candidate) =>
    candidate[1] > current[1] ? candidate : current,
  );

  return {
    dominantPigment,
    dominantRatio: dominantWeight / chromaWeight,
  };
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
