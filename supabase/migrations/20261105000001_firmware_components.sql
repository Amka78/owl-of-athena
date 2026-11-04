-- アプリ本体に加えてブートローダー / BLE ファームウェアも配布できるようにする。
ALTER TABLE public.firmware_releases
    ADD COLUMN IF NOT EXISTS bootloader_version INTEGER,
    ADD COLUMN IF NOT EXISTS bootloader_hex_path TEXT,
    ADD COLUMN IF NOT EXISTS bootloader_has_bootstrap BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS bootloader_notes TEXT,
    ADD COLUMN IF NOT EXISTS ble_version INTEGER,
    ADD COLUMN IF NOT EXISTS ble_hex_path TEXT,
    ADD COLUMN IF NOT EXISTS ble_notes TEXT;

COMMENT ON COLUMN public.firmware_releases.bootloader_version IS 'Bootloader version (major*10000 + minor*100 + build)';
COMMENT ON COLUMN public.firmware_releases.bootloader_has_bootstrap IS 'Flash bootloader and bootstrap together';
COMMENT ON COLUMN public.firmware_releases.ble_version IS 'BLE firmware version (major*10000 + minor*100 + build)';