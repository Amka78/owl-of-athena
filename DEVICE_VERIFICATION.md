# 夜間アラーム 実機検証ガイド

P0（一晩装着してアラームで起きる）と P1（通知・起床フロー・ファームウェア更新）は実装済みだが、**実機でしか確認できない項目が残っている**。このガイドはビルドから検証、切り分けまでの手順をまとめたもの。

対象コミット: `fbcea99`（着手前）→ `c83e679`（P1 完了）→ `6075632`（P2 完了）

> **SDK 58 へ更新済み（2026-11-01）。** `expo-av` は SDK 56 以降サポート外のため `expo-audio` に移行した。`expo-audio` の config plugin が Android の前景サービス（`AudioControlsService` / `FOREGROUND_SERVICE_MEDIA_PLAYBACK`）と iOS の `UIBackgroundModes: audio` を追加するので、**prebuild とアプリの再インストールが必須**。`REACT_NATIVE_PACKAGER_HOSTNAME` は `.env.local` に置くこと（`.env` に書くと SDK 58 の `@expo/env` が personal env として起動を拒否する）。

## 事前準備

- Supabase SQL Editor で `supabase_init.sql` を実行する（`firmware_releases` テーブルと公開 `firmware` バケットが作られる）
- `.env.local` に `EXPO_PUBLIC_SUPABASE_URL` と `EXPO_PUBLIC_SUPABASE_ANON_KEY` が入っていること（`.env` の `SUPABASE_*` は値が入れ替わっているので使わない）
- EAS CLI とログイン（iOS ビルド用）

```bash
bun install
bunx expo config --type public        # name / 識別子 / plugins が解決されるか確認
bunx expo config --type introspect    # UIBackgroundModes / Android パーミッションを確認
```

`--type introspect` で次が出ればネイティブ設定は正しく入っている。

- `UIBackgroundModes: ["audio","bluetooth-central"]`
- `NSBluetoothAlwaysUsageDescription`
- Android: `BLUETOOTH_SCAN` / `BLUETOOTH_CONNECT` / `POST_NOTIFICATIONS` / `ACCESS_FINE_LOCATION` / `USE_EXACT_ALARM`

## ビルド

ネイティブ設定（バックグラウンドモード・通知・BLE 権限）は `app.config.ts` から生成されるため、**prebuild とアプリの再インストールが必須**。JS の更新だけでは反映されない。

```bash
bunx expo prebuild          # ios/ android/ を生成（生成物はコミットしない）
```

### Android

```bash
bun run android             # expo run:android（実機 or エミュレータ）
# または
bun run eas:android:preview # ローカルで APK を作り、wsl-avd でエミュレータへ入れられる
```

ローカルビルドの詳細・Gradle キャッシュ破損などの切り分けは `EAS_BUILD.md` を参照。

### iOS（WSL からは EAS 必須）

```bash
eas build --profile development --platform ios
# ビルド完了後、実機にインストールして開発サーバへ接続
```

### 開発サーバ

```bash
bun run start               # expo start --dev-client
```

WSL から実機/エミュレータへ Metro が届かない場合は次のどちらかを使う。

```bash
adb reverse tcp:8081 tcp:8081 && bunx expo start --host localhost
# エミュレータなら exp://10.0.2.2:8081 を手動入力
```

## 検証項目

### 1. 画面ロック＋マナーモードで鳴るか

1. ヘッドバンドを接続し、設定でアラーム時刻を 5 分後にする
2. GO TO BED → 睡眠画面が出たら端末をロックし、マナーモード（iOS はサイレントスイッチ）にする
3. 時刻になったら、アプリのアラーム音が**ループで鳴る**こと
4. Snooze を押すと**音が止まり**、9 分後に**再び鳴る**こと（開発ビルドでは 9 秒）

確認している実装: `AlarmAudio`（`playsInSilentModeIOS: true` / `staysActiveInBackground: true`）、`AlarmRuntime.snooze()` は音を止めて再アームする。

### 2. BLE を切っても鳴るか（切断フォールバック）

1. 検証 1 と同じくアラームを 5 分後に設定して GO TO BED
2. ヘッドバンドの電源を切る、または端末を機内モードにする
3. 時刻になったらスマホ側で鳴ること

確認している実装: `AlarmKeepAlive.acquire("disconnected-fallback")`（無音ループで維持）＋ `AlarmRuntime.reconcile()`。切断を検知するとログに `device disconnected while the alarm is armed` が出る。

### 3. 通知の Snooze / Wake Up

