# 認証・ロールのセットアップ

パスワード再設定のディープリンクと、管理画面のロール（`admin`）を有効にする手順。

## 1. マイグレーションを適用する

既存の Supabase プロジェクトに、次の 2 ファイルを SQL Editor で実行する（プロジェクトをリンク済みなら `supabase db push`）。

1. `supabase/migrations/20261103000000_aurora_profiles_editor.sql`
2. `supabase/migrations/20261104000000_user_roles.sql`

新規構築の場合は `supabase_init.sql` に両方の定義が含まれている。

## 2. パスワード再設定の戻り先を登録する

Supabase Dashboard → Authentication → URL Configuration の **Redirect URLs** に次を追加する。

```
owl-of-athena://reset-password
```

アプリ側は `src/constants/DeepLinks.ts` の `PASSWORD_RESET_URL` を `resetPasswordForEmail` の `redirectTo` に渡している。

`app.config.ts` の `scheme: "owl-of-athena"` はネイティブビルドに埋め込まれる。既存インストールでは **新しいネイティブビルドが必要**（OTA だけでは有効にならない）。

## 3. 管理者を割り当てる

ロールは `public.users.roles`（JSONB）に保持する。SQL Editor から service_role として実行する。

```sql
UPDATE public.users
SET roles = '[{"id":"admin","slug":"admin","title":"Admin"}]'::jsonb
WHERE id = '<user-uuid>';
```

一般ユーザーが自分の `roles` を書き換えても、トリガー `users_protect_roles` が元の値に戻す。`auth.uid()` が NULL の service_role からの更新は許可される。

ロールを外す場合:

```sql
UPDATE public.users SET roles = '[]'::jsonb WHERE id = '<user-uuid>';
```

## 4. 管理画面の RLS

`20261104000000_user_roles.sql` で、`public.is_admin()` を条件に次の読み取り（と問い合わせの更新）を許可している。

- `users`（全ユーザー）
- `aurora_sessions`（全セッション）
- `orders`（全注文）
- `user_messages`（全メッセージ）
- `questionnaire_respondents`（全回答）
- `issues`（更新）

管理メニューの表示はクライアント側の `user.roles` で判定し、実データの取得可否は上記 RLS で決まる。両方揃って初めて管理画面が機能する。

## 5. 動作確認

1. 一般ユーザーでログインし、管理メニューが出ないこと。
2. `roles` に `admin` を設定したユーザーで再ログインし、管理メニューが出ること。
3. 管理画面のユーザー・セッション・注文・問い合わせが一覧表示されること。
4. ログイン画面 → パスワードを忘れた → メールのリンクを開く → 新しいパスワードを設定 → ログインできること。
5. 再設定リンクを開いたときに「リンクが無効」と出る場合、Redirect URL の登録とネイティブビルドの scheme を確認する。