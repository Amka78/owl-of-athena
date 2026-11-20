-- aurora_sessions に app_version / session_txt（および万一未適用時の app_platform）を追加する。
--
-- アプリ（RN・iOS 共通）はセッション同期時に app_version / app_platform / session_txt を
-- 送信するが、PostgREST は未知カラムを 1 件ずつしか報告しないため、
-- app_platform（20261120000001 で追加）の後に app_version の PGRST204 が顕在化した。
-- PGRST204 "Could not find the 'app_version' column of 'aurora_sessions' in the schema cache"
--
-- app_version: RN は aurora 本体のファームウェア版（数値）、iOS は数字文字列を送る。
--              INTEGER なら PostgREST が両方をキャストできる。
-- session_txt: セッション本文（session.txt の内容）。iOS 版も同フィールドを送信する正規項目。

ALTER TABLE public.aurora_sessions
    ADD COLUMN IF NOT EXISTS app_platform TEXT,
    ADD COLUMN IF NOT EXISTS app_version INTEGER,
    ADD COLUMN IF NOT EXISTS session_txt TEXT;

COMMENT ON COLUMN public.aurora_sessions.app_version
    IS 'App version that created the session (numeric, e.g. 104)';
COMMENT ON COLUMN public.aurora_sessions.session_txt
    IS 'Raw session text (session.txt content)';

-- INSERT は user_id を送らない（app 側が auth.uid() の暗黙利用を前提）ため、
-- NOT NULL / RLS（auth.uid() = user_id）で失敗する。DEFAULT を auth.uid() にして回避する。
-- 冪等なのでカラム修正と同時に実行してよい。
ALTER TABLE public.aurora_sessions
    ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 診断: 実行後にカラム一覧を確認する。
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'aurora_sessions'
-- ORDER BY ordinal_position;