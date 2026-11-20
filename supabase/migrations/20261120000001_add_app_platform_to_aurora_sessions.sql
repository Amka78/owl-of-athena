-- aurora_sessions に app_platform カラムを追加する。
--
-- アプリはセッション同期時に app_platform（iOS 版と同様）を送信するが、DB に
-- カラムが無く POSTGREST が PGRST204 "Could not find the 'app_platform' column"
-- で全セッションの同期を失敗させていた。カラム追加が正しい対処
-- （フィールド自体は iOS 版 RestDataManager.swift も送信する正規項目）。

ALTER TABLE public.aurora_sessions
    ADD COLUMN IF NOT EXISTS app_platform TEXT;

COMMENT ON COLUMN public.aurora_sessions.app_platform
    IS 'App platform that created the session (ios / android / web)';

-- 追加後に INSERT が user_id 周り（NOT NULL / RLS）で失敗する場合の対処例:
--   ALTER TABLE public.aurora_sessions
--       ALTER COLUMN user_id SET DEFAULT auth.uid();