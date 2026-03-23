export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorNameHints {
  dominantPigment?: 'red' | 'yellow' | 'blue';
  dominantRatio?: number;
}

/**
 * Returns a child-friendly Japanese color name for the mixed paint result.
 */
export function describeMixedColor(rgb: RgbColor, hints?: ColorNameHints): string {
  const { hue, saturation, lightness } = rgbToHsl(rgb);

  if (lightness >= 0.92 || (saturation <= 0.08 && lightness >= 0.84)) {
    return 'しろっぽい';
  }

  if (lightness <= 0.18) {
    return 'くろっぽい';
  }

  if (saturation <= 0.12) {
    return 'はいいろっぽい';
  }

  if (hue >= 300 && lightness >= 0.72) {
    return 'ももっぽい';
  }

  if (saturation >= 0.45 && hints?.dominantRatio !== undefined && hints.dominantRatio >= 0.75) {
    if (hints.dominantPigment === 'red') {
      return 'あかっぽい';
    }

    if (hints.dominantPigment === 'blue') {
      return 'あおっぽい';
    }
  }

  if (hue >= 18 && hue < 42) {
    return lightness < 0.46 ? 'ちゃいろっぽい' : 'だいだいいろっぽい';
  }

  if ((hue >= 0 && hue < 18) || hue >= 342) {
    return 'あかっぽい';
  }

  if (hue >= 42 && hue < 70) {
    return 'きいろっぽい';
  }

  if (hue >= 70 && hue < 105) {
    return 'きみどりっぽい';
  }

  if (hue >= 105 && hue < 165) {
    return 'みどりっぽい';
  }

  if (hue >= 165 && hue < 210) {
    return 'みずいろっぽい';
  }

  if (hue >= 210 && hue < 255) {
    return 'あおっぽい';
  }

  return 'むらさきっぽい';
}

function rgbToHsl({ r, g, b }: RgbColor) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness };
  }

  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  return { hue: hue * 60, saturation, lightness };
}
