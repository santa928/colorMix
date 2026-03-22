# Color Mix Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 3歳児向けの色混ぜ体験サイトを、Docker 内で開発できる Vite + React + TypeScript 構成で実装し、GitHub Pages へ公開可能な状態まで整える。

**Architecture:** 1ページの React アプリとして実装し、混色ロジックは純粋関数と reducer に切り出して UI から分離する。UI は中央パレットを主役にした構成とし、見た目の演出は CSS アニメーション主体で実現する。公開は Vite build で生成した静的ファイルを GitHub Pages に載せる。

**Tech Stack:** Vite, React, TypeScript, Vitest, Docker Compose, GitHub Pages

---

## ファイル責務マップ

- Create: `.dockerignore`
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/app.css`
- Create: `src/styles/reset.css`
- Create: `src/data/baseColors.ts`
- Create: `src/lib/colorMix.ts`
- Create: `src/lib/colorNames.ts`
- Create: `src/state/mixReducer.ts`
- Create: `src/lib/colorMix.test.ts`
- Create: `src/state/mixReducer.test.ts`
- Create: `README.md`
- Create: `.github/workflows/pages.yml`

### Task 1: Docker 前提のプロジェクト土台を作る

**Files:**
- Create: `.dockerignore`
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`

- [ ] **Step 1: Docker と Vite の骨組みを追加する**

`.dockerignore`

```txt
node_modules
dist
.git
```

`Dockerfile`

```Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

- [ ] **Step 2: Docker Compose でアプリサービスを定義する**

`docker-compose.yml`

```yaml
services:
  app:
    build: .
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "5173:5173"
```

- [ ] **Step 3: Vite + React + TypeScript の最小ファイルを作る**

`package.json`

```json
{
  "name": "color-mix",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run"
  }
}
```

- [ ] **Step 4: ビルド確認を行う**

Run: `docker compose run --rm app npm run build`
Expected: `vite build` が成功し、`dist/` が生成される

- [ ] **Step 5: コミットする**

```bash
git add .dockerignore Dockerfile docker-compose.yml package.json tsconfig.json tsconfig.node.json vite.config.ts index.html src/main.tsx
git commit -m "開発基盤を追加"
```

### Task 2: 絵の具っぽい混色ロジックを TDD で作る

**Files:**
- Create: `src/lib/colorMix.ts`
- Create: `src/lib/colorNames.ts`
- Create: `src/data/baseColors.ts`
- Test: `src/lib/colorMix.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/colorMix.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { mixPaintColors } from './colorMix';

