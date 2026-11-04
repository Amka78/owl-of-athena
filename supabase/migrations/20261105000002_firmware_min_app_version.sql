-- 更新を適用できる最低アプリバージョンを配布情報に持たせる。
ALTER TABLE public.firmware_releases
    ADD COLUMN IF NOT EXISTS min_app_version INTEGER;

COMMENT ON COLUMN public.firmware_releases.min_app_version IS 'Minimum app version allowed to apply this release (major*10000 + minor*100 + build)';