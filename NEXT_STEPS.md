# 再開用メモ（2026-11-06）

このセッションで追加した機能と、次に再開するときの入口をまとめる。

## 現在の状態

- HEAD: `main` の最新コミット（`git log --oneline -1` で確認）
- 作業ツリー: クリーン
- ローカルの `main` は `origin/main` より進んでいる（push は未実施）
- 全件テスト: **537 pass / 8 fail**（173 ファイル・545 テスト、スナップショット 147 pass / 6 fail）
- 8 fail は `OptionSlider` / `OptionCheckBoxes` / `OptionToggle` / `SessionListScreenTemplate` / `ProfileScreen` / `SettingsScreen` / `SessionListMenu` の既存スナップショット差分。変更前の HEAD でも個別実行で同じ失敗を確認済み
- これまで全件実行を汚染していた Supabase URL のエラーは、今回の変更後の全件実行では発生しなかった。順序依存の可能性があるため、テスト構成を変えたら再確認する
- 変更した実装ファイルの TypeScript 新規エラーなし（テスト・stories の既存型エラーは残る）

### このセッションで完了したもの

| コミット | 内容 |
| --- | --- |
| `a5d1a07` | `aurora_profiles` をプロフィール編集対応に拡張（マイグレーション含む） |
| `79ba3ee` | `bun test` の Supabase / AsyncStorage モックと音声アセットローダー |
| `9ad61bf` | プロフィール編集（値の配線、LED/BuzzSong、条件判定、保存、Save to Aurora） |
| `8e3f4a6` | パスワード再設定のディープリンクと再設定画面 |
| `c6b7628` | `users.roles` の供給、管理画面の RLS、ロール無効化の永続化 |
| `499b8bb` | `AUTH_SETUP.md`（認証・ロールの手動手順） |
| `c2ac221` | セッション詳細の睡眠タイムラインと表示設定メニュー |
| `ce88af0` | セッション JSON/CSV とプロフィール本文の共有 |
| （今回） | ログ収集と共有、About 画面、管理ユーザー向けコンソール導線、不具合報告へのログ添付 |

今回の追加:

- `LogService.install()` で `console.*` を最大 500 件リングバッファに取り込む（`App.tsx` で起動時に有効化）
- コンソール画面に「ログを共有」（RN Share / Web は共有 API → clipboard）
- 「アプリ情報」画面（バージョン・ビルド・SDK・プラットフォーム・OS・リポジトリ）
- アカウント画面に About 導線、`admin` ロールがある場合のみコンソール導線
- 不具合報告に「ログを添付」チェック（既定 ON）。`issues.logs` に保存し、管理画面では行の下に抜粋を表示
- `expo-network` で接続状態を購読し、オフライン時は全画面の上部にバナーを表示（`OfflineBanner`）
- Aurora デバイス情報に `buildDate` / `runningTime` / `bytesFree` を追加（`os-info` の値をモデルで保持し、空き容量は B/KB/MB に整形）
- アカウント画面のメッセージ導線に未読件数バッジを追加。初回だけメッセージを読み込み、ログアウト時にキャッシュを破棄する
- 質問票の `checkbox` / `text` 設問に対応。回答はクライアント側で蓄積し、次問への遷移・前問へ戻る・完了まで更新する
- `FlatButton` の `disabled` を Paper の Button に渡すように修正（Next ボタンの無効化が効いていなかった）
- セッション転送に読み込み / 転送のセッション単位進捗を追加し、ダイアログに進捗バーと件数を表示
- ファームウェアのコンポーネント別更新に対応。アプリ → ブートローダー → BLE の優先順で 1 件ずつ提示し、`bootloader_has_bootstrap` なら同時書き込みにする
- ファームウェア更新中に UPLOADING / FLASHING / VERIFYING をローディングダイアログへ表示
- ファームウェア更新失敗時にリセットボタンでの復帰案内を表示し、`min_app_version` 未満のアプリには更新を提示しない
- アカウント画面に SD カードのフォーマットと Aurora のリセットを追加。接続中のみ有効で、実行前に確認ダイアログを出す
- 管理画面のユーザー / 注文 / セッションを共通の `AdminTable` にまとめ、「CSVを共有」（共有シート、Web は clipboard）を追加
- 管理画面の列を実際の Supabase スキーマに合わせた。ユーザーは Email（`users` に列が無い）を外して誕生日・性別・ロールを表示、セッションは `sleep_score` / `session_duration`（列が無い）を外して就寝・起床・スター・日時を表示
- 管理メニュー（`AdminMenuScreen`）を追加し、Admin を開いた直後にユーザー・注文・セッション・問題・メッセージを選べるようにした。各画面からは戻るでメニューへ戻る
- ファームウェア更新の確認時に未転送セッションを数え、ある場合は「更新すると失われる」注意をダイアログ本文に追加。接続時に転送ダイアログを出した場合は、閉じたあとに件数を数え直してから更新を確認する

