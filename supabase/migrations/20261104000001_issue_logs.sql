-- 不具合報告にクライアント側のログ抜粋を添付できるようにする。
ALTER TABLE public.issues
    ADD COLUMN IF NOT EXISTS logs TEXT;

COMMENT ON COLUMN public.issues.logs IS 'Client log excerpt attached to the report';