1. アラームが鳴ったら、通知（バナー／ロック画面）の **Snooze** を押す → 鳴り止んで 9 分後に再鳴動
2. もう一度鳴らして **Wake Up** を押す → 音が止まり起床画面（Awake）へ進む
3. 通知が出ない場合は権限を確認（初回は GO TO BED 時に要求される）

確認している実装: `AlarmNotifier.native.ts`（iOS は通知カテゴリのアクション、Android は `importance: MAX` のチャンネル）。

### 4. ファームウェア更新

1. Supabase の `firmware` バケットに hex を置き、`firmware_releases` に**hex の実バージョンと同じ** `version` で行を追加する
   ```sql
   INSERT INTO public.firmware_releases (version, hex_path)
   VALUES (10500, 'aurora-10500.hex');
   ```
2. アプリからヘッドバンドに接続する
3. 「ファームウェアの更新があります」が出る → OK
4. 更新中は操作できないこと、完了後にバージョン表示が新しくなること
5. 電池が 25% 未満だと更新せず充電を促すこと

**注意:** `version` が hex の実バージョンと違うと、書き込み自体は成功しても `flash()` の検証で `Flash failed. Expected ...` になる。

### 5. Android の Doze 中でも時刻に鳴るか

Android は JS タイマーが Doze で止まるため、締切時刻の通知を OS に予約している（`AlarmNotifier.scheduleAt`）。アプリのプロセスが落ちていても、OS が時刻に通知を出す。

1. アラームを 5 分後に設定して GO TO BED
2. 端末をスリープさせ、`adb shell dumpsys deviceidle force-idle` で Doze に落とす
   （戻すときは `adb shell dumpsys deviceidle unforce`）
3. 時刻になったら通知が鳴ること（アプリが前面に無くてもよい）
4. 通知の **Snooze** を押す → アプリが起動して 9 分後に再鳴動すること
5. 通知の **Wake Up** を押す → アプリが起動して起床画面へ進むこと（起動時は `consumePendingAction` が操作を拾う）

確認している実装: 締切通知は `identifier: "aurora-alarm-deadline"` の固定 ID で 1 件だけ予約し、arm / snooze / 復帰時に貼り直し、鳴動・起床・破棄で取り消す。`expo-notifications` は `USE_EXACT_ALARM` がある端末で `setExactAndAllowWhileIdle` を使う。端末再起動後の予約復元は `expo-notifications` 側の BOOT_COMPLETED レシーバが行う。

**制約:** アプリが落ちている間は通知音が 1 回だけ鳴る。ループするアラーム音は、通知をタップしてアプリが起動し `reconcile()` が走ってから始まる。

## 切り分け

| 症状 | 確認すること |
| --- | --- |
| 音が鳴らない | 設定のアラーム音が `NONE` になっていないか。iOS はマナーモードでも鳴る設定だが、音量が 0 なら聞こえない（アプリ内音量を確認） |
| 通知が出ない | OS の通知許可、Android のチャンネル設定。`expo config --type introspect` で `POST_NOTIFICATIONS` を確認 |
| 切断時に鳴らない | ログの `AlarmKeepAlive acquired (disconnected-fallback)` と `[AlarmRuntime]` の時刻を確認。締切から 2 時間を超えると破棄される仕様 |
| 更新ダイアログが出ない | `firmware_releases` に行があるか、`version` が端末より大きいか。テーブル未作成時は例外を握りつぶして何も出さない |
| 更新が失敗する | `version` と hex の実バージョンの一致、電池残量、書き込み中の BLE 切断 |
| WSL から Metro に繋がらない | `adb reverse tcp:8081 tcp:8081` + `--host localhost` |

## 現時点の制約（実装済みだが限界あり）

- **Android の Doze**: 締切通知は OS に予約するため時刻に出るが、アプリが落ちていると通知音は 1 回だけ（ループ開始にはアプリ起動が要る）。前景サービスによる常駐は未実装
- **Web**: タブを閉じると鳴らない。ブラウザ通知にアクションが無いため、Snooze / Wake Up は画面から
- **native の `uploadFile`**: https の URL のみ対応。ローカルパスの hex は未対応
- iOS の通知音は 1 回だけ（ループするのはアプリ内のアラーム音）

## 次の作業

1. 上記 5 項目の実機検証（Doze の項目はネイティブ設定が増えたので要 prebuild）
2. iOS 版との parity の P2 は解消済み（アカウントの編集値保存・`Settings` の 0 時・`sleepScore` の補正・pt-BR）。残りは実機で見つかった差分のみ