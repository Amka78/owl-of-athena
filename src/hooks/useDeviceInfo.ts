import { useEffect, useState } from "react";

import { AuroraManagerEventList, AuroraManagerInstance } from "../managers";
import type { AuroraOSInfo } from "../sdk/models";

export type DeviceInfoManager = {
    getOSInfo: () => AuroraOSInfo | undefined;
    on: (event: string, listener: () => void) => unknown;
    off: (event: string, listener: () => void) => unknown;
};

/** 接続中端末の OS 情報。接続・バッテリー変化イベントで再取得する。 */
export const useDeviceInfo = (manager: DeviceInfoManager = AuroraManagerInstance) => {
    const [osInfo, setOSInfo] = useState<AuroraOSInfo | undefined>(manager.getOSInfo());

    useEffect(() => {
        const refresh = (): void => {
            setOSInfo(manager.getOSInfo());
        };

        manager.on(AuroraManagerEventList.onConnectionChange, refresh);
        manager.on(AuroraManagerEventList.onBatteryChange, refresh);
        refresh();

        return (): void => {
            manager.off(AuroraManagerEventList.onConnectionChange, refresh);
            manager.off(AuroraManagerEventList.onBatteryChange, refresh);
        };
    }, [manager]);

    return osInfo;
};
