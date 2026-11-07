-- サインアップ時の氏名・生年月日・性別・ニュースレターをプロフィールへ引き継ぐ。
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS newsletter BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE FUNCTION public.get_or_create_user_profile(p_user_id UUID)
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_meta JSONB;
BEGIN
    SELECT raw_user_meta_data INTO v_meta
    FROM auth.users
    WHERE id = p_user_id;

    -- 行がなければ auth のメタデータから作成
    INSERT INTO public.users (
        id,
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
        NULLIF(v_meta->>'first_name', ''),
        NULLIF(v_meta->>'last_name', ''),
        NULLIF(v_meta->>'birthday', ''),
        NULLIF(v_meta->>'gender', ''),
        COALESCE((v_meta->>'newsletter')::BOOLEAN, FALSE),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN QUERY SELECT * FROM public.users WHERE id = p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_or_create_user_profile(UUID) TO authenticated;