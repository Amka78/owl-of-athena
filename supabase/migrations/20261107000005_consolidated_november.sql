-- 2026年11月に追加したマイグレーションの統合版。
-- 既存DBへ再適用しても壊れないよう、列追加は IF NOT EXISTS、
-- ポリシー・トリガー・関数は DROP/CREATE OR REPLACE で冪等にしている。
-- is_new の既読バックフィルだけは、列を新規追加したときのみ実行する。

-- ====================================
-- 1. aurora_profiles のプロフィールエディタ対応
-- ====================================
ALTER TABLE public.aurora_profiles
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS options JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'private',
    ADD COLUMN IF NOT EXISTS starred BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS parent_profile_id UUID,
    ADD COLUMN IF NOT EXISTS min_firmware_version INTEGER NOT NULL DEFAULT 0;

UPDATE public.aurora_profiles
SET title = COALESCE(title, name)
WHERE title IS NULL;

ALTER TABLE public.aurora_profiles
    ALTER COLUMN user_id DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'aurora_profiles_type_check'
          AND conrelid = 'public.aurora_profiles'::regclass
    ) THEN
        ALTER TABLE public.aurora_profiles
            ADD CONSTRAINT aurora_profiles_type_check
            CHECK (type IN ('official', 'community', 'private'));
    END IF;
END
$$;

DROP POLICY IF EXISTS "Authenticated users can read shared profiles" ON public.aurora_profiles;
CREATE POLICY "Authenticated users can read shared profiles" ON public.aurora_profiles
    FOR SELECT USING (auth.role() = 'authenticated' AND type IN ('official', 'community'));

CREATE INDEX IF NOT EXISTS idx_aurora_profiles_updated_at
    ON public.aurora_profiles(updated_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_aurora_profiles_user_name
    ON public.aurora_profiles(user_id, name)
    WHERE user_id IS NOT NULL;

-- ====================================
-- 2. ユーザーロールと管理画面用 RLS
-- ====================================
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS roles JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users
        WHERE id = auth.uid()
          AND roles @> '[{"slug":"admin"}]'::jsonb
    );
$$;

CREATE OR REPLACE FUNCTION public.prevent_role_self_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
            NEW.roles := '[]'::jsonb;
        END IF;
        RETURN NEW;
    END IF;

    IF auth.uid() IS NOT NULL
       AND NEW.roles IS DISTINCT FROM OLD.roles
       AND NOT public.is_admin() THEN
        NEW.roles := OLD.roles;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_protect_roles ON public.users;
CREATE TRIGGER users_protect_roles
    BEFORE INSERT OR UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_assignment();

DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users" ON public.users
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read all sessions" ON public.aurora_sessions;
CREATE POLICY "Admins can read all sessions" ON public.aurora_sessions
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read all responses" ON public.questionnaire_respondents;
CREATE POLICY "Admins can read all responses" ON public.questionnaire_respondents
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read all user messages" ON public.user_messages;
CREATE POLICY "Admins can read all user messages" ON public.user_messages
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all issues" ON public.issues;
CREATE POLICY "Admins can update all issues" ON public.issues
    FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
CREATE POLICY "Admins can read all orders" ON public.orders
    FOR SELECT USING (public.is_admin());

NOTIFY pgrst, 'reload schema';

-- ====================================
-- 3. 不具合報告のログ
-- ====================================
ALTER TABLE public.issues
    ADD COLUMN IF NOT EXISTS logs TEXT;

COMMENT ON COLUMN public.issues.logs IS 'Client log excerpt attached to the report';

-- ====================================
-- 4. 質問票の回答
-- ====================================
ALTER TABLE public.questionnaire_respondents
    ADD COLUMN IF NOT EXISTS response JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.questionnaire_respondents.response IS 'Accumulated answers for the questionnaire';

-- ====================================
-- 5. ファームウェアのコンポーネント配布
-- ====================================
ALTER TABLE public.firmware_releases
    ADD COLUMN IF NOT EXISTS bootloader_version INTEGER,
    ADD COLUMN IF NOT EXISTS bootloader_hex_path TEXT,
    ADD COLUMN IF NOT EXISTS bootloader_has_bootstrap BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS bootloader_notes TEXT,
    ADD COLUMN IF NOT EXISTS ble_version INTEGER,
    ADD COLUMN IF NOT EXISTS ble_hex_path TEXT,
    ADD COLUMN IF NOT EXISTS ble_notes TEXT;

