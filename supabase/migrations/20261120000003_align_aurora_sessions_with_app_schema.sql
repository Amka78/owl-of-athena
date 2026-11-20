-- aurora_sessions をアプリの構造化スキーマ（読み出し側 AuroraSessionJson 準拠）に揃える。
--
-- 背景: pushSessions は CSV セッションをそのまま INSERT していたが、PostgREST は
-- 未知カラムをリクエストごとに 1 件（アルファベット順）しか報告しないため、
-- app_platform → app_version → asleepAt → … と延々と PGRST204 で失敗し続けていた。
-- 真因は「アプリの書き込みは CSV 形式カラム・読み出しは構造化カラム」という
-- スキーマの不一致であり、書き込み側（SessionRestClient.create）を構造化 INSERT に
-- 修正したので、ここで読み出し側が必要とするカラムを揃える。
--
-- 対応済み（20261120000001 / 000002）: app_platform TEXT, app_version INTEGER,
-- session_txt TEXT, user_id DEFAULT auth.uid()

ALTER TABLE public.aurora_sessions
    ADD COLUMN IF NOT EXISTS aurora_profile_id UUID REFERENCES public.aurora_profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS aurora_profile_name TEXT,
    ADD COLUMN IF NOT EXISTS firmware_version INTEGER,
    ADD COLUMN IF NOT EXISTS sleep_onset BIGINT,
    ADD COLUMN IF NOT EXISTS session_duration BIGINT,
    ADD COLUMN IF NOT EXISTS sleep_duration BIGINT,
    ADD COLUMN IF NOT EXISTS no_signal_duration BIGINT,
    ADD COLUMN IF NOT EXISTS awake_duration BIGINT,
    ADD COLUMN IF NOT EXISTS light_duration BIGINT,
    ADD COLUMN IF NOT EXISTS deep_duration BIGINT,
    ADD COLUMN IF NOT EXISTS rem_duration BIGINT,
    ADD COLUMN IF NOT EXISTS sleep_score INTEGER,
    ADD COLUMN IF NOT EXISTS incomplete BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS starred BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS session_url TEXT;

-- 診断: 実行後にカラム一覧を確認する。
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'aurora_sessions'
-- ORDER BY ordinal_position;