import { useReducer, type CSSProperties } from 'react';
import { baseColors, baseColorsById } from './data/baseColors';
import { initialMixState, mixReducer } from './state/mixReducer';

const amountOptions = [
  { id: 'normal', label: 'ふつう', bubble: 'ぽとん' },
  { id: 'extra', label: 'たっぷり', bubble: 'どさっ' },
] as const;

/**
 * Main playful paint-mixing screen for the GitHub Pages app.
 */
export default function App() {
  const [state, dispatch] = useReducer(mixReducer, initialMixState);

  return (
    <main className="app-shell">
      <section className="mix-board">
        <header className="mix-board__header">
          <div>
            <p className="mix-board__eyebrow">いろあそび パレット</p>
            <h1>いろを まぜよう</h1>
            <p className="mix-board__guide">{state.message}</p>
          </div>
          <button
            className="action-button action-button--ghost"
            type="button"
            onClick={() => dispatch({ type: 'mix/reset' })}
          >
            さいしょから
          </button>
        </header>

        <div className="mix-board__layout">
          <section className="palette-panel" aria-label="まぜる ばしょ">
            <div className="palette-panel__stage">
              <div className="palette-panel__splash palette-panel__splash--one" />
              <div className="palette-panel__splash palette-panel__splash--two" />
              <div className="palette-panel__well">
                <div
                  key={state.history.length}
                  className="palette-panel__paint"
                  style={
                    {
                      '--mix-color': state.currentColor.hex,
                    } as CSSProperties
                  }
                />
                <div className="palette-panel__shine" />
                <div className="palette-panel__label">
                  <span>いまの いろ</span>
                </div>
              </div>
            </div>

            <div className="result-chip">
              <span
                className="result-chip__swatch"
                style={{ backgroundColor: state.currentColor.hex }}
                aria-hidden="true"
              />
              <div>
                <p>できた いろ</p>
                <strong>{state.currentColor.label}</strong>
              </div>
            </div>
          </section>

          <section className="control-panel" aria-label="いろを えらぶ">
            <div className="control-card">
              <h2>1. いろを えらぶ</h2>
              <div className="color-grid">
                {baseColors.map((color) => (
                  <button
                    key={color.id}
                    className={`color-tile${state.selectedColorId === color.id ? ' color-tile--selected' : ''}`}
                    type="button"
                    aria-pressed={state.selectedColorId === color.id}
                    onClick={() =>
                      dispatch({
                        type: 'selection/color',
                        payload: { colorId: color.id },
                      })
                    }
                  >
                    <span
                      className={`color-tile__paint${color.id === 'white' ? ' color-tile__paint--light' : ''}${color.id === 'black' ? ' color-tile__paint--dark' : ''}`}
                      style={{ backgroundColor: color.swatch }}
                      aria-hidden="true"
                    />
                    <span className="color-tile__label">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="control-card">
              <h2>2. りょうを えらぶ</h2>
              <div className="amount-grid">
                {amountOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`amount-pill${state.selectedAmount === option.id ? ' amount-pill--selected' : ''}`}
                    type="button"
                    aria-pressed={state.selectedAmount === option.id}
                    onClick={() =>
                      dispatch({
                        type: 'selection/amount',
                        payload: { amount: option.id },
                      })
                    }
                  >
                    <span>{option.label}</span>
                    <small>{option.bubble}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="control-card control-card--cta">
              <button
                className={`action-button${state.selectedColorId ? '' : ' action-button--pulse'}`}
                type="button"
                onClick={() => dispatch({ type: 'mix/add' })}
              >
                いれる
              </button>

              <p className="control-card__hint">
                {state.selectedColorId
                  ? `${baseColorsById[state.selectedColorId].label} を ${state.selectedAmount === 'extra' ? 'たっぷり' : 'ふつう'} いれる`
                  : 'えらんだ いろが ここから はいるよ'}
              </p>
            </div>

            <div className="control-card">
              <h2>いれた いろ</h2>
              <div className="history-list" aria-live="polite">
                {state.history.length === 0 ? (
                  <p className="history-list__empty">まだ なにも いれていないよ</p>
                ) : (
                  state.history.map((entry, index) => (
                    <div className="history-item" key={`${entry.colorId}-${entry.amount}-${index}`}>
                      <span
                        className="history-item__dot"
                        style={{ backgroundColor: baseColorsById[entry.colorId].swatch }}
                        aria-hidden="true"
                      />
                      <span>{baseColorsById[entry.colorId].label}</span>
                      <small>{entry.amount === 'extra' ? 'たっぷり' : 'ふつう'}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
