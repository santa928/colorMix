import { describe, expect, it } from 'vitest';
import { baseColors, baseColorsById } from '../data/baseColors';
import { describeMixedColor } from './colorNames';
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

  it('keeps a red-heavy mix red-like when only one blue pour is added', () => {
    let mix = createEmptyMix();
    mix = addColorToMix(mix, baseColorsById.red, 'extra');
    mix = addColorToMix(mix, baseColorsById.red, 'normal');
    mix = addColorToMix(mix, baseColorsById.blue, 'normal');

    expect(resolveMixedColor(mix).label).toBe('あかっぽい');
  });

  it('keeps a blue-heavy mix blue-like when only one red pour is added', () => {
    let mix = createEmptyMix();
    mix = addColorToMix(mix, baseColorsById.blue, 'extra');
    mix = addColorToMix(mix, baseColorsById.blue, 'normal');
    mix = addColorToMix(mix, baseColorsById.red, 'normal');

    expect(resolveMixedColor(mix).label).toBe('あおっぽい');
  });

  it('returns the matching soft color name for a single pink pour', () => {
    let mix = createEmptyMix();
    mix = addColorToMix(mix, baseColorsById.pink, 'normal');

    expect(resolveMixedColor(mix).label).toBe('ももっぽい');
  });

  it('describes neutral mid gray as gray-like instead of a warm color', () => {
    expect(describeMixedColor({ r: 181, g: 180, b: 177 })).toBe('はいいろっぽい');
  });

  it('keeps an even black and white mix in a gray middle band', () => {
    let mix = createEmptyMix();
    mix = addColorToMix(mix, baseColorsById.black, 'normal');
    mix = addColorToMix(mix, baseColorsById.white, 'normal');

    const result = resolveMixedColor(mix);
    const channels = Object.values(result.rgb);

    expect(Math.max(...channels) - Math.min(...channels)).toBeLessThanOrEqual(8);
    expect(result.label).toBe('はいいろっぽい');
    expect(result.rgb.r).toBeGreaterThanOrEqual(96);
    expect(result.rgb.r).toBeLessThanOrEqual(192);
  });

  it('does not call black and white only mixes orange-like or brown-like', () => {
    const recipes: Array<Array<'black' | 'white'>> = [
      ['black', 'white', 'white'],
      ['black', 'black', 'white'],
      ['black', 'black', 'black', 'white'],
      ['black', 'white', 'white', 'white'],
    ];

    for (const recipe of recipes) {
      let mix = createEmptyMix();
      for (const colorId of recipe) {
        mix = addColorToMix(mix, baseColorsById[colorId], 'normal');
      }

      const result = resolveMixedColor(mix);
      const channels = Object.values(result.rgb);

      expect(Math.max(...channels) - Math.min(...channels)).toBeLessThanOrEqual(8);
      expect(['しろっぽい', 'はいいろっぽい', 'くろっぽい']).toContain(result.label);
    }
  });
});
