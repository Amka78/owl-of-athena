# 仮想 Aurora 端末（Virtual Aurora Device）設計

> 2026-11-16 決定。エミュレータで実機 Bluetooth なしに、接続後の画面へ遷移・操作できるようにするための SDK 層エミュレーション機能。

## 目的と背景

エミュレータ（`expo run:android` の dev build / EAS ローカル APK）では Bluetooth アダプタが無く、
`AuroraBluetooth.native`（ble-plx）の `connect()` が「No bluetooth adapter found」で失敗する。
接続後の画面（デバイス情報・Profiles・Sessions 転送・Console・GO TO BED）は
`AuroraManagerInstance.isConnected()` と接続後のオペレーション成功に依存するため、エミュレータでは触れない。

Android Emulator 自体の Bluetooth は 33.1.4 以降で実験的対応（Netsim/bumble）だが、
現行環境（30.9.5）は対象外で制約も多く、ホスト側に GATT サーバまで用意する構成は不安定なため不採用。

→ **アプリ内 SDK 層に「ワイヤプロトコルを喋る擬似端末」を実装** し、既存の `AuroraBluetoothParser` へ
そのまま流し込む。実機と同じコードパス（パーサ → Aurora → AuroraManager → UI）を通るため、
UI とマネージャの変更は一切不要。接続ボタンを押せば「接続成功」し、接続後画面へ遷移できる。

## 決定事項

| 項目 | 決定 |
| --- | --- |
| 有効化 | 環境変数のみ `EXPO_PUBLIC_VIRTUAL_AURORA=1`（既定 off。実機・本番に影響なし） |
| スコープ | Phase 1〜3（接続 → プロファイル/セッション → 就寝シナリオ） |
| 初期データ | 実機フォーマットのサンプルセッション 2 件を端末が生成して同梱 |
| 就寝シナリオ | `EXPO_PUBLIC_VIRTUAL_AURORA_FAST=1` で「go to bed → アラーム発火 → 起床」を約 30 秒で実施（アラームまで既定 20 秒 + ボタン押下 8 秒。`EXPO_PUBLIC_VIRTUAL_AURORA_SLEEP_SECONDS` で調整可）。FAST なしのときはプロフィールの `wakeup-time` の実時間で発火 |

## 起動方法（dev client / エミュレータ）

仮想端末モードは `EXPO_PUBLIC_VIRTUAL_AURORA=1`（+ 就寝シナリオ短縮の `EXPO_PUBLIC_VIRTUAL_AURORA_FAST=1`）を
Metro プロセスへ渡して起動する。専用スクリプトを用意してある:

```bash
bun run android:virtual   # ビルド + エミュレータへインストール + Metro 起動（expo run:android 相当）
bun run start:virtual     # 既にインストール済みの dev client に Metro を接続（expo start --dev-client 相当）
```

- どちらも `EXPO_PUBLIC_VIRTUAL_AURORA=1 EXPO_PUBLIC_VIRTUAL_AURORA_FAST=1` を設定して起動する。
- 就寝シナリオを実時間（設定アラーム時刻）で試したい場合は FAST を外して起動する
  （例: `EXPO_PUBLIC_VIRTUAL_AURORA=1 bun run android`）。
- 起動後はヘッダーの Bluetooth アイコンから接続すると、仮想端末に接続されて
  デバイス情報・Profiles・Sessions 転送・GO TO BED まで実機なしで操作できる。

## 全体構成

```
src/sdk/virtual/
  VirtualAuroraDevice.ts     … 端末本体: 状態機械 + 仮想ファイルシステム + コマンド処理 + イベント生成 + 就寝シナリオ
  VirtualAuroraBluetooth.ts  … AuroraBluetooth 互換アダプタ（接続状態機械 + parser へ直接 feed）
  heatshrink.ts              … Heatshrink エンコーダ（window 8 / lookahead 4、iWinks 系のタグ割り当て）
  types.ts                   … AuroraBluetoothTransport（接続層の公開インターフェース）
  index.ts                   … createAuroraBluetooth() 工場関数
```

- `Aurora.ts` のコンストラクタで `new AuroraBluetooth()` を呼んでいる箇所を工場関数 `createAuroraBluetooth()`
  に変更し、env が有効なときだけ `VirtualAuroraBluetooth` を生成する。
  接続層の型は共通インターフェース `AuroraBluetoothTransport` に切り、`Aurora.ts` のロジックは無変更。
- 仮想アダプタは `AuroraBluetooth.native.ts` と同じ骨格（内部に `AuroraBluetoothParser` を持ち、
  `DeviceEventList.connectionStateChange / streamData / auroraEvent / cmdInputRequested / cmdOutputReady / Error` を
  既存と同じ意味で re-emit）。公開 I/F は `isConnected / isConnecting / connect / disconnect / writeCmd / writeCmdInput`
  のみで、`Aurora.ts` は無変更で動作する。

### データフロー（コマンド応答）