## 手動セットアップ（未適用なら必須）

1. Supabase に次のマイグレーションを適用する。
   - `supabase/migrations/20261103000000_aurora_profiles_editor.sql`
   - `supabase/migrations/20261104000000_user_roles.sql`
   - `supabase/migrations/20261104000001_issue_logs.sql`（不具合報告のログ添付用）
   - `supabase/migrations/20261105000000_questionnaire_response.sql`（質問票の回答蓄積用）
   - `supabase/migrations/20261105000001_firmware_components.sql`（ブートローダー / BLE の配布列）
   - `supabase/migrations/20261105000002_firmware_min_app_version.sql`（最低アプリバージョン）
2. Supabase Dashboard → Authentication → URL Configuration の Redirect URLs に `owl-of-athena://reset-password` を追加する。
3. `app.config.ts` の `scheme: "owl-of-athena"` はネイティブビルドに埋め込まれるため、**新しい APK / IPA をビルドする**（OTA だけでは有効にならない）。
4. `expo-network` を追加済みのため、**prebuild とアプリの再インストールが必要**（OTA だけではネイティブモジュールが入らない）。
5. 管理者ユーザーにロールを付与する。

```sql
UPDATE public.users
SET roles = '[{"id":"admin","slug":"admin","title":"Admin"}]'::jsonb
WHERE id = '<user-uuid>';
```

5. `.env.local` の `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` を確認する（`.env` の `SUPABASE_*` は値が入れ替わっているため使わない）。

詳細は `AUTH_SETUP.md` を参照。

## 未検証（実機でしか確認できない）

- `DEVICE_VERIFICATION.md` の P0/P1 実機検証 5 項目
- プロフィールの LED / BuzzSong プレビュー、Save to Aurora（BLE 書き込み）
- パスワード再設定メールのリンク遷移とパスワード更新
- 管理画面の実データ取得（`is_admin()` と RLS の適用後）
- セッション JSON/CSV の共有シート、Web の clipboard フォールバック
- コンソールの「ログを共有」と、Web での clipboard フォールバック
- About 画面の表示内容（ビルド番号は EAS ビルド後に確定）とリポジトリリンク
- 不具合報告のログ添付（`issues.logs` マイグレーション適用後）と管理画面での抜粋表示
- オフライン時のバナー表示（機内モード / 機内モード解除、Web の offline イベント）
- デバイス情報の `buildDate` / `runningTime` / `bytesFree` が実機の `os-info` で表示されること
- 未読メッセージバッジの件数が実データと一致し、既読・ログアウト後に正しく更新されること
- 質問票の checkbox / text 設問、前へ戻る、完了までの遷移
- セッション転送の進捗表示（複数セッション・失敗を含むケース）
- ファームウェアのブートローダー / BLE 更新（実機、`has_bootstrap` の有無、失敗時の復帰）
- ファームウェア更新中の UPLOADING / FLASHING / VERIFYING の切り替わり
- ファームウェア更新失敗時の案内表示と、`min_app_version` による更新の非表示
- SD カードのフォーマットと Aurora のリセット（実機、実行後の再接続）
- 小さい画面での睡眠チャートとタイムラインの高さ配分
- 管理画面の CSV 共有（共有シート / Web の clipboard）と、`admin` ロールでのユーザー・注文・セッション取得
- 管理メニューから各画面への遷移と、戻るでメニューに戻ること
- 未転送セッションがある状態でファームウェア更新の警告が出ること、転送後に警告が消えること

これらは「完了」ではなく未検証として扱う。

## 再開入口

まず次の順で読む。

1. `NEXT_STEPS.md`（このファイル）
2. `AUTH_SETUP.md`（認証・ロールの手動手順）
3. `DEVICE_VERIFICATION.md`（実機検証の手順と切り分け）

確認コマンド:

```bash
git log --oneline -10
git status --short
bun test
bunx tsc --noEmit
```

関連テストを個別に回す例:

