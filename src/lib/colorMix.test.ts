import { describe, expect, it } from 'vitest';
import { baseColors, baseColorsById } from '../data/baseColors';
import { addColorToMix, createEmptyMix, resolveMixedColor } from './colorMix';

describe('resolveMixedColor', () => {
  it('exposes the standard 12-color palette', () => {
    expect(baseColors).toHaveLength(12);
    expect(baseColors.map((color) => color.label)).toEqual([
      'あか',
      'もも',
      'だいだい',
      'きいろ',
      'きみどり',
      'みどり',
      'みずいろ',
      'あお',
      'むらさき',
      'ちゃいろ',
      'しろ',
      'くろ',
    ]);
  });

  it('shows a purple-like result when red and blue are mixed evenly', () => {
    let mix = createEmptyMix();
    mix = addColorToMix(mix, baseColorsById.red, 'normal');
    mix = addColorToMix(mix, baseColorsById.blue, 'normal');

    const result = resolveMixedColor(mix);

    expect(result.rgb.r).toBeGreaterThan(result.rgb.g);
    expect(result.rgb.b).toBeGreaterThan(result.rgb.g);
    expect(result.label).toBe('むらさきっぽい');
  });

  it('leans greener when yellow and blue are mixed evenly', () => {
    let mix = createEmptyMix();
    mix = addColorToMix(mix, baseColorsById.yellow, 'normal');
    mix = addColorToMix(mix, baseColorsById.blue, 'normal');

    const result = resolveMixedColor(mix);

    expect(result.rgb.g).toBeGreaterThan(result.rgb.r);
    expect(result.rgb.g).toBeGreaterThan(result.rgb.b);
    expect(result.label).toBe('みどりっぽい');
  });

  it('lets the extra amount pull the result more strongly', () => {
    let evenMix = createEmptyMix();
    evenMix = addColorToMix(evenMix, baseColorsById.red, 'normal');
    evenMix = addColorToMix(evenMix, baseColorsById.blue, 'normal');

    let extraBlueMix = createEmptyMix();
    extraBlueMix = addColorToMix(extraBlueMix, baseColorsById.red, 'normal');
    extraBlueMix = addColorToMix(extraBlueMix, baseColorsById.blue, 'extra');

    const evenResult = resolveMixedColor(evenMix);
    const extraBlueResult = resolveMixedColor(extraBlueMix);

    expect(extraBlueResult.rgb.b).toBeGreaterThan(evenResult.rgb.b);
    expect(extraBlueResult.rgb.r).toBeLessThan(evenResult.rgb.r);
  });

  it('returns the matching soft color name for a single pink pour', () => {
    let mix = createEmptyMix();
    mix = addColorToMix(mix, baseColorsById.pink, 'normal');

    expect(resolveMixedColor(mix).label).toBe('ももっぽい');
  });
});