COMMENT ON COLUMN public.firmware_releases.bootloader_version IS 'Bootloader version (major*10000 + minor*100 + build)';
COMMENT ON COLUMN public.firmware_releases.bootloader_has_bootstrap IS 'Flash bootloader and bootstrap together';
COMMENT ON COLUMN public.firmware_releases.ble_version IS 'BLE firmware version (major*10000 + minor*100 + build)';

ALTER TABLE public.firmware_releases
    ADD COLUMN IF NOT EXISTS min_app_version INTEGER;

COMMENT ON COLUMN public.firmware_releases.min_app_version IS 'Minimum app version allowed to apply this release (major*10000 + minor*100 + build)';

-- ====================================
-- 6. 不具合報告の添付ファイル
-- ====================================
CREATE TABLE IF NOT EXISTS public.issue_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    content_type TEXT,
    size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS issue_attachments_issue_id_idx
    ON public.issue_attachments (issue_id);

ALTER TABLE public.issue_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can create issue attachments"
    ON public.issue_attachments;
CREATE POLICY "Authenticated users can create issue attachments"
    ON public.issue_attachments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.issues i
            WHERE i.id = issue_id AND i.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Owners and admins can read issue attachments"
    ON public.issue_attachments;
CREATE POLICY "Owners and admins can read issue attachments"
    ON public.issue_attachments
    FOR SELECT
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1
            FROM public.issues i
            WHERE i.id = issue_id AND i.user_id = auth.uid()
        )
    );

INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-attachments', 'issue-attachments', FALSE)
ON CONFLICT (id) DO UPDATE SET public = FALSE;

DROP POLICY IF EXISTS "Issue attachment uploads" ON storage.objects;
CREATE POLICY "Issue attachment uploads"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'issue-attachments'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Issue attachment reads" ON storage.objects;
CREATE POLICY "Issue attachment reads"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'issue-attachments'
        AND (
            public.is_admin()
            OR (storage.foldername(name))[1] = auth.uid()::text
        )
    );

-- ====================================
-- 7. users の追加列（サインアップ・管理画面・国／郵便番号）
-- ====================================
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS newsletter BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS activated BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS transaction_origin TEXT;

UPDATE public.users u
SET
    email = a.email,
    activated = (a.email_confirmed_at IS NOT NULL OR a.last_sign_in_at IS NOT NULL)
FROM auth.users a
WHERE a.id = u.id;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, activated, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_user_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.users
    SET
        email = NEW.email,
        activated = (NEW.email_confirmed_at IS NOT NULL OR NEW.last_sign_in_at IS NOT NULL)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE OF email, email_confirmed_at, last_sign_in_at ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_updated();

-- サインアップ時のメタデータと、メール確認／最終ログイン状態を users へ反映する。
CREATE OR REPLACE FUNCTION public.get_or_create_user_profile(p_user_id UUID)
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_meta JSONB;
    v_email TEXT;
    v_email_confirmed_at TIMESTAMP WITH TIME ZONE;
    v_last_sign_in_at TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT raw_user_meta_data, email, email_confirmed_at, last_sign_in_at
    INTO v_meta, v_email, v_email_confirmed_at, v_last_sign_in_at
    FROM auth.users
    WHERE id = p_user_id;

    INSERT INTO public.users (
        id,
        email,
        activated,
        first_name,
        last_name,
        birthday,
        gender,
        newsletter,
        created_at,
        updated_at
    )
    VALUES (
        p_user_id,
        v_email,
        (v_email_confirmed_at IS NOT NULL OR v_last_sign_in_at IS NOT NULL),
        NULLIF(v_meta->>'first_name', ''),
        NULLIF(v_meta->>'last_name', ''),
        NULLIF(v_meta->>'birthday', ''),
        NULLIF(v_meta->>'gender', ''),
        COALESCE((v_meta->>'newsletter')::BOOLEAN, FALSE),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        activated = EXCLUDED.activated;

    RETURN QUERY SELECT * FROM public.users WHERE id = p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_or_create_user_profile(UUID) TO authenticated;

-- ====================================
-- 8. セッションの「新規」バッジ
--    列を新規追加したときだけ、既存セッションを既読にする。
-- ====================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'aurora_sessions'
          AND column_name = 'is_new'
    ) THEN
        ALTER TABLE public.aurora_sessions
            ADD COLUMN is_new BOOLEAN NOT NULL DEFAULT TRUE;
        UPDATE public.aurora_sessions SET is_new = FALSE;
    END IF;
END
$$;