```bash
bun test src/services/__tests__/ProfileService.test.ts \
  src/components/atoms/__tests__/Field*.test.tsx \
  src/components/organisms/profiles/__tests__/*.test.tsx

bun test src/services/__tests__/AuthLinkService.test.ts \
  src/components/templates/__tests__/ResetPasswordScreenTemplate.test.tsx \
  src/store/__tests__/authStore.test.ts

bun test src/components/charts/__tests__/SessionTimelineChart.test.tsx \
  src/components/organisms/sessions/__tests__/SessionDetailsMenu.test.tsx

bun test src/services/__tests__/ExportService.test.ts \
  src/services/__tests__/LogService.test.ts

bun test src/components/pages/__tests__/AboutScreen.test.tsx \
  src/components/templates/__tests__/AboutScreenTemplate.test.tsx \
  src/components/pages/__tests__/ConsoleScreen.test.tsx \
  src/components/pages/__tests__/AccountScreen.test.tsx

bun test src/hooks/__tests__/useNetworkStatus.test.ts \
  src/components/atoms/__tests__/OfflineBanner.test.tsx
```

主な実装ファイル:

- プロフィール: `src/services/ProfileService.ts`, `src/hooks/profiles/useProfile.ts`, `src/components/atoms/FieldLedEffect.tsx`, `src/components/atoms/FieldBuzzSong.tsx`
- 認証: `src/hooks/usePasswordReset.ts`, `src/services/AuthLinkService.ts`, `src/components/pages/ResetPasswordScreen.tsx`
- ロール: `src/store/authStore.ts`, `src/components/pages/AccountRolesScreen.tsx`, `supabase/migrations/20261104000000_user_roles.sql`
- セッション: `src/components/charts/SessionTimelineChart.tsx`, `src/components/organisms/sessions/SessionDetailsMenu.tsx`, `src/hooks/sessions/useSession.ts`
- エクスポート: `src/services/ExportService.ts`
- サポート: `src/services/LogService.ts`, `src/utils/AppInfo.ts`, `src/components/pages/ConsoleScreen.tsx`, `src/components/pages/AboutScreen.tsx`, `src/components/molecules/IssueReportDialog.tsx`, `supabase/migrations/20261104000001_issue_logs.sql`
- オフライン検知: `src/hooks/useNetworkStatus.ts`, `src/components/atoms/OfflineBanner.tsx`, `src/components/Container.tsx`
- デバイス情報: `src/sdk/models/AuroraOSInfo.ts`, `src/components/molecules/AuroraInfoDialog.tsx`
- 未読バッジ: `src/store/messageStore.ts`, `src/hooks/useUnreadMessageCount.ts`, `src/hooks/useLogout.ts`, `src/components/pages/AccountScreen.tsx`
- 質問票: `src/services/QuestionnaireService.ts`, `src/store/questionnaireStore.ts`, `src/components/molecules/QuestionnaireDialog.tsx`, `supabase/migrations/20261105000000_questionnaire_response.sql`
- セッション転送: `src/managers/AuroraManagerCore.ts`, `src/managers/SessionSyncResult.ts`, `src/store/sessionTransferStore.ts`, `src/components/molecules/SessionTransferDialog.tsx`
- ファームウェア: `src/types/Firmware.ts`, `src/clients/FirmwareRestClient.ts`, `src/services/FirmwareService.ts`（`buildFirmwareUpdateMessage`）, `src/managers/AuroraManagerCore.ts`, `src/sdk/AuroraCmdFlashFile.ts`, `src/hooks/useMain.ts`, `supabase/migrations/20261105000001_firmware_components.sql`, `supabase/migrations/20261105000002_firmware_min_app_version.sql`
- デバイス保守: `src/hooks/useDeviceMaintenance.ts`, `src/components/pages/AccountScreen.tsx`
- 管理画面: `src/components/molecules/AdminTable.tsx`, `src/components/pages/AdminMenuScreen.tsx`, `src/navigation/AdminNavigator.tsx`, `src/components/pages/AdminUsersScreen.tsx`, `src/components/pages/AdminOrdersScreen.tsx`, `src/components/pages/AdminSessionsScreen.tsx`, `src/services/ExportService.ts`（`buildTableCsv`）

## 次の優先順

1. **実機検証**: `DEVICE_VERIFICATION.md` の 5 項目と、上記の未検証項目。
2. **管理画面の残り**: 不具合報告のログは現状 4 行の抜粋のみなので、必要なら詳細表示を追加する。注文の `transaction_origin` など参照元にある列は現在のスキーマに無いため、必要になった時点で列追加のマイグレーションとセットで検討する。検索・ソート・ページング・列表示切替・行選択は未実装。

## 既知の制約

