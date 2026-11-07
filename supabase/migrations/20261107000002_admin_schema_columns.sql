-- 管理画面で参照する users.email / users.activated と orders.transaction_origin を追加する。
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS activated BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS transaction_origin TEXT;

-- auth.users から既存ユーザーをバックフィル
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