-- P0 RLS 強化の構成テスト。
-- `supabase test db`（pgTAP）で実行する。
-- 認証ユーザーを使った実データの読み書きは、ローカルの auth シードを用意した
-- 環境で追加検証する。ここではポリシー・トリガー・関数定義を検証する。

begin;
select plan(10);

-- 1. 対象テーブルの RLS が有効
select ok(
    not exists (
        select 1
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'public'
          and c.relname in ('issues', 'orders', 'user_messages')
          and c.relrowsecurity = false
    ),
    'issues / orders / user_messages have RLS enabled'
);

-- 2. issues の全件読み取りポリシーが残っていない
select is_empty(
    $$
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'issues'
      and policyname = 'Users can read all issues'
    $$,
    'issues no longer has a read-all policy'
);

-- 3. issues の SELECT は本人または管理者に限定
select ok(
    exists (
        select 1
        from pg_policies
        where schemaname = 'public'
          and tablename = 'issues'
          and cmd = 'SELECT'
          and qual like '%auth.uid()%'
          and qual not ilike '%true%'
    ),
    'issues SELECT is restricted to the owner or admin'
);

-- 4. issues の INSERT は本人の user_id に限定
select ok(
    exists (
        select 1
        from pg_policies
        where schemaname = 'public'
          and tablename = 'issues'
          and cmd = 'INSERT'
          and with_check like '%auth.uid()%'
    ),
    'issues INSERT requires the owner user_id'
);

-- 5. issues に一般ユーザー向け UPDATE ポリシーが残っていない
select is_empty(
    $$
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'issues'
      and cmd = 'UPDATE'
      and policyname like 'Users%'
    $$,
    'issues no longer has a user UPDATE policy'
);

-- 6. user_messages にクライアント INSERT ポリシーが残っていない
select is_empty(
    $$
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_messages'
      and cmd = 'INSERT'
    $$,
    'user_messages INSERT is service-role only'
);

-- 7. user_messages の UPDATE は本人に限定
select ok(
    exists (
        select 1
        from pg_policies
        where schemaname = 'public'
          and tablename = 'user_messages'
          and cmd = 'UPDATE'
          and qual like '%auth.uid()%'
          and with_check like '%auth.uid()%'
    ),
    'user_messages UPDATE is restricted to the owner'
);

-- 8. user_messages の列保護トリガーがある
select ok(
    exists (
        select 1
        from pg_trigger t
        join pg_class c on c.oid = t.tgrelid
        join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'public'
          and c.relname = 'user_messages'
          and t.tgname = 'user_messages_protect_columns'
          and not t.tgisinternal
    ),
    'user_messages protects non-read columns with a trigger'
);

-- 9. orders のクライアント書き込みポリシーが残っていない
select is_empty(
    $$
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and cmd in ('INSERT', 'UPDATE')
    $$,
    'orders are written by the server only'
);

-- 10. get_or_create_user_profile が本人・管理者・service_role を確認する
select ok(
    pg_get_functiondef('public.get_or_create_user_profile(uuid)'::regprocedure)
        like '%auth.uid()%'
    and pg_get_functiondef('public.get_or_create_user_profile(uuid)'::regprocedure)
        like '%service_role%',
    'get_or_create_user_profile checks auth.uid and service_role'
);

select * from finish();
rollback;