- 全件テストの 8 fail は既存スナップショット差分。Supabase の URL 未設定による汚染は今回の変更後の全件実行では発生しなかったが、順序依存の可能性があるためテスト構成を変えたら失敗集合を再確認する。
- 未読バッジはメッセージを初回だけ読み込み、ログアウト時に破棄する。新しいメッセージはアプリ再起動かメッセージ画面を開くまでバッジに反映されない。
- ログは `console.*` を起動時から最大 500 件保持するリングバッファ。アプリ起動より前のログと、ネイティブ側のログは含まれない。不具合報告に添付したログは Supabase の `issues.logs` にそのまま保存される。
- コンソール画面は `admin` ロールを持つユーザーだけがアカウント画面から開ける。ディープリンクや直接遷移は想定していない。
- オフライン検知は `expo-network` に依存する。初回取得が終わるまでは `unknown` としてバナーを出さない。iOS は `isInternetReachable` が `isConnected` と同じ値になるため、実際の到達性ではなく接続状態で判定する。ネイティブは prebuild と再インストールが必要。
- デバイス情報の `buildDate` は UTC で表示する。古いファームウェアが値を返さない場合は `—` になる。
- 質問票の回答はクライアント側で `questionnaire_respondents.response` に蓄積し、`current_question_index` / `current_question` / `completed_at` を更新する。`response` 列を追加するマイグレーションの適用が必須。設問は `questionnaires.questions` の JSONB 配列を前提にしている。
- セッション転送の進捗は読み込み (`reading`) と転送 (`uploading`) の 2 段階で、セッションを 1 件処理するたびに更新する。失敗したセッションも進捗を進める。
- `FlatButton` は `disabled` を Paper の Button に渡すようになった。以前は見た目だけで押せていた箇所がある。
- ファームウェアの `min_app_version` はインストール済みアプリの version と比較し、下回る場合はアプリ / コンポーネントとも更新を提示しない。配布行に null を入れると制限なし。
- 未転送セッションの警告は更新確認の時点で `getUnsyncedSessions()` を呼んで件数を数える。取得に失敗した場合は警告なしで更新を提示する。接続時の転送ダイアログを閉じたあとに数え直すため、転送済みなら警告は出ない。
- ファームウェアのダウンロード段階・進捗表示は未実装（UPLOADING / FLASHING / VERIFYING のみ）。
- ファームウェア更新失敗時は、エラーに加えてリセットボタンでの再起動・再接続を案内する。
- ファームウェア更新の状態は、`flashFile` のアップロード前後で UPLOADING / FLASHING、`flashConnectionChange` で端末情報を受け取った時点を VERIFYING として表示する。端末が切断したまま再認識できない場合は FLASHING のままタイムアウトする。
- ファームウェアのコンポーネント更新は、アプリ → ブートローダー → BLE の優先順で 1 回のチェックにつき 1 件だけ提示する。アプリが最新のときだけコンポーネントを見る。
- ブートローダー / BLE の hex は `firmware_releases` の `bootloader_*` / `ble_*` 列と公開 `firmware` バケットに置く。`bootloader_has_bootstrap` が true なら `bootloader-and-bootstrap` として書き込む。各 version は hex の実バージョンと一致させる。
- 最新行にコンポーネント列が無い場合、古い行には探しに行かない。配布時は最新行にまとめて記載する。
- SD フォーマットは `sd-format`、デバイスリセットは `os-reset` を実行する。どちらも接続中のみ有効で、確認ダイアログの後に実行し、失敗時はエラーを表示する。SD フォーマットは未転送セッションを消すため、実行前に転送を促す文言を出している。
- `os-reset` 後は端末が再起動するため、再接続が必要になる。
- 既存の `aurora_profiles` 行は `content` が空のためクライアント側で非表示になる。必要なら作り直す。
- エクスポートはテキスト共有。イベント数が多いセッションは OS の共有上限に掛かる可能性がある。ファイル共有が必要なら `expo-file-system` + `expo-sharing` の追加とネイティブ再ビルドが必要。
- セッションタイムラインは睡眠チャート表示時のみ。画面の高さが足りない場合は省略される。
- 管理画面の CSV はテキスト共有（ネイティブは共有シート、Web は clipboard）。`AdminTable` の hidden 列も CSV に含まれる。ID や notes など画面に出さない値を出力するため。
- 管理画面の列は `public.users` / `orders` / `aurora_sessions` の実カラムに合わせている。`users` に email 列は無いため Email は表示しない。セッションの睡眠スコアと duration もテーブルに無いため表示しない。
- テスト環境の `FlatList` はモックが子要素を描画しないため、`AdminTable` の行表示は自動テストで検証していない（CSV とヘッダーのみ）。
- `AdminAppSettingsScreen` は旧 API 前提で到達不能のまま。管理メニューには出ていない。
- `stream-debug` は有効な `admin` ロールがある場合のみ表示される。
- `git push` は SSH 鍵のパスフレーズで止まるため、非対話環境からは実行していない。必要な場合は手動で push する。