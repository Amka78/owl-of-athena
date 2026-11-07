# Web 版を GitHub Pages で公開する

Expo の Web ビルドを GitHub Actions で生成し、GitHub Pages へデプロイする手順です。

## 前提

- リポジトリ: `Amka78/owl-of-athena`
- 公開 URL: `https://amka78.github.io/owl-of-athena/`
- Pages のプロジェクトページは `/owl-of-athena/` 配下で配信されるため、CI では `PAGES_BASE_URL=/owl-of-athena` を渡して Expo の `experiments.baseUrl` を切り替える。ローカル開発では未設定のままで、URL は変わらない。
- GitHub Pages を private リポジトリで使うには有料プラン（Pro / Team / Enterprise）が必要。Free の場合は public リポジトリで使う。

## 初回セットアップ

1. GitHub のリポジトリ → Settings → Pages → Build and deployment で、Source を **GitHub Actions** にする。
2. GitHub のリポジトリ → Settings → Secrets and variables → Actions に、次のリポジトリシークレットを登録する。
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - service_role キーや `SUPABASE_*` は登録しない。クライアントへ埋め込まれるのは `EXPO_PUBLIC_*` のみ。
3. Supabase Dashboard → Authentication → URL Configuration の Redirect URLs に、Web の URL を追加する。
   - `https://amka78.github.io/owl-of-athena/`
   - パスワード再設定を Web で使う場合は、必要なコールバック URL も追加する。
4. `main` へ push するか、Actions の「Deploy Web to GitHub Pages」を手動実行する。

## ワークフロー

`.github/workflows/pages.yml`

- `main` への push と `workflow_dispatch` で実行
- `bun install --frozen-lockfile`
- `EXPO_NO_DOTENV=1 PAGES_BASE_URL=/owl-of-athena bunx expo export --platform web --output-dir dist`
- `dist/index.html` を `dist/404.html` にコピーして SPA の直接 URL をフォールバック
- `dist/.nojekyll` を作成して `_expo` 配下を Jekyll に処理させない
- `actions/upload-pages-artifact` → `actions/deploy-pages` で公開

## ローカルで同じビルドを確認する

```bash
EXPO_NO_DOTENV=1 \
PAGES_BASE_URL=/owl-of-athena \
EXPO_PUBLIC_SUPABASE_URL=... \
EXPO_PUBLIC_SUPABASE_ANON_KEY=... \
bunx expo export --platform web --output-dir dist
```

`dist/index.html` の `src` / `href` が `/owl-of-athena/_expo/...` になっていることを確認する。`file://` で直接開くと動かないため、必ず HTTP サーバーで確認する。

```bash
python3 -m http.server 8080 --directory dist
```

`http://localhost:8080/owl-of-athena/` で開く。ルート直下で配信する場合は `PAGES_BASE_URL` を付けずに export する。

## 注意点

- `index.html` は絶対パスでアセットを参照する。サブパスを変える場合は `PAGES_BASE_URL` とワークフローの値を揃える。
- カスタムドメインを使う場合は、`PAGES_BASE_URL` を `/` にして `dist/CNAME` を追加するか、ワークフローで CNAME を生成する。
- Web の更新通知は `/expo-service-worker.js` を前提にしているが、現在の Expo の Web export には Service Worker が含まれない。Pages 公開後に更新通知を有効化する場合は、Service Worker の生成と `useAppUpdate.ts` の登録パスを別途整える。
- Supabase のシークレットを設定し忘れると、ビルドは通るがログイン・同期が動かない。`expo config --type public` で `extra.supabaseUrl` が空でないことを確認する。