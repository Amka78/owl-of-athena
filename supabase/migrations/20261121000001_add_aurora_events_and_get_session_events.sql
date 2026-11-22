-- セッション詳細（グラフ）用に aurora_events テーブルと get_session_events RPC を追加する。
--
-- 背景: Electron 版はサーバが session_text を解析して events を保存し、詳細画面の
-- グラフ（睡眠ステージ・タイムライン等）はサーバ側のイベント集計で描画していた。
-- モバイル版も同期時にイベントを保存することで、クロスデバイスでもグラフが
-- 表示できるようになる（端末フォールバック不要）。
-- アプリはクライアント側で bin 集計するため、RPC はイベント行をそのまま返し、
-- bins / group_by 引数は使わない（互換のためシグネチャに残す）。

-- 1. aurora_events テーブル
CREATE TABLE IF NOT EXISTS public.aurora_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    aurora_session_id UUID NOT NULL REFERENCES public.aurora_sessions(id) ON DELETE CASCADE,
    aurora_event_id INTEGER NOT NULL,
    event_at BIGINT NOT NULL, -- epoch ms（端末 CSV の date と同じ意味）
    "time" BIGINT NOT NULL,   -- セッション開始からの ms
    flags INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_aurora_events_session_event
    ON public.aurora_events (aurora_session_id, aurora_event_id);

ALTER TABLE public.aurora_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read events of their own sessions" ON public.aurora_events;
CREATE POLICY "Users can read events of their own sessions" ON public.aurora_events
    FOR SELECT USING (
        aurora_session_id IN (
            SELECT id FROM public.aurora_sessions WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create events of their own sessions" ON public.aurora_events;
CREATE POLICY "Users can create events of their own sessions" ON public.aurora_events
    FOR INSERT WITH CHECK (
        aurora_session_id IN (
            SELECT id FROM public.aurora_sessions WHERE user_id = auth.uid()
        )
    );

-- 2. get_session_events RPC
-- 旧バックエンドの /aurora-sessions/:id/events に相当。イベント行を返し、
-- クライアント側（Chart）が bins / group_by で集計する。
DROP FUNCTION IF EXISTS public.get_session_events(UUID, INTEGER, TEXT, TEXT, INTEGER);
CREATE OR REPLACE FUNCTION public.get_session_events(
    p_session_id UUID,
    p_aurora_event_id INTEGER,
    p_bins TEXT,
    p_group_by TEXT,
    p_flags INTEGER
)
RETURNS TABLE (
    id BIGINT,
    aurora_event_id INTEGER,
    event_at BIGINT,
    "date" BIGINT,
    "time" BIGINT,
    flags INTEGER,
    bins JSONB
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    SELECT e.id,
           e.aurora_event_id,
           e.event_at,
           e.event_at AS "date",
           e."time" AS "time",
           e.flags,
           NULL::jsonb AS bins
    FROM public.aurora_events e
    JOIN public.aurora_sessions s ON s.id = e.aurora_session_id
    WHERE e.aurora_session_id = p_session_id
      AND e.aurora_event_id = p_aurora_event_id
      AND (p_flags IS NULL OR e.flags = p_flags)
      AND s.user_id = auth.uid()
    ORDER BY e."time";
$$;

GRANT EXECUTE ON FUNCTION public.get_session_events(UUID, INTEGER, TEXT, TEXT, INTEGER)
    TO authenticated;