describe('mixPaintColors', () => {
  it('returns a purple-leaning color when red and blue are mixed equally', () => {
    const result = mixPaintColors(
      { r: 230, g: 70, b: 70, weight: 1 },
      { r: 70, g: 110, b: 220, weight: 1 },
    );

    expect(result.r).toBeLessThan(190);
    expect(result.b).toBeGreaterThan(result.g);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose run --rm app npm run test -- src/lib/colorMix.test.ts`
Expected: FAIL with `Cannot find module './colorMix'` or equivalent missing implementation error

- [ ] **Step 3: Write minimal implementation**

`src/lib/colorMix.ts`

```ts
export function mixPaintColors(a, b) {
  return {
    r: Math.round((a.r * a.weight + b.r * b.weight) / (a.weight + b.weight)),
    g: Math.round((a.g * a.weight + b.g * b.weight) / (a.weight + b.weight)),
    b: Math.round((a.b * a.weight + b.b * b.weight) / (a.weight + b.weight)),
  };
}
```

- [ ] **Step 4: Run test to verify it passes, then add the next failing test**

Run: `docker compose run --rm app npm run test -- src/lib/colorMix.test.ts`
Expected: 最初のテストだけ PASS

Next failing cases to add:
- `たっぷり` が `ふつう` より結果色へ強く効く
- 3色目追加でも現在色を継続して計算できる
- 結果色名が `むらさきっぽい` などの近い呼び名に変換される

- [ ] **Step 5: Refactor and commit**

```bash
git add src/data/baseColors.ts src/lib/colorMix.ts src/lib/colorNames.ts src/lib/colorMix.test.ts
git commit -m "混色ロジックを追加"
```

### Task 3: reducer で混色状態管理を作る

**Files:**
- Create: `src/state/mixReducer.ts`
- Test: `src/state/mixReducer.test.ts`

- [ ] **Step 1: Write the failing test**

`src/state/mixReducer.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { initialMixState, mixReducer } from './mixReducer';

describe('mixReducer', () => {
  it('stores the selected color and quantity', () => {
    const state = mixReducer(initialMixState, {
      type: 'selection/set',
      payload: { colorId: 'red', amount: 'normal' },
    });

    expect(state.selectedColorId).toBe('red');
    expect(state.selectedAmount).toBe('normal');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose run --rm app npm run test -- src/state/mixReducer.test.ts`
Expected: FAIL with missing reducer export

- [ ] **Step 3: Write minimal implementation**

`src/state/mixReducer.ts`

```ts
export const initialMixState = {
  selectedColorId: null,
  selectedAmount: 'normal',
  currentColor: null,
  history: [],
  message: 'いろを えらんでね',
};
```

- [ ] **Step 4: Run test to verify it passes, then add the next failing tests**

Run: `docker compose run --rm app npm run test -- src/state/mixReducer.test.ts`
Expected: PASS

Next failing cases to add:
- `mix/add` で currentColor と history が更新される
- 未選択で `mix/add` を呼ぶとガイド文言が出る
- `mix/reset` で初期状態へ戻る

- [ ] **Step 5: Commit**

```bash
git add src/state/mixReducer.ts src/state/mixReducer.test.ts
git commit -m "混色状態管理を追加"
```

### Task 4: 子ども向け UI を実装する

**Files:**
- Modify: `src/App.tsx`
- Create: `src/styles/reset.css`
- Create: `src/styles/app.css`

- [ ] **Step 1: `App.tsx` に UI 構造を追加する**

最低限の要素:
- タイトル
- 中央パレット
- 色ボタン列
- `ふつう / たっぷり` トグル
- `いれる`
- `さいしょから`
- 現在色表示
- 履歴表示

- [ ] **Step 2: 状態を reducer に接続する**

`useReducer` で `mixReducer` を接続し、色選択・量切替・投入・リセットを結線する

- [ ] **Step 3: CSS で世界観を実装する**

`src/styles/app.css` に以下を入れる:
- 温かい背景
- ぷっくりした色ボタン
- 大きな丸いパレット
- しずくや広がりのアニメーション
- スマホ縦を基準にしたレスポンシブ

- [ ] **Step 4: Run build to verify the UI compiles**

Run: `docker compose run --rm app npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/styles/reset.css src/styles/app.css
git commit -m "色混ぜUIを実装"
```

### Task 5: GitHub Pages 用の公開設定と説明を追加する

**Files:**
- Modify: `vite.config.ts`
- Create: `.github/workflows/pages.yml`
- Create: `README.md`

- [ ] **Step 1: GitHub Pages 用の base path を解決する**

`vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.VITE_BASE_PATH ?? (repoName ? `/${repoName}/` : '/');

export default defineConfig({
  base,
  plugins: [react()],
});
```

- [ ] **Step 2: Pages workflow を追加する**

Actions で `npm ci` → `npm run build` → Pages へ deploy する workflow を追加する

- [ ] **Step 3: README に起動・テスト・公開方法を書く**

含める内容:
- Docker 前提のローカル開発手順
- テストコマンド
- GitHub Pages 公開時の注意

- [ ] **Step 4: Verify build for Pages**

Run: `docker compose run --rm -e VITE_BASE_PATH=/colorMix/ app npm run build`
Expected: PASS and generated asset paths start with `/colorMix/`

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts .github/workflows/pages.yml README.md
git commit -m "GitHub Pages公開設定を追加"
```

### Task 6: 2 viewport で最終確認する

**Files:**
- No code changes required unless issues are found

- [ ] **Step 1: プレビューを起動する**

Run: `docker compose run --rm --service-ports app npm run dev -- --host 0.0.0.0`
Expected: local preview available

- [ ] **Step 2: 390x844 で確認する**

確認項目:
- パレットが主役で見える
- 色ボタンが押しやすい
- `いれる` と `さいしょから` が重ならない

- [ ] **Step 3: 768x1024 で確認する**

確認項目:
- パレットと操作系のアンカー関係が保たれている
- 余白が十分で窮屈に見えない

- [ ] **Step 4: 必要なら微修正して再 build する**

Run: `docker compose run --rm app npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "最終調整を反映"
```

