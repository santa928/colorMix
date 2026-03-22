# colorMix

3歳児向けの色混ぜシミュレーションサイトです。  
中央のパレットに色を `ふつう / たっぷり` で足しながら、12色の基本色を使って2色以上の混色を楽しく試せます。  
静的サイトとして build し、GitHub Pages へ公開できます。

## 技術構成

- Vite
- React
- TypeScript
- Vitest
- Docker Compose

## ローカル開発

依存導入や実行はホストを汚さないため Docker 内で行います。

### 1. 依存を取得する

```bash
docker compose build app
docker compose run --rm app npm install
```

### 2. 開発サーバーを起動する

```bash
docker compose run --rm --service-ports app npm run dev -- --host 0.0.0.0
```

ブラウザで `http://localhost:5173` を開きます。

### 3. テストを実行する

```bash
docker compose run --rm app npm run test
```

### 4. 本番 build を確認する

```bash
docker compose run --rm app npm run build
```

## GitHub Pages 公開

`.github/workflows/pages.yml` を用意してあるので、`main` ブランチへ push すると GitHub Actions から `dist/` を Pages へ deploy できます。

### 公開前の確認

1. GitHub の repository settings で Pages の build source を `GitHub Actions` にする
2. `main` へ push する
3. Actions の `Deploy to GitHub Pages` が成功することを確認する

`vite.config.ts` は `GITHUB_REPOSITORY` から repository 名を読んで `base` を自動設定します。ローカルで Pages 用 build を試すときは次を使います。

```bash
docker compose run --rm -e VITE_BASE_PATH=/colorMix/ app npm run build
```

`colorMix` の部分は repository 名に合わせて変更してください。

## 主なファイル

- `src/App.tsx`: 画面本体
- `src/data/baseColors.ts`: 基本色定義
- `src/lib/colorMix.ts`: 絵の具寄りの混色ロジック
- `src/lib/colorNames.ts`: 結果色のやさしい呼び名
- `src/state/mixReducer.ts`: UI 状態管理
