-- P0 RLS 強化の実データテスト。
-- ローカル Supabase（auth スキーマあり）で `supabase test db` を実行する。
-- すべての変更は最後に rollback される。

begin;
select plan(10);

-- テスト用の auth ユーザーと公開プロフィール
insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
values
    (
        '10000000-0000-4000-8000-000000000001',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'rls-a@example.com',
        'test',
        now(),
        '',
        '',
        '',
        '',
        '{}'::jsonb,
        '{}'::jsonb,
        now(),
        now()
    ),
    (
        '10000000-0000-4000-8000-000000000002',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'rls-b@example.com',
        'test',
        now(),
        '',
        '',
        '',
        '',
        '{}'::jsonb,
        '{}'::jsonb,
        now(),
        now()
    )
on conflict (id) do nothing;

insert into public.users (id, email, activated)
values
    ('10000000-0000-4000-8000-000000000001', 'rls-a@example.com', true),
    ('10000000-0000-4000-8000-000000000002', 'rls-b@example.com', true)
on conflict (id) do nothing;

insert into public.issues (id, user_id, title)
values
    ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'A issue'),
    ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'B issue')
on conflict (id) do nothing;

insert into public.user_messages (id, message_id, user_id, title, message, type)
values (
    '30000000-0000-4000-8000-000000000001',
    gen_random_uuid(),
    '10000000-0000-4000-8000-000000000001',
    'Message A',
    'Body A',
    'info'
)
on conflict (id) do nothing;

insert into public.orders (id, user_id, amount_total, status)
values (
    '40000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    100,
    'paid'
)
on conflict (id) do nothing;

-- 一般ユーザー A として実行
select set_config(
    'request.jwt.claims',
    json_build_object('sub', '10000000-0000-4000-8000-000000000001', 'role', 'authenticated')::text,
    true
);
set local role authenticated;

select results_eq(
    $$ select count(*)::int from public.issues $$,
    $$ values (1) $$,
    'A sees only their own issue'
);

select results_eq(
    $$ select count(*)::int from public.issues
       where user_id = '10000000-0000-4000-8000-000000000002' $$,
    $$ values (0) $$,
    'A cannot see B issues'
);

select throws_ok(
    $$ insert into public.issues (user_id, title)
       values ('10000000-0000-4000-8000-000000000002', 'spoofed') $$,
    '42501',
    null,
    'A cannot create an issue for B'
);

select throws_ok(
    $$ insert into public.user_messages (message_id, user_id, title, message, type)
       values (gen_random_uuid(), '10000000-0000-4000-8000-000000000002', 'x', 'x', 'info') $$,
    '42501',
    null,
    'A cannot insert a message for B'
);

select results_eq(
    $$ update public.user_messages set title = 'hacked'
       where id = '30000000-0000-4000-8000-000000000001'
       returning title $$,
    $$ values ('Message A') $$,
    'A cannot change the message title'
);

select results_eq(
    $$ update public.user_messages set read_at = now()
       where id = '30000000-0000-4000-8000-000000000001'
       returning id $$,
    $$ values ('30000000-0000-4000-8000-000000000001'::uuid) $$,
    'A can mark their own message as read'
);

select results_eq(
    $$ update public.orders set amount_total = 0
       where id = '40000000-0000-4000-8000-000000000001'
       returning id $$,
    $$ select null::uuid where false $$,
    'A cannot change an order amount'
);

select throws_ok(
    $$ select * from public.get_or_create_user_profile('10000000-0000-4000-8000-000000000002') $$,
    'P0001',
    null,
    'A cannot read B profile through the RPC'
);

select results_eq(
    $$ select count(*)::int
       from public.get_or_create_user_profile('10000000-0000-4000-8000-000000000001') $$,
    $$ values (1) $$,
    'A can read their own profile through the RPC'
);

select is_empty(
    $$ select 1 from pg_policies
       where schemaname = 'public' and tablename = 'user_messages' and cmd = 'INSERT' $$,
    'user_messages has no client INSERT policy'
);

select * from finish();
rollback;