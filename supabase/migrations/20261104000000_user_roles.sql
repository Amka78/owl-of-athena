-- ユーザーロールを users.roles (JSONB) で保持し、管理画面の RLS を許可する。
-- ロールの付与は service_role（SQL Editor / 管理スクリプト）から行う。
-- 例:
--   UPDATE public.users
--   SET roles = '[{"id":"admin","slug":"admin","title":"Admin"}]'::jsonb
--   WHERE id = '<user-uuid>';

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

-- 一般ユーザーが自分の roles を書き換えられないようにする。
-- service_role（auth.uid() が NULL）からの更新は許可する。
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

-- 管理画面が全ユーザーのデータを読めるようにする。
-- 既存の「自分のデータのみ」ポリシーとは OR で評価される。
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