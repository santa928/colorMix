import { baseColorsById, type BaseColorId } from '../data/baseColors';
import {
  addColorToMix,
  createEmptyMix,
  resolveMixedColor,
  type AmountMode,
  type MixEntry,
  type PigmentMix,
  type ResolvedMixedColor,
} from '../lib/colorMix';

export interface MixState {
  selectedColorId: BaseColorId | null;
  selectedAmount: AmountMode;
  mix: PigmentMix;
  currentColor: ResolvedMixedColor;
  history: MixEntry[];
  message: string;
}

export type MixAction =
  | {
      type: 'selection/set';
      payload: { colorId: BaseColorId; amount: AmountMode };
    }
  | {
      type: 'selection/color';
      payload: { colorId: BaseColorId };
    }
  | {
      type: 'selection/amount';
      payload: { amount: AmountMode };
    }
  | { type: 'mix/add' }
  | { type: 'mix/reset' };

/**
 * The single source of truth for the playful paint-mixing screen.
 */
export const initialMixState: MixState = {
  selectedColorId: null,
  selectedAmount: 'normal',
  mix: createEmptyMix(),
  currentColor: resolveMixedColor(createEmptyMix()),
  history: [],
  message: 'いろを えらんでね',
};

/**
 * Handles palette selection, pouring, and reset transitions for the app.
 */
export function mixReducer(state: MixState, action: MixAction): MixState {
  switch (action.type) {
    case 'selection/set':
      return {
        ...state,
        selectedColorId: action.payload.colorId,
        selectedAmount: action.payload.amount,
        message: 'いれる を おしてね',
      };

    case 'selection/color':
      return {
        ...state,
        selectedColorId: action.payload.colorId,
        message: 'りょうを きめてね',
      };

    case 'selection/amount':
      return {
        ...state,
        selectedAmount: action.payload.amount,
        message: state.selectedColorId ? 'いれる を おしてね' : 'いろを えらんでね',
      };

    case 'mix/add': {
      if (!state.selectedColorId) {
        return {
          ...state,
          message: 'いろを えらんでね',
        };
      }

      const nextMix = addColorToMix(
        state.mix,
        baseColorsById[state.selectedColorId],
        state.selectedAmount,
      );

      return {
        ...state,
        mix: nextMix,
        currentColor: resolveMixedColor(nextMix),
        history: nextMix.entries,
        message: 'つぎの いろも いれてみよう',
      };
    }

    case 'mix/reset':
      return initialMixState;

    default:
      return state;
  }
}
