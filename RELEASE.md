# リリース手順（バージョン更新と OTA 配信）

Android の preview ビルドと OTA 配信の**メンテナー向け**手順です。
バージョン更新は `scripts/version.sh` が唯一の入口で、ネイティブ変更が無い限り `v*` タグの push だけで EAS Update を配信します。

## 使い方（バージョン更新）

```sh
bun run version <patch|minor|major|x.y.z> [--push]
```

- `patch` / `minor` / `major`：現在のバージョンから自動で加算
- `x.y.z`：明示的なバージョン指定
- `--push`：ブランチとタグの push を対話確認付きで行う（既定は push しない）

### 実行前の自動チェック

- 作業ツリーに変更された tracked ファイルがないこと（untracked は警告のみ）
- `origin/<現在のブランチ>` と同期していること（ahead/behind 0）
- `v<新バージョン>` タグがローカル・リモートのどちらにも存在しないこと
- 更新後、`package.json` と `app.config.ts` と `electrobun.config.ts` の version が一致していること（不一致なら変更を元に戻して中止）

### 実行されること

1. `package.json` / `app.config.ts` / `electrobun.config.ts` の `version` を更新
   - `electrobun.config.ts` は `ELECTROBUN_APP_VERSION` のフォールバック値だけを更新する（CI の env 上書きは維持）
2. コミット（メッセージ: `vX.Y.Z にバージョンアップ`）+ annotated タグ `vX.Y.Z` を作成
3. `--push` 指定時のみ、確認の上で `git push origin HEAD` と `git push origin vX.Y.Z` を実行

### バージョン番号の扱い

実機のバージョン番号（Android versionName / iOS CFBundleShortVersionString）は EAS 側（`eas.json` の `appVersionSource: "remote"`）で管理されています。`version.sh` が揃える 3 ファイルの値は**配布物の識別子**として使い、タグとリリースの対応付けに使います。

## 重要な注意: タグ push で OTA が起動する

`v*` タグの push で `preview-release.yml` が起動し、**preview チャンネルへの EAS Update（OTA）配信が無条件で走ります**。push は意図的に済ませること。また、ブランチ（main）の push では `pages.yml` による Web 版の GitHub Pages 公開も起動します。

| ワークフロー | トリガー | 内容 |
| --- | --- | --- |
| `preview-apk.yml`（Preview APK Build (Manual)） | 手動（Actions タブ） | `eas build --local` で preview APK を作成し、GitHub Pre-Release に添付 |
| `development-apk.yml`（Development APK Build (Manual)） | 手動（Actions タブ） | `eas build --local` で development（dev client）APK を作成し、GitHub Pre-Release に添付 |
| `preview-release.yml`（Preview OTA Release） | `v*` タグの push | `eas update --channel preview` で JS/アセットだけを OTA 配信 |
| `pages.yml`（Web deploy） | `main` への push | `expo export --platform web` を GitHub Pages へ公開 |

`v*` タグ push では **APK はビルドされません**。ネイティブ構成（config plugin、`eas.json`、SDK、依存のネイティブモジュール）を変えたときだけ `preview-apk.yml` を手動実行してください。詳細は [WEB_DEPLOY.md](./WEB_DEPLOY.md)。

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
bun run version minor --push   # 例: 1.1.0 へ上げて push まで行う
```

`--push` は対話確認付きです（[y/N] で No を選ぶと push はされません）。タグ push で `preview-release.yml` が起動し、preview チャンネルへ配信されます。

- 配信先は `eas.json` の `preview` プロファイルの `channel: "preview"` を購読している APK（`com.amka78.owlofminerva.preview`）です
- 反映は**アプリの次回起動時**（`fallbackToCacheTimeout: 0`）
- `runtimeVersion` は `sdkVersion` ポリシーなので、Expo SDK 58 のままなら同じ APK に配信され続けます。SDK を上げた場合は APK の再ビルドが必要です

## 手動で push する場合

`bun run version <bump>`（`--push` なし）でコミットとタグまで作って止めたときは、手動で push します。

```sh
git push origin HEAD
git push origin vX.Y.Z
```

## 手動 APK ビルド

1. GitHub の **Actions → Preview APK Build (Manual) → Run workflow**
2. リリースバージョン（例: `v1.1.0`）を入力して実行
3. 完了後、`owl-of-minerva-<version>-preview.apk` が **GitHub Pre-Release** に添付される（Actions の artifact にも 7 日間保存）

Development 版（dev client 付き、`com.amka78.owlofminerva.dev` / アプリ名 `owl-of-minerva Dev`）も同様に **Actions → Development APK Build (Manual)** からビルドできます。こちらはタグが `<version>-dev` になるため、preview と同じバージョンでも Release 名・タグが衝突しません。

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

### タグ `vX.Y.Z` は既に存在します

`version.sh` のローカル・リモート両方のタグ重複チェックに掛かっています。すでに配布済みのバージョンは再利用できません（OTA の識別子のため）。別のバージョンを指定してください。どうしても同じバージョンで配信したい場合は、先にタグを削除したうえで `gh workflow run preview-release.yml --ref main` で再実行します。

### APK が「Supabase is not configured」になる

`EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` がシークレットに未登録、または空です。登録後に APK を再ビルドしてください（OTA でも JS は差し替えられますが、原因がシークレット側なら再配信が必要です）。

### Gradle のビルドが落ちる

ローカルビルドの切り分けは [EAS_BUILD.md](./EAS_BUILD.md) のトラブルシューティングを参照してください。

## 関連

- ローカルビルドとプロファイル: [EAS_BUILD.md](./EAS_BUILD.md)
- Web 版の公開: [WEB_DEPLOY.md](./WEB_DEPLOY.md)
- デスクトップ版のリリース: [DESKTOP_RELEASE.md](./DESKTOP_RELEASE.md)