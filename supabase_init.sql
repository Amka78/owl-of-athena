-- Supabase初期化スクリプト: Owl of Athena
-- このスクリプトはSupabase SQL Editorで実行してください

-- ====================================
-- 既存テーブル・関数・トリガーの削除
-- (外部キー依存の逆順で削除)
-- ====================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.issues CASCADE;
DROP TABLE IF EXISTS public.user_messages CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.questionnaire_respondents CASCADE;
DROP TABLE IF EXISTS public.questionnaires CASCADE;
DROP TABLE IF EXISTS public.aurora_streams CASCADE;
DROP TABLE IF EXISTS public.aurora_sessions CASCADE;
DROP TABLE IF EXISTS public.aurora_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ====================================
-- 1. users テーブル
-- ====================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    birthday TEXT,
    gender TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ユーザープロフィール: 自分のデータのみ読み取り・更新可能
CREATE POLICY "Users can read their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ====================================
-- 2. aurora_profiles テーブル
-- ====================================
CREATE TABLE public.aurora_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    device_color TEXT,
    led_brightness INTEGER DEFAULT 50,
    vibration_strength INTEGER DEFAULT 50,
    sound_volume INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.aurora_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profiles" ON public.aurora_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profiles" ON public.aurora_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles" ON public.aurora_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles" ON public.aurora_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- 3. aurora_sessions テーブル
-- ====================================
CREATE TABLE public.aurora_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.aurora_profiles(id) ON DELETE SET NULL,
    session_at TIMESTAMP WITH TIME ZONE NOT NULL,
    asleep_at TIMESTAMP WITH TIME ZONE,
    awake_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    is_starred BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.aurora_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own sessions" ON public.aurora_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" ON public.aurora_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.aurora_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON public.aurora_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- 4. aurora_streams テーブル
-- ====================================
CREATE TABLE public.aurora_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aurora_session_id UUID NOT NULL REFERENCES public.aurora_sessions(id) ON DELETE CASCADE,
    stream_type TEXT NOT NULL,
    stream_data BYTEA NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.aurora_streams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read session data for their own sessions" ON public.aurora_streams
    FOR SELECT USING (
        aurora_session_id IN (
            SELECT id FROM public.aurora_sessions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create stream data for their own sessions" ON public.aurora_streams
    FOR INSERT WITH CHECK (
        aurora_session_id IN (
            SELECT id FROM public.aurora_sessions WHERE user_id = auth.uid()
        )
    );

-- ====================================
-- 5. questionnaires テーブル
-- ====================================
CREATE TABLE public.questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE,
    intro_title TEXT NOT NULL,
    intro_subtitle TEXT,
    intro_text TEXT,
    outro_title TEXT,
    outro_subtitle TEXT,
    outro_text TEXT,
    questions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;

-- アンケートは公開で読み取り可能
CREATE POLICY "Questionnaires are publicly readable" ON public.questionnaires
    FOR SELECT USING (TRUE);

-- ====================================
-- 6. questionnaire_respondents テーブル
-- ====================================
CREATE TABLE public.questionnaire_respondents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    current_question_index INTEGER DEFAULT 0,
    current_question JSONB,
    next_question_id UUID,
    previous_question_id UUID,
    completed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.questionnaire_respondents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own responses" ON public.questionnaire_respondents
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create responses" ON public.questionnaire_respondents
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own responses" ON public.questionnaire_respondents
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- ====================================
-- 7. user_messages テーブル
-- ====================================
CREATE TABLE public.user_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    questionnaire_id UUID REFERENCES public.questionnaires(id) ON DELETE SET NULL,
    questionnaire_respondent_id UUID REFERENCES public.questionnaire_respondents(id) ON DELETE SET NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages" ON public.user_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert messages for users" ON public.user_messages
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update (mark as read) their own messages" ON public.user_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- ====================================
-- 8. messages テーブル (管理用)
-- ====================================
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    platform TEXT,
    read_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- メッセージは管理者のみ作成可能
-- 認証ユーザーは読み取り可能（後で管理ロール検証が必要）
CREATE POLICY "Authenticated users can read messages" ON public.messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- ====================================
-- 9. issues テーブル
-- ====================================
CREATE TABLE public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    reproduce_steps TEXT,
    critical BOOLEAN DEFAULT FALSE,
    anonymous BOOLEAN DEFAULT FALSE,
    platform TEXT,
    version TEXT,
    status TEXT DEFAULT 'open',
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can create issues" ON public.issues
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can read all issues" ON public.issues
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own issues" ON public.issues
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- ====================================
-- 10. orders テーブル
-- ====================================
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    billing_name TEXT,
    billing_email TEXT,
    amount_total NUMERIC(10, 2),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- ====================================
-- 11. auth.users 挿入トリガー
--     新規サインアップ時に public.users を自動作成
-- ====================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- 既存のトリガーがあれば削除してから再作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ====================================
-- 12. get_or_create_user_profile 関数
--     RLSをバイパスしてユーザープロフィールを取得/作成
--     (既存ユーザーや認証直後のタイミング問題を解消)
-- ====================================
CREATE OR REPLACE FUNCTION public.get_or_create_user_profile(p_user_id UUID)
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 行がなければ作成
    INSERT INTO public.users (id, created_at, updated_at)
    VALUES (p_user_id, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- 行を返す
    RETURN QUERY SELECT * FROM public.users WHERE id = p_user_id;
END;
$$;

-- 認証済みユーザーのみRPC呼び出し可能
GRANT EXECUTE ON FUNCTION public.get_or_create_user_profile(UUID) TO authenticated;

-- ====================================
-- 13. 既存 auth.users のバックフィル
--     (トリガー追加前に登録されたユーザーを public.users に登録)
-- ====================================
INSERT INTO public.users (id, created_at, updated_at)
SELECT id, created_at, NOW()
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ====================================
-- インデックス作成
-- ====================================
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX idx_aurora_profiles_user_id ON public.aurora_profiles(user_id);
CREATE INDEX idx_aurora_sessions_user_id ON public.aurora_sessions(user_id);
CREATE INDEX idx_aurora_sessions_session_at ON public.aurora_sessions(session_at DESC);
CREATE INDEX idx_aurora_streams_session_id ON public.aurora_streams(aurora_session_id);
CREATE INDEX idx_questionnaire_respondents_questionnaire ON public.questionnaire_respondents(questionnaire_id);
CREATE INDEX idx_questionnaire_respondents_user ON public.questionnaire_respondents(user_id);
CREATE INDEX idx_user_messages_user_id ON public.user_messages(user_id);
CREATE INDEX idx_user_messages_created_at ON public.user_messages(created_at DESC);
CREATE INDEX idx_issues_user_id ON public.issues(user_id);
CREATE INDEX idx_issues_created_at ON public.issues(created_at DESC);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- ====================================
-- 実行完了メッセージ
-- ====================================
-- このスクリプトをSupabase SQL Editorで実行してください
-- すべてのテーブルとポリシーが初期化されます
