-- セッション一覧の「新規」バッジ用。既存セッションは既読として扱い、
-- 以降に追加されたセッションだけを新規にする。
ALTER TABLE public.aurora_sessions
    ADD COLUMN IF NOT EXISTS is_new BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE public.aurora_sessions SET is_new = FALSE WHERE is_new = TRUE;