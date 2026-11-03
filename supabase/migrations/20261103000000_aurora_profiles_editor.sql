-- aurora_profiles をプロフィールエディタで使える形に拡張する。
-- 既存行は name を title にコピーし、content は空、options は空配列で埋める。

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