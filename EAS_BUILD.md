# EAS ローカルビルド

Android は `eas build --local` でローカルビルドし、生成された APK をそのままエミュレータへ入れられる。iOS はクラウドビルドを使う（後述）。

## 使い方

```sh
bun run eas:android:dev       # development プロファイル
bun run eas:android:preview   # preview プロファイル
bun run eas:android:prod      # production プロファイル
```

`scripts/eas-build.sh` が `eas build --platform android --profile <profile> --local` を実行し、成功後 `build-*.apk` を探して **wsl-avd でエミュレータにインストールするか確認**する。インストールしない場合も APK のパスは表示される。

iOS は `bun run eas:ios:preview` などもあるが、**`--local` の iOS ビルドは macOS 専用**。WSL からは次のようにクラウドビルドを使う。

```sh
eas build --platform ios --profile preview
```

## 前提

- `eas whoami` が通ること（EAS アカウントでログイン済みであること）
- JDK 17 以上（現在の環境は 21）
- Android SDK が `ANDROID_HOME` から見えること（現在は `/mnt/c/Android/Sdk`）
- APK の自動インストールを使う場合は `wsl-avd`（`npm i -g wsl-avd`）

**Supabase の接続情報は `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` で渡す。** ローカルは `.env.local`、EAS のクラウドビルドは EAS の環境変数（`eas env:create`、対象の environment ごと）に登録する。`app.config.ts` は `SUPABASE_*` を参照しないため、これらが無いと `extra` が空のままビルドされ、アプリから接続できない。

`eas.json` のプロファイルは `development` / `preview` / `production` の 3 つ。`preview` は内部配布、`production` は `autoIncrement: true` でバージョンを自動採番する。

## プロファイルとバリアント

各プロファイルは `channel` と `env.APP_VARIANT` を持ち、`app.config.ts` がバリアントに応じてアプリ名と識別子を切り替える。

| プロファイル | channel | APP_VARIANT | アプリ名 | Android package / iOS bundleIdentifier |
| --- | --- | --- | --- | --- |
| development | development | development | owl-of-minerva Dev | `com.amka78.owlofminerva.dev` |
| preview | preview | preview | owl-of-minerva Preview | `com.amka78.owlofminerva.preview` |
| production | production | production | owl-of-minerva | `com.amka78.owlofminerva` |

識別子が別なので **production と dev/preview は同じ端末に併存できる**。ただし EAS の資格情報も識別子ごとに別なので、バリアントを初めてビルドするときに keystore / プロビジョニングプロファイルの生成を求められる。

`channel` は EAS Update の配信先を決める値。`app.config.ts` に `updates.url`（`https://u.expo.dev/<projectId>`）と `runtimeVersion`（`sdkVersion` ポリシー）を設定済みなので、preview / production ビルドは対応するチャンネルの OTA を受け取れる。ただし OTA 対応前の APK は再ビルドが必要。タグ push による配信手順は [RELEASE.md](./RELEASE.md) を参照。

## ネイティブ設定の変更時

EAS はビルド時に `expo prebuild` を実行するため、`app.config.ts` の変更（BLE の権限、`expo-audio` の前景サービス、`USE_EXACT_ALARM` など）は自動で反映される。ローカルビルドでも同じ。

ただし `android/` を手元で生成している場合は、EAS が生成したものと競合しないよう削除してから実行する。

## トラブルシューティング

### Gradle キャッシュ破損（`metadata.bin` 読み込みエラー）

**症状:** Gradle フェーズが `Could not read workspace metadata from .../transforms/<hash>/metadata.bin` で失敗する。

**原因:** Gradle/Kotlin daemon のメモリ不足で transform キャッシュが中途書き込みになり破損する（WSL のメモリが少ない環境で発生しやすい）。

```sh
# 1. 残存 daemon を停止
pkill -f "KotlinCompileDaemon"; pkill -f "GradleDaemon"

# 2. 0 バイトの metadata.bin を持つ破損キャッシュを削除（再生成される）
find ~/.gradle/caches -name "metadata.bin" -size 0 -printf '%h\n' | xargs rm -rf

# 3. 再ビルド（キャッシュ再生成で時間がかかる）
bun run eas:android:preview
```

0 バイトの `results.bin` はビルドを妨げないので削除不要。`free -h` と `ps aux --sort=-%mem` でメモリと残存 daemon を先に確認すると切り分けが速い。

### `.codegraph/` のソケットで clone が失敗する

`.codegraph/daemon.sock` などの Unix ソケットがあると EAS の shallow clone が失敗する。ビルド前に `.codegraph/` を削除する。

### `eas.json` に `local: true` は書けない

`eas.json` のプロファイルに `local` を書くとスキーマ検証で落ちる。ローカルビルドは CLI の `--local` フラグで指定する（`scripts/eas-build.sh` が付与している）。

### SDK が見つからないと言われる

`ANDROID_HOME` が Linux から読めるパスを指しているか確認する。`local.properties` を手で置く必要はない（EAS が環境変数から解決する）。