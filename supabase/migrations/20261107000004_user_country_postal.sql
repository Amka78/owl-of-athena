-- プロフィールの国コード（ISO 3166-1 alpha-2）と郵便番号。
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS postal_code TEXT;