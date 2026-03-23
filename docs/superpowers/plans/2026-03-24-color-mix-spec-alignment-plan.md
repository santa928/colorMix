# Color Mix Spec Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 累積混色仕様を文書とテストで明確化し、少量追加で色名が飛びすぎる違和感を抑える。

**Architecture:** 混色ロジック自体は累積顔料ベースのまま維持し、色名判定に「優勢度」を追加して小さな追加量での急激な命名変化を抑える。あわせて spec と README に代表レシピ表を追加し、実装仕様と説明のズレを解消する。

**Tech Stack:** React, TypeScript, Vitest, Markdown docs

---

### Task 1: 代表レシピの期待挙動をテストで固定する

**Files:**
- Modify: `src/lib/colorMix.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('keeps a red-heavy mix red-like when a single blue pour is added', () => {
  let mix = createEmptyMix();
  for (let index = 0; index < 5; index += 1) {
    mix = addColorToMix(mix, baseColorsById.red, 'normal');
  }
  mix = addColorToMix(mix, baseColorsById.blue, 'normal');

  expect(resolveMixedColor(mix).label).toBe('あかっぽい');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose run --rm app npm run test -- src/lib/colorMix.test.ts`
Expected: FAIL if current naming still jumps to a less intuitive label

- [ ] **Step 3: Write minimal implementation**

`src/lib/colorNames.ts` に優勢度判定を追加し、支配的な色相が残っている場合は既存の基本色名を維持する。

- [ ] **Step 4: Run test to verify it passes**

Run: `docker compose run --rm app npm run test -- src/lib/colorMix.test.ts`
Expected: PASS

### Task 2: 累積仕様と代表レシピをドキュメントへ反映する

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-03-22-color-mix-design.md`

- [ ] **Step 1: Update docs**

累積顔料ベースであること、`ふつう=1` `たっぷり=2` の重み、代表レシピの見え方を文書化する。

- [ ] **Step 2: Review docs for wording consistency**

操作説明と仕様説明で「現在色の見た目」ではなく「累積顔料」であることが矛盾なく読めるか確認する。

### Task 3: フル検証を実行する

**Files:**
- Verify: `src/lib/colorMix.test.ts`
- Verify: `README.md`
- Verify: `docs/superpowers/specs/2026-03-22-color-mix-design.md`

- [ ] **Step 1: Run tests**

Run: `docker compose run --rm app npm run test`
Expected: PASS

- [ ] **Step 2: Run build**

Run: `docker compose run --rm app npm run build`
Expected: PASS
