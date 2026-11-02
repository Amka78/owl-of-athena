# リリース手順（Preview APK と OTA）

Android の preview ビルドと OTA 配信の**メンテナー向け**手順です。
ネイティブ変更が無い限り APK を作り直さず、`v*` タグの push で EAS Update を配信します。

## ワークフロー一覧

| ワークフロー | トリガー | 内容 |
| --- | --- | --- |
| `preview-apk.yml`（Preview APK Build (Manual)） | 手動（Actions タブ） | `eas build --local` で preview APK を作成し、GitHub Pre-Release に添付 |
| `preview-release.yml`（Preview OTA Release） | `v*` タグの push | `eas update --channel preview` で JS/アセットだけを OTA 配信 |

`v*` タグ push では **APK はビルドされません**。ネイティブ構成（config plugin、`eas.json`、SDK、依存のネイティブモジュール）を変えたときだけ `preview-apk.yml` を手動実行してください。

## 初回セットアップ（GitHub / EAS）

### 1. 既定ブランチを main にする

このリポジトリの CI は `main` を前提にしています。移行は次の順で行います。

```sh
# ローカル
git branch -m master main
git push -u origin main
```

1. GitHub の **Settings → General → Default branch** で `main` に切り替える
2. 切り替え後に古いブランチを削除する

```sh
git push origin --delete master
```

### 2. リポジトリシークレットを登録する

GitHub の **Settings → Secrets and variables → Actions → New repository secret** に以下を登録します。

| 名前 | 値 |
| --- | --- |
| `EXPO_TOKEN` | https://expo.dev/settings/access-tokens で発行した Personal access token |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase の Project URL（`https://xxxx.supabase.co`） |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase の **publishable / anon** キー |

`EXPO_PUBLIC_SUPABASE_ANON_KEY` に **secret キー（service_role）を入れないでください**。`EXPO_PUBLIC_*` はアプリのバンドルに埋め込まれ、APK から取り出せます。`app.config.ts` が `extra.supabaseUrl` / `extra.supabaseAnonKey` に埋め込むのはこの 2 つだけです。

`GITHUB_TOKEN` は追加登録不要です（`preview-apk.yml` が `permissions: contents: write` を宣言しています）。

### 3. EAS 側の準備

```sh
eas whoami                 # ログイン済みか確認
eas project:info           # projectId が app.json と一致するか確認
eas channel:create preview # 未作成なら作成（作成済みならエラーになるだけで問題ない）
```

`channel:create` を忘れると、`preview-release.yml` の `eas update --channel preview` が `Channel: preview does not exist` で失敗します。ローカルで `bun run eas:android:preview` を対話実行したことがあれば、その時点で作成済みです。

`eas update` が使う `EXPO_PUBLIC_SUPABASE_*` はワークフローの `env:` で渡しています。EAS のサーバー側環境変数（`eas env:create`）に登録する必要はありません。

### 4. OTA 対応 APK を一度作り直す

`app.config.ts` に `updates.url` を追加する**前**にインストールした APK は、更新先 URL を持たないため OTA を受け取れません。設定反映後に `preview-apk.yml` を一度実行し、APK を入れ直してください。

## OTA 配信（バージョン更新時）

```sh
git tag -a v1.1.0 -m "v1.1.0"
git push origin HEAD
git push origin v1.1.0
```

タグ push で `preview-release.yml` が起動し、preview チャンネルへ配信されます。

- 配信先は `eas.json` の `preview` プロファイルの `channel: "preview"` を購読している APK（`com.amka78.owlofminerva.preview`）です
- 反映は**アプリの次回起動時**（`fallbackToCacheTimeout: 0`）
- `runtimeVersion` は `sdkVersion` ポリシーなので、Expo SDK 58 のままなら同じ APK に配信され続けます。SDK を上げた場合は APK の再ビルドが必要です
- バージョン番号は EAS 側（`eas.json` の `appVersionSource: "remote"`）で管理されているため、タグは配布物の識別子として使います。`package.json` の `version` と揃えたい場合はタグ作成前に更新してください

## 手動 APK ビルド

1. GitHub の **Actions → Preview APK Build (Manual) → Run workflow**
2. リリースバージョン（例: `v1.1.0`）を入力して実行
3. 完了後、`owl-of-minerva-<version>-preview.apk` が **GitHub Pre-Release** に添付される（Actions の artifact にも 7 日間保存）

同じバージョンの Release が既にあると `gh release create` が失敗します。その場合は新しいバージョンを指定するか、既存の Release を削除してください。

## OTA で足りるか / APK 再ビルドが必要か

| 変更内容 | OTA | APK 再ビルド |
| --- | --- | --- |
| `src/` の JS/TS、画像・フォントなどのアセット | 可 | 不要 |
| `app.config.ts` の権限・config plugin・ネイティブ設定 | 不可 | 必要 |
| `eas.json`、Expo SDK、ネイティブモジュールを含む依存の更新 | 不可 | 必要 |

## トラブルシューティング

### `Channel: preview does not exist`

EAS 側にチャンネルがありません。`eas channel:create preview` を実行してから、タグを打ち直すか `gh workflow run preview-release.yml --ref main` で再実行します。

### OTA を配信したのに端末が更新されない

1. 端末のアプリが `com.amka78.owlofminerva.preview`（Preview 版）か確認する。production 版は別チャンネルを購読している
2. アプリを完全終了して再起動する（反映は次回起動時）
3. `eas update:list --channel preview` で配信が作成されているか確認する
4. 配信時の `runtimeVersion` と APK のそれが一致しているか確認する（SDK を上げた直後は不一致になりやすい）

### APK が「Supabase is not configured」になる

`EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` がシークレットに未登録、または空です。登録後に APK を再ビルドしてください（OTA でも JS は差し替えられますが、原因がシークレット側なら再配信が必要です）。

### Gradle のビルドが落ちる

ローカルビルドの切り分けは [EAS_BUILD.md](./EAS_BUILD.md) のトラブルシューティングを参照してください。

## 関連

- ローカルビルドとプロファイル: [EAS_BUILD.md](./EAS_BUILD.md)