仮想アダプタは実機と同じ通知経路で parser を駆動する。`writeCmd()` で受けた
`CMD_STATUS=[IDLE] → CMD_DATA=<cmd> → CMD_STATUS=[CMD_EXECUTE]` の書き込み列を
「デバイスがコマンドを受信した」とみなし、デバイスの応答に応じて以下を呼ぶ:

| 応答種別 | parser への通知 |
| --- | --- |
| OBJECT 応答（os-info 等） | 各行を 1 行ずつ `[CMD_RESP_OBJECT_READY, len]` で送る（実機と同じ line 単位の読み出し）→ `[IDLE, 0]` |
| TABLE 応答（sd-dir-read 等） | 1 行目が列ヘッダーとして、1 行ずつ `[CMD_RESP_TABLE_READY, len]` → `[IDLE, 0]` |
| ファイル出力（sd-file-read） | `onCmdOutputCharNotification(chunk)` で先に出力を流し、最後にファイル情報 OBJECT + `[IDLE, 0]` |
| 入力要求（sd-file-write） | `[CMD_INPUT_REQUESTED]` → アプリの `writeCmdInput()` が流すデータをデバイスが受信（500ms アイドルで完了）→ OBJECT（crc 含む）+ `[IDLE, 0]` |
| イベント/ストリーム | 5 バイト通知は `onAuroraEventCharNotification`、ストリームは `onStreamDataCharNotification` |

エラー時は `[IDLE, 1]`（error バイト非 0）で応答する。コンソール等の未実装コマンドは
`Unknown command` エラー応答にし、アプリ側のエラーハンドリング経路も確認可能にする。

## 仮想端末の仕様

### 接続状態機械

- 生成時: アダプタは `PoweredOn` をシミュレートし、INIT → DISCONNECTED へ即遷移（実機の 5 秒初期化待ちをスキップ）。
- `connect()`: DISCONNECTED → CONNECTING → IDLE。
  CONNECTING → IDLE の遷移は既存の `onBluetoothConnectionStateChange`（Aurora.ts）が拾うため、
  `os-info` 応答 → `findBluetoothDevice` イベント → 接続完了、までが実機と同じ流れで成立する。
  権限リクエストはスキップする（実 BLE を使わないため。`VirtualAuroraBluetooth` に RN 依存を
  持たせず node でもテストできるようにする狙いもある）。
- `disconnect()`: 既存と同じ切断手順。フラッシュ時の切断 → 再接続エミュレーションは Phase 4 で追加する。

### コマンド対応面（アプリが現に発行する範囲・実装済み）

| コマンド | 応答 | 備考 |
| --- | --- | --- |
| `os-info` / `os-info 1` | OBJECT | Version String / Version / Board / Build Date / Bytes Free / Battery Level / Running Time / Profile / Bootloader / BLE / Debug Mode。Version は既定 99900（更新提示が出ない高値、env で上書き可） |
| `clock-set …` | OK | 端末時計として受信 |
| `prof-unload` / `prof-load <f>` | OK | プロファイル状態に反映。prof-load で就寝シナリオを予約 |
| `sd-rename <a> <b>` | OK | FS に反映（セッション転送後のリネーム等） |
| `sd-dir-del` / `sd-dir-create` / `sd-file-del` | OK | FS に反映 |
| `sd-dir-read <dir> <isFile> [filter]` | TABLE | `name\|isFile\|size`。profiles / sessions / `YYYY-MM-DD@HHmm`（接頭辞なし参照も解決） |
| `sd-file-read <f> <dir> <compress>` | OUTPUT + OBJECT（crc） | compress=1 は heatshrink（window 8 / lookahead 4）でエンコード |
| `sd-file-info <f> <dir>` | OBJECT | file / size / crc |
| `sd-file-write …` | INPUT_REQ → OBJECT（crc） | ストリーム入力を受信し FS へ書き込み（500ms アイドルで完了）。default.prof の書き込みから `wakeup-time` を取り込む |
| `event-output-enable <mask> 16` / `event-output-disable` | OK | 以後、有効化されたイベントを通知 |
| `log-level-display` / `log-output-display` / `os-shutdown` | OK | ダミー |
| `os-flash` 系・維持機能（format/reset） | エラー応答 | Phase 4 で実装 |
| その他（コンソール任意コマンド） | `Unknown command` エラー応答 | アプリ側のエラーハンドリング経路を確認できる |

### イベント生成と就寝シナリオ（Phase 3・実装済み）

`event-output-enable` でアプリは以下を購読する（`AuroraManagerCore.createEventList`）:
BUTTON_MONITOR / BATTERY_MONITOR / SMART_ALARM / CLOCK_ALARM_FIRE / STIM_PRESENTED。

- バッテリー: `event-output-enable` 後 150ms で BATTERY_MONITOR（100%）を 1 度通知する（Header の BatteryIcon 表示確認用）。
- 就寝シナリオ（`prof-load default.prof` を検知して予約）:
  1. アラーム発火（CLOCK_ALARM_FIRE）→ アプリは WAKING → Waking 画面へ遷移・着信音が鳴る。
  2. その 8 秒後に BUTTON_MONITOR（flags=1）→ アプリは AWAKE → Awake 画面へ遷移 → 未転送セッションの同期へ。
- 発火タイミング:
  - FAST モード（`EXPO_PUBLIC_VIRTUAL_AURORA_FAST=1`）: 既定 20 秒後に発火。
    `EXPO_PUBLIC_VIRTUAL_AURORA_SLEEP_SECONDS` で秒数を変更できる。
  - 実時間モード（FAST なし）: GO TO BED で書き込まれる default.prof の `{wakeup-time:<ms>}`
    の次の到来時刻に発火。未設定ならシナリオを開始せず console.debug で案内する。

### 仮想ファイルシステム

メモリ内ツリー（ミューテーション — GO TO BED の default.prof 書き換え・プロフィール保存 — も反映され、
アプリ再起動で初期状態に戻る）。

- `profiles/` … 初期状態は `_profiles.list`（空）のみ。書き込み（Save to Aurora / GO TO BED）で
  `default.prof` や保存プロファイルが作られる。
- `sessions/YYYY-MM-DD@HHmm/` … `session.txt`（75 B 以上・実機フォーマットのドット記法）+ stream ファイル 1 本。
  端末が起動時に前日・前々日のサンプルセッションを 2 件生成するため、未転送セッションの転送ダイアログや
  Sessions 画面の一覧を最初から確認できる。

## プラットフォーム別動作

| ターゲット | 挙動 |
| --- | --- |
| Android エミュレータ（dev build / EAS APK） | env 有効時のみ仮想接続。接続後画面すべてが機能する（本機能の主目的） |
| Expo Go | 現行 SDK 58 のツールチェーンでは `.expo.ts` が解決されない（KNOWN_PLATFORMS に expo が無い）ため現状は既存のまま。`Aurora.expo.ts` / `AuroraDummy.ts` の整理は Phase 4 |
| Web | 同じ仮想デバイスを env で有効化できる。接続後フローの E2E（Playwright 導入時）も実機なしで実施可能 |
| 実機 / 本番ビルド | env 不在で既定 off。従来どおり実 BLE のみ |

## 実装フェーズ

- **Phase 0 — 検証と配線（済）**: `@expo/platforms` の KNOWN_PLATFORMS（android/ios/web/tvos/macos）に expo が無いことを
  確認し、`.expo.ts` は未解決（デッドコード）と判断 → 仮説検証は「変更しない」を選択（ゼロリスク）。
  `AuroraBluetoothTransport` 型を追加し、`Aurora.ts` を工場関数 `createAuroraBluetooth()` 経由に配線変更。
  Done: tsc・biome・既存テストスイートの回帰なし。
- **Phase 1 — 接続の最小環（済）**: VirtualAuroraDevice / VirtualAuroraBluetooth の接続状態機械 + `os-info` +
  `event-output-enable` + バッテリー通知。
- **Phase 2 — FS・プロファイル・セッション（済）**: 仮想 FS + sd-\* 系 + `readFile`/`writeFile`（heatshrink エンコーダ自作）+
  サンプルセッション 2 件（`AuroraSessionReader` を通ることをテストで確認済み）。
- **Phase 3 — 就寝シナリオ（済）**: GO TO BED → アラーム発火再現 → WAKING → Awake 遷移 + FAST モード。
- **Phase 4 — 仕上げ（未着手）**: フラッシュ・維持機能の擬似応答、`Aurora.expo.ts` / `AuroraDummy.ts` の整理、
  Web E2E 対応の検討。

## テスト

- `src/sdk/__tests__/virtual/` に 28 本（`bun test src/sdk/__tests__/virtual/` で実行）。
  1. heatshrink エンコーダ: 実デコーダ（heatshrink-ts）との往復で検証（圧縮・バイナリ・窓境界）。
  2. デバイス: コマンド応答・仮想 FS・サンプルセッションのパース・就寝シナリオ。
  3. アダプタ: パーサ経由の統合（接続 → os-info → イベント → 入出力）。
- 既存テストスイートは 632 pass / 7 fail（変更前からのトレンド、本機能由来の回帰なし）。
- 実機回帰: env off で既存どおりの挙動であることを確認。リリース CI に env を渡さないことで混入を防ぐ。

## リスク・注意

- `EXPO_PUBLIC_*` はバンドル時に焼き込まれるため、**本番ビルド（EAS / CI）には env を絶対に渡さない**。
  既定 off で環境変数が無ければ仮想コード自体が生成されない。
- 仮想モードでは Android の Bluetooth 権限リクエストをスキップする（実 BLE を使わないため）。
- サンプルセッション 2 件が未転送セッションとして検出されるため、エミュレータで接続すると
  転送ダイアログが表示される（意図どおりの動作）。