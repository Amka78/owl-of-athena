//#region Imports
import { AuroraBluetooth } from "../AuroraBluetooth";
import type { AuroraBluetoothTransport } from "./types";
import { VirtualAuroraBluetooth } from "./VirtualAuroraBluetooth";

export type { AuroraBluetoothTransport } from "./types";

//#endregion

/**
 * 接続層の工場関数。
 *
 * EXPO_PUBLIC_VIRTUAL_AURORA=1 のときだけ仮想端末（VirtualAuroraBluetooth）を返し、
 * それ以外は従来どおりプラットフォーム解決された実機実装（ble-plx / noble / Web Bluetooth）を返す。
 * 環境変数はバンドル時に焼き込まれるため、本番ビルドに env を渡さなければ仮想コードは生成されない。
 */
export const createAuroraBluetooth = (): AuroraBluetoothTransport => {
    if (process.env.EXPO_PUBLIC_VIRTUAL_AURORA === "1") {
        return new VirtualAuroraBluetooth();
    }

    return new AuroraBluetooth();
};
