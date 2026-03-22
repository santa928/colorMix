import { describe, expect, it } from 'vitest';
import { initialMixState, mixReducer } from './mixReducer';

describe('mixReducer', () => {
  it('stores the selected color and amount', () => {
    const state = mixReducer(initialMixState, {
      type: 'selection/set',
      payload: { colorId: 'red', amount: 'normal' },
    });

    expect(state.selectedColorId).toBe('red');
    expect(state.selectedAmount).toBe('normal');
  });

  it('adds the selected color into the palette mix', () => {
    const selected = mixReducer(initialMixState, {
      type: 'selection/set',
      payload: { colorId: 'yellow', amount: 'extra' },
    });

    const mixed = mixReducer(selected, { type: 'mix/add' });

    expect(mixed.history).toHaveLength(1);
    expect(mixed.currentColor.label).toBe('きいろっぽい');
    expect(mixed.message).toBe('つぎの いろも いれてみよう');
  });

  it('shows a guide message when add is pressed without a selection', () => {
    const state = mixReducer(initialMixState, { type: 'mix/add' });

    expect(state.message).toBe('いろを えらんでね');
    expect(state.history).toHaveLength(0);
  });

  it('returns to the initial state on reset', () => {
    const selected = mixReducer(initialMixState, {
      type: 'selection/set',
      payload: { colorId: 'blue', amount: 'extra' },
    });
    const mixed = mixReducer(selected, { type: 'mix/add' });
    const reset = mixReducer(mixed, { type: 'mix/reset' });

    expect(reset).toEqual(initialMixState);
  });
});
