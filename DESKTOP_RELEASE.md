# Electrobun デスクトップ版を手動リリースする

`.github/workflows/release-desktop.yml` を GitHub Actions から手動実行し、Linux / Windows / macOS のビルドを GitHub Release に添付する手順です。日常の検証用には `.github/workflows/canary-desktop.yml` が `main` push / 手動実行で Canary ビルドを作ります。

## Canary ビルド

- ワークフロー: **Canary Desktop Build (Electrobun)**
- `main` への push では実行せず、**GitHub Actions からの手動実行のみ**
- 入力 `version` は任意。空なら `1.0.0-canary.<GitHub run number>` を使う
- ビルドは `bunx electrobun build --env=canary`
- 成果物は Actions の `canary-linux` / `canary-windows` / `canary-macos` アーティファクトに7日間保存する
- すべて成功すると `v<version>` の GitHub **Pre-Release** を作成し、配布物を添付する。既存タグならアセットを上書きする
- `baseUrl` が未設定のため、Electrobun の差分パッチ生成はスキップされる

```bash
EXPO_NO_DOTENV=1 \
EXPO_PUBLIC_SUPABASE_URL=... \
EXPO_PUBLIC_SUPABASE_ANON_KEY=... \
ELECTROBUN_APP_VERSION=1.0.0-canary.local \
bunx expo export --platform web --output-dir dist
bunx electrobun build --env=canary
```

Canary の出力例: `canary-linux-x64-OwlofAthena-canary-Setup.tar.gz`、`canary-linux-x64-OwlofAthena-canary.tar.zst`、`canary-linux-x64-update.json`。

## 安定版リリース

## 前提

- リポジトリ: `Amka78/owl-of-athena`
- ワークフロー: **Release Desktop (Electrobun)**（`workflow_dispatch`）
- リリースタグは入力したバージョンに `v` を付けたもの（例: `1.1.0` → `v1.1.0`）
- リポジトリシークレットに以下が必要
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `GITHUB_TOKEN` はワークフローの `permissions: contents: write` で Release 作成に使う。
- Canary の Pre-Release も同じシークレットと権限を使う。

## 実行方法

1. GitHub の Actions → **Release Desktop (Electrobun)** → Run workflow
2. `version` に `1.1.0` のような値を入力する（`v` は付けない）
3. 実行すると次の3ジョブが並列で走る
   - Linux x64（ubuntu-latest）
   - Windows x64（windows-latest）
   - macOS（macos-latest）
4. すべて成功すると `v<version>` の GitHub Release が作成され、各 OS の配布物が添付される。既存タグがある場合はアセットを上書きする。

## ビルド内容

各ランナーで以下を実行する。

```bash
bun install --frozen-lockfile
bunx expo export --platform web --output-dir dist
bunx electrobun build --env=stable
```

- `EXPO_NO_DOTENV=1` を付け、CI では `.env` を読まずに Actions シークレットを使う。
- `ELECTROBUN_APP_VERSION` に入力バージョンを渡し、`electrobun.config.ts` の `app.version` と `update.json` に反映する。
- `dist` は `electrobun.config.ts` の `build.copy` で `Resources/app/dist` へ入る。
- 配布物は `dist-desktop-artifacts/` に出力される。ファイル名は `stable-<os>-<arch>-...` で、Linux は `Setup.tar.gz` / 更新用 `tar.zst`、Windows は `Setup.exe`、macOS は `dmg` など。

## ローカルで安定版リリースビルドを確認する

Linux では GTK / WebKit の開発パッケージが必要。

```bash
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev
EXPO_NO_DOTENV=1 \
EXPO_PUBLIC_SUPABASE_URL=... \
EXPO_PUBLIC_SUPABASE_ANON_KEY=... \
ELECTROBUN_APP_VERSION=1.1.0 \
bun run build:desktop:release
```

出力先:

- アプリ本体: `dist-desktop/stable-<os>-<arch>/`
- 配布物: `dist-desktop-artifacts/`

`dist-desktop/` と `dist-desktop-artifacts/` は `.gitignore` 済み。

## 注意点

- コード署名・公証は未設定。macOS は Gatekeeper、Windows は SmartScreen の警告が出る可能性がある。配布時に署名が必要なら Apple Developer ID / Windows 証明書を追加する。
- macOS の DMG 作成は macOS ランナーでのみ行う。Windows / Linux へクロスビルドはしない。
- Linux のビルドは GTK ネイティブラッパーを使う。ubuntu-latest に開発パッケージを入れているが、デスクトップ環境のない CI では実行時テストはできない。
- `bun install --frozen-lockfile` のため、`package.json` の依存や overrides を変えたら `bun install` で `bun.lock` も更新してコミットする。
- 署名や公証を有効化するときは `electrobun.config.ts` の `mac.codesign` / `mac.notarize` と証明書シークレットを追加する。