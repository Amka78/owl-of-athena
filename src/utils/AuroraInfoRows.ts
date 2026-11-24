import { Message, MessageKeys } from "../constants";
import type { AuroraOSInfo } from "../sdk/models";
import dayjs from "./dayjs";

export type AuroraInfoRow = {
    label: string;
    value: string;
};

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Aurora の OS 情報をラベル＋値の行へ変換する。AuroraInfoDialog と DeviceScreen で共用する。 */
export const buildAuroraInfoRows = (osInfo: AuroraOSInfo): Array<AuroraInfoRow> => [
    {
        label: Message.get(MessageKeys.aurora_info_firmware),
        value: osInfo.version.toString(),
    },
    {
        label: Message.get(MessageKeys.aurora_info_bootloader),
        value: osInfo.bootloaderVersion.toString(),
    },
    {
        label: Message.get(MessageKeys.aurora_info_ble),
        value: osInfo.bleVersion.toString(),
    },
    {
        label: Message.get(MessageKeys.aurora_info_bootstrap),
        value: osInfo.bootstrapVersion.toString(),
    },
    {
        label: Message.get(MessageKeys.aurora_info_battery),
        value: `${osInfo.batteryLevel}%`,
    },
    {
        label: Message.get(MessageKeys.aurora_info_build_date),
        value:
            typeof osInfo.buildDate === "number"
                ? dayjs(osInfo.buildDate).utc().format("YYYY-MM-DD HH:mm [UTC]")
                : "—",
    },
    {
        label: Message.get(MessageKeys.aurora_info_running_time),
        value: osInfo.runningTime || "—",
    },
    {
        label: Message.get(MessageKeys.aurora_info_storage),
        value: osInfo.bytesFree === undefined ? "—" : formatBytes(osInfo.bytesFree),
